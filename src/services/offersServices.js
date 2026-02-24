import { createBaseService } from "./baseService";
import { supabase } from "../lib/supabase";

const offersService = createBaseService('offers');

export const fetchOffers = (page, limit) => offersService.getAll({
    select: "*, brands(*), offers_products(products(*, categories(*), product_images(*)))",
    page,
    limit,
    orderBy: "created_at",
    ascending: false
});

export const fetchOfferById = (offerId) => offersService.getById(
    offerId,
    "*, products(*, categories(*), product_images(*)), brands(*), offers_products(products(*, categories(*), product_images(*)))"
);

export const createOffer = async (offerData, productIds) => {
    const { data: response, error } = await supabase.from('offers').insert(offerData).select();
    if (error) {
        throw error;
    }
    const newOfferId = response[0].id;

    if (productIds && productIds.length > 0 && !offerData.brand_id) {
        const offerProductsData = productIds.map(pid => ({
            product_id: pid,
            offer_id: newOfferId
        }));
        const { error: opError } = await supabase.from('offers_products').insert(offerProductsData);
        if (opError) {
            // Rollback the offer creation if adding products fails
            await supabase.from('offers').delete().eq('id', newOfferId);
            throw opError;
        }
    }
    return response;
};

export const updateOffer = async (offerId, updatedData, productIds) => {
    const { data: response, error } = await supabase.from('offers').update(updatedData).eq('id', offerId).select();
    if (error) {
        throw error;
    }

    if (updatedData.brand_id) {
        // Clear out products if switched to brand
        await supabase.from('offers_products').delete().eq('offer_id', offerId);
    } else if (productIds && productIds.length > 0) {
        // Replace existing products
        await supabase.from('offers_products').delete().eq('offer_id', offerId);

        const offerProductsData = productIds.map(pid => ({
            product_id: pid,
            offer_id: offerId
        }));
        const { error: opError } = await supabase.from('offers_products').insert(offerProductsData);
        if (opError) {
            throw opError;
        }
    }

    return response;
};

export const deleteOffer = (offerId) => offersService.deleteById(offerId);
