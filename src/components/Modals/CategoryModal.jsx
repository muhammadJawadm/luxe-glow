import React, { useEffect, useRef, useState } from "react";

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    features: [],
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClose = () => {
    setFormData({ name: "", price: "", features: [] });
    onClose();
  };

  const handleChange = (e) => {};

  const handleSubmit = () => {};

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div
        ref={modalRef}
        className="mx-4 bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {category ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="w-full mb-4">
          <label className="cursor-pointer block w-full">
            <input type="file" className="hidden" />
            <img
              src={
                "https://images.pexels.com/photos/19766277/pexels-photo-19766277/free-photo-of-colorful-autumn-leaves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt="Restaurant"
              className="w-full h-48 object-cover border border-gray-300 rounded-lg"
            />
          </label>
        </div>
        <label className="block mb-2 text-sm font-medium">Category Name</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter Category name"
        />

        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          type="number"
          name="description"
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter description"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-md"
          >
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
