
import { createBaseService } from "./baseService";

const categoriesService = createBaseService('categories');

export const fetchCategories = (page, limit) => categoriesService.getAll({ select: '*', page, limit });

export const fetchCategoryById = (id) => categoriesService.getById(id, '*');

export const createCategory = (categoryData) => categoriesService.create(categoryData);

export const updateCategory = (id, updatedData) => categoriesService.updateById(id, updatedData);

export const deleteCategory = (id) => categoriesService.deleteById(id);
