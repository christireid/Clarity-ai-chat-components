import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

// Custom theme matching docs site aesthetic
const clarityTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Clarity Chat',
  brandUrl: 'https://clarity.chat',
  brandTarget: '_self',

  // Colors matching docs site
  colorPrimary: '#3b82f6', // brand-500
  colorSecondary: '#2563eb', // brand-600

  // UI - matching docs site
  appBg: '#f9fafb', // gray-50
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb', // border
  appBorderRadius: 12,

  // Typography - matching docs site
  fontBase: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',

  // Text colors
  textColor: '#111827', // gray-900
  textInverseColor: '#ffffff',
  textMutedColor: '#6b7280', // gray-500

  // Toolbar
  barTextColor: '#4b5563', // gray-600
  barSelectedColor: '#3b82f6',
  barBg: '#ffffff',
  barHoverColor: '#2563eb',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e5e7eb',
  inputTextColor: '#111827',
  inputBorderRadius: 8,

  // Button
  buttonBg: '#3b82f6',
  buttonBorder: '#3b82f6',
  buttonTextColor: '#ffffff',

  // Boolean
  booleanBg: '#f3f4f6',
  booleanSelectedBg: '#3b82f6',
})

// Dark theme variant
const clarityDarkTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Clarity Chat',
  brandUrl: 'https://clarity.chat',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#60a5fa', // brand-400 (lighter for dark mode)
  colorSecondary: '#3b82f6',

  // UI - dark mode
  appBg: '#030712', // gray-950
  appContentBg: '#111827', // gray-900
  appBorderColor: '#374151', // gray-700
  appBorderRadius: 12,

  // Typography
  fontBase: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',

  // Text colors
  textColor: '#f9fafb', // gray-50
  textInverseColor: '#111827',
  textMutedColor: '#9ca3af', // gray-400

  // Toolbar
  barTextColor: '#d1d5db', // gray-300
  barSelectedColor: '#60a5fa',
  barBg: '#111827',
  barHoverColor: '#3b82f6',

  // Form
  inputBg: '#1f2937',
  inputBorder: '#374151',
  inputTextColor: '#f9fafb',
  inputBorderRadius: 8,

  // Button
  buttonBg: '#3b82f6',
  buttonBorder: '#3b82f6',
  buttonTextColor: '#ffffff',

  // Boolean
  booleanBg: '#1f2937',
  booleanSelectedBg: '#3b82f6',
})

addons.setConfig({
  // Use custom light theme (will be overridden by dark mode addon)
  theme: clarityTheme,

  // Panel position
  panelPosition: 'bottom',

  // Enable keyboard shortcuts
  enableShortcuts: true,

  // Show toolbar
  showToolbar: true,

  // Initial active state
  initialActive: 'sidebar',

  // Sidebar configuration
  sidebar: {
    showRoots: true,
    collapsedRoots: ['Resources'],
    renderLabel: ({ name, type }) => {
      // Add icons to different sections for better visual hierarchy
      if (type === 'root') {
        if (name === 'Welcome') return `🌟 ${name}`
        if (name === 'Foundation') return `🎨 ${name}`
        if (name === 'Components') return `🧩 ${name}`
        if (name === 'Advanced Features') return `🚀 ${name}`
        if (name === 'Hooks') return `🪝 ${name}`
        if (name === 'Patterns') return `📐 ${name}`
        if (name === 'Examples') return `💼 ${name}`
        if (name === 'Resources') return `📖 ${name}`
        // Legacy categories (during transition)
        if (name === 'Primitives') return `🔧 ${name}`
        if (name === 'Getting Started') return `🚀 ${name}`
      }
      return name
    },
  },

  // Toolbar configuration
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
})

// Export themes for dark mode addon
export { clarityTheme, clarityDarkTheme }
