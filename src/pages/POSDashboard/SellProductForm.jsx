import React, { useState, useEffect } from "react";

const SellProductForm = ({ product, onSell }) => {
    const [price, setPrice] = useState("");
    const [condition, setCondition] = useState("new");
    const [quantity, setQuantity] = useState(1);
    const [shippingOption, setShippingOption] = useState("standard");
    const [discountType, setDiscountType] = useState("percentage"); // percentage or fixed
    const [discountValue, setDiscountValue] = useState(0);


    // Set price from product when product changes
    useEffect(() => {
        if (product?.price) {
            setPrice(product.price.toString());
        }
    }, [product]);

    // Calculate discount amount and final price
    const calculatePrices = () => {
        const basePrice = parseFloat(price) || 0;
        let discountAmount = 0;

        if (discountType === "percentage") {
            discountAmount = basePrice * (parseFloat(discountValue) || 0) / 100;
        } else {
            discountAmount = parseFloat(discountValue) || 0;
        }

        // Ensure discount doesn't exceed price
        discountAmount = Math.min(discountAmount, basePrice);
        const finalPrice = basePrice - discountAmount;

        return {
            discountAmount: discountAmount.toFixed(2),
            finalPrice: finalPrice.toFixed(2)
        };
    };

    const { discountAmount, finalPrice } = calculatePrices();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate stock
        if (quantity > product.stock_level) {
            alert(`Cannot sell ${quantity} units. Only ${product.stock_level} units available in stock.`);
            return;
        }

        onSell({
            productId: product.id,
            name: product.name,
            price: parseFloat(price),
            discount: parseFloat(discountAmount),
            finalPrice: parseFloat(finalPrice),
            condition,
            quantity,
            shippingOption,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                    </label>
                    <input
                        type="text"
                        value={product.name}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (MVR)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            MVR
                        </span>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-16 border border-gray-200 rounded px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Available Stock
                    </label>
                    <input
                        type="text"
                        value={`${product.stock_level || 0} units`}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2.5 text-gray-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition
                    </label>
                    <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        <option value="new">New</option>
                        <option value="used-like-new">Used - Like New</option>
                        <option value="used-good">Used - Good</option>
                        <option value="used-fair">Used - Fair</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity (Max: {product.stock_level || 0})
                    </label>
                    <div className="flex border border-gray-200 rounded overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Math.max(1, Math.min(product.stock_level || 1, parseInt(e.target.value) || 1)))
                            }
                            className="w-16 text-center border-x border-gray-200"
                            min="1"
                            max={product.stock_level || 1}
                        />
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.min(product.stock_level || 1, quantity + 1))}
                            className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                            disabled={quantity >= (product.stock_level || 0)}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Options
                    </label>
                    <select
                        value={shippingOption}
                        onChange={(e) => setShippingOption(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        <option value="standard">Standard Shipping</option>
                        <option value="expedited">Expedited Shipping</option>
                        <option value="pickup">Local Pickup</option>
                    </select>
                </div>
            </div>

            {/* Discount Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Discount & Pricing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Type
                        </label>
                        <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (MVR)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Value
                        </label>
                        <div className="relative">
                            {discountType === "percentage" && (
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    %
                                </span>
                            )}
                            {discountType === "fixed" && (
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    MVR
                                </span>
                            )}
                            <input
                                type="number"
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                                className={`w-full border border-gray-200 rounded px-3 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${discountType === "fixed" ? "pl-16" : "pr-8"
                                    }`}
                                placeholder="0"
                                min="0"
                                max={discountType === "percentage" ? "100" : price}
                                step={discountType === "percentage" ? "1" : "0.01"}
                            />
                        </div>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="mt-6 space-y-2 bg-white p-4 rounded border border-gray-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Original Price:</span>
                        <span className="font-medium">MVR {parseFloat(price || 0).toFixed(2)}</span>
                    </div>
                    {parseFloat(discountAmount) > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-medium text-red-600">-MVR {discountAmount}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Final Price (per unit):</span>
                            <span className="font-bold text-lg text-primary">MVR {finalPrice}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Total Amount ({quantity} unit{quantity > 1 ? 's' : ''}):</span>
                            <span className="font-bold text-xl text-green-600">MVR {(parseFloat(finalPrice) * quantity).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-all transform hover:scale-105"
                >
                    Complete Sale & Generate Invoice
                </button>
            </div>
        </form>
    );
};

export default SellProductForm;