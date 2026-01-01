import { createBaseService } from "./baseService";

const paymentsService = createBaseService('payments');

export const fetchPayments = (page, limit) => paymentsService.getAll({ select: "*, users(*), orders(*)", page, limit });

export const fetchPaymentById = (id) => paymentsService.getById(id, "*, users(*), orders(*)")

export const updatePayment = (id, updatedData) => paymentsService.updateById(id, updatedData)

export const deletePayment = (id) => paymentsService.deleteById(id)
