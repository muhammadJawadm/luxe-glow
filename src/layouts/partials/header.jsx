import React, { useState, useEffect } from "react";
import { PiBellLight } from "react-icons/pi";
import { RiCloseFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiUser, FiLogOut, FiX, FiClock, FiBell } from "react-icons/fi";
import { getCurrentUser, logout } from "../../services/authService";
import { fetchNotifications } from "../../services/notificationServices";

const Header = ({ header, link, arrow }) => {
  const [drop, setDrop] = useState(false);
  const [showMenue, setShowMenue] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const data = await fetchNotifications();
      // Get only the latest 10 notifications
      setNotifications(data.slice(0, 10));
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

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
                  className="rounded-full drop-shadow-lg  flex justify-center items-center  mr-1 sm:mr-4 w-9 h-9 cursor-pointer hover:bg-gray-100 transition-colors relative"
                >
                  <PiBellLight className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                  )}
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


      {showMenue && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenue(false)}>
          <div
            className="absolute top-20 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[600px] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiBell className="text-xl" />
                Notifications
              </h3>
              <button
                onClick={() => setShowMenue(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <RiCloseFill className="text-2xl" />
              </button>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[450px]">
              {notificationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <FiBell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">You'll see notifications here</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const userName = notification.users
                      ? (notification.users.name || `${notification.users.first_name || ''} ${notification.users.last_name || ''}`.trim() || notification.users.email)
                      : 'Unknown User';
                    const formattedDate = new Date(notification.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div
                        key={notification.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {notification.image_url ? (
                            <img
                              src={notification.image_url}
                              alt="Notification"
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <FiBell className="text-primary" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                              {notification.title}
                            </h4>
                            {notification.sub_title && (
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {notification.sub_title}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-medium">{userName}</span>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1">
                                <FiClock className="text-gray-400" />
                                <span>{formattedDate}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${notification.sender === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {notification.sender}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <button
                  onClick={() => {
                    setShowMenue(false);
                    navigate('/notifications');
                  }}
                  className="w-full text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
