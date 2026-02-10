import { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit } from "react-icons/fi";
import {
  fetchCheckoutConfig,
  updateCheckoutConfig
} from "../../services/checkoutConfigServices";

const Discount = () => {
  const [loading, setLoading] = useState(true);

  // Checkout Config state
  const [checkoutConfig, setCheckoutConfig] = useState(null);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [configFormData, setConfigFormData] = useState({
    taxRate: '',
    deliveryCharges: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const configData = await fetchCheckoutConfig();
    setCheckoutConfig(configData);
    setLoading(false);
  };

  // Checkout Config Handlers
  const handleEditConfig = () => {
    if (checkoutConfig) {
      setConfigFormData({
        taxRate: checkoutConfig.tax_rate,
        deliveryCharges: checkoutConfig.delivery_charges
      });
      setIsEditingConfig(true);
    }
  };

  const handleCancelConfigEdit = () => {
    setIsEditingConfig(false);
    setConfigFormData({
      taxRate: '',
      deliveryCharges: ''
    });
  };

  const handleSaveConfig = async () => {
    if (!checkoutConfig) {
      alert("No checkout config found to update");
      return;
    }

    const taxRate = parseFloat(configFormData.taxRate);
    const deliveryCharges = parseInt(configFormData.deliveryCharges);

    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      alert("Tax rate must be between 0 and 100");
      return;
    }

    if (isNaN(deliveryCharges) || deliveryCharges < 0) {
      alert("Delivery charges must be a positive number");
      return;
    }

    setConfigLoading(true);
    const result = await updateCheckoutConfig(checkoutConfig.id, taxRate, deliveryCharges);

    if (result.success) {
      setCheckoutConfig(result.data);
      setIsEditingConfig(false);
      setConfigFormData({
        taxRate: '',
        deliveryCharges: ''
      });
    } else {
      alert("Failed to update checkout config: " + result.error);
    }
    setConfigLoading(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <Header header={"Checkout Configuration"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">Manage Checkout Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Configure tax rate and delivery charges for all orders</p>
          </div>

          {/* Checkout Configuration Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Checkout Configuration</h3>
              <p className="text-sm text-white/80 mt-1">Manage tax rate and delivery charges</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !checkoutConfig ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <p className="text-base">No checkout configuration found</p>
                <p className="text-sm mt-1">Please create a checkout config record in the database</p>
              </div>
            ) : (
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tax Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Rate (%)
                    </label>
                    {isEditingConfig ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={configFormData.taxRate}
                        onChange={(e) => setConfigFormData({ ...configFormData, taxRate: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0-100"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">
                        {checkoutConfig.tax_rate}%
                      </div>
                    )}
                  </div>

                  {/* Delivery Charges */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Charges (MVR)
                    </label>
                    {isEditingConfig ? (
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={configFormData.deliveryCharges}
                        onChange={(e) => setConfigFormData({ ...configFormData, deliveryCharges: e.target.value })}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">
                        MVR {checkoutConfig.delivery_charges}
                      </div>
                    )}
                  </div>

                  {/* Last Updated */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </label>
                    <div className="text-sm text-gray-600 mt-2">
                      {formatTimestamp(checkoutConfig.last_updated)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {isEditingConfig ? (
                    <>
                      <button
                        onClick={handleCancelConfigEdit}
                        disabled={configLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveConfig}
                        disabled={configLoading}
                        className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
                      >
                        {configLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditConfig}
                      className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      <FiEdit className="mr-2" />
                      Edit Configuration
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discount;
