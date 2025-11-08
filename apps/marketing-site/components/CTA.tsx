import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-brand-600 to-purple-600 py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6">
          <Sparkles className="h-8 w-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Ship Your AI Chat App?
        </h2>

        {/* Description */}
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Join 1,000+ developers building amazing AI chat experiences. Start
          free, upgrade when you're ready. 30-day money-back guarantee.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-brand-600 shadow-lg hover:bg-gray-50 transition-all hover:scale-105"
          >
            View Pricing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all"
          >
            Read Documentation
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}

