import { useEffect, useRef, useState } from "react";
import { FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const ProductModal = ({ product, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    category: "",
    description: "",
    image: null,
    imagePreview: "",
  });

  const categories = ["Sunscreen", "Lipsticks", "Blush", "Clothing", "Other"];

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
      title: "",
      price: "",
      location: "",
      category: "",
      description: "",
      image: null,
      imagePreview: "",
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Submitted product:", formData);
    handleClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-xl mx-4"
      >
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        {/* Image Upload */}
        <label className="block mb-2 text-sm font-medium">Product Image</label>
        <div className="w-full mb-4">
          <label className="cursor-pointer block w-full">
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <img
              src={
                formData.imagePreview ||
                "https://images.unsplash.com/photo-1587754256282-a11d04e3472d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="product"
              className="w-full h-48 object-cover border border-gray-300 rounded-lg"
            />
          </label>
        </div>

        {/* Title */}
        <label className="block mb-2 text-sm font-medium">Product Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter product name"
        />

        {/* Location */}
        <label className="block mb-2 text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter location"
        />

        {/* Price */}
        <label className="block mb-2 text-sm font-medium">Price ($)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter price"
        />

        {/* Category Dropdown */}
        <label className="block mb-2 text-sm font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Description */}
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          rows={4}
          placeholder="Write a short description of the product..."
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
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
