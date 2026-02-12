import React, { useState, useEffect } from "react";
import Header from "../../layouts/partials/header";
import SellProductForm from "./SellProductForm";
import { FiSearch, FiX } from "react-icons/fi";
import { fetchProducts, updateProduct } from "../../services/productServices";
import { createInvoice } from "../../services/posInvoiceServices";
import { generateInvoicePDF, prepareInvoiceData } from "../../utils/invoiceGenerator";

const PosSell = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await fetchProducts();
                console.log('Full response:', response);
                console.log('response.data:', response.data);
                const productsArray = Array.isArray(response) ? response : (response.data || []);
                setProducts(productsArray);
            } catch (error) {
                console.error("Error fetching products:", error);
                alert("Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSearchQuery("");
    };

    const handleClearSelection = () => {
        setSelectedProduct(null);
    };

    const handleSellSubmit = async (data) => {
        try {
            // Calculate new stock level
            const newStockLevel = selectedProduct.stock_level - data.quantity;

            if (newStockLevel < 0) {
                alert("Insufficient stock! Cannot sell more than available quantity.");
                return;
            }

            // 1. Save invoice to database
            const invoiceData = {
                product_id: selectedProduct.id,
                final_price: data.grandTotal,
                discount: data.discount || 0,
                quantity: data.quantity
            };

            const invoiceResponse = await createInvoice(invoiceData);

            if (!invoiceResponse || invoiceResponse.length === 0) {
                throw new Error("Failed to create invoice in database");
            }

            const invoiceId = invoiceResponse[0].id;

            // 2. Update product stock in database
            await updateProduct(selectedProduct.id, {
                stock_level: newStockLevel
            });

            // 3. Generate and download PDF invoice
            const pdfInvoiceData = prepareInvoiceData({
                product: selectedProduct,
                quantity: data.quantity,
                price: data.price,
                discount: data.discount,
                subtotal: data.subtotal,
                taxRate: data.taxRate,
                taxAmount: data.taxAmount,
                finalPrice: data.grandTotal,
                invoiceId: invoiceId,
                customerInfo: data.customerInfo || {}
            });

            const pdfFileName = generateInvoicePDF(pdfInvoiceData);

            // 4. Show success message
            alert(
                `Sale completed successfully!\n\n` +
                `Invoice ID: ${invoiceId}\n` +
                `Product: ${selectedProduct.name}\n` +
                `Quantity: ${data.quantity} unit(s)\n` +
                `Total Amount: MVR ${(data.grandTotal * data.quantity).toFixed(2)}\n` +
                `${data.discount > 0 ? `Discount Applied: MVR ${(data.discount * data.quantity).toFixed(2)}\n` : ''}` +
                `\nPDF Invoice: ${pdfFileName} has been downloaded.`
            );

            // 5. Refresh products list
            const response = await fetchProducts();
            setProducts(Array.isArray(response) ? response : (response.data || []));

            // 6. Clear selection
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error processing sale:", error);
            alert(`Failed to process sale: ${error.message}. Please try again.`);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.upc_number?.toString().includes(searchQuery) ||
        product.brands?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categories?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header header="Sell Products" />

            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6 space-y-6">
                {/* Search and Product Selection */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Sell Products</h2>

                        <div className="relative w-full md:w-96">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Search products..."
                                disabled={loading}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <FiX className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    {!selectedProduct && (
                        <div className="mt-6">
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Loading products...
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No products available. Please add products first.
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                                        {searchQuery
                                            ? `Search Results (${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'})`
                                            : `Quick Select (${filteredProducts.length} products)`}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                        {filteredProducts.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleProductSelect(product)}
                                                className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-colors text-center"
                                            >
                                                <img
                                                    src={product.product_images?.[0]?.image_url || "https://via.placeholder.com/150"}
                                                    alt={product.name}
                                                    className="w-16 h-16 mx-auto object-cover rounded mb-2"
                                                />
                                                <span className="text-sm font-medium block truncate">{product.name}</span>
                                                <span className="text-xs text-gray-500">MVR {product.price}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {selectedProduct && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Selling: {selectedProduct.name}
                            </h2>
                            <button
                                onClick={handleClearSelection}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <img
                                        src={selectedProduct.product_images?.[0]?.image_url || "https://via.placeholder.com/150"}
                                        alt={selectedProduct.name}
                                        className="w-full h-48 object-cover rounded"
                                    />
                                    <div className="mt-4">
                                        <h3 className="font-bold text-lg">
                                            {selectedProduct.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedProduct.description || 'No description'}
                                        </p>
                                        <div className="mt-3 space-y-2">
                                            {selectedProduct.brands?.name && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Brand:</span>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                        {selectedProduct.brands.name}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedProduct.categories?.name && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Category:</span>
                                                    <span className="px-2 py-1 bg-primary/10 text-primary/80 text-xs rounded-full">
                                                        {selectedProduct.categories.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Available Stock:</span>
                                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${selectedProduct.stock_level < 5
                                                    ? 'bg-red-100 text-red-800'
                                                    : selectedProduct.stock_level < 10
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {selectedProduct.stock_level} units
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-2/3">
                                <SellProductForm
                                    product={selectedProduct}
                                    onSell={handleSellSubmit}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PosSell;