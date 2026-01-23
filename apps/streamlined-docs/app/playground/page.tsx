import {
  LivePlayground,
  playgroundTemplates,
} from '@/components/Enhanced/LivePlayground'
import {
  ScrollReveal,
  KineticText,
  ScrollRevealStagger,
  ScrollRevealStaggerItem,
} from '@/components/Enhanced/ScrollReveal'
import { TemplateButton } from '@/components/UI/TemplateButton'
import { Code2, Sparkles, Rocket, Zap } from 'lucide-react'

export const metadata = {
  title: 'Playground | Clarity Chat',
  description:
    'Experiment with Clarity Chat components in a live code editor. Write, run, and share your code.',
}

export default function PlaygroundPage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Rocket className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Live Code Editor
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Try It Live
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Write React code, see it run instantly. Experiment with components,
            share your creations, and learn by doing.
          </p>
        </div>
      </ScrollReveal>

      {/* Live Playground */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-12">
          <LivePlayground
            title="React Playground"
            language="tsx"
            showPreview={true}
            initialCode={playgroundTemplates.counter}
          />
        </section>
      </ScrollReveal>

      {/* Features */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Playground Features</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Everything you need for rapid prototyping
            </p>
          </div>

          <ScrollRevealStagger staggerDelay={0.1}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: 'Live Editing',
                  description: 'Edit code and run it instantly',
                },
                {
                  icon: <Rocket className="w-5 h-5" />,
                  title: 'Share Code',
                  description: 'Generate shareable links',
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Fast Preview',
                  description: 'See changes in real-time',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Templates',
                  description: 'Start from example templates',
                },
              ].map((feature, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <div className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4 mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </div>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>

      {/* Templates */}
      <ScrollReveal direction="up" delay={0.2}>
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Starter Templates</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Choose a template to start experimenting
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Counter',
                key: 'counter',
                description: 'Simple state management example',
              },
              {
                name: 'Button Variants',
                key: 'button',
                description: 'Multiple button styles',
              },
              {
                name: 'Card Component',
                key: 'card',
                description: 'Card with image and content',
              },
            ].map((template) => (
              <TemplateButton
                key={template.key}
                name={template.name}
                description={template.description}
              />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Tip */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="mt-12 p-6 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/50">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2 text-brand-600 dark:text-brand-400">
                Pro Tip
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                For a full-featured code playground with IntelliSense and npm
                package support, check out our integration with CodeSandbox and
                StackBlitz. Click the share button to open your code in an
                external editor.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
