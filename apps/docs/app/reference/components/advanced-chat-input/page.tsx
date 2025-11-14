import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advanced Chat Input',
  description: 'Enhanced chat input with file attachments, mentions, commands, and autocomplete.',
}

export default function AdvancedChatInputPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Advanced Chat Input</h1>
        <p className="text-xl text-muted-foreground">
          A powerful chat input component with file uploads, @mentions, /commands, autocomplete, and more.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Overview</h2>
        <p>
          The Advanced Chat Input extends the basic chat input with rich interactive features including:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>File Attachments</strong> - Drag and drop or click to upload files with preview</li>
          <li><strong>@Mentions</strong> - Autocomplete for prompts and saved content triggered by @</li>
          <li><strong>/Commands</strong> - Quick commands for common actions triggered by /</li>
          <li><strong>Keyboard Navigation</strong> - Full keyboard support for suggestions</li>
          <li><strong>Character Limits</strong> - Optional character count and validation</li>
          <li><strong>Drag & Drop</strong> - Native file drag and drop support</li>
        </ul>
      </section>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Installation</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { AdvancedChatInput } from '@clarity-chat/react'`}</code>
        </pre>
      </section>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Basic Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { AdvancedChatInput } from '@clarity-chat/react'
import { useState } from 'react'

export default function ChatExample() {
  const [message, setMessage] = useState('')

  const handleSubmit = (value, attachments) => {
    console.log('Message:', value)
    console.log('Attachments:', attachments)
  }

  return (
    <AdvancedChatInput
      value={message}
      onChange={setMessage}
      onSubmit={handleSubmit}
      placeholder="Type @ for prompts, / for commands..."
    />
  )
}`}</code>
        </pre>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Default</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2"><code>value</code></td>
                <td className="p-2"><code>string</code></td>
                <td className="p-2"><code>-</code></td>
                <td className="p-2">Current input value (controlled)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>onChange</code></td>
                <td className="p-2"><code>(value: string) =&gt; void</code></td>
                <td className="p-2"><code>-</code></td>
                <td className="p-2">Called when input changes</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>onSubmit</code></td>
                <td className="p-2"><code>(value: string, attachments?: MessageAttachment[]) =&gt; void</code></td>
                <td className="p-2"><code>-</code></td>
                <td className="p-2">Called when message is submitted</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>onSuggestionRequest</code></td>
                <td className="p-2"><code>(query: string, trigger: '@' | '/') =&gt; Promise&lt;InputSuggestion[]&gt;</code></td>
                <td className="p-2"><code>-</code></td>
                <td className="p-2">Async function to load autocomplete suggestions</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>onFileUpload</code></td>
                <td className="p-2"><code>(files: File[]) =&gt; Promise&lt;MessageAttachment[]&gt;</code></td>
                <td className="p-2"><code>-</code></td>
                <td className="p-2">Handle file uploads, return attachment objects</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>maxFiles</code></td>
                <td className="p-2"><code>number</code></td>
                <td className="p-2"><code>5</code></td>
                <td className="p-2">Maximum number of attachments allowed</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>acceptedFileTypes</code></td>
                <td className="p-2"><code>string[]</code></td>
                <td className="p-2"><code>['image/*', 'application/pdf', ...]</code></td>
                <td className="p-2">Accepted MIME types for file uploads</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>savedPrompts</code></td>
                <td className="p-2"><code>SavedPrompt[]</code></td>
                <td className="p-2"><code>[]</code></td>
                <td className="p-2">Saved prompts for @ autocomplete</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>maxLength</code></td>
                <td className="p-2"><code>number</code></td>
                <td className="p-2"><code>-</code></td>
                <td className="p-2">Maximum character count with visual indicator</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>disabled</code></td>
                <td className="p-2"><code>boolean</code></td>
                <td className="p-2"><code>false</code></td>
                <td className="p-2">Disable input and controls</td>
              </tr>
              <tr className="border-b">
                <td className="p-2"><code>placeholder</code></td>
                <td className="p-2"><code>string</code></td>
                <td className="p-2"><code>'Type a message...'</code></td>
                <td className="p-2">Placeholder text</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Key Features</h2>
        
        <h3 className="text-xl font-semibold">File Attachments</h3>
        <p>Upload files via button click or drag and drop. Preview images with size information.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<AdvancedChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxFiles={10}
  acceptedFileTypes={['image/*', '.pdf', '.docx']}
  onFileUpload={async (files) => {
    // Upload files to your server
    const uploaded = await uploadToServer(files)
    return uploaded.map(file => ({
      id: file.id,
      type: 'image',
      name: file.name,
      url: file.url,
      size: file.size
    }))
  }}
/>`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6">@Mentions & /Commands</h3>
        <p>Trigger autocomplete with @ for mentions or / for commands. Navigate with arrow keys.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<AdvancedChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  onSuggestionRequest={async (query, trigger) => {
    if (trigger === '@') {
      // Load user mentions or saved prompts
      return await searchPrompts(query)
    } else {
      // Load commands
      return [
        { id: '1', type: 'command', label: 'help', value: '/help' },
        { id: '2', type: 'command', label: 'clear', value: '/clear' }
      ]
    }
  }}
  savedPrompts={[
    { id: '1', name: 'Code Review', content: 'Review this code...' },
    { id: '2', name: 'Explain', content: 'Explain this concept...' }
  ]}
/>`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6">Character Limit</h3>
        <p>Set a character limit with visual feedback when approaching or exceeding the limit.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`<AdvancedChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxLength={2000}
/>`}</code>
        </pre>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Input</h3>
            <ul className="space-y-1">
              <li><kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> - Send message</li>
              <li><kbd className="px-2 py-1 bg-muted rounded">Shift</kbd> + <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> - New line</li>
              <li><kbd className="px-2 py-1 bg-muted rounded">@</kbd> - Trigger mentions</li>
              <li><kbd className="px-2 py-1 bg-muted rounded">/</kbd> - Trigger commands</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Autocomplete</h3>
            <ul className="space-y-1">
              <li><kbd className="px-2 py-1 bg-muted rounded">↑/↓</kbd> - Navigate suggestions</li>
              <li><kbd className="px-2 py-1 bg-muted rounded">Tab</kbd> or <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> - Select suggestion</li>
              <li><kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> - Close suggestions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Accessibility</h2>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>Full keyboard navigation support</li>
          <li>Screen reader announcements for suggestions</li>
          <li>ARIA attributes for autocomplete</li>
          <li>Focus management for file inputs</li>
          <li>Disabled state properly communicated</li>
        </ul>
      </section>

      {/* TypeScript */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">TypeScript</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`interface InputSuggestion {
  id: string
  type: 'prompt' | 'command' | 'mention'
  label: string
  description?: string
  value: string
  icon?: string
}

interface MessageAttachment {
  id: string
  type: 'image' | 'document'
  name: string
  url?: string
  size?: number
  mimeType?: string
}

interface AdvancedChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string, attachments?: MessageAttachment[]) => void
  onSuggestionRequest?: (query: string, trigger: '@' | '/') => Promise<InputSuggestion[]>
  onFileUpload?: (files: File[]) => Promise<MessageAttachment[]>
  maxFiles?: number
  acceptedFileTypes?: string[]
  savedPrompts?: SavedPrompt[]
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  className?: string
}`}</code>
        </pre>
      </section>

      {/* Related Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Related Components</h2>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li><a href="/reference/components/chat-window" className="text-primary hover:underline">Chat Window</a> - Complete chat interface</li>
          <li><a href="/reference/components/message" className="text-primary hover:underline">Message</a> - Display chat messages</li>
          <li><a href="/reference/components/file-upload" className="text-primary hover:underline">File Upload</a> - Standalone file upload</li>
          <li><a href="/reference/components/copy-button" className="text-primary hover:underline">Copy Button</a> - Copy functionality</li>
        </ul>
      </section>
    </div>
  )
}
