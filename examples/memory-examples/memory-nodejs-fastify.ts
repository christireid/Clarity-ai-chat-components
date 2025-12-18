/**
 * Node.js Fastify Example - Modern Clarity Memory API
 *
 * This example shows how to use @clarity-chat/memory in a Fastify backend
 * Fastify is a fast and low overhead web framework for Node.js
 *
 * Install dependencies: npm install fastify
 * Run: npx tsx examples/memory-examples/memory-nodejs-fastify.ts
 */

import Fastify from 'fastify'
import { clarityMemory } from '../../packages/memory/src/factory'

// Initialize memory service
// @ts-expect-error - Example uses minimal config, factory provides defaults
const memory = clarityMemory({
  debug: true,
  storage: {
    type: 'memory', // Use 'file' for persistence
  },
})

// Must initialize before use
await memory.initialize()

// Create Fastify app
const fastify = Fastify({
  logger: true,
})

// =============================================================================
// 💡 Type Definitions for Fastify Requests
// =============================================================================

interface ChatBody {
  userId: string
  message: string
  sessionId?: string
}

interface PreferenceBody {
  key: string
  value: string
}

/**
 * Query options for memory retrieval.
 * @description Used to filter and limit memory queries.
 */
interface MemoryQuery {
  metadata: { userId: string }
  limit: number
  types?: string[]
}

/**
 * POST /api/chat
 * Chat endpoint with memory-enhanced context
 */
fastify.post<{ Body: ChatBody }>('/api/chat', async (request, reply) => {
  const { userId, message, sessionId } = request.body

  if (!userId || !message) {
    return reply.code(400).send({ error: 'userId and message required' })
  }

  try {
    // Search for relevant memories
    const relevantMemories = await memory.recall(message, {
      limit: 5,
      minConfidence: 0.7,
      metadata: { userId, sessionId },
    })

    // Get optimized context bundle
    const contextBundle = await memory.context({
      maxTokens: 1000,
    })

    // Call your LLM with the context
    const llmResponse = await callLLM(message, contextBundle.formatted || '')

    // Store the conversation
    await Promise.all([
      memory.add(message, {
        type: 'episodic',
        scope: 'session',
        importance: 0.5,
        tags: ['user-message', userId, sessionId].filter(Boolean),
      }),
      memory.add(llmResponse, {
        type: 'episodic',
        scope: 'session',
        importance: 0.6,
        tags: ['assistant-response', userId, sessionId].filter(Boolean),
      }),
    ])

    return {
      response: llmResponse,
      memoriesUsed: relevantMemories.length,
      tokensUsed: contextBundle.tokenBreakdown.total,
      context: (contextBundle.formatted || '').substring(0, 200) + '...',
    }
  } catch (error) {
    request.log.error(error)
    return reply.code(500).send({ error: 'Internal server error' })
  }
})

/**
 * GET /api/preferences/:userId
 * Get user preferences from semantic memory
 */
fastify.get<{ Params: { userId: string } }>(
  '/api/preferences/:userId',
  async (request, reply) => {
    const { userId } = request.params

    try {
      const preferences = await memory.query({
        types: ['semantic'],
        scopes: ['user', 'global'],
        metadata: { userId, category: 'preference' },
        limit: 20,
      })

      return {
        preferences: preferences.map((result) => ({
          content: result.memory.content,
          score: result.score ?? result.relevance,
          tags: result.memory.tags,
          createdAt: result.memory.createdAt,
        })),
      }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Internal server error' })
    }
  }
)

/**
 * POST /api/preferences/:userId
 * Set user preference as semantic memory
 */
fastify.post<{ Params: { userId: string }; Body: PreferenceBody }>(
  '/api/preferences/:userId',
  async (request, reply) => {
    const { userId } = request.params
    const { key, value } = request.body

    if (!key || !value) {
      return reply.code(400).send({ error: 'key and value required' })
    }

    try {
      const memoryId = await memory.add(`User preference: ${key} = ${value}`, {
        type: 'semantic',
        scope: 'user',
        importance: 0.9,
        tags: ['preference', key, userId],
      })

      return { success: true, memoryId }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Internal server error' })
    }
  }
)

/**
 * GET /api/stats
 * Get memory statistics
 */
fastify.get('/api/stats', async (request, reply) => {
  try {
    const stats = memory.getStats()
    return stats
  } catch (error) {
    request.log.error(error)
    return reply.code(500).send({ error: 'Internal server error' })
  }
})

/**
 * GET /api/memories/:userId
 * Get all memories for a user
 */
fastify.get<{
  Params: { userId: string }
  Querystring: { type?: string; limit?: string }
}>('/api/memories/:userId', async (request, reply) => {
  const { userId } = request.params
  const { type, limit = '50' } = request.query

  try {
    // 💡 Using MemoryQuery interface for type safety
    const query: MemoryQuery = {
      metadata: { userId },
      limit: Number(limit),
      ...(type && { types: [type] }),
    }

    const memories = await memory.query(query)

    return {
      memories: memories.map((r) => ({
        id: r.memory.id,
        content: r.memory.content,
        type: r.memory.type,
        importance: r.memory.importance,
        timestamp: r.memory.timestamp,
        tags: r.memory.tags,
      })),
    }
  } catch (error) {
    request.log.error(error)
    return reply.code(500).send({ error: 'Internal server error' })
  }
})

/**
 * DELETE /api/memories/:memoryId
 * Delete a specific memory
 */
fastify.delete<{ Params: { memoryId: string } }>(
  '/api/memories/:memoryId',
  async (request, reply) => {
    const { memoryId } = request.params

    if (!memoryId) {
      return reply.code(400).send({ error: 'memoryId required' })
    }

    try {
      const success = await memory.forget(memoryId)
      return { success }
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Internal server error' })
    }
  }
)

/**
 * GET /health
 * Health check endpoint
 */
fastify.get('/health', async () => {
  return { status: 'ok', service: 'clarity-memory-fastify-api' }
})

/**
 * Mock LLM function - Replace with your actual LLM integration
 */
async function callLLM(message: string, context: string): Promise<string> {
  // Mock response for demonstration
  const contextPreview = context
    ? context.substring(0, 50) + '...'
    : 'no context'
  return `Echo: ${message} (with context: ${contextPreview})`
}

// Start server
const start = async () => {
  try {
    const PORT = Number(process.env['PORT']) || 3000
    const HOST = process.env['HOST'] || '0.0.0.0'

    await fastify.listen({ port: PORT, host: HOST })

    console.log(`\n✨ Clarity Memory Fastify API Server`)
    console.log(`📡 Listening on http://${HOST}:${PORT}`)
    console.log(`\nAvailable endpoints:`)
    console.log(`  POST   http://localhost:${PORT}/api/chat`)
    console.log(`  GET    http://localhost:${PORT}/api/preferences/:userId`)
    console.log(`  POST   http://localhost:${PORT}/api/preferences/:userId`)
    console.log(`  GET    http://localhost:${PORT}/api/memories/:userId`)
    console.log(`  DELETE http://localhost:${PORT}/api/memories/:memoryId`)
    console.log(`  GET    http://localhost:${PORT}/api/stats`)
    console.log(`  GET    http://localhost:${PORT}/health\n`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
