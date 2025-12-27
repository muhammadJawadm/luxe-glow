import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

const OrderedProductModal = ({ isOpen, onClose, onSave, orderedProduct }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        product_id: "",
        order_id: "",
        quantity: 1,
    });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch products and orders for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const { data: productsData, error: productsError } = await supabase
                    .from("products")
                    .select("id, name, price")
                    .order("name");

                if (productsError) throw productsError;
                setProducts(productsData || []);

                // Fetch orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from("orders")
                    .select("id, user_id, total_amount, status, users(name)")
                    .order("created_at", { ascending: false });

                if (ordersError) throw ordersError;
                setOrders(ordersData || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Pre-fill form when editing
    useEffect(() => {
        if (orderedProduct) {
            setFormData({
                product_id: orderedProduct.product_id || "",
                order_id: orderedProduct.order_id || "",
                quantity: orderedProduct.quantity || 1,
            });
        } else {
            setFormData({
                product_id: "",
                order_id: "",
                quantity: 1,
            });
        }
    }, [orderedProduct, isOpen]);

    const handleClose = () => {
        setFormData({
            product_id: "",
            order_id: "",
            quantity: 1,
        });
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? parseInt(value) || 1 : value,
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.product_id || !formData.order_id || formData.quantity < 1) {
            alert("Please fill in all fields with valid values.");
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            handleClose();
        } catch (error) {
            console.error("Error saving ordered product:", error);
            alert("Failed to save ordered product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
            <div
                ref={modalRef}
                className="mx-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                    {orderedProduct ? "Edit Ordered Product" : "Add Ordered Product"}
                </h2>

                {/* Product Selection */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Product *
                    </label>
                    <select
                        name="product_id"
                        value={formData.product_id}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name} - MVR {product.price}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Order Selection */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Order *
                    </label>
                    <select
                        name="order_id"
                        value={formData.order_id}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                    >
                        <option value="">Select an order</option>
                        {orders.map((order) => (
                            <option key={order.id} value={order.id}>
                                Order #{order.id} - {order.users?.name || "Unknown"} - MVR {order.total_amount} ({order.status})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Quantity *
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter quantity"
                        required
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderedProductModal;
