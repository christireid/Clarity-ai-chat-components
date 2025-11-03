import { Terminal, Sparkles } from 'lucide-react'

export default function CLIPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">Beautiful CLI</h1>
        </div>
        <p className="text-xl text-text-secondary">
          Gorgeous terminal experience inspired by{' '}
          <a
            href="https://github.com/charmbracelet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:underline"
          >
            charmbracelet
          </a>
          's amazing libraries.
        </p>
      </div>

      {/* Installation */}
      <section className="bg-bg-secondary rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">📦 Installation</h2>
        <pre className="bg-bg p-4 rounded-lg overflow-x-auto">
          <code>npm install -g @clarity-chat/cli</code>
        </pre>
        <p className="text-sm text-text-secondary mt-4">
          Or use without installation:{' '}
          <code className="px-2 py-1 bg-bg rounded">npx @clarity-chat/cli</code>
        </p>
      </section>

      {/* Commands */}
      <section>
        <h2 className="text-3xl font-bold mb-6">🎯 Commands</h2>
        <div className="space-y-6">
          {commands.map((cmd) => (
            <div
              key={cmd.name}
              className="bg-bg border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {cmd.emoji} {cmd.name}
                  </h3>
                  <p className="text-text-secondary">{cmd.description}</p>
                </div>
              </div>
              <pre className="bg-bg-secondary p-4 rounded-lg text-sm overflow-x-auto mb-3">
                <code>{cmd.usage}</code>
              </pre>
              {cmd.features && (
                <div className="flex flex-wrap gap-2">
                  {cmd.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TUI Components */}
      <section className="bg-bg-secondary rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">
          <Sparkles className="w-6 h-6 inline mr-2" />
          Beautiful TUI Components
        </h2>
        <p className="text-text-secondary mb-6">
          9+ terminal UI components inspired by Lipgloss for gorgeous output
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-bg rounded-lg p-4">
            <div className="font-semibold mb-2">Spinners</div>
            <div className="text-sm text-text-secondary">
              dots, arrows, pulse
            </div>
          </div>
          <div className="bg-bg rounded-lg p-4">
            <div className="font-semibold mb-2">Progress Bars</div>
            <div className="text-sm text-text-secondary">percentage, ETA</div>
          </div>
          <div className="bg-bg rounded-lg p-4">
            <div className="font-semibold mb-2">Box Drawing</div>
            <div className="text-sm text-text-secondary">4 border styles</div>
          </div>
          <div className="bg-bg rounded-lg p-4">
            <div className="font-semibold mb-2">Tables</div>
            <div className="text-sm text-text-secondary">proper alignment</div>
          </div>
          <div className="bg-bg rounded-lg p-4">
            <div className="font-semibold mb-2">Tree Views</div>
            <div className="text-sm text-text-secondary">hierarchical data</div>
          </div>
          <div className="bg-bg rounded-lg p-4">
            <div className="font-semibold mb-2">Lists</div>
            <div className="text-sm text-text-secondary">
              bulleted, numbered
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const commands = [
  {
    name: 'browse',
    emoji: '🎨',
    description: 'Interactive component catalog with 15+ components',
    usage: 'clarity-chat browse',
    features: ['Interactive UI', 'Categories', 'Quick install'],
  },
  {
    name: 'search',
    emoji: '🔍',
    description: 'Search for components with fuzzy matching',
    usage: 'clarity-chat search <query>',
    features: ['Fuzzy search', 'Relevance scoring'],
  },
  {
    name: 'upgrade',
    emoji: '🚀',
    description: 'Smart package updates with changelog integration',
    usage: 'clarity-chat upgrade --interactive',
    features: ['Interactive', 'Changelog', 'Breaking changes'],
  },
  {
    name: 'analyze',
    emoji: '📊',
    description: 'Analyze project usage and generate reports',
    usage: 'clarity-chat analyze --report',
    features: ['Usage stats', 'Reports', 'Recommendations'],
  },
  {
    name: 'benchmark',
    emoji: '⚡',
    description: 'Run performance benchmarks with statistics',
    usage: 'clarity-chat benchmark --save --compare',
    features: ['Statistics', 'Comparison', 'Reports'],
  },
  {
    name: 'init',
    emoji: '🎯',
    description: 'Initialize a new Clarity Chat project',
    usage: 'clarity-chat init',
    features: ['Interactive wizard', 'Framework detection'],
  },
  {
    name: 'add',
    emoji: '➕',
    description: 'Add components to your project',
    usage: 'clarity-chat add <component>',
    features: ['Auto-install', 'Dependencies'],
  },
  {
    name: 'generate',
    emoji: '🔧',
    description: 'Generate code (component, hook, test)',
    usage: 'clarity-chat generate component',
    features: ['Templates', 'TypeScript'],
  },
  {
    name: 'doctor',
    emoji: '🩺',
    description: 'Check project health and auto-fix issues',
    usage: 'clarity-chat doctor --fix',
    features: ['Health check', 'Auto-fix'],
  },
  {
    name: 'keys',
    emoji: '🔑',
    description: 'Manage API keys securely',
    usage: 'clarity-chat keys',
    features: ['Secure storage', 'Validation'],
  },
  {
    name: 'dev',
    emoji: '🔥',
    description: 'Start development server',
    usage: 'clarity-chat dev --open',
    features: ['Hot reload', 'Auto-open'],
  },
  {
    name: 'docs',
    emoji: '📚',
    description: 'Open documentation or search',
    usage: 'clarity-chat docs [query]',
    features: ['Quick access', 'Search'],
  },
]
