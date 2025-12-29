import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ThemeProvider } from '@clarity-chat/react'
import { ThemeContrastChecker, createTheme } from '@clarity-chat/react/internal'

const meta: Meta<typeof ThemeContrastChecker> = {
  title: 'Foundation/Theme Contrast Checker',
  component: ThemeContrastChecker,
  parameters: {
    docs: {
      description: {
        component: `
# Theme Contrast Checker

A visual accessibility analyzer that checks WCAG color contrast compliance for your theme.

## Features

- **Real-time Analysis** - Automatically analyzes color pairs in your theme
- **WCAG Compliance** - Shows AA and AAA pass/fail status for each pair
- **Filtering** - Option to show only failing contrasts
- **Detailed Mode** - View exact contrast ratios and color values
- **Custom Theme Support** - Analyze any theme, not just the active one

## WCAG Compliance Levels

| Level | Minimum Ratio | Requirement |
|-------|---------------|-------------|
| **AAA** | 7:1+ | Enhanced accessibility |
| **AA** | 4.5:1+ | Standard accessibility |
| **Fail** | <4.5:1 | Does not meet minimum |

## Usage

\`\`\`tsx
import { ThemeContrastChecker, ThemeProvider } from '@clarity-chat/react'

function AccessibilityCheck() {
  return (
    <ThemeProvider>
      <ThemeContrastChecker showDetails />
    </ThemeProvider>
  )
}
\`\`\`
        `,
      },
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThemeContrastChecker>

/**
 * Default Contrast Checker
 *
 * Shows all color pairs with their contrast ratios and WCAG compliance levels.
 */
export const Default: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-4">
      <ThemeContrastChecker showDetails />
    </div>
  ),
}

/**
 * Show Only Failing Contrasts
 *
 * Filter to only display color pairs that fail WCAG AA requirements.
 * Useful for quickly identifying accessibility issues.
 */
export const OnlyFailing: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Failing Contrasts Only</h2>
      <p className="text-muted-foreground mb-4">
        This view filters to show only color pairs that fail WCAG AA compliance
        (&lt;4.5:1 ratio).
      </p>
      <ThemeContrastChecker showOnlyFailing showDetails />
    </div>
  ),
}

/**
 * Compact Mode (No Details)
 *
 * A more compact view without detailed contrast ratio information.
 */
export const Compact: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Compact View</h2>
      <p className="text-muted-foreground mb-4">
        Shows pass/fail status without detailed ratio information.
      </p>
      <ThemeContrastChecker showDetails={false} />
    </div>
  ),
}

/**
 * Dark Theme Analysis
 *
 * Analyzing contrast ratios in a dark theme preset.
 */
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme={{ preset: 'default-dark' }}>
        <Story />
      </ThemeProvider>
    ),
  ],
  render: () => (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Dark Theme Analysis</h2>
      <ThemeContrastChecker showDetails />
    </div>
  ),
}

/**
 * High Contrast Theme Analysis
 *
 * Analyzing the high contrast theme which is designed for WCAG AAA compliance.
 */
export const HighContrastTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme={{ preset: 'high-contrast' }}>
        <Story />
      </ThemeProvider>
    ),
  ],
  render: () => (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">
        High Contrast Theme Analysis
      </h2>
      <p className="text-muted-foreground mb-4">
        The high contrast theme is designed to meet WCAG AAA requirements (7:1+
        ratio).
      </p>
      <ThemeContrastChecker showDetails />
    </div>
  ),
}

/**
 * Custom Theme Analysis
 *
 * Passing a custom theme directly to the checker for analysis.
 */
export const CustomTheme: Story = {
  render: () => {
    const customTheme = createTheme({
      extends: 'default',
      brandColor: '#10b981', // Emerald green
      name: 'emerald-custom',
    })

    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">
          Custom Emerald Theme Analysis
        </h2>
        <p className="text-muted-foreground mb-4">
          Analyzing a custom theme with an emerald brand color.
        </p>
        <ThemeContrastChecker theme={customTheme} showDetails />
      </div>
    )
  },
}

/**
 * Problematic Theme
 *
 * Example of a theme with poor contrast choices to demonstrate failure detection.
 */
export const ProblematicTheme: Story = {
  render: () => {
    // Create a theme with intentionally poor contrast
    const lowContrastTheme = createTheme({
      extends: 'default',
      brandColor: '#a5b4fc', // Light indigo - low contrast on white
      name: 'low-contrast-demo',
    })

    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-4">
          Low Contrast Theme Analysis
        </h2>
        <p className="text-muted-foreground mb-4">
          This demonstrates how the checker identifies accessibility issues with
          a theme that has poor color contrast.
        </p>
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg mb-4">
          <p className="text-sm text-destructive font-medium">
            Warning: This theme has intentionally poor contrast for
            demonstration purposes. Do not use low contrast colors in
            production.
          </p>
        </div>
        <ThemeContrastChecker theme={lowContrastTheme} showDetails />
      </div>
    )
  },
}

/**
 * Side-by-Side Comparison
 *
 * Compare contrast ratios between light and dark variants of a theme.
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Theme Comparison</h2>
      <p className="text-muted-foreground mb-6">
        Compare accessibility scores between light and dark theme variants.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <h3 className="font-medium">Default Light</h3>
          </div>
          <div className="p-4">
            <ThemeProvider defaultTheme={{ preset: 'default' }}>
              <ThemeContrastChecker showDetails={false} />
            </ThemeProvider>
          </div>
        </div>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <h3 className="font-medium">Default Dark</h3>
          </div>
          <div className="p-4">
            <ThemeProvider defaultTheme={{ preset: 'default-dark' }}>
              <ThemeContrastChecker showDetails={false} />
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Integration with Theme Playground
 *
 * Shows how the contrast checker integrates with a theme customization workflow.
 */
export const IntegrationExample: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Integration Example</h2>
      <p className="text-muted-foreground mb-4">
        The ThemeContrastChecker is commonly used in theme customization
        workflows to validate accessibility as users make changes.
      </p>
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Usage in Theme Builder:</h3>
          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
            {`function ThemeBuilder() {
  const [customTheme, setCustomTheme] = useState(defaultTheme)

  return (
    <div className="grid grid-cols-2 gap-4">
      <ThemeControls onChange={setCustomTheme} />
      <ThemeContrastChecker
        theme={customTheme}
        showOnlyFailing
      />
    </div>
  )
}`}
          </pre>
        </div>
        <ThemeContrastChecker showDetails />
      </div>
    </div>
  ),
}
