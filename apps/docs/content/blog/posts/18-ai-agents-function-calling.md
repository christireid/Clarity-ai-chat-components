# AI Agents with Function Calling: From Concept to Code

ChatGPT can tell you how to book a flight. An AI agent can actually book it.

The difference between a chatbot and an agent is action. Agents use tools—APIs, databases, file systems—to accomplish real tasks. Function calling is how you give AI the ability to do things, not just say things.

Let's build an agent that actually works.

---

## What Is Function Calling?

Before function calling, developers relied on prompt engineering and prayer:

**The old way (parsing and hoping):**
```
User: "What's the weather in Tokyo?"
AI: "Let me check... The weather in Tokyo is sunny, 72°F"
Developer: *AI just made that up*
```

The AI had no way to actually check the weather. It hallucinated an answer.

**The new way (function calling):**
```
User: "What's the weather in Tokyo?"
AI: { "function": "get_weather", "arguments": { "city": "Tokyo" } }
Developer: *calls actual weather API, gets real data*
AI: "The weather in Tokyo is currently 68°F and cloudy."
```

Function calling is the AI saying: "I need to use this tool with these parameters." Your code executes the tool and feeds the real results back to the AI.

The key insight: the AI doesn't execute functions—it *requests* them. Your code handles execution, security, and validation.

---

## Defining Tools

Tools are described as JSON schemas that tell the AI what functions exist and how to call them:

```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Search the product catalog by name, category, or price range. Use this when users ask about products, inventory, or want to find items.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for product name or description"
          },
          category: {
            type: "string",
            enum: ["electronics", "clothing", "home", "sports", "books"],
            description: "Product category to filter by"
          },
          maxPrice: {
            type: "number",
            description: "Maximum price in dollars"
          },
          inStock: {
            type: "boolean",
            description: "Only show in-stock items"
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description: "Add a product to the user's shopping cart. Always confirm with the user before calling this.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "The product ID to add"
          },
          quantity: {
            type: "integer",
            minimum: 1,
            maximum: 10,
            description: "Quantity to add (1-10)"
          }
        },
        required: ["productId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description: "Check the status of an existing order by order ID",
      parameters: {
        type: "object",
        properties: {
          orderId: {
            type: "string",
            description: "The order ID to check"
          }
        },
        required: ["orderId"]
      }
    }
  }
]
```

**Best practices for tool definitions:**

1. **Clear descriptions** — The AI uses these to decide when to call the function
2. **Constrained enums** — Limit options where possible
3. **Required vs optional** — Be explicit about what's needed
4. **Examples in description** — For complex parameters, show format examples
5. **Boundaries** — Use minimum/maximum to prevent absurd values

---

## The Agent Loop

A single function call is useful. The real power comes from the agent loop—multiple rounds of function calls to complete complex tasks:

```typescript
interface Message {
  role: 'user' | 'assistant' | 'tool'
  content: string
  tool_call_id?: string
  tool_calls?: ToolCall[]
}

interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

// Generic tool handler type for flexibility
type ToolHandler<T = Record<string, unknown>> = (args: T) => Promise<unknown>

async function runAgentLoop(
  userMessage: string,
  tools: Tool[],
  toolHandlers: Record<string, ToolHandler>,
  maxIterations = 10
): Promise<string> {
  const messages: Message[] = [
    {
      role: 'system',
      content: `You are a helpful shopping assistant. Use the available tools to help users find and purchase products. Always confirm before making purchases.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ]

  for (let i = 0; i < maxIterations; i++) {
    // Call the AI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
      tool_choice: 'auto',
    })

    const assistantMessage = response.choices[0].message

    // Add assistant message to history
    messages.push({
      role: 'assistant',
      content: assistantMessage.content || '',
      tool_calls: assistantMessage.tool_calls,
    })

    // If no tool calls, we're done
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return assistantMessage.content || ''
    }

    // Execute each tool call
    for (const toolCall of assistantMessage.tool_calls) {
      const functionName = toolCall.function.name
      const functionArgs = JSON.parse(toolCall.function.arguments)

      console.log(`Executing: ${functionName}`, functionArgs)

      // Get the handler
      const handler = toolHandlers[functionName]
      if (!handler) {
        throw new Error(`Unknown function: ${functionName}`)
      }

      // Execute and get result
      const result = await handler(functionArgs)

      // Add tool result to messages
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      })
    }
  }

  throw new Error('Max iterations reached without completion')
}
```

Usage:

```typescript
const toolHandlers = {
  search_products: async ({ query, category, maxPrice, inStock }) => {
    const products = await productAPI.search({
      query,
      category,
      maxPrice,
      inStock,
    })
    return products.slice(0, 5) // Limit results
  },

  add_to_cart: async ({ productId, quantity }) => {
    const result = await cartAPI.add(productId, quantity || 1)
    return {
      success: true,
      cartTotal: result.total,
      itemCount: result.itemCount,
    }
  },

  get_order_status: async ({ orderId }) => {
    const order = await orderAPI.getStatus(orderId)
    return {
      status: order.status,
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber,
    }
  },
}

// Now the AI can:
// 1. Search for products
// 2. Review results with user
// 3. Add selected items to cart
// 4. Check order status
// All in a single conversation
const response = await runAgentLoop(
  "Find me running shoes under $100, then add the Nike ones to my cart",
  tools,
  toolHandlers
)
```

---

## Error Handling & Safety

Agents that call real APIs need robust error handling.

### Validate Arguments

Don't trust the AI's arguments blindly:

```typescript
// npm install zod
import { z } from 'zod'

const searchProductsSchema = z.object({
  query: z.string().min(1).max(200),
  category: z.enum(['electronics', 'clothing', 'home', 'sports', 'books']).optional(),
  maxPrice: z.number().positive().max(10000).optional(),
  inStock: z.boolean().optional(),
})

const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10).optional(),
})

const getOrderStatusSchema = z.object({
  orderId: z.string().min(1),
})

async function validateAndExecute<T>(
  functionName: string,
  args: unknown,
  handler: (args: T) => Promise<unknown>
): Promise<unknown> {
  const schemas: Record<string, z.ZodSchema> = {
    search_products: searchProductsSchema,
    add_to_cart: addToCartSchema,
    get_order_status: getOrderStatusSchema,
  }

  const schema = schemas[functionName]
  if (!schema) {
    throw new Error(`No schema for function: ${functionName}`)
  }

  const validated = schema.parse(args)
  return handler(validated)
}
```

### Require Confirmation for Sensitive Actions

Some actions shouldn't execute automatically:

```typescript
interface AgentConfig {
  requireConfirmation: string[]  // Functions that need user OK
  maxIterations: number
  timeout: number
}

async function runAgentWithConfirmation(
  userMessage: string,
  config: AgentConfig,
  onConfirmationNeeded: (action: PendingAction) => Promise<boolean>
): Promise<string> {
  // ... agent loop ...

  for (const toolCall of assistantMessage.tool_calls) {
    const functionName = toolCall.function.name

    // Check if confirmation needed
    if (config.requireConfirmation.includes(functionName)) {
      const confirmed = await onConfirmationNeeded({
        function: functionName,
        arguments: JSON.parse(toolCall.function.arguments),
        description: describeAction(functionName, toolCall.function.arguments),
      })

      if (!confirmed) {
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: 'User cancelled this action' }),
        })
        continue
      }
    }

    // Execute...
  }
}

// Usage
const response = await runAgentWithConfirmation(
  userMessage,
  {
    requireConfirmation: ['add_to_cart', 'submit_order', 'delete_item'],
    maxIterations: 10,
    timeout: 30000,
  },
  async (action) => {
    // Show confirmation UI to user
    return await showConfirmDialog(
      `The assistant wants to ${action.description}. Allow?`
    )
  }
)
```

### Handle Tool Failures

Tools fail. APIs go down. Handle it gracefully:

```typescript
async function executeToolSafely(
  toolCall: ToolCall,
  handler: ToolHandler
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  try {
    const args = JSON.parse(toolCall.function.arguments)
    const result = await Promise.race([
      handler(args),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Tool timeout')), 10000)
      ),
    ])
    return { success: true, result }
  } catch (error) {
    console.error(`Tool ${toolCall.function.name} failed:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// In the agent loop
const toolResult = await executeToolSafely(toolCall, handler)

messages.push({
  role: 'tool',
  tool_call_id: toolCall.id,
  content: JSON.stringify(
    toolResult.success
      ? toolResult.result
      : { error: `Tool failed: ${toolResult.error}` }
  ),
})
```

The AI will see the error and can inform the user or try an alternative approach.

---

## Showing Tool Usage to Users

Transparency builds trust. Show users what the agent is doing:

```tsx
interface ToolCallDisplay {
  id: string
  name: string
  arguments: Record<string, any>
  status: 'pending' | 'running' | 'success' | 'error'
  result?: any
  error?: string
}

function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [toolCalls, setToolCalls] = useState<ToolCallDisplay[]>([])

  // ... agent logic updates toolCalls state ...

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Show active tool calls */}
        {toolCalls.filter(tc => tc.status !== 'success').map(tc => (
          <ToolCallCard key={tc.id} toolCall={tc} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}

function ToolCallCard({ toolCall }: { toolCall: ToolCallDisplay }) {
  const icons: Record<string, React.ReactNode> = {
    search_products: <SearchIcon className="w-4 h-4" />,
    add_to_cart: <ShoppingCartIcon className="w-4 h-4" />,
    get_order_status: <PackageIcon className="w-4 h-4" />,
  }

  const statusColors = {
    pending: 'bg-gray-100',
    running: 'bg-blue-50 animate-pulse',
    success: 'bg-green-50',
    error: 'bg-red-50',
  }

  return (
    <div className={`p-3 rounded-lg ${statusColors[toolCall.status]}`}>
      <div className="flex items-center gap-2">
        {icons[toolCall.name] || <WrenchIcon className="w-4 h-4" />}
        <span className="font-medium">{formatToolName(toolCall.name)}</span>

        {toolCall.status === 'running' && (
          <Spinner className="w-4 h-4" />
        )}
      </div>

      <div className="text-sm text-gray-600 mt-1">
        {formatToolArguments(toolCall.name, toolCall.arguments)}
      </div>

      {toolCall.result && (
        <div className="text-sm text-green-700 mt-2">
          {formatToolResult(toolCall.name, toolCall.result)}
        </div>
      )}

      {toolCall.error && (
        <div className="text-sm text-red-700 mt-2">
          Error: {toolCall.error}
        </div>
      )}
    </div>
  )
}

function formatToolName(name: string): string {
  const names: Record<string, string> = {
    search_products: 'Searching products',
    add_to_cart: 'Adding to cart',
    get_order_status: 'Checking order status',
  }
  return names[name] || name
}

function formatToolArguments(name: string, args: Record<string, any>): string {
  switch (name) {
    case 'search_products':
      return `"${args.query}"${args.category ? ` in ${args.category}` : ''}${args.maxPrice ? ` under $${args.maxPrice}` : ''}`
    case 'add_to_cart':
      return `Product ${args.productId} × ${args.quantity || 1}`
    case 'get_order_status':
      return `Order #${args.orderId}`
    default:
      return JSON.stringify(args)
  }
}
```

---

## The Takeaway

Function calling transforms chatbots into agents. The difference:

- **Chatbot**: "Here's how to check your order status..."
- **Agent**: *checks order status* "Your order shipped yesterday, arriving Thursday."

The essentials:

1. **Clear tool definitions** — Good descriptions help the AI choose correctly
2. **Implement the agent loop** — Multiple rounds for complex tasks
3. **Validate everything** — Don't trust AI-generated arguments
4. **Require confirmation** — For actions that matter (purchases, deletions)
5. **Handle failures gracefully** — Tools fail; plan for it
6. **Show the user what's happening** — Transparency builds trust

Build agents that do things—not just talk about things.

---

*Clarity Chat's `useAgentOrchestration` hook handles the agent loop, tool execution, confirmation flows, error recovery, and progress display. Build AI agents without building agent infrastructure. [See the agent docs →](/docs/agents)*
