import {
  Sparkles,
  Palette,
  Shield,
  Zap,
  Users,
  BarChart,
  Code,
  HeartHandshake,
} from 'lucide-react'

const features = [
  {
    name: '70+ Full-Featured Components',
    description:
      'Everything from basic chat to enterprise SSO. Voice input, file upload, streaming, analytics, and more.',
    icon: Code,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: '11 Premium Themes',
    description:
      'Beautiful themes including Ocean, Glassmorphism, Dark mode, and more. Fully customizable with CSS variables.',
    icon: Palette,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'WCAG AAA Accessible',
    description:
      'Only AI chat library with WCAG 2.1 AAA certification. Reduces legal risk and improves UX for everyone.',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: '10-50x Faster to Market',
    description:
      'Launch in 1 week vs. 6 months building from scratch. Get to market faster than competitors.',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    name: 'Enterprise Features',
    description:
      'SSO, RBAC, multi-tenant auth, audit logs, white-label options, and dedicated support with SLA.',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    name: 'Analytics & Monitoring',
    description:
      '7 analytics providers, 6 error tracking integrations, performance monitoring, and custom dashboards.',
    icon: BarChart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    name: 'AI Provider Agnostic',
    description:
      'Works with OpenAI, Anthropic, Google, Azure, AWS Bedrock, Cohere, Hugging Face, and custom providers.',
    icon: Sparkles,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
  },
  {
    name: 'Commercial Support',
    description:
      'Email support for Pro, priority for Team, dedicated engineer for Enterprise. SLA guarantees included.',
    icon: HeartHandshake,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
]

export default function Features() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-brand-600 mb-2">
            FEATURES
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From basic chat to enterprise features, we've built everything so
            you don't have to.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.name}
                className="relative rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
              >
                <div
                  className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}
                >
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Key stats */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-6 sm:gap-12 p-8 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/30 dark:to-purple-900/30">
            <div>
              <div className="text-3xl font-bold text-brand-600 mb-1">70+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Components
              </div>
            </div>
            <div className="hidden sm:block w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <div className="text-3xl font-bold text-brand-600 mb-1">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                TypeScript
              </div>
            </div>
            <div className="hidden sm:block w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <div className="text-3xl font-bold text-brand-600 mb-1">
                11
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Themes
              </div>
            </div>
            <div className="hidden sm:block w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <div className="text-3xl font-bold text-brand-600 mb-1">
                MIT
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Licensed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

