import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'StreamingTextRenderer - Clarity Chat Components',
  description: 'Render token streams with partial updates and cursor control.',
}

export default function StreamingTextRendererPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>StreamingTextRenderer</h1>
        <p className="docs-lead">High-performance renderer for streaming LLM tokens.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { StreamingTextRenderer } from '@clarity-chat/react'

export default function Example() {
  const [text, setText] = React.useState('')

  React.useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setText((t) => t + ' ' + i)
      if (i === 10) clearInterval(id)
    }, 200)
  }, [])

  return (
    <div className="p-4">
      <StreamingTextRenderer text={text} />
    </div>
  )
}`} 
          height="220px"
        />
      </section>
    </div>
  )
}
