import { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { DollarSign, FileText, Shield, Users, Briefcase, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commercial - Clarity Chat',
  description: 'Pricing, terms, privacy policy, and commercial information for Clarity Chat',
}

const commercialPages = [
  {
    slug: 'pricing',
    title: 'Pricing',
    description: 'Choose the plan that fits your needs. All plans include our core component library.',
    icon: DollarSign,
    color: 'text-green-500',
  },
  {
    slug: 'case-studies',
    title: 'Case Studies',
    description: 'See how teams are using Clarity Chat to build amazing AI chat experiences.',
    icon: Briefcase,
    color: 'text-blue-500',
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    description: 'Terms and conditions for using Clarity Chat products and services.',
    icon: FileText,
    color: 'text-purple-500',
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal information.',
    icon: Shield,
    color: 'text-red-500',
  },
  {
    slug: 'enterprise',
    title: 'Enterprise',
    description: 'Enterprise features, support, and custom solutions for large organizations.',
    icon: Users,
    color: 'text-orange-500',
  },
]

export default function CommercialPage() {
  return (
    <>
      <Breadcrumbs />
      
      <div className="docs-content">
        <div className="docs-header">
          <span className="docs-badge">Commercial</span>
          <h1>Commercial Information</h1>
          <p className="docs-lead">
            Pricing, terms, privacy policy, and enterprise solutions for Clarity Chat.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {commercialPages.map((page) => {
            const Icon = page.icon
            return (
              <Link
                key={page.slug}
                href={`/commercial/${page.slug}`}
                className="group border border-border rounded-lg p-6 hover:border-brand-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-bg-secondary ${page.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-brand-500 transition-colors">
                      {page.title}
                    </h2>
                    <p className="text-text-secondary text-sm mb-4">
                      {page.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-brand-500 font-medium text-sm">
                      View page
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 p-6 bg-bg-secondary rounded-lg border border-border">
          <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
          <p className="text-text-secondary mb-4">
            Have questions about pricing, licensing, or enterprise solutions? We're here to help.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="mailto:sales@clarity-chat.dev"
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Contact Sales
            </a>
            <a
              href="mailto:support@clarity-chat.dev"
              className="px-4 py-2 bg-bg-tertiary hover:bg-bg-secondary text-text-primary rounded-md text-sm font-medium transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
