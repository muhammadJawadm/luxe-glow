import React, { useState } from "react";

const SellProductForm = ({ product, onSell }) => {
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("new");
  const [quantity, setQuantity] = useState(1);
  const [shippingOption, setShippingOption] = useState("standard");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSell({
      productId: product.id,
      name: product.name,
      price,
      condition,
      quantity,
      shippingOption,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={product.name}
            readOnly
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (MVR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              MVR
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-8 border border-gray-200 rounded px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="new">New</option>
            <option value="used-like-new">Used - Like New</option>
            <option value="used-good">Used - Good</option>
            <option value="used-fair">Used - Fair</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <div className="flex border border-gray-200 rounded overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-16 text-center border-x border-gray-200"
              min="1"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Options
          </label>
          <select
            value={shippingOption}
            onChange={(e) => setShippingOption(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="standard">Standard Shipping</option>
            <option value="expedited">Expedited Shipping</option>
            <option value="pickup">Local Pickup</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm transition-colors"
        >
          List Product for Sale
        </button>
      </div>
    </form>
  );
};

export default SellProductForm;
