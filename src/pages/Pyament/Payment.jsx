import React from "react";
import Header from "../../layouts/partials/header";
import { FiSearch } from "react-icons/fi";

const Payment = () => {
  const paymentData = [
    {
      id: 1,
      paymentId: "PAY12345",
      customerName: "John Doe",
      paymentDate: "2025-04-01",
      totalAmount: "$200.00",
      status: "Completed",
    },
    {
      id: 2,
      paymentId: "PAY12346",
      customerName: "Jane Smith",
      paymentDate: "2025-04-02",
      totalAmount: "$150.00",
      status: "Pending",
    },
    {
      id: 3,
      paymentId: "PAY12347",
      customerName: "Alice Johnson",
      paymentDate: "2025-04-03",
      totalAmount: "$300.00",
      status: "Failed",
    },
    {
      id: 4,
      paymentId: "PAY12348",
      customerName: "Bob Brown",
      paymentDate: "2025-04-04",
      totalAmount: "$100.00",
      status: "Completed",
    },
  ];

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
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {paymentData.map((payment) => (
                  <tr
                    key={payment.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3">{payment.paymentId}</td>
                    <td className="px-6 py-3">{payment.customerName}</td>
                    <td className="px-6 py-3">{payment.paymentDate}</td>
                    <td className="px-6 py-3">{payment.totalAmount}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === "Completed"
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
