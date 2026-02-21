/**
 * Combined Structured Output & Tools Example
 *
 * Demonstrates using both useClarityObject and tool UI registry together
 * in a real-world scenario: an e-commerce assistant that generates product
 * recommendations and uses tools for additional information.
 *
 * @example
 * ```tsx
 * import { ECommerceAssistantExample } from '@clarity-chat/react/examples/combined-structured-tools-example'
 *
 * export default function Page() {
 *   return <ECommerceAssistantExample />
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  useClarityChatWithTools,
  useClarityObject,
  ChatWindow,
  convertCoreMessagesToMessages,
  ClarityToolResult,
  createToolUIRegistry,
  type ToolComponentProps,
} from '@clarity-chat/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
} from '@clarity-chat/primitives'

/**
 * Product interface for structured output
 */
interface Product {
  name: string
  price: number
  description: string
  category: string
  rating?: number
  features?: string[]
  imageUrl?: string
}

/**
 * Product Recommendation Response
 */
interface ProductRecommendation {
  products: Product[]
  query: string
  totalResults: number
  reasoning?: string
}

/**
 * Price Comparison Tool Result Component
 */
function PriceComparisonToolResult({
  data,
}: ToolComponentProps<{
  productId: string
  comparisons: Array<{
    store: string
    price: number
    availability: boolean
    url?: string
  }>
}>) {
  const cheapest = data.comparisons.reduce((min, curr) =>
    curr.price < min.price ? curr : min
  )

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="">
        <CardTitle className="text-base flex items-center gap-2">
          💰 Price Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.comparisons.map((comparison, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-2 rounded ${
              comparison.store === cheapest.store
                ? 'bg-green-100 border border-green-300'
                : 'bg-muted/50'
            }`}
          >
            <div className="flex-1">
              <div className="font-medium text-sm">{comparison.store}</div>
              <div className="text-xs text-muted-foreground">
                {comparison.availability ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`text-lg font-bold ${
                  comparison.store === cheapest.store
                    ? 'text-green-600'
                    : 'text-foreground'
                }`}
              >
                ${comparison.price.toFixed(2)}
              </div>
              {comparison.store === cheapest.store && (
                <Badge variant="success" className="text-xs">
                  Best Price
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

/**
 * Review Summary Tool Result Component
 */
function ReviewSummaryToolResult({
  data,
}: ToolComponentProps<{
  productId: string
  averageRating: number
  totalReviews: number
  summary: string
  topPros: string[]
  topCons: string[]
}>) {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="">
        <CardTitle className="text-base flex items-center gap-2">
          ⭐ Review Summary
        </CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl font-bold">
            {data.averageRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({data.totalReviews} reviews)
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{data.summary}</p>
        {data.topPros.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-green-600">Pros:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {data.topPros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-green-600">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.topCons.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-red-600">Cons:</div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {data.topCons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-red-600">✗</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Create tool registry
 */
const toolRegistry = createToolUIRegistry({
  price_comparison: PriceComparisonToolResult,
  review_summary: ReviewSummaryToolResult,
})

/**
 * E-Commerce Assistant Example
 *
 * Combines structured product recommendations with tool-based
 * price comparison and review summaries.
 */
export function ECommerceAssistantExample() {
  const [searchQuery, setSearchQuery] = React.useState('gaming laptop')

  // Structured object generation for product recommendations
  const productRecommendation = useClarityObject<ProductRecommendation>({
    api: '/api/generate-products',
    initialInput: { query: searchQuery },
  })

  // Chat with tools for follow-up questions
  const { messages, append, isLoading, toolResults } = useClarityChatWithTools({
    api: '/api/chat-with-tools',
    toolRegistry,
  })

  const chatMessages = React.useMemo(
    () => convertCoreMessagesToMessages(messages),
    [messages]
  )

  const handleGenerateRecommendations = React.useCallback(async () => {
    await productRecommendation.run({ query: searchQuery })
  }, [searchQuery, productRecommendation])

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await append({
        role: 'user',
        content,
      })
    },
    [append]
  )

  // Group tool results by message
  const toolResultsByMessage = React.useMemo(() => {
    const grouped = new Map<string, typeof toolResults>()
    toolResults.forEach((tr) => {
      const existing = grouped.get(tr.messageId) || []
      grouped.set(tr.messageId, [...existing, tr])
    })
    return grouped
  }, [toolResults])

  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar: Product Recommendations */}
      <div className="w-96 border-r bg-muted/20 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Product Recommendations</h2>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !productRecommendation.isLoading) {
                  handleGenerateRecommendations()
                }
              }}
            />
            <Button
              onClick={handleGenerateRecommendations}
              disabled={productRecommendation.isLoading}
            >
              {productRecommendation.isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>

        {productRecommendation.error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            Error: {productRecommendation.error.message}
          </div>
        )}

        {productRecommendation.object && (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Found {productRecommendation.object.totalResults} products
            </div>
            {productRecommendation.object.products.map((product, idx) => (
              <Card key={idx} className="hover:shadow-md transition-shadow">
                <CardHeader className="">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                    <div className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  {product.rating && (
                    <div className="text-xs text-muted-foreground">
                      ⭐ {product.rating.toFixed(1)}/5.0
                    </div>
                  )}
                </CardHeader>
                <CardContent className="">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          showHeader={true}
          sessionTitle="E-Commerce Assistant"
          sessionSubtitle="Ask about products, prices, and reviews"
        />

        {/* Tool Results Panel */}
        {toolResults.length > 0 && (
          <div className="border-t bg-muted/30 p-4 space-y-4 max-h-64 overflow-y-auto">
            <div className="text-sm font-medium text-muted-foreground">
              Tool Results ({toolResults.length})
            </div>
            {Array.from(toolResultsByMessage.entries()).map(
              ([messageId, results]) => (
                <div key={messageId} className="space-y-2">
                  {results.map(({ toolCall, result }, idx) => (
                    <ClarityToolResult
                      key={`${messageId}-${idx}`}
                      registry={toolRegistry}
                      toolCall={toolCall}
                      result={result}
                      messages={chatMessages}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
