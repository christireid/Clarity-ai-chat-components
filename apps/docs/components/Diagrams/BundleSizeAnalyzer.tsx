'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, TrendingDown, TrendingUp, Info } from 'lucide-react'

interface BundleSizeData {
  component: string
  size: number
  gzipped: number
  category: 'core' | 'ui' | 'ai' | 'utils'
}

const mockBundleData: BundleSizeData[] = [
  { component: 'ChatWindow', size: 15.2, gzipped: 4.8, category: 'core' },
  { component: 'Message', size: 8.5, gzipped: 2.9, category: 'ui' },
  { component: 'MessageList', size: 12.1, gzipped: 3.7, category: 'ui' },
  { component: 'MessageInput', size: 9.8, gzipped: 3.2, category: 'ui' },
  { component: 'TypingIndicator', size: 4.2, gzipped: 1.5, category: 'ui' },
  { component: 'useChat', size: 6.7, gzipped: 2.1, category: 'core' },
  { component: 'useMessages', size: 5.3, gzipped: 1.8, category: 'core' },
  { component: 'useStreaming', size: 7.9, gzipped: 2.4, category: 'ai' },
  { component: 'useTyping', size: 3.8, gzipped: 1.3, category: 'utils' },
  {
    component: 'useKeyboardShortcuts',
    size: 4.5,
    gzipped: 1.6,
    category: 'utils',
  },
]

export function BundleSizeAnalyzer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')

  const categories = [
    { id: 'all', name: 'All Components', color: 'bg-blue-500' },
    { id: 'core', name: 'Core', color: 'bg-purple-500' },
    { id: 'ui', name: 'UI Components', color: 'bg-green-500' },
    { id: 'ai', name: 'AI Features', color: 'bg-orange-500' },
    { id: 'utils', name: 'Utilities', color: 'bg-gray-500' },
  ]

  const filteredData =
    selectedCategory === 'all'
      ? mockBundleData
      : mockBundleData.filter((item) => item.category === selectedCategory)

  const totalSize = filteredData.reduce((sum, item) => sum + item.size, 0)
  const totalGzipped = filteredData.reduce((sum, item) => sum + item.gzipped, 0)

  const formatSize = (size: number) => `${size.toFixed(1)} KB`

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-bg-secondary to-bg-tertiary">
      <div className="container-docs">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Optimized for Performance
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Every component is tree-shakeable and optimized for minimal bundle
            size. Only load what you use.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-primary border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold">Bundle Size</h3>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {formatSize(totalSize)}
              </div>
              <p className="text-sm text-text-secondary">
                Total component size
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-bg-primary border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold">Compressed</h3>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {formatSize(totalGzipped)}
              </div>
              <p className="text-sm text-text-secondary">Gzipped size</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-primary border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold">Compression</h3>
              </div>
              <div className="text-3xl font-bold text-purple-500 mb-2">
                {Math.round((1 - totalGzipped / totalSize) * 100)}%
              </div>
              <p className="text-sm text-text-secondary">Size reduction</p>
            </motion.div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Component List */}
          <div className="bg-bg-primary border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Component Breakdown</h3>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Info className="w-4 h-4" />
                  <span>All sizes are approximate and may vary</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {filteredData.map((item, index) => (
                <motion.div
                  key={item.component}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          categories.find((c) => c.id === item.category)
                            ?.color || 'bg-gray-500'
                        }`}
                      />
                      <span className="font-medium">{item.component}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatSize(item.size)}
                        </div>
                        <div className="text-text-secondary">original</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-500">
                          {formatSize(item.gzipped)}
                        </div>
                        <div className="text-text-secondary">gzipped</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optimization Tips */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
              Optimization Tips
            </h4>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  Use tree-shaking imports:{' '}
                  <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">
                    {`import { ChatWindow } from '@clarity-chat/react'`}
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>
                  Enable Gzip compression on your server for 60-80% size
                  reduction
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Use code splitting for large applications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Monitor bundle size with tools like Bundle Analyzer</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
