import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { useReducedMotion } from '@clarity-chat/react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * **useReducedMotion Hook**
 *
 * Detects if the user prefers reduced motion in their operating system settings.
 * This hook is essential for building accessible applications that respect user
 * preferences for motion sensitivity.
 *
 * **Key Features:**
 * - Automatic OS preference detection
 * - Real-time updates when preference changes
 * - SSR-safe implementation
 * - Zero configuration
 *
 * **Use Cases:**
 * - Disabling complex animations for motion-sensitive users
 * - Simplifying transitions for better accessibility
 * - Providing alternative visual feedback
 * - WCAG 2.1 compliance
 *
 * **Accessibility:**
 * Some users experience vestibular disorders, migraines, or other conditions
 * that make motion uncomfortable or even harmful. By respecting this preference,
 * you make your app accessible to everyone.
 */
const meta: Meta = {
  title: 'Hooks/Accessibility/UseReducedMotion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useReducedMotion\` hook detects if the user has enabled "reduce motion"
in their operating system settings. This is crucial for accessibility compliance.

## Why It Matters

According to WCAG 2.1 Success Criterion 2.3.3, websites should provide ways
to disable motion animations. Some users experience:

- **Vestibular disorders**: Motion can cause dizziness and nausea
- **Migraines**: Animations can trigger headaches
- **Attention disorders**: Motion can be distracting

## How to Test

1. **macOS**: System Preferences → Accessibility → Display → Reduce motion
2. **Windows**: Settings → Ease of Access → Display → Show animations
3. **iOS**: Settings → Accessibility → Motion → Reduce Motion
4. **Android**: Settings → Accessibility → Remove animations

## Basic Usage

\`\`\`tsx
import { useReducedMotion } from '@clarity-chat/react'

function MyComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ scale: prefersReducedMotion ? 1 : [1, 1.1, 1] }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
    >
      Content
    </motion.div>
  )
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic demo showing the hook's return value and OS preference detection.
 */
function BasicDemo() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Reduced Motion Detection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-muted">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Current Preference:
          </div>
          <div
            className={`text-lg font-bold ${
              prefersReducedMotion ? 'text-amber-600' : 'text-green-600'
            }`}
          >
            {prefersReducedMotion
              ? '⚠️ Reduced Motion Enabled'
              : '✓ Animations Allowed'}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            This value reflects your operating system's "reduce motion" setting.
          </p>
          <p className="mt-2">
            <strong>To test:</strong> Change your OS accessibility settings for
            reduced motion and watch this value update in real-time.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export const Basic: Story = {
  render: () => <BasicDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Shows the current reduced motion preference from the OS.',
      },
    },
  },
}

/**
 * Demo showing how animations adapt based on the preference.
 */
function AnimationComparisonDemo() {
  const prefersReducedMotion = useReducedMotion()
  const [isAnimating, setIsAnimating] = React.useState(false)

  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Animation Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 items-center">
            <Button onClick={triggerAnimation} disabled={isAnimating}>
              {isAnimating ? 'Animating...' : 'Trigger Animation'}
            </Button>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                prefersReducedMotion
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
              }`}
            >
              {prefersReducedMotion ? 'Reduced Motion' : 'Full Animations'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Full Animation Example */}
            <div className="space-y-2">
              <div className="text-sm font-medium">
                Without Hook (Always Animates)
              </div>
              <motion.div
                className="h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium"
                animate={
                  isAnimating
                    ? {
                        scale: [1, 1.1, 0.9, 1.1, 1],
                        rotate: [0, 10, -10, 10, 0],
                      }
                    : {}
                }
                transition={{ duration: durations.slower }}
              >
                Always Animates
              </motion.div>
            </div>

            {/* Accessible Animation Example */}
            <div className="space-y-2">
              <div className="text-sm font-medium">
                With Hook (Respects Preference)
              </div>
              <motion.div
                className="h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-medium"
                animate={
                  isAnimating && !prefersReducedMotion
                    ? {
                        scale: [1, 1.1, 0.9, 1.1, 1],
                        rotate: [0, 10, -10, 10, 0],
                      }
                    : {}
                }
                transition={{ duration: prefersReducedMotion ? 0 : 1 }}
              >
                {prefersReducedMotion ? 'Motion Reduced' : 'Animates'}
              </motion.div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
            <strong>Notice:</strong> The right box respects your OS preference.
            If you have reduced motion enabled, it won't animate.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const AnimationComparison: Story = {
  render: () => <AnimationComparisonDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Compares animated elements with and without reduced motion support.',
      },
    },
  },
}

/**
 * Demo showing practical patterns for handling reduced motion.
 */
function PatternsDemo() {
  const prefersReducedMotion = useReducedMotion()
  const [showNotification, setShowNotification] = React.useState(false)

  // Different animation variants based on preference
  const notificationVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: -20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
      }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Practical Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pattern 1: Conditional Transitions */}
          <div className="space-y-3">
            <h4 className="font-medium">Pattern 1: Adaptive Notifications</h4>
            <div className="flex gap-4 items-start">
              <Button onClick={() => setShowNotification(!showNotification)}>
                Toggle Notification
              </Button>
              <AnimatePresence>
                {showNotification && (
                  <motion.div
                    variants={notificationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg"
                  >
                    ✓ Success! Action completed.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="text-sm text-muted-foreground">
              {prefersReducedMotion
                ? 'Notification uses simple fade (reduced motion enabled)'
                : 'Notification uses slide + scale animation'}
            </p>
          </div>

          {/* Pattern 2: Looping Animations */}
          <div className="space-y-3">
            <h4 className="font-medium">Pattern 2: Loading Indicators</h4>
            <div className="flex gap-4 items-center">
              <motion.div
                className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                animate={
                  prefersReducedMotion
                    ? { opacity: [1, 0.5, 1] }
                    : { rotate: 360 }
                }
                transition={{
                  duration: prefersReducedMotion ? 1.5 : 1,
                  repeat: Infinity,
                  ease: prefersReducedMotion ? 'easeInOut' : 'linear',
                }}
              />
              <span className="text-sm text-muted-foreground">
                {prefersReducedMotion
                  ? 'Pulsing opacity instead of spinning'
                  : 'Standard spinning animation'}
              </span>
            </div>
          </div>

          {/* Pattern 3: Hover Effects */}
          <div className="space-y-3">
            <h4 className="font-medium">Pattern 3: Hover Effects</h4>
            <motion.button
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
              whileHover={
                prefersReducedMotion
                  ? { backgroundColor: 'hsl(var(--primary) / 0.9)' }
                  : { scale: 1.05, y: -2 }
              }
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            >
              Hover Me
            </motion.button>
            <p className="text-sm text-muted-foreground">
              {prefersReducedMotion
                ? 'Simple color change on hover'
                : 'Scale and lift effect on hover'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Patterns: Story = {
  render: () => <PatternsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates practical patterns for implementing reduced motion support.',
      },
    },
  },
}

/**
 * Code examples showing different implementation approaches.
 */
function CodeExamplesDemo() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg text-sm">
            <div className="font-medium mb-2">Current Status:</div>
            <code className="px-2 py-1 bg-background rounded">
              prefersReducedMotion = {String(prefersReducedMotion)}
            </code>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                1. Conditional Animation Props
              </h4>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-sm overflow-x-auto">
                {`const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={{ x: prefersReducedMotion ? 0 : 100 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. Variant-Based Approach</h4>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-sm overflow-x-auto">
                {`const variants = prefersReducedMotion
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : {
      hidden: { opacity: 0, y: 20, scale: 0.9 },
      visible: { opacity: 1, y: 0, scale: 1 }
    }

<motion.div variants={variants} initial="hidden" animate="visible" />`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. CSS Custom Properties</h4>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg text-sm overflow-x-auto">
                {`// Apply to root element
document.documentElement.style.setProperty(
  '--animation-duration',
  prefersReducedMotion ? '0s' : '0.3s'
)

// Use in CSS
.animated { transition: all var(--animation-duration); }`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const CodeExamples: Story = {
  render: () => <CodeExamplesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Shows different approaches to implementing reduced motion support.',
      },
    },
  },
}
