import { InteractivePreview } from '@/components/Enhanced/InteractivePreview'
import { VideoEmbed } from '@/components/Enhanced/VideoEmbed'
import { ScrollReveal, KineticText } from '@/components/Enhanced/ScrollReveal'
import { Sparkles, Code2, Play, Zap } from 'lucide-react'

export const metadata = {
  title: 'Interactive Demos | Clarity Chat',
  description:
    'Explore interactive component demonstrations with live controls and code examples.',
}

// ISR Configuration: Demo pages are static showcases, revalidate every 3 hours
export const revalidate = 10800

// Example component for preview
function ExampleButton({ variant = 'primary', children = 'Click me!' }: any) {
  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-purple-500 text-white',
    secondary:
      'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800',
    ghost: 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950',
  }

  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-1 hover:shadow-lg ${variants[variant]}`}
    >
      {children}
    </button>
  )
}

const buttonCode = `function Button({ variant = 'primary', children }) {
  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-purple-500 text-white',
    secondary: 'bg-white dark:bg-neutral-900 border',
    ghost: 'text-brand-500 hover:bg-brand-50',
  }

  return (
    <button
      className={\`px-6 py-3 rounded-lg font-medium 
        transition-all hover:-translate-y-1 hover:shadow-lg 
        \${variants[variant]}\`}
    >
      {children}
    </button>
  )
}`

export default function DemosPage() {
  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800/50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Interactive Examples
            </span>
          </div>

          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Try Components Live
          </KineticText>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Interact with components, toggle between preview and code, and see
            responsive behavior in real-time.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-16">
        {/* Interactive Button Demo */}
        <ScrollReveal direction="up" delay={0.2}>
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Code2 className="w-6 h-6 text-brand-500" />
              Button Component
            </h2>

            <InteractivePreview
              title="Button Variants"
              description="A button component with multiple style variants"
              code={buttonCode}
              defaultMode="preview"
              showResponsive={true}
              previewBackground="grid"
              controls={
                <div className="flex gap-2">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Try different variants and device sizes
                  </span>
                </div>
              }
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <ExampleButton variant="primary">Primary</ExampleButton>
                <ExampleButton variant="secondary">Secondary</ExampleButton>
                <ExampleButton variant="ghost">Ghost</ExampleButton>
              </div>
            </InteractivePreview>
          </section>
        </ScrollReveal>

        {/* Card Demo */}
        <ScrollReveal direction="up" delay={0.2}>
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-500" />
              Card Component
            </h2>

            <InteractivePreview
              title="Glassmorphism Card"
              description="A modern card with glassmorphism effects"
              code={`<div className="relative rounded-xl overflow-hidden 
  bg-white/60 dark:bg-white/[0.02] 
  backdrop-blur-sm border border-neutral-200/60 
  dark:border-white/[0.06] p-6 
  hover:border-brand-300 transition-all 
  hover:-translate-y-1 hover:shadow-xl">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-neutral-600 dark:text-neutral-400">
    Card content with glassmorphism styling
  </p>
</div>`}
              defaultMode="preview"
              previewBackground="default"
            >
              <div className="max-w-sm mx-auto">
                <div className="relative rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06] p-6 hover:border-brand-300 transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500" />
                    <div>
                      <h3 className="text-xl font-semibold">Card Title</h3>
                      <p className="text-sm text-neutral-500">Subtitle text</p>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    This card uses glassmorphism effects with backdrop blur and
                    semi-transparent backgrounds.
                  </p>
                  <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </InteractivePreview>
          </section>
        </ScrollReveal>

        {/* Video Tutorial Example */}
        <ScrollReveal direction="up" delay={0.2}>
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Play className="w-6 h-6 text-pink-500" />
              Video Tutorials
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <VideoEmbed
                src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                title="Getting Started with Clarity Chat"
                aspectRatio="16/9"
              />
              <VideoEmbed
                src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                title="Building Your First Chat Interface"
                aspectRatio="16/9"
              />
            </div>
          </section>
        </ScrollReveal>

        {/* Feature Grid */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="bg-gradient-to-br from-brand-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Interactive Demos?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                See components in action before implementing them in your
                project.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Code2 className="w-5 h-5" />,
                  title: 'Live Code Editing',
                  description: 'Modify props and see changes instantly',
                },
                {
                  icon: <Play className="w-5 h-5" />,
                  title: 'Interactive Controls',
                  description: 'Toggle between states and variants',
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: 'Responsive Preview',
                  description: 'Test on mobile, tablet, and desktop',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  )
}
