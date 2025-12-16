import { logger } from '@clarity-chat/utils/logger';
'use client'

import { ToastProvider, useClarityObject } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Product recommendation demo
interface Product {
  name: string
  price: number
  description: string
  category: string
}

function ProductDemo() {
  const { object, run, isLoading, error } = useClarityObject<Product[]>({
    api: '/api/generate-products',
    initialInput: { query: 'laptops' },
  })

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => run({ query: 'gaming laptops' })}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label={
            isLoading
              ? 'Generating products...'
              : 'Generate gaming laptop products'
          }
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Products'}
        </button>
        <button
          onClick={() => run({ query: 'smartphones' })}
          disabled={isLoading}
          aria-busy={isLoading}
          aria-label={
            isLoading
              ? 'Generating products...'
              : 'Generate smartphone products'
          }
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
        >
          Generate Smartphones
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400">
          Error: {error.message}
        </div>
      )}

      {object && (
        <div className="space-y-4">
          <h3 className="font-semibold">Generated Products:</h3>
          {object.map((product) => (
            <div
              key={`${product.name}-${product.price}`}
              className="p-4 border rounded-lg"
            >
              <h4 className="font-semibold">{product.name}</h4>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
              <p className="mt-2">{product.description}</p>
              <p className="mt-2 font-semibold">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const useClarityObjectOptionsProps: Prop[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description: 'API endpoint URL for object generation.',
  },
  {
    name: 'initialInput',
    type: 'TInput',
    description: 'Initial input value for generation.',
  },
  {
    name: 'headers',
    type: 'HeadersInit',
    description: 'Custom headers to send with requests.',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body data to send with requests.',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'false',
    description: 'Enable streaming for real-time updates.',
  },
  {
    name: 'streamFormat',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description: 'Stream format protocol.',
  },
  {
    name: 'credentials',
    type: 'RequestCredentials',
    description: 'Fetch credentials mode.',
  },
  {
    name: 'fetch',
    type: 'typeof fetch',
    description: 'Custom fetch implementation.',
  },
  {
    name: 'onFinish',
    type: '(object: TObject) => void | Promise<void>',
    description: 'Callback when object generation completes.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback on error.',
  },
  {
    name: 'onProgress',
    type: '(chunk: string) => void',
    description: 'Callback for progress updates during streaming.',
  },
]

const useClarityObjectReturnProps: Prop[] = [
  {
    name: 'input',
    type: 'TInput',
    description: 'Current input value.',
  },
  {
    name: 'setInput',
    type: '(value: TInput) => void',
    description: 'Update the input value.',
  },
  {
    name: 'object',
    type: 'TObject | null',
    description: 'Generated object, null if not yet generated.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether generation is in progress.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error state, null if no error.',
  },
  {
    name: 'run',
    type: '(overrideInput?: TInput) => Promise<void>',
    description: 'Run generation with optional input override.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset state (clear object and error).',
  },
]

export default function UseClarityObjectPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useClarityObject</h1>

        <p className="lead">
          Hook for generating structured objects from AI models with full type
          safety. Supports both streaming and non-streaming object generation.
        </p>

        <Callout type="info">
          <p>
            <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready)
            <br />
            <strong>Domain:</strong> Tools & Agents
            <br />
            <br />
            This is the recommended way to generate type-safe structured data
            from AI. For tool calling, use <code>
              useClarityChatWithTools
            </code>{' '}
            instead.
          </p>
        </Callout>

        <ViewInStorybook component="useClarityObject" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Experiment with the useClarityObject hook! Generate structured
            objects with type safety.
          </p>
          <CodePlayground
            initialCode={`interface Product {
  name: string
  price: number
  description: string
}

function Example() {
  const { object, run, isLoading } = useClarityObject<Product[]>({
    api: '/api/generate-products',
    initialInput: { query: 'laptops' },
  })

  return (
    <div>
      <button onClick={() => run({ query: 'gaming laptops' })} disabled={isLoading}>
        Generate Products
      </button>
      {object && (
        <div>
          {object.map((product) => (
            <div key={\`\${product.name}-\${product.price}\`}>
              <h3>{product.name}</h3>
              <p>\${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useClarityObject } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          Define your object type and use the hook to generate structured data
          from AI:
        </p>

        <ComponentPreview
          title="Product Recommendations"
          description="Generate type-safe product recommendations"
          code={`interface Product {
  name: string
  price: number
  description: string
  category: string
}

function ProductRecommendations() {
  const { object, run, isLoading } = useClarityObject<Product[]>({
    api: '/api/generate-products',
    initialInput: { query: 'laptops' },
  })

  return (
    <div>
      <button onClick={() => run({ query: 'gaming laptops' })} disabled={isLoading}>
        Generate Products
      </button>
      {object && (
        <div>
          {object.map((product) => (
            <div key={\`\${product.name}-\${product.price}\`}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`}
        >
          <ProductDemo />
        </ComponentPreview>

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The demo above uses a placeholder API
            endpoint. In a real application, you'll need to implement the{' '}
            <code>/api/generate-products</code> route. See the{' '}
            <a href="#examples">Next.js API Route Example</a> below for a
            complete implementation.
          </p>
        </Callout>

        <h2 id="type-safety">Type Safety</h2>

        <p>
          The hook is fully type-safe. TypeScript will enforce the structure of
          your generated objects:
        </p>

        <EnhancedCodeBlock
          code={`interface User {
  name: string
  email: string
  age: number
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

function UserGenerator() {
  const { object, run } = useClarityObject<User>({
    api: '/api/generate-user',
  })

  // TypeScript knows the structure!
  if (object) {
    logger.debug(object.name) // ✅ Type-safe
    logger.debug(object.email) // ✅ Type-safe
    logger.debug(object.preferences.theme) // ✅ Type-safe
    // logger.debug(object.invalid) // ❌ TypeScript error
  }

  return <div>...</div>
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-streaming">With Streaming</h2>

        <p>Enable streaming for real-time updates during generation:</p>

        <EnhancedCodeBlock
          code={`const { object, run, isLoading, error } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  stream: true,
  onProgress: (chunk) => {
    logger.debug('Progress:', chunk)
    // Update UI with partial results
  },
  onFinish: (object) => {
    logger.debug('Generation complete:', object)
  },
})`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-input">Dynamic Input</h2>

        <p>
          Update input dynamically and run generation with different values:
        </p>

        <EnhancedCodeBlock
          code={`function DynamicGenerator() {
  const { input, setInput, object, run } = useClarityObject<Product[]>({
    api: '/api/generate-products',
    initialInput: { query: 'laptops' },
  })

  return (
    <div>
      <input
        value={input.query}
        onChange={(e) => setInput({ query: e.target.value })}
        placeholder="Search products..."
      />
      <button onClick={() => run()}>Generate</button>
      <button onClick={() => run({ query: 'smartphones' })}>
        Generate Smartphones
      </button>
      {object && <ProductList products={object} />}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="error-handling">Error Handling</h2>

        <p>Handle errors gracefully with proper user feedback:</p>

        <EnhancedCodeBlock
          code={`const { object, run, isLoading, error, reset } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  onError: (error) => {
    logger.logger.error('Generation error:', error)
    // Send to error tracking service
    if (typeof errorTrackingService !== 'undefined') {
      errorTrackingService.captureException(error)
    }
  },
})

// In your component
{error && (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
    <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
      Error generating products
    </p>
    <p className="text-red-600 dark:text-red-400 text-sm mb-3">
      {error.message}
    </p>
    <button
      onClick={reset}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
)}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="options">Options</h2>

        <PropsTable
          props={useClarityObjectOptionsProps}
          title="useClarityObject Options"
        />

        <h2 id="return-values">Return Values</h2>

        <PropsTable
          props={useClarityObjectReturnProps}
          title="useClarityObject Return"
        />

        <h2 id="examples">Examples</h2>

        <h3>Complete Example with All Features</h3>

        <EnhancedCodeBlock
          code={`import { useClarityObject } from '@clarity-chat/react'

interface BlogPost {
  title: string
  content: string
  tags: string[]
  author: string
  publishedAt: string
}

function BlogPostGenerator() {
  const { input, setInput, object, run, isLoading, error, reset } = useClarityObject<BlogPost>({
    api: '/api/generate-blog-post',
    initialInput: { topic: 'React hooks' },
    stream: true,
    onProgress: (chunk) => {
      logger.debug('Generating...', chunk)
    },
    onFinish: (post) => {
      logger.debug('Post generated:', post)
      // Save to database, etc.
    },
    onError: (error) => {
      logger.logger.error('Error:', error)
    },
  })

  return (
    <div className="space-y-4">
      <div>
        <label>Topic:</label>
        <input
          value={input.topic}
          onChange={(e) => setInput({ topic: e.target.value })}
          placeholder="Enter topic..."
        />
      </div>

      <div className="flex gap-2">
        <button onClick={() => run()} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Post'}
        </button>
        <button onClick={reset} disabled={isLoading}>
          Reset
        </button>
      </div>

      {error && (
        <div className="error">
          <p>Error: {error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}

      {object && (
        <article>
          <h1>{object.title}</h1>
          <p>By {object.author}</p>
          <p>Published: {new Date(object.publishedAt).toLocaleDateString()}</p>
          <div>{object.content}</div>
          <div>
            Tags: {object.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h3>Next.js API Route Example</h3>

        <EnhancedCodeBlock
          code={`// app/api/generate-products/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Validate API key exists
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { query } = await req.json()

    // Validate input
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query format' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Generate a JSON array of products based on the user query. Each product should have name, price, description, and category fields.',
          },
          {
            role: 'user',
            content: \`Generate products for: \${query}\`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to generate products' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = JSON.parse(data.choices[0].message.content)

    // Return the products array
    return NextResponse.json(content.products || [])
  } catch (error) {
    logger.logger.error('Product generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="success">
          <p>
            <strong>Great job!</strong> You now know how to use the
            useClarityObject hook for type-safe structured output generation.
            Check out{' '}
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> for
            conversational AI, or explore{' '}
            <a href="/reference/hooks/use-clarity-chat-with-tools">
              useClarityChatWithTools
            </a>{' '}
            for tool calling.
          </p>
        </Callout>

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Define clear interfaces:</strong> Use TypeScript interfaces
            to define your object structure clearly.
          </li>
          <li>
            <strong>Handle errors:</strong> Always provide error handling with
            the <code>error</code> state and <code>onError</code> callback.
          </li>
          <li>
            <strong>Use streaming for long operations:</strong> Enable streaming
            for better UX when generation takes time.
          </li>
          <li>
            <strong>Validate responses:</strong> Consider adding runtime
            validation (e.g., with Zod) for extra safety.
          </li>
          <li>
            <strong>Reset state when needed:</strong> Use the <code>reset</code>{' '}
            function to clear state between generations.
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> -
            Conversational AI hook
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat-with-tools">
              useClarityChatWithTools
            </a>{' '}
            - Tool calling hook
          </li>
          <li>
            <a href="/learn/guides/typescript">TypeScript Guide</a> - Type
            safety patterns
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'useClarityChat',
            href: '/reference/hooks/use-clarity-chat',
          }}
          next={{
            title: 'useChatHandlers',
            href: '/reference/hooks/use-chat-handlers',
          }}
        />
      </>
    </ToastProvider>
  )
}
