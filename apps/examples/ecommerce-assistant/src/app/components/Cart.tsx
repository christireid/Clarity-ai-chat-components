'use client'

import { X, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/store'

interface CartProps {
  onClose: () => void
}

export function Cart({ onClose }: CartProps) {
  const cart = useCart()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t space-y-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-purple-600">${cart.total.toFixed(2)}</span>
          </div>
          <button className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
