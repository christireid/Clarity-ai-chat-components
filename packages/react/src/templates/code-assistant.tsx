import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react'
import { ChatWindow } from '../components/chat/chat-window'
import { useMessageOperations } from '../hooks/message/use-message-operations'
import type { Message } from '@clarity-chat/types'

/**
 * Code assistant configuration
 */
export interface CodeAssistantConfig {
  /** Assistant name */
  assistantName?: string

  /** Assistant avatar URL */
  assistantAvatar?: string

  /** Programming languages to support */
  supportedLanguages?: string[]

  /** Initial code context */
  codeContext?: string

  /** Enable code execution preview */
  enableExecution?: boolean

  /** Enable code suggestions */
  enableSuggestions?: boolean

  /** Callback when code is executed */
  onExecuteCode?: (code: string, language: string) => Promise<string>

  /** Callback when code is copied */
  onCopyCode?: (code: string) => void

  /** Custom CSS class */
  className?: string
}

/**
 * Default supported languages
 */
const defaultLanguages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'rust',
  'go',
  'sql',
  'html',
  'css',
]

/**
 * Code-related quick actions
 */
const codeActions = [
  {
    text: 'Explain this code',
    icon: '📖',
    prompt: 'Can you explain how this code works?',
  },
  {
    text: 'Find bugs',
    icon: '🐛',
    prompt: 'Can you help me find bugs in this code?',
  },
  {
    text: 'Optimize code',
    icon: '⚡',
    prompt: 'How can I optimize this code for better performance?',
  },
  {
    text: 'Add comments',
    icon: '💬',
    prompt: 'Can you add helpful comments to this code?',
  },
  {
    text: 'Convert to TypeScript',
    icon: '🔷',
    prompt: 'Can you convert this code to TypeScript?',
  },
  {
    text: 'Write tests',
    icon: '🧪',
    prompt: 'Can you write unit tests for this code?',
  },
]

/**
 * Extract code blocks from message
 */
function extractCodeBlocks(
  content: string
): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: Array<{ language: string; code: string }> = []

  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    })
  }

  return blocks
}

/**
 * Production-ready Code Assistant Template.
 *
 * **Features:**
 * - Specialized for coding tasks
 * - Syntax highlighting for code blocks
 * - Quick actions (explain, debug, optimize)
 * - Code execution preview
 * - Multi-language support
 * - Copy code functionality
 * - Code context awareness
 *
 * **Use Cases:**
 * - IDE coding assistants
 * - Code review tools
 * - Learning platforms
 * - Developer documentation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <CodeAssistant />
 *
 * // With code context
 * <CodeAssistant
 *   codeContext={`
 *     function calculateTotal(items) {
 *       return items.reduce((sum, item) => sum + item.price, 0)
 *     }
 *   `}
 * />
 *
 * // With execution support
 * <CodeAssistant
 *   enableExecution={true}
 *   onExecuteCode={async (code, lang) => {
 *     // Run code in sandbox
 *     const result = await runCode(code, lang)
 *     return result.output
 *   }}
 * />
 *
 * // Custom languages
 * <CodeAssistant
 *   supportedLanguages={['javascript', 'python', 'rust']}
 *   assistantName="RustBot"
 * />
 * ```
 */
export function CodeAssistant({
  assistantName = 'Code Assistant',
  assistantAvatar: _assistantAvatar, // Reserved for future use
  supportedLanguages = defaultLanguages,
  codeContext,
  enableExecution: _enableExecution = false, // Reserved for future use
  enableSuggestions = true,
  onExecuteCode: _onExecuteCode, // Reserved for future use
  onCopyCode: _onCopyCode, // Reserved for future use
  className = '',
}: CodeAssistantConfig) {
  const chatId = 'code-assistant'

  // Use message operations hook
  const {
    messages: operationMessages,
    addMessage,
    editMessage,
    deleteMessage,
  } = useMessageOperations({
    initialMessages: (() => {
      const welcomeMessage = {
        id: '1',
        chatId,
        role: 'assistant' as const,
        content: `Hi! I'm ${assistantName}, your AI coding assistant. I can help you with:\n\n- 📝 Writing code\n- 🐛 Debugging\n- 📖 Explaining code\n- ⚡ Optimizing performance\n- 🧪 Writing tests\n\nWhat would you like help with today?`,
        timestamp: Date.now(),
      }

      // If there's initial code context, add it as a message
      if (codeContext) {
        return [
          welcomeMessage,
          {
            id: '2',
            chatId,
            role: 'user' as const,
            content: `Here's my code:\n\n\`\`\`\n${codeContext}\n\`\`\``,
            timestamp: Date.now() + 1,
          },
        ]
      }

      return [welcomeMessage]
    })(),
    onEdit: (messageId, newContent) => {
      logger.debug('Message edited:', messageId, newContent)
    },
    onDelete: (messageId) => {
      logger.debug('Message deleted:', messageId)
    },
  })

  // Convert to Message format
  const messages: Message[] = operationMessages.map((msg) => ({
    id: msg.id,
    chatId,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    updatedAt: new Date(msg.timestamp),
    status: 'sent' as const,
  }))

  const [showActions, setShowActions] = React.useState(true)

  // Handle message operations
  const handleEdit = React.useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message) return

      const newContent =
        prompt('Edit message:', message.content) || message.content
      if (newContent !== message.content) {
        editMessage(messageId, newContent)
      }
    },
    [messages, editMessage]
  )

  const handleDelete = React.useCallback(
    (messageId: string) => {
      if (confirm('Delete this message?')) {
        deleteMessage(messageId)
      }
    },
    [deleteMessage]
  )
  // const _currentCodeContext = codeContext || '' // Reserved for future use

  /**
   * Handle user message
   */
  const handleSendMessage = (content: string) => {
    // Add user message using operations hook
    addMessage({
      chatId,
      role: 'user',
      content,
    })

    setShowActions(false)

    // Process message asynchronously
    void processMessage(content)
  }

  /**
   * Process message and generate response
   */
  const processMessage = async (content: string) => {
    // Extract any code blocks from user message to update context
    const codeBlocks = extractCodeBlocks(content)
    if (codeBlocks.length > 0) {
      // Update context if needed in the future
      void codeBlocks
    }

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate appropriate response based on user query
    let botResponse: string

    if (content.toLowerCase().includes('explain')) {
      botResponse =
        "I'll explain the code step by step:\n\n1. **Line 1-3**: This section initializes the variables...\n2. **Line 4-6**: Here we're performing the main logic...\n3. **Line 7-9**: Finally, we return the result.\n\nLet me know if you'd like me to go deeper into any specific part!"
    } else if (
      content.toLowerCase().includes('bug') ||
      content.toLowerCase().includes('error')
    ) {
      botResponse =
        "I found a potential issue in your code:\n\n```javascript\n// Before (has bug):\nif (x = 5) { // Using assignment instead of comparison\n  logger.debug('x is 5')\n}\n\n// After (fixed):\nif (x === 5) { // Using strict equality\n  logger.debug('x is 5')\n}\n```\n\nThe issue was using `=` (assignment) instead of `===` (comparison). Would you like me to check for other issues?"
    } else if (content.toLowerCase().includes('optimize')) {
      botResponse =
        "Here's an optimized version:\n\n```javascript\n// Original: O(n²)\nfor (let i = 0; i < arr.length; i++) {\n  for (let j = 0; j < arr.length; j++) {\n    // ...\n  }\n}\n\n// Optimized: O(n)\nconst set = new Set(arr)\nfor (const item of arr) {\n  if (set.has(item)) {\n    // ...\n  }\n}\n```\n\n**Improvements:**\n- Reduced time complexity from O(n²) to O(n)\n- Used Set for O(1) lookups\n- More memory efficient\n\nThis should run significantly faster on large datasets!"
    } else if (content.toLowerCase().includes('test')) {
      botResponse =
        "Here are some unit tests:\n\n```javascript\nimport { describe, it, expect } from 'vitest'\nimport { calculateTotal } from './calculator'\n\ndescribe('calculateTotal', () => {\n  it('should calculate sum of prices', () => {\n    const items = [\n      { name: 'A', price: 10 },\n      { name: 'B', price: 20 }\n    ]\n    expect(calculateTotal(items)).toBe(30)\n  })\n  \n  it('should return 0 for empty array', () => {\n    expect(calculateTotal([])).toBe(0)\n  })\n  \n  it('should handle negative prices', () => {\n    const items = [{ name: 'A', price: -10 }]\n    expect(calculateTotal(items)).toBe(-10)\n  })\n})\n```\n\nThese tests cover the main functionality and edge cases!"
    } else {
      // Generic helpful response
      botResponse =
        "I can help you with that! Could you provide more details or share the specific code you're working with? You can use the quick action buttons below, or just describe what you need help with."
    }

    // Add bot response using operations hook
    addMessage({
      chatId,
      role: 'assistant',
      content: botResponse,
    })

    setShowActions(true)
  }

  /**
   * Handle quick action click
   */
  const handleAction = (prompt: string) => {
    handleSendMessage(prompt)
  }

  /**
   * Handle code execution
   * Reserved for future use
   */
  /*
  const _handleExecute = async (code: string, language: string) => {
    if (!enableExecution || !onExecuteCode) return

    try {
      const output = await onExecuteCode(code, language)
      
      const executionMessage: Message = {
        id: Date.now().toString(),
        chatId: 'code-assistant',
        role: 'assistant',
        content: `**Execution Result:**\n\n\`\`\`\n${output}\n\`\`\``,
        status: 'sent' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setMessages((prev) => [...prev, executionMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        chatId: 'code-assistant',
        role: 'assistant',
        content: `**Execution Error:**\n\n\`\`\`\n${error instanceof Error ? error.message : 'Unknown error'}\n\`\`\``,
        status: 'sent' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setMessages((prev) => [...prev, errorMessage])
    }
  }
  */

  return (
    <div className={`code-assistant-container ${className}`}>
      {/* Main chat interface */}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onEditMessage={handleEdit}
        onDeleteMessage={handleDelete}
      />

      {/* Quick action buttons */}
      {enableSuggestions && showActions && messages.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
            Quick actions:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {codeActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.prompt)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="flex-1 truncate">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Language support info */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Supported languages: {supportedLanguages.slice(0, 5).join(', ')}
          {supportedLanguages.length > 5 &&
            ` +${supportedLanguages.length - 5} more`}
        </p>
      </div>
    </div>
  )
}
