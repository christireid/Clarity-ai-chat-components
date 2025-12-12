'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { durations } from '@/lib/constants'

const faqs = [
  {
    question: 'Is there a free tier?',
    answer:
      'Yes! The Starter tier is completely free with 15+ core components. Use it forever for learning and prototyping. Pro and Enterprise plans come with a 30-day money-back guarantee.',
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
      'Yes, but you need an Enterprise license for SaaS products. Pro licenses are for end-user applications only.',
  },
  {
    question: "What's the difference between Annual and Lifetime?",
    answer:
      'Annual gives you 1 year of updates and renews automatically. Lifetime gives you perpetual updates for the current major version (e.g., v1.x) with a one-time payment.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Yes! We offer a 30-day money-back guarantee on all Pro and Enterprise plans. No questions asked.',
  },
  {
    question: 'Can I upgrade from Pro to Enterprise?',
    answer:
      "Absolutely! We'll credit your Pro license toward the first year of Enterprise. Contact us for upgrade pricing.",
  },
]

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: durations.moderate, delay: index * 0.05 }}
      className="glass-card border border-white/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-white pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: durations.fast }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-clarity-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: durations.moderate }}
          >
            <div className="px-6 pb-6">
              <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-surface-900">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cosmic-500/50 to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-lg text-gray-400">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* More questions CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: durations.slow }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl glass-card border border-white/10">
            <Sparkles className="w-5 h-5 text-clarity-400" />
            <span className="text-gray-400">Still have questions?</span>
            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-clarity-400 hover:text-clarity-300 font-semibold transition-colors"
            >
              Ask on GitHub
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
