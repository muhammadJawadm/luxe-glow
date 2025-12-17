import { supabase } from "../lib/supabase";

// Fetch all offers
export const fetchOffers = async () => {
    const { data, error } = await supabase
        .from("offers")
        .select("*, products(*, categories(*), product_images(*))")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching offers:", error);
        throw error;
    }

    return data;
};

// Fetch offer by ID
export const fetchOfferById = async (offerId) => {
    const { data, error } = await supabase
        .from("offers")
        .select("*, products(*, categories(*))")
        .eq("id", offerId)
        .single();

    if (error) {
        console.error("Error fetching offer by ID:", error);
        throw error;
    }

    return data;
};

// Create new offer
export const createOffer = async (offerData) => {
    const { data, error } = await supabase
        .from("offers")
        .insert([offerData])
        .select();

    if (error) {
        console.error("Error creating offer:", error);
        throw error;
    }

    return data;
};

// Update offer
export const updateOffer = async (offerId, updatedData) => {
    const { data, error } = await supabase
        .from("offers")
        .update(updatedData)
        .eq("id", offerId)
        .select();

    if (error) {
        console.error("Error updating offer:", error);
        throw error;
    }

    return data;
};

// Delete offer
export const deleteOffer = async (offerId) => {
    const { data, error } = await supabase
        .from("offers")
        .delete()
        .eq("id", offerId)
        .select();

    if (error) {
        console.error("Error deleting offer:", error);
        throw error;
    }

    return data;
};