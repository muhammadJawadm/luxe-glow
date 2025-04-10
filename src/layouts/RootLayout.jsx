import { Outlet } from "react-router-dom";
import Sidebar from "./partials/sidebar";
const RootLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
