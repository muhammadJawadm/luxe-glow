import React, { useEffect, useState } from "react";
import { fetchOrderedProducts } from "../services/orderedProductsServices";
import { FiTrendingUp, FiPackage, FiDownload } from "react-icons/fi";

const TopSellingProducts = () => {
    const [loading, setLoading] = useState(true);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        fetchTopProducts();
    }, []);

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            // fetchOrderedProducts with pagination returns { data: [], count: 0 }
            const response = await fetchOrderedProducts(1, 1000);
            const orderedProducts = response?.data || [];

            console.log("Fetched ordered products for top sellers:", orderedProducts);

            if (!Array.isArray(orderedProducts)) {
                console.error("Ordered products data is not an array:", orderedProducts);
                setTopProducts([]);
                return;
            }

            // Aggregate products by product_id
            const productStats = {};
            orderedProducts.forEach(item => {
                const productId = item.product_id;
                const productName = item.products?.name || "Unknown Product";
                const quantity = item.quantity || 0;
                const price = item.products?.price || 0;

                if (!productStats[productId]) {
                    productStats[productId] = {
                        id: productId,
                        name: productName,
                        totalQuantity: 0,
                        totalRevenue: 0,
                    };
                }

                productStats[productId].totalQuantity += quantity;
                productStats[productId].totalRevenue += quantity * price;
            });

            // Convert to array and sort by total quantity
            const sortedProducts = Object.values(productStats)
                .sort((a, b) => b.totalQuantity - a.totalQuantity)
                .slice(0, 5); // Top 5 products

            console.log("Top selling products calculated:", sortedProducts);

            setTopProducts(sortedProducts);
        } catch (error) {
            console.error("Error fetching top selling products:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (topProducts.length === 0) return;
        const headers = ["Rank", "Product ID", "Product Name", "Units Sold", "Total Revenue"];
        const rows = topProducts.map((p, i) => [
            i + 1,
            p.id,
            `"${p.name}"`,
            p.totalQuantity,
            p.totalRevenue.toFixed(2),
        ].join(","));
        const csv = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `top_selling_products_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="col-span-12 lg:col-span-12 rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <FiTrendingUp className="text-primary" />
                        Top Selling Products
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Best performing products</p>
                </div>
                <button
                    onClick={downloadCSV}
                    disabled={loading || topProducts.length === 0}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Download Top Selling Products as CSV"
                >
                    <FiDownload size={14} />
                    Download CSV
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : topProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                    <FiPackage className="text-6xl text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No sales data available yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {topProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            {/* Rank Badge */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : index === 1
                                    ? "bg-gradient-to-br from-gray-300 to-gray-500"
                                    : index === 2
                                        ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                        : "bg-gradient-to-br from-gray-400 to-gray-600"
                                }`}>
                                {index + 1}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {product.totalQuantity} units sold
                                </p>
                            </div>

                            {/* Revenue */}
                            <div className="text-right">
                                <p className="text-sm font-bold text-primary">
                                    MVR {product.totalRevenue.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopSellingProducts;
