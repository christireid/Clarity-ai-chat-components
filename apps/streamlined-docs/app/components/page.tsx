'use client'

/**
 * Component Gallery Page
 *
 * Visual showcase of all Clarity Chat components with filtering and search.
 */

import {
  ComponentGallery,
  sampleComponents,
} from '@/components/Docs/ComponentGallery'

export default function ComponentsPage() {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Components
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          Explore our collection of 30+ components for building AI chat
          interfaces. Each component is fully typed, accessible, and
          customizable.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">30+</div>
          <div className="text-blue-100">Components</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">15+</div>
          <div className="text-purple-100">Hooks</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">5</div>
          <div className="text-green-100">Providers</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">100%</div>
          <div className="text-orange-100">TypeScript</div>
        </div>
      </div>

      {/* Component Gallery */}
      <ComponentGallery
        components={sampleComponents}
        showSearch={true}
        showFilter={true}
        defaultView="grid"
      />

      {/* CTA Section */}
      <div className="mt-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Install Clarity Chat and start building AI-powered interfaces in
          minutes. All components are tree-shakeable and support server-side
          rendering.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/get-started/installation"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/explore/examples"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View Examples
          </a>
        </div>
      </div>
    </div>
  )
}
