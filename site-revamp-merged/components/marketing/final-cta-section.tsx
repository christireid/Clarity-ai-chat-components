"use client"

import { motion } from "framer-motion"
import { ArrowRight, Github, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"

export function FinalCTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb gradient-orb-primary w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
      </div>
      <div className="absolute inset-0 radial-gradient-bg" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Headline */}
          <h2 className="text-headline font-bold mb-6">
            Ready to build
            <br />
            <span className="gradient-text">something amazing?</span>
          </h2>

          {/* Subheadline */}
          <p className="text-body-large text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers building the next generation of AI
            chat applications with Clarity Chat.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/docs/getting-started"
              className="cta-button px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://github.com/codeandclarity/clarity-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </Link>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/docs"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Documentation</span>
            </Link>
            <Link
              href="#contact"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Contact us</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FinalCTASection
