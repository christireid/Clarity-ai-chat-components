import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Plugin System - Clarity Chat',
  description: 'Extend Clarity Chat with custom plugins to add functionality, integrate with third-party services, or customize behavior.',
}

export default function PluginsGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Plugin System</h1>
        <p className="docs-lead">
          Extend Clarity Chat with custom plugins to add functionality, integrate with third-party services, or customize behavior.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The plugin system allows you to:
        </p>
        <ul>
          <li>Create custom plugins for specific functionality</li>
          <li>Hook into chat lifecycle events</li>
          <li>Extend components and hooks</li>
          <li>Share plugins with the community</li>
          <li>Manage plugin dependencies</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Creating a Plugin</h2>

        <h3>Basic Plugin Structure</h3>
        <CodeBlock
          language="tsx"
          code={`import { Plugin, PluginContext } from '@clarity-chat/react'

const myPlugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom plugin',
  
  initialize(context: PluginContext) {
    console.log('Plugin initialized')
  },
  
  cleanup() {
    console.log('Plugin cleaned up')
  },
}`}
        />

        <h3>Plugin with Hooks</h3>
        <CodeBlock
          language="tsx"
          code={`const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  
  hooks: {
    // Called after a message is sent
    afterSendMessage: async (message, context) => {
      await analytics.track('message_sent', {
        messageId: message.id,
        content: message.content,
        userId: context.userId,
      })
    },
    
    // Called after a message is received
    afterReceiveMessage: async (message, context) => {
      await analytics.track('message_received', {
        messageId: message.id,
        userId: context.userId,
      })
    },
    
    // Called before sending a message
    beforeSendMessage: async (message, context) => {
      // Modify message before sending
      return {
        ...message,
        metadata: {
          ...message.metadata,
          timestamp: Date.now(),
        },
      }
    },
  },
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Using Plugins</h2>

        <h3>Register a Plugin</h3>
        <CodeBlock
          language="tsx"
          code={`import { PluginManager } from '@clarity-chat/react'

const pluginManager = new PluginManager()

// Register a plugin
pluginManager.register(analyticsPlugin)

// Initialize all plugins
await pluginManager.initialize()`}
        />

        <h3>Use with Chat</h3>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, PluginProvider } from '@clarity-chat/react'

function App() {
  const pluginManager = new PluginManager()
  pluginManager.register(analyticsPlugin)
  
  return (
    <PluginProvider manager={pluginManager}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </PluginProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Available Hooks</h2>

        <h3>Message Hooks</h3>
        <ul>
          <li><code>beforeSendMessage</code> - Called before sending a message</li>
          <li><code>afterSendMessage</code> - Called after sending a message</li>
          <li><code>beforeReceiveMessage</code> - Called before receiving a message</li>
          <li><code>afterReceiveMessage</code> - Called after receiving a message</li>
          <li><code>onMessageError</code> - Called when a message error occurs</li>
        </ul>

        <h3>Lifecycle Hooks</h3>
        <ul>
          <li><code>onChatStart</code> - Called when chat starts</li>
          <li><code>onChatEnd</code> - Called when chat ends</li>
          <li><code>onStreamStart</code> - Called when streaming starts</li>
          <li><code>onStreamEnd</code> - Called when streaming ends</li>
        </ul>

        <h3>Component Hooks</h3>
        <ul>
          <li><code>renderMessage</code> - Customize message rendering</li>
          <li><code>renderInput</code> - Customize input rendering</li>
          <li><code>renderToolbar</code> - Customize toolbar rendering</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Example Plugins</h2>

        <h3>Analytics Plugin</h3>
        <CodeBlock
          language="tsx"
          code={`const analyticsPlugin: Plugin = {
  name: 'analytics',
  version: '1.0.0',
  
  hooks: {
    afterSendMessage: async (message) => {
      await trackEvent('message_sent', {
        messageId: message.id,
        length: message.content.length,
      })
    },
    
    afterReceiveMessage: async (message) => {
      await trackEvent('message_received', {
        messageId: message.id,
        responseTime: message.metadata?.responseTime,
      })
    },
  },
}`}
        />

        <h3>Logging Plugin</h3>
        <CodeBlock
          language="tsx"
          code={`const loggingPlugin: Plugin = {
  name: 'logging',
  version: '1.0.0',
  
  hooks: {
    beforeSendMessage: async (message) => {
      console.log('[Chat] Sending:', message.content)
    },
    
    afterReceiveMessage: async (message) => {
      console.log('[Chat] Received:', message.content)
    },
    
    onMessageError: async (error, context) => {
      console.error('[Chat] Error:', error, context)
    },
  },
}`}
        />

        <h3>Rate Limiting Plugin</h3>
        <CodeBlock
          language="tsx"
          code={`const rateLimitPlugin: Plugin = {
  name: 'rate-limit',
  version: '1.0.0',
  
  hooks: {
    beforeSendMessage: async (message, context) => {
      const canSend = await checkRateLimit(context.userId)
      
      if (!canSend) {
        throw new Error('Rate limit exceeded')
      }
    },
  },
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Version Your Plugins</strong>: Use semantic versioning</li>
          <li><strong>Handle Errors</strong>: Always handle errors gracefully</li>
          <li><strong>Document Dependencies</strong>: Declare plugin dependencies</li>
          <li><strong>Test Plugins</strong>: Test plugins in isolation</li>
          <li><strong>Performance</strong>: Keep plugin hooks lightweight</li>
          <li><strong>Async Operations</strong>: Use async/await for async operations</li>
          <li><strong>Cleanup</strong>: Implement cleanup logic</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/plugins">Plugin API Reference</a> - Complete plugin API</li>
          <li><a href="/examples/plugins">Plugin Examples</a> - More plugin examples</li>
        </ul>
      </section>
    </div>
  )
}
