import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const metadata = {
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
};
export default function UsageDashboardPage() {
    return (_jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "Usage Dashboard" }), _jsx("p", { className: "text-xl text-muted-foreground mb-8", children: "A comprehensive dashboard component for tracking credit balance, usage metrics, cost breakdown, and usage limits with real-time updates and warnings." }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Overview" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Usage Dashboard component provides a complete view of user resource consumption, credit balance, and cost tracking. It displays real-time usage metrics across multiple categories, warns when approaching limits, and offers credit management options including auto-refill and manual purchases." }), _jsx("h3", { className: "text-xl font-semibold mb-3 mt-6", children: "Key Features" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Credit balance display with progress bar and percentage" }), _jsx("li", { children: "Six usage metric categories: messages, tokens, files, exports, storage, API calls" }), _jsx("li", { children: "Detailed cost breakdown with itemized billing by category" }), _jsx("li", { children: "Usage limit warnings at 80% threshold with visual indicators" }), _jsx("li", { children: "Auto-refill configuration with amount and threshold settings" }), _jsx("li", { children: "Quick stats summary showing total spent and time period" }), _jsx("li", { children: "Usage tips for optimizing credit consumption" }), _jsx("li", { children: "Smooth animations with Framer Motion for metric cards" }), _jsx("li", { children: "Responsive grid layout adapting to screen sizes" }), _jsx("li", { children: "Manual credit purchase button with callback support" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Installation" }), _jsx("div", { className: "bg-muted p-4 rounded-lg", children: _jsx("code", { className: "text-sm", children: "npm install @clarity-chat/react framer-motion" }) }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "This component requires Framer Motion for animations." })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Basic Usage" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Props API" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Prop" }), _jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "Required" }), _jsx("th", { className: "text-left p-2", children: "Description" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "balance" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "CreditBalance" }), _jsx("td", { className: "p-2", children: "Yes" }), _jsx("td", { className: "p-2", children: "Credit balance information with current, total, and auto-refill settings" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "stats" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "UsageStats" }), _jsx("td", { className: "p-2", children: "Yes" }), _jsx("td", { className: "p-2", children: "Usage statistics for messages, tokens, files, exports, storage, API calls" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "limits" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "UsageLimit[]" }), _jsx("td", { className: "p-2", children: "No" }), _jsx("td", { className: "p-2", children: "Optional array of usage limits with warnings" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "onPurchaseCredits" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "() => void" }), _jsx("td", { className: "p-2", children: "No" }), _jsx("td", { className: "p-2", children: "Callback when user clicks purchase credits button" })] }), _jsxs("tr", { className: "border-b", children: [_jsx("td", { className: "p-2 font-mono text-sm", children: "className" }), _jsx("td", { className: "p-2 font-mono text-sm", children: "string" }), _jsx("td", { className: "p-2", children: "No" }), _jsx("td", { className: "p-2", children: "Additional CSS classes for the dashboard container" })] })] })] }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Type Definitions" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `interface CreditBalance {
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Complete Example with Backend Integration" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'
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

export default UsageManagement` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Cost Breakdown Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Auto-Refill Configuration Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Usage Warnings Example" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Animation Details" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Usage Dashboard uses Framer Motion for smooth animations:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Metric Cards:" }), " Staggered fade-in with slide up (0.1s delay between each)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Progress Bars:" }), " Animated width transitions with spring physics"] }), _jsxs("li", { children: [_jsx("strong", { children: "Warning Indicators:" }), " Pulse animation for attention-grabbing warnings"] }), _jsxs("li", { children: [_jsx("strong", { children: "Credit Balance:" }), " Smooth number count-up animation on value changes"] }), _jsxs("li", { children: [_jsx("strong", { children: "Hover States:" }), " Scale and shadow transitions on interactive elements"] }), _jsxs("li", { children: [_jsx("strong", { children: "Layout Changes:" }), " AnimatePresence for adding/removing warning sections"] })] }), _jsx("div", { className: "bg-muted p-6 rounded-lg mt-4", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `// Animation variants used internally
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "TypeScript Support" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The component is fully typed with comprehensive TypeScript definitions:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import type { 
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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Accessibility" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "The Usage Dashboard implements comprehensive accessibility features:" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "ARIA Labels:" }), " All metric cards have descriptive aria-label attributes"] }), _jsxs("li", { children: [_jsx("strong", { children: "Progress Bars:" }), " Use role=\"progressbar\" with aria-valuenow, aria-valuemin, aria-valuemax"] }), _jsxs("li", { children: [_jsx("strong", { children: "Warning Alerts:" }), " role=\"alert\" for usage warnings to notify screen readers"] }), _jsxs("li", { children: [_jsx("strong", { children: "Semantic HTML:" }), " Proper heading hierarchy (h2, h3) for dashboard sections"] }), _jsxs("li", { children: [_jsx("strong", { children: "Keyboard Navigation:" }), " Purchase button fully keyboard accessible"] }), _jsxs("li", { children: [_jsx("strong", { children: "Focus Management:" }), " Visible focus indicators on all interactive elements"] }), _jsxs("li", { children: [_jsx("strong", { children: "Color Contrast:" }), " WCAG AA compliant color ratios for all text"] }), _jsxs("li", { children: [_jsx("strong", { children: "Screen Reader Text:" }), " Hidden labels for percentage values"] }), _jsxs("li", { children: [_jsx("strong", { children: "Status Updates:" }), " Live region announcements for balance changes"] })] }), _jsx("div", { className: "bg-muted p-6 rounded-lg mt-4", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `// Example accessibility attributes
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
</button>` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Styling" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Customize the appearance using the className prop or by targeting internal elements:" }), _jsx("div", { className: "bg-muted p-6 rounded-lg", children: _jsx("pre", { className: "text-sm overflow-x-auto", children: _jsx("code", { children: `import { UsageDashboard } from '@clarity-chat/react'

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
}` }) }) })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Related Components" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsxs("li", { children: [_jsx("strong", { children: "Settings Panel:" }), " Manage user preferences and configuration"] }), _jsxs("li", { children: [_jsx("strong", { children: "Token Counter:" }), " Real-time token usage tracking in conversations"] }), _jsxs("li", { children: [_jsx("strong", { children: "Performance Dashboard:" }), " Monitor application performance metrics"] }), _jsxs("li", { children: [_jsx("strong", { children: "Network Status:" }), " Display connection status and latency"] }), _jsxs("li", { children: [_jsx("strong", { children: "Progress Bar:" }), " Standalone progress indicator component"] }), _jsxs("li", { children: [_jsx("strong", { children: "Stats Card:" }), " Individual metric display cards"] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Best Practices" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Refresh usage data regularly (every 30-60 seconds) for real-time accuracy" }), _jsx("li", { children: "Display warnings at 80% threshold to give users time to react" }), _jsx("li", { children: "Show auto-refill status prominently when enabled to avoid surprises" }), _jsx("li", { children: "Include cost breakdown to help users understand spending patterns" }), _jsx("li", { children: "Provide clear call-to-action for purchasing credits when balance is low" }), _jsx("li", { children: "Use optimistic updates when user purchases credits for better UX" }), _jsx("li", { children: "Cache usage data to reduce API calls, but invalidate on purchases" }), _jsx("li", { children: "Show historical trends (daily, weekly, monthly) for usage analysis" }), _jsx("li", { children: "Implement export functionality for billing records and reports" }), _jsx("li", { children: "Send email notifications when limits are reached or refills occur" })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Use Cases" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Account Management Portal" }), _jsx("p", { className: "text-muted-foreground", children: "Display comprehensive usage dashboard in user account settings, allowing users to monitor consumption, manage auto-refill, and purchase additional credits." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Billing and Invoicing" }), _jsx("p", { className: "text-muted-foreground", children: "Show detailed cost breakdown by category for transparent billing, helping users understand where their credits are being spent and optimize usage patterns." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Team Usage Monitoring" }), _jsx("p", { className: "text-muted-foreground", children: "Allow team administrators to track organization-wide usage across multiple categories, set team limits, and manage shared credit pools." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Developer API Portal" }), _jsx("p", { className: "text-muted-foreground", children: "Provide API consumers with real-time visibility into API call usage, token consumption, and rate limits to prevent unexpected service interruptions." })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Freemium Tier Management" }), _jsx("p", { className: "text-muted-foreground", children: "Show free tier users their remaining quota across different resource types, encouraging upgrades when approaching limits with clear upgrade paths." })] })] })] }), _jsxs("section", { className: "mb-12", children: [_jsx("h2", { className: "text-3xl font-semibold mb-4", children: "Performance Tips" }), _jsxs("ul", { className: "list-disc list-inside space-y-2 text-muted-foreground", children: [_jsx("li", { children: "Memoize usage stats calculations to avoid unnecessary re-renders" }), _jsx("li", { children: "Use React.memo for metric cards if rendering many items" }), _jsx("li", { children: "Implement virtual scrolling if displaying extensive usage history" }), _jsx("li", { children: "Debounce auto-refill API calls to prevent duplicate charges" }), _jsx("li", { children: "Cache formatted numbers and percentages to reduce formatting overhead" }), _jsx("li", { children: "Use CSS transforms for animations instead of layout-triggering properties" }), _jsx("li", { children: "Lazy load detailed cost breakdown tables until user expands them" }), _jsx("li", { children: "Implement pagination for historical usage data instead of loading all at once" })] })] }), _jsx("footer", { className: "mt-16 pt-8 border-t", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("a", { href: "/reference/components", className: "text-primary hover:underline", children: "\u2190 Back to Components" }), _jsx("a", { href: "/reference/components/performance-dashboard", className: "text-primary hover:underline", children: "Next: Performance Dashboard \u2192" })] }) })] }));
}
//# sourceMappingURL=page.js.map