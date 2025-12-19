import { supabase } from "../lib/supabase";

// Fetch all ordered products with joined data
export const fetchOrderedProducts = async () => {
    const { data, error } = await supabase
        .from("ordered_products")
        .select(`
            *,
            products(id, name, price, categories(name)),
            orders(status, users(name))
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching ordered products:", error);
        throw error;
    }

    return data;
};

// Fetch ordered product by ID
export const fetchOrderedProductById = async (orderedProductId) => {
    const { data, error } = await supabase
        .from("ordered_products")
        .select(`
            *,
            products(id, name, price, categories(name)),
            orders(id, user_id, total_amount, status, users(name, email))
        `)
        .eq("id", orderedProductId)
        .single();

    if (error) {
        console.error("Error fetching ordered product by ID:", error);
        throw error;
    }

    return data;
};

// Fetch ordered products by order ID
export const fetchOrderedProductsByOrderId = async (orderId) => {
    const { data, error } = await supabase
        .from("ordered_products")
        .select(`
            *,
            products(id, name, price, categories(name))
        `)
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching ordered products by order ID:", error);
        throw error;
    }

    return data;
};

// Create new ordered product
export const createOrderedProduct = async (orderedProductData) => {
    const { data, error } = await supabase
        .from("ordered_products")
        .insert([orderedProductData])
        .select(`
            *,
            products(id, name, price, categories(name)),
            orders(id, user_id, total_amount, status, users(name, email))
        `);

    if (error) {
        console.error("Error creating ordered product:", error);
        throw error;
    }

    return data;
};

// Update ordered product
export const updateOrderedProduct = async (orderedProductId, updatedData) => {
    const { data, error } = await supabase
        .from("ordered_products")
        .update(updatedData)
        .eq("id", orderedProductId)
        .select(`
            *,
            products(id, name, price, categories(name)),
            orders(id, user_id, total_amount, status, users(name, email))
        `);

    if (error) {
        console.error("Error updating ordered product:", error);
        throw error;
    }

    return data;
};

// Delete ordered product
export const deleteOrderedProduct = async (orderedProductId) => {
    const { data, error } = await supabase
        .from("ordered_products")
        .delete()
        .eq("id", orderedProductId)
        .select();

    if (error) {
        console.error("Error deleting ordered product:", error);
        throw error;
    }

    return data;
};
