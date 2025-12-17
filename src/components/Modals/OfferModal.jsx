import React, { useEffect, useRef, useState } from "react";
import { createOffer, updateOffer } from "../../services/offersServices";
import { supabase } from "../../lib/supabase";

const OfferModal = ({ offer, onClose, isOpen, onSave }) => {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    product_id: "",
    expire_at: "",
    image_url: "",
  });

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price")
        .order("name");
      
      if (!error && data) {
        setProducts(data);
      }
    };
    
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (offer) {
      setFormData({
        product_id: offer.product_id || "",
        expire_at: offer.expire_at ? offer.expire_at.split('T')[0] : "",
        image_url: offer.image_url || "",
      });
      setImagePreview(offer.image_url || null);
    } else {
      setFormData({
        product_id: "",
        expire_at: "",
        image_url: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [offer, isOpen]);

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
      product_id: "",
      expire_at: "",
      image_url: "",
    });
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `offers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.product_id) {
      alert("Please select a product");
      return;
    }
    if (!formData.expire_at) {
      alert("Please select an expiry date");
      return;
    }

    setLoading(true);

    try {
      // Upload image if new file selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const offerData = {
        product_id: formData.product_id,
        expire_at: formData.expire_at,
        image_url: imageUrl,
      };

      if (offer) {
        // Update existing offer
        await updateOffer(offer.id, offerData);
        alert("Offer updated successfully!");
      } else {
        // Create new offer
        await createOffer(offerData);
        alert("Offer created successfully!");
      }

      // Refresh the offers list
      if (onSave) {
        await onSave();
      }

      handleClose();
    } catch (error) {
      console.error("Error saving offer:", error);
      alert("Failed to save offer. Please try again.");
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
          {offer ? "Edit Offer" : "Add New Offer"}
        </h2>

        {/* Image Upload */}
        <div className="w-full mb-4">
          <label className="block mb-2 text-sm font-medium">Offer Image</label>
          <label className="cursor-pointer block w-full">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageChange}
            />
            <img
              src={imagePreview || "https://via.placeholder.com/400x300?text=Click+to+Upload"}
              alt="Offer"
              className="w-full h-48 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
            />
          </label>
          <p className="text-xs text-gray-500 mt-1">Click image to upload a new one</p>
        </div>

        {/* Product Selection */}
        <label className="block mb-2 text-sm font-medium">Select Product *</label>
        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          required
        >
          <option value="">-- Select a Product --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>

        {/* Expiry Date */}
        <label className="block mb-2 text-sm font-medium">Expiry Date *</label>
        <input
          type="date"
          name="expire_at"
          value={formData.expire_at}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
          min={new Date().toISOString().split('T')[0]}
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
            {loading ? "Saving..." : offer ? "Update Offer" : "Create Offer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;