import { supabase } from "../lib/supabase";

export const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) return [];
    return data;
};

export const fetchCategoryById = async (id) => {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error('Error fetching category by ID:', error);
        return null;
    }
    return data;
};

export const createCategory = async (categoryData) => {
    const { data, error } = await supabase
        .from("categories")
        .insert(categoryData)
        .select();
    if (error) {
        console.error('Error creating category:', error);
        return null;
    }
    return data;
};

export const updateCategory = async (id, updatedData) => {
    const { data, error } = await supabase
        .from("categories")
        .update(updatedData)
        .eq("id", id)
        .select();

    if (error) {
        console.error('Error updating category:', error);
        return null;
    }
    return data;
};

export const deleteCategory = async (id) => {
    const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
        console.error('Error deleting category:', error);
        return null;
    }
    return data;
};
