import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
export const metadata = {
    title: 'Ecommerce Assistant Example',
    description: 'AI shopping assistant with product recommendations and cart management',
};
export default function EcommerceAssistantPage() {
    return (_jsxs("div", { className: "container-docs py-12", children: [_jsxs(Link, { href: "/examples", className: "inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Examples"] }), _jsxs("div", { className: "max-w-4xl", children: [_jsxs("div", { className: "flex items-start gap-4 mb-8", children: [_jsx("div", { className: "p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl", children: _jsx(ShoppingCart, { className: "w-8 h-8" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: "Ecommerce Assistant" }), _jsx("p", { className: "text-xl text-text-secondary", children: "AI shopping assistant with personalized recommendations and conversational commerce" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-8", children: [_jsx("span", { className: "px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium", children: "Intermediate" }), _jsx("span", { className: "px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm", children: "Ecommerce" }), _jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm", children: "Conversational Commerce" })] }), _jsxs("div", { className: "prose prose-lg dark:prose-invert max-w-none", children: [_jsx("h2", { children: "\u2728 Features" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Product Discovery" }), " - Natural language product search"] }), _jsxs("li", { children: [_jsx("strong", { children: "Smart Recommendations" }), " - Personalized suggestions based on preferences"] }), _jsxs("li", { children: [_jsx("strong", { children: "Cart Management" }), " - Add, remove, update cart via conversation"] }), _jsxs("li", { children: [_jsx("strong", { children: "Order Tracking" }), " - Check order status and shipping info"] }), _jsxs("li", { children: [_jsx("strong", { children: "Size/Fit Guidance" }), " - Help customers choose the right size"] }), _jsxs("li", { children: [_jsx("strong", { children: "Product Comparison" }), " - Side-by-side comparisons"] }), _jsxs("li", { children: [_jsx("strong", { children: "Review Summaries" }), " - AI-generated review highlights"] }), _jsxs("li", { children: [_jsx("strong", { children: "Checkout Assistance" }), " - Guide through purchase process"] })] }), _jsx("h2", { children: "\uD83D\uDE80 Quick Start" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `cd examples/ecommerce-assistant
npm install
npm run dev

# Visit http://localhost:3000` }) }), _jsx("h2", { children: "\uD83D\uDCAC Example Conversations" }), _jsx("h3", { children: "Product Search" }), _jsxs("div", { className: "bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4", children: [_jsx("p", { className: "font-medium mb-2", children: "\uD83D\uDC64 Customer: \"I need running shoes for marathons\"" }), _jsx("p", { className: "text-text-secondary text-sm mb-4", children: "\uD83E\uDD16 Assistant shows:" }), _jsxs("div", { className: "grid md:grid-cols-3 gap-3 text-xs", children: [_jsxs("div", { className: "p-3 border border-border rounded", children: [_jsx("div", { className: "font-medium", children: "Nike Pegasus 40" }), _jsx("div", { className: "text-text-secondary", children: "$130 \u2022 \u2B50 4.8/5" }), _jsx("div", { className: "mt-1 text-green-600", children: "Best for daily training" })] }), _jsxs("div", { className: "p-3 border border-border rounded", children: [_jsx("div", { className: "font-medium", children: "Brooks Ghost 15" }), _jsx("div", { className: "text-text-secondary", children: "$140 \u2022 \u2B50 4.9/5" }), _jsx("div", { className: "mt-1 text-green-600", children: "Most comfortable" })] }), _jsxs("div", { className: "p-3 border border-border rounded", children: [_jsx("div", { className: "font-medium", children: "ASICS Gel-Nimbus" }), _jsx("div", { className: "text-text-secondary", children: "$160 \u2022 \u2B50 4.7/5" }), _jsx("div", { className: "mt-1 text-green-600", children: "Best cushioning" })] })] })] }), _jsx("h3", { children: "Cart Management" }), _jsxs("div", { className: "bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4", children: [_jsx("p", { className: "font-medium mb-2", children: "\uD83D\uDC64 Customer: \"Add the Nike shoes to my cart in size 10\"" }), _jsx("p", { className: "text-sm text-green-600 mb-2", children: "\u2705 Added Nike Pegasus 40 (Size 10) to cart" }), _jsx("p", { className: "text-text-secondary text-sm", children: "\uD83E\uDD16 \"Great choice! Your cart total is $130. Need socks or running accessories?\"" })] }), _jsx("h2", { children: "\uD83C\uDFD7\uFE0F Architecture" }), _jsx("h3", { children: "Product Search Functions" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `const ecommerceFunctions = [
  {
    name: 'search_products',
    description: 'Search product catalog',
    parameters: {
      query: 'string',
      category: 'string?',
      priceRange: 'object?',
      filters: 'object?'
    }
  },
  {
    name: 'get_product_details',
    description: 'Get full product information',
    parameters: {
      productId: 'string'
    }
  },
  {
    name: 'add_to_cart',
    description: 'Add item to shopping cart',
    parameters: {
      productId: 'string',
      quantity: 'number',
      variant: 'object?' // size, color, etc.
    }
  },
  {
    name: 'get_cart',
    description: 'View current cart contents',
    parameters: {}
  },
  {
    name: 'track_order',
    description: 'Check order status',
    parameters: {
      orderId: 'string'
    }
  }
]` }) }), _jsx("h2", { children: "\uD83C\uDFAF Key Features Demonstrated" }), _jsx("h3", { children: "1. Natural Language Commerce" }), _jsx("p", { children: "Customers describe what they want in natural language, and the AI interprets intent, searches products, and provides recommendations." }), _jsx("h3", { children: "2. Context-Aware Recommendations" }), _jsx("p", { children: "Based on conversation history, cart contents, and browsing behavior, suggest relevant complementary products." }), _jsx("h3", { children: "3. Conversational Checkout" }), _jsx("p", { children: "Guide customers through checkout with questions like \"Should I ship to your usual address?\" or \"Use your saved payment method?\"" }), _jsx("h2", { children: "\uD83D\uDCE6 Integration Options" }), _jsx("h3", { children: "Shopify" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `import { Shopify } from '@shopify/shopify-api'

const client = new Shopify.Clients.Storefront(...)
const products = await client.query({ ... })` }) }), _jsx("h3", { children: "WooCommerce" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

const api = new WooCommerceRestApi({ ... })
const { data } = await api.get('products')` }) }), _jsx("h3", { children: "Custom API" }), _jsx("pre", { className: "bg-surface-muted p-4 rounded-lg", children: _jsx("code", { children: `// Your own product API
const products = await fetch('/api/products/search', {
  method: 'POST',
  body: JSON.stringify({ query, filters })
})` }) }), _jsx("h2", { children: "\uD83D\uDCCA Conversion Optimization" }), _jsx("p", { children: "Features that improve sales:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Instant Answers" }), " - Reduce friction with immediate product info"] }), _jsxs("li", { children: [_jsx("strong", { children: "Cross-selling" }), " - Suggest complementary products naturally"] }), _jsxs("li", { children: [_jsx("strong", { children: "Size Guidance" }), " - Reduce returns with better sizing help"] }), _jsxs("li", { children: [_jsx("strong", { children: "24/7 Availability" }), " - No wait times for customer questions"] })] }), _jsx("h2", { children: "\uD83D\uDD17 Related Examples" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx(Link, { href: "/examples/customer-support", className: "text-brand-600 dark:text-brand-400 hover:underline", children: "Customer Support" }), ' ', "- Post-purchase support patterns"] }), _jsxs("li", { children: [_jsx(Link, { href: "/reference/components/interactive-card", className: "text-brand-600 dark:text-brand-400 hover:underline", children: "Interactive Card" }), ' ', "- For product cards"] })] })] }), _jsxs("div", { className: "mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800", children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: "\uD83D\uDED2 Ready to Boost Sales?" }), _jsx("p", { className: "text-text-secondary mb-6", children: "Add AI shopping assistance to your store and increase conversion rates." }), _jsx("a", { href: "https://github.com/clarity-chat/ui/tree/main/examples/ecommerce-assistant", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors", children: "View Full Example \u2192" })] })] })] }));
}
//# sourceMappingURL=page.js.map