import React from "react";

const RegisterModal = ({ isOpen, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Cashier Register Form</h2>

        <form className="space-y-4">
          {/* Cashier Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Employee ID</label>
              <input
                type="text"
                placeholder="EMP-1234"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Shift and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Shift</label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">Select Shift</option>
                <option value="morning">Morning (8am - 2pm)</option>
                <option value="afternoon">Afternoon (2pm - 8pm)</option>
                <option value="night">Night (8pm - 2am)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Cash & Payments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Starting Cash Balance
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Card Payments</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Online Payments</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1">Additional Notes</label>
            <textarea
              rows="3"
              placeholder="Any observations or remarks"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md "
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
