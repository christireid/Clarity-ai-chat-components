/**
 * useClarityObject Storybook Stories
 * 
 * Demonstrates structured object generation with type safety
 */

import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useClarityObject } from './use-clarity-object'
import { Button, Card, CardContent, CardHeader, Input, Badge } from '@clarity-chat/primitives'

const meta = {
  title: 'Hooks/useClarityObject',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Hook for generating structured objects from AI models with type safety.

## Features
- Generic type support \`<T>\`
- Streaming and non-streaming modes
- Automatic JSON parsing
- Type-safe object generation
- Progress callbacks
- Error handling

## Usage

\`\`\`tsx
interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product>({
  api: '/api/generate-object',
  initialInput: { query: 'laptops' },
})

await run({ query: 'gaming laptops' })
\`\`\`
        `
      }
    }
  }
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Mock API handler for Storybook
const mockAPI = async (input: any): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (input.query === 'error') {
    throw new Error('API Error: Failed to generate object')
  }
  
  // Return mock structured data based on input
  if (input.type === 'product') {
    return {
      products: [
        {
          name: 'Gaming Laptop Pro',
          price: 1299.99,
          description: 'High-performance gaming laptop with RTX 4070',
          inStock: true,
          rating: 4.5
        },
        {
          name: 'Ultrabook Air',
          price: 999.99,
          description: 'Lightweight ultrabook for professionals',
          inStock: true,
          rating: 4.8
        }
      ]
    }
  }
  
  if (input.type === 'weather') {
    return {
      location: input.location || 'San Francisco',
      temperature: 72,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 10,
      forecast: [
        { day: 'Today', high: 72, low: 58, condition: 'Sunny' },
        { day: 'Tomorrow', high: 70, low: 56, condition: 'Partly Cloudy' },
        { day: 'Wednesday', high: 68, low: 54, condition: 'Cloudy' }
      ]
    }
  }
  
  return {
    message: `Generated object for: ${JSON.stringify(input)}`,
    timestamp: new Date().toISOString()
  }
}

interface Product {
  name: string
  price: number
  description: string
  inStock: boolean
  rating: number
}

interface ProductRecommendation {
  products: Product[]
}

export const BasicUsage: Story = {
  render: () => {
    const [query, setQuery] = useState('gaming laptops')
    
    const { object, run, isLoading, error, reset } = useClarityObject<ProductRecommendation>({
      api: '/api/products',
      initialInput: { query, type: 'product' },
      fetch: async (url, options) => {
        const body = JSON.parse(options?.body as string || '{}')
        const result = await mockAPI(body)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    })
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Product Recommendations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate structured product recommendations from a query
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter product query..."
            className="flex-1"
          />
          <Button
            onClick={() => run({ query, type: 'product' })}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
          {object && (
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          )}
        </div>
        
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive">Error: {error.message}</div>
            </CardContent>
          </Card>
        )}
        
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-muted-foreground">Generating recommendations...</div>
            </CardContent>
          </Card>
        )}
        
        {object && (
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Generated Products</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {object.products.map((product, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold">{product.name}</h5>
                      <Badge variant={product.inStock ? 'default' : 'secondary'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      <span className="text-sm">Rating: {product.rating} ⭐</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }
}

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  forecast: Array<{
    day: string
    high: number
    low: number
    condition: string
  }>
}

export const WeatherObject: Story = {
  render: () => {
    const [location, setLocation] = useState('San Francisco')
    
    const { object, run, isLoading, error } = useClarityObject<WeatherData>({
      api: '/api/weather',
      initialInput: { location, type: 'weather' },
      fetch: async (url, options) => {
        const body = JSON.parse(options?.body as string || '{}')
        const result = await mockAPI(body)
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    })
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Weather Forecast</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate structured weather data
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
            className="flex-1"
          />
          <Button
            onClick={() => run({ location, type: 'weather' })}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Weather'}
          </Button>
        </div>
        
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive">Error: {error.message}</div>
            </CardContent>
          </Card>
        )}
        
        {isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-muted-foreground">Fetching weather data...</div>
            </CardContent>
          </Card>
        )}
        
        {object && (
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Weather in {object.location}</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold">
                  {object.temperature}°F
                </div>
                <div className="text-muted-foreground">
                  Condition: {object.condition} | Humidity: {object.humidity}% | Wind: {object.windSpeed} mph
                </div>
                <div className="border-t pt-4">
                  <h5 className="font-semibold mb-2">Forecast</h5>
                  <div className="space-y-2">
                    {object.forecast.map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span>{day.day}</span>
                        <span className="text-muted-foreground">
                          {day.high}° / {day.low}° - {day.condition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }
}

export const ErrorHandling: Story = {
  render: () => {
    const { object, run, isLoading, error, reset } = useClarityObject<any>({
      api: '/api/error',
      initialInput: { query: 'error', type: 'test' },
      fetch: async (url, options) => {
        const body = JSON.parse(options?.body as string || '{}')
        try {
          const result = await mockAPI(body)
          return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (err) {
          return new Response(JSON.stringify({ error: (err as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }
    })
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Error Handling</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Demonstrates error handling in useClarityObject
          </p>
        </div>
        
        <Button
          onClick={() => run({ query: 'error', type: 'test' })}
          disabled={isLoading}
          variant="destructive"
        >
          {isLoading ? 'Loading...' : 'Trigger Error'}
        </Button>
        
        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <h4 className="font-semibold text-destructive">Error</h4>
            </CardHeader>
            <CardContent>
              <div className="text-destructive">{error.message}</div>
              <Button variant="outline" onClick={reset} className="mt-4">
                Reset
              </Button>
            </CardContent>
          </Card>
        )}
        
        {object && (
          <Card>
            <CardContent className="pt-6">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(object, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }
}
