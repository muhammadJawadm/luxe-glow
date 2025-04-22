import React, { useState } from "react";
import DeleteModal from "../../components/Modals/DeleteModal";
import Header from "../../layouts/partials/header";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import BrandModal from "../../components/Modals/BrandModal";

const Brand = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleAddNewBrand = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const brandData = [
    {
      id: 1,
      title: "Matte Lipstick",
      brand: "Lips Co.",
      description: "A long-lasting matte lipstick for bold lips.",
      dateAndTime: "March 24, 2025, 10:00 AM",
      image:
        "https://images.pexels.com/photos/301367/pexels-photo-301367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      title: "Liquid Foundation",
      brand: "FacePro",
      description: "Smooth finish foundation with 24hr coverage.",
      dateAndTime: "March 24, 2025, 2:00 PM",
      image:
        "https://images.pexels.com/photos/2537930/pexels-photo-2537930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 3,
      title: "Eyeliner Pen",
      brand: "EyeLine",
      description: "Precision eyeliner pen for flawless eyes.",
      dateAndTime: "March 25, 2025, 9:00 AM",
      image:
        "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];
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
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search brands..."
            />
          </div>
          <button
            onClick={handleAddNewBrand}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/80 cursor-pointer text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          >
            Add Brand
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
                {brandData.map((item) => (
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
                          onClick={() => handleEditClick(item)}
                        >
                          <FiEdit2 />
                        </button>
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
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={selectedBrand}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        entityType={"Brand"}
      />
    </div>
  );
};

export default Brand;
