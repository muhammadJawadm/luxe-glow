import React, { useEffect, useState } from "react";
import Header from "../../layouts/partials/header";
import {
    FiEdit2,
    FiSave,
    FiX,
    FiMail,
    FiInstagram,
    FiCheckCircle,
    FiAlertCircle,
    FiClock,
    FiMessageCircle,
} from "react-icons/fi";
import {
    fetchCustomerService,
    updateCustomerServiceItem,
} from "../../services/customerServiceServices";

// ─── channel config ──────────────────────────────────────────────────────────
const CHANNEL_CONFIG = {
    email: {
        label: "Email Address",
        icon: <FiMail className="w-6 h-6" />,
        placeholder: "e.g. support@luxeglow.mv",
        gradient: "from-rose-500 to-pink-600",
        bg: "bg-rose-50",
        border: "border-rose-200",
        badge: "bg-rose-100 text-rose-700",
        iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
    },
    instagram: {
        label: "Instagram Profile",
        icon: <FiInstagram className="w-6 h-6" />,
        placeholder: "e.g. https://www.instagram.com/luxeglowmv",
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-50",
        border: "border-purple-200",
        badge: "bg-purple-100 text-purple-700",
        iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    whatsapp1: {
        label: "WhatsApp 1",
        icon: <FiMessageCircle className="w-6 h-6" />,
        placeholder: "e.g. https://wa.me/qr/xxxxxx",
        gradient: "from-green-500 to-emerald-600",
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-100 text-green-700",
        iconBg: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    whatsapp2: {
        label: "WhatsApp 2",
        icon: <FiMessageCircle className="w-6 h-6" />,
        placeholder: "e.g. https://wa.me/qr/xxxxxx",
        gradient: "from-teal-500 to-green-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
        badge: "bg-teal-100 text-teal-700",
        iconBg: "bg-gradient-to-br from-teal-500 to-green-600",
    },
    whatsapp3: {
        label: "WhatsApp 3",
        icon: <FiMessageCircle className="w-6 h-6" />,
        placeholder: "e.g. https://wa.me/qr/xxxxxx",
        gradient: "from-cyan-500 to-teal-600",
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        badge: "bg-cyan-100 text-cyan-700",
        iconBg: "bg-gradient-to-br from-cyan-500 to-teal-600",
    },
};

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const isEmpty = (val) =>
    !val || val.trim() === "" || val.toUpperCase() === "NULL" || val.toUpperCase() === "EMPTY";

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
    if (!toast) return null;
    const isSuccess = toast.type === "success";
    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${isSuccess
                    ? "bg-white border-green-200 text-green-700"
                    : "bg-white border-red-200 text-red-600"
                } transition-all duration-300`}
        >
            {isSuccess ? (
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-green-500" />
            ) : (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
        </div>
    );
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gray-200" />
            <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-100 rounded w-36" />
            </div>
        </div>
        <div className="h-12 bg-gray-100 rounded-xl mb-4" />
        <div className="h-3 bg-gray-100 rounded w-40" />
    </div>
);

// ─── Channel Card ─────────────────────────────────────────────────────────────
const ChannelCard = ({ row, onSave }) => {
    const cfg = CHANNEL_CONFIG[row.id] || {
        label: row.id,
        icon: <FiMail className="w-6 h-6" />,
        gradient: "from-gray-400 to-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
        badge: "bg-gray-100 text-gray-700",
        iconBg: "bg-gradient-to-br from-gray-400 to-gray-600",
        placeholder: "Enter value…",
    };

    const [editing, setEditing] = useState(false);
    const [inputVal, setInputVal] = useState(row.data || "");
    const [saving, setSaving] = useState(false);
    const [localData, setLocalData] = useState(row.data);
    const [localUpdated, setLocalUpdated] = useState(row.updated_at);

    const handleEdit = () => {
        setInputVal(localData || "");
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
        setInputVal(localData || "");
    };

    const handleSave = async () => {
        setSaving(true);
        const result = await onSave(row.id, inputVal.trim());
        if (result) {
            setLocalData(inputVal.trim());
            setLocalUpdated(new Date().toISOString());
        }
        setSaving(false);
        setEditing(false);
    };

    const displayEmpty = isEmpty(localData);

    return (
        <div
            className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border ${cfg.border} overflow-hidden`}
        >
            {/* Top gradient bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />

            <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-4">
                        <div
                            className={`${cfg.iconBg} text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}
                        >
                            {cfg.icon}
                        </div>
                        <div>
                            <span
                                className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-1 ${cfg.badge}`}
                            >
                                {row.id}
                            </span>
                            <h3 className="text-base font-bold text-gray-800">{cfg.label}</h3>
                        </div>
                    </div>

                    {!editing && (
                        <button
                            onClick={handleEdit}
                            className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 flex-shrink-0"
                            title="Edit"
                        >
                            <FiEdit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Value / Edit input */}
                {editing ? (
                    <div className="space-y-3">
                        <input
                            autoFocus
                            type="text"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                if (e.key === "Escape") handleCancel();
                            }}
                            placeholder={cfg.placeholder}
                            className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-gray-800 bg-white transition-all"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-semibold rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all shadow-md disabled:opacity-60"
                            >
                                {saving ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FiSave className="w-4 h-4" />
                                )}
                                {saving ? "Saving…" : "Save"}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all"
                            >
                                <FiX className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={`w-full px-4 py-3 rounded-xl border text-sm break-all ${displayEmpty
                                ? `${cfg.bg} ${cfg.border} text-gray-400 italic`
                                : `${cfg.bg} ${cfg.border} text-gray-800 font-medium`
                            }`}
                    >
                        {displayEmpty ? "Not set" : localData}
                    </div>
                )}

                {/* Last updated */}
                {!editing && (
                    <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                        <FiClock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Updated {formatDate(localUpdated)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const CustomerService = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchCustomerService();
            setRows(data || []);
        } catch (err) {
            console.error("Error fetching customer service data:", err);
            showToast("error", "Failed to load customer service data.");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSave = async (id, newData) => {
        try {
            const result = await updateCustomerServiceItem(id, newData);
            if (result) {
                showToast("success", `"${id}" updated successfully!`);
                return true;
            } else {
                showToast("error", `Failed to update "${id}". Please try again.`);
                return false;
            }
        } catch (err) {
            console.error("Error saving:", err);
            showToast("error", "An unexpected error occurred.");
            return false;
        }
    };

    return (
        <div>
            <Header header="Customer Service" />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
                {/* Page intro */}
                <div className="mb-8">
                    <p className="text-gray-500 text-sm">
                        Manage your customer-facing contact channels. Click the pencil icon
                        on any card to edit its value.
                    </p>
                </div>

                {/* Cards grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <FiMail className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg font-medium">
                            No customer service data found.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {rows.map((row) => (
                            <ChannelCard key={row.id} row={row} onSave={handleSave} />
                        ))}
                    </div>
                )}
            </div>

            {/* Toast notification */}
            <Toast toast={toast} />
        </div>
    );
};

export default CustomerService;
