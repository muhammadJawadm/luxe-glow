import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit, FiSearch, FiTrash2, FiTag, FiCalendar, FiPackage } from "react-icons/fi";
import DeleteModal from "../../components/Modals/DeleteModal";
import OfferModal from "../../components/Modals/OfferModal";
import { fetchOffers, deleteOffer } from "../../services/offersServices";

const Offers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offersData, setOffersData] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [offerToDelete, setOfferToDelete] = useState(null);

  useEffect(() => {
    const fetchOffersData = async () => {
      try {
        setLoading(true);
        const response = await fetchOffers();
        setOffersData(response || []);
        setFilteredOffers(response || []);
        console.log("Fetched offers:", response);
      } catch (error) {
        console.error("Error fetching offers data:", error);
        alert("Failed to load offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffersData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredOffers(offersData);
    } else {
      const filtered = offersData.filter(offer =>
        offer.products?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOffers(filtered);
    }
  }, [searchQuery, offersData]);

  const handleEditClick = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  const handleAddNewOffer = () => {
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;

    try {
      await deleteOffer(offerToDelete.id);
      const updatedOffers = offersData.filter(offer => offer.id !== offerToDelete.id);
      setOffersData(updatedOffers);
      setFilteredOffers(updatedOffers.filter(offer =>
        offer.products?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
      alert("Offer deleted successfully!");
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer. Please try again.");
    }
  };

  const handleOfferSaved = async () => {
    try {
      const response = await fetchOffers();
      setOffersData(response || []);
      setFilteredOffers(response || []);
    } catch (error) {
      console.error("Error refreshing offers:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const now = new Date();
    const expiry = new Date(expiryDate);
    return now > expiry;
  };

  return (
    <div>
      <Header header={"Exclusive Offers & Deals"} />
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
              placeholder="Search by product name..."
            />
          </div>
          <button
            onClick={handleAddNewOffer}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 cursor-pointer text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <FiTag className="text-lg" />
            Add New Offer
          </button>
        </div>

        <div className="my-3">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-lg">Loading offers...</div>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
              <FiTag className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery ? "No offers found matching your search." : "No offers available yet."}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNewOffer}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Your First Offer
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="relative group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    {!isExpired(offer.expire_it) ? (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Active
                      </div>
                    ) : (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Expired
                      </div>
                    )}
                  </div>

                  {/* Offer Image */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={offer.image_url || offer.products?.product_images?.[0]?.image_url || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={offer.products?.name || "Offer"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleEditClick(offer)}
                          className="p-2.5 rounded-full bg-white/90 text-primary hover:bg-white transition-all duration-200 shadow-lg"
                          title="Edit Offer"
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(offer)}
                          className="p-2.5 rounded-full bg-white/90 text-red-500 hover:bg-white transition-all duration-200 shadow-lg"
                          title="Delete Offer"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="p-4 space-y-3">
                    {/* Product Info */}
                    {offer.products && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-2">
                          {offer.products.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          <FiPackage className="text-primary flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="font-medium">{offer.products.categories?.name || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    {offer.products && (
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-600 mb-1">Product Price</p>
                        <p className="text-2xl font-bold text-primary">
                          ${offer.products.price}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <FiCalendar className="text-sm" />
                          Created
                        </span>
                        <span className="font-medium text-gray-700">
                          {formatDate(offer.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <FiCalendar className="text-sm" />
                          Expires
                        </span>
                        <span className={`font-medium ${isExpired(offer.expire_it) ? 'text-red-600' : 'text-gray-700'}`}>
                          {formatDate(offer.expire_it)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offer Edit Modal */}
      <OfferModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOffer(null);
        }}
        offer={selectedOffer}
        onSave={handleOfferSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOfferToDelete(null);
        }}
        onDelete={handleDeleteConfirm}
        entityType={"Offer"}
      />
    </div>
  );
};

export default Offers;
