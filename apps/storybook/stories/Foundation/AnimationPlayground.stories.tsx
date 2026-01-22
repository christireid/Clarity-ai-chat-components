import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
// Animation components are internal - import from internal exports
import {
  FeedbackAnimation,
  SuccessCheckmark,
  ErrorShake,
  PulseAttention,
  RippleEffect,
  ConfettiEffect,
  GlowEffect,
  BounceIn,
  SlideNotification,
  AnimatedList,
  AnimatedListItem,
  FadePresence,
  SlidePresence,
  ScalePresence,
  StaggerContainer,
  AnimatedGrid,
} from '@clarity-chat/react/internal'
import { useReducedMotion } from '@clarity-chat/primitives'

/**
 * Interactive playground for exploring all Clarity animation components.
 *
 * **Accessibility Features:**
 * - All animations respect `prefers-reduced-motion`
 * - Use the "Reduce Motion" toggle in the toolbar to test accessibility
 * - When reduced motion is enabled, animations use opacity-only transitions or are disabled
 *
 * **WCAG 2.3.3 Compliance:**
 * Motion from Animation - All animations can be disabled through system preferences.
 */
const meta: Meta = {
  title: 'Foundation/Animation Playground',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive showcase of all animation components with accessibility testing. Toggle "Reduce Motion" in the toolbar to see how components behave for users who prefer reduced motion.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

/**
 * Reduced Motion Indicator - Shows current motion preference
 */
function MotionIndicator() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={`mb-6 p-4 rounded-lg border-2 ${
        prefersReducedMotion
          ? 'bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700'
          : 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            prefersReducedMotion ? 'bg-amber-500' : 'bg-green-500'
          }`}
        />
        <span className="font-medium">
          {prefersReducedMotion
            ? 'Reduced Motion Mode Active'
            : 'Full Motion Enabled'}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {prefersReducedMotion
          ? 'Animations are simplified to opacity-only transitions or disabled entirely.'
          : 'All animations are running with full motion effects.'}
      </p>
    </div>
  )
}

/**
 * Complete Animation Showcase - All components in one view
 */
export const Playground: Story = {
  render: () => {
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackType, setFeedbackType] = useState<
      'success' | 'error' | 'warning' | 'info'
    >('success')
    const [showCheckmark, setShowCheckmark] = useState(false)
    const [triggerShake, setTriggerShake] = useState(false)
    const [pulseActive, setPulseActive] = useState(false)
    const [triggerRipple, setTriggerRipple] = useState(false)
    const [triggerConfetti, setTriggerConfetti] = useState(false)
    const [glowActive, setGlowActive] = useState(false)
    const [showBounce, setShowBounce] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [showPresence, setShowPresence] = useState(true)
    const [presenceVariant, setPresenceVariant] = useState<
      'fade' | 'slide' | 'scale'
    >('fade')

    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Animation Playground</h1>
          <p className="text-muted-foreground">
            Interactive demo of all Clarity animation components. Use the
            &quot;Reduce Motion&quot; toggle in the toolbar to test
            accessibility.
          </p>
        </div>

        <MotionIndicator />

        {/* Feedback Animations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Feedback Animations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['success', 'error', 'warning', 'info'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFeedbackType(type)
                  setShowFeedback(true)
                  setTimeout(() => setShowFeedback(false), 2000)
                }}
                className={`p-4 rounded-lg border-2 hover:shadow-md transition-shadow capitalize ${
                  feedbackType === type && showFeedback
                    ? 'ring-2 ring-offset-2 ring-brand-500'
                    : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <FeedbackAnimation
            type={feedbackType}
            show={showFeedback}
            message={`${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)} feedback!`}
          />
        </section>

        {/* Icon Animations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Icon Animations
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <div className="h-16 w-16 flex items-center justify-center">
                <SuccessCheckmark show={showCheckmark} size={48} />
              </div>
              <button
                onClick={() => {
                  setShowCheckmark(true)
                  setTimeout(() => setShowCheckmark(false), 2000)
                }}
                className="text-sm px-3 py-1 bg-success text-white rounded"
              >
                Show Checkmark
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <ErrorShake trigger={triggerShake}>
                <div className="h-16 w-16 flex items-center justify-center bg-destructive/20 rounded-lg">
                  <span className="text-2xl">❌</span>
                </div>
              </ErrorShake>
              <button
                onClick={() => {
                  setTriggerShake(true)
                  setTimeout(() => setTriggerShake(false), 500)
                }}
                className="text-sm px-3 py-1 bg-destructive text-white rounded"
              >
                Trigger Shake
              </button>
            </div>
          </div>
        </section>

        {/* Effect Animations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Effect Animations
          </h2>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <PulseAttention active={pulseActive}>
                <div className="h-16 w-16 flex items-center justify-center bg-primary/20 rounded-lg">
                  <span className="text-2xl">💡</span>
                </div>
              </PulseAttention>
              <button
                onClick={() => setPulseActive(!pulseActive)}
                className={`text-sm px-3 py-1 rounded ${
                  pulseActive
                    ? 'bg-gray-500 text-white'
                    : 'bg-primary text-white'
                }`}
              >
                {pulseActive ? 'Stop Pulse' : 'Start Pulse'}
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <RippleEffect
                trigger={triggerRipple}
                color="rgba(59, 130, 246, 0.5)"
              >
                <div
                  className="h-16 w-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-lg cursor-pointer"
                  onClick={() => {
                    setTriggerRipple(true)
                    setTimeout(() => setTriggerRipple(false), 100)
                  }}
                >
                  <span className="text-2xl">💧</span>
                </div>
              </RippleEffect>
              <span className="text-sm text-muted-foreground">
                Click to ripple
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <GlowEffect active={glowActive} color="rgba(168, 85, 247, 0.4)">
                <div className="h-16 w-16 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-2xl">✨</span>
                </div>
              </GlowEffect>
              <button
                onClick={() => setGlowActive(!glowActive)}
                className={`text-sm px-3 py-1 rounded ${
                  glowActive
                    ? 'bg-gray-500 text-white'
                    : 'bg-purple-500 text-white'
                }`}
              >
                {glowActive ? 'Stop Glow' : 'Start Glow'}
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg relative overflow-hidden">
              <ConfettiEffect trigger={triggerConfetti} count={20} />
              <div className="h-16 w-16 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <span className="text-2xl">🎉</span>
              </div>
              <button
                onClick={() => {
                  setTriggerConfetti(true)
                  setTimeout(() => setTriggerConfetti(false), 100)
                }}
                className="text-sm px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Celebrate!
              </button>
            </div>
          </div>
        </section>

        {/* Presence Animations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Presence Animations
          </h2>

          <div className="flex flex-wrap gap-4 items-start">
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex gap-2 mb-2">
                {(['fade', 'slide', 'scale'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setPresenceVariant(v)}
                    className={`text-xs px-2 py-1 rounded capitalize ${
                      presenceVariant === v
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="h-24 w-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                {presenceVariant === 'fade' && (
                  <FadePresence>
                    {showPresence && (
                      <div className="p-4 bg-primary/20 rounded">Fade</div>
                    )}
                  </FadePresence>
                )}
                {presenceVariant === 'slide' && (
                  <SlidePresence direction="up" distance={20}>
                    {showPresence && (
                      <div className="p-4 bg-primary/20 rounded">Slide</div>
                    )}
                  </SlidePresence>
                )}
                {presenceVariant === 'scale' && (
                  <ScalePresence initialScale={0.8}>
                    {showPresence && (
                      <div className="p-4 bg-primary/20 rounded">Scale</div>
                    )}
                  </ScalePresence>
                )}
              </div>

              <button
                onClick={() => setShowPresence(!showPresence)}
                className="text-sm px-3 py-1 bg-primary text-white rounded"
              >
                {showPresence ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <span className="text-sm font-medium">BounceIn</span>
              <div className="h-24 w-48 border-2 border-dashed rounded-lg flex items-center justify-center">
                <BounceIn show={showBounce}>
                  <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded text-2xl">
                    🎈
                  </div>
                </BounceIn>
              </div>
              <button
                onClick={() => setShowBounce(!showBounce)}
                className="text-sm px-3 py-1 bg-green-500 text-white rounded"
              >
                {showBounce ? 'Hide' : 'Bounce In'}
              </button>
            </div>
          </div>
        </section>

        {/* Slide Notification */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Slide Notification
          </h2>

          <button
            onClick={() => {
              setShowNotification(true)
              setTimeout(() => setShowNotification(false), 3000)
            }}
            className="px-4 py-2 bg-info text-white rounded"
          >
            Show Notification
          </button>

          <SlideNotification
            show={showNotification}
            message="This notification slides in and respects reduced motion!"
            type="info"
            position="top"
          />
        </section>

        {/* List Animations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            List & Grid Animations
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">AnimatedList</h3>
              <AnimatedList className="space-y-2">
                {['Item 1', 'Item 2', 'Item 3'].map((item) => (
                  <AnimatedListItem key={item}>
                    <div className="p-3 bg-muted rounded">{item}</div>
                  </AnimatedListItem>
                ))}
              </AnimatedList>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">StaggerContainer</h3>
              <StaggerContainer className="space-y-2">
                {['Stagger 1', 'Stagger 2', 'Stagger 3'].map((item) => (
                  <div key={item} className="p-3 bg-muted rounded">
                    {item}
                  </div>
                ))}
              </StaggerContainer>
            </div>

            <div className="space-y-2 md:col-span-2">
              <h3 className="text-sm font-medium">AnimatedGrid</h3>
              <AnimatedGrid columns={4} gap={4}>
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center"
                  >
                    {i + 1}
                  </div>
                ))}
              </AnimatedGrid>
            </div>
          </div>
        </section>
      </div>
    )
  },
}

/**
 * Side-by-side comparison of motion enabled vs. reduced motion
 */
export const MotionComparison: Story = {
  render: () => {
    const prefersReducedMotion = useReducedMotion()
    const [trigger, setTrigger] = useState(false)

    const triggerAll = () => {
      setTrigger(true)
      setTimeout(() => setTrigger(false), 100)
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Motion Comparison</h1>
          <p className="text-muted-foreground">
            Toggle &quot;Reduce Motion&quot; in the toolbar to see how each
            component adapts.
          </p>
        </div>

        <MotionIndicator />

        <button
          onClick={triggerAll}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium"
        >
          Trigger All Animations
        </button>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-medium mb-4">SuccessCheckmark</h3>
            <div className="h-20 flex items-center justify-center">
              <SuccessCheckmark show={trigger} size={48} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {prefersReducedMotion ? 'Fade only' : 'Scale + Rotate'}
            </p>
          </div>

          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-medium mb-4">BounceIn</h3>
            <div className="h-20 flex items-center justify-center">
              <BounceIn show={trigger}>
                <div className="p-3 bg-primary/20 rounded">Content</div>
              </BounceIn>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {prefersReducedMotion ? 'Fade only' : 'Bounce scale'}
            </p>
          </div>

          <div className="p-4 border rounded-lg text-center">
            <h3 className="font-medium mb-4">ConfettiEffect</h3>
            <div className="h-20 flex items-center justify-center relative overflow-hidden">
              <ConfettiEffect trigger={trigger} count={15} />
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {prefersReducedMotion ? 'No particles' : 'Full confetti'}
            </p>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Documentation of accessibility behavior for each component
 */
export const AccessibilityReference: Story = {
  render: () => {
    const prefersReducedMotion = useReducedMotion()

    const components = [
      {
        name: 'FeedbackAnimation',
        fullMotion: 'Scale + Opacity transition',
        reducedMotion: 'Opacity only',
      },
      {
        name: 'SuccessCheckmark',
        fullMotion: 'Scale + Rotate animation',
        reducedMotion: 'Opacity fade in',
      },
      {
        name: 'ErrorShake',
        fullMotion: 'Horizontal shake animation',
        reducedMotion: 'No animation (static)',
      },
      {
        name: 'PulseAttention',
        fullMotion: 'Continuous scale + opacity pulse',
        reducedMotion: 'No animation (static)',
      },
      {
        name: 'RippleEffect',
        fullMotion: 'Expanding scale animation',
        reducedMotion: 'Opacity fade only',
      },
      {
        name: 'ConfettiEffect',
        fullMotion: 'Particle physics animation',
        reducedMotion: 'Not rendered (returns null)',
      },
      {
        name: 'GlowEffect',
        fullMotion: 'Pulsing box-shadow',
        reducedMotion: 'No animation (static)',
      },
      {
        name: 'BounceIn',
        fullMotion: 'Multi-step bounce scale',
        reducedMotion: 'Opacity fade only',
      },
      {
        name: 'SlideNotification',
        fullMotion: 'Y-axis slide + opacity',
        reducedMotion: 'Opacity fade only (y=0)',
      },
      {
        name: 'AnimatedList/Grid',
        fullMotion: 'Stagger animation with variants',
        reducedMotion: 'Static div (no motion)',
      },
      {
        name: 'SlidePresence',
        fullMotion: 'X/Y slide + opacity',
        reducedMotion: 'Opacity only',
      },
      {
        name: 'ScalePresence',
        fullMotion: 'Scale + opacity',
        reducedMotion: 'Opacity only',
      },
    ]

    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Accessibility Behavior Reference
          </h1>
          <p className="text-muted-foreground">
            How each animation component adapts for users who prefer reduced
            motion (WCAG 2.3.3).
          </p>
        </div>

        <MotionIndicator />

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Component</th>
                <th className="text-left p-3 font-medium">Full Motion</th>
                <th className="text-left p-3 font-medium">Reduced Motion</th>
              </tr>
            </thead>
            <tbody>
              {components.map((comp, i) => (
                <tr
                  key={comp.name}
                  className={i % 2 === 0 ? 'bg-background' : 'bg-muted/50'}
                >
                  <td className="p-3 font-mono text-sm">{comp.name}</td>
                  <td
                    className={`p-3 text-sm ${!prefersReducedMotion ? 'font-medium text-primary' : ''}`}
                  >
                    {comp.fullMotion}
                  </td>
                  <td
                    className={`p-3 text-sm ${prefersReducedMotion ? 'font-medium text-primary' : ''}`}
                  >
                    {comp.reducedMotion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium mb-2">WCAG 2.3.3 Compliance</h3>
          <p className="text-sm text-muted-foreground">
            All animations in Clarity Chat respect the{' '}
            <code className="px-1 bg-muted rounded">
              prefers-reduced-motion
            </code>{' '}
            media query. When users have this preference enabled, animations
            either use simple opacity transitions or are disabled entirely,
            ensuring the interface remains accessible to users with vestibular
            disorders or motion sensitivity.
          </p>
        </div>
      </div>
    )
  },
}
