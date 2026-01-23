/**
 * DX Showcase - Developer Experience Examples
 *
 * This file demonstrates all the DX improvements made to Clarity Chat,
 * showing how easy it is to get started and configure for different use cases.
 */

import * as React from 'react'
import {
  // Core components
  ClarityChat,
  ClarityChatPresets,

  // Ultra-simple APIs
  chat,
  chatWithMemory,
  enterpriseChat,
  streamingChat,
  ChatBuilder,
  ChatPresets,

  // Development helpers
  QuickStartTemplates,
  showQuickStart,
  SetupWizard,
  QuickSetup,
  interactiveSetup,

  // Hooks
  useClarityChat,

  // UI components
  ChatWindow,
} from '../index'

// Import styles (only needed once)
import '../styles/index.css'

// ============================================================================
// LEVEL 1: ULTRA-SIMPLE (1-3 lines)
// ============================================================================

/**
 * The simplest possible chat - just an API endpoint!
 */
export function SimplestChat() {
  return chat('/api/chat')
}

/**
 * Chat with memory enabled
 */
export function SimpleChatWithMemory() {
  return chat('/api/chat', { memory: true })
}

/**
 * Enterprise chat with all features
 */
export function SimpleEnterpriseChat() {
  return chat('/api/chat', { enterprise: true })
}

/**
 * Streaming chat
 */
export function SimpleStreamingChat() {
  return chat('/api/chat', { streaming: true })
}

// ============================================================================
// LEVEL 2: PRESETS (2-5 lines)
// ============================================================================

/**
 * Using named presets for common scenarios
 */
export function PresetExamples() {
  return (
    <div>
      {/* Minimal chat */}
      {ChatPresets.Minimal('/api/chat')}

      {/* Chat with memory */}
      {ChatPresets.WithMemory('/api/chat')}

      {/* Enterprise features */}
      {ChatPresets.Enterprise('/api/chat')}

      {/* Customer support optimized */}
      {ChatPresets.Support('/api/chat')}

      {/* Technical questions optimized */}
      {ChatPresets.Technical('/api/chat')}
    </div>
  )
}

// ============================================================================
// LEVEL 3: COMPONENT PRESETS (5-10 lines)
// ============================================================================

/**
 * Using component presets for more control
 */
export function ComponentPresetExamples() {
  return (
    <div>
      {/* Basic chat */}
      <ClarityChatPresets.Simple api="/api/chat" />

      {/* With memory */}
      <ClarityChatPresets.WithMemory
        api="/api/chat"
        memoryStrategy="vector-store"
      />

      {/* Enterprise */}
      <ClarityChatPresets.Enterprise
        api="/api/chat"
        sessionTitle="Enterprise Assistant"
      />

      {/* Streaming */}
      <ClarityChatPresets.Streaming
        api="/api/chat"
        useWebSocket={false}
      />
    </div>
  )
}

// ============================================================================
// LEVEL 4: BUILDER PATTERN (Fluent API)
// ============================================================================

/**
 * Using the builder pattern for custom configurations
 */
export function BuilderExamples() {
  return (
    <div>
      {/* Basic memory chat */}
      {ChatBuilder.create('/api/chat')
        .withMemory('sliding-window')
        .build()}

      {/* Advanced configuration */}
      {ChatBuilder.create('/api/chat')
        .withMemory('vector-store')
        .withHeader('My Chat Assistant')
        .withStreaming()
        .withRateLimiting(true)
        .withPrompts(['Hello!', 'How can I help?'])
        .build()}

      {/* Enterprise setup */}
      {ChatBuilder.create('/api/chat')
        .withMemory('vector-store')
        .withHeader('Enterprise Assistant', 'subtitle')
        .withStreaming()
        .withRateLimiting(true)
        .withErrorHandling()
        .build()}
    </div>
  )
}

// ============================================================================
// LEVEL 5: FULL CONTROL (Hooks + Components)
// ============================================================================

/**
 * Full control with hooks and custom components
 */
export function FullControlExample() {
  const { messages, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true, strategy: 'vector-store' },
    promptOptimization: { enabled: true },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      error={error}
      onSendMessage={(content) => append({ role: 'user', content })}
      header={{
        show: true,
        title: 'Custom Chat',
        showMessageCount: true
      }}
      messageActions={{
        onCopy: (id, content) => console.log('Copied:', content),
        onFeedback: (id, type) => console.log('Feedback:', type),
      }}
      prompts={{
        starterPrompts: [
          { text: 'Hello!', category: 'greeting' },
          { text: 'How can I help?', category: 'support' }
        ]
      }}
    />
  )
}

// ============================================================================
// LEVEL 6: SETUP WIZARD EXAMPLES
// ============================================================================

/**
 * Using the setup wizard programmatically
 */
export function SetupWizardExamples() {
  // Quick setup for common cases
  const basicConfig = QuickSetup.basic('/api/chat')
  const memoryConfig = QuickSetup.withMemory('/api/chat', 'vector-store')
  const enterpriseConfig = QuickSetup.enterprise('/api/chat')
  const streamingConfig = QuickSetup.streaming('/api/chat', 'websocket')

  // Custom wizard
  const customWizard = SetupWizard.start()
    .forUseCase('enterprise')
    .withApi('/api/chat')
    .withCustomizations('custom-header', 'advanced-memory')
    .complete()

  return (
    <div>
      {/* Use the generated configurations */}
      {basicConfig.code && <div dangerouslySetInnerHTML={{ __html: basicConfig.code }} />}
    </div>
  )
}

// ============================================================================
// LEVEL 7: DEVELOPMENT HELPERS
// ============================================================================

/**
 * Using development helpers for better DX
 */
export function DevelopmentHelpersExample() {
  // Show quick start templates
  React.useEffect(() => {
    showQuickStart('basic')
    showQuickStart('enterprise')
  }, [])

  // Use development logging
  const handleSend = (content: string) => {
    devLog.info('Sending message:', content)
    // ... send logic
  }

  return (
    <ClarityChat
      api="/api/chat"
      onSendMessage={handleSend}
    />
  )
}

// ============================================================================
// UTILITY EXPORTS FOR TESTING DX
// ============================================================================

/**
 * Export all examples for testing and documentation
 */
export const DXExamples = {
  SimplestChat,
  SimpleChatWithMemory,
  SimpleEnterpriseChat,
  SimpleStreamingChat,
  PresetExamples,
  ComponentPresetExamples,
  BuilderExamples,
  FullControlExample,
  SetupWizardExamples,
  DevelopmentHelpersExample,
}

/**
 * Quick start guide that runs in development
 */
export function showDXGuide() {
  console.log('🚀 Clarity Chat Developer Experience Guide')
  console.log('=' .repeat(50))
  console.log('')
  console.log('🎯 Getting Started (Choose your level):')
  console.log('')
  console.log('1. ULTRA-SIMPLE (1 line):')
  console.log('   chat("/api/chat")')
  console.log('')
  console.log('2. PRESETS (2 lines):')
  console.log('   ChatPresets.Enterprise("/api/chat")')
  console.log('')
  console.log('3. BUILDER (fluent API):')
  console.log('   ChatBuilder.create("/api/chat").withMemory("vector-store").build()')
  console.log('')
  console.log('4. FULL CONTROL (hooks + components):')
  console.log('   const { messages, append } = useClarityChat({ api: "/api/chat" })')
  console.log('')
  console.log('🛠️  Development Tools:')
  console.log('   • QuickSetup.basic("/api/chat") - Interactive setup')
  console.log('   • showQuickStart("enterprise") - Code templates')
  console.log('   • devLog.info("debug message") - Development logging')
  console.log('')
  console.log('📚 Examples in this file:')
  Object.keys(DXExamples).forEach(name => {
    console.log(`   • ${name}`)
  })
}

// Auto-show guide in development
if (typeof window !== 'undefined' && process.env['NODE_ENV'] === 'development') {
  setTimeout(showDXGuide, 1000)
}