import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ComponentHeader } from '../../.storybook/blocks'

const meta: Meta = {
  title: 'Foundation/Motion & Animation',
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <div className="max-w-6xl mx-auto p-8">
          <ComponentHeader
            title="Motion & Animation"
            status="stable"
            description="Purposeful animations that enhance user experience without distracting. All animations respect prefers-reduced-motion."
          />
          <div className="prose prose-slate max-w-none">
            <p>
              Motion in Clarity Chat is designed to be subtle, purposeful, and performant. Animations provide visual feedback, guide attention, and create a polished experience.
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

// Transition Durations
export const TransitionDurations: Story = {
  render: () => {
    const durations = [
      { name: 'Fast', value: '150ms', class: 'duration-150' },
      { name: 'Normal', value: '200ms', class: 'duration-200' },
      { name: 'Smooth', value: '300ms', class: 'duration-300' },
      { name: 'Slow', value: '500ms', class: 'duration-500' },
    ]

    return (
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Transition Durations</h2>
        <div className="space-y-6">
          {durations.map((duration) => {
            const [isHovered, setIsHovered] = useState(false)

            return (
              <div key={duration.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{duration.name}</span>
                  <span className="text-sm text-gray-500 font-mono">{duration.value}</span>
                </div>
                <div
                  className="relative h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className={`absolute inset-y-0 left-0 bg-brand-500 ${duration.class} transition-all`}
                    style={{ width: isHovered ? '100%' : '20%' }}
                  />
                </div>
                <p className="text-xs text-gray-500">Hover to see animation</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold mb-2">Usage Guidelines</h3>
          <ul className="text-xs space-y-1">
            <li>• <strong>Fast (150ms)</strong>: Instant feedback like button presses</li>
            <li>• <strong>Normal (200ms)</strong>: Most hover states and small movements</li>
            <li>• <strong>Smooth (300ms)</strong>: Larger movements and state changes</li>
            <li>• <strong>Slow (500ms)</strong>: Complex animations and page transitions</li>
          </ul>
        </div>
      </div>
    )
  },
}

// Easing Functions
export const EasingFunctions: Story = {
  render: () => {
    const easings = [
      { name: 'Linear', class: 'ease-linear' },
      { name: 'Ease', class: 'ease' },
      { name: 'Ease In', class: 'ease-in' },
      { name: 'Ease Out', class: 'ease-out' },
      { name: 'Ease In Out', class: 'ease-in-out' },
    ]

    return (
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Easing Functions</h2>
        <div className="space-y-6">
          {easings.map((easing) => {
            const [isAnimating, setIsAnimating] = useState(false)

            return (
              <div key={easing.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{easing.name}</span>
                  <button
                    onClick={() => {
                      setIsAnimating(true)
                      setTimeout(() => setIsAnimating(false), 1000)
                    }}
                    className="text-xs px-3 py-1 bg-brand-500 text-white rounded hover:bg-brand-600 transition-colors"
                  >
                    Replay
                  </button>
                </div>
                <div className="relative h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 w-12 bg-brand-500 duration-1000 ${easing.class}`}
                    style={{
                      transform: isAnimating ? 'translateX(calc(100vw - 400px))' : 'translateX(0)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  },
}

// Common Animations
export const CommonAnimations: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl p-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">Common Animations</h2>

        {/* Fade In */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Fade In</h3>
          <div className="animate-fade-in p-4 bg-brand-500/20 rounded-lg">
            <p className="text-sm">This element fades in smoothly</p>
          </div>
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="animate-fade-in"
          </code>
        </div>

        {/* Slide Up */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Slide Up</h3>
          <div className="animate-slide-up p-4 bg-brand-500/20 rounded-lg">
            <p className="text-sm">This element slides up</p>
          </div>
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="animate-slide-up"
          </code>
        </div>

        {/* Scale */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Scale on Hover</h3>
          <button className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:scale-105 transition-transform duration-200">
            Hover Me
          </button>
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="hover:scale-105 transition-transform duration-200"
          </code>
        </div>

        {/* Translate */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Translate on Hover</h3>
          <div className="p-4 bg-brand-500/20 rounded-lg hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
            <p className="text-sm">Hover to lift</p>
          </div>
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="hover:-translate-y-1 transition-transform duration-200"
          </code>
        </div>

        {/* Shadow */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Shadow on Hover</h3>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-border">
            <p className="text-sm">Hover for shadow</p>
          </div>
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="shadow-sm hover:shadow-lg transition-shadow duration-200"
          </code>
        </div>
      </div>
    )
  },
}

// Loading Animations
export const LoadingAnimations: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl p-8 space-y-8">
        <h2 className="text-2xl font-bold mb-6">Loading Animations</h2>

        {/* Spinner */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Spinner</h3>
          <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="animate-spin"
          </code>
        </div>

        {/* Pulse */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Pulse</h3>
          <div className="animate-pulse h-8 w-48 bg-brand-500/20 rounded-lg" />
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="animate-pulse"
          </code>
        </div>

        {/* Bounce */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Bounce</h3>
          <div className="animate-bounce h-8 w-8 bg-brand-500 rounded-full" />
          <code className="text-xs text-gray-600 dark:text-gray-400 block mt-2">
            className="animate-bounce"
          </code>
        </div>
      </div>
    )
  },
}
