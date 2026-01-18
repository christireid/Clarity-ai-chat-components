// TODO: AdvancedChatInput, MessageAttachment, SavedPrompt, and InputSuggestion are planned
// but not yet implemented in @clarity-chat/react. This page documents the intended API.

'use client'

import { useState, useCallback } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import { AdvancedChatInput } from '@clarity-chat/react'
// import type {
//   MessageAttachment,
//   SavedPrompt,
//   InputSuggestion,
// } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// Placeholder type definitions until component is implemented
interface MessageAttachment {
  id: string
  type: 'image' | 'video' | 'document' | 'audio' | 'link'
  url: string
  name: string
  size?: number
  mimeType?: string
  thumbnail?: string
}

interface SavedPrompt {
  id: string
  userId: string
  name: string
  content: string
  description?: string
  category?: string
  tags: string[]
  variables: unknown[]
  usageCount: number
  lastUsed?: Date
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

// Placeholder demo component - shows Coming Soon notice
function BasicAdvancedInputDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">AdvancedChatInput is planned but not yet implemented.</p>
      </div>
    </div>
  )
}

// Placeholder demo component
function FileUploadDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background p-8 text-center">
      <div className="text-muted-foreground">
        <p className="font-medium mb-2">Coming Soon</p>
        <p className="text-sm">File upload functionality will be available when AdvancedChatInput is implemented.</p>
      </div>
    </div>
  )
}

const advancedChatInputProps: Prop[] = [
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current input value (controlled component).',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: true,
    description: 'Callback function called when the input value changes.',
  },
  {
    name: 'onSubmit',
    type: '(value: string, attachments?: MessageAttachment[]) => void',
    required: true,
    description:
      'Callback function called when the message is submitted. Receives message text and optional attachments array.',
  },
  {
    name: 'onSuggestionRequest',
    type: '(query: string, trigger: "@" | "/") => Promise<InputSuggestion[]>',
    description:
      'Async function to load autocomplete suggestions. Called when user types @ or / followed by text.',
  },
  {
    name: 'onFileUpload',
    type: '(files: File[]) => Promise<MessageAttachment[]>',
    description:
      'Async function to handle file uploads. Should return an array of MessageAttachment objects.',
  },
  {
    name: 'maxFiles',
    type: 'number',
    default: '5',
    description: 'Maximum number of file attachments allowed.',
  },
  {
    name: 'acceptedFileTypes',
    type: 'string[]',
    default: '["image/*", "application/pdf", ".txt", ".doc", ".docx"]',
    description:
      'Array of accepted MIME types or file extensions for file uploads.',
  },
  {
    name: 'savedPrompts',
    type: 'SavedPrompt[]',
    default: '[]',
    description:
      'Array of saved prompts for @ autocomplete. Used when onSuggestionRequest is not provided.',
  },
  {
    name: 'onPromptSelect',
    type: '(prompt: SavedPrompt) => void',
    description:
      'Callback when a saved prompt is selected from @ autocomplete.',
  },
  {
    name: 'onLinkPaste',
    type: '(url: string) => Promise<{ title: string; description?: string; image?: string }>',
    description:
      'Async function to fetch link preview metadata when a URL is pasted.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disable the input and all controls.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Type a message... Use @ for prompts, / for commands"',
    description: 'Placeholder text displayed when input is empty.',
  },
  {
    name: 'maxLength',
    type: 'number',
    description: 'Maximum character count with visual indicator.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function AdvancedChatInputPage() {
  return (
    <ToastProvider>
      <div className="docs-content">
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              AdvancedChatInput
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed">
              An enhanced chat input component with file uploads, @mentions,
              /commands, autocomplete, and drag-and-drop support. Perfect for
              feature-rich chat interfaces.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Callout type="warning" className="mb-8">
            <p>
              <strong>Coming Soon:</strong> AdvancedChatInput is planned but not yet implemented
              in @clarity-chat/react. This page documents the intended API and features.
              For now, use the basic{' '}
              <a href="/reference/components/chat-input">ChatInput</a> component.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Callout type="info" className="mb-8">
            <p>
              AdvancedChatInput extends the basic{' '}
              <a href="/reference/components/chat-input">ChatInput</a> component
              with additional features. Use it when you need file attachments,
              autocomplete, or command support.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <ViewInStorybook component="AdvancedChatInput" />
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
            <p className="mb-6 text-muted-foreground">
              Try typing @ or / to see autocomplete, upload files, and test all
              features!
            </p>
            <CodePlayground
              initialCode={`// AdvancedChatInput is coming soon!
// This playground will be functional once the component is implemented.

function Example() {
  const [value, setValue] = React.useState('')

  const handleSubmit = (text, attachments) => {
    console.log('Message:', text)
    console.log('Attachments:', attachments)
    setValue('')
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <p className="text-center text-muted-foreground py-8">
        AdvancedChatInput coming soon...
      </p>
      {/* Once implemented:
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type @ for prompts, / for commands..."
      />
      */}
    </div>
  )
}

render(<Example />)`}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
          <h2 id="import">Import</h2>

          <EnhancedCodeBlock
            code={`// Coming soon:
import { AdvancedChatInput } from '@clarity-chat/react'
import type { MessageAttachment, SavedPrompt, InputSuggestion } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
            language="tsx"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.6}>
          <h2 id="basic-usage">Basic Usage</h2>

          <p className="mb-4">
            AdvancedChatInput works similarly to ChatInput but includes
            additional features. The <code>onSubmit</code> callback receives
            both the message text and optional attachments:
          </p>

          <ComponentPreview
            title="Simple Advanced Input"
            description="Basic usage with file upload support"
            code={`import { useState, useCallback } from 'react'
import { AdvancedChatInput } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/react'

function SimpleAdvancedInput() {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback((text: string, attachments?: MessageAttachment[]) => {
    console.log('Message:', text)
    console.log('Attachments:', attachments)
    setValue('')
  }, [])

  return (
    <AdvancedChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      placeholder="Type a message..."
    />
  )
}`}
          >
            <BasicAdvancedInputDemo />
          </ComponentPreview>
        </ScrollReveal>

        <ScrollReveal delay={0.7}>
          <h2 id="file-uploads">File Uploads</h2>

          <p className="mb-4">
            Enable file uploads with drag-and-drop support. Files can be
            uploaded via button click or by dragging files onto the input area:
          </p>

          <ComponentPreview
            title="With File Upload"
            description="File upload with preview and size limits"
            code={`import { AdvancedChatInput } from '@clarity-chat/react'
import type { MessageAttachment } from '@clarity-chat/react'

function ChatWithFileUpload() {
  const [value, setValue] = useState('')

  const handleFileUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    // Upload files to your server
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data.attachments // Return array of MessageAttachment objects
  }

  return (
    <AdvancedChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      onFileUpload={handleFileUpload}
      maxFiles={10}
      acceptedFileTypes={['image/*', 'application/pdf', '.docx']}
    />
  )
}`}
          >
            <FileUploadDemo />
          </ComponentPreview>

          <Callout type="tip" className="mt-4">
            <p>
              <strong>File Upload Tips:</strong>
            </p>
            <ul>
              <li>Images are automatically previewed in the attachment list</li>
              <li>File size and type are displayed for each attachment</li>
              <li>Users can remove attachments before sending</li>
              <li>Drag and drop works natively - no additional setup needed</li>
            </ul>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.8}>
          <h2 id="autocomplete">@Mentions and /Commands</h2>

          <p className="mb-4">
            Enable autocomplete for @mentions (prompts) and /commands. The
            component automatically detects when users type <code>@</code> or{' '}
            <code>/</code> and shows suggestions:
          </p>

          <EnhancedCodeBlock
            code={`import { AdvancedChatInput } from '@clarity-chat/react'
import type { InputSuggestion, SavedPrompt } from '@clarity-chat/react'

function ChatWithAutocomplete() {
  const [value, setValue] = useState('')

  // Saved prompts for @ autocomplete
  const savedPrompts: SavedPrompt[] = [
    {
      id: '1',
      userId: 'user-1',
      name: 'Code Review',
      content: 'Please review this code for best practices and potential issues.',
      description: 'Request a code review',
      tags: ['code', 'review'],
      variables: [],
      usageCount: 0,
      isFavorite: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      userId: 'user-1',
      name: 'Explain Concept',
      content: 'Can you explain this concept in simple terms?',
      description: 'Get an explanation',
      tags: ['explain'],
      variables: [],
      usageCount: 0,
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Custom suggestion handler (optional)
  const handleSuggestionRequest = async (
    query: string,
    trigger: '@' | '/'
  ): Promise<InputSuggestion[]> => {
    if (trigger === '@') {
      // Search saved prompts
      return savedPrompts
        .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
        .map(p => ({
          id: p.id,
          type: 'prompt' as const,
          label: p.name,
          description: p.description,
          value: p.content,
        }))
    } else {
      // Return commands
      return [
        { id: '1', type: 'command', label: 'help', value: '/help', description: 'Show help' },
        { id: '2', type: 'command', label: 'clear', value: '/clear', description: 'Clear chat' },
        { id: '3', type: 'command', label: 'export', value: '/export', description: 'Export conversation' },
      ]
    }
  }

  return (
    <AdvancedChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      savedPrompts={savedPrompts}
      onSuggestionRequest={handleSuggestionRequest}
      placeholder="Type @ for prompts, / for commands..."
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <Callout type="info" className="mt-4">
            <p>
              <strong>Autocomplete Behavior:</strong>
            </p>
            <ul>
              <li>
                Type <code>@</code> to trigger prompt/mention autocomplete
              </li>
              <li>
                Type <code>/</code> to trigger command autocomplete
              </li>
              <li>Use arrow keys to navigate suggestions</li>
              <li>
                Press{' '}
                <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">
                  Tab
                </kbd>{' '}
                or{' '}
                <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">
                  Enter
                </kbd>{' '}
                to select
              </li>
              <li>
                Press{' '}
                <kbd className="px-1 py-0.5 text-xs border rounded bg-muted">
                  Esc
                </kbd>{' '}
                to close
              </li>
            </ul>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <h2 id="props">Props</h2>

          <PropsTable props={advancedChatInputProps} />
        </ScrollReveal>

        <ScrollReveal delay={1.0}>
          <h2 id="types">TypeScript Types</h2>

          <h3>InputSuggestion</h3>

          <EnhancedCodeBlock
            code={`interface InputSuggestion {
  id: string
  type: 'prompt' | 'command' | 'mention'
  label: string
  description?: string
  value: string
  icon?: string
}`}
            language="tsx"
            showLineNumbers
          />

          <h3>MessageAttachment</h3>

          <EnhancedCodeBlock
            code={`interface MessageAttachment {
  id: string
  type: 'image' | 'video' | 'document' | 'audio' | 'link'
  url: string
  name: string
  size?: number
  mimeType?: string
  thumbnail?: string
}`}
            language="tsx"
            showLineNumbers
          />

          <h3>SavedPrompt</h3>

          <EnhancedCodeBlock
            code={`interface SavedPrompt {
  id: string
  userId: string
  name: string
  content: string
  description?: string
  category?: string
  tags: string[]
  variables: PromptVariable[]
  usageCount: number
  lastUsed?: Date
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}`}
            language="tsx"
            showLineNumbers
          />
        </ScrollReveal>

        <ScrollReveal delay={1.1}>
          <h2 id="accessibility">Accessibility</h2>

          <p>AdvancedChatInput is built with accessibility in mind:</p>

          <ul className="mb-8">
            <li>Full keyboard navigation support</li>
            <li>ARIA attributes for autocomplete suggestions</li>
            <li>Screen reader announcements for file uploads</li>
            <li>Focus management for all interactive elements</li>
            <li>Proper labeling for file input</li>
            <li>Keyboard shortcuts documented and accessible</li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={1.2}>
          <h2 id="related">Related</h2>

          <ul>
            <li>
              <a href="/reference/components/chat-input">ChatInput</a> - Basic
              chat input component
            </li>
            <li>
              <a href="/reference/components/chat-window">ChatWindow</a> -
              Complete chat interface
            </li>
            <li>
              <a href="/reference/components/file-upload">FileUpload</a> -
              Standalone file upload component
            </li>
            <li>
              <a href="/reference/components/clarity-chat">ClarityChat</a> -
              Drop-in component with built-in input
            </li>
          </ul>
        </ScrollReveal>

        <Pagination
          previous={{
            title: 'ChatInput',
            href: '/reference/components/chat-input',
          }}
          next={{
            title: 'Message',
            href: '/reference/components/message',
          }}
        />
      </div>
    </ToastProvider>
  )
}
