import React, { useEffect, useState } from "react";
import { fetchAllCarts, deleteCartItem, getCartStatistics, fetchCartById } from "../../services/cartService";
import Header from "../../layouts/partials/header";
import { FiSearch, FiTrash2, FiShoppingCart, FiEye, FiX } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import Pagination from "../../components/Pagination";

const Cart = () => {
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCart, setSelectedCart] = useState(null);
    const [statistics, setStatistics] = useState({
        totalItems: 0,
        totalProducts: 0,
        estimatedValue: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        loadCarts();
        loadStatistics();
    }, [currentPage]);

    useEffect(() => {
        filterCarts();
    }, [searchQuery, carts]);

    const loadCarts = async () => {
        setIsLoading(true);
        const data = await fetchAllCarts(currentPage, itemsPerPage);
        console.log("Cart Data is ", data);
        setCarts(data.data || []);
        setFilteredCarts(data.data || []);
        setTotalItems(data.count || 0);
        setIsLoading(false);
    };

    const loadStatistics = async () => {
        const stats = await getCartStatistics();
        setStatistics(stats);
    };

    const filterCarts = () => {
        if (!searchQuery.trim()) {
            setFilteredCarts(carts);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = carts.filter((cart) => {
            const userName = cart.users?.name?.toLowerCase() || "";
            const userEmail = cart.users?.email?.toLowerCase() || "";
            const productName = cart.products?.name?.toLowerCase() || "";
            return userName.includes(query) || userEmail.includes(query) || productName.includes(query);
        });

        setFilteredCarts(filtered);
    };

    const handleDeleteCart = async (cartId) => {
        if (window.confirm("Are you sure you want to delete this cart item?")) {
            try {
                await deleteCartItem(cartId);
                await loadCarts();
                await loadStatistics();
            } catch (error) {
                console.error("Error deleting cart item:", error);
                alert("Failed to delete cart item. Please try again.");
            }
        }
    };

    const handleViewCart = async (cartId) => {
        const cartData = await fetchCartById(cartId);
        setSelectedCart(cartData);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedCart(null);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-MV', {
            style: 'currency',
            currency: 'MVR'
        }).format(price || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen">
            <Header header="Cart Management" link="/cart" />

            <div className="px-4 sm:px-8 py-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Cart Items</p>
                                <p className="text-2xl font-bold text-gray-800">{statistics.totalItems}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <BsCart3 className="text-blue-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Products</p>
                                <p className="text-2xl font-bold text-gray-800">{statistics.totalProducts}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FiShoppingCart className="text-green-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Estimated Value</p>
                                <p className="text-2xl font-bold text-gray-800">{formatPrice(statistics.estimatedValue)}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <span className="text-purple-600 text-xl font-bold">MVR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by user name, email, or product name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Cart Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredCarts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <BsCart3 className="text-gray-300 text-6xl mb-4" />
                            <p className="text-gray-500 text-lg">
                                {searchQuery ? "No cart items found matching your search" : "No cart items found"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Added On
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCarts.map((cart) => (
                                        <tr key={cart.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {cart.users?.profile ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={cart.users.profile}
                                                                alt={cart.users.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500 font-medium">
                                                                    {cart.users?.name?.charAt(0) || cart.users?.email?.charAt(0) || "?"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {cart.users?.name || "Unknown User"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {cart.users?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-16 w-16">
                                                        {cart.products?.product_images?.[0]?.image_url ? (
                                                            <img
                                                                className="h-16 w-16 rounded object-cover"
                                                                src={cart.products.product_images?.[0]?.image_url}
                                                                alt={cart.products.name}
                                                            />
                                                        ) : (
                                                            <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center">
                                                                <FiShoppingCart className="text-gray-400 text-2xl" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {cart.products?.name || "Unknown Product"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Stock: {cart.products?.stock || 0}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {cart.products?.categories?.name || "Uncategorized"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatPrice(cart.products?.price)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className="px-3 py-1 bg-gray-100 rounded-full">
                                                    {cart.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatPrice((cart.products?.price || 0) * cart.quantity)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(cart.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewCart(cart.id)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                                                        title="View cart details"
                                                    >
                                                        <FiEye className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCart(cart.id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                        title="Delete cart item"
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
                    )}
                </div>

                {/* Results Info */}
                {!isLoading && filteredCarts.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Showing {filteredCarts.length} of {carts.length} cart items
                    </div>
                )}
            </div>

            {/* View Cart Details Modal */}
            {isViewModalOpen && selectedCart && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
                            onClick={handleCloseModal}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl leading-6 font-bold text-gray-900">
                                        Cart Details
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <FiX className="text-2xl" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* User Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Customer Information</h4>
                                        <div className="flex items-center space-x-4">
                                            {selectedCart.users?.profile ? (
                                                <img
                                                    src={selectedCart.users.profile}
                                                    alt={selectedCart.users.name}
                                                    className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-600 text-xl font-bold">
                                                        {selectedCart.users?.name?.charAt(0) || selectedCart.users?.email?.charAt(0) || "?"}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {selectedCart.users?.name || "Unknown User"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedCart.users?.email || "No email"}
                                                </p>
                                                {selectedCart.users?.phone && (
                                                    <p className="text-sm text-gray-600">
                                                        {selectedCart.users.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Product Information</h4>
                                        <div className="flex space-x-4">
                                            {selectedCart.products?.product_images?.[0]?.image_url ? (
                                                <img
                                                    src={selectedCart.products.product_images[0].image_url}
                                                    alt={selectedCart.products.name}
                                                    className="h-24 w-24 rounded-lg object-cover ring-2 ring-gray-200"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-lg bg-gray-300 flex items-center justify-center">
                                                    <FiShoppingCart className="text-gray-500 text-3xl" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {selectedCart.products?.name || "Unknown Product"}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Category: <span className="font-medium">{selectedCart.products?.categories?.name || "Uncategorized"}</span>
                                                </p>
                                                {selectedCart.products?.description && (
                                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                        {selectedCart.products.description}
                                                    </p>
                                                )}
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Stock Available: <span className="font-medium">{selectedCart.products?.stock || 0}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing Details */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Pricing Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Unit Price:</span>
                                                <span className="font-semibold text-gray-900">{formatPrice(selectedCart.products?.price || 0)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Quantity:</span>
                                                <span className="font-semibold text-gray-900">{selectedCart.quantity}</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-2 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-gray-900">Total:</span>
                                                    <span className="text-lg font-bold text-primary">
                                                        {formatPrice((selectedCart.products?.price || 0) * selectedCart.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Added On</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                {formatDate(selectedCart.created_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Cart ID</p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                #{selectedCart.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default Cart;
