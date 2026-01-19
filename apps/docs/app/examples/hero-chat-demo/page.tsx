import { Metadata } from 'next'
import { HeroChat } from '@/components/HeroChat'

export const metadata: Metadata = {
  title: 'Hero Chat Demo | Clarity Chat',
  description: 'The flagship demo showcasing 100% of Clarity Chat capabilities - streaming, tool calling, command palette, and more.',
  openGraph: {
    title: 'Hero Chat Demo | Clarity Chat',
    description: 'Experience the full power of Clarity Chat with our flagship demo featuring AI-powered tool calling and beautiful UI.',
  },
}

export default function HeroChatDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live Demo - Powered by Claude
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            The Hero Chat Experience
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            A flagship demo showcasing <strong>100% of Clarity Chat&apos;s capabilities</strong>.
            Streaming, tool calling, command palette, context menus, and beautiful animations.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              'Streaming',
              'Tool Calling',
              'Command Palette (⌘K)',
              'Context Menus',
              'Voice Input',
              'Dark Mode',
              'Animations',
              'Markdown',
            ].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="px-4 pb-12">
        <HeroChat />
      </section>

      {/* Instructions */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Try These */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Try These Prompts
            </h2>
            <ul className="space-y-3">
              {[
                { icon: '🌤️', text: '"What\'s the weather in Tokyo?"', desc: 'See the Weather Card tool' },
                { icon: '📈', text: '"How\'s Tesla stock doing?"', desc: 'See the Stock Chart tool' },
                { icon: '💻', text: '"Show me a useEffect example"', desc: 'See the Code Sandbox tool' },
                { icon: '✅', text: '"Create a task list for learning React"', desc: 'See the Task List tool' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.text}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Keyboard Shortcuts
            </h2>
            <ul className="space-y-3">
              {[
                { keys: '⌘ K', desc: 'Open command palette' },
                { keys: '/', desc: 'Open command palette (when input empty)' },
                { keys: '⌘ T', desc: 'Toggle theme' },
                { keys: 'Enter', desc: 'Send message' },
                { keys: 'Shift + Enter', desc: 'New line' },
                { keys: 'Esc', desc: 'Close modals' },
                { keys: 'Right-click', desc: 'Context menu on messages' },
              ].map((item) => (
                <li key={item.keys} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</span>
                  <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
                    {item.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tools Legend */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            AI Tools (Generative UI)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            When Claude detects relevant topics, it automatically uses these tools to render beautiful, interactive components:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Weather Card', desc: 'Animated weather display with forecasts', color: 'from-amber-400 to-orange-500' },
              { name: 'Stock Chart', desc: 'Interactive SVG price charts', color: 'from-emerald-400 to-teal-500' },
              { name: 'Code Sandbox', desc: 'Syntax highlighted with execution', color: 'from-blue-400 to-indigo-500' },
              { name: 'Task List', desc: 'Interactive checklist with progress', color: 'from-purple-400 to-pink-500' },
            ].map((tool) => (
              <div key={tool.name} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2`}>
                  <span className="text-white text-lg font-bold">{tool.name[0]}</span>
                </div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-white">{tool.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
