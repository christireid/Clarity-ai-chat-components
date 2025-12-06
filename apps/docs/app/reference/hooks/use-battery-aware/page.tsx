import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useBatteryAware - Clarity Chat Components',
  description: 'Battery-aware optimizations for mobile devices with automatic performance adjustments.',
}

const configProps: Prop[] = [
  {
    name: 'batterySaverThreshold',
    type: 'number',
    description: 'Battery level threshold for enabling battery saver (0-1, default: 0.2)',
  },
  {
    name: 'optimizations',
    type: 'object',
    description: 'Optimizations to apply when battery is low',
  },
  {
    name: 'autoOptimize',
    type: 'boolean',
    description: 'Enable automatic optimizations (default: true)',
  },
  {
    name: 'thresholds',
    type: 'object',
    description: 'Custom battery level thresholds for different modes',
  },
]

export default function UseBatteryAwarePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useBatteryAware</h1>
        <p className="docs-lead">
          Battery-aware optimizations for mobile devices with automatic performance adjustments based on battery level.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Monitor battery status in real-time',
          'Configure battery saver thresholds',
          'Enable automatic optimizations',
          'Get optimization recommendations',
          'Handle battery status changes',
        ]}
      />

      <Callout type="warning">
        <p>
          <strong>Browser Support:</strong> The Battery API is experimental and not available in all browsers. The hook includes fallback behavior for unsupported browsers.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Monitor battery status and get optimization recommendations:
        </p>
        <CodePlayground
          initialCode={`import { useBatteryAware } from '@clarity-chat/react'

function BatteryOptimized() {
  const {
    batteryStatus,
    recommendations,
    isBatterySaverActive,
  } = useBatteryAware()

  return (
    <div>
      <div>Battery: {(batteryStatus.level * 100).toFixed(0)}%</div>
      <div>Charging: {batteryStatus.charging ? 'Yes' : 'No'}</div>
      {isBatterySaverActive && (
        <div>Battery saver mode active</div>
      )}
      {recommendations.disableAnimations && (
        <div>Animations disabled</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Configuration</h2>
        <p>
          Configure battery saver thresholds and optimizations:
        </p>
        <CodePlayground
          initialCode={`import { useBatteryAware } from '@clarity-chat/react'

function CustomConfig() {
  const { recommendations, batteryStatus } = useBatteryAware({
    batterySaverThreshold: 0.15,  // 15% threshold
    optimizations: {
      reduceAnimations: true,
      throttleUpdates: true,
      deferNonCritical: true,
      reduceStreamingQuality: true,
    },
    autoOptimize: true,
    thresholds: {
      critical: 0.05,  // 5%
      low: 0.15,       // 15%
      medium: 0.40,    // 40%
    },
  })

  return (
    <div>
      {recommendations.level === 'aggressive' && (
        <div>Aggressive optimizations active</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Battery Status Monitoring</h2>
        <p>
          Monitor battery status changes:
        </p>
        <CodePlayground
          initialCode={`import { useBatteryAware } from '@clarity-chat/react'

function StatusMonitor() {
  const { batteryStatus } = useBatteryAware({
    onStatusChange: (status) => {
      if (status.level < 0.1) {
        console.warn('Battery critically low')
      }
      if (status.charging) {
        console.log('Device is charging')
      }
    },
  })

  return (
    <div>
      <div>Level: {(batteryStatus.level * 100).toFixed(0)}%</div>
      <div>Charging: {batteryStatus.charging ? 'Yes' : 'No'}</div>
      {batteryStatus.dischargingTime && (
        <div>Time remaining: {Math.floor(batteryStatus.dischargingTime / 60)} minutes</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Optimization Recommendations</h2>
        <p>
          Apply optimizations based on recommendations:
        </p>
        <CodePlayground
          initialCode={`import { useBatteryAware } from '@clarity-chat/react'

function ApplyOptimizations() {
  const { recommendations } = useBatteryAware()

  return (
    <ChatWindow
      messages={messages}
      // Disable animations if recommended
      enableAnimations={!recommendations.disableAnimations}
      // Throttle updates if recommended
      updateInterval={recommendations.throttleUpdates ? recommendations.updateInterval : undefined}
      // Defer non-critical features
      deferNonCritical={recommendations.deferNonCritical}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <PropsTable props={configProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li><code>batteryStatus</code>: Current battery status (level, charging, dischargingTime, etc.)</li>
          <li><code>recommendations</code>: Optimization recommendations (disableAnimations, throttleUpdates, etc.)</li>
          <li><code>isBatterySaverActive</code>: Whether battery saver mode is active</li>
          <li><code>optimizationLevel</code>: Current optimization level ('none' | 'minimal' | 'moderate' | 'aggressive')</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Optimization Levels</h2>
        <ul>
          <li><strong>none</strong>: No optimizations (battery > medium threshold)</li>
          <li><strong>minimal</strong>: Light optimizations (battery between medium and low)</li>
          <li><strong>moderate</strong>: Standard optimizations (battery between low and critical)</li>
          <li><strong>aggressive</strong>: Maximum optimizations (battery < critical threshold)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Enable <code>autoOptimize</code> for automatic battery-aware adjustments</li>
          <li>Set <code>batterySaverThreshold</code> based on your app's needs (typically 15-20%)</li>
          <li>Use <code>recommendations</code> to conditionally enable/disable features</li>
          <li>Respect <code>isBatterySaverActive</code> to show battery saver indicators</li>
          <li>Handle unsupported browsers gracefully (hook provides fallback)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/battery-indicator">BatteryIndicator</a> - Battery status display</li>
          <li><a href="/guides/mobile-optimization">Mobile Optimization Guide</a> - Mobile best practices</li>
        </ul>
      </section>
    </div>
  )
}
