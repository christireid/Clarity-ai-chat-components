import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming/create'

// Custom theme - refined and polished
const clarityTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Clarity Chat',
  brandUrl: 'https://clarity.chat',
  brandTarget: '_self',
  brandImage: undefined, // Use text-only branding for clean look

  // Colors - refined palette
  colorPrimary: '#2563eb', // brand-600 - slightly deeper for better contrast
  colorSecondary: '#3b82f6', // brand-500

  // UI - clean and modern
  appBg: '#fafafa', // neutral-50 - softer than gray
  appContentBg: '#ffffff',
  appBorderColor: '#e4e4e7', // zinc-200 - softer border
  appBorderRadius: 8, // slightly tighter radius

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "SF Mono", Consolas, monospace',

  // Text colors - improved hierarchy
  textColor: '#18181b', // zinc-900
  textInverseColor: '#ffffff',
  textMutedColor: '#71717a', // zinc-500

  // Toolbar - refined
  barTextColor: '#52525b', // zinc-600
  barSelectedColor: '#2563eb',
  barBg: '#ffffff',
  barHoverColor: '#1d4ed8', // brand-700

  // Form colors - polished
  inputBg: '#ffffff',
  inputBorder: '#d4d4d8', // zinc-300
  inputTextColor: '#18181b',
  inputBorderRadius: 6,

  // Button - refined
  buttonBg: '#2563eb',
  buttonBorder: 'transparent',

  // Boolean toggle
  booleanBg: '#f4f4f5', // zinc-100
  booleanSelectedBg: '#2563eb',
})

// Dark theme - refined and polished
const clarityDarkTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Clarity Chat',
  brandUrl: 'https://clarity.chat',
  brandTarget: '_self',
  brandImage: undefined,

  // Colors - refined for dark mode
  colorPrimary: '#60a5fa', // brand-400
  colorSecondary: '#3b82f6', // brand-500

  // UI - refined dark palette
  appBg: '#09090b', // zinc-950
  appContentBg: '#18181b', // zinc-900
  appBorderColor: '#27272a', // zinc-800
  appBorderRadius: 8,

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "SF Mono", Consolas, monospace',

  // Text colors
  textColor: '#fafafa', // zinc-50
  textInverseColor: '#18181b',
  textMutedColor: '#a1a1aa', // zinc-400

  // Toolbar
  barTextColor: '#d4d4d8', // zinc-300
  barSelectedColor: '#60a5fa',
  barBg: '#18181b',
  barHoverColor: '#93c5fd', // brand-300

  // Form
  inputBg: '#27272a', // zinc-800
  inputBorder: '#3f3f46', // zinc-700
  inputTextColor: '#fafafa',
  inputBorderRadius: 6,

  // Button
  buttonBg: '#3b82f6',
  buttonBorder: 'transparent',

  // Boolean
  booleanBg: '#27272a',
  booleanSelectedBg: '#3b82f6',
})

addons.setConfig({
  // Theme
  theme: clarityTheme,

  // Panel position - right side for better vertical space
  panelPosition: 'right',

  // Enable keyboard shortcuts
  enableShortcuts: true,

  // Show toolbar
  showToolbar: true,

  // Initial active state
  initialActive: 'sidebar',

  // Sidebar configuration - clean, no emojis
  sidebar: {
    showRoots: true,
    collapsedRoots: ['Advanced', 'Primitives'],
  },

  // Toolbar - show essential tools
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
