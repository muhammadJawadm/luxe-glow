import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { fetchUsers, deleteUser, updateUser } from "../../services/userServices";
import { fetchRewards } from "../../services/rewardsService";
import Pagination from "../../components/Pagination";
const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    is_active: true
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers(currentPage, itemsPerPage);
        setUsersData(response.data || []);
        setTotalItems(response.count || 0);
        console.log(response);
        setFilteredUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [currentPage]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(usersData);
    } else {
      const filtered = usersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, usersData]);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");

    if (!confirmDelete) return;

    try {
      await deleteUser(userId);

      // Update the UI by removing the deleted user
      const updatedUsers = usersData.filter(user => user.id !== userId);
      setUsersData(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      ));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleEditUser = (userId) => {
    const userToEdit = usersData.find(user => user.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setEditFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        is_active: userToEdit.is_active
      });
      setIsEditModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      is_active: true
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, editFormData);
      // Update the UI
      const updatedUsers = usersData.map(user =>
        user.id === selectedUser.id ? { ...user, ...editFormData } : user
      );
      setUsersData(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      ));
      handleCloseModal();
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  function formatTime(timestamp) {
    const date = new Date(timestamp); // parse the timestamp
    // Options for formatting
    const options = {
      year: 'numeric',
      month: 'short', // Dec
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: true, // 12-hour format
    };
    return date.toLocaleString('en-PK', options); // Pakistan time format
  }
  return (
    <div>
      <Header header={"Manage Customers"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white "
              placeholder="Search customers..."
            />
          </div>
        </div>
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Name</th>
                  <th className="px-6 py-3.5 font-medium">Email</th>
                  <th className="px-6 py-3.5 font-medium">Phone No</th>
                  <th className="px-6 py-3.5 font-medium">Last Seen</th>
                  <th className="px-6 py-3.5 font-medium">Rewards</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? "No users found matching your search." : "No users available."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.profile}
                            alt="User"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200/50"
                          />
                          <span className="font-medium text-gray-800">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-gray-700/90">
                        {user.phone}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <span className="ml-2 text-sm text-gray-600">
                            {formatTime(user.last_updated)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 flex p-2 gap-1 ml-3 font-bold">
                        {user.rewards?.stars || 0}
                        <AiFillStar className="text-yellow-500 mt-1" />
                      </td>
                      <td className="px-6 py-3 ">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit User"
                          >
                            <FiEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSaveEdit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit User
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                      <FiX className="text-xl" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* User Profile Image */}
                    <div className="flex justify-center">
                      <img
                        src={selectedUser.profile}
                        alt="User"
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-200"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={editFormData.is_active}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-gray-700">Active User</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Users;
