'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShoppingCart } from 'lucide-react';
export function ProductCard({ product, compact }) {
    if (compact) {
        return (_jsxs("div", { className: "flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center", children: _jsx(ShoppingCart, { className: "w-6 h-6 text-gray-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium", children: product.name }), _jsxs("p", { className: "text-purple-600 font-semibold", children: ["$", product.price] })] })] }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow", children: [_jsx("div", { className: "h-48 bg-gray-200 flex items-center justify-center", children: _jsx(ShoppingCart, { className: "w-12 h-12 text-gray-400" }) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: product.name }), _jsx("p", { className: "text-gray-600 text-sm mb-4", children: product.description }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-2xl font-bold text-purple-600", children: ["$", product.price] }), _jsx("button", { className: "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: "Add to Cart" })] })] })] }));
}
//# sourceMappingURL=ProductCard.js.map