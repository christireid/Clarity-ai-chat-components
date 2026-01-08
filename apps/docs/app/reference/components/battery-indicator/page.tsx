import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'BatteryIndicator - Clarity Chat Components',
  description:
    'Battery status indicator with optimization recommendations for mobile devices.',
}

const props: Prop[] = [
  {
    name: 'config',
    type: 'Partial<BatteryAwareConfig>',
    description: 'Battery-aware configuration',
  },
  {
    name: 'showTooltip',
    type: 'boolean',
    description: 'Show detailed tooltip on hover',
  },
  {
    name: 'position',
    type: '"top-left" | "top-right" | "bottom-left" | "bottom-right" | "inline"',
    description: 'Position of the indicator',
  },
  {
    name: 'showLabel',
    type: 'boolean',
    description: 'Show text label',
  },
  {
    name: 'compact',
    type: 'boolean',
    description: 'Compact mode (icon only)',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function BatteryIndicatorPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>BatteryIndicator</h1>
        <p className="docs-lead">
          Battery status indicator with optimization recommendations for 30-50%
          longer battery life on mobile devices.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Display battery status in your chat interface',
          'Configure battery-aware optimizations',
          'Show optimization recommendations',
          'Handle unsupported browsers gracefully',
          'Position the indicator in different locations',
        ]}
      />

      <Callout type="info" className="my-6">
        <p>
          <strong>New in 2025:</strong> This component provides battery-aware
          features that can extend battery life by 30-50% on mobile devices
          through automatic optimization.
        </p>
      </Callout>

      <Callout type="warning" className="my-6">
        <p>
          <strong>Browser Support:</strong> The Battery API is not available in
          all browsers. The component gracefully handles unsupported browsers by
          returning null.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display battery status with default configuration:</p>
        <CodePlayground
          code={`import { BatteryIndicator } from '@clarity-chat/react/internal'

function ChatWithBattery() {
  return (
    <div className="p-4">
      <BatteryIndicator
        position="top-right"
        showTooltip
        showLabel
      />
    </div>
  )
}

render(<ChatWithBattery />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Battery-Aware Configuration</h2>
        <p>Configure battery-aware optimizations:</p>
        <CodePlayground
          code={`import { BatteryIndicator, useBatteryAware } from '@clarity-chat/react/internal'

function OptimizedChat() {
  const { recommendations, shouldEnableBatterySaver } = useBatteryAware({
    batterySaverThreshold: 0.2,  // Enable saver at 20%
    autoOptimize: true,
  })

  return (
    <>
      <BatteryIndicator
        position="top-right"
        config={{
          batterySaverThreshold: 0.2,
          autoOptimize: true,
        }}
      />
      {/* Apply battery-aware optimizations */}
      <div>
        {recommendations.disableAnimations && (
          <p>Animations disabled to save battery</p>
        )}
        {recommendations.updateInterval && (
          <p>Update interval: {recommendations.updateInterval}ms</p>
        )}
      </div>
    </>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Position Options</h2>
        <p>Position the indicator in different locations:</p>
        <CodePlayground
          code={`import { BatteryIndicator } from '@clarity-chat/react/internal'

function PositionedIndicators() {
  return (
    <div className="relative h-screen">
      {/* Top-right corner */}
      <BatteryIndicator position="top-right" />
      
      {/* Top-left corner */}
      <BatteryIndicator position="top-left" />
      
      {/* Bottom-right corner */}
      <BatteryIndicator position="bottom-right" />
      
      {/* Inline with content */}
      <BatteryIndicator position="inline" />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Compact Mode</h2>
        <p>Use compact mode for minimal UI footprint:</p>
        <CodePlayground
          code={`import { BatteryIndicator } from '@clarity-chat/react/internal'

function CompactIndicator() {
  return (
    <BatteryIndicator
      position="top-right"
      compact={true}  // Icon only, no label
      showTooltip={true}  // Show details on hover
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Recommendations</h2>
        <p>Display optimization recommendations:</p>
        <CodePlayground
          code={`import { BatteryIndicator, useBatteryAware } from '@clarity-chat/react/internal'

function ChatWithRecommendations() {
  const { recommendations, batteryStatus, shouldEnableBatterySaver } = useBatteryAware({
    batterySaverThreshold: 0.2,
  })

  return (
    <>
      <BatteryIndicator
        position="top-right"
        showTooltip
        config={{ batterySaverThreshold: 0.2 }}
      />
      {shouldEnableBatterySaver && (
        <div className="p-2 bg-yellow-100 rounded">
          Battery saver: Animations disabled
        </div>
      )}
      {recommendations.disableAnimations && (
        <p>Animations are currently disabled</p>
      )}
    </>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <ul>
          <li>
            <strong>batterySaverThreshold</strong>: <code>number</code> -
            Battery level (0-1) to enable saver mode
          </li>
          <li>
            <strong>autoOptimize</strong>: <code>boolean</code> - Automatically
            apply optimizations
          </li>
          <li>
            <strong>updateInterval</strong>: <code>number</code> - Update
            interval in milliseconds
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>top-right</code> or <code>top-left</code> for
            non-intrusive placement
          </li>
          <li>
            Enable <code>showTooltip</code> for detailed information on hover
          </li>
          <li>
            Use <code>compact</code> mode for minimal UI footprint
          </li>
          <li>
            Configure <code>batterySaverThreshold</code> based on your app's
            needs
          </li>
          <li>
            Handle unsupported browsers gracefully (component returns null)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Browser Support</h2>
        <p>The Battery API is supported in:</p>
        <ul>
          <li>Chrome/Edge (Android)</li>
          <li>Firefox (Android)</li>
          <li>Safari (iOS) - Limited support</li>
        </ul>
        <p>
          The component gracefully handles unsupported browsers by returning
          null.
        </p>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-battery-aware">useBatteryAware</a> -
            Battery-aware hook
          </li>
          <li>
            <a href="/guides/mobile">Mobile Guide</a> - Mobile optimization
            strategies
          </li>
          <li>
            <a href="/reference/components/mobile-chat-optimized">
              MobileChatWindow
            </a>{' '}
            - Mobile-optimized chat
          </li>
        </ul>
      </section>
    </div>
  )
}
