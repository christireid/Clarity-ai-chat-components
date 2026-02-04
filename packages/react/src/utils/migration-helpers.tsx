/**
 * Migration Helpers - Easy Migration from Other Libraries
 *
 * Utilities and adapters to help migrate from other chat UI libraries
 * to Clarity Chat with minimal friction and clear migration paths.
 *
 * @module utils/migration-helpers
 */

import * as React from 'react'
import { ClarityChat } from '../components/chat/ClarityChat'
import { useClarityChat } from '../hooks/use-clarity-chat'

// =============================================================================
// VERCEL AI SDK MIGRATION
// =============================================================================

/**
 * Adapter for migrating from Vercel AI SDK to Clarity Chat
 */
export const VercelAdapter = {
  /**
   * Convert Vercel AI SDK messages to Clarity Chat format
   */
  convertMessages: (vercelMessages: any[]): any[] => {
    return vercelMessages.map((msg) => ({
      id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      content: msg.content,
      role: msg.role,
      timestamp: msg.createdAt || Date.now(),
      // Preserve any additional metadata
      ...msg,
    }))
  },

  /**
   * Convert Vercel AI SDK useChat hook to useClarityChat
   */
  convertChatHook: (vercelChat: any) => ({
    messages: VercelAdapter.convertMessages(vercelChat.messages || []),
    input: vercelChat.input,
    handleInputChange: vercelChat.handleInputChange,
    handleSubmit: vercelChat.handleSubmit,
    isLoading: vercelChat.isLoading,
    error: vercelChat.error,
    // Map Clarity Chat methods
    append: (message: any) => {
      // This would need to be adapted based on specific use case
      if (process.env.NODE_ENV === 'development') {
        console.warn('Migration: append method needs custom implementation')
      }
    },
    reload: vercelChat.reload,
    stop: vercelChat.stop,
  }),

  /**
   * Migration wrapper component
   */
  MigrationWrapper: ({ children, api, ...props }: any) => {
    const clarityChat = useClarityChat({ api, ...props })

    // Provide Vercel-like API to children
    const vercelAPI = {
      messages: VercelAdapter.convertMessages(clarityChat.messages),
      input: '', // Would need state management
      handleInputChange: (e: any) => {
        // Would need to manage input state
        if (process.env.NODE_ENV === 'development') {
          console.warn('Migration: handleInputChange needs implementation')
        }
      },
      handleSubmit: (e: any) => {
        e.preventDefault()
        // Would need to get input value and call append
        if (process.env.NODE_ENV === 'development') {
          console.warn('Migration: handleSubmit needs implementation')
        }
      },
      isLoading: clarityChat.isLoading,
      error: clarityChat.error,
      append: clarityChat.append,
      reload: clarityChat.reload,
      stop: clarityChat.stop,
    }

    return children(vercelAPI)
  },
}

// =============================================================================
// OPENAI CHAT COMPLETIONS MIGRATION
// =============================================================================

/**
 * Adapter for migrating from direct OpenAI API usage
 */
export const OpenAIAdapter = {
  /**
   * Convert OpenAI chat completion messages to Clarity format
   */
  convertMessages: (openaiMessages: any[]): any[] => {
    return openaiMessages.map((msg, index) => ({
      id: `msg-${Date.now()}-${index}`,
      content:
        typeof msg.content === 'string'
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content.map((c: { text?: string }) => c.text || '').join('')
            : '',
      role: msg.role,
      timestamp: Date.now(),
      // Preserve OpenAI-specific fields
      openai: msg,
    }))
  },

  /**
   * Create API route adapter for OpenAI
   */
  createAPIAdapter: (openaiConfig: any) => {
    return async (request: Request) => {
      const { messages } = await request.json()

      try {
        const response = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiConfig.apiKey}`,
            },
            body: JSON.stringify({
              model: openaiConfig.model || 'gpt-3.5-turbo',
              messages: messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
              })),
              stream: true,
              ...openaiConfig.options,
            }),
          }
        )

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`)
        }

        return response
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: { message: (error as Error).message },
          }),
          { status: 500 }
        )
      }
    }
  },
}

// =============================================================================
// REACT CHATBOT KIT MIGRATION
// =============================================================================

/**
 * Adapter for migrating from react-chatbot-kit
 */
export const ChatbotKitAdapter = {
  /**
   * Convert react-chatbot-kit messages to Clarity format
   */
  convertMessages: (kitMessages: any[]): any[] => {
    return kitMessages.map((msg) => ({
      id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      content: msg.message,
      role: msg.type === 'user' ? 'user' : 'assistant',
      timestamp: msg.timestamp || Date.now(),
      // Preserve kit-specific data
      kit: msg,
    }))
  },

  /**
   * Convert react-chatbot-kit config to Clarity config
   */
  convertConfig: (kitConfig: any) => ({
    header: {
      show: kitConfig.showHeader !== false,
      title: kitConfig.title || 'Chat Assistant',
    },
    input: {
      placeholder: kitConfig.placeholder || 'Type your message...',
    },
    messages: {
      showAvatar: kitConfig.showAvatar !== false,
    },
  }),

  /**
   * Migration component for gradual migration
   */
  MigrationComponent: ({ kitConfig, children, ...props }: any) => {
    const clarityConfig = ChatbotKitAdapter.convertConfig(kitConfig)

    return (
      <ClarityChat {...clarityConfig} {...props}>
        {children}
      </ClarityChat>
    )
  },
}

// =============================================================================
// CUSTOM CHAT IMPLEMENTATIONS MIGRATION
// =============================================================================

/**
 * Adapter for migrating from custom chat implementations
 */
export const CustomAdapter = {
  /**
   * Generic message converter
   */
  convertMessages: (
    messages: any[],
    converters: {
      id?: (msg: any) => string
      content?: (msg: any) => string
      role?: (msg: any) => 'user' | 'assistant' | 'system'
      timestamp?: (msg: any) => number
    } = {}
  ): any[] => {
    return messages.map((msg, index) => ({
      id: converters.id?.(msg) || msg.id || `msg-${Date.now()}-${index}`,
      content:
        converters.content?.(msg) || msg.content || msg.text || msg.message,
      role: converters.role?.(msg) || msg.role || msg.type || 'user',
      timestamp:
        converters.timestamp?.(msg) ||
        msg.timestamp ||
        msg.createdAt ||
        Date.now(),
      // Preserve original message
      original: msg,
    }))
  },

  /**
   * Create API route from existing chat function
   */
  createAPIRoute: (chatFunction: (messages: any[]) => Promise<any>) => {
    return async (request: Request) => {
      try {
        const { messages } = await request.json()

        const response = await chatFunction(messages)

        // Normalize response format
        const normalizedResponse = {
          id: response.id || `msg-${Date.now()}`,
          content: response.content || response.text || response.message,
          role: response.role || 'assistant',
          timestamp: response.timestamp || Date.now(),
          ...response, // Preserve additional fields
        }

        return new Response(JSON.stringify(normalizedResponse))
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: { message: (error as Error).message },
          }),
          { status: 500 }
        )
      }
    }
  },
}

// =============================================================================
// MIGRATION UTILITIES
// =============================================================================

/**
 * Migration progress tracker
 */
export class MigrationTracker {
  private steps: Map<string, { completed: boolean; notes?: string }> = new Map()

  markCompleted(step: string, notes?: string) {
    this.steps.set(step, { completed: true, notes })
  }

  markPending(step: string, notes?: string) {
    this.steps.set(step, { completed: false, notes })
  }

  getProgress(): { completed: number; total: number; steps: any[] } {
    const total = this.steps.size
    const completed = Array.from(this.steps.values()).filter(
      (s) => s.completed
    ).length

    return {
      completed,
      total,
      steps: Array.from(this.steps.entries()).map(([step, status]) => ({
        step,
        ...status,
      })),
    }
  }

  getNextSteps(): string[] {
    return Array.from(this.steps.entries())
      .filter(([, status]) => !status.completed)
      .map(([step]) => step)
  }

  generateReport(): string {
    const progress = this.getProgress()

    let report = `# Migration Report\n\n`
    report += `Progress: ${progress.completed}/${progress.total} steps completed\n\n`

    report += `## Completed Steps\n`
    progress.steps
      .filter((s) => s.completed)
      .forEach((step) => {
        report += `- ✅ ${step.step}\n`
        if (step.notes) report += `  ${step.notes}\n`
      })

    report += `\n## Remaining Steps\n`
    progress.steps
      .filter((s) => !s.completed)
      .forEach((step) => {
        report += `- ⏳ ${step.step}\n`
        if (step.notes) report += `  ${step.notes}\n`
      })

    return report
  }
}

/**
 * Automated migration analyzer
 */
export class MigrationAnalyzer {
  analyzeCode(code: string): {
    library: string | null
    confidence: number
    suggestions: string[]
  } {
    const patterns = {
      'vercel-ai': [/useChat\(/, /from ['"']ai['"']/, /import.*useChat/],
      openai: [/openai\.chat\.completions/, /import.*openai/, /new OpenAI\(/],
      'react-chatbot-kit': [
        /Chatbot/,
        /createChatBotMessage/,
        /react-chatbot-kit/,
      ],
      custom: [/fetch.*chat/, /axios.*chat/, /useState.*messages/],
    }

    let bestMatch = {
      library: null as string | null,
      confidence: 0,
      suggestions: [] as string[],
    }

    Object.entries(patterns).forEach(([library, regexes]) => {
      let matches = 0
      const suggestions: string[] = []

      regexes.forEach((regex) => {
        if (regex.test(code)) {
          matches++
          suggestions.push(`Found ${regex.source} pattern`)
        }
      })

      const confidence = matches / regexes.length
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          library,
          confidence,
          suggestions,
        }
      }
    })

    return bestMatch
  }

  generateMigrationGuide(library: string): string {
    const guides = {
      'vercel-ai': `
# Migrating from Vercel AI SDK

## Key Changes
- Replace \`useChat\` with \`useClarityChat\`
- Update message format handling
- Adjust API route structure

## Migration Steps
1. Replace imports
2. Update hook usage
3. Convert message formats
4. Test streaming functionality

## Code Changes
\`\`\`tsx
// Before
import { useChat } from 'ai/react'
const { messages, input, handleSubmit } = useChat()

// After
import { OpenAIAdapter, useClarityChat } from '@clarity-chat/react'
const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
\`\`\`
      `,
      openai: `
# Migrating from Direct OpenAI API

## Key Changes
- Move API logic to server-side route
- Use Clarity Chat's message format
- Handle streaming responses

## Migration Steps
1. Create API route using OpenAIAdapter
2. Update frontend to use useClarityChat
3. Test error handling and streaming

## Code Changes
\`\`\`tsx
// API Route (app/api/chat/route.ts)

export async function POST(request: Request) {
  return OpenAIAdapter.createAPIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  })(request)
}

// Frontend
const chat = useClarityChat({ api: '/api/chat' })
\`\`\`
      `,
      custom: `
# Migrating from Custom Implementation

## Key Changes
- Standardize message format
- Use built-in hooks and components
- Leverage Clarity Chat's features

## Migration Steps
1. Convert existing messages to Clarity format
2. Replace custom components with Clarity components
3. Add error handling and loading states

## Code Changes
\`\`\`tsx
// Before
const [messages, setMessages] = useState([])

// After
const { messages, append, isLoading, error } = useClarityChat({
  api: '/api/chat'
})
\`\`\`
      `,
    }

    return (
      guides[library as keyof typeof guides] ||
      'No specific guide available for this library.'
    )
  }
}

// =============================================================================
// MIGRATION PRESETS
// =============================================================================

/**
 * Pre-configured migration setups
 */
export const MigrationPresets = {
  /** Migrate from Vercel AI SDK */
  fromVercelAI: (config: { api: string }) => ({
    component: VercelAdapter.MigrationWrapper,
    hook: VercelAdapter.convertChatHook,
    convertMessages: VercelAdapter.convertMessages,
    config,
  }),

  /** Migrate from OpenAI direct usage */
  fromOpenAI: (config: { apiKey: string; model?: string }) => ({
    apiAdapter: OpenAIAdapter.createAPIAdapter(config),
    messageConverter: OpenAIAdapter.convertMessages,
    config,
  }),

  /** Migrate from react-chatbot-kit */
  fromChatbotKit: (config: any) => ({
    component: ChatbotKitAdapter.MigrationComponent,
    configConverter: ChatbotKitAdapter.convertConfig,
    messageConverter: ChatbotKitAdapter.convertMessages,
    config,
  }),

  /** Migrate from custom implementation */
  fromCustom: (config: {
    chatFunction: (...args: any[]) => Promise<any>
    messageConverters?: any
  }) => ({
    apiAdapter: CustomAdapter.createAPIRoute(config.chatFunction),
    messageConverter: (messages: any[]) =>
      CustomAdapter.convertMessages(messages, config.messageConverters),
    config,
  }),
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate migration report
 */
export function generateMigrationReport(
  currentCode: string,
  targetLibrary = 'clarity-chat'
): string {
  const analyzer = new MigrationAnalyzer()
  const analysis = analyzer.analyzeCode(currentCode)

  let report = `# Migration Analysis Report\n\n`

  if (analysis.library) {
    report += `**Detected Library:** ${analysis.library} (${Math.round(analysis.confidence * 100)}% confidence)\n\n`
    report += `## Migration Guide\n\n`
    report += analyzer.generateMigrationGuide(analysis.library)
  } else {
    report += `**No specific library detected.** This appears to be a custom implementation.\n\n`
    report += `## General Migration Steps\n\n`
    report += `1. Identify your current message format\n`
    report += `2. Convert to Clarity Chat message format\n`
    report += `3. Replace UI components with Clarity Chat components\n`
    report += `4. Add error handling and loading states\n`
    report += `5. Test all functionality\n`
  }

  report += `\n## Analysis Details\n\n`
  analysis.suggestions.forEach((suggestion) => {
    report += `- ${suggestion}\n`
  })

  return report
}

/**
 * Quick migration helper
 */
export function migrateQuick(
  from: 'vercel-ai' | 'openai' | 'chatbot-kit' | 'custom',
  config: any
) {
  const preset =
    MigrationPresets[
      `from${from.charAt(0).toUpperCase() + from.slice(1)}` as keyof typeof MigrationPresets
    ]

  if (!preset) {
    throw new Error(`No migration preset available for ${from}`)
  }

  return preset(config)
}
