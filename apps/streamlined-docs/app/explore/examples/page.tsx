import { ScrollReveal, KineticText, ScrollRevealStagger } from '@/components/Enhanced/ScrollReveal'
import { ComponentDemoCard } from '@/components/Enhanced/ComponentDemoCard'
import { Sparkles, Package, Search } from 'lucide-react'

export const metadata = {
  title: 'Component Examples | Clarity Chat',
  description: 'Browse copy-paste ready component examples for common use cases.',
}

// Example component previews
function AlertPreview() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 text-lg">ℹ️</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">New Feature Available</h4>
          <p className="text-sm text-gray-600">Check out our latest updates and improvements.</p>
        </div>
      </div>
    </div>
  )
}

function InputPreview() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
      <input
        type="email"
        placeholder="you@example.com"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

function BadgePreview() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Primary</span>
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Success</span>
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Error</span>
      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Warning</span>
    </div>
  )
}

function AvatarGroupPreview() {
  return (
    <div className="flex -space-x-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm"
        >
          {i}
        </div>
      ))}
      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
        +5
      </div>
    </div>
  )
}

function ProgressPreview() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Upload Progress</span>
        <span className="text-sm text-gray-500">75%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '75%' }} />
      </div>
    </div>
  )
}

function ToastPreview() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-xl max-w-sm border-l-4 border-green-500">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 text-green-500 flex-shrink-0">✓</div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Success!</h4>
          <p className="text-sm text-gray-600">Your changes have been saved.</p>
        </div>
      </div>
    </div>
  )
}

export default function ExamplesPage() {
  const demos = [
    {
      title: 'Alert Component',
      description: 'Informational alerts with icons and styling variants',
      preview: <AlertPreview />,
      category: 'Feedback',
      tags: ['Alert', 'Notification'],
      gradient: 'from-blue-400 to-blue-600',
      href: '/explore/demos#alert',
    },
    {
      title: 'Input Field',
      description: 'Form input with label, focus states, and validation',
      preview: <InputPreview />,
      category: 'Forms',
      tags: ['Input', 'Form'],
      gradient: 'from-purple-400 to-purple-600',
      href: '/explore/demos#input',
    },
    {
      title: 'Badge',
      description: 'Status badges with multiple color variants',
      preview: <BadgePreview />,
      category: 'Display',
      tags: ['Badge', 'Status'],
      gradient: 'from-pink-400 to-pink-600',
      href: '/explore/demos#badge',
    },
    {
      title: 'Avatar Group',
      description: 'Stacked avatars with overflow counter',
      preview: <AvatarGroupPreview />,
      category: 'Display',
      tags: ['Avatar', 'User'],
      gradient: 'from-indigo-400 to-indigo-600',
      href: '/explore/demos#avatar',
    },
    {
      title: 'Progress Bar',
      description: 'Loading and progress indicators',
      preview: <ProgressPreview />,
      category: 'Feedback',
      tags: ['Progress', 'Loading'],
      gradient: 'from-cyan-400 to-cyan-600',
      href: '/explore/demos#progress',
    },
    {
      title: 'Toast Notification',
      description: 'Success, error, and info toast messages',
      preview: <ToastPreview />,
      category: 'Feedback',
      tags: ['Toast', 'Alert'],
      gradient: 'from-green-400 to-green-600',
      href: '/explore/demos#toast',
    },
  ]

  return (
    <div className="container-docs py-8 sm:py-12">
      {/* Hero */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Package className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              155+ Ready-to-Use Examples
            </span>
          </div>
          
          <KineticText className="text-4xl sm:text-5xl font-bold mb-4">
            Component Examples
          </KineticText>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Copy-paste ready component examples for common use cases. Each example includes TypeScript types and accessibility features.
          </p>
        </div>
      </ScrollReveal>

      {/* Search & Filter */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search examples..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Component Grid */}
      <ScrollReveal direction="up" delay={0.3}>
        <section>
          <ScrollRevealStagger staggerDelay={0.08}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demos.map((demo, i) => (
                <ComponentDemoCard key={i} {...demo} />
              ))}
            </div>
          </ScrollRevealStagger>
        </section>
      </ScrollReveal>

      {/* More Coming Soon */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="mt-16 text-center p-12 rounded-2xl bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-pink-500/10 border border-brand-200 dark:border-brand-800/50">
          <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">More Examples Coming Soon</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-xl mx-auto">
            We're continuously adding new examples and patterns. Check back regularly or contribute your own!
          </p>
        </div>
      </ScrollReveal>
    </div>
  )
}
