import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit, FiSearch, FiTrash2, FiPackage, FiShoppingCart, FiCalendar } from "react-icons/fi";
import DeleteModal from "../../components/Modals/DeleteModal";
import OrderedProductModal from "../../components/Modals/OrderedProductModal";
import {
    fetchOrderedProducts,
    createOrderedProduct,
    updateOrderedProduct,
    deleteOrderedProduct,
} from "../../services/orderedProductsServices";
import Pagination from "../../components/Pagination";

const OrderedProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderedProduct, setSelectedOrderedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [orderedProductsData, setOrderedProductsData] = useState([]);
    const [filteredOrderedProducts, setFilteredOrderedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderedProductToDelete, setOrderedProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchOrderedProductsData();
    }, [currentPage]);

    const fetchOrderedProductsData = async () => {
        try {
            setLoading(true);
            const response = await fetchOrderedProducts(currentPage, itemsPerPage);
            console.log("Fetched ordered products:", response);
            setOrderedProductsData(response.data || []);
            setFilteredOrderedProducts(response.data || []);
            setTotalItems(response.count || 0);
            console.log("Fetched ordered products:", response);
        } catch (error) {
            console.error("Error fetching ordered products data:", error);
            alert("Failed to load ordered products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredOrderedProducts(orderedProductsData);
        } else {
            const filtered = orderedProductsData.filter(
                (item) =>
                    item.products?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.order_id?.toString().includes(searchQuery)
            );
            setFilteredOrderedProducts(filtered);
        }
    }, [searchQuery, orderedProductsData]);

    const handleEditClick = (orderedProduct) => {
        setSelectedOrderedProduct(orderedProduct);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (orderedProduct) => {
        setOrderedProductToDelete(orderedProduct);
        setIsDeleteModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedOrderedProduct(null);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (selectedOrderedProduct) {
                // Update existing ordered product
                await updateOrderedProduct(selectedOrderedProduct.id, formData);
                alert("Ordered product updated successfully!");
            } else {
                // Create new ordered product
                await createOrderedProduct(formData);
                alert("Ordered product added successfully!");
            }
            await fetchOrderedProductsData();
            setIsModalOpen(false);
            setSelectedOrderedProduct(null);
        } catch (error) {
            console.error("Error saving ordered product:", error);
            throw error;
        }
    };

    const handleDeleteConfirm = async () => {
        if (!orderedProductToDelete) return;

        try {
            await deleteOrderedProduct(orderedProductToDelete.id);
            await fetchOrderedProductsData();
            setIsDeleteModalOpen(false);
            setOrderedProductToDelete(null);
            alert("Ordered product deleted successfully!");
        } catch (error) {
            console.error("Error deleting ordered product:", error);
            alert("Failed to delete ordered product. Please try again.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div>
            <Header header={"Ordered Products Management"} />
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
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Search by product name or order ID..."
                        />
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <FiPackage className="text-lg" />
                        Add Ordered Product
                    </button>
                </div>

                <div className="my-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500 text-lg">Loading ordered products...</div>
                        </div>
                    ) : filteredOrderedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
                            <FiPackage className="text-6xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">
                                {searchQuery
                                    ? "No ordered products found matching your search."
                                    : "No ordered products available yet."}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleAddNew}
                                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Add Your First Ordered Product
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                                                Order ID
                                            </th>
                                            <th className="px-2 py-4 text-left text-xs font-semibold uppercase">
                                                Product
                                            </th>
                                            <th className="px-2 py-4 text-left text-xs font-semibold uppercase">
                                                Quantity
                                            </th>
                                            <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Subtotal
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrderedProducts.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <FiShoppingCart className="text-primary" />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            #{item.order_id}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-4">
                                                    <div className="text-sm font-medium text-gray-900 w-40">
                                                        {item.products?.name || "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                                                        {item.quantity}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-primary">
                                                        MVR {((item.products?.price || 0) * item.quantity).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {item.orders?.users?.name || "N/A"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.orders?.users?.email || ""}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.orders?.status === "completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : item.orders?.status === "pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {item.orders?.status || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <FiCalendar className="text-gray-400" />
                                                        {formatDate(item.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit className="text-lg" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item)}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 className="text-lg" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ordered Product Modal */}
            <OrderedProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedOrderedProduct(null);
                }}
                orderedProduct={selectedOrderedProduct}
                onSave={handleSave}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setOrderedProductToDelete(null);
                }}
                onDelete={handleDeleteConfirm}
                entityType={"Ordered Product"}
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

export default OrderedProducts;
