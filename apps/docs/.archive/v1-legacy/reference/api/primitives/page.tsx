import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Primitives API Reference - Clarity Chat',
  description: 'Comprehensive API documentation for all primitive components in the Clarity Chat component library.',
}

export default function PrimitivesAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Primitives API Documentation</h1>
        <p className="docs-lead">
          Comprehensive API documentation for all primitive components in the Clarity Chat component library.
        </p>
      </div>

      <section className="docs-section">
        <h2>Button</h2>
        <p>
          A versatile button component with enhanced UX through microanimations and state management.
        </p>

        <h3>Import</h3>
        <CodeBlock
          language="tsx"
          code={`import { Button } from '@clarity-chat/primitives'`}
        />

        <h3>Props</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-4 text-left">Prop</th>
                <th className="border border-border p-4 text-left">Type</th>
                <th className="border border-border p-4 text-left">Default</th>
                <th className="border border-border p-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4"><code>variant</code></td>
                <td className="border border-border p-4"><code>'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'</code></td>
                <td className="border border-border p-4"><code>'default'</code></td>
                <td className="border border-border p-4">Button visual style</td>
              </tr>
              <tr>
                <td className="border border-border p-4"><code>size</code></td>
                <td className="border border-border p-4"><code>'default' | 'sm' | 'lg' | 'icon'</code></td>
                <td className="border border-border p-4"><code>'default'</code></td>
                <td className="border border-border p-4">Button size</td>
              </tr>
              <tr>
                <td className="border border-border p-4"><code>loading</code></td>
                <td className="border border-border p-4"><code>boolean</code></td>
                <td className="border border-border p-4"><code>false</code></td>
                <td className="border border-border p-4">Show loading spinner</td>
              </tr>
              <tr>
                <td className="border border-border p-4"><code>disabled</code></td>
                <td className="border border-border p-4"><code>boolean</code></td>
                <td className="border border-border p-4"><code>false</code></td>
                <td className="border border-border p-4">Disable button</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Examples</h3>
        <CodeBlock
          language="tsx"
          code={`// Default button
<Button>Click me</Button>

// Loading state
<Button loading>Processing...</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Icon button
<Button size="icon">
  <Icon />
</Button>`}
        />
      </section>

      <section className="docs-section">
        <h2>Input</h2>
        <p>
          Text input component with support for various types and states.
        </p>

        <h3>Import</h3>
        <CodeBlock
          language="tsx"
          code={`import { Input } from '@clarity-chat/primitives'`}
        />

        <h3>Examples</h3>
        <CodeBlock
          language="tsx"
          code={`// Basic input
<Input placeholder="Enter text..." />

// Error state
<Input variant="error" placeholder="Invalid email" />

// Controlled input
<Input value={value} onChange={(e) => setValue(e.target.value)} />`}
        />
      </section>

      <section className="docs-section">
        <h2>Textarea</h2>
        <p>
          Multi-line text input component with auto-resize support.
        </p>

        <h3>Import</h3>
        <CodeBlock
          language="tsx"
          code={`import { Textarea } from '@clarity-chat/primitives'`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/api/react-components">React Components API</a> - Full component reference</li>
          <li><a href="/reference/components">Components Overview</a> - Browse all components</li>
        </ul>
      </section>
    </div>
  )
}
