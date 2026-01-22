import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    // Addon-essentials configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },

    // Docs configuration
    docs: {
      toc: true,
      canvas: {
        sourceState: 'shown',
      },
    },

    // Actions configuration
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Backgrounds for better visual testing
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },

    // Layout configuration
    layout: 'padded',

    // Viewport configuration for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '720px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
    },

    // Options for controlling Storybook's UI
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Hooks',
          [
            'useTokenOptimization',
            'useTokenCount',
            'useTokenEstimate',
            'useTokenBudgetMonitor',
          ],
          'Components',
          [
            'TokenCostPreview',
            'TokenOptimizationBadge',
            'TokenOptimizationPanel',
            'TokenOptimizationDashboard',
            'TokenUsageMeter',
          ],
          'Examples',
          '*',
        ],
      },
    },
  },

  decorators: [
    // Global wrapper for all stories with background and text colors
    (Story) => (
      <div className="min-h-screen bg-background text-foreground antialiased p-4">
        <Story />
      </div>
    ),
  ],

  tags: ['autodocs'],
}

export default preview
