import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Integration Guide - Clarity Chat',
  description: 'Complete guide for integrating Clarity Chat into your application.',
}

export default function IntegrationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Integration Guide</h1>
        <p className="docs-lead">
          Complete guide for integrating Clarity Chat into your application.
        </p>
      </div>

      <section className="docs-section">
        <h2>Quick Start</h2>

        <h3>Installation</h3>
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react`}
        />

        <h3>Basic Setup</h3>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </ThemeProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Component Integration</h2>

        <h3>Enhanced Markdown Rendering</h3>
        <CodeBlock
          language="tsx"
          code={`import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

<EnhancedMarkdownRenderer
  content={markdownContent}
  config={{
    enableKaTeX: true,
    enableMermaid: true,
    enableSyntaxHighlight: true,
  }}
  isStreaming={isStreaming}
/>`}
        />

        <h3>Prompt Suggestions</h3>
        <CodeBlock
          language="tsx"
          code={`import { PromptSuggestions, usePromptSuggestions } from '@clarity-chat/react'

const suggestions = usePromptSuggestions(messages)
<PromptSuggestions
  suggestions={suggestions}
  onSelect={(s) => sendMessage(s.text)}
  layout="chips"
/>`}
        />

        <h3>Advanced Search</h3>
        <CodeBlock
          language="tsx"
          code={`import { AdvancedMessageSearch } from '@clarity-chat/react'

<AdvancedMessageSearch
  messages={messages}
  enableAdvancedFilters
  onResultsChange={setFiltered}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration</h2>

        <h3>Using Configuration Builder</h3>
        <CodeBlock
          language="tsx"
          code={`import { createChatConfig } from '@clarity-chat/react'

const config = createChatConfig()
  .withStreaming({
    provider: 'openai',
    endpoint: '/api/chat',
    retryPolicy: 'exponential',
  })
  .withAccessibility({
    screenReader: true,
    keyboardNav: true,
  })
  .build()`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/guides/getting-started">Getting Started</a> - Learn the basics</li>
          <li><a href="/guides/best-practices">Best Practices</a> - Best practices guide</li>
          <li><a href="/integrations/nextjs">Next.js Integration</a> - Framework-specific guide</li>
        </ul>
      </section>
    </div>
  )
}
