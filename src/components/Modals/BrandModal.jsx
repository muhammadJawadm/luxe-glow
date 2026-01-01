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
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Blurred backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
          onClick={handleClose}
        ></div>

        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {brand ? "Edit Brand" : "Add New Brand"}
            </h2>

            <div className="space-y-4">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter brand name"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
            </button>
            <button
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;