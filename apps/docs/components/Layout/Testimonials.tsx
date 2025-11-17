'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
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
    quote: "Clarity Chat cut our development time by 60%. The components are polished, accessible, and just work out of the box.",
    author: "Sarah Chen",
    role: "Lead Developer",
    company: "TechCorp",
  },
  {
    quote: "Best React chat library I've used. The TypeScript support is excellent and the documentation is crystal clear.",
    author: "Marcus Rodriguez",
    role: "Senior Engineer",
    company: "StartupXYZ",
  },
  {
    quote: "The accessibility features are top-notch. Finally, a chat UI that works perfectly for all our users.",
    author: "Priya Patel",
    role: "Product Manager",
    company: "Enterprise Inc",
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Testimonials() {
  return (
    <section className="py-24">
      <div className="container-docs">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Loved by Developers</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Join thousands of developers building beautiful chat experiences
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
              className="relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-500/50 transition-all hover:shadow-lg"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-brand-500/20 mb-4" />

              {/* Quote */}
              <p className="text-text-secondary mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-text-primary">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
