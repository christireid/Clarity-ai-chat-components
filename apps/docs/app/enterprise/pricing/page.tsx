'use client'

import React from 'react'
import Link from 'next/link'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import {
  CheckCircle2,
  Sparkles,
  Headphones,
  Users,
  Building,
  Zap,
  Star,
} from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header text-center">
        <span className="docs-badge">Pricing</span>
        <h1 className="text-4xl md:text-5xl font-bold">
          Simple, Transparent Pricing
        </h1>
        <p className="docs-lead text-xl max-w-2xl mx-auto">
          Start free, scale as you grow. No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing Cards */}
      <section className="my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Tier */}
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            description="Perfect for personal projects and learning"
            features={[
              '15+ Core Components',
              'MIT License',
              'TypeScript Support',
              'Basic Theming',
              'Community Support',
              'Unlimited Developers',
            ]}
            ctaText="Get Started"
            ctaHref="/learn/quick-start"
            variant="default"
          />

          {/* Pro Individual */}
          <PricingCard
            name="Pro Individual"
            price="$149"
            period="/year"
            lifetimePrice="$499"
            description="For freelancers and indie developers"
            features={[
              'Everything in Free',
              '55+ Premium Components',
              '15+ Professional Themes',
              '4 AI Provider Adapters',
              'Email Support (48h)',
              'VS Code Extension',
            ]}
            ctaText="Buy Now"
            ctaHref="/enterprise/checkout?plan=pro-individual"
            variant="default"
          />

          {/* Pro Team - Featured */}
          <PricingCard
            name="Pro Team"
            price="$499"
            period="/year"
            lifetimePrice="$1,499"
            description="For startups and small teams"
            features={[
              'Everything in Pro Individual',
              '5 Developer Seats (+$99/seat)',
              'Priority Support (24h)',
              'CLI Tools',
              'Team Dashboard',
              'Figma UI Kit',
            ]}
            ctaText="Buy Now"
            ctaHref="/enterprise/checkout?plan=pro-team"
            variant="featured"
            badge="Most Popular"
          />

          {/* Enterprise */}
          <PricingCard
            name="Enterprise"
            price="$2,499"
            period="/year"
            description="For companies building at scale"
            features={[
              '70+ Components (Everything)',
              '10-Unlimited Seats',
              'Dedicated Support (4h SLA)',
              'SSO & RBAC',
              'Vector Databases & RAG',
              'White-Label Branding',
              'Custom Integrations',
              'Named Account Manager',
            ]}
            ctaText="Contact Sales"
            ctaHref="/enterprise/contact"
            variant="enterprise"
          />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="docs-section">
        <h2>Feature Comparison</h2>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-4">Feature</th>
                <th className="p-4 text-center">Free</th>
                <th className="p-4 text-center">Pro Individual</th>
                <th className="p-4 text-center bg-blue-50/50 dark:bg-blue-950/30">
                  Pro Team
                </th>
                <th className="p-4 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                feature="Core Components"
                values={['15+', '15+', '15+', '15+']}
              />
              <ComparisonRow
                feature="Premium Components"
                values={[false, '55+', '55+', '70+']}
              />
              <ComparisonRow
                feature="AI Provider Adapters"
                values={[false, '4', '4', 'Unlimited']}
              />
              <ComparisonRow
                feature="Developer Seats"
                values={['Unlimited', '1', '5+', '10-Unlimited']}
              />
              <ComparisonRow
                feature="Support"
                values={['Community', 'Email (48h)', 'Email (24h)', 'Dedicated (4h)']}
              />
              <ComparisonRow
                feature="SSO/SAML"
                values={[false, false, false, true]}
              />
              <ComparisonRow
                feature="Vector Databases"
                values={[false, false, false, true]}
              />
              <ComparisonRow
                feature="White-Label"
                values={[false, false, false, true]}
              />
              <ComparisonRow
                feature="Audit Logging"
                values={[false, false, false, true]}
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="docs-section">
        <h2>Frequently Asked Questions</h2>
        <div className="space-y-6">
          <FAQ
            question="What's included in the free tier?"
            answer="The free tier includes all core components (15+) under the MIT license. You can use them in unlimited personal and commercial projects with unlimited developers."
          />
          <FAQ
            question="Can I upgrade later?"
            answer="Yes! You can upgrade at any time and only pay the difference. Your existing projects will continue to work."
          />
          <FAQ
            question="What's the difference between yearly and lifetime?"
            answer="Yearly subscriptions include updates and support for one year. Lifetime licenses include all updates forever with one year of support."
          />
          <FAQ
            question="Do you offer refunds?"
            answer="Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
          />
          <FAQ
            question="Can I add more seats to Pro Team?"
            answer="Yes, additional seats are $99/year per developer. Contact us for volume discounts on 10+ seats."
          />
        </div>
      </section>

      {/* Installation */}
      <section className="docs-section">
        <h2>Get Started Free</h2>
        <p className="mb-4">
          Install the free tier and start building immediately:
        </p>
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/primitives @clarity-chat/types`}
        />
      </section>

      {/* CTA */}
      <section className="my-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Need a custom plan?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          We offer custom pricing for large teams, educational institutions, and
          non-profits. Let's discuss your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/enterprise/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Headphones className="w-5 h-5" />
            Contact Sales
          </Link>
          <Link
            href="/enterprise/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Book a Demo
          </Link>
        </div>
      </section>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  lifetimePrice,
  description,
  features,
  ctaText,
  ctaHref,
  variant = 'default',
  badge,
}: {
  name: string
  price: string
  period: string
  lifetimePrice?: string
  description: string
  features: string[]
  ctaText: string
  ctaHref: string
  variant?: 'default' | 'featured' | 'enterprise'
  badge?: string
}) {
  const isFeatured = variant === 'featured'
  const isEnterprise = variant === 'enterprise'

  return (
    <div
      className={`relative flex flex-col p-6 rounded-2xl border-2 ${
        isFeatured
          ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900 shadow-lg scale-105'
          : isEnterprise
            ? 'border-purple-300 dark:border-purple-700 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900'
            : 'border-border bg-card'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
            <Star className="w-3 h-3" />
            {badge}
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        {lifetimePrice && (
          <p className="text-sm text-muted-foreground mt-1">
            or {lifetimePrice} lifetime
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors ${
          isFeatured
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : isEnterprise
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  )
}

function ComparisonRow({
  feature,
  values,
}: {
  feature: string
  values: (string | boolean)[]
}) {
  return (
    <tr className="border-b border-border hover:bg-muted/50">
      <td className="p-4 font-medium">{feature}</td>
      {values.map((value, i) => (
        <td
          key={i}
          className={`p-4 text-center ${i === 2 ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}
        >
          {typeof value === 'boolean' ? (
            value ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          ) : (
            value
          )}
        </td>
      ))}
    </tr>
  )
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  )
}
