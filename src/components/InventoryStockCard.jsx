import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productServices";
import { FiPackage, FiAlertTriangle, FiCheckCircle, FiTrendingDown } from "react-icons/fi";

const InventoryStockCard = () => {
    const [loading, setLoading] = useState(true);
    const [inventoryData, setInventoryData] = useState({
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        products: []
    });

    useEffect(() => {
        fetchInventoryData();
    }, []);

    const fetchInventoryData = async () => {
        try {
            setLoading(true);
            // Call without pagination to get all products as array
            const products = await fetchProducts();

            console.log("Fetched products for inventory:", products);

            // Log first product to see its structure
            if (products.length > 0) {
                console.log("First product structure:", products[0]);
                console.log("First product quantity field:", products[0].quantity);
                console.log("All fields in first product:", Object.keys(products[0]));
            }

            // Handle if response is null/undefined
            if (!products || !Array.isArray(products)) {
                console.error("Products data is not an array:", products);
                setInventoryData({
                    totalProducts: 0,
                    inStock: 0,
                    lowStock: 0,
                    outOfStock: 0,
                    products: []
                });
                return;
            }

            // Define stock thresholds
            const LOW_STOCK_THRESHOLD = 5;

            const totalProducts = products.length;
            const inStock = products.filter(p => p.stock_level > LOW_STOCK_THRESHOLD).length;
            const lowStock = products.filter(p => p.stock_level > 0 && p.stock_level <= LOW_STOCK_THRESHOLD).length;
            const outOfStock = products.filter(p => p.stock_level === 0 || !p.stock_level).length;

            // Get low stock products for display
            const lowStockProducts = products
                .filter(p => p.stock_level > 0 && p.stock_level <= LOW_STOCK_THRESHOLD)
                .sort((a, b) => a.stock_level - b.stock_level)
                .slice(0, 5);

            console.log("Inventory calculations:", {
                totalProducts,
                inStock,
                lowStock,
                outOfStock,
                LOW_STOCK_THRESHOLD,
                sampleQuantities: products.slice(0, 5).map(p => ({
                    name: p.name,
                    quantity: p.quantity,
                    type: typeof p.quantity
                }))
            });

            setInventoryData({
                totalProducts,
                inStock,
                lowStock,
                outOfStock,
                products: lowStockProducts
            });

        } catch (error) {
            console.error("Error fetching inventory data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-span-12 lg:col-span-12 rounded-xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FiPackage className="text-primary" />
                    Inventory Stock Report
                </h3>
                <p className="text-sm text-gray-500 mt-1">Current stock levels and alerts</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Total Products */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-l-4 border-gray-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Products</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {inventoryData.totalProducts}
                                    </p>
                                </div>
                                <FiPackage className="text-4xl text-gray-500 opacity-50" />
                            </div>
                        </div>

                        {/* In Stock */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">In Stock</p>
                                    <p className="text-3xl font-bold text-green-700 mt-1">
                                        {inventoryData.inStock}
                                    </p>
                                </div>
                                <FiCheckCircle className="text-4xl text-green-500 opacity-50" />
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Low Stock</p>
                                    <p className="text-3xl font-bold text-yellow-700 mt-1">
                                        {inventoryData.lowStock}
                                    </p>
                                </div>
                                <FiAlertTriangle className="text-4xl text-yellow-500 opacity-50" />
                            </div>
                        </div>

                        {/* Out of Stock */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Out of Stock</p>
                                    <p className="text-3xl font-bold text-red-700 mt-1">
                                        {inventoryData.outOfStock}
                                    </p>
                                </div>
                                <FiTrendingDown className="text-4xl text-red-500 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Products List */}
                    {inventoryData.lowStock > 0 && (
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FiAlertTriangle className="text-yellow-500" />
                                Products Requiring Attention
                            </h4>
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                {inventoryData.products.length > 0 ? (
                                    <div className="space-y-2">
                                        {inventoryData.products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center justify-between py-2 border-b border-yellow-200 last:border-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Id: {product.id}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${product.quantity === 0
                                                        ? "bg-red-100 text-red-700"
                                                        : product.quantity <= 5
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                        {product.quantity} left
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 text-center py-2">
                                        No low stock products
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* All Good Message */}
                    {inventoryData.lowStock === 0 && inventoryData.outOfStock === 0 && (
                        <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-3">
                                <FiCheckCircle className="text-green-500 text-2xl" />
                                <div>
                                    <p className="text-sm font-semibold text-green-700">All inventory levels are healthy!</p>
                                    <p className="text-xs text-green-600">No products require immediate attention.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InventoryStockCard;
