import { createBaseService } from "./baseService";

const posInvoiceService = createBaseService("pos_invoice");

/**
 * Create a new POS invoice record
 * @param {Object} invoiceData - Invoice data
 * @param {number} invoiceData.product_id - Product ID
 * @param {number} invoiceData.final_price - Final price after discount
 * @param {number} invoiceData.discount - Discount amount
 * @param {number} invoiceData.quantity - Quantity sold
 * @returns {Promise} Created invoice data
 */
export const createInvoice = async (invoiceData) => {
    return await posInvoiceService.create(invoiceData);
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
