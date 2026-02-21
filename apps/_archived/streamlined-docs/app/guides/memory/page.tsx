'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import {
  Brain,
  Database,
  Shield,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Settings,
  FileCode,
  ChevronRight,
  Layers,
  Lock,
  Archive,
  Trash2,
  Search,
  TrendingDown,
  BarChart3,
  HelpCircle,
  FileText,
  Eye,
  UserCheck,
  Scale,
  RefreshCw,
  Gauge,
  HardDrive,
  Timer,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicSetupExample = `import { clarityMemory } from '@clarity-chat/memory'

// Zero-config setup - uses IndexedDB in browser, memory in Node.js
const memory = clarityMemory()

// Add a memory
await memory.add("User prefers TypeScript", {
  type: 'semantic',      // Long-term factual memory
  scope: 'user',         // User-specific (persists across sessions)
  importance: 0.9,       // High importance (0-1)
})

// Recall relevant memories
const results = await memory.recall("programming preferences")

// Get optimized context for LLM
const context = await memory.context({ maxTokens: 2000 })`

const configuredSetupExample = `import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  // Storage configuration
  storage: {
    type: 'indexeddb',  // 'memory' | 'indexeddb' | 'file'
  },

  // Embedding provider for semantic search
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  },

  // Token budget management
  tokenBudget: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.10,      // 10% for system
      userPreferences: 0.15,   // 15% for preferences
      recentContext: 0.30,     // 30% for recent messages
      semanticMemory: 0.25,    // 25% for semantic memories
      episodicMemory: 0.15,    // 15% for episodic memories
      responseReserve: 0.05,   // 5% reserved for response
    },
    dynamicAllocation: true,   // Adjust based on context
  },

  // Retention policy (GDPR-compliant defaults)
  retentionPolicy: {
    session: 3600,          // 1 hour
    thread: 86400,          // 24 hours
    episodic: 2592000,      // 30 days
    semantic: 7776000,      // 90 days
    user: 31536000,         // 1 year
    global: 0,              // Never expires
  },

  // Enable automatic features
  enableAutoSummarization: true,
  summarizationInterval: 300000, // Every 5 minutes
  enableAutoCleanup: true,
  cleanupInterval: 3600000,      // Every hour

  debug: process.env.NODE_ENV === 'development',
})`

const useMemoryHookExample = `'use client'

import { useMemory } from '@clarity-chat/memory/react'

export function ChatWithMemory() {
  const {
    // Memory operations
    add,
    recall,
    context,
    get,
    update,
    forget,
    promote,
    compress,
    flush,

    // State
    memory,
    initialized,
    loading,
    error,
    stats,
    decayStats,

    // Utilities
    runDecay,
    initialize,
    close,
  } = useMemory({
    embeddingProvider: {
      provider: 'openai',
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    },
    autoInitialize: true,
  })

  const handleMessage = async (userMessage: string, aiResponse: string) => {
    // Store user message as episodic memory
    await add(userMessage, {
      type: 'episodic',
      scope: 'session',
      tags: ['user-message'],
    })

    // Extract and store facts as semantic memory
    const facts = extractFacts(aiResponse)
    for (const fact of facts) {
      await add(fact, {
        type: 'semantic',
        scope: 'user',
        importance: 0.8,
      })
    }

    // Get context for next message
    const ctx = await context({ maxTokens: 2000 })
    console.log('Context tokens:', ctx.totalTokens)
  }

  if (!initialized) return <div>Initializing memory...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="text-sm text-gray-500">
        Memories: {stats?.total || 0} | Tokens: {stats?.totalTokens || 0}
      </div>
      {/* Chat UI */}
    </div>
  )
}`

const memoryTypesExample = `import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// EPISODIC MEMORY - Specific events and interactions
// Best for: conversation history, user actions, temporal events
await memory.add("User asked about weather in NYC", {
  type: 'episodic',
  scope: 'session',     // Session-scoped (cleared on session end)
  importance: 0.5,
})

// SEMANTIC MEMORY - Facts and knowledge
// Best for: user preferences, learned facts, persistent knowledge
await memory.add("User is a software developer using React", {
  type: 'semantic',
  scope: 'user',        // User-scoped (persists across sessions)
  importance: 0.9,
})

// PROCEDURAL MEMORY - How-to knowledge
// Best for: learned patterns, workflows, procedures
await memory.add("When user says 'deploy', run the CI/CD pipeline", {
  type: 'procedural',
  scope: 'global',      // Global (shared across users)
  importance: 0.8,
})

// SHORT-TERM MEMORY - Temporary working memory
// Best for: current task context, immediate conversation
await memory.add("Currently discussing: API authentication", {
  type: 'short-term',
  scope: 'session',
  importance: 0.6,
})

// PROFILE MEMORY - User identity and preferences
// Best for: persistent user settings, preferences, history
await memory.add("Name: John, Role: Tech Lead, Team: Platform", {
  type: 'profile',
  scope: 'user',
  importance: 1.0,
})`

const memoryScopesExample = `// MEMORY SCOPES
// Determine visibility and persistence of memories

// SESSION SCOPE - Lives for the browser session
// TTL: ~1 hour, cleared when session ends
await memory.add("Current topic: debugging", {
  type: 'short-term',
  scope: 'session',
})

// THREAD SCOPE - Lives for a conversation thread
// TTL: ~24 hours, shared within a thread
await memory.add("Thread context: project planning meeting", {
  type: 'episodic',
  scope: 'thread',
})

// USER SCOPE - User-specific, persists across sessions
// TTL: ~90 days (configurable), private to user
await memory.add("User prefers dark mode", {
  type: 'semantic',
  scope: 'user',
})

// GLOBAL SCOPE - Shared across all users
// TTL: Never expires by default
await memory.add("Company policy: no PII in logs", {
  type: 'procedural',
  scope: 'global',
})`

const slidingWindowExample = `import { clarityMemory } from '@clarity-chat/memory'

// Sliding window keeps only the N most recent memories
const memory = clarityMemory({
  tokenBudget: {
    maxContextWindow: 4096,
    allocation: {
      recentContext: 0.50,    // 50% for recent messages
      semanticMemory: 0.30,   // 30% for semantic
      episodicMemory: 0.10,   // 10% for episodic
      systemPrompt: 0.05,
      userPreferences: 0.05,
      responseReserve: 0.00,
    },
  },
  limits: {
    maxMemories: 100,        // Keep max 100 memories
    maxTotalTokens: 50000,   // Max 50k tokens total
  },
})

// When adding memories, oldest are evicted automatically
for (const message of conversationHistory) {
  await memory.add(message.content, {
    type: 'episodic',
    scope: 'session',
  })
}

// Get context optimized for token budget
const context = await memory.context({
  maxTokens: 2000,
  includeRecent: true,  // Prioritize recent
})`

const summarizationExample = `import {
  clarityMemory,
  LLMSummarizer,
  createSummarizerWithFallback,
} from '@clarity-chat/memory'

// Configure LLM-based summarization
const summarizer = new LLMSummarizer({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',           // Use cheap model for summarization
  summaryStyle: 'structured',      // 'bullet' | 'narrative' | 'structured' | 'minimal'
  maxSummaryTokens: 200,
  preserveKeyFacts: true,
})

// Summarize a conversation
const messages = [
  { role: 'user', content: 'How do I set up authentication?' },
  { role: 'assistant', content: 'For authentication, you can use JWT tokens...' },
  // ... more messages
]

const summary = await summarizer.summarizeConversation(messages)
console.log(summary.narrative)      // Brief narrative
console.log(summary.topics)         // ['authentication', 'JWT']
console.log(summary.actionItems)    // Any action items extracted
console.log(summary.stats.compressionRatio) // e.g., 0.15 (85% reduction)

// Progressive summarization for long conversations
const progressive = await summarizer.progressiveSummarize(messages, {
  summarizeThreshold: 20,    // Summarize when > 20 messages
  keepRecentCount: 10,       // Keep last 10 messages verbatim
  maxSummaryTokens: 500,
})

console.log(progressive.summarizedPortion)  // Summary of older messages
console.log(progressive.recentMessages)     // Recent messages unchanged
console.log(progressive.stats.compressionRatio)

// Hierarchical multi-level summarization
const hierarchical = await summarizer.hierarchicalSummarize(longDocument)
console.log(hierarchical.executive)   // Ultra-brief (5% of original)
console.log(hierarchical.sections)    // Topic breakdowns (10%)
console.log(hierarchical.detailed)    // Full summary (20%)`

const hybridStrategyExample = `import { clarityMemory, LLMSummarizer } from '@clarity-chat/memory'

// Hybrid approach: sliding window + summarization
const memory = clarityMemory({
  tokenBudget: {
    maxContextWindow: 8000,
    allocation: {
      systemPrompt: 0.08,
      userPreferences: 0.10,
      recentContext: 0.35,      // Recent messages (verbatim)
      semanticMemory: 0.25,     // Long-term facts
      episodicMemory: 0.12,     // Past conversations (summarized)
      responseReserve: 0.10,
    },
    dynamicAllocation: true,
  },

  // Auto-summarization for older memories
  enableAutoSummarization: true,
  summarizationInterval: 300000,  // Every 5 minutes

  // Decay for intelligent forgetting
  decay: {
    enabled: true,
    autoDecayOnRecall: true,
    decayInterval: 3600000,  // Check every hour
    policies: {
      defaultPolicy: {
        ttl: 7 * 24 * 60 * 60 * 1000,  // 7 days
        curve: 'exponential',
        minImportance: 0.7,
        minAccessCount: 5,
      },
      byType: {
        semantic: { ttl: 30 * 24 * 60 * 60 * 1000 },  // 30 days
        episodic: { ttl: 24 * 60 * 60 * 1000 },       // 24 hours
        profile: { enabled: false },                   // Never decay
      },
    },
  },
})

// Build context with hybrid strategy
const context = await memory.context({
  maxTokens: 4000,
  includeSummary: true,
  includePreferences: true,
  includeRecent: true,
})

// Access formatted context for LLM
console.log(context.formatted)           // Ready for LLM
console.log(context.tokenBreakdown)      // Token usage by category`

const consentManagementExample = `import { clarityMemory, ConsentManager } from '@clarity-chat/memory'

// Initialize memory with consent management
const memory = clarityMemory({
  consent: {
    enabled: true,
    requireConsentForWrites: true,
    version: '1.0.0',
    getUserId: (metadata) => metadata.userId as string,
  },
})

// Create consent manager for UI
const consentManager = new ConsentManager(memory.store, '1.0.0')

// Record user consent (e.g., from consent dialog)
async function handleConsentGiven(userId: string, purposes: string[]) {
  await consentManager.recordConsent(
    userId,
    purposes as ConsentPurpose[],  // ['message_storage', 'embeddings', 'personalization']
    {
      ipAddress: request.ip,        // For audit trail
      userAgent: request.userAgent,
    }
  )
}

// Check consent before operations
async function storeMessage(userId: string, message: string) {
  // This throws if consent not given
  await consentManager.requireConsent(userId, 'message_storage')

  await memory.add(message, {
    type: 'episodic',
    scope: 'user',
    metadata: { userId },
  })
}

// Withdraw consent (GDPR Article 7(3))
async function handleConsentWithdrawn(userId: string, purpose?: string) {
  await consentManager.withdrawConsent(userId, purpose as ConsentPurpose)

  // If all consent withdrawn, delete user data
  if (!(await consentManager.hasConsent(userId, 'message_storage'))) {
    await deleteUserData(userId)
  }
}

// Get consent history for auditing
async function getConsentAuditTrail(userId: string) {
  return consentManager.getConsentHistory(userId)
}`

const dataRetentionExample = `import { clarityMemory } from '@clarity-chat/memory'

// Configure GDPR-compliant retention policies
const memory = clarityMemory({
  retentionPolicy: {
    // Session data - cleared after session
    session: 3600,           // 1 hour

    // Thread data - short-term retention
    thread: 86400,           // 24 hours

    // Episodic memories - medium retention
    episodic: 2592000,       // 30 days

    // Semantic memories - longer retention
    semantic: 7776000,       // 90 days

    // User profile - annual review
    user: 31536000,          // 1 year

    // Global knowledge - no automatic expiry
    global: 0,               // Never expires (0 = infinite)
  },

  // Enable automatic cleanup
  enableAutoCleanup: true,
  cleanupInterval: 3600000,  // Check every hour

  // Size limits to prevent unbounded growth
  limits: {
    maxMemories: 1000,
    maxTotalTokens: 100000,
    maxMemorySize: 10000,     // Max chars per memory
    warnThreshold: 0.9,       // Warn at 90% capacity
  },
})`

const userDataRequestsExample = `import { clarityMemory, AuditLogger } from '@clarity-chat/memory'

// GDPR Article 15: Right of Access
async function handleDataAccessRequest(userId: string) {
  // Get all user memories
  const results = await memory.query({
    userId,
    limit: 10000,
  })

  // Get audit trail
  const auditLogger = new AuditLogger(memory.store)
  const auditTrail = await auditLogger.getUserAuditTrail(userId)

  // Format for export
  return {
    memories: results.map(r => ({
      content: r.memory.content,
      type: r.memory.type,
      scope: r.memory.scope,
      createdAt: r.memory.createdAt,
      metadata: r.memory.metadata,
    })),
    auditTrail: auditTrail,
    exportedAt: new Date().toISOString(),
  }
}

// GDPR Article 17: Right to Erasure ("Right to be Forgotten")
async function handleDeletionRequest(userId: string) {
  // Delete all user memories
  const deleted = await memory.deleteMemories({ userId })

  // Log the deletion for compliance
  await auditLogger.log({
    eventType: 'user:data:deleted',
    severity: 'info',
    description: \`User data deletion completed for \${userId}\`,
    metadata: {
      userId,
      memoriesDeleted: deleted,
      requestedAt: new Date().toISOString(),
    },
  })

  // Verify deletion (GDPR requires verification)
  const remaining = await memory.query({ userId, limit: 1 })
  if (remaining.length > 0) {
    throw new Error('Deletion verification failed')
  }

  await auditLogger.log({
    eventType: 'user:data:deletion:verified',
    severity: 'info',
    description: \`User data deletion verified for \${userId}\`,
    metadata: { userId },
  })

  return { success: true, memoriesDeleted: deleted }
}`

const indexedDBStorageExample = `import { clarityMemory } from '@clarity-chat/memory'

// IndexedDB - Default for browser (recommended)
const memory = clarityMemory({
  storage: {
    type: 'indexeddb',
    options: {
      dbName: 'clarity-memory',  // Database name
    },
  },
})

// Advantages of IndexedDB:
// - Persistent across browser sessions
// - Large storage capacity (typically 50MB+)
// - Async, non-blocking operations
// - Structured data with indexes
// - Works offline

// The store is created automatically, but you can access it:
const store = memory.store  // IndexedDBStore instance`

const customStorageExample = `import { clarityMemory, MemoryService } from '@clarity-chat/memory'

// In-memory storage (for serverless/testing)
const memoryStore = clarityMemory({
  storage: { type: 'memory' },
})

// For custom backends, implement VectorStore interface:
interface VectorStore {
  initialize(): Promise<void>
  add(memory: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, memory: MemoryItem): Promise<void>
  delete(id: string): Promise<void>
  search(query: string, options: SearchOptions): Promise<SearchResult[]>
  getAll(options?: { types?: MemoryType[] }): Promise<MemoryItem[]>
  close(): Promise<void>
}

// Example: Custom PostgreSQL store
class PostgresStore implements VectorStore {
  private pool: Pool

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString })
  }

  async initialize() {
    await this.pool.query(\`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        scope TEXT NOT NULL,
        embedding vector(1536),
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    \`)
  }

  async add(memory: MemoryItem) {
    await this.pool.query(
      'INSERT INTO memories (id, content, type, scope, embedding, metadata) VALUES ($1, $2, $3, $4, $5, $6)',
      [memory.id, memory.content, memory.type, memory.scope, memory.embedding, memory.metadata]
    )
  }

  async search(query: string, options: SearchOptions) {
    // Use pgvector for similarity search
    const result = await this.pool.query(\`
      SELECT *, embedding <=> $1 AS distance
      FROM memories
      WHERE type = ANY($2)
      ORDER BY distance
      LIMIT $3
    \`, [options.embedding, options.types, options.limit])

    return result.rows.map(row => ({
      memory: row,
      score: 1 - row.distance,
    }))
  }

  // ... implement other methods
}

// Use custom store
const customMemory = new MemoryService(config, new PostgresStore(dbUrl))`

const importanceScoringExample = `import { clarityMemory, ImportanceScorer } from '@clarity-chat/memory'

// Configure importance scoring
const memory = clarityMemory({
  importanceScoring: {
    enabled: true,
    recencyHalfLife: 7,           // Memories lose half importance every 7 days
    maxFrequencyAccesses: 10,     // Normalize access count to 10
    weights: {
      base: 0.3,                  // 30% from user-defined importance
      recency: 0.25,              // 25% from how recent
      frequency: 0.20,            // 20% from access frequency
      relevance: 0.25,            // 25% from semantic relevance
    },
  },
})

// When adding memories, set importance
await memory.add("Critical security configuration", {
  type: 'semantic',
  scope: 'global',
  importance: 1.0,     // Maximum importance
})

await memory.add("User mentioned liking coffee", {
  type: 'semantic',
  scope: 'user',
  importance: 0.3,     // Low importance
})

// Scoring happens automatically on recall
const results = await memory.recall("security")
// Results are ranked by: base * 0.3 + recency * 0.25 + frequency * 0.2 + relevance * 0.25`

const decayManagementExample = `import { clarityMemory, DecayManager, createDecayManager } from '@clarity-chat/memory'

// Configure decay policies
const memory = clarityMemory({
  decay: {
    enabled: true,
    autoDecayOnRecall: true,      // Evaluate decay on each recall
    decayInterval: 3600000,        // Background check every hour
    policies: {
      defaultPolicy: {
        enabled: true,
        ttl: 7 * 24 * 60 * 60 * 1000,  // 7 days default
        curve: 'exponential',           // 'linear' | 'exponential' | 'step'
        minImportance: 0.7,             // Keep if importance >= 0.7
        minAccessCount: 5,              // Keep if accessed 5+ times
        halfLife: 3 * 24 * 60 * 60 * 1000,  // 3 day half-life
      },
      byType: {
        semantic: {
          ttl: 30 * 24 * 60 * 60 * 1000,  // 30 days for facts
          minImportance: 0.5,
        },
        episodic: {
          ttl: 24 * 60 * 60 * 1000,       // 24 hours for events
          curve: 'linear',
        },
        profile: {
          enabled: false,                  // Profile never decays
        },
        'short-term': {
          ttl: 60 * 60 * 1000,            // 1 hour
          curve: 'step',                   // Sudden expiration
        },
      },
      byScope: {
        session: { ttl: 60 * 60 * 1000 },        // 1 hour
        thread: { ttl: 24 * 60 * 60 * 1000 },    // 24 hours
        user: { ttl: 90 * 24 * 60 * 60 * 1000 }, // 90 days
        global: { enabled: false },               // Never decays
      },
    },
  },
})

// Manually trigger decay evaluation
const decayResult = await memory.runDecay()
console.log(\`Processed: \${decayResult.processed}\`)
console.log(\`Deleted: \${decayResult.deleted}\`)
console.log(\`Compressed: \${decayResult.compressed}\`)

// Get decay statistics
const stats = memory.getDecayStats()
console.log(\`Healthy: \${stats.healthy}\`)
console.log(\`At Risk: \${stats.atRisk}\`)
console.log(\`Expiring Soon: \${stats.expiring}\`)
console.log(\`Average Decay Score: \${stats.averageDecayScore}\`)`

const compressionExample = `import { clarityMemory } from '@clarity-chat/memory'

// Configure compression
const memory = clarityMemory({
  tokenOptimization: {
    maxContextWindow: 4096,
    enableCompression: true,
    compressionRatio: 0.5,       // Target 50% compression
    enableChunking: true,
    chunkSize: 500,              // Tokens per chunk
    chunkOverlap: 50,            // Overlap between chunks
  },
})

// Manually compress a memory
const compressedMemory = await memory.compress('memory-id')

// Compression preserves original
console.log(compressedMemory.original)    // Full content
console.log(compressedMemory.compressed)  // Compressed version
console.log(compressedMemory.tokens)      // New token count

// Auto-compression based on age and access
// Memories that are old but still relevant get compressed`

const auditLoggingExample = `import { clarityMemory, AuditLogger } from '@clarity-chat/memory'

// Configure audit logging
const memory = clarityMemory({
  audit: {
    enabled: true,
    persistent: true,
    retentionDays: 365,           // Keep audit logs for 1 year (GDPR)
    includeIpAddresses: false,    // Privacy-first default
    includeUserAgents: false,
  },
})

// Create audit logger
const auditLogger = new AuditLogger(memory.store, {
  enabled: true,
  retentionDays: 365,
  onLog: async (entry) => {
    // Send to external SIEM/logging system
    await sendToSplunk(entry)
  },
})

// All operations are automatically logged
// Manual logging for custom events:
await auditLogger.log({
  eventType: 'user:data:accessed',
  severity: 'info',
  description: 'User requested data export',
  metadata: {
    userId: 'user123',
    purpose: 'data_portability',
    legalBasis: 'consent',
  },
})

// Query audit logs
const logs = await auditLogger.query({
  userId: 'user123',
  eventType: ['memory:created', 'memory:deleted'],
  startTime: new Date('2024-01-01'),
  limit: 100,
})

// Get compliance statistics
const stats = await auditLogger.getStats()
console.log('Total logs:', stats.totalLogs)
console.log('Unique users:', stats.uniqueUsers)
console.log('By event type:', stats.byEventType)
console.log('Recent high-severity:', stats.recentHighSeverity)

// Export for compliance audits
const exportJson = await auditLogger.export('json')
const exportCsv = await auditLogger.export('csv')`

const completeExample = `'use client'

import { useMemory } from '@clarity-chat/memory/react'
import { ConsentManager, AuditLogger } from '@clarity-chat/memory'
import { useState, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function GDPRCompliantChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [hasConsent, setHasConsent] = useState(false)
  const [consentManager, setConsentManager] = useState<ConsentManager | null>(null)

  const {
    add,
    recall,
    context,
    stats,
    decayStats,
    initialized,
    error,
  } = useMemory({
    storage: { type: 'indexeddb' },
    embeddingProvider: {
      provider: 'openai',
      apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    },
    consent: {
      enabled: true,
      requireConsentForWrites: true,
      version: '1.0.0',
    },
    audit: {
      enabled: true,
      retentionDays: 365,
    },
    decay: {
      enabled: true,
      autoDecayOnRecall: true,
    },
    retentionPolicy: {
      session: 3600,
      episodic: 2592000,
      semantic: 7776000,
    },
  })

  // Check consent on mount
  useEffect(() => {
    if (initialized && consentManager) {
      consentManager.hasConsent(userId, 'message_storage')
        .then(setHasConsent)
    }
  }, [initialized, consentManager, userId])

  // Handle consent dialog
  const handleConsentGiven = async () => {
    if (!consentManager) return

    await consentManager.recordConsent(
      userId,
      ['message_storage', 'embeddings', 'personalization']
    )
    setHasConsent(true)
  }

  // Handle message send
  const handleSend = async (content: string) => {
    if (!hasConsent) {
      alert('Please accept the privacy policy to continue')
      return
    }

    // Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }
    setMessages(prev => [...prev, userMsg])

    // Store to memory
    await add(content, {
      type: 'episodic',
      scope: 'session',
      metadata: { userId, messageId: userMsg.id },
    })

    // Get relevant context
    const ctx = await context({ maxTokens: 2000 })

    // Call AI with context
    const response = await callAI(content, ctx.formatted)

    // Add assistant message
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response,
    }
    setMessages(prev => [...prev, assistantMsg])

    // Store response
    await add(response, {
      type: 'episodic',
      scope: 'session',
      metadata: { userId, messageId: assistantMsg.id },
    })

    // Extract and store facts
    const facts = extractFacts(response)
    for (const fact of facts) {
      await add(fact, {
        type: 'semantic',
        scope: 'user',
        importance: 0.8,
        metadata: { userId },
      })
    }
  }

  // Handle data deletion request
  const handleDeleteMyData = async () => {
    if (!confirm('This will delete all your data. Continue?')) return

    await memory.deleteMemories({ userId })
    await consentManager?.withdrawConsent(userId)
    setMessages([])
    setHasConsent(false)
  }

  if (!initialized) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (!hasConsent) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Privacy Consent</h2>
        <p className="mb-4">
          We store your messages to provide personalized responses.
          Your data is encrypted and retained for 90 days.
        </p>
        <button
          onClick={handleConsentGiven}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          I Accept
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Memory stats bar */}
      <div className="p-2 bg-gray-100 text-sm flex justify-between">
        <span>Memories: {stats?.total || 0} | Tokens: {stats?.totalTokens || 0}</span>
        <span>
          Health: {decayStats?.healthy || 0} healthy, {decayStats?.atRisk || 0} at risk
        </span>
        <button
          onClick={handleDeleteMyData}
          className="text-red-500 hover:underline"
        >
          Delete My Data
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={\`p-4 rounded-lg \${
              msg.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'
            }\`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  )
}`

const troubleshootingItems = [
  {
    title: 'Memory not persisting across page reloads',
    description: 'Memories disappear when you refresh the browser.',
    solution: `Check your storage configuration:

1. Ensure you're using 'indexeddb' storage type (not 'memory')
2. Verify IndexedDB is available in your environment
3. Check browser privacy settings (incognito mode may block storage)

storage: {
  type: 'indexeddb',  // Not 'memory'
}

IndexedDB is not available in:
- Server-side rendering (SSR)
- Some privacy-focused browsers
- Incognito/Private mode (limited)`,
  },
  {
    title: 'Token budget exceeded errors',
    description: 'Getting "Token budget exceeded" when building context.',
    solution: `Your memories exceed the configured token budget. Solutions:

1. Increase maxContextWindow in tokenBudget config
2. Enable compression and summarization
3. Reduce retention periods
4. Set maxMemories limit

tokenBudget: {
  maxContextWindow: 8000,  // Increase this
  allocation: { ... },
},
enableAutoSummarization: true,
limits: {
  maxMemories: 500,
  maxTotalTokens: 50000,
}`,
  },
  {
    title: 'Semantic search not returning relevant results',
    description: 'recall() returns unrelated memories or empty results.',
    solution: `Semantic search requires embeddings. Ensure:

1. Embedding provider is configured
2. API key is valid
3. Memories were added AFTER embedding config

embeddingProvider: {
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,  // Check this is set
  model: 'text-embedding-3-small',
}

If you added memories before configuring embeddings,
they won't have vectors. Re-add them or update with:

await memory.update(id, { embedding: await memory.embed(content) })`,
  },
  {
    title: 'Consent errors blocking operations',
    description: 'Operations fail with "Consent required" errors.',
    solution: `When consent management is enabled, you must:

1. Record consent before write operations
2. Check consent before sensitive reads

// Record consent first
await consentManager.recordConsent(userId, ['message_storage'])

// Or disable consent requirement
consent: {
  enabled: false,  // Disable for testing
}

For production, always get explicit consent first.`,
  },
  {
    title: 'Memory decay deleting important memories',
    description: 'Valuable memories are being automatically deleted.',
    solution: `Adjust decay policies to protect important memories:

1. Set higher minImportance threshold
2. Increase minAccessCount
3. Use longer TTL for semantic memories
4. Disable decay for specific types

decay: {
  policies: {
    defaultPolicy: {
      minImportance: 0.8,    // Protect high-importance
      minAccessCount: 3,     // Protect frequently accessed
    },
    byType: {
      profile: { enabled: false },  // Never decay profile
      semantic: {
        ttl: 90 * 24 * 60 * 60 * 1000,  // 90 days
      },
    },
  },
}`,
  },
  {
    title: 'useMemory hook not initializing',
    description: 'Hook returns initialized: false indefinitely.',
    solution: `Check these common issues:

1. Component must be client-side ('use client' directive)
2. Memory provider might be missing
3. autoInitialize might be disabled

// Ensure client component
'use client'

// Check autoInitialize
const { initialized } = useMemory({
  autoInitialize: true,  // Default is true
})

// Or manually initialize
useEffect(() => {
  if (!initialized) {
    initialize()
  }
}, [])`,
  },
]

type StrategyType = 'sliding' | 'summarization' | 'hybrid'

export default function MemoryGuidePage() {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('hybrid')

  return (
    <div className="container-docs py-8 sm:py-12">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Brain className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Memory Guide
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Conversation Memory in Clarity Chat
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Build AI applications that remember context, learn user preferences,
            and maintain GDPR-compliant conversation history. Memory transforms
            stateless AI into personalized, context-aware assistants.
          </p>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-200/50 dark:border-brand-800/30">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-brand-500" />
              <h2 className="text-xl font-bold">What You'll Learn</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Short-term vs long-term memory strategies',
                'Token budget management and optimization',
                'Memory types (semantic, episodic, procedural)',
                'Sliding window and summarization strategies',
                'GDPR/CCPA compliance with consent management',
                'Data retention and user data requests',
                'IndexedDB and custom storage backends',
                'Importance scoring and decay management',
                'Compression and optimization techniques',
                'Audit logging for compliance',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Understanding Memory */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Understanding Memory</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            AI memory enables your application to maintain context across messages,
            sessions, and even users. Clarity Chat implements a multi-layered memory
            system inspired by human cognition.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Short-Term Memory
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Temporary context for the current conversation. Stored in the
                session and cleared when the user leaves.
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  'Current conversation messages',
                  'Immediate context and topic',
                  'Session-specific preferences',
                  'Working memory for tasks',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-500" />
                Long-Term Memory
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Persistent knowledge that survives across sessions. Stored in
                IndexedDB or external databases.
              </p>
              <ul className="space-y-2 text-sm">
                {[
                  'User preferences and settings',
                  'Learned facts and knowledge',
                  'Historical conversation summaries',
                  'User profile information',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-blue-600 dark:text-blue-400">
                  Token Budget Management:
                </strong>{' '}
                LLMs have context limits (4K-128K tokens). Memory systems must
                intelligently select which memories to include, balancing relevance,
                recency, and importance within the available token budget.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Basic Memory Setup */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Basic Memory Setup</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Get started with zero configuration using{' '}
            <code className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-sm">clarityMemory()</code>.
            The library automatically detects your environment and chooses optimal defaults.
          </p>

          <div className="space-y-6">
            <StepCard number={1} title="Zero-config usage">
              <CodeBlock
                code={basicSetupExample}
                filename="lib/memory.ts"
              />
            </StepCard>

            <StepCard number={2} title="Full configuration">
              <CodeBlock
                code={configuredSetupExample}
                filename="lib/memory-configured.ts"
              />
            </StepCard>

            <StepCard number={3} title="React hook usage">
              <CodeBlock
                code={useMemoryHookExample}
                filename="components/ChatWithMemory.tsx"
              />
            </StepCard>
          </div>
        </section>
      </ScrollReveal>

      {/* Memory Types and Scopes */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Memory Types and Scopes</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Clarity Chat implements five memory types (inspired by cognitive science)
            and four scopes (determining visibility and persistence).
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Memory Types */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Memory Types</h3>
              {[
                {
                  name: 'Episodic',
                  icon: <Clock className="w-4 h-4" />,
                  color: 'text-amber-500',
                  desc: 'Specific events and interactions (conversation history)',
                },
                {
                  name: 'Semantic',
                  icon: <Brain className="w-4 h-4" />,
                  color: 'text-emerald-500',
                  desc: 'Facts and knowledge (user preferences, learned info)',
                },
                {
                  name: 'Procedural',
                  icon: <Settings className="w-4 h-4" />,
                  color: 'text-blue-500',
                  desc: 'How-to knowledge (workflows, patterns)',
                },
                {
                  name: 'Short-term',
                  icon: <Timer className="w-4 h-4" />,
                  color: 'text-purple-500',
                  desc: 'Temporary working memory (current task context)',
                },
                {
                  name: 'Profile',
                  icon: <UserCheck className="w-4 h-4" />,
                  color: 'text-pink-500',
                  desc: 'User identity (persistent settings, preferences)',
                },
              ].map((type, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
                >
                  <div className={cn('flex items-center gap-2 font-medium mb-1', type.color)}>
                    {type.icon}
                    <span>{type.name}</span>
                  </div>
                  <p className="text-sm text-neutral-500">{type.desc}</p>
                </div>
              ))}
            </div>

            {/* Memory Scopes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Memory Scopes</h3>
              {[
                {
                  name: 'Session',
                  ttl: '~1 hour',
                  icon: <Clock className="w-4 h-4" />,
                  color: 'text-amber-500',
                  desc: 'Lives for browser session, cleared on close',
                },
                {
                  name: 'Thread',
                  ttl: '~24 hours',
                  icon: <FileText className="w-4 h-4" />,
                  color: 'text-orange-500',
                  desc: 'Shared within a conversation thread',
                },
                {
                  name: 'User',
                  ttl: '~90 days',
                  icon: <UserCheck className="w-4 h-4" />,
                  color: 'text-emerald-500',
                  desc: 'User-specific, persists across sessions',
                },
                {
                  name: 'Global',
                  ttl: 'Never',
                  icon: <Database className="w-4 h-4" />,
                  color: 'text-blue-500',
                  desc: 'Shared across all users (system knowledge)',
                },
              ].map((scope, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className={cn('flex items-center gap-2 font-medium', scope.color)}>
                      {scope.icon}
                      <span>{scope.name}</span>
                    </div>
                    <span className="text-xs text-neutral-400">TTL: {scope.ttl}</span>
                  </div>
                  <p className="text-sm text-neutral-500">{scope.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <CollapsibleSection title="Memory Types Example" badge="Code">
            <CodeBlock
              code={memoryTypesExample}
              filename="examples/memory-types.ts"
            />
          </CollapsibleSection>

          <CollapsibleSection title="Memory Scopes Example" badge="Code">
            <CodeBlock
              code={memoryScopesExample}
              filename="examples/memory-scopes.ts"
            />
          </CollapsibleSection>
        </section>
      </ScrollReveal>

      {/* Memory Strategies */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Memory Strategies</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Choose how to manage conversation history within token limits.
            Each strategy has trade-offs between context preservation and efficiency.
          </p>

          {/* Strategy Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { id: 'sliding', label: 'Sliding Window', desc: 'Keep recent messages' },
              { id: 'summarization', label: 'Summarization', desc: 'Compress older content' },
              { id: 'hybrid', label: 'Hybrid', badge: 'Recommended', desc: 'Best of both' },
            ].map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id as StrategyType)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  selectedStrategy === strategy.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                )}
              >
                {strategy.label}
                {strategy.badge && selectedStrategy === strategy.id && (
                  <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                    {strategy.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStrategy}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.normal }}
            >
              {selectedStrategy === 'sliding' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                      <h4 className="font-medium text-emerald-700 dark:text-emerald-400">Pros</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Simple to implement</li>
                        <li>Predictable behavior</li>
                        <li>No external API calls</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mb-2" />
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">Cons</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Loses older context</li>
                        <li>No compression</li>
                        <li>Can miss important info</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                      <Info className="w-5 h-5 text-blue-500 mb-2" />
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Best For</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Short conversations</li>
                        <li>Simple Q&A bots</li>
                        <li>Cost-sensitive apps</li>
                      </ul>
                    </div>
                  </div>
                  <CodeBlock
                    code={slidingWindowExample}
                    filename="examples/sliding-window.ts"
                  />
                </div>
              )}

              {selectedStrategy === 'summarization' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                      <h4 className="font-medium text-emerald-700 dark:text-emerald-400">Pros</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>80-90% token reduction</li>
                        <li>Preserves key information</li>
                        <li>Good for long conversations</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mb-2" />
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">Cons</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Requires LLM API calls</li>
                        <li>Added latency</li>
                        <li>May lose nuance</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                      <Info className="w-5 h-5 text-blue-500 mb-2" />
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Best For</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Long conversations</li>
                        <li>Knowledge extraction</li>
                        <li>Context-heavy apps</li>
                      </ul>
                    </div>
                  </div>
                  <CodeBlock
                    code={summarizationExample}
                    filename="examples/summarization.ts"
                  />
                </div>
              )}

              {selectedStrategy === 'hybrid' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-2" />
                      <h4 className="font-medium text-emerald-700 dark:text-emerald-400">Pros</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Best context quality</li>
                        <li>Balanced efficiency</li>
                        <li>Intelligent decay</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mb-2" />
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">Trade-offs</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>More complex setup</li>
                        <li>Requires tuning</li>
                        <li>Multiple strategies</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                      <Info className="w-5 h-5 text-blue-500 mb-2" />
                      <h4 className="font-medium text-blue-700 dark:text-blue-400">Best For</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                        <li>Production apps</li>
                        <li>Personal assistants</li>
                        <li>Enterprise chatbots</li>
                      </ul>
                    </div>
                  </div>
                  <CodeBlock
                    code={hybridStrategyExample}
                    filename="examples/hybrid-strategy.ts"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </ScrollReveal>

      {/* GDPR/Privacy Compliance */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">GDPR/Privacy Compliance</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Clarity Memory includes built-in GDPR and CCPA compliance features.
            Implement consent management, data retention policies, and user data
            request handling.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                icon: <UserCheck className="w-5 h-5" />,
                title: 'Consent Management',
                article: 'GDPR Article 7',
                desc: 'Record, track, and verify user consent',
              },
              {
                icon: <Clock className="w-5 h-5" />,
                title: 'Data Retention',
                article: 'GDPR Article 5(1)(e)',
                desc: 'Automatic deletion based on policies',
              },
              {
                icon: <Eye className="w-5 h-5" />,
                title: 'Right of Access',
                article: 'GDPR Article 15',
                desc: 'Export all user data on request',
              },
              {
                icon: <Trash2 className="w-5 h-5" />,
                title: 'Right to Erasure',
                article: 'GDPR Article 17',
                desc: 'Delete user data on request',
              },
              {
                icon: <Scale className="w-5 h-5" />,
                title: 'Lawful Basis',
                article: 'GDPR Article 6',
                desc: 'Track legal basis for processing',
              },
              {
                icon: <ClipboardList className="w-5 h-5" />,
                title: 'Audit Logging',
                article: 'GDPR Article 30',
                desc: 'Records of processing activities',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center gap-2 text-brand-500 mb-2">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <p className="text-xs text-neutral-400 mb-1">{item.article}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <CollapsibleSection title="Consent Management" badge="GDPR Article 7">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Record explicit consent before storing any user data. Consent must be
                freely given, specific, informed, and withdrawable.
              </p>
              <CodeBlock
                code={consentManagementExample}
                filename="lib/consent.ts"
              />
            </CollapsibleSection>

            <CollapsibleSection title="Data Retention Policies" badge="GDPR Article 5">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Configure automatic deletion of data based on type, scope, and age.
                GDPR requires data minimization and storage limitation.
              </p>
              <CodeBlock
                code={dataRetentionExample}
                filename="lib/retention.ts"
              />
            </CollapsibleSection>

            <CollapsibleSection title="User Data Requests" badge="GDPR Articles 15, 17">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Handle data access and deletion requests. Users have the right to
                access, export, and delete their personal data.
              </p>
              <CodeBlock
                code={userDataRequestsExample}
                filename="api/user-data.ts"
              />
            </CollapsibleSection>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-amber-600 dark:text-amber-400">
                  Legal Disclaimer:
                </strong>{' '}
                This guide provides technical implementation guidance. Consult with
                a legal professional to ensure your specific use case complies with
                GDPR, CCPA, and other applicable regulations.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Storage Options */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Storage Options</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Choose the storage backend that fits your architecture. IndexedDB is
            recommended for browser apps, while custom backends support enterprise needs.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {[
              {
                name: 'IndexedDB',
                badge: 'Default',
                icon: <Database className="w-5 h-5" />,
                color: 'text-emerald-500',
                pros: ['Persistent', 'Large capacity', 'Works offline'],
                env: 'Browser',
              },
              {
                name: 'In-Memory',
                badge: 'Fast',
                icon: <Zap className="w-5 h-5" />,
                color: 'text-amber-500',
                pros: ['Fastest', 'No setup', 'Testing'],
                env: 'Any',
              },
              {
                name: 'Custom',
                badge: 'Enterprise',
                icon: <Settings className="w-5 h-5" />,
                color: 'text-blue-500',
                pros: ['PostgreSQL', 'Redis', 'Vector DBs'],
                env: 'Server',
              },
            ].map((storage, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn('flex items-center gap-2', storage.color)}>
                    {storage.icon}
                    <span className="font-medium">{storage.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                    {storage.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-2">Environment: {storage.env}</p>
                <ul className="text-sm space-y-1">
                  {storage.pros.map((pro, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <CollapsibleSection title="IndexedDB Storage (Default)" badge="Browser">
              <CodeBlock
                code={indexedDBStorageExample}
                filename="lib/storage-indexeddb.ts"
              />
            </CollapsibleSection>

            <CollapsibleSection title="Custom Storage Backend" badge="Advanced">
              <CodeBlock
                code={customStorageExample}
                filename="lib/storage-custom.ts"
              />
            </CollapsibleSection>
          </div>
        </section>
      </ScrollReveal>

      {/* Memory Optimization */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white">
              <Gauge className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Memory Optimization</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Optimize memory usage with importance scoring, intelligent decay,
            and compression. Keep your context relevant and efficient.
          </p>

          <div className="space-y-4">
            <CollapsibleSection title="Importance Scoring" badge="Relevance">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Multi-factor scoring ranks memories by base importance, recency,
                access frequency, and semantic relevance.
              </p>
              <CodeBlock
                code={importanceScoringExample}
                filename="lib/scoring.ts"
              />
            </CollapsibleSection>

            <CollapsibleSection title="Decay Management" badge="Forgetting">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Intelligent forgetting based on configurable policies. Memories
                naturally expire based on type, scope, and access patterns.
              </p>
              <CodeBlock
                code={decayManagementExample}
                filename="lib/decay.ts"
              />
            </CollapsibleSection>

            <CollapsibleSection title="Compression" badge="Token Savings">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Compress older memories to save tokens while preserving essential
                information. Original content is kept for reference.
              </p>
              <CodeBlock
                code={compressionExample}
                filename="lib/compression.ts"
              />
            </CollapsibleSection>
          </div>
        </section>
      </ScrollReveal>

      {/* Audit Logging */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Audit Logging</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Track all memory operations for compliance and debugging. GDPR Article 30
            requires records of processing activities.
          </p>

          <CodeBlock
            code={auditLoggingExample}
            filename="lib/audit.ts"
          />

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { event: 'memory:created', desc: 'New memory stored' },
              { event: 'memory:read', desc: 'Memory accessed' },
              { event: 'memory:updated', desc: 'Memory modified' },
              { event: 'memory:deleted', desc: 'Memory removed' },
              { event: 'consent:granted', desc: 'User gave consent' },
              { event: 'consent:withdrawn', desc: 'User revoked consent' },
              { event: 'user:data:exported', desc: 'Data export request' },
              { event: 'user:data:deleted', desc: 'Deletion request' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]"
              >
                <code className="text-xs text-brand-500">{item.event}</code>
                <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Complete Example */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Complete Example</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            A complete chat implementation with memory, consent management,
            GDPR compliance, and user data controls.
          </p>

          <CodeBlock
            code={completeExample}
            filename="components/GDPRCompliantChat.tsx"
          />
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Troubleshooting</h2>
          </div>

          <div className="space-y-4">
            {troubleshootingItems.map((issue, i) => (
              <CollapsibleSection
                key={i}
                title={issue.title}
                badge="Common Issue"
              >
                <div className="space-y-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {issue.description}
                  </p>
                  <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border-b border-neutral-200 dark:border-neutral-700">
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Solution
                      </span>
                    </div>
                    <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
                      <code>{issue.solution}</code>
                    </pre>
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Continue Learning</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Now that you understand memory, explore related topics to build
              more powerful AI applications.
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Token Optimization',
                  description: 'Reduce costs with intelligent token management',
                  href: '/guides/token-optimization',
                },
                {
                  icon: <Search className="w-5 h-5" />,
                  title: 'Semantic Search',
                  description: 'Implement embedding-based retrieval',
                  href: '/api/memory/semantic-search',
                },
                {
                  icon: <FileCode className="w-5 h-5" />,
                  title: 'Memory API Reference',
                  description: 'Complete API documentation',
                  href: '/api/memory',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>
    </div>
  )
}

// =============================================================================
// Helper Components
// =============================================================================

interface StepCardProps {
  number: number
  title: string
  children: React.ReactNode
}

function StepCard({ number, title, children }: StepCardProps) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-sm">
        {number}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface CodeBlockProps {
  code: string
  filename: string
  language?: string
}

function CodeBlock({
  code,
  filename,
}: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-400">
          <FileCode className="w-4 h-4" />
          <span className="text-sm font-mono">{filename}</span>
        </div>
        <EnhancedCopyButton
          text={code}
          label={`Copy ${filename}`}
          size="sm"
          celebration="pulse"
        />
      </div>
      <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}
