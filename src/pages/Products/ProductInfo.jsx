import React from "react";

const ProductInfo = ({
  title,
  price,
  stock,
  description,
  category,
  brand,
  rating,
  reviews,
}) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <p className="text-2xl font-bold text-gray-900">MVR {price}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stock Quantity
        </label>
        <p className="text-gray-900">{stock} units available</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <p className="text-gray-900 capitalize">{category}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand
        </label>
        <p className="text-gray-900 capitalize">{brand}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Average Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                }`}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-gray-600">
            {rating} ({reviews?.length || 0} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
