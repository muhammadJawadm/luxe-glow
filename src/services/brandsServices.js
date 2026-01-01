import { createBaseService } from "./baseService";

const brandsService = createBaseService('brands');

export const fetchBrands = (page, limit) => brandsService.getAll({ select: "*", page, limit });

export const fetchBrandById = (id) => brandsService.getById(id, "*");

export const createBrand = (brandData) => brandsService.create(brandData);

export const updateBrand = (id, updatedData) => brandsService.updateById(id, updatedData);

export const deleteBrand = (id) => brandsService.deleteById(id);
