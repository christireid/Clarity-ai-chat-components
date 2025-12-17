/**
 * Show Examples Command
 */

import * as vscode from 'vscode'

export async function showExamplesCommand() {
  const example = await vscode.window.showQuickPick([
    { 
      label: '💬 Basic Chat', 
      description: 'Simple chat completion',
      value: 'basic-chat'
    },
    { 
      label: '🌊 Streaming Chat', 
      description: 'Real-time streaming responses',
      value: 'streaming'
    },
    { 
      label: '⚡ Next.js API Route', 
      description: 'API route for Next.js',
      value: 'nextjs-api'
    },
    { 
      label: '🎣 React Hook', 
      description: 'Custom React hook for chat',
      value: 'react-hook'
    },
    { 
      label: '🔄 Multi-turn Conversation', 
      description: 'Maintain conversation history',
      value: 'conversation'
    },
    { 
      label: '📝 Function Calling', 
      description: 'Use function calling/tools',
      value: 'functions'
    },
    { 
      label: '💰 Cost Tracking', 
      description: 'Track token usage and costs',
      value: 'cost-tracking'
    },
    { 
      label: '🔍 RAG Pattern', 
      description: 'Retrieval Augmented Generation',
      value: 'rag'
    }
  ], {
    placeHolder: 'Select an example to view'
  })

  if (!example) return

  const code = getExampleCode(example.value)
  const language = example.value.includes('react') ? 'typescriptreact' : 'typescript'

  // Create new untitled document with the example
  const document = await vscode.workspace.openTextDocument({
    content: code,
    language
  })

  await vscode.window.showTextDocument(document)
}

function getExampleCode(exampleType: string): string {
  const examples: Record<string, string> = {
    'basic-chat': `import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function chat(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ],
    temperature: 0.7,
    max_tokens: 1000
  })

  return response.choices[0].message.content
}

// Usage
const answer = await chat('What is the capital of France?')
console.log(answer)`,

    'streaming': `import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function streamChat(message: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }],
    stream: true
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ''
    process.stdout.write(content)
  }
}

// Usage
await streamChat('Tell me a story about a robot')`,

    'nextjs-api': `import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      ...history,
      { role: 'user', content: message }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages
    })

    return NextResponse.json({
      content: response.choices[0].message.content,
      usage: response.usage
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}`,

    'react-hook': `import { useState, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    setLoading(true)
    setError(null)

    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history: messages })
      })

      if (!response.ok) throw new Error('Request failed')

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      }

      setMessages(prev => [...prev, assistantMessage])
      return data.content
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, clearMessages }
}`,

    'conversation': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

class ConversationManager {
  private messages: Message[] = []

  constructor(systemPrompt?: string) {
    if (systemPrompt) {
      this.messages.push({ role: 'system', content: systemPrompt })
    }
  }

  async chat(userMessage: string): Promise<string> {
    this.messages.push({ role: 'user', content: userMessage })

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: this.messages
    })

    const assistantMessage = response.choices[0].message.content!
    this.messages.push({ role: 'assistant', content: assistantMessage })

    return assistantMessage
  }

  getHistory(): Message[] {
    return [...this.messages]
  }

  clear() {
    this.messages = []
  }
}

// Usage
const conversation = new ConversationManager('You are a helpful coding assistant')
const answer1 = await conversation.chat('What is TypeScript?')
const answer2 = await conversation.chat('Give me an example')`,

    'functions': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City name' },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] }
        },
        required: ['location']
      }
    }
  }
]

async function chat(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }],
    tools
  })

  const toolCall = response.choices[0].message.tool_calls?.[0]

  if (toolCall) {
    const args = JSON.parse(toolCall.function.arguments)
    console.log(\`Calling function: \${toolCall.function.name}\`)
    console.log('Arguments:', args)
    // Call your actual function here
  }

  return response.choices[0].message.content
}`,

    'cost-tracking': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const PRICING = {
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
} as const

function calculateCost(
  usage: { prompt_tokens: number; completion_tokens: number },
  model: keyof typeof PRICING
): number {
  const pricing = PRICING[model]
  const inputCost = (usage.prompt_tokens * pricing.input) / 1000
  const outputCost = (usage.completion_tokens * pricing.output) / 1000
  return inputCost + outputCost
}

async function chatWithCostTracking(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: message }]
  })

  const cost = calculateCost(response.usage!, 'gpt-4-turbo')

  console.log('Response:', response.choices[0].message.content)
  console.log('Tokens:', response.usage!.total_tokens)
  console.log(\`Cost: $\${cost.toFixed(4)}\`)

  return { content: response.choices[0].message.content, cost }
}`,

    'rag': `import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

interface Document {
  id: string
  content: string
  metadata?: Record<string, any>
}

// Simulate document retrieval (replace with actual vector search)
async function retrieveRelevantDocs(query: string): Promise<Document[]> {
  // In production, use a vector database like Pinecone, Weaviate, etc.
  return [
    { id: '1', content: 'Relevant document 1 about ' + query },
    { id: '2', content: 'Relevant document 2 about ' + query }
  ]
}

async function chatWithRAG(userQuery: string) {
  // 1. Retrieve relevant documents
  const relevantDocs = await retrieveRelevantDocs(userQuery)

  // 2. Build context from documents
  const context = relevantDocs.map(doc => doc.content).join('\\n\\n')

  // 3. Create prompt with context
  const systemPrompt = \`You are a helpful assistant. Use the following context to answer questions:

Context:
\${context}

Answer based on the context provided. If the answer is not in the context, say so.\`

  // 4. Generate response
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ]
  })

  return response.choices[0].message.content
}`
  }

  return examples[exampleType] || '// Example not found'
}
