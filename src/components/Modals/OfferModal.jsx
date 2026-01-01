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
              {offer ? "Edit Offer" : "Add New Offer"}
            </h2>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Image
                </label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product *
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">-- Select a Product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - MVR {product.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expire_at"
                  value={formData.expire_at}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
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
              {loading ? "Saving..." : offer ? "Update Offer" : "Create Offer"}
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

export default OfferModal;