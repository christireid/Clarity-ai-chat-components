/**
 * Example 4: Tool Integration
 *
 * Demonstrates automatic tool call capture, tool history retrieval,
 * and context-aware tool usage with memory.
 */

import { clarityMemory } from '@clarity-chat/memory'
import type { MemoryItem } from '@clarity-chat/memory'

async function toolIntegrationExample() {
  const memory = clarityMemory()

  // 1. Capture a tool call
  async function searchDatabase(query: string, filters: any) {
    const toolCallId = `tool_${Date.now()}`

    try {
      // Execute the actual tool
      const results = await executeSearch(query, filters)

      // Capture successful tool call
      await memory.captureToolCall(
        'database_search',
        { query, filters },
        { resultCount: results.length, results: results.slice(0, 5) },
        {
          threadId: 'thread_123',
          toolType: 'database',
          status: 'success',
        }
      )

      return results
    } catch (error) {
      // Capture failed tool call
      await memory.captureToolCall(
        'database_search',
        { query, filters },
        { error: error.message },
        {
          threadId: 'thread_123',
          toolType: 'database',
          status: 'error',
        }
      )

      throw error
    }
  }

  // Example search
  await searchDatabase('customers with premium plan', { plan: 'premium' })

  // 2. Retrieve tool history
  const toolHistory = await memory.getToolHistory({
    limit: 10,
    filters: {
      metadata: { toolName: 'database_search' },
    },
  })

  console.log(`Found ${toolHistory.length} previous tool calls`)
  toolHistory.forEach((call) => {
    console.log(`- ${call.metadata.toolName}: ${call.metadata.status}`)
  })

  // 3. Get context for tool usage
  const context = await memory.getToolContext('database search')
  console.log('Tool context:', context)
}

// Wrapper for automatic tool capture
function withMemoryCapture(
  toolName: string,
  fn: (...args: any[]) => Promise<any>,
  memory: ReturnType<typeof clarityMemory>
) {
  return async (...args: any[]) => {
    const startTime = performance.now()

    try {
      const result = await fn(...args)
      const duration = performance.now() - startTime

      await memory.captureToolCall(
        toolName,
        { args },
        { result, duration },
        {
          status: 'success',
          toolType: 'auto-captured',
        }
      )

      return result
    } catch (error) {
      const duration = performance.now() - startTime

      await memory.captureToolCall(
        toolName,
        { args },
        { error: error.message, duration },
        {
          status: 'error',
          toolType: 'auto-captured',
        }
      )

      throw error
    }
  }
}

// Example: Wrap existing tools
const memory = clarityMemory()

const searchDatabaseWithMemory = withMemoryCapture(
  'database_search',
  async (query: string) => {
    // Original implementation
    return []
  },
  memory
)

// Now all calls are automatically captured
await searchDatabaseWithMemory('test query')

// React Component with Tool Integration
import React, { useState, useEffect } from 'react'
import { useMemoryTools, useMemoryService } from '@clarity-chat/memory'

export function DatabaseQueryComponent({ threadId }: { threadId: string }) {
  const { captureToolCall, getToolHistory } = useMemoryTools({
    autoCapture: true,
    toolFilter: (name) => name.startsWith('database_'),
  })

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [toolCalls, setToolCalls] = useState<MemoryItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load previous tool calls
  useEffect(() => {
    loadToolHistory()
  }, [])

  async function loadToolHistory() {
    const history = await getToolHistory('database_search')
    setToolCalls(history)
  }

  async function handleSearch() {
    if (!query.trim()) return

    setLoading(true)
    try {
      // Execute search
      const searchResults = await executeSearch(query, {})

      // Capture tool call
      await captureToolCall(
        'database_search',
        { query },
        { resultCount: searchResults.length },
        {
          threadId,
          toolType: 'database',
        }
      )

      setResults(searchResults)

      // Reload tool history
      await loadToolHistory()
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="search-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search database..."
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="results">
        <h3>Results ({results.length})</h3>
        {results.map((result, idx) => (
          <div key={idx}>{JSON.stringify(result)}</div>
        ))}
      </div>

      <div className="tool-history">
        <h3>Previous Searches</h3>
        {toolCalls.map((call) => (
          <div key={call.id} className="tool-call">
            <strong>{call.metadata.toolName}</strong>
            <span>{new Date(call.createdAt).toLocaleString()}</span>
            <pre>{JSON.stringify(call.metadata.toolParams, null, 2)}</pre>
            <div>Status: {call.metadata.status}</div>
            {call.metadata.toolResult && (
              <div>
                Results: {call.metadata.toolResult.resultCount} found
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Advanced: Tool recommendation based on context
export async function recommendTool(
  userQuery: string,
  memory: ReturnType<typeof clarityMemory>
): Promise<string | null> {
  // Get tool history
  const toolHistory = await memory.getToolHistory({ limit: 50 })

  // Analyze query intent
  const keywords = extractKeywords(userQuery)

  // Find tools used for similar queries
  const relevantTools = toolHistory.filter((call) => {
    const toolQuery = call.metadata.toolParams?.query || ''
    const toolKeywords = extractKeywords(toolQuery)

    // Check keyword overlap
    const overlap = keywords.filter((k) => toolKeywords.includes(k))
    return overlap.length > 0
  })

  if (relevantTools.length === 0) return null

  // Recommend most successful tool
  const successfulTools = relevantTools.filter(
    (t) => t.metadata.status === 'success'
  )

  if (successfulTools.length === 0) return null

  // Count tool usage
  const toolCounts = new Map<string, number>()
  successfulTools.forEach((t) => {
    const name = t.metadata.toolName
    toolCounts.set(name, (toolCounts.get(name) || 0) + 1)
  })

  // Return most used tool
  const sortedTools = [...toolCounts.entries()].sort((a, b) => b[1] - a[1])

  return sortedTools[0][0]
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3)
}

async function executeSearch(query: string, filters: any): Promise<any[]> {
  // Mock implementation
  return [
    { id: 1, name: 'Result 1' },
    { id: 2, name: 'Result 2' },
  ]
}

// LangChain Integration Example
import { DynamicTool } from '@langchain/core/tools'

export function createMemoryAwareTool(
  name: string,
  description: string,
  func: (input: string) => Promise<string>,
  memory: ReturnType<typeof clarityMemory>
) {
  return new DynamicTool({
    name,
    description,
    func: async (input: string) => {
      const startTime = Date.now()

      try {
        // Execute tool
        const result = await func(input)

        // Capture in memory
        await memory.captureToolCall(
          name,
          { input },
          { result, duration: Date.now() - startTime },
          {
            toolType: 'langchain',
            status: 'success',
          }
        )

        return result
      } catch (error) {
        // Capture error
        await memory.captureToolCall(
          name,
          { input },
          { error: error.message, duration: Date.now() - startTime },
          {
            toolType: 'langchain',
            status: 'error',
          }
        )

        throw error
      }
    },
  })
}

// Usage with LangChain
const memory = clarityMemory()

const searchTool = createMemoryAwareTool(
  'database_search',
  'Search the database for relevant information',
  async (query: string) => {
    const results = await executeSearch(query, {})
    return JSON.stringify(results)
  },
  memory
)

// Now use with LangChain agent
// const agent = createAgent({ tools: [searchTool], ... })

// Run example
if (require.main === module) {
  toolIntegrationExample().catch(console.error)
}
