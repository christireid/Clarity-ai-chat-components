import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Mobile Optimization Guide - Clarity Chat Components',
  description: 'Optimize your chat application for mobile devices with battery awareness and performance optimizations.',
}

export default function MobileOptimizationGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Mobile Optimization Guide</h1>
        <p className="docs-lead">
          Learn how to optimize your chat application for mobile devices with battery awareness, performance optimizations, and responsive design.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Implement battery-aware optimizations',
          'Optimize for mobile performance',
          'Handle mobile keyboard interactions',
          'Implement responsive layouts',
          'Reduce animations and updates on low battery',
        ]}
      />

      <section className="docs-section">
        <h2>Battery-Aware Optimizations</h2>
        <p>
          Use the <code>useBatteryAware</code> hook to automatically optimize performance based on battery level:
        </p>
        <CodePlayground
          initialCode={`import { useBatteryAware } from '@clarity-chat/react'

function MobileChat() {
  const { recommendations, isBatterySaverActive } = useBatteryAware({
    batterySaverThreshold: 0.2,  // 20% threshold
    autoOptimize: true,
  })

  return (
    <ChatWindow
      messages={messages}
      enableAnimations={!recommendations.disableAnimations}
      updateInterval={recommendations.throttleUpdates ? recommendations.updateInterval : undefined}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Battery Indicator</h2>
        <p>
          Display battery status to users:
        </p>
        <CodePlayground
          initialCode={`import { BatteryIndicator } from '@clarity-chat/react'

function ChatWithBattery() {
  return (
    <div>
      <BatteryIndicator
        position="top-right"
        showRecommendations={true}
      />
      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Mobile Keyboard Handling</h2>
        <p>
          Use the <code>useMobileKeyboard</code> hook to handle mobile keyboard interactions:
        </p>
        <CodePlayground
          initialCode={`import { useMobileKeyboard } from '@clarity-chat/react'

function MobileInput() {
  const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard()

  return (
    <div style={{ paddingBottom: isKeyboardVisible ? keyboardHeight : 0 }}>
      <ChatInput />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Responsive Layout</h2>
        <p>
          Use responsive design patterns for mobile:
        </p>
        <CodePlayground
          initialCode={`import { useMediaQuery } from '@clarity-chat/react'

function ResponsiveChat() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <ChatWindow
      messages={messages}
      compact={isMobile}
      showAvatars={!isMobile}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Performance Optimizations</h2>
        <ul>
          <li>Disable animations on low battery</li>
          <li>Throttle updates when battery is low</li>
          <li>Defer non-critical features</li>
          <li>Reduce streaming quality on low battery</li>
          <li>Use virtualized lists for long message lists</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Enable battery-aware optimizations for mobile users</li>
          <li>Show battery status when appropriate</li>
          <li>Handle mobile keyboard visibility</li>
          <li>Use responsive layouts for different screen sizes</li>
          <li>Optimize animations and updates for mobile</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/hooks/use-battery-aware">useBatteryAware</a> - Battery monitoring hook</li>
          <li><a href="/reference/components/battery-indicator">BatteryIndicator</a> - Battery display component</li>
          <li><a href="/reference/hooks/use-mobile-keyboard">useMobileKeyboard</a> - Mobile keyboard handling</li>
        </ul>
      </section>
    </div>
  )
}
