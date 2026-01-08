'use client'

import React, { useState, useEffect } from 'react'
import { StreamingTextRenderer } from '@clarity-chat/react/internal'
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { Callout } from '@/components/MDX/Callout'

function BasicStreamingDemo() {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const fullText =
    'Here is a streaming response that simulates how an LLM would generate text token by token. Notice the cursor effect!'

  const startStream = () => {
    setText('')
    setIsStreaming(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setText(fullText.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 30)
  }

  return (
    <div className="w-full max-w-lg p-6 border border-border rounded-lg bg-background">
      <div className="mb-4 min-h-[80px] font-mono text-sm">
        <StreamingTextRenderer
          text={text}
          isStreaming={isStreaming}
          cursor="▋"
        />
      </div>
      <button
        onClick={startStream}
        disabled={isStreaming}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {isStreaming ? 'Streaming...' : 'Start Stream'}
      </button>
    </div>
  )
}

const props: Prop[] = [
  {
    name: 'text',
    type: 'string',
    required: true,
    description: 'The content to render.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description: 'Whether streaming is active. Controls cursor visibility.',
  },
  {
    name: 'cursor',
    type: 'string',
    default: '"▋"',
    description: 'Custom cursor character.',
  },
  {
    name: 'cursorClassName',
    type: 'string',
    description: 'CSS class for the cursor element.',
  },
  {
    name: 'fade',
    type: 'boolean',
    default: 'false',
    description: 'Enable fade-in animation for new tokens.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
]

export default function StreamingTextRendererPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            StreamingTextRenderer
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A low-level component for rendering text streams with customizable
            cursor effects. The engine behind <code>StreamingMessage</code>.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ViewInStorybook component="StreamingTextRenderer" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <Callout type="info" className="mb-8">
          <p>
            <strong>Note:</strong> Most users should use{' '}
            <a href="/reference/components/streaming-message">
              StreamingMessage
            </a>{' '}
            which handles markdown, tools, and layout. Use{' '}
            <code>StreamingTextRenderer</code> only for raw text output or
            custom implementations.
          </p>
        </Callout>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="basic-usage">Basic Usage</h2>
        <ComponentPreview
          title="Streaming Demo"
          description="Simulated token stream with cursor."
          code={`import { useState } from 'react'
import { StreamingTextRenderer } from '@clarity-chat/react/internal'

function Demo() {
  const [text, setText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  // ... streaming logic ...

  return (
    <StreamingTextRenderer 
      text={text} 
      isStreaming={isStreaming}
    />
  )
}`}
        >
          <BasicStreamingDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <CodePlayground
            initialCode={`function Example() {
  const [text, setText] = React.useState('Generating response')
  const [tick, setTick] = React.useState(0)

  // Simulate streaming
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => (t + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-lg font-medium p-4">
      <StreamingTextRenderer 
        text={text + '.'.repeat(tick)} 
        isStreaming={true}
        cursor="|"
        cursorClassName="text-blue-500 animate-pulse"
      />
    </div>
  )
}

render(<Example />)`}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <h2 id="props">Props</h2>
        <PropsTable props={props} />
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <h2 id="customization">Customization</h2>
        <p className="mb-4">
          You can customize the cursor appearance and behavior:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`<StreamingTextRenderer
  text={content}
  isStreaming={true}
  cursor="█"
  cursorClassName="text-brand-500 opacity-50"
  className="font-mono text-sm"
/>`}
        />
      </ScrollReveal>
    </div>
  )
}
