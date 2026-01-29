import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ClarityChat | Components | Clarity Chat',
  description: 'Drop-in AI chat component with streaming, memory, and error handling built-in.',
}

export default function ClarityChatPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-4xl">
      <h1>ClarityChat</h1>
      
      <p className="lead">
        The simplest way to add AI chat to your app. Drop-in component with built-in streaming, memory, and error handling.
      </p>

      <h2>Installation</h2>
      <pre><code className="language-bash">pnpm add @clarity-chat/react</code></pre>

      <h2>Import</h2>
      <pre><code className="language-tsx">{`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}</code></pre>

      <h2>Basic Usage</h2>
      <pre><code className="language-tsx">{`export default function ChatPage() {
  return <ClarityChat api="/api/chat" />
}`}</code></pre>

      <h2>Props</h2>
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>api</code></td>
            <td><code>string</code></td>
            <td><em>required</em></td>
            <td>API endpoint URL for chat</td>
          </tr>
          <tr>
            <td><code>header</code></td>
            <td><code>ClarityChatHeaderProps</code></td>
            <td>-</td>
            <td>Header configuration</td>
          </tr>
          <tr>
            <td><code>messageActions</code></td>
            <td><code>MessageActionsProps</code></td>
            <td>-</td>
            <td>Message action callbacks</td>
          </tr>
          <tr>
            <td><code>memory</code></td>
            <td><code>MemoryConfig</code></td>
            <td>-</td>
            <td>Memory configuration</td>
          </tr>
          <tr>
            <td><code>rateLimiting</code></td>
            <td><code>RateLimitingProps</code></td>
            <td>-</td>
            <td>Rate limiting config</td>
          </tr>
        </tbody>
      </table>

      <h2>Examples</h2>
      <h3>With Header</h3>
      <pre><code className="language-tsx">{`<ClarityChat
  api="/api/chat"
  header={{
    show: true,
    title: "AI Assistant",
    showMessageCount: true
  }}
/>`}</code></pre>

      <h3>With Memory</h3>
      <pre><code className="language-tsx">{`<ClarityChat
  api="/api/chat"
  memory={{
    enabled: true,
    strategy: 'vector-store'
  }}
/>`}</code></pre>

      <h2>Accessibility</h2>
      <ul>
        <li><strong>Keyboard:</strong> Tab, Enter, Shift+Enter, End, Escape</li>
        <li><strong>Screen Reader:</strong> Announces new messages via aria-live</li>
        <li><strong>ARIA:</strong> Complete landmark structure</li>
      </ul>

      <h2>Related</h2>
      <ul>
        <li><Link href="/reference/components/chat-window">ChatWindow</Link> - Mid-level composable</li>
        <li><Link href="/reference/hooks/use-clarity-chat">useClarityChat</Link> - Core chat hook</li>
      </ul>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-sm m-0">
          📘 <strong>Full API Reference:</strong> See <code>COMPONENT_API_REFERENCE.md</code> for complete documentation with all examples and troubleshooting.
        </p>
      </div>
    </div>
  )
}
