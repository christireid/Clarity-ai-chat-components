/**
 * ROI Calculator Examples
 *
 * Examples showing how to track and visualize cost savings from
 * token optimization.
 */

import React, { useState, useCallback } from 'react'
import {
  useROICalculator,
  useQuickROI,
  useMonthlySavings,
  useModelComparison,
  useBreakEven,
  useROIDashboard,
  calculateQuickROI,
  estimateMonthlySavings,
  type UsageStats,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Example 1: Basic ROI Tracking
// ============================================================================

export function BasicROITracking() {
  const {
    trackUsage,
    currentROI,
    totalROI,
    periods,
  } = useROICalculator({
    model: 'gpt-4o',
    implementationCost: 5000,
  })

  const handleRequest = useCallback(() => {
    // Track each request
    trackUsage({
      inputTokensBaseline: 1000,      // Original tokens
      inputTokensOptimized: 300,      // After compression/optimization
      cachedInputTokens: 240,          // 80% cache hit rate
      outputTokens: 500,
      requestCount: 1,
    })
  }, [trackUsage])

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Basic ROI Tracking</h2>

      <button onClick={handleRequest}>Simulate Request</button>

      {currentROI && (
        <div style={{ marginTop: '20px' }}>
          <h3>Current Period ROI</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Baseline Cost
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ${currentROI.baselineCost.toFixed(4)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Actual Cost
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ${currentROI.actualCost.toFixed(4)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  <strong>Total Savings</strong>
                </td>
                <td
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                    color: '#28a745',
                    fontWeight: 'bold',
                  }}
                >
                  ${currentROI.totalSavings.toFixed(4)} (
                  {currentROI.savingsPercentage.toFixed(1)}%)
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ROI
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {currentROI.roi === Infinity
                    ? '∞'
                    : `${currentROI.roi.toFixed(2)}x`}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Payback Period
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {currentROI.paybackPeriodDays === Infinity
                    ? 'Immediate'
                    : `${Math.ceil(currentROI.paybackPeriodDays)} days`}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  Projected Annual Savings
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  ${currentROI.projectedAnnualSavings.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {periods.length > 0 && totalROI && (
        <div style={{ marginTop: '30px' }}>
          <h3>Total ROI ({periods.length} periods)</h3>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#d4edda',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
            }}
          >
            <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold' }}>
              ${totalROI.totalSavings.toFixed(2)} saved
            </p>
            <p style={{ margin: '5px 0' }}>
              {totalROI.savingsPercentage.toFixed(1)}% reduction
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 2: Savings Breakdown
// ============================================================================

export function SavingsBreakdown() {
  const { trackUsage, currentROI } = useROICalculator({
    model: 'gpt-4o',
  })

  const handleSimulate = () => {
    trackUsage({
      inputTokensBaseline: 10000,
      inputTokensOptimized: 3000,
      cachedInputTokens: 2400,
      outputTokens: 5000,
      requestCount: 10,
      imageCount: 5,
      functionCallCount: 3,
    })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Savings Breakdown</h2>

      <button onClick={handleSimulate}>Simulate Usage</button>

      {currentROI && (
        <div style={{ marginTop: '20px' }}>
          <h3>Savings by Optimization Type</h3>

          {Object.entries(currentROI.savingsBreakdown).map(([key, value]) => {
            const percentage =
              (value / currentROI.totalSavings) * 100 || 0

            return (
              <div
                key={key}
                style={{
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}
                >
                  <span>
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                  <span>
                    ${value.toFixed(4)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '20px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: '#007bff',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}

          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <strong>Total Savings: ${currentROI.totalSavings.toFixed(4)}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Example 3: Monthly Savings Estimator
// ============================================================================

export function MonthlySavingsEstimator() {
  const [dailyRequests, setDailyRequests] = useState(1000)
  const [avgTokens, setAvgTokens] = useState(500)
  const [optimization, setOptimization] = useState(70)
  const [cacheHitRate, setCacheHitRate] = useState(80)

  const estimate = useMonthlySavings({
    dailyRequests,
    avgTokensPerRequest: avgTokens,
    optimizationPercentage: optimization,
    cacheHitRate: cacheHitRate / 100,
    model: 'gpt-4o',
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Monthly Savings Estimator</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Daily Requests: {dailyRequests.toLocaleString()}
            <br />
            <input
              type="range"
              min="100"
              max="100000"
              step="100"
              value={dailyRequests}
              onChange={(e) => setDailyRequests(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Avg Tokens/Request: {avgTokens}
            <br />
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={avgTokens}
              onChange={(e) => setAvgTokens(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Optimization: {optimization}%
            <br />
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={optimization}
              onChange={(e) => setOptimization(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Cache Hit Rate: {cacheHitRate}%
            <br />
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#856404', marginBottom: '10px' }}>
            Baseline Cost/Month
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
            ${estimate.baselineMonthlyCost.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#155724', marginBottom: '10px' }}>
            Optimized Cost/Month
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#155724' }}>
            ${estimate.optimizedMonthlyCost.toFixed(2)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#d1ecf1',
          border: '2px solid #17a2b8',
          borderRadius: '8px',
        }}
      >
        <div style={{ fontSize: '16px', color: '#0c5460', marginBottom: '10px' }}>
          <strong>Monthly Savings</strong>
        </div>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0c5460' }}>
          ${estimate.monthlySavings.toFixed(2)}
        </div>
        <div style={{ fontSize: '14px', color: '#0c5460', marginTop: '5px' }}>
          {estimate.savingsPercentage.toFixed(1)}% reduction
        </div>
        <div style={{ fontSize: '14px', color: '#0c5460', marginTop: '10px' }}>
          Annual: ${(estimate.monthlySavings * 12).toFixed(2)}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Example 4: Model Comparison
// ============================================================================

export function ModelComparisonExample() {
  const usage: UsageStats = {
    inputTokensBaseline: 10000,
    inputTokensOptimized: 3000,
    cachedInputTokens: 2400,
    outputTokens: 5000,
    requestCount: 10,
    imageCount: 0,
    functionCallCount: 0,
  }

  const comparison = useModelComparison({
    usage,
    models: [
      'gpt-4o',
      'gpt-4o-mini',
      'claude-3-5-sonnet',
      'claude-3-5-haiku',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ],
  })

  // Sort by actual cost
  const sorted = [...comparison].sort(
    (a, b) => a.roi.actualCost - b.roi.actualCost
  )

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Model Cost Comparison</h2>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th
              style={{
                padding: '8px',
                borderBottom: '2px solid #ddd',
                textAlign: 'left',
              }}
            >
              Model
            </th>
            <th
              style={{
                padding: '8px',
                borderBottom: '2px solid #ddd',
                textAlign: 'right',
              }}
            >
              Baseline
            </th>
            <th
              style={{
                padding: '8px',
                borderBottom: '2px solid #ddd',
                textAlign: 'right',
              }}
            >
              Optimized
            </th>
            <th
              style={{
                padding: '8px',
                borderBottom: '2px solid #ddd',
                textAlign: 'right',
              }}
            >
              Savings
            </th>
            <th
              style={{
                padding: '8px',
                borderBottom: '2px solid #ddd',
                textAlign: 'right',
              }}
            >
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ model, roi }, index) => (
            <tr
              key={model}
              style={{
                backgroundColor: index === 0 ? '#d4edda' : 'transparent',
              }}
            >
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                {model}
                {index === 0 && ' 🏆'}
              </td>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'right',
                }}
              >
                ${roi.baselineCost.toFixed(4)}
              </td>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'right',
                }}
              >
                ${roi.actualCost.toFixed(4)}
              </td>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'right',
                  color: '#28a745',
                  fontWeight: 'bold',
                }}
              >
                ${roi.totalSavings.toFixed(4)}
              </td>
              <td
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #ddd',
                  textAlign: 'right',
                }}
              >
                {roi.savingsPercentage.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Best value:</strong> {sorted[0].model} saves $
          {sorted[0].roi.totalSavings.toFixed(4)} per request
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 5: Break-Even Calculator
// ============================================================================

export function BreakEvenCalculator() {
  const [implementationCost, setImplementationCost] = useState(5000)
  const [dailyRequests, setDailyRequests] = useState(10000)

  const breakEven = useBreakEven({
    implementationCost,
    dailyRequests,
    avgTokensPerRequest: 500,
    optimizationPercentage: 70,
    model: 'gpt-4o',
  })

  const monthsToBreakEven = breakEven.daysToBreakEven / 30

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Break-Even Calculator</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Implementation Cost: ${implementationCost.toLocaleString()}
            <br />
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={implementationCost}
              onChange={(e) => setImplementationCost(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            Daily Requests: {dailyRequests.toLocaleString()}
            <br />
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={dailyRequests}
              onChange={(e) => setDailyRequests(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            border: '2px solid #007bff',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Daily Savings
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
            ${breakEven.dailySavings.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            border: '2px solid #28a745',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Days to Break Even
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
            {breakEven.daysToBreakEven === Infinity
              ? 'Never'
              : Math.ceil(breakEven.daysToBreakEven)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Break-Even Timeline</h3>
        <p>
          <strong>Break-even date:</strong>{' '}
          {breakEven.breakEvenDate.toLocaleDateString()}
        </p>
        <p>
          <strong>Time to break even:</strong>{' '}
          {breakEven.daysToBreakEven === Infinity
            ? 'Never (no requests)'
            : monthsToBreakEven < 1
            ? `${Math.ceil(breakEven.daysToBreakEven)} days`
            : `${monthsToBreakEven.toFixed(1)} months`}
        </p>
        <p>
          <strong>First year savings:</strong> $
          {(breakEven.dailySavings * 365 - implementationCost).toFixed(2)}
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Example 6: Comprehensive ROI Dashboard
// ============================================================================

export function ComprehensiveROIDashboard() {
  const dashboard = useROIDashboard({
    model: 'gpt-4o',
    implementationCost: 5000,
    dailyRequests: 10000,
    avgTokensPerRequest: 500,
    optimizationPercentage: 70,
    cacheHitRate: 0.8,
  })

  const handleSimulate = () => {
    dashboard.trackUsage({
      inputTokensBaseline: 5000000,
      inputTokensOptimized: 1500000,
      cachedInputTokens: 1200000,
      outputTokens: 2500000,
      requestCount: 10000,
      imageCount: 500,
      functionCallCount: 2000,
    })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Comprehensive ROI Dashboard</h2>

      <button onClick={handleSimulate}>Simulate Day of Usage</button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          marginTop: '20px',
        }}
      >
        <MetricCard
          title="Monthly Savings"
          value={`$${dashboard.monthlySavings.monthlySavings.toFixed(2)}`}
          color="#28a745"
        />
        <MetricCard
          title="Days to Break Even"
          value={
            dashboard.breakEven.daysToBreakEven === Infinity
              ? '∞'
              : Math.ceil(dashboard.breakEven.daysToBreakEven).toString()
          }
          color="#007bff"
        />
        <MetricCard
          title="Avg Daily Savings"
          value={`$${dashboard.averageDailySavings.toFixed(2)}`}
          color="#17a2b8"
        />
      </div>

      {dashboard.currentROI && (
        <div style={{ marginTop: '30px' }}>
          <h3>Current Period</h3>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}
          >
            <p>
              <strong>Savings:</strong> ${dashboard.currentROI.totalSavings.toFixed(2)}{' '}
              ({dashboard.currentROI.savingsPercentage.toFixed(1)}%)
            </p>
            <p>
              <strong>ROI:</strong>{' '}
              {dashboard.currentROI.roi === Infinity
                ? '∞'
                : `${dashboard.currentROI.roi.toFixed(2)}x`}
            </p>
            <p>
              <strong>Projected Annual:</strong> $
              {dashboard.currentROI.projectedAnnualSavings.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: string
}) {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        border: `2px solid ${color}`,
        borderRadius: '8px',
      }}
    >
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color }}>{value}</div>
    </div>
  )
}

// ============================================================================
// Main Demo App
// ============================================================================

export function ROICalculatorDemo() {
  const [activeExample, setActiveExample] = useState<number>(1)

  const examples = [
    { id: 1, name: 'Basic Tracking', component: <BasicROITracking /> },
    { id: 2, name: 'Savings Breakdown', component: <SavingsBreakdown /> },
    { id: 3, name: 'Monthly Estimator', component: <MonthlySavingsEstimator /> },
    { id: 4, name: 'Model Comparison', component: <ModelComparisonExample /> },
    { id: 5, name: 'Break-Even', component: <BreakEvenCalculator /> },
    { id: 6, name: 'Full Dashboard', component: <ComprehensiveROIDashboard /> },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <h1 style={{ margin: 0 }}>ROI Calculator Examples</h1>
        <p style={{ margin: '10px 0 0 0', color: '#6c757d' }}>
          Track and visualize cost savings from token optimization
        </p>
      </div>

      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '250px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #dee2e6',
            minHeight: 'calc(100vh - 100px)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Examples</h3>
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                backgroundColor: activeExample === example.id ? '#007bff' : '#fff',
                color: activeExample === example.id ? '#fff' : '#000',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {example.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {examples.find((e) => e.id === activeExample)?.component}
        </div>
      </div>
    </div>
  )
}

export default ROICalculatorDemo
