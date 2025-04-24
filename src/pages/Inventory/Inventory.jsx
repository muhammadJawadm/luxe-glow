import React, { useState } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import InventoryModal from "../../components/Modals/InventoryModal";

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Inventory item
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("inStock");

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddNewItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const inventoryData = [
    {
      id: 1,
      title: "Moisturizers",
      description: "Hydrating creams and lotions for daily skincare routines.",
      dateAndTime: "April 10, 2025, 10:00 AM",
      quantity: 10,
      image:
        "https://plus.unsplash.com/premium_photo-1664451177155-8247ae799c8b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Cleansers",
      description: "Face washes and cleansing oils to purify the skin.",
      dateAndTime: "April 10, 2025, 12:00 PM",
      quantity: 3,
      image:
        "https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Serums",
      description: "Concentrated formulas targeting specific skin concerns.",
      dateAndTime: "April 11, 2025, 09:00 AM",
      quantity: 7,
      image:
        "https://plus.unsplash.com/premium_photo-1677110758260-e04d45879112?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=1",
    },
    {
      id: 4,
      title: "Foundations",
      description: "Base makeup products for flawless coverage.",
      dateAndTime: "April 11, 2025, 01:00 PM",
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1631214499500-2e34edcaccfe?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      title: "Sunscreens",
      description: "SPF lotions and creams to protect from UV rays.",
      dateAndTime: "April 12, 2025, 11:00 AM",
      quantity: 15,
      image:
        "https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const filteredData =
    selectedTab === "inStock"
      ? inventoryData.filter((item) => item.quantity > 5)
      : inventoryData.filter((item) => item.quantity <= 5);

  return (
    <div>
      <Header header={"Manage Inventory"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedTab === "inStock"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedTab("inStock")}
            >
              In Stock
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedTab === "lowStock"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setSelectedTab("lowStock")}
            >
              Low Stock
            </button>
          </div>
          <button
            onClick={handleAddNewItem}
            className="px-4 py-2.5 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/80"
          >
            Add Inventory Item
          </button>
        </div>

        <div className="overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
          <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white hover:bg-gray-50/80 transition-colors duration-100"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                      />
                      <span className="font-medium text-gray-800">
                        {item.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-600 max-w-md line-clamp-2">
                    {item.description}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {item.dateAndTime}
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No items found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Inventory;
