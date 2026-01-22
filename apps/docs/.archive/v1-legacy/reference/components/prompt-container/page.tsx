'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

const promptContainerProps: Prop[] = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Main content (typically ChatInput or similar input component).',
  },
  {
    name: 'suggestions',
    type: 'SuggestionCategory[]',
    description: 'Suggestion categories to display above input.',
  },
  {
    name: 'onSuggestionClick',
    type: '(text: string) => void',
    description: 'Callback when a suggestion is clicked.',
  },
  {
    name: 'attachments',
    type: 'FileAttachment[]',
    description: 'File attachments to display.',
  },
  {
    name: 'onRemoveAttachment',
    type: '(id: string) => void',
    description: 'Callback when attachment is removed.',
  },
  {
    name: 'onFilesAdd',
    type: '(files: File[]) => void',
    description: 'Callback when files are dropped/selected.',
  },
  {
    name: 'voiceInputSlot',
    type: 'React.ReactNode',
    description: 'Voice input button slot.',
  },
  {
    name: 'templatesSlot',
    type: 'React.ReactNode',
    description: 'Templates picker slot.',
  },
  {
    name: 'sidebar',
    type: 'React.ReactNode',
    description: 'Optional sidebar content.',
  },
  {
    name: 'sidebarPosition',
    type: '"left" | "right"',
    default: '"right"',
    description: 'Sidebar position.',
  },
  {
    name: 'showDropZone',
    type: 'boolean',
    default: 'false',
    description: 'Show file drop zone overlay.',
  },
  {
    name: 'variant',
    type: '"default" | "compact" | "floating"',
    default: '"default"',
    description: 'Layout variant.',
  },
]

export default function PromptContainerPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>PromptContainer</h1>

      <p className="lead">
        A comprehensive wrapper for prompt input with suggestions, file attachments,
        voice input slots, and optional sidebar. Perfect for rich chat input experiences.
      </p>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { PromptContainer, useFileAttachments } from '@clarity-chat/react'
import type { SuggestionCategory, FileAttachment } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <EnhancedCodeBlock
        code={`import { PromptContainer } from '@clarity-chat/react'
import { ChatInput } from '@clarity-chat/react'

function Example() {
  const suggestions = [
    {
      icon: '💡',
      title: 'Examples',
      items: [
        'Write a story about...',
        'Explain quantum physics',
        'Help me with code'
      ]
    },
    {
      icon: '⚡',
      title: 'Quick Actions',
      items: [
        'Summarize this',
        'Translate to Spanish',
        'Fix grammar'
      ]
    }
  ]

  return (
    <PromptContainer
      suggestions={suggestions}
      onSuggestionClick={(text) => console.log(text)}
    >
      <ChatInput onSubmit={handleSubmit} />
    </PromptContainer>
  )
}`}
        language="tsx"
      />

      <h2 id="with-attachments">With File Attachments</h2>

      <EnhancedCodeBlock
        code={`import { PromptContainer, useFileAttachments } from '@clarity-chat/react'

function Example() {
  const {
    attachments,
    isDragging,
    addFiles,
    removeAttachment,
    clearAttachments
  } = useFileAttachments({
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/', 'application/pdf']
  })

  return (
    <PromptContainer
      attachments={attachments}
      onRemoveAttachment={removeAttachment}
      onFilesAdd={addFiles}
      showDropZone={isDragging}
    >
      <ChatInput onSubmit={handleSubmit} />
    </PromptContainer>
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-slots">With Voice Input and Templates</h2>

      <EnhancedCodeBlock
        code={`<PromptContainer
  suggestions={suggestions}
  voiceInputSlot={
    <VoiceInput onTranscript={handleVoice} />
  }
  templatesSlot={
    <TemplatesPicker onSelect={handleTemplate} />
  }
>
  <ChatInput onSubmit={handleSubmit} />
</PromptContainer>`}
        language="tsx"
      />

      <h2 id="with-sidebar">With Context Sidebar</h2>

      <EnhancedCodeBlock
        code={`<PromptContainer
  sidebar={
    <div className="space-y-4">
      <h3 className="font-semibold">Context</h3>
      <ul className="space-y-2">
        <li>Current project: My App</li>
        <li>Active files: 3</li>
        <li>Model: GPT-4</li>
      </ul>
    </div>
  }
  sidebarPosition="right"
>
  <ChatInput onSubmit={handleSubmit} />
</PromptContainer>`}
        language="tsx"
      />

      <h2 id="variants">Layout Variants</h2>

      <EnhancedCodeBlock
        code={`// Default - full width
<PromptContainer variant="default">
  <ChatInput />
</PromptContainer>

// Compact - centered with max width
<PromptContainer variant="compact">
  <ChatInput />
</PromptContainer>

// Floating - card-style with backdrop blur
<PromptContainer variant="floating">
  <ChatInput />
</PromptContainer>`}
        language="tsx"
      />

      <h2 id="collapsible">Collapsible Suggestions</h2>

      <EnhancedCodeBlock
        code={`<PromptContainer
  suggestions={categories}
  collapsedSuggestions={true}
  maxSuggestionsPerCategory={4}
  onSuggestionClick={handleClick}
>
  <ChatInput />
</PromptContainer>`}
        language="tsx"
      />

      <h2 id="props">Props</h2>

      <PropsTable props={promptContainerProps} />

      <h2 id="types">Type Definitions</h2>

      <EnhancedCodeBlock
        code={`interface SuggestionCategory {
  /** Icon for the category (emoji or React node) */
  icon: React.ReactNode
  /** Category title */
  title: string
  /** Suggestion items */
  items: string[]
  /** Optional description */
  description?: string
}

interface FileAttachment {
  /** Unique identifier */
  id: string
  /** File name */
  name: string
  /** File size in bytes */
  size: number
  /** MIME type */
  type: string
  /** Preview URL (for images) */
  previewUrl?: string
  /** Upload progress (0-100) */
  progress?: number
  /** Upload status */
  status?: 'uploading' | 'complete' | 'error'
  /** Error message if status is error */
  error?: string
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="accessibility">Accessibility</h2>

      <ul>
        <li>✅ Full keyboard navigation for suggestions</li>
        <li>✅ Drag-and-drop with keyboard alternative</li>
        <li>✅ ARIA labels for all interactive elements</li>
        <li>✅ Focus management</li>
        <li>✅ Screen reader announcements</li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/suggestion-cards">SuggestionCards</a> - Suggestion grid
        </li>
        <li>
          <a href="/reference/components/chat-input">ChatInput</a> - Input component
        </li>
        <li>
          <a href="/reference/components/file-upload">FileUpload</a> - File upload component
        </li>
      </ul>
    </>
  )
}
