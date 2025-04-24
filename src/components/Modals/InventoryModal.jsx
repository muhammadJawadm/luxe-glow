import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const InventoryModal = ({ isOpen, onClose, products }) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    dateAndTime: "",
    inventoryType: "in", // 'in', 'out', or 'adjustment'
    notes: "",
    expirationDate: "",
    batchNumber: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: "",
        quantity: "",
        dateAndTime: new Date().toISOString().slice(0, 16), // Default to now
        inventoryType: "in",
        notes: "",
        expirationDate: "",
        batchNumber: "",
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inventoryData = {
      ...formData,
      quantity: Number(formData.quantity),
    };

    console.log("Inventory data:", inventoryData);
    onClose();
  };
  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Inventory Item</h2>
            <button onClick={onClose}>
              <FiX className="text-gray-500 hover:text-gray-700" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Inventory Type
              </label>
              <select
                name="inventoryType"
                value={formData.inventoryType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                required
              >
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Product
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                required
              >
                <option value="" disabled>
                  Select a product
                </option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <input
                type="datetime-local"
                name="dateAndTime"
                value={formData.dateAndTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Expiration Date
              </label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Batch/Lot Number
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/80"
              >
                Add Inventory
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default InventoryModal;
