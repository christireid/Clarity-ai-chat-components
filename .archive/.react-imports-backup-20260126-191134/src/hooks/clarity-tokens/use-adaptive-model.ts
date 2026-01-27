'use client'

import * as React from 'react'

// =============================================================================
// Types
// =============================================================================

export type Provider = 'openai' | 'anthropic' | 'custom'

export interface LLMRequest {
  id: string
  provider: Provider
  model: string
  messages: Array<{ role: string; content: string }>
  temperature?: number
  maxOutputTokens?: number
  metadata?: Record<string, unknown>
}

export interface RouteResult {
  provider: Provider
  model: string
}

export type RoutingRule = (req: LLMRequest) => Partial<RouteResult> | null

export interface UseAdaptiveModelConfig {
  /** Array of routing rules (first match wins) */
  rules: RoutingRule[]
  /** Default route if no rules match */
  defaultRoute: RouteResult
  /** Token counter function for size-based routing */
  countTokens?: (messages: Array<{ content: string }>) => number
  /** Enable logging of routing decisions */
  enableLogging?: boolean
}

export interface RoutingDecision {
  originalModel: string
  originalProvider: Provider
  routedModel: string
  routedProvider: Provider
  ruleIndex: number | null
  reason: string
  timestamp: Date
}

export interface UseAdaptiveModelReturn {
  /** Route a request to the optimal model/provider */
  route: (req: LLMRequest) => LLMRequest
  /** Route and get decision metadata */
  routeWithDecision: (req: LLMRequest) => {
    request: LLMRequest
    decision: RoutingDecision
  }
  /** Get routing history */
  history: RoutingDecision[]
  /** Add a rule dynamically */
  addRule: (rule: RoutingRule, position?: number) => void
  /** Remove a rule by index */
  removeRule: (index: number) => void
  /** Clear routing history */
  clearHistory: () => void
  /** Current configuration */
  config: UseAdaptiveModelConfig
}

// =============================================================================
// Pre-built Routing Rules
// =============================================================================

/**
 * Route based on input size (token count)
 */
export function createSizeBasedRule(
  thresholds: Array<{ maxTokens: number; route: Partial<RouteResult> }>,
  countTokens: (messages: Array<{ content: string }>) => number
): RoutingRule {
  return (req) => {
    const tokens = countTokens(req.messages)
    for (const threshold of thresholds) {
      if (tokens <= threshold.maxTokens) {
        return threshold.route
      }
    }
    return null
  }
}

/**
 * Route based on message content patterns
 */
export function createContentBasedRule(
  patterns: Array<{ pattern: RegExp; route: Partial<RouteResult> }>
): RoutingRule {
  return (req) => {
    const allContent = req.messages.map((m) => m.content).join(' ')
    for (const { pattern, route } of patterns) {
      if (pattern.test(allContent)) {
        return route
      }
    }
    return null
  }
}

/**
 * Route based on user tier (from metadata)
 */
export function createTierBasedRule(
  tiers: Record<string, Partial<RouteResult>>
): RoutingRule {
  return (req) => {
    const tier = req.metadata?.userTier as string | undefined
    if (tier && tiers[tier]) {
      return tiers[tier]
    }
    return null
  }
}

/**
 * Route based on request category/intent (from metadata)
 */
export function createIntentBasedRule(
  intents: Record<string, Partial<RouteResult>>
): RoutingRule {
  return (req) => {
    const intent = req.metadata?.intent as string | undefined
    if (intent && intents[intent]) {
      return intents[intent]
    }
    return null
  }
}

/**
 * Route based on cost optimization (prefer cheaper models when appropriate)
 */
export function createCostOptimizedRule(
  cheapModel: RouteResult,
  expensiveModel: RouteResult,
  options: {
    maxTokensForCheap?: number
    simplePatterns?: RegExp[]
    countTokens: (messages: Array<{ content: string }>) => number
  }
): RoutingRule {
  return (req) => {
    const tokens = options.countTokens(req.messages)
    const content = req.messages.map((m) => m.content).join(' ')

    // Use cheap model for short, simple requests
    const isShort = tokens < (options.maxTokensForCheap ?? 1000)
    const isSimple =
      options.simplePatterns?.some((p) => p.test(content)) ?? false

    if (isShort || isSimple) {
      return cheapModel
    }

    return expensiveModel
  }
}

/**
 * Route based on latency requirements (from metadata)
 */
export function createLatencyBasedRule(
  fastModel: RouteResult,
  standardModel: RouteResult
): RoutingRule {
  return (req) => {
    const requiresFast = req.metadata?.lowLatency === true
    if (requiresFast) {
      return fastModel
    }
    return standardModel
  }
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useAdaptiveModel - Routes requests to optimal models/providers
 *
 * Applies routing rules in order to determine the best model/provider
 * combination for each request based on cost, latency, input size, or custom criteria.
 *
 * @example
 * ```tsx
 * const router = useAdaptiveModel({
 *   rules: [
 *     // Use fast model for short requests
 *     createSizeBasedRule(
 *       [{ maxTokens: 500, route: { model: 'gpt-4o-mini' } }],
 *       countTokens
 *     ),
 *     // Use Claude for coding tasks
 *     createContentBasedRule([
 *       { pattern: /code|function|class|implement/i, route: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' } }
 *     ]),
 *     // Use premium model for premium users
 *     createTierBasedRule({
 *       premium: { model: 'gpt-4.1' },
 *       enterprise: { model: 'gpt-4.1', provider: 'openai' }
 *     })
 *   ],
 *   defaultRoute: { provider: 'openai', model: 'gpt-4o' }
 * })
 *
 * // Route the request
 * const routedRequest = router.route(request)
 * const response = await sendToLLM(routedRequest)
 * ```
 */
export function useAdaptiveModel(
  config: UseAdaptiveModelConfig
): UseAdaptiveModelReturn {
  const { rules: initialRules, defaultRoute, enableLogging = false } = config

  // State
  const [rules, setRules] = React.useState<RoutingRule[]>(initialRules)
  const [history, setHistory] = React.useState<RoutingDecision[]>([])

  /**
   * Route with decision metadata
   */
  const routeWithDecision = React.useCallback(
    (req: LLMRequest): { request: LLMRequest; decision: RoutingDecision } => {
      const originalModel = req.model
      const originalProvider = req.provider

      // Try each rule in order
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i]
        const result = rule(req)

        if (result) {
          const routedRequest: LLMRequest = {
            ...req,
            provider: result.provider ?? req.provider,
            model: result.model ?? req.model,
          }

          const decision: RoutingDecision = {
            originalModel,
            originalProvider,
            routedModel: routedRequest.model,
            routedProvider: routedRequest.provider,
            ruleIndex: i,
            reason: `Rule ${i} matched`,
            timestamp: new Date(),
          }

          if (process.env['NODE_ENV'] === 'development') {
            if (enableLogging) {
              console.log(
                `[AdaptiveModel] Routed: ${originalProvider}/${originalModel} -> ${routedRequest.provider}/${routedRequest.model} (Rule ${i})`
              )
            }
          }

          setHistory((prev) => [...prev.slice(-99), decision])

          return { request: routedRequest, decision }
        }
      }

      // Apply default route
      const routedRequest: LLMRequest = {
        ...req,
        provider: defaultRoute.provider,
        model: defaultRoute.model,
      }

      const decision: RoutingDecision = {
        originalModel,
        originalProvider,
        routedModel: routedRequest.model,
        routedProvider: routedRequest.provider,
        ruleIndex: null,
        reason: 'Default route applied',
        timestamp: new Date(),
      }

      if (process.env['NODE_ENV'] === 'development') {
        if (enableLogging) {
          console.log(
            `[AdaptiveModel] Routed: ${originalProvider}/${originalModel} -> ${routedRequest.provider}/${routedRequest.model} (Default)`
          )
        }
      }

      setHistory((prev) => [...prev.slice(-99), decision])

      return { request: routedRequest, decision }
    },
    [rules, defaultRoute, enableLogging]
  )

  /**
   * Route request (simplified)
   */
  const route = React.useCallback(
    (req: LLMRequest): LLMRequest => {
      return routeWithDecision(req).request
    },
    [routeWithDecision]
  )

  /**
   * Add a rule dynamically
   */
  const addRule = React.useCallback((rule: RoutingRule, position?: number) => {
    setRules((prev) => {
      if (position !== undefined && position >= 0 && position <= prev.length) {
        return [...prev.slice(0, position), rule, ...prev.slice(position)]
      }
      return [...prev, rule]
    })
  }, [])

  /**
   * Remove a rule by index
   */
  const removeRule = React.useCallback((index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index))
  }, [])

  /**
   * Clear routing history
   */
  const clearHistory = React.useCallback(() => {
    setHistory([])
  }, [])

  return {
    route,
    routeWithDecision,
    history,
    addRule,
    removeRule,
    clearHistory,
    config,
  }
}
