import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ComponentHeader } from '../../.storybook/blocks'

const meta: Meta = {
  title: 'Foundation/Spacing & Layout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <div className="max-w-6xl mx-auto p-8">
          <ComponentHeader
            title="Spacing & Layout"
            status="stable"
            description="Consistent spacing scale and layout primitives for building responsive, accessible interfaces."
          />
          <div className="prose prose-slate max-w-none">
            <p>
              Clarity Chat uses Tailwind CSS's spacing scale (based on 0.25rem increments) for consistent spacing across all components. This ensures visual rhythm and predictable layouts.
            </p>
          </div>
        </div>
      ),
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Spacing Scale Visualization
export const SpacingScale: Story = {
  render: () => {
    const spaces = [
      { name: '1', value: '0.25rem', pixels: '4px' },
      { name: '2', value: '0.5rem', pixels: '8px' },
      { name: '3', value: '0.75rem', pixels: '12px' },
      { name: '4', value: '1rem', pixels: '16px' },
      { name: '5', value: '1.25rem', pixels: '20px' },
      { name: '6', value: '1.5rem', pixels: '24px' },
      { name: '8', value: '2rem', pixels: '32px' },
      { name: '10', value: '2.5rem', pixels: '40px' },
      { name: '12', value: '3rem', pixels: '48px' },
      { name: '16', value: '4rem', pixels: '64px' },
      { name: '20', value: '5rem', pixels: '80px' },
      { name: '24', value: '6rem', pixels: '96px' },
    ]

    return (
      <div className="p-8 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">Spacing Scale</h2>
        <div className="space-y-4">
          {spaces.map((space) => (
            <div key={space.name} className="flex items-center gap-4">
              <div className="w-24 text-sm font-mono text-gray-600 dark:text-gray-400">
                spacing-{space.name}
              </div>
              <div
                className="bg-brand-500 rounded"
                style={{ width: space.value, height: '2rem' }}
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {space.value} <span className="text-gray-400">({space.pixels})</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2">Usage Guidelines</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>spacing-1 to spacing-3</strong>: Tight spacing for inline elements and icons</li>
            <li>• <strong>spacing-4 to spacing-6</strong>: Standard spacing for component padding and gaps</li>
            <li>• <strong>spacing-8 to spacing-12</strong>: Section spacing and larger component gaps</li>
            <li>• <strong>spacing-16+</strong>: Page-level spacing and major section breaks</li>
          </ul>
        </div>
      </div>
    )
  },
}

// Container Widths
export const ContainerWidths: Story = {
  render: () => {
    const containers = [
      { name: 'sm', value: '640px', className: 'max-w-sm' },
      { name: 'md', value: '768px', className: 'max-w-md' },
      { name: 'lg', value: '1024px', className: 'max-w-lg' },
      { name: 'xl', value: '1280px', className: 'max-w-xl' },
      { name: '2xl', value: '1536px', className: 'max-w-2xl' },
      { name: 'full', value: '100%', className: 'max-w-full' },
    ]

    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Container Widths</h2>
        <div className="space-y-4">
          {containers.map((container) => (
            <div key={container.name}>
              <div className="text-sm font-mono text-gray-600 dark:text-gray-400 mb-2">
                {container.className} ({container.value})
              </div>
              <div className={`${container.className} bg-gradient-to-r from-brand-500 to-brand-600 h-12 rounded-lg shadow-sm`} />
            </div>
          ))}
        </div>
      </div>
    )
  },
}

// Grid System
export const GridSystem: Story = {
  render: () => {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Grid System</h2>

        <div className="space-y-8">
          {/* 2 Column */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">2 Column Grid</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold">
                  Column {i}
                </div>
              ))}
            </div>
          </div>

          {/* 3 Column */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">3 Column Grid</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold">
                  Column {i}
                </div>
              ))}
            </div>
          </div>

          {/* 4 Column */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">4 Column Grid</h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold">
                  Column {i}
                </div>
              ))}
            </div>
          </div>

          {/* Responsive Grid */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">
              Responsive Grid (1 → 2 → 3 → 4)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-brand-500/20 rounded-lg flex items-center justify-center font-semibold">
                  Column {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold mb-2">Code Example</h3>
          <pre className="text-sm overflow-x-auto">
            <code>{`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`}</code>
          </pre>
        </div>
      </div>
    )
  },
}

// Flexbox Patterns
export const FlexboxPatterns: Story = {
  render: () => {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Flexbox Patterns</h2>

        <div className="space-y-8">
          {/* Horizontal Stack */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Horizontal Stack</h3>
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 bg-brand-500/20 rounded-lg font-semibold">
                  Item {i}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Stack */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Vertical Stack</h3>
            <div className="flex flex-col gap-4 max-w-xs">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 bg-brand-500/20 rounded-lg font-semibold">
                  Item {i}
                </div>
              ))}
            </div>
          </div>

          {/* Space Between */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Space Between</h3>
            <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="px-6 py-4 bg-brand-500/20 rounded-lg font-semibold">Left</div>
              <div className="px-6 py-4 bg-brand-500/20 rounded-lg font-semibold">Right</div>
            </div>
          </div>

          {/* Centered */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Centered</h3>
            <div className="flex justify-center items-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="px-6 py-4 bg-brand-500/20 rounded-lg font-semibold">Centered Item</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
