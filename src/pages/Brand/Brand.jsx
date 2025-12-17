import React, { useState, useEffect } from "react";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { FiEdit2, FiSearch, FiTrash2, FiPackage } from "react-icons/fi";
import BrandModal from "../../components/Modals/BrandModal";
import { fetchBrands, deleteBrand } from "../../services/brandsServices";

const Brand = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [brandToDelete, setBrandToDelete] = useState(null);

  useEffect(() => {
    fetchBrandsData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBrands(brandData);
    } else {
      const filtered = brandData.filter(brand =>
        brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, brandData]);

  const fetchBrandsData = async () => {
    try {
      setLoading(true);
      const response = await fetchBrands();
      setBrandData(response || []);
      setFilteredBrands(response || []);
      console.log("Brands Data:", response);
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
  };

  const handleAddNewBrand = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      await deleteBrand(brandToDelete.id);
      const updatedBrands = brandData.filter(brand => brand.id !== brandToDelete.id);
      setBrandData(updatedBrands);
      setFilteredBrands(updatedBrands.filter(brand =>
        brand.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setIsDeleteModalOpen(false);
      setBrandToDelete(null);
      alert("Brand deleted successfully!");
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand. Please try again.");
    }
  };

  const handleBrandSaved = async () => {
    await fetchBrandsData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Header header={"Manage brands"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Search brands..."
            />
          </div>
          <button
            onClick={handleAddNewBrand}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiPackage className="text-lg" />
            Add Brand
          </button>
        </div>

        <div className="my-3">
          {loading ? (
            <div className="flex items-center justify-center h-64 bg-white rounded-lg">
              <div className="text-gray-500 text-lg">Loading brands...</div>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
              <FiPackage className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery ? "No brands found matching your search." : "No brands available yet."}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNewBrand}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Your First Brand
                </button>
              )}
            </div>
          ) : (
            <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200 shadow-sm">
              <table className="w-full text-left rounded-xl overflow-hidden border border-gray-100">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/70 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">Brand Name</th>
                    <th className="px-6 py-4 font-semibold text-sm">Created At</th>
                    <th className="px-6 py-4 font-semibold text-sm text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {filteredBrands.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-gray-50/80 transition-colors duration-100"
                    >
                      <td className="px-6 py-4">
                        <h3 className="font-medium text-gray-800">
                          {item.name}
                        </h3>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 text-sm">
                          {formatDate(item.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="p-2 text-gray-500 cursor-pointer hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            onClick={() => handleEditClick(item)}
                            title="Edit Brand"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Delete Brand"
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
          )}
        </div>
      </div>

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSave={handleBrandSaved}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBrandToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
        entityType={"Brand"}
      />
    </div>
  );
};

export default Brand;