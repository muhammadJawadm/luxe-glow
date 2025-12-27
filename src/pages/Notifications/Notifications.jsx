import React, { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch, FiSend, FiBell, FiUsers, FiCheck } from "react-icons/fi";
import { fetchUsers } from "../../services/userServices";
import { supabase } from "../../lib/supabase";

const Notifications = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [sendingProgress, setSendingProgress] = useState({ current: 0, total: 0 });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    sendTo: "all",
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUsers();
      // Filter only users with FCM token
      const usersWithFCM = data.filter(user => user.fcm_token && user.fcm_token.trim() !== "");
      setUsers(usersWithFCM);
      setFilteredUsers(usersWithFCM);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.sendTo === "selected") {
      const filtered = users.filter(user => {
        const name = user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, formData.sendTo]);

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(u => u.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const handleSendNotification = async () => {
    setError(null);

    // Validation
    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required");
      return;
    }

    if (formData.sendTo === "selected" && selectedUsers.length === 0) {
      setError("Please select at least one user");
      return;
    }

    setIsSending(true);

    try {
      const recipientUsers = formData.sendTo === "all" ? users : users.filter(u => selectedUsers.includes(u.id));

      setSendingProgress({ current: 0, total: recipientUsers.length });

      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < recipientUsers.length; i++) {
        const user = recipientUsers[i];
        setSendingProgress({ current: i + 1, total: recipientUsers.length });

        try {
          // Send push notification via edge function
          const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('send-notification', {
            body: {
              token: user.fcm_token,
              title: formData.title,
              body: formData.message,
              data: {
                type: 'admin_push',
                timestamp: new Date().toISOString(),
              }
            }
          });

          if (notificationError || (notificationResult && !notificationResult.success)) {
            console.error(`Failed to send to ${user.email}:`, notificationError || notificationResult);
            failedCount++;
            continue;
          }

          // Store in database
          await supabase.from('notifications').insert({
            uid: user.id,
            title: formData.title,
            sub_title: formData.message,
            sender: 'admin'
          });

          successCount++;
        } catch (error) {
          console.error(`Error sending to user ${user.email}:`, error);
          failedCount++;
        }
      }

      if (successCount > 0) {
        let message = `Successfully sent notification to ${successCount} user${successCount !== 1 ? 's' : ''}!`;
        if (failedCount > 0) {
          message += ` (${failedCount} failed)`;
        }
        setSuccessMessage(message);
        setShowSuccessModal(true);

        // Reset form
        setFormData({ title: "", message: "", sendTo: "all" });
        setSelectedUsers([]);
        setSearchTerm("");
      } else {
        setError(`Failed to send notifications. Please try again.`);
      }
    } catch (err) {
      setError("Failed to send notifications. Please try again.");
      console.error('Error:', err);
    } finally {
      setIsSending(false);
      setSendingProgress({ current: 0, total: 0 });
    }
  };

  const getUserName = (user) => {
    return user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
  };

  return (
    <div>
      <Header header={"Send Push Notifications"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">

        {/* Info Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiBell className="text-primary text-xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Send Instant Notifications</h3>
              <p className="text-sm text-gray-600">
                Broadcast messages to all users or select specific recipients. Currently <strong>{users.length} users</strong> are eligible to receive notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiSend className="text-lg" />
              Create New Notification
            </h2>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notification Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., New Feature Update, Special Announcement..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={isSending}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notification Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  disabled={isSending}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Keep it concise and actionable for better engagement
                </p>
              </div>

              {/* Send To Options */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Send To <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className={`flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${formData.sendTo === "all"
                    ? 'bg-white border-primary shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                    <input
                      type="radio"
                      name="sendTo"
                      value="all"
                      checked={formData.sendTo === "all"}
                      onChange={(e) => {
                        setFormData({ ...formData, sendTo: e.target.value });
                        setSelectedUsers([]);
                        setSearchTerm("");
                      }}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                      disabled={isSending}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-primary" />
                        <span className="font-semibold text-gray-900">All Users</span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                          {users.length}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Broadcast to everyone</p>
                    </div>
                  </label>

                  <label className={`flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${formData.sendTo === "selected"
                    ? 'bg-white border-primary shadow-md'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                    <input
                      type="radio"
                      name="sendTo"
                      value="selected"
                      checked={formData.sendTo === "selected"}
                      onChange={(e) => setFormData({ ...formData, sendTo: e.target.value })}
                      className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
                      disabled={isSending}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <FiCheck className="text-primary" />
                        <span className="font-semibold text-gray-900">Select Specific Users</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Choose who receives it</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* User Selection */}
              {formData.sendTo === "selected" && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Select Recipients</h3>
                      <p className="text-sm text-gray-600">Choose who will receive this notification</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAllUsers}
                        className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        disabled={isSending}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllUsers}
                        className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        disabled={isSending}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      disabled={isSending}
                    />
                  </div>

                  {/* Selected Count */}
                  <div className="mb-4 bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Selected Recipients</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedUsers.length} <span className="text-sm font-normal text-gray-500">/ {filteredUsers.length}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="text-lg font-bold text-primary">
                          {filteredUsers.length > 0 ? Math.round((selectedUsers.length / filteredUsers.length) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User List */}
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    {isLoading ? (
                      <div className="p-8 text-center">
                        <div className="text-gray-500">Loading users...</div>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">No users found</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => {
                          const isSelected = selectedUsers.includes(user.id);

                          return (
                            <label
                              key={user.id}
                              className={`flex items-center p-4 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleUserSelection(user.id)}
                                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                                disabled={isSending}
                              />
                              <div className="ml-3 flex-1">
                                <p className="font-semibold text-gray-900">{getUserName(user)}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Send Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSendNotification}
                  disabled={isSending}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>
                        {sendingProgress.total > 0
                          ? `Sending ${sendingProgress.current}/${sendingProgress.total}...`
                          : 'Sending...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSend className="text-lg" />
                      <span>Send Notification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;