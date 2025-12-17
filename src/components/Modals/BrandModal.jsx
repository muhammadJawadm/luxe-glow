import React, { useEffect, useRef, useState } from "react";
import { createBrand, updateBrand } from "../../services/brandsServices";

const BrandModal = ({ isOpen, onClose, onSave, brand }) => {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [brand, isOpen]);

  // Handle click outside
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

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a brand name");
      return;
    }

    setLoading(true);

    try {
      const brandData = {
        name: formData.name.trim(),
      };

      if (brand) {
        // Update existing brand
        await updateBrand(brand.id, brandData);
        alert("Brand updated successfully!");
      } else {
        // Create new brand
        await createBrand(brandData);
        alert("Brand created successfully!");
      }

      // Refresh the brands list
      if (onSave) {
        await onSave();
      }

      handleClose();
    } catch (error) {
      console.error("Error saving brand:", error);
      alert("Failed to save brand. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div
        ref={modalRef}
        className="mx-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {brand ? "Edit Brand" : "Add New Brand"}
        </h2>

        {/* Brand Name */}
        <label className="block mb-2 text-sm font-medium">Brand Name *</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
          className="w-full border rounded-lg p-2.5 mb-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Enter brand name"
          required
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;