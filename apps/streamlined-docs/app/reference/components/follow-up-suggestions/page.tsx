'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, Sparkles, MessageCircle, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ISR caching configuration
export const revalidate = 3600

// Demo FollowUpSuggestions component
interface DemoSuggestion {
  id: string
  title: string
  description?: string
  keywords?: string[]
  icon?: React.ReactNode
  confidence?: number
}

interface DemoFollowUpSuggestionsProps {
  suggestions: DemoSuggestion[]
  onSelect: (suggestion: DemoSuggestion) => void
  layout: 'grid' | 'list' | 'chips'
  variant: 'default' | 'compact' | 'detailed'
  maxSuggestions: number
  showConfidence: boolean
  showKeywords: boolean
  showIcons: boolean
  isLoading: boolean
}

function DemoFollowUpSuggestions({
  suggestions,
  onSelect,
  layout,
  variant,
  maxSuggestions,
  showConfidence,
  showKeywords,
  showIcons,
  isLoading,
}: DemoFollowUpSuggestionsProps) {
  const displayedSuggestions = suggestions.slice(0, maxSuggestions)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Generating suggestions...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-3',
    list: 'flex flex-col gap-2',
    chips: 'flex flex-wrap gap-2',
  }

  const variantClasses = {
    default: 'p-4',
    compact: 'p-3',
    detailed: 'p-5',
  }

  if (layout === 'chips') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Suggested follow-ups</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {displayedSuggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.id}
              onClick={() => onSelect(suggestion)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-muted/50 hover:bg-muted text-sm font-medium',
                'border border-border/50 hover:border-primary/50',
                'transition-all duration-200 hover:shadow-sm',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              )}
              aria-label={`Follow up with ${suggestion.title}`}
            >
              {showIcons && suggestion.icon && (
                <span className="text-primary">{suggestion.icon}</span>
              )}
              <span className="text-foreground">{suggestion.title}</span>
              {showConfidence && suggestion.confidence !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(suggestion.confidence * 100)}%
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Suggested follow-ups</span>
      </div>
      <div className={layoutClasses[layout]}>
        {displayedSuggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              'group flex flex-col items-start text-left rounded-xl',
              'bg-card border border-border/50 hover:border-primary/50',
              'hover:bg-accent/50 transition-all duration-200',
              'hover:shadow-md hover:-translate-y-0.5',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              variantClasses[variant]
            )}
            aria-label={`Follow up with ${suggestion.title}`}
          >
            <div className="flex items-start gap-3 w-full">
              {showIcons && suggestion.icon && (
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20 group-hover:bg-primary/20 transition-colors">
                  {suggestion.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {suggestion.title}
                  </h4>
                  {showConfidence && suggestion.confidence !== undefined && (
                    <span
                      className={cn(
                        'flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full',
                        suggestion.confidence >= 0.75
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : suggestion.confidence >= 0.5
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-muted/50 text-muted-foreground'
                      )}
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  )}
                </div>
                {variant !== 'compact' && suggestion.description && (
                  <p className="text-xs text-muted-foreground/80 leading-relaxed mb-2">
                    {suggestion.description}
                  </p>
                )}
                {showKeywords && suggestion.keywords && suggestion.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {suggestion.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted/50 text-muted-foreground"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function FollowUpSuggestionsPage() {
  const [layout, setLayout] = React.useState<'grid' | 'list' | 'chips'>('grid')
  const [variant, setVariant] = React.useState<'default' | 'compact' | 'detailed'>('default')
  const [maxSuggestions, setMaxSuggestions] = React.useState(4)
  const [showConfidence, setShowConfidence] = React.useState(true)
  const [showKeywords, setShowKeywords] = React.useState(true)
  const [showIcons, setShowIcons] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)

  const mockSuggestions: DemoSuggestion[] = [
    {
      id: '1',
      title: 'How do I implement this with TypeScript?',
      description: 'Get step-by-step guidance for TypeScript integration',
      keywords: ['typescript', 'implementation', 'types'],
      icon: <Lightbulb className="w-4 h-4" />,
      confidence: 0.95,
    },
    {
      id: '2',
      title: 'Show me code examples',
      description: 'View practical examples and usage patterns',
      keywords: ['examples', 'code', 'snippets'],
      icon: <MessageCircle className="w-4 h-4" />,
      confidence: 0.88,
    },
    {
      id: '3',
      title: 'What are the performance considerations?',
      description: 'Learn about optimization and best practices',
      keywords: ['performance', 'optimization', 'best practices'],
      icon: <Brain className="w-4 h-4" />,
      confidence: 0.82,
    },
    {
      id: '4',
      title: 'How does this integrate with my existing code?',
      description: 'Understand integration patterns and compatibility',
      keywords: ['integration', 'compatibility', 'migration'],
      icon: <Sparkles className="w-4 h-4" />,
      confidence: 0.75,
    },
    {
      id: '5',
      title: 'What are common pitfalls to avoid?',
      description: 'Discover common mistakes and how to prevent them',
      keywords: ['pitfalls', 'errors', 'debugging'],
      icon: <Lightbulb className="w-4 h-4" />,
      confidence: 0.70,
    },
    {
      id: '6',
      title: 'Can you explain the architecture?',
      description: 'Deep dive into system design and structure',
      keywords: ['architecture', 'design', 'structure'],
      icon: <Brain className="w-4 h-4" />,
      confidence: 0.65,
    },
  ]

  const handleSelect = (suggestion: DemoSuggestion) => {
    alert(`Selected: ${suggestion.title}`)
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">FollowUpSuggestions</h1>
              <p className="text-sm text-muted-foreground mt-1">AI Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            AI-generated follow-up suggestions to keep conversations flowing naturally. Display contextual prompts that guide users to continue the dialogue.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 min-h-[400px]">
              <div className="max-w-3xl mx-auto">
                <DemoFollowUpSuggestions
                  suggestions={mockSuggestions}
                  onSelect={handleSelect}
                  layout={layout}
                  variant={variant}
                  maxSuggestions={maxSuggestions}
                  showConfidence={showConfidence}
                  showKeywords={showKeywords}
                  showIcons={showIcons}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Layout</label>
                <div className="flex flex-wrap gap-2">
                  {(['grid', 'list', 'chips'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLayout(l)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        layout === l
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Variant</label>
                <div className="flex flex-wrap gap-2">
                  {(['default', 'compact', 'detailed'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        variant === v
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Max Suggestions: {maxSuggestions}
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="1"
                  value={maxSuggestions}
                  onChange={(e) => setMaxSuggestions(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIcons}
                    onChange={(e) => setShowIcons(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Icons</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showConfidence}
                    onChange={(e) => setShowConfidence(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Confidence</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showKeywords}
                    onChange={(e) => setShowKeywords(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Keywords</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLoading}
                    onChange={(e) => setIsLoading(e.target.checked)}
                    className="rounded"
                  />
                  <span>Loading State</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Grid Layout</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { FollowUpSuggestions } from '@clarity-chat/react'

function ChatInterface() {
  const suggestions = [
    {
      id: '1',
      title: 'How do I implement this?',
      description: 'Get implementation guidance',
      keywords: ['implementation', 'guide'],
      confidence: 0.95,
    },
    {
      id: '2',
      title: 'Show me examples',
      description: 'View code examples',
      keywords: ['examples', 'code'],
      confidence: 0.88,
    },
  ]

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      onSelect={(suggestion) => {
        console.log('Selected:', suggestion.title)
      }}
      layout="grid"
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Chip Layout (Compact)</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<FollowUpSuggestions
  suggestions={suggestions}
  onSelect={handleSelect}
  layout="chips"
  maxSuggestions={3}
  showConfidence={false}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Integration with Chat</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useClarityChat, FollowUpSuggestions } from '@clarity-chat/react'

function ChatWithSuggestions() {
  const { messages, append, followUpSuggestions } = useClarityChat({
    api: '/api/chat',
    generateFollowUps: true,
  })

  return (
    <div>
      <MessageList messages={messages} />

      {followUpSuggestions && (
        <FollowUpSuggestions
          suggestions={followUpSuggestions}
          onSelect={(suggestion) => {
            append({
              role: 'user',
              content: suggestion.title,
            })
          }}
          layout="grid"
          variant="default"
        />
      )}

      <ChatInput onSend={append} />
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Loading State</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`function ChatWithLoadingSuggestions() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    generateSuggestions()
  }, [lastMessage])

  const generateSuggestions = async () => {
    setIsGenerating(true)
    const result = await fetch('/api/suggestions')
    setSuggestions(await result.json())
    setIsGenerating(false)
  }

  return (
    <FollowUpSuggestions
      suggestions={suggestions}
      onSelect={handleSelect}
      isLoading={isGenerating}
      loadingCount={4}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>suggestions</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">FollowUpSuggestion[]</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Array of suggestion objects</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>onSelect</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">(suggestion) =&gt; void</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Callback when suggestion is clicked</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>layout</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'grid' | 'list' | 'chips'</td>
                  <td className="py-3 px-4 text-muted-foreground">'grid'</td>
                  <td className="py-3 px-4 text-muted-foreground">Display layout style</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>variant</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'default' | 'compact' | 'detailed'</td>
                  <td className="py-3 px-4 text-muted-foreground">'default'</td>
                  <td className="py-3 px-4 text-muted-foreground">Suggestion card style variant</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>maxSuggestions</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">4</td>
                  <td className="py-3 px-4 text-muted-foreground">Maximum number of suggestions to display</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>title</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">'Suggested follow-ups'</td>
                  <td className="py-3 px-4 text-muted-foreground">Section heading text</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>subtitle</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Optional subtitle/description</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>isLoading</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Show loading skeleton state</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>loadingCount</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">4</td>
                  <td className="py-3 px-4 text-muted-foreground">Number of skeleton cards when loading</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showConfidence</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Display confidence scores as badges</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showKeywords</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Display keyword tags</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showIcons</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Display suggestion icons</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>emptyState</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">React.ReactNode</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Custom empty state component</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Suggestion Object Type */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">FollowUpSuggestion Type</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <pre className="text-sm">
              <code>{`interface FollowUpSuggestion {
  id: string                  // Unique identifier
  title: string               // Main suggestion text
  description?: string        // Optional detailed description
  keywords?: string[]         // Related keywords/tags
  icon?: React.ReactNode      // Optional icon element
  confidence?: number         // AI confidence score (0-1)
}`}</code>
            </pre>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-semibold">AI-Powered Suggestions</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate contextual follow-up questions based on conversation history and AI understanding
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Multiple Layouts</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Grid, list, and chip layouts to match your UI design and space constraints
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Confidence Scores</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Display AI confidence levels to help users choose the most relevant suggestions
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Smooth Animations</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Framer Motion animations with reduced motion support for accessibility
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="font-semibold">Mobile-Responsive</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Adapts seamlessly from mobile to desktop with touch-friendly interactions
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h3 className="font-semibold">WCAG 2.1 AA</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Full keyboard navigation, ARIA labels, and screen reader support
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Real-time streaming message display</p>
            </Link>

            <Link
              href="/reference/components/chat-input"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">ChatInput</h3>
              <p className="text-sm text-muted-foreground">Customizable input for sending messages</p>
            </Link>

            <Link
              href="/reference/components/prompt-library"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">PromptLibrary</h3>
              <p className="text-sm text-muted-foreground">Browse and select from saved prompts</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
