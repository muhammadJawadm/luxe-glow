import React from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/partials/header";
import { FaUsers } from "react-icons/fa";
import ChartOne from "../components/ChartOne";
import {
  MdCategory,
  MdContentCopy,
  MdHomeRepairService,
  MdPayment,
} from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FiShoppingCart, FiTag } from "react-icons/fi";
const Home = () => {
  return (
    <div>
      <Header header={"Dashboard"} />
      <div className="max-w-screen-2xl mx-auto">
        <div className="mx-4 sm:mx-9 my-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 md:gap-6 2xl:grid-cols-4 2xl:gap-7">
            <Card title="Users" count="03" icon={FaUsers} link="/users" />
            <Card
              title="Categories"
              count="03"
              icon={MdCategory}
              link="/category"
            />
            <Card
              title="Products"
              count="03"
              icon={AiFillProduct}
              link="/product"
            />
            <Card title="Offers" count="03" icon={FiTag} link="/offer" />
            <Card
              title="Orders"
              count="03"
              icon={FiShoppingCart}
              link="/order"
            />
            <Card title="Payment" count="03" icon={MdPayment} link="/payment" />
            <Card
              title="Content"
              count="03"
              icon={MdContentCopy}
              link="/content"
            />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7 2xl:gap-7">
            <ChartOne />
          </div>
        </div>
      </div>
    </div>
  );
};
const Card = ({ title, count, icon: Icon, link, percentage }) => (
  <Link to={link} className="w-full">
    <div className="rounded-sm bg-white py-6 px-7 shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black">{count}</h4>
          <span className="text-sm font-medium text-gray-500">{title}</span>
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-green-500">
          {percentage}
        </span>
      </div>
    </div>
  </Link>
);
export default Home;
