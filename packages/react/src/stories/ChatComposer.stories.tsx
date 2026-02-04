import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
  ChatComposer,
  useChatComposerBuilder,
  MinimalChat,
  StandardChat,
  AgentChat,
  FullscreenChat,
  type ChatComposerLayout,
  type ChatComposerFeature,
} from '../components/ai/ChatComposer'

const meta: Meta<typeof ChatComposer> = {
  title: 'Components/AI/ChatComposer',
  component: ChatComposer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Declarative Chat Layout Builder - A composable chat builder with sensible defaults that allows
declaratively assembling chat UIs from clarity-chat components.

## Features
- **Multiple Layout Presets**: standard, split-panel, minimal, fullscreen, and embedded
- **Feature Toggles**: thinking, streaming, tools, suggestions, citations, attachments, voice, welcome
- **Slot-Based Composition**: Header, Messages, Input, Sidebar, Thinking, Tools, Suggestions, Footer
- **Auto-Connection**: Auto-connects to ClarityChatProvider when available
- **Responsive Design**: Customizable breakpoints and mobile-first layouts
- **Animation Support**: Framer Motion animations with reduced motion support
- **Context-Based State**: Managed through React Context for seamless child component access

## Layout Options
- **standard**: Header, Messages, Input stacked vertically (default)
- **split-panel**: Messages on left, Agent panel on right
- **minimal**: Compact layout with just messages and input
- **fullscreen**: Full viewport with optional collapsible sidebar
- **embedded**: For embedding in other UIs

## Feature Flags
- **thinking**: Show thinking indicators and chain-of-thought displays
- **streaming**: Show streaming progress and loading states
- **tools**: Show tool execution cards and results
- **suggestions**: Show suggestion chips and quick actions
- **citations**: Show citation overlays and source links
- **attachments**: Allow file attachments in input
- **voice**: Voice input support
- **welcome**: Show welcome screen when empty
        `,
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['standard', 'split-panel', 'minimal', 'fullscreen', 'embedded'],
      description: 'Layout preset to use',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'comfortable'],
      description: 'Component size variant',
    },
    features: {
      control: 'multi-select',
      options: ['thinking', 'streaming', 'tools', 'suggestions', 'citations', 'attachments', 'voice', 'welcome'],
      description: 'Features to enable',
    },
    autoConnect: {
      control: 'boolean',
      description: 'Auto-connect components to ClarityChatProvider',
    },
    minHeight: {
      control: 'text',
      description: 'Minimum height of the composer',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of the composer',
    },
    showEmptyState: {
      control: 'boolean',
      description: 'Show empty state when no messages',
    },
    defaultSidebarOpen: {
      control: 'boolean',
      description: 'Default sidebar state for split layouts',
    },
  },
}

export default meta
type Story = StoryObj<typeof ChatComposer>

// Mock Components
function MockMessage({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '12px',
        justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: '8px',
          backgroundColor: role === 'user' ? '#0084ff' : '#e0e0e0',
          color: role === 'user' ? 'white' : 'black',
          wordWrap: 'break-word',
        }}
      >
        {content}
      </div>
    </div>
  )
}

function MockHeader() {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', textAlign: 'center' }}>
      <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Chat Assistant</h1>
    </div>
  )
}

function MockSidebar() {
  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', height: '100%' }}>
      <h3 style={{ marginTop: 0 }}>Agent Panel</h3>
      <div style={{ fontSize: '12px', color: '#666' }}>
        <p>Model: GPT-4</p>
        <p>Status: Online</p>
        <p>Tokens: 1,234/4,000</p>
      </div>
    </div>
  )
}

function MockThinkingIndicator() {
  return (
    <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '12px' }}>
      <span>🤔 Thinking...</span>
    </div>
  )
}

function MockToolCard() {
  return (
    <div style={{ padding: '12px', backgroundColor: '#f0f8ff', borderRadius: '4px', marginBottom: '12px' }}>
      <span>🔧 Tool: search_web</span>
      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
        Searching for information...
      </p>
    </div>
  )
}

function MockSuggestions() {
  const suggestions = ['Tell me about...', 'How do I...', 'What is...', 'Explain...']
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
      {suggestions.map((s) => (
        <button
          key={s}
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid #0084ff',
            backgroundColor: 'white',
            color: '#0084ff',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function MockInput() {
  return (
    <div style={{ padding: '12px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px' }}>
      <input
        type="text"
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
        }}
      />
      <button
        style={{
          padding: '8px 16px',
          borderRadius: '4px',
          backgroundColor: '#0084ff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  )
}

// Standard Layout
export const Standard: Story = {
  args: {
    layout: 'standard',
    features: ['thinking', 'streaming', 'tools', 'suggestions'],
    variant: 'default',
    minHeight: 500,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Header>
        <MockHeader />
      </ChatComposer.Header>
      <ChatComposer.Thinking>
        <MockThinkingIndicator />
      </ChatComposer.Thinking>
      <ChatComposer.Messages>
        <MockMessage role="user" content="Hello, how can you help me?" />
        <MockMessage role="assistant" content="I can help you with a wide range of tasks!" />
        <MockMessage role="user" content="Tell me about React Hooks" />
        <MockMessage role="assistant" content="React Hooks allow you to use state and other React features without writing a class component..." />
      </ChatComposer.Messages>
      <ChatComposer.Tools>
        <MockToolCard />
      </ChatComposer.Tools>
      <ChatComposer.Suggestions>
        <MockSuggestions />
      </ChatComposer.Suggestions>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// Split Panel Layout
export const SplitPanel: Story = {
  args: {
    layout: 'split-panel',
    features: ['thinking', 'tools', 'streaming'],
    variant: 'default',
    minHeight: 500,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Header>
        <MockHeader />
      </ChatComposer.Header>
      <ChatComposer.Thinking>
        <MockThinkingIndicator />
      </ChatComposer.Thinking>
      <ChatComposer.Messages>
        <MockMessage role="user" content="Run a search" />
        <MockMessage role="assistant" content="I'll search for that information for you..." />
      </ChatComposer.Messages>
      <ChatComposer.Tools>
        <MockToolCard />
      </ChatComposer.Tools>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
      <ChatComposer.Sidebar position="right" width="320px" collapsible>
        <MockSidebar />
      </ChatComposer.Sidebar>
    </ChatComposer>
  ),
}

// Minimal Layout
export const Minimal: Story = {
  args: {
    layout: 'minimal',
    features: [],
    variant: 'default',
    minHeight: 400,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Messages>
        <MockMessage role="user" content="Hello" />
        <MockMessage role="assistant" content="Hi! How can I help?" />
      </ChatComposer.Messages>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// Fullscreen Layout
export const Fullscreen: Story = {
  args: {
    layout: 'fullscreen',
    features: ['thinking', 'tools', 'suggestions', 'streaming'],
    variant: 'default',
    minHeight: '100vh',
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Header sticky>
        <MockHeader />
      </ChatComposer.Header>
      <ChatComposer.Sidebar collapsible position="left" width="280px">
        <MockSidebar />
      </ChatComposer.Sidebar>
      <ChatComposer.Thinking>
        <MockThinkingIndicator />
      </ChatComposer.Thinking>
      <ChatComposer.Messages>
        <MockMessage role="user" content="Tell me a story" />
        <MockMessage role="assistant" content="Once upon a time in a land far away..." />
        <MockMessage role="user" content="Continue the story" />
        <MockMessage role="assistant" content="...there lived a brave adventurer who set out on a quest..." />
      </ChatComposer.Messages>
      <ChatComposer.Tools>
        <MockToolCard />
      </ChatComposer.Tools>
      <ChatComposer.Suggestions>
        <MockSuggestions />
      </ChatComposer.Suggestions>
      <ChatComposer.Input sticky>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// Embedded Layout
export const Embedded: Story = {
  args: {
    layout: 'embedded',
    features: [],
    variant: 'compact',
    minHeight: 300,
    maxHeight: 400,
  },
  render: (args) => (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <ChatComposer {...args}>
        <ChatComposer.Messages>
          <MockMessage role="user" content="Hi" />
          <MockMessage role="assistant" content="Hello! How can I assist you?" />
        </ChatComposer.Messages>
        <ChatComposer.Input>
          <MockInput />
        </ChatComposer.Input>
      </ChatComposer>
    </div>
  ),
}

// All Features Enabled
export const AllFeaturesEnabled: Story = {
  args: {
    layout: 'standard',
    features: ['thinking', 'streaming', 'tools', 'suggestions', 'citations', 'attachments', 'voice', 'welcome'],
    variant: 'default',
    minHeight: 500,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Header>
        <MockHeader />
      </ChatComposer.Header>
      <ChatComposer.Thinking>
        <MockThinkingIndicator />
      </ChatComposer.Thinking>
      <ChatComposer.Messages>
        <MockMessage role="user" content="What is machine learning?" />
        <MockMessage role="assistant" content="Machine learning is a subset of artificial intelligence... [1]" />
      </ChatComposer.Messages>
      <ChatComposer.Tools>
        <MockToolCard />
      </ChatComposer.Tools>
      <ChatComposer.Suggestions>
        <MockSuggestions />
      </ChatComposer.Suggestions>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// Compact Variant
export const CompactVariant: Story = {
  args: {
    layout: 'standard',
    variant: 'compact',
    features: ['suggestions'],
    minHeight: 400,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Messages>
        <MockMessage role="user" content="Hi" />
        <MockMessage role="assistant" content="Hello!" />
      </ChatComposer.Messages>
      <ChatComposer.Suggestions>
        <MockSuggestions />
      </ChatComposer.Suggestions>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// Comfortable Variant
export const ComfortableVariant: Story = {
  args: {
    layout: 'standard',
    variant: 'comfortable',
    features: ['suggestions', 'thinking'],
    minHeight: 500,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Header>
        <MockHeader />
      </ChatComposer.Header>
      <ChatComposer.Thinking>
        <MockThinkingIndicator />
      </ChatComposer.Thinking>
      <ChatComposer.Messages>
        <MockMessage role="user" content="Tell me about web development" />
        <MockMessage role="assistant" content="Web development involves creating websites and web applications..." />
      </ChatComposer.Messages>
      <ChatComposer.Suggestions>
        <MockSuggestions />
      </ChatComposer.Suggestions>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// WithAllSlots
export const WithAllSlots: Story = {
  args: {
    layout: 'standard',
    features: ['thinking', 'tools', 'suggestions'],
    minHeight: 600,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Header>
        <MockHeader />
      </ChatComposer.Header>
      <ChatComposer.Thinking>
        <MockThinkingIndicator />
      </ChatComposer.Thinking>
      <ChatComposer.Messages>
        <MockMessage role="user" content="What can you do?" />
        <MockMessage role="assistant" content="I can help with many things!" />
      </ChatComposer.Messages>
      <ChatComposer.Tools>
        <MockToolCard />
      </ChatComposer.Tools>
      <ChatComposer.Suggestions>
        <MockSuggestions />
      </ChatComposer.Suggestions>
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
      <ChatComposer.Footer>
        <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#999', borderTop: '1px solid #e0e0e0' }}>
          Powered by Clarity Chat
        </div>
      </ChatComposer.Footer>
    </ChatComposer>
  ),
}

// Interactive Layout Switcher
export const InteractiveLayoutSwitcher: Story = {
  render: () => {
    const [layout, setLayout] = useState<ChatComposerLayout>('standard')
    const [features, setFeatures] = useState<ChatComposerFeature[]>(['thinking', 'tools', 'suggestions'])

    const layouts: ChatComposerLayout[] = ['standard', 'split-panel', 'minimal', 'fullscreen', 'embedded']

    return (
      <div>
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>Layout:</strong>
            {layouts.map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                style={{
                  marginLeft: '8px',
                  padding: '6px 12px',
                  backgroundColor: layout === l ? '#0084ff' : '#ddd',
                  color: layout === l ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <div>
            <strong>Features:</strong>
            {(['thinking', 'tools', 'suggestions', 'streaming'] as const).map((feature) => (
              <label key={feature} style={{ marginLeft: '12px', marginRight: '12px' }}>
                <input
                  type="checkbox"
                  checked={features.includes(feature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFeatures([...features, feature])
                    } else {
                      setFeatures(features.filter((f) => f !== feature))
                    }
                  }}
                />
                {' ' + feature}
              </label>
            ))}
          </div>
        </div>

        <ChatComposer layout={layout} features={features} minHeight={layout === 'fullscreen' ? '100vh' : 500}>
          {layout !== 'minimal' && layout !== 'embedded' && (
            <ChatComposer.Header>
              <MockHeader />
            </ChatComposer.Header>
          )}
          {features.includes('thinking') && (
            <ChatComposer.Thinking>
              <MockThinkingIndicator />
            </ChatComposer.Thinking>
          )}
          <ChatComposer.Messages>
            <MockMessage role="user" content="Hello!" />
            <MockMessage role="assistant" content="Hi there! How can I help?" />
          </ChatComposer.Messages>
          {features.includes('tools') && (
            <ChatComposer.Tools>
              <MockToolCard />
            </ChatComposer.Tools>
          )}
          {features.includes('suggestions') && (
            <ChatComposer.Suggestions>
              <MockSuggestions />
            </ChatComposer.Suggestions>
          )}
          <ChatComposer.Input>
            <MockInput />
          </ChatComposer.Input>
          {layout === 'split-panel' && (
            <ChatComposer.Sidebar position="right" width="320px" collapsible>
              <MockSidebar />
            </ChatComposer.Sidebar>
          )}
        </ChatComposer>
      </div>
    )
  },
}

// With Sidebar Toggle
export const WithSidebarToggle: Story = {
  args: {
    layout: 'split-panel',
    features: ['tools'],
    minHeight: 500,
    defaultSidebarOpen: true,
  },
  render: (args) => {
    const [sidebarOpen, setSidebarOpen] = useState(args.defaultSidebarOpen)

    return (
      <div>
        <div style={{ marginBottom: '12px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#0084ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? 'Close' : 'Open'} Sidebar
          </button>
        </div>

        <ChatComposer
          {...args}
          sidebarOpen={sidebarOpen}
          onSidebarOpenChange={setSidebarOpen}
        >
          <ChatComposer.Messages>
            <MockMessage role="user" content="Show me the sidebar" />
            <MockMessage role="assistant" content="Here's the agent panel on the right!" />
          </ChatComposer.Messages>
          <ChatComposer.Tools>
            <MockToolCard />
          </ChatComposer.Tools>
          <ChatComposer.Input>
            <MockInput />
          </ChatComposer.Input>
          <ChatComposer.Sidebar position="right" width="320px" collapsible>
            <MockSidebar />
          </ChatComposer.Sidebar>
        </ChatComposer>
      </div>
    )
  },
}

// Prebuilt Layouts
export const PrebuiltMinimalChat: Story = {
  render: () => (
    <MinimalChat>
      <MockMessage role="user" content="Hello" />
      <MockMessage role="assistant" content="Hi!" />
    </MinimalChat>
  ),
}

export const PrebuiltStandardChat: Story = {
  render: () => (
    <StandardChat>
      <MockMessage role="user" content="What can you help with?" />
      <MockMessage role="assistant" content="I can help with various tasks!" />
    </StandardChat>
  ),
}

export const PrebuiltAgentChat: Story = {
  render: () => (
    <AgentChat>
      <MockMessage role="user" content="Run a search" />
      <MockMessage role="assistant" content="Searching..." />
    </AgentChat>
  ),
}

// Empty State
export const EmptyState: Story = {
  args: {
    layout: 'standard',
    features: ['welcome'],
    showEmptyState: true,
    emptyState: (
      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
        <h2>Welcome!</h2>
        <p>Start a conversation by typing a message below.</p>
      </div>
    ),
    minHeight: 500,
  },
  render: (args) => (
    <ChatComposer {...args}>
      <ChatComposer.Messages />
      <ChatComposer.Input>
        <MockInput />
      </ChatComposer.Input>
    </ChatComposer>
  ),
}

// Long Conversation
export const LongConversation: Story = {
  args: {
    layout: 'standard',
    features: ['thinking', 'suggestions'],
    minHeight: 500,
  },
  render: (args) => {
    const messages = Array.from({ length: 20 }, (_, i) => (
      <MockMessage
        key={i}
        role={i % 2 === 0 ? 'user' : 'assistant'}
        content={i % 2 === 0 ? `Message from user ${i}` : `Response from assistant ${i}`}
      />
    ))

    return (
      <ChatComposer {...args}>
        <ChatComposer.Messages>
          {messages}
        </ChatComposer.Messages>
        <ChatComposer.Thinking>
          <MockThinkingIndicator />
        </ChatComposer.Thinking>
        <ChatComposer.Suggestions>
          <MockSuggestions />
        </ChatComposer.Suggestions>
        <ChatComposer.Input>
          <MockInput />
        </ChatComposer.Input>
      </ChatComposer>
    )
  },
}
