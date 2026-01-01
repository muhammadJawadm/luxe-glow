import { createBaseService } from './baseService';

const discountService = createBaseService('discounts')

export const fetchDiscounts = () => {
    try {
        const data = discountService.getAll({
            select: `*,products (*)`,
            orderBy: 'created_at',
            ascending: false
        });

        return data;
    } catch (error) {
        console.error('Error in fetchDiscounts:', error);
        return [];
    }
};

export const createDiscount = async (productId, discountPercentage, endDate = null) => {
    try {
        const discountData = {
            product_id: productId,
            discount_percentage: discountPercentage,
            start_date: new Date().toISOString(),
            end_date: endDate,
            is_active: true
        };
        const data = await discountService.create(discountData)
        return { success: true, data };
    } catch (error) {
        console.error('Error in createDiscount:', error);
        return { success: false, error };
    }
};

export const updateDiscount = async (id, discountPercentage, endDate = null) => {
    try {
        const data = await discountService.updateById(id, {
            discount_percentage: discountPercentage,
            end_date: endDate,
            is_active: true
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
};

export const deleteDiscount = async (id) => {
    try {
        const error = await discountService.deleteById(id);
        if (error) {
            console.error('Error deleting discount:', error);
            return error;
        }
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
};

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!discountPercentage || discountPercentage <= 0) return originalPrice;

    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;

    return Number(finalPrice.toFixed(2));
};
