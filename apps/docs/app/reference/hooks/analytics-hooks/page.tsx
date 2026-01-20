'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function AnalyticsHooksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Hooks Collection</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Analytics Hooks</h1>
        <p className="text-xl text-muted-foreground mb-4">
          10 convenience hooks for common analytics patterns: visibility tracking, scroll depth, timing, lifecycle events, and more.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Hooks (Composable) •{' '}
          <strong>Domain:</strong> Analytics & Tracking
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import {
  useTrackMount,
  useTrackUnmount,
  useTrackChange,
  useTrackVisibility,
  useTrackClick,
  useTrackSubmit,
  useTrackError,
  useTrackTiming,
  useTrackFeature,
  useTrackScrollDepth,
  useTrackTimeOnPage,
} from '@clarity-chat/react'`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            Lifecycle
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Viewport
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Performance
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
            Events
          </span>
        </div>
      </section>

      {/* useTrackMount */}
      <section className="mb-12" id="use-track-mount">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackMount</h2>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm">
            Lifecycle
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Track when a component mounts.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record&lt;string, any&gt;</td>
                <td className="p-3">Optional event properties</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ChatWindow() {
  // Track when chat opens
  useTrackMount('chat_window_opened', {
    source: 'floating_button',
    page: window.location.pathname,
    viewport_width: window.innerWidth,
  })

  return <div>Chat interface</div>
}

function FeatureSection() {
  useTrackMount('feature_section_viewed', {
    feature_name: 'code_highlighting',
    user_segment: 'developer',
  })

  return <section>Feature content</section>
}`}</code>
        </pre>
      </section>

      {/* useTrackUnmount */}
      <section className="mb-12" id="use-track-unmount">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackUnmount</h2>
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm">
            Lifecycle
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Track when a component unmounts with support for dynamic properties.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record | () =&gt; Record</td>
                <td className="p-3">Static properties or function returning properties</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ChatSession() {
  const [messageCount, setMessageCount] = useState(0)
  const openTime = useRef(Date.now())

  // Static properties
  useTrackUnmount('chat_session_ended', {
    reason: 'user_closed',
  })

  // Dynamic properties - function is called at unmount time
  useTrackUnmount('chat_session_stats', () => ({
    messages_sent: messageCount,
    duration_ms: Date.now() - openTime.current,
    duration_seconds: Math.round((Date.now() - openTime.current) / 1000),
  }))

  return (
    <div>
      <MessageList />
      <MessageInput onSend={() => setMessageCount(c => c + 1)} />
    </div>
  )
}`}</code>
        </pre>
      </section>

      {/* useTrackChange */}
      <section className="mb-12" id="use-track-change">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackChange</h2>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
            State
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Track when a value changes.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">value</td>
                <td className="p-3 font-mono text-xs">any</td>
                <td className="p-3">Value to watch for changes</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record | (value) =&gt; Record</td>
                <td className="p-3">Static or dynamic properties</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ThemeSelector() {
  const [theme, setTheme] = useState('light')

  // Track theme changes
  useTrackChange('theme_changed', theme, {
    component: 'theme_selector',
  })

  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}

function SearchInput() {
  const [query, setQuery] = useState('')

  // Track with dynamic properties based on value
  useTrackChange('search_query_changed', query, (value) => ({
    query_length: value.length,
    has_filters: value.includes(':'),
    is_empty: value === '',
  }))

  return <input value={query} onChange={e => setQuery(e.target.value)} />
}`}</code>
        </pre>
      </section>

      {/* useTrackVisibility */}
      <section className="mb-12" id="use-track-visibility">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackVisibility</h2>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm">
            Viewport
          </span>
        </div>
        <p className="text-muted-foreground mb-4">
          Track when an element enters the viewport using IntersectionObserver. Returns a ref to attach to the element.
        </p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record&lt;string, any&gt;</td>
                <td className="p-3">Event properties</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">options</td>
                <td className="p-3 font-mono text-xs">IntersectionObserverInit</td>
                <td className="p-3">IntersectionObserver options (threshold, rootMargin)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function PromoBanner() {
  // Track when banner becomes visible
  const ref = useTrackVisibility('promo_banner_viewed', {
    banner_id: 'summer-sale-2024',
    position: 'hero',
    variant: 'A',
  })

  return (
    <div ref={ref} className="promo-banner">
      Summer Sale - 50% Off!
    </div>
  )
}

function CTASection() {
  // Track when 50% of element is visible
  const ref = useTrackVisibility(
    'cta_section_viewed',
    { section: 'pricing' },
    { threshold: 0.5 }
  )

  return <section ref={ref}>Pricing content</section>
}

function LazyLoadedContent() {
  // Track with rootMargin for pre-loading awareness
  const ref = useTrackVisibility(
    'content_approaching',
    { content_id: '123' },
    { rootMargin: '200px' } // Track when within 200px of viewport
  )

  return <div ref={ref}>Content</div>
}`}</code>
        </pre>
      </section>

      {/* useTrackClick */}
      <section className="mb-12" id="use-track-click">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackClick</h2>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded text-sm">
            Events
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Returns a click handler that tracks events.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record | (event) =&gt; Record</td>
                <td className="p-3">Static or event-based properties</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ActionBar() {
  // Static properties
  const handleCopy = useTrackClick('code_copied', {
    language: 'typescript',
    lines: 42,
  })

  // Dynamic properties from event
  const handleLink = useTrackClick('link_clicked', (event) => ({
    href: (event.target as HTMLAnchorElement).href,
    text: (event.target as HTMLElement).textContent,
    x: event.clientX,
    y: event.clientY,
  }))

  // Combine with other handlers
  const handleDownload = useTrackClick('download_clicked', { format: 'pdf' })

  const onDownload = (e: React.MouseEvent) => {
    handleDownload(e)
    startDownload()
  }

  return (
    <div>
      <button onClick={handleCopy}>Copy</button>
      <a href="/docs" onClick={handleLink}>Docs</a>
      <button onClick={onDownload}>Download PDF</button>
    </div>
  )
}`}</code>
        </pre>
      </section>

      {/* useTrackSubmit */}
      <section className="mb-12" id="use-track-submit">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackSubmit</h2>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded text-sm">
            Events
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Returns a form submit handler that tracks events.</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ContactForm() {
  const [email, setEmail] = useState('')

  const trackSubmit = useTrackSubmit('contact_form_submitted', {
    form_name: 'contact',
    page: '/contact',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackSubmit(e)
    // Submit form...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

function SearchForm() {
  // Extract form data in handler
  const trackSubmit = useTrackSubmit('search_submitted', (event) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    return {
      query: formData.get('query'),
      filters: formData.get('filters'),
    }
  })

  return (
    <form onSubmit={trackSubmit}>
      <input name="query" />
      <select name="filters">...</select>
      <button type="submit">Search</button>
    </form>
  )
}`}</code>
        </pre>
      </section>

      {/* useTrackError */}
      <section className="mb-12" id="use-track-error">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackError</h2>
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm">
            Errors
          </span>
        </div>
        <p className="text-muted-foreground mb-4">
          Returns a function for manual error tracking with stack traces.
          <br />
          <code className="text-xs">(error: Error | unknown, properties?: Record) =&gt; void</code>
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function DataFetcher() {
  const trackError = useTrackError()
  const [data, setData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await api.getData()
      setData(response)
    } catch (error) {
      // Track with context
      trackError(error, {
        context: 'data_fetch',
        endpoint: '/api/data',
        retry_count: retryCount,
      })

      // Re-throw or handle
      throw error
    }
  }

  return <button onClick={fetchData}>Load Data</button>
}

// Tracked event structure:
// {
//   event: 'error_occurred',
//   error: 'TypeError: Cannot read property...',
//   stack: 'TypeError: Cannot read property...\\n    at fetchData...',
//   context: 'data_fetch',
//   endpoint: '/api/data'
// }`}</code>
        </pre>
      </section>

      {/* useTrackTiming */}
      <section className="mb-12" id="use-track-timing">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackTiming</h2>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-sm">
            Performance
          </span>
        </div>
        <p className="text-muted-foreground mb-4">
          Measure and track performance metrics with named timers.
          <br />
          Returns: <code className="text-xs">{'{ startTimer: (name: string) => void, endTimer: (name: string, props?) => void }'}</code>
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ConversationLoader() {
  const { startTimer, endTimer } = useTrackTiming()

  const loadConversation = async (id: string) => {
    startTimer('conversation_load')

    const data = await fetchConversation(id)

    endTimer('conversation_load', {
      conversation_id: id,
      message_count: data.messages.length,
      total_tokens: data.totalTokens,
    })

    return data
  }

  return <button onClick={() => loadConversation('123')}>Load</button>
}

function StreamingResponse() {
  const { startTimer, endTimer } = useTrackTiming()

  const handleStream = async () => {
    startTimer('first_token')
    startTimer('full_response')

    let firstToken = true
    for await (const chunk of stream) {
      if (firstToken) {
        endTimer('first_token') // Time to first token
        firstToken = false
      }
      // Process chunk...
    }

    endTimer('full_response', {
      total_chunks: chunkCount,
      total_tokens: tokenCount,
    })
  }

  return <button onClick={handleStream}>Generate</button>
}

// Tracked event:
// {
//   event: 'performance_measured',
//   timer_name: 'conversation_load',
//   duration_ms: 234,
//   conversation_id: '123',
//   message_count: 15
// }`}</code>
        </pre>
      </section>

      {/* useTrackFeature */}
      <section className="mb-12" id="use-track-feature">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackFeature</h2>
          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-sm">
            Debounced
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Track feature usage with optional debouncing for frequent events.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Default</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">-</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">debounceMs</td>
                <td className="p-3 font-mono text-xs">number</td>
                <td className="p-3">0</td>
                <td className="p-3">Debounce delay in milliseconds</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function SearchInput() {
  // Debounce search tracking to avoid flooding analytics
  const trackSearch = useTrackFeature('search_typed', 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    trackSearch({
      query: e.target.value,
      length: e.target.value.length,
    })
  }

  return <input onChange={handleChange} placeholder="Search..." />
}

function CodeEditor() {
  // Track code changes with longer debounce
  const trackEdit = useTrackFeature('code_edited', 1000)

  const handleChange = (code: string) => {
    trackEdit({
      line_count: code.split('\\n').length,
      char_count: code.length,
    })
  }

  return <Editor onChange={handleChange} />
}

function InstantTrack() {
  // No debounce (immediate tracking)
  const trackFeature = useTrackFeature('feature_used', 0)

  return (
    <button onClick={() => trackFeature({ feature: 'export' })}>
      Export
    </button>
  )
}`}</code>
        </pre>
      </section>

      {/* useTrackScrollDepth */}
      <section className="mb-12" id="use-track-scroll-depth">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackScrollDepth</h2>
          <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 rounded text-sm">
            Scroll
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Track scroll depth milestones on the page.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Default</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">-</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">thresholds</td>
                <td className="p-3 font-mono text-xs">number[]</td>
                <td className="p-3">[25, 50, 75, 100]</td>
                <td className="p-3">Percentage milestones to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record&lt;string, any&gt;</td>
                <td className="p-3">-</td>
                <td className="p-3">Additional event properties</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ArticlePage() {
  // Track default milestones: 25%, 50%, 75%, 100%
  useTrackScrollDepth('article_scrolled', [25, 50, 75, 100], {
    article_id: '123',
    category: 'tutorial',
    word_count: 2500,
  })

  return (
    <article>
      <h1>Building AI Chat Applications</h1>
      {/* Long article content... */}
    </article>
  )
}

function LandingPage() {
  // Custom milestones for landing page
  useTrackScrollDepth('landing_scrolled', [10, 25, 50, 75, 90], {
    variant: 'B',
    campaign: 'summer-2024',
  })

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </main>
  )
}

// Events fired as user scrolls:
// { event: 'article_scrolled', scroll_depth: 25, article_id: '123' }
// { event: 'article_scrolled', scroll_depth: 50, article_id: '123' }
// { event: 'article_scrolled', scroll_depth: 75, article_id: '123' }
// { event: 'article_scrolled', scroll_depth: 100, article_id: '123' }`}</code>
        </pre>
      </section>

      {/* useTrackTimeOnPage */}
      <section className="mb-12" id="use-track-time-on-page">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-semibold">useTrackTimeOnPage</h2>
          <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded text-sm">
            Engagement
          </span>
        </div>
        <p className="text-muted-foreground mb-4">Track time spent on a page or component when it unmounts.</p>
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Parameter</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">eventName</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3">Event name to track</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">properties</td>
                <td className="p-3 font-mono text-xs">Record&lt;string, any&gt;</td>
                <td className="p-3">Additional event properties</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`function ArticlePage({ article }) {
  // Automatically tracks time when user navigates away
  useTrackTimeOnPage('article_time_spent', {
    article_id: article.id,
    title: article.title,
    category: article.category,
  })

  return (
    <article>
      <h1>{article.title}</h1>
      {article.content}
    </article>
  )
}

function ChatWindow() {
  useTrackTimeOnPage('chat_session_duration', {
    source: 'floating_button',
  })

  return <ChatInterface />
}

// Event tracked on unmount:
// {
//   event: 'article_time_spent',
//   time_spent_ms: 45000,
//   time_spent_seconds: 45,
//   article_id: '123',
//   title: 'Building AI Chat Applications',
//   category: 'tutorial'
// }`}</code>
        </pre>
      </section>

      {/* Complete Example */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Complete Example</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Using multiple hooks together in a chat application.
        </p>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import {
  useTrackMount,
  useTrackUnmount,
  useTrackClick,
  useTrackTiming,
  useTrackError,
  useTrackVisibility,
  useTrackTimeOnPage,
} from '@clarity-chat/react'

function ChatPage() {
  const [messageCount, setMessageCount] = useState(0)
  const { startTimer, endTimer } = useTrackTiming()
  const trackError = useTrackError()

  // Track page visit and time spent
  useTrackMount('chat_page_opened', { source: 'navigation' })
  useTrackTimeOnPage('chat_page_time', { page: '/chat' })
  useTrackUnmount('chat_page_closed', () => ({ messages_sent: messageCount }))

  // Track CTA visibility
  const ctaRef = useTrackVisibility('upgrade_cta_viewed', { position: 'sidebar' })

  // Track button clicks
  const handleExport = useTrackClick('conversation_exported', { format: 'pdf' })

  const sendMessage = async (content: string) => {
    startTimer('message_send')
    try {
      await api.sendMessage(content)
      setMessageCount(c => c + 1)
      endTimer('message_send', { success: true })
    } catch (error) {
      trackError(error, { context: 'send_message' })
      endTimer('message_send', { success: false })
    }
  }

  return (
    <div className="chat-page">
      <MessageList />
      <MessageInput onSend={sendMessage} />

      <aside>
        <div ref={ctaRef}>
          <UpgradeCTA />
        </div>
        <button onClick={handleExport}>Export</button>
      </aside>
    </div>
  )
}`}</code>
        </pre>
      </section>

      {/* Hook Summary Table */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Hook Summary</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Hook</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Returns</th>
                <th className="text-left p-3 font-medium">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">useTrackMount</td>
                <td className="p-3">Lifecycle</td>
                <td className="p-3">void</td>
                <td className="p-3">Component opened/initialized</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackUnmount</td>
                <td className="p-3">Lifecycle</td>
                <td className="p-3">void</td>
                <td className="p-3">Component closed with final stats</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackChange</td>
                <td className="p-3">State</td>
                <td className="p-3">void</td>
                <td className="p-3">Settings/preferences changed</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackVisibility</td>
                <td className="p-3">Viewport</td>
                <td className="p-3">ref</td>
                <td className="p-3">Element seen by user</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackClick</td>
                <td className="p-3">Events</td>
                <td className="p-3">handler</td>
                <td className="p-3">Button/link clicks</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackSubmit</td>
                <td className="p-3">Events</td>
                <td className="p-3">handler</td>
                <td className="p-3">Form submissions</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackError</td>
                <td className="p-3">Errors</td>
                <td className="p-3">function</td>
                <td className="p-3">Caught exceptions</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackTiming</td>
                <td className="p-3">Performance</td>
                <td className="p-3">{'{startTimer, endTimer}'}</td>
                <td className="p-3">Operation duration</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackFeature</td>
                <td className="p-3">Debounced</td>
                <td className="p-3">function</td>
                <td className="p-3">Frequent feature usage</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackScrollDepth</td>
                <td className="p-3">Scroll</td>
                <td className="p-3">void</td>
                <td className="p-3">Content engagement</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackTimeOnPage</td>
                <td className="p-3">Engagement</td>
                <td className="p-3">void</td>
                <td className="p-3">Session/page duration</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <FeedbackWidget pageId="analytics-hooks" />
    </div>
  )
}
