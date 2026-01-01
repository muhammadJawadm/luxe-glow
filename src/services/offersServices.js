import { createBaseService } from "./baseService";

const offersService = createBaseService('offers');

export const fetchOffers = (page, limit) => offersService.getAll({ select: "*, products(*, categories(*), product_images(*))", page, limit });

export const fetchOfferById = (offerId) => offersService.getById(offerId, "*, products(*, categories(*), product_images(*))");

export const createOffer = (offerData) => offersService.create(offerData);

export const updateOffer = (offerId, updatedData) => offersService.updateById(offerId, updatedData);

export const deleteOffer = (offerId) => offersService.deleteById(offerId);

