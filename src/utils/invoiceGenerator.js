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
    const col2X = margin + 10;
    const col3X = margin + 85;
    const col4X = margin + 110;
    const col5X = margin + 135;
    const col6X = margin + 160;

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

    // Truncate product name if too long to prevent overlap
    const maxProductNameLength = 35;
    const productName = product.name || "Product";
    const truncatedProductName = productName.length > maxProductNameLength
        ? productName.substring(0, maxProductNameLength) + '...'
        : productName;

    doc.text(quantity.toString(), col1X + 2, yPosition + 5);
    doc.text(truncatedProductName, col2X + 2, yPosition + 5);
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
 * Generate and download a multi-product PDF invoice
 * @param {Object} params
 * @param {Array}  params.cartItems  - Array of cart items
 * @param {number} params.taxRate    - Global tax rate
 * @param {Object} params.customerInfo
 * @param {string} params.invoiceId  - First invoice ID (used for file name)
 */
export const generateMultiInvoicePDF = ({ cartItems, taxRate, customerInfo, invoiceId }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    // Store info – left
    doc.setFontSize(12); doc.setFont(undefined, 'bold');
    doc.text("LUXE GLOW", margin, y); y += 5;
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.text("M. Luxe Glow House", margin, y); y += 4;
    doc.text("Phone No. 3322261", margin, y); y += 4;
    doc.text("TIN: 1234560GST501", margin, y);

    // Invoice info – right
    const rightX = pageWidth - margin - 60;
    y = 15;
    const invoiceDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFontSize(9);
    doc.text(`Date: ${invoiceDate}`, rightX, y); y += 4;
    doc.text(`Invoice No.: INV${new Date().getFullYear()}/${String(invoiceId).padStart(3, '0')}`, rightX, y);

    // Title
    y = 45;
    doc.setFontSize(16); doc.setFont(undefined, 'bold');
    doc.text("TAX INVOICE", pageWidth / 2, y, { align: "center" });

    // Customer section
    y = 58;
    doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text("Customer:", margin, y); y += 5;
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.text(customerInfo.name || "Walk-in Customer", margin, y); y += 4;
    if (customerInfo.address) { doc.text(customerInfo.address, margin, y); y += 4; }
    if (customerInfo.phone) { doc.text(`Phone: ${customerInfo.phone}`, margin, y); y += 4; }
    if (customerInfo.tin) { doc.text(`TIN: ${customerInfo.tin}`, margin, y); y += 4; }
    y += 3;

    // Table header
    const col = { qty: margin, name: margin + 10, unit: margin + 85, price: margin + 110, gst: margin + 135, total: margin + 160 };
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y, pageWidth - 2 * margin, 7, 'F');
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
    doc.rect(margin, y, pageWidth - 2 * margin, 7);
    doc.setFontSize(9); doc.setFont(undefined, 'bold');
    doc.text("QTY", col.qty + 2, y + 5);
    doc.text("Details", col.name + 2, y + 5);
    doc.text("Unit Price", col.unit + 2, y + 5);
    doc.text("Price", col.price + 2, y + 5);
    doc.text("GST", col.gst + 2, y + 5);
    doc.text("Total", col.total + 2, y + 5);
    y += 7;

    // Table rows
    let grandSubtotal = 0, grandGST = 0, grandTotal = 0, grandDiscount = 0;
    doc.setFont(undefined, 'normal');
    cartItems.forEach((item) => {
        const rowH = 10;
        const unitPrice = item.product.price;
        const rowSubtotal = unitPrice * item.quantity;
        const rowGST = item.taxAmount * item.quantity;
        const rowTotal = item.grandTotal * item.quantity;
        const name = (item.product.name || "Product").substring(0, 35);
        doc.rect(margin, y, pageWidth - 2 * margin, rowH);
        doc.text(item.quantity.toString(), col.qty + 2, y + 6);
        doc.text(name, col.name + 2, y + 6);
        doc.text(unitPrice.toFixed(2), col.unit + 2, y + 6);
        doc.text(rowSubtotal.toFixed(2), col.price + 2, y + 6);
        doc.text(rowGST.toFixed(2), col.gst + 2, y + 6);
        doc.text(rowTotal.toFixed(2), col.total + 2, y + 6);
        grandSubtotal += rowSubtotal;
        grandGST += rowGST;
        grandTotal += rowTotal;
        grandDiscount += item.discountAmount * item.quantity;
        y += rowH;
    });

    y += 8;
    const sX = pageWidth - 60, lX = pageWidth - 90;
    doc.setFontSize(10); doc.setFont(undefined, 'normal');
    doc.text("Sub Total", lX, y, { align: "right" }); doc.text(grandSubtotal.toFixed(2), sX, y, { align: "right" }); y += 5;
    doc.text(`GST (${taxRate}%)`, lX, y, { align: "right" }); doc.text(grandGST.toFixed(2), sX, y, { align: "right" }); y += 5;
    if (grandDiscount > 0) {
        doc.text("Discount", lX, y, { align: "right" }); doc.text(`-${grandDiscount.toFixed(2)}`, sX, y, { align: "right" }); y += 5;
    }
    doc.setFont(undefined, 'bold');
    doc.text("Total", lX, y, { align: "right" }); doc.text(grandTotal.toFixed(2), sX, y, { align: "right" });

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8); doc.setFont(undefined, 'italic');
    doc.text("Thank you for your purchase!", pageWidth / 2, footerY, { align: "center" });
    doc.text("Luxe Glow MV - Your Beauty, Our Priority", pageWidth / 2, footerY + 4, { align: "center" });

    const fileName = `Invoice_${invoiceId}_${Date.now()}.pdf`;
    doc.save(fileName);
    return fileName;
};

/**
 * Print (open in new window) a multi-product invoice
 */
export const printMultiInvoice = ({ cartItems, taxRate, customerInfo, invoiceId }) => {
    const invoiceDate = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const invoiceNo = `INV${new Date().getFullYear()}/${String(invoiceId).padStart(3, '0')}`;

    let grandSubtotal = 0, grandGST = 0, grandTotal = 0, grandDiscount = 0;
    const rows = cartItems.map((item, i) => {
        const rowSubtotal = item.product.price * item.quantity;
        const rowGST = item.taxAmount * item.quantity;
        const rowTotal = item.grandTotal * item.quantity;
        grandSubtotal += rowSubtotal;
        grandGST += rowGST;
        grandTotal += rowTotal;
        grandDiscount += item.discountAmount * item.quantity;
        return `<tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
            <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb">${item.product.name}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right">MVR ${item.product.price.toFixed(2)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right">${item.discountAmount > 0 ? '-MVR ' + (item.discountAmount * item.quantity).toFixed(2) : '—'}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right">MVR ${rowGST.toFixed(2)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">MVR ${rowTotal.toFixed(2)}</td>
        </tr>`;
    }).join('');

    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${invoiceNo}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;padding:32px}
    .hdr{display:flex;justify-content:space-between;margin-bottom:28px}.brand{font-size:24px;font-weight:700;color:#7c3aed}
    .brand-sub{font-size:11px;color:#6b7280;margin-top:2px}.inv-title{text-align:right}
    .inv-title h2{font-size:18px;font-weight:600;color:#374151}.inv-title p{font-size:12px;color:#6b7280;margin-top:3px}
    hr{border:none;border-top:2px solid #e5e7eb;margin:16px 0}
    .cust{margin-bottom:20px}.cust h4{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:4px}
    .cust p{font-size:13px;color:#111827;margin-bottom:2px}.cust .sm{font-size:11px;color:#6b7280}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    thead{background:#7c3aed;color:#fff}thead th{padding:10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.05em}
    thead th:not(:first-child){text-align:right}thead th:nth-child(2){text-align:center}
    .totals{margin-left:auto;width:260px}.tr{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6}
    .grand{font-size:15px;font-weight:700;color:#7c3aed;border-top:2px solid #7c3aed;border-bottom:none;padding-top:8px;margin-top:4px}
    .footer{margin-top:32px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:14px}
    @media print{body{padding:20px}}</style></head><body>
    <div class="hdr"><div><div class="brand">Luxe Glow</div><div class="brand-sub">Beauty &amp; Skincare &mdash; POS</div></div>
    <div class="inv-title"><h2>Tax Invoice</h2><p>${invoiceNo}</p><p>${invoiceDate}</p></div></div>
    <hr/>
    <div class="cust"><h4>Customer</h4>
    <p>${customerInfo.name || 'Walk-in Customer'}</p>
    ${customerInfo.phone ? `<p class="sm">Phone: ${customerInfo.phone}</p>` : ''}
    ${customerInfo.address ? `<p class="sm">${customerInfo.address}</p>` : ''}
    ${customerInfo.tin ? `<p class="sm">TIN: ${customerInfo.tin}</p>` : ''}</div>
    <table><thead><tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th>
    <th style="text-align:right">Discount</th><th style="text-align:right">GST(${taxRate}%)</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="totals">
    <div class="tr"><span>Sub Total</span><span>MVR ${grandSubtotal.toFixed(2)}</span></div>
    ${grandDiscount > 0 ? `<div class="tr"><span>Discount</span><span>-MVR ${grandDiscount.toFixed(2)}</span></div>` : ''}
    <div class="tr"><span>GST (${taxRate}%)</span><span>MVR ${grandGST.toFixed(2)}</span></div>
    <div class="tr grand"><span>Grand Total</span><span>MVR ${grandTotal.toFixed(2)}</span></div></div>
    <div class="footer">Thank you for your purchase! &bull; Luxe Glow MV &bull; Generated on ${new Date().toLocaleString()}</div>
    <script>window.onload=function(){window.print();}<\/script></body></html>`);
    win.document.close();
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
