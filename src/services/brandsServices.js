import { supabase } from "../lib/supabase";

export const fetchBrands = async () => {
    const { data, error } = await supabase.from("brands").select("*");
    if (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
    return data;
};

export const fetchBrandById = async (id) => {
    const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error('Error fetching brand by ID:', error);
        return null;
    }
    return data;
};

export const createBrand = async (brandData) => {
    const { data, error } = await supabase.from("brands").insert(brandData);
    if (error) {
        console.error('Error creating brand:', error);
        return null;
    }
    return data;
};

export const updateBrand = async (id, updatedData) => {
    const { data, error } = await supabase
        .from("brands")
        .update(updatedData)
        .eq("id", id);

    if (error) {
        console.error('Error updating brand:', error);
        return null;
    }
    return data;
};

export const deleteBrand = async (id) => {
    const { data, error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
        console.error('Error deleting brand:', error);
        return null;
    }
    return data;
};
