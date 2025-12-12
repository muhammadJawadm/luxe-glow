import { supabase } from "../lib/supabase";

// Fetch all offers
export const fetchOffers = async () => {
    const { data, error } = await supabase
        .from("offers")
        .select("* , products(*)");

    if (error) {
        console.error("Error fetching offers:", error);
        return [];
    }

    return data;
};

// Fetch offer by ID
export const fetchOfferById = async (offerId) => {
    const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

    if (error) {
        console.error("Error fetching offer by ID:", error);
        return null;
    }

    return data;
};

// Update offer
export const updateOffer = async (offerId, updatedData) => {
    const { data, error } = await supabase
        .from("offers")
        .update(updatedData)
        .eq("id", offerId);

    if (error) {
        console.error("Error updating offer:", error);
        return null;
    }

    return data;
};

// Delete offer
export const deleteOffer = async (offerId) => {
    const { data, error } = await supabase
        .from("offers")
        .delete()
        .eq("id", offerId);

    if (error) {
        console.error("Error deleting offer:", error);
        return null;
    }

    return data;
};

// Create new offer (Optional - but good to include)
export const createOffer = async (offerData) => {
    const { data, error } = await supabase
        .from("offers")
        .insert(offerData);

    if (error) {
        console.error("Error creating offer:", error);
        return null;
    }

    return data;
};
