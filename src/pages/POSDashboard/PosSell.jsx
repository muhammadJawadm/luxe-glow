import React, { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import { FiSearch, FiX, FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiPrinter, FiDownload, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { fetchProducts, updateProduct } from "../../services/productServices";
import { createInvoice } from "../../services/posInvoiceServices";
import { fetchCheckoutConfig } from "../../services/checkoutConfigServices";
import { generateMultiInvoicePDF, printMultiInvoice } from "../../utils/invoiceGenerator";
import CustomerInfoModal from "../../components/CustomerInfoModal";

const PosSell = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [taxRate, setTaxRate] = useState(0);
    const [cart, setCart] = useState([]); // [{product, quantity, discountType, discountValue, discountAmount, subtotal, taxAmount, grandTotal, showDiscount}]
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [lastInvoice, setLastInvoice] = useState(null); // store last sale for re-print

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [res, config] = await Promise.all([fetchProducts(), fetchCheckoutConfig()]);
                const arr = Array.isArray(res) ? res : (res.data || []);
                setProducts(arr);
                if (config?.tax_rate !== undefined) setTaxRate(config.tax_rate);
            } catch (e) {
                console.error("Error loading:", e);
                alert("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // â”€â”€â”€ Cart helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const calcItem = (item) => {
        const base = parseFloat(item.product.price) || 0;
        let disc = 0;
        if (item.discountType === "percentage") {
            disc = base * (parseFloat(item.discountValue) || 0) / 100;
        } else {
            disc = parseFloat(item.discountValue) || 0;
        }
        disc = Math.min(disc, base);
        const subtotal = base - disc;
        const taxAmount = subtotal * (taxRate / 100);
        const grandTotal = subtotal + taxAmount;
        return {
            ...item,
            discountAmount: parseFloat(disc.toFixed(2)),
            subtotal: parseFloat(subtotal.toFixed(2)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
        };
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                // Increase qty if already in cart
                return prev.map(i => i.product.id === product.id
                    ? calcItem({ ...i, quantity: Math.min(i.quantity + 1, product.stock_level) })
                    : i
                );
            }
            return [...prev, calcItem({
                product,
                quantity: 1,
                discountType: "percentage",
                discountValue: 0,
                showDiscount: false,
            })];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(i => i.product.id !== productId));
    };

    const updateQty = (productId, qty) => {
        setCart(prev => prev.map(i => i.product.id === productId
            ? calcItem({ ...i, quantity: Math.max(1, Math.min(qty, i.product.stock_level)) })
            : i
        ));
    };

    const updateDiscount = (productId, field, value) => {
        setCart(prev => prev.map(i => i.product.id === productId
            ? calcItem({ ...i, [field]: value })
            : i
        ));
    };

    const toggleDiscount = (productId) => {
        setCart(prev => prev.map(i => i.product.id === productId
            ? { ...i, showDiscount: !i.showDiscount }
            : i
        ));
    };

    const cartTotal = cart.reduce((sum, i) => sum + i.grandTotal * i.quantity, 0);
    const cartSubtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const cartDiscount = cart.reduce((sum, i) => sum + i.discountAmount * i.quantity, 0);
    const cartTax = cart.reduce((sum, i) => sum + i.taxAmount * i.quantity, 0);

    // â”€â”€â”€ Checkout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const handleCheckout = () => {
        if (cart.length === 0) { alert("Cart is empty."); return; }
        setShowCustomerModal(true);
    };

    const handleCustomerSubmit = async (customerInfo) => {
        setProcessing(true);
        try {
            // Generate a single shared invoice_id for all items in this cart
            const sharedInvoiceId = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            const invoiceIds = [];

            for (const item of cart) {
                const newStock = item.product.stock_level - item.quantity;
                if (newStock < 0) {
                    alert(`Insufficient stock for "${item.product.name}". Only ${item.product.stock_level} unit(s) available.`);
                    setProcessing(false);
                    return;
                }

                const inv = await createInvoice({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    discount: item.discountAmount,
                    tax_rate: taxRate,
                    tax_amount: item.taxAmount,
                    final_price: item.grandTotal,
                    customer_name: customerInfo.name || null,
                    customer_phone: customerInfo.phone || null,
                    customer_address: customerInfo.address || null,
                    invoice_id: sharedInvoiceId,
                });

                if (!inv || inv.length === 0) throw new Error(`Failed to save invoice for ${item.product.name}`);
                invoiceIds.push(inv[0].id);

                await updateProduct(item.product.id, { stock_level: newStock });
            }

            const invoicePayload = { cartItems: cart, taxRate, customerInfo, invoiceId: sharedInvoiceId };
            setLastInvoice(invoicePayload);

            // Download PDF
            generateMultiInvoicePDF(invoicePayload);

            // Refresh products
            const res = await fetchProducts();
            setProducts(Array.isArray(res) ? res : (res.data || []));

            alert(
                `âœ… Sale completed!\n\n` +
                `${cart.length} product(s) sold\n` +
                `Invoice ID: ${sharedInvoiceId}\n` +
                `Customer: ${customerInfo.name || "Walk-in"}\n` +
                `Grand Total: MVR ${cartTotal.toFixed(2)}\n\n` +
                `PDF invoice has been downloaded.`
            );

            setCart([]);
        } catch (e) {
            console.error("Sale error:", e);
            alert(`Failed to complete sale: ${e.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.upc_number?.toString().includes(searchQuery) ||
        p.brands?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categories?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header header="Sell Products" />

            <CustomerInfoModal
                isOpen={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                onSubmit={handleCustomerSubmit}
            />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* â”€â”€ Left: Product grid â”€â”€ */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                            <h2 className="text-xl font-bold text-gray-800">Select Products</h2>
                            <div className="relative w-full sm:w-80">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                                    placeholder="Search productsâ€¦"
                                    disabled={loading}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <FiX className="text-gray-400 hover:text-gray-600" size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Loading productsâ€¦</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">No products found.</div>
                        ) : (
                            <>
                                <p className="text-xs text-gray-400 mb-3">{filteredProducts.length} product(s) â€” click to add to cart</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {filteredProducts.map(product => {
                                        const inCart = cart.find(i => i.product.id === product.id);
                                        return (
                                            <button
                                                key={product.id}
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock_level === 0}
                                                className={`relative p-3 border rounded-lg text-center transition-all ${product.stock_level === 0
                                                    ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-50"
                                                    : inCart
                                                        ? "border-primary bg-primary/5 hover:bg-primary/10"
                                                        : "border-gray-200 bg-white hover:border-primary hover:bg-gray-50"
                                                    }`}
                                            >
                                                {inCart && (
                                                    <span className="absolute top-1 right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                                        {inCart.quantity}
                                                    </span>
                                                )}
                                                <img
                                                    src={product.product_images?.[0]?.image_url || "https://via.placeholder.com/80"}
                                                    alt={product.name}
                                                    className="w-14 h-14 mx-auto object-cover rounded mb-2"
                                                />
                                                <span className="text-xs font-semibold block truncate text-gray-800">{product.name}</span>
                                                <span className="text-xs text-primary font-bold">MVR {product.price}</span>
                                                <span className={`text-xs block mt-1 ${product.stock_level < 5 ? "text-red-500" : "text-gray-400"}`}>
                                                    Stock: {product.stock_level}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* â”€â”€ Right: Cart â”€â”€ */}
                    <div className="w-full lg:w-[420px] flex flex-col gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-5 flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FiShoppingCart className="text-primary" />
                                    Cart
                                    {cart.length > 0 && (
                                        <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 font-semibold">{cart.length}</span>
                                    )}
                                </h2>
                                {cart.length > 0 && (
                                    <button onClick={() => setCart([])} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                                    <FiShoppingCart size={48} />
                                    <p className="mt-3 text-sm text-gray-400">Cart is empty â€” click a product to add</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                                    {cart.map(item => (
                                        <div key={item.product.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                                            {/* Product header */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                                                    <p className="text-xs text-gray-400">MVR {item.product.price} / unit</p>
                                                </div>
                                                <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                                                    <FiTrash2 size={15} />
                                                </button>
                                            </div>

                                            {/* Qty stepper */}
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xs text-gray-500 w-8">Qty:</span>
                                                <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-white">
                                                    <button
                                                        onClick={() => updateQty(item.product.id, item.quantity - 1)}
                                                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <FiMinus size={12} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={e => updateQty(item.product.id, parseInt(e.target.value) || 1)}
                                                        className="w-10 text-center text-sm border-x border-gray-200 py-1"
                                                        min="1"
                                                        max={item.product.stock_level}
                                                    />
                                                    <button
                                                        onClick={() => updateQty(item.product.id, item.quantity + 1)}
                                                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
                                                        disabled={item.quantity >= item.product.stock_level}
                                                    >
                                                        <FiPlus size={12} />
                                                    </button>
                                                </div>
                                                <span className="text-xs text-gray-400 ml-1">max {item.product.stock_level}</span>

                                                {/* Discount toggle */}
                                                <button
                                                    onClick={() => toggleDiscount(item.product.id)}
                                                    className="ml-auto text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                                                >
                                                    Disc {item.showDiscount ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                                                </button>
                                            </div>

                                            {/* Discount controls */}
                                            {item.showDiscount && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <select
                                                        value={item.discountType}
                                                        onChange={e => updateDiscount(item.product.id, "discountType", e.target.value)}
                                                        className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white"
                                                    >
                                                        <option value="percentage">%</option>
                                                        <option value="fixed">MVR</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        value={item.discountValue}
                                                        onChange={e => updateDiscount(item.product.id, "discountValue", e.target.value)}
                                                        className="w-20 text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                                                        min="0"
                                                        max={item.discountType === "percentage" ? 100 : item.product.price}
                                                        step={item.discountType === "percentage" ? 1 : 0.01}
                                                        placeholder="0"
                                                    />
                                                    {item.discountAmount > 0 && (
                                                        <span className="text-xs text-red-500">-MVR {(item.discountAmount * item.quantity).toFixed(2)}</span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Line total */}
                                            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                                <span>Tax ({taxRate}%): MVR {(item.taxAmount * item.quantity).toFixed(2)}</span>
                                                <span className="font-bold text-sm text-primary">MVR {(item.grandTotal * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* â”€â”€ Summary & Checkout â”€â”€ */}
                        {cart.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Order Summary</h3>
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    <div className="flex justify-between"><span>Subtotal</span><span>MVR {cartSubtotal.toFixed(2)}</span></div>
                                    {cartDiscount > 0 && <div className="flex justify-between text-red-500"><span>Discount</span><span>-MVR {cartDiscount.toFixed(2)}</span></div>}
                                    <div className="flex justify-between text-blue-600"><span>Tax ({taxRate}%)</span><span>+MVR {cartTax.toFixed(2)}</span></div>
                                    <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between font-bold text-base text-gray-800">
                                        <span>Grand Total</span>
                                        <span className="text-primary">MVR {cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={processing}
                                    className="mt-4 w-full py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {processing ? "Processingâ€¦" : (
                                        <><FiShoppingCart size={16} /> Complete Sale &amp; Save Invoice</>
                                    )}
                                </button>

                                {/* Re-print last invoice */}
                                {lastInvoice && (
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => printMultiInvoice(lastInvoice)}
                                            className="flex-1 py-2 text-xs border border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <FiPrinter size={13} /> Print Last Invoice
                                        </button>
                                        <button
                                            onClick={() => generateMultiInvoicePDF(lastInvoice)}
                                            className="flex-1 py-2 text-xs border border-green-200 text-green-600 hover:bg-green-50 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <FiDownload size={13} /> Download Last PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosSell;
