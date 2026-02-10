import { createBaseService } from './baseService';

const checkoutConfigService = createBaseService('checkout_configs');

/**
 * Fetch the checkout configuration (should only be one row)
 * @returns {Promise<Object|null>} The checkout config object or null if error/not found
 */
export const fetchCheckoutConfig = async () => {
    try {
        const data = await checkoutConfigService.getAll({
            select: '*',
            limit: 1
        });

        // Return the first (and should be only) config row
        if (data && data.data && data.data.length > 0) {
            return data.data[0];
        }

        // If using non-paginated response
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        }

        return null;
    } catch (error) {
        console.error('Error in fetchCheckoutConfig:', error);
        return null;
    }
};

/**
 * Update the checkout configuration
 * @param {number} id - The ID of the config to update
 * @param {number} taxRate - Tax rate percentage (0-100)
 * @param {number} deliveryCharges - Delivery charges amount
 * @returns {Promise<Object>} Result object with success status
 */
export const updateCheckoutConfig = async (id, taxRate, deliveryCharges) => {
    try {
        // Validate tax rate
        if (taxRate < 0 || taxRate > 100) {
            return {
                success: false,
                error: 'Tax rate must be between 0 and 100'
            };
        }

        // Validate delivery charges
        if (deliveryCharges < 0) {
            return {
                success: false,
                error: 'Delivery charges cannot be negative'
            };
        }

        const updateData = {
            tax_rate: parseFloat(taxRate),
            delivery_charges: parseInt(deliveryCharges),
            last_updated: new Date().toISOString()
        };

        const data = await checkoutConfigService.updateById(id, updateData);

        if (!data) {
            return { success: false, error: 'Failed to update checkout config' };
        }

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error in updateCheckoutConfig:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
};
