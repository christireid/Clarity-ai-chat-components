'use client'

import { useState, useEffect } from 'react'
import { ChatWindow } from '@clarity-chat/react'
import { CustomerForm } from '@/components/CustomerForm'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

type SupportMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function Home() {
  const { customer, setCustomer } = useStore()
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  if (typeof window === 'undefined') {
    return null
  }

  const hasSupabase = Boolean(supabase)

  // Load conversation history
  useEffect(() => {
    if (hasSupabase && customer?.conversationId) {
      loadConversationHistory(customer.conversationId)
    }
  }, [customer?.conversationId, hasSupabase])

  const loadConversationHistory = async (conversationId: string) => {
    if (!supabase) return

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (data && !error) {
        const formattedMessages: SupportMessage[] = data.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
      }))
      setMessages(formattedMessages)
    }
  }

  const handleCustomerSubmit = async (data: { email: string; name: string; subject: string }) => {
    let conversationId: string | null = null

    if (supabase) {
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
        conversationId = conversation.id
      }
    } else {
      conversationId = Date.now().toString()
    }

    if (conversationId) {
      setCustomer({
        email: data.email,
        name: data.name,
        conversationId,
      })

      const welcomeMessage: SupportMessage = {
        id: '1',
        role: 'assistant',
        content: `Hello ${data.name}! I'm here to help with "${data.subject}". How can I assist you today?`,
        timestamp: Date.now(),
      }

      if (supabase) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: welcomeMessage.content,
        })
      }

      setMessages([welcomeMessage])
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!customer?.conversationId) return

    // Create user message
    const userMessage: SupportMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Save to Supabase
    if (supabase) {
      await supabase.from('messages').insert({
        conversation_id: customer.conversationId,
        role: 'user',
        content,
      })
    }

    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(async () => {
      const aiMessage: SupportMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your message. I understand you're asking about "${content.substring(0, 50)}..."\n\nLet me help you with that. [This would be replaced with actual AI response]`,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Save to Supabase
      if (supabase) {
        await supabase.from('messages').insert({
          conversation_id: customer.conversationId!,
          role: 'assistant',
          content: aiMessage.content,
        })
      }

      // Update conversation timestamp
      if (supabase) {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', customer.conversationId!)
      }

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
