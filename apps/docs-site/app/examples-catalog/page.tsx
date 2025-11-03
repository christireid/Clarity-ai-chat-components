import Link from 'next/link'
import { 
  ShoppingCart, 
  Code, 
  Users, 
  FileText, 
  Mail, 
  Heart, 
  DollarSign, 
  GraduationCap,
  BarChart3,
  Microscope,
  MessageSquare
} from 'lucide-react'

export default function ExamplesCatalogPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-4">Examples Catalog</h1>
        <p className="text-xl text-text-secondary">
          16 production-ready examples covering the top 10 AI chatbot use cases
        </p>
      </div>

      {/* Stats */}
      <section className="bg-bg-secondary rounded-xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold text-brand-500 mb-2">16</div>
            <div className="text-sm text-text-secondary">Total Examples</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-500 mb-2">10</div>
            <div className="text-sm text-text-secondary">Industries Covered</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-500 mb-2">100%</div>
            <div className="text-sm text-text-secondary">Use Case Coverage</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-brand-500 mb-2">11</div>
            <div className="text-sm text-text-secondary">Production Ready</div>
          </div>
        </div>
      </section>

      {/* Featured Examples */}
      <section>
        <h2 className="text-3xl font-bold mb-6">🎯 Featured Production Demos</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredExamples.map((example) => (
            <div key={example.path} className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg">
                  {example.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{example.name}</h3>
                  <p className="text-text-secondary mb-4">{example.description}</p>
                  <div className="space-y-2 mb-4">
                    {example.features.slice(0, 4).map((feature) => (
                      <div key={feature} className="text-sm text-text-secondary">
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-bg-secondary text-xs rounded">{example.technology}</span>
                    <span className="px-2 py-1 bg-bg-secondary text-xs rounded">{example.complexity}</span>
                    {example.isNew && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded">NEW</span>
                    )}
                  </div>
                  <Link
                    href={`/examples/${example.path}`}
                    className="text-brand-500 hover:text-brand-600 font-semibold"
                  >
                    View Documentation →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* By Industry */}
      <section>
        <h2 className="text-3xl font-bold mb-6">🏢 By Industry</h2>
        <div className="space-y-4">
          {industries.map((industry) => (
            <div key={industry.name} className="bg-bg border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3">{industry.name}</h3>
              <div className="flex flex-wrap gap-3">
                {industry.examples.map((example) => (
                  <Link
                    key={example}
                    href={`/examples/${example.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-4 py-2 bg-bg-secondary hover:bg-brand-500/10 rounded-lg transition-colors"
                  >
                    {example}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
        <p className="text-xl mb-8 opacity-90">
          Start with an example and adapt it to your needs
        </p>
        <Link
          href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Browse on GitHub
        </Link>
      </section>
    </div>
  )
}

const featuredExamples = [
  {
    name: 'E-Commerce Assistant',
    path: 'ecommerce-assistant',
    icon: <ShoppingCart className="w-6 h-6 text-brand-500" />,
    description: 'AI-powered shopping with product recommendations',
    features: ['Product search', 'Recommendations', 'Cart management', 'Price comparison'],
    technology: 'Next.js 15 + GPT-4',
    complexity: 'Intermediate',
    isNew: true,
  },
  {
    name: 'Code Assistant',
    path: 'code-assistant',
    icon: <Code className="w-6 h-6 text-brand-500" />,
    description: 'AI coding companion with debugging and generation',
    features: ['Multi-language', 'Debugging', 'Code review', 'Test generation'],
    technology: 'Monaco Editor + GPT-4',
    complexity: 'Intermediate',
    isNew: true,
  },
  {
    name: 'AI Agents Workflow',
    path: 'ai-agents-workflow',
    icon: <Users className="w-6 h-6 text-brand-500" />,
    description: 'Multi-agent system with specialized agents',
    features: ['5 agents', 'Tool calling', 'Task decomposition', 'Parallel execution'],
    technology: 'Next.js 15 + GPT-4',
    complexity: 'Advanced',
    isNew: true,
  },
  {
    name: 'Document Summarizer',
    path: 'document-summarizer',
    icon: <FileText className="w-6 h-6 text-brand-500" />,
    description: 'Intelligent document summarization',
    features: ['Multi-document', 'Key points', 'Entity recognition', 'Q&A'],
    technology: 'GPT-4 Turbo 128k',
    complexity: 'Intermediate',
    isNew: true,
  },
  {
    name: 'Email Assistant',
    path: 'email-assistant',
    icon: <Mail className="w-6 h-6 text-brand-500" />,
    description: 'AI-powered email composition',
    features: ['Tone adjustment', 'Multi-language', 'Templates', 'Grammar check'],
    technology: 'Claude 3 + Next.js',
    complexity: 'Beginner',
    isNew: true,
  },
  {
    name: 'Healthcare Assistant',
    path: 'healthcare-assistant',
    icon: <Heart className="w-6 h-6 text-brand-500" />,
    description: 'Healthcare chatbot (demo only)',
    features: ['Appointments', 'Symptom checker', 'Medication reminders', 'Emergency detection'],
    technology: 'Next.js + Supabase',
    complexity: 'Intermediate',
    isNew: true,
  },
  {
    name: 'Financial Advisor',
    path: 'financial-advisor',
    icon: <DollarSign className="w-6 h-6 text-brand-500" />,
    description: 'Financial planning (demo only)',
    features: ['Budgeting', 'Expense tracking', 'Savings goals', 'Reports'],
    technology: 'Next.js + Chart.js',
    complexity: 'Intermediate',
    isNew: true,
  },
  {
    name: 'AI Tutor',
    path: 'ai-tutor',
    icon: <GraduationCap className="w-6 h-6 text-brand-500" />,
    description: 'Intelligent tutoring system',
    features: ['Adaptive learning', 'Multi-subject', 'Practice problems', 'Gamification'],
    technology: 'Next.js + GPT-4',
    complexity: 'Intermediate',
    isNew: true,
  },
  {
    name: 'Model Comparison',
    path: 'model-comparison-demo',
    icon: <Microscope className="w-6 h-6 text-brand-500" />,
    description: 'Compare AI providers side-by-side',
    features: ['Multi-provider', 'Quality scoring', 'Cost analysis', 'Streaming'],
    technology: 'Next.js 15',
    complexity: 'Advanced',
    isNew: false,
  },
  {
    name: 'RAG Workbench',
    path: 'rag-workbench-demo',
    icon: <FileText className="w-6 h-6 text-brand-500" />,
    description: 'Document Q&A with RAG',
    features: ['Document upload', 'Semantic search', 'Context injection', 'Chunk visualization'],
    technology: 'Next.js 15',
    complexity: 'Advanced',
    isNew: false,
  },
  {
    name: 'Analytics Console',
    path: 'analytics-console-demo',
    icon: <BarChart3 className="w-6 h-6 text-brand-500" />,
    description: 'Real-time AI analytics dashboard',
    features: ['Usage tracking', 'Cost monitoring', 'Charts', 'Performance metrics'],
    technology: 'Recharts + Next.js',
    complexity: 'Advanced',
    isNew: false,
  },
]

const industries = [
  {
    name: 'E-Commerce & Retail',
    examples: ['E-Commerce Assistant'],
  },
  {
    name: 'Software Development',
    examples: ['Code Assistant', 'AI Agents Workflow'],
  },
  {
    name: 'Healthcare',
    examples: ['Healthcare Assistant'],
  },
  {
    name: 'Financial Services',
    examples: ['Financial Advisor'],
  },
  {
    name: 'Education',
    examples: ['AI Tutor'],
  },
  {
    name: 'Customer Support',
    examples: ['Customer Support Demo'],
  },
  {
    name: 'Knowledge Management',
    examples: ['Document Summarizer', 'RAG Workbench'],
  },
  {
    name: 'Communication',
    examples: ['Email Assistant'],
  },
  {
    name: 'Analytics',
    examples: ['Analytics Console'],
  },
]

