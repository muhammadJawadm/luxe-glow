import { useState } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Users from "./pages/Users/Users";
import Categories from "./pages/Categories/Categories";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/Products/ProductDetail";
import Orders from "./pages/Orders/Orders";
import OrderedProducts from "./pages/OrderedProducts/OrderedProducts";
import Offers from "./pages/Offers/Offers";
import Content from "./pages/Content/Content";
import Payment from "./pages/Pyament/Payment";
import Brand from "./pages/Brand/Brand";
import Discount from "./pages/Discount/Discount";
import Notifications from "./pages/Notifications/Notifications";
import Inventory from "./pages/Inventory/Inventory";
import Cart from "./pages/Cart/Cart";
import Rewards from "./pages/Rewards/Rewards";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public route - Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes - All dashboard routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/ordered-products" element={<OrderedProducts />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/offer" element={<Offers />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/content" element={<Content />} />
        <Route path="/discount" element={<Discount />} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

