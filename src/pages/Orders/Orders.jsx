import React from "react";
import { FiSearch } from "react-icons/fi";
import Header from "../../layouts/partials/header";
const Orders = () => {
  const ordersData = [
    {
      id: 1,
      orderNumber: "ORD12345",
      customerName: "John Doe",
      orderDate: "2025-04-01",
      totalAmount: "$200.00",
      status: "Shipped",
    },
    {
      id: 2,
      orderNumber: "ORD12346",
      customerName: "Jane Smith",
      orderDate: "2025-04-02",
      totalAmount: "$150.00",
      status: "Pending",
    },
    {
      id: 3,
      orderNumber: "ORD12347",
      customerName: "Alice Johnson",
      orderDate: "2025-04-03",
      totalAmount: "$300.00",
      status: "Delivered",
    },
    {
      id: 4,
      orderNumber: "ORD12348",
      customerName: "Bob Brown",
      orderDate: "2025-04-04",
      totalAmount: "$100.00",
      status: "Shipped",
    },
  ];
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
              <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-100/80 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-3">Order Number</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Order Date</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {ordersData.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-3">{order.orderNumber}</td>
                    <td className="px-6 py-3">{order.customerName}</td>
                    <td className="px-6 py-3">{order.orderDate}</td>
                    <td className="px-6 py-3">{order.totalAmount}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Shipped"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
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

export default Orders;
