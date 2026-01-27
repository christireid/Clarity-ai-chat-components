'use client'

/**
 * ExperimentalFeatures Component - API Reference Documentation
 *
 * Opt-in experimental features with feature flags, A/B testing, and gradual rollout
 * for early access to cutting-edge functionality.
 */

import * as React from 'react'
import {
  Flask,
  ToggleLeft,
  TrendingUp,
  MessageSquare,
  Shield,
  Zap,
  Flag,
  Users,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Settings,
  Play,
  GitBranch,
  Lock,
  Unlock,
  ChevronRight,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import type { Badge, FeatureHighlight, RelatedAPI, FooterLink, TocItem } from '../../../../components/Docs/DocumentationPage'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({ props }: { props: PropDefinition[] }) {
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
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={
                index % 2 === 0
                  ? 'bg-transparent border-b border-border/30'
                  : 'bg-muted/10 border-b border-border/30'
              }
            >
              <td className="px-4 py-3 font-mono text-sm text-brand-600 dark:text-brand-400">
                {prop.name}
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">*</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">{prop.default || '-'}</td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [enabledFeatures, setEnabledFeatures] = React.useState<Set<string>>(new Set())
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [selectedFeature, setSelectedFeature] = React.useState<string | null>(null)

  const experimentalFeatures = [
    { id: 'voice-commands', name: 'Voice Commands', status: 'alpha', rollout: 15 },
    { id: 'ai-suggestions', name: 'AI Suggestions', status: 'beta', rollout: 45 },
    { id: 'smart-replies', name: 'Smart Replies', status: 'beta', rollout: 60 },
    { id: 'code-completion', name: 'Code Completion', status: 'alpha', rollout: 10 },
    { id: 'collaborative-edit', name: 'Collaborative Editing', status: 'alpha', rollout: 5 },
  ]

  const toggleFeature = (id: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleFeedback = (featureId: string) => {
    setSelectedFeature(featureId)
    setShowFeedback(true)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Flask className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-foreground">Experimental Features Panel</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Toggle features on/off to test experimental functionality. Features marked as "alpha" are
          early-stage and may have bugs.
        </p>

        <div className="space-y-2">
          {experimentalFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50"
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    enabledFeatures.has(feature.id)
                      ? 'bg-purple-500'
                      : 'bg-muted-foreground/20'
                  }`}
                  aria-label={`Toggle ${feature.name}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      enabledFeatures.has(feature.id) ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{feature.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        feature.status === 'alpha'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: `${feature.rollout}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {feature.rollout}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleFeedback(feature.id)}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
                >
                  Feedback
                </button>
              </div>
            </div>
          ))}
        </div>

        {showFeedback && (
          <div className="mt-4 p-4 rounded-lg bg-background border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Send Feedback</span>
              <button
                onClick={() => setShowFeedback(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-border/50 bg-background text-foreground text-sm resize-none"
              rows={3}
              placeholder="Share your experience with this experimental feature..."
            />
            <button className="mt-2 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600">
              Submit Feedback
            </button>
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-2">Active Features Summary</h4>
        {enabledFeatures.size === 0 ? (
          <p className="text-xs text-muted-foreground">No experimental features enabled</p>
        ) : (
          <ul className="space-y-1">
            {Array.from(enabledFeatures).map((id) => {
              const feature = experimentalFeatures.find((f) => f.id === id)
              return (
                <li key={id} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3 h-3 text-purple-500" />
                  {feature?.name}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Features Table Component
// ============================================================================

function FeaturesTable() {
  const features = [
    {
      name: 'Voice Commands',
      status: 'alpha',
      rollout: '15%',
      stability: 'Low',
      description: 'Voice-to-text message input',
    },
    {
      name: 'AI Suggestions',
      status: 'beta',
      rollout: '45%',
      stability: 'Medium',
      description: 'Context-aware response suggestions',
    },
    {
      name: 'Smart Replies',
      status: 'beta',
      rollout: '60%',
      stability: 'High',
      description: 'One-click quick responses',
    },
    {
      name: 'Code Completion',
      status: 'alpha',
      rollout: '10%',
      stability: 'Low',
      description: 'AI-powered code autocompletion',
    },
    {
      name: 'Collaborative Editing',
      status: 'alpha',
      rollout: '5%',
      stability: 'Low',
      description: 'Real-time multi-user message editing',
    },
    {
      name: 'Visual Search',
      status: 'alpha',
      rollout: '8%',
      stability: 'Low',
      description: 'Search conversations using images',
    },
    {
      name: 'Auto-Summarization',
      status: 'beta',
      rollout: '35%',
      stability: 'Medium',
      description: 'Automatic conversation summaries',
    },
    {
      name: 'Advanced Analytics',
      status: 'beta',
      rollout: '50%',
      stability: 'High',
      description: 'Detailed chat performance metrics',
    },
    {
      name: 'Custom Animations',
      status: 'alpha',
      rollout: '12%',
      stability: 'Medium',
      description: 'Personalized message animations',
    },
    {
      name: 'Theme Builder',
      status: 'beta',
      rollout: '40%',
      stability: 'High',
      description: 'Visual theme customization tool',
    },
    {
      name: 'Sentiment Analysis',
      status: 'alpha',
      rollout: '6%',
      stability: 'Low',
      description: 'Real-time emotion detection',
    },
    {
      name: 'Message Templates',
      status: 'beta',
      rollout: '55%',
      stability: 'High',
      description: 'Reusable message templates',
    },
  ]

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Rollout</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Stability</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr
              key={feature.name}
              className={
                index % 2 === 0
                  ? 'bg-transparent border-b border-border/30 last:border-b-0'
                  : 'bg-muted/10 border-b border-border/30 last:border-b-0'
              }
            >
              <td className="px-4 py-3 font-medium text-foreground">{feature.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    feature.status === 'alpha'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {feature.status}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{feature.rollout}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs ${
                    feature.stability === 'Low'
                      ? 'text-red-600 dark:text-red-400'
                      : feature.stability === 'Medium'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {feature.stability}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground text-sm">{feature.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'features',
    type: 'ExperimentalFeature[]',
    required: true,
    description: 'Array of experimental features to display with configurations',
  },
  {
    name: 'enabledFeatures',
    type: 'Set<string>',
    default: 'new Set()',
    description: 'Set of currently enabled feature IDs',
  },
  {
    name: 'onToggleFeature',
    type: '(featureId: string, enabled: boolean) => void',
    description: 'Callback when a feature is toggled on/off',
  },
  {
    name: 'onFeatureFeedback',
    type: '(featureId: string, feedback: FeedbackData) => void',
    description: 'Callback when user submits feature feedback',
  },
  {
    name: 'showRolloutProgress',
    type: 'boolean',
    default: 'true',
    description: 'Display gradual rollout progress bars',
  },
]

const rolloutProps: PropDefinition[] = [
  {
    name: 'rolloutStrategy',
    type: "'random' | 'gradual' | 'targeted'",
    default: "'gradual'",
    description: 'Strategy for rolling out features to users',
  },
  {
    name: 'rolloutPercentage',
    type: 'number',
    default: '0',
    description: 'Percentage of users with access (0-100)',
  },
  {
    name: 'targetGroups',
    type: 'string[]',
    description: 'User groups targeted for feature rollout',
  },
  {
    name: 'canaryUsers',
    type: 'string[]',
    description: 'Specific user IDs to receive features first',
  },
]

const feedbackProps: PropDefinition[] = [
  {
    name: 'enableFeedback',
    type: 'boolean',
    default: 'true',
    description: 'Allow users to submit feature feedback',
  },
  {
    name: 'feedbackPrompt',
    type: 'string',
    description: 'Custom prompt text for feedback collection',
  },
  {
    name: 'feedbackCategories',
    type: 'string[]',
    default: "['Bug', 'Suggestion', 'Praise']",
    description: 'Categories for organizing feedback',
  },
  {
    name: 'collectMetrics',
    type: 'boolean',
    default: 'true',
    description: 'Automatically collect usage metrics',
  },
]

const safetyProps: PropDefinition[] = [
  {
    name: 'autoFallback',
    type: 'boolean',
    default: 'true',
    description: 'Automatically disable features on errors',
  },
  {
    name: 'maxRetries',
    type: 'number',
    default: '3',
    description: 'Max retry attempts before fallback',
  },
  {
    name: 'errorReporting',
    type: 'boolean',
    default: 'true',
    description: 'Report feature errors to monitoring service',
  },
  {
    name: 'gracefulDegradation',
    type: 'boolean',
    default: 'true',
    description: 'Gracefully degrade to stable features on failure',
  },
]

const consentProps: PropDefinition[] = [
  {
    name: 'requireConsent',
    type: 'boolean',
    default: 'true',
    description: 'Require explicit user consent for experimental features',
  },
  {
    name: 'consentMessage',
    type: 'string',
    description: 'Custom consent message displayed to users',
  },
  {
    name: 'savePreferences',
    type: 'boolean',
    default: 'true',
    description: 'Persist feature preferences in local storage',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'showStatusBadges',
    type: 'boolean',
    default: 'true',
    description: 'Display alpha/beta status badges',
  },
  {
    name: 'showStabilityIndicators',
    type: 'boolean',
    default: 'true',
    description: 'Show stability ratings for features',
  },
  {
    name: 'groupByStatus',
    type: 'boolean',
    default: 'false',
    description: 'Group features by alpha/beta status',
  },
  {
    name: 'compactMode',
    type: 'boolean',
    default: 'false',
    description: 'Use compact layout for feature list',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ExperimentalFeatures } from '@clarity-chat/react'
import type { ExperimentalFeature, FeedbackData } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ExperimentalFeatures } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set())

  const features = [
    {
      id: 'voice-commands',
      name: 'Voice Commands',
      description: 'Voice-to-text message input',
      status: 'alpha',
      rolloutPercentage: 15,
    },
    {
      id: 'smart-replies',
      name: 'Smart Replies',
      description: 'One-click quick responses',
      status: 'beta',
      rolloutPercentage: 60,
    },
  ]

  const handleToggle = (featureId: string, enabled: boolean) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev)
      enabled ? next.add(featureId) : next.delete(featureId)
      return next
    })
  }

  return (
    <ExperimentalFeatures
      features={features}
      enabledFeatures={enabledFeatures}
      onToggleFeature={handleToggle}
    />
  )
}`

const withFeedbackCode = `import { ExperimentalFeatures } from '@clarity-chat/react'
import { useState } from 'react'

function ExperimentalPanel() {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set())

  const features = [
    {
      id: 'ai-suggestions',
      name: 'AI Suggestions',
      description: 'Context-aware response suggestions',
      status: 'beta',
      rolloutPercentage: 45,
    },
    {
      id: 'code-completion',
      name: 'Code Completion',
      description: 'AI-powered code autocompletion',
      status: 'alpha',
      rolloutPercentage: 10,
    },
  ]

  const handleFeedback = async (featureId: string, feedback: FeedbackData) => {
    console.log('Feature feedback:', featureId, feedback)

    // Send to analytics
    await fetch('/api/feature-feedback', {
      method: 'POST',
      body: JSON.stringify({ featureId, feedback }),
    })
  }

  return (
    <ExperimentalFeatures
      features={features}
      enabledFeatures={enabledFeatures}
      onToggleFeature={(id, enabled) => {
        setEnabledFeatures((prev) => {
          const next = new Set(prev)
          enabled ? next.add(id) : next.delete(id)
          return next
        })
      }}
      onFeatureFeedback={handleFeedback}
      enableFeedback
      feedbackCategories={['Bug', 'Suggestion', 'Praise', 'Performance']}
      collectMetrics
    />
  )
}`

const abTestingCode = `import { ExperimentalFeatures } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function ABTestingPanel() {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set())
  const [userGroup, setUserGroup] = useState<'control' | 'variant'>('control')

  // Assign user to A/B test group
  useEffect(() => {
    const group = Math.random() < 0.5 ? 'control' : 'variant'
    setUserGroup(group)
  }, [])

  const features = [
    {
      id: 'new-ui',
      name: 'New UI Design',
      description: 'Redesigned chat interface',
      status: 'beta',
      rolloutPercentage: 50,
      rolloutStrategy: 'random' as const,
    },
    {
      id: 'smart-search',
      name: 'Smart Search',
      description: 'AI-powered conversation search',
      status: 'alpha',
      rolloutPercentage: 25,
      rolloutStrategy: 'gradual' as const,
      targetGroups: ['beta-testers', 'power-users'],
    },
  ]

  return (
    <div>
      <div className="mb-4 p-3 rounded-lg bg-muted">
        <p className="text-sm">
          You are in <strong>{userGroup}</strong> group
        </p>
      </div>

      <ExperimentalFeatures
        features={features}
        enabledFeatures={enabledFeatures}
        onToggleFeature={(id, enabled) => {
          setEnabledFeatures((prev) => {
            const next = new Set(prev)
            enabled ? next.add(id) : next.delete(id)
            return next
          })

          // Log A/B test participation
          console.log('A/B Test:', { featureId: id, enabled, group: userGroup })
        }}
        rolloutStrategy="random"
        showRolloutProgress
      />
    </div>
  )
}`

const typescriptCode = `// Main component props
interface ExperimentalFeaturesProps {
  /** Array of experimental features */
  features: ExperimentalFeature[]
  /** Currently enabled feature IDs */
  enabledFeatures: Set<string>
  /** Callback when feature is toggled */
  onToggleFeature?: (featureId: string, enabled: boolean) => void
  /** Callback for feature feedback */
  onFeatureFeedback?: (featureId: string, feedback: FeedbackData) => void

  // Rollout settings
  rolloutStrategy?: 'random' | 'gradual' | 'targeted'
  rolloutPercentage?: number
  targetGroups?: string[]
  canaryUsers?: string[]

  // Feedback settings
  enableFeedback?: boolean
  feedbackPrompt?: string
  feedbackCategories?: string[]
  collectMetrics?: boolean

  // Safety settings
  autoFallback?: boolean
  maxRetries?: number
  errorReporting?: boolean
  gracefulDegradation?: boolean

  // Consent settings
  requireConsent?: boolean
  consentMessage?: string
  savePreferences?: boolean

  // Display settings
  showStatusBadges?: boolean
  showStabilityIndicators?: boolean
  showRolloutProgress?: boolean
  groupByStatus?: boolean
  compactMode?: boolean
}

// Feature definition
interface ExperimentalFeature {
  id: string
  name: string
  description: string
  status: 'alpha' | 'beta'
  rolloutPercentage: number
  rolloutStrategy?: 'random' | 'gradual' | 'targeted'
  targetGroups?: string[]
  stabilityScore?: number
  migrationPath?: string
}

// Feedback data
interface FeedbackData {
  category: string
  message: string
  rating?: number
  metadata?: Record<string, unknown>
}`

// ============================================================================
// Page Configuration
// ============================================================================

const badges: Badge[] = [
  { label: 'Experimental', variant: 'experimental' },
]

const features: FeatureHighlight[] = [
  {
    icon: Flag,
    label: 'Feature Flags',
    description: 'Toggle experimental features',
  },
  {
    icon: TrendingUp,
    label: 'A/B Testing',
    description: 'Gradual feature rollout',
  },
  {
    icon: MessageSquare,
    label: 'User Feedback',
    description: 'Built-in feedback collection',
  },
  {
    icon: Shield,
    label: 'Safe Defaults',
    description: 'Automatic fallback on errors',
  },
]

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'rollout-props', title: 'Rollout Settings' },
      { id: 'feedback-props', title: 'Feedback Settings' },
      { id: 'safety-props', title: 'Safety Settings' },
      { id: 'consent-props', title: 'Consent Settings' },
      { id: 'display-props', title: 'Display Settings' },
    ],
  },
  { id: 'available-features', title: 'Available Features' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'basic-usage', title: 'Basic Usage' },
      { id: 'with-feedback', title: 'With Feedback' },
      { id: 'ab-testing', title: 'A/B Testing' },
    ],
  },
  { id: 'opt-in-process', title: 'Opt-in Process' },
  { id: 'stability', title: 'Stability & Migration' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'related', title: 'Related' },
]

const relatedAPIs: RelatedAPI[] = [
  {
    name: 'FeatureFlag',
    type: 'component',
    description: 'Individual feature flag component',
    href: '/reference/components/feature-flag',
  },
  {
    name: 'ABTest',
    type: 'component',
    description: 'A/B testing wrapper component',
    href: '/reference/components/ab-test',
  },
  {
    name: 'useExperiment',
    type: 'hook',
    description: 'Hook for managing experimental features',
    href: '/reference/hooks/use-experiment',
  },
]

const footerNavigation: FooterLink[] = [
  {
    label: 'DebugPanel',
    href: '/reference/components/debug-panel',
    direction: 'previous',
  },
  {
    label: 'FeatureFlag',
    href: '/reference/components/feature-flag',
    direction: 'next',
  },
]

// ============================================================================
// Main Page Component
// ============================================================================

export default function ExperimentalFeaturesPage() {
  return (
    <DocumentationPage
      title="ExperimentalFeatures"
      description="Opt-in experimental features with feature flags, A/B testing, and gradual rollout for early access to cutting-edge functionality."
      icon={Flask}
      badges={badges}
      packageName="@clarity-chat/react"
      features={features}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
      footerNavigation={footerNavigation}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>ExperimentalFeatures</code> provides a safe, controlled way to introduce
            cutting-edge features to users through feature flags, A/B testing, and gradual rollout
            strategies. Perfect for testing new functionality before full release.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Philosophy</h4>
          <ul className="space-y-2">
            <li>
              <strong>Opt-in by Default:</strong> Users must explicitly enable experimental
              features
            </li>
            <li>
              <strong>Safe Fallbacks:</strong> Automatic degradation to stable features on errors
            </li>
            <li>
              <strong>User Feedback:</strong> Built-in mechanisms for collecting feature feedback
            </li>
            <li>
              <strong>Gradual Rollout:</strong> Control exposure percentage and target specific
              user groups
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Use Cases</h4>
          <ul className="space-y-2">
            <li>Beta testing new features with power users</li>
            <li>A/B testing UI variations and improvements</li>
            <li>Gradual rollout of performance optimizations</li>
            <li>Collecting early feedback on upcoming features</li>
            <li>Testing experimental AI capabilities</li>
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

          <p className="text-muted-foreground">Import the component:</p>

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
          Try toggling experimental features on and off. Notice the status badges, rollout
          progress, and feedback collection.
        </p>
        <LiveDemo />
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <p className="text-muted-foreground mb-6">
          ExperimentalFeatures provides comprehensive configuration for feature flagging, rollout
          strategies, and safety mechanisms.
        </p>

        <div id="core-props" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Core Props</h3>
          <PropsTable props={coreProps} />
        </div>

        <div id="rollout-props" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Rollout Settings</h3>
          <PropsTable props={rolloutProps} />
        </div>

        <div id="feedback-props" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Feedback Settings</h3>
          <PropsTable props={feedbackProps} />
        </div>

        <div id="safety-props" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Safety Settings</h3>
          <PropsTable props={safetyProps} />
        </div>

        <div id="consent-props" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Consent Settings</h3>
          <PropsTable props={consentProps} />
        </div>

        <div id="display-props" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Display Settings</h3>
          <PropsTable props={displayProps} />
        </div>
      </Section>

      {/* Available Features Section */}
      <Section id="available-features" title="Available Features">
        <p className="text-muted-foreground mb-4">
          Current experimental features available in Clarity Chat. Rollout percentages indicate
          gradual deployment progress.
        </p>
        <FeaturesTable />
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <div id="basic-usage" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-3">Basic Usage</h3>
          <p className="text-muted-foreground mb-4">Simple feature flag panel:</p>
          <CodeBlock code={basicUsageCode} language="tsx" filename="App.tsx" />
        </div>

        <div id="with-feedback" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-3">With Feedback Collection</h3>
          <p className="text-muted-foreground mb-4">
            Enable user feedback and metrics collection:
          </p>
          <CodeBlock code={withFeedbackCode} language="tsx" filename="FeedbackPanel.tsx" />
        </div>

        <div id="ab-testing" className="scroll-mt-24 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-3">A/B Testing</h3>
          <p className="text-muted-foreground mb-4">
            Implement A/B testing with user group assignment:
          </p>
          <CodeBlock code={abTestingCode} language="tsx" filename="ABTestPanel.tsx" />
        </div>
      </Section>

      {/* Opt-in Process Section */}
      <Section id="opt-in-process" title="Opt-in Process">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mb-3">User Consent Flow</h4>
          <ol className="space-y-3">
            <li>
              <strong>Disclosure:</strong> Users see a clear explanation of experimental features
              and their alpha/beta status
            </li>
            <li>
              <strong>Explicit Consent:</strong> Users must actively enable features via toggle
              switches
            </li>
            <li>
              <strong>Preference Storage:</strong> Choices are saved to localStorage for
              persistence across sessions
            </li>
            <li>
              <strong>Feedback Channel:</strong> Users can provide feedback at any time during
              feature usage
            </li>
          </ol>

          <h4 className="text-lg font-semibold mt-6 mb-3">Best Practices</h4>
          <ul className="space-y-2">
            <li>Clearly communicate alpha vs. beta stability levels</li>
            <li>Provide easy access to feedback submission</li>
            <li>Allow users to disable features at any time</li>
            <li>Show rollout progress to indicate feature maturity</li>
            <li>Include links to documentation for each feature</li>
          </ul>
        </div>
      </Section>

      {/* Stability Section */}
      <Section id="stability" title="Stability & Migration">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mb-3">Feature Lifecycle</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  alpha
                </span>
                <span className="font-medium text-foreground">Alpha Stage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Early-stage features with potential bugs. Rollout 5-15%. May have breaking
                changes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  beta
                </span>
                <span className="font-medium text-foreground">Beta Stage</span>
              </div>
              <p className="text-sm text-muted-foreground">
                More stable features ready for broader testing. Rollout 30-70%. API mostly stable.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                  stable
                </span>
                <span className="font-medium text-foreground">Stable Release</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Production-ready features. 100% rollout. Stable API with semantic versioning.
              </p>
            </div>
          </div>

          <h4 className="text-lg font-semibold mt-6 mb-3">Migration Path</h4>
          <p>
            When experimental features graduate to stable, they're promoted to the main API. The
            experimental version remains available for one major version with deprecation warnings.
          </p>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">Full type definitions:</p>
        <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" showLineNumbers />
      </Section>
    </DocumentationPage>
  )
}
