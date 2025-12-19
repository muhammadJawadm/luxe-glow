import { SlHome } from "react-icons/sl";
import { FaJediOrder, FaUsers } from "react-icons/fa";
import {
  MdCategory,
  MdHomeRepairService,
  MdSubscriptions,
  MdContentCopy,
  MdPayments,
  MdOutlineBrandingWatermark,
  MdAppRegistration,
  MdEventNote,
  MdReceipt,
} from "react-icons/md";
import { FaBookBookmark } from "react-icons/fa6";
import { MdDashboardCustomize } from "react-icons/md";
import { GiCardExchange } from "react-icons/gi";
import { AiFillProduct, AiFillSetting } from "react-icons/ai";
import { FiBox, FiShoppingCart, FiTag, FiPackage } from "react-icons/fi";
import { RiShoppingBag3Fill } from "react-icons/ri";
export const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: <MdDashboardCustomize /> },
  {
    name: "POS",
    icon: <RiShoppingBag3Fill />,
    subLinks: [
      {
        name: "Sell",
        path: "/pos/sell",
        icon: <MdAppRegistration />,
      },
      {
        name: "Register",
        path: "/pos/register",
        icon: <MdAppRegistration />,
      },
      { name: "Payments", path: "/pos/payments", icon: <MdPayments /> },
      { name: "Bills", path: "/pos/bills", icon: <MdReceipt /> },
    ],
  },
  { name: "Customers", path: "/users", icon: <FaUsers /> },
  { name: "Categories", path: "/category", icon: <MdCategory /> },
  { name: "Brands", path: "/brand", icon: <MdOutlineBrandingWatermark /> },
  { name: "Products", path: "/product", icon: <AiFillProduct /> },
  { name: "Offers", path: "/offer", icon: <FiTag /> },
  { name: "Orders", path: "/order", icon: <FiShoppingCart /> },
  { name: "Ordered Products", path: "/ordered-products", icon: <FiPackage /> },
  { name: "Notifications", path: "/notifications", icon: <MdEventNote /> },
  { name: "Inventory", path: "/inventory", icon: <FiBox /> },
  { name: "Payment", path: "/payment", icon: <MdPayments /> },
  { name: "Content", path: "/content", icon: <MdContentCopy /> },
  { name: "Discount settings", path: "/setting", icon: <AiFillSetting /> },
];
