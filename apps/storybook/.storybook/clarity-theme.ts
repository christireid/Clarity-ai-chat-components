/**
 * Clarity Chat Storybook Theme
 *
 * Custom light theme matching the Clarity Chat brand identity.
 * Uses an Indigo-based color palette for a modern, professional look.
 */
import { create } from 'storybook/theming/create'

const clarityTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Clarity Chat',
  brandUrl: 'https://claritychat.dev',
  brandImage: '/clarity-chat-logo.svg',
  brandTarget: '_self',

  // Colors - Indigo-based palette
  colorPrimary: '#6366F1', // Indigo-500
  colorSecondary: '#4F46E5', // Indigo-600

  // UI
  appBg: '#F8FAFC', // Slate-50
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E2E8F0', // Slate-200
  appBorderRadius: 8,

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',

  // Text colors
  textColor: '#1E293B', // Slate-800
  textInverseColor: '#FFFFFF',
  textMutedColor: '#64748B', // Slate-500

  // Toolbar
  barTextColor: '#64748B', // Slate-500
  barSelectedColor: '#4F46E5', // Indigo-600
  barHoverColor: '#6366F1', // Indigo-500
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#CBD5E1', // Slate-300
  inputTextColor: '#1E293B', // Slate-800
  inputBorderRadius: 6,

  // Buttons
  buttonBg: '#4F46E5', // Indigo-600
  buttonBorder: '#4F46E5',

  // Boolean inputs
  booleanBg: '#E2E8F0', // Slate-200
  booleanSelectedBg: '#4F46E5', // Indigo-600
})

export default clarityTheme
