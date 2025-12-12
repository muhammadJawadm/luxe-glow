import React, { useEffect, useState } from "react";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../services/productServices";

const Products = () => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts();
        setProductData(response);
        setFilteredProducts(response);
        console.log("Fetched products data:", response);
      } catch (error) {
        console.error("Error fetching products data:", error);
        alert("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProductsData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(productData);
    } else {
      const filtered = productData.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brands?.name && product.brands.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.categories?.name && product.categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, productData]);



  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      // Update UI
      const updatedProducts = productData.filter(p => p.id !== productToDelete.id);
      setProductData(updatedProducts);
      setFilteredProducts(updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brands?.name && product.brands.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.categories?.name && product.categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };


  function formatTime(timestamp) {
    const date = new Date(timestamp); // parse the timestamp
    // Options for formatting
    const options = {
      year: 'numeric',
      month: 'short', // Dec
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: true, // 12-hour format
    };
    return date.toLocaleString('en-PK', options); // Pakistan time format
  }
  return (
    <div>
      <Header header={"Manage Products"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white "
              placeholder="Search products..."
            />
          </div>

        </div>

        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">name</th>
                  <th className="px-6 py-3 font-medium">description</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">created_at</th>
                  <th className="px-6 py-3 font-medium">stock quantity</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? "No products found matching your search." : "No products available."}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-gray-50/80 transition-colors duration-100"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.product_images?.[0]?.image_url || "https://via.placeholder.com/150"}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                          />
                          <h3 className="font-medium text-gray-800">
                            {item.name}
                          </h3>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        <div className="max-w-xs truncate">{item.description}</div>
                      </td>
                      <td className="px-6 py-3 text-gray-600">${item.price}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <span className="ml-2 text-sm text-gray-600">
                            ({item.rating || 0})
                          </span>
                          {Array.from({ length: 5 }, (_, i) =>
                            i < Math.floor(item.rating || 0) ? (
                              <AiFillStar key={i} />
                            ) : (
                              <AiOutlineStar key={i} />
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {formatTime(item.created_at)}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {item.stock_level}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex space-x-1">
                          <Link
                            to={`/product/${item.id}`}
                            className="p-2 text-gray-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Details"
                          >
                            <FiEye />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        entityType={"Product"}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default Products;
