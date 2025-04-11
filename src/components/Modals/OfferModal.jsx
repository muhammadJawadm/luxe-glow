import React, { useEffect, useRef, useState } from "react";

const OfferModal = ({ offer, onClose, isOpen }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount: "",
    description: "",
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
    setFormData({
      name: "",
      price: "",
      discount: "",
      description: "",
      features: [],
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
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
          {offer ? "Edit Offer" : "Add New Offer"}
        </h2>

        {/* Image Upload */}
        <div className="w-full mb-4">
          <label className="cursor-pointer block w-full">
            <input type="file" className="hidden" />
            <img
              src="https://images.unsplash.com/photo-1606876430311-6b09172238b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Offer"
              className="w-full h-48 object-cover border border-gray-300 rounded-lg"
            />
          </label>
        </div>

        {/* Name */}
        <label className="block mb-2 text-sm font-medium">Offer Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter Offer name"
        />

        {/* Price */}
        <label className="block mb-2 text-sm font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter price"
        />

        {/* Discount */}
        <label className="block mb-2 text-sm font-medium">Discount (%)</label>
        <input
          type="number"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter discount"
        />

        {/* Description */}
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter description"
        />

        {/* Buttons */}
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
            Save Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;
