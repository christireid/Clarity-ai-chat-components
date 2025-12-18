/**
 * Node.js Express Example - Framework-Agnostic Memory Usage
 *
 * This example shows how to use @clarity-chat/memory in a Node.js backend
 */

import express from 'express'
import { MemoryService, type MemoryServiceConfig } from '@clarity-chat/memory'

// Initialize memory service
const memoryConfig: MemoryServiceConfig = {
  tokenOptimization: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.1,
      userPreferences: 0.15,
      recentContext: 0.3,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
    enableCompression: true,
    enableChunking: true,
  },
  persistence: {
    useVectorStore: false,
    useCache: true,
    useDatabase: false,
  },
  enableAutoCleanup: true,
  retentionPolicy: {
    shortTerm: 3600,
    session: 86400,
    thread: 604800,
    global: 0,
  },
}

const memoryService = new MemoryService(memoryConfig)

// Create Express app
const app = express()
app.use(express.json())

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, message, sessionId } = req.body

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message required' })
    }

    // Get relevant memories
    const memories = await memoryService.query({
      query: message,
      limit: 5,
      minConfidence: 0.7,
      sessionId,
      metadata: { userId },
    })

    // Build context for LLM
    const context = memories.map((r) => r.memory.content).join('\n\n')

    // Call your LLM (OpenAI, Anthropic, etc.)
    const llmResponse = await callLLM(message, context)

    // Store user message
    await memoryService.addMemory(
      message,
      'episodic',
      'session',
      {
        userId,
        sessionId,
        role: 'user',
        timestamp: new Date().toISOString(),
      },
      { priority: 'medium', confidence: 0.8 }
    )

    // Store assistant response
    await memoryService.addMemory(
      llmResponse,
      'episodic',
      'session',
      {
        userId,
        sessionId,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      },
      { priority: 'medium', confidence: 0.9 }
    )

    res.json({
      response: llmResponse,
      memoriesUsed: memories.length,
      tokensUsed: memories.reduce((sum, m) => sum + m.memory.tokens, 0),
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user preferences
app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const preferences = await memoryService.query({
      types: ['semantic'],
      scopes: ['user', 'global'],
      metadata: { userId },
      limit: 20,
    })

    res.json({
      preferences: preferences.map((r) => ({
        key: r.memory.metadata.preferenceKey,
        value: r.memory.metadata.preferenceValue,
        confidence: r.memory.confidence,
      })),
    })
  } catch (error) {
    console.error('Preferences error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Set user preference
app.post('/api/preferences/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { key, value } = req.body

    await memoryService.addMemory(
      `User preference: ${key} = ${value}`,
      'semantic',
      'user',
      {
        userId,
        preferenceKey: key,
        preferenceValue: value,
      },
      { priority: 'high', confidence: 0.95 }
    )

    res.json({ success: true })
  } catch (error) {
    console.error('Set preference error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get memory statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = memoryService.getStats()
    res.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Mock LLM function (replace with your actual LLM call)
async function callLLM(message: string, context: string): Promise<string> {
  // Example with OpenAI
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   messages: [
  //     {
  //       role: 'system',
  //       content: `You are a helpful assistant.\n\nContext:\n${context}`
  //     },
  //     {
  //       role: 'user',
  //       content: message
  //     }
  //   ]
  // })
  // return response.choices[0].message.content

  return `Echo: ${message} (with ${context ? 'context' : 'no context'})`
}

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Memory-enabled API server listening on port ${PORT}`)
  console.log(`Try: POST http://localhost:${PORT}/api/chat`)
})

export default app
