import { ScrollReveal, KineticText, ScrollRevealStagger, ScrollRevealStaggerItem } from '@/components/Enhanced/ScrollReveal'
import { InteractivePreview } from '@/components/Enhanced/InteractivePreview'
import { Palette, Download, Copy, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Theme Customization | Clarity Chat',
  description: 'Explore 15 beautiful themes and learn how to customize your chat interface.',
}

// Sample themes
const themes = [
  {
    name: 'Default',
    colors: {
      primary: '#6366f1',
      secondary: '#a855f7',
      accent: '#ec4899',
    },
    preview: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#3b82f6',
    },
    preview: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500',
  },
  {
    name: 'Forest',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
    },
    preview: 'bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-400',
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#f59e0b',
      secondary: '#ef4444',
      accent: '#ec4899',
    },
    preview: 'bg-gradient-to-r from-amber-500 via-red-500 to-pink-500',
  },
  {
    name: 'Midnight',
    colors: {
      primary: '#8b5cf6',
      secondary: '#6366f1',
      accent: '#3b82f6',
    },
    preview: 'bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500',
  },
  {
    name: 'Cherry',
    colors: {
      primary: '#dc2626',
      secondary: '#f43f5e',
      accent: '#fb7185',
    },
    preview: 'bg-gradient-to-r from-red-600 via-rose-500 to-rose-400',
  },
]

const configExample = `// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... other shades
          500: '#0ea5e9', // primary
          600: '#0284c7',
          // ... other shades
        },
      },
    },
  },
}`

export default function ThemesPage() {
  return (
    <div className=\"container-docs py-8 sm:py-12\">
      {/* Hero */}
      <ScrollReveal direction=\"up\" delay={0.1}>
        <div className=\"text-center mb-16\">
          <div className=\"inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6\">
            <Palette className=\"w-4 h-4 text-purple-500\" />
            <span className=\"text-sm font-medium text-purple-600 dark:text-purple-400\">
              15 Beautiful Themes
            </span>
          </div>
          
          <KineticText className=\"text-4xl sm:text-5xl font-bold mb-4\">
            Customize Your Style
          </KineticText>
          
          <p className=\"text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto\">
            Choose from pre-built themes or create your own. Full customization with Tailwind CSS.
          </p>
        </div>
      </ScrollReveal>

      {/* Theme Showcase */}
      <ScrollReveal direction=\"up\" delay={0.2}>
        <section className=\"mb-16\">
          <h2 className=\"text-2xl font-bold mb-8\">Pre-built Themes</h2>
          
          <ScrollRevealStagger staggerDelay={0.1}>
            <div className=\"grid sm:grid-cols-2 lg:grid-cols-3 gap-6\">
              {themes.map((theme, index) => (
                <ScrollRevealStaggerItem key={theme.name}>
                  <div className=\"group rounded-xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-xl\">
                    {/* Theme Preview */}
                    <div className={`h-32 ${theme.preview} relative`}>
                      <div className=\"absolute inset-0 bg-black/20\" />
                      <div className=\"absolute inset-0 flex items-center justify-center\">
                        <div className=\"text-white font-bold text-xl drop-shadow-lg\">
                          {theme.name}
                        </div>
                      </div>
                    </div>
                    
                    {/* Theme Details */}
                    <div className=\"p-6\">
                      <h3 className=\"font-semibold mb-4\">{theme.name} Theme</h3>
                      
                      <div className=\"space-y-2 mb-4\">
                        {Object.entries(theme.colors).map(([key, value]) => (
                          <div key={key} className=\"flex items-center justify-between text-sm\">
                            <span className=\"text-neutral-600 dark:text-neutral-400 capitalize\">
                              {key}:
                            </span>
                            <div className=\"flex items-center gap-2\">
                              <div
                                className=\"w-6 h-6 rounded border border-neutral-200 dark:border-neutral-700\"
                                style={{ backgroundColor: value }}
                              />
                              <code className=\"text-xs font-mono\">{value}</code>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className=\"w-full px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors flex items-center justify-center gap-2\">
                        <Download className=\"w-4 h-4\" />
                        Use Theme
                      </button>
                    </div>
                  </div>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>

      {/* Customization Example */}
      <ScrollReveal direction=\"up\" delay={0.2}>
        <section className=\"mb-16\">
          <h2 className=\"text-2xl font-bold mb-8\">Create Your Own Theme</h2>
          
          <InteractivePreview
            title=\"Tailwind Configuration\"
            description=\"Customize colors, typography, spacing, and more\"
            code={configExample}
            defaultMode=\"code\"
            allowFullscreen={false}
            showResponsive={false}
          >
            <div className=\"text-center p-8\">
              <p className=\"text-neutral-600 dark:text-neutral-400\">
                Edit the code to see how theme configuration works
              </p>
            </div>
          </InteractivePreview>
        </section>
      </ScrollReveal>

      {/* Customization Guide */}
      <ScrollReveal direction=\"up\" delay={0.2}>
        <section>
          <div className=\"text-center mb-12\">
            <h2 className=\"text-3xl font-bold mb-4\">What You Can Customize</h2>
            <p className=\"text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto\">
              Every aspect of the design system is customizable
            </p>
          </div>
          
          <ScrollRevealStagger staggerDelay={0.1}>
            <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-6\">
              {[
                {
                  icon: <Palette className=\"w-5 h-5\" />,
                  title: 'Color Palette',
                  description: 'Primary, secondary, accent colors with full shade ranges',
                },
                {
                  icon: <Sparkles className=\"w-5 h-5\" />,
                  title: 'Typography',
                  description: 'Font families, sizes, weights, and line heights',
                },
                {
                  icon: <Copy className=\"w-5 h-5\" />,
                  title: 'Spacing',
                  description: 'Padding, margins, and gap values for consistent rhythm',
                },
                {
                  icon: <Sparkles className=\"w-5 h-5\" />,
                  title: 'Border Radius',
                  description: 'Corner rounding from subtle to pill-shaped',
                },
                {
                  icon: <Copy className=\"w-5 h-5\" />,
                  title: 'Shadows',
                  description: 'Elevation and depth with customizable shadow values',
                },
                {
                  icon: <Palette className=\"w-5 h-5\" />,
                  title: 'Animations',
                  description: 'Duration, easing, and timing for all transitions',
                },
              ].map((feature, i) => (
                <ScrollRevealStaggerItem key={i}>
                  <div className=\"p-6 rounded-xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]\">
                    <div className=\"flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-brand-500 mb-4\">
                      {feature.icon}
                    </div>
                    <h3 className=\"font-semibold mb-2\">{feature.title}</h3>
                    <p className=\"text-sm text-neutral-600 dark:text-neutral-400\">
                      {feature.description}
                    </p>
                  </div>
                </ScrollRevealStaggerItem>
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal direction=\"up\" delay={0.2}>
        <div className=\"mt-16 text-center p-12 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50\">
          <h3 className=\"text-2xl font-bold mb-4\">Ready to Customize?</h3>
          <p className=\"text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto\">
            Start with a pre-built theme or create your own from scratch. Full documentation available.
          </p>
          <div className=\"flex flex-col sm:flex-row items-center justify-center gap-4\">
            <a
              href=\"/get-started\"
              className=\"inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-1\"
            >
              Get Started
            </a>
            <a
              href=\"/api\"
              className=\"inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1\"
            >
              View Documentation
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
