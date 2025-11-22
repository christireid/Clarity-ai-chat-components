import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'AI Agent with Tools - Cookbook - Clarity Chat',
  description: 'Build an AI agent that can call functions, search databases, and use external APIs.',
}

export default function AgentWithToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>AI Agent with Tools</h1>
        <p className="docs-lead">
          Give your AI superpowers. Let it check the weather, search databases, send emails - anything you can code as a function.
        </p>
      </div>

      <section className="docs-section">
        <h2>What You'll Build</h2>
        <ul>
          <li>✅ AI that can call your functions</li>
          <li>✅ Show tool execution in real-time</li>
          <li>✅ Handle multi-step workflows</li>
          <li>✅ Error handling and retries</li>
        </ul>

        <Callout type="info" title="What Are Tools?">
          Tools = Functions the AI can call. You define functions like "get_weather(city)"
          and the AI decides when to call them. It's like giving the AI a toolbox.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Step 1: Define Your Tools</h2>
        <CodeBlock
          language="typescript"
          code={`// lib/tools.ts
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 2: Create Agent API</h2>
        <CodeBlock
          language="typescript"
          code={`// app/api/agent/route.ts
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 3: Build Agent UI</h2>
        <CodeBlock
          language="typescript"
          code={`'use client'

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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Example Tools to Add</h2>

        <h3>Database Query</h3>
        <CodeBlock
          language="typescript"
          code={`{
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
}`}
        />

        <h3>Send Email</h3>
        <CodeBlock
          language="typescript"
          code={`{
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
}`}
        />

        <h3>Web Search</h3>
        <CodeBlock
          language="typescript"
          code={`{
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Keep tool descriptions clear - AI uses them to decide when to call</li>
          <li>Validate function arguments (AI can make mistakes)</li>
          <li>Add timeout protection (tools can hang)</li>
          <li>Log all tool calls for debugging</li>
          <li>Show tool execution to users for transparency</li>
          <li>Implement retry logic for failed tools</li>
          <li>Set max iterations to prevent infinite loops</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rag-document-chat" className="docs-card">
            <h3>RAG Document Chat</h3>
            <p>Combine with document search</p>
          </a>
          <a href="/cookbook/error-handling" className="docs-card">
            <h3>Error Handling</h3>
            <p>Robust error recovery</p>
          </a>
        </div>
      </section>
    </div>
  )
}

