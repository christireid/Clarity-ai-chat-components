'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { ToastProvider } from '@clarity-chat/react'

const templates = [
  {
    name: 'AI Assistant',
    description: 'General-purpose AI assistant template',
    href: '/reference/templates/ai-assistant',
    icon: '🤖',
    tag: 'Popular',
  },
  {
    name: 'Customer Support',
    description: 'Support chatbot with ticket integration',
    href: '/reference/templates/customer-support',
    icon: '💬',
    tag: 'Popular',
  },
  {
    name: 'Code Assistant',
    description: 'Code-focused assistant with syntax highlighting',
    href: '/reference/templates/code-assistant',
    icon: '💻',
  },
  {
    name: 'Code Helper',
    description: 'Lightweight code helper for quick tasks',
    href: '/reference/templates/code-helper',
    icon: '🔧',
  },
  {
    name: 'Documentation Bot',
    description: 'RAG-powered documentation assistant',
    href: '/reference/templates/documentation-bot',
    icon: '📚',
  },
  {
    name: 'Support Bot',
    description: 'Automated support with FAQ integration',
    href: '/reference/templates/support-bot',
    icon: '🎧',
  },
  {
    name: 'Education Tutor',
    description: 'Interactive learning assistant',
    href: '/reference/templates/education-tutor',
    icon: '🎓',
  },
  {
    name: 'Creative Writing',
    description: 'Writing assistant for creative content',
    href: '/reference/templates/creative-writing',
    icon: '✍️',
  },
  {
    name: 'Data Analyst',
    description: 'Data analysis and visualization assistant',
    href: '/reference/templates/data-analyst',
    icon: '📊',
  },
  {
    name: 'Sales Assistant',
    description: 'Sales-focused chatbot with CRM integration',
    href: '/reference/templates/sales-assistant',
    icon: '💼',
  },
]

export default function TemplatesPage() {
  return (
    <ToastProvider>
      <Breadcrumbs />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Templates
        </h1>

        <p className="text-xl text-text-secondary leading-relaxed">
          Production-ready templates for common AI chat use cases. Start with a
          template and customize to your needs.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Choose the right template for your use case',
          'Understand template architecture and patterns',
          'Customize templates for your specific needs',
          'Deploy templates to production',
        ]}
      />

      <Callout type="tip" className="mb-8">
        <p>
          <strong>Pro tip:</strong> Templates are designed to be starting
          points. Feel free to mix and match features from different templates.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Available Templates</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Link
              key={template.name}
              href={template.href}
              className="block p-6 rounded-xl border border-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors group relative"
            >
              {template.tag && (
                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full">
                  {template.tag}
                </span>
              )}
              <div className="flex items-start gap-4">
                <div className="text-3xl">{template.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {template.name}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {template.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout type="info">
        <p>
          <strong>Need a custom template?</strong> Check out our{' '}
          <Link href="/cookbook" className="text-brand-500 hover:underline">
            Cookbook
          </Link>{' '}
          for guides on building custom solutions.
        </p>
      </Callout>
    </ToastProvider>
  )
}
