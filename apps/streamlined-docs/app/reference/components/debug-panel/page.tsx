'use client'

/**
 * DebugPanel Component - API Reference Documentation
 *
 * Developer debugging panel with state inspection, event logging, and performance profiling
 * for development environments. Provides comprehensive debugging tools for chat applications.
 */

import * as React from 'react'
import {
  Bug,
  Activity,
  Eye,
  Clock,
  Network,
  Database,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Terminal,
  Code,
  Settings,
  Shield,
  XCircle,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import type {
  Badge,
  FeatureHighlight,
  RelatedAPI,
  FooterLink,
  TocItem,
} from '../../../../components/Docs/DocumentationPage'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Component Data
// ============================================================================

const badges: Badge[] = [
  { label: 'Experimental', variant: 'experimental' },
]

const features: FeatureHighlight[] = [
  {
    icon: Eye,
    label: 'State Inspector',
    description: 'Real-time state visualization',
  },
  {
    icon: Terminal,
    label: 'Event Logging',
    description: 'Comprehensive event tracking',
  },
  {
    icon: Clock,
    label: 'Performance Profiler',
    description: 'Component render times',
  },
  {
    icon: Network,
    label: 'Network Monitor',
    description: 'API call tracking',
  },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'PerformanceMonitor',
    type: 'component',
    description: 'Real-time performance tracking and metrics',
    href: '/reference/components/performance-monitor',
  },
  {
    name: 'ComponentInspector',
    type: 'component',
    description: 'Deep component tree inspection and profiling',
    href: '/reference/components/component-inspector',
  },
  {
    name: 'useDebug',
    type: 'hook',
    description: 'Hook for accessing debug utilities and logging',
    href: '/reference/hooks/use-debug',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'PerformanceMonitor',
    href: '/reference/components/performance-monitor',
    direction: 'previous',
  },
  {
    label: 'ComponentInspector',
    href: '/reference/components/component-inspector',
    direction: 'next',
  },
]

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'props', title: 'Props API' },
  { id: 'debug-features', title: 'Debug Features' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-redux', title: 'With Redux' },
      { id: 'example-react-query', title: 'With React Query' },
    ],
  },
  { id: 'production', title: 'Production Usage' },
  { id: 'security', title: 'Security' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'best-practices', title: 'Best Practices' },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { DebugPanel } from '@clarity-chat/react'
import type { DebugPanelProps, DebugEvent, DebugLogLevel } from '@clarity-chat/react'

// Import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { DebugPanel } from '@clarity-chat/react'

function App() {
  return (
    <>
      {/* Your app components */}
      <ChatWindow messages={messages} onSend={handleSend} />

      {/* Debug panel - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel
          position="bottom-right"
          defaultOpen={false}
          logLevel="info"
          maxLogs={1000}
          enableStateInspection={true}
          enableEventLogging={true}
          enablePerformanceProfiling={true}
          enableNetworkMonitoring={true}
        />
      )}
    </>
  )
}`

const reduxCode = `import { DebugPanel } from '@clarity-chat/react'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

function AppWithRedux() {
  // Expose Redux state to debug panel
  const reduxState = useSelector((state: RootState) => state)

  const handleStateInspect = (path: string) => {
    console.log('Inspecting Redux state:', path, reduxState)
  }

  return (
    <>
      <ChatWindow />

      {process.env.NODE_ENV === 'development' && (
        <DebugPanel
          customState={{
            redux: reduxState,
            user: reduxState.user,
            chat: reduxState.chat,
          }}
          onStateInspect={handleStateInspect}
          stateFilters={['redux', 'user', 'chat']}
          enableReduxIntegration={true}
          highlightStateChanges={true}
        />
      )}
    </>
  )
}`

const reactQueryCode = `import { DebugPanel } from '@clarity-chat/react'
import { useQueryClient } from '@tanstack/react-query'

function AppWithReactQuery() {
  const queryClient = useQueryClient()

  // Expose React Query cache to debug panel
  const queryCache = queryClient.getQueryCache()
  const mutationCache = queryClient.getMutationCache()

  const handleNetworkInspect = (requestId: string) => {
    const query = queryCache.find({ queryKey: [requestId] })
    console.log('Query details:', query)
  }

  return (
    <>
      <ChatWindow />

      {process.env.NODE_ENV === 'development' && (
        <DebugPanel
          networkRequests={queryCache.getAll().map((q) => ({
            id: q.queryHash,
            method: 'GET',
            url: String(q.queryKey[0]),
            status: q.state.status === 'success' ? 200 : 500,
            duration: q.state.dataUpdatedAt - q.state.dataUpdateCount,
            timestamp: q.state.dataUpdatedAt,
          }))}
          onNetworkInspect={handleNetworkInspect}
          enableReactQueryIntegration={true}
          showCacheMetrics={true}
        />
      )}
    </>
  )
}`

const productionCode = `import { DebugPanel } from '@clarity-chat/react'

// Recommended: Environment-based conditional rendering
function App() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <>
      <ChatWindow />

      {isDevelopment && (
        <DebugPanel
          position="bottom-right"
          defaultOpen={false}
        />
      )}
    </>
  )
}

// Alternative: Feature flag
function AppWithFeatureFlag() {
  const { isEnabled } = useFeatureFlag('debug-panel')

  return (
    <>
      <ChatWindow />

      {isEnabled && (
        <DebugPanel
          position="bottom-right"
          defaultOpen={false}
        />
      )}
    </>
  )
}

// Advanced: Conditional import with code splitting
function AppWithLazyLoad() {
  const [DebugPanelComponent, setDebugPanel] = React.useState<any>(null)

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@clarity-chat/react').then((mod) => {
        setDebugPanel(() => mod.DebugPanel)
      })
    }
  }, [])

  return (
    <>
      <ChatWindow />
      {DebugPanelComponent && <DebugPanelComponent />}
    </>
  )
}`

const securityCode = `import { DebugPanel } from '@clarity-chat/react'

function SecureDebugPanel() {
  const sanitizeState = (state: any) => {
    // Remove sensitive data before displaying
    const { apiKey, password, token, ...safeState } = state
    return safeState
  }

  const sanitizeLogs = (logs: DebugEvent[]) => {
    return logs.map((log) => ({
      ...log,
      data: sanitizeData(log.data),
    }))
  }

  const sanitizeData = (data: any) => {
    if (typeof data === 'object') {
      return Object.entries(data).reduce(
        (acc, [key, value]) => {
          // Redact sensitive fields
          if (['apiKey', 'password', 'token', 'secret'].includes(key)) {
            acc[key] = '***REDACTED***'
          } else {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>
      )
    }
    return data
  }

  return (
    <DebugPanel
      onBeforeLog={(event) => ({
        ...event,
        data: sanitizeData(event.data),
      })}
      onBeforeStateExport={(state) => sanitizeState(state)}
      redactedFields={['apiKey', 'password', 'token', 'secret']}
      enableSanitization={true}
      warnOnSensitiveData={true}
    />
  )
}`

const typescriptCode = `// Main component props
interface DebugPanelProps {
  /** Position of the debug panel */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Whether panel is open by default */
  defaultOpen?: boolean
  /** Minimum log level to display */
  logLevel?: DebugLogLevel
  /** Maximum number of logs to keep */
  maxLogs?: number
  /** Enable state inspection */
  enableStateInspection?: boolean
  /** Enable event logging */
  enableEventLogging?: boolean
  /** Enable performance profiling */
  enablePerformanceProfiling?: boolean
  /** Enable network monitoring */
  enableNetworkMonitoring?: boolean
  /** Custom state to expose */
  customState?: Record<string, any>
  /** Network requests to display */
  networkRequests?: NetworkRequest[]
  /** State filters for inspection */
  stateFilters?: string[]
  /** Fields to redact from logs */
  redactedFields?: string[]
  /** Enable data sanitization */
  enableSanitization?: boolean
  /** Warn on sensitive data detection */
  warnOnSensitiveData?: boolean
  /** Highlight state changes */
  highlightStateChanges?: boolean
  /** Enable Redux integration */
  enableReduxIntegration?: boolean
  /** Enable React Query integration */
  enableReactQueryIntegration?: boolean
  /** Show cache metrics */
  showCacheMetrics?: boolean
  /** Callback when state is inspected */
  onStateInspect?: (path: string) => void
  /** Callback when network request is inspected */
  onNetworkInspect?: (requestId: string) => void
  /** Callback before logging event */
  onBeforeLog?: (event: DebugEvent) => DebugEvent
  /** Callback before exporting state */
  onBeforeStateExport?: (state: any) => any
  /** Custom CSS class */
  className?: string
}

// Log levels
type DebugLogLevel = 'debug' | 'info' | 'warn' | 'error'

// Debug event
interface DebugEvent {
  /** Event ID */
  id: string
  /** Event timestamp */
  timestamp: number
  /** Log level */
  level: DebugLogLevel
  /** Event category */
  category: 'state' | 'event' | 'network' | 'performance' | 'error'
  /** Event message */
  message: string
  /** Event data */
  data?: any
  /** Stack trace (for errors) */
  stack?: string
  /** Component name */
  component?: string
  /** Duration (for performance events) */
  duration?: number
}

// Network request
interface NetworkRequest {
  /** Request ID */
  id: string
  /** HTTP method */
  method: string
  /** Request URL */
  url: string
  /** Response status code */
  status: number
  /** Request duration in ms */
  duration: number
  /** Request timestamp */
  timestamp: number
  /** Request headers */
  headers?: Record<string, string>
  /** Request body */
  body?: any
  /** Response body */
  response?: any
  /** Error message (if failed) */
  error?: string
}

// Performance metric
interface PerformanceMetric {
  /** Metric name */
  name: string
  /** Component name */
  component: string
  /** Render duration in ms */
  duration: number
  /** Render count */
  renderCount: number
  /** Props at render time */
  props?: Record<string, any>
  /** Timestamp */
  timestamp: number
}`

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [logs, setLogs] = React.useState<
    Array<{
      id: string
      level: 'debug' | 'info' | 'warn' | 'error'
      message: string
      timestamp: number
    }>
  >([
    {
      id: '1',
      level: 'info',
      message: 'ChatWindow component mounted',
      timestamp: Date.now() - 5000,
    },
    {
      id: '2',
      level: 'debug',
      message: 'Message list rendered: 15 messages',
      timestamp: Date.now() - 4000,
    },
    {
      id: '3',
      level: 'warn',
      message: 'Slow render detected: MessageList (127ms)',
      timestamp: Date.now() - 3000,
    },
  ])

  const [networkRequests, setNetworkRequests] = React.useState([
    { id: '1', method: 'POST', url: '/api/chat', status: 200, duration: 245 },
    { id: '2', method: 'GET', url: '/api/messages', status: 200, duration: 89 },
    { id: '3', method: 'POST', url: '/api/chat', status: 500, duration: 1230 },
  ])

  const [selectedTab, setSelectedTab] = React.useState<
    'logs' | 'state' | 'network' | 'performance'
  >('logs')

  const addLog = (level: 'debug' | 'info' | 'warn' | 'error', message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        level,
        message,
        timestamp: Date.now(),
      },
    ])
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
      case 'info':
        return 'text-green-600 dark:text-green-400 bg-green-500/10'
      case 'warn':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
      case 'error':
        return 'text-red-600 dark:text-red-400 bg-red-500/10'
      default:
        return 'text-muted-foreground bg-muted/50'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug':
        return <Code className="w-3 h-3" />
      case 'info':
        return <Info className="w-3 h-3" />
      case 'warn':
        return <AlertCircle className="w-3 h-3" />
      case 'error':
        return <XCircle className="w-3 h-3" />
      default:
        return <Terminal className="w-3 h-3" />
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'text-green-600 dark:text-green-400'
    } else if (status >= 400) {
      return 'text-red-600 dark:text-red-400'
    }
    return 'text-muted-foreground'
  }

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors text-sm font-medium"
        >
          <Bug className="w-4 h-4" />
          {isOpen ? 'Close Debug Panel' : 'Open Debug Panel'}
        </button>

        {isOpen && (
          <div className="flex gap-2">
            <button
              onClick={() => addLog('info', 'User clicked send button')}
              className="px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              Add Info Log
            </button>
            <button
              onClick={() => addLog('warn', 'API response time exceeded 1s')}
              className="px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              Add Warning
            </button>
            <button
              onClick={() => addLog('error', 'Failed to send message: Network error')}
              className="px-3 py-1.5 text-xs rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              Add Error
            </button>
          </div>
        )}
      </div>

      {/* Debug Panel */}
      {isOpen && (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
          {/* Header */}
          <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-brand-500" />
              <h3 className="font-semibold text-foreground">Debug Panel</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                Development
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 py-2 bg-muted/20 border-b border-border/50 flex gap-1">
            {[
              { id: 'logs', label: 'Logs', icon: Terminal },
              { id: 'state', label: 'State', icon: Database },
              { id: 'network', label: 'Network', icon: Network },
              { id: 'performance', label: 'Performance', icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedTab === tab.id
                    ? 'bg-brand-500 text-white'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto scrollbar-hide">
            {/* Logs Tab */}
            {selectedTab === 'logs' && (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-muted/30 border border-border/50 text-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 p-1 rounded-full ${getLevelColor(log.level)}`}
                      >
                        {getLevelIcon(log.level)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-semibold uppercase ${getLevelColor(log.level).split(' ')[0]}`}
                          >
                            {log.level}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-foreground">{log.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* State Tab */}
            {selectedTab === 'state' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Chat State
                  </div>
                  <div className="font-mono text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">messages:</span>
                      <span className="text-foreground">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">isLoading:</span>
                      <span className="text-green-600 dark:text-green-400">false</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">error:</span>
                      <span className="text-muted-foreground">null</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    User State
                  </div>
                  <div className="font-mono text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">id:</span>
                      <span className="text-foreground">"user_123"</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">authenticated:</span>
                      <span className="text-green-600 dark:text-green-400">true</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Network Tab */}
            {selectedTab === 'network' && (
              <div className="space-y-2">
                {networkRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-mono rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {req.method}
                        </span>
                        <span className={`text-xs font-semibold ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{req.duration}ms</span>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground truncate">
                      {req.url}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Performance Tab */}
            {selectedTab === 'performance' && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Component Renders
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">ChatWindow</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">12 renders</span>
                        <span className="text-green-600 dark:text-green-400">~45ms</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">MessageList</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">28 renders</span>
                        <span className="text-amber-600 dark:text-amber-400">~127ms</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">ChatInput</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">156 renders</span>
                        <span className="text-green-600 dark:text-green-400">~8ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-muted/20 border-t border-border/50 flex items-center justify-between text-xs">
            <div className="text-muted-foreground">
              {logs.length} logs • {networkRequests.length} requests
            </div>
            <button className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Props Tables
// ============================================================================

const propsTableData = [
  {
    name: 'position',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    default: "'bottom-right'",
    description: 'Position of the debug panel on screen',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Whether the panel is open by default',
  },
  {
    name: 'logLevel',
    type: "'debug' | 'info' | 'warn' | 'error'",
    default: "'info'",
    description: 'Minimum log level to display',
  },
  {
    name: 'maxLogs',
    type: 'number',
    default: '1000',
    description: 'Maximum number of logs to keep in memory',
  },
  {
    name: 'enableStateInspection',
    type: 'boolean',
    default: 'true',
    description: 'Enable state inspection tab',
  },
  {
    name: 'enableEventLogging',
    type: 'boolean',
    default: 'true',
    description: 'Enable event logging tab',
  },
  {
    name: 'enablePerformanceProfiling',
    type: 'boolean',
    default: 'true',
    description: 'Enable performance profiling tab',
  },
  {
    name: 'enableNetworkMonitoring',
    type: 'boolean',
    default: 'true',
    description: 'Enable network monitoring tab',
  },
  {
    name: 'customState',
    type: 'Record<string, any>',
    description: 'Custom state object to expose in state inspector',
  },
  {
    name: 'networkRequests',
    type: 'NetworkRequest[]',
    description: 'Array of network requests to display',
  },
  {
    name: 'stateFilters',
    type: 'string[]',
    description: 'Filter state keys to display (whitelist)',
  },
  {
    name: 'redactedFields',
    type: 'string[]',
    default: "['password', 'token', 'apiKey', 'secret']",
    description: 'Fields to redact from logs and state',
  },
  {
    name: 'enableSanitization',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic data sanitization',
  },
  {
    name: 'warnOnSensitiveData',
    type: 'boolean',
    default: 'true',
    description: 'Show warnings when sensitive data is detected',
  },
  {
    name: 'highlightStateChanges',
    type: 'boolean',
    default: 'true',
    description: 'Highlight changed state values',
  },
  {
    name: 'enableReduxIntegration',
    type: 'boolean',
    default: 'false',
    description: 'Enable Redux DevTools integration',
  },
  {
    name: 'enableReactQueryIntegration',
    type: 'boolean',
    default: 'false',
    description: 'Enable React Query DevTools integration',
  },
  {
    name: 'showCacheMetrics',
    type: 'boolean',
    default: 'false',
    description: 'Show cache hit/miss metrics',
  },
  {
    name: 'onStateInspect',
    type: '(path: string) => void',
    description: 'Callback when state path is inspected',
  },
  {
    name: 'onNetworkInspect',
    type: '(requestId: string) => void',
    description: 'Callback when network request is inspected',
  },
  {
    name: 'onBeforeLog',
    type: '(event: DebugEvent) => DebugEvent',
    description: 'Transform event before logging',
  },
  {
    name: 'onBeforeStateExport',
    type: '(state: any) => any',
    description: 'Transform state before exporting',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the panel',
  },
]

const debugFeaturesData = [
  {
    name: 'State Inspector',
    description: 'Real-time component state visualization',
    features: 'View, filter, and search state • Track state changes • Export state snapshots',
    useCase: 'Debugging state management issues',
  },
  {
    name: 'Event Logger',
    description: 'Comprehensive event and action tracking',
    features:
      'Log levels (debug/info/warn/error) • Category filtering • Stack traces • Search logs',
    useCase: 'Understanding application flow',
  },
  {
    name: 'Performance Profiler',
    description: 'Component render time tracking',
    features: 'Render counts • Duration metrics • Slow render warnings • Component flamegraph',
    useCase: 'Identifying performance bottlenecks',
  },
  {
    name: 'Network Monitor',
    description: 'API call tracking and inspection',
    features: 'Request/response details • Timing metrics • Status codes • Error tracking',
    useCase: 'Debugging API integration',
  },
  {
    name: 'Redux Integration',
    description: 'Redux store inspection',
    features: 'Action history • Time-travel debugging • Store diff viewer • Action replay',
    useCase: 'Redux debugging',
  },
  {
    name: 'React Query Integration',
    description: 'Query cache inspection',
    features: 'Cache visualization • Query status • Mutation tracking • Cache metrics',
    useCase: 'React Query debugging',
  },
  {
    name: 'Error Tracking',
    description: 'Error capture and display',
    features: 'Error boundaries • Stack traces • Error metadata • Error grouping',
    useCase: 'Finding and fixing bugs',
  },
  {
    name: 'Data Sanitization',
    description: 'Security-focused data redaction',
    features: 'Auto-redact sensitive fields • Custom redaction rules • Warning alerts',
    useCase: 'Preventing data leaks',
  },
]

function PropsTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Default</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {propsTableData.map((prop, index) => (
            <tr
              key={prop.name}
              className={`border-b border-border/30 last:border-b-0 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              }`}
            >
              <td className="px-4 py-3 font-mono text-sm text-brand-600 dark:text-brand-400">
                {prop.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[250px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DebugFeaturesTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Capabilities</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Use Case</th>
          </tr>
        </thead>
        <tbody>
          {debugFeaturesData.map((feature, index) => (
            <tr
              key={feature.name}
              className={`border-b border-border/30 last:border-b-0 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              }`}
            >
              <td className="px-4 py-3 font-semibold text-foreground">{feature.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{feature.description}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{feature.features}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{feature.useCase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Component
// ============================================================================

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a href={`#${id}`} className="hover:text-brand-500 transition-colors group">
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function DebugPanelPage() {
  return (
    <DocumentationPage
      title="DebugPanel"
      description="Developer debugging panel with state inspection, event logging, and performance profiling for development"
      icon={Bug}
      badges={badges}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
      revalidate={3600}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            The <code>DebugPanel</code> component provides a comprehensive debugging interface
            for development environments. It combines state inspection, event logging, performance
            profiling, and network monitoring into a single, easy-to-use panel that helps you
            diagnose and fix issues quickly.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Why Use DebugPanel?</h3>
          <p>
            Modern chat applications have complex state management, async operations, and
            performance requirements. DebugPanel gives you visibility into:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Component State:</strong> See what state your components hold in real-time
            </li>
            <li>
              <strong>Event Flow:</strong> Track user actions, API calls, and state changes
            </li>
            <li>
              <strong>Performance:</strong> Identify slow renders and optimization opportunities
            </li>
            <li>
              <strong>Network Activity:</strong> Monitor API requests and responses
            </li>
          </ul>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 mt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Development Only</h4>
                <p className="text-sm text-muted-foreground">
                  DebugPanel is designed for development environments only. Always use environment
                  checks to prevent it from being included in production builds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the component and types:</p>

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
          Interactive demo showing the DebugPanel in action. Try adding logs and exploring the
          different tabs.
        </p>
        <LiveDemo />
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props API">
        <p className="text-muted-foreground mb-6">
          Configure the DebugPanel with these props. Most props are optional with sensible
          defaults for common use cases.
        </p>
        <PropsTable />
      </Section>

      {/* Debug Features Section */}
      <Section id="debug-features" title="Debug Features">
        <p className="text-muted-foreground mb-6">
          DebugPanel includes 8 specialized debugging features. Each feature focuses on a specific
          aspect of your application.
        </p>
        <DebugFeaturesTable />
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <div className="space-y-8">
          {/* Basic Usage */}
          <div id="example-basic" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">Basic Usage</h3>
            <p className="text-muted-foreground mb-4">
              Add DebugPanel to your app with environment-based conditional rendering:
            </p>
            <CodeBlock code={basicUsageCode} language="tsx" filename="App.tsx" />
          </div>

          {/* Redux Integration */}
          <div id="example-redux" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">With Redux</h3>
            <p className="text-muted-foreground mb-4">
              Integrate with Redux to inspect store state and track actions:
            </p>
            <CodeBlock code={reduxCode} language="tsx" filename="AppWithRedux.tsx" />
          </div>

          {/* React Query Integration */}
          <div id="example-react-query" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">With React Query</h3>
            <p className="text-muted-foreground mb-4">
              Monitor React Query cache and track query/mutation states:
            </p>
            <CodeBlock code={reactQueryCode} language="tsx" filename="AppWithReactQuery.tsx" />
          </div>
        </div>
      </Section>

      {/* Production Usage Section */}
      <Section id="production" title="Production Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            DebugPanel should never be included in production builds. Use environment checks,
            feature flags, or code splitting to prevent production leakage:
          </p>

          <CodeBlock code={productionCode} language="tsx" filename="ProductionSafe.tsx" />

          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mt-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Critical: Production Safety</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Including DebugPanel in production can:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Expose sensitive application state and user data</li>
                  <li>• Leak API keys, tokens, and credentials</li>
                  <li>• Impact performance with logging overhead</li>
                  <li>• Increase bundle size significantly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Security Section */}
      <Section id="security" title="Security">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            DebugPanel includes built-in security features to help prevent accidental data leaks.
            Always use data sanitization when handling sensitive information:
          </p>

          <CodeBlock code={securityCode} language="tsx" filename="SecureDebug.tsx" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Auto Sanitization</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically redacts common sensitive fields like passwords, API keys, and
                    tokens from logs and state.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Warning Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Shows warnings when sensitive data patterns are detected, helping you identify
                    potential security issues.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Custom Redaction</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure custom redaction rules for your application-specific sensitive fields
                    and data patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">State Filtering</h4>
                  <p className="text-sm text-muted-foreground">
                    Use state filters to whitelist only specific state keys, preventing accidental
                    exposure of sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Complete type definitions for all props, events, and data structures:
        </p>
        <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" showLineNumbers />
      </Section>

      {/* Best Practices Section */}
      <Section id="best-practices" title="Best Practices">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    1. Environment-Based Rendering
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Always use <code>process.env.NODE_ENV === 'development'</code> checks to
                    ensure DebugPanel is never included in production builds. Consider using
                    feature flags for additional control.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    2. Limit Log Retention
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Set <code>maxLogs</code> to prevent memory issues during long debugging
                    sessions. Default is 1000 logs, but adjust based on your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    3. Enable Sanitization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Always enable data sanitization and configure redacted fields for your
                    application. Never log sensitive user data, API keys, or credentials.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4. Monitor Performance Impact
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    DebugPanel adds overhead for logging and state tracking. Disable features you
                    don't need to minimize performance impact during development.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    5. Use Code Splitting
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Consider dynamic imports to completely exclude DebugPanel from production
                    bundles. This ensures zero overhead in production builds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
