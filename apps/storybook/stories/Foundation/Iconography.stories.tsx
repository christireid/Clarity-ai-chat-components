import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { ComponentHeader } from '../../.storybook/blocks'
import {
  MessageSquare, Send, User, Settings, Search, Heart, Star, Bell,
  Check, X, ChevronRight, ChevronDown, Menu, MoreVertical,
  Copy, Download, Upload, File, Image, Video,
  AlertCircle, Info, CheckCircle, XCircle,
  Sparkles, Zap, Flame, ThumbsUp, ThumbsDown,
} from 'lucide-react'

const meta: Meta = {
  title: 'Foundation/Iconography',
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <div className="max-w-6xl mx-auto p-8">
          <ComponentHeader
            title="Iconography"
            status="stable"
            description="Clarity Chat uses Lucide React icons for a consistent, modern icon system across all components."
          />
          <div className="prose prose-slate max-w-none">
            <p>
              <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-brand-500 underline">
                Lucide
              </a> is a beautiful, consistent icon library with 1000+ icons. All icons are designed with a 24x24 grid, 2px stroke, and rounded corners.
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

const iconCategories = {
  'Communication': [
    { Icon: MessageSquare, name: 'MessageSquare' },
    { Icon: Send, name: 'Send' },
    { Icon: Bell, name: 'Bell' },
  ],
  'User & Navigation': [
    { Icon: User, name: 'User' },
    { Icon: Settings, name: 'Settings' },
    { Icon: Search, name: 'Search' },
    { Icon: Menu, name: 'Menu' },
    { Icon: MoreVertical, name: 'MoreVertical' },
  ],
  'Actions': [
    { Icon: Copy, name: 'Copy' },
    { Icon: Download, name: 'Download' },
    { Icon: Upload, name: 'Upload' },
    { Icon: Check, name: 'Check' },
    { Icon: X, name: 'X' },
  ],
  'Directional': [
    { Icon: ChevronRight, name: 'ChevronRight' },
    { Icon: ChevronDown, name: 'ChevronDown' },
  ],
  'Files & Media': [
    { Icon: File, name: 'File' },
    { Icon: Image, name: 'Image' },
    { Icon: Video, name: 'Video' },
  ],
  'Feedback': [
    { Icon: AlertCircle, name: 'AlertCircle' },
    { Icon: Info, name: 'Info' },
    { Icon: CheckCircle, name: 'CheckCircle' },
    { Icon: XCircle, name: 'XCircle' },
  ],
  'Engagement': [
    { Icon: Heart, name: 'Heart' },
    { Icon: Star, name: 'Star' },
    { Icon: ThumbsUp, name: 'ThumbsUp' },
    { Icon: ThumbsDown, name: 'ThumbsDown' },
  ],
  'AI & Special': [
    { Icon: Sparkles, name: 'Sparkles' },
    { Icon: Zap, name: 'Zap' },
    { Icon: Flame, name: 'Flame' },
  ],
}

// Icon Categories
export const IconCategories: Story = {
  render: () => {
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null)

    const handleCopy = (name: string) => {
      navigator.clipboard.writeText(`import { ${name} } from 'lucide-react'`)
      setCopiedIcon(name)
      setTimeout(() => setCopiedIcon(null), 2000)
    }

    return (
      <div className="w-full max-w-6xl p-8">
        <h2 className="text-2xl font-bold mb-6">Icon Library</h2>

        <div className="space-y-8">
          {Object.entries(iconCategories).map(([category, icons]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {icons.map(({ Icon, name }) => (
                  <button
                    key={name}
                    onClick={() => handleCopy(name)}
                    className="group flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-border bg-white dark:bg-gray-900 hover:border-brand-500 hover:shadow-md transition-all duration-200"
                  >
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors" />
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-400 text-center">
                      {copiedIcon === name ? '✓ Copied!' : name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-3">Usage</h3>
          <pre className="text-sm overflow-x-auto bg-white dark:bg-gray-800 p-4 rounded">
            <code>{`import { MessageSquare } from 'lucide-react'

function MyComponent() {
  return <MessageSquare className="w-5 h-5 text-brand-500" />
}`}</code>
          </pre>
        </div>
      </div>
    )
  },
}

// Icon Sizes
export const IconSizes: Story = {
  render: () => {
    const sizes = [
      { name: 'Extra Small', class: 'w-3 h-3', pixels: '12px' },
      { name: 'Small', class: 'w-4 h-4', pixels: '16px' },
      { name: 'Medium', class: 'w-5 h-5', pixels: '20px' },
      { name: 'Large', class: 'w-6 h-6', pixels: '24px' },
      { name: 'Extra Large', class: 'w-8 h-8', pixels: '32px' },
      { name: '2X Large', class: 'w-10 h-10', pixels: '40px' },
    ]

    return (
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Icon Sizes</h2>
        <div className="space-y-6">
          {sizes.map((size) => (
            <div key={size.name} className="flex items-center gap-6">
              <div className="w-32 text-sm font-semibold">{size.name}</div>
              <MessageSquare className={`${size.class} text-brand-500`} />
              <code className="text-sm text-gray-600 dark:text-gray-400">
                className="{size.class}" ({size.pixels})
              </code>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <h3 className="text-sm font-semibold mb-2">Guidelines</h3>
          <ul className="text-xs space-y-1">
            <li>• <strong>w-3 h-3</strong>: Inline icons within text</li>
            <li>• <strong>w-4 h-4</strong>: Button icons, form inputs</li>
            <li>• <strong>w-5 h-5</strong>: Default size for most UI icons</li>
            <li>• <strong>w-6 h-6</strong>: Headers, prominent actions</li>
            <li>• <strong>w-8 h-8+</strong>: Feature icons, empty states</li>
          </ul>
        </div>
      </div>
    )
  },
}

// Icon Colors
export const IconColors: Story = {
  render: () => {
    const colors = [
      { name: 'Brand', class: 'text-brand-500' },
      { name: 'Primary', class: 'text-gray-900 dark:text-gray-100' },
      { name: 'Secondary', class: 'text-gray-600 dark:text-gray-400' },
      { name: 'Muted', class: 'text-gray-400 dark:text-gray-600' },
      { name: 'Success', class: 'text-green-500' },
      { name: 'Warning', class: 'text-yellow-500' },
      { name: 'Error', class: 'text-red-500' },
    ]

    return (
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Icon Colors</h2>
        <div className="space-y-4">
          {colors.map((color) => (
            <div key={color.name} className="flex items-center gap-6">
              <div className="w-32 text-sm font-semibold">{color.name}</div>
              <MessageSquare className={`w-6 h-6 ${color.class}`} />
              <code className="text-sm text-gray-600 dark:text-gray-400">
                className="{color.class}"
              </code>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

// Icon Stroke Width
export const IconStrokeWidth: Story = {
  render: () => {
    const strokeWidths = [
      { name: 'Thin', value: 1 },
      { name: 'Default', value: 2 },
      { name: 'Bold', value: 2.5 },
    ]

    return (
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Stroke Width</h2>
        <div className="space-y-6">
          {strokeWidths.map((stroke) => (
            <div key={stroke.name} className="flex items-center gap-6">
              <div className="w-32 text-sm font-semibold">{stroke.name}</div>
              <MessageSquare className="w-8 h-8 text-brand-500" strokeWidth={stroke.value} />
              <code className="text-sm text-gray-600 dark:text-gray-400">
                strokeWidth={stroke.value}
              </code>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            <strong>Note:</strong> Lucide icons default to 2px stroke width. Use 1.5-2.5 for most cases.
            Avoid going below 1 or above 3 for consistency.
          </p>
        </div>
      </div>
    )
  },
}
