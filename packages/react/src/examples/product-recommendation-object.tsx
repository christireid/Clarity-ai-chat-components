/**
 * Product Recommendation Object Example
 * 
 * Demonstrates useClarityObject for structured object generation.
 * Given a query, the model returns a structured product list.
 * 
 * @example
 * ```tsx
 * import { ProductRecommendationExample } from '@clarity-chat/react/examples'
 * 
 * function App() {
 *   return <ProductRecommendationExample />
 * }
 * ```
 */

import * as React from 'react'
import { useClarityObject } from '../hooks/use-clarity-object'
import { Card, Button, Badge } from '@clarity-chat/primitives'

/**
 * Product type
 */
interface Product {
  name: string
  price: number
  description: string
  category: string
  rating?: number
  inStock?: boolean
}

/**
 * Product recommendation response
 */
interface ProductRecommendation {
  products: Product[]
  query: string
  totalResults: number
}

/**
 * Product Recommendation Example Component
 */
export function ProductRecommendationExample() {
  const [query, setQuery] = React.useState('')
  
  const {
    input,
    setInput,
    object,
    isLoading,
    error,
    run,
    reset,
  } = useClarityObject<ProductRecommendation, { query: string }>({
    api: '/api/generate-products',
  })

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        await run({ query: query.trim() })
      }
    },
    [query, run]
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Product Recommendations</h1>
        <p className="text-muted-foreground">
          Enter a product query to get structured recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'laptops under $1000' or 'wireless headphones'"
            className="flex-1 rounded-lg border px-4 py-2"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? 'Generating...' : 'Get Recommendations'}
          </Button>
          {object && (
            <Button type="button" variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
      </form>

      {error && (
        <Card className="border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error.message}
          </p>
        </Card>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Generating recommendations...</p>
        </div>
      )}

      {object && object.products && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Found {object.totalResults} products for "{object.query}"
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {object.products.map((product, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.rating && (
                    <Badge variant="info">{product.rating}/5</Badge>
                  )}
                </div>
                
                <p className="text-2xl font-bold text-primary mb-2">
                  ${product.price.toFixed(2)}
                </p>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.inStock !== false && (
                    <Badge variant="success">In Stock</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!object && !isLoading && !error && (
        <Card className="border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Enter a product query above to get recommendations
          </p>
        </Card>
      )}
    </div>
  )
}
