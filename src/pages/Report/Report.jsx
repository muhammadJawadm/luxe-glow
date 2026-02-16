import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../layouts/partials/header";
import ChartOne from "../../components/ChartOne";
import SalesReportCard from "../../components/SalesReportCard";
import InventoryStockCard from "../../components/InventoryStockCard";
import TopSellingProducts from "../../components/TopSellingProducts";

// Import all service functions
import { fetchUsers } from "../../services/userServices";
import { fetchProducts } from "../../services/productServices";
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

    return (
        <div>
            <Header header={"Dashboard"} />
            <div className="max-w-screen-2xl mx-auto">
                <div className="mx-4 sm:mx-9 my-5">
                    {/* Welcome Banner */}
                    <div className="mb-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg">
                        <h2 className="text-2xl font-bold mb-2">Luxe Glow Reports</h2>
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

