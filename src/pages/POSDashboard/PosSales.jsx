import React, { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import { fetchInvoices, getInvoiceStatistics } from "../../services/posInvoiceServices";
import { FiSearch, FiX, FiRefreshCw, FiShoppingBag, FiDollarSign, FiPackage, FiPercent, FiPrinter, FiDownload, FiChevronDown, FiChevronRight } from "react-icons/fi";
import jsPDF from "jspdf";

const PosSales = () => {
    const [invoices, setInvoices] = useState([]);
    const [groupedInvoices, setGroupedInvoices] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Group invoices by invoice_id (or by id for legacy single-product invoices)
    const groupByInvoiceId = (list) => {
        const map = {};
        list.forEach((inv) => {
            const key = inv.invoice_id || `single_${inv.id}`;
            if (!map[key]) {
                map[key] = {
                    invoiceId: inv.invoice_id || `#${inv.id}`,
                    items: [],
                    customer_name: inv.customer_name,
                    customer_phone: inv.customer_phone,
                    customer_address: inv.customer_address,
                    created_at: inv.created_at,
                    tax_rate: inv.tax_rate,
                    totalQty: 0,
                    totalDiscount: 0,
                    totalTax: 0,
                    totalFinal: 0,
                };
            }
            map[key].items.push(inv);
            map[key].totalQty += inv.quantity;
            map[key].totalDiscount += (inv.discount || 0) * inv.quantity;
            map[key].totalTax += (inv.tax_amount || 0) * inv.quantity;
            map[key].totalFinal += (inv.final_price || 0) * inv.quantity;
        });
        // Sort by newest first
        return Object.values(map).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [invoiceRes, statsRes] = await Promise.all([
                fetchInvoices(),
                getInvoiceStatistics(),
            ]);
            const list = Array.isArray(invoiceRes) ? invoiceRes : (invoiceRes?.data || []);
            setInvoices(list);
            const groups = groupByInvoiceId(list);
            setGroupedInvoices(groups);
            setFilteredGroups(groups);
            setStats(statsRes);
        } catch (error) {
            console.error("Error loading POS sales data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredGroups(groupedInvoices);
            return;
        }
        const q = searchQuery.toLowerCase();
        setFilteredGroups(
            groupedInvoices.filter((group) =>
                group.invoiceId?.toLowerCase().includes(q) ||
                group.customer_name?.toLowerCase().includes(q) ||
                group.customer_phone?.toLowerCase().includes(q) ||
                group.customer_address?.toLowerCase().includes(q) ||
                group.items.some(inv =>
                    inv.id?.toString().includes(q) ||
                    inv.products?.name?.toLowerCase().includes(q) ||
                    inv.invoice_id?.toLowerCase().includes(q)
                )
            )
        );
    }, [searchQuery, groupedInvoices]);

    const toggleExpand = (invoiceId) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(invoiceId)) next.delete(invoiceId);
            else next.add(invoiceId);
            return next;
        });
    };

    // ── Print grouped invoice ──
    const handlePrintGroup = (group) => {
        const win = window.open("", "_blank", "width=900,height=700");
        const rows = group.items.map((inv, i) => `
            <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">${inv.products?.name || '—'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${inv.quantity}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">MVR ${Number(inv.products?.price || 0).toFixed(2)}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${inv.discount > 0 ? '-MVR ' + (Number(inv.discount) * inv.quantity).toFixed(2) : '—'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${inv.tax_amount > 0 ? 'MVR ' + (Number(inv.tax_amount) * inv.quantity).toFixed(2) : '—'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">MVR ${(Number(inv.final_price) * inv.quantity).toFixed(2)}</td>
            </tr>`).join('');

        win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${group.invoiceId}</title>
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
<div class="inv-title"><h2>Sales Invoice</h2><p>${group.invoiceId}</p><p>${formatDate(group.created_at)}</p></div></div>
<hr/>
<div class="cust"><h4>Customer</h4>
<p>${group.customer_name || 'Walk-in Customer'}</p>
${group.customer_phone ? `<p class="sm">Phone: ${group.customer_phone}</p>` : ''}
${group.customer_address ? `<p class="sm">${group.customer_address}</p>` : ''}</div>
<table><thead><tr><th>Product</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th>
<th style="text-align:right">Discount</th><th style="text-align:right">Tax (${group.tax_rate || 0}%)</th><th style="text-align:right">Total</th></tr></thead>
<tbody>${rows}</tbody></table>
<div class="totals">
${group.totalDiscount > 0 ? `<div class="tr"><span>Discount</span><span>-MVR ${group.totalDiscount.toFixed(2)}</span></div>` : ''}
<div class="tr"><span>Tax (${group.tax_rate || 0}%)</span><span>MVR ${group.totalTax.toFixed(2)}</span></div>
<div class="tr grand"><span>Grand Total</span><span>MVR ${group.totalFinal.toFixed(2)}</span></div></div>
<div class="footer">Thank you for shopping with Luxe Glow &bull; Generated on ${new Date().toLocaleString()}</div>
<script>window.onload=function(){window.print();}<\/script></body></html>`);
        win.document.close();
    };

    // ── Download grouped PDF ──
    const handleDownloadGroupPDF = (group) => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 16;
        let y = 20;

        // Brand
        doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(124, 58, 237);
        doc.text("Luxe Glow", margin, y);
        doc.setFontSize(14); doc.setTextColor(55, 65, 81);
        doc.text("Sales Invoice", pageWidth - margin, y, { align: "right" });
        doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(107, 114, 128);
        doc.text("Beauty & Skincare — POS", margin, y + 6);
        doc.text(group.invoiceId, pageWidth - margin, y + 6, { align: "right" });
        doc.text(formatDate(group.created_at), pageWidth - margin, y + 11, { align: "right" });

        y += 18;
        doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y); y += 8;

        // Customer
        doc.setFontSize(8); doc.setTextColor(156, 163, 175); doc.setFont("helvetica", "bold");
        doc.text("CUSTOMER", margin, y); y += 5;
        doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(17, 24, 39);
        doc.text(group.customer_name || "Walk-in Customer", margin, y);
        if (group.customer_phone) { y += 5; doc.setFontSize(9); doc.setTextColor(107, 114, 128); doc.text(group.customer_phone, margin, y); }
        if (group.customer_address) { y += 5; doc.setFontSize(9); doc.setTextColor(107, 114, 128); doc.text(group.customer_address, margin, y, { maxWidth: 80 }); }

        y += 10;
        doc.setDrawColor(229, 231, 235); doc.line(margin, y, pageWidth - margin, y); y += 6;

        // Table header
        const colW = [56, 12, 24, 24, 24, 30];
        const hdrs = ["Product", "Qty", "Unit Price", "Discount", `Tax (${group.tax_rate || 0}%)`, "Total"];
        doc.setFillColor(124, 58, 237);
        doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
        doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.setFont("helvetica", "bold");
        let cx = margin + 2;
        hdrs.forEach((h, i) => { doc.text(h, cx, y + 5.5); cx += colW[i]; });
        y += 8;

        // Table rows
        doc.setFont("helvetica", "normal"); doc.setFontSize(8);
        group.items.forEach((inv, idx) => {
            doc.setFillColor(idx % 2 === 0 ? 249 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 251 : 255);
            doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
            doc.setTextColor(31, 41, 55);
            const row = [
                (inv.products?.name || "—").substring(0, 30),
                String(inv.quantity),
                `MVR ${Number(inv.products?.price || 0).toFixed(2)}`,
                inv.discount > 0 ? `-MVR ${(Number(inv.discount) * inv.quantity).toFixed(2)}` : "—",
                inv.tax_amount > 0 ? `MVR ${(Number(inv.tax_amount) * inv.quantity).toFixed(2)}` : "—",
                `MVR ${(Number(inv.final_price) * inv.quantity).toFixed(2)}`,
            ];
            cx = margin + 2;
            row.forEach((d, i) => { doc.text(d, cx, y + 5.5); cx += colW[i]; });
            y += 8;
        });

        y += 4;
        const tX = pageWidth - margin - 70;
        doc.setFontSize(10); doc.setTextColor(107, 114, 128);
        if (group.totalDiscount > 0) {
            doc.text("Discount:", tX, y); doc.text(`-MVR ${group.totalDiscount.toFixed(2)}`, pageWidth - margin, y, { align: "right" }); y += 6;
        }
        doc.text(`Tax (${group.tax_rate || 0}%):`, tX, y); doc.text(`MVR ${group.totalTax.toFixed(2)}`, pageWidth - margin, y, { align: "right" }); y += 4;
        doc.setDrawColor(124, 58, 237); doc.setLineWidth(0.5); doc.line(tX, y, pageWidth - margin, y); y += 5;
        doc.setFontSize(13); doc.setFont("helvetica", "bold"); doc.setTextColor(124, 58, 237);
        doc.text("Grand Total:", tX, y); doc.text(`MVR ${group.totalFinal.toFixed(2)}`, pageWidth - margin, y, { align: "right" });

        const footerY = doc.internal.pageSize.getHeight() - 16;
        doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.4); doc.line(margin, footerY, pageWidth - margin, footerY);
        doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(156, 163, 175);
        doc.text(`Thank you for shopping with Luxe Glow  •  Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 5, { align: "center" });

        doc.save(`Invoice-${group.invoiceId}.pdf`);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statCards = [
        {
            label: "Total Invoices",
            value: stats?.totalInvoices ?? "—",
            icon: <FiShoppingBag className="text-blue-500" size={22} />,
            bg: "bg-blue-50",
        },
        {
            label: "Total Revenue",
            value: stats ? `MVR ${stats.totalSales}` : "—",
            icon: <FiDollarSign className="text-green-500" size={22} />,
            bg: "bg-green-50",
        },
        {
            label: "Items Sold",
            value: stats?.totalItems ?? "—",
            icon: <FiPackage className="text-purple-500" size={22} />,
            bg: "bg-purple-50",
        },
        {
            label: "Total Discounts",
            value: stats ? `MVR ${stats.totalDiscount}` : "—",
            icon: <FiPercent className="text-orange-500" size={22} />,
            bg: "bg-orange-50",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header header="POS Sales" />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6 space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className={`${card.bg} rounded-xl p-5 flex items-center gap-4 shadow-sm`}
                        >
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{card.label}</p>
                                <p className="text-xl font-bold text-gray-800 mt-0.5">
                                    {loading ? (
                                        <span className="inline-block w-16 h-5 bg-gray-200 rounded animate-pulse" />
                                    ) : (
                                        card.value
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Sales Invoices</h2>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400" size={15} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Search by invoice ID, product, customer…"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <FiX className="text-gray-400 hover:text-gray-600" size={14} />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={loadData}
                                disabled={loading}
                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-50"
                                title="Refresh"
                            >
                                <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">Invoice ID</th>
                                    <th className="px-5 py-3 text-left font-medium">Products</th>
                                    <th className="px-5 py-3 text-left font-medium">Customer</th>
                                    <th className="px-5 py-3 text-right font-medium">Total Qty</th>
                                    <th className="px-5 py-3 text-right font-medium">Discount</th>
                                    <th className="px-5 py-3 text-right font-medium">Tax</th>
                                    <th className="px-5 py-3 text-right font-medium">Grand Total</th>
                                    <th className="px-5 py-3 text-left font-medium">Date</th>
                                    <th className="px-5 py-3 text-center font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {Array.from({ length: 9 }).map((__, j) => (
                                                <td key={j} className="px-5 py-4">
                                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filteredGroups.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-16 text-gray-400 text-sm">
                                            {searchQuery ? "No invoices match your search." : "No sales invoices found."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredGroups.map((group) => {
                                        const isExpanded = expandedGroups.has(group.invoiceId);
                                        return (
                                            <React.Fragment key={group.invoiceId}>
                                                {/* Group row */}
                                                <tr
                                                    onClick={() => toggleExpand(group.invoiceId)}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer border-b-2 border-gray-100"
                                                >
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleExpand(group.invoiceId); }}
                                                                className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                                                            >
                                                                {isExpanded
                                                                    ? <FiChevronDown className="text-gray-500" size={14} />
                                                                    : <FiChevronRight className="text-gray-500" size={14} />}
                                                            </button>
                                                            <span className="font-medium text-blue-600 text-xs">{group.invoiceId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-gray-800 font-medium">
                                                        <span className="text-sm">{group.items.length} item(s)</span>
                                                        <span className="text-xs text-gray-400 ml-1">
                                                            — {group.items.map(i => i.products?.name).filter(Boolean).join(", ").substring(0, 40)}
                                                            {group.items.map(i => i.products?.name).filter(Boolean).join(", ").length > 40 ? "…" : ""}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <div className="text-gray-700 text-sm">{group.customer_name || <span className="text-gray-300">—</span>}</div>
                                                        {group.customer_phone && <div className="text-xs text-gray-400">{group.customer_phone}</div>}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right text-gray-700 font-semibold">{group.totalQty}</td>
                                                    <td className="px-5 py-3.5 text-right text-orange-600">
                                                        {group.totalDiscount > 0 ? `MVR ${group.totalDiscount.toFixed(2)}` : <span className="text-gray-300">—</span>}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right text-gray-600">
                                                        {group.totalTax > 0 ? `MVR ${group.totalTax.toFixed(2)}` : <span className="text-gray-300">—</span>}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right font-bold text-green-700">
                                                        MVR {group.totalFinal.toFixed(2)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap text-xs">
                                                        {formatDate(group.created_at)}
                                                    </td>
                                                    <td className="px-5 py-3.5 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handlePrintGroup(group); }}
                                                                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                                                                title="Print"
                                                            >
                                                                <FiPrinter size={15} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDownloadGroupPDF(group); }}
                                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                                title="Download as PDF"
                                                            >
                                                                <FiDownload size={15} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded product rows */}
                                                {isExpanded && group.items.map((inv, idx) => (
                                                    <tr key={inv.id} className="bg-gray-50/60">
                                                        <td className="px-5 py-2.5 pl-14 text-xs text-gray-400">#{inv.id}</td>
                                                        <td className="px-5 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <FiPackage className="text-gray-400" size={13} />
                                                                <span className="text-sm text-gray-700 font-medium">{inv.products?.name || "—"}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-2.5 text-xs text-gray-400">
                                                            Unit: MVR {Number(inv.products?.price || 0).toFixed(2)}
                                                        </td>
                                                        <td className="px-5 py-2.5 text-right text-sm text-gray-600">{inv.quantity}</td>
                                                        <td className="px-5 py-2.5 text-right text-xs text-orange-500">
                                                            {inv.discount > 0 ? `MVR ${Number(inv.discount).toFixed(2)}` : "—"}
                                                        </td>
                                                        <td className="px-5 py-2.5 text-right text-xs text-gray-500">
                                                            {inv.tax_amount > 0 ? `MVR ${Number(inv.tax_amount).toFixed(2)}` : "—"}
                                                        </td>
                                                        <td className="px-5 py-2.5 text-right text-sm font-semibold text-gray-700">
                                                            MVR {(Number(inv.final_price) * inv.quantity).toFixed(2)}
                                                        </td>
                                                        <td colSpan={2} className="px-5 py-2.5 text-xs text-gray-400">
                                                            {inv.tax_rate > 0 ? `Tax: ${inv.tax_rate}%` : ""}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer count */}
                    {!loading && filteredGroups.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Showing {filteredGroups.length} invoice group{filteredGroups.length !== 1 ? "s" : ""} ({invoices.length} line item{invoices.length !== 1 ? "s" : ""})
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PosSales;
