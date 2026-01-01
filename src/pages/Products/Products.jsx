import React, { useEffect, useState } from "react";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { FiEye, FiSearch, FiTrash2, FiEdit2 } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../../services/productServices";
import { BiError } from "react-icons/bi";
import Pagination from "../../components/Pagination";

const Products = () => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts(currentPage, itemsPerPage);
        setProductData(response.data || []);
        setFilteredProducts(response.data || []);
        setTotalItems(response.count || 0);
        console.log("Fetched products data:", response);
      } catch (error) {
        console.error("Error fetching products data:", error);
        alert("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProductsData();
  }, [currentPage]);

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

        {/* Low Stock Alert */}
        {!loading && productData.filter(p => p.stock_level < 5).length > 0 && (
          <div className="mb-6 rounded-lg bg-red-50 border-2 border-red-200 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-red-800">
                  Low Stock Alert
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    {productData.filter(p => p.stock_level < 5).length} product(s) have low stock (less than 5 items):
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {productData.filter(p => p.stock_level < 5).slice(0, 5).map(product => (
                      <li key={product.id}>
                        <strong>{product.name}</strong> - Only {product.stock_level} left in stock
                      </li>
                    ))}
                    {productData.filter(p => p.stock_level < 5).length > 5 && (
                      <li className="text-red-600 font-medium">
                        ...and {productData.filter(p => p.stock_level < 5).length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Name</th>
                  {/* <th className="px-6 py-3.5 font-medium">Description</th> */}
                  <th className="px-6 py-3.5 font-medium">Price</th>
                  <th className="px-6 py-3.5 font-medium">Rating</th>
                  <th className="px-6 py-3.5 font-medium">Created At</th>
                  <th className="px-6 py-3.5 font-medium">Stock Quantity</th>
                  <th className="px-6 py-3.5 font-medium">Actions</th>
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
                      <td className="px-6 py-3 text-gray-600">MVR {item.price}</td>
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
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          {item.stock_level < 5 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
                              <BiError />
                              {item.stock_level} left
                            </span>
                          ) : item.stock_level < 10 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                              {item.stock_level}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                              {item.stock_level}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex space-x-2">
                          <Link
                            to={`/product/${item.id}`}
                            className="p-2 text-gray-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="View Details"
                          >
                            <FiEye className="text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <FiTrash2 className="text-lg" />
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

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Products;
