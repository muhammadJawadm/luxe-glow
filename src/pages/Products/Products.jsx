import React, { useState } from "react";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { FiEdit2, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import ProductModal from "../../components/Modals/ProductModal";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const productData = [
    {
      id: 1,
      title: "Matte Lipstick",
      category: "Lips",
      dateAdded: "March 24, 2025, 10:00 AM",
      rating: 4,
      price: 15,
      image:
        "https://images.unsplash.com/photo-1587754256282-a11d04e3472d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Liquid Foundation",
      category: "Face",
      dateAdded: "March 24, 2025, 2:00 PM",
      price: 25,
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1608979048467-6194dabc6a3d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Eyeliner Pen",
      category: "Eyes",
      dateAdded: "March 25, 2025, 9:00 AM",
      price: 10,
      rating: 3,
      image:
        "https://images.unsplash.com/photo-1512207724313-a4e675ec79ab?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <div>
      <Header header={"Manage Products"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white "
              placeholder="Search products..."
            />
          </div>
          <button
            onClick={handleAddNewProduct}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/80 cursor-pointer text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Add product
          </button>
        </div>

        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Date Added</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {productData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white hover:bg-gray-50/80 transition-colors duration-100"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                        />
                        <h3 className="font-medium text-gray-800">
                          {item.title}
                        </h3>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{item.category}</td>
                    <td className="px-6 py-3 text-gray-600">${item.price}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <span className="ml-2 text-sm text-gray-600">
                          ({item.rating})
                        </span>
                        {Array.from({ length: 5 }, (_, i) =>
                          i < Math.floor(item.rating) ? (
                            <AiFillStar key={i} />
                          ) : (
                            <AiOutlineStar key={i} />
                          )
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-700">
                      {item.dateAdded}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-1">
                        <Link
                          to={`/product/${item.id}`}
                          className="p-2 text-gray-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <FiEye />
                        </Link>

                        <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        entityType={"Product"}
      />
    </div>
  );
};

export default Products;
