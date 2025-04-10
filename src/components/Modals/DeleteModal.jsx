import React from "react";

const DeleteModal = ({ isOpen, onClose, entityType, onDelete }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50  flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="mx-4 bg-white rounded-lg p-6 shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
        <p>Are you sure you want to delete this {entityType}?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 cursor-pointer text-gray-700 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 cursor-pointer bg-primary bg-opacity-80 text-white rounded-md"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
