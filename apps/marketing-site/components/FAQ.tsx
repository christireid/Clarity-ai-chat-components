'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { durations } from '@/lib/constants'

const faqs = [
  {
    question: 'Is Clarity Chat free to use?',
    answer:
      'Yes! The entire library is MIT licensed and open source. All 170+ components are free to use in personal and commercial projects. Pro and Enterprise tiers offer priority support and additional services.',
  },
  {
    question: 'Which AI providers are supported?',
    answer:
      'We support OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), and Google AI (Gemini). Switching providers is a single prop change - no code rewrites needed.',
  },
  {
    question: 'How does the token optimization work?',
    answer:
      'We integrate with provider KV-cache APIs to avoid resending repeated context. The useTokenBudget hook tracks usage in real-time. Actual savings depend on your conversation patterns.',
  },
  {
    question: 'What is the bundle size?',
    answer:
      'The core library is 27KB gzipped. All exports are tree-shakeable, so you only bundle what you import. Check the npm package for current size.',
  },
  {
    question: 'Is TypeScript required?',
    answer:
      'No, but recommended. The library is written in TypeScript with strict mode. You get full IntelliSense and type checking, but JavaScript projects work fine too.',
  },
  {
    question: 'Can I customize the components?',
    answer:
      'Yes. All components accept className props and are built with Tailwind CSS. You can override styles, extend components, or use them as references for your own.',
  },
  {
    question: 'What does Pro support include?',
    answer:
      'Pro tier includes priority email support, private Slack channel access, Figma design kit, and early access to new features. The library itself remains MIT licensed.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Run npx create-clarity-chat@latest to scaffold a new project, or npm install @clarity-chat/react to add to an existing project. Check the docs for detailed guides.',
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
