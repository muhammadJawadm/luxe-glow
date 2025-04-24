import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Users from "./pages/Users/Users";
import Categories from "./pages/Categories/Categories";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/Products/ProductDetail";
import Orders from "./pages/Orders/Orders";
import Offers from "./pages/Offers/Offers";
import Content from "./pages/Content/Content";
import Payment from "./pages/Pyament/Payment";
import Brand from "./pages/Brand/Brand";
import Settings from "./pages/Settings/Settings";
import Register from "./pages/POSDashboard/Register";
import RegisterSessions from "./pages/POSDashboard/RegisterSessions";
import PosBills from "./pages/POSDashboard/PosBills";
import PosPayment from "./pages/POSDashboard/PosPayment";
import PosSell from "./pages/POSDashboard/PosSell";
import Inventory from "./pages/Inventory/Inventory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/pos/sell" element={<PosSell />} />
        <Route path="/pos/register" element={<Register />} />
        <Route path="/pos/registerSession" element={<RegisterSessions />} />
        <Route path="/pos/bills" element={<PosBills />} />
        <Route path="/pos/payments" element={<PosPayment />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/offer" element={<Offers />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/content" element={<Content />} />
        <Route path="/setting" element={<Settings />} />
      </Route>
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
