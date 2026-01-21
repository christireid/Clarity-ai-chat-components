import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useMobileOptimization - Clarity Chat Components',
  description:
    'Hook for mobile-specific optimizations including viewport handling, keyboard detection, scroll locking, and haptic feedback.',
}

export default function UseMobileOptimizationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useMobileOptimization</h1>
        <p className="docs-lead">
          Hook for mobile-specific optimizations including viewport handling,
          keyboard detection, scroll locking, haptic feedback, and orientation
          detection.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Detect mobile devices',
          'Handle viewport and keyboard',
          'Lock/unlock scroll',
          'Trigger haptic feedback',
          'Detect device orientation',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Get mobile optimization utilities:</p>
        <CodePlayground
          initialCode={`import { useMobileOptimization } from '@clarity-chat/react'

function MobileChat() {
  const {
    isMobile,
    viewportHeight,
    keyboardHeight,
    isKeyboardVisible,
    lockScroll,
    unlockScroll,
    triggerHaptic,
    isPortrait,
    isLandscape,
  } = useMobileOptimization()

  React.useEffect(() => {
    if (isKeyboardVisible) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }, [isKeyboardVisible])

  return (
    <div style={{ height: viewportHeight }}>
      {isMobile && <div>Mobile view</div>}
      {isKeyboardVisible && <div>Keyboard visible: {keyboardHeight}px</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Haptic Feedback</h2>
        <p>Trigger haptic feedback for better mobile UX:</p>
        <CodePlayground
          initialCode={`import { useMobileOptimization } from '@clarity-chat/react'

function WithHaptics() {
  const { triggerHaptic } = useMobileOptimization()

  return (
    <button
      onClick={() => {
        triggerHaptic('medium') // light, medium, or heavy
      }}
    >
      Click for haptic feedback
    </button>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Scroll Locking</h2>
        <p>Lock scroll when keyboard is visible:</p>
        <CodePlayground
          initialCode={`import { useMobileOptimization } from '@clarity-chat/react'

function ScrollLocked() {
  const { isKeyboardVisible, lockScroll, unlockScroll } = useMobileOptimization()

  React.useEffect(() => {
    if (isKeyboardVisible) {
      lockScroll()
    } else {
      unlockScroll()
    }
  }, [isKeyboardVisible])

  return <div>Content</div>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Orientation Detection</h2>
        <p>Detect device orientation:</p>
        <CodePlayground
          initialCode={`import { useMobileOptimization } from '@clarity-chat/react'

function OrientationAware() {
  const { isPortrait, isLandscape } = useMobileOptimization()

  return (
    <div>
      {isPortrait && <div>Portrait mode - show compact view</div>}
      {isLandscape && <div>Landscape mode - show expanded view</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li>
            <code>isMobile</code>: Whether device is mobile
          </li>
          <li>
            <code>viewportHeight</code>: Current viewport height
          </li>
          <li>
            <code>keyboardHeight</code>: Estimated keyboard height
          </li>
          <li>
            <code>isKeyboardVisible</code>: Whether keyboard is visible
          </li>
          <li>
            <code>lockScroll</code>: Function to lock page scroll
          </li>
          <li>
            <code>unlockScroll</code>: Function to unlock page scroll
          </li>
          <li>
            <code>triggerHaptic</code>: Function to trigger haptic feedback
          </li>
          <li>
            <code>isPortrait</code>: Whether device is in portrait mode
          </li>
          <li>
            <code>isLandscape</code>: Whether device is in landscape mode
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>isMobile</code> to conditionally render mobile-optimized
            UI
          </li>
          <li>Lock scroll when keyboard is visible to prevent layout issues</li>
          <li>Use haptic feedback for important actions</li>
          <li>Adjust layout based on orientation</li>
          <li>Handle viewport height changes for better UX</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-mobile-keyboard">useMobileKeyboard</a>{' '}
            - Mobile keyboard detection
          </li>
          <li>
            <a href="/reference/hooks/use-battery-aware">useBatteryAware</a> -
            Battery-aware optimizations
          </li>
          <li>
            <a href="/guides/mobile-optimization">Mobile Optimization Guide</a>{' '}
            - Mobile best practices
          </li>
        </ul>
      </section>
    </div>
  )
}
