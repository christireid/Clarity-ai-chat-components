'use client'

/**
 * ComponentInspector Component - API Reference Documentation
 *
 * React DevTools-style component inspector with props viewer, state debugging,
 * and render tracking for comprehensive component inspection.
 */

import * as React from 'react'
import {
  Search,
  Eye,
  Activity,
  Database,
  Clock,
  ChevronRight,
  AlertCircle,
  Code2,
  FileJson,
  List,
  GitBranch,
  Play,
  Pause,
  Filter,
  Maximize2,
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
    icon: GitBranch,
    label: 'Component Tree',
    description: 'Visual component hierarchy',
  },
  {
    icon: Eye,
    label: 'Props Inspector',
    description: 'Live props examination',
  },
  {
    icon: Activity,
    label: 'Render Count',
    description: 'Performance tracking',
  },
  {
    icon: Clock,
    label: 'State Timeline',
    description: 'State change history',
  },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'DebugPanel',
    type: 'component',
    description: 'Comprehensive debugging dashboard with logs and metrics',
    href: '/reference/components/debug-panel',
  },
  {
    name: 'PerformanceMonitor',
    type: 'component',
    description: 'Real-time performance monitoring and Web Vitals tracking',
    href: '/reference/components/performance-monitor',
  },
  {
    name: 'useInspector',
    type: 'hook',
    description: 'Hook for accessing component inspection data',
    href: '/reference/hooks/use-inspector',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'PerformanceMonitor',
    href: '/reference/components/performance-monitor',
    direction: 'previous',
  },
  {
    label: 'DebugPanel',
    href: '/reference/components/debug-panel',
    direction: 'next',
  },
]

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'props', title: 'Props API' },
  { id: 'features', title: 'Inspector Features' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Inspection' },
      { id: 'example-react-query', title: 'With React Query' },
      { id: 'example-redux', title: 'With Redux' },
    ],
  },
  { id: 'integration', title: 'Integration' },
  { id: 'performance', title: 'Performance' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'best-practices', title: 'Best Practices' },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ComponentInspector } from '@clarity-chat/react'
import type { ComponentInspectorProps, InspectorNode } from '@clarity-chat/react'

// Import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ComponentInspector } from '@clarity-chat/react'

function App() {
  const handleNodeSelect = (node: InspectorNode) => {
    console.log('Selected node:', node)
  }

  return (
    <ComponentInspector
      enabled={process.env.NODE_ENV === 'development'}
      showProps={true}
      showState={true}
      trackRenders={true}
      onNodeSelect={handleNodeSelect}
    />
  )
}`

const reactQueryCode = `import { ComponentInspector } from '@clarity-chat/react'
import { useQueryClient } from '@tanstack/react-query'

function ChatApp() {
  const queryClient = useQueryClient()

  const handleInspectQuery = (node: InspectorNode) => {
    // Access React Query cache for the component
    const queries = queryClient.getQueryCache().findAll({
      predicate: (query) => query.meta?.componentId === node.id,
    })

    console.log('Component queries:', queries)
  }

  return (
    <>
      <ComponentInspector
        enabled={true}
        showProps={true}
        showHooks={true}
        customFilters={{
          hasQueries: (node) => {
            return queryClient
              .getQueryCache()
              .findAll({ predicate: (q) => q.meta?.componentId === node.id })
              .length > 0
          },
        }}
        onNodeSelect={handleInspectQuery}
      />
      <ChatWindow />
    </>
  )
}`

const reduxCode = `import { ComponentInspector } from '@clarity-chat/react'
import { useSelector } from 'react-redux'
import type { RootState } from './store'

function ChatApp() {
  const reduxState = useSelector((state: RootState) => state)

  const handleInspectState = (node: InspectorNode) => {
    // Show Redux state for the component
    const componentState = reduxState[node.name.toLowerCase()]
    console.log('Redux state:', componentState)
  }

  return (
    <>
      <ComponentInspector
        enabled={true}
        showState={true}
        showReduxState={true}
        stateSelector={(node) => reduxState[node.name.toLowerCase()]}
        onNodeSelect={handleInspectState}
      />
      <ChatWindow />
    </>
  )
}`

const integrationCode = `import { ComponentInspector } from '@clarity-chat/react'

// React DevTools bridge integration
function AppWithDevTools() {
  const handleDevToolsBridge = (node: InspectorNode) => {
    // Send to React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.emit('inspect', {
        id: node.id,
        name: node.name,
        props: node.props,
      })
    }
  }

  return (
    <ComponentInspector
      enabled={true}
      bridgeToDevTools={true}
      onNodeSelect={handleDevToolsBridge}
    />
  )
}

// Sentry performance integration
import * as Sentry from '@sentry/react'

function AppWithSentry() {
  const handleTrackRender = (node: InspectorNode, renderTime: number) => {
    // Send render performance to Sentry
    Sentry.metrics.distribution('component.render.time', renderTime, {
      tags: {
        component: node.name,
        path: node.path,
      },
    })
  }

  return (
    <ComponentInspector
      enabled={true}
      trackRenders={true}
      onRenderComplete={handleTrackRender}
    />
  )
}`

const typescriptCode = `// Main component props
interface ComponentInspectorProps {
  /** Enable/disable inspection */
  enabled?: boolean
  /** Show component props in inspector */
  showProps?: boolean
  /** Show component state in inspector */
  showState?: boolean
  /** Show React hooks used by component */
  showHooks?: boolean
  /** Show Redux state (requires Redux integration) */
  showReduxState?: boolean
  /** Track render count for each component */
  trackRenders?: boolean
  /** Track render time for performance analysis */
  trackRenderTime?: boolean
  /** Show component source location */
  showSource?: boolean
  /** Maximum depth for component tree */
  maxDepth?: number
  /** Filter components by name pattern */
  componentFilter?: string | RegExp
  /** Custom filters for components */
  customFilters?: Record<string, (node: InspectorNode) => boolean>
  /** State selector for external state (Redux, etc.) */
  stateSelector?: (node: InspectorNode) => unknown
  /** Bridge to React DevTools */
  bridgeToDevTools?: boolean
  /** Display mode */
  displayMode?: 'inline' | 'floating' | 'panel'
  /** Panel position for floating mode */
  panelPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Collapse by default */
  defaultCollapsed?: boolean
  /** Callback when node is selected */
  onNodeSelect?: (node: InspectorNode) => void
  /** Callback when render completes */
  onRenderComplete?: (node: InspectorNode, renderTime: number) => void
  /** Callback when props change */
  onPropsChange?: (node: InspectorNode, prevProps: unknown, nextProps: unknown) => void
  /** Callback when state changes */
  onStateChange?: (node: InspectorNode, prevState: unknown, nextState: unknown) => void
}

// Inspector node
interface InspectorNode {
  /** Unique component ID */
  id: string
  /** Component name */
  name: string
  /** Component path in tree */
  path: string
  /** Component type */
  type: 'function' | 'class' | 'memo' | 'forwardRef' | 'context' | 'fragment'
  /** Component props */
  props: Record<string, unknown>
  /** Component state */
  state?: Record<string, unknown>
  /** React hooks used */
  hooks?: HookInfo[]
  /** Render count */
  renderCount: number
  /** Last render time in milliseconds */
  renderTime?: number
  /** Parent node ID */
  parentId?: string
  /** Child node IDs */
  childIds: string[]
  /** Source file location */
  source?: {
    file: string
    line: number
    column: number
  }
  /** Timestamp of last update */
  timestamp: number
}

// Hook information
interface HookInfo {
  /** Hook type */
  type: 'useState' | 'useEffect' | 'useContext' | 'useReducer' | 'useMemo' | 'useCallback' | 'useRef' | 'custom'
  /** Hook name */
  name: string
  /** Hook value */
  value: unknown
  /** Dependencies (for useEffect, useMemo, useCallback) */
  dependencies?: unknown[]
}

// Display mode type
type DisplayMode = 'inline' | 'floating' | 'panel'

// Panel position type
type PanelPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [inspectorEnabled, setInspectorEnabled] = React.useState(true)
  const [selectedNode, setSelectedNode] = React.useState<string | null>(null)
  const [componentTree] = React.useState({
    id: 'root',
    name: 'ChatWindow',
    type: 'function' as const,
    props: { title: 'AI Assistant', streaming: true },
    renderCount: 12,
    renderTime: 8.5,
    children: [
      {
        id: 'header',
        name: 'ChatHeader',
        type: 'function' as const,
        props: { title: 'AI Assistant' },
        renderCount: 1,
        renderTime: 2.1,
      },
      {
        id: 'messages',
        name: 'MessageList',
        type: 'memo' as const,
        props: { messages: [], virtualScroll: true },
        renderCount: 12,
        renderTime: 15.3,
      },
      {
        id: 'input',
        name: 'ChatInput',
        type: 'function' as const,
        props: { placeholder: 'Type a message...' },
        renderCount: 45,
        renderTime: 3.2,
      },
    ],
  })

  const renderNodeTree = (node: typeof componentTree, level = 0) => {
    const isSelected = selectedNode === node.id
    const hasChildren = 'children' in node && node.children

    return (
      <div key={node.id} style={{ marginLeft: level * 20 }}>
        <button
          onClick={() => setSelectedNode(node.id)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            isSelected
              ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400'
              : 'hover:bg-muted/50 text-foreground'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasChildren && <ChevronRight className="w-3 h-3" />}
              <span className="font-mono text-sm">&lt;{node.name} /&gt;</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  node.type === 'memo'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {node.type}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {node.renderCount}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {node.renderTime}ms
              </span>
            </div>
          </div>
        </button>
        {hasChildren &&
          node.children.map((child: typeof componentTree) => renderNodeTree(child, level + 1))}
      </div>
    )
  }

  const selectedNodeData = React.useMemo(() => {
    if (!selectedNode) return null
    if (componentTree.id === selectedNode) return componentTree
    return componentTree.children?.find((child) => child.id === selectedNode)
  }, [selectedNode, componentTree])

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inspectorEnabled}
            onChange={(e) => setInspectorEnabled(e.target.checked)}
            className="rounded"
          />
          Inspector Enabled
        </label>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            inspectorEnabled
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {inspectorEnabled ? 'Active' : 'Disabled'}
        </span>
      </div>

      {/* Inspector UI */}
      {inspectorEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Component Tree */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
            <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-brand-500" />
                <h3 className="font-semibold text-foreground">Component Tree</h3>
              </div>
              <span className="text-xs text-muted-foreground">4 components</span>
            </div>
            <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
              {renderNodeTree(componentTree)}
            </div>
          </div>

          {/* Props & Details */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
            <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-500" />
              <h3 className="font-semibold text-foreground">
                {selectedNodeData ? 'Component Details' : 'Select a Component'}
              </h3>
            </div>
            {selectedNodeData ? (
              <div className="p-4 space-y-4">
                {/* Component Info */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Component
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-mono text-sm text-foreground">
                        {selectedNodeData.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Type</span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          selectedNodeData.type === 'memo'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {selectedNodeData.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Performance
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Render Count</span>
                      <span className="text-sm font-semibold text-foreground">
                        {selectedNodeData.renderCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Render Time</span>
                      <span className="text-sm font-semibold text-foreground">
                        {selectedNodeData.renderTime}ms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Props */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Props
                  </h4>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <pre className="text-xs font-mono text-foreground overflow-x-auto scrollbar-hide">
                      {JSON.stringify(selectedNodeData.props, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a component to inspect its props and state</p>
              </div>
            )}
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
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable component inspection',
  },
  {
    name: 'showProps',
    type: 'boolean',
    default: 'true',
    description: 'Display component props in inspector',
  },
  {
    name: 'showState',
    type: 'boolean',
    default: 'true',
    description: 'Display component state in inspector',
  },
  {
    name: 'showHooks',
    type: 'boolean',
    default: 'false',
    description: 'Display React hooks used by component',
  },
  {
    name: 'showReduxState',
    type: 'boolean',
    default: 'false',
    description: 'Display Redux state (requires integration)',
  },
  {
    name: 'trackRenders',
    type: 'boolean',
    default: 'true',
    description: 'Track render count for each component',
  },
  {
    name: 'trackRenderTime',
    type: 'boolean',
    default: 'true',
    description: 'Measure render time for performance analysis',
  },
  {
    name: 'showSource',
    type: 'boolean',
    default: 'false',
    description: 'Show component source file location',
  },
  {
    name: 'maxDepth',
    type: 'number',
    default: '10',
    description: 'Maximum depth for component tree',
  },
  {
    name: 'componentFilter',
    type: 'string | RegExp',
    description: 'Filter components by name pattern',
  },
  {
    name: 'customFilters',
    type: 'Record<string, (node) => boolean>',
    description: 'Custom filter functions for components',
  },
  {
    name: 'stateSelector',
    type: '(node: InspectorNode) => unknown',
    description: 'Selector for external state (Redux, Zustand, etc.)',
  },
  {
    name: 'bridgeToDevTools',
    type: 'boolean',
    default: 'false',
    description: 'Bridge to React DevTools extension',
  },
  {
    name: 'displayMode',
    type: "'inline' | 'floating' | 'panel'",
    default: "'inline'",
    description: 'Display mode for inspector UI',
  },
  {
    name: 'panelPosition',
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    default: "'bottom-right'",
    description: 'Panel position for floating mode',
  },
  {
    name: 'defaultCollapsed',
    type: 'boolean',
    default: 'false',
    description: 'Collapse component tree by default',
  },
  {
    name: 'onNodeSelect',
    type: '(node: InspectorNode) => void',
    description: 'Callback when component node is selected',
  },
  {
    name: 'onRenderComplete',
    type: '(node: InspectorNode, renderTime: number) => void',
    description: 'Callback when component render completes',
  },
  {
    name: 'onPropsChange',
    type: '(node: InspectorNode, prevProps, nextProps) => void',
    description: 'Callback when component props change',
  },
  {
    name: 'onStateChange',
    type: '(node: InspectorNode, prevState, nextState) => void',
    description: 'Callback when component state changes',
  },
]

const featuresTableData = [
  {
    feature: 'Component Tree',
    description: 'Visual hierarchy of React components',
    useCase: 'Understand component composition',
  },
  {
    feature: 'Props Inspection',
    description: 'Real-time props viewer with type information',
    useCase: 'Debug prop passing and data flow',
  },
  {
    feature: 'State Inspection',
    description: 'View component state and changes',
    useCase: 'Track state updates and mutations',
  },
  {
    feature: 'Hooks Tracking',
    description: 'Monitor React hooks usage and values',
    useCase: 'Debug custom hooks and effects',
  },
  {
    feature: 'Render Count',
    description: 'Track number of renders per component',
    useCase: 'Identify unnecessary re-renders',
  },
  {
    feature: 'Render Time',
    description: 'Measure render performance in milliseconds',
    useCase: 'Find performance bottlenecks',
  },
  {
    feature: 'State Timeline',
    description: 'Historical view of state changes',
    useCase: 'Debug state evolution over time',
  },
  {
    feature: 'Source Location',
    description: 'Show file and line number of component',
    useCase: 'Jump to source code quickly',
  },
  {
    feature: 'Component Filtering',
    description: 'Filter by name, type, or custom criteria',
    useCase: 'Focus on specific components',
  },
  {
    feature: 'DevTools Bridge',
    description: 'Integration with React DevTools extension',
    useCase: 'Unified debugging experience',
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
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.type}</td>
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

function FeaturesTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Use Case</th>
          </tr>
        </thead>
        <tbody>
          {featuresTableData.map((feature, index) => (
            <tr
              key={feature.feature}
              className={`border-b border-border/30 last:border-b-0 ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              }`}
            >
              <td className="px-4 py-3 font-semibold text-foreground">{feature.feature}</td>
              <td className="px-4 py-3 text-muted-foreground">{feature.description}</td>
              <td className="px-4 py-3 text-muted-foreground">{feature.useCase}</td>
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
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">#</span>
        </a>
      </h2>
      {children}
    </section>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ComponentInspectorPage() {
  return (
    <DocumentationPage
      title="ComponentInspector"
      description="React DevTools-style component inspector with props viewer, state debugging, and render tracking"
      icon={Search}
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
            The <code>ComponentInspector</code> provides a React DevTools-like experience directly
            in your application. It visualizes the component tree, displays props and state, tracks
            render performance, and helps debug complex component hierarchies.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Component Debugging Workflow</h3>
          <p>
            ComponentInspector streamlines the debugging process by providing instant visibility
            into your component structure:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">1. Visualize Component Tree</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                See the complete component hierarchy with nesting levels and relationships.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">2. Inspect Props & State</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Examine component props and state in real-time with formatted JSON views.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">3. Track Render Performance</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Monitor render counts and timing to identify unnecessary re-renders.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-brand-500" />
                <h4 className="font-semibold text-sm">4. Review State History</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Navigate through state changes over time to understand data flow.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">When to Use ComponentInspector</h3>
          <ul className="space-y-2">
            <li>
              <strong>Development:</strong> Debug component hierarchies and prop drilling issues
            </li>
            <li>
              <strong>Performance:</strong> Identify components that re-render too frequently
            </li>
            <li>
              <strong>State Management:</strong> Visualize how state flows through your app
            </li>
            <li>
              <strong>Integration Testing:</strong> Verify component structure and props
            </li>
          </ul>
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
          Interactive demo showing component tree inspection, props viewing, and render tracking.
          Click on components to inspect their details.
        </p>
        <LiveDemo />
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props API">
        <p className="text-muted-foreground mb-6">
          Configure ComponentInspector with 20+ props for comprehensive component inspection and
          debugging.
        </p>
        <PropsTable />
      </Section>

      {/* Features Section */}
      <Section id="features" title="Inspector Features">
        <p className="text-muted-foreground mb-6">
          ComponentInspector provides 10+ inspection capabilities to debug and optimize your React
          applications:
        </p>
        <FeaturesTable />
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <div className="space-y-8">
          {/* Basic Inspection */}
          <div id="example-basic" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">Basic Inspection</h3>
            <p className="text-muted-foreground mb-4">
              Minimal setup to start inspecting components in development:
            </p>
            <CodeBlock code={basicUsageCode} language="tsx" filename="BasicInspection.tsx" />
          </div>

          {/* React Query */}
          <div id="example-react-query" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">With React Query</h3>
            <p className="text-muted-foreground mb-4">
              Inspect components and correlate with React Query cache and queries:
            </p>
            <CodeBlock code={reactQueryCode} language="tsx" filename="ReactQueryIntegration.tsx" />
          </div>

          {/* Redux */}
          <div id="example-redux" className="scroll-mt-24">
            <h3 className="text-xl font-semibold text-foreground mb-3">With Redux</h3>
            <p className="text-muted-foreground mb-4">
              Display Redux state alongside component state for comprehensive debugging:
            </p>
            <CodeBlock code={reduxCode} language="tsx" filename="ReduxIntegration.tsx" />
          </div>
        </div>
      </Section>

      {/* Integration Section */}
      <Section id="integration" title="Integration">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            ComponentInspector integrates with popular React tools and monitoring platforms:
          </p>

          <CodeBlock code={integrationCode} language="tsx" filename="Integration.tsx" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">React DevTools</h4>
              <p className="text-sm text-muted-foreground">
                Bridge to the official React DevTools extension for unified component inspection
                and profiling.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Sentry Performance</h4>
              <p className="text-sm text-muted-foreground">
                Send render metrics to Sentry for production performance monitoring and alerting.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Redux DevTools</h4>
              <p className="text-sm text-muted-foreground">
                Combine with Redux DevTools to see both component and global state changes
                side-by-side.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold text-foreground mb-2">Custom Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Use callbacks to send inspection data to your own analytics or logging platform.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Performance Section */}
      <Section id="performance" title="Performance">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            ComponentInspector is designed for minimal production overhead while providing maximum
            debugging value in development:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-foreground">Tree Shaking</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically removed from production builds when <code>enabled=false</code>
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-foreground">Lazy Tracking</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Render tracking only activates when inspector panel is open
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-foreground">Memory Efficient</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Configurable history depth and automatic cleanup of old data
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Performance Impact</h3>
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Mode</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Bundle Size
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Runtime Overhead
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Memory</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="px-4 py-3 font-medium text-foreground">Production (disabled)</td>
                  <td className="px-4 py-3 text-muted-foreground">0 KB (tree-shaken)</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">None</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">None</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="px-4 py-3 font-medium text-foreground">Development (closed)</td>
                  <td className="px-4 py-3 text-muted-foreground">12 KB gzipped</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">&lt;1ms/render</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">~100 KB</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-foreground">Development (open)</td>
                  <td className="px-4 py-3 text-muted-foreground">12 KB gzipped</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">1-2ms/render</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">~500 KB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Complete type definitions for all inspection features, nodes, and configurations:
        </p>
        <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" showLineNumbers />
      </Section>

      {/* Best Practices Section */}
      <Section id="best-practices" title="Best Practices">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    1. Disable in Production
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Always disable ComponentInspector in production builds using environment
                    variables or build-time flags to avoid performance overhead.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <List className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">2. Use Component Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter out framework components or third-party libraries to focus on your own
                    components and reduce noise.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    3. Monitor Render Counts
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use render tracking to identify components that re-render unnecessarily. High
                    render counts may indicate missing memoization.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Maximize2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">4. Limit Tree Depth</h4>
                  <p className="text-sm text-muted-foreground">
                    Set <code>maxDepth</code> to limit inspection depth in large component trees to
                    reduce memory usage and improve performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">5. Sanitize Sensitive Data</h4>
                  <p className="text-sm text-muted-foreground">
                    Be cautious when inspecting components with sensitive props (passwords, tokens).
                    Use custom filters to redact sensitive information.
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
