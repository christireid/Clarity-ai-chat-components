/**
 * Product Recommendation Object Example
 * 
 * Demonstrates useClarityObject for structured output generation.
 * Given a query, the model returns a structured Product[] object.
 */

import * as React from 'react'
import { useClarityObject } from '../hooks/use-clarity-object'
import { Card, CardContent, CardHeader, Button, Badge } from '@clarity-chat/primitives'

export interface Product {
  name: string
  price: number
  description: string
  category: string
  rating?: number
  inStock?: boolean
}

export interface ProductRecommendationInput {
  query: string
  maxResults?: number
  category?: string
}

export function ProductRecommendationExample() {
  const {
    input,
    setInput,
    object: products,
    isLoading,
    error,
    run,
    reset,
  } = useClarityObject<Product[], ProductRecommendationInput>({
    api: '/api/generate-products',
    initialInput: {
      query: '',
      maxResults: 5,
    },
    onFinish: (result) => {
      console.log('Generated products:', result)
    },
    onError: (err) => {
      console.error('Error generating products:', err)
    },
  })

  const handleSearch = React.useCallback(async () => {
    if (!input.query.trim()) return
    await run()
  }, [input, run])

  // Mock products for demo (in real app, these come from API)
  const mockProducts: Product[] = products || [
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
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Product Recommendations</h1>
        <p className="text-muted-foreground">
          Use structured output to generate product recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Search Products</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <input
              type="text"
              value={input.query}
              onChange={(e) =>
                setInput({ ...input, query: e.target.value })
              }
              placeholder="e.g., gaming laptops, wireless mice..."
              className="flex-1 px-4 py-2 border rounded-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              disabled={isLoading}
            />
            <Button onClick={handleSearch} disabled={isLoading || !input.query.trim()}>
              {isLoading ? 'Generating...' : 'Search'}
            </Button>
            {products && (
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <div>
              <label className="text-sm font-medium">Max Results:</label>
              <input
                type="number"
                value={input.maxResults || 5}
                onChange={(e) =>
                  setInput({
                    ...input,
                    maxResults: parseInt(e.target.value) || 5,
                  })
                }
                className="ml-2 w-20 px-2 py-1 border rounded"
                min={1}
                max={20}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category:</label>
              <input
                type="text"
                value={input.category || ''}
                onChange={(e) =>
                  setInput({ ...input, category: e.target.value })
                }
                placeholder="Optional"
                className="ml-2 px-2 py-1 border rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">
              <strong>Error:</strong> {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Generating product recommendations...
            </div>
          </CardContent>
        </Card>
      )}

      {products && mockProducts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Recommended Products ({mockProducts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProducts.map((product, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.inStock && (
                      <Badge variant="success">In Stock</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.rating && (
                      <Badge variant="secondary">
                        ⭐ {product.rating}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.description}
                  </p>
                  <Badge variant="outline">{product.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {products && mockProducts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              No products found. Try a different search query.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
