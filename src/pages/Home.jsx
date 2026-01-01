import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/partials/header";
import { FaUsers } from "react-icons/fa";
import ChartOne from "../components/ChartOne";
import {
  MdCategory,
  MdContentCopy,
  MdLocalOffer,
  MdPayment,
} from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FiShoppingCart, FiTag } from "react-icons/fi";
import { TbBrandSuperhuman } from "react-icons/tb";

// Import all service functions
import { fetchUsers } from "../services/userServices";
import { fetchProducts } from "../services/productServices";
import { fetchOrders } from "../services/orderServices";
import { fetchPayments } from "../services/paymentsServices";
import { fetchOffers } from "../services/offersServices";
import { fetchCategories } from "../services/categoriesServices";
import { fetchBrands } from "../services/brandsServices";
import { fetchAllCarts } from "../services/cartService";

const Home = () => {
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
            <h2 className="text-2xl font-bold mb-2">Welcome to Luxe Glow Admin</h2>
            <p className="text-white/90">Here's what's happening with your store today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6 2xl:grid-cols-4 2xl:gap-7">
            <Card
              title="Customers"
              count={loading ? "..." : stats.users}
              icon={FaUsers}
              link="/users"
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <Card
              title="Products"
              count={loading ? "..." : stats.products}
              icon={AiFillProduct}
              link="/product"
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <Card
              title="Orders"
              count={loading ? "..." : stats.orders}
              icon={FiShoppingCart}
              link="/order"
              bgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <Card
              title="Payments"
              count={loading ? "..." : stats.payments}
              icon={MdPayment}
              link="/payment"
              bgColor="bg-yellow-50"
              iconColor="text-yellow-600"
            />
            <Card
              title="Offers"
              count={loading ? "..." : stats.offers}
              icon={FiTag}
              link="/offer"
              bgColor="bg-red-50"
              iconColor="text-red-600"
            />
            <Card
              title="Categories"
              count={loading ? "..." : stats.categories}
              icon={MdCategory}
              link="/category"
              bgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            />
            <Card
              title="Brands"
              count={loading ? "..." : stats.brands}
              icon={TbBrandSuperhuman}
              link="/brand"
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
            <Card
              title="Carts"
              count={loading ? "..." : stats.carts}
              icon={TbBrandSuperhuman}
              link="/cart"
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            />
          </div>

          {/* Charts Section */}
          <div className="mt-6 md:mt-8">
            <ChartOne />
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

export default Home;

