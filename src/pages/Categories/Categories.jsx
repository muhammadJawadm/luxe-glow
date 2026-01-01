import React, { useState, useEffect } from "react";
import CategoryModal from "../../components/Modals/CategoryModal";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { deleteCategory, fetchCategories, createCategory, updateCategory } from "../../services/categoriesServices";
import { FiEdit, FiSearch, FiTrash2, FiPlus } from "react-icons/fi";
import Pagination from "../../components/Pagination";

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fectchCategoriesData = async () => {
    const response = await fetchCategories(currentPage, itemsPerPage);
    setCategoryData(response.data || []);
    setTotalItems(response.count || 0);
    console.log("Categories Data:", response);
  }

  useEffect(() => {
    fectchCategoriesData();
  }, [currentPage]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddNewCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (formData) => {
    if (selectedCategory) {
      // Update
      const response = await updateCategory(selectedCategory.id, formData);
      if (response) {
        await fectchCategoriesData();
        setIsModalOpen(false);
      }
    } else {
      // Create
      const response = await createCategory(formData);
      if (response) {
        await fectchCategoriesData();
        setIsModalOpen(false);
      }
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  }

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      await deleteCategory(selectedCategory.id);
      await fectchCategoriesData();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    }
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            <FiPlus className="text-lg" />
            Add Category
          </button>
        </div>
        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <table className="w-full text-left rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Title</th>
                  {/* <th className="px-6 py-3.5 font-medium">Description</th> */}
                  <th className="px-6 py-3.5 font-medium">Created At </th>
                  <th className="px-6 py-3.5 font-medium">Actions</th>
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
                          className="p-2 text-gray-500 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={() => handleEditClick(item)}
                          title="Edit Category"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <FiTrash2 className="text-lg" />
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
        onSave={handleSaveCategory}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteCategory}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Categories;
