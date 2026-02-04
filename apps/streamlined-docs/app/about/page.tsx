import { Metadata } from 'next'
import { Check, X, Zap, DollarSign, Brain, Command, Search, Library } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Clarity Chat UI',
  description:
    'Learn about Clarity Chat UI - a React library focused on production-ready AI chat interfaces with built-in token optimization, streaming, and conversation memory.',
}

export default function AboutPage() {
  return (
    <div className="container-docs py-12 max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About Clarity Chat UI</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          A React library built for production AI chat applications, focusing on the features that
          matter most for real-world deployments.
        </p>
      </div>

      {/* Our Focus */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">What Makes Us Different</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<DollarSign className="w-5 h-5" />}
            title="Token Optimization"
            description="Built-in TokenUsageMeter, TokenBudgetBar, and useTokenBudget hook for tracking and controlling AI costs in real-time."
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="True Streaming"
            description="StreamingMessage and StreamingProgress components designed for real-time AI responses with proper loading states."
          />
          <FeatureCard
            icon={<Brain className="w-5 h-5" />}
            title="Conversation Memory"
            description="MemoryActivityIndicator and useMemoryFeedback for building context-aware chat experiences."
          />
          <FeatureCard
            icon={<Command className="w-5 h-5" />}
            title="Command Palette"
            description="Built-in CommandPalette component for keyboard-first navigation and quick actions."
          />
          <FeatureCard
            icon={<Search className="w-5 h-5" />}
            title="Advanced Search"
            description="SearchFiltersPanel for filtering and finding messages in long conversations."
          />
          <FeatureCard
            icon={<Library className="w-5 h-5" />}
            title="Prompt Management"
            description="PromptLibrary and TemplateMarketplace for reusable prompt templates."
          />
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">How We Compare</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          We focus on production features that other libraries overlook. Here's how Clarity Chat
          compares to alternatives:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="text-center p-4 font-semibold text-brand-600 dark:text-brand-400">
                  Clarity Chat
                </th>
                <th className="text-center p-4 font-semibold">Vercel AI SDK UI</th>
                <th className="text-center p-4 font-semibold">ChatGPT UI Kit</th>
                <th className="text-center p-4 font-semibold">Build Your Own</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                feature="Token Usage Tracking"
                clarity={true}
                vercel={false}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="Cost Preview & Budgets"
                clarity={true}
                vercel={false}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="Streaming UI Components"
                clarity={true}
                vercel={true}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="Conversation Memory"
                clarity={true}
                vercel={false}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="Command Palette"
                clarity={true}
                vercel={false}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="Message Search & Filters"
                clarity={true}
                vercel={false}
                chatgpt={true}
                custom={false}
              />
              <ComparisonRow
                feature="Prompt Library"
                clarity={true}
                vercel={false}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="TypeScript Support"
                clarity={true}
                vercel={true}
                chatgpt={true}
                custom={true}
              />
              <ComparisonRow
                feature="Accessibility (WCAG AA)"
                clarity={true}
                vercel={true}
                chatgpt={false}
                custom={false}
              />
              <ComparisonRow
                feature="Setup Time"
                clarity="< 5 min"
                vercel="< 10 min"
                chatgpt="< 30 min"
                custom="Days/Weeks"
              />
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <strong>Note:</strong> Comparisons are based on publicly available documentation and
            features as of January 2026. Feature availability may vary based on version and
            configuration.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Philosophy</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            We built Clarity Chat UI because we kept rebuilding the same features for every AI chat
            project:
          </p>
          <ul>
            <li>
              <strong>Token tracking</strong> - Every production app needs to monitor AI costs
            </li>
            <li>
              <strong>Proper streaming</strong> - Users expect real-time responses, not loading
              spinners
            </li>
            <li>
              <strong>Memory management</strong> - Conversations need context to feel natural
            </li>
            <li>
              <strong>Search and navigation</strong> - Long conversations become unusable without
              these
            </li>
          </ul>
          <p>
            Rather than providing 100+ generic components, we ship ~15 focused components that solve
            real problems. Each component is production-tested, fully typed, and designed to work
            together seamlessly.
          </p>
        </div>
      </section>

      {/* Open Source */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Open Source & Transparent</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Clarity Chat UI is open source and actively maintained. We believe in:
        </p>
        <ul className="list-disc list-inside space-y-2 text-neutral-600 dark:text-neutral-400">
          <li>Clear documentation based on actual implementation</li>
          <li>No fake metrics or inflated component counts</li>
          <li>Focus on features that matter for production apps</li>
          <li>Community-driven development and feature requests</li>
        </ul>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-brand-600 dark:text-brand-400">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  )
}

interface ComparisonRowProps {
  feature: string
  clarity: boolean | string
  vercel: boolean | string
  chatgpt: boolean | string
  custom: boolean | string
}

function ComparisonRow({ feature, clarity, vercel, chatgpt, custom }: ComparisonRowProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-neutral-400 dark:text-neutral-600 mx-auto" />
      )
    }
    return <span className="text-sm">{value}</span>
  }

  return (
    <tr className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
      <td className="p-4 font-medium">{feature}</td>
      <td className="p-4 text-center">{renderCell(clarity)}</td>
      <td className="p-4 text-center">{renderCell(vercel)}</td>
      <td className="p-4 text-center">{renderCell(chatgpt)}</td>
      <td className="p-4 text-center">{renderCell(custom)}</td>
    </tr>
  )
}
