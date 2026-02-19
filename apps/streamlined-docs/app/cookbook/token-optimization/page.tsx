import { Metadata } from 'next'
import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  Zap,
  Code2,
  ShoppingCart,
  MessageSquare,
  ArrowRight,
  DollarSign,
  Server,
  Boxes,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { durations } from '@/lib/animations'

export const metadata: Metadata = {
  title: 'Token Optimization Cookbook | 50-90% Cost Reduction Recipes',
  description:
    'Real-world recipes for reducing AI costs by 50-90% through provider caching, token compression, and smart model routing. Robust code examples with cost analysis, performance benchmarks, and implementation guides for e-commerce, customer support, and code assistants.',
  keywords: [
    'token optimization',
    'cost reduction',
    '50-70% savings',
    'provider caching',
    'model routing',
    'compression',
    'AI optimization',
    'LLM cost reduction',
    'token compression',
    'production AI',
  ],
  openGraph: {
    title: 'Token Optimization Cookbook - 50-90% AI Cost Reduction',
    description:
      'Real-world recipes for massive AI cost savings. Provider caching (90%), compression (50-70%), and smart routing strategies with production code examples.',
    type: 'website',
    url: '/cookbook/token-optimization',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Optimization Cookbook',
    description:
      '6 robust recipes for 50-90% AI cost reduction. Provider caching, compression, and smart routing strategies.',
  },
}

'use client'

/**
 * Token Optimization Cookbook - Hero Recipes Index
 *
 * Landing page for token optimization cookbook recipes showcasing
 * real-world cost reduction strategies achieving 50-90% savings.
 */

interface Recipe {
  name: string
  slug: string
  description: string
  icon: React.ElementType
  savings: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  timeToImplement: string
  category: string
}

const recipes: Recipe[] = [
  {
    name: 'Provider-Native Caching with Anthropic',
    slug: 'provider-caching-anthropic',
    description:
      'Reduce costs by 90% using Anthropic\'s prompt caching for repeated context. Perfect for long system prompts and retrieval-augmented generation (RAG).',
    icon: Server,
    savings: '90%',
    difficulty: 'Beginner',
    timeToImplement: '15 min',
    category: 'Caching',
  },
  {
    name: 'E-commerce Product Assistant Optimization',
    slug: 'ecommerce-optimization',
    description:
      'Multi-strategy optimization for e-commerce product recommendations combining caching, compression, and smart routing to reduce costs by 85%.',
    icon: ShoppingCart,
    savings: '85%',
    difficulty: 'Intermediate',
    timeToImplement: '45 min',
    category: 'Use Case',
  },
  {
    name: 'Customer Support Cost Reduction',
    slug: 'customer-support-optimization',
    description:
      'Optimize customer support chatbots with tiered caching and model routing. Achieve 80% cost reduction while maintaining response quality.',
    icon: MessageSquare,
    savings: '80%',
    difficulty: 'Intermediate',
    timeToImplement: '30 min',
    category: 'Use Case',
  },
  {
    name: 'Code Assistant Token Optimization',
    slug: 'code-assistant-optimization',
    description:
      'Reduce token usage for code generation assistants by 75% using intelligent compression and context pruning strategies.',
    icon: Code2,
    savings: '75%',
    difficulty: 'Advanced',
    timeToImplement: '60 min',
    category: 'Use Case',
  },
  {
    name: 'Model Routing for Cost-Optimal Performance',
    slug: 'model-routing-cost-optimal',
    description:
      'Automatically route simple queries to GPT-3.5 and complex queries to GPT-4 based on complexity analysis. Save 70% while maintaining quality.',
    icon: Boxes,
    savings: '70%',
    difficulty: 'Intermediate',
    timeToImplement: '40 min',
    category: 'Routing',
  },
  {
    name: 'Compression Strategy Comparison',
    slug: 'compression-comparison',
    description:
      'Compare LLMLingua, extractive, and adaptive compression strategies across different use cases. Benchmarks show 50-70% token reduction.',
    icon: Zap,
    savings: '50-70%',
    difficulty: 'Advanced',
    timeToImplement: '90 min',
    category: 'Compression',
  },
]

const categories = [...new Set(recipes.map((r) => r.category))]

const difficultyColors = {
  Beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export default function TokenOptimizationCookbookPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <TrendingDown className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold">
              50-90% Cost Reduction
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Token Optimization Cookbook
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Real-world recipes for reducing AI API costs by 50-90%. Each recipe
            includes robust code, cost analysis, and performance
            benchmarks.
          </p>
        </motion.header>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              6
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Hero Recipes
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
              90%
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Max Savings
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              15m
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Fastest Setup
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-900/50 rounded-xl p-4 border border-neutral-200 dark:border-neutral-800">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              100%
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Stable
            </div>
          </div>
        </motion.div>

        {/* Recipe Cards */}
        <div className="space-y-12">
          {categories.map((category) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {category}
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {recipes
                  .filter((r) => r.category === category)
                  .map((recipe, index) => {
                    const Icon = recipe.icon
                    return (
                      <Link
                        key={recipe.slug}
                        href={`/cookbook/token-optimization/${recipe.slug}`}
                        className={cn(
                          'group relative rounded-xl border bg-card text-card-foreground p-6',
                          'shadow-sm hover:shadow-lg transition-all duration-300',
                          'border-border/50 hover:border-purple-500/30',
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500'
                        )}
                      >
                        {/* Gradient glow on hover */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="relative">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
                              <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="px-3 py-1 text-sm font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                                {recipe.savings}
                              </span>
                              <span
                                className={cn(
                                  'px-2 py-0.5 text-xs font-medium rounded-full',
                                  difficultyColors[recipe.difficulty]
                                )}
                              >
                                {recipe.difficulty}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {recipe.name}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {recipe.description}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              ⏱️ {recipe.timeToImplement}
                            </div>
                            <div className="flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                              View Recipe
                              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: durations.moderate,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-200 dark:border-purple-800"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Need Custom Optimization?
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore the complete token optimization system with 87 APIs for
              advanced use cases and enterprise deployments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/token-optimization"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <TrendingDown className="w-4 h-4" />
                Explore Full System
              </Link>
              <Link
                href="/guides/token-optimization"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg font-medium border border-neutral-200 dark:border-neutral-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Read Full Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
