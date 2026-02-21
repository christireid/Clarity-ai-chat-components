/**
 * Tests for Query Enhancement System
 *
 * Comprehensive tests for:
 * - Intent classification
 * - Query expansion
 * - Conversation context
 * - Integrated query processing
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  classifyQueryIntent,
  QueryIntent,
  QueryEntity,
  SkillLevel,
  requiresCodeExample,
  isProblemSolving,
} from '../query-intent-classifier'

import {
  expandQuery,
  generateHypotheticalAnswer,
  generateMultiPerspectiveQueries,
  extractBoostedSearchTerms,
} from '../query-expansion'

import {
  getConversationContextManager,
  requiresConversationContext,
} from '../conversation-context-manager'

import { processQuery, generateRAGPrompt } from '../enhanced-query-processor'

// ============================================================================
// Intent Classification Tests
// ============================================================================

describe('Intent Classification', () => {
  describe('Definition Intent', () => {
    it('should classify "what is" questions', () => {
      const result = classifyQueryIntent('What is ChatWindow?')
      expect(result.primary).toBe(QueryIntent.DEFINITION)
      expect(result.confidence).toBeGreaterThan(0.8)
    })

    it('should classify "define" questions', () => {
      const result = classifyQueryIntent('Define streaming in chat')
      expect(result.primary).toBe(QueryIntent.DEFINITION)
    })
  })

  describe('Example Intent', () => {
    it('should classify example requests', () => {
      const result = classifyQueryIntent('Show me an example of useChat')
      expect(result.primary).toBe(QueryIntent.EXAMPLE)
      expect(result.confidence).toBeGreaterThan(0.9)
    })

    it('should classify usage questions', () => {
      const result = classifyQueryIntent('How to use StreamingMessage?')
      expect(result.primary).toBe(QueryIntent.EXAMPLE)
    })
  })

  describe('Tutorial Intent', () => {
    it('should classify how-to questions', () => {
      const result = classifyQueryIntent('How to integrate Clarity Chat?')
      expect(result.primary).toBe(QueryIntent.TUTORIAL)
    })

    it('should classify step-by-step requests', () => {
      const result = classifyQueryIntent('Step by step guide for setup')
      expect(result.primary).toBe(QueryIntent.TUTORIAL)
    })
  })

  describe('Troubleshooting Intent', () => {
    it('should classify not working problems', () => {
      const result = classifyQueryIntent('ChatWindow is not working')
      expect(result.primary).toBe(QueryIntent.TROUBLESHOOTING)
      expect(result.confidence).toBeGreaterThan(0.9)
    })

    it('should classify error messages', () => {
      const result = classifyQueryIntent('Getting error when sending messages')
      expect(result.primary).toBe(QueryIntent.ERROR_RESOLUTION)
    })
  })

  describe('Comparison Intent', () => {
    it('should classify vs questions', () => {
      const result = classifyQueryIntent('ChatWindow vs MessageList')
      expect(result.primary).toBe(QueryIntent.COMPARISON)
    })

    it('should classify difference questions', () => {
      const result = classifyQueryIntent('Difference between useChat and useMessages')
      expect(result.primary).toBe(QueryIntent.COMPARISON)
    })
  })

  describe('Entity Extraction', () => {
    it('should extract component entities', () => {
      const result = classifyQueryIntent('How to use ChatWindow component?')
      expect(result.entities).toContainEqual(
        expect.objectContaining({
          type: QueryEntity.COMPONENT,
          value: expect.stringMatching(/ChatWindow/i),
        })
      )
    })

    it('should extract hook entities', () => {
      const result = classifyQueryIntent('useChat hook not working')
      expect(result.entities).toContainEqual(
        expect.objectContaining({
          type: QueryEntity.HOOK,
          value: expect.stringMatching(/useChat/i),
        })
      )
    })

    it('should extract multiple entities', () => {
      const result = classifyQueryIntent('How to use StreamingMessage with useChat?')
      expect(result.entities.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Skill Level Detection', () => {
    it('should detect beginner level', () => {
      const result = classifyQueryIntent('What is a component? How do I start?')
      expect(result.skillLevel).toBe(SkillLevel.BEGINNER)
    })

    it('should detect intermediate level', () => {
      const result = classifyQueryIntent('How to implement custom message styling?')
      expect(result.skillLevel).toBe(SkillLevel.INTERMEDIATE)
    })

    it('should detect advanced level', () => {
      const result = classifyQueryIntent('Optimize rendering performance with virtualization')
      expect(result.skillLevel).toBe(SkillLevel.ADVANCED)
    })
  })

  describe('Secondary Intents', () => {
    it('should detect multiple intents', () => {
      const result = classifyQueryIntent('Explain how ChatWindow works and show me an example')
      expect(result.secondary).toContain(QueryIntent.EXAMPLE)
    })
  })

  describe('Utility Functions', () => {
    it('should identify intents requiring code examples', () => {
      expect(requiresCodeExample(QueryIntent.EXAMPLE)).toBe(true)
      expect(requiresCodeExample(QueryIntent.TUTORIAL)).toBe(true)
      expect(requiresCodeExample(QueryIntent.DEFINITION)).toBe(false)
    })

    it('should identify problem-solving intents', () => {
      expect(isProblemSolving(QueryIntent.TROUBLESHOOTING)).toBe(true)
      expect(isProblemSolving(QueryIntent.DEBUGGING)).toBe(true)
      expect(isProblemSolving(QueryIntent.DEFINITION)).toBe(false)
    })
  })
})

// ============================================================================
// Query Expansion Tests
// ============================================================================

describe('Query Expansion', () => {
  describe('Synonym Expansion', () => {
    it('should expand common terms', () => {
      const result = expandQuery('customize button style')
      expect(result.expanded).toContain('customize')
      expect(result.expanded.toLowerCase()).toMatch(/modify|personalize|configure/)
    })

    it('should preserve original query', () => {
      const result = expandQuery('How to use ChatWindow?')
      expect(result.original).toBe('How to use ChatWindow?')
    })
  })

  describe('Acronym Expansion', () => {
    it('should expand LLM acronym', () => {
      const result = expandQuery('How to use LLM with chat?')
      expect(result.acronyms.has('LLM')).toBe(true)
      expect(result.acronyms.get('LLM')).toContain('Language Model')
    })

    it('should expand multiple acronyms', () => {
      const result = expandQuery('RAG with LLM API')
      expect(result.acronyms.size).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Related Terms', () => {
    it('should find related chat terms', () => {
      const result = expandQuery('chat interface')
      expect(result.relatedTerms).toContain('message')
      expect(result.relatedTerms).toContain('conversation')
    })

    it('should find related streaming terms', () => {
      const result = expandQuery('streaming messages')
      expect(result.relatedTerms.some((t) => t.includes('token') || t.includes('chunk'))).toBe(
        true
      )
    })
  })

  describe('Alternative Phrasings', () => {
    it('should generate alternatives', () => {
      const classified = classifyQueryIntent('How to use ChatWindow?')
      const result = expandQuery('How to use ChatWindow?', classified)
      expect(result.alternatives.length).toBeGreaterThan(0)
    })

    it('should respect max alternatives option', () => {
      const classified = classifyQueryIntent('What is streaming?')
      const result = expandQuery('What is streaming?', classified, { maxAlternatives: 2 })
      expect(result.alternatives.length).toBeLessThanOrEqual(2)
    })
  })

  describe('Technical Term Mapping', () => {
    it('should map technical variations', () => {
      const result = expandQuery('lazy loading components')
      expect(result.technicalTerms.size).toBeGreaterThan(0)
    })
  })

  describe('Query Reformulation', () => {
    it('should generate keyword query', () => {
      const result = expandQuery('How to use LLM API?')
      expect(result.reformulations.keyword).toContain('Language Model')
    })

    it('should generate semantic query', () => {
      const result = expandQuery('customize chat style')
      const semantic = result.reformulations.semantic.toLowerCase()
      expect(semantic).toMatch(/customize|modify|style|theme/)
    })

    it('should generate hybrid query', () => {
      const result = expandQuery('RAG implementation')
      expect(result.reformulations.hybrid).toBeTruthy()
    })
  })

  describe('Hypothetical Answer Generation', () => {
    it('should generate for definition intent', () => {
      const answer = generateHypotheticalAnswer('What is ChatWindow?', QueryIntent.DEFINITION)
      expect(answer).toContain('refers to')
    })

    it('should generate for tutorial intent', () => {
      const answer = generateHypotheticalAnswer('How to add streaming?', QueryIntent.TUTORIAL)
      expect(answer).toMatch(/steps|install|import/)
    })
  })

  describe('Multi-Perspective Queries', () => {
    it('should generate multiple perspectives', () => {
      const classified = classifyQueryIntent('How to integrate ChatWindow?')
      const perspectives = generateMultiPerspectiveQueries('How to integrate ChatWindow?', classified)
      expect(perspectives.length).toBeGreaterThan(1)
      expect(perspectives).toContain('How to integrate ChatWindow?')
    })

    it('should include implementation perspective', () => {
      const classified = classifyQueryIntent('How to use hooks?')
      const perspectives = generateMultiPerspectiveQueries('How to use hooks?', classified)
      expect(perspectives.some((p) => p.includes('implement') || p.includes('example'))).toBe(true)
    })
  })

  describe('Boosted Search Terms', () => {
    it('should extract terms with weights', () => {
      const classified = classifyQueryIntent('How to use ChatWindow component?')
      const terms = extractBoostedSearchTerms('How to use ChatWindow component?', classified)
      expect(terms.length).toBeGreaterThan(0)
      expect(terms[0]).toHaveProperty('term')
      expect(terms[0]).toHaveProperty('boost')
    })

    it('should boost entities higher', () => {
      const classified = classifyQueryIntent('ChatWindow not working')
      const terms = extractBoostedSearchTerms('ChatWindow not working', classified)
      const chatWindowTerm = terms.find((t) => t.term.toLowerCase().includes('chatwindow'))
      expect(chatWindowTerm?.boost).toBeGreaterThan(1)
    })
  })
})

// ============================================================================
// Conversation Context Tests
// ============================================================================

describe('Conversation Context', () => {
  beforeEach(() => {
    // Clear contexts before each test
    const manager = getConversationContextManager()
    ;(manager as any).contexts.clear()
  })

  describe('Context Creation', () => {
    it('should create new context', () => {
      const manager = getConversationContextManager()
      const context = manager.getOrCreateContext('test-1')
      expect(context.id).toBe('test-1')
      expect(context.turns).toHaveLength(0)
    })

    it('should reuse existing context', () => {
      const manager = getConversationContextManager()
      const context1 = manager.getOrCreateContext('test-1')
      const context2 = manager.getOrCreateContext('test-1')
      expect(context1).toBe(context2)
    })
  })

  describe('Turn Management', () => {
    it('should add turns', () => {
      const manager = getConversationContextManager()
      const intent = classifyQueryIntent('What is ChatWindow?')
      manager.addTurn('test-1', 'What is ChatWindow?', intent)

      const context = manager.getOrCreateContext('test-1')
      expect(context.turns).toHaveLength(1)
      expect(context.metadata.turnCount).toBe(1)
    })

    it('should track entities across turns', () => {
      const manager = getConversationContextManager()

      const intent1 = classifyQueryIntent('What is ChatWindow?')
      manager.addTurn('test-1', 'What is ChatWindow?', intent1)

      const intent2 = classifyQueryIntent('How do I use it?')
      manager.addTurn('test-1', 'How do I use it?', intent2)

      const context = manager.getOrCreateContext('test-1')
      expect(context.activeEntities.size).toBeGreaterThan(0)
    })
  })

  describe('Coreference Resolution', () => {
    it('should resolve "it" pronouns', () => {
      const manager = getConversationContextManager()

      const intent1 = classifyQueryIntent('What is ChatWindow?')
      manager.addTurn('test-1', 'What is ChatWindow?', intent1)

      const intent2 = classifyQueryIntent('How do I use it?')
      const resolved = manager.resolveQuery('test-1', 'How do I use it?', intent2)

      expect(resolved.resolved.toLowerCase()).toContain('chatwindow')
    })

    it('should handle first turn without context', () => {
      const manager = getConversationContextManager()
      const intent = classifyQueryIntent('What is ChatWindow?')
      const resolved = manager.resolveQuery('test-1', 'What is ChatWindow?', intent)

      expect(resolved.resolved).toBe('What is ChatWindow?')
      expect(resolved.carriedOverEntities).toHaveLength(0)
    })
  })

  describe('Topic Tracking', () => {
    it('should track topic changes', () => {
      const manager = getConversationContextManager()

      const intent1 = classifyQueryIntent('What is ChatWindow?')
      manager.addTurn('test-1', 'What is ChatWindow?', intent1)

      const intent2 = classifyQueryIntent('Tell me about StreamingMessage')
      manager.addTurn('test-1', 'Tell me about StreamingMessage', intent2)

      const context = manager.getOrCreateContext('test-1')
      expect(context.topicHistory.length).toBeGreaterThan(0)
    })
  })

  describe('Context Requirements', () => {
    it('should identify queries needing context', () => {
      expect(requiresConversationContext('How do I use it?')).toBe(true)
      expect(requiresConversationContext('What about this?')).toBe(true)
      expect(requiresConversationContext('What is ChatWindow component?')).toBe(false)
    })

    it('should identify short queries as needing context', () => {
      expect(requiresConversationContext('Can you clarify?')).toBe(true)
      expect(requiresConversationContext('More examples')).toBe(true)
    })
  })

  describe('Conversation History', () => {
    it('should format conversation history', () => {
      const manager = getConversationContextManager()

      const intent1 = classifyQueryIntent('What is ChatWindow?')
      manager.addTurn('test-1', 'What is ChatWindow?', intent1, 'ChatWindow is a component...')

      const intent2 = classifyQueryIntent('How to use it?')
      manager.addTurn('test-1', 'How to use it?', intent2, 'You can use it by...')

      const history = manager.getConversationHistory('test-1', 2)
      expect(history).toContain('What is ChatWindow?')
      expect(history).toContain('How to use it?')
    })
  })
})

// ============================================================================
// Integrated Query Processing Tests
// ============================================================================

describe('Integrated Query Processing', () => {
  describe('Basic Processing', () => {
    it('should process simple query', async () => {
      const result = await processQuery('What is ChatWindow?')
      expect(result.original).toBe('What is ChatWindow?')
      expect(result.intent.primary).toBe(QueryIntent.DEFINITION)
      expect(result.expanded).toBeDefined()
      expect(result.searchQueries).toBeDefined()
    })

    it('should include processing metadata', async () => {
      const result = await processQuery('How to use hooks?')
      expect(result.metadata.processingTime).toBeGreaterThan(0)
    })
  })

  describe('With Conversation Context', () => {
    it('should process with conversation ID', async () => {
      const result1 = await processQuery('What is ChatWindow?', {
        conversationId: 'test-conv',
      })
      expect(result1.metadata.turnNumber).toBe(1)

      const result2 = await processQuery('How to use it?', {
        conversationId: 'test-conv',
      })
      expect(result2.metadata.turnNumber).toBe(2)
      expect(result2.resolved.resolved).toContain('ChatWindow')
    })
  })

  describe('Search Query Generation', () => {
    it('should generate all search query types', async () => {
      const result = await processQuery('How to implement streaming?')
      expect(result.searchQueries.keyword).toBeTruthy()
      expect(result.searchQueries.semantic).toBeTruthy()
      expect(result.searchQueries.hybrid).toBeTruthy()
      expect(result.searchQueries.perspectives.length).toBeGreaterThan(0)
    })
  })

  describe('Response Guidance', () => {
    it('should provide response structure', async () => {
      const result = await processQuery('What is streaming?')
      expect(result.responseGuidance.sections.length).toBeGreaterThan(0)
      expect(result.responseGuidance.style).toBeTruthy()
    })

    it('should recommend code examples for tutorials', async () => {
      const result = await processQuery('How to setup ChatWindow?')
      expect(result.responseGuidance.includeCodeExamples).toBe(true)
    })

    it('should identify problem-solving queries', async () => {
      const result = await processQuery('ChatWindow not rendering')
      expect(result.responseGuidance.isProblemSolving).toBe(true)
    })
  })

  describe('RAG Prompt Generation', () => {
    it('should generate complete RAG prompt', async () => {
      const processed = await processQuery('How to use ChatWindow?')
      const prompt = generateRAGPrompt(processed)

      expect(prompt.systemPrompt).toContain('documentation assistant')
      expect(prompt.userPrompt).toContain('ChatWindow')
      expect(prompt.searchQuery).toBeTruthy()
    })

    it('should include skill level in prompt', async () => {
      const processed = await processQuery('What is a component? How do I start?')
      const prompt = generateRAGPrompt(processed)

      expect(prompt.systemPrompt.toLowerCase()).toContain('beginner')
    })

    it('should include conversation context', async () => {
      const processed1 = await processQuery('What is ChatWindow?', {
        conversationId: 'test-rag',
      })

      const processed2 = await processQuery('How to use it?', {
        conversationId: 'test-rag',
      })

      const prompt = generateRAGPrompt(processed2)
      expect(prompt.systemPrompt).toContain('Conversation Context')
    })
  })

  describe('Options Handling', () => {
    it('should respect expansion options', async () => {
      const result = await processQuery('What is RAG?', {
        expandAcronyms: true,
        includeSynonyms: true,
      })
      expect(result.expanded.acronyms.size).toBeGreaterThan(0)
    })

    it('should control perspective generation', async () => {
      const result = await processQuery('How to setup?', {
        generatePerspectives: false,
      })
      expect(result.searchQueries.perspectives.length).toBe(1)
    })
  })
})
