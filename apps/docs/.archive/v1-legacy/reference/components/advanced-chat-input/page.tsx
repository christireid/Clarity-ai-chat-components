'use client'

import { useState, useCallback } from 'react'
import { ClarityToaster, AdvancedChatInput } from '@clarity-chat/react'
import type {
  MessageAttachment,
  SavedPrompt,
  InputSuggestion,
} from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// Basic demo component
function BasicAdvancedInputDemo() {
  const [value, setValue] = useState('')

  const handleSubmit = useCallback(
    (text: string, attachments?: MessageAttachment[]) => {
      console.log('Message:', text)
      console.log('Attachments:', attachments)
      setValue('')
    },
    []
  )

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background">
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type @ for prompts, / for commands..."
      />
    </div>
  )
}

// With file upload demo
function FileUploadDemo() {
  const [value, setValue] = useState('')

  const handleFileUpload = useCallback(
    async (files: File[]): Promise<MessageAttachment[]> => {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return files.map((file) => ({
        id: `${Date.now()}-${file.name}`,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        name: file.name,
        size: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file),
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    (text: string, attachments?: MessageAttachment[]) => {
      console.log('Message:', text)
      console.log('Attachments:', attachments)
      setValue('')
    },
    []
  )

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg bg-background">
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        maxFiles={5}
        acceptedFileTypes={['image/*', 'application/pdf', '.txt']}
      />
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
    <ClarityToaster />
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
          <Callout type="info" className="mb-8">
            <p>
              AdvancedChatInput extends the basic{' '}
              <a href="/reference/components/chat-input">ChatInput</a> component
              with additional features. Use it when you need file attachments,
              autocomplete, or command support.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <ViewInStorybook component="AdvancedChatInput" />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <section className="my-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
            <p className="mb-6 text-muted-foreground">
              Try typing @ or / to see autocomplete, upload files, and test all
              features!
            </p>
            <CodePlayground
              initialCode={`function Example() {
  const [value, setValue] = React.useState('')

  const handleSubmit = (text, attachments) => {
    console.log('Message:', text)
    console.log('Attachments:', attachments)
    setValue('')
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        placeholder="Type @ for prompts, / for commands..."
      />
    </div>
  )
}

render(<Example />)`}
            />
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <h2 id="import">Import</h2>

          <EnhancedCodeBlock
            code={`import { AdvancedChatInput } from '@clarity-chat/react'
import type { MessageAttachment, SavedPrompt, InputSuggestion } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
            language="tsx"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.5}>
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

        <ScrollReveal delay={0.6}>
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

        <ScrollReveal delay={0.7}>
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

        <ScrollReveal delay={0.8}>
          <h2 id="link-preview">Link Preview</h2>

          <p className="mb-4">
            Automatically fetch link previews when URLs are pasted:
          </p>

          <EnhancedCodeBlock
            code={`import { AdvancedChatInput } from '@clarity-chat/react'

function ChatWithLinkPreview() {
  const handleLinkPaste = async (url: string) => {
    // Fetch link metadata from your API or a service
    const response = await fetch(\`/api/link-preview?url=\${encodeURIComponent(url)}\`)
    const data = await response.json()
    
    return {
      title: data.title,
      description: data.description,
      image: data.image,
    }
  }

  return (
    <AdvancedChatInput
      value={value}
      onChange={setValue}
      onSubmit={handleSubmit}
      onLinkPaste={handleLinkPaste}
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </ScrollReveal>

        <ScrollReveal delay={0.9}>
          <h2 id="character-limit">Character Limit</h2>

          <p className="mb-4">
            Set a maximum character count with visual feedback:
          </p>

          <EnhancedCodeBlock
            code={`<AdvancedChatInput
  value={value}
  onChange={setValue}
  onSubmit={handleSubmit}
  maxLength={2000}
/>`}
            language="tsx"
            showLineNumbers
          />
        </ScrollReveal>

        <ScrollReveal delay={1.0}>
          <h2 id="keyboard-shortcuts">Keyboard Shortcuts</h2>

          <p className="mb-4">
            AdvancedChatInput supports comprehensive keyboard navigation:
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">Input</h3>
              <ul className="space-y-2">
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    Enter
                  </kbd>{' '}
                  - Send message
                </li>
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    Shift
                  </kbd>{' '}
                  +{' '}
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    Enter
                  </kbd>{' '}
                  - New line
                </li>
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    @
                  </kbd>{' '}
                  - Trigger mentions/prompts
                </li>
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    /
                  </kbd>{' '}
                  - Trigger commands
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Autocomplete Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    ↑
                  </kbd>{' '}
                  /{' '}
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    ↓
                  </kbd>{' '}
                  - Navigate suggestions
                </li>
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    Tab
                  </kbd>{' '}
                  or{' '}
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    Enter
                  </kbd>{' '}
                  - Select suggestion
                </li>
                <li>
                  <kbd className="px-2 py-1 text-xs border rounded bg-muted">
                    Esc
                  </kbd>{' '}
                  - Close suggestions
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1.1}>
          <h2 id="props">Props</h2>

          <PropsTable props={advancedChatInputProps} />
        </ScrollReveal>

        <ScrollReveal delay={1.2}>
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

        <ScrollReveal delay={1.3}>
          <h2 id="complete-example">Complete Example</h2>

          <EnhancedCodeBlock
            code={`import { useState, useCallback } from 'react'
import { AdvancedChatInput, useClarityChat } from '@clarity-chat/react'
import type { MessageAttachment, InputSuggestion, SavedPrompt } from '@clarity-chat/react'

function CompleteAdvancedChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const [value, setValue] = useState('')

  const savedPrompts: SavedPrompt[] = [
    // Your saved prompts...
  ]

  const handleFileUpload = async (files: File[]): Promise<MessageAttachment[]> => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    return data.attachments
  }

  const handleSuggestionRequest = async (
    query: string,
    trigger: '@' | '/'
  ): Promise<InputSuggestion[]> => {
    if (trigger === '@') {
      // Search prompts from API
      const response = await fetch(\`/api/prompts/search?q=\${query}\`)
      const prompts = await response.json()
      return prompts.map((p: SavedPrompt) => ({
        id: p.id,
        type: 'prompt' as const,
        label: p.name,
        description: p.description,
        value: p.content,
      }))
    } else {
      // Return commands
      return [
        { id: '1', type: 'command', label: 'help', value: '/help' },
        { id: '2', type: 'command', label: 'clear', value: '/clear' },
      ]
    }
  }

  const handleSubmit = useCallback(
    async (text: string, attachments?: MessageAttachment[]) => {
      await chat.append({
        role: 'user',
        content: text,
        // Include attachments in message if needed
      })
      setValue('')
    },
    [chat]
  )

  return (
    <div className="flex flex-col h-screen">
      {/* Your message list here */}
      
      <AdvancedChatInput
        value={value}
        onChange={setValue}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        onSuggestionRequest={handleSuggestionRequest}
        savedPrompts={savedPrompts}
        maxFiles={10}
        acceptedFileTypes={['image/*', 'application/pdf', '.txt', '.docx']}
        maxLength={2000}
        disabled={chat.isLoading}
        placeholder="Type @ for prompts, / for commands, or drag files here..."
      />
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <Callout type="warning">
            <p>
              <strong>Note:</strong> The API endpoints (<code>/api/upload</code>
              , <code>/api/prompts/search</code>, etc.) are placeholders. You'll
              need to implement your own backend endpoints.
            </p>
          </Callout>
        </ScrollReveal>

        <ScrollReveal delay={1.4}>
          <h2 id="accessibility">Accessibility</h2>

          <p>AdvancedChatInput is built with accessibility in mind:</p>

          <ul className="mb-8">
            <li>✅ Full keyboard navigation support</li>
            <li>✅ ARIA attributes for autocomplete suggestions</li>
            <li>✅ Screen reader announcements for file uploads</li>
            <li>✅ Focus management for all interactive elements</li>
            <li>✅ Proper labeling for file input</li>
            <li>✅ Keyboard shortcuts documented and accessible</li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={1.5}>
          <h2 id="performance">Performance</h2>

          <p>AdvancedChatInput is optimized for performance:</p>

          <ul className="mb-8">
            <li>
              <strong>React Concurrent Features:</strong> Uses{' '}
              <code>useTransition</code> for non-blocking suggestion updates
            </li>
            <li>
              <strong>Memoized handlers:</strong> Event handlers are memoized to
              prevent unnecessary re-renders
            </li>
            <li>
              <strong>Efficient file handling:</strong> File previews use object
              URLs for fast rendering
            </li>
            <li>
              <strong>Debounced autocomplete:</strong> Suggestions are loaded
              efficiently without blocking UI
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={1.6}>
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
    </>
  )
}
