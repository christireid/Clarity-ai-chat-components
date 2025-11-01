import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Usage Dashboard Component | Clarity Chat',
  description: 'Comprehensive dashboard for tracking credit balance, usage metrics, cost breakdown, and usage limits in Clarity Chat applications.',
  keywords: [
    'usage dashboard',
    'credit tracking',
    'usage metrics',
    'cost breakdown',
    'billing dashboard',
    'credit balance',
    'usage limits',
    'api usage',
    'token tracking',
    'storage metrics',
    'clarity chat',
    'react component',
  ],
}

export default function UsageDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Usage Dashboard</h1>
      <p className="text-xl text-muted-foreground mb-8">
        A comprehensive dashboard component for tracking credit balance, usage metrics, 
        cost breakdown, and usage limits with real-time updates and warnings.
      </p>

      {/* Overview Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="text-muted-foreground mb-4">
          The Usage Dashboard component provides a complete view of user resource consumption, 
          credit balance, and cost tracking. It displays real-time usage metrics across multiple 
          categories, warns when approaching limits, and offers credit management options including 
          auto-refill and manual purchases.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 mt-6">Key Features</h3>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Credit balance display with progress bar and percentage</li>
          <li>Six usage metric categories: messages, tokens, files, exports, storage, API calls</li>
          <li>Detailed cost breakdown with itemized billing by category</li>
          <li>Usage limit warnings at 80% threshold with visual indicators</li>
          <li>Auto-refill configuration with amount and threshold settings</li>
          <li>Quick stats summary showing total spent and time period</li>
          <li>Usage tips for optimizing credit consumption</li>
          <li>Smooth animations with Framer Motion for metric cards</li>
          <li>Responsive grid layout adapting to screen sizes</li>
          <li>Manual credit purchase button with callback support</li>
        </ul>
      </section>

      {/* Installation Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Installation</h2>
        <div className="bg-muted p-4 rounded-lg">
          <code className="text-sm">
            npm install @clarity-chat/react framer-motion
          </code>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          This component requires Framer Motion for animations.
        </p>
      </section>

      {/* Basic Usage Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { UsageDashboard } from '@clarity-chat/react'

function App() {
  const balance = {
    current: 750,
    total: 1000,
    autoRefill: {
      enabled: true,
      amount: 500,
      threshold: 200
    }
  }

  const stats = {
    messages: { used: 1250, limit: 5000 },
    tokens: { used: 2500000, limit: 10000000 },
    files: { used: 45, limit: 100 },
    exports: { used: 23, limit: 50 },
    storage: { used: 2.3, limit: 5.0 },
    apiCalls: { used: 890, limit: 2000 }
  }

  return (
    <UsageDashboard
      balance={balance}
      stats={stats}
      onPurchaseCredits={() => console.log('Purchase credits')}
    />
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Props API Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props API</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Prop</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Required</th>
                <th className="text-left p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">balance</td>
                <td className="p-2 font-mono text-sm">CreditBalance</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Credit balance information with current, total, and auto-refill settings</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">stats</td>
                <td className="p-2 font-mono text-sm">UsageStats</td>
                <td className="p-2">Yes</td>
                <td className="p-2">Usage statistics for messages, tokens, files, exports, storage, API calls</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">limits</td>
                <td className="p-2 font-mono text-sm">UsageLimit[]</td>
                <td className="p-2">No</td>
                <td className="p-2">Optional array of usage limits with warnings</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">onPurchaseCredits</td>
                <td className="p-2 font-mono text-sm">() =&gt; void</td>
                <td className="p-2">No</td>
                <td className="p-2">Callback when user clicks purchase credits button</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-sm">className</td>
                <td className="p-2 font-mono text-sm">string</td>
                <td className="p-2">No</td>
                <td className="p-2">Additional CSS classes for the dashboard container</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Type Definitions Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Type Definitions</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`interface CreditBalance {
  current: number        // Current credit balance
  total: number          // Total credit capacity
  autoRefill?: {
    enabled: boolean     // Whether auto-refill is enabled
    amount: number       // Amount to refill
    threshold: number    // Balance threshold to trigger refill
  }
}

interface UsageStats {
  messages: UsageMetric  // Message count usage
  tokens: UsageMetric    // Token usage
  files: UsageMetric     // File upload count
  exports: UsageMetric   // Export count
  storage: UsageMetric   // Storage in GB
  apiCalls: UsageMetric  // API call count
}

interface UsageMetric {
  used: number          // Amount used
  limit: number         // Maximum allowed
  cost?: number         // Optional cost for this category
}

interface UsageLimit {
  category: string      // Metric category
  current: number       // Current usage
  limit: number         // Maximum limit
  warning: boolean      // Whether warning should display
  warningThreshold: number  // Percentage threshold (e.g., 80)
}

interface UsageDashboardProps {
  balance: CreditBalance
  stats: UsageStats
  limits?: UsageLimit[]
  onPurchaseCredits?: () => void
  className?: string
}`}</code>
          </pre>
        </div>
      </section>

      {/* Complete Example with Backend Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Complete Example with Backend Integration</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { UsageDashboard } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function UsageManagement() {
  const [balance, setBalance] = useState(null)
  const [stats, setStats] = useState(null)
  const [limits, setLimits] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch usage data from backend
  useEffect(() => {
    async function fetchUsageData() {
      try {
        const response = await fetch('/api/usage')
        const data = await response.json()
        
        setBalance({
          current: data.credits.current,
          total: data.credits.total,
          autoRefill: data.autoRefill
        })
        
        setStats({
          messages: {
            used: data.usage.messagesUsed,
            limit: data.limits.messages,
            cost: data.costs.messages
          },
          tokens: {
            used: data.usage.tokensUsed,
            limit: data.limits.tokens,
            cost: data.costs.tokens
          },
          files: {
            used: data.usage.filesUploaded,
            limit: data.limits.files,
            cost: data.costs.files
          },
          exports: {
            used: data.usage.exportsCreated,
            limit: data.limits.exports,
            cost: data.costs.exports
          },
          storage: {
            used: data.usage.storageGB,
            limit: data.limits.storageGB,
            cost: data.costs.storage
          },
          apiCalls: {
            used: data.usage.apiCalls,
            limit: data.limits.apiCalls,
            cost: data.costs.apiCalls
          }
        })
        
        // Calculate limits with warnings
        const warningLimits = []
        Object.entries(data.usage).forEach(([key, used]) => {
          const limit = data.limits[key]
          const percentage = (used / limit) * 100
          
          if (percentage >= 80) {
            warningLimits.push({
              category: key,
              current: used,
              limit: limit,
              warning: percentage >= 80,
              warningThreshold: 80
            })
          }
        })
        setLimits(warningLimits)
        
      } catch (error) {
        console.error('Failed to fetch usage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsageData()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsageData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handlePurchaseCredits = async () => {
    try {
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 })
      })
      
      if (response.ok) {
        const data = await response.json()
        setBalance(prev => ({
          ...prev,
          current: data.newBalance
        }))
        alert('Credits purchased successfully!')
      }
    } catch (error) {
      console.error('Failed to purchase credits:', error)
    }
  }

  if (loading) {
    return <div>Loading usage data...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Usage & Billing</h1>
      
      <UsageDashboard
        balance={balance}
        stats={stats}
        limits={limits}
        onPurchaseCredits={handlePurchaseCredits}
        className="shadow-lg"
      />
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Need help managing usage?</h3>
        <p className="text-sm text-muted-foreground">
          Contact support for usage optimization tips or custom limits.
        </p>
      </div>
    </div>
  )
}

export default UsageManagement`}</code>
          </pre>
        </div>
      </section>

      {/* Cost Breakdown Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Cost Breakdown Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { UsageDashboard } from '@clarity-chat/react'

function BillingDashboard() {
  // Detailed cost breakdown
  const stats = {
    messages: {
      used: 1250,
      limit: 5000,
      cost: 12.50  // $0.01 per message
    },
    tokens: {
      used: 2500000,
      limit: 10000000,
      cost: 25.00  // $0.00001 per token
    },
    files: {
      used: 45,
      limit: 100,
      cost: 4.50   // $0.10 per file
    },
    exports: {
      used: 23,
      limit: 50,
      cost: 11.50  // $0.50 per export
    },
    storage: {
      used: 2.3,
      limit: 5.0,
      cost: 2.30   // $1.00 per GB
    },
    apiCalls: {
      used: 890,
      limit: 2000,
      cost: 8.90   // $0.01 per call
    }
  }

  const balance = {
    current: 935.30,  // Remaining credits
    total: 1000,
    autoRefill: {
      enabled: true,
      amount: 500,
      threshold: 200
    }
  }

  // Calculate total spent
  const totalSpent = Object.values(stats)
    .reduce((sum, stat) => sum + (stat.cost || 0), 0)

  return (
    <div>
      <div className="mb-4 p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total Spent This Month:</span>
          <span className="text-2xl font-bold">
            \${totalSpent.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Credits Remaining: {balance.current} / {balance.total}
        </div>
      </div>

      <UsageDashboard
        balance={balance}
        stats={stats}
        onPurchaseCredits={() => {
          // Navigate to payment page
          window.location.href = '/billing/purchase'
        }}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Auto-Refill Configuration Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Auto-Refill Configuration Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { UsageDashboard } from '@clarity-chat/react'
import { useState } from 'react'

function AutoRefillManagement() {
  const [autoRefillSettings, setAutoRefillSettings] = useState({
    enabled: false,
    amount: 500,
    threshold: 200
  })

  const balance = {
    current: 150,  // Low balance triggers refill
    total: 1000,
    autoRefill: autoRefillSettings
  }

  const stats = {
    messages: { used: 4200, limit: 5000 },
    tokens: { used: 8500000, limit: 10000000 },
    files: { used: 78, limit: 100 },
    exports: { used: 42, limit: 50 },
    storage: { used: 4.2, limit: 5.0 },
    apiCalls: { used: 1650, limit: 2000 }
  }

  const handleToggleAutoRefill = async () => {
    try {
      const response = await fetch('/api/settings/auto-refill', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: !autoRefillSettings.enabled,
          amount: autoRefillSettings.amount,
          threshold: autoRefillSettings.threshold
        })
      })

      if (response.ok) {
        setAutoRefillSettings(prev => ({
          ...prev,
          enabled: !prev.enabled
        }))
      }
    } catch (error) {
      console.error('Failed to update auto-refill:', error)
    }
  }

  return (
    <div>
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="font-semibold mb-3">Auto-Refill Settings</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefillSettings.enabled}
              onChange={handleToggleAutoRefill}
            />
            <span>Enable auto-refill</span>
          </label>

          <div>
            <label className="block text-sm mb-1">
              Refill Amount: {autoRefillSettings.amount} credits
            </label>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={autoRefillSettings.amount}
              onChange={(e) => setAutoRefillSettings(prev => ({
                ...prev,
                amount: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Threshold: {autoRefillSettings.threshold} credits
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={autoRefillSettings.threshold}
              onChange={(e) => setAutoRefillSettings(prev => ({
                ...prev,
                threshold: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          {autoRefillSettings.enabled
            ? \`Auto-refill will add \${autoRefillSettings.amount} credits when balance drops below \${autoRefillSettings.threshold}\`
            : 'Enable auto-refill to automatically purchase credits when running low'}
        </p>
      </div>

      <UsageDashboard
        balance={balance}
        stats={stats}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Usage Warnings Example Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage Warnings Example</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { UsageDashboard } from '@clarity-chat/react'
import { AlertCircle } from 'lucide-react'

function UsageWithWarnings() {
  const stats = {
    messages: { used: 4500, limit: 5000 },      // 90% - Warning!
    tokens: { used: 9200000, limit: 10000000 },  // 92% - Warning!
    files: { used: 85, limit: 100 },             // 85% - Warning!
    exports: { used: 30, limit: 50 },            // 60% - OK
    storage: { used: 3.2, limit: 5.0 },          // 64% - OK
    apiCalls: { used: 1200, limit: 2000 }        // 60% - OK
  }

  const balance = {
    current: 250,
    total: 1000,
    autoRefill: {
      enabled: true,
      amount: 500,
      threshold: 200
    }
  }

  // Calculate limits with warnings
  const limits = [
    {
      category: 'messages',
      current: 4500,
      limit: 5000,
      warning: true,
      warningThreshold: 80
    },
    {
      category: 'tokens',
      current: 9200000,
      limit: 10000000,
      warning: true,
      warningThreshold: 80
    },
    {
      category: 'files',
      current: 85,
      limit: 100,
      warning: true,
      warningThreshold: 80
    }
  ]

  return (
    <div>
      {limits.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">
              Usage Warnings ({limits.length})
            </h3>
          </div>
          
          <ul className="space-y-2 text-sm">
            {limits.map(limit => {
              const percentage = (limit.current / limit.limit * 100).toFixed(0)
              return (
                <li key={limit.category} className="flex justify-between">
                  <span className="capitalize">{limit.category}</span>
                  <span className="font-semibold text-yellow-700">
                    {percentage}% used
                  </span>
                </li>
              )
            })}
          </ul>

          <p className="text-sm text-yellow-700 mt-3">
            You're approaching usage limits. Consider upgrading your plan or 
            optimizing usage to avoid service interruption.
          </p>
        </div>
      )}

      <UsageDashboard
        balance={balance}
        stats={stats}
        limits={limits}
        onPurchaseCredits={() => {
          alert('Redirecting to purchase page...')
        }}
      />
    </div>
  )
}`}</code>
          </pre>
        </div>
      </section>

      {/* Animation Details Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Animation Details</h2>
        <p className="text-muted-foreground mb-4">
          The Usage Dashboard uses Framer Motion for smooth animations:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Metric Cards:</strong> Staggered fade-in with slide up (0.1s delay between each)</li>
          <li><strong>Progress Bars:</strong> Animated width transitions with spring physics</li>
          <li><strong>Warning Indicators:</strong> Pulse animation for attention-grabbing warnings</li>
          <li><strong>Credit Balance:</strong> Smooth number count-up animation on value changes</li>
          <li><strong>Hover States:</strong> Scale and shadow transitions on interactive elements</li>
          <li><strong>Layout Changes:</strong> AnimatePresence for adding/removing warning sections</li>
        </ul>
        
        <div className="bg-muted p-6 rounded-lg mt-4">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Animation variants used internally
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
}

const progressVariants = {
  initial: { width: 0 },
  animate: (percentage) => ({
    width: \`\${percentage}%\`,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  })
}`}</code>
          </pre>
        </div>
      </section>

      {/* TypeScript Support Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">TypeScript Support</h2>
        <p className="text-muted-foreground mb-4">
          The component is fully typed with comprehensive TypeScript definitions:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import type { 
  UsageDashboardProps,
  CreditBalance,
  UsageStats,
  UsageMetric,
  UsageLimit 
} from '@clarity-chat/react'

// Type-safe usage
const MyComponent: React.FC = () => {
  const balance: CreditBalance = {
    current: 500,
    total: 1000,
    autoRefill: {
      enabled: true,
      amount: 500,
      threshold: 200
    }
  }

  const stats: UsageStats = {
    messages: { used: 100, limit: 1000, cost: 1.00 },
    tokens: { used: 50000, limit: 100000, cost: 0.50 },
    files: { used: 10, limit: 50, cost: 1.00 },
    exports: { used: 5, limit: 20, cost: 2.50 },
    storage: { used: 1.5, limit: 5.0, cost: 1.50 },
    apiCalls: { used: 200, limit: 1000, cost: 2.00 }
  }

  // Type inference works automatically
  return (
    <UsageDashboard
      balance={balance}
      stats={stats}
      onPurchaseCredits={() => {
        // Handle purchase with full type safety
      }}
    />
  )
}

// Custom hook with types
function useUsageData() {
  const [data, setData] = useState<{
    balance: CreditBalance
    stats: UsageStats
  } | null>(null)

  return data
}`}</code>
          </pre>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Accessibility</h2>
        <p className="text-muted-foreground mb-4">
          The Usage Dashboard implements comprehensive accessibility features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>ARIA Labels:</strong> All metric cards have descriptive aria-label attributes</li>
          <li><strong>Progress Bars:</strong> Use role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax</li>
          <li><strong>Warning Alerts:</strong> role="alert" for usage warnings to notify screen readers</li>
          <li><strong>Semantic HTML:</strong> Proper heading hierarchy (h2, h3) for dashboard sections</li>
          <li><strong>Keyboard Navigation:</strong> Purchase button fully keyboard accessible</li>
          <li><strong>Focus Management:</strong> Visible focus indicators on all interactive elements</li>
          <li><strong>Color Contrast:</strong> WCAG AA compliant color ratios for all text</li>
          <li><strong>Screen Reader Text:</strong> Hidden labels for percentage values</li>
          <li><strong>Status Updates:</strong> Live region announcements for balance changes</li>
        </ul>

        <div className="bg-muted p-6 rounded-lg mt-4">
          <pre className="text-sm overflow-x-auto">
            <code>{`// Example accessibility attributes
<div 
  role="progressbar"
  aria-valuenow={75}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Credit balance: 750 of 1000 credits remaining"
>
  <div style={{ width: '75%' }} />
</div>

<div role="alert" aria-live="polite">
  You are approaching your usage limit
</div>

<button
  onClick={onPurchaseCredits}
  aria-label="Purchase additional credits"
>
  Purchase Credits
</button>`}</code>
          </pre>
        </div>
      </section>

      {/* Styling Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Styling</h2>
        <p className="text-muted-foreground mb-4">
          Customize the appearance using the className prop or by targeting internal elements:
        </p>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { UsageDashboard } from '@clarity-chat/react'

function StyledDashboard() {
  return (
    <UsageDashboard
      balance={balance}
      stats={stats}
      className="custom-dashboard"
    />
  )
}

/* Custom CSS */
.custom-dashboard {
  background: linear-gradient(to bottom, #f0f9ff, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-dashboard [data-metric-card] {
  background: white;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.custom-dashboard [data-metric-card]:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.custom-dashboard [data-progress-bar] {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
}

.custom-dashboard [data-warning] {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-dashboard {
    background: linear-gradient(to bottom, #1e3a8a, #1f2937);
  }
  
  .custom-dashboard [data-metric-card] {
    background: #374151;
    border-color: #4b5563;
  }
}`}</code>
          </pre>
        </div>
      </section>

      {/* Related Components Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Components</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Settings Panel:</strong> Manage user preferences and configuration</li>
          <li><strong>Token Counter:</strong> Real-time token usage tracking in conversations</li>
          <li><strong>Performance Dashboard:</strong> Monitor application performance metrics</li>
          <li><strong>Network Status:</strong> Display connection status and latency</li>
          <li><strong>Progress Bar:</strong> Standalone progress indicator component</li>
          <li><strong>Stats Card:</strong> Individual metric display cards</li>
        </ul>
      </section>

      {/* Best Practices Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Refresh usage data regularly (every 30-60 seconds) for real-time accuracy</li>
          <li>Display warnings at 80% threshold to give users time to react</li>
          <li>Show auto-refill status prominently when enabled to avoid surprises</li>
          <li>Include cost breakdown to help users understand spending patterns</li>
          <li>Provide clear call-to-action for purchasing credits when balance is low</li>
          <li>Use optimistic updates when user purchases credits for better UX</li>
          <li>Cache usage data to reduce API calls, but invalidate on purchases</li>
          <li>Show historical trends (daily, weekly, monthly) for usage analysis</li>
          <li>Implement export functionality for billing records and reports</li>
          <li>Send email notifications when limits are reached or refills occur</li>
        </ul>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Use Cases</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Account Management Portal</h3>
            <p className="text-muted-foreground">
              Display comprehensive usage dashboard in user account settings, allowing users 
              to monitor consumption, manage auto-refill, and purchase additional credits.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Billing and Invoicing</h3>
            <p className="text-muted-foreground">
              Show detailed cost breakdown by category for transparent billing, helping users 
              understand where their credits are being spent and optimize usage patterns.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Team Usage Monitoring</h3>
            <p className="text-muted-foreground">
              Allow team administrators to track organization-wide usage across multiple 
              categories, set team limits, and manage shared credit pools.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Developer API Portal</h3>
            <p className="text-muted-foreground">
              Provide API consumers with real-time visibility into API call usage, token 
              consumption, and rate limits to prevent unexpected service interruptions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Freemium Tier Management</h3>
            <p className="text-muted-foreground">
              Show free tier users their remaining quota across different resource types, 
              encouraging upgrades when approaching limits with clear upgrade paths.
            </p>
          </div>
        </div>
      </section>

      {/* Performance Tips Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Memoize usage stats calculations to avoid unnecessary re-renders</li>
          <li>Use React.memo for metric cards if rendering many items</li>
          <li>Implement virtual scrolling if displaying extensive usage history</li>
          <li>Debounce auto-refill API calls to prevent duplicate charges</li>
          <li>Cache formatted numbers and percentages to reduce formatting overhead</li>
          <li>Use CSS transforms for animations instead of layout-triggering properties</li>
          <li>Lazy load detailed cost breakdown tables until user expands them</li>
          <li>Implement pagination for historical usage data instead of loading all at once</li>
        </ul>
      </section>

      {/* Footer Navigation */}
      <footer className="mt-16 pt-8 border-t">
        <div className="flex justify-between items-center">
          <a href="/reference/components" className="text-primary hover:underline">
            ← Back to Components
          </a>
          <a href="/reference/components/performance-dashboard" className="text-primary hover:underline">
            Next: Performance Dashboard →
          </a>
        </div>
      </footer>
    </div>
  )
}
