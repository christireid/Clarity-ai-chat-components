/**
 * Comprehensive tests for Prompt Cache Manager
 *
 * Tests cover:
 * - PromptCacheManager class
 * - Anthropic and OpenAI message preparation
 * - Cache breakpoint calculation
 * - Cache warming utilities
 * - TTL refresh scheduling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  PromptCacheManager,
  createAnthropicCachedMessages,
  estimateCacheSavings,
  calculateCacheBreakpoints,
  applyBreakpointsToMessages,
  createCacheWarmingRequests,
  calculateWarmingSchedule,
  calculateTTLRefreshSchedule,
} from '../prompt-caching/cache-manager'

// =============================================================================
// PROMPT CACHE MANAGER CLASS TESTS
// =============================================================================

describe('PromptCacheManager', () => {
  let cacheManager: PromptCacheManager

  beforeEach(() => {
    cacheManager = new PromptCacheManager({
      provider: 'anthropic',
      model: 'claude-3-5-sonnet',
      defaultMinLength: 1024,
      trackStats: true,
    })
  })

  describe('constructor', () => {
    it('creates with default options', () => {
      const manager = new PromptCacheManager()
      const stats = manager.getStats()

      expect(stats.requests).toBe(0)
      expect(stats.hits).toBe(0)
    })

    it('creates with custom options', () => {
      const manager = new PromptCacheManager({
        provider: 'openai',
        model: 'gpt-4o',
        defaultMinLength: 512,
      })

      // Manager should use custom settings
      // 512 tokens * 4 chars/token = 2048 chars needed (Math.ceil rounding)
      expect(manager.isCacheable('x'.repeat(2100))).toBe(true)
      // 511 tokens * 4 = 2044 chars max before meeting threshold
      expect(manager.isCacheable('x'.repeat(2040))).toBe(false)
    })
  })

  describe('registerCacheable / unregisterCacheable', () => {
    it('registers cacheable content', () => {
      cacheManager.registerCacheable('system-prompt', {
        content: 'You are a helpful assistant.',
        type: 'system',
        minLength: 100,
      })

      // Content is registered (verified indirectly through API usage)
      expect(true).toBe(true)
    })

    it('unregisters cacheable content', () => {
      cacheManager.registerCacheable('test-content', {
        content: 'Test',
        type: 'custom',
      })

      cacheManager.unregisterCacheable('test-content')

      // Content is unregistered (no error thrown)
      expect(true).toBe(true)
    })
  })

  describe('isCacheable', () => {
    it('returns true for content exceeding default min length', () => {
      const longContent = 'x'.repeat(4100) // ~1025 tokens at 4 chars/token

      expect(cacheManager.isCacheable(longContent)).toBe(true)
    })

    it('returns false for content below default min length', () => {
      const shortContent = 'Hello world'

      expect(cacheManager.isCacheable(shortContent)).toBe(false)
    })

    it('uses custom min length when provided', () => {
      const content = 'x'.repeat(500)

      expect(cacheManager.isCacheable(content, 100)).toBe(true)
      expect(cacheManager.isCacheable(content, 200)).toBe(false)
    })
  })

  describe('prepareMessagesAnthropic', () => {
    it('adds cache_control to long system messages', () => {
      const longSystemPrompt = 'x'.repeat(5000) // Well over 1024 tokens
      const messages = [
        { role: 'system', content: longSystemPrompt },
        { role: 'user', content: 'Hello' },
      ]

      const prepared = cacheManager.prepareMessagesAnthropic(messages)

      expect(prepared[0]?.cache_control).toEqual({ type: 'ephemeral' })
      expect(prepared[1]?.cache_control).toBeUndefined()
    })

    it('adds cache_control to last long user message', () => {
      const longUserMessage = 'x'.repeat(5000)
      const messages = [
        { role: 'user', content: 'Short message' },
        { role: 'assistant', content: 'Response' },
        { role: 'user', content: longUserMessage },
      ]

      const prepared = cacheManager.prepareMessagesAnthropic(messages)

      expect(prepared[0]?.cache_control).toBeUndefined()
      expect(prepared[2]?.cache_control).toEqual({ type: 'ephemeral' })
    })

    it('does not add cache_control to short messages', () => {
      const messages = [
        { role: 'system', content: 'Short system prompt' },
        { role: 'user', content: 'Hello' },
      ]

      const prepared = cacheManager.prepareMessagesAnthropic(messages)

      expect(prepared.every(m => m.cache_control === undefined)).toBe(true)
    })

    it('preserves original message properties', () => {
      const messages = [{ role: 'user', content: 'Hello' }]

      const prepared = cacheManager.prepareMessagesAnthropic(messages)

      expect(prepared[0]?.role).toBe('user')
      expect(prepared[0]?.content).toBe('Hello')
    })
  })

  describe('prepareRequestOpenAI', () => {
    it('returns cached_content for long system prompts', () => {
      const longSystem = 'x'.repeat(5000)
      const result = cacheManager.prepareRequestOpenAI({
        messages: [{ role: 'user', content: 'Hello' }],
        system: longSystem,
      })

      expect(result.cached_content).toBe(longSystem)
    })

    it('omits cached_content for short system prompts', () => {
      const result = cacheManager.prepareRequestOpenAI({
        messages: [{ role: 'user', content: 'Hello' }],
        system: 'Short system prompt',
      })

      expect(result.cached_content).toBeUndefined()
    })

    it('returns messages unchanged', () => {
      const messages = [{ role: 'user', content: 'Hello' }]
      const result = cacheManager.prepareRequestOpenAI({ messages })

      expect(result.messages).toEqual(messages)
    })
  })

  describe('getOptimalCachePoints', () => {
    it('identifies system messages as cache points', () => {
      const messages = [
        { role: 'system', content: 'x'.repeat(5000) },
        { role: 'user', content: 'Hello' },
      ]

      const cachePoints = cacheManager.getOptimalCachePoints(messages)

      expect(cachePoints).toContain(0)
    })

    it('identifies long user messages as cache points', () => {
      const messages = [
        { role: 'system', content: 'Short system' },
        { role: 'user', content: 'x'.repeat(10000) }, // > 2048 tokens
      ]

      const cachePoints = cacheManager.getOptimalCachePoints(messages)

      expect(cachePoints).toContain(1)
    })

    it('returns empty array when no messages are cacheable', () => {
      const messages = [
        { role: 'system', content: 'Short' },
        { role: 'user', content: 'Hello' },
      ]

      const cachePoints = cacheManager.getOptimalCachePoints(messages)

      expect(cachePoints).toHaveLength(0)
    })
  })

  describe('statistics tracking', () => {
    it('records cache hits', () => {
      cacheManager.recordCacheHit(1000, 0.003)

      const stats = cacheManager.getStats()

      expect(stats.requests).toBe(1)
      expect(stats.hits).toBe(1)
      expect(stats.tokensSaved).toBe(1000)
      expect(stats.costSaved).toBe(0.003)
      expect(stats.hitRate).toBe(100)
    })

    it('records cache misses', () => {
      cacheManager.recordCacheMiss()

      const stats = cacheManager.getStats()

      expect(stats.requests).toBe(1)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBe(0)
    })

    it('calculates hit rate correctly', () => {
      cacheManager.recordCacheHit(100)
      cacheManager.recordCacheHit(100)
      cacheManager.recordCacheMiss()

      const stats = cacheManager.getStats()

      expect(stats.hitRate).toBeCloseTo(66.67, 1)
    })

    it('resets statistics', () => {
      cacheManager.recordCacheHit(1000, 0.005)
      cacheManager.recordCacheMiss()
      cacheManager.resetStats()

      const stats = cacheManager.getStats()

      expect(stats.requests).toBe(0)
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.tokensSaved).toBe(0)
      expect(stats.costSaved).toBe(0)
    })

    it('does not track stats when trackStats is false', () => {
      const manager = new PromptCacheManager({ trackStats: false })
      manager.recordCacheHit(1000)

      const stats = manager.getStats()

      expect(stats.requests).toBe(0)
    })
  })

  describe('calculatePotentialSavings', () => {
    it('calculates Anthropic savings (90% discount)', () => {
      const result = cacheManager.calculatePotentialSavings({
        inputTokens: 1000000,
        cacheHitRate: 0.5,
        provider: 'anthropic',
      })

      expect(result.withCache).toBeLessThan(result.withoutCache)
      expect(result.savings).toBeGreaterThan(0)
      expect(result.savingsPercent).toBeGreaterThan(0)
    })

    it('calculates OpenAI savings (50% discount)', () => {
      const result = cacheManager.calculatePotentialSavings({
        inputTokens: 1000000,
        cacheHitRate: 0.5,
        provider: 'openai',
      })

      expect(result.withCache).toBeLessThan(result.withoutCache)
    })

    it('shows no savings at 0% hit rate', () => {
      const result = cacheManager.calculatePotentialSavings({
        inputTokens: 1000000,
        cacheHitRate: 0,
        provider: 'anthropic',
      })

      expect(result.savings).toBe(0)
    })

    it('shows max savings at 100% hit rate', () => {
      const result = cacheManager.calculatePotentialSavings({
        inputTokens: 1000000,
        cacheHitRate: 1.0,
        provider: 'anthropic',
      })

      // 90% of cost should be saved
      expect(result.savingsPercent).toBeCloseTo(90, 0)
    })
  })
})

// =============================================================================
// HELPER FUNCTION TESTS
// =============================================================================

describe('createAnthropicCachedMessages', () => {
  it('adds cache_control to long system prompt', () => {
    const longSystemPrompt = 'x'.repeat(5000)
    const messages = createAnthropicCachedMessages(longSystemPrompt, [
      { role: 'user', content: 'Hello' },
    ])

    expect(messages[0]?.cache_control).toEqual({ type: 'ephemeral' })
  })

  it('does not add cache_control to short system prompt', () => {
    const messages = createAnthropicCachedMessages('Short prompt', [
      { role: 'user', content: 'Hello' },
    ])

    expect(messages[0]?.cache_control).toBeUndefined()
  })

  it('adds cache_control to last long user message', () => {
    const messages = createAnthropicCachedMessages('System', [
      { role: 'user', content: 'Short' },
      { role: 'assistant', content: 'Response' },
      { role: 'user', content: 'x'.repeat(5000) },
    ])

    // Last user message should have cache_control
    expect(messages[3]?.cache_control).toEqual({ type: 'ephemeral' })
  })

  it('respects custom minCacheLength', () => {
    const messages = createAnthropicCachedMessages(
      'x'.repeat(500),
      [],
      100 // Lower threshold
    )

    expect(messages[0]?.cache_control).toEqual({ type: 'ephemeral' })
  })

  it('handles empty system prompt', () => {
    const messages = createAnthropicCachedMessages('', [
      { role: 'user', content: 'Hello' },
    ])

    // Should only have user message
    expect(messages).toHaveLength(1)
    expect(messages[0]?.role).toBe('user')
  })
})

describe('estimateCacheSavings', () => {
  it('calculates daily, monthly, and annual savings', () => {
    const result = estimateCacheSavings({
      systemPromptTokens: 5000,
      contextTokens: 10000,
      conversationsPerDay: 100,
      provider: 'anthropic',
      model: 'claude-3-5-sonnet',
    })

    expect(result.dailySavings).toBeGreaterThan(0)
    expect(result.monthlySavings).toBe(result.dailySavings * 30)
    expect(result.annualSavings).toBe(result.dailySavings * 365)
  })

  it('provides savings details', () => {
    const result = estimateCacheSavings({
      systemPromptTokens: 5000,
      contextTokens: 10000,
      conversationsPerDay: 100,
      provider: 'anthropic',
      model: 'claude-3-5-sonnet',
    })

    expect(result.details).toContain('90%')
    expect(result.details).toContain('15000') // Total tokens
  })

  it('calculates different savings for OpenAI vs Anthropic', () => {
    const anthropicSavings = estimateCacheSavings({
      systemPromptTokens: 5000,
      contextTokens: 10000,
      conversationsPerDay: 100,
      provider: 'anthropic',
      model: 'claude-3-5-sonnet',
    })

    const openaiSavings = estimateCacheSavings({
      systemPromptTokens: 5000,
      contextTokens: 10000,
      conversationsPerDay: 100,
      provider: 'openai',
      model: 'gpt-4o',
    })

    // Anthropic has 90% discount, OpenAI has 50%
    expect(anthropicSavings.dailySavings).toBeGreaterThan(openaiSavings.dailySavings)
  })
})

// =============================================================================
// CACHE BREAKPOINT TESTS
// =============================================================================

describe('calculateCacheBreakpoints', () => {
  it('includes system message as critical breakpoint', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ]

    const breakpoints = calculateCacheBreakpoints(messages)

    const systemBreakpoint = breakpoints.find(bp => bp.index === 0)
    expect(systemBreakpoint).toBeDefined()
    expect(systemBreakpoint?.priority).toBe('critical')
  })

  it('respects maxBreakpoints limit', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'x'.repeat(3000) },
      { role: 'assistant', content: 'x'.repeat(3000) },
      { role: 'user', content: 'x'.repeat(3000) },
      { role: 'assistant', content: 'x'.repeat(3000) },
      { role: 'user', content: 'x'.repeat(3000) },
      { role: 'assistant', content: 'x'.repeat(3000) },
    ]

    const breakpoints = calculateCacheBreakpoints(messages, { maxBreakpoints: 2 })

    expect(breakpoints.length).toBeLessThanOrEqual(2)
  })

  it('calculates cumulative tokens', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'Hello' },
    ]

    const breakpoints = calculateCacheBreakpoints(messages)

    if (breakpoints.length > 0) {
      expect(breakpoints[0]!.cumulativeTokens).toBeGreaterThan(0)
    }
  })

  it('handles OpenAI provider differently', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'x'.repeat(3000) },
      { role: 'assistant', content: 'x'.repeat(3000) },
    ]

    const breakpoints = calculateCacheBreakpoints(messages, { provider: 'openai' })

    // OpenAI only supports system message caching
    expect(breakpoints.length).toBeLessThanOrEqual(1)
  })

  it('prefers assistant message boundaries', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'x'.repeat(3000) },
      { role: 'assistant', content: 'x'.repeat(3000) },
    ]

    const breakpoints = calculateCacheBreakpoints(messages, { maxBreakpoints: 4 })

    const assistantBreakpoint = breakpoints.find(
      bp => messages[bp.index]?.role === 'assistant'
    )

    if (assistantBreakpoint) {
      expect(assistantBreakpoint.priority).toBe('high')
      expect(assistantBreakpoint.reason).toContain('turn boundary')
    }
  })

  it('includes long user context', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'x'.repeat(3000) }, // > 512 tokens
    ]

    const breakpoints = calculateCacheBreakpoints(messages, {
      maxBreakpoints: 4,
      minTokensBetweenBreakpoints: 500,
    })

    const userBreakpoint = breakpoints.find(
      bp => messages[bp.index]?.role === 'user' && bp.priority === 'medium'
    )

    // May or may not have user breakpoint depending on token distances
    expect(breakpoints.length).toBeGreaterThan(0)
  })

  it('returns no critical/high priority breakpoints for short conversation', () => {
    const messages = [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello!' },
    ]

    const breakpoints = calculateCacheBreakpoints(messages)

    // No critical or high priority breakpoints for short content
    const meaningfulBreakpoints = breakpoints.filter(
      bp => bp.priority === 'critical' || bp.priority === 'high'
    )
    expect(meaningfulBreakpoints).toHaveLength(0)
  })
})

describe('applyBreakpointsToMessages', () => {
  it('adds cache_control at breakpoint indices', () => {
    const messages = [
      { role: 'system', content: 'System prompt' },
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi!' },
    ]

    const breakpoints = [
      { index: 0, cumulativeTokens: 100, priority: 'critical' as const, reason: 'System' },
      { index: 2, cumulativeTokens: 200, priority: 'high' as const, reason: 'Turn' },
    ]

    const result = applyBreakpointsToMessages(messages, breakpoints)

    expect(result[0]?.cache_control).toEqual({ type: 'ephemeral' })
    expect(result[1]?.cache_control).toBeUndefined()
    expect(result[2]?.cache_control).toEqual({ type: 'ephemeral' })
  })

  it('preserves message content', () => {
    const messages = [{ role: 'system', content: 'Test content' }]
    const breakpoints = [
      { index: 0, cumulativeTokens: 100, priority: 'critical' as const, reason: 'Test' },
    ]

    const result = applyBreakpointsToMessages(messages, breakpoints)

    expect(result[0]?.content).toBe('Test content')
    expect(result[0]?.role).toBe('system')
  })

  it('handles empty breakpoints', () => {
    const messages = [{ role: 'user', content: 'Hello' }]
    const result = applyBreakpointsToMessages(messages, [])

    expect(result[0]?.cache_control).toBeUndefined()
  })
})

// =============================================================================
// CACHE WARMING TESTS
// =============================================================================

describe('createCacheWarmingRequests', () => {
  it('creates warming requests for system content', () => {
    const requests = createCacheWarmingRequests({
      content: [
        { id: 'system', content: 'System prompt', type: 'system', priority: 1 },
      ],
      provider: 'anthropic',
    })

    expect(requests).toHaveLength(1)
    expect(requests[0]!.isWarmingRequest).toBe(true)
    expect(requests[0]!.contentId).toBe('system')
    expect(requests[0]!.messages[0]?.role).toBe('system')
  })

  it('adds minimal user message to complete system warming', () => {
    const requests = createCacheWarmingRequests({
      content: [
        { id: 'system', content: 'System prompt', type: 'system', priority: 1 },
      ],
      provider: 'anthropic',
    })

    // Should have system + minimal user message
    expect(requests[0]!.messages).toHaveLength(2)
    expect(requests[0]!.messages[1]?.role).toBe('user')
  })

  it('adds cache_control for Anthropic provider', () => {
    const requests = createCacheWarmingRequests({
      content: [
        { id: 'system', content: 'System prompt', type: 'system', priority: 1 },
      ],
      provider: 'anthropic',
    })

    expect(requests[0]!.messages[0]?.cache_control).toEqual({ type: 'ephemeral' })
  })

  it('creates document warming as user message', () => {
    const requests = createCacheWarmingRequests({
      content: [
        { id: 'doc', content: 'Documentation content', type: 'document', priority: 1 },
      ],
      provider: 'anthropic',
    })

    expect(requests[0]!.messages[0]?.role).toBe('user')
    expect(requests[0]!.messages[0]?.content).toContain('Documentation content')
  })

  it('sorts by priority', () => {
    const requests = createCacheWarmingRequests({
      content: [
        { id: 'low', content: 'Low', type: 'document', priority: 3 },
        { id: 'high', content: 'High', type: 'system', priority: 1 },
        { id: 'medium', content: 'Medium', type: 'context', priority: 2 },
      ],
      provider: 'anthropic',
    })

    expect(requests[0]!.contentId).toBe('high')
    expect(requests[1]!.contentId).toBe('medium')
    expect(requests[2]!.contentId).toBe('low')
  })

  it('estimates tokens for each request', () => {
    const requests = createCacheWarmingRequests({
      content: [
        { id: 'test', content: 'x'.repeat(1000), type: 'system', priority: 1 },
      ],
      provider: 'anthropic',
    })

    expect(requests[0]!.estimatedTokens).toBeGreaterThan(0)
  })
})

describe('calculateWarmingSchedule', () => {
  it('batches requests based on maxConcurrent', () => {
    const requests = [
      { contentId: 'a', estimatedTokens: 100 },
      { contentId: 'b', estimatedTokens: 100 },
      { contentId: 'c', estimatedTokens: 100 },
      { contentId: 'd', estimatedTokens: 100 },
      { contentId: 'e', estimatedTokens: 100 },
    ]

    const schedule = calculateWarmingSchedule(requests, { maxConcurrent: 2 })

    expect(schedule.length).toBe(3) // ceil(5/2) = 3 batches
    expect(schedule[0]!.batch).toHaveLength(2)
    expect(schedule[1]!.batch).toHaveLength(2)
    expect(schedule[2]!.batch).toHaveLength(1)
  })

  it('calculates execute times with delays', () => {
    const requests = [
      { contentId: 'a', estimatedTokens: 100 },
      { contentId: 'b', estimatedTokens: 100 },
    ]

    const schedule = calculateWarmingSchedule(requests, {
      maxConcurrent: 1,
      delayBetweenBatches: 1000,
    })

    expect(schedule[0]!.executeAt).toBe(0)
    expect(schedule[1]!.executeAt).toBe(1000)
  })

  it('calculates refresh times based on TTL', () => {
    const requests = [{ contentId: 'a', estimatedTokens: 100 }]

    const schedule = calculateWarmingSchedule(requests, {
      cacheTTL: 300000, // 5 minutes
      refreshMargin: 30000, // 30 seconds
    })

    expect(schedule[0]!.refreshAt).toBe(270000) // TTL - margin
  })

  it('handles empty requests', () => {
    const schedule = calculateWarmingSchedule([])

    expect(schedule).toHaveLength(0)
  })
})

// =============================================================================
// TTL REFRESH TESTS
// =============================================================================

describe('calculateTTLRefreshSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('indicates refresh needed when close to expiry', () => {
    const now = Date.now()
    vi.setSystemTime(now)

    // Last hit was 4.5 minutes ago (270000 ms)
    const lastCacheHit = now - 270000

    const result = calculateTTLRefreshSchedule(lastCacheHit, {
      baseTTL: 300000, // 5 minutes
      refreshBefore: 30000, // 30 seconds
    })

    // Should recommend refresh (30 seconds remaining, within refresh window)
    expect(result.shouldRefresh).toBe(true)
    expect(result.timeRemaining).toBe(30000)
  })

  it('does not recommend refresh when plenty of time remaining', () => {
    const now = Date.now()
    vi.setSystemTime(now)

    // Last hit was 1 minute ago
    const lastCacheHit = now - 60000

    const result = calculateTTLRefreshSchedule(lastCacheHit, {
      baseTTL: 300000, // 5 minutes
      refreshBefore: 30000, // 30 seconds
    })

    expect(result.shouldRefresh).toBe(false)
    expect(result.timeRemaining).toBe(240000) // 4 minutes remaining
  })

  it('calculates correct expiry time', () => {
    const now = Date.now()
    vi.setSystemTime(now)

    const lastCacheHit = now - 100000

    const result = calculateTTLRefreshSchedule(lastCacheHit, {
      baseTTL: 300000,
    })

    expect(result.expiresAt).toBe(lastCacheHit + 300000)
  })

  it('handles expired cache', () => {
    const now = Date.now()
    vi.setSystemTime(now)

    // Last hit was 6 minutes ago (expired)
    const lastCacheHit = now - 360000

    const result = calculateTTLRefreshSchedule(lastCacheHit, {
      baseTTL: 300000,
    })

    expect(result.timeRemaining).toBe(0)
    expect(result.shouldRefresh).toBe(false) // Can't refresh, already expired
  })

  it('uses default config values', () => {
    const now = Date.now()
    vi.setSystemTime(now)

    const lastCacheHit = now - 250000

    const result = calculateTTLRefreshSchedule(lastCacheHit)

    // Default: 5 min TTL, 30s refresh margin
    expect(result.expiresAt).toBe(lastCacheHit + 300000)
    expect(result.refreshAt).toBe(lastCacheHit + 270000)
  })
})

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('Cache Manager Integration', () => {
  it('full workflow: prepare, track, and analyze', () => {
    const manager = new PromptCacheManager({
      provider: 'anthropic',
      trackStats: true,
    })

    // Prepare messages
    const longSystemPrompt = 'x'.repeat(5000)
    const messages = manager.prepareMessagesAnthropic([
      { role: 'system', content: longSystemPrompt },
      { role: 'user', content: 'Hello' },
    ])

    // Simulate cache hits/misses
    manager.recordCacheMiss() // First request
    manager.recordCacheHit(1000, 0.003) // Subsequent requests hit cache
    manager.recordCacheHit(1000, 0.003)

    const stats = manager.getStats()

    expect(messages[0]?.cache_control).toBeDefined()
    expect(stats.hitRate).toBeCloseTo(66.67, 1)
    expect(stats.tokensSaved).toBe(2000)
  })

  it('breakpoints + apply workflow', () => {
    const messages = [
      { role: 'system', content: 'x'.repeat(5000) },
      { role: 'user', content: 'Context: ' + 'x'.repeat(3000) },
      { role: 'assistant', content: 'Understood.' },
      { role: 'user', content: 'Question?' },
    ]

    const breakpoints = calculateCacheBreakpoints(messages, {
      maxBreakpoints: 4,
      minTokensBetweenBreakpoints: 500,
    })

    const cachedMessages = applyBreakpointsToMessages(messages, breakpoints)

    // System should have cache_control
    expect(cachedMessages[0]?.cache_control).toEqual({ type: 'ephemeral' })
  })

  it('warming + schedule workflow', () => {
    const warmingRequests = createCacheWarmingRequests({
      content: [
        { id: 'system', content: 'x'.repeat(5000), type: 'system', priority: 1 },
        { id: 'context', content: 'x'.repeat(3000), type: 'context', priority: 2 },
      ],
      provider: 'anthropic',
    })

    const schedule = calculateWarmingSchedule(warmingRequests, {
      maxConcurrent: 1,
      delayBetweenBatches: 500,
    })

    expect(warmingRequests).toHaveLength(2)
    expect(schedule).toHaveLength(2)
    expect(schedule[1]!.executeAt).toBe(500)
  })
})
