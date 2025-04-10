import React, { useState } from "react";
import CategoryModal from "../../components/Modals/CategoryModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };
  const categoryData = [
    {
      id: 1,
      title: "Moisturizers",
      description: "Hydrating creams and lotions for daily skincare routines.",
      dateAndTime: "April 10, 2025, 10:00 AM",
      image:
        "https://plus.unsplash.com/premium_photo-1664451177155-8247ae799c8b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "Cleansers",
      description: "Face washes and cleansing oils to purify the skin.",
      dateAndTime: "April 10, 2025, 12:00 PM",
      image:
        "https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Serums",
      description: "Concentrated formulas targeting specific skin concerns.",
      dateAndTime: "April 11, 2025, 09:00 AM",
      image:
        "https://plus.unsplash.com/premium_photo-1677110758260-e04d45879112?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=1",
    },
    {
      id: 4,
      title: "Foundations",
      description: "Base makeup products for flawless coverage.",
      dateAndTime: "April 11, 2025, 01:00 PM",
      image:
        "https://images.unsplash.com/photo-1631214499500-2e34edcaccfe?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      title: "Sunscreens",
      description: "SPF lotions and creams to protect from UV rays.",
      dateAndTime: "April 12, 2025, 11:00 AM",
      image:
        "https://plus.unsplash.com/premium_photo-1684407616442-8d5a1b7c978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div>
      <Header header={"Manage Categories"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white "
              placeholder="Search categories..."
            />
          </div>
          <button
            onClick={handleAddNewCategory}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/80
      cursor-pointer text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Add Category
          </button>
        </div>
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-700">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {categoryData.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white hover:bg-gray-50/80 transition-colors duration-100"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-gray-600 line-clamp-2 max-w-md">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <span className="text-gray-700">
                          {item.dateAndTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-gray-500 cursor-pointer hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          onClick={handleEditClick}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors  cursor-pointer"
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
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        entityType={"Category"}
      />
    </div>
  );
};

export default Categories;
