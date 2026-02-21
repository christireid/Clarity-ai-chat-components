/**
 * Peer Detection Integration Examples
 *
 * Shows how to integrate peer detection into existing Clarity Chat components
 * for graceful degradation and progressive enhancement.
 */

'use client'

import * as React from 'react'
import {
  usePeerCapabilities,
  usePeerAvailable,
  usePeerModule,
} from '../utils/peer-detection'

/**
 * Integration Example 1: Enhanced Message Renderer
 *
 * Adapts markdown rendering based on available peers:
 * - react-markdown + remark-gfm + rehype-highlight: Full featured
 * - react-markdown only: Basic markdown
 * - None: Plain text with basic formatting
 */
export function AdaptiveMessageRenderer({ content }: { content: string }) {
  const { capabilities } = usePeerCapabilities()

  if (!capabilities) {
    return <div className="text-gray-500">Loading...</div>
  }

  // Best experience: Full markdown with GFM and syntax highlighting
  if (
    capabilities.markdown &&
    capabilities.markdownGfm &&
    capabilities.markdownCodeHighlight
  ) {
    return <FullMarkdownRenderer content={content} />
  }

  // Good experience: Basic markdown only
  if (capabilities.markdown) {
    return <BasicMarkdownRenderer content={content} />
  }

  // Fallback: Plain text with manual formatting
  return <PlainTextRenderer content={content} />
}

function FullMarkdownRenderer({ content }: { content: string }) {
  const { module: ReactMarkdown } = usePeerModule('react-markdown')
  const { module: remarkGfm } = usePeerModule('remark-gfm')
  const { module: rehypeHighlight } = usePeerModule('rehype-highlight')

  if (!ReactMarkdown) return null

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={remarkGfm ? [remarkGfm] : []}
        rehypePlugins={rehypeHighlight ? [rehypeHighlight] : []}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function BasicMarkdownRenderer({ content }: { content: string }) {
  const { module: ReactMarkdown } = usePeerModule('react-markdown')

  if (!ReactMarkdown) return null

  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}

function PlainTextRenderer({ content }: { content: string }) {
  return (
    <div className="whitespace-pre-wrap text-sm">
      {content}
      <div className="mt-2 text-xs text-gray-500 italic">
        Install react-markdown for enhanced formatting
      </div>
    </div>
  )
}

/**
 * Integration Example 2: Adaptive Token Budget Monitor
 *
 * Shows accurate token counts with flowtoken, or estimates without it.
 */
export function AdaptiveTokenBudgetMonitor({
  messages,
  maxTokens,
}: {
  messages: Array<{ content: string }>
  maxTokens: number
}) {
  const { available: hasFlowtoken, isLoading } = usePeerAvailable('flowtoken')
  const { module: flowtoken } = usePeerModule('flowtoken')
  const [tokenCount, setTokenCount] = React.useState<number>(0)

  React.useEffect(() => {
    if (hasFlowtoken && flowtoken) {
      // Accurate counting with flowtoken
      const totalText = messages.map((m) => m.content).join('\n')
      const tokens = flowtoken.encode(totalText)
      setTokenCount(tokens.length)
    } else {
      // Estimate: ~4 chars per token
      const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0)
      setTokenCount(Math.ceil(totalChars / 4))
    }
  }, [messages, hasFlowtoken, flowtoken])

  if (isLoading) {
    return <div className="text-sm text-gray-500">Calculating tokens...</div>
  }

  const percentage = (tokenCount / maxTokens) * 100
  const isNearLimit = percentage > 80

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Token Usage</span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            hasFlowtoken
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {hasFlowtoken ? 'Accurate' : 'Estimated'}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{tokenCount.toLocaleString()} tokens</span>
          <span className="text-gray-500">
            {maxTokens.toLocaleString()} max
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isNearLimit ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {isNearLimit && (
          <div className="text-xs text-red-600">
            Warning: Approaching token limit
          </div>
        )}

        {!hasFlowtoken && (
          <div className="text-xs text-gray-500 mt-2">
            Install flowtoken for accurate token counting
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Integration Example 3: Enhanced Code Block
 *
 * Progressive enhancement for code syntax highlighting:
 * - shiki: Best (accurate, fast, many themes)
 * - prismjs: Good (basic highlighting)
 * - none: Plain code block
 */
export function AdaptiveCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { capabilities } = usePeerCapabilities()

  if (!capabilities) {
    return <PlainCodeBlock code={code} language={language} />
  }

  if (capabilities.syntaxHighlighting) {
    return <ShikiCodeBlock code={code} language={language} />
  }

  if (capabilities.prismHighlighting) {
    return <PrismCodeBlock code={code} language={language} />
  }

  return <PlainCodeBlock code={code} language={language} />
}

function ShikiCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { module: shiki } = usePeerModule('shiki')
  const [html, setHtml] = React.useState<string>('')

  React.useEffect(() => {
    if (shiki) {
      shiki
        .getHighlighter({
          theme: 'github-dark',
          langs: [language],
        })
        .then((highlighter: any) => {
          const highlighted = highlighter.codeToHtml(code, { lang: language })
          setHtml(highlighted)
        })
        .catch((err: any) => {
          console.error('Shiki error:', err)
        })
    }
  }, [shiki, code, language])

  if (!html) {
    return <PlainCodeBlock code={code} language={language} />
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function PrismCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const { module: Prism } = usePeerModule('prismjs')

  const highlighted = React.useMemo(() => {
    if (!Prism) return code

    try {
      const grammar = Prism.languages[language] || Prism.languages.plain
      return Prism.highlight(code, grammar, language)
    } catch {
      return code
    }
  }, [Prism, code, language])

  return (
    <pre className="p-4 bg-gray-900 text-white rounded-lg overflow-x-auto">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
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
    <pre className="p-4 bg-gray-100 border rounded-lg overflow-x-auto">
      <code className={`language-${language} text-sm`}>{code}</code>
    </pre>
  )
}

/**
 * Integration Example 4: Document Upload with Smart Detection
 *
 * Only shows upload options for document types we can parse.
 */
export function SmartDocumentUpload({
  onFileUpload,
}: {
  onFileUpload: (file: File) => void
}) {
  const { capabilities, isLoading } = usePeerCapabilities()

  if (isLoading) {
    return (
      <div className="text-sm text-gray-500">Loading upload options...</div>
    )
  }

  if (!capabilities) {
    return null
  }

  const acceptedTypes: string[] = []
  const supportedFormats: string[] = []

  if (capabilities.pdfParsing) {
    acceptedTypes.push('.pdf', 'application/pdf')
    supportedFormats.push('PDF')
  }

  if (capabilities.docxParsing) {
    acceptedTypes.push(
      '.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    supportedFormats.push('DOCX')
  }

  if (capabilities.zipHandling) {
    acceptedTypes.push('.zip', 'application/zip')
    supportedFormats.push('ZIP')
  }

  // Always support plain text
  acceptedTypes.push('.txt', '.md', 'text/plain', 'text/markdown')
  supportedFormats.push('TXT', 'MD')

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="text-center">
          <div className="text-sm font-medium">Upload Document</div>
          <div className="text-xs text-gray-500 mt-1">
            Supported: {supportedFormats.join(', ')}
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
        />
      </label>

      {(!capabilities.pdfParsing || !capabilities.docxParsing) && (
        <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
          <strong>Tip:</strong> Install{' '}
          {!capabilities.pdfParsing && (
            <code className="bg-white px-1">pdfjs-dist</code>
          )}
          {!capabilities.pdfParsing && !capabilities.docxParsing && ' and '}
          {!capabilities.docxParsing && (
            <code className="bg-white px-1">mammoth</code>
          )}{' '}
          for additional document support
        </div>
      )}
    </div>
  )
}

/**
 * Integration Example 5: Chat Interface with Adaptive Features
 *
 * Complete chat interface that adapts all features based on available peers.
 */
export function AdaptiveChatInterface() {
  const { capabilities, isLoading } = usePeerCapabilities()
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div className="text-sm text-gray-500">Initializing chat...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Feature Status Header */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">Active Features:</span>
          {capabilities?.markdown && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              Markdown
            </span>
          )}
          {capabilities?.tokenCounting && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              Token Counting
            </span>
          )}
          {capabilities?.diagrams && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              Diagrams
            </span>
          )}
          {capabilities?.syntaxHighlighting && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              Syntax Highlighting
            </span>
          )}
          {capabilities?.pdfParsing && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              PDF Support
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'
            }`}
          >
            <AdaptiveMessageRenderer content={msg.content} />
          </div>
        ))}
      </div>

      {/* Token Budget (if available) */}
      {capabilities?.tokenCounting && (
        <div className="border-t p-3">
          <AdaptiveTokenBudgetMonitor messages={messages} maxTokens={4096} />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Send
          </button>
        </div>

        {/* Document Upload (if supported) */}
        {(capabilities?.pdfParsing || capabilities?.docxParsing) && (
          <div className="mt-2">
            <SmartDocumentUpload
              onFileUpload={(file) => console.log('File uploaded:', file)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
