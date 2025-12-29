import { SlHome } from "react-icons/sl";
import {
  RiLogoutCircleLine,
  RiCloseFill,
  RiArrowUpSFill,
} from "react-icons/ri";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { MdArrowDropDown } from "react-icons/md";
import { sidebarLinks } from "../../components/data";
import Logo from "../../assets/Logo.svg";
import { useState } from "react";
import { logout } from "../../services/authService";

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePOSToggle = () => {
    setIsPOSOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/login", { replace: true });
    }
  };

  const isSubLinkActive = (subLinks) =>
    subLinks?.some((subLink) => location.pathname.startsWith(subLink.path));
  return (
    <div>
      {" "}
      <>
        <div className="px-4 sm:px-8 pt-2 ">
          <button
            type="button"
            onClick={() => setShowMenu(true)}
            className="flex items-center p-2 border-0 text-sm text-primary bg-primary bg-opacity-5 rounded-lg lg:hidden "
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="white"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
        </div>

        <aside
          className={`fixed top-0 left-0 z-40 w-64 border-r bg-white h-screen ${showMenu ? "" : "hidden"
            } lg:block`}
          aria-label="Sidebar"
        >
          <div
            className="flex flex-col justify-between h-full px-3 py-4 overflow-y-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div>
              {showMenu && (
                <button
                  className="float-right rounded-full text-xl text-black cursor-pointer"
                  onClick={() => setShowMenu(false)}
                >
                  <RiCloseFill />
                </button>
              )}

              <ul className="space-y-2 font-normal text-sm">
                <li className="py-3">
                  <Link
                    to="/"
                    className="flex items-center justify-center py-2 px-5 rounded-lg"
                  >
                    <img
                      src={Logo}
                      alt="LuxeGlow Logo"
                      className="h-16 w-auto mr-2"
                    />
                  </Link>
                </li>

                {sidebarLinks?.map((link) => (
                  <li key={link.name}>
                    {link.subLinks ? (
                      <>
                        <button
                          className={`flex items-center py-2 px-5 rounded-lg w-full text-left ${isSubLinkActive(link.subLinks)
                            ? "bg-primary bg-opacity-70 drop-shadow text-gray-50 font-semibold"
                            : "text-gray-600 hover:bg-primary/10 hover:text-primary hover:font-medium"
                            }`}
                          onClick={link.name === "POS" && handlePOSToggle}
                        >
                          {link.icon}
                          <span className="flex-1 ml-3 whitespace-nowrap">
                            {link.name}
                          </span>
                          <span className="ml-auto">
                            {isPOSOpen ? (
                              <svg
                                className="w-4 h-4 transition-transform transform rotate-90 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-4 h-4 transition-transform transform text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            )}
                          </span>
                        </button>

                        {link.name === "POS" && isPOSOpen ? (
                          <ul className="space-y-2 mt-2">
                            {link.subLinks.map((subLink) => (
                              <SidebarLink
                                key={subLink.name}
                                name={subLink.name}
                                path={subLink.path}
                                icon={subLink.icon}
                                onClick={() => setShowMenu(false)}
                              />
                            ))}
                          </ul>
                        ) : null}
                      </>
                    ) : (
                      <SidebarLink
                        name={link.name}
                        path={link.path}
                        icon={link.icon}
                        onClick={() => {
                          setShowMenu(false);
                          setIsPOSOpen(false);
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-5 py-2 rounded-lg bg-primary/5 text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <RiLogoutCircleLine />
                <p className="ml-2">Logout</p>
              </button>
            </div>
          </div>
        </aside>
      </>
    </div>
  );
};
function SidebarLink({ name, path, icon, onClick }) {
  return (
    <li onClick={onClick}>
      <NavLink
        to={path}
        className={({ isActive }) =>
          isActive
            ? "flex items-center py-2 px-5 rounded-lg bg-primary drop-shadow text-gray-50 font-semibold"
            : "flex items-center py-2 px-5 text-gray-600 rounded-lg hover:bg-primary/10 drop-shadow hover:text-primary hover:font-medium outline-none"
        }
      >
        {icon}
        <span className="flex-1 ml-3 whitespace-nowrap">{name}</span>
      </NavLink>
    </li>
  );
}
export default Sidebar;
