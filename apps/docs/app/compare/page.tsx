'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Check,
  X,
  Minus,
  ArrowRight,
  Zap,
  Shield,
  Palette,
  Accessibility,
  Code,
  Package,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { FeatureMatrix } from '@/components/Diagrams/FeatureMatrix'
import { PerformanceComparison } from '@/components/Diagrams/PerformanceComparison'

export default function ComparePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Clarity Chat vs{' '}
          <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
            Alternatives
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-secondary max-w-3xl"
        >
          A fair, honest comparison to help you choose the right tool for your
          project. We built Clarity Chat because existing solutions didn't meet
          our needs—here's why.
        </motion.p>
      </div>

      {/* TL;DR Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-200 dark:border-brand-800"
      >
        <h2 className="text-2xl font-bold mb-4">
          TL;DR: When to Use Clarity Chat
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5" /> Use Clarity Chat if you need:
            </h3>
            <ul className="space-y-2 text-text-secondary">
              <li>• Production-ready React chat components</li>
              <li>• Full TypeScript support with IntelliSense</li>
              <li>• Enterprise features (RBAC, multi-tenancy, audit logs)</li>
              <li>• WCAG AAA accessibility compliance</li>
              <li>• Extensive customization without fighting the framework</li>
              <li>
                • Performance optimization for 1000+ message conversations
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
              <Minus className="w-5 h-5" /> Consider alternatives if you:
            </h3>
            <ul className="space-y-2 text-text-secondary">
              <li>• Need a Python-only solution (→ Gradio, Chainlit)</li>
              <li>• Want LangChain integration (→ LangChain templates)</li>
              <li>• Need just API utilities (→ Vercel AI SDK)</li>
              <li>• Building a quick prototype (any option works)</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* What Sets Us Apart */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">What Sets Clarity Apart</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Package className="w-6 h-6" />,
              title: '70+ Production Components',
              description:
                'Not just a few primitives—complete solutions for chat windows, message lists, streaming indicators, file uploads, voice input, and more.',
              highlight: 'vs 5-10 components in alternatives',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Performance Optimized',
              description:
                'React.memo throughout, virtual scrolling for 1000+ messages, tree-shakeable exports. Built for real-world scale.',
              highlight: '60% faster renders',
            },
            {
              icon: <Accessibility className="w-6 h-6" />,
              title: 'True Accessibility',
              description:
                'WCAG AAA compliant, full keyboard navigation, screen reader tested. Not an afterthought.',
              highlight: 'The only AAA-compliant option',
            },
            {
              icon: <Palette className="w-6 h-6" />,
              title: '11 Built-in Themes',
              description:
                'Dark mode, high contrast, and brand-ready themes. CSS variables for easy customization.',
              highlight: 'vs 0-2 themes elsewhere',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Enterprise Ready',
              description:
                'RBAC, multi-tenancy, audit logging, PII detection. Features enterprises actually need.',
              highlight: 'Unique to Clarity',
            },
            {
              icon: <Code className="w-6 h-6" />,
              title: 'TypeScript First',
              description:
                'Not an afterthought—designed from day one with TypeScript. IntelliSense for every prop.',
              highlight: '100% type coverage',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-xl border border-border bg-bg-secondary hover:border-brand-300 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm mb-3">
                {feature.description}
              </p>
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/50 px-2 py-1 rounded">
                {feature.highlight}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Feature Matrix */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">
          Feature-by-Feature Comparison
        </h2>
        <p className="text-text-secondary mb-8">
          An honest look at what each solution offers. We've tried to be
          fair—check our work.
        </p>
        <FeatureMatrix />
      </motion.section>

      {/* Performance Comparison */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Performance Benchmarks</h2>
        <p className="text-text-secondary mb-8">
          Measured on real-world chat applications with 500+ messages.
        </p>
        <PerformanceComparison />
      </motion.section>

      {/* Individual Comparisons */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8">Detailed Comparisons</h2>

        <div className="space-y-8">
          {/* vs Vercel AI SDK */}
          <div className="p-6 rounded-xl border border-border bg-bg-secondary">
            <h3 className="text-xl font-bold mb-4">
              Clarity Chat vs Vercel AI SDK
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400 mb-2">
                  Vercel AI SDK is great for:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• API utilities and streaming helpers</li>
                  <li>• Next.js integration</li>
                  <li>• OpenAI/Anthropic adapters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400 mb-2">
                  Choose Clarity Chat when you need:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Complete UI components (not just hooks)</li>
                  <li>• Enterprise features</li>
                  <li>• Extensive customization</li>
                  <li>• Accessibility compliance</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              <strong>Pro tip:</strong> You can use Clarity Chat with Vercel AI
              SDK—they complement each other. Use Vercel's streaming utilities
              with Clarity's UI components.
            </p>
          </div>

          {/* vs LangChain */}
          <div className="p-6 rounded-xl border border-border bg-bg-secondary">
            <h3 className="text-xl font-bold mb-4">
              Clarity Chat vs LangChain UI Templates
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400 mb-2">
                  LangChain is great for:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Complex agent workflows</li>
                  <li>• RAG pipelines</li>
                  <li>• Python backends</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400 mb-2">
                  Choose Clarity Chat when you need:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Production-quality React UI</li>
                  <li>• TypeScript-first development</li>
                  <li>• UI beyond basic templates</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-text-secondary">
              <strong>Pro tip:</strong> Use LangChain for your backend
              orchestration and Clarity Chat for your frontend.
            </p>
          </div>

          {/* vs Gradio/Chainlit */}
          <div className="p-6 rounded-xl border border-border bg-bg-secondary">
            <h3 className="text-xl font-bold mb-4">
              Clarity Chat vs Gradio/Chainlit
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400 mb-2">
                  Gradio/Chainlit are great for:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Quick Python prototypes</li>
                  <li>• ML model demos</li>
                  <li>• Notebook-style interfaces</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-brand-600 dark:text-brand-400 mb-2">
                  Choose Clarity Chat when you need:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• React/Next.js integration</li>
                  <li>• Production deployment</li>
                  <li>• Custom branding and UX</li>
                  <li>• Enterprise requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Migration Guide CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-8 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 text-white"
      >
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Ready to Switch?</h2>
          <p className="text-brand-100 mb-6">
            We have migration guides to help you transition from Vercel AI SDK
            or other solutions. Most migrations take less than an hour.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/learn/migration/from-vercel-ai-sdk"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Migration Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn/quick-start"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors border border-white/20"
            >
              Quick Start
            </Link>
          </div>
        </div>
      </motion.section>
    </>
  )
}
