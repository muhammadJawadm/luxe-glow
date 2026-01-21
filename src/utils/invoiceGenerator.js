import { jsPDF } from "jspdf";

/**
 * Generate and download a PDF invoice
 * @param {Object} invoiceData - Invoice data
 * @param {Object} invoiceData.product - Product details
 * @param {number} invoiceData.quantity - Quantity sold
 * @param {number} invoiceData.originalPrice - Original product price
 * @param {number} invoiceData.discount - Discount amount
 * @param {number} invoiceData.finalPrice - Final price after discount
 * @param {number} invoiceData.invoiceId - Invoice ID from database
 */
export const generateInvoicePDF = (invoiceData) => {
    const {
        product,
        quantity,
        originalPrice,
        discount = 0,
        finalPrice,
        invoiceId,
    } = invoiceData;

    // Create new PDF document
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Company Header
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text("LUXE GLOW MV", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text("Premium Beauty & Cosmetics", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Draw line separator
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Invoice Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("SALES INVOICE", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Invoice Details
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const invoiceDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    doc.text(`Invoice #: INV-${invoiceId}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Date: ${invoiceDate}`, margin, yPosition);
    yPosition += 15;

    // Product Details Section
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("Product Details", margin, yPosition);
    yPosition += 8;

    // Product table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("Product Name", margin + 2, yPosition + 5);
    doc.text("Qty", pageWidth - 80, yPosition + 5);
    doc.text("Unit Price", pageWidth - 60, yPosition + 5);
    doc.text("Amount", pageWidth - margin - 2, yPosition + 5, { align: "right" });
    yPosition += 8;

    // Product row
    doc.setFont(undefined, 'normal');
    yPosition += 5;
    doc.text(product.name || "Product", margin + 2, yPosition);
    doc.text(quantity.toString(), pageWidth - 80, yPosition);
    doc.text(`MVR ${originalPrice.toFixed(2)}`, pageWidth - 60, yPosition);
    doc.text(`MVR ${(originalPrice * quantity).toFixed(2)}`, pageWidth - margin - 2, yPosition, { align: "right" });
    yPosition += 8;

    // Draw line
    doc.setLineWidth(0.2);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Price Breakdown
    const breakdownX = pageWidth - 80;

    doc.setFont(undefined, 'normal');
    doc.text("Subtotal:", breakdownX, yPosition);
    doc.text(`MVR ${(originalPrice * quantity).toFixed(2)}`, pageWidth - margin - 2, yPosition, { align: "right" });
    yPosition += 6;

    if (discount > 0) {
        doc.setTextColor(220, 38, 38); // Red color for discount
        doc.text("Discount:", breakdownX, yPosition);
        doc.text(`-MVR ${(discount * quantity).toFixed(2)}`, pageWidth - margin - 2, yPosition, { align: "right" });
        doc.setTextColor(0, 0, 0); // Reset to black
        yPosition += 6;
    }

    // Draw line before total
    doc.setLineWidth(0.5);
    doc.line(breakdownX - 5, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("TOTAL:", breakdownX, yPosition);
    doc.text(`MVR ${(finalPrice * quantity).toFixed(2)}`, pageWidth - margin - 2, yPosition, { align: "right" });
    yPosition += 15;

    // Product Info Box (if available)
    if (product.brands?.name || product.categories?.name) {
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 20);

        yPosition += 5;
        doc.setFont(undefined, 'bold');
        doc.text("Product Information:", margin + 2, yPosition);
        yPosition += 5;

        doc.setFont(undefined, 'normal');
        if (product.brands?.name) {
            doc.text(`Brand: ${product.brands.name}`, margin + 2, yPosition);
            yPosition += 4;
        }
        if (product.categories?.name) {
            doc.text(`Category: ${product.categories.name}`, margin + 2, yPosition);
            yPosition += 4;
        }
        if (product.description) {
            doc.text(`Description: ${product.description.substring(0, 60)}${product.description.length > 60 ? '...' : ''}`, margin + 2, yPosition);
        }
        yPosition += 15;
    }

    // Footer
    yPosition = doc.internal.pageSize.getHeight() - 30;
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.text("Thank you for your purchase!", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 5;
    doc.setFontSize(8);
    doc.text("Luxe Glow MV - Your Beauty, Our Priority", pageWidth / 2, yPosition, { align: "center" });

    // Save the PDF
    const fileName = `Invoice_${invoiceId}_${new Date().getTime()}.pdf`;
    doc.save(fileName);

    return fileName;
};

/**
 * Generate invoice data object for PDF generation
 * @param {Object} params - Parameters
 * @returns {Object} Formatted invoice data
 */
export const prepareInvoiceData = (params) => {
    const {
        product,
        quantity,
        price,
        discount,
        finalPrice,
        invoiceId
    } = params;

    return {
        product,
        quantity,
        originalPrice: price,
        discount: discount || 0,
        finalPrice,
        invoiceId
    };
};
