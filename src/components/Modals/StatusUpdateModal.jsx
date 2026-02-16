import React, { useEffect, useRef, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

const StatusUpdateModal = ({ isOpen, onClose, onSave, currentStatus, orderId }) => {
    const modalRef = useRef(null);
    const [selectedStatus, setSelectedStatus] = useState(currentStatus || "pending");
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-800 border-blue-300" },
        { value: "shipping", label: "Shipping", color: "bg-purple-100 text-purple-800 border-purple-300" },
        { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800 border-green-300" },
        { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800 border-red-300" },
    ];

    useEffect(() => {
        if (isOpen) {
            setSelectedStatus(currentStatus || "pending");
        }
    }, [isOpen, currentStatus]);

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleClose = () => {
        setSelectedStatus(currentStatus || "pending");
        onClose();
    };

    const handleSubmit = async () => {
        if (selectedStatus === currentStatus) {
            alert("Please select a different status to update.");
            return;
        }

        setLoading(true);
        try {
            await onSave(orderId, selectedStatus);
            handleClose();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Blurred backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
                    onClick={handleClose}
                ></div>

                <div
                    ref={modalRef}
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg leading-6 font-semibold text-gray-900">
                                Update Order Status
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">Order ID: <span className="font-semibold">#{orderId}</span></p>
                            <p className="text-sm text-gray-600">Current Status: <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusOptions.find(s => s.value === currentStatus)?.color || 'bg-gray-100 text-gray-800'}`}>{currentStatus}</span></p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select New Status
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => setSelectedStatus(status.value)}
                                        className={`relative px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${selectedStatus === status.value
                                            ? `${status.color} border-opacity-100 shadow-md transform scale-105`
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{status.label}</span>
                                            {selectedStatus === status.value && (
                                                <FiCheck className="text-lg ml-1" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || selectedStatus === currentStatus}
                            className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-base font-medium text-white hover:from-primary/90 hover:to-primary/70 focus:outline-none sm:w-auto sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update Status"
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal;
