'use client'

import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for learning and prototyping',
    features: [
      '15+ core components',
      '3 basic themes',
      'Community support',
      'MIT licensed',
      'Full documentation',
    ],
    cta: 'Get Started',
    href: '/docs',
    highlighted: false,
  },
  {
    name: 'Pro Team',
    price: '$499',
    period: '/year',
    description: 'Best for small teams and agencies',
    features: [
      '55+ components',
      '11 premium themes',
      '5 developer seats',
      'Priority email support (24h)',
      'All AI integrations',
      'Analytics & error tracking',
    ],
    cta: 'Start Free Trial',
    href: '/pricing',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$2,499',
    period: '/year',
    description: 'For companies and SaaS products',
    features: [
      '70+ components (enterprise included)',
      'Unlimited everything',
      'SSO, RBAC, white-label',
      'Dedicated support (4h SLA)',
      'Custom development',
      'SOC 2, HIPAA support',
    ],
    cta: 'Contact Sales',
    href: '/enterprise/contact',
    highlighted: false,
  },
]

export default function PricingPreview() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-brand-600 mb-2">
            PRICING
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start free, upgrade anytime. 30-day money-back guarantee on all paid
            plans.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border ${
                tier.highlighted
                  ? 'border-brand-500 shadow-xl ring-2 ring-brand-500'
                  : 'border-gray-200 dark:border-gray-700'
              } bg-white dark:bg-gray-900 p-8 ${
                tier.highlighted ? 'scale-105 z-10' : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-brand-600 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-gray-600 dark:text-gray-400">
                      {tier.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block w-full text-center rounded-lg px-6 py-3 font-semibold transition-all ${
                  tier.highlighted
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* View full pricing link */}
        <div className="mt-12 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            View full pricing comparison
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

