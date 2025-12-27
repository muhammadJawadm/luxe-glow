import React, { useState } from "react";
import Header from "../../layouts/partials/header";
import { FiCopy, FiEdit, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import DeleteModal from "../../components/Modals/DeleteModal";
import CouponModal from "../../components/Modals/CouponModal";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("discounts");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "SUMMER20",
      discountType: "percentage",
      value: 20,
      minOrder: 50,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      usageLimit: 100,
      usedCount: 42,
      appliesTo: "all",
      active: true,
    },
    {
      id: 2,
      code: "FREESHIP",
      discountType: "fixed",
      value: 5.99,
      minOrder: 30,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      usageLimit: null, // unlimited
      usedCount: 128,
      appliesTo: "shipping",
      active: true,
    },
    {
      id: 3,
      code: "NEWCUST10",
      discountType: "percentage",
      value: 10,
      minOrder: 0,
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      usageLimit: 50,
      usedCount: 50,
      appliesTo: "all",
      active: false,
    },
  ]);

  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setIsCouponModalOpen(true);
  };

  const handleEditCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsCouponModalOpen(true);
  };

  const handleDeleteCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCoupon = () => {
    setCoupons(coupons.filter((coupon) => coupon.id !== selectedCoupon.id));
    setIsDeleteModalOpen(false);
  };

  const toggleCouponStatus = (couponId) => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === couponId ? { ...coupon, active: !coupon.active } : coupon
      )
    );
  };

  return (
    <div>
      <Header header={"Discount Settings"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Coupon Codes</h2>
            <button
              onClick={handleAddCoupon}
              className="flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary/80 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
            >
              <FiPlus className="mr-2" />
              Add Coupon
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Discount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applies To
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Usage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dates
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.value}% off`
                          : `MVR ${coupon.value.toFixed(2)} off`}
                        {coupon.minOrder > 0 && (
                          <div className="text-xs text-gray-500">
                            Min order: MVR {coupon.minOrder}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {coupon.appliesTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.usedCount}
                        {coupon.usageLimit ? `/${coupon.usageLimit}` : ""} uses
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {coupon.startDate} to {coupon.endDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        onClick={() => toggleCouponStatus(coupon.id)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${coupon.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 cursor-pointer"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon)}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isCouponModalOpen && (
        <CouponModal
          isOpen={isCouponModalOpen}
          onClose={() => setIsCouponModalOpen(false)}
          coupon={selectedCoupon}
          onSave={(newCoupon) => { }}
        />
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        entityType={"Coupon"}
      />
    </div>
  );
};

export default Settings;
