'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

const services = [
  {
    name: 'Memory Service',
    description:
      'Persistent memory management for conversation context and user preferences',
    href: '/reference/services/memory-service',
    icon: '🧠',
    features: ['Context persistence', 'User preferences', 'Session management'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs />

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Services
        </h1>

        <p className="text-xl text-text-secondary leading-relaxed">
          Backend services and integrations for enhanced AI chat functionality.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand service architecture',
          'Configure services for your application',
          'Integrate services with your chat components',
          'Deploy and scale services in production',
        ]}
      />

      <Callout type="info" className="mb-8">
        <p>
          <strong>Note:</strong> Services are optional but recommended for
          production applications that need persistence and advanced features.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Available Services</h2>

        <div className="grid gap-6">
          {services.map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="block p-6 rounded-xl border border-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-primary group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {service.name}
                  </h3>
                  <p className="text-text-secondary mt-1">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-bg-secondary border border-border rounded-full text-text-secondary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-brand-500 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Callout type="tip">
        <p>
          <strong>Coming soon:</strong> More services including Analytics
          Service, Rate Limiting Service, and Feedback Service.
        </p>
      </Callout>
    </>
  )
}
