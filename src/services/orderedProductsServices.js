import { createBaseService } from "./baseService";

const orderedProductsService = createBaseService('ordered_products');

export const fetchOrderedProducts = (page, limit) => orderedProductsService.getAll({
    select: `*,products(id, name, price, categories(name)),orders(status, users(name))`,
    orderBy: "created_at",
    page,
    limit
})

export const fetchOrderedProductById = (orderedProductId) => orderedProductsService.getById(orderedProductId, {
    select: `*, products(id, name, price, categories(name)), orders(id, user_id, total_amount, status, users(name, email))`
});

export const fetchOrderedProductsByOrderId = async (orderId) => orderedProductsService.getAll({
    select: `*,products(id, name, price, categories(name))`,
    filter: { order_id: orderId },
    orderBy: "created_at",
    ascending: false
})

export const createOrderedProduct = (orderedProductData) => orderedProductsService.create(orderedProductData, {
    select: `*, products(id, name, price, categories(name)), orders(id, user_id, total_amount, status, users(name, email))`
});

export const updateOrderedProduct = (orderedProductId, updatedData) => orderedProductsService.update(orderedProductId, updatedData, {
    select: `*, products(id, name, price, categories(name)), orders(id, user_id, total_amount, status, users(name, email))`
});

export const deleteOrderedProduct = (orderedProductId) => orderedProductsService.delete(orderedProductId);
