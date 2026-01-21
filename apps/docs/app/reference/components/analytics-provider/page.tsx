'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function AnalyticsProviderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Context Provider</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">AnalyticsProvider</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Track user interactions, page views, and errors across your chat application with multi-provider support.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Analytics & Tracking
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import {
  AnalyticsProvider,
  useAnalytics,
  createConsoleProvider
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        debug: process.env.NODE_ENV === 'development',
        providers: [createConsoleProvider()],
        autoTrackPageViews: true,
        autoTrackErrors: true,
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}

function ChatApp() {
  const { track } = useAnalytics()

  const handleSend = (message: string) => {
    track('message_sent', { length: message.length })
  }

  return <MessageInput onSend={handleSend} />
}`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            Multi-Provider
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Auto Page Views
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Error Tracking
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
            Privacy-First
          </span>
        </div>
      </section>

      {/* Why AnalyticsProvider */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Why AnalyticsProvider?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">
              Multi-Provider Support
            </h3>
            <p className="text-muted-foreground text-sm">
              Send events to Google Analytics, Mixpanel, PostHog, Amplitude, or your own API simultaneously.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
              Auto-Tracking
            </h3>
            <p className="text-muted-foreground text-sm">
              Automatically track page views (SPA-aware) and JavaScript errors without manual instrumentation.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
              Privacy-First
            </h3>
            <p className="text-muted-foreground text-sm">
              Built-in respect for "Do Not Track" browser settings. Easily disable tracking globally.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-3">
              10 Convenience Hooks
            </h3>
            <p className="text-muted-foreground text-sm">
              Pre-built hooks for common patterns: visibility tracking, scroll depth, timing, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Basic Usage */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Basic Usage</h2>
        <div className="space-y-4">
          <CollapsibleSection title="Track Events" defaultOpen>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useAnalytics } from '@clarity-chat/react'

function ChatMessage() {
  const { track } = useAnalytics()

  const handleCopy = () => {
    track('message_copied', {
      message_id: '123',
      content_length: 500,
    })
  }

  const handleFeedback = (rating: 'positive' | 'negative') => {
    track(rating === 'positive' ? 'feedback_positive' : 'feedback_negative', {
      message_id: '123',
      timestamp: Date.now(),
    })
  }

  return (
    <div>
      <button onClick={handleCopy}>Copy</button>
      <button onClick={() => handleFeedback('positive')}>Helpful</button>
    </div>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Identify Users">
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useAnalytics } from '@clarity-chat/react'

function LoginHandler() {
  const { identify } = useAnalytics()

  const handleLogin = async (user: User) => {
    // Identify user after login
    identify({
      id: user.id,
      email: user.email,
      name: user.displayName,
      properties: {
        plan: user.subscription,
        created_at: user.createdAt,
        company: user.company,
      },
    })
  }

  return <LoginForm onSuccess={handleLogin} />
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Track Page Views">
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useAnalytics } from '@clarity-chat/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Manual page tracking (alternative to autoTrackPageViews)
function PageTracker() {
  const { page } = useAnalytics()
  const pathname = usePathname()

  useEffect(() => {
    page({
      path: pathname,
      title: document.title,
      referrer: document.referrer,
      properties: {
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      },
    })
  }, [pathname, page])

  return null
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Reset on Logout">
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useAnalytics } from '@clarity-chat/react'

function LogoutButton() {
  const { reset } = useAnalytics()

  const handleLogout = async () => {
    // Clear user data from analytics
    reset()

    // Perform logout
    await signOut()
  }

  return <button onClick={handleLogout}>Sign Out</button>
}`}</code>
            </pre>
          </CollapsibleSection>
        </div>
      </section>

      {/* Built-in Providers */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Built-in Providers</h2>
        <p className="text-muted-foreground mb-6">
          Pre-configured integrations for popular analytics services.
        </p>
        <div className="space-y-4">
          <CollapsibleSection title="Google Analytics 4" badge="GA4" defaultOpen>
            <p className="text-sm text-muted-foreground mb-4">
              Google Analytics 4 integration with automatic script loading.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  AnalyticsProvider,
  createGoogleAnalyticsProvider
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [
          createGoogleAnalyticsProvider('G-XXXXXXXXXX')
        ],
        autoTrackPageViews: true,
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Mixpanel" badge="Popular">
            <p className="text-sm text-muted-foreground mb-4">
              Mixpanel integration with people profiles and event tracking.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  AnalyticsProvider,
  createMixpanelProvider
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [
          createMixpanelProvider('YOUR_MIXPANEL_TOKEN')
        ],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="PostHog">
            <p className="text-sm text-muted-foreground mb-4">
              PostHog integration with custom API host support.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  AnalyticsProvider,
  createPostHogProvider
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [
          createPostHogProvider('YOUR_POSTHOG_API_KEY', {
            api_host: 'https://app.posthog.com'
          })
        ],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Amplitude">
            <p className="text-sm text-muted-foreground mb-4">
              Amplitude integration with user identification and device tracking.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  AnalyticsProvider,
  createAmplitudeProvider
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [
          createAmplitudeProvider('YOUR_AMPLITUDE_API_KEY')
        ],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Custom API">
            <p className="text-sm text-muted-foreground mb-4">
              Send events to your own API endpoint with custom headers and transformations.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  AnalyticsProvider,
  createCustomApiProvider
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [
          createCustomApiProvider({
            endpoint: 'https://api.example.com/analytics',
            headers: {
              'Authorization': 'Bearer YOUR_TOKEN',
            },
            // Optional: transform events before sending
            transformEvent: (event) => ({
              event_name: event.name,
              event_data: event.properties,
              timestamp: new Date().toISOString(),
            }),
          })
        ],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="Console & LocalStorage" badge="Debug">
            <p className="text-sm text-muted-foreground mb-4">
              Console logger and localStorage for debugging. Perfect for development.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import {
  AnalyticsProvider,
  createConsoleProvider,
  createLocalStorageProvider
} from '@clarity-chat/react'

function App() {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        debug: isDev,
        providers: isDev
          ? [createConsoleProvider(), createLocalStorageProvider()]
          : [createGoogleAnalyticsProvider('G-XXX')],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}

// LocalStorage provider stores last 100 events for inspection:
// localStorage.getItem('analytics_events')`}</code>
            </pre>
          </CollapsibleSection>
        </div>
      </section>

      {/* Multi-Provider Example */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Multi-Provider Setup</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Send events to multiple analytics services simultaneously.
        </p>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import {
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
  createMixpanelProvider,
  createCustomApiProvider,
} from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        debug: process.env.NODE_ENV === 'development',
        eventPrefix: 'chat_', // All events prefixed: chat_message_sent
        autoTrackPageViews: true,
        autoTrackErrors: true,
        respectDoNotTrack: true,
        providers: [
          // Google Analytics for basic metrics
          createGoogleAnalyticsProvider('G-XXXXXXXXXX'),

          // Mixpanel for detailed user analytics
          createMixpanelProvider('YOUR_MIXPANEL_TOKEN'),

          // Custom API for your backend
          createCustomApiProvider({
            endpoint: '/api/analytics',
          }),
        ],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}`}</code>
        </pre>
      </section>

      {/* Convenience Hooks */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Convenience Hooks</h2>
        <p className="text-muted-foreground mb-6">
          Pre-built hooks for common analytics patterns. See{' '}
          <Link href="/reference/hooks/analytics-hooks" className="text-brand-600 hover:underline">
            Analytics Hooks documentation
          </Link>{' '}
          for full details.
        </p>
        <div className="space-y-4">
          <CollapsibleSection title="useTrackVisibility" defaultOpen>
            <p className="text-sm text-muted-foreground mb-4">
              Track when an element enters the viewport using IntersectionObserver.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useTrackVisibility } from '@clarity-chat/react'

function PromoBanner() {
  // Track when banner becomes visible (once)
  const ref = useTrackVisibility('promo_banner_viewed', {
    banner_id: 'summer-sale',
    position: 'hero',
  })

  return (
    <div ref={ref} className="promo-banner">
      Summer Sale - 50% Off!
    </div>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="useTrackScrollDepth">
            <p className="text-sm text-muted-foreground mb-4">
              Track scroll depth milestones (25%, 50%, 75%, 100%).
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useTrackScrollDepth } from '@clarity-chat/react'

function ArticlePage() {
  useTrackScrollDepth('article_scrolled', [25, 50, 75, 100], {
    article_id: '123',
    category: 'tutorial',
  })

  return (
    <article>
      <h1>Building AI Chat Applications</h1>
      {/* Long content... */}
    </article>
  )
}`}</code>
            </pre>
          </CollapsibleSection>

          <CollapsibleSection title="useTrackTiming">
            <p className="text-sm text-muted-foreground mb-4">
              Measure and track performance metrics with named timers.
            </p>
            <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`import { useTrackTiming } from '@clarity-chat/react'

function DataLoader() {
  const { startTimer, endTimer } = useTrackTiming()

  const loadConversation = async (id: string) => {
    startTimer('conversation_load')
    const data = await fetchConversation(id)
    endTimer('conversation_load', {
      conversation_id: id,
      message_count: data.messages.length,
    })
    return data
  }

  return <button onClick={() => loadConversation('123')}>Load</button>
}`}</code>
            </pre>
          </CollapsibleSection>
        </div>
      </section>

      {/* Error Tracking */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Error Tracking</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Automatic and manual error tracking.
        </p>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`import {
  AnalyticsProvider,
  useTrackError,
  useAnalytics
} from '@clarity-chat/react'

// Automatic error tracking
function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        autoTrackErrors: true, // Tracks window.error & unhandledrejection
        providers: [/* ... */],
      }}
    >
      <ChatApp />
    </AnalyticsProvider>
  )
}

// Manual error tracking
function ApiHandler() {
  const trackError = useTrackError()

  const sendMessage = async (content: string) => {
    try {
      await api.sendMessage(content)
    } catch (error) {
      trackError(error, {
        context: 'send_message',
        content_length: content.length,
        retry_count: retryCount,
      })
      throw error
    }
  }

  return <MessageInput onSend={sendMessage} />
}`}</code>
        </pre>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">API Reference</h2>

        <h3 className="text-xl font-semibold mb-4">AnalyticsProvider Props</h3>
        <div className="border rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Prop</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">children</td>
                <td className="p-3 font-mono text-xs">ReactNode</td>
                <td className="p-3">Child components with analytics context access</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">config</td>
                <td className="p-3 font-mono text-xs">AnalyticsConfig</td>
                <td className="p-3">Configuration object for analytics behavior</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-4">AnalyticsConfig</h3>
        <div className="border rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Property</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Default</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">enabled</td>
                <td className="p-3 font-mono text-xs">boolean</td>
                <td className="p-3 font-mono text-xs">true</td>
                <td className="p-3">Enable or disable all analytics</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">debug</td>
                <td className="p-3 font-mono text-xs">boolean</td>
                <td className="p-3 font-mono text-xs">false</td>
                <td className="p-3">Log events to console for debugging</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">providers</td>
                <td className="p-3 font-mono text-xs">AnalyticsProvider[]</td>
                <td className="p-3 font-mono text-xs">[]</td>
                <td className="p-3">Array of analytics providers</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">autoTrackPageViews</td>
                <td className="p-3 font-mono text-xs">boolean</td>
                <td className="p-3 font-mono text-xs">false</td>
                <td className="p-3">Auto-track page views (SPA-aware)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">autoTrackErrors</td>
                <td className="p-3 font-mono text-xs">boolean</td>
                <td className="p-3 font-mono text-xs">false</td>
                <td className="p-3">Auto-track JS errors and unhandled rejections</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">eventPrefix</td>
                <td className="p-3 font-mono text-xs">string</td>
                <td className="p-3 font-mono text-xs">""</td>
                <td className="p-3">Prefix for all event names</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">respectDoNotTrack</td>
                <td className="p-3 font-mono text-xs">boolean</td>
                <td className="p-3 font-mono text-xs">false</td>
                <td className="p-3">Respect browser's DNT setting</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mb-4">useAnalytics Return</h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Return</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">track</td>
                <td className="p-3 font-mono text-xs">(name, props?) =&gt; void</td>
                <td className="p-3">Track a custom event</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">identify</td>
                <td className="p-3 font-mono text-xs">(user) =&gt; void</td>
                <td className="p-3">Identify the current user</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">page</td>
                <td className="p-3 font-mono text-xs">(pageView) =&gt; void</td>
                <td className="p-3">Track a page view event</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">reset</td>
                <td className="p-3 font-mono text-xs">() =&gt; void</td>
                <td className="p-3">Clear user data (call on logout)</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">isEnabled</td>
                <td className="p-3 font-mono text-xs">boolean</td>
                <td className="p-3">Whether analytics is enabled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Convenience Hooks Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Convenience Hooks Reference</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Hook</th>
                <th className="text-left p-3 font-medium">Signature</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 font-mono text-xs">useTrackMount</td>
                <td className="p-3 font-mono text-xs">(event, props?)</td>
                <td className="p-3">Track when component mounts</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackUnmount</td>
                <td className="p-3 font-mono text-xs">(event, props? | () =&gt; props)</td>
                <td className="p-3">Track when component unmounts</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackChange</td>
                <td className="p-3 font-mono text-xs">(event, value, props?)</td>
                <td className="p-3">Track when a value changes</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackVisibility</td>
                <td className="p-3 font-mono text-xs">(event, props?, options?)</td>
                <td className="p-3">Returns ref - track viewport entry</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackClick</td>
                <td className="p-3 font-mono text-xs">(event, props? | (e) =&gt; props)</td>
                <td className="p-3">Returns click handler</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackSubmit</td>
                <td className="p-3 font-mono text-xs">(event, props? | (e) =&gt; props)</td>
                <td className="p-3">Returns form submit handler</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackError</td>
                <td className="p-3 font-mono text-xs">()</td>
                <td className="p-3">Returns error tracking function</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackTiming</td>
                <td className="p-3 font-mono text-xs">()</td>
                <td className="p-3">Returns startTimer/endTimer</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackFeature</td>
                <td className="p-3 font-mono text-xs">(event, debounceMs?)</td>
                <td className="p-3">Returns debounced tracking</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackScrollDepth</td>
                <td className="p-3 font-mono text-xs">(event, thresholds?, props?)</td>
                <td className="p-3">Track scroll percentages</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">useTrackTimeOnPage</td>
                <td className="p-3 font-mono text-xs">(event, props?)</td>
                <td className="p-3">Track time on unmount</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Type Definitions */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Type Definitions</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{`interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

interface AnalyticsUser {
  id: string
  email?: string
  name?: string
  properties?: Record<string, any>
}

interface PageView {
  path: string
  title?: string
  referrer?: string
  properties?: Record<string, any>
}

interface AnalyticsProvider {
  name: string
  init?: () => void | Promise<void>
  track: (event: AnalyticsEvent) => void | Promise<void>
  identify?: (user: AnalyticsUser) => void | Promise<void>
  page?: (pageView: PageView) => void | Promise<void>
  reset?: () => void | Promise<void>
}

interface AnalyticsConfig {
  enabled?: boolean
  debug?: boolean
  providers?: AnalyticsProvider[]
  endpoint?: string
  autoTrackPageViews?: boolean
  autoTrackErrors?: boolean
  eventPrefix?: string
  respectDoNotTrack?: boolean
}`}</code>
        </pre>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Best Practices</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">
              1. Use Event Name Constants
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              Prefer AnalyticsEvents constants over string literals for consistency.
            </p>
            <pre className="bg-background p-3 rounded-lg overflow-x-auto text-sm">
              <code>{`// Good
track(AnalyticsEvents.MESSAGE_SENT, { ... })

// Avoid
track('message_sent', { ... })`}</code>
            </pre>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
              2. Environment-Based Configuration
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              Use different providers for development and production.
            </p>
            <pre className="bg-background p-3 rounded-lg overflow-x-auto text-sm">
              <code>{`const config = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  providers: process.env.NODE_ENV === 'production'
    ? [createGoogleAnalyticsProvider('G-XXX')]
    : [createConsoleProvider()],
}`}</code>
            </pre>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">
              3. Respect Privacy
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              Enable Do Not Track respect and provide opt-out options.
            </p>
            <pre className="bg-background p-3 rounded-lg overflow-x-auto text-sm">
              <code>{`<AnalyticsProvider
  config={{
    enabled: userConsent,
    respectDoNotTrack: true,
    providers: [/* ... */],
  }}
>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Browser Support */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Browser Support</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-muted">
            <h3 className="font-semibold mb-3">Features Used</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>IntersectionObserver (visibility tracking)</li>
              <li>performance.now() (timing metrics)</li>
              <li>history.pushState/replaceState (SPA page views)</li>
              <li>navigator.doNotTrack (privacy)</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-muted">
            <h3 className="font-semibold mb-3">Minimum Support</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Chrome 58+</li>
              <li>Firefox 55+</li>
              <li>Safari 12.1+</li>
              <li>Edge 79+</li>
            </ul>
          </div>
        </div>
      </section>

      <FeedbackWidget pageId="analytics-provider" />
    </div>
  )
}
