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
 * Reduced Motion Effect Component
 *
 * Simulates the prefers-reduced-motion media query for accessibility testing.
 * When enabled, forces reduced motion mode to help developers verify their
 * components correctly respect the useReducedMotion hook (WCAG 2.3.3).
 */
function ReducedMotionEffect({ reduceMotion }: { reduceMotion: boolean }) {
  React.useEffect(() => {
    if (reduceMotion) {
      // Add a data attribute that our CSS can hook into
      document.documentElement.setAttribute('data-reduce-motion', 'true')
      // Also inject a style tag to override the media query behavior
      const styleId = 'storybook-reduce-motion'
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
          /* Storybook Reduced Motion Override */
          [data-reduce-motion="true"] *,
          [data-reduce-motion="true"] *::before,
          [data-reduce-motion="true"] *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `
        document.head.appendChild(style)
      }
    } else {
      document.documentElement.removeAttribute('data-reduce-motion')
      const styleEl = document.getElementById('storybook-reduce-motion')
      if (styleEl) {
        styleEl.remove()
      }
    }

    return () => {
      document.documentElement.removeAttribute('data-reduce-motion')
      const styleEl = document.getElementById('storybook-reduce-motion')
      if (styleEl) {
        styleEl.remove()
      }
    }
  }, [reduceMotion])

  return null
}

const withReducedMotion: Decorator = (Story, context) => {
  const reduceMotion = context.globals.reduceMotion === true

  return (
    <>
      <ReducedMotionEffect reduceMotion={reduceMotion} />
      <Story />
    </>
  )
}

const withTheme: Decorator = (Story, context) => {
  const mode = context.globals.themeMode ?? 'system'
  const preset =
    context.globals.themePreset && context.globals.themePreset !== 'auto'
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
          // Getting started
          'Welcome',
          ['Introduction', 'Getting Started', 'Playground', "What's New"],

          // Design foundation
          'Foundation',
          [
            'Colors & Themes',
            'Spacing & Layout',
            'Motion & Animation',
            'Iconography',
            'Theme Playground',
            'Theme Contrast Checker',
          ],

          // Core components
          'Components',
          [
            'Chat',
            'Message',
            'Input',
            'Inputs',
            'Data Display',
            'Feedback',
            'Layout',
            'Navigation',
            'Token',
            'AI',
            'Dashboards',
          ],

          // React hooks
          'Hooks',
          ['Chat', 'Streaming', 'State', 'Performance', 'Utilities'],

          // Common patterns
          'Patterns',
          ['Chat', 'Forms', 'Layout', 'AI'],

          // Advanced features
          'Advanced',
          ['AI', 'Streaming', 'Memory', 'Analytics', 'Enterprise'],

          // Real-world examples
          'Examples',

          // Low-level primitives
          'Primitives',
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

  decorators: [withReducedMotion, withTheme],

  globalTypes: {
    reduceMotion: {
      name: 'Reduce Motion',
      description:
        'Simulate prefers-reduced-motion for accessibility testing (WCAG 2.3.3)',
      defaultValue: false,
      toolbar: {
        icon: 'accessibility',
        items: [
          { value: false, title: 'Motion Enabled', icon: 'play' },
          { value: true, title: 'Reduced Motion', icon: 'stop' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
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
