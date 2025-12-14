# Blog Post 18: AI Agents with Function Calling: From Concept to Code

## Meta Information
- **Reading Time:** 7 minutes (~1,700 words)
- **Category:** Advanced AI Topics
- **Primary Keyword:** AI agent function calling
- **Secondary Keywords:** tool use, OpenAI functions, AI automation

---

## Hook / Opening (100 words)

**Opening line:** "ChatGPT can tell you how to book a flight. An AI agent can actually book it."

The difference between a chatbot and an agent is action. Agents use tools—APIs, databases, file systems—to accomplish real tasks. Function calling is how you give AI the ability to do things, not just say things.

Let's build an agent that actually works.

---

## Section 1: What is Function Calling? (200 words)

### Content:

**The old way (parsing):**
```
User: "What's the weather in Tokyo?"
AI: "The weather in Tokyo is..."
Developer: *prays AI outputs parseable format*
*regex fails*
*everything breaks*
```

**The new way (function calling):**
```
User: "What's the weather in Tokyo?"
AI: { "function": "get_weather", "arguments": { "city": "Tokyo" } }
Developer: *calls actual weather API*
*returns structured data*
*AI summarizes result*
```

**Key insight:**
Function calling is the AI saying "I need to use this tool with these parameters." Your code executes the tool and feeds results back.

### Visual:
```
[VISUAL 1: Function calling flow]
User → "Book dinner for 2 at 7pm"
       ↓
AI → Decides: call `book_reservation`
     Args: { guests: 2, time: "19:00" }
       ↓
Your Code → Calls restaurant API
            Returns: { confirmation: "ABC123" }
       ↓
AI → "I've booked your table. Confirmation: ABC123"
```

---

## Section 2: Defining Tools (300 words)

### Content:

**Tool definition (OpenAI format):**
```tsx
const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description: "Search the product catalog by name, category, or price range",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for product name"
          },
          category: {
            type: "string",
            enum: ["electronics", "clothing", "home", "sports"],
            description: "Product category to filter by"
          },
          maxPrice: {
            type: "number",
            description: "Maximum price in dollars"
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
      description: "Add a product to the user's shopping cart",
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
            description: "Quantity to add"
          }
        },
        required: ["productId"]
      }
    }
  }
]
```

**Best practices for tool definitions:**
1. Clear, specific descriptions
2. Constrain with enums where possible
3. Mark required vs optional parameters
4. Include examples in description if complex

---

## Section 3: Implementing the Agent Loop (350 words)

### Code Example:
```tsx
import { useAgentOrchestration } from '@clarity-chat/react'

function ShoppingAgent() {
  const agent = useAgentOrchestration({
    model: 'gpt-4o',
    tools,
    systemPrompt: `You are a helpful shopping assistant.
                   Use the available tools to help users find and purchase products.
                   Always confirm before adding items to cart.`,

    // Tool implementations
    toolHandlers: {
      search_products: async ({ query, category, maxPrice }) => {
        const results = await productAPI.search({ query, category, maxPrice })
        return results.slice(0, 5)  // Limit to top 5
      },

      add_to_cart: async ({ productId, quantity }) => {
        const result = await cartAPI.add(productId, quantity)
        return { success: true, cartTotal: result.total }
      },

      get_cart: async () => {
        return await cartAPI.getContents()
      },
    },

    // Control flow
    maxIterations: 10,  // Prevent infinite loops
    onToolCall: (tool, args) => {
      console.log(`Calling ${tool} with`, args)
    },
  })

  const handleMessage = async (message: string) => {
    // Agent automatically loops:
    // 1. Send message to AI
    // 2. If AI wants to call tool, execute it
    // 3. Send result back to AI
    // 4. Repeat until AI has final response
    const response = await agent.run(message)
    return response
  }

  return (
    <ChatWindow
      onSendMessage={handleMessage}
      showToolCalls={true}  // Display tool usage to user
    />
  )
}
```

### Visual:
```
[VISUAL 2: Agent execution loop]
┌─────────────────────────────────────┐
│ User: "Find me running shoes under $100" │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ AI decides: call search_products    │
│ Args: { query: "running shoes",     │
│         category: "sports",         │
│         maxPrice: 100 }             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ Tool returns: [Nike Air..., Adidas...]│
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ AI summarizes: "I found 5 options..." │
└─────────────────────────────────────┘
```

---

## Section 4: Error Handling & Safety (250 words)

### Content:

**What can go wrong:**
1. Tool execution fails
2. AI calls tool with invalid arguments
3. AI loops infinitely
4. AI calls dangerous tools

**Safeguards:**
```tsx
const agent = useAgentOrchestration({
  // Validation before execution
  validateArgs: (tool, args) => {
    const schema = tools.find(t => t.function.name === tool)
    return validateSchema(args, schema.function.parameters)
  },

  // Limit dangerous operations
  requireConfirmation: ['add_to_cart', 'delete_item', 'submit_order'],

  // Handle failures gracefully
  onToolError: (tool, error) => {
    return {
      error: true,
      message: `Unable to ${tool}: ${error.message}`
    }
  },

  // Prevent runaway
  maxIterations: 10,
  timeout: 30000,  // 30 second max
})
```

**User confirmation for sensitive actions:**
```tsx
{agent.pendingConfirmation && (
  <ConfirmationDialog
    action={agent.pendingConfirmation.tool}
    args={agent.pendingConfirmation.args}
    onConfirm={() => agent.confirmAction()}
    onCancel={() => agent.cancelAction()}
  />
)}
```

---

## Section 5: Showing Tool Usage (150 words)

### Content:

**Transparency builds trust:**
```tsx
<ChatWindow
  messages={messages}
  renderToolCall={({ tool, args, result }) => (
    <ToolCallCard>
      <ToolIcon tool={tool} />
      <div>
        <span className="font-medium">
          Searching products...
        </span>
        <span className="text-muted">
          query: "{args.query}"
        </span>
      </div>
      {result && <Badge>Found {result.length} items</Badge>}
    </ToolCallCard>
  )}
/>
```

### Visual:
```
[VISUAL 3: Tool call UI mockup]
┌──────────────────────────────────┐
│ 🔍 Searching products...         │
│    query: "running shoes"        │
│    category: "sports"            │
│    [Found 5 items]               │
└──────────────────────────────────┘
```

---

## Conclusion (100 words)

### Key takeaways:
1. Function calling enables AI action, not just conversation
2. Clear tool definitions are critical
3. Implement the agent loop for multi-step tasks
4. Safety: validation, confirmation, limits
5. Show users what the agent is doing

### Subtle CTA:
"Clarity Chat's useAgentOrchestration hook handles the agent loop, tool execution, confirmation flows, and error recovery. Build AI agents that do things—not just talk about things."
