'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import Image from 'next/image'

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Clarity Chat cut our development time by 60%. The components are polished, accessible, and just work out of the box.',
    author: 'Sarah Chen',
    role: 'Lead Developer',
    company: 'TechCorp',
  },
  {
    quote:
      "Best React chat library I've used. The TypeScript support is excellent and the documentation is crystal clear.",
    author: 'Marcus Rodriguez',
    role: 'Senior Engineer',
    company: 'StartupXYZ',
  },
  {
    quote:
      'The accessibility features are top-notch. Finally, a chat UI that works perfectly for all our users.',
    author: 'Priya Patel',
    role: 'Product Manager',
    company: 'Enterprise Inc',
  },
  {
    quote:
      'Token optimization saved us $8K/month in API costs. The ROI was immediate and the integration took just 2 hours.',
    author: 'David Kim',
    role: 'CTO',
    company: 'AI Solutions Ltd',
  },
  {
    quote:
      'Migrated from Vercel AI SDK in a weekend. The compare page made the decision easy - more features, same simplicity.',
    author: 'Emily Watson',
    role: 'Full Stack Developer',
    company: 'InnovateTech',
  },
  {
    quote:
      "Our enterprise clients love the built-in RAG and security features. It's the complete package for production AI apps.",
    author: 'James Morrison',
    role: 'Solutions Architect',
    company: 'GlobalBank',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
}

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container-docs">
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
            Loved by Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durations.slow, delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Join thousands of developers building beautiful chat experiences
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{
                scale: 1.03,
                y: -8,
                transition: { duration: durations.normal, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              className="relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-500/50 transition-all hover:shadow-xl overflow-hidden"
            >
              {/* MessageSquare Icon */}
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: durations.slow }}
              >
                <MessageSquare className="w-8 h-8 text-brand-500/20 mb-4" />
              </motion.div>

              {/* Quote */}
              <p className="text-text-secondary mb-6 leading-relaxed relative z-10 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {testimonial.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </motion.div>
                <div>
                  <div className="font-semibold text-text-primary">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Animated Gradient Background */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: durations.moderate }}
              />

              {/* Subtle Glow on Hover */}
              <motion.div
                className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 blur-md pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: durations.moderate }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
