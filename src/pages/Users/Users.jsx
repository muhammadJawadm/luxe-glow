import React from "react";
import Header from "../../layouts/partials/header";
import { FiSearch } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Users = () => {
  const usersData = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "+123456789",
      profilePicture:
        "https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Active",
      redeemPoints: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phoneNumber: "+987654321",
      profilePicture:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Inactive",
      redeemPoints: 4,
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phoneNumber: "+1122334455",
      profilePicture:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Active",
      redeemPoints: 1,
    },
    {
      id: 4,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phoneNumber: "+1122334455",
      profilePicture:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1600",
      status: "Active",
      redeemPoints: 3,
    },
  ];
  return (
    <div>
      <Header header={"Manage Users"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white "
              placeholder="Search users..."
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
                  <th className="px-6 py-3">Phn. No</th>
                  <th className="px-6 py-3">Redeem Points</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {usersData.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profilePicture}
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
                        {user.emailVerified && (
                          <svg
                            className="w-3.5 h-3.5 ml-1.5 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-700/90">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <span className="ml-2 text-sm text-gray-600">
                          ({user.redeemPoints})
                        </span>
                        {Array.from({ length: 5 }, (_, i) =>
                          i < Math.floor(user.redeemPoints) ? (
                            <AiFillStar key={i} />
                          ) : (
                            <AiOutlineStar key={i} />
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
