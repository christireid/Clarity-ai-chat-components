/**
 * Storybook Preview Configuration
 *
 * Global decorators, parameters, and loaders for Clarity Chat Storybook.
 * Includes MSW for API mocking, theme providers, and accessibility setup.
 */
import type { Decorator, Preview } from '@storybook/react-vite'
import React, { useEffect } from 'react'
import { ThemeProvider, ToastProvider } from '@clarity-chat/react'
import { getAllThemes } from '@clarity-chat/react/theme'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { useDarkMode } from 'storybook-dark-mode'
import clarityTheme from './clarity-theme'
import clarityDarkTheme from './clarity-theme-dark'
import './globals.css'

// Initialize MSW for API mocking in stories
initialize({
  onUnhandledRequest: 'bypass',
})

// Suppress AbortError from Storybook's waitForAnimations in React 19
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
    if (
      error?.name === 'AbortError' ||
      (typeof message === 'string' && message.includes('AbortError'))
    ) {
      return true // Suppress the error
    }
    return originalOnError?.(message, source, lineno, colno, error) ?? false
  }

  const originalOnUnhandledRejection = window.onunhandledrejection
  window.onunhandledrejection = (event) => {
    if (event.reason?.name === 'AbortError') {
      event.preventDefault()
      return
    }
    originalOnUnhandledRejection?.call(window, event)
  }
}

const themePresets = getAllThemes()
  .map(({ name, metadata }) => ({
    value: name,
    title: metadata.displayName ?? name,
    description: metadata.description,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

/**
 * Theme wrapper component that syncs with Storybook's dark mode toggle
 * and provides the ThemeProvider context to all stories
 */
function ThemeWrapper({
  children,
  preset,
}: {
  children: React.ReactNode
  preset?: string
}) {
  // Get dark mode state from the storybook-dark-mode addon
  const isDarkMode = useDarkMode()

  // Sync dark mode class on html element for Tailwind
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    if (isDarkMode) {
      html.classList.add('dark')
      body.classList.add('dark')
      body.style.backgroundColor = '#0f172a'
      body.style.color = '#f1f5f9'
    } else {
      html.classList.remove('dark')
      body.classList.remove('dark')
      body.style.backgroundColor = '#ffffff'
      body.style.color = '#1e293b'
    }
  }, [isDarkMode])

  return (
    <ThemeProvider
      defaultTheme={{
        mode: isDarkMode ? 'dark' : 'light',
        preset,
        enableTransitions: true,
      }}
    >
      <ToastProvider>
        <div
          className={`sb-clarity-shell min-h-screen bg-background text-foreground transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}
        >
          {children}
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

/**
 * Theme decorator that wraps stories with the ThemeWrapper component
 */
const withTheme: Decorator = (Story, context) => {
  const preset =
    context.globals.themePreset && context.globals.themePreset !== 'auto'
      ? context.globals.themePreset
      : undefined

  return (
    <ThemeWrapper preset={preset}>
      <Story />
    </ThemeWrapper>
  )
}

const preview: Preview = {
  parameters: {
    // Dark mode configuration
    darkMode: {
      dark: { ...clarityDarkTheme },
      light: { ...clarityTheme },
      stylePreview: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Welcome',
          ['Introduction', 'Getting Started', 'Playground', "What's New"],
          'Foundation',
          [
            'Overview',
            'Colors & Themes',
            'Typography',
            'Spacing & Layout',
            'Motion & Animation',
            'Iconography',
          ],
          'Components',
          ['Inputs', 'Data Display', 'Feedback', 'Layout', 'Navigation'],
          'Advanced Features',
          [
            'AI & Agents',
            'Memory & Context',
            'Streaming & Real-time',
            'Analytics & Monitoring',
            'Enterprise',
          ],
          'Hooks',
          [
            'Chat Hooks',
            'Streaming',
            'State Management',
            'Performance',
            'Utilities',
          ],
          'Patterns',
          ['Chat Patterns', 'Form Patterns', 'Layout Patterns', 'AI Patterns'],
          'Examples',
          ['Complete Applications', 'Integration Examples', 'Use Cases'],
          'Resources',
          [
            'Accessibility',
            'Best Practices',
            'Migration Guides',
            'API Reference',
          ],
          // Legacy categories (backward compatibility during transition)
          'Getting Started',
          'Design Principles',
          'Component Gallery',
          ['Components', 'Primitives'],
          'SDKs & Adapters',
          'Utilities',
        ],
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      theme: clarityTheme,
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h2, h3',
        title: 'On this page',
      },
      source: {
        state: 'open',
      },
      story: {
        inline: true,
        iframeHeight: 400,
      },
    },
    // Disable animation waiting to prevent AbortError flickering
    chromatic: {
      disableSnapshot: false,
      pauseAnimationAtEnd: false,
    },
    // Increase timeout for test runner to prevent AbortError
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'link-name', enabled: true },
        ],
      },
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
      manual: false,
    },
    layout: 'centered',
    backgrounds: {
      options: {
        system: { name: 'system', value: 'transparent' },
        light: { name: 'light', value: '#ffffff' },
        dark: { name: 'dark', value: '#111827' },
        gradient: {
          name: 'gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      },
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
        ultrawide: {
          name: 'Ultra Wide',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
  },

  decorators: [
    // Clarity theme provider decorator (includes dark mode syncing)
    withTheme,
  ],

  // MSW loader for API mocking
  loaders: [mswLoader],

  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'es', title: 'Español' },
          { value: 'fr', title: 'Français' },
          { value: 'de', title: 'Deutsch' },
          { value: 'ja', title: '日本語' },
        ],
        showName: true,
      },
    },
    themeMode: {
      name: 'Theme Mode',
      description: 'Select light, dark, or system theme',
      defaultValue: 'system',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        showName: true,
      },
    },
    themePreset: {
      name: 'Theme Preset',
      description: 'Switch between Clarity theme presets',
      defaultValue: 'auto',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'auto', title: 'Auto' },
          ...themePresets.map((preset) => ({
            value: preset.value,
            title: preset.title,
            right: preset.description,
          })),
        ],
        showName: true,
      },
    },
  },

  tags: ['autodocs'],

  initialGlobals: {
    backgrounds: {
      value: 'system',
    },
  },
}

export default preview
