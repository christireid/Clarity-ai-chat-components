'use client'

/**
 * AccessibilityProvider Component - API Reference Documentation
 *
 * WCAG 2.1 AAA compliance toolkit with keyboard navigation, screen reader support,
 * and preference management.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Accessibility,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Eye,
  Keyboard,
  Volume2,
  Settings,
  Zap,
  Shield,
  Check as CheckIcon,
  AlertTriangle,
  HelpCircle,
  Users,
  MonitorSmartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

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
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Feature Table Component
// ============================================================================

interface FeatureDefinition {
  name: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  description: string
  implementation: string
}

function FeaturesTable({ features }: { features: FeatureDefinition[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Feature
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              WCAG Level
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Implementation
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr
              key={feature.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-medium text-foreground">
                {feature.name}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    feature.wcagLevel === 'AAA'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : feature.wcagLevel === 'AA'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400'
                  )}
                >
                  {feature.wcagLevel}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {feature.description}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {feature.implementation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
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

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [highContrast, setHighContrast] = React.useState(false)
  const [fontSize, setFontSize] = React.useState(100)
  const [announcements, setAnnouncements] = React.useState<string[]>([])

  const handleToggle = (setting: string, value: boolean) => {
    const message = `${setting} ${value ? 'enabled' : 'disabled'}`
    setAnnouncements((prev) => [...prev, message])
    setTimeout(() => {
      setAnnouncements((prev) => prev.slice(1))
    }, 3000)
  }

  return (
    <div className="space-y-4">
      {/* Settings Panel */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Accessibility Settings
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Configure your accessibility preferences
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Reduced Motion */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="flex items-center gap-2 font-medium text-foreground mb-1">
                <Eye className="w-4 h-4" />
                Reduced Motion
              </label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <button
              onClick={() => {
                setReducedMotion(!reducedMotion)
                handleToggle('Reduced Motion', !reducedMotion)
              }}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                reducedMotion ? 'bg-brand-500' : 'bg-muted'
              )}
              role="switch"
              aria-checked={reducedMotion}
              aria-label="Toggle reduced motion"
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  reducedMotion ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="flex items-center gap-2 font-medium text-foreground mb-1">
                <MonitorSmartphone className="w-4 h-4" />
                High Contrast
              </label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <button
              onClick={() => {
                setHighContrast(!highContrast)
                handleToggle('High Contrast', !highContrast)
              }}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                highContrast ? 'bg-brand-500' : 'bg-muted'
              )}
              role="switch"
              aria-checked={highContrast}
              aria-label="Toggle high contrast"
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  highContrast ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Font Size */}
          <div>
            <label className="flex items-center gap-2 font-medium text-foreground mb-2">
              <Settings className="w-4 h-4" />
              Font Size: {fontSize}%
            </label>
            <input
              type="range"
              min="80"
              max="150"
              step="10"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              onChangeCapture={(e) =>
                handleToggle('Font Size', Number((e.target as HTMLInputElement).value) > 100)
              }
              className="w-full"
              aria-label="Adjust font size"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Small (80%)</span>
              <span>Normal (100%)</span>
              <span>Large (150%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Announcements */}
      {announcements.length > 0 && (
        <div
          className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Screen Reader Announcement
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {announcements[announcements.length - 1]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div
        className={cn(
          'p-6 rounded-xl border transition-all',
          highContrast
            ? 'bg-black text-white border-white'
            : 'bg-card border-border/50'
        )}
        style={{ fontSize: `${fontSize}%` }}
      >
        <h4 className="font-semibold mb-2">Preview</h4>
        <p className={cn('text-sm', highContrast ? 'text-white' : 'text-muted-foreground')}>
          This text adapts based on your accessibility preferences. Try
          adjusting the settings above to see the changes.
        </p>
        <motion.div
          className="mt-4 p-3 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400"
          animate={reducedMotion ? {} : { scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {reducedMotion
            ? 'Animations disabled'
            : 'Animated element (disabled with reduced motion)'}
        </motion.div>
      </div>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'features', title: 'Accessibility Features' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'aria-props', title: 'ARIA Configuration' },
      { id: 'keyboard-props', title: 'Keyboard Navigation' },
      { id: 'preference-props', title: 'User Preferences' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-custom-preferences', title: 'Custom Preferences' },
      { id: 'example-testing', title: 'Accessibility Testing' },
    ],
  },
  { id: 'aria-patterns', title: 'ARIA Patterns' },
  { id: 'testing', title: 'Testing' },
  { id: 'wcag', title: 'WCAG Compliance' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'Application content wrapped with accessibility features.',
  },
  {
    name: 'enableAutoAria',
    type: 'boolean',
    default: 'true',
    description: 'Automatically generate ARIA attributes for components.',
  },
  {
    name: 'enableKeyboardNav',
    type: 'boolean',
    default: 'true',
    description: 'Enable keyboard navigation shortcuts and handlers.',
  },
  {
    name: 'enableFocusManagement',
    type: 'boolean',
    default: 'true',
    description: 'Manage focus states and focus trapping for modals.',
  },
  {
    name: 'announceChanges',
    type: 'boolean',
    default: 'true',
    description: 'Announce important changes to screen readers via live regions.',
  },
]

const ariaProps: PropDefinition[] = [
  {
    name: 'ariaLiveRegions',
    type: "{ polite?: boolean; assertive?: boolean; status?: boolean }",
    default: '{ polite: true, assertive: false, status: true }',
    description: 'Configure ARIA live regions for announcements.',
  },
  {
    name: 'ariaLandmarks',
    type: 'boolean',
    default: 'true',
    description: 'Add ARIA landmark roles for navigation.',
  },
  {
    name: 'ariaDescriptions',
    type: 'boolean',
    default: 'true',
    description: 'Generate descriptive ARIA labels for complex interactions.',
  },
  {
    name: 'customAriaLabels',
    type: 'Record<string, string>',
    description: 'Override default ARIA labels with custom text.',
  },
]

const keyboardProps: PropDefinition[] = [
  {
    name: 'keyboardShortcuts',
    type: 'KeyboardShortcut[]',
    description: 'Define custom keyboard shortcuts.',
  },
  {
    name: 'enableEscapeKey',
    type: 'boolean',
    default: 'true',
    description: 'Allow Escape key to close modals and cancel actions.',
  },
  {
    name: 'enableTabTrapping',
    type: 'boolean',
    default: 'true',
    description: 'Trap Tab focus within modals and dialogs.',
  },
  {
    name: 'skipLinks',
    type: 'SkipLink[]',
    description: 'Add skip links for keyboard navigation.',
  },
]

const preferenceProps: PropDefinition[] = [
  {
    name: 'respectReducedMotion',
    type: 'boolean',
    default: 'true',
    description: 'Respect prefers-reduced-motion system preference.',
  },
  {
    name: 'respectHighContrast',
    type: 'boolean',
    default: 'true',
    description: 'Respect prefers-contrast system preference.',
  },
  {
    name: 'fontScaling',
    type: 'number',
    default: '1.0',
    description: 'Font size multiplier (0.8 to 2.0).',
  },
  {
    name: 'onPreferenceChange',
    type: '(preference: string, value: any) => void',
    description: 'Callback when accessibility preference changes.',
  },
]

const accessibilityFeatures: FeatureDefinition[] = [
  {
    name: 'Keyboard Navigation',
    wcagLevel: 'A',
    description: 'Full keyboard control for all interactive elements',
    implementation: 'Tab, Enter, Escape, Arrow keys',
  },
  {
    name: 'Screen Reader Support',
    wcagLevel: 'A',
    description: 'ARIA labels, roles, and live regions',
    implementation: 'Automatic ARIA attribute generation',
  },
  {
    name: 'Focus Management',
    wcagLevel: 'AA',
    description: 'Visible focus indicators and focus trapping',
    implementation: 'CSS focus-visible + JS focus management',
  },
  {
    name: 'Skip Links',
    wcagLevel: 'A',
    description: 'Jump to main content or navigation',
    implementation: 'Keyboard-accessible skip links',
  },
  {
    name: 'Reduced Motion',
    wcagLevel: 'AAA',
    description: 'Respect user motion preferences',
    implementation: 'prefers-reduced-motion media query',
  },
  {
    name: 'High Contrast',
    wcagLevel: 'AAA',
    description: 'Enhanced contrast modes',
    implementation: 'prefers-contrast media query + manual toggle',
  },
  {
    name: 'Font Scaling',
    wcagLevel: 'AA',
    description: 'Adjustable text size (80-200%)',
    implementation: 'CSS rem units + user preference',
  },
  {
    name: 'Color Contrast',
    wcagLevel: 'AAA',
    description: 'WCAG AAA contrast ratios (7:1)',
    implementation: 'Tested color palette',
  },
  {
    name: 'Touch Targets',
    wcagLevel: 'AAA',
    description: 'Minimum 44x44px touch areas',
    implementation: 'CSS padding and min-height',
  },
  {
    name: 'Error Identification',
    wcagLevel: 'A',
    description: 'Clear error messages with recovery',
    implementation: 'aria-invalid + error text',
  },
  {
    name: 'Input Assistance',
    wcagLevel: 'AA',
    description: 'Labels, hints, and autocomplete',
    implementation: 'aria-describedby + autocomplete attributes',
  },
  {
    name: 'Live Announcements',
    wcagLevel: 'AA',
    description: 'Real-time updates for screen readers',
    implementation: 'aria-live regions with debouncing',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { AccessibilityProvider } from '@clarity-chat/react'
import { useAccessibility } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { AccessibilityProvider } from '@clarity-chat/react'
import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <AccessibilityProvider>
      <ClarityChatApp
        api="/api/chat"
        initialMessages={[]}
      />
    </AccessibilityProvider>
  )
}`

const customPreferencesCode = `import { AccessibilityProvider } from '@clarity-chat/react'

function App() {
  const handlePreferenceChange = (preference: string, value: any) => {
    console.log(\`Preference \${preference} changed to\`, value)
    // Save to localStorage or API
    localStorage.setItem(\`a11y_\${preference}\`, JSON.stringify(value))
  }

  return (
    <AccessibilityProvider
      enableAutoAria
      enableKeyboardNav
      respectReducedMotion
      respectHighContrast
      fontScaling={1.2}
      onPreferenceChange={handlePreferenceChange}
      keyboardShortcuts={[
        { key: '/', action: 'focusSearch', description: 'Focus search input' },
        { key: 'c', action: 'newChat', description: 'Start new conversation' },
        { key: 'Escape', action: 'closeModal', description: 'Close modal' },
      ]}
      skipLinks={[
        { target: '#main-content', label: 'Skip to main content' },
        { target: '#chat-input', label: 'Skip to chat input' },
      ]}
    >
      <YourApp />
    </AccessibilityProvider>
  )
}`

const testingCode = `import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { AccessibilityProvider } from '@clarity-chat/react'

expect.extend(toHaveNoViolations)

describe('Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <AccessibilityProvider>
        <YourComponent />
      </AccessibilityProvider>
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('supports keyboard navigation', () => {
    render(
      <AccessibilityProvider>
        <YourComponent />
      </AccessibilityProvider>
    )

    const button = screen.getByRole('button', { name: /send/i })
    button.focus()
    expect(button).toHaveFocus()
  })

  it('announces changes to screen readers', async () => {
    render(
      <AccessibilityProvider announceChanges>
        <YourComponent />
      </AccessibilityProvider>
    )

    const liveRegion = screen.getByRole('status')
    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
  })
})`

const useAccessibilityHookCode = `import { useAccessibility } from '@clarity-chat/react'

function MyComponent() {
  const {
    preferences,
    updatePreference,
    announce,
    isReducedMotion,
    isHighContrast,
    fontSize,
  } = useAccessibility()

  const handleAction = () => {
    // Perform action
    doSomething()

    // Announce to screen readers
    announce('Action completed successfully', 'polite')
  }

  return (
    <button
      onClick={handleAction}
      className={isHighContrast ? 'high-contrast-button' : 'button'}
      style={{ fontSize: \`\${fontSize}rem\` }}
    >
      {isReducedMotion ? 'Click me' : (
        <motion.span animate={{ scale: [1, 1.1, 1] }}>
          Click me
        </motion.span>
      )}
    </button>
  )
}`

const typescriptCode = `// Main provider props
interface AccessibilityProviderProps {
  /** Application content */
  children: React.ReactNode
  /** Automatically generate ARIA attributes */
  enableAutoAria?: boolean
  /** Enable keyboard navigation */
  enableKeyboardNav?: boolean
  /** Enable focus management */
  enableFocusManagement?: boolean
  /** Announce changes to screen readers */
  announceChanges?: boolean
  /** Configure ARIA live regions */
  ariaLiveRegions?: {
    polite?: boolean
    assertive?: boolean
    status?: boolean
  }
  /** Add ARIA landmark roles */
  ariaLandmarks?: boolean
  /** Generate descriptive ARIA labels */
  ariaDescriptions?: boolean
  /** Override default ARIA labels */
  customAriaLabels?: Record<string, string>
  /** Define custom keyboard shortcuts */
  keyboardShortcuts?: KeyboardShortcut[]
  /** Allow Escape key to close modals */
  enableEscapeKey?: boolean
  /** Trap Tab focus within modals */
  enableTabTrapping?: boolean
  /** Add skip links for navigation */
  skipLinks?: SkipLink[]
  /** Respect prefers-reduced-motion */
  respectReducedMotion?: boolean
  /** Respect prefers-contrast */
  respectHighContrast?: boolean
  /** Font size multiplier (0.8-2.0) */
  fontScaling?: number
  /** Callback when preference changes */
  onPreferenceChange?: (preference: string, value: any) => void
}

// Keyboard shortcut definition
interface KeyboardShortcut {
  key: string
  action: string
  description: string
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[]
}

// Skip link definition
interface SkipLink {
  target: string
  label: string
}

// Accessibility hook return type
interface UseAccessibilityReturn {
  preferences: AccessibilityPreferences
  updatePreference: (key: string, value: any) => void
  announce: (message: string, priority?: 'polite' | 'assertive') => void
  isReducedMotion: boolean
  isHighContrast: boolean
  fontSize: number
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function AccessibilityProviderPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Accessibility className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Provider
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                AccessibilityProvider
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                WCAG 2.1 AAA compliance toolkit with keyboard navigation,
                screen reader support, and preference management. Wrap your
                application to automatically add accessibility features.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: CheckIcon,
                  label: 'WCAG AA+',
                  desc: 'AA with AAA targets',
                },
                {
                  icon: Keyboard,
                  label: 'Keyboard Nav',
                  desc: 'Full keyboard control',
                },
                {
                  icon: Volume2,
                  label: 'Screen Reader',
                  desc: 'ARIA live regions',
                },
                {
                  icon: Settings,
                  label: 'Preferences',
                  desc: 'User customization',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>AccessibilityProvider</code> is a React context provider
                  that adds comprehensive accessibility features to your
                  application. It automatically generates ARIA attributes,
                  manages keyboard navigation, and respects user preferences for
                  motion, contrast, and font size.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Why Accessibility Matters
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>15% of the global population</strong> has some form
                    of disability
                  </li>
                  <li>
                    <strong>Legal requirement</strong> in many jurisdictions
                    (ADA, Section 508, EU directive)
                  </li>
                  <li>
                    <strong>Better UX for everyone</strong> - keyboard
                    navigation, clear labels, predictable behavior
                  </li>
                  <li>
                    <strong>SEO benefits</strong> - semantic HTML and ARIA help
                    search engines
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  WCAG 2.1 Levels
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Level A:</strong> Basic accessibility (minimum
                    requirement)
                  </li>
                  <li>
                    <strong>Level AA:</strong> Enhanced accessibility (commonly
                    required for compliance)
                  </li>
                  <li>
                    <strong>Level AAA:</strong> Optimal accessibility (highest
                    standard)
                  </li>
                </ul>
                <p className="mt-3">
                  AccessibilityProvider targets <strong>WCAG 2.1 AAA</strong>{' '}
                  compliance, exceeding most legal requirements.
                </p>
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

                <p className="text-muted-foreground">
                  Import the provider and hook:
                </p>

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
                Try adjusting accessibility settings and see how they affect the
                interface. Screen reader announcements are shown below.
              </p>

              <LiveDemo />
            </Section>

            {/* Accessibility Features Section */}
            <Section id="features" title="Accessibility Features">
              <p className="text-muted-foreground mb-6">
                AccessibilityProvider includes 12+ accessibility features out of
                the box, covering WCAG 2.1 levels A, AA, and AAA:
              </p>

              <FeaturesTable features={accessibilityFeatures} />
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                Configure accessibility features with 18+ props organized into
                logical groups.
              </p>

              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection
                id="aria-props"
                title="ARIA Configuration"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure ARIA attributes, roles, and labels:
                </p>
                <PropsTable props={ariaProps} />
              </SubSection>

              <SubSection
                id="keyboard-props"
                title="Keyboard Navigation"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure keyboard shortcuts and focus management:
                </p>
                <PropsTable props={keyboardProps} />
              </SubSection>

              <SubSection
                id="preference-props"
                title="User Preferences"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Respect user preferences for motion, contrast, and font size:
                </p>
                <PropsTable props={preferenceProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Wrap your app with AccessibilityProvider for automatic
                  accessibility features:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="App.tsx"
                />
              </SubSection>

              <SubSection
                id="example-custom-preferences"
                title="Custom Preferences"
              >
                <p className="text-muted-foreground mb-4">
                  Configure keyboard shortcuts, skip links, and preference
                  callbacks:
                </p>
                <CodeBlock
                  code={customPreferencesCode}
                  language="tsx"
                  filename="CustomAccessibility.tsx"
                />
              </SubSection>

              <SubSection id="example-testing" title="Accessibility Testing">
                <p className="text-muted-foreground mb-4">
                  Test accessibility with jest-axe and Testing Library:
                </p>
                <CodeBlock
                  code={testingCode}
                  language="tsx"
                  filename="accessibility.test.tsx"
                />
              </SubSection>
            </Section>

            {/* ARIA Patterns Section */}
            <Section id="aria-patterns" title="ARIA Patterns">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  AccessibilityProvider implements common ARIA patterns
                  automatically:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Button Pattern
                </h4>
                <ul className="space-y-2">
                  <li>
                    <code>role="button"</code> for non-button elements
                  </li>
                  <li>
                    <code>aria-label</code> for icon-only buttons
                  </li>
                  <li>
                    <code>aria-pressed</code> for toggle buttons
                  </li>
                  <li>Keyboard: Enter and Space to activate</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Dialog/Modal Pattern
                </h4>
                <ul className="space-y-2">
                  <li>
                    <code>role="dialog"</code> and <code>aria-modal="true"</code>
                  </li>
                  <li>
                    <code>aria-labelledby</code> references modal title
                  </li>
                  <li>Focus trap: Tab cycles within modal</li>
                  <li>Keyboard: Escape to close</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Live Region Pattern
                </h4>
                <ul className="space-y-2">
                  <li>
                    <code>aria-live="polite"</code> for status updates
                  </li>
                  <li>
                    <code>aria-live="assertive"</code> for urgent alerts
                  </li>
                  <li>
                    <code>aria-atomic="true"</code> to read entire region
                  </li>
                  <li>Debounced announcements to prevent overload</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Navigation Pattern
                </h4>
                <ul className="space-y-2">
                  <li>
                    <code>role="navigation"</code> with <code>aria-label</code>
                  </li>
                  <li>Skip links to main content and sections</li>
                  <li>Keyboard: Tab through links, Enter to activate</li>
                </ul>
              </div>
            </Section>

            {/* Testing Section */}
            <Section id="testing" title="Testing">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mb-3">
                  Automated Testing with axe-core
                </h4>
                <p>
                  Use <code>jest-axe</code> for automated accessibility testing:
                </p>
                <CodeBlock code={testingCode} language="tsx" filename="test.tsx" />

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Manual Testing Checklist
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Keyboard Navigation:</strong> Tab through all
                    interactive elements
                  </li>
                  <li>
                    <strong>Screen Reader:</strong> Test with NVDA (Windows),
                    JAWS (Windows), or VoiceOver (Mac)
                  </li>
                  <li>
                    <strong>Zoom:</strong> Test at 200% zoom (WCAG AAA)
                  </li>
                  <li>
                    <strong>Color Contrast:</strong> Check with browser
                    DevTools or WebAIM contrast checker
                  </li>
                  <li>
                    <strong>Reduced Motion:</strong> Enable in OS settings and
                    verify animations are disabled
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Browser Extensions
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.deque.com/axe/browser-extensions/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      axe DevTools
                      <ExternalLink className="inline w-3 h-3 ml-1" />
                    </a>{' '}
                    - Automated accessibility testing
                  </li>
                  <li>
                    <a
                      href="https://wave.webaim.org/extension/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      WAVE
                      <ExternalLink className="inline w-3 h-3 ml-1" />
                    </a>{' '}
                    - WebAIM accessibility evaluation tool
                  </li>
                  <li>
                    <a
                      href="https://www.w3.org/WAI/ER/tools/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Lighthouse
                      <ExternalLink className="inline w-3 h-3 ml-1" />
                    </a>{' '}
                    - Built into Chrome DevTools
                  </li>
                </ul>
              </div>
            </Section>

            {/* WCAG Compliance Section */}
            <Section id="wcag" title="WCAG Compliance">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  AccessibilityProvider helps you meet WCAG 2.1 AAA requirements:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Perceivable
                </h4>
                <ul className="space-y-2">
                  <li>1.4.3 Contrast (Minimum) - AA: 4.5:1 text, 3:1 UI</li>
                  <li>1.4.6 Contrast (Enhanced) - AAA: 7:1 text, 4.5:1 UI</li>
                  <li>1.4.12 Text Spacing - AA: User can adjust spacing</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Operable</h4>
                <ul className="space-y-2">
                  <li>2.1.1 Keyboard - A: All functionality via keyboard</li>
                  <li>2.1.2 No Keyboard Trap - A: Focus can be moved away</li>
                  <li>2.2.2 Pause, Stop, Hide - A: Control auto-updating content</li>
                  <li>2.5.5 Target Size - AAA: 44x44px touch targets</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Understandable
                </h4>
                <ul className="space-y-2">
                  <li>3.3.1 Error Identification - A: Errors clearly identified</li>
                  <li>3.3.2 Labels or Instructions - A: Inputs have labels</li>
                  <li>3.3.3 Error Suggestion - AA: Error correction suggestions</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Robust</h4>
                <ul className="space-y-2">
                  <li>4.1.2 Name, Role, Value - A: ARIA attributes present</li>
                  <li>4.1.3 Status Messages - AA: Status messages announced</li>
                </ul>
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
                        Screen reader not announcing changes
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Live regions not working as expected.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Verify <code>announceChanges</code> is enabled
                        </li>
                        <li>Check that announcements aren't too frequent (debounced)</li>
                        <li>
                          Test with multiple screen readers (NVDA, JAWS,
                          VoiceOver)
                        </li>
                        <li>
                          Ensure live region has proper <code>aria-live</code>{' '}
                          and <code>aria-atomic</code> attributes
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
                        Keyboard shortcuts not working
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Custom keyboard shortcuts aren't triggering.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Check that <code>enableKeyboardNav</code> is true
                        </li>
                        <li>Verify shortcuts don't conflict with browser defaults</li>
                        <li>
                          Ensure target element is focused or shortcut is global
                        </li>
                        <li>Test in different browsers for compatibility</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        How to test with screen readers?
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Best practices for screen reader testing.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          <strong>Windows:</strong> NVDA (free) or JAWS (paid)
                        </li>
                        <li>
                          <strong>Mac:</strong> VoiceOver (built-in, Cmd+F5)
                        </li>
                        <li>
                          <strong>Mobile:</strong> TalkBack (Android), VoiceOver (iOS)
                        </li>
                        <li>
                          Learn basic commands for your chosen screen reader
                        </li>
                        <li>Test with real users who rely on screen readers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useAccessibility',
                    type: 'hook',
                    description: 'Access accessibility context and preferences',
                    href: '/reference/hooks/use-accessibility',
                  },
                  {
                    name: 'SkipLink',
                    type: 'component',
                    description: 'Jump to main content or sections',
                    href: '/reference/components/skip-link',
                  },
                  {
                    name: 'FocusTrap',
                    type: 'component',
                    description: 'Trap keyboard focus within modals',
                    href: '/reference/components/focus-trap',
                  },
                  {
                    name: 'useReducedMotion',
                    type: 'hook',
                    description: 'Detect user motion preference',
                    href: '/reference/hooks/use-reduced-motion',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">
                      Further Reading
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a
                          href="https://www.w3.org/WAI/WCAG21/quickref/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          WCAG 2.1 Quick Reference
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.w3.org/WAI/ARIA/apg/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          ARIA Authoring Practices Guide
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://webaim.org/resources/contrastchecker/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          WebAIM Contrast Checker
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Back to
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      All Components
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-accessibility"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      useAccessibility Hook
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
