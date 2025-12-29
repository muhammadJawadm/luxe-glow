import { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import DeleteModal from "../../components/Modals/DeleteModal";
import {
  fetchDiscounts,
  deleteDiscount,
  toggleDiscountStatus,
  createDiscount,
  updateDiscount,
  calculateDiscountedPrice
} from "../../services/discountServices";
import { fetchProducts } from "../../services/productServices";

const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    discountPercentage: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [discountsData, productsData] = await Promise.all([
      fetchDiscounts(),
      fetchProducts()
    ]);
    setDiscounts(discountsData);
    setProducts(productsData);
    setLoading(false);
  };

  const handleAddDiscount = () => {
    setSelectedDiscount(null);
    setFormData({
      productId: '',
      discountPercentage: '',
      endDate: ''
    });
    setIsModalOpen(true);
  };

  const handleEditDiscount = (discount) => {
    setSelectedDiscount(discount);
    setFormData({
      productId: discount.product_id,
      discountPercentage: discount.discount_percentage,
      endDate: discount.end_date ? discount.end_date.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteDiscount = (discount) => {
    setSelectedDiscount(discount);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDiscount) return;

    const result = await deleteDiscount(selectedDiscount.id);
    if (result.success) {
      await loadData();
      setIsDeleteModalOpen(false);
      setSelectedDiscount(null);
    } else {
      alert("Failed to delete discount: " + result.error);
    }
  };

  const handleToggleStatus = async (discountId, currentStatus) => {
    const result = await toggleDiscountStatus(discountId, !currentStatus);
    if (result.success) {
      await loadData();
    } else {
      alert("Failed to toggle status: " + result.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const discountPercentage = parseFloat(formData.discountPercentage);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
      alert("Please enter a valid discount percentage (0-100)");
      return;
    }

    let result;
    const endDate = formData.endDate ? new Date(formData.endDate).toISOString() : null;

    if (selectedDiscount) {
      // Update existing
      result = await updateDiscount(selectedDiscount.id, discountPercentage, endDate);
    } else {
      // Create new
      if (!formData.productId) {
        alert("Please select a product");
        return;
      }
      result = await createDiscount(formData.productId, discountPercentage, endDate);
    }

    if (result.success) {
      await loadData();
      setIsModalOpen(false);
      setSelectedDiscount(null);
    } else {
      alert("Failed to save discount: " + result.error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  // Get products that don't have active discounts
  const availableProducts = products.filter(product =>
    !discounts.some(discount => discount.product_id === product.id)
  );

  return (
    <div>
      <Header header={"Product Discounts"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Manage Product Discounts</h2>
              <p className="text-sm text-gray-500 mt-1">Add discount percentages to products</p>
            </div>
            <button
              onClick={handleAddDiscount}
              className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              <FiPlus className="mr-2" />
              Add Discount
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : discounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No product discounts yet</p>
                <p className="text-sm">Create your first discount to get started!</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Discounted Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {discounts.map((discount) => (
                    <tr key={discount.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {discount.products?.image && (
                            <img
                              src={discount.products.image}
                              alt={discount.products?.name}
                              className="w-12 h-12 rounded object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {discount.products?.name || 'Unknown Product'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        MVR {Number(discount.products?.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                          {discount.discount_percentage}% OFF
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-primary">
                          MVR {calculateDiscountedPrice(
                            discount.products?.price || 0,
                            discount.discount_percentage
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Save MVR {(
                            (discount.products?.price || 0) * discount.discount_percentage / 100
                          ).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(discount.end_date)}
                        {isExpired(discount.end_date) && (
                          <div className="text-xs text-red-500 mt-1">Expired</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          onClick={() => handleToggleStatus(discount.id, discount.is_active)}
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${discount.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {discount.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditDiscount(discount)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(discount)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {selectedDiscount ? "Edit Discount" : "Add New Discount"}
                  </h3>

                  <div className="space-y-4">
                    {/* Product Selection - Only for new discounts */}
                    {!selectedDiscount && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Product
                        </label>
                        <select
                          value={formData.productId}
                          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                          className="w-full border border-gray-300 rounded-md p-2"
                          required
                        >
                          <option value="">Choose a product...</option>
                          {availableProducts.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - MVR {product.price}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Discount Percentage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Percentage
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Enter percentage (0-100)"
                        required
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {selectedDiscount ? "Update" : "Add"} Discount
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDiscount(null);
        }}
        entityType={"Discount"}
        onDelete={confirmDelete}
      />
    </div>
  );
};

export default Settings;
