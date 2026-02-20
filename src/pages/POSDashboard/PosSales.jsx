import React, { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import { fetchInvoices, getInvoiceStatistics } from "../../services/posInvoiceServices";
import { FiSearch, FiX, FiRefreshCw, FiShoppingBag, FiDollarSign, FiPackage, FiPercent } from "react-icons/fi";

const PosSales = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            const [invoiceRes, statsRes] = await Promise.all([
                fetchInvoices(),
                getInvoiceStatistics(),
            ]);
            const list = Array.isArray(invoiceRes) ? invoiceRes : (invoiceRes?.data || []);
            setInvoices(list);
            setFilteredInvoices(list);
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
            setFilteredInvoices(invoices);
            return;
        }
        const q = searchQuery.toLowerCase();
        setFilteredInvoices(
            invoices.filter(
                (inv) =>
                    inv.id?.toString().includes(q) ||
                    inv.products?.name?.toLowerCase().includes(q) ||
                    inv.customer_name?.toLowerCase().includes(q) ||
                    inv.customer_phone?.toLowerCase().includes(q) ||
                    inv.customer_address?.toLowerCase().includes(q)
            )
        );
    }, [searchQuery, invoices]);

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
                            {/* Search */}
                            <div className="relative flex-1 sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400" size={15} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Search by ID, product, customer…"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <FiX className="text-gray-400 hover:text-gray-600" size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Refresh */}
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
                                    <th className="px-5 py-3 text-left font-medium">Product</th>
                                    <th className="px-5 py-3 text-left font-medium">Customer</th>
                                    <th className="px-5 py-3 text-left font-medium">Phone</th>
                                    <th className="px-5 py-3 text-left font-medium">Address</th>
                                    <th className="px-5 py-3 text-right font-medium">Qty</th>
                                    <th className="px-5 py-3 text-right font-medium">Discount</th>
                                    <th className="px-5 py-3 text-right font-medium">Tax Rate</th>
                                    <th className="px-5 py-3 text-right font-medium">Tax Amt</th>
                                    <th className="px-5 py-3 text-right font-medium">Final Price</th>
                                    <th className="px-5 py-3 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {Array.from({ length: 11 }).map((__, j) => (
                                                <td key={j} className="px-5 py-4">
                                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filteredInvoices.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="text-center py-16 text-gray-400 text-sm"
                                        >
                                            {searchQuery
                                                ? "No invoices match your search."
                                                : "No sales invoices found."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvoices.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-5 py-3.5 font-medium text-blue-600">
                                                #{inv.id}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-800 font-medium">
                                                {inv.products?.name || "—"}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">
                                                {inv.customer_name || <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600">
                                                {inv.customer_phone || <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600 max-w-[160px] truncate">
                                                {inv.customer_address || <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-gray-700">
                                                {inv.quantity}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-orange-600">
                                                {inv.discount > 0
                                                    ? `MVR ${Number(inv.discount).toFixed(2)}`
                                                    : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-gray-600">
                                                {inv.tax_rate > 0
                                                    ? `${inv.tax_rate}%`
                                                    : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-gray-600">
                                                {inv.tax_amount > 0
                                                    ? `MVR ${Number(inv.tax_amount).toFixed(2)}`
                                                    : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-green-700">
                                                MVR {Number(inv.final_price).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                                                {formatDate(inv.created_at)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer count */}
                    {!loading && filteredInvoices.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Showing {filteredInvoices.length} of {invoices.length} invoice
                            {invoices.length !== 1 ? "s" : ""}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PosSales;
