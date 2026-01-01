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
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Blurred backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-900/50 backdrop-blur-sm"
                    onClick={handleClose}
                ></div>

                <div
                    ref={modalRef}
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            {orderedProduct ? "Edit Ordered Product" : "Add Ordered Product"}
                        </h2>

                        <div className="space-y-4">
                            {/* Product Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product *
                                </label>
                                <select
                                    name="product_id"
                                    value={formData.product_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order *
                                </label>
                                <select
                                    name="order_id"
                                    value={formData.order_id}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    min="1"
                                    className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter quantity"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/80 focus:outline-none sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white mr-2"
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
                                orderedProduct ? "Update" : "Save"
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderedProductModal;
