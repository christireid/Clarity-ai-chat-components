import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, DollarSign, Shield, Briefcase, TrendingUp, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commercial Documentation',
  description: 'Business documentation, pricing, licensing, and sales materials for Clarity Chat',
}

const sections = [
  {
    title: 'Pricing & Licensing',
    icon: DollarSign,
    description: 'Pricing tiers, licensing options, and commercial terms',
    items: [
      { title: 'Pricing Guide', href: '/commercial/pricing', description: 'Complete pricing information and tier comparison' },
      { title: 'Pro License', href: '/commercial/license-pro', description: 'Commercial license for Pro tier' },
      { title: 'Enterprise License', href: '/commercial/license-enterprise', description: 'Enterprise agreement and terms' },
      { title: 'Terms of Service', href: '/commercial/terms-of-service', description: 'Terms and conditions' },
      { title: 'Privacy Policy', href: '/commercial/privacy-policy', description: 'GDPR/CCPA compliant privacy policy' },
    ],
  },
  {
    title: 'Sales & Marketing',
    icon: Briefcase,
    description: 'Sales materials and marketing resources',
    items: [
      { title: 'Sales Deck', href: '/commercial/sales-deck', description: 'Presentation materials and demo scripts' },
      { title: 'Case Studies', href: '/commercial/case-studies', description: 'Customer success stories and ROI examples' },
      { title: 'Implementation Guide', href: '/commercial/implementation-guide', description: 'Onboarding and implementation resources' },
    ],
  },
]

export default function CommercialPage() {
  return (
    <div className="container-docs py-12">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Commercial Documentation</h1>
          <p className="text-xl text-text-secondary">
            Business documentation, pricing, licensing, and sales materials for Clarity Chat.
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.title}
                className="border border-border rounded-xl p-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-text-secondary">{section.description}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group p-4 rounded-lg border border-border hover:border-brand-500 hover:bg-bg-secondary transition-all"
                    >
                      <div className="font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 mb-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {item.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-xl border border-brand-200 dark:border-brand-800">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-text-secondary mb-6">
            Have questions about pricing, licensing, or implementation? We're here to help.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="mailto:sales@clarity-chat.dev"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Contact Sales
            </a>
            <a
              href="https://discord.gg/clarity-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary rounded-lg font-semibold transition-colors border border-border"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
