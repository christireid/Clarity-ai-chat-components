/**
 * Query Expansion Module
 *
 * Implements advanced query expansion techniques to improve retrieval:
 * - Synonym expansion
 * - Domain-specific term expansion
 * - Acronym expansion
 * - Related term suggestion
 * - Query reformulation
 * - Multi-perspective generation
 *
 * Based on modern RAG best practices (2025).
 *
 * @module query-expansion
 * @version 1.0.0
 */

import { QueryIntent, ClassifiedIntent } from './query-intent-classifier'

// ============================================================================
// Types
// ============================================================================

export interface ExpandedQuery {
  /** Original query */
  original: string
  /** Expanded query with synonyms */
  expanded: string
  /** Alternative phrasings */
  alternatives: string[]
  /** Related search terms */
  relatedTerms: string[]
  /** Expanded acronyms */
  acronyms: Map<string, string>
  /** Technical term mappings */
  technicalTerms: Map<string, string[]>
  /** Query reformulations for different search strategies */
  reformulations: {
    keyword: string // For keyword search
    semantic: string // For semantic search
    hybrid: string // Combined approach
  }
}

export interface ExpansionOptions {
  /** Include synonyms */
  includeSynonyms?: boolean
  /** Include related terms */
  includeRelatedTerms?: boolean
  /** Include alternative phrasings */
  includeAlternatives?: boolean
  /** Expand acronyms */
  expandAcronyms?: boolean
  /** Max number of alternatives to generate */
  maxAlternatives?: number
  /** Domain context for expansion */
  domain?: 'react' | 'typescript' | 'ai' | 'general'
}

// ============================================================================
// Domain-Specific Knowledge Bases
// ============================================================================

/**
 * Synonym mappings for common terms
 */
const SYNONYMS: Record<string, string[]> = {
  // Component terms
  component: ['widget', 'element', 'control', 'ui component'],
  button: ['btn', 'action button', 'clickable'],
  input: ['textbox', 'field', 'form field', 'text input'],
  window: ['dialog', 'modal', 'panel'],
  message: ['msg', 'text', 'content', 'chat message'],

  // Action terms
  send: ['submit', 'post', 'transmit', 'dispatch'],
  receive: ['get', 'fetch', 'retrieve', 'obtain'],
  display: ['show', 'render', 'present', 'visualize'],
  hide: ['conceal', 'remove', 'close'],
  customize: ['modify', 'personalize', 'configure', 'tailor', 'adapt'],
  style: ['design', 'theme', 'appearance', 'look and feel'],

  // State terms
  loading: ['pending', 'processing', 'waiting', 'in progress'],
  error: ['failure', 'exception', 'issue', 'problem'],
  success: ['complete', 'done', 'finished', 'successful'],

  // Concept terms
  streaming: ['real-time', 'live', 'progressive', 'incremental'],
  async: ['asynchronous', 'non-blocking', 'concurrent'],
  optimization: ['performance', 'efficiency', 'speed up', 'improve'],
  memory: ['storage', 'state', 'history', 'persistence'],

  // AI/LLM terms
  prompt: ['instruction', 'query', 'input', 'request'],
  token: ['word piece', 'unit', 'segment'],
  embedding: ['vector', 'representation', 'encoding'],
  llm: ['language model', 'ai model', 'gpt', 'claude'],
  rag: ['retrieval augmented generation', 'retrieval', 'context injection'],
}

/**
 * Acronym expansions
 */
const ACRONYMS: Record<string, string> = {
  // React/Frontend
  jsx: 'JavaScript XML',
  tsx: 'TypeScript XML',
  ssr: 'Server-Side Rendering',
  csr: 'Client-Side Rendering',
  swr: 'Stale-While-Revalidate',
  ui: 'User Interface',
  ux: 'User Experience',
  dom: 'Document Object Model',

  // AI/ML
  llm: 'Large Language Model',
  nlp: 'Natural Language Processing',
  rag: 'Retrieval-Augmented Generation',
  api: 'Application Programming Interface',
  gpt: 'Generative Pre-trained Transformer',
  ai: 'Artificial Intelligence',
  ml: 'Machine Learning',

  // Development
  sdk: 'Software Development Kit',
  cli: 'Command Line Interface',
  ide: 'Integrated Development Environment',
  ci: 'Continuous Integration',
  cd: 'Continuous Deployment',
  jwt: 'JSON Web Token',
}

/**
 * Related terms that often appear together
 */
const RELATED_TERMS: Record<string, string[]> = {
  // Component ecosystems
  chat: ['message', 'conversation', 'dialog', 'user', 'assistant', 'history'],
  streaming: ['chunk', 'token', 'real-time', 'progressive', 'websocket', 'sse'],
  hook: ['state', 'effect', 'callback', 'memo', 'ref', 'context'],
  component: ['props', 'children', 'render', 'lifecycle', 'state'],

  // Error handling
  error: ['exception', 'try-catch', 'fallback', 'boundary', 'recovery'],
  loading: ['spinner', 'skeleton', 'placeholder', 'suspense'],

  // AI concepts
  prompt: ['completion', 'response', 'token', 'temperature', 'model'],
  token: ['cost', 'limit', 'budget', 'usage', 'optimization'],
  embedding: ['vector', 'similarity', 'search', 'semantic', 'cosine'],

  // Performance
  optimization: ['performance', 'bundle', 'lazy', 'memoization', 'cache'],
  memory: ['leak', 'usage', 'garbage collection', 'reference', 'cleanup'],
}

/**
 * Technical term mappings (formal <-> informal)
 */
const TECHNICAL_MAPPINGS: Record<string, string[]> = {
  // Formal -> Informal variations
  'error boundary': ['error handler', 'error catcher', 'fallback component'],
  'lazy loading': ['on-demand loading', 'code splitting', 'dynamic import'],
  'server-side rendering': ['ssr', 'pre-rendering', 'server rendering'],
  'client-side rendering': ['csr', 'browser rendering', 'client rendering'],
  'memoization': ['caching', 'memorization', 'optimization'],
  'virtualization': ['virtual scrolling', 'windowing', 'viewport rendering'],

  // Component variations
  'chat window': ['chat interface', 'chat component', 'chat ui', 'message window'],
  'message list': ['chat history', 'message feed', 'conversation view'],
  'text input': ['input field', 'text box', 'message input', 'chat input'],
  'send button': ['submit button', 'action button', 'post button'],

  // Hook variations
  useChat: ['chat hook', 'conversation hook', 'messaging hook'],
  useState: ['state hook', 'state management'],
  useEffect: ['effect hook', 'side effect', 'lifecycle hook'],
}

/**
 * Intent-based query patterns
 */
const INTENT_PATTERNS: Record<QueryIntent, string[]> = {
  [QueryIntent.DEFINITION]: [
    'what is {term}',
    '{term} definition',
    'define {term}',
    'explain {term}',
  ],
  [QueryIntent.EXAMPLE]: [
    '{term} example',
    'how to use {term}',
    '{term} code sample',
    '{term} usage',
  ],
  [QueryIntent.TUTORIAL]: [
    'how to {action}',
    '{action} guide',
    '{action} tutorial',
    'step by step {action}',
  ],
  [QueryIntent.COMPARISON]: [
    '{term1} vs {term2}',
    'difference between {term1} and {term2}',
    'compare {term1} {term2}',
  ],
  [QueryIntent.TROUBLESHOOTING]: [
    '{term} not working',
    'fix {term}',
    '{term} issue',
    '{term} problem',
  ],
  [QueryIntent.API_LOOKUP]: [
    '{term} props',
    '{term} parameters',
    '{term} API',
    '{term} interface',
  ],
  [QueryIntent.BEST_PRACTICES]: [
    '{term} best practices',
    'optimal {term}',
    'recommended {term}',
  ],
  [QueryIntent.INTEGRATION]: [
    'integrate {term}',
    '{term} integration',
    'add {term}',
    'setup {term}',
  ],
  // ... default patterns for other intents
  [QueryIntent.EXPLANATION]: ['how {term} works', '{term} explained'],
  [QueryIntent.RECOMMENDATION]: ['should I use {term}', 'when to use {term}'],
  [QueryIntent.DEBUGGING]: ['debug {term}', 'why {term} fails'],
  [QueryIntent.ERROR_RESOLUTION]: ['fix {term} error', 'resolve {term} issue'],
  [QueryIntent.CONFIGURATION]: ['configure {term}', '{term} settings'],
  [QueryIntent.CUSTOMIZATION]: ['customize {term}', 'style {term}'],
  [QueryIntent.MIGRATION]: ['migrate to {term}', 'upgrade {term}'],
  [QueryIntent.FEATURE_DISCOVERY]: ['{term} features', 'what can {term} do'],
  [QueryIntent.ALTERNATIVES]: ['{term} alternatives', 'instead of {term}'],
  [QueryIntent.CLARIFICATION]: ['clarify {term}', 'explain {term} further'],
  [QueryIntent.FOLLOWUP]: ['more about {term}', 'additional {term} info'],
  [QueryIntent.GREETING]: [],
  [QueryIntent.OTHER]: [],
}

// ============================================================================
// Expansion Functions
// ============================================================================

/**
 * Expand query with synonyms, acronyms, and related terms
 */
export function expandQuery(
  query: string,
  classified?: ClassifiedIntent,
  options: ExpansionOptions = {}
): ExpandedQuery {
  const opts: Required<ExpansionOptions> = {
    includeSynonyms: true,
    includeRelatedTerms: true,
    includeAlternatives: true,
    expandAcronyms: true,
    maxAlternatives: 5,
    domain: 'general',
    ...options,
  }

  const normalized = query.toLowerCase().trim()

  // Extract key terms
  const keyTerms = extractKeyTerms(normalized)

  // Expand acronyms
  const acronymExpansions = opts.expandAcronyms ? expandAcronyms(normalized) : new Map()

  // Generate synonym expansions
  const synonymExpanded = opts.includeSynonyms
    ? generateSynonymExpansion(normalized, keyTerms)
    : normalized

  // Get related terms
  const relatedTerms = opts.includeRelatedTerms ? getRelatedTerms(keyTerms) : []

  // Generate alternative phrasings
  const alternatives = opts.includeAlternatives
    ? generateAlternatives(normalized, classified, opts.maxAlternatives)
    : []

  // Map technical terms
  const technicalTerms = mapTechnicalTerms(keyTerms)

  // Generate reformulations
  const reformulations = generateReformulations(
    normalized,
    synonymExpanded,
    classified,
    acronymExpansions,
    technicalTerms
  )

  return {
    original: query,
    expanded: synonymExpanded,
    alternatives,
    relatedTerms,
    acronyms: acronymExpansions,
    technicalTerms,
    reformulations,
  }
}

/**
 * Extract key terms from query (nouns, verbs, technical terms)
 */
function extractKeyTerms(query: string): string[] {
  // Remove stop words
  const stopWords = new Set([
    'the',
    'a',
    'an',
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
    'should',
    'could',
    'can',
    'to',
    'of',
    'in',
    'on',
    'at',
    'by',
    'for',
    'with',
    'about',
    'as',
    'from',
    'or',
    'and',
    'but',
  ])

  // Split and filter
  const words = query.split(/\s+/).filter((word) => {
    const cleaned = word.replace(/[^a-z0-9]/gi, '').toLowerCase()
    return cleaned.length > 2 && !stopWords.has(cleaned)
  })

  // Include multi-word phrases (bigrams)
  const phrases: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    if (TECHNICAL_MAPPINGS[bigram] || SYNONYMS[bigram]) {
      phrases.push(bigram)
    }
  }

  return [...new Set([...words, ...phrases])]
}

/**
 * Expand acronyms in query
 */
function expandAcronyms(query: string): Map<string, string> {
  const expansions = new Map<string, string>()

  for (const [acronym, expansion] of Object.entries(ACRONYMS)) {
    const pattern = new RegExp(`\\b${acronym}\\b`, 'gi')
    if (pattern.test(query)) {
      expansions.set(acronym.toUpperCase(), expansion)
    }
  }

  return expansions
}

/**
 * Generate query with synonym expansions
 */
function generateSynonymExpansion(query: string, keyTerms: string[]): string {
  let expanded = query

  for (const term of keyTerms) {
    const synonyms = SYNONYMS[term.toLowerCase()]
    if (synonyms && synonyms.length > 0) {
      // Add primary synonym in parentheses
      const pattern = new RegExp(`\\b${term}\\b`, 'gi')
      expanded = expanded.replace(pattern, `${term} (${synonyms[0]})`)
    }
  }

  return expanded
}

/**
 * Get related terms for key terms
 */
function getRelatedTerms(keyTerms: string[]): string[] {
  const related = new Set<string>()

  for (const term of keyTerms) {
    const relatedList = RELATED_TERMS[term.toLowerCase()]
    if (relatedList) {
      relatedList.forEach((r) => related.add(r))
    }
  }

  return Array.from(related)
}

/**
 * Map technical terms to their variations
 */
function mapTechnicalTerms(keyTerms: string[]): Map<string, string[]> {
  const mappings = new Map<string, string[]>()

  for (const term of keyTerms) {
    // Check exact match
    const variations = TECHNICAL_MAPPINGS[term.toLowerCase()]
    if (variations) {
      mappings.set(term, variations)
      continue
    }

    // Check if term appears in any mapping
    for (const [key, values] of Object.entries(TECHNICAL_MAPPINGS)) {
      if (key.includes(term.toLowerCase())) {
        mappings.set(term, [key, ...values])
        break
      }
      if (values.some((v) => v.includes(term.toLowerCase()))) {
        mappings.set(term, [key, ...values])
        break
      }
    }
  }

  return mappings
}

/**
 * Generate alternative query phrasings
 */
function generateAlternatives(
  query: string,
  classified: ClassifiedIntent | undefined,
  maxAlternatives: number
): string[] {
  const alternatives: string[] = []

  if (!classified) return alternatives

  // Get intent-based patterns
  const patterns = INTENT_PATTERNS[classified.primary] || []

  // Extract main terms
  const keyTerms = extractKeyTerms(query)
  const mainTerm = keyTerms[0] || 'component'

  // Generate alternatives from patterns
  for (const pattern of patterns.slice(0, maxAlternatives)) {
    let alternative = pattern.replace('{term}', mainTerm).replace('{term1}', keyTerms[0] || '')

    if (keyTerms.length > 1) {
      alternative = alternative.replace('{term2}', keyTerms[1])
    }

    if (alternative.includes('{action}')) {
      // Extract action from query
      const actionMatch = query.match(/\b(use|add|create|implement|setup|configure)\b/i)
      const action = actionMatch ? actionMatch[0] : 'use'
      alternative = alternative.replace('{action}', `${action} ${mainTerm}`)
    }

    if (alternative !== query && !alternative.includes('{')) {
      alternatives.push(alternative)
    }
  }

  return alternatives.slice(0, maxAlternatives)
}

/**
 * Generate query reformulations for different search strategies
 */
function generateReformulations(
  query: string,
  expanded: string,
  classified: ClassifiedIntent | undefined,
  acronyms: Map<string, string>,
  technicalTerms: Map<string, string[]>
): ExpandedQuery['reformulations'] {
  // Keyword search: exact terms + acronym expansions
  let keyword = query
  for (const [acronym, expansion] of acronyms.entries()) {
    keyword += ` ${expansion}`
  }

  // Semantic search: natural language with synonyms
  let semantic = expanded

  // Add technical term variations for semantic search
  for (const [term, variations] of technicalTerms.entries()) {
    semantic += ` ${variations.slice(0, 2).join(' ')}`
  }

  // Hybrid: balanced approach
  const hybrid = `${query} ${Array.from(acronyms.values()).join(' ')}`

  return {
    keyword: keyword.trim(),
    semantic: semantic.trim(),
    hybrid: hybrid.trim(),
  }
}

// ============================================================================
// Query Reformulation for RAG
// ============================================================================

/**
 * Reformulate query for better retrieval (HyDE technique)
 *
 * Hypothetical Document Embeddings: Generate a hypothetical answer,
 * then use that for retrieval instead of the raw query.
 */
export function generateHypotheticalAnswer(query: string, intent: QueryIntent): string {
  const templates: Partial<Record<QueryIntent, string>> = {
    [QueryIntent.DEFINITION]: `${query} refers to a concept in Clarity AI Chat Components that...`,
    [QueryIntent.EXAMPLE]: `Here's an example of ${query}: The component can be used by importing it and...`,
    [QueryIntent.TUTORIAL]: `To ${query}, follow these steps: First, install the package. Then, import the component...`,
    [QueryIntent.API_LOOKUP]: `The ${query} API includes the following parameters: It accepts props such as...`,
    [QueryIntent.TROUBLESHOOTING]: `When ${query} occurs, the issue is typically caused by... The solution involves...`,
  }

  return templates[intent] || query
}

/**
 * Generate multi-perspective queries for comprehensive retrieval
 *
 * Creates variations of the query from different angles to improve recall.
 */
export function generateMultiPerspectiveQueries(
  query: string,
  classified: ClassifiedIntent
): string[] {
  const perspectives: string[] = [query] // Always include original

  const keyTerms = extractKeyTerms(query)
  const mainTerm = keyTerms[0] || 'component'

  // Add implementation perspective
  if (
    [QueryIntent.TUTORIAL, QueryIntent.INTEGRATION, QueryIntent.EXAMPLE].includes(
      classified.primary
    )
  ) {
    perspectives.push(`how to implement ${mainTerm}`)
    perspectives.push(`${mainTerm} code example`)
  }

  // Add conceptual perspective
  if ([QueryIntent.EXPLANATION, QueryIntent.DEFINITION].includes(classified.primary)) {
    perspectives.push(`what is ${mainTerm}`)
    perspectives.push(`${mainTerm} concept explanation`)
  }

  // Add troubleshooting perspective
  if (
    [QueryIntent.TROUBLESHOOTING, QueryIntent.DEBUGGING, QueryIntent.ERROR_RESOLUTION].includes(
      classified.primary
    )
  ) {
    perspectives.push(`${mainTerm} common issues`)
    perspectives.push(`debugging ${mainTerm}`)
  }

  // Add API perspective for technical queries
  if (classified.entities.some((e) => e.type === 'component' || e.type === 'hook')) {
    perspectives.push(`${mainTerm} API documentation`)
    perspectives.push(`${mainTerm} props and usage`)
  }

  return [...new Set(perspectives)].slice(0, 5) // Max 5 perspectives
}

/**
 * Extract search terms with boosting for important terms
 */
export function extractBoostedSearchTerms(query: string, classified: ClassifiedIntent): {
  term: string
  boost: number
}[] {
  const terms: { term: string; boost: number }[] = []

  // Entities get highest boost
  for (const entity of classified.entities) {
    terms.push({ term: entity.value, boost: 2.0 })
  }

  // Technical terms get medium boost
  for (const term of classified.technicalTerms) {
    if (!terms.some((t) => t.term.toLowerCase() === term.toLowerCase())) {
      terms.push({ term, boost: 1.5 })
    }
  }

  // Regular key terms get normal boost
  const keyTerms = extractKeyTerms(query)
  for (const term of keyTerms) {
    if (!terms.some((t) => t.term.toLowerCase() === term.toLowerCase())) {
      terms.push({ term, boost: 1.0 })
    }
  }

  return terms
}

// ============================================================================
// Domain-Specific Expansion
// ============================================================================

/**
 * Expand query with domain-specific knowledge
 */
export function expandWithDomainKnowledge(
  query: string,
  domain: 'react' | 'typescript' | 'ai' | 'general'
): string[] {
  const domainTerms: Record<string, string[]> = {
    react: ['component', 'hook', 'prop', 'state', 'effect', 'jsx', 'render'],
    typescript: ['type', 'interface', 'generic', 'enum', 'union', 'tuple'],
    ai: ['llm', 'prompt', 'token', 'embedding', 'model', 'completion', 'streaming'],
    general: [],
  }

  const expansions = [query]
  const terms = domainTerms[domain] || []

  // Add domain context if query is too generic
  if (query.split(/\s+/).length < 4) {
    for (const term of terms) {
      if (query.toLowerCase().includes(term)) {
        expansions.push(`${query} in ${domain}`)
        break
      }
    }
  }

  return expansions
}
