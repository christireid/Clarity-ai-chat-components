'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'

const tiers = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for learning and prototyping',
    features: [
      '15+ core components',
      'Basic streaming support',
      'Community support',
      'MIT licensed',
      'Full documentation',
      'Example projects',
    ],
    cta: 'Get Started Free',
    href: '/docs/guides/getting-started',
    highlighted: false,
    gradient: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Pro',
    price: { monthly: 49, annual: 39 },
    description: 'Best for teams building production apps',
    features: [
      '50+ components',
      'All AI providers',
      'Memory management',
      'Token optimization',
      'Priority email support',
      'Premium themes',
      'Analytics integrations',
      'Private Slack channel',
    ],
    cta: 'Start Free Trial',
    href: '/pricing?plan=pro',
    highlighted: true,
    gradient: 'from-clarity-500 to-cosmic-500',
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    description: 'For companies with advanced needs',
    features: [
      'Everything in Pro',
      'SSO & RBAC',
      'Audit logging',
      'White-label options',
      'Dedicated support (4h SLA)',
      'Custom integrations',
      'SOC 2 compliance',
      'On-premises deployment',
    ],
    cta: 'Contact Sales',
    href: '/enterprise/contact',
    highlighted: false,
    gradient: 'from-cosmic-500 to-pink-500',
  },
]

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>(
    'annual'
  )
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-surface-900">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cosmic-500/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: durations.slow }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-cosmic-500/10 border border-cosmic-500/20 text-cosmic-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Start free, upgrade when you're ready. 30-day money-back guarantee
            on all paid plans.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span
            className={`text-sm font-medium transition-colors ${
              billingPeriod === 'monthly' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === 'monthly' ? 'annual' : 'monthly'
              )
            }
            className="relative w-14 h-7 rounded-full bg-surface-700 transition-colors"
            aria-label="Toggle billing period"
          >
            <motion.div
              className="absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-clarity-500 to-cosmic-500"
              animate={{
                left: billingPeriod === 'annual' ? '2rem' : '0.25rem',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors flex items-center gap-2 ${
              billingPeriod === 'annual' ? 'text-white' : 'text-gray-500'
            }`}
          >
            Annual
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              Save 20%
            </span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, i) => {
            const price =
              typeof tier.price[billingPeriod] === 'number'
                ? tier.price[billingPeriod]
                : tier.price[billingPeriod]

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: durations.slow, delay: i * 0.1 }}
                className={`relative rounded-2xl ${
                  tier.highlighted
                    ? 'border-2 border-clarity-500/50 scale-105 z-10'
                    : 'border border-white/10'
                } bg-surface-800 overflow-hidden`}
              >
                {/* Highlighted badge */}
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <div className="px-4 py-1 bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white text-sm font-semibold rounded-b-lg flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Glow effect */}
                {tier.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-b from-clarity-500/10 to-transparent pointer-events-none" />
                )}

                <div className="p-8 pt-12">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {tier.description}
                  </p>

                  <div className="mb-8">
                    {typeof price === 'number' ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-white">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-gray-400 text-lg">
                            /{billingPeriod === 'annual' ? 'mo' : 'month'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {price}
                      </span>
                    )}
                    {billingPeriod === 'annual' &&
                      typeof price === 'number' &&
                      price > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Billed annually (${price * 12}/year)
                        </p>
                      )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 p-0.5 rounded-full bg-clarity-500/20">
                          <Check className="w-4 h-4 text-clarity-400" />
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.href}
                    className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white hover:from-clarity-400 hover:to-cosmic-400 shadow-lg shadow-clarity-500/20'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: durations.slow }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
