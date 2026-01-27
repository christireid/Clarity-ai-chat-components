/**
 * Peer Detection Examples
 *
 * Demonstrates how to use peer detection utilities to create
 * components that gracefully adapt to available dependencies.
 */

'use client'

import * as React from 'react'
import {
  usePeerCapabilities,
  usePeerAvailable,
  usePeerModule,
  getInstallationInstructions,
} from '../utils/peer-detection'

/**
 * Example 1: Component that adapts based on all capabilities
 */
export function CapabilitiesDisplay() {
  const { capabilities, isLoading, error } = usePeerCapabilities()

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded-lg bg-red-50">
        <p className="text-red-800">
          Error detecting capabilities: {error.message}
        </p>
      </div>
    )
  }

  if (!capabilities) {
    return null
  }

  const instructions = getInstallationInstructions(capabilities)

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Optional Dependencies Status</h3>

      <div className="space-y-2">
        <CapabilityStatus
          label="Token Counting (flowtoken)"
          available={capabilities.tokenCounting}
        />
        <CapabilityStatus
          label="Diagram Rendering (mermaid)"
          available={capabilities.diagrams}
        />
        <CapabilityStatus
          label="PDF Parsing (pdfjs-dist)"
          available={capabilities.pdfParsing}
        />
        <CapabilityStatus
          label="DOCX Parsing (mammoth)"
          available={capabilities.docxParsing}
        />
        <CapabilityStatus
          label="Reranking (cohere-ai)"
          available={capabilities.reranking}
        />
        <CapabilityStatus
          label="Syntax Highlighting (shiki)"
          available={capabilities.syntaxHighlighting}
        />
        <CapabilityStatus
          label="ZIP Handling (jszip)"
          available={capabilities.zipHandling}
        />
        <CapabilityStatus
          label="Markdown (react-markdown)"
          available={capabilities.markdown}
        />
        <CapabilityStatus
          label="Markdown GFM (remark-gfm)"
          available={capabilities.markdownGfm}
        />
        <CapabilityStatus
          label="Markdown Code Highlight (rehype-highlight)"
          available={capabilities.markdownCodeHighlight}
        />
        <CapabilityStatus
          label="Prism Highlighting (prismjs)"
          available={capabilities.prismHighlighting}
        />
      </div>

      {instructions.missing.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">
            Install Missing Dependencies
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            To enable all features, install the following packages:
          </p>
          <div className="space-y-1">
            <code className="block text-xs bg-white p-2 rounded border">
              {instructions.npm}
            </code>
            <code className="block text-xs bg-white p-2 rounded border">
              {instructions.pnpm}
            </code>
          </div>
        </div>
      )}
    </div>
  )
}

function CapabilityStatus({
  label,
  available,
}: {
  label: string
  available: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm">{label}</span>
      <span
        className={`text-xs px-2 py-1 rounded ${
          available
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {available ? 'Available' : 'Not Installed'}
      </span>
    </div>
  )
}

/**
 * Example 2: Adaptive token counter
 */
export function AdaptiveTokenCounter({ text }: { text: string }) {
  const { available: hasFlowtoken, isLoading } = usePeerAvailable('flowtoken')

  if (isLoading) {
    return <div className="text-sm text-gray-500">Counting tokens...</div>
  }

  if (hasFlowtoken) {
    return <AccurateTokenCount text={text} />
  }

  return <EstimatedTokenCount text={text} />
}

function AccurateTokenCount({ text }: { text: string }) {
  const { module: flowtoken } = usePeerModule('flowtoken')
  const [count, setCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (flowtoken && text) {
      try {
        // Use flowtoken for accurate counting
        const tokens = flowtoken.encode(text)
        setCount(tokens.length)
      } catch (error) {
        console.error('Error counting tokens:', error)
        setCount(null)
      }
    }
  }, [flowtoken, text])

  return (
    <div className="text-sm">
      <span className="font-semibold text-green-600">Accurate:</span>{' '}
      {count !== null ? `${count} tokens` : 'Calculating...'}
    </div>
  )
}

function EstimatedTokenCount({ text }: { text: string }) {
  // Simple estimation: ~4 characters per token (rough average)
  const estimatedTokens = Math.ceil(text.length / 4)

  return (
    <div className="text-sm">
      <span className="font-semibold text-gray-600">Estimated:</span> ~
      {estimatedTokens} tokens
      <span className="text-xs text-gray-500 ml-2">
        (Install flowtoken for accurate counting)
      </span>
    </div>
  )
}

/**
 * Example 3: Adaptive diagram renderer
 */
export function AdaptiveDiagramRenderer({ code }: { code: string }) {
  const { available: hasMermaid, isLoading } = usePeerAvailable('mermaid')

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (hasMermaid) {
    return <MermaidDiagram code={code} />
  }

  return <PlainTextDiagram code={code} />
}

function MermaidDiagram({ code }: { code: string }) {
  const { module: mermaid } = usePeerModule('mermaid')
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (mermaid && containerRef.current && code) {
      try {
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'strict',
        })

        // Render the diagram
        const id = `mermaid-${Date.now()}`
        mermaid.render(id, code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        })
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error)
      }
    }
  }, [mermaid, code])

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div ref={containerRef} className="mermaid-container" />
    </div>
  )
}

function PlainTextDiagram({ code }: { code: string }) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="mb-2 text-sm text-gray-600">
        Install <code className="bg-gray-200 px-1 rounded">mermaid</code> for
        rendered diagrams
      </div>
      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Example 4: Adaptive syntax highlighter
 */
export function AdaptiveSyntaxHighlighter({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { capabilities, isLoading } = usePeerCapabilities()

  if (isLoading) {
    return (
      <pre className="p-4 bg-gray-100 rounded">
        <code>{code}</code>
      </pre>
    )
  }

  if (capabilities?.syntaxHighlighting) {
    return <ShikiHighlighter code={code} language={language} />
  }

  if (capabilities?.prismHighlighting) {
    return <PrismHighlighter code={code} language={language} />
  }

  return <PlainCodeBlock code={code} language={language} />
}

function ShikiHighlighter({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { module: shiki } = usePeerModule('shiki')
  const [html, setHtml] = React.useState<string>('')

  React.useEffect(() => {
    if (shiki && code) {
      shiki
        .getHighlighter({
          theme: 'github-dark',
          langs: [language],
        })
        .then((highlighter: any) => {
          const highlighted = highlighter.codeToHtml(code, { lang: language })
          setHtml(highlighted)
        })
        .catch((error: any) => {
          console.error('Error highlighting with shiki:', error)
        })
    }
  }, [shiki, code, language])

  if (!html) {
    return (
      <pre className="p-4 bg-gray-900 text-white rounded">
        <code>{code}</code>
      </pre>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

function PrismHighlighter({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { module: Prism } = usePeerModule('prismjs')
  const [highlighted, setHighlighted] = React.useState<string>('')

  React.useEffect(() => {
    if (Prism && code) {
      try {
        const grammar = Prism.languages[language] || Prism.languages.plain
        const html = Prism.highlight(code, grammar, language)
        setHighlighted(html)
      } catch (error) {
        console.error('Error highlighting with Prism:', error)
        setHighlighted(code)
      }
    }
  }, [Prism, code, language])

  return (
    <pre className="p-4 bg-gray-900 text-white rounded overflow-x-auto">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted || code }}
      />
    </pre>
  )
}

function PlainCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="mb-2 text-sm text-gray-600">
        Install <code className="bg-gray-200 px-1 rounded">shiki</code> or{' '}
        <code className="bg-gray-200 px-1 rounded">prismjs</code> for syntax
        highlighting
      </div>
      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Example 5: Complete dashboard showing all adaptive features
 */
export function PeerDetectionDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Peer Detection Demo</h1>
        <p className="text-gray-600">
          This dashboard demonstrates how components adapt based on available
          optional dependencies.
        </p>
      </div>

      <CapabilitiesDisplay />

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Token Counting</h2>
        <AdaptiveTokenCounter text="The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate token counting with and without the flowtoken library." />
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Diagram Rendering</h2>
        <AdaptiveDiagramRenderer
          code={`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`}
        />
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Syntax Highlighting</h2>
        <AdaptiveSyntaxHighlighter
          language="typescript"
          code={`function greet(name: string): string {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))`}
        />
      </div>
    </div>
  )
}
