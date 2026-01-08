import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Product Recommendation Object Example
 *
 * Demonstrates useClarityObject for structured output generation.
 * Given a query, the model returns a structured Product[] object.
 */
import * as React from 'react';
import { useClarityObject } from '../hooks/use-clarity-object';
import { Card, CardContent, CardHeader, Button, Badge, } from '@clarity-chat/primitives';
export function ProductRecommendationExample() {
    const { input, setInput, object: products, isLoading, error, run, reset, } = useClarityObject({
        api: '/api/generate-products',
        initialInput: {
            query: '',
            maxResults: 5,
        },
        onFinish: (result) => {
            logger.debug('Generated products:', result);
        },
        onError: (err) => {
            logger.logger.error('Error generating products:', err);
        },
    });
    const handleSearch = React.useCallback(async () => {
        if (!input.query.trim())
            return;
        await run();
    }, [input, run]);
    // Mock products for demo (in real app, these come from API)
    const mockProducts = products || [
        {
            name: 'Gaming Laptop Pro',
            price: 1299.99,
            description: 'High-performance gaming laptop with RTX 4070',
            category: 'Electronics',
            rating: 4.5,
            inStock: true,
        },
        {
            name: 'Wireless Mouse',
            price: 29.99,
            description: 'Ergonomic wireless mouse with long battery life',
            category: 'Accessories',
            rating: 4.2,
            inStock: true,
        },
    ];
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "Product Recommendations" }), _jsx("p", { className: "text-muted-foreground", children: "Use structured output to generate product recommendations" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-semibold", children: "Search Products" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: input.query, onChange: (e) => setInput({ ...input, query: e.target.value }), placeholder: "e.g., gaming laptops, wireless mice...", className: "flex-1 px-4 py-2 border rounded-lg", onKeyDown: (e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch();
                                            }
                                        }, disabled: isLoading }), _jsx(Button, { onClick: handleSearch, disabled: isLoading || !input.query.trim(), children: isLoading ? 'Generating...' : 'Search' }), products && (_jsx(Button, { variant: "outline", onClick: reset, children: "Reset" }))] }), _jsxs("div", { className: "mt-4 flex gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Max Results:" }), _jsx("input", { type: "number", value: input.maxResults || 5, onChange: (e) => setInput({
                                                    ...input,
                                                    maxResults: parseInt(e.target.value, 10) || 5,
                                                }), className: "ml-2 w-20 px-2 py-1 border rounded", min: 1, max: 20 })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Category:" }), _jsx("input", { type: "text", value: input.category || '', onChange: (e) => setInput({ ...input, category: e.target.value }), placeholder: "Optional", className: "ml-2 px-2 py-1 border rounded" })] })] })] })] }), error && (_jsx(Card, { className: "border-red-200 bg-red-50", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("p", { className: "text-red-800", children: [_jsx("strong", { children: "Error:" }), " ", error.message] }) }) })), isLoading && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "text-center text-muted-foreground", children: "Generating product recommendations..." }) }) })), products && mockProducts.length > 0 && (_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-semibold mb-4", children: ["Recommended Products (", mockProducts.length, ")"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: mockProducts.map((product, idx) => (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: product.name }), product.inStock && (_jsx(Badge, { variant: "success", children: "In Stock" }))] }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsxs("span", { className: "text-2xl font-bold", children: ["$", product.price.toFixed(2)] }), product.rating && (_jsxs(Badge, { variant: "secondary", children: ["\u2B50 ", product.rating] }))] })] }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-sm text-muted-foreground mb-2", children: product.description }), _jsx(Badge, { variant: "outline", children: product.category })] })] }, idx))) })] })), products && mockProducts.length === 0 && (_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsx("div", { className: "text-center text-muted-foreground", children: "No products found. Try a different search query." }) }) }))] }));
}
//# sourceMappingURL=product-recommendation-object.js.map