import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Best Practices Guide - Clarity Chat',
  description: 'Best practices for using Clarity Chat components effectively.',
}

export default function BestPracticesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Best Practices Guide</h1>
        <p className="docs-lead">
          Best practices for using Clarity Chat components effectively.
        </p>
      </div>

      <section className="docs-section">
        <h2>Component Usage</h2>

        <h3>1. Always Use Controlled Components</h3>
        <p>
          <strong>✅ Good:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>`}
        />
        <p>
          <strong>❌ Bad:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`<Input defaultValue="initial" /> // Uncontrolled`}
        />

        <h3>2. Provide Proper Error Handling</h3>
        <p>
          <strong>✅ Good:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`const [error, setError] = useState('')

const handleSubmit = async () => {
  try {
    await submitForm()
  } catch (err) {
    setError(err.message)
  }
}

<Input error={error} />`}
        />
        <p>
          <strong>❌ Bad:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`const handleSubmit = async () => {
  await submitForm() // No error handling
}`}
        />

        <h3>3. Use Loading States</h3>
        <p>
          <strong>✅ Good:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`const [loading, setLoading] = useState(false)

const handleSubmit = async () => {
  setLoading(true)
  try {
    await submit()
  } finally {
    setLoading(false)
  }
}

<Button loading={loading}>Submit</Button>`}
        />
      </section>

      <section className="docs-section">
        <h2>Performance</h2>

        <h3>1. Memoize Expensive Components</h3>
        <p>
          <strong>✅ Good:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`const MessageList = React.memo(({ messages }) => {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
})`}
        />
        <p>
          <strong>❌ Bad:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`function MessageList({ messages }) {
  return messages.map((msg) => <Message key={msg.id} message={msg} />)
} // Re-renders on every parent update`}
        />

        <h3>2. Use useCallback for Event Handlers</h3>
        <p>
          <strong>✅ Good:</strong>
        </p>
        <CodeBlock
          language="tsx"
          code={`const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies])`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>
            <a href="/guides/getting-started">Getting Started</a> - Learn the
            basics
          </li>
          <li>
            <a href="/guides/components">Components Guide</a> - Component usage
          </li>
          <li>
            <a href="/guides/integration">Integration Guide</a> - Integration
            patterns
          </li>
        </ul>
      </section>
    </div>
  )
}
