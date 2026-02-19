'use client'

/**
 * Clarity Chat - Memory Engine
 *
 * A comprehensive memory system with:
 * - Multiple storage backends (memory, IndexedDB)
 * - Sliding window and vector-store strategies
 * - Automatic context summarization
 * - Multi-tenant scope support
 */

import type { Message } from '@clarity-chat/types'
import type { MemoryConfig } from './types'

// =============================================================================
// Types
// =============================================================================

export interface MemoryEntry {
  id: string
  message: Message
  timestamp: number
  scope: string
  importance: number // 0-1, higher = more important to retain
  embedding?: number[]
}

export interface MemoryContext {
  messages: Message[]
  summary?: string
  totalMessages: number
  retrievedCount: number
  truncated: boolean
}

export interface MemoryEngineState {
  entries: MemoryEntry[]
  strategy: 'sliding-window' | 'vector-store' | 'hybrid'
  maxTokens: number
  limit: number
  scope: string
  initialized: boolean
}

// =============================================================================
// Token Estimation
// =============================================================================

/**
 * Estimate token count from message
 */
function estimateMessageTokens(message: Message): number {
  const roleTokens = 4 // Approximate tokens for role prefix
  const contentTokens = Math.ceil(message.content.length / 4)
  return roleTokens + contentTokens
}

/**
 * Estimate total tokens from messages
 */
function estimateTotalTokens(messages: Message[]): number {
  return messages.reduce((sum, msg) => sum + estimateMessageTokens(msg), 0)
}

// =============================================================================
// Importance Scoring
// =============================================================================

/**
 * Calculate importance score for a message
 * Higher scores indicate messages that should be retained longer
 */
function calculateImportance(message: Message): number {
  let score = 0.5 // Base importance

  // User questions are important
  if (message.role === 'user' && message.content.includes('?')) {
    score += 0.2
  }

  // Long detailed responses are important
  if (message.content.length > 500) {
    score += 0.1
  }

  // Messages with code or lists are important
  if (message.content.includes('```') || message.content.includes('- ')) {
    score += 0.1
  }

  // System messages are important
  if (message.role === 'system') {
    score += 0.3
  }

  return Math.min(score, 1)
}

// =============================================================================
// Simple Embedding for Vector Store
// =============================================================================

/**
 * Create a simple embedding for similarity search
 * Uses word frequency vectors
 */
function createSimpleEmbedding(text: string): number[] {
  // Use a fixed vocabulary of common words for simplicity
  const commonWords = [
    'the',
    'a',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'need',
    'want',
    'like',
    'know',
    'think',
    'make',
    'get',
    'go',
    'come',
    'take',
    'see',
    'use',
    'find',
    'give',
    'tell',
    'work',
    'call',
    'try',
    'ask',
    'feel',
    'seem',
    'leave',
    'put',
    'mean',
    'keep',
    'let',
    'begin',
    'help',
    'show',
    'hear',
    'play',
    'run',
    'move',
    'live',
    'believe',
    'hold',
    'code',
    'function',
    'error',
    'bug',
    'fix',
    'create',
    'update',
    'delete',
    'data',
    'api',
    'user',
    'system',
    'file',
    'query',
    'response',
    'request',
    'result',
    'value',
    'type',
    'class',
    'how',
    'what',
    'why',
    'when',
    'where',
    'which',
    'who',
    'yes',
    'no',
    'thanks',
  ]

  const words = text.toLowerCase().split(/\W+/)
  const embedding = new Array(commonWords.length).fill(0)

  for (const word of words) {
    const index = commonWords.indexOf(word)
    if (index !== -1) {
      embedding[index]++
    }
  }

  // Normalize
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  )
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude
    }
  }

  return embedding
}

/**
 * Calculate cosine similarity between embeddings
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  for (let i = 0; i < a.length; i++) {
    const aVal = a[i]
    const bVal = b[i]
    if (aVal !== undefined && bVal !== undefined) {
      dotProduct += aVal * bVal
    }
  }

  return dotProduct // Already normalized
}

// =============================================================================
// IndexedDB Storage
// =============================================================================

const DB_NAME = 'clarity-chat-memory'
const DB_VERSION = 1
const STORE_NAME = 'memory-entries'

/**
 * Open IndexedDB database
 */
async function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return null

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('scope', 'scope', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

/**
 * Save entries to IndexedDB
 */
async function saveToIndexedDB(entries: MemoryEntry[]): Promise<void> {
  const db = await openDatabase()
  if (!db) return

  const transaction = db.transaction([STORE_NAME], 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  for (const entry of entries) {
    store.put(entry)
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

/**
 * Load entries from IndexedDB
 */
async function loadFromIndexedDB(scope: string): Promise<MemoryEntry[]> {
  const db = await openDatabase()
  if (!db) return []

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('scope')
    const request = index.getAll(scope)

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

/**
 * Clear entries from IndexedDB
 */
async function clearIndexedDB(scope?: string): Promise<void> {
  const db = await openDatabase()
  if (!db) return

  if (!scope) {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
    return
  }

  const entries = await loadFromIndexedDB(scope)
  const transaction = db.transaction([STORE_NAME], 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  for (const entry of entries) {
    store.delete(entry.id)
  }
}

// =============================================================================
// Memory Engine
// =============================================================================

/**
 * Create a new memory engine instance
 */
export function createMemoryEngine(
  config: MemoryConfig = {}
): MemoryEngineState {
  return {
    entries: [],
    strategy: config.strategy || 'sliding-window',
    maxTokens: config.maxTokens || 4096,
    limit: config.limit || 20,
    scope: config.scopes?.[0] || 'default',
    initialized: false,
  }
}

/**
 * Initialize memory engine (load from storage if applicable)
 */
export async function initializeMemory(
  state: MemoryEngineState,
  config: MemoryConfig
): Promise<MemoryEngineState> {
  const storage = config.storage || 'memory'
  const scope = config.scopes?.[0] || 'default'

  let entries: MemoryEntry[] = []

  if (storage === 'indexeddb') {
    try {
      entries = await loadFromIndexedDB(scope)
    } catch {
      // Fall back to empty memory
      entries = []
    }
  }

  return {
    ...state,
    entries,
    strategy: config.strategy || state.strategy,
    maxTokens: config.maxTokens || state.maxTokens,
    limit: config.limit || state.limit,
    scope,
    initialized: true,
  }
}

/**
 * Add a message to memory
 */
export async function addToMemory(
  state: MemoryEngineState,
  message: Message,
  config: MemoryConfig
): Promise<MemoryEngineState> {
  const entry: MemoryEntry = {
    id: `mem_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    message,
    timestamp: Date.now(),
    scope: state.scope,
    importance: calculateImportance(message),
    embedding:
      state.strategy !== 'sliding-window'
        ? createSimpleEmbedding(message.content)
        : undefined,
  }

  let entries = [...state.entries, entry]

  // Apply limit based on strategy
  if (state.strategy === 'sliding-window') {
    // Simple sliding window: keep most recent
    if (entries.length > state.limit) {
      entries = entries.slice(-state.limit)
    }
  } else if (state.strategy === 'vector-store' || state.strategy === 'hybrid') {
    // Keep based on importance when over limit
    if (entries.length > state.limit * 2) {
      // Sort by importance and recency
      entries.sort((a, b) => {
        const recencyWeight = 0.3
        const importanceWeight = 0.7

        const aRecency = a.timestamp / Date.now()
        const bRecency = b.timestamp / Date.now()

        const aScore =
          aRecency * recencyWeight + a.importance * importanceWeight
        const bScore =
          bRecency * recencyWeight + b.importance * importanceWeight

        return bScore - aScore
      })

      entries = entries.slice(0, state.limit * 1.5)
    }
  }

  // Persist to storage
  const storage = config.storage || 'memory'
  if (storage === 'indexeddb') {
    try {
      await saveToIndexedDB([entry])
    } catch {
      // Continue without persistence
    }
  }

  return {
    ...state,
    entries,
  }
}

/**
 * Retrieve relevant context from memory
 */
export function retrieveContext(
  state: MemoryEngineState,
  query?: string,
  options: { maxTokens?: number; includeAll?: boolean } = {}
): MemoryContext {
  const maxTokens = options.maxTokens || state.maxTokens

  if (state.entries.length === 0) {
    return {
      messages: [],
      totalMessages: 0,
      retrievedCount: 0,
      truncated: false,
    }
  }

  let selectedEntries: MemoryEntry[]

  if (state.strategy === 'sliding-window' || options.includeAll) {
    // Simple: take most recent entries
    selectedEntries = state.entries.slice(-state.limit)
  } else if (state.strategy === 'vector-store' && query) {
    // Vector similarity search
    const queryEmbedding = createSimpleEmbedding(query)

    const scoredEntries = state.entries
      .map((entry) => ({
        entry,
        score: entry.embedding
          ? cosineSimilarity(queryEmbedding, entry.embedding)
          : 0,
      }))
      .sort((a, b) => b.score - a.score)

    // Take top entries by relevance
    selectedEntries = scoredEntries.slice(0, state.limit).map((s) => s.entry)

    // Sort by timestamp for natural order
    selectedEntries.sort((a, b) => a.timestamp - b.timestamp)
  } else {
    // Hybrid: mix of recent and relevant
    const recentEntries = state.entries.slice(-Math.ceil(state.limit / 2))

    if (query) {
      const queryEmbedding = createSimpleEmbedding(query)
      const olderEntries = state.entries.slice(0, -Math.ceil(state.limit / 2))

      const relevantOlder = olderEntries
        .map((entry) => ({
          entry,
          score: entry.embedding
            ? cosineSimilarity(queryEmbedding, entry.embedding)
            : 0,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.floor(state.limit / 2))
        .map((s) => s.entry)

      selectedEntries = [...relevantOlder, ...recentEntries]
      selectedEntries.sort((a, b) => a.timestamp - b.timestamp)
    } else {
      selectedEntries = recentEntries
    }
  }

  // Truncate to fit token budget
  const messages: Message[] = []
  let currentTokens = 0
  let truncated = false

  for (const entry of selectedEntries) {
    const entryTokens = estimateMessageTokens(entry.message)
    if (currentTokens + entryTokens > maxTokens) {
      truncated = true
      break
    }
    messages.push(entry.message)
    currentTokens += entryTokens
  }

  return {
    messages,
    totalMessages: state.entries.length,
    retrievedCount: messages.length,
    truncated,
  }
}

/**
 * Generate a summary of older messages (for context compression)
 */
export function generateSummary(messages: Message[]): string {
  if (messages.length === 0) return ''

  // Simple summary: extract key points from conversation
  const userQuestions = messages
    .filter((m) => m.role === 'user' && m.content.includes('?'))
    .map((m) => m.content.split('?')[0] + '?')
    .slice(-3)

  const topics = messages
    .map((m) => {
      // Extract potential topics (capitalized words, code terms)
      const words = m.content.match(
        /\b[A-Z][a-z]+\b|\b[a-z]+(?:Error|Exception|Function|Component|API|Hook)\b/g
      )
      return words || []
    })
    .flat()
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 5)

  let summary = 'Previous conversation context:\n'

  if (topics.length > 0) {
    summary += `Topics discussed: ${topics.join(', ')}\n`
  }

  if (userQuestions.length > 0) {
    summary += `Key questions: ${userQuestions.join(' ')}\n`
  }

  return summary
}

/**
 * Clear memory
 */
export async function clearMemory(
  state: MemoryEngineState,
  config: MemoryConfig
): Promise<MemoryEngineState> {
  const storage = config.storage || 'memory'

  if (storage === 'indexeddb') {
    try {
      await clearIndexedDB(state.scope)
    } catch {
      // Continue
    }
  }

  return {
    ...state,
    entries: [],
  }
}

/**
 * Get memory statistics
 */
export function getMemoryStats(state: MemoryEngineState): {
  totalEntries: number
  totalTokens: number
  oldestTimestamp: number | null
  newestTimestamp: number | null
  averageImportance: number
} {
  const entries = state.entries
  const totalTokens = entries.reduce(
    (sum, e) => sum + estimateMessageTokens(e.message),
    0
  )
  const averageImportance =
    entries.length > 0
      ? entries.reduce((sum, e) => sum + e.importance, 0) / entries.length
      : 0

  const firstEntry = entries[0]
  const lastEntry = entries[entries.length - 1]

  return {
    totalEntries: entries.length,
    totalTokens,
    oldestTimestamp: firstEntry?.timestamp ?? null,
    newestTimestamp: lastEntry?.timestamp ?? null,
    averageImportance: Math.round(averageImportance * 100) / 100,
  }
}
