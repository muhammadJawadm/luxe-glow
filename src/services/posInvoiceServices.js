import { createBaseService } from "./baseService";

const posInvoiceService = createBaseService("pos_invoices");

/**
 * Create a new POS invoice record
 * @param {Object} invoiceData - Invoice data
 * @param {number} invoiceData.product_id - Product ID
 * @param {number} invoiceData.quantity - Quantity sold
 * @param {number} [invoiceData.discount] - Discount amount per unit
 * @param {number} [invoiceData.tax_rate] - Tax rate percentage
 * @param {number} [invoiceData.tax_amount] - Total tax amount
 * @param {number} invoiceData.final_price - Final price (grand total)
 * @param {string} [invoiceData.customer_name] - Customer name
 * @param {string} [invoiceData.customer_phone] - Customer phone
 * @param {string} [invoiceData.customer_address] - Customer address
 * @param {string} [invoiceData.invoice_id] - Shared invoice ID for grouped items
 * @returns {Promise} Created invoice data
 */
export const createInvoice = async (invoiceData) => {
    const payload = {
        product_id: invoiceData.product_id,
        quantity: invoiceData.quantity,
        discount: invoiceData.discount || 0,
        tax_rate: invoiceData.tax_rate || 0,
        tax_amount: invoiceData.tax_amount || 0,
        final_price: invoiceData.final_price,
        customer_name: invoiceData.customer_name || null,
        customer_phone: invoiceData.customer_phone || null,
        customer_address: invoiceData.customer_address || null,
    };
    if (invoiceData.invoice_id) {
        payload.invoice_id = invoiceData.invoice_id;
    }
    return await posInvoiceService.create(payload);
};

/**
 * Get all invoices
 * @param {Object} options - Query options
 * @returns {Promise} Array of invoices
 */
export const fetchInvoices = async (options = {}) => {
    return await posInvoiceService.getAll({
        select: "*, products(*)",
        orderBy: "created_at",
        ascending: false,
        ...options
    });
};

/**
 * Get invoice by ID
 * @param {number} id - Invoice ID
 * @returns {Promise} Invoice data
 */
export const fetchInvoiceById = async (id) => {
    return await posInvoiceService.getById(id, "*, products(*)");
};

/**
 * Get invoices by product ID
 * @param {number} productId - Product ID
 * @returns {Promise} Array of invoices
 */
export const fetchInvoicesByProduct = async (productId) => {
    return await posInvoiceService.getAll({
        select: "*, products(*)",
        filter: { product_id: productId },
        orderBy: "created_at",
        ascending: false
    });
};

/**
 * Get customer details by phone number
 * @param {string} phone - Customer phone number
 * @returns {Promise} Customer details object or null
 */
export const fetchCustomerByPhone = async (phone) => {
    try {
        const invoices = await posInvoiceService.getAll({
            select: "customer_name, customer_phone, customer_address",
            filter: { customer_phone: phone },
            orderBy: "created_at",
            ascending: false,
            limit: 1 // We only need the latest record
        });

        // Since limit: 1 is used, check if data array has at least one item
        const data = Array.isArray(invoices) ? invoices : (invoices?.data || []);
        if (data.length > 0) {
            return {
                name: data[0].customer_name || "",
                phone: data[0].customer_phone || "",
                address: data[0].customer_address || "",
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching customer by phone:", error);
        return null;
    }
};

/**
 * Get invoice statistics
 * @returns {Promise} Statistics object
 */
export const getInvoiceStatistics = async () => {
    try {
        const invoices = await fetchInvoices();
        const invoiceArray = Array.isArray(invoices) ? invoices : (invoices.data || []);

        const totalSales = invoiceArray.reduce((sum, invoice) =>
            sum + (invoice.final_price * invoice.quantity), 0
        );

        const totalDiscount = invoiceArray.reduce((sum, invoice) =>
            sum + ((invoice.discount || 0) * invoice.quantity), 0
        );

        const totalItems = invoiceArray.reduce((sum, invoice) =>
            sum + invoice.quantity, 0
        );

        return {
            totalInvoices: invoiceArray.length,
            totalSales: totalSales.toFixed(2),
            totalDiscount: totalDiscount.toFixed(2),
            totalItems,
            averageOrderValue: invoiceArray.length > 0
                ? (totalSales / invoiceArray.length).toFixed(2)
                : 0
        };
    } catch (error) {
        console.error("Error fetching invoice statistics:", error);
        return {
            totalInvoices: 0,
            totalSales: 0,
            totalDiscount: 0,
            totalItems: 0,
            averageOrderValue: 0
        };
    }
};
