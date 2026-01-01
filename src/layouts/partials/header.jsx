import React, { useState, useEffect } from "react";
import { PiBellLight } from "react-icons/pi";
import { RiCloseFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiUser, FiLogOut, FiX } from "react-icons/fi";
import { getCurrentUser, logout } from "../../services/authService";
const Header = ({ header, link, arrow }) => {
  const [drop, setDrop] = useState(false);
  const [showMenue, setShowMenue] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Helper function to format email into display name
  const getDisplayName = () => {
    if (!currentUser?.email) return "Admin";

    // Extract name from email (e.g., "admin@luxeglow.com" -> "Admin")
    const emailPrefix = currentUser.email.split('@')[0];
    // Capitalize first letter of each word
    return emailPrefix
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfileClick = () => {
    setDrop(false);
    setIsProfileModalOpen(true);
  };
  return (
    <div>
      <div className="bg-white">
        <nav className="text-gray-350">
          <div className=" flex flex-wrap items-center justify-between px-4 py-9 sm:p-8">
            <div className="flex items-center drop-shadow-lg">
              {
                <Link to={link}>
                  <div className="flex items-center gap-1">
                    {arrow && <IoArrowBack className="w-5 h-5" />}
                    <span className="self-center text-xl sm:text-2xl font-semibold whitespace-nowrap capitalize ">
                      {header}
                    </span>
                  </div>
                </Link>
              }
            </div>
            <div className="relative" id="navbar-default">
              <div className="flex flex-row">
                <div
                  onClick={(e) => setShowMenue(true)}
                  className="rounded-full drop-shadow-lg  flex justify-center items-center  mr-1 sm:mr-4 w-9 h-9"
                >
                  <PiBellLight className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  className="flex text-sm rounded-full md:mr-0"
                  onClick={(e) => setDrop(!drop)}
                >
                  <div className="flex items-center text-sm drop-shadow-lg">
                    <img
                      className="rounded-full drop sm:mr-2 w-9 h-9 object-cover"
                      loading="lazy"
                      src="https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=1600"
                      alt="profile"
                    />
                    <span className="hidden sm:block">{getDisplayName()}</span>
                  </div>
                </button>
              </div>
              <div
                className={`z-50 ${drop ? null : "hidden"
                  } absolute right-0 w-48 my-4 text-gray-950 font-medium list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200`}
              >
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      <FiUser className="text-gray-600" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="text-red-600" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <aside
        className={`fixed top-0 right-0 z-40 w-96 text-black bg-gradient-to-b from-gray-50 to-gray-100 h-screen ${showMenue ? "block" : `hidden`
          }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto space-y-3">
          {showMenue && (
            <button
              className="float-right text-xl text-black"
              onClick={(e) => setShowMenue(false)}
            >
              <RiCloseFill />
            </button>
          )}
          <div className="pt-5">
            <div className="rounded-md border px-4 py-1.5 space-y-1 bg-white shadow-md">
              <h1 className="font-semibold">Title</h1>
              <p className="text-xs font-medium text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque,
                eligendi.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justifybetween mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">Profile Information</h3>
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                      src="https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=1600"
                      alt="Profile"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        {getDisplayName()}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        {currentUser?.email || 'Not available'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        Administrator
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
