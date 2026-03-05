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

import PosSell from "./pages/POSDashboard/PosSell";
import PosSales from "./pages/POSDashboard/PosSales";

import Notifications from "./pages/Notifications/Notifications";
import Inventory from "./pages/Inventory/Inventory";
import Cart from "./pages/Cart/Cart";
import Rewards from "./pages/Rewards/Rewards";
import ProtectedRoute from "./components/ProtectedRoute";
import { RoleProtectedRoute } from "./components/ProtectedRoute";
import Report from "./pages/Report/Report";
import CustomerService from "./pages/CustomerService/CustomerService";
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
        <Route index element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Home /></RoleProtectedRoute>} />
        <Route path="/users" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Users /></RoleProtectedRoute>} />
        <Route path="/category" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Categories /></RoleProtectedRoute>} />
        <Route path="/product" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Products /></RoleProtectedRoute>} />

        <Route path="/pos/sell" element={<PosSell />} />
        <Route path="/pos/sales" element={<PosSales />} />
        <Route path="/ordered-products" element={<OrderedProducts />} />
        <Route path="/product/:id" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><ProductDetail /></RoleProtectedRoute>} />
        <Route path="/order" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Orders /></RoleProtectedRoute>} />
        <Route path="/cart" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Cart /></RoleProtectedRoute>} />
        <Route path="/rewards" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Rewards /></RoleProtectedRoute>} />
        <Route path="/brand" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Brand /></RoleProtectedRoute>} />
        <Route path="/inventory" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Inventory /></RoleProtectedRoute>} />
        <Route path="/offer" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Offers /></RoleProtectedRoute>} />
        <Route path="/notifications" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Notifications /></RoleProtectedRoute>} />
        <Route path="/payment" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Payment /></RoleProtectedRoute>} />
        <Route path="/content" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Content /></RoleProtectedRoute>} />
        <Route path="/discount" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Discount /></RoleProtectedRoute>} />
        <Route path="/reports" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><Report /></RoleProtectedRoute>} />
        <Route path="/customer-service" element={<RoleProtectedRoute allowedRoles={["admin_user", "admin"]}><CustomerService /></RoleProtectedRoute>} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

