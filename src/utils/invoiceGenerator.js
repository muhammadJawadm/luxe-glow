import { jsPDF } from "jspdf";

/**
 * Generate and download a PDF invoice
 * @param {Object} invoiceData - Invoice data
 * @param {Object} invoiceData.product - Product details
 * @param {number} invoiceData.quantity - Quantity sold
 * @param {number} invoiceData.originalPrice - Original product price
 * @param {number} invoiceData.discount - Discount amount
 * @param {number} invoiceData.subtotal - Subtotal after discount
 * @param {number} invoiceData.taxRate - Tax rate percentage
 * @param {number} invoiceData.taxAmount - Tax amount
 * @param {number} invoiceData.finalPrice - Final price after discount and tax
 * @param {number} invoiceData.invoiceId - Invoice ID from database
 */
export const generateInvoicePDF = (invoiceData) => {
    const {
        product,
        quantity,
        originalPrice,
        discount = 0,
        subtotal = 0,
        taxRate = 0,
        taxAmount = 0,
        finalPrice,
        invoiceId,
        customerInfo = {}
    } = invoiceData;

    // Create new PDF document
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 15;

    // Store Information (Left Side)
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("LUXE GLOW", margin, yPosition);
    yPosition += 5;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text("M. Luxe Glow House", margin, yPosition);
    yPosition += 4;
    doc.text("ABC ", margin, yPosition);
    yPosition += 4;
    doc.text("Phone No. 3322261", margin, yPosition);
    yPosition += 4;
    doc.text("TIN: 1234560GST501", margin, yPosition);

    // Invoice Details (Right Side)
    yPosition = 15;
    const rightX = pageWidth - margin - 60;

    doc.setFontSize(9);
    const invoiceDate = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    doc.text(`Date: ${invoiceDate}`, rightX, yPosition);
    yPosition += 4;
    doc.text(`Invoice No.: INV${new Date().getFullYear()}/${String(invoiceId).padStart(3, '0')}`, rightX, yPosition);

    // Title
    yPosition = 45;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("TAX INVOICE", pageWidth / 2, yPosition, { align: "center" });

    // Customer Section
    yPosition = 60;
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Customer:", margin, yPosition);
    yPosition += 5;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');

    if (customerInfo.name) {
        doc.text(customerInfo.name, margin, yPosition);
        yPosition += 4;
    } else {
        doc.text("Walk-in Customer", margin, yPosition);
        yPosition += 4;
    }

    if (customerInfo.address) {
        doc.text(customerInfo.address, margin, yPosition);
        yPosition += 4;
    }

    if (customerInfo.phone) {
        doc.text(`Phone: ${customerInfo.phone}`, margin, yPosition);
        yPosition += 4;
    }

    if (customerInfo.tin) {
        doc.text(`TIN: ${customerInfo.tin}`, margin, yPosition);
        yPosition += 4;
    }

    yPosition += 5;

    // Product Table
    const tableStartY = yPosition;
    const col1X = margin;
    const col2X = margin + 15;
    const col3X = margin + 75;
    const col4X = margin + 105;
    const col5X = margin + 135;
    const col6X = margin + 165;

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 7, 'F');

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text("QTY", col1X + 2, yPosition + 5);
    doc.text("Details", col2X + 2, yPosition + 5);
    doc.text("Unit Price", col3X + 2, yPosition + 5);
    doc.text("Price", col4X + 2, yPosition + 5);
    doc.text("GST", col5X + 2, yPosition + 5);
    doc.text("Total", col6X + 2, yPosition + 5);

    // Draw table header border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 7);

    yPosition += 7;

    // Product Row
    doc.setFont(undefined, 'normal');
    const rowHeight = 10;

    const itemSubtotal = originalPrice * quantity;
    const itemGST = taxAmount * quantity;
    const itemTotal = finalPrice * quantity;

    doc.text(quantity.toString(), col1X + 2, yPosition + 5);
    doc.text(product.name || "Product", col2X + 2, yPosition + 5);
    doc.text(originalPrice.toFixed(2), col3X + 2, yPosition + 5);
    doc.text(itemSubtotal.toFixed(2), col4X + 2, yPosition + 5);
    doc.text(itemGST.toFixed(2), col5X + 2, yPosition + 5);
    doc.text(itemTotal.toFixed(2), col6X + 2, yPosition + 5);

    // Draw product row border
    doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight);

    yPosition += rowHeight + 10;

    // Summary Section (Right Aligned)
    const summaryX = pageWidth - 60;
    const summaryLabelX = pageWidth - 90;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // Subtotal
    doc.text("Sub Total", summaryLabelX, yPosition, { align: "right" });
    doc.text(itemSubtotal.toFixed(2), summaryX, yPosition, { align: "right" });
    yPosition += 5;

    // GST
    doc.text(`GST (${taxRate}%)`, summaryLabelX, yPosition, { align: "right" });
    doc.text(itemGST.toFixed(2), summaryX, yPosition, { align: "right" });
    yPosition += 5;

    // Discount (if applicable)
    if (discount > 0) {
        const totalDiscount = discount * quantity;
        doc.text("Discount", summaryLabelX, yPosition, { align: "right" });
        doc.text(`-${totalDiscount.toFixed(2)}`, summaryX, yPosition, { align: "right" });
        yPosition += 5;
    }

    // Total
    doc.setFont(undefined, 'bold');
    doc.text("Total", summaryLabelX, yPosition, { align: "right" });
    doc.text(itemTotal.toFixed(2), summaryX, yPosition, { align: "right" });

    // Footer
    yPosition = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.text("Thank you for your purchase!", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 4;
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
        subtotal,
        taxRate,
        taxAmount,
        finalPrice,
        invoiceId,
        customerInfo
    } = params;

    return {
        product,
        quantity,
        originalPrice: price,
        discount: discount || 0,
        subtotal: subtotal || 0,
        taxRate: taxRate || 0,
        taxAmount: taxAmount || 0,
        finalPrice,
        invoiceId,
        customerInfo: customerInfo || {}
    };
};
