import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch, FiEye, FiX, FiPlus } from "react-icons/fi";
import { fetchPayments, fetchPaymentById, createPayment } from "../../services/paymentsServices";
import Pagination from "../../components/Pagination";

const PosPayment = () => {
    const [paymentsData, setPaymentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // Add payment form state
    const [formData, setFormData] = useState({
        uid: '84472377-8350-4f89-b5f8-de0372b9402b',
        amount: "",
        discount: "",
        paymentDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchPaymentsData();
    }, [currentPage]);

    const fetchPaymentsData = async () => {
        try {
            setLoading(true);
            const response = await fetchPayments(currentPage, itemsPerPage);
            setPaymentsData(response.data || []);
            setTotalItems(response.count || 0);
        } catch (error) {
            console.error("Error fetching payments:", error);
            alert("Failed to load payments. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return date.toLocaleString('en-PK', options);
    }

    const handleViewPayment = async (paymentId) => {
        try {
            const paymentData = await fetchPaymentById(paymentId);
            setSelectedPayment(paymentData);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error("Error fetching payment details:", error);
            alert("Failed to load payment details.");
        }
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedPayment(null);
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setFormData({
            uid: '84472377-8350-4f89-b5f8-de0372b9402b',
            amount: "",
            discount: "",
            paymentDate: new Date().toISOString().split('T')[0],
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();

        try {
            // Create payment data object
            const paymentData = {
                uid: formData.uid,
                amount: parseFloat(formData.amount),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                paid_at: formData.paymentDate,
                stripe_id: 'MANUAL_POS_PAYMENT', // Placeholder for manual POS payments
            };

            await createPayment(paymentData);
            alert("Payment added successfully!");
            handleCloseAddModal();
            fetchPaymentsData(); // Refresh the list
        } catch (error) {
            console.error("Error creating payment:", error);
            alert("Failed to create payment. Please try again.");
        }
    };

    const filteredPayments = paymentsData.filter((payment) =>
        payment.users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.id?.toString().includes(searchQuery)
    );

    return (
        <div>
            <Header header={"Manage Payments"} />
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
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
                            placeholder="Search payments..."
                        />
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <FiPlus />
                        Add Payment
                    </button>
                </div>

                <div className="my-3">
                    <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
                        <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                <tr>
                                    <th className="px-6 py-3.5 font-medium">Payment ID</th>
                                    <th className="px-6 py-3.5 font-medium">Customer Name</th>
                                    <th className="px-6 py-3.5 font-medium">Payment Date</th>
                                    <th className="px-6 py-3.5 font-medium">Discount</th>
                                    <th className="px-6 py-3.5 font-medium">Total Amount</th>
                                    <th className="px-6 py-3.5 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/60">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            Loading payments...
                                        </td>
                                    </tr>
                                ) : filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            {searchQuery ? "No payments found matching your search." : "No payments available."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                                        >
                                            <td className="px-6 py-3">#{payment.id}</td>
                                            <td className="px-6 py-3">
                                                <h3 className="text-sm font-bold">{payment.users?.name || "N/A"}</h3>
                                            </td>
                                            <td className="px-6 py-3">{formatTime(payment.paid_at)}</td>
                                            <td className="px-6 py-3 text-base text-red-500">
                                                {payment.discount ? `${payment.discount}%` : "0%"}
                                            </td>
                                            <td className="px-6 py-3 text-base text-green-500 font-semibold">
                                                MVR {payment.amount}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewPayment(payment.id)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="View Details"
                                                    >
                                                        <FiEye className="text-lg" />
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

            {/* Add Payment Modal */}
            {isAddModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
                            onClick={handleCloseAddModal}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleAddPayment}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">
                                            Add Manual Payment
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={handleCloseAddModal}
                                            className="text-gray-400 hover:text-gray-500 transition-colors"
                                        >
                                            <FiX className="text-2xl" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount (MVR) *
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="discount"
                                                value={formData.discount}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Date *
                                            </label>
                                            <input
                                                type="date"
                                                name="paymentDate"
                                                value={formData.paymentDate}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                                    >
                                        Add Payment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseAddModal}
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

            {/* View Payment Details Modal */}
            {isViewModalOpen && selectedPayment && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
                            onClick={handleCloseViewModal}
                        ></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl leading-6 font-bold text-gray-900">
                                        Payment Details
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={handleCloseViewModal}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <FiX className="text-2xl" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Payment Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Payment Information</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment ID</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">#{selectedPayment.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Date</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{formatTime(selectedPayment.paid_at)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                                                <p className="text-lg font-bold text-primary mt-1">MVR {selectedPayment.amount}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Discount</p>
                                                <p className="text-sm font-medium text-gray-900 mt-1">{selectedPayment.discount ? `${selectedPayment.discount}%` : "0%"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Customer Information</h4>
                                        <div className="flex items-center space-x-4">
                                            {selectedPayment.users?.profile ? (
                                                <img
                                                    src={selectedPayment.users.profile}
                                                    alt={selectedPayment.users.name}
                                                    className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-gray-600 text-xl font-bold">
                                                        {selectedPayment.users?.name?.charAt(0) || selectedPayment.users?.email?.charAt(0) || "?"}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {selectedPayment.users?.name || "Unknown User"}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedPayment.users?.email || "No email"}
                                                </p>
                                                {selectedPayment.users?.phone && (
                                                    <p className="text-sm text-gray-600">
                                                        {selectedPayment.users.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Information */}
                                    {selectedPayment.orders && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Order Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                                                    <p className="text-sm font-medium text-gray-900 mt-1">#{selectedPayment.orders.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
                                                    <p className="text-sm font-medium mt-1">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${selectedPayment.orders.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            selectedPayment.orders.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                selectedPayment.orders.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {selectedPayment.orders.status || 'N/A'}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                                                    <p className="text-sm font-medium text-gray-900 mt-1">MVR {selectedPayment.orders.total_amount || '0'}</p>
                                                </div>
                                                {selectedPayment.orders.created_at && (
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                                                        <p className="text-sm font-medium text-gray-900 mt-1">{formatTime(selectedPayment.orders.created_at)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleCloseViewModal}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
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

export default PosPayment;