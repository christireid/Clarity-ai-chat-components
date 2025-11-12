import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Search, Code, BookOpen, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Research documentation, analysis, and technical deep-dives',
}

const researchDocs = [
  {
    title: 'Vercel AI SDK Competitive Analysis',
    href: '/research/vercel-ai-sdk-competitive-analysis',
    description: 'Comprehensive analysis of Vercel AI SDK features, capabilities, and comparison with Clarity Chat',
    icon: Search,
    category: 'Competitive Analysis',
  },
  {
    title: 'Vercel AI SDK Feature Audit',
    href: '/research/vercel-ai-sdk-feature-audit',
    description: 'Detailed feature-by-feature audit of Vercel AI SDK capabilities',
    icon: Code,
    category: 'Technical Analysis',
  },
  {
    title: 'Vercel AI SDK Integration Guide',
    href: '/research/vercel-ai-sdk-integration-guide',
    description: 'Guide for integrating Vercel AI SDK with Clarity Chat components',
    icon: BookOpen,
    category: 'Integration',
  },
  {
    title: 'Vercel AI Observability Adapter',
    href: '/research/vercel-ai-observability-adapter',
    description: 'Research on observability and monitoring for AI applications',
    icon: Zap,
    category: 'Observability',
  },
  {
    title: 'Create Clarity Assistant Design',
    href: '/research/create-clarity-assistant-design',
    description: 'Design documentation and research for the Clarity Assistant feature',
    icon: FileText,
    category: 'Design',
  },
]

export default function ResearchPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Research</h1>
          <p className="text-xl text-text-secondary">
            Research documentation, competitive analysis, and technical deep-dives.
          </p>
        </div>

        <div className="grid gap-6">
          {researchDocs.map((doc) => {
            const Icon = doc.icon
            return (
              <Link
                key={doc.href}
                href={doc.href}
                className="group block p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-bg-secondary text-text-secondary rounded-full text-sm font-medium">
                        {doc.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-2">
                      {doc.title}
                    </h2>
                    <p className="text-text-secondary">{doc.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Contributing Research</h2>
          <p className="text-text-secondary mb-6">
            Have research or analysis to share? We welcome contributions to our research documentation.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="https://github.com/clarity-chat/ui/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Share Research
            </a>
            <a
              href="https://discord.gg/clarity-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
