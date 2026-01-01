import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch, FiEye, FiX } from "react-icons/fi";
import { fetchPayments, fetchPaymentById } from "../../services/paymentsServices";
import Pagination from "../../components/Pagination";
const Payment = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    // Fetch payments data from a local JSON file or an API endpoint
    const fetchPaymentsData = async () => {
      const response = await fetchPayments(currentPage, itemsPerPage);
      console.log(response)
      setPaymentsData(response.data || []);
      setTotalItems(response.count || 0);
    }
    fetchPaymentsData();
  }, [currentPage]);

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

  const handleViewPayment = async (paymentId) => {
    const paymentData = await fetchPaymentById(paymentId);
    setSelectedPayment(paymentData);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedPayment(null);
  };

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
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search payments..."
            />
          </div>
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
                {paymentsData.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3">{payment.id}</td>
                    <td className="px-6 py-3"><h3 className="text-sm font-bold">{payment.users.name}</h3></td>
                    <td className="px-6 py-3">{formatTime(payment.paid_at)}</td>
                    <td className="px-6 py-3 text-base text-red-500">{payment.discount ? `${payment.discount}%` : "0%"}</td>
                    <td className="px-6 py-3 text-base text-green-500">{payment.amount}</td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Payment Details Modal */}
      {isViewModalOpen && selectedPayment && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl leading-6 font-bold text-gray-900">
                    Payment Details
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
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
                  onClick={handleCloseModal}
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

export default Payment;
