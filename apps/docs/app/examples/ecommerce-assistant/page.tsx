import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Package, Star, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ecommerce Assistant Example',
  description: 'AI shopping assistant with product recommendations and cart management',
}

export default function EcommerceAssistantPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Ecommerce Assistant</h1>
            <p className="text-xl text-text-secondary">
              AI shopping assistant with personalized recommendations and conversational commerce
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-medium">
            Intermediate
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm">
            Ecommerce
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm">
            Conversational Commerce
          </span>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Product Discovery</strong> - Natural language product search
            </li>
            <li>
              <strong>Smart Recommendations</strong> - Personalized suggestions based on preferences
            </li>
            <li>
              <strong>Cart Management</strong> - Add, remove, update cart via conversation
            </li>
            <li>
              <strong>Order Tracking</strong> - Check order status and shipping info
            </li>
            <li>
              <strong>Size/Fit Guidance</strong> - Help customers choose the right size
            </li>
            <li>
              <strong>Product Comparison</strong> - Side-by-side comparisons
            </li>
            <li>
              <strong>Review Summaries</strong> - AI-generated review highlights
            </li>
            <li>
              <strong>Checkout Assistance</strong> - Guide through purchase process
            </li>
          </ul>

          <h2>🚀 Quick Start</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`cd examples/ecommerce-assistant
npm install
npm run dev

# Visit http://localhost:3000`}</code>
          </pre>

          <h2>💬 Example Conversations</h2>

          <h3>Product Search</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">👤 Customer: "I need running shoes for marathons"</p>
            <p className="text-text-secondary text-sm mb-4">🤖 Assistant shows:</p>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 border border-border rounded">
                <div className="font-medium">Nike Pegasus 40</div>
                <div className="text-text-secondary">$130 • ⭐ 4.8/5</div>
                <div className="mt-1 text-green-600">Best for daily training</div>
              </div>
              <div className="p-3 border border-border rounded">
                <div className="font-medium">Brooks Ghost 15</div>
                <div className="text-text-secondary">$140 • ⭐ 4.9/5</div>
                <div className="mt-1 text-green-600">Most comfortable</div>
              </div>
              <div className="p-3 border border-border rounded">
                <div className="font-medium">ASICS Gel-Nimbus</div>
                <div className="text-text-secondary">$160 • ⭐ 4.7/5</div>
                <div className="mt-1 text-green-600">Best cushioning</div>
              </div>
            </div>
          </div>

          <h3>Cart Management</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">👤 Customer: "Add the Nike shoes to my cart in size 10"</p>
            <p className="text-sm text-green-600 mb-2">✅ Added Nike Pegasus 40 (Size 10) to cart</p>
            <p className="text-text-secondary text-sm">🤖 "Great choice! Your cart total is $130. Need socks or running accessories?"</p>
          </div>

          <h2>🏗️ Architecture</h2>

          <h3>Product Search Functions</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`const ecommerceFunctions = [
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
]`}</code>
          </pre>

          <h2>🎯 Key Features Demonstrated</h2>

          <h3>1. Natural Language Commerce</h3>
          <p>
            Customers describe what they want in natural language, and the AI interprets intent, searches products, and provides recommendations.
          </p>

          <h3>2. Context-Aware Recommendations</h3>
          <p>
            Based on conversation history, cart contents, and browsing behavior, suggest relevant complementary products.
          </p>

          <h3>3. Conversational Checkout</h3>
          <p>
            Guide customers through checkout with questions like "Should I ship to your usual address?" or "Use your saved payment method?"
          </p>

          <h2>📦 Integration Options</h2>

          <h3>Shopify</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`import { Shopify } from '@shopify/shopify-api'

const client = new Shopify.Clients.Storefront(...)
const products = await client.query({ ... })`}</code>
          </pre>

          <h3>WooCommerce</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

const api = new WooCommerceRestApi({ ... })
const { data } = await api.get('products')`}</code>
          </pre>

          <h3>Custom API</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`// Your own product API
const products = await fetch('/api/products/search', {
  method: 'POST',
  body: JSON.stringify({ query, filters })
})`}</code>
          </pre>

          <h2>📊 Conversion Optimization</h2>
          <p>Features that improve sales:</p>
          <ul>
            <li>
              <strong>Instant Answers</strong> - Reduce friction with immediate product info
            </li>
            <li>
              <strong>Cross-selling</strong> - Suggest complementary products naturally
            </li>
            <li>
              <strong>Size Guidance</strong> - Reduce returns with better sizing help
            </li>
            <li>
              <strong>24/7 Availability</strong> - No wait times for customer questions
            </li>
          </ul>

          <h2>🔗 Related Examples</h2>
          <ul>
            <li>
              <Link href="/examples/customer-support" className="text-brand-600 dark:text-brand-400 hover:underline">
                Customer Support
              </Link>{' '}
              - Post-purchase support patterns
            </li>
            <li>
              <Link href="/reference/components/interactive-card" className="text-brand-600 dark:text-brand-400 hover:underline">
                Interactive Card
              </Link>{' '}
              - For product cards
            </li>
          </ul>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h3 className="text-2xl font-bold mb-4">🛒 Ready to Boost Sales?</h3>
          <p className="text-text-secondary mb-6">
            Add AI shopping assistance to your store and increase conversion rates.
          </p>
          <a
            href="https://github.com/clarity-chat/ui/tree/main/examples/ecommerce-assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
          >
            View Full Example →
          </a>
        </div>
      </div>
    </div>
  )
}

