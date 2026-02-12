import React, { useState } from "react";
import { FiX, FiUser, FiPhone, FiMapPin, FiFileText } from "react-icons/fi";

const CustomerInfoModal = ({ isOpen, onClose, onSubmit }) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        address: "",
        tin: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(customerInfo);
        onClose();
    };

    const handleSkip = () => {
        onSubmit({
            name: "",
            phone: "",
            address: "",
            tin: ""
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm my-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">Customer Information</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4">
                    <p className="text-xs text-gray-600 mb-4">
                        Enter customer details (optional) or skip this step.
                    </p>

                    <div className="space-y-3">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Customer Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiUser className="text-gray-400" size={16} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerInfo.name}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter customer name"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiPhone className="text-gray-400" size={16} />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <div className="relative">
                                <div className="absolute top-2 left-0 pl-2.5 pointer-events-none">
                                    <FiMapPin className="text-gray-400" size={16} />
                                </div>
                                <textarea
                                    name="address"
                                    value={customerInfo.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Enter customer address"
                                />
                            </div>
                        </div>

                        {/* TIN Number */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                TIN Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <FiFileText className="text-gray-400" size={16} />
                                </div>
                                <input
                                    type="text"
                                    name="tin"
                                    value={customerInfo.tin}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter TIN number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-2 mt-4">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-sm bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerInfoModal;
