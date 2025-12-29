import React, { useEffect, useState } from "react";
import { fetchAllRewards, updateUserRewards, getRewardsStatistics } from "../../services/rewardsService";
import Header from "../../layouts/partials/header";
import { FiSearch, FiEdit2, FiCheck, FiX, FiStar } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [filteredRewards, setFilteredRewards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalStars: 0,
        averageStars: 0
    });

    useEffect(() => {
        loadRewards();
        loadStatistics();
    }, []);

    useEffect(() => {
        filterRewards();
    }, [searchQuery, rewards]);

    const loadRewards = async () => {
        setIsLoading(true);
        const data = await fetchAllRewards();
        setRewards(data);
        setFilteredRewards(data);
        setIsLoading(false);
    };

    const loadStatistics = async () => {
        const stats = await getRewardsStatistics();
        setStatistics(stats);
    };

    const filterRewards = () => {
        if (!searchQuery.trim()) {
            setFilteredRewards(rewards);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = rewards.filter((reward) => {
            const userName = reward.users?.name?.toLowerCase() || "";
            const userEmail = reward.users?.email?.toLowerCase() || "";
            return userName.includes(query) || userEmail.includes(query);
        });

        setFilteredRewards(filtered);
    };

    const handleEdit = (reward) => {
        setEditingId(reward.uid);
        setEditValue(reward.stars.toString());
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleSave = async (uid) => {
        const stars = parseInt(editValue);
        if (isNaN(stars) || stars < 0) {
            alert("Please enter a valid number of stars (0 or greater)");
            return;
        }

        const result = await updateUserRewards(uid, stars);
        if (result.success) {
            loadRewards();
            loadStatistics();
            setEditingId(null);
            setEditValue("");
        } else {
            alert("Failed to update rewards: " + result.error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header header="Rewards Management" link="/rewards" />

            <div className="px-4 sm:px-8 py-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800">{statistics.totalUsers}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FiStar className="text-blue-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Stars</p>
                                <p className="text-2xl font-bold text-gray-800">{statistics.totalStars}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <AiFillStar className="text-yellow-600 text-2xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Average Stars</p>
                                <p className="text-2xl font-bold text-gray-800">{statistics.averageStars}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <AiFillStar className="text-purple-600 text-2xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by user name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Rewards Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredRewards.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <AiFillStar className="text-gray-300 text-6xl mb-4" />
                            <p className="text-gray-500 text-lg">
                                {searchQuery ? "No rewards found matching your search" : "No rewards found"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stars
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRewards.map((reward) => (
                                        <tr key={reward.uid} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        {reward.users?.avatar ? (
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={reward.users.avatar}
                                                                alt={reward.users.name}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-500 font-medium">
                                                                    {reward.users?.name?.charAt(0) || reward.users?.email?.charAt(0) || "?"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {reward.users?.name || "Unknown User"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {reward.users?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingId === reward.uid ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div className="flex items-center">
                                                        <AiFillStar className="text-yellow-500 mr-1" />
                                                        <span className="text-sm font-semibold text-gray-900">{reward.stars}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(reward.last_updated)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {editingId === reward.uid ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleSave(reward.uid)}
                                                            className="text-green-600 hover:text-green-900 transition-colors"
                                                            title="Save changes"
                                                        >
                                                            <FiCheck className="text-lg" />
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <FiX className="text-lg" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(reward)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="Edit stars"
                                                    >
                                                        <FiEdit2 className="text-lg" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Results Info */}
                {!isLoading && filteredRewards.length > 0 && (
                    <div className="mt-4 text-sm text-gray-500 text-center">
                        Showing {filteredRewards.length} of {rewards.length} users with rewards
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rewards;
