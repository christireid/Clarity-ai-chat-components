'use client'

import { CodeBlock } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

function BasicCodeBlockDemo() {
  const code = `function greeting(name: string) {
  logger.debug(\`Hello, \${name}!\`);
  return true;
}`

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        language="typescript"
        title="greeting.ts"
        showLineNumbers
        highlightLines="2"
      >
        {code}
      </CodeBlock>
    </div>
  )
}

const codeBlockProps: Prop[] = [
  {
    name: 'children',
    type: 'string',
    required: true,
    description: 'The code content to display.',
  },
  {
    name: 'language',
    type: 'string',
    description: 'Programming language for syntax highlighting.',
  },
  {
    name: 'theme',
    type: 'string',
    default: "'github-dark'",
    description:
      'Color theme (e.g., "github-dark", "dracula", "material-theme").',
  },
  {
    name: 'showLineNumbers',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show line numbers.',
  },
  {
    name: 'highlightLines',
    type: 'string',
    description: 'Lines to highlight (e.g., "1,3-5").',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Title or filename displayed in the header.',
  },
  {
    name: 'showCopyButton',
    type: 'boolean',
    default: 'true',
    description: 'Show copy to clipboard button.',
  },
]

export default function CodeBlockPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            CodeBlock
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A world-class code display component with Shiki-powered syntax
            highlighting, line numbers, highlighting, and diff visualization.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ViewInStorybook component="CodeBlock" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <h2 id="import">Import</h2>
        <EnhancedCodeBlock
          code={`import { CodeBlock } from '@clarity-chat/react'`}
          language="tsx"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="usage">Usage</h2>
        <ComponentPreview
          title="Syntax Highlighting"
          description="Displays code with syntax highlighting and line numbers."
          code={`<CodeBlock
  language="typescript"
  title="greeting.ts"
  showLineNumbers
  highlightLines="2"
>
  {\`function greeting(name: string) {
  logger.debug(\\\`Hello, \\\${name}!\\\`);
  return true;
}\`}
</CodeBlock>`}
        >
          <BasicCodeBlockDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="props">Props</h2>
        <PropsTable props={codeBlockProps} />
      </ScrollReveal>
    </div>
  )
}
