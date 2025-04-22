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
        <Route path="/brand" element={<Brand />} />
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
