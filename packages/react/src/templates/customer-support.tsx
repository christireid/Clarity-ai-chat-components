/**
 * Customer Support Chat Template
 * 
 * Pre-configured chat interface for customer support scenarios
 */

import React, { useState } from 'react'
import { ChatWindow } from '../components/chat-window'
import { ThemeProvider } from '../theme/ThemeProvider'
import { corporateTheme } from '../theme/presets'
import type { Message } from '@clarity-chat/types'

export interface CustomerSupportTemplateProps {
  companyName?: string
  supportCategories?: string[]
  faqs?: Array<{ question: string; answer: string }>
  onEscalate?: (conversation: Message[]) => void
  apiEndpoint?: string
}

/**
 * Customer Support Chat Template
 * 
 * Features:
 * - Professional corporate theme
 * - FAQ quick responses
 * - Escalation to human agent
 * - Ticket creation
 * - Order lookup capabilities
 * 
 * @example
 * ```tsx
 * <CustomerSupportTemplate
 *   companyName="Acme Corp"
 *   supportCategories={['Orders', 'Returns', 'Technical']}
 *   onEscalate={(conversation) => console.log('Escalate:', conversation)}
 * />
 * ```
 */
export function CustomerSupportTemplate({
  companyName = 'Support',
  supportCategories = ['General', 'Orders', 'Technical', 'Billing'],
  faqs = [],
  onEscalate,
  apiEndpoint = '/api/support',
}: CustomerSupportTemplateProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to ${companyName} Support! How can I help you today?\n\nYou can ask me about:\n${supportCategories.map(cat => `• ${cat}`).join('\n')}`,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Check for escalation keywords
    const escalationKeywords = ['human', 'agent', 'representative', 'manager']
    const needsEscalation = escalationKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    )

    if (needsEscalation && onEscalate) {
      const escalationMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'ll connect you with a human agent right away. Please wait a moment...',
        timestamp: new Date(),
        metadata: { type: 'escalation' },
      }
      setMessages(prev => [...prev, escalationMessage])
      onEscalate([...messages, userMessage])
      setIsLoading(false)
      return
    }

    // Check FAQs
    const matchedFaq = faqs.find(faq => 
      content.toLowerCase().includes(faq.question.toLowerCase())
    )

    if (matchedFaq) {
      const faqResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: matchedFaq.answer,
        timestamp: new Date(),
        metadata: { type: 'faq' },
      }
      setMessages(prev => [...prev, faqResponse])
      setIsLoading(false)
      return
    }

    try {
      // Call support API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          category: detectCategory(content, supportCategories),
          conversation: messages,
        }),
      })

      if (!response.ok) throw new Error('Support API error')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I understand your concern. Let me help you with that.',
        timestamp: new Date(),
        metadata: data.metadata,
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I appreciate your patience. Let me look into that for you. Meanwhile, you can always request to speak with a human agent.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ThemeProvider theme={corporateTheme}>
      <div className="customer-support-template" style={{ height: '100%', width: '100%' }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          emptyState={
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">How can we help?</h3>
              <div className="grid gap-2 max-w-md mx-auto">
                {supportCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleSendMessage(`I need help with ${category}`)}
                    className="p-3 text-left rounded-lg border hover:bg-accent transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          }
        />
      </div>
    </ThemeProvider>
  )
}

function detectCategory(message: string, categories: string[]): string {
  const lowerMessage = message.toLowerCase()
  
  for (const category of categories) {
    if (lowerMessage.includes(category.toLowerCase())) {
      return category
    }
  }
  
  // Category-specific keywords
  if (lowerMessage.includes('order') || lowerMessage.includes('shipping')) {
    return 'Orders'
  }
  if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    return 'Returns'
  }
  if (lowerMessage.includes('payment') || lowerMessage.includes('charge')) {
    return 'Billing'
  }
  if (lowerMessage.includes('broken') || lowerMessage.includes('not working')) {
    return 'Technical'
  }
  
  return 'General'
}