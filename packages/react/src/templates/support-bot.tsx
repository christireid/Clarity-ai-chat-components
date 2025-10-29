import * as React from 'react'
import { ChatWindow } from '../components/chat-window'
import type { Message } from '@clarity-chat/types'

/**
 * Support bot configuration
 */
export interface SupportBotConfig {
  /** Bot name */
  botName?: string
  
  /** Bot avatar URL */
  botAvatar?: string
  
  /** Welcome message */
  welcomeMessage?: string
  
  /** Quick replies/suggested actions */
  quickReplies?: Array<{
    text: string
    action: string
  }>
  
  /** Knowledge base for FAQ */
  knowledgeBase?: Array<{
    question: string
    answer: string
    keywords: string[]
  }>
  
  /** Escalation threshold (messages before offering human agent) */
  escalationThreshold?: number
  
  /** Callback when escalating to human agent */
  onEscalate?: () => void
  
  /** Custom CSS class */
  className?: string
}

/**
 * Default quick replies for support bot
 */
const defaultQuickReplies = [
  { text: 'Track my order', action: 'track_order' },
  { text: 'Return/Refund', action: 'return_refund' },
  { text: 'Account help', action: 'account_help' },
  { text: 'Technical issue', action: 'technical_issue' },
  { text: 'Talk to human', action: 'escalate' },
]

/**
 * Default knowledge base
 */
const defaultKnowledgeBase = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order by going to your account > Orders > Track Order. You can also use your tracking number on our tracking page.',
    keywords: ['track', 'order', 'shipping', 'delivery', 'where is my order'],
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Items must be unused and in original packaging. To start a return, go to your account > Orders > Return Item.',
    keywords: ['return', 'refund', 'exchange', 'send back'],
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page. Enter your email and we\'ll send you a reset link. Check your spam folder if you don\'t see it within 5 minutes.',
    keywords: ['password', 'reset', 'login', 'forgot', 'cant log in'],
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach us via email at support@example.com, phone at 1-800-SUPPORT, or chat with us right here! Our team is available 24/7.',
    keywords: ['contact', 'support', 'help', 'email', 'phone', 'reach'],
  },
]

/**
 * Find best matching answer from knowledge base
 */
function findAnswer(query: string, knowledgeBase: typeof defaultKnowledgeBase): string | null {
  const lowerQuery = query.toLowerCase()
  
  // Score each knowledge base entry
  const scored = knowledgeBase.map((entry) => {
    let score = 0
    
    // Check if keywords match
    entry.keywords.forEach((keyword) => {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += 1
      }
    })
    
    return { entry, score }
  })
  
  // Sort by score and return best match
  scored.sort((a, b) => b.score - a.score)
  
  return scored[0]?.score > 0 ? scored[0].entry.answer : null
}

/**
 * Production-ready Support Bot Template.
 * 
 * **Features:**
 * - Pre-configured for customer support use cases
 * - Built-in knowledge base with FAQ matching
 * - Quick reply buttons for common actions
 * - Smart escalation to human agents
 * - Typing indicators and friendly responses
 * - Tracks conversation context
 * 
 * **Use Cases:**
 * - E-commerce customer support
 * - SaaS help desk
 * - Service chatbots
 * - FAQ automation
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <SupportBot
 *   onEscalate={() => {
 *     // Connect to human agent
 *     connectToAgent()
 *   }}
 * />
 * 
 * // Custom configuration
 * <SupportBot
 *   botName="ShopBot"
 *   botAvatar="/bot-avatar.png"
 *   welcomeMessage="Hi! I'm ShopBot. How can I help you today?"
 *   quickReplies={[
 *     { text: 'Check order status', action: 'track' },
 *     { text: 'Start return', action: 'return' },
 *   ]}
 *   escalationThreshold={5}
 *   onEscalate={() => transferToAgent()}
 * />
 * 
 * // With custom knowledge base
 * <SupportBot
 *   knowledgeBase={[
 *     {
 *       question: 'What is your pricing?',
 *       answer: 'We offer 3 plans: Basic ($9/mo), Pro ($29/mo), Enterprise (custom)',
 *       keywords: ['price', 'cost', 'plan', 'subscription']
 *     }
 *   ]}
 * />
 * ```
 */
export function SupportBot({
  botName: _botName = 'Support Bot', // Reserved for future use
  botAvatar: _botAvatar, // Reserved for future use
  welcomeMessage = "Hi! I'm here to help. What can I assist you with today?",
  quickReplies = defaultQuickReplies,
  knowledgeBase = defaultKnowledgeBase,
  escalationThreshold = 5,
  onEscalate,
  className = '',
}: SupportBotConfig) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      chatId: 'support-bot',
      role: 'assistant',
      content: welcomeMessage,
      status: 'sent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
  
  const [messageCount, setMessageCount] = React.useState(0)
  const [showQuickReplies, setShowQuickReplies] = React.useState(true)

  /**
   * Handle user message
   */
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      chatId: 'support-bot',
      role: 'user',
      content,
      status: 'sent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setMessageCount((prev) => prev + 1)
    setShowQuickReplies(false)

    // Handle async response in separate function
    void processMessage(content)
  }

  /**
   * Process message and generate response
   */
  const processMessage = async (content: string) => {
    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Check if user wants to escalate
    if (
      content.toLowerCase().includes('human') ||
      content.toLowerCase().includes('agent') ||
      content.toLowerCase().includes('person')
    ) {
      const escalateMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId: 'support-bot',
        role: 'assistant',
        content: "I understand you'd like to speak with a human agent. Let me connect you now...",
        status: 'sent' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setMessages((prev) => [...prev, escalateMessage])
      
      if (onEscalate) {
        setTimeout(() => onEscalate(), 1000)
      }
      
      return
    }

    // Try to find answer from knowledge base
    const answer = findAnswer(content, knowledgeBase)
    
    let botResponse: string
    
    if (answer) {
      botResponse = answer
    } else {
      // Fallback responses when no match found
      botResponse = "I'm not sure I understand. Can you please provide more details? Or would you like to speak with a human agent?"
    }

    // Add bot response
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      chatId: 'support-bot',
      role: 'assistant',
      content: botResponse,
      status: 'sent' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    setMessages((prev) => [...prev, botMessage])

    // Check if we should offer escalation
    if (messageCount >= escalationThreshold && !answer) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const escalationOffer: Message = {
        id: (Date.now() + 2).toString(),
        chatId: 'support-bot',
        role: 'assistant',
        content: "It seems like you might benefit from speaking with one of our specialists. Would you like me to connect you with a human agent?",
        status: 'sent' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setMessages((prev) => [...prev, escalationOffer])
    }

    // Show quick replies after bot response
    setShowQuickReplies(true)
  }

  /**
   * Handle quick reply click
   */
  const handleQuickReply = (action: string) => {
    if (action === 'escalate') {
      handleSendMessage('I want to talk to a human agent')
    } else {
      // Map action to user message
      const reply = quickReplies.find((r) => r.action === action)
      if (reply) {
        handleSendMessage(reply.text)
      }
    }
  }

  return (
    <div className={`support-bot-container ${className}`}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
      />
      
      {/* Quick reply buttons */}
      {showQuickReplies && messages.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply.action)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
