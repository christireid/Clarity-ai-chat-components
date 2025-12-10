/**
 * Clarity Chat Storybook Dark Theme
 *
 * Custom dark theme variant matching the Clarity Chat brand.
 * Optimized for reduced eye strain and OLED displays.
 */
import { create } from 'storybook/theming/create'

const clarityDarkTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Clarity Chat',
  brandUrl: 'https://claritychat.dev',
  brandImage: '/clarity-chat-logo.svg',
  brandTarget: '_self',

  // Colors - Lighter Indigo for dark mode visibility
  colorPrimary: '#818CF8', // Indigo-400
  colorSecondary: '#6366F1', // Indigo-500

  // UI - Deep slate backgrounds
  appBg: '#0F172A', // Slate-900
  appContentBg: '#1E293B', // Slate-800
  appPreviewBg: '#1E293B', // Slate-800
  appBorderColor: '#334155', // Slate-700
  appBorderRadius: 8,

  // Typography
  fontBase:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',

  // Text colors
  textColor: '#F1F5F9', // Slate-100
  textInverseColor: '#0F172A', // Slate-900
  textMutedColor: '#94A3B8', // Slate-400

  // Toolbar
  barTextColor: '#94A3B8', // Slate-400
  barSelectedColor: '#818CF8', // Indigo-400
  barHoverColor: '#6366F1', // Indigo-500
  barBg: '#1E293B', // Slate-800

  // Form colors
  inputBg: '#0F172A', // Slate-900
  inputBorder: '#334155', // Slate-700
  inputTextColor: '#F1F5F9', // Slate-100
  inputBorderRadius: 6,

  // Buttons
  buttonBg: '#6366F1', // Indigo-500
  buttonBorder: '#6366F1',

  // Boolean inputs
  booleanBg: '#334155', // Slate-700
  booleanSelectedBg: '#6366F1', // Indigo-500
})

export default clarityDarkTheme
