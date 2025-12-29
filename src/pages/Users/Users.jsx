import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { fetchUsers, deleteUser, updateUser } from "../../services/userServices";
import { fetchRewards } from "../../services/rewardsService";
const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  // const [userRewards, setUserRewards] = useState({});
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    is_active: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetchUsers();
        setUsersData(response);
        console.log(response);
        setFilteredUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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
      setEditingUser(userId);
      setEditFormData({
        name: userToEdit.name,
        email: userToEdit.email,
        phone: userToEdit.phone,
        is_active: userToEdit.is_active
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({
      name: "",
      email: "",
      phone: "",
      is_active: true
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await updateUser(userId, editFormData);
      // Update the UI
      const updatedUsers = usersData.map(user =>
        user.id === userId ? { ...user, ...editFormData } : user
      );
      setUsersData(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      ));
      setEditingUser(null);
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
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone No</th>
                  <th className="px-6 py-3">Last Seen</th>
                  <th className="px-6 py-3">Rewards</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
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
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
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
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {editingUser === user.id ? (
                          <input
                            type="email"
                            name="email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          <span className="inline-flex items-center">
                            {user.email}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 font-mono text-gray-700/90">
                        {editingUser === user.id ? (
                          <input
                            type="text"
                            name="phone"
                            value={editFormData.phone}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        ) : (
                          user.phone
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <span className="ml-2 text-sm text-gray-600">
                            {formatTime(user.last_updated)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 flex p-2 gap-1 ml-3 font-bold">
                        {user.rewards?.stars || 0}
                        <AiFillStar className="text-yellow-500 mt-0.5" />
                      </td>
                      <td className="px-6 py-3 ">
                        {editingUser === user.id ? (
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="is_active"
                              checked={editFormData.is_active}
                              onChange={handleInputChange}
                              className="rounded"
                            />
                            <span className="text-xs">Active</span>
                          </label>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 space-x-2">
                        {editingUser === user.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(user.id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
