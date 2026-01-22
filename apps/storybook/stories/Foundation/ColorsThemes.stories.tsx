import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@clarity-chat/react'
import { getAllThemes } from '@clarity-chat/react'
import {
  StatusBadge,
  FeatureGrid,
  ThemeShowcase,
} from '../../.storybook/blocks'
import React from 'react'

const meta: Meta = {
  title: 'Foundation/Colors & Themes',
  parameters: {
    docs: {
      description: {
        component: `
# Colors & Themes

Clarity Chat provides a comprehensive color system and theming architecture that makes it easy to create beautiful, consistent interfaces.

## Design Philosophy

- **Semantic Color Names** - Colors have meaning (brand, success, warning, error)
- **Automatic Dark Mode** - Every theme includes dark mode variants
- **Accessible Contrast** - All color combinations meet WCAG AA standards
- **8 Pre-built Themes** - Start with beautiful defaults
- **Fully Customizable** - Create your own themes with ease

## Color Palette

Our color system is built on a consistent scale from 50 (lightest) to 950 (darkest), ensuring visual harmony across all themes.
        `,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

// Color swatch component
const ColorSwatch = ({
  name,
  value,
  description,
}: {
  name: string
  value: string
  description?: string
}) => (
  <div className="flex flex-col gap-2">
    <div
      className="w-full h-24 rounded-lg border-2 border-border shadow-sm"
      style={{ backgroundColor: value }}
      title={`${name}: ${value}`}
    />
    <div className="text-sm">
      <div className="font-semibold">{name}</div>
      <div className="text-xs font-mono text-gray-500">{value}</div>
      {description && (
        <div className="text-xs text-gray-600 mt-1">{description}</div>
      )}
    </div>
  </div>
)

// Theme preview component
const ThemePreview = ({ themeName }: { themeName: string }) => (
  <ThemeProvider defaultTheme={{ preset: themeName }}>
    <div className="p-6 rounded-xl border-2 border-border bg-background text-foreground space-y-4">
      <h4 className="font-semibold capitalize">
        {themeName.replace(/-/g, ' ')}
      </h4>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors">
          Primary
        </button>
        <button className="px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          Secondary
        </button>
      </div>
      <div className="p-4 rounded-lg bg-muted border border-border">
        <p className="text-sm">
          Sample text in this theme showing foreground and background colors.
        </p>
      </div>
    </div>
  </ThemeProvider>
)

export const BrandColors: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">Brand Colors</h2>
          <StatusBadge status="stable" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Primary brand colors used throughout the interface for CTAs, links,
          and brand identity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <ColorSwatch
          name="brand-50"
          value="#eff6ff"
          description="Lightest brand"
        />
        <ColorSwatch name="brand-100" value="#dbeafe" />
        <ColorSwatch name="brand-200" value="#bfdbfe" />
        <ColorSwatch name="brand-300" value="#93c5fd" />
        <ColorSwatch name="brand-400" value="#60a5fa" />
        <ColorSwatch
          name="brand-500"
          value="#3b82f6"
          description="Primary brand"
        />
        <ColorSwatch name="brand-600" value="#2563eb" />
        <ColorSwatch name="brand-700" value="#1d4ed8" />
        <ColorSwatch name="brand-800" value="#1e40af" />
        <ColorSwatch name="brand-900" value="#1e3a8a" />
        <ColorSwatch
          name="brand-950"
          value="#172554"
          description="Darkest brand"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The brand color scale from 50 (lightest) to 950 (darkest). Use brand-500 for primary actions.',
      },
    },
  },
}

export const SemanticColors: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Semantic Colors</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Colors with specific meanings for success, warning, error, and
          informational states.
        </p>
      </div>

      <div className="space-y-8">
        {/* Success */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl"></span> Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ColorSwatch name="green-50" value="#f0fdf4" />
            <ColorSwatch name="green-100" value="#dcfce7" />
            <ColorSwatch
              name="green-500"
              value="#10b981"
              description="Primary success"
            />
            <ColorSwatch name="green-700" value="#15803d" />
            <ColorSwatch name="green-900" value="#14532d" />
          </div>
        </div>

        {/* Warning */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Warning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ColorSwatch name="yellow-50" value="#fefce8" />
            <ColorSwatch name="yellow-100" value="#fef9c3" />
            <ColorSwatch
              name="yellow-500"
              value="#f59e0b"
              description="Primary warning"
            />
            <ColorSwatch name="yellow-700" value="#a16207" />
            <ColorSwatch name="yellow-900" value="#713f12" />
          </div>
        </div>

        {/* Error */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl"></span> Error
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ColorSwatch name="red-50" value="#fef2f2" />
            <ColorSwatch name="red-100" value="#fee2e2" />
            <ColorSwatch
              name="red-500"
              value="#ef4444"
              description="Primary error"
            />
            <ColorSwatch name="red-700" value="#b91c1c" />
            <ColorSwatch name="red-900" value="#7f1d1d" />
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span> Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ColorSwatch name="blue-50" value="#eff6ff" />
            <ColorSwatch name="blue-100" value="#dbeafe" />
            <ColorSwatch
              name="blue-500"
              value="#3b82f6"
              description="Primary info"
            />
            <ColorSwatch name="blue-700" value="#1d4ed8" />
            <ColorSwatch name="blue-900" value="#1e3a8a" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Semantic colors convey meaning and state. Always use the appropriate semantic color for feedback.',
      },
    },
  },
}

export const NeutralColors: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Neutral Colors</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Grayscale colors for text, borders, backgrounds, and subtle UI
          elements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <ColorSwatch name="gray-50" value="#f9fafb" description="Lightest bg" />
        <ColorSwatch name="gray-100" value="#f3f4f6" />
        <ColorSwatch name="gray-200" value="#e5e7eb" description="Borders" />
        <ColorSwatch name="gray-300" value="#d1d5db" />
        <ColorSwatch name="gray-400" value="#9ca3af" />
        <ColorSwatch
          name="gray-500"
          value="#6b7280"
          description="Secondary text"
        />
        <ColorSwatch name="gray-600" value="#4b5563" />
        <ColorSwatch name="gray-700" value="#374151" />
        <ColorSwatch name="gray-800" value="#1f2937" />
        <ColorSwatch
          name="gray-900"
          value="#111827"
          description="Primary text"
        />
        <ColorSwatch name="gray-950" value="#030712" description="Darkest bg" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Neutral grayscale colors for text, borders, and backgrounds. Use responsibly for visual hierarchy.',
      },
    },
  },
}

export const AllThemes: Story = {
  render: () => {
    const themes = getAllThemes()

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold">All Themes</h2>
            <StatusBadge status="stable" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Clarity Chat includes {themes.length} professionally designed
            themes. Each theme includes both light and dark mode variants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <ThemePreview key={theme.name} themeName={theme.name} />
          ))}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'All available theme presets. Click on any theme in the toolbar to preview it live.',
      },
    },
  },
}

export const ThemeComparison: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Theme Comparison</h2>
        <p className="text-gray-600 dark:text-gray-400">
          See how a component looks across different themes. Perfect for testing
          your custom components.
        </p>
      </div>

      <ThemeShowcase
        themes={[
          'default',
          'default-dark',
          'neutral',
          'vibrant',
          'high-contrast',
        ]}
      >
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Sample Component</h4>
          <p className="text-sm">
            This is how text appears in this theme, with proper foreground and
            background contrast.
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium">
              Primary Button
            </button>
            <button className="px-4 py-2 rounded-lg border-2 border-border font-medium">
              Secondary
            </button>
          </div>
        </div>
      </ThemeShowcase>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Compare how components look across different themes side-by-side.',
      },
    },
  },
}

export const CustomTheme: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold">Custom Themes</h2>
          <StatusBadge status="stable" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Create your own theme by providing a custom theme object to
          ThemeProvider.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Example: Custom Theme</h3>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto">
            <code>{`import { ThemeProvider } from '@clarity-chat/react'

const myCustomTheme = {
  colors: {
    brand: {
      50: '#fff1f2',
      100: '#ffe4e6',
      // ... your custom colors
      500: '#f43f5e', // Your primary brand color
      // ... rest of scale
    },
    // ... other color overrides
  },
  // ... spacing, typography, etc.
}

function App() {
  return (
    <ThemeProvider theme={myCustomTheme}>
      <YourApp />
    </ThemeProvider>
  )
}`}</code>
          </pre>
        </div>

        <div className="callout callout-info">
          <p className="font-semibold mb-2">💡 Pro Tip</p>
          <p className="text-sm">
            You can also extend an existing theme by merging your custom values
            with a preset theme. This way, you only need to override the values
            you want to change.
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Learn how to create custom themes for your specific brand requirements.',
      },
    },
  },
}

export const DarkMode: Story = {
  render: () => (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Dark Mode Support</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Every theme includes carefully crafted dark mode variants. Toggle dark
          mode using the toolbar above.
        </p>
      </div>

      <FeatureGrid
        features={[
          {
            title: 'Automatic Contrast',
            description:
              'Colors automatically adjust for proper contrast in dark mode.',
            icon: <span className="text-2xl">🌓</span>,
          },
          {
            title: 'System Preference',
            description: 'Respects user system preferences by default.',
            icon: <span className="text-2xl">💻</span>,
          },
          {
            title: 'Manual Override',
            description: 'Users can manually toggle light/dark mode.',
            icon: <span className="text-2xl">🔆</span>,
          },
          {
            title: 'Persistent',
            description: 'Mode preference is saved in localStorage.',
            icon: <span className="text-2xl">💾</span>,
          },
        ]}
      />

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Usage</h3>
        <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto">
          <code>{`import { ThemeProvider } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system' }}>
      {/* Your app */}
    </ThemeProvider>
  )
}

// Options: 'light' | 'dark' | 'system'`}</code>
        </pre>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Dark mode is fully supported with automatic color adjustments for accessibility.',
      },
    },
  },
}
