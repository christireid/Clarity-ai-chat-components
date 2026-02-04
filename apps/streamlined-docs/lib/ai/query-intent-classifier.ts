/**
 * Query Intent Classifier
 *
 * Advanced intent detection for documentation queries using pattern matching,
 * semantic analysis, and multi-intent handling.
 *
 * Supports:
 * - Primary and secondary intent detection
 * - Context-aware classification
 * - Technical terminology extraction
 * - Intent confidence scoring
 *
 * @module query-intent-classifier
 * @version 1.0.0
 */

// ============================================================================
// Intent Types
// ============================================================================

export enum QueryIntent {
  // Information Seeking
  DEFINITION = 'definition', // "What is X?"
  EXPLANATION = 'explanation', // "How does X work?"
  EXAMPLE = 'example', // "Show me an example"
  TUTORIAL = 'tutorial', // "How to do X?"
  COMPARISON = 'comparison', // "X vs Y"
  RECOMMENDATION = 'recommendation', // "Should I use X?"

  // Problem Solving
  TROUBLESHOOTING = 'troubleshooting', // "X is not working"
  DEBUGGING = 'debugging', // "Why does X fail?"
  ERROR_RESOLUTION = 'error_resolution', // "How to fix error X?"

  // Implementation
  INTEGRATION = 'integration', // "How to integrate X?"
  CONFIGURATION = 'configuration', // "How to configure X?"
  CUSTOMIZATION = 'customization', // "How to customize X?"
  MIGRATION = 'migration', // "How to migrate from X to Y?"

  // Discovery
  FEATURE_DISCOVERY = 'feature_discovery', // "What can X do?"
  API_LOOKUP = 'api_lookup', // "What props does X have?"
  BEST_PRACTICES = 'best_practices', // "Best way to do X?"
  ALTERNATIVES = 'alternatives', // "Alternatives to X?"

  // Conversational
  CLARIFICATION = 'clarification', // "Can you explain more?"
  FOLLOWUP = 'followup', // "What about Y?"
  GREETING = 'greeting', // "Hello", "Thanks"
  OTHER = 'other', // Fallback
}

/**
 * Domain-specific entities in the query
 */
export enum QueryEntity {
  COMPONENT = 'component',
  HOOK = 'hook',
  UTILITY = 'utility',
  PROP = 'prop',
  API = 'api',
  PATTERN = 'pattern',
  CONCEPT = 'concept',
  ERROR = 'error',
  VERSION = 'version',
}

/**
 * User skill level inferred from query
 */
export enum SkillLevel {
  BEGINNER = 'beginner', // Uses simple terms, asks basic questions
  INTERMEDIATE = 'intermediate', // Understands basics, asks about usage
  ADVANCED = 'advanced', // Uses technical terms, asks about internals
}

// ============================================================================
// Interfaces
// ============================================================================

export interface ClassifiedIntent {
  /** Primary intent of the query */
  primary: QueryIntent
  /** Secondary intents (e.g., explanation + example) */
  secondary: QueryIntent[]
  /** Confidence score for primary intent (0-1) */
  confidence: number
  /** Entities mentioned in the query */
  entities: {
    type: QueryEntity
    value: string
    /** Position in query for context */
    position: number
  }[]
  /** Inferred user skill level */
  skillLevel: SkillLevel
  /** Technical terms found in query */
  technicalTerms: string[]
  /** Query focus (what the user wants to know about) */
  focus: string
  /** Query type classification */
  queryType: 'open' | 'closed' | 'procedural' | 'conceptual'
}

// ============================================================================
// Pattern Definitions
// ============================================================================

/**
 * Intent detection patterns with confidence weights
 */
const INTENT_PATTERNS: {
  intent: QueryIntent
  patterns: RegExp[]
  weight: number
}[] = [
  // Definition intents
  {
    intent: QueryIntent.DEFINITION,
    patterns: [
      /^what (?:is|are|does|do)\s+(?:a |an |the )?(\w+)/i,
      /^define\s+(\w+)/i,
      /^(?:can you )?explain what\s+(\w+)/i,
      /^meaning of\s+(\w+)/i,
    ],
    weight: 0.95,
  },

  // Explanation intents
  {
    intent: QueryIntent.EXPLANATION,
    patterns: [
      /(?:how does|how do|how will)\s+(.+?)\s+(?:work|function|operate)/i,
      /explain (?:how|why)\s+(.+)/i,
      /(?:can you )?walk me through\s+(.+)/i,
      /what happens when\s+(.+)/i,
      /^why\s+(?:does|do|is|are)\s+(.+)/i,
    ],
    weight: 0.9,
  },

  // Example intents
  {
    intent: QueryIntent.EXAMPLE,
    patterns: [
      /(?:show|give|provide)(?: me)?(?: an?)? example/i,
      /(?:can i see|could you show)\s+(?:an? )?example/i,
      /(?:example|sample) (?:code|usage|of)/i,
      /how (?:to|do i) use\s+(.+)/i,
      /^usage of\s+(.+)/i,
    ],
    weight: 0.95,
  },

  // Tutorial intents
  {
    intent: QueryIntent.TUTORIAL,
    patterns: [
      /^how (?:to|can i|do i)\s+(.+)/i,
      /(?:guide|tutorial|walkthrough) (?:for|on|to)\s+(.+)/i,
      /(?:step by step|steps to)\s+(.+)/i,
      /getting started with\s+(.+)/i,
    ],
    weight: 0.9,
  },

  // Comparison intents
  {
    intent: QueryIntent.COMPARISON,
    patterns: [
      /(?:difference|compare|comparison) (?:between|of)\s+(.+?)\s+(?:and|vs|versus)\s+(.+)/i,
      /(.+?)\s+(?:vs|versus)\s+(.+)/i,
      /(?:which is better|should i use)\s+(.+?)\s+or\s+(.+)/i,
      /what(?:'s| is) the (?:difference|distinction) between\s+(.+)/i,
    ],
    weight: 0.95,
  },

  // Recommendation intents
  {
    intent: QueryIntent.RECOMMENDATION,
    patterns: [
      /(?:should i|can i|is it (?:ok|okay|good) to)\s+(.+)/i,
      /(?:recommend|suggestion|advice) (?:for|on)\s+(.+)/i,
      /what(?:'s| is) the best (?:way|approach|method) (?:to|for)\s+(.+)/i,
      /when (?:should|to) (?:i |we )?(?:use|apply)\s+(.+)/i,
    ],
    weight: 0.85,
  },

  // Troubleshooting intents
  {
    intent: QueryIntent.TROUBLESHOOTING,
    patterns: [
      /(?:not working|doesn't work|won't work|isn't working)/i,
      /(?:can't|cannot|unable to)\s+(.+)/i,
      /(?:having (?:trouble|issues?|problems?))\s+(?:with\s+)?(.+)/i,
      /(.+)\s+(?:broken|failing|fails)/i,
    ],
    weight: 0.95,
  },

  // Debugging intents
  {
    intent: QueryIntent.DEBUGGING,
    patterns: [
      /why (?:is|does|do)\s+(.+?)\s+(?:not|n't)\s+(\w+)/i,
      /(?:debug|debugging)\s+(.+)/i,
      /what(?:'s| is) (?:wrong|causing|breaking)\s+(.+)/i,
    ],
    weight: 0.9,
  },

  // Error resolution intents
  {
    intent: QueryIntent.ERROR_RESOLUTION,
    patterns: [
      /(?:fix|solve|resolve)\s+(?:the\s+)?(?:error|issue|problem)/i,
      /(?:error|exception|warning):\s+(.+)/i,
      /(?:getting|receiving|seeing)\s+(?:an? )?error/i,
      /how to fix\s+(.+)/i,
    ],
    weight: 0.95,
  },

  // Integration intents
  {
    intent: QueryIntent.INTEGRATION,
    patterns: [
      /(?:integrate|integrating|integration) (?:with\s+)?(.+)/i,
      /(?:connect|connecting)\s+(.+?)\s+(?:to|with)\s+(.+)/i,
      /how to (?:add|include)\s+(.+?)\s+(?:in|to|with)\s+(.+)/i,
    ],
    weight: 0.9,
  },

  // Configuration intents
  {
    intent: QueryIntent.CONFIGURATION,
    patterns: [
      /(?:configure|configuration|config|setup|set up)\s+(.+)/i,
      /how to (?:enable|disable|change)\s+(.+)/i,
      /(?:settings|options) (?:for\s+)?(.+)/i,
    ],
    weight: 0.9,
  },

  // Customization intents
  {
    intent: QueryIntent.CUSTOMIZATION,
    patterns: [
      /(?:customize|customization|custom)\s+(.+)/i,
      /how to (?:change|modify|alter)\s+(.+)/i,
      /(?:styling|theming|appearance) (?:of\s+)?(.+)/i,
    ],
    weight: 0.85,
  },

  // Migration intents
  {
    intent: QueryIntent.MIGRATION,
    patterns: [
      /(?:migrate|migration|migrating) (?:from\s+)?(.+?)\s+(?:to|->)\s+(.+)/i,
      /(?:upgrade|upgrading) (?:from\s+)?(.+?)\s+(?:to\s+)?(.+)/i,
      /moving from\s+(.+?)\s+to\s+(.+)/i,
    ],
    weight: 0.95,
  },

  // Feature discovery intents
  {
    intent: QueryIntent.FEATURE_DISCOVERY,
    patterns: [
      /what (?:can|does)\s+(.+?)\s+(?:do|support|have|offer)/i,
      /(?:features|capabilities) (?:of\s+)?(.+)/i,
      /(?:does|can)\s+(.+?)\s+(?:support|have|include)\s+(.+)/i,
    ],
    weight: 0.85,
  },

  // API lookup intents
  {
    intent: QueryIntent.API_LOOKUP,
    patterns: [
      /(?:props|properties|parameters|arguments) (?:of|for)\s+(.+)/i,
      /what (?:props|parameters|arguments) (?:does\s+)?(.+?)\s+(?:accept|take|use)/i,
      /(?:api|interface) (?:of|for)\s+(.+)/i,
      /(?:type|types) (?:of|for)\s+(.+)/i,
    ],
    weight: 0.95,
  },

  // Best practices intents
  {
    intent: QueryIntent.BEST_PRACTICES,
    patterns: [
      /best (?:practice|way|approach|method)/i,
      /(?:recommended|optimal|preferred) (?:way|approach|method)/i,
      /what(?:'s| is) the (?:right|correct|proper) way/i,
    ],
    weight: 0.9,
  },

  // Alternatives intents
  {
    intent: QueryIntent.ALTERNATIVES,
    patterns: [
      /(?:alternative|other option)s? (?:to|for)\s+(.+)/i,
      /instead of\s+(.+)/i,
      /(?:similar|equivalent) to\s+(.+)/i,
    ],
    weight: 0.85,
  },

  // Clarification intents
  {
    intent: QueryIntent.CLARIFICATION,
    patterns: [
      /(?:can you )?(?:clarify|elaborate|explain (?:more|further))/i,
      /what do you mean by\s+(.+)/i,
      /(?:i don't understand|confused about)\s+(.+)/i,
    ],
    weight: 0.9,
  },

  // Follow-up intents
  {
    intent: QueryIntent.FOLLOWUP,
    patterns: [
      /^(?:what|how) about\s+(.+)/i,
      /^(?:and|also)\s+(.+)/i,
      /(?:tell me more|more (?:info|information)) about\s+(.+)/i,
    ],
    weight: 0.85,
  },

  // Greeting intents
  {
    intent: QueryIntent.GREETING,
    patterns: [
      /^(?:hi|hello|hey|greetings)(?:\s|$|!)/i,
      /^(?:thanks|thank you|ty)(?:\s|$|!)/i,
      /^(?:ok|okay|cool|great)(?:\s|$|!)/i,
    ],
    weight: 1.0,
  },
]

/**
 * Entity extraction patterns
 */
const ENTITY_PATTERNS: {
  type: QueryEntity
  patterns: RegExp[]
}[] = [
  {
    type: QueryEntity.COMPONENT,
    patterns: [
      /\b([A-Z][a-zA-Z]+(?:Window|Button|Input|Message|Chat|Dialog|Modal|Card|List))\b/g,
      /\b(ChatWindow|StreamingMessage|MessageList|ChatInput)\b/gi,
    ],
  },
  {
    type: QueryEntity.HOOK,
    patterns: [/\b(use[A-Z][a-zA-Z]+)\b/g, /\b(useState|useEffect|useChat|useMessages)\b/gi],
  },
  {
    type: QueryEntity.PROP,
    patterns: [
      /\b(on[A-Z][a-zA-Z]+)\b/g,
      /\b([a-z]+(?:Prop|Props))\b/gi,
      /\b(className|style|disabled|loading)\b/gi,
    ],
  },
  {
    type: QueryEntity.API,
    patterns: [/\bAPI\b/gi, /\bendpoint\b/gi, /\b(\/api\/[a-z-]+)\b/gi],
  },
  {
    type: QueryEntity.ERROR,
    patterns: [
      /\b(Error|Exception|Warning)\b/g,
      /\b([A-Z][a-zA-Z]*(?:Error|Exception))\b/g,
      /"([^"]+(?:error|failed|invalid)[^"]*)"/gi,
    ],
  },
  {
    type: QueryEntity.VERSION,
    patterns: [/\bv?\d+\.\d+(?:\.\d+)?(?:-[a-z]+)?\b/gi, /\b(latest|stable|beta|alpha)\b/gi],
  },
]

/**
 * Technical terminology patterns
 */
const TECHNICAL_TERMS_PATTERNS = [
  // React concepts
  /\b(component|hook|prop|state|effect|context|provider|portal)\b/gi,
  // TypeScript concepts
  /\b(type|interface|generic|union|intersection|tuple)\b/gi,
  // Async concepts
  /\b(async|await|promise|callback|streaming|websocket)\b/gi,
  // Performance concepts
  /\b(memoization|virtualization|lazy loading|code splitting|bundle)\b/gi,
  // AI/LLM concepts
  /\b(llm|gpt|claude|prompt|token|embedding|vector|rag)\b/gi,
]

/**
 * Skill level indicators
 */
const SKILL_INDICATORS = {
  beginner: [
    /\b(how to|getting started|basic|simple|easy|beginner)\b/gi,
    /\b(what is|what are|explain|tutorial|guide)\b/gi,
    /\b(help|confused|don't understand)\b/gi,
  ],
  intermediate: [
    /\b(implement|integrate|configure|customize|best practice)\b/gi,
    /\b(example|usage|how do i|should i)\b/gi,
  ],
  advanced: [
    /\b(optimize|performance|internals|architecture|pattern)\b/gi,
    /\b(trade-off|alternative|underlying|mechanism)\b/gi,
    /\b(edge case|race condition|memory leak)\b/gi,
  ],
}

// ============================================================================
// Classification Functions
// ============================================================================

/**
 * Classify query intent with confidence scoring
 */
export function classifyQueryIntent(
  query: string,
  previousQueries: string[] = []
): ClassifiedIntent {
  const normalizedQuery = query.trim()

  // Detect intents with confidence scores
  const intentScores = detectIntents(normalizedQuery)

  // Extract entities
  const entities = extractEntities(normalizedQuery)

  // Determine skill level
  const skillLevel = inferSkillLevel(normalizedQuery)

  // Extract technical terms
  const technicalTerms = extractTechnicalTerms(normalizedQuery)

  // Determine query focus
  const focus = extractQueryFocus(normalizedQuery, intentScores.primary)

  // Classify query type
  const queryType = classifyQueryType(normalizedQuery, intentScores.primary)

  // Adjust for conversational context
  if (previousQueries.length > 0) {
    adjustForContext(intentScores, previousQueries)
  }

  return {
    primary: intentScores.primary,
    secondary: intentScores.secondary,
    confidence: intentScores.confidence,
    entities,
    skillLevel,
    technicalTerms,
    focus,
    queryType,
  }
}

/**
 * Detect all matching intents and rank by confidence
 */
function detectIntents(query: string): {
  primary: QueryIntent
  secondary: QueryIntent[]
  confidence: number
} {
  const scores = new Map<QueryIntent, number>()

  // Check each intent pattern
  for (const { intent, patterns, weight } of INTENT_PATTERNS) {
    let matchCount = 0
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        matchCount++
      }
    }

    if (matchCount > 0) {
      // Score = weight * (matches / total patterns)
      const score = weight * (matchCount / patterns.length)
      scores.set(intent, Math.min(score, 1.0))
    }
  }

  // No matches - default to OTHER
  if (scores.size === 0) {
    return {
      primary: QueryIntent.OTHER,
      secondary: [],
      confidence: 0.3,
    }
  }

  // Sort by score
  const sorted = Array.from(scores.entries()).sort((a, b) => b[1] - a[1])

  const primary = sorted[0][0]
  const confidence = sorted[0][1]

  // Secondary intents (score > 0.5 but not primary)
  const secondary = sorted
    .slice(1)
    .filter(([_, score]) => score > 0.5)
    .map(([intent]) => intent)

  return { primary, secondary, confidence }
}

/**
 * Extract entities from query
 */
function extractEntities(query: string): ClassifiedIntent['entities'] {
  const entities: ClassifiedIntent['entities'] = []

  for (const { type, patterns } of ENTITY_PATTERNS) {
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(query)) !== null) {
        entities.push({
          type,
          value: match[1] || match[0],
          position: match.index,
        })
      }
    }
  }

  // Deduplicate entities (prefer earlier occurrences)
  const seen = new Set<string>()
  return entities.filter((entity) => {
    const key = `${entity.type}:${entity.value.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Infer user skill level from query
 */
function inferSkillLevel(query: string): SkillLevel {
  const scores = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  }

  for (const [level, patterns] of Object.entries(SKILL_INDICATORS)) {
    for (const pattern of patterns) {
      const matches = query.match(pattern)
      if (matches) {
        scores[level as SkillLevel] += matches.length
      }
    }
  }

  // Determine highest score
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) return SkillLevel.INTERMEDIATE // Default

  if (scores.advanced === maxScore) return SkillLevel.ADVANCED
  if (scores.beginner === maxScore) return SkillLevel.BEGINNER
  return SkillLevel.INTERMEDIATE
}

/**
 * Extract technical terms from query
 */
function extractTechnicalTerms(query: string): string[] {
  const terms = new Set<string>()

  for (const pattern of TECHNICAL_TERMS_PATTERNS) {
    const matches = query.matchAll(pattern)
    for (const match of matches) {
      terms.add(match[0].toLowerCase())
    }
  }

  return Array.from(terms)
}

/**
 * Extract the focus of the query (what the user wants to know about)
 */
function extractQueryFocus(query: string, intent: QueryIntent): string {
  // Remove question words and common phrases
  let focus = query
    .replace(
      /^(?:how|what|when|where|why|who|which|can|could|should|would|is|are|do|does)\s+/i,
      ''
    )
    .replace(/^(?:i|you|we|they)\s+/i, '')
    .replace(/\?+$/g, '')
    .trim()

  // Limit focus to first noun phrase (up to 5 words)
  const words = focus.split(/\s+/)
  if (words.length > 5) {
    focus = words.slice(0, 5).join(' ') + '...'
  }

  return focus || query
}

/**
 * Classify query as open-ended, closed, procedural, or conceptual
 */
function classifyQueryType(
  query: string,
  intent: QueryIntent
): 'open' | 'closed' | 'procedural' | 'conceptual' {
  // Closed questions (yes/no)
  if (
    /^(?:is|are|can|could|should|would|does|do|did|will|has|have)\s+/i.test(query) &&
    !query.includes('how')
  ) {
    return 'closed'
  }

  // Procedural questions (how-to)
  if (
    [
      QueryIntent.TUTORIAL,
      QueryIntent.INTEGRATION,
      QueryIntent.CONFIGURATION,
      QueryIntent.TROUBLESHOOTING,
    ].includes(intent)
  ) {
    return 'procedural'
  }

  // Conceptual questions (understanding)
  if (
    [QueryIntent.DEFINITION, QueryIntent.EXPLANATION, QueryIntent.COMPARISON].includes(intent)
  ) {
    return 'conceptual'
  }

  // Open-ended questions
  return 'open'
}

/**
 * Adjust intent classification based on conversation context
 */
function adjustForContext(
  intentScores: {
    primary: QueryIntent
    secondary: QueryIntent[]
    confidence: number
  },
  previousQueries: string[]
): void {
  const lastQuery = previousQueries[previousQueries.length - 1]
  if (!lastQuery) return

  // If query is very short and follows a detailed question, likely a follow-up
  if (previousQueries[0].split(/\s+/).length < 5 && lastQuery.split(/\s+/).length > 10) {
    if (intentScores.primary === QueryIntent.OTHER) {
      intentScores.primary = QueryIntent.FOLLOWUP
      intentScores.confidence = 0.8
    }
  }

  // If last query was a definition and current is short, likely clarification
  const lastIntent = detectIntents(lastQuery).primary
  if (
    lastIntent === QueryIntent.DEFINITION &&
    previousQueries[0].split(/\s+/).length < 8 &&
    intentScores.confidence < 0.7
  ) {
    intentScores.primary = QueryIntent.CLARIFICATION
    intentScores.confidence = 0.75
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if query is conversational (greeting, acknowledgment, etc.)
 */
export function isConversational(intent: QueryIntent): boolean {
  return [QueryIntent.GREETING, QueryIntent.CLARIFICATION, QueryIntent.FOLLOWUP].includes(intent)
}

/**
 * Check if query requires code examples
 */
export function requiresCodeExample(intent: QueryIntent): boolean {
  return [
    QueryIntent.EXAMPLE,
    QueryIntent.TUTORIAL,
    QueryIntent.INTEGRATION,
    QueryIntent.CONFIGURATION,
    QueryIntent.CUSTOMIZATION,
  ].includes(intent)
}

/**
 * Check if query is problem-solving focused
 */
export function isProblemSolving(intent: QueryIntent): boolean {
  return [
    QueryIntent.TROUBLESHOOTING,
    QueryIntent.DEBUGGING,
    QueryIntent.ERROR_RESOLUTION,
  ].includes(intent)
}

/**
 * Get recommended response structure for intent
 */
export function getRecommendedStructure(
  intent: QueryIntent
): { sections: string[]; style: string } {
  const structures: Record<
    QueryIntent,
    { sections: string[]; style: string }
  > = {
    [QueryIntent.DEFINITION]: {
      sections: ['Definition', 'Key Concepts', 'Related Terms'],
      style: 'concise',
    },
    [QueryIntent.EXPLANATION]: {
      sections: ['Overview', 'How It Works', 'Use Cases', 'Example'],
      style: 'detailed',
    },
    [QueryIntent.EXAMPLE]: {
      sections: ['Code Example', 'Explanation', 'Variations'],
      style: 'code-focused',
    },
    [QueryIntent.TUTORIAL]: {
      sections: ['Prerequisites', 'Step-by-Step Guide', 'Verification', 'Next Steps'],
      style: 'instructional',
    },
    [QueryIntent.COMPARISON]: {
      sections: ['Comparison Table', 'When to Use Each', 'Trade-offs'],
      style: 'comparative',
    },
    [QueryIntent.TROUBLESHOOTING]: {
      sections: ['Problem', 'Diagnosis', 'Solution', 'Prevention'],
      style: 'problem-solving',
    },
    [QueryIntent.API_LOOKUP]: {
      sections: ['Parameters', 'Return Value', 'Usage Example', 'Related APIs'],
      style: 'reference',
    },
    [QueryIntent.BEST_PRACTICES]: {
      sections: ['Recommendation', 'Why It Matters', 'Example', 'Anti-patterns'],
      style: 'advisory',
    },
    // ... defaults for other intents
    [QueryIntent.DEBUGGING]: {
      sections: ['Root Cause', 'Solution', 'Example'],
      style: 'problem-solving',
    },
    [QueryIntent.ERROR_RESOLUTION]: {
      sections: ['Error Analysis', 'Fix', 'Verification'],
      style: 'problem-solving',
    },
    [QueryIntent.INTEGRATION]: {
      sections: ['Setup', 'Integration Steps', 'Testing'],
      style: 'instructional',
    },
    [QueryIntent.CONFIGURATION]: {
      sections: ['Options', 'Configuration Example', 'Validation'],
      style: 'reference',
    },
    [QueryIntent.CUSTOMIZATION]: {
      sections: ['Customization Options', 'Example', 'Best Practices'],
      style: 'instructional',
    },
    [QueryIntent.MIGRATION]: {
      sections: ['Changes', 'Migration Steps', 'Breaking Changes', 'Testing'],
      style: 'instructional',
    },
    [QueryIntent.FEATURE_DISCOVERY]: {
      sections: ['Features', 'Capabilities', 'Limitations'],
      style: 'informational',
    },
    [QueryIntent.RECOMMENDATION]: {
      sections: ['Analysis', 'Recommendation', 'Reasoning', 'Alternatives'],
      style: 'advisory',
    },
    [QueryIntent.ALTERNATIVES]: {
      sections: ['Options', 'Comparison', 'Recommendations'],
      style: 'comparative',
    },
    [QueryIntent.CLARIFICATION]: {
      sections: ['Clarification', 'Example'],
      style: 'concise',
    },
    [QueryIntent.FOLLOWUP]: {
      sections: ['Additional Information', 'Example'],
      style: 'conversational',
    },
    [QueryIntent.GREETING]: {
      sections: ['Response'],
      style: 'conversational',
    },
    [QueryIntent.OTHER]: {
      sections: ['Response'],
      style: 'conversational',
    },
  }

  return (
    structures[intent] || {
      sections: ['Response'],
      style: 'conversational',
    }
  )
}
