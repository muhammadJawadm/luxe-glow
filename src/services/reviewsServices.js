import { createBaseService } from "./baseService";

const reviewsService = createBaseService('reviews');

export const fetchReviews = () => reviewsService.getAll()

export const fetchReviewById = (id) => reviewsService.getById(id)

export const updateReview = (id, updatedData) => reviewsService.updateById(id, updatedData)

export const deleteReview = (id) => reviewsService.deleteById(id)

