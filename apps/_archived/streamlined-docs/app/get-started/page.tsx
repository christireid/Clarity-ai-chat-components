import { ScrollReveal, KineticText, ScrollRevealStagger, ScrollRevealStaggerItem } from '@/components/Enhanced/ScrollReveal'
import { InteractivePreview } from '@/components/Enhanced/InteractivePreview'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { Sparkles, Package, Zap, Terminal, CheckCircle2, ArrowRight, Code2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Get Started | Clarity Chat',
  description: 'Get started with Clarity Chat UI in under 5 minutes. Installation, setup, and your first component.',
}

const installCode = `npm install @clarity-chat/ui
# or
yarn add @clarity-chat/ui
# or
pnpm add @clarity-chat/ui`

const basicUsage = `import { ChatWindow } from '@clarity-chat/ui'

function App() {
  return (
    <ChatWindow
      messages={[]}
      onSendMessage={(message) => console.log(message)}
    />
  )
}`

const withTheme = `import { ThemeProvider } from '@clarity-chat/ui'

function App() {
  return (
    <ThemeProvider theme="default">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </ThemeProvider>
  )
}`

export default function GetStartedPage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Quick Start Guide
            </span>
          </div>
          
          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Get Started in 5 Minutes
          </KineticText>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Install Clarity Chat UI and create your first beautiful chat interface. No complex setup required.
          </p>
        </div>
      </ScrollReveal>

      {/* Installation */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold">Installation</h2>
          </div>
          
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm font-medium">Terminal</span>
              </div>
              <EnhancedCopyButton
                text={installCode}
                label="Copy install command"
                size="sm"
                celebration="confetti"
              />
            </div>
            <pre className="p-4 bg-neutral-950 text-neutral-100 overflow-x-auto">
              <code>{installCode}</code>
            </pre>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-emerald-600 dark:text-emerald-400">Works with:</strong>{' '}
                Next.js 14+, Vite, Create React App, Remix, or any React 18+ project
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Basic Usage */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold">Basic Usage</h2>
          </div>
          
          <InteractivePreview
            title="Your First Component"
            description="Import and use ChatWindow in your React app"
            code={basicUsage}
            defaultMode="code"
            showResponsive={false}
          >
            <div className="text-center p-8">
              <p className="text-neutral-600 dark:text-neutral-400">
                See the code to get started
              </p>
            </div>
          </InteractivePreview>
        </section>
      </ScrollReveal>

      {/* Add Theme Provider */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold">Add Theme Provider</h2>
          </div>
          
          <InteractivePreview
            title="Theme Configuration"
            description="Wrap your app with ThemeProvider for consistent styling"
            code={withTheme}
            defaultMode="code"
            showResponsive={false}
          >
            <div className="text-center p-8">
              <p className="text-neutral-600 dark:text-neutral-400">
                See the code to add theming
              </p>
            </div>
          </InteractivePreview>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What's Next?</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Now that you have the basics, explore more features and components
            </p>
          </div>
          
          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: 'Explore Components',
                  description: 'Browse 155+ components with interactive demos',
                  href: '/explore',
                  color: 'brand',
                },
                {
                  icon: <Terminal className="w-5 h-5" />,
                  title: 'Try Playground',
                  description: 'Experiment with live code editing',
                  href: '/playground',
                  color: 'purple',
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: 'API Reference',
                  description: 'Complete documentation for all components',
                  href: '/api',
                  color: 'pink',
                },
              ].map((item, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <Link
                    href={item.href}
                    className="block p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-brand-500 transition-colors flex items-center gap-2">
                      {item.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </Link>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>

      {/* Quick Tips */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50 p-8 sm:p-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Tips</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'TypeScript Support',
                  tip: 'All components are fully typed. IntelliSense will guide you.',
                },
                {
                  icon: <Package className="w-5 h-5" />,
                  title: 'Tree-shakeable',
                  tip: 'Import only what you need. Unused components won\'t be bundled.',
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: 'Accessible by Default',
                  tip: 'WCAG AA compliant. Keyboard navigation and screen readers work out of the box.',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Dark Mode Ready',
                  tip: 'All components support dark mode automatically with ThemeProvider.',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-brand-200 dark:border-brand-800/50 text-brand-500 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
