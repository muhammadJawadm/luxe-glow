import React, { useEffect, useState } from "react";
import { fetchAllCarts, deleteCartItem, getCartStatistics } from "../../services/cartService";
import Header from "../../layouts/partials/header";
import { FiSearch, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";

const Cart = () => {
    const [carts, setCarts] = useState([]);
    const [filteredCarts, setFilteredCarts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        totalItems: 0,
        totalProducts: 0,
        estimatedValue: 0
    });

    useEffect(() => {
        loadCarts();
        loadStatistics();
    }, []);

    useEffect(() => {
        filterCarts();
    }, [searchQuery, carts]);

    const loadCarts = async () => {
        setIsLoading(true);
        const data = await fetchAllCarts();
        console.log("Cart Data is ", data);
        setCarts(data);
        setFilteredCarts(data);
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
            const result = await deleteCartItem(cartId);
            if (result.success) {
                loadCarts();
                loadStatistics();
            }
        }
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
        <div className="min-h-screen bg-gray-50">
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
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Added On
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                        {cart.users?.avatar ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={cart.users.avatar}
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
                                                        {cart.products?.image ? (
                                                            <img
                                                                className="h-16 w-16 rounded object-cover"
                                                                src={cart.products.image}
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
                                                <button
                                                    onClick={() => handleDeleteCart(cart.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Delete cart item"
                                                >
                                                    <FiTrash2 className="text-lg" />
                                                </button>
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
        </div>
    );
};

export default Cart;
