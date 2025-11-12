import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat Input | Clarity Chat',
  description: 'Basic chat input component with character counting, validation, and smooth animations.'
}

export default function ChatInputPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Chat Input</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Feature-rich chat input component with character counting, validation, smooth animations, and keyboard shortcuts.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Character counter with progress bar</li>
          <li>Maximum length validation with visual feedback</li>
          <li>Auto-resizing textarea (up to 6 rows)</li>
          <li>Smooth expand/contract animations</li>
          <li>Focus ring glow effect</li>
          <li>Button state transitions (idle/loading/success/error)</li>
          <li>Keyboard shortcuts (Enter to send, Shift+Enter for new line)</li>
          <li>Error shake animation on validation failure</li>
          <li>Warning threshold indicators</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { ChatInput } from '@clarity-chat/react'

function MyChat() {
  const [message, setMessage] = useState('')

  const handleSubmit = async (value: string) => {
    console.log('Sending:', value)
    // Send message to API
    await sendMessage(value)
    setMessage('') // Clear input
  }

  return (
    <ChatInput
      value={message}
      onChange={setMessage}
      onSubmit={handleSubmit}
      maxLength={500}
      placeholder="Type your message..."
    />
  )
}`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 font-semibold">Prop</th>
                <th className="p-2 font-semibold">Type</th>
                <th className="p-2 font-semibold">Default</th>
                <th className="p-2 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">value</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">-</td>
                <td className="p-2">Current input value (controlled)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onChange</td>
                <td className="p-2 font-mono text-sm">(value: string) =&gt; void</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback when value changes</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onSubmit</td>
                <td className="p-2 font-mono text-sm">(value: string) =&gt; void | Promise</td>
                <td className="p-2">-</td>
                <td className="p-2">Callback when message is submitted</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">placeholder</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">"Type a message..."</td>
                <td className="p-2">Placeholder text</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">disabled</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2">false</td>
                <td className="p-2">Disable input and button</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">maxLength</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2">-</td>
                <td className="p-2">Maximum character count</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">showCharCounter</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2">true</td>
                <td className="p-2">Show character counter</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">warningThreshold</td>
                <td className="p-2 font-mono text-sm">number</td>
                <td className="p-2">0.8</td>
                <td className="p-2">Warning threshold (0-1)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">animateHeight</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2">true</td>
                <td className="p-2">Enable height animation</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">glowOnFocus</td>
                <td className="p-2 font-mono text-sm">boolean</td>
                <td className="p-2">true</td>
                <td className="p-2">Enable focus glow effect</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">-</td>
                <td className="p-2">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Examples</h2>
        
        <h3 className="text-2xl font-semibold mb-3">With Character Limit</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxLength={280}
  warningThreshold={0.9}
  showCharCounter={true}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">Minimal Configuration</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-6">
          <code>{`<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  animateHeight={false}
  glowOnFocus={false}
/>`}</code>
        </pre>

        <h3 className="text-2xl font-semibold mb-3">With Async Submit</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`const handleSubmit = async (value: string) => {
  try {
    await api.sendMessage(value)
    setMessage('') // Clear on success
  } catch (error) {
    console.error('Failed to send:', error)
    // Button will show error state automatically
  }
}

<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
/>`}</code>
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Character Counter States</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <strong className="text-foreground">Normal (0-79%):</strong> Blue color, normal font weight
          </div>
          <div>
            <strong className="text-foreground">Warning (80-99%):</strong> Yellow color, medium font weight
          </div>
          <div>
            <strong className="text-foreground">Over Limit (100%+):</strong> Red color, bold font, pulsing animation
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Button States</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <strong className="text-foreground">Idle:</strong> Default send icon, enabled when input has content
          </div>
          <div>
            <strong className="text-foreground">Loading:</strong> Spinner animation while onSubmit is processing
          </div>
          <div>
            <strong className="text-foreground">Success:</strong> Checkmark icon for 1 second after successful send
          </div>
          <div>
            <strong className="text-foreground">Error:</strong> Error icon for 2 seconds if onSubmit throws error
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="space-y-4 text-muted-foreground">
          <div>
            <kbd className="px-2 py-1 text-xs border rounded bg-muted">Enter</kbd> - Submit message (if valid)
          </div>
          <div>
            <kbd className="px-2 py-1 text-xs border rounded bg-muted">Shift</kbd> + <kbd className="px-2 py-1 text-xs border rounded bg-muted">Enter</kbd> - New line
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>ARIA labels on send button reflect current state</li>
          <li>Keyboard navigation fully supported</li>
          <li>Screen reader announcements for state changes</li>
          <li>Focus indicators meet WCAG 2.1 AA standards</li>
          <li>Error messages are programmatically associated</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Always clear input after successful submission</li>
          <li>Set reasonable maxLength (280-500 characters)</li>
          <li>Use warningThreshold of 0.8-0.9 for best UX</li>
          <li>Handle async errors gracefully in onSubmit</li>
          <li>Disable input during loading to prevent duplicate sends</li>
          <li>Provide clear placeholder text for context</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a href="/reference/components/advanced-chat-input" className="text-primary hover:underline">Advanced Chat Input</a> - Enhanced version with attachments</li>
          <li><a href="/reference/components/message-list" className="text-primary hover:underline">Message List</a> - Display sent messages</li>
          <li><a href="/reference/components/chat-window" className="text-primary hover:underline">Chat Window</a> - Complete chat interface</li>
        </ul>
      </section>
    </div>
  )
}
