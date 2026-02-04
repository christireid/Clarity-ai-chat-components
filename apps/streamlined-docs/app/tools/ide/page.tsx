'use client'

/**
 * IDE Tools - Overview Page
 *
 * Integration guides for popular IDEs
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Code2, Download, BookOpen, Zap, Settings, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'

interface IDETool {
  name: string
  slug: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  isReady: boolean
}

const ideTools: IDETool[] = [
  {
    name: 'VSCode',
    slug: 'vscode',
    description: 'Complete VSCode setup with TypeScript IntelliSense, snippets, and debugging',
    icon: Code2,
    features: [
      'TypeScript IntelliSense configuration',
      '30+ code snippets for components & hooks',
      'Auto-import settings',
      'Extension recommendations',
      'Debugging configuration',
      'Workspace settings',
    ],
    isReady: true,
  },
  {
    name: 'WebStorm',
    slug: 'webstorm',
    description: 'JetBrains WebStorm configuration for Clarity Chat development',
    icon: Code2,
    features: [
      'Live templates',
      'File watchers',
      'Run configurations',
      'TypeScript settings',
    ],
    isReady: false,
  },
  {
    name: 'Vim/Neovim',
    slug: 'vim',
    description: 'LSP and plugin configuration for Vim/Neovim',
    icon: Code2,
    features: [
      'LSP setup',
      'TypeScript support',
      'Snippets configuration',
      'Plugin recommendations',
    ],
    isReady: false,
  },
]

export default function IDEToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumbs */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Tools', href: '/tools' },
              { label: 'IDE Setup', href: '/tools/ide' },
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IDE Setup Guides</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Complete IDE configurations for optimal development experience with Clarity AI Chat
            Components. Set up IntelliSense, snippets, debugging, and more.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">30+ Snippets</h3>
            </div>
            <p className="text-sm text-gray-600">
              Code snippets for components, hooks, tests, and utilities
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Full Configuration</h3>
            </div>
            <p className="text-sm text-gray-600">
              Complete workspace settings, tasks, and debugging configs
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">TypeScript IntelliSense</h3>
            </div>
            <p className="text-sm text-gray-600">
              Auto-imports, type checking, and intelligent code completion
            </p>
          </div>
        </motion.div>

        {/* IDE Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ideTools.map((tool, index) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <Link
                href={tool.isReady ? `/tools/ide/${tool.slug}` : '#'}
                className={cn(
                  'block h-full bg-white rounded-lg border-2 transition-all duration-300',
                  tool.isReady
                    ? 'border-gray-200 hover:border-blue-500 hover:shadow-lg'
                    : 'border-gray-100 opacity-60 cursor-not-allowed'
                )}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'p-3 rounded-lg',
                          tool.isReady ? 'bg-blue-50' : 'bg-gray-50'
                        )}
                      >
                        <tool.icon
                          className={cn(
                            'w-6 h-6',
                            tool.isReady ? 'text-blue-600' : 'text-gray-400'
                          )}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{tool.name}</h2>
                        {!tool.isReady && (
                          <span className="inline-block mt-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                    {tool.isReady && <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{tool.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h3>
                    <ul className="space-y-1">
                      {tool.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  {tool.isReady && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <BookOpen className="w-4 h-4" />
                        <span>View Setup Guide</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 p-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Start</h3>
              <p className="text-gray-600 mb-4">
                Get started with VSCode setup in minutes. Download configuration files and install
                recommended extensions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tools/ide/vscode"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  VSCode Setup Guide
                </Link>
                <a
                  href="/tools/ide/vscode#code-snippets"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  View Snippets
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/docs/development-guide"
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Development Guide</h4>
              <p className="text-sm text-gray-600">
                Complete guide for developing with Clarity Chat
              </p>
            </Link>
            <Link
              href="/reference/components"
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Component Reference</h4>
              <p className="text-sm text-gray-600">Browse all available components and props</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
