import React, { useState } from "react";
import Header from "../../layouts/partials/header";
import SellProductForm from "./SellProductForm";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
const dummyProducts = [
  {
    id: 1,
    name: "Camera",
    image:
      "https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "DSLR Camera",
    categories: ["Electronics", "Photography"],
  },
  {
    id: 2,
    name: "Headphones",
    image:
      "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Wireless Bluetooth Headphones",
    categories: ["Electronics", "Audio"],
  },
  {
    id: 3,
    name: "Laptop",
    image:
      "https://images.pexels.com/photos/129208/pexels-photo-129208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description: "Gaming Laptop",
    categories: ["Electronics", "Computers"],
  },
];
const PosSell = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCustomProductForm, setShowCustomProductForm] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchQuery("");
    setShowCustomProductForm(false);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setShowCustomProductForm(false);
  };

  const handleSellSubmit = (data) => {
    console.log("Sell Info Submitted:", data);
    alert("Product listed successfully!");
    setSelectedProduct(null);
    setShowCustomProductForm(false);
  };

  const filteredProducts = dummyProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header header="Sell Products" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Search and Product Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sell Products</h2>

            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Search products..."
                onFocus={() => setShowCustomProductForm(false)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {searchQuery && filteredProducts.length > 0 && (
            <div className="absolute z-10 mt-1 w-full md:w-96 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="cursor-pointer px-4 py-3 hover:bg-blue-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!selectedProduct && !showCustomProductForm && (
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiPlus className="text-blue-500" />
                <span>Add Custom Product</span>
              </Link>

              <div className="flex-1 flex items-center">
                <div className="h-px bg-gray-200 w-full"></div>
                <span className="px-4 text-sm text-gray-500">OR</span>
                <div className="h-px bg-gray-200 w-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {dummyProducts.slice(0, 3).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 mx-auto object-contain mb-2"
                    />
                    <span className="text-sm font-medium">{product.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {selectedProduct && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Selling: {selectedProduct.name}
              </h2>
              <button
                onClick={handleClearSelection}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-48 object-contain rounded"
                  />
                  <div className="mt-4">
                    <h3 className="font-bold text-lg">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedProduct.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedProduct.categories?.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-primary/10 text-primary/80 text-xs rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <SellProductForm
                  product={selectedProduct}
                  onSell={handleSellSubmit}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosSell;
