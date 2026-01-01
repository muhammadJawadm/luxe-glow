import { createBaseService } from "./baseService";

const brandsService = createBaseService('brands');

// Fetch all brands

export const fetchBrands = (page, limit) => brandsService.getAll({ select: "*", page, limit });

// Fetch brand by ID
export const fetchBrandById = (id) => brandsService.getById(id, "*");

// Create new brand
export const createBrand = (brandData) => brandsService.create(brandData);

// Update brand
export const updateBrand = (id, updatedData) => brandsService.updateById(id, updatedData);

// Delete brand
export const deleteBrand = (id) => brandsService.deleteById(id);
