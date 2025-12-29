import { supabase } from '../lib/supabase';

/**
 * Fetch all cart items with user and product details
 * Joins cart with users and products tables
 */
export const fetchAllCarts = async () => {
    try {
        const { data, error } = await supabase
            .from('cart')
            .select(`
        *,users(*),products(*, categories(*))
      `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching carts:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchAllCarts:', error);
        return [];
    }
};

/**
 * Delete a cart item by ID
 */
export const deleteCartItem = async (cartId) => {
    try {
        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('id', cartId);

        if (error) {
            console.error('Error deleting cart item:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in deleteCartItem:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Clear all cart items for a specific user
 */
export const clearUserCart = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('cart')
            .delete()
            .eq('uid', userId);

        if (error) {
            console.error('Error clearing user cart:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in clearUserCart:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get cart statistics
 */
export const getCartStatistics = async () => {
    try {
        const { data, error } = await supabase
            .from('cart')
            .select('id, quantity, products(*)');

        if (error) {
            console.error('Error fetching cart statistics:', error);
            return {
                totalItems: 0,
                totalProducts: 0,
                estimatedValue: 0
            };
        }

        const totalItems = data?.length || 0;
        const totalProducts = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const estimatedValue = data?.reduce((sum, item) => {
            const price = item.products?.price || 0;
            return sum + (price * item.quantity);
        }, 0) || 0;

        return {
            totalItems,
            totalProducts,
            estimatedValue
        };
    } catch (error) {
        console.error('Error in getCartStatistics:', error);
        return {
            totalItems: 0,
            totalProducts: 0,
            estimatedValue: 0
        };
    }
};
