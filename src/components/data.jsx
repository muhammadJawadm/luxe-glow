import { SlHome } from "react-icons/sl";
import { FaJediOrder, FaUsers } from "react-icons/fa";
import {
  MdCategory,
  MdHomeRepairService,
  MdSubscriptions,
  MdContentCopy,
  MdPayments,
  MdOutlineBrandingWatermark,
} from "react-icons/md";
import { FaBookBookmark } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { GiCardExchange } from "react-icons/gi";
import { AiFillProduct, AiFillSetting } from "react-icons/ai";
import { FiShoppingCart, FiTag } from "react-icons/fi";
export const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: <MdDashboardCustomize /> },
  { name: "Customers", path: "/users", icon: <FaUsers /> },
  { name: "Categories", path: "/category", icon: <MdCategory /> },
  { name: "Brands", path: "/brand", icon: <MdOutlineBrandingWatermark /> },
  { name: "Products", path: "/product", icon: <AiFillProduct /> },

  { name: "Offers", path: "/offer", icon: <FiTag /> },
  { name: "Orders", path: "/order", icon: <FiShoppingCart /> },
  { name: "Payment", path: "/payment", icon: <MdPayments /> },

  { name: "Content", path: "/content", icon: <MdContentCopy /> },
  { name: "Settings", path: "/setting", icon: <AiFillSetting /> },
];
