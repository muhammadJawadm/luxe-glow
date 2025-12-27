import { useEffect, useRef, useState } from "react";
import { FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { createProduct, updateProduct } from "../../services/productServices";
import { fetchCategories } from "../../services/categoriesServices";
import { fetchBrands } from "../../services/brandsServices";

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_level: "",
    category_id: "",
    brand_id: "",
    description: "",
    rating: 0,
    image: null,
    imagePreview: "",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);


  // Fetch categories and brands
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          fetchCategories(),
          fetchBrands()
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading categories/brands:", error);
      }
    };
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock_level: product.stock_level || "",
        category_id: product.category_id || "",
        brand_id: product.brand_id || "",
        description: product.description || "",
        rating: product.rating || 0,
        image: null,
        imagePreview: product.product_images?.[0]?.image_url || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        stock_level: "",
        category_id: "",
        brand_id: "",
        description: "",
        rating: 0,
        image: null,
        imagePreview: "",
      });
    }
  }, [product]);

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
      stock_level: "",
      category_id: "",
      brand_id: "",
      description: "",
      rating: 0,
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

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.price || !formData.category_id || !formData.brand_id) {
      alert("Please fill in all required fields (name, price, category, brand)");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_level: parseInt(formData.stock_level) || 0,
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        rating: parseFloat(formData.rating) || 0,
      };

      if (product) {
        // Update existing product
        await updateProduct(product.id, productData);
        alert("Product updated successfully!");
      } else {
        // Create new product
        await createProduct(productData);
        alert("Product created successfully!");
      }

      // Call the onSave callback to refresh the product list
      if (onSave) {
        await onSave();
      }

      handleClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Image
            </label>
            <label className="cursor-pointer block w-full">
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
              />
              <img
                src={
                  formData.imagePreview ||
                  "https://images.unsplash.com/photo-1587754256282-a11d04e3472d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                }
                alt="Product preview"
                className="w-full h-40 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Click to upload image
              </p>
            </label>
          </div>

          {/* Two Column Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Price (MVR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            {/* Stock Level */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Stock Level
              </label>
              <input
                type="number"
                name="stock_level"
                value={formData.stock_level}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Enter product description..."
              />
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm"
          >
            {product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
