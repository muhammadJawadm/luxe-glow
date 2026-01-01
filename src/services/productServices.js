import { createBaseService } from "./baseService";

const productsService = createBaseService('products');

export const fetchProducts = (page, limit) => productsService.getAll({ select: "*, product_images(*), brands(*), categories(*), reviews(*)", page, limit });

export const fetchProductById = (productId) => productsService.getById(productId, "*, product_images(*), brands(*), categories(*) , reviews(*)")

export const createProduct = (productData) => productsService.create(productData);

export const updateProduct = (productId, updatedData) => productsService.updateById(productId, updatedData);

export const deleteProduct = (productId) => productsService.deleteById(productId);
