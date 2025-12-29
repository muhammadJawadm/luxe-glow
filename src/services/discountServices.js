import { supabase } from '../lib/supabase';

/**
 * Fetch all discounts with product details
 */
export const fetchDiscounts = async () => {
    try {
        const { data, error } = await supabase
            .from('discounts')
            .select(`
        *,
        products (*)
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching discounts:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchDiscounts:', error);
        return [];
    }
};

/**
 * Create a new discount for a product
 */
export const createDiscount = async (productId, discountPercentage, endDate = null) => {
    try {
        const discountData = {
            product_id: productId,
            discount_percentage: discountPercentage,
            start_date: new Date().toISOString(),
            end_date: endDate,
            is_active: true
        };

        const { data, error } = await supabase
            .from('discounts')
            .insert([discountData])
            .select()
            .single();

        if (error) {
            console.error('Error creating discount:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in createDiscount:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update an existing discount
 */
export const updateDiscount = async (id, discountPercentage, endDate = null) => {
    try {
        const { data, error } = await supabase
            .from('discounts')
            .update({
                discount_percentage: discountPercentage,
                end_date: endDate
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating discount:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in updateDiscount:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a discount
 */
export const deleteDiscount = async (id) => {
    try {
        const { error } = await supabase
            .from('discounts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting discount:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in deleteDiscount:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Toggle discount active status
 */
export const toggleDiscountStatus = async (id, isActive) => {
    try {
        const { data, error } = await supabase
            .from('discounts')
            .update({ is_active: isActive })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error toggling discount status:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in toggleDiscountStatus:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get discount for a specific product
 */
export const getProductDiscount = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('discounts')
            .select('*')
            .eq('product_id', productId)
            .eq('is_active', true)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching product discount:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getProductDiscount:', error);
        return null;
    }
};

/**
 * Calculate discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!discountPercentage || discountPercentage <= 0) return originalPrice;

    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;

    return Number(finalPrice.toFixed(2));
};
