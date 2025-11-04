'use client'

import Link from 'next/link'
import { ArrowRight, Github, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-brand-100 px-4 py-2 text-sm font-medium text-brand-700 mb-8 animate-fade-in">
            <Star className="w-4 h-4 mr-2 fill-current" />
            <span>Trusted by 1,000+ developers</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-slide-up">
            Ship AI Chat Interfaces
            <br />
            <span className="gradient-text">10-50x Faster</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300 mb-10 animate-slide-up animation-delay-100">
            Production-ready React components for AI chat. Save{' '}
            <span className="font-bold text-brand-600">$150K+</span> and{' '}
            <span className="font-bold text-brand-600">6 months</span> vs.
            building from scratch.
            <br />
            <span className="font-semibold">WCAG AAA certified.</span>{' '}
            Enterprise features included.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up animation-delay-200">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-brand-700 transition-all hover:scale-105"
            >
              View Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="https://github.com/christireid/Clarity-ai-chat-components"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 dark:border-gray-600 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:border-brand-500 hover:text-brand-600 transition-all"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>70+ Components</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>WCAG AAA Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>2,847% Avg ROI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>$144K Avg Savings</span>
            </div>
          </div>
        </div>

        {/* Hero image/demo */}
        <div className="mt-20 animate-scale-in animation-delay-300">
          <div className="mx-auto max-w-5xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-sm text-gray-400">
                Clarity Chat Demo
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8">
              {/* Placeholder for actual demo component */}
              <div className="aspect-video bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Interactive Demo Coming Soon
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Beautiful AI chat interface with 11 premium themes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-24 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 mb-2">70+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Components
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 mb-2">11</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Premium Themes
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 mb-2">97%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Cost Savings
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-600 mb-2">2.8K%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg ROI
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

