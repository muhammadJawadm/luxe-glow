import { useEffect, useRef, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { createProduct, updateProduct } from "../../services/productServices";
import { fetchCategories } from "../../services/categoriesServices";
import { fetchBrands } from "../../services/brandsServices";
import { supabase } from "../../lib/supabase";

const EMPTY_FORM = {
  name: "",
  cost: "",
  price: "",
  stock_level: "",
  category_id: "",
  brand_id: "",
  description: "",
  rating: 0,
  upc_number: "",
};

const ProductModal = ({ product, isOpen, onClose, onSave }) => {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Existing images already saved in DB: [{ id, image_url }]
  const [existingImages, setExistingImages] = useState([]);
  // IDs of existing images marked for deletion
  const [imagesToDelete, setImagesToDelete] = useState([]);
  // New images picked this session: [{ file, preview }]
  const [newImages, setNewImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch categories and brands when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      try {
        const [cats, brnds] = await Promise.all([fetchCategories(), fetchBrands()]);
        setCategories(cats);
        setBrands(brnds);
      } catch (err) {
        console.error("Error loading categories/brands:", err);
      }
    };
    loadData();
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        cost: product.cost || "",
        price: product.price || "",
        stock_level: product.stock_level || "",
        category_id: product.categorie_id || "",
        brand_id: product.brand_id || "",
        description: product.description || "",
        rating: product.rating || 0,
        upc_number: product.upc_number || "",
      });
      setExistingImages(
        (product.product_images || []).map((img) => ({
          id: img.id,
          image_url: img.image_url,
        }))
      );
    } else {
      resetState();
    }
  }, [product]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) handleClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const resetState = () => {
    setFormData(EMPTY_FORM);
    setExistingImages([]);
    setImagesToDelete([]);
    setNewImages([]);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Image helpers ──────────────────────────────────────────────────────────

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const previews = files.map((file) => {
      const preview = URL.createObjectURL(file);
      return { file, preview };
    });
    setNewImages((prev) => [...prev, ...previews]);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const removeExistingImage = (id) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    setImagesToDelete((prev) => [...prev, id]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Upload a single file to Supabase Storage and return the public URL
  const uploadFile = async (file) => {
    const ext = file.name.split(".").pop();
    const name = `${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`;
    const path = `products/${name}`;

    const { error } = await supabase.storage.from("images").upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(path);
    return data.publicUrl;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category_id || !formData.brand_id) {
      alert("Please fill in all required fields (Name, Price, Category, Brand)");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload any new files
      const uploadedUrls = await Promise.all(newImages.map((n) => uploadFile(n.file)));

      const productPayload = {
        name: formData.name,
        description: formData.description,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        price: parseFloat(formData.price),
        stock_level: parseInt(formData.stock_level) || 0,
        categorie_id: formData.category_id,
        brand_id: formData.brand_id,
        rating: parseFloat(formData.rating) || 0,
        upc_number: formData.upc_number || null,
      };

      if (product) {
        // ── UPDATE ─────────────────────────────────────────────────────────
        await updateProduct(product.id, productPayload);

        // Delete images marked for removal
        if (imagesToDelete.length) {
          await supabase
            .from("product_images")
            .delete()
            .in("id", imagesToDelete);
        }

        // Insert new images
        if (uploadedUrls.length) {
          await supabase.from("product_images").insert(
            uploadedUrls.map((url) => ({ product_id: product.id, image_url: url }))
          );
        }

        alert("Product updated successfully!");
      } else {
        // ── CREATE ─────────────────────────────────────────────────────────
        const response = await createProduct(productPayload);
        const productId = response[0]?.id || response.id;

        // Insert all images (existing previews are local blobs; we only insert uploaded URLs)
        if (uploadedUrls.length && productId) {
          await supabase.from("product_images").insert(
            uploadedUrls.map((url) => ({ product_id: productId, image_url: url }))
          );
        }

        alert("Product created successfully!");
      }

      if (onSave) await onSave();
      handleClose();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        {/* Scrollable body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">

          {/* ── Multi-image grid ────────────────────────────────────────── */}
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Images{" "}
              <span className="text-gray-400 font-normal">({totalImages} photo{totalImages !== 1 ? "s" : ""})</span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {/* Existing images */}
              {existingImages.map((img) => (
                <div key={img.id} className="relative group aspect-square">
                  <img
                    src={img.image_url}
                    alt="product"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Remove image"
                  >
                    <FiX className="text-xs" />
                  </button>
                </div>
              ))}

              {/* New images (not yet uploaded) */}
              {newImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <img
                    src={img.preview}
                    alt="new product"
                    className="w-full h-full object-cover rounded-lg border-2 border-dashed border-primary/50"
                  />
                  {/* "new" badge */}
                  <span className="absolute bottom-1 left-1 text-[10px] bg-primary text-white rounded px-1 leading-4">
                    new
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Remove image"
                  >
                    <FiX className="text-xs" />
                  </button>
                </div>
              ))}

              {/* Add tile */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors text-gray-400 hover:text-primary"
              >
                <FiPlus className="text-2xl" />
                <span className="text-xs font-medium">Add Image</span>
              </button>
            </div>

            {/* Hidden multi-file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* ── Form fields ───────────────────────────────────────────────── */}
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

            {/* Cost */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Cost (MVR)</label>
              <input
                type="number"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Stock Level</label>
              <input
                type="number"
                name="stock_level"
                value={formData.stock_level}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* UPC */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                UPC / Barcode Number
              </label>
              <input
                type="text"
                name="upc_number"
                value={formData.upc_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="123456789012"
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
              <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : product ? "Update Product" : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
