'use client'

import { CodeBlock } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

function BasicCodeBlockDemo() {
  const code = `function greeting(name: string) {
  console.log(\`Hello, \${name}!\`);
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
    type: 'CodeThemeName | BundledTheme',
    default: "'github-dark'",
    description: 'Color theme from predefined themes or custom Shiki theme.',
  },
  {
    name: 'showLineNumbers',
    type: 'boolean',
    default: 'false',
    description: 'Display line numbers beside code.',
  },
  {
    name: 'startingLineNumber',
    type: 'number',
    default: '1',
    description: 'Starting line number for numbering.',
  },
  {
    name: 'highlightLines',
    type: 'string',
    description: 'Lines to highlight (e.g., "2,5-7,10").',
  },
  {
    name: 'addedLines',
    type: 'string',
    description: 'Lines marked as added in diff view.',
  },
  {
    name: 'removedLines',
    type: 'string',
    description: 'Lines marked as removed in diff view.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Title or filename displayed in header.',
  },
  {
    name: 'showCopyButton',
    type: 'boolean',
    default: 'true',
    description: 'Show copy-to-clipboard button.',
  },
  {
    name: 'showLanguageBadge',
    type: 'boolean',
    default: 'true',
    description: 'Show language identifier in header.',
  },
  {
    name: 'maxHeight',
    type: 'number',
    description: 'Maximum height before showing expand button (px).',
  },
  {
    name: 'wordWrap',
    type: 'boolean',
    default: 'false',
    description: 'Enable word wrapping for long lines.',
  },
  {
    name: 'fontFamily',
    type: 'CodeFontFamily',
    default: "'fira-code'",
    description: 'Font family for code display.',
  },
  {
    name: 'enableLigatures',
    type: 'boolean',
    default: 'true',
    description: 'Enable font ligatures.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
  {
    name: 'onCopy',
    type: '() => void',
    description: 'Callback when code is copied.',
  },
  {
    name: 'autoDetectLanguage',
    type: 'boolean',
    default: 'true',
    description: 'Auto-detect language if not provided.',
  },
  {
    name: 'showDownloadButton',
    type: 'boolean',
    default: 'false',
    description: 'Show download button.',
  },
  {
    name: 'onDownload',
    type: '() => void',
    description: 'Callback when code is downloaded.',
  },
  {
    name: 'enableKeyboardShortcuts',
    type: 'boolean',
    default: 'true',
    description: 'Enable keyboard shortcuts (Cmd+Shift+C to copy).',
  },
  {
    name: 'filename',
    type: 'string',
    description: 'Filename for download (defaults to code.{language}).',
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
            A comprehensive code display component with Shiki-powered syntax
            highlighting, error boundaries, performance monitoring, analytics tracking,
            accessibility features, and extensive customization options.
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
          title="Basic Syntax Highlighting"
          description="Displays code with syntax highlighting, line numbers, and copy functionality."
          code={`<CodeBlock
  language="typescript"
  title="greeting.ts"
  showLineNumbers
  highlightLines="2"
>
  {\`function greeting(name: string) {
  console.log(\\\`Hello, \\\${name}!\\\`);
  return true;
}\`}
</CodeBlock>`}
        >
          <BasicCodeBlockDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.35}>
        <h2 id="features">Built-in Features</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Error Boundaries</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Automatic error handling with graceful fallbacks and retry options.
            </p>
            <EnhancedCodeBlock
              code={`// Errors are automatically caught and displayed with retry options
<CodeBlock language="javascript">
  {potentiallyProblematicCode}
</CodeBlock>`}
              language="tsx"
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Performance Monitoring</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Automatic performance tracking for render times and memory usage.
            </p>
            <EnhancedCodeBlock
              code={`// Performance metrics are automatically collected
// Use PerformanceDashboard to view analytics
import { PerformanceDashboard } from '@clarity-chat/react'`}
              language="tsx"
            />
          </div>

          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Analytics Integration</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Component usage and interaction analytics are automatically tracked.
            </p>
            <EnhancedCodeBlock
              code={`// Analytics enabled by default
// Wrap app with AnalyticsProvider for custom configuration
<AnalyticsProvider config={{ enabled: true }}>
  <CodeBlock language="javascript">{code}</CodeBlock>
</AnalyticsProvider>`}
              language="tsx"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <h2 id="props">Props</h2>
        <PropsTable props={codeBlockProps} />
      </ScrollReveal>
    </div>
  )
}
