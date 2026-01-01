import { supabase } from '../lib/supabase';

import { createBaseService } from "./baseService";

const cartService = createBaseService('cart');

export const fetchAllCarts = (page, limit) => cartService.getAll({ select: "*,users(*),products(*, categories(*), product_images(*))", page, limit })

export const fetchCartById = (id) => cartService.getById(id, `*,users(*),products(*, categories(*), product_images(*))`)

export const deleteCartItem = (cartId) => cartService.deleteById(cartId)

export const clearUserCart = async (userId) => {
    try {
        const { data, error } = await supabase.from('cart').delete().eq('uid', userId);

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

export const getCartStatistics = async () => {
    try {
        const { data, error } = cartService.getAll({
            select: 'id, quantity, products(*)'
        })
        if (error) {
            throw error;
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
        throw error;
    }
};
