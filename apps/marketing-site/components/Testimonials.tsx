'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { Star } from 'lucide-react'
import { durations } from '@/lib/constants'

const testimonials = [
  {
    content:
      'Clarity Chat was a game-changer. We passed our HIPAA audit with flying colors, and patients love the accessibility features. The money we saved on development went straight into improving our AI models.',
    author: 'Dr. Michael Rodriguez',
    role: 'CTO',
    company: 'HealthAI',
    stats: '$150K saved, 5 weeks to launch',
    gradient: 'from-clarity-500 to-cyan-500',
  },
  {
    content:
      'We were quoted $300K and 12 months by agencies. With Clarity Chat Enterprise, we launched in 2 months and saved $400K. The ROI was immediate.',
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechCorp',
    stats: '$400K saved, 8 weeks vs 12 months',
    gradient: 'from-cosmic-500 to-purple-500',
  },
  {
    content:
      "Clarity Chat paid for itself in 3 days. We've seen $2.4M in additional revenue just this quarter. The ROI is insane.",
    author: 'David Park',
    role: 'VP of Product',
    company: 'ShopSmart',
    stats: '24,000% ROI, $2.4M revenue impact',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    content:
      'As a startup with limited resources, Clarity Chat was a no-brainer. We got enterprise-quality components at startup pricing. That $499 license enabled a $3M fundraise.',
    author: 'Emily Watson',
    role: 'Founder & CEO',
    company: 'EduTech',
    stats: 'Enabled $3M Series A raise',
    gradient: 'from-clarity-500 to-cosmic-500',
  },
  {
    content:
      "The ROI was clear within the first month. We're handling 80% more queries with fewer agents, and customers are happier than ever.",
    author: 'James Liu',
    role: 'CEO',
    company: 'FinanceFlow',
    stats: '80% automation, $125K/year savings',
    gradient: 'from-cosmic-500 to-pink-500',
  },
  {
    content:
      "Our developer experience went from confusing to delightful overnight. The AI assistant answers questions we didn't even think to document.",
    author: 'Alex Thompson',
    role: 'Head of Developer Relations',
    company: 'DevTools Inc',
    stats: '60% faster onboarding',
    gradient: 'from-pink-500 to-clarity-500',
  },
]

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: durations.slow, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${testimonial.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
      />

      <div className="relative glass-card p-6 border border-white/10 hover:border-white/20 transition-all h-full flex flex-col">
        {/* Star rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-gray-300 mb-6 leading-relaxed flex-grow">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}
          >
            {testimonial.author
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="font-semibold text-white">{testimonial.author}</div>
            <div className="text-sm text-gray-400">
              {testimonial.role}, {testimonial.company}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-4 border-t border-white/10">
          <div
            className={`text-sm font-semibold bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}
          >
            {testimonial.stats}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 bg-surface-950"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-clarity-500/50 to-transparent" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-clarity-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cosmic-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: durations.slow }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-clarity-500/10 border border-clarity-500/20 text-clarity-400 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Teams Who
            <span className="gradient-text"> Ship Fast</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real companies, real results. See how teams save hundreds of
            thousands and launch in weeks, not months.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
