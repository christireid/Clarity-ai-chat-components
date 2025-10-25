'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { CustomerForm } from '@/components/CustomerForm'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const { customer, setCustomer } = useStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load conversation history
  useEffect(() => {
    if (customer?.conversationId) {
      loadConversationHistory(customer.conversationId)
    }
  }, [customer?.conversationId])

  const loadConversationHistory = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (data && !error) {
      const formattedMessages: Message[] = data.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
      }))
      setMessages(formattedMessages)
    }
  }

  const handleCustomerSubmit = async (data: { email: string; name: string; subject: string }) => {
    // Create conversation in Supabase
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        customer_email: data.email,
        customer_name: data.name,
        subject: data.subject,
        status: 'open',
        priority: 'medium',
      })
      .select()
      .single()

    if (conversation && !error) {
      setCustomer({
        email: data.email,
        name: data.name,
        conversationId: conversation.id,
      })

      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: `Hello ${data.name}! I'm here to help with "${data.subject}". How can I assist you today?`,
        timestamp: Date.now(),
      }

      // Save to Supabase
      await supabase.from('messages').insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: welcomeMessage.content,
      })

      setMessages([welcomeMessage])
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!customer?.conversationId) return

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Save to Supabase
    await supabase.from('messages').insert({
      conversation_id: customer.conversationId,
      role: 'user',
      content,
    })

    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(async () => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your message. I understand you're asking about "${content.substring(0, 50)}..."\n\nLet me help you with that. [This would be replaced with actual AI response]`,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Save to Supabase
      await supabase.from('messages').insert({
        conversation_id: customer.conversationId!,
        role: 'assistant',
        content: aiMessage.content,
      })

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', customer.conversationId!)

      setIsLoading(false)
    }, 2000)
  }

  if (!customer) {
    return (
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
      }}>
        <CustomerForm onSubmit={handleCustomerSubmit} />
      </main>
    )
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        marginBottom: '1rem',
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
        }}>
          Customer Support Chat
        </h1>
        <p style={{
          color: 'var(--foreground)',
          opacity: 0.7,
          fontSize: '0.875rem',
        }}>
          Conversation with {customer.name} ({customer.email})
        </p>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '900px',
        height: '600px',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </div>
    </main>
  )
}
