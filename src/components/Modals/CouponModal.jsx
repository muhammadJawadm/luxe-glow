import React, { useState } from "react";

const CouponModal = ({ isOpen, onClose, coupon, onSave }) => {
  const [formData, setFormData] = useState(
    coupon || {
      code: "",
      discountType: "percentage",
      value: "",
      minOrder: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      appliesTo: "all",
      active: true,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {coupon ? "Edit Coupon" : "Add New Coupon"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black  mb-1">
                    Coupon code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-2"
                    placeholder="Enter coupon code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Discount Type *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-2"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black  mb-1">
                    {formData.discountType === "percentage"
                      ? "Discount % *"
                      : "Discount Amount *"}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    min="0"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                    className="w-full border border-black rounded-md p-2"
                    placeholder="Enter discount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black  mb-1">
                    Minimum Order
                  </label>
                  <input
                    type="text"
                    name="minOrder"
                    value={formData.minOrder}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-2"
                    placeholder="Enter minimum order"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="text"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-2"
                    placeholder="Enter usage limit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black  mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full border border-black    rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black  mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black  mb-1">
                    Applies To *
                  </label>
                  <select
                    name="appliesTo"
                    value={formData.appliesTo}
                    onChange={handleChange}
                    className="w-full border border-black rounded-md p-2"
                  >
                    <option value="all">All Products</option>
                    <option value="specific">Specific Products</option>
                    <option value="category">Specific Categories</option>
                    <option value="shipping">Shipping Only</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="active"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-black rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
