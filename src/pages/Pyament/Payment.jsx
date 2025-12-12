import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch } from "react-icons/fi";
import { fetchPayments } from "../../services/paymentsServices";
const Payment = () => {
  const [paymentsData, setPaymentsData] = useState([]);

  useEffect(() => {
    // Fetch payments data from a local JSON file or an API endpoint
    const fetchPaymentsData = async () => {
      const response = await fetchPayments();
      console.log(response)
      setPaymentsData(response);
    }
    fetchPaymentsData();
  }, []);

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
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Payment ID</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Payment Date</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {paymentsData.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3">{payment.id}</td>
                    <td className="px-6 py-3">{payment.users.name}</td>
                    <td className="px-6 py-3">{formatTime(payment.paid_at)}</td>
                    <td className="px-6 py-3">{payment.discount ? `${payment.discount}%` : "0%"}</td>
                    <td className="px-6 py-3">{payment.amount}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {payment.status}
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

export default Payment;
