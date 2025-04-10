import React, { useState } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import DeleteModal from "../../components/Modals/DeleteModal";
import OfferModal from "../../components/Modals/OfferModal";

const Offers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offersData, setOffersData] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1583784561105-a674080f391e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "50% Off on Lipsticks",
      description: "Get 50% off on all lipsticks. Limited time offer!",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Buy 1 Get 1 Free on Foundations",
      description:
        "Buy one foundation and get another one for free. Don't miss out!",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1665072123924-5e52cd934d2e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "30% Off on Skincare Kits",
      description:
        "Enjoy 30% off on all skincare kits. Perfect for a fresh glow!",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1598121443852-ff347aff7520?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Free Makeup Bag with Every Purchase",
      description: "Receive a free makeup bag with every purchase above $50!",
    },
  ]);

  const handleEditClick = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (offer) => {
    setSelectedOffer(offer);
    setIsDeleteModalOpen(true);
  };

  const handleAddNewOffer = () => {
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const handleDeleteOffer = () => {
    setOffersData(offersData.filter((offer) => offer.id !== selectedOffer.id));
    setIsDeleteModalOpen(false);
  };
  return (
    <div>
      <Header header={"Exclusive Makeup Offers"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white"
              placeholder="Search offers..."
            />
          </div>
          <button
            onClick={handleAddNewOffer}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-primary hover:bg-primary/80 cursor-pointer text-white font-medium rounded-lg shadow-lg transition-colors duration-200"
          >
            Add Offer
          </button>
        </div>

        <div className="my-3">
          <div className="relative overflow-x-auto bg-white sm:rounded-lg border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offersData.map((offer) => (
                <div
                  key={offer.id}
                  className="relative group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Icons appearing on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out flex gap-2">
                    <button
                      onClick={() => handleEditClick(offer)}
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-200"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(offer)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {offer.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Edit Modal */}
      <OfferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        offer={selectedOffer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteOffer}
        entityType={"Offer"}
      />
    </div>
  );
};

export default Offers;
