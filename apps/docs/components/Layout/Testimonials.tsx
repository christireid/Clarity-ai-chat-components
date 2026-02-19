'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Users } from 'lucide-react'
import { durations } from '@/lib/animations'

/**
 * Testimonials section - currently displays a call-to-action for beta users
 * since we do not yet have real customer testimonials to show.
 *
 * When real testimonials are available, populate the testimonials array
 * with verified quotes from actual users who have given permission.
 */
export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 dark:opacity-15 pointer-events-none"
        aria-hidden="true"
      />
      {/* Radial gradient accent */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div className="container-docs relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.1 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-text-primary to-brand-500 bg-clip-text text-transparent"
          >
            Built for Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Clarity Chat is open source and in active development. Try it out and
            let us know what you think.
          </motion.p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: durations.slow, delay: 0.3 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative p-8 rounded-xl border border-border/50 bg-bg-primary text-center shadow-sm">
            <Users className="w-12 h-12 text-brand-500/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Join our early adopters
            </h3>
            <p className="text-text-secondary mb-6">
              We are looking for developers to try Clarity Chat and share their
              feedback. Your experience could be featured here.
            </p>
            <a
              href="https://github.com/christireid/Clarity-ai-chat-components/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Share your feedback
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
