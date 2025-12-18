import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../layouts/partials/header";
import GalleryImages from "./GalleryImages";
import ReviewSection from "./ReviewSection";
import ProductInfo from "./ProductInfo";
import ProductModal from "../../components/Modals/ProductModal";
import { fetchProductById } from "../../services/productServices";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState(null);
  const galleryInputRef = useRef(null);

  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (data) {
          setProduct(data);
          console.log("Fetched product data:", data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);





  const handleAddGalleryImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalleryImage({
          url: reader.result,
          file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Confirm adding gallery image
  const confirmAddGalleryImage = () => {
    if (newGalleryImage) {
      setProduct((prev) => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage.url],
      }));
      setNewGalleryImage(null);
      galleryInputRef.current.value = "";
    }
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleRefreshProduct = async () => {
    try {
      const data = await fetchProductById(id);
      if (data) {
        setProduct(data);
      }
    } catch (err) {
      console.error("Error refreshing product:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <Header header={"Manage Products"} />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500 text-lg">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div>
        <Header header={"Manage Products"} />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-red-500 text-lg mb-4">{error || "Product not found"}</div>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header header={"Manage Products"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="min-h-screen bg-gray-50">
          <main>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg leading-6 font-medium text-black">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.categories?.name || "N/A"} • {product.stock_level || 0} in stock
                  </p>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                >
                  Edit Product
                </button>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Photo
                      </label>
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden h-80 flex items-center justify-center">
                        {product.product_images && product.product_images.length > 0 ? (
                          <img
                            src={product.product_images[0].image_url}
                            alt="Main product"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">
                            No image available
                          </span>
                        )}
                      </div>
                    </div>

                    <GalleryImages
                      gallery={product.product_images?.slice(1).map(img => img.image_url) || []}
                      removeImage={removeGalleryImage}
                      newGalleryImage={newGalleryImage}
                      confirmAddImage={confirmAddGalleryImage}
                      handleImageChange={handleAddGalleryImage}
                      cancelAddImage={() => setNewGalleryImage(null)}
                    />
                  </div>
                  <ProductInfo
                    title={product.name}
                    price={product.price}
                    stock={product.stock_level}
                    description={product.description}
                    category={product.categories?.name || "N/A"}
                    brand={product.brands?.name || "N/A"}
                    rating={product.rating || 0}
                    reviews={product.reviews}
                  />
                </div>

                <ReviewSection reviews={product.reviews} />
              </div>
            </div>
          </main>
        </div>
      </div>
      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={product}
        onSave={handleRefreshProduct}
      />
    </div>
  );
};

export default ProductDetail;
