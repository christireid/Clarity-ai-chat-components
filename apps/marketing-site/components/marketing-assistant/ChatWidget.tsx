'use client'

import { FloatingChatWidget } from '@clarity-chat/react/components/chat/floating-chat-widget'
import { marketingPersona } from '../../lib/marketing-persona'

export default function MarketingAssistant() {
  return (
    <FloatingChatWidget 
      title="Aura"
      subtitle="AI Specialist • Online"
      initialMessage={marketingPersona.initialMessage}
      // In a real app, this would be passed to the backend via a secure context or config
      // For this demo widget, we're assuming the backend /api/chat route handles the system prompt
      // based on a 'persona' body param or similar.
      memoryConfig={{
        enabled: true,
        strategy: 'vector-store', // Demo the advanced memory capability
        maxTokens: 2000
      }}
      optimizationConfig={{
        enabled: true,
        targetTokens: 1000, // Aggressive optimization for the demo to show speed
        strategy: 'hybrid'
      }}
    />
  )
}
