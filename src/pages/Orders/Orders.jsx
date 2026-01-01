import React, { useEffect } from "react";
import { FiSearch, FiEye, FiX } from "react-icons/fi";
import Header from "../../layouts/partials/header";
import { fetchOrders, fetchOrderById } from "../../services/orderServices";
import Pagination from "../../components/Pagination";
const Orders = () => {
  const [ordersData, setOrdersData] = React.useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  useEffect(() => {
    // Fetch orders data from a local JSON file or an API endpoint
    const fetchOrdersData = async () => {
      const response = await fetchOrders(currentPage, itemsPerPage);
      setOrdersData(response.data || []);
      setTotalItems(response.count || 0);
      console.log(response)
    }
    fetchOrdersData();
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

  const handleViewOrder = async (orderId) => {
    const orderData = await fetchOrderById(orderId);
    setSelectedOrder(orderData);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };
  return (
    <div>
      <Header header={"Manage Orders"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white "
              placeholder="Search orders..."
            />
          </div>
        </div>
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Order Number</th>
                  <th className="px-6 py-3.5 font-medium">Customer Name</th>
                  <th className="px-6 py-3.5 font-medium">Order Date</th>
                  <th className="px-6 py-3.5 font-medium">Total Amount</th>
                  <th className="px-6 py-3.5 font-medium">Deliver Time</th>
                  <th className="px-6 py-3.5 font-medium">Is Placed</th>
                  <th className="px-6 py-3.5 font-medium">Status</th>
                  <th className="px-6 py-3.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {ordersData.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3">{order.id}</td>
                    <td className="px-6 py-3"><h3 className="font-semibold">{order.users.name}</h3></td>
                    <td className="px-6 py-3">{formatTime(order.created_at)}</td>
                    <td className="px-6 py-3">{order.payments.amount}</td>
                    <td className="px-6 py-3">{order.deliver_time}</td>
                    {/* <td className="px-6 py-3">{order.status}</td> */}
                    <td className="px-6 py-3">{order.is_placed ? "Yes" : "No"}</td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "active"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="View Details"
                        >
                          <FiEye className="text-lg" />
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

      {/* View Order Details Modal with Blurred Background */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Blurred backdrop */}
            <div
              className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl leading-6 font-bold text-gray-900">
                    Order Details
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
                  {/* Order Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Order Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Number</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">#{selectedOrder.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Date</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{formatTime(selectedOrder.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Time</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{selectedOrder.deliver_time || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order Placed</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{selectedOrder.is_placed ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <p className="text-sm font-medium mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedOrder.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                            {selectedOrder.status || 'N/A'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Customer Information</h4>
                    <div className="flex items-center space-x-4">
                      {selectedOrder.users?.profile ? (
                        <img
                          src={selectedOrder.users.profile}
                          alt={selectedOrder.users.name}
                          className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-xl font-bold">
                            {selectedOrder.users?.name?.charAt(0) || selectedOrder.users?.email?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedOrder.users?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.users?.email || "No email"}
                        </p>
                        {selectedOrder.users?.phone && (
                          <p className="text-sm text-gray-600">
                            {selectedOrder.users.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {selectedOrder.payments && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Payment Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Payment ID</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">#{selectedOrder.payments.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Date</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{formatTime(selectedOrder.payments.paid_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                          <p className="text-lg font-bold text-primary mt-1">MVR {selectedOrder.payments.amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Discount</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{selectedOrder.payments.discount ? `${selectedOrder.payments.discount}%` : "0%"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Information */}
                  {selectedOrder.address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Delivery Address</h4>
                      <p className="text-sm text-gray-900">{selectedOrder.address}</p>
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

export default Orders;
