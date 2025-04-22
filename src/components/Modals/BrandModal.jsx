import React, { useEffect, useRef, useState } from "react";

const BrandModal = ({ isOpen, onClose, onSave, brand }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    features: [],
    description: "",
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
    setFormData({ name: "", price: "", features: [], description: "" });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

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
          {brand ? "Edit Brand" : "Add New Brand"}
        </h2>

        <div className="w-full mb-4">
          <label className="cursor-pointer block w-full">
            <input type="file" className="hidden" />
            <img
              src={
                "https://images.pexels.com/photos/3373744/pexels-photo-3373744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt="Brand"
              className="w-full h-48 object-cover border border-gray-300 rounded-lg"
            />
          </label>
        </div>

        <label className="block mb-2 text-sm font-medium">Brand Name</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter brand name"
        />

        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          name="description"
          onChange={handleChange}
          value={formData.description}
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
            Save Brand
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
