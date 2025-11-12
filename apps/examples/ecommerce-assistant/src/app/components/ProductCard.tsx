'use client'

import { ShoppingCart } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image?: string
  description?: string
}

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact }: ProductCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-purple-600 font-semibold">${product.price}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">
            ${product.price}
          </span>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
