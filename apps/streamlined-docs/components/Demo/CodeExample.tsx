'use client'

import { CodeBlock } from '../MDX/CodeBlock'

interface CodeExampleProps {
  title?: string
  code: string
  language: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodeExample({
  title,
  code,
  language,
  showLineNumbers = true,
  highlightLines,
}: CodeExampleProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <CodeBlock
        code={code}
        language={language}
        title={title}
        showLineNumbers={showLineNumbers}
        highlightLines={highlightLines}
      />
    </div>
  )
}
