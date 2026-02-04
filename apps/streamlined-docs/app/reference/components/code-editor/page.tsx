'use client'

/**
 * CodeEditor Component - API Reference Documentation
 *
 * Full-featured code editor with syntax highlighting, auto-completion, and 50+ language support
 * built on Monaco Editor (the engine powering VS Code).
 */

import * as React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import {
  Code2,
  Languages,
  Palette,
  Zap,
  GitCompare,
  Settings,
  Download,
  Play,
  Copy,
  Check,
  Wrench,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  Layers,
  FileCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { Section, SubSection } from '@/components/Docs/Section'
import { PropsTable, type PropDefinition } from '@/components/Docs/PropsTable'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import type { TocItem } from '@/components/Docs/TableOfContents'

// Lazy load CodeEditor for demo (it's heavy)
const CodeEditor = dynamic(() => import('@/components/Playground/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-lg border border-border/50 bg-muted/30 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading Monaco Editor...</p>
      </div>
    </div>
  ),
})

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [code, setCode] = React.useState(`// Welcome to CodeEditor!
// Try editing this code with full IntelliSense support

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function processMessage(message: Message): string {
  const formatted = \`[\${message.role}] \${message.content}\`
  return formatted.trim()
}

const exampleMessage: Message = {
  id: '1',
  role: 'user',
  content: 'Hello, world!',
  timestamp: new Date()
}

console.log(processMessage(exampleMessage))
`)
  const [language, setLanguage] = React.useState('typescript')
  const [height, setHeight] = React.useState('400px')

  const languages = [
    'typescript',
    'javascript',
    'python',
    'rust',
    'go',
    'json',
    'markdown',
    'css',
    'html',
  ]

  const heights = ['300px', '400px', '500px', '600px']

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm px-3 py-1.5 rounded bg-background border border-border/50 text-foreground"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            Height:
          </label>
          <select
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="text-sm px-3 py-1.5 rounded bg-background border border-border/50 text-foreground"
          >
            {heights.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setCode('')}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Live CodeEditor Demo</span>
          </div>
          <CopyButton text={code} />
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          language={language}
          height={height}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Language Support Table
// ============================================================================

function LanguageSupportTable() {
  const languages = [
    { name: 'JavaScript', id: 'javascript', features: 'Full IntelliSense, JSDoc' },
    { name: 'TypeScript', id: 'typescript', features: 'Full IntelliSense, Type Checking' },
    { name: 'Python', id: 'python', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Rust', id: 'rust', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Go', id: 'go', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Java', id: 'java', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'C/C++', id: 'cpp', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'C#', id: 'csharp', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'PHP', id: 'php', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Ruby', id: 'ruby', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Swift', id: 'swift', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Kotlin', id: 'kotlin', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Scala', id: 'scala', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'R', id: 'r', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'SQL', id: 'sql', features: 'Syntax Highlighting, Auto-Indent' },
    { name: 'Shell', id: 'shell', features: 'Syntax Highlighting' },
    { name: 'PowerShell', id: 'powershell', features: 'Syntax Highlighting' },
    { name: 'HTML', id: 'html', features: 'Tag Completion, Emmet' },
    { name: 'CSS', id: 'css', features: 'Property Completion, Color Picker' },
    { name: 'SCSS', id: 'scss', features: 'Property Completion, Nesting' },
    { name: 'JSON', id: 'json', features: 'Schema Validation, Formatting' },
    { name: 'YAML', id: 'yaml', features: 'Syntax Highlighting, Indentation' },
    { name: 'XML', id: 'xml', features: 'Tag Completion, Formatting' },
    { name: 'Markdown', id: 'markdown', features: 'Preview, Link Completion' },
    { name: 'GraphQL', id: 'graphql', features: 'Schema Validation' },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Language
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Language ID
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Features
            </th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang, index) => (
            <tr
              key={lang.id}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">
                {lang.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">
                {lang.id}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{lang.features}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 bg-muted/30 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          ... and 25+ more languages. See{' '}
          <a
            href="https://microsoft.github.io/monaco-editor/monarch.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 dark:text-brand-400 hover:underline"
          >
            Monaco Language Support
          </a>{' '}
          for the complete list.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'Current code content.',
  },
  {
    name: 'onChange',
    type: '(value: string) => void',
    required: true,
    description: 'Callback when code changes.',
  },
  {
    name: 'language',
    type: 'string',
    default: 'typescript',
    description:
      'Programming language for syntax highlighting. Supports 50+ languages (javascript, typescript, python, rust, go, etc.).',
  },
  {
    name: 'height',
    type: 'string',
    default: '100%',
    description: 'Editor height (CSS value: px, %, vh).',
  },
]

const themeProps: PropDefinition[] = [
  {
    name: 'theme',
    type: "'vs-dark' | 'light' | 'night-owl'",
    default: "'vs-dark'",
    description:
      'Editor theme. Automatically syncs with app theme. Night Owl theme is used for dark mode.',
  },
]

const editorOptions: PropDefinition[] = [
  {
    name: 'minimap.enabled',
    type: 'boolean',
    default: 'false',
    description: 'Show minimap overview of code.',
  },
  {
    name: 'fontSize',
    type: 'number',
    default: '14',
    description: 'Font size in pixels.',
  },
  {
    name: 'lineNumbers',
    type: "'on' | 'off' | 'relative' | 'interval'",
    default: "'on'",
    description: 'Line number display mode.',
  },
  {
    name: 'wordWrap',
    type: "'on' | 'off' | 'wordWrapColumn' | 'bounded'",
    default: "'on'",
    description: 'Word wrapping behavior.',
  },
  {
    name: 'formatOnPaste',
    type: 'boolean',
    default: 'true',
    description: 'Auto-format code on paste.',
  },
  {
    name: 'formatOnType',
    type: 'boolean',
    default: 'true',
    description: 'Auto-format as you type.',
  },
  {
    name: 'tabSize',
    type: 'number',
    default: '2',
    description: 'Number of spaces per tab.',
  },
  {
    name: 'scrollBeyondLastLine',
    type: 'boolean',
    default: 'false',
    description: 'Allow scrolling past the last line.',
  },
  {
    name: 'automaticLayout',
    type: 'boolean',
    default: 'true',
    description: 'Automatically adjust layout on container resize.',
  },
]

const intellisenseOptions: PropDefinition[] = [
  {
    name: 'quickSuggestions',
    type: 'boolean',
    default: 'true',
    description: 'Enable IntelliSense suggestions while typing.',
  },
  {
    name: 'suggestOnTriggerCharacters',
    type: 'boolean',
    default: 'true',
    description: 'Show suggestions on trigger characters (., @, etc.).',
  },
  {
    name: 'acceptSuggestionOnEnter',
    type: "'on' | 'off' | 'smart'",
    default: "'on'",
    description: 'Accept suggestions with Enter key.',
  },
  {
    name: 'snippetSuggestions',
    type: "'top' | 'bottom' | 'inline' | 'none'",
    default: "'top'",
    description: 'Code snippet suggestion placement.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import CodeEditor from '@/components/Playground/CodeEditor'
// Monaco Editor is lazy-loaded for performance

// For custom Monaco setup:
import { MonacoEditorWrapper } from '@/components/Playground/MonacoEditorWrapper'`

const basicUsageCode = `import { useState } from 'react'
import CodeEditor from '@/components/Playground/CodeEditor'

function MyCodeEditor() {
  const [code, setCode] = useState('// Write your code here...')

  return (
    <div className="h-96">
      <CodeEditor
        value={code}
        onChange={setCode}
        language="typescript"
        height="100%"
      />
    </div>
  )
}`

const withThemeCode = `import { useTheme } from 'next-themes'
import CodeEditor from '@/components/Playground/CodeEditor'

function ThemedCodeEditor() {
  const { theme } = useTheme()
  const [code, setCode] = useState('')

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language="javascript"
      height="500px"
    />
  )
}`

const diffViewCode = `import { DiffEditor } from '@monaco-editor/react'

function CodeDiffView() {
  const original = \`const greeting = "Hello"
console.log(greeting)\`

  const modified = \`const greeting = "Hello, World!"
console.log(greeting.toUpperCase())\`

  return (
    <DiffEditor
      height="500px"
      language="javascript"
      original={original}
      modified={modified}
      theme={theme === 'dark' ? 'night-owl' : 'light'}
    />
  )
}`

const customOptionsCode = `import Editor from '@monaco-editor/react'
import { NIGHT_OWL_MONACO_THEME } from '@clarity-chat/react'

function CustomCodeEditor() {
  const handleEditorDidMount = (editor, monaco) => {
    // Register Night Owl theme
    monaco.editor.defineTheme('night-owl', NIGHT_OWL_MONACO_THEME)
    monaco.editor.setTheme('night-owl')

    // Add custom commands
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        console.log('Save triggered')
      }
    )
  }

  return (
    <Editor
      height="600px"
      language="typescript"
      value={code}
      onChange={setCode}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: true },
        fontSize: 16,
        lineNumbers: 'on',
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 4,
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        snippetSuggestions: 'top',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: false,
      }}
    />
  )
}`

const lazyLoadingCode = `import dynamic from 'next/dynamic'

// Lazy load CodeEditor (Monaco is ~2.8 MB)
const CodeEditor = dynamic(
  () => import('@/components/Playground/CodeEditor'),
  {
    ssr: false, // Monaco requires browser APIs
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-brand-500 mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Loading Monaco Editor...
          </p>
        </div>
      </div>
    ),
  }
)

function CodePlayground() {
  return (
    <div className="space-y-4">
      <h2>Code Playground</h2>
      <CodeEditor
        value={code}
        onChange={setCode}
        language="typescript"
        height="500px"
      />
    </div>
  )
}`

const typescriptCode = `// Core CodeEditor props
interface CodeEditorProps {
  /** Current code content */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Programming language for syntax highlighting */
  language?: string
  /** Editor height (CSS value) */
  height?: string
}

// Monaco Editor wrapper props
interface MonacoEditorWrapperProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'vs-dark' | 'light'
  height?: string
}

// Monaco Editor options (subset)
interface IEditorOptions {
  // Display
  minimap?: { enabled: boolean }
  fontSize?: number
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval'
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  scrollBeyondLastLine?: boolean
  automaticLayout?: boolean

  // Editing
  formatOnPaste?: boolean
  formatOnType?: boolean
  tabSize?: number
  readOnly?: boolean

  // IntelliSense
  quickSuggestions?: boolean
  suggestOnTriggerCharacters?: boolean
  acceptSuggestionOnEnter?: 'on' | 'off' | 'smart'
  snippetSuggestions?: 'top' | 'bottom' | 'inline' | 'none'
}

// Night Owl theme
export const NIGHT_OWL_MONACO_THEME: IStandaloneThemeData`

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'theme-props', title: 'Theme Props' },
      { id: 'editor-options', title: 'Editor Options' },
      { id: 'intellisense-options', title: 'IntelliSense Options' },
    ],
  },
  { id: 'language-support', title: 'Language Support' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-theme', title: 'With Theme' },
      { id: 'example-diff', title: 'Diff View' },
      { id: 'example-custom', title: 'Custom Options' },
    ],
  },
  { id: 'monaco-integration', title: 'Monaco Integration' },
  { id: 'performance', title: 'Performance' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

// ============================================================================
// Main Page Component
// ============================================================================

export default function CodeEditorPage() {
  return (
    <DocumentationPage
      title="CodeEditor"
      description="Full-featured code editor with syntax highlighting, auto-completion, and 50+ language support for developer workflows"
      icon={Code2}
      badges={[{ label: 'Beta', variant: 'beta' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Languages,
          label: '50+ Languages',
          description: 'Comprehensive syntax support',
        },
        {
          icon: Zap,
          label: 'IntelliSense',
          description: 'Auto-completion and suggestions',
        },
        {
          icon: Palette,
          label: 'Themes',
          description: '20+ syntax themes',
        },
        {
          icon: GitCompare,
          label: 'Diff View',
          description: 'Side-by-side comparison',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'CodeBlock',
          type: 'component',
          description: 'Static code display with syntax highlighting',
          href: '/reference/components/code-block',
        },
        {
          name: 'MarkdownRenderer',
          type: 'component',
          description: 'Render markdown with code blocks',
          href: '/reference/components/markdown-renderer',
        },
        {
          name: 'useSyntaxHighlight',
          type: 'hook',
          description: 'Hook for syntax highlighting',
          href: '/reference/hooks/use-syntax-highlight',
        },
      ]}
      footerNavigation={[
        {
          label: 'CodeBlock',
          href: '/reference/components/code-block',
          direction: 'previous',
        },
        {
          label: 'MarkdownRenderer',
          href: '/reference/components/markdown-renderer',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>CodeEditor</code> is a full-featured code editor component built on{' '}
            <a
              href="https://microsoft.github.io/monaco-editor/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 hover:underline"
            >
              Monaco Editor
            </a>{' '}
            (the same editor that powers Visual Studio Code). It provides syntax
            highlighting, IntelliSense auto-completion, and support for 50+
            programming languages.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>50+ Languages:</strong> JavaScript, TypeScript, Python, Rust,
              Go, and many more
            </li>
            <li>
              <strong>IntelliSense:</strong> Intelligent code completion with
              suggestions and documentation
            </li>
            <li>
              <strong>Syntax Highlighting:</strong> Rich color coding with Night Owl
              theme support
            </li>
            <li>
              <strong>Auto-Formatting:</strong> Format on paste and format on type
            </li>
            <li>
              <strong>Diff View:</strong> Side-by-side code comparison
            </li>
            <li>
              <strong>Keyboard Shortcuts:</strong> VS Code-compatible keybindings
            </li>
            <li>
              <strong>Code Splitting:</strong> Lazy-loaded for optimal performance
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">When to Use</h4>
          <p>
            Use CodeEditor when you need an interactive code editing experience in
            your chat interface:
          </p>
          <ul className="space-y-2">
            <li>Code playgrounds and sandboxes</li>
            <li>Live code editing and collaboration</li>
            <li>Configuration editors (JSON, YAML)</li>
            <li>Query builders (SQL, GraphQL)</li>
            <li>Prompt template editors</li>
          </ul>

          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-foreground mb-2">
              Performance Note
            </h4>
            <p className="text-sm text-muted-foreground mb-0">
              Monaco Editor adds ~2.8 MB to your bundle. Use lazy loading (shown
              below) to load it only when needed. For static code display, use the
              lighter{' '}
              <Link
                href="/reference/components/code-block"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                CodeBlock
              </Link>{' '}
              component instead.
            </p>
          </div>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            CodeEditor is included in the docs site. Install Monaco Editor for
            custom implementations:
          </p>

          <CodeBlock
            code="npm install @monaco-editor/react monaco-editor"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the components:</p>

          <CodeBlock
            code={importCode}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Try the CodeEditor with different languages and heights. Full IntelliSense
          support is available for TypeScript and JavaScript.
        </p>

        <LiveDemo />
      </Section>

      {/* Basic Usage Section */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            CodeEditor requires value and onChange props. The editor automatically
            syncs with your app theme:
          </p>

          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="MyCodeEditor.tsx"
          />
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="theme-props" title="Theme Props">
          <p className="text-sm text-muted-foreground mb-4">
            Theme automatically syncs with app theme (light/dark):
          </p>
          <PropsTable props={themeProps} />
        </SubSection>

        <SubSection id="editor-options" title="Editor Options">
          <p className="text-sm text-muted-foreground mb-4">
            Monaco Editor options (configured in MonacoEditorWrapper):
          </p>
          <PropsTable props={editorOptions} />
        </SubSection>

        <SubSection id="intellisense-options" title="IntelliSense Options">
          <p className="text-sm text-muted-foreground mb-4">
            Auto-completion and suggestion settings:
          </p>
          <PropsTable props={intellisenseOptions} />
        </SubSection>
      </Section>

      {/* Language Support Section */}
      <Section id="language-support" title="Language Support">
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
          <p>
            CodeEditor supports 50+ programming languages with varying levels of
            feature support:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Full IntelliSense:</strong> JavaScript, TypeScript (type
              checking, auto-completion, JSDoc)
            </li>
            <li>
              <strong>Syntax Highlighting:</strong> All languages below
            </li>
            <li>
              <strong>Auto-Indent:</strong> Most languages
            </li>
            <li>
              <strong>Formatting:</strong> JavaScript, TypeScript, JSON, CSS, HTML
            </li>
          </ul>
        </div>

        <LanguageSupportTable />
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="example-basic" title="Basic Usage">
          <p className="text-muted-foreground mb-4">
            Minimal setup with automatic theme synchronization:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="BasicEditor.tsx"
          />
        </SubSection>

        <SubSection id="example-theme" title="With Theme">
          <p className="text-muted-foreground mb-4">
            Theme automatically syncs with next-themes:
          </p>
          <CodeBlock
            code={withThemeCode}
            language="tsx"
            filename="ThemedEditor.tsx"
          />
        </SubSection>

        <SubSection id="example-diff" title="Diff View">
          <p className="text-muted-foreground mb-4">
            Side-by-side code comparison with DiffEditor:
          </p>
          <CodeBlock code={diffViewCode} language="tsx" filename="DiffView.tsx" />
        </SubSection>

        <SubSection id="example-custom" title="Custom Options">
          <p className="text-muted-foreground mb-4">
            Full control with custom Monaco configuration:
          </p>
          <CodeBlock
            code={customOptionsCode}
            language="tsx"
            filename="CustomEditor.tsx"
          />
        </SubSection>
      </Section>

      {/* Monaco Integration Section */}
      <Section id="monaco-integration" title="Monaco Integration">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">
            Setup and Configuration
          </h4>
          <p>
            CodeEditor uses{' '}
            <code className="text-brand-600 dark:text-brand-400">
              @monaco-editor/react
            </code>{' '}
            as a wrapper around Monaco Editor. The Night Owl theme is automatically
            registered and applied in dark mode.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Custom Themes</h4>
          <p>
            Import the Night Owl theme from{' '}
            <code className="text-brand-600 dark:text-brand-400">
              @clarity-chat/react
            </code>
            :
          </p>

          <CodeBlock
            code={`import { NIGHT_OWL_MONACO_THEME } from '@clarity-chat/react'

// Register with Monaco
monaco.editor.defineTheme('night-owl', NIGHT_OWL_MONACO_THEME)
monaco.editor.setTheme('night-owl')`}
            language="typescript"
            filename="theme-setup.ts"
            showDownloadButton={false}
          />

          <h4 className="text-lg font-semibold mt-6 mb-3">Event Handlers</h4>
          <p>Access Monaco editor instance for advanced features:</p>

          <CodeBlock
            code={`const handleEditorDidMount = (editor, monaco) => {
  // Add custom keyboard shortcuts
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    () => saveCode()
  )

  // Get current selection
  const selection = editor.getSelection()
  const text = editor.getModel()?.getValueInRange(selection)

  // Format code programmatically
  editor.getAction('editor.action.formatDocument').run()
}`}
            language="typescript"
            filename="event-handlers.ts"
            showDownloadButton={false}
          />

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Language Configuration
          </h4>
          <p>Configure language-specific settings:</p>

          <CodeBlock
            code={`// TypeScript compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.CommonJS,
  noEmit: true,
  esModuleInterop: true,
  jsx: monaco.languages.typescript.JsxEmit.React,
})

// Add type definitions
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  \`declare module 'my-module' {
    export function myFunction(): string
  }\`,
  'file:///node_modules/@types/my-module/index.d.ts'
)`}
            language="typescript"
            filename="language-config.ts"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Performance Section */}
      <Section id="performance" title="Performance">
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
          <h4 className="text-lg font-semibold mt-6 mb-3">Code Splitting</h4>
          <p>
            Monaco Editor is large (~2.8 MB). Use Next.js dynamic imports with{' '}
            <code>ssr: false</code> to lazy load it:
          </p>
        </div>

        <CodeBlock
          code={lazyLoadingCode}
          language="tsx"
          filename="LazyCodeEditor.tsx"
        />

        <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
          <h4 className="text-lg font-semibold mb-3">Bundle Impact</h4>
          <ul className="space-y-2">
            <li>
              <strong>Monaco Editor:</strong> ~2.8 MB (gzipped: ~800 KB)
            </li>
            <li>
              <strong>@monaco-editor/react:</strong> ~15 KB
            </li>
            <li>
              <strong>Language Workers:</strong> Loaded on-demand per language
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Optimization Tips</h4>
          <ul className="space-y-2">
            <li>Lazy load CodeEditor with Next.js dynamic imports</li>
            <li>
              Use CodeBlock component for static code display (much lighter)
            </li>
            <li>Disable minimap for smaller screens (saves memory)</li>
            <li>
              Limit language workers to only what you need (configure webpack)
            </li>
            <li>
              Use <code>automaticLayout: false</code> if container size is fixed
            </li>
          </ul>

          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold text-foreground mb-2">
              Production Recommendation
            </h4>
            <p className="text-sm text-muted-foreground mb-0">
              For optimal initial page load, load CodeEditor only on route segments
              that need it (e.g., /playground). For chat messages with code blocks,
              use the lighter CodeBlock component which uses Prism.js (~20 KB).
            </p>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">Full type definitions:</p>
        <CodeBlock
          code={typescriptCode}
          language="tsx"
          filename="types.ts"
          showLineNumbers
        />
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
            <Keyboard className="w-5 h-5" aria-hidden="true" />
            Keyboard Navigation
          </h4>
          <p>Monaco Editor provides full keyboard support:</p>
          <ul className="space-y-2">
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Ctrl+Space</kbd>{' '}
              - Trigger IntelliSense
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Ctrl+/</kbd> -
              Toggle line comment
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Alt+Shift+F</kbd>{' '}
              - Format document
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Ctrl+F</kbd> -
              Find
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Ctrl+H</kbd> -
              Find and replace
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">F2</kbd> - Rename
              symbol
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">F12</kbd> - Go to
              definition
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>Monaco Editor has built-in screen reader optimization mode</li>
            <li>Announces cursor position and line content</li>
            <li>ARIA labels on all interactive elements</li>
            <li>
              Alert regions for errors and warnings
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Color Contrast</h4>
          <p>
            Night Owl theme meets WCAG 2.1 AA contrast requirements for syntax
            highlighting. Light theme also provides sufficient contrast.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Zoom Support</h4>
          <p>
            Editor text scales with browser zoom. Font size can be adjusted via{' '}
            <code>fontSize</code> option.
          </p>
        </div>
      </Section>

      {/* Troubleshooting Section */}
      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Editor not loading
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Ensure <code>ssr: false</code> in dynamic import
                  </li>
                  <li>Check browser console for Monaco loader errors</li>
                  <li>
                    Verify <code>@monaco-editor/react</code> is installed
                  </li>
                  <li>Clear .next cache and rebuild</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  IntelliSense not working
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    IntelliSense only works for JavaScript and TypeScript
                  </li>
                  <li>
                    Ensure <code>quickSuggestions: true</code>
                  </li>
                  <li>
                    Check TypeScript compiler options in{' '}
                    <code>monaco.languages.typescript</code>
                  </li>
                  <li>
                    Add type definitions with <code>addExtraLib</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Theme not applying
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Register theme in <code>handleEditorDidMount</code>
                  </li>
                  <li>
                    Call <code>monaco.editor.setTheme()</code> after registration
                  </li>
                  <li>
                    Ensure theme name matches <code>theme</code> prop
                  </li>
                  <li>Import NIGHT_OWL_MONACO_THEME from @clarity-chat/react</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Layout issues
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Set <code>automaticLayout: true</code> for responsive containers
                  </li>
                  <li>Ensure parent has defined height (% or px)</li>
                  <li>
                    Use <code>height</code> prop (avoid <code>style</code>)
                  </li>
                  <li>Check for CSS conflicts with editor container</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
