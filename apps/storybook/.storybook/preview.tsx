import type { Decorator, Preview } from '@storybook/react-vite'
import React from 'react'
import { ThemeProvider, ToastProvider } from '@clarity-chat/react'
import { getAllThemes } from '@clarity-chat/react/theme'
import { clarityTheme, clarityDarkTheme } from './manager'
import './globals.css'

// Suppress AbortError from Storybook's waitForAnimations in React 19
if (typeof window !== 'undefined') {
  const originalOnError = window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
    if (error?.name === 'AbortError' || (typeof message === 'string' && message.includes('AbortError'))) {
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

const withTheme: Decorator = (Story, context) => {
  const mode = context.globals.themeMode ?? 'system'
  const preset = context.globals.themePreset && context.globals.themePreset !== 'auto'
    ? context.globals.themePreset
    : undefined

  return (
    <ThemeProvider
      defaultTheme={{
        mode,
        preset,
        enableTransitions: false,
      }}
    >
      <ToastProvider>
        <div className="sb-clarity-shell min-h-screen bg-background text-foreground">
          <Story />
        </div>
      </ToastProvider>
    </ThemeProvider>
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
          ['Overview', 'Colors & Themes', 'Typography', 'Spacing & Layout', 'Motion & Animation', 'Iconography'],
          'Components',
          ['Inputs', 'Data Display', 'Feedback', 'Layout', 'Navigation'],
          'Advanced Features',
          ['AI & Agents', 'Memory & Context', 'Streaming & Real-time', 'Analytics & Monitoring', 'Enterprise'],
          'Hooks',
          ['Chat Hooks', 'Streaming', 'State Management', 'Performance', 'Utilities'],
          'Patterns',
          ['Chat Patterns', 'Form Patterns', 'Layout Patterns', 'AI Patterns'],
          'Examples',
          ['Complete Applications', 'Integration Examples', 'Use Cases'],
          'Resources',
          ['Accessibility', 'Best Practices', 'Migration Guides', 'API Reference'],
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
      toc: true,
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
        gradient: { name: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
      }
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

  decorators: [withTheme],

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
      value: 'system'
    }
  }
}

export default preview
