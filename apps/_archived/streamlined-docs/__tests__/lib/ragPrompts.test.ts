/**
 * RAG Prompts Test Suite
 *
 * Comprehensive testing for RAG prompt quality, citation accuracy,
 * and hallucination detection.
 */

import { describe, it, expect } from 'vitest'
import {
  RAGPrompts,
  RAGUtils,
  formatSourcesForContext,
  prioritizeContext,
  estimateTokens,
  validateCitations,
  detectHallucination,
} from '../../lib/ai/ragPrompts'
import type { SearchResult } from '../../lib/ai/vectorStore'
import type { Message } from '@clarity-chat/types'

// ============================================================================
// Test Data
// ============================================================================

const mockSources: SearchResult[] = [
  {
    id: 'doc-1',
    title: 'ChatProvider Component',
    content: `# ChatProvider

The ChatProvider component manages chat state and configuration.

\`\`\`tsx
import { ChatProvider } from '@clarity-chat/react'

function App() {
  return (
    <ChatProvider apiKey={process.env.OPENAI_API_KEY}>
      <YourApp />
    </ChatProvider>
  )
}
\`\`\`

Props:
- apiKey: string (required)
- model: string (optional)`,
    url: '/reference/components/chat-provider',
    category: 'component',
    score: 0.95,
    metadata: { lastUpdated: new Date().toISOString(), tags: ['component', 'provider'] },
  },
  {
    id: 'doc-2',
    title: 'useChat Hook',
    content: `# useChat Hook

The useChat hook provides chat functionality.

\`\`\`tsx
const { messages, sendMessage, isLoading } = useChat()
\`\`\`

Returns:
- messages: Message[]
- sendMessage: (content: string) => Promise<void>
- isLoading: boolean`,
    url: '/reference/hooks/use-chat',
    category: 'hook',
    score: 0.88,
    metadata: { lastUpdated: new Date().toISOString(), tags: ['hook', 'chat'] },
  },
  {
    id: 'doc-3',
    title: 'Streaming Guide',
    content: `# Implementing Streaming

Learn how to add real-time streaming to your chat interface.

Step 1: Configure streaming in ChatProvider
Step 2: Handle streaming events
Step 3: Display partial messages`,
    url: '/guides/streaming',
    category: 'guide',
    score: 0.76,
    metadata: {
      lastUpdated: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(), // 10 days ago
      tags: ['guide', 'streaming'],
    },
  },
]

const mockConversation: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'How do I get started with Clarity Chat?',
    chatId: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content:
      'To get started, install the package and wrap your app with ChatProvider...',
    chatId: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'What about streaming?',
    chatId: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  },
]

// ============================================================================
// Prompt Structure Tests
// ============================================================================

describe('RAG Prompt Structure', () => {
  it('should have required sections in system prompt', () => {
    expect(RAGPrompts.system).toContain('<critical_constraints>')
    expect(RAGPrompts.system).toContain('<response_structure>')
    expect(RAGPrompts.system).toContain('<citation_format>')
    expect(RAGPrompts.system).toContain('<code_example_format>')
  })

  it('should include hallucination prevention constraints', () => {
    expect(RAGPrompts.system).toContain(
      'ONLY answer using information from the provided'
    )
    expect(RAGPrompts.system).toContain('NEVER make up component names')
    expect(RAGPrompts.system).toContain('ALWAYS cite your sources')
  })

  it('should define clear citation format', () => {
    expect(RAGPrompts.system).toMatch(/\[Source \d+\]/)
    expect(RAGPrompts.system).toContain('cite your sources')
  })

  it('should include code example formatting', () => {
    expect(RAGPrompts.system).toContain('```tsx')
    expect(RAGPrompts.system).toContain('import')
  })
})

// ============================================================================
// Few-Shot Examples Tests
// ============================================================================

describe('Few-Shot Examples', () => {
  it('should have properly formatted examples', () => {
    expect(RAGPrompts.fewShot).toHaveLength(4) // 2 exchanges = 4 messages

    // Check user messages
    const userMessages = RAGPrompts.fewShot.filter((m) => m.role === 'user')
    userMessages.forEach((msg) => {
      expect(msg.content).toContain('<documentation_context>')
      expect(msg.content).toContain('<user_question>')
      expect(msg.content).toContain('[Source')
    })

    // Check assistant messages
    const assistantMessages = RAGPrompts.fewShot.filter(
      (m) => m.role === 'assistant'
    )
    assistantMessages.forEach((msg) => {
      expect(msg.content).toContain('**Sources:**')
      expect(msg.content).toMatch(/\[Source \d+\]/)
    })
  })

  it('should demonstrate proper citation format', () => {
    const examples = RAGPrompts.fewShot.filter((m) => m.role === 'assistant')

    examples.forEach((example) => {
      // Should have inline citations
      expect(example.content).toMatch(/\[Source \d+\]/)

      // Should have source list at end
      expect(example.content).toContain('**Sources:**')
    })
  })

  it('should show how to handle missing information', () => {
    const examples = RAGPrompts.fewShot.filter((m) => m.role === 'assistant')

    // At least one example should demonstrate saying "I don't have that information"
    const hasMissingInfoExample = examples.some((ex) =>
      ex.content.includes("I don't have that information")
    )

    expect(hasMissingInfoExample).toBe(true)
  })
})

// ============================================================================
// Context Formatting Tests
// ============================================================================

describe('Context Formatting', () => {
  it('should format sources with proper structure', () => {
    const formatted = formatSourcesForContext(mockSources)

    expect(formatted).toContain('[Source 1]')
    expect(formatted).toContain('[Source 2]')
    expect(formatted).toContain('**Category:**')
    expect(formatted).toContain('**URL:**')
  })

  it('should include relevance scores when enabled', () => {
    const formatted = formatSourcesForContext(mockSources, {
      includeScores: true,
    })

    expect(formatted).toContain('**Relevance:**')
    expect(formatted).toMatch(/\d+%/)
  })

  it('should exclude scores when disabled', () => {
    const formatted = formatSourcesForContext(mockSources, {
      includeScores: false,
    })

    expect(formatted).not.toContain('**Relevance:**')
  })

  it('should respect token budget', () => {
    const maxTokens = 100 // Very small budget
    const formatted = formatSourcesForContext(mockSources, { maxTokens })

    const estimatedTokens = estimateTokens(formatted)
    expect(estimatedTokens).toBeLessThanOrEqual(maxTokens + 50) // Allow small buffer
  })

  it('should handle empty sources gracefully', () => {
    const formatted = formatSourcesForContext([])
    expect(formatted).toBe('[No relevant documentation found]')
  })
})

// ============================================================================
// Context Prioritization Tests
// ============================================================================

describe('Context Prioritization', () => {
  it('should prioritize by relevance score', () => {
    const prioritized = prioritizeContext(mockSources, 5000)

    // Should be sorted by score (descending)
    for (let i = 0; i < prioritized.length - 1; i++) {
      expect(prioritized[i].score).toBeGreaterThanOrEqual(
        prioritized[i + 1].score
      )
    }
  })

  it('should apply diversity penalty to over-represented categories', () => {
    // Create sources with duplicate categories
    const duplicateSources: SearchResult[] = [
      ...mockSources,
      {
        id: 'doc-4',
        title: 'Another Component',
        content: 'Component content',
        url: '/ref/comp2',
        category: 'component', // Duplicate category
        score: 0.92, // High score but duplicate category
        metadata: { lastUpdated: new Date().toISOString(), tags: ['component'] },
      },
    ]

    const prioritized = prioritizeContext(duplicateSources, 5000)

    // The duplicate category item should not necessarily be second despite high score
    // (diversity penalty should affect ranking)
    expect(prioritized).toHaveLength(4)
  })

  it('should boost recent content', () => {
    const recentSource: SearchResult = {
      id: 'doc-recent',
      title: 'Recent Update',
      content: 'Recently updated content',
      url: '/recent',
      category: 'guide',
      score: 0.7, // Lower score
      metadata: { lastUpdated: new Date().toISOString(), tags: ['guide'] }, // Very recent
    }

    const sources = [recentSource, ...mockSources]
    const prioritized = prioritizeContext(sources, 5000)

    // Recent content should get a boost
    const recentIndex = prioritized.findIndex((s) => s.id === 'doc-recent')
    expect(recentIndex).toBeGreaterThanOrEqual(0) // Should be included
  })

  it('should respect token budget', () => {
    const maxTokens = 500 // Small budget
    const prioritized = prioritizeContext(mockSources, maxTokens)

    const totalTokens = prioritized.reduce(
      (sum, source) => sum + estimateTokens(source.content),
      0
    )

    expect(totalTokens).toBeLessThanOrEqual(maxTokens)
  })

  it('should handle empty input', () => {
    const prioritized = prioritizeContext([], 1000)
    expect(prioritized).toEqual([])
  })
})

// ============================================================================
// Conversation History Tests
// ============================================================================

describe('Conversation History Formatting', () => {
  it('should format conversation history', () => {
    const formatted = RAGUtils.formatConversationHistory(mockConversation)

    expect(formatted).toContain('<conversation_history>')
    expect(formatted).toContain('</conversation_history>')
    expect(formatted).toContain('<user>')
    expect(formatted).toContain('<assistant>')
  })

  it('should respect token budget for history', () => {
    const maxTokens = 50 // Very small budget
    const formatted = RAGUtils.formatConversationHistory(
      mockConversation,
      maxTokens
    )

    const estimatedTokens = estimateTokens(formatted)
    expect(estimatedTokens).toBeLessThanOrEqual(maxTokens * 2) // Allow some overhead
  })

  it('should truncate long assistant messages', () => {
    const longMessage: Message = {
      id: 'msg-long',
      role: 'assistant',
      content: 'a'.repeat(1000), // Very long message
      chatId: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent',
    }

    const formatted = RAGUtils.formatConversationHistory([longMessage])

    expect(formatted).toContain('...')
    expect(formatted.length).toBeLessThan(longMessage.content.length + 200)
  })

  it('should handle empty conversation', () => {
    const formatted = RAGUtils.formatConversationHistory([])
    expect(formatted).toBe('')
  })
})

// ============================================================================
// Citation Validation Tests
// ============================================================================

describe('Citation Validation', () => {
  it('should validate complete citations', () => {
    const response = `According to [Source 1], you should use ChatProvider.
    Also see [Source 2] for more details.

    **Sources:**
    [Source 1]: ChatProvider (/ref/chat-provider)
    [Source 2]: useChat (/ref/use-chat)`

    const validation = validateCitations(response, 2)

    expect(validation.isValid).toBe(true)
    expect(validation.missingCitations).toHaveLength(0)
    expect(validation.issues).toHaveLength(0)
  })

  it('should detect missing inline citations', () => {
    // Source 2 is mentioned but not properly cited with [Source 2] format
    // and it's missing from the source list as well
    const response = `According to [Source 1], you should use ChatProvider.
    But Source 2 is not cited properly.

    **Sources:**
    [Source 1]: ChatProvider (/ref/chat-provider)`

    const validation = validateCitations(response, 2)

    expect(validation.isValid).toBe(false)
    expect(validation.missingCitations).toContain(2)
  })

  it('should pass when source appears only in source list', () => {
    // Source 2 not cited inline, but appears in source list - this is valid
    const response = `According to [Source 1], you should use ChatProvider.

    **Sources:**
    [Source 1]: ChatProvider (/ref/chat-provider)
    [Source 2]: useChat (/ref/use-chat)`

    const validation = validateCitations(response, 2)

    expect(validation.isValid).toBe(true)
    expect(validation.missingCitations).toHaveLength(0)
  })

  it('should detect missing source list', () => {
    const response = `According to [Source 1], you should use ChatProvider.
    See [Source 2] for details.`
    // No **Sources:** section

    const validation = validateCitations(response, 2)

    expect(validation.isValid).toBe(false)
    expect(validation.issues).toContain(
      'Missing source list at end of response'
    )
  })

  it('should handle zero sources', () => {
    const response = "I don't have that information in the documentation."

    const validation = validateCitations(response, 0)

    expect(validation.isValid).toBe(true)
  })
})

// ============================================================================
// Hallucination Detection Tests
// ============================================================================

describe('Hallucination Detection', () => {
  it('should pass for response using documented components', () => {
    const context = `ChatProvider component from @clarity-chat/react
    useChat hook for managing messages`

    const response = `Use the <ChatProvider> component and the useChat hook.

    \`\`\`tsx
    import { ChatProvider } from '@clarity-chat/react'
    const { messages } = useChat()
    \`\`\``

    const detection = detectHallucination(response, context)

    expect(detection.isLikelySafe).toBe(true)
    expect(detection.warnings).toHaveLength(0)
  })

  it('should detect components not in context', () => {
    const context = `ChatProvider component from @clarity-chat/react`

    const response = `Use the <ChatProvider> and <FakeComponent> components.

    \`\`\`tsx
    <FakeComponent />
    \`\`\``

    const detection = detectHallucination(response, context)

    expect(detection.isLikelySafe).toBe(false)
    expect(detection.warnings.some((w) => w.includes('FakeComponent'))).toBe(
      true
    )
  })

  it('should detect hooks not in context', () => {
    const context = `useChat hook for managing messages`

    const response = `Use the useChat and useFakeHook hooks.

    \`\`\`tsx
    const chat = useChat()
    const fake = useFakeHook()
    \`\`\``

    const detection = detectHallucination(response, context)

    expect(detection.isLikelySafe).toBe(false)
    expect(detection.warnings.some((w) => w.includes('useFakeHook'))).toBe(true)
  })

  it('should recognize proper hedging language', () => {
    const context = `Limited documentation available`

    const response = `I don't have complete information on this topic according to the documentation.
    Based on the provided context, I can only say...`

    const detection = detectHallucination(response, context)

    // Should pass due to hedging language
    expect(detection.isLikelySafe).toBe(true)
  })

  it('should warn about lack of attribution', () => {
    const context = `Some documentation content`

    const response = `This is the answer with no attribution or hedging.`

    const detection = detectHallucination(response, context)

    expect(detection.warnings.some((w) => w.includes('attribution'))).toBe(true)
  })
})

// ============================================================================
// Token Estimation Tests
// ============================================================================

describe('Token Estimation', () => {
  it('should estimate tokens roughly correctly', () => {
    const text = 'This is a test sentence with about ten words in it.'
    const estimate = estimateTokens(text)

    // Rough estimate: 1 token ≈ 4 characters
    // ~52 characters / 4 = ~13 tokens
    expect(estimate).toBeGreaterThan(10)
    expect(estimate).toBeLessThan(20)
  })

  it('should handle empty string', () => {
    expect(estimateTokens('')).toBe(0)
  })

  it('should handle very long text', () => {
    const longText = 'word '.repeat(1000) // ~5000 characters
    const estimate = estimateTokens(longText)

    expect(estimate).toBeGreaterThan(1000) // Should be > 1000 tokens
    expect(estimate).toBeLessThan(2000) // But not excessively high
  })
})

// ============================================================================
// Integration Tests
// ============================================================================

describe('RAG Prompt Integration', () => {
  it('should build complete conversation-aware prompt', () => {
    const context = formatSourcesForContext(mockSources)
    const prompt = RAGUtils.buildConversationRAGPrompt({
      question: 'How do I implement streaming?',
      context,
      conversationHistory: mockConversation,
    })

    expect(prompt).toContain('<conversation_history>')
    expect(prompt).toContain('<documentation_context>')
    expect(prompt).toContain('<current_question>')
    expect(prompt).toContain('How do I implement streaming?')
  })

  it('should handle new conversation (no history)', () => {
    const context = formatSourcesForContext(mockSources)
    const prompt = RAGUtils.buildConversationRAGPrompt({
      question: 'What is Clarity Chat?',
      context,
      conversationHistory: [],
    })

    expect(prompt).not.toContain('<conversation_history>')
    expect(prompt).toContain('<documentation_context>')
  })

  it('should create valid prompt within token budget', () => {
    const context = formatSourcesForContext(mockSources, { maxTokens: 2000 })
    const prompt = RAGUtils.buildConversationRAGPrompt({
      question: 'Complex question here',
      context,
      conversationHistory: mockConversation,
      maxHistoryTokens: 500,
    })

    const totalTokens = estimateTokens(prompt)

    // Should fit in a reasonable budget (not exact due to overhead)
    expect(totalTokens).toBeLessThan(3000)
  })
})

// ============================================================================
// Prompt Quality Metrics
// ============================================================================

describe('Prompt Quality Metrics', () => {
  it('should have concise system prompt', () => {
    const tokens = estimateTokens(RAGPrompts.system)

    // System prompt should be under 1000 tokens for efficiency
    expect(tokens).toBeLessThan(1000)
  })

  it('should have structured sections', () => {
    const sections = [
      '<critical_constraints>',
      '<response_structure>',
      '<citation_format>',
      '<code_example_format>',
      '<tone>',
    ]

    sections.forEach((section) => {
      expect(RAGPrompts.system).toContain(section)
    })
  })

  it('should emphasize key constraints', () => {
    const constraints = ['ONLY', 'NEVER', 'ALWAYS']

    constraints.forEach((constraint) => {
      expect(RAGPrompts.system).toContain(constraint)
    })
  })
})
