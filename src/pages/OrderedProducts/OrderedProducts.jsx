import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import { FiEdit, FiPlus, FiSearch, FiTrash2, FiPackage, FiShoppingCart, FiCalendar, FiRefreshCw, FiChevronDown, FiChevronRight, FiPrinter, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import DeleteModal from "../../components/Modals/DeleteModal";
import OrderedProductModal from "../../components/Modals/OrderedProductModal";
import StatusUpdateModal from "../../components/Modals/StatusUpdateModal";
import {
    fetchOrderedProducts,
    createOrderedProduct,
    updateOrderedProduct,
    deleteOrderedProduct,
} from "../../services/orderedProductsServices";
import { updateOrderStatus } from "../../services/orderServices";
import Pagination from "../../components/Pagination";
import { supabase } from "../../lib/supabase";

const OrderedProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderedProduct, setSelectedOrderedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderedProductsData, setOrderedProductsData] = useState([]);
    const [filteredOrderedProducts, setFilteredOrderedProducts] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [orderedProductToDelete, setOrderedProductToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchOrderedProductsData();
    }, [currentPage]);

    // Group ordered products by order_id
    const groupProductsByOrder = (products) => {
        const grouped = {};

        products.forEach(product => {
            const orderId = product.order_id;
            if (!grouped[orderId]) {
                grouped[orderId] = {
                    orderId: orderId,
                    orderInfo: product.orders,
                    products: [],
                    totalQuantity: 0,
                    totalAmount: 0,
                    createdAt: product.created_at,
                    customer: product.orders?.users,
                    uid: product.orders?.uid,
                };
            }

            grouped[orderId].products.push(product);
            grouped[orderId].totalQuantity += product.quantity;
            grouped[orderId].totalAmount += (product.products?.price || 0) * product.quantity;
        });

        return Object.values(grouped);
    };

    const fetchOrderedProductsData = async () => {
        try {
            setLoading(true);
            const response = await fetchOrderedProducts(currentPage, itemsPerPage);
            console.log("Fetched ordered products:", response);
            setOrderedProductsData(response.data || []);
            setFilteredOrderedProducts(response.data || []);
            setGroupedOrders(groupProductsByOrder(response.data || []));
            setTotalItems(response.count || 0);

        } catch (error) {
            console.error("Error fetching ordered products data:", error);
            alert("Failed to load ordered products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredOrderedProducts(orderedProductsData);
            setGroupedOrders(groupProductsByOrder(orderedProductsData));
        } else {
            const filtered = orderedProductsData.filter(
                (item) =>
                    item.products?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.order_id?.toString().includes(searchQuery) ||
                    item.orders?.users?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredOrderedProducts(filtered);
            setGroupedOrders(groupProductsByOrder(filtered));
        }
    }, [searchQuery, orderedProductsData]);

    const toggleOrderExpansion = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    const handleEditOrder = (order) => {
        // For now, we'll edit the first product in the order
        // This can be enhanced later to edit all products
        setSelectedOrderedProduct(order.products[0]);
        setIsModalOpen(true);
    };

    const handleDeleteOrder = (order) => {
        // Set the entire order for deletion
        setOrderedProductToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedOrderedProduct(null);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (selectedOrderedProduct) {
                // Update existing ordered product
                await updateOrderedProduct(selectedOrderedProduct.id, formData);
                alert("Ordered product updated successfully!");
            } else {
                // Create new ordered product
                await createOrderedProduct(formData);
                alert("Ordered product added successfully!");
            }
            await fetchOrderedProductsData();
            setIsModalOpen(false);
            setSelectedOrderedProduct(null);
        } catch (error) {
            console.error("Error saving ordered product:", error);
            throw error;
        }
    };

    const handleDeleteConfirm = async () => {
        if (!orderedProductToDelete) return;

        try {
            // Check if we're deleting an entire order or a single product
            if (orderedProductToDelete.products) {
                // Deleting an order with multiple products
                await Promise.all(
                    orderedProductToDelete.products.map(product =>
                        deleteOrderedProduct(product.id)
                    )
                );
                alert(`Order #${orderedProductToDelete.orderId} with ${orderedProductToDelete.products.length} product(s) deleted successfully!`);
            } else {
                // Deleting a single product
                await deleteOrderedProduct(orderedProductToDelete.id);
                alert("Ordered product deleted successfully!");
            }

            await fetchOrderedProductsData();
            setIsDeleteModalOpen(false);
            setOrderedProductToDelete(null);
        } catch (error) {
            console.error("Error deleting ordered product:", error);
            alert("Failed to delete ordered product. Please try again.");
        }
    };

    const handleStatusClick = (order) => {
        setSelectedOrder({
            id: order.orderId,
            status: order.orderInfo?.status || "pending"
        });
        setIsStatusModalOpen(true);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            // Update order status in database
            await updateOrderStatus(orderId, newStatus);

            // Find the order to get customer information
            const order = groupedOrders.find(o => o.orderId === orderId);
            console.log("order", order);

            if (order && order.uid) {
                const userId = order.uid;

                // Fetch user's FCM token
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('fcm_token, name, email')
                    .eq('id', userId)
                    .single();
                console.log("userData", userData);
                if (!userError && userData && userData.fcm_token) {
                    // Create notification message based on status
                    const statusMessages = {
                        'pending': {
                            title: '📦 Order Pending',
                            body: `Your order #${orderId} is pending confirmation.`
                        },
                        'processing': {
                            title: '⚙️ Order Processing',
                            body: `Great news! Your order #${orderId} is being processed.`
                        },
                        'shipped': {
                            title: '🚚 Order Shipped',
                            body: `Your order #${orderId} has been shipped and is on its way!`
                        },
                        'shipping': {
                            title: '🚚 Order Shipping',
                            body: `Your order #${orderId} is being shipped!`
                        },
                        'delivered': {
                            title: '✅ Order Delivered',
                            body: `Your order #${orderId} has been delivered. Enjoy!`
                        },
                        'completed': {
                            title: '🎉 Order Completed',
                            body: `Your order #${orderId} is complete. Thank you for shopping with us!`
                        },
                        'cancelled': {
                            title: '❌ Order Cancelled',
                            body: `Your order #${orderId} has been cancelled.`
                        }
                    };

                    const notification = statusMessages[newStatus.toLowerCase()] || {
                        title: '📋 Order Update',
                        body: `Your order #${orderId} status has been updated to ${newStatus}.`
                    };

                    try {
                        console.log('Attempting to send notification to:', userData.email);
                        console.log('FCM Token:', userData.fcm_token);
                        console.log('Notification payload:', {
                            title: notification.title,
                            body: notification.body
                        });

                        // Send push notification via Supabase Edge Function
                        // Using the exact same format as Notifications.jsx
                        const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('send-notification', {
                            body: {
                                token: userData.fcm_token,
                                title: notification.title,
                                body: notification.body,
                                data: {
                                    type: 'order_status_update',
                                    timestamp: new Date().toISOString(),
                                }
                            }
                        });

                        if (notificationError || (notificationResult && !notificationResult.success)) {
                            // Get detailed error information
                            if (notificationError) {
                                console.error('❌ Edge Function Error Details:');

                                // Try to get the actual error response
                                if (notificationError.context?.body) {
                                    console.error('Error body:', notificationError.context.body);
                                }
                            }
                            console.error('❌ Failed to send push notification:', notificationError || notificationResult);
                        } else {
                            // Store notification in database for history
                            await supabase.from('notifications').insert({
                                uid: userId,
                                title: notification.title,
                                sub_title: notification.body,
                                sender: 'system'
                            });

                            console.log(`✅ Notification sent successfully to ${userData.name || userData.email}`);
                        }
                    } catch (notifError) {
                        // Don't fail the status update if notification fails
                        console.error('❌ Error sending notification:', notifError);
                    }
                } else {
                    console.log('User does not have FCM token, skipping push notification');
                }
            }

            alert("Order status updated successfully!");
            await fetchOrderedProductsData();
            setIsStatusModalOpen(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    };

    const getStatusColor = (status) => {
        if (status === "shipped" || status === "shipping" || status === "delivered") {
            return "bg-green-100 text-green-800";
        } else if (status === "processing") {
            return "bg-yellow-100 text-yellow-800";
        } else if (status === "cancelled") {
            return "bg-red-100 text-red-800";
        } else {
            return "bg-gray-100 text-gray-800";
        }
    };

    const handleDownloadPDF = (order) => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 16;
        let y = 20;

        // Brand
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(124, 58, 237);
        doc.text("Luxe Glow", margin, y);

        // Title right
        doc.setFontSize(14);
        doc.setTextColor(55, 65, 81);
        doc.text("Order Invoice", pageWidth - margin, y, { align: "right" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.text("Beauty & Skincare", margin, y + 6);
        doc.text(`Order #${order.orderId}`, pageWidth - margin, y + 6, { align: "right" });
        doc.text(formatDate(order.createdAt), pageWidth - margin, y + 11, { align: "right" });

        y += 18;
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        // Customer & order info
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER", margin, y);
        doc.text("ORDER INFO", pageWidth / 2, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(17, 24, 39);
        doc.text(order.customer?.name || "N/A", margin, y);
        doc.text(`Status: ${order.orderInfo?.status || "N/A"}`, pageWidth / 2, y);
        doc.setFontSize(9); doc.setTextColor(107, 114, 128);
        doc.text(order.customer?.email || "", margin, y + 5);

        y += 14;
        doc.setDrawColor(229, 231, 235);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;

        // Table header
        const colWidths = [80, 20, 35, 37];
        const headers = ["Product", "Qty", "Unit Price", "Subtotal"];
        doc.setFillColor(124, 58, 237);
        doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        let cx = margin + 2;
        headers.forEach((h, i) => {
            doc.text(h, cx, y + 5.5);
            cx += colWidths[i];
        });
        y += 8;

        // Table rows
        order.products.forEach((p, i) => {
            doc.setFillColor(i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 251 : 255);
            doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
            doc.setTextColor(31, 41, 55);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const rowData = [
                p.products?.name || "N/A",
                String(p.quantity),
                `MVR ${(p.products?.price || 0).toFixed(2)}`,
                `MVR ${((p.products?.price || 0) * p.quantity).toFixed(2)}`,
            ];
            cx = margin + 2;
            rowData.forEach((d, j) => {
                doc.text(d, cx, y + 5.5);
                cx += colWidths[j];
            });
            y += 8;
        });

        y += 4;
        // Totals
        const totalsX = pageWidth - margin - 70;
        doc.setFontSize(10); doc.setTextColor(107, 114, 128);
        doc.text("Total Items:", totalsX, y);
        doc.text(String(order.products.length), pageWidth - margin, y, { align: "right" });
        y += 6;
        doc.text("Total Qty:", totalsX, y);
        doc.text(String(order.totalQuantity), pageWidth - margin, y, { align: "right" });
        y += 4;
        doc.setDrawColor(124, 58, 237);
        doc.setLineWidth(0.5);
        doc.line(totalsX, y, pageWidth - margin, y);
        y += 5;
        doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(124, 58, 237);
        doc.text("Grand Total:", totalsX, y);
        doc.text(`MVR ${order.totalAmount.toFixed(2)}`, pageWidth - margin, y, { align: "right" });

        // Footer
        const footerY = doc.internal.pageSize.getHeight() - 16;
        doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.4);
        doc.line(margin, footerY, pageWidth - margin, footerY);
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(156, 163, 175);
        doc.text(
            `Thank you for shopping with Luxe Glow  •  Generated on ${new Date().toLocaleString()}`,
            pageWidth / 2, footerY + 5, { align: "center" }
        );

        doc.save(`Order-${order.orderId}.pdf`);
    };

    const handlePrintOrder = (order) => {
        const printWindow = window.open("", "_blank", "width=800,height=600");
        const statusColor = {
            shipped: "#16a34a", shipping: "#16a34a", delivered: "#16a34a",
            processing: "#ca8a04", cancelled: "#dc2626", pending: "#6b7280",
            completed: "#16a34a",
        }[order.orderInfo?.status?.toLowerCase()] || "#6b7280";

        const rows = order.products.map((p, i) => `
            <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${p.products?.name || "N/A"}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${p.quantity}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">MVR ${(p.products?.price || 0).toFixed(2)}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">MVR ${((p.products?.price || 0) * p.quantity).toFixed(2)}</td>
            </tr>`).join("");

        printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Order #${order.orderId}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; padding: 32px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .brand { font-size: 26px; font-weight: 700; color: #7c3aed; }
        .brand-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .invoice-title { text-align: right; }
        .invoice-title h2 { font-size: 20px; font-weight: 600; color: #374151; }
        .invoice-title p { font-size: 13px; color: #6b7280; margin-top: 4px; }
        .divider { border: none; border-top: 2px solid #e5e7eb; margin: 20px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
        .info-box h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
        .info-box p { font-size: 14px; color: #111827; }
        .info-box .small { font-size: 12px; color: #6b7280; }
        .status-badge { display:inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #fff; background: ${statusColor}; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead { background: #7c3aed; color: #fff; }
        thead th { padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        thead th:last-child, thead th:nth-child(3), thead th:nth-child(2) { text-align: right; }
        thead th:nth-child(2) { text-align: center; }
        tbody td { font-size: 13px; }
        .totals { margin-left: auto; width: 280px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #f3f4f6; }
        .totals-row.grand { font-size: 16px; font-weight: 700; color: #7c3aed; border-top: 2px solid #7c3aed; border-bottom: none; padding-top: 10px; margin-top: 4px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="brand">Luxe Glow</div>
            <div class="brand-sub">Beauty &amp; Skincare</div>
        </div>
        <div class="invoice-title">
            <h2>Order Invoice</h2>
            <p>Order #${order.orderId}</p>
        </div>
    </div>
    <hr class="divider" />
    <div class="info-grid">
        <div class="info-box">
            <h4>Customer</h4>
            <p>${order.customer?.name || "N/A"}</p>
            <p class="small">${order.customer?.email || ""}</p>
        </div>
        <div class="info-box" style="text-align:right">
            <h4>Order Info</h4>
            <p>Date: ${formatDate(order.createdAt)}</p>
            <p style="margin-top:6px"><span class="status-badge">${order.orderInfo?.status || "N/A"}</span></p>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th style="text-align:center">Qty</th>
                <th style="text-align:right">Unit Price</th>
                <th style="text-align:right">Subtotal</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    <div class="totals">
        <div class="totals-row"><span>Total Items</span><span>${order.products.length}</span></div>
        <div class="totals-row"><span>Total Qty</span><span>${order.totalQuantity}</span></div>
        <div class="totals-row grand"><span>Grand Total</span><span>MVR ${order.totalAmount.toFixed(2)}</span></div>
    </div>
    <div class="footer">Thank you for shopping with Luxe Glow &bull; Generated on ${new Date().toLocaleString()}</div>
    <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`);
        printWindow.document.close();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div>
            <Header header={"Ordered Products Management"} />
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Search by product name or order ID..."
                        />
                    </div>

                </div>

                <div className="my-3">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-gray-500 text-lg">Loading ordered products...</div>
                        </div>
                    ) : filteredOrderedProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg">
                            <FiPackage className="text-6xl text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg">
                                {searchQuery
                                    ? "No ordered products found matching your search."
                                    : "No ordered products available yet."}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleAddNew}
                                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Add Your First Ordered Product
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                                                Order ID
                                            </th>
                                            <th className="px-2 py-4 text-left text-xs font-semibold uppercase">
                                                Products
                                            </th>
                                            <th className="px-2 py-4 text-left text-xs font-semibold uppercase">
                                                Total Qty
                                            </th>
                                            <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Total Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {groupedOrders.map((order) => {
                                            const isExpanded = expandedOrders.has(order.orderId);

                                            return (
                                                <React.Fragment key={order.orderId}>
                                                    {/* Main order row */}
                                                    <tr
                                                        onClick={() => toggleOrderExpansion(order.orderId)}
                                                        className="hover:bg-gray-50 transition-colors border-b-2 border-gray-200 cursor-pointer"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleOrderExpansion(order.orderId);
                                                                    }}
                                                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                                    title={isExpanded ? "Collapse" : "Expand"}
                                                                >
                                                                    {isExpanded ? (
                                                                        <FiChevronDown className="text-gray-600" />
                                                                    ) : (
                                                                        <FiChevronRight className="text-gray-600" />
                                                                    )}
                                                                </button>
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    #{order.orderId}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-4">
                                                            <span className="text-sm font-semibold text-gray-700">
                                                                {order.products.length} item(s)
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-4 whitespace-nowrap">
                                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                                                                {order.totalQuantity}
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-primary">
                                                                MVR {order.totalAmount.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                {order.customer?.name || "N/A"}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {order.customer?.email || ""}
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-4 whitespace-nowrap">
                                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderInfo?.status)}`}>
                                                                {order.orderInfo?.status || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <FiCalendar className="text-gray-400" />
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="flex items-center justify-center gap-2">
                                                                {/* <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditOrder(order);
                                                                    }}
                                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                    title="Edit Order"
                                                                >
                                                                    <FiEdit className="text-lg" />
                                                                </button> */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handlePrintOrder(order);
                                                                    }}
                                                                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                                                    title="Print"
                                                                >
                                                                    <FiPrinter className="text-lg" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDownloadPDF(order);
                                                                    }}
                                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                                    title="Download as PDF"
                                                                >
                                                                    <FiDownload className="text-lg" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleStatusClick(order);
                                                                    }}
                                                                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                                    title="Update Status"
                                                                >
                                                                    <FiRefreshCw className="text-lg" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteOrder(order);
                                                                    }}
                                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                                    title="Delete Order"
                                                                >
                                                                    <FiTrash2 className="text-lg" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    {/* Expanded product rows */}
                                                    {isExpanded && order.products.map((product, idx) => (
                                                        <tr key={`${order.orderId}-${product.id}`} className="bg-gray-50/50">
                                                            <td colSpan="2" className="px-6 py-3 pl-16">
                                                                <div className="flex items-center gap-2">
                                                                    <FiPackage className="text-gray-400" />
                                                                    <span className="text-sm text-gray-700 font-medium">
                                                                        {product.products?.name || "N/A"}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-3 text-sm text-gray-700 text-center">
                                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 font-semibold">
                                                                    {product.quantity}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 py-3 text-sm text-gray-700 font-semibold">
                                                                MVR {((product.products?.price || 0) * product.quantity).toFixed(2)}
                                                            </td>
                                                            <td colSpan="4" className="px-6 py-3 text-sm text-gray-500">
                                                                <span className="text-xs">Unit Price: MVR {(product.products?.price || 0).toFixed(2)}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Ordered Product Modal */}
            <OrderedProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedOrderedProduct(null);
                }}
                orderedProduct={selectedOrderedProduct}
                onSave={handleSave}
            />

            {/* Status Update Modal */}
            <StatusUpdateModal
                isOpen={isStatusModalOpen}
                onClose={() => {
                    setIsStatusModalOpen(false);
                    setSelectedOrder(null);
                }}
                currentStatus={selectedOrder?.status}
                orderId={selectedOrder?.id}
                onSave={handleStatusUpdate}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setOrderedProductToDelete(null);
                }}
                onDelete={handleDeleteConfirm}
                entityType={"Ordered Product"}
            />

            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default OrderedProducts;
