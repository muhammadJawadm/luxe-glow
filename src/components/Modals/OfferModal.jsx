import React, { useEffect, useRef, useState } from "react";
import { createOffer, updateOffer } from "../../services/offersServices";
import { supabase } from "../../lib/supabase";

const OfferModal = ({ offer, onClose, isOpen, onSave }) => {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const [formData, setFormData] = useState({
    product_ids: [],
    expire_at: "",
    image_url: "",
    discount: "",
  });

  // Fetch brands on open
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name")
        .order("name");
      if (!error && data) setBrands(data);
    };

    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  // Fetch products — all if no brand selected, filtered otherwise
  const fetchProducts = async (brandId) => {
    setProductsLoading(true);
    let query = supabase.from("products").select("id, name, price").order("name");
    if (brandId) query = query.eq("brand_id", brandId);
    const { data, error } = await query;
    setProducts(!error && data ? data : []);
    setProductsLoading(false);
  };

  // Fetch all products when modal opens
  useEffect(() => {
    if (isOpen) fetchProducts("");
  }, [isOpen]);

  // Re-fetch when brand filter changes
  const handleBrandFilter = (brandId) => {
    setSelectedBrandId(brandId);
    setFormData((prev) => ({ ...prev, product_ids: [] }));
    fetchProducts(brandId);
  };

  // Populate form when editing
  useEffect(() => {
    if (offer) {
      const initialProductIds =
        offer.offers_products && offer.offers_products.length > 0
          ? offer.offers_products
            .map((op) => op.products?.id || op.product_id)
            .filter((id) => id)
          : offer.product_id
            ? [offer.product_id]
            : [];

      setFormData({
        product_ids: initialProductIds,
        expire_at: offer.expire_at ? offer.expire_at.split("T")[0] : "",
        image_url: offer.image_url || "",
        discount: offer.discount ?? "",
      });
      setImagePreview(offer.image_url || null);

      // Pre-select brand from first product (if available)
      const firstOp = offer.offers_products?.[0];
      const brandId =
        firstOp?.products?.brand_id || offer.brand_id || "";
      setSelectedBrandId(brandId);
    } else {
      setFormData({
        product_ids: [],
        expire_at: "",
        image_url: "",
        discount: "",
      });
      setImagePreview(null);
      setSelectedBrandId("");
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
    setFormData({ product_ids: [], expire_at: "", image_url: "", discount: "" });
    setImageFile(null);
    setImagePreview(null);
    setSelectedBrandId("");
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `offers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, imageFile);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedBrandId) {
      alert("Please select a brand first");
      return;
    }
    if (formData.product_ids.length === 0) {
      alert("Please select at least one product");
      return;
    }
    if (!formData.expire_at) {
      alert("Please select an expiry date");
      return;
    }
    if (
      formData.discount !== "" &&
      (parseInt(formData.discount) < 1 || parseInt(formData.discount) > 99)
    ) {
      alert("Discount must be between 1 and 99 percent");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = formData.image_url;
      if (imageFile) imageUrl = await uploadImage();

      const offerData = {
        expire_at: formData.expire_at,
        image_url: imageUrl,
        discount: formData.discount !== "" ? parseInt(formData.discount) : null,
        brand_id: null,
      };

      if (offer) {
        await updateOffer(offer.id, offerData, formData.product_ids);
        alert("Offer updated successfully!");
      } else {
        await createOffer(offerData, formData.product_ids);
        alert("Offer created successfully!");
      }

      if (onSave) await onSave();
      handleClose();
    } catch (error) {
      console.error("Error saving offer:", error);
      if (
        error?.code === "23505" &&
        error?.message?.includes("offers_products_product_id_key")
      ) {
        alert(
          "An offer on one or more of these products already exists. Please select different products."
        );
      } else {
        alert("Failed to save offer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReadyToSubmit =
    selectedBrandId && formData.product_ids.length > 0 && formData.expire_at;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Blurred backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div className="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {offer ? "Edit Offer" : "Add New Offer"}
            </h2>

            <div className="space-y-6">
              {/* Step 1: Image Upload */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Upload Offer Image
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 ml-10">
                  Choose an attractive image for your offer.
                </p>
                <label className="cursor-pointer block w-full pr-10 ml-10">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="relative group">
                    <img
                      src={
                        imagePreview ||
                        "https://via.placeholder.com/400x300?text=Click+to+Upload+Offer+Image"
                      }
                      alt="Offer"
                      className="w-full h-48 object-cover border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white font-medium">
                        Click to change image
                      </span>
                    </div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-10">
                  Recommended size: 400×300px or similar ratio
                </p>
              </div>

              {/* Step 2: Product Selection with optional brand filter */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Select Products
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 ml-10">
                  Optionally filter by brand, then select products for this offer.
                </p>
                {/* Optional brand filter inside this step */}
                <div className="ml-10 mb-3">
                  <select
                    value={selectedBrandId}
                    onChange={(e) => handleBrandFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-10">
                  {productsLoading ? (
                    <div className="flex items-center justify-center h-20 border border-gray-200 rounded-md">
                      <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-sm text-gray-500">
                        Loading products…
                      </span>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded-md p-4 text-center text-sm text-gray-400">
                      No products found
                    </div>
                  ) : (
                    <>
                      {/* Select all / Clear */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {products.length} product(s) available
                        </span>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                product_ids: products.map((p) => p.id),
                              }))
                            }
                            className="text-xs text-primary hover:underline"
                          >
                            Select all
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                product_ids: [],
                              }))
                            }
                            className="text-xs text-gray-400 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="max-h-56 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2 bg-white">
                        {products.map((product) => (
                          <label
                            key={product.id}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.product_ids.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    product_ids: [
                                      ...prev.product_ids,
                                      product.id,
                                    ],
                                  }));
                                } else {
                                  setFormData((prev) => ({
                                    ...prev,
                                    product_ids: prev.product_ids.filter(
                                      (id) => id !== product.id
                                    ),
                                  }));
                                }
                              }}
                              className="w-4 h-4 text-primary focus:ring-primary rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              {product.name}{" "}
                              <span className="text-gray-400">
                                — MVR {product.price}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                      {formData.product_ids.length === 0 ? (
                        <p className="text-xs text-amber-600 mt-1">
                          ⚠️ At least one product is required
                        </p>
                      ) : (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {formData.product_ids.length} product(s) selected
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Step 3: Discount */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Set Discount (%)
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 ml-10">
                  Enter a discount percentage (1–99). Leave blank for no
                  discount.
                </p>
                <div className="ml-10 space-y-2">
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="1"
                      max="99"
                      step="1"
                      placeholder="e.g. 20"
                      className="w-full border border-gray-300 rounded-md p-2.5 pr-10 focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                      %
                    </span>
                  </div>
                  {formData.discount && (
                    <p className="text-xs text-green-600">
                      ✓ {formData.discount}% discount will be applied
                    </p>
                  )}
                </div>
              </div>

              {/* Step 4: Expiry Date */}
              <div className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                    4
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Set Expiry Date
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3 ml-10">
                  Select when this offer should expire.
                </p>
                <div className="ml-10">
                  <input
                    type="date"
                    name="expire_at"
                    value={formData.expire_at}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-primary"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  {!formData.expire_at && (
                    <p className="text-xs text-amber-600 mt-1">
                      ⚠️ Expiry date is required
                    </p>
                  )}
                  {formData.expire_at && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Offer will expire on{" "}
                      {new Date(formData.expire_at).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Summary / Ready box */}
              {isReadyToSubmit && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Ready to {offer ? "Update" : "Create"}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 ml-8">
                    All required fields are complete. Click "
                    {offer ? "Update" : "Create"} Offer" to proceed.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <button
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : offer
                  ? "Update Offer"
                  : "Create Offer"}
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