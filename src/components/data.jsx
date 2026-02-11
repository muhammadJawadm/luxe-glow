import { SlHome } from "react-icons/sl";
import { FaJediOrder, FaUsers } from "react-icons/fa";
import {
  MdCategory,
  MdHomeRepairService,
  MdSubscriptions,
  MdContentCopy,
  MdPayments,
  MdOutlineBrandingWatermark,
  MdEventNote,
  MdReceipt,
} from "react-icons/md";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { MdAppRegistration } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { AiFillProduct, AiFillSetting } from "react-icons/ai";
import { FiBox, FiShoppingCart, FiTag, FiPackage } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
export const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: <MdDashboardCustomize /> },
  { name: "Customers", path: "/users", icon: <FaUsers /> },
  {
    name: "POS",
    icon: <RiShoppingBag3Fill />,
    subLinks: [
      {
        name: "Sell",
        path: "/pos/sell",
        icon: <MdAppRegistration />,
      },
      // {
      //   name: "Register",
      //   path: "/pos/register",
      //   icon: <MdAppRegistration />,
      // },
      { name: "Payments", path: "/pos/payments", icon: <MdPayments /> },
      // { name: "Bills", path: "/pos/bills", icon: <MdReceipt /> },
    ],
  },
  { name: "Categories", path: "/category", icon: <MdCategory /> },
  { name: "Brands", path: "/brand", icon: <MdOutlineBrandingWatermark /> },
  { name: "Products", path: "/product", icon: <AiFillProduct /> },
  { name: "Offers", path: "/offer", icon: <FiTag /> },
  // { name: "Orders", path: "/order", icon: <FiShoppingCart /> },
  { name: "Orders", path: "/ordered-products", icon: <FiPackage /> },
  { name: "Carts", path: "/cart", icon: <BsCart3 /> },
  // { name: "Rewards", path: "/rewards", icon: <AiFillStar /> },
  { name: "Notifications", path: "/notifications", icon: <MdEventNote /> },
  { name: "Payment", path: "/payment", icon: <MdPayments /> },
  // { name: "Inventory", path: "/inventory", icon: <FiBox /> },
  { name: "Content", path: "/content", icon: <MdContentCopy /> },
  { name: "Tax & Delivery Charges", path: "/discount", icon: <AiFillSetting /> },
];
