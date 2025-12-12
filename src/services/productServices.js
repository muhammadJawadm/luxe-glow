import { supabase } from "../lib/supabase";

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), brands(*), categories(*)");

  if (error) return [];
  return data;
};

export const fetchProductById = async (productId) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), brands(*), categories(*)")
    .eq("id", productId)
    .single();

  if (error) return null;
  return data;
};

export const createProduct = async (productData) => {
  const { data, error } = await supabase.from("products").insert(productData);
  if (error) return null;
  return data;
};

export const updateProduct = async (productId, updatedData) => {
  const { data, error } = await supabase
    .from("products")
    .update(updatedData)
    .eq("id", productId);

  if (error) return null;
  return data;
};

export const deleteProduct = async (productId) => {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) return null;
  return data;
};
