import { Metadata } from 'next'
import Link from 'next/link'
import {
  MessageSquare,
  Palette,
  Users,
  FileText,
  Zap,
  Command,
  Sparkles,
  GitBranch,
  Shield,
  Eye,
} from 'lucide-react'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

// Metadata must be exported from a server component, not a client component
// export const metadata: Metadata = {
//   title: 'Examples',
//   description: 'Interactive examples and code samples',
// }

const examples = [
  {
    title: 'Basic Examples',
    icon: MessageSquare,
    examples: [
      {
        title: 'Simple Chat',
        href: '/examples/simple-chat',
        description: 'Basic chat interface with messages and input',
        difficulty: 'Beginner',
      },
      {
        title: 'Themed Chat',
        href: '/examples/themed-chat',
        description: 'Custom theme with dark mode support',
        difficulty: 'Beginner',
      },
      {
        title: 'Custom Styling',
        href: '/examples/custom-styling',
        description: 'Fully customized UI with Tailwind CSS',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    title: 'Advanced Features',
    icon: Zap,
    examples: [
      {
        title: 'Multi-user Chat',
        href: '/examples/multi-user',
        description: 'Group chat with multiple participants',
        difficulty: 'Intermediate',
      },
      {
        title: 'File Sharing',
        href: '/examples/file-sharing',
        description: 'Upload and share files in chat',
        difficulty: 'Advanced',
      },
      {
        title: 'Real-time Updates',
        href: '/examples/realtime',
        description: 'WebSocket integration for live chat',
        difficulty: 'Advanced',
      },
      {
        title: 'Conversation Branching',
        href: '/examples/conversation-branching',
        description: 'Claude-style speculative replies with branching tree',
        difficulty: 'Advanced',
      },
      {
        title: 'Virtualized Transcript',
        href: '/examples/virtualized-chat',
        description:
          'Render 5k+ messages with virtualization and jump-to-bottom',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    title: 'Interactive Patterns',
    icon: Command,
    examples: [
      {
        title: 'Command Palette',
        href: '/examples/command-palette',
        description: 'Keyboard-driven command interface (Cmd+K)',
        difficulty: 'Intermediate',
      },
      {
        title: 'Drag & Drop',
        href: '/examples/drag-drop',
        description: 'Drag and drop messages and files',
        difficulty: 'Advanced',
      },
      {
        title: 'Context Menus',
        href: '/examples/context-menus',
        description: 'Right-click context menus',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    title: 'Industry Solutions',
    icon: FileText,
    examples: [
      {
        title: 'Healthcare Assistant',
        href: '/examples/healthcare-assistant',
        description: 'HIPAA-compliant medical chatbot with patient records',
        difficulty: 'Advanced',
      },
      {
        title: 'Financial Advisor',
        href: '/examples/financial-advisor',
        description:
          'Budget planning, expense tracking, and investment insights',
        difficulty: 'Advanced',
      },
      {
        title: 'Ecommerce Assistant',
        href: '/examples/ecommerce-assistant',
        description: 'Product recommendations and shopping cart integration',
        difficulty: 'Intermediate',
      },
      {
        title: 'Education Tutor',
        href: '/examples/education-tutor',
        description: 'Interactive learning with quizzes and progress tracking',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    title: 'Enterprise Workflows',
    icon: Zap,
    examples: [
      {
        title: 'AI Agents Workflow',
        href: '/examples/ai-agents-workflow',
        description: 'Multi-agent orchestration with custom tools',
        difficulty: 'Advanced',
      },
      {
        title: 'Code Assistant',
        href: '/examples/code-assistant',
        description: 'AI-powered code help with syntax highlighting',
        difficulty: 'Advanced',
      },
      {
        title: 'Email Assistant',
        href: '/examples/email-assistant',
        description: 'Smart email composition and response suggestions',
        difficulty: 'Intermediate',
      },
      {
        title: 'Document Summarizer',
        href: '/examples/document-summarizer',
        description: 'Upload and summarize documents with AI',
        difficulty: 'Advanced',
      },
    ],
  },
]

const difficultyColor = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Intermediate:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function ExamplesPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <ScrollReveal>
          <h1 className="text-5xl font-bold mb-6">Examples</h1>
          <p className="text-xl text-text-secondary mb-12">
            Explore interactive examples and learn by doing. All examples
            include full source code and are ready to copy and customize.
          </p>
        </ScrollReveal>

        {/* Featured Demo */}
        <ScrollReveal delay={0.1}>
          <Link
            href="/examples/tool-calling-showcase"
            className="group block mb-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg shadow-purple-500/25">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full">
                    FEATURED
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">
                    New
                  </span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Advanced Tool Calling Showcase
                </h2>
                <p className="text-text-secondary mt-1">
                  Watch the AI orchestrate multiple tools, render interactive UI
                  components, and request approval for critical actions.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <GitBranch className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Tool Chains</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Generative UI</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Human-in-Loop</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50 dark:bg-white/5">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Glass Box Debug</span>
              </div>
            </div>
          </Link>
        </ScrollReveal>

        <div className="grid gap-12">
          {examples.map((category, idx) => {
            const Icon = category.icon
            return (
              <ScrollReveal key={category.title} delay={idx * 0.1}>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>

                  <ScrollReveal
                    stagger
                    staggerDelay={0.1}
                    className="grid md:grid-cols-2 gap-4"
                  >
                    {category.examples.map((example) => (
                      <ScrollRevealItem key={example.href}>
                        <Link
                          href={example.href}
                          className="group p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all block h-full"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                              {example.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                difficultyColor[
                                  example.difficulty as keyof typeof difficultyColor
                                ]
                              }`}
                            >
                              {example.difficulty}
                            </span>
                          </div>
                          <p className="text-text-secondary">
                            {example.description}
                          </p>
                        </Link>
                      </ScrollRevealItem>
                    ))}
                  </ScrollReveal>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal delay={0.5}>
          <div className="mt-16 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
            <h2 className="text-2xl font-bold mb-4">Want More Examples?</h2>
            <p className="text-text-secondary mb-6">
              Check out our Storybook for interactive component demos and our
              GitHub repository for complete example projects.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://storybook.clarity-chat.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
              >
                Open Storybook
              </a>
              <a
                href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
