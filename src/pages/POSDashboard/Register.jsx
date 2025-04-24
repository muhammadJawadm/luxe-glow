import React, { useState } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch } from "react-icons/fi";
import RegisterModal from "../../components/Modals/RegisterModal";

const Register = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (register) => {
    setSelectedRegister(register);
    setIsModalOpen(true);
  };

  const handleAddNewRegister = () => {
    setSelectedRegister(null);
    setIsModalOpen(true);
  };

  const registerData = [
    {
      id: 1,
      registerNumber: "001",
      openedAt: "April 10, 2025, 09:00 AM",
      closedAt: "April 10, 2025, 05:00 PM",
      duration: "8h",
      cashAtOpen: "$200",
      cashAtClose: "$1200",
    },
    {
      id: 2,
      registerNumber: "002",
      openedAt: "April 11, 2025, 08:30 AM",
      closedAt: "April 11, 2025, 04:30 PM",
      duration: "8h",
      cashAtOpen: "$150",
      cashAtClose: "$950",
    },
    {
      id: 3,
      registerNumber: "003",
      openedAt: "April 12, 2025, 10:00 AM",
      closedAt: "April 12, 2025, 06:00 PM",
      duration: "8h",
      cashAtOpen: "$100",
      cashAtClose: "$700",
    },
  ];
  return (
    <div>
      <Header header={"Cashier Register Management"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search registers..."
            />
          </div>
          <button
            onClick={handleAddNewRegister}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/80
            cursor-pointer text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Add Register
          </button>
        </div>

        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Register Number</th>
                  <th className="px-6 py-3 font-medium">Opened At</th>
                  <th className="px-6 py-3 font-medium">Closed At</th>
                  <th className="px-6 py-3 font-medium">Duration</th>
                  <th className="px-6 py-3 font-medium">Cash at Open</th>
                  <th className="px-6 py-3 font-medium">Cash at Close</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {registerData.map((register) => (
                  <tr
                    key={register.id}
                    className="bg-white hover:bg-gray-50/80 transition-colors duration-100"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">
                      {register.registerNumber}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {register.openedAt}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {register.closedAt}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {register.duration}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {register.cashAtOpen}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {register.cashAtClose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && (
          <RegisterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            register={selectedRegister}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
