import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  ExternalLink,
  Star,
  Code2,
  Zap,
  Building2,
  Palette,
  BarChart3,
  ShoppingCart,
} from 'lucide-react'

interface Example {
  id: string
  title: string
  description: string
  features: string[]
  complexity: 'beginner' | 'intermediate' | 'advanced'
  path: string
  hero?: boolean
}

interface Category {
  label: string
  examples: Example[]
}

const examplesData: Record<string, Category> = {
  core: {
    label: 'Core Chat Features',
    examples: [
      {
        id: 'basic-chat',
        title: 'Basic Chat',
        description: 'Simple chat implementation with ChatWindow',
        features: ['ChatWindow', 'Messages', 'Input'],
        complexity: 'beginner',
        path: './basic-chat',
      },
      {
        id: 'minimal-chat',
        title: 'Minimal Chat',
        description: '5-line implementation for quick start',
        features: ['ClarityChat'],
        complexity: 'beginner',
        path: './minimal-chat',
      },
      {
        id: 'streaming-chat',
        title: 'Streaming Chat',
        description: 'Real-time SSE streaming with cancellation',
        features: ['SSE', 'Streaming', 'AbortController'],
        complexity: 'intermediate',
        path: './streaming-chat',
      },
      {
        id: 'comprehensive-chat-demo',
        title: 'Comprehensive Chat Demo',
        description: 'All features working together',
        features: [
          'Edit',
          'Regenerate',
          'Delete',
          'Undo',
          'Redo',
          'Export',
          'Search',
          'CommandPalette',
        ],
        complexity: 'advanced',
        path: './comprehensive-chat-demo',
      },
    ],
  },
  analytics: {
    label: 'Analytics & Optimization',
    examples: [
      {
        id: 'analytics-console-demo',
        title: 'Analytics Console',
        description: 'Token usage tracking and cost analytics dashboard',
        features: ['TokenCounter', 'CostAnalytics', 'Charts'],
        complexity: 'intermediate',
        path: './analytics-console-demo',
      },
      {
        id: 'token-optimization-demo',
        title: 'Token Optimization',
        description: 'In-chat token tracking and optimization',
        features: ['TokenTracker', 'Optimization'],
        complexity: 'intermediate',
        path: './token-optimization-demo',
      },
      {
        id: 'performance-dashboard',
        title: 'Performance Dashboard',
        description: 'Component performance benchmarking',
        features: ['Benchmarks', 'Metrics'],
        complexity: 'intermediate',
        path: './performance-dashboard',
      },
    ],
  },
  'ai-ml': {
    label: 'AI/ML Features',
    examples: [
      {
        id: 'rag-workbench-demo',
        title: 'RAG Workbench',
        description: 'Retrieval-augmented generation demo',
        features: ['RAG', 'VectorSearch', 'Citations'],
        complexity: 'advanced',
        path: './rag-workbench-demo',
      },
      {
        id: 'model-comparison-demo',
        title: 'Model Comparison',
        description: 'Compare OpenAI, Anthropic, and Google models',
        features: ['MultiProvider', 'Comparison'],
        complexity: 'intermediate',
        path: './model-comparison-demo',
      },
      {
        id: 'code-assistant',
        title: 'Code Assistant',
        description: 'AI-powered code debugging and generation',
        features: ['CodeGeneration', 'Debugging', 'Review'],
        complexity: 'intermediate',
        path: './code-assistant',
      },
    ],
  },
  design: {
    label: 'Design System',
    examples: [
      {
        id: 'theme-builder',
        title: 'Theme Builder',
        description: 'Interactive theme customization tool',
        features: ['ThemeProvider', 'Customization'],
        complexity: 'intermediate',
        path: './theme-builder',
      },
      {
        id: 'design-system-showcase',
        title: 'Design System Showcase',
        description: 'All components and variants',
        features: ['Components', 'Variants'],
        complexity: 'beginner',
        path: './design-system-showcase',
      },
      {
        id: 'component-demo',
        title: 'Component Demo',
        description: 'Individual component demonstrations',
        features: ['Primitives', 'Patterns'],
        complexity: 'beginner',
        path: './component-demo',
      },
    ],
  },
  enterprise: {
    label: 'Enterprise Features',
    examples: [
      {
        id: 'enterprise-ai-ops',
        title: 'Enterprise AI Ops',
        description: 'Full operations dashboard with safety and evaluation',
        features: ['SafetyReview', 'Evaluation', 'Monitoring'],
        complexity: 'advanced',
        path: './enterprise-ai-ops',
        hero: true,
      },
      {
        id: 'ai-research-platform',
        title: 'AI Research Platform',
        description: 'Multi-agent RAG with knowledge visualization',
        features: ['MultiAgent', 'KnowledgeGraph', 'Memory'],
        complexity: 'advanced',
        path: './ai-research-platform',
        hero: true,
      },
    ],
  },
  industry: {
    label: 'Industry Solutions',
    examples: [
      {
        id: 'ecommerce-assistant',
        title: 'E-Commerce Assistant',
        description: 'Product search and recommendations',
        features: ['ProductSearch', 'Cart', 'Recommendations'],
        complexity: 'intermediate',
        path: './ecommerce-assistant',
      },
      {
        id: 'customer-support',
        title: 'Customer Support',
        description: 'Ticket management with Supabase',
        features: ['Tickets', 'Supabase'],
        complexity: 'intermediate',
        path: './customer-support',
      },
      {
        id: 'conversational-analytics',
        title: 'Conversational Analytics',
        description: 'Conversation insights and metrics',
        features: ['Analytics', 'Insights'],
        complexity: 'intermediate',
        path: './conversational-analytics',
      },
    ],
  },
}

const categoryIcons: Record<string, React.ReactNode> = {
  core: <Code2 className="w-5 h-5" />,
  analytics: <BarChart3 className="w-5 h-5" />,
  'ai-ml': <Zap className="w-5 h-5" />,
  design: <Palette className="w-5 h-5" />,
  enterprise: <Building2 className="w-5 h-5" />,
  industry: <ShoppingCart className="w-5 h-5" />,
}

const complexityColors = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
}

function ExampleCard({ example }: { example: Example }) {
  const githubUrl = `https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/${example.id}`

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
            {example.title}
            {example.hero && (
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            )}
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${complexityColors[example.complexity]}`}
          >
            {example.complexity}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-4">{example.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {example.features.slice(0, 4).map((feature) => (
            <span
              key={feature}
              className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
            >
              {feature}
            </span>
          ))}
          {example.features.length > 4 && (
            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
              +{example.features.length - 4}
            </span>
          )}
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View Source <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(
    null
  )

  const filteredExamples = useMemo(() => {
    const allExamples: (Example & { category: string })[] = []

    Object.entries(examplesData).forEach(([categoryId, category]) => {
      category.examples.forEach((example) => {
        allExamples.push({ ...example, category: categoryId })
      })
    })

    return allExamples.filter((example) => {
      const matchesSearch =
        !searchQuery ||
        example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        example.features.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesCategory =
        !selectedCategory || example.category === selectedCategory
      const matchesComplexity =
        !selectedComplexity || example.complexity === selectedComplexity

      return matchesSearch && matchesCategory && matchesComplexity
    })
  }, [searchQuery, selectedCategory, selectedComplexity])

  const heroExamples = filteredExamples.filter((e) => e.hero)
  const regularExamples = filteredExamples.filter((e) => !e.hero)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Clarity Chat Examples
          </h1>
          <p className="text-slate-600 mt-1">
            Interactive gallery of{' '}
            {Object.values(examplesData).reduce(
              (acc, cat) => acc + cat.examples.length,
              0
            )}{' '}
            example applications
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search examples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {Object.entries(examplesData).map(([id, cat]) => (
                  <option key={id} value={id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <select
              value={selectedComplexity || ''}
              onChange={(e) => setSelectedComplexity(e.target.value || null)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Examples */}
        {heroExamples.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Featured Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroExamples.map((example) => (
                <ExampleCard key={example.id} example={example} />
              ))}
            </div>
          </section>
        )}

        {/* Category Sections or Filtered Results */}
        {selectedCategory || searchQuery || selectedComplexity ? (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {regularExamples.length} Example
              {regularExamples.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regularExamples.map((example) => (
                <ExampleCard key={example.id} example={example} />
              ))}
            </div>
          </section>
        ) : (
          Object.entries(examplesData).map(([categoryId, category]) => {
            const categoryExamples = category.examples.filter((e) => !e.hero)
            if (categoryExamples.length === 0) return null

            return (
              <section key={categoryId} className="mb-10">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  {categoryIcons[categoryId]}
                  {category.label}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryExamples.map((example) => (
                    <ExampleCard key={example.id} example={example} />
                  ))}
                </div>
              </section>
            )
          })
        )}

        {filteredExamples.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">
              No examples found matching your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory(null)
                setSelectedComplexity(null)
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          <p>Clarity Chat Component Library</p>
          <a
            href="https://github.com/christireid/Clarity-ai-chat-components"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
