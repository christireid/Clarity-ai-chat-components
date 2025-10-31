import { Metadata } from 'next'
import Link from 'next/link'
import { MessageSquare, Palette, Users, FileText, Zap, Command } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Interactive examples and code samples',
}

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
]

const difficultyColor = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

export default function ExamplesPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-6">Examples</h1>
        <p className="text-xl text-text-secondary mb-12">
          Explore interactive examples and learn by doing. All examples include full
          source code and are ready to copy and customize.
        </p>

        <div className="grid gap-12">
          {examples.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {category.examples.map((example) => (
                    <Link
                      key={example.href}
                      href={example.href}
                      className="group p-6 border border-border rounded-xl hover:border-brand-500 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                          {example.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            difficultyColor[example.difficulty as keyof typeof difficultyColor]
                          }`}
                        >
                          {example.difficulty}
                        </span>
                      </div>
                      <p className="text-text-secondary">{example.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Want More Examples?</h2>
          <p className="text-text-secondary mb-6">
            Check out our Storybook for interactive component demos and our GitHub repository
            for complete example projects.
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
              href="https://github.com/clarity-chat/ui/tree/main/examples"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
