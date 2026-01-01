import { supabase } from "../lib/supabase";

import { createBaseService } from "./baseService";

const ordersService = createBaseService('orders');

export const fetchOrders = (page, limit) => ordersService.getAll({ select: "*, users(*), payments(*)", page, limit });

export const fetchOrderById = (orderId) => ordersService.getById(orderId, "*, users(*), payments(*)")

export const deleteOrder = (orderId) => ordersService.deleteById(orderId)

export const updateOrder = (orderId, updatedData) => ordersService.updateById(orderId, updatedData)

export const createOrder = (orderData) => ordersService.create(orderData)
