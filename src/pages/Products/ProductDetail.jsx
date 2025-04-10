import React, { useRef, useState } from "react";
import Header from "../../layouts/partials/header";
import GalleryImages from "./GalleryImages";
import ReviewSection from "./ReviewSection";
import ProductInfo from "./ProductInfo";

const ProductDetail = () => {
  const [product, setProduct] = useState({
    id: "prod_456",
    title: "Luxury Matte Lipstick",
    description:
      "A luxurious matte lipstick that provides long-lasting color and a smooth, velvety finish. Available in a variety of bold and neutral shades for every occasion.",
    category: "makeup",
    price: 24.99,
    stock: 100,
    photo:
      "https://images.unsplash.com/photo-1512207855369-643452a63d46?q=80&w=1983&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    gallery: [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1583784561105-a674080f391e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    rating: 4.8,
    reviews: [
      {
        id: "rev_1",
        author: "Emily Davis",
        rating: 5,
        comment:
          "The color is rich and the finish is flawless. Lasts all day without fading.",
        date: "2023-07-10",
      },
      {
        id: "rev_2",
        author: "Jessica Lee",
        rating: 4,
        comment:
          "Great lipstick, but a bit drying after a few hours. Would recommend using a lip balm underneath.",
        date: "2023-06-25",
      },
    ],
  });

  const [newGalleryImage, setNewGalleryImage] = useState(null);

  const galleryInputRef = useRef(null);

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

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  };

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
                    {product.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.category} • {product.stock} in stock
                  </p>
                </div>

                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary">
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
                        {product.photo ? (
                          <img
                            src={product.photo}
                            alt="Main product"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">
                            No image selected
                          </span>
                        )}
                      </div>
                    </div>

                    <GalleryImages
                      gallery={product.gallery}
                      removeImage={removeGalleryImage}
                      newGalleryImage={newGalleryImage}
                      confirmAddImage={confirmAddGalleryImage}
                      handleImageChange={handleAddGalleryImage}
                      cancelAddImage={() => setNewGalleryImage(null)}
                    />
                  </div>
                  <ProductInfo
                    title={product.title}
                    price={product.price}
                    stock={product.stock}
                    description={product.description}
                    category={product.category}
                    rating={product.rating}
                    reviews={product.reviews}
                  />
                </div>

                <ReviewSection reviews={product.reviews} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
