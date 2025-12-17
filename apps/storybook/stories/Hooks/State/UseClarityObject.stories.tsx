import type { Meta, StoryObj } from '@storybook/react-vite'
import { useClarityObject } from '@clarity-chat/react'
import { Button, Card, CardHeader, CardContent, Badge } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useClarityObject Hook (Structured Output)**
 * 
 * Type-safe structured object generation from AI models.
 * 
 * **Key Features:**
 * - Generic type support for type-safe object generation
 * - Streaming and non-streaming modes
 * - Automatic JSON parsing from streams
 * - Error handling and loading states
 * - Input management and reset functionality
 * - Callback support (onFinish, onError, onProgress)
 * 
 * **Use Cases:**
 * - Product recommendations
 * - Data extraction
 * - Form generation
 * - Structured data generation
 * - API response formatting
 */
const meta = {
  title: 'Hooks/State/UseClarityObject',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useClarityObject\` hook provides type-safe structured object generation
from AI models, supporting both streaming and non-streaming modes.

## Features

- ✅ Generic type support for type-safe object generation
- ✅ Streaming and non-streaming modes
- ✅ Automatic JSON parsing from streams
- ✅ Error handling and loading states
- ✅ Input management and reset functionality
- ✅ Callback support (onFinish, onError, onProgress)

## Example

\`\`\`tsx
interface Product {
  name: string
  price: number
  description: string
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  initialInput: { query: 'laptops' },
})

await run({ query: 'gaming laptops' })
// object is now Product[] | null
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Mock API endpoint (in real usage, this would be your backend)
const mockApiCall = async (input: { query: string }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock product data
  return {
    products: [
      {
        name: 'Gaming Laptop Pro',
        price: 1299.99,
        description: 'High-performance gaming laptop with RTX 4070',
      },
      {
        name: 'Ultrabook Elite',
        price: 999.99,
        description: 'Lightweight ultrabook for professionals',
      },
      {
        name: 'Budget Laptop',
        price: 499.99,
        description: 'Affordable laptop for everyday use',
      },
    ],
  }
}

interface Product {
  name: string
  price: number
  description: string
}

function ProductRecommendations() {
  const [query, setQuery] = useState('gaming laptops')
  
  const { object, run, isLoading, error, reset } = useClarityObject<{ products: Product[] }>({
    api: '/api/generate-products',
    initialInput: { query },
    stream: false,
    onFinish: (obj) => {
      console.log('Generated products:', obj)
    },
    onError: (err) => {
      console.error('Error generating products:', err)
    },
  })

  const handleGenerate = async () => {
    // In real usage, this would call your API
    // For demo, we'll simulate it
    try {
      const result = await mockApiCall({ query })
      // In real usage, the hook handles this via the API endpoint
      console.log('Would call API with:', { query })
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter product query"
          className="flex-1 px-3 py-2 border rounded"
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Products'}
        </Button>
        {object && (
          <Button onClick={reset} variant="outline">
            Reset
          </Button>
        )}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Generating product recommendations...</p>
          </CardContent>
        </Card>
      )}

      {object?.products && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Products</h3>
          {object.products.map((product, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{product.name}</h4>
                  <Badge variant="secondary">${product.price.toFixed(2)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <ProductRecommendations />,
  parameters: {
    docs: {
      description: {
        story: 'Basic usage of useClarityObject for generating structured product recommendations.',
      },
    },
  },
}

interface FormData {
  fields: Array<{
    name: string
    type: string
    label: string
    required: boolean
  }>
}

function FormGenerator() {
  const { object, run, isLoading, error } = useClarityObject<FormData>({
    api: '/api/generate-form',
    initialInput: { purpose: 'user registration' },
    stream: false,
  })

  return (
    <div className="space-y-4">
      <Button onClick={() => run({ purpose: 'user registration' })} disabled={isLoading}>
        {isLoading ? 'Generating Form...' : 'Generate Registration Form'}
      </Button>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Generating form structure...</p>
          </CardContent>
        </Card>
      )}

      {object?.fields && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Generated Form Fields</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {object.fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline">{field.type}</Badge>
                  <span className="font-medium">{field.label}</span>
                  {field.required && <Badge variant="destructive">Required</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const FormGeneration: Story = {
  render: () => <FormGenerator />,
  parameters: {
    docs: {
      description: {
        story: 'Using useClarityObject to generate form structures dynamically.',
      },
    },
  },
}

function StreamingExample() {
  const { object, run, isLoading, error } = useClarityObject<{ items: string[] }>({
    api: '/api/stream-list',
    initialInput: { topic: 'AI technologies' },
    stream: true,
    onProgress: (chunk) => {
      console.log('Received chunk:', chunk)
    },
  })

  return (
    <div className="space-y-4">
      <Button onClick={() => run({ topic: 'AI technologies' })} disabled={isLoading}>
        {isLoading ? 'Streaming...' : 'Stream List'}
      </Button>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Streaming data...</p>
          </CardContent>
        </Card>
      )}

      {object?.items && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Streamed Items</h3>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {object.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const StreamingMode: Story = {
  render: () => <StreamingExample />,
  parameters: {
    docs: {
      description: {
        story: 'Using useClarityObject with streaming mode for real-time updates.',
      },
    },
  },
}
