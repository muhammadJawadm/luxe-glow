import { createBaseService } from "./baseService";

const customerServiceBase = createBaseService('customer_service');

export const fetchCustomerService = async () =>
    customerServiceBase.getAll({
        orderBy: "id",
        ascending: true,
    });

export const updateCustomerServiceItem = async (id, data) =>
    customerServiceBase.updateById(id, { data });
