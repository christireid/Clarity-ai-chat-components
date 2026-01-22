import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export const metadata: Metadata = {
  title: 'InlineCode - Clarity Chat Components',
  description: 'Accessible inline code snippets with copy functionality and consistent theming.',
}

const inlineCodeProps: Prop[] = [
  {
    name: 'children',
    type: 'string',
    required: true,
    description: 'The code content to display.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
  {
    name: 'enableCopy',
    type: 'boolean',
    default: 'false',
    description: 'Enable click-to-copy functionality.',
  },
  {
    name: 'onCopy',
    type: '() => void',
    description: 'Callback when code is copied.',
  },
]

export default function InlineCodePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>InlineCode</h1>
        <p className="docs-lead">
          Accessible inline code snippets with copy functionality and consistent
          Night Owl theming.
        </p>
      </div>

      <ViewInStorybook component="InlineCode" />

      <section className="docs-section">
        <h2>Import</h2>
        <CodePlayground
          code={`import { InlineCode } from '@clarity-chat/react'`}
          language="tsx"
        />
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          code={`<p>
  Use the <InlineCode>useState</InlineCode> hook to manage component state.
</p>`}
          language="tsx"
        />
      </section>

      <section className="docs-section">
        <h2>With Copy Functionality</h2>
        <CodePlayground
          code={`<p>
  The command is: <InlineCode enableCopy>npm install @clarity-chat/react</InlineCode>
</p>`}
          language="tsx"
        />
        <Callout type="info">
          Click the code snippet to copy it to your clipboard. Visual feedback indicates success.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Features</h2>
        <ul>
          <li>✅ Consistent Night Owl syntax highlighting</li>
          <li>✅ Keyboard accessible</li>
          <li>✅ Optional click-to-copy functionality</li>
          <li>✅ Visual feedback for copy operations</li>
          <li>✅ Error boundary protection</li>
          <li>✅ Analytics integration</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={inlineCodeProps} />
      </section>

      <Callout type="tip">
        Use InlineCode for short code snippets within text. For multi-line code blocks,
        use the CodeBlock component instead.
      </Callout>
    </div>
  )
}