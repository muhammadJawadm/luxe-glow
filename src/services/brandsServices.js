import { supabase } from "../lib/supabase";

// Fetch all brands
export const fetchBrands = async () => {
    const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error('Error fetching brands:', error);
        throw error;
    }
    return data;
};

// Fetch brand by ID
export const fetchBrandById = async (id) => {
    const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error('Error fetching brand by ID:', error);
        throw error;
    }
    return data;
};

// Create new brand
export const createBrand = async (brandData) => {
    const { data, error } = await supabase
        .from("brands")
        .insert([brandData])
        .select();

    if (error) {
        console.error('Error creating brand:', error);
        throw error;
    }
    return data;
};

// Update brand
export const updateBrand = async (id, updatedData) => {
    const { data, error } = await supabase
        .from("brands")
        .update(updatedData)
        .eq("id", id)
        .select();

    if (error) {
        console.error('Error updating brand:', error);
        throw error;
    }
    return data;
};

// Delete brand
export const deleteBrand = async (id) => {
    const { data, error } = await supabase
        .from("brands")
        .delete()
        .eq("id", id)
        .select();

    if (error) {
        console.error('Error deleting brand:', error);
        throw error;
    }
    return data;
};