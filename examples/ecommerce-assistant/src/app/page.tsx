'use client'

/**
 * E-Commerce Shopping Assistant
 * AI-powered shopping experience with product recommendations
 */

import { useState } from 'react'
import { ShoppingCart, Sparkles, Package } from 'lucide-react'
import { ChatInterface } from './components/ChatInterface'
import { ProductCard } from './components/ProductCard'
import { Cart } from './components/Cart'
import { products } from '@/lib/products'
import { useCart } from '@/lib/store'

export default function ECommerceAssistant() {
  const [showCart, setShowCart] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<string[]>([])
  const cart = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ShopBot AI</h1>
                <p className="text-sm text-gray-600">
                  Your personal shopping assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface onProductsRecommended={setRecommendedProducts} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold">Recommended for You</h2>
                </div>
                <div className="space-y-4">
                  {recommendedProducts.slice(0, 3).map((productId) => {
                    const product = products.find((p) => p.id === productId)
                    return product ? (
                      <ProductCard key={product.id} product={product} compact />
                    ) : null
                  })}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Shopping Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Products Viewed</span>
                  <span className="font-semibold">
                    {recommendedProducts.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Cart</span>
                  <span className="font-semibold">{cart.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Total</span>
                  <span className="font-semibold text-purple-600">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  )
}
