import React from "react";
import Header from "../../layouts/partials/header";
import { FiSearch } from "react-icons/fi";

const PosBills = () => {
  const billData = [
    {
      id: 1,
      billId: "BILL12345",
      customerName: "John Doe",
      billDate: "2025-04-01",
      totalAmount: "$200.00",
      status: "Paid",
    },
    {
      id: 2,
      billId: "BILL12346",
      customerName: "Jane Smith",
      billDate: "2025-04-02",
      totalAmount: "$150.00",
      status: "Unpaid",
    },
    {
      id: 3,
      billId: "BILL12347",
      customerName: "Alice Johnson",
      billDate: "2025-04-03",
      totalAmount: "$300.00",
      status: "Overdue",
    },
    {
      id: 4,
      billId: "BILL12348",
      customerName: "Bob Brown",
      billDate: "2025-04-04",
      totalAmount: "$100.00",
      status: "Paid",
    },
  ];

  return (
    <div>
      <Header header={"Manage Bills"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search bills..."
            />
          </div>
        </div>
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-sm text-left text-gray-600 rounded-lg overflow-hidden shadow-sm">
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Bill ID</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Bill Date</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {billData.map((bill) => (
                  <tr
                    key={bill.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3">{bill.billId}</td>
                    <td className="px-6 py-3">{bill.customerName}</td>
                    <td className="px-6 py-3">{bill.billDate}</td>
                    <td className="px-6 py-3">{bill.totalAmount}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bill.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : bill.status === "Unpaid"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bill.status}
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

export default PosBills;
