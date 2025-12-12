import React, { useState } from "react";
import CategoryModal from "../../components/Modals/CategoryModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { deleteCategory, fetchCategories } from "../../services/categoriesServices";
import { useEffect } from "react";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fectchCategoriesData = async () => {
      const response = await fetchCategories();
      setCategoryData(response); 
      console.log("Categories Data:", response);
      }
    fectchCategoriesData();
  }, []); 

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };
  
const handleDeleteCategory = (categoryId) => {
    deleteCategory(categoryId);
    // Implement delete category functionality
  }

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
                  {/* <th className="px-6 py-3 font-medium">Description</th> */}
                  <th className="px-6 py-3 font-medium">Created At </th>
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
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                    </td>
                 
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <span className="text-gray-700">
                          {item.created_at}
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
        onDelete={() => handleDeleteCategory(selectedCategory.id)}
      />
    </div>
  );
};

export default Categories;
