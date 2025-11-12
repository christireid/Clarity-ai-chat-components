import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'AI Agent with Tools - Cookbook - Clarity Chat',
    description: 'Build an AI agent that can call functions, search databases, and use external APIs.',
};
export default function AgentWithToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "AI Agent with Tools" }), _jsx("p", { className: "docs-lead", children: "Give your AI superpowers. Let it check the weather, search databases, send emails - anything you can code as a function." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "What You'll Build" }), _jsxs("ul", { children: [_jsx("li", { children: "\u2705 AI that can call your functions" }), _jsx("li", { children: "\u2705 Show tool execution in real-time" }), _jsx("li", { children: "\u2705 Handle multi-step workflows" }), _jsx("li", { children: "\u2705 Error handling and retries" })] }), _jsx(Callout, { type: "info", title: "What Are Tools?", children: "Tools = Functions the AI can call. You define functions like \"get_weather(city)\" and the AI decides when to call them. It's like giving the AI a toolbox." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 1: Define Your Tools" }), _jsx(CodeBlock, { language: "typescript", code: `// lib/tools.ts
export const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a city',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: 'City name, e.g. San Francisco'
          },
          unit: {
            type: 'string',
            enum: ['celsius', 'fahrenheit'],
            description: 'Temperature unit'
          }
        },
        required: ['city']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_database',
      description: 'Search the customer database',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query'
          }
        },
        required: ['query']
      }
    }
  }
]

// Implement the actual functions
export async function executeFunction(name: string, args: any) {
  switch (name) {
    case 'get_weather':
      const { city, unit = 'celsius' } = args
      // Call real weather API
      const response = await fetch(
        \`https://api.weather.com/v3/wx/conditions/current?city=\${city}\`
      )
      const data = await response.json()
      return {
        city,
        temperature: data.temperature,
        condition: data.condition,
        unit
      }

    case 'search_database':
      // Query your database
      const results = await db.customers.search(args.query)
      return {
        results: results.slice(0, 5),
        total: results.length
      }

    default:
      throw new Error(\`Unknown function: \${name}\`)
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 2: Create Agent API" }), _jsx(CodeBlock, { language: "typescript", code: `// app/api/agent/route.ts
import OpenAI from 'openai'
import { tools, executeFunction } from '@/lib/tools'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  let currentMessages = messages
  const steps = []

  // Agent loop: AI decides, we execute, repeat
  while (true) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: currentMessages,
      tools: tools,
      tool_choice: 'auto'
    })

    const message = response.choices[0].message

    // If AI wants to call a tool
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name
        const functionArgs = JSON.parse(toolCall.function.arguments)

        // Execute the function
        const result = await executeFunction(functionName, functionArgs)

        // Track step for UI
        steps.push({
          id: toolCall.id,
          tool: functionName,
          args: functionArgs,
          result
        })

        // Add function result to conversation
        currentMessages.push(message)
        currentMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        })
      }
      // Loop again - let AI respond with the results
      continue
    }

    // AI is done, return final answer
    return Response.json({
      content: message.content,
      steps
    })
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Step 3: Build Agent UI" }), _jsx(CodeBlock, { language: "typescript", code: `'use client'

import { ChatWindow, AgentRunFeed } from '@clarity-chat/react'
import { useState } from 'react'

export default function AgentChatPage() {
  const [messages, setMessages] = useState([])
  const [agentSteps, setAgentSteps] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setAgentSteps([])
    setIsLoading(true)

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      })

      const { content, steps } = await response.json()

      // Add AI response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content,
        createdAt: new Date()
      }])

      // Show what the agent did
      setAgentSteps(steps.map(s => ({
        ...s,
        status: 'succeeded',
        startedAt: new Date(),
        completedAt: new Date()
      })))

    } catch (error) {
      console.error('Agent error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_400px] h-screen">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
      
      <div className="border-l p-4 overflow-auto">
        <h3 className="font-semibold mb-4">Agent Activity</h3>
        {agentSteps.length > 0 && (
          <AgentRunFeed steps={agentSteps} />
        )}
      </div>
    </div>
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Example Tools to Add" }), _jsx("h3", { children: "Database Query" }), _jsx(CodeBlock, { language: "typescript", code: `{
  name: 'query_database',
  description: 'Query the PostgreSQL database',
  parameters: {
    type: 'object',
    properties: {
      sql: { type: 'string', description: 'SQL query to execute' }
    }
  }
}

// Implementation
async function query_database(args: { sql: string }) {
  const result = await db.query(args.sql)
  return { rows: result.rows, count: result.rowCount }
}` }), _jsx("h3", { children: "Send Email" }), _jsx(CodeBlock, { language: "typescript", code: `{
  name: 'send_email',
  description: 'Send an email to a user',
  parameters: {
    type: 'object',
    properties: {
      to: { type: 'string' },
      subject: { type: 'string' },
      body: { type: 'string' }
    },
    required: ['to', 'subject', 'body']
  }
}

// Implementation  
async function send_email(args) {
  await sendgrid.send({
    to: args.to,
    from: 'noreply@yourapp.com',
    subject: args.subject,
    text: args.body
  })
  return { sent: true, timestamp: new Date() }
}` }), _jsx("h3", { children: "Web Search" }), _jsx(CodeBlock, { language: "typescript", code: `{
  name: 'web_search',
  description: 'Search the internet for current information',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string' }
    }
  }
}

// Implementation with Serper API
async function web_search(args: { query: string }) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: args.query })
  })
  const data = await response.json()
  return {
    results: data.organic.slice(0, 5)
  }
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Keep tool descriptions clear - AI uses them to decide when to call" }), _jsx("li", { children: "Validate function arguments (AI can make mistakes)" }), _jsx("li", { children: "Add timeout protection (tools can hang)" }), _jsx("li", { children: "Log all tool calls for debugging" }), _jsx("li", { children: "Show tool execution to users for transparency" }), _jsx("li", { children: "Implement retry logic for failed tools" }), _jsx("li", { children: "Set max iterations to prevent infinite loops" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related Recipes" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/cookbook/rag-document-chat", className: "docs-card", children: [_jsx("h3", { children: "RAG Document Chat" }), _jsx("p", { children: "Combine with document search" })] }), _jsxs("a", { href: "/cookbook/error-handling", className: "docs-card", children: [_jsx("h3", { children: "Error Handling" }), _jsx("p", { children: "Robust error recovery" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map