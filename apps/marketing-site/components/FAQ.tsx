'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! The Free tier is fully functional with 15+ core components. You can use it forever for learning and prototyping. Pro and Enterprise plans come with a 30-day money-back guarantee.',
  },
  {
    question: 'What happens when my annual license expires?',
    answer:
      "You can continue using the version you have, but won't receive updates or support. Simply renew to continue receiving the latest features and support.",
  },
  {
    question: 'Can I use this in client projects?',
    answer:
      'Yes! With a Pro or Enterprise license, you can build unlimited projects for clients. Each developer working with Clarity Chat needs their own seat.',
  },
  {
    question: 'Do I need a license for end users?',
    answer:
      'No! Only developers who access the source code need licenses. Your end users (people using your application) do not need any license.',
  },
  {
    question: 'Can I use this in a SaaS product?',
    answer:
      "Yes, but you need an Enterprise license for SaaS products. Pro licenses are for end-user applications only.",
  },
  {
    question: 'What's the difference between Annual and Lifetime?',
    answer:
      'Annual gives you 1 year of updates and renews automatically. Lifetime gives you perpetual updates for the current major version (e.g., v1.x) with a one-time payment.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Yes! We offer a 30-day money-back guarantee on all Pro and Enterprise plans. Contact us at support@codeclarity.ai for refunds.',
  },
  {
    question: 'Can I upgrade from Pro to Enterprise?',
    answer:
      'Absolutely! We'll credit your Pro license toward the first year of Enterprise. Contact sales@codeclarity.ai for upgrade pricing.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-brand-600 mb-2">FAQ</h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Have a question? We've got answers.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* More questions CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Contact our team
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Link({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  )
}


