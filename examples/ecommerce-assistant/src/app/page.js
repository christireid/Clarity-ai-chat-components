'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * E-Commerce Shopping Assistant
 * AI-powered shopping experience with product recommendations
 */
import { useState } from 'react';
import { ShoppingCart, Sparkles, Package } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { products } from '@/lib/products';
import { useCart } from '@/lib/store';
export default function ECommerceAssistant() {
    const [showCart, setShowCart] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const cart = useCart();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-purple-50 to-blue-50", children: [_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center", children: _jsx(Sparkles, { className: "w-6 h-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "ShopBot AI" }), _jsx("p", { className: "text-sm text-gray-600", children: "Your personal shopping assistant" })] })] }), _jsxs("button", { onClick: () => setShowCart(!showCart), className: "relative p-2 rounded-lg hover:bg-gray-100 transition-colors", children: [_jsx(ShoppingCart, { className: "w-6 h-6" }), cart.items.length > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: cart.items.length }))] })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(ChatInterface, { onProductsRecommended: setRecommendedProducts }) }), _jsxs("div", { className: "space-y-6", children: [recommendedProducts.length > 0 && (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Package, { className: "w-5 h-5 text-purple-600" }), _jsx("h2", { className: "text-lg font-semibold", children: "Recommended for You" })] }), _jsx("div", { className: "space-y-4", children: recommendedProducts.slice(0, 3).map((productId) => {
                                                const product = products.find((p) => p.id === productId);
                                                return product ? (_jsx(ProductCard, { product: product, compact: true }, product.id)) : null;
                                            }) })] })), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Shopping Stats" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Products Viewed" }), _jsx("span", { className: "font-semibold", children: recommendedProducts.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "In Cart" }), _jsx("span", { className: "font-semibold", children: cart.items.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Cart Total" }), _jsxs("span", { className: "font-semibold text-purple-600", children: ["$", cart.total.toFixed(2)] })] })] })] })] })] }) }), showCart && _jsx(Cart, { onClose: () => setShowCart(false) })] }));
}
//# sourceMappingURL=page.js.map