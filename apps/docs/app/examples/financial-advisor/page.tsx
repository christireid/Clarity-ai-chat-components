import { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  PieChart,
  Shield,
  Calendar,
  FileText,
} from 'lucide-react'
import { BudgetPieChart } from '@/components/Diagrams/BudgetPieChart'

import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Financial Advisor Example',
  description: 'AI-powered financial planning and budget management',
}

export default function FinancialAdvisorPage() {
  return (
    <div className="container-docs py-12">
      <Link
        href="/examples"
        className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Examples
      </Link>

      <div className="max-w-4xl">
        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-4">Financial Advisor</h1>
            <p className="text-xl text-text-secondary">
              AI-powered financial assistant for budgeting, investment insights,
              and financial planning
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium">
            Advanced
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm">
            Financial Services
          </span>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                Financial Disclaimer
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is for{' '}
                <strong>educational and demonstration purposes only</strong>.
                Not actual financial advice. Always consult licensed financial
                advisors for investment decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>✨ Features</h2>
          <ul>
            <li>
              <strong>Budget Planning</strong> - Create and manage monthly
              budgets with the 50/30/20 rule
            </li>
            <li>
              <strong>Expense Tracking</strong> - Categorize and analyze
              spending patterns
            </li>
            <li>
              <strong>Investment Insights</strong> - Educational portfolio
              recommendations
            </li>
            <li>
              <strong>Savings Goals</strong> - Track progress toward financial
              goals
            </li>
            <li>
              <strong>Financial Reports</strong> - Monthly/yearly summaries and
              trends
            </li>
            <li>
              <strong>Fraud Detection</strong> - Alerts on suspicious
              transactions
            </li>
            <li>
              <strong>Bill Reminders</strong> - Payment due date notifications
            </li>
          </ul>

          <h2>🚀 Quick Start</h2>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`cd examples/financial-advisor
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
npm run dev`}</code>
          </pre>

          <h2>💬 Example Conversations</h2>

          <h3>Budget Creation</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">
              👤 User: "Help me create a budget. I earn $5,000/month"
            </p>
            <p className="text-text-secondary text-sm mb-4">
              🤖 Assistant analyzes income and suggests:
            </p>
            <ul className="text-sm space-y-1">
              <li>
                • 50% Needs ($2,500): Housing, utilities, groceries, insurance
              </li>
              <li>• 30% Wants ($1,500): Entertainment, dining, shopping</li>
              <li>
                • 20% Savings ($1,000): Emergency fund, retirement, investments
              </li>
            </ul>
          </div>

          <h3>Spending Analysis</h3>
          <div className="bg-surface-elevated p-4 rounded-lg border border-border not-prose mb-4">
            <p className="font-medium mb-2">
              👤 User: "Where is my money going this month?"
            </p>
            <p className="text-text-secondary text-sm mb-2">
              🤖 Assistant provides breakdown:
            </p>
            <div className="text-sm">
              <p className="font-medium mb-1">Top Spending Categories:</p>
              <ul className="space-y-1">
                <li>• Dining Out: $450 (15%)</li>
                <li>• Transportation: $400 (13%)</li>
                <li>• Shopping: $350 (12%)</li>
              </ul>
              <p className="mt-2 text-yellow-700 dark:text-yellow-400">
                💡 Suggestion: Reduce dining to 10% to increase savings
              </p>
            </div>
          </div>

          <BudgetPieChart monthlyIncome={5000} />

          <h2>🎯 Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-4 border border-border rounded-lg">
              <PieChart className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Budget Management</h3>
              <p className="text-sm text-text-secondary">
                Create, track, and optimize budgets based on income and goals
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <TrendingUp className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Investment Education</h3>
              <p className="text-sm text-text-secondary">
                Learn about stocks, bonds, ETFs, and portfolio diversification
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <Calendar className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Bill Reminders</h3>
              <p className="text-sm text-text-secondary">
                Never miss a payment with smart due date notifications
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <FileText className="w-6 h-6 text-brand-500 mb-2" />
              <h3 className="font-semibold mb-2">Financial Reports</h3>
              <p className="text-sm text-text-secondary">
                Monthly summaries with insights and recommendations
              </p>
            </div>
          </div>

          <h2>🔒 Security</h2>
          <p>For production financial applications:</p>
          <ul>
            <li>
              <strong>PCI Compliance</strong> - If handling payment card data
            </li>
            <li>
              <strong>Encryption</strong> - Encrypt all financial data at rest
              and in transit
            </li>
            <li>
              <strong>MFA</strong> - Require multi-factor authentication
            </li>
            <li>
              <strong>Audit Logs</strong> - Track all financial operations
            </li>
            <li>
              <strong>Regulatory Compliance</strong> - Follow SEC, FINRA
              guidelines
            </li>
          </ul>

          <h2>📊 Sample Data</h2>
          <p>The demo includes realistic sample data:</p>
          <ul>
            <li>3 account types (checking, savings, investment)</li>
            <li>100+ sample transactions</li>
            <li>Budget categories and goals</li>
            <li>Investment portfolios</li>
          </ul>

          <h2>🚀 Production Enhancements</h2>

          <h3>Bank API Integration</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`// Integrate with Plaid, Yodlee, or bank APIs
import { PlaidClient } from 'plaid'

const plaid = new PlaidClient({ ... })
const transactions = await plaid.getTransactions({
  start_date: '2024-01-01',
  end_date: '2024-01-31'
})`}</code>
          </pre>

          <h3>Real-Time Market Data</h3>
          <pre className="bg-surface-muted p-4 rounded-lg">
            <code>{`// Financial data APIs
import { AlphaVantage } from 'alpha-vantage'

const stockPrice = await alphaVantage.quote('AAPL')
const marketData = await alphaVantage.globalQuote()`}</code>
          </pre>

          <h2>🔗 Related</h2>
          <ul>
            <li>
              <Link
                href="/examples/ecommerce-assistant"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                Ecommerce Assistant
              </Link>{' '}
              - Payment processing patterns
            </li>
            <li>
              <Link
                href="/guides/agents"
                className="text-brand-600 dark:text-brand-400 hover:underline"
              >
                AI Agents Guide
              </Link>{' '}
              - Build specialized financial agents
            </li>
          </ul>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-green-50 dark:from-brand-950 dark:to-green-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h3 className="text-2xl font-bold mb-4">💡 Ready to Build?</h3>
          <p className="text-text-secondary mb-6">
            Clone the example and start building your financial AI application
            today.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/financial-advisor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              View on GitHub →
            </a>
            <Link
              href="/learn/quick-start"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Quick Start Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
