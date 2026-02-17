import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../layouts/partials/header";
import { FiDownload } from "react-icons/fi";
import ChartOne from "../../components/ChartOne";
import SalesReportCard from "../../components/SalesReportCard";
import InventoryStockCard from "../../components/InventoryStockCard";
import TopSellingProducts from "../../components/TopSellingProducts";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Import all service functions
import { fetchUsers } from "../../services/userServices";
import { fetchProducts } from "../../services/productServices";
import { fetchOrderedProducts } from "../../services/orderedProductsServices";
import { fetchOrders } from "../../services/orderServices";
import { fetchPayments } from "../../services/paymentsServices";
import { fetchOffers } from "../../services/offersServices";
import { fetchCategories } from "../../services/categoriesServices";
import { fetchBrands } from "../../services/brandsServices";
import { fetchAllCarts } from "../../services/cartService";

const Report = () => {
    const [stats, setStats] = useState({
        users: 0,
        products: 0,
        orders: 0,
        payments: 0,
        offers: 0,
        categories: 0,
        brands: 0,
    });
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [
                    usersData,
                    productsData,
                    ordersData,
                    paymentsData,
                    offersData,
                    categoriesData,
                    brandsData,
                    cartsData
                ] = await Promise.all([
                    fetchUsers(),
                    fetchProducts(),
                    fetchOrders(),
                    fetchPayments(),
                    fetchOffers(),
                    fetchCategories(),
                    fetchBrands(),
                    fetchAllCarts()
                ]);

                // Store orders for the report
                setReportData(ordersData || []);

                // Update stats with actual counts
                setStats({
                    users: usersData?.length || 0,
                    products: productsData?.length || 0,
                    orders: ordersData?.length || 0,
                    payments: paymentsData?.length || 0,
                    offers: offersData?.length || 0,
                    categories: categoriesData?.length || 0,
                    brands: brandsData?.length || 0,
                    carts: cartsData?.length || 0,
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    const downloadAllReports = async () => {
        try {
            const zip = new JSZip();
            const folderName = `Luxe_Glow_Reports_${new Date().toISOString().split('T')[0]}`;
            const folder = zip.folder(folderName);

            // 1. Generate Sales Report CSV
            if (reportData && reportData.length > 0) {
                const salesHeaders = ["Order ID", "Date", "Customer Name", "Customer Email", "Status", "Payment Method", "Total Amount"];
                const salesRows = [salesHeaders.join(",")];

                reportData.forEach(order => {
                    const date = new Date(order.created_at).toLocaleDateString();
                    const customerName = order.users?.name || "Walk-in Customer";
                    const customerEmail = order.users?.email || "";
                    const status = order.status || "Pending";
                    const totalAmount = order.payments && order.payments.length > 0
                        ? order.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
                        : (order.total_amount || 0);
                    const paymentMethod = order.payments && order.payments.length > 0
                        ? order.payments[0].payment_method
                        : "N/A";

                    const row = [
                        order.id,
                        `"${date}"`,
                        `"${customerName}"`,
                        `"${customerEmail}"`,
                        status,
                        paymentMethod,
                        totalAmount.toFixed(2)
                    ];
                    salesRows.push(row.join(","));
                });
                folder.file("sales_report.csv", salesRows.join("\n"));
            }

            // 2. Generate Inventory Report CSV
            try {
                // Fetch all products for inventory report
                // We re-fetch to ensure we have the latest stock levels
                const allProducts = await fetchProducts();

                if (allProducts && allProducts.length > 0) {
                    const inventoryHeaders = ["Product ID", "Name", "Category", "Brand", "Price", "Cost", "Stock Level", "Status"];
                    const inventoryRows = [inventoryHeaders.join(",")];

                    const LOW_STOCK_THRESHOLD = 5;

                    allProducts.forEach(product => {
                        let status = "In Stock";
                        if (product.stock_level === 0) status = "Out of Stock";
                        else if (product.stock_level <= LOW_STOCK_THRESHOLD) status = "Low Stock";

                        const row = [
                            product.id,
                            `"${product.name || ''}"`,
                            `"${product.categories?.name || 'N/A'}"`,
                            `"${product.brands?.name || 'N/A'}"`,
                            (product.price || 0).toFixed(2),
                            (product.cost || 0).toFixed(2),
                            product.stock_level || 0,
                            status
                        ];
                        inventoryRows.push(row.join(","));
                    });
                    folder.file("inventory_report.csv", inventoryRows.join("\n"));
                }
            } catch (err) {
                console.error("Error generating inventory report:", err);
            }

            // 3. Generate Top Selling Products CSV
            try {
                // Fetch ordered products for calculation
                const response = await fetchOrderedProducts(1, 1000);
                const orderedProducts = response?.data || [];

                if (orderedProducts && orderedProducts.length > 0) {
                    // Aggregate data
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

                    const sortedProducts = Object.values(productStats)
                        .sort((a, b) => b.totalQuantity - a.totalQuantity);

                    const topSellingHeaders = ["Rank", "Product ID", "Product Name", "Units Sold", "Total Revenue"];
                    const topSellingRows = [topSellingHeaders.join(",")];

                    sortedProducts.forEach((product, index) => {
                        const row = [
                            index + 1,
                            product.id,
                            `"${product.name}"`,
                            product.totalQuantity,
                            product.totalRevenue.toFixed(2)
                        ];
                        topSellingRows.push(row.join(","));
                    });
                    folder.file("top_selling_products.csv", topSellingRows.join("\n"));
                }
            } catch (err) {
                console.error("Error generating top selling report:", err);
            }

            // Generate ZIP and trigger download
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `${folderName}.zip`);

        } catch (error) {
            console.error("Error downloading reports:", error);
            alert("Failed to generate reports. Please try again.");
        }
    };

    return (
        <div>
            <Header header={"Dashboard"} />
            <div className="max-w-screen-2xl mx-auto">
                <div className="mx-4 sm:mx-9 my-5">
                    {/* Welcome Banner */}
                    <div className="mb-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center bg-cover bg-center" >
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Luxe Glow Reports</h2>
                            <p className="text-white/90">Overview of your business performance and analytics</p>
                        </div>
                        <button
                            onClick={downloadAllReports}
                            className="mt-4 sm:mt-0 px-4 py-2 bg-white text-primary rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <FiDownload />
                            Download All Reports (ZIP)
                        </button>
                    </div>


                    {/* Reports Section */}
                    <div className="mt-6 md:mt-8">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Sales Report */}
                            <SalesReportCard />

                            {/* Layout for Inventory and Growth Chart */}
                            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                            {/* Inventory Stock Report */}
                            <InventoryStockCard />

                            {/* Top Selling Products Card */}
                            {/* <div className="col-span-12 lg:col-span-12 rounded-xl bg-white p-6 shadow-xl"> */}
                            <TopSellingProducts />
                            {/* </div> */}
                            {/* </div> */}

                            {/* Growth Overview Chart */}
                            <ChartOne />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, count, icon: Icon, link, bgColor, iconColor }) => (
    <Link to={link} className="w-full">
        <div className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bgColor}`}>
                <Icon className={`w-7 h-7 ${iconColor}`} />
            </div>
            <div className="mt-4">
                <h4 className="text-3xl font-bold text-gray-900 mb-1">{count}</h4>
                <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
            <div className="mt-3 flex items-center text-sm">
                <span className="text-primary font-medium hover:underline">
                    View all →
                </span>
            </div>
        </div>
    </Link>
);

export default Report;

