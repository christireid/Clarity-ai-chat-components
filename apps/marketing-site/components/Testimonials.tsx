'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'

const testimonials = [
  {
    content:
      'Clarity Chat was a game-changer. We passed our HIPAA audit with flying colors, and patients love the accessibility features. The money we saved on development went straight into improving our AI models.',
    author: 'Dr. Michael Rodriguez',
    role: 'CTO',
    company: 'HealthAI',
    avatar: '/avatars/michael.jpg',
    stats: '$150K saved, 5 weeks to launch',
  },
  {
    content:
      'We were quoted $300K and 12 months by agencies. With Clarity Chat Enterprise, we launched in 2 months and saved $400K. The ROI was immediate.',
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechCorp',
    avatar: '/avatars/sarah.jpg',
    stats: '$400K saved, 8 weeks vs 12 months',
  },
  {
    content:
      "Clarity Chat paid for itself in 3 days. We've seen $2.4M in additional revenue just this quarter. The ROI is insane.",
    author: 'David Park',
    role: 'VP of Product',
    company: 'ShopSmart',
    avatar: '/avatars/david.jpg',
    stats: '24,000% ROI, $2.4M revenue impact',
  },
  {
    content:
      'As a startup with limited resources, Clarity Chat was a no-brainer. We got enterprise-quality components at startup pricing. That $499 license enabled a $3M fundraise.',
    author: 'Emily Watson',
    role: 'Founder & CEO',
    company: 'EduTech',
    avatar: '/avatars/emily.jpg',
    stats: 'Enabled $3M Series A raise',
  },
  {
    content:
      "The ROI was clear within the first month. We're handling 80% more queries with fewer agents, and customers are happier than ever.",
    author: 'James Liu',
    role: 'CEO',
    company: 'FinanceFlow',
    avatar: '/avatars/james.jpg',
    stats: '80% automation, $125K/year savings',
  },
  {
    content:
      "Our developer experience went from confusing to delightful overnight. The AI assistant answers questions we didn't even think to document.",
    author: 'Alex Thompson',
    role: 'Head of Developer Relations',
    company: 'DevTools Inc',
    avatar: '/avatars/alex.jpg',
    stats: '60% faster onboarding',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-brand-600 mb-2">TESTIMONIALS</h2>
          <p className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by Developers
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real companies, real results. See how teams save time and money with Clarity Chat.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-white font-bold">
                  {testimonial.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-brand-600">{testimonial.stats}</div>
              </div>
            </div>
          ))}
        </div>

        {/* View case studies link */}
        <div className="mt-12 text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors"
          >
            Read full case studies
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
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


