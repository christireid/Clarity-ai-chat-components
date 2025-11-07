import type { Decorator, Preview } from '@storybook/react'
import React from 'react'
import { ThemeProvider } from '@clarity-chat/react'
import { getAllThemes } from '@clarity-chat/react/theme'

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
      <div className="sb-clarity-shell min-h-screen bg-background text-foreground">
        <Story />
      </div>
    </ThemeProvider>
  )
}

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Getting Started',
          'Design Principles',
          'Component Gallery',
          ['Components', 'Primitives'],
          'Hooks',
          'SDKs & Adapters',
          'Utilities',
          'Accessibility',
          'Examples',
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
      default: 'system',
      values: [
        { name: 'system', value: 'transparent' },
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#111827' },
        { name: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ],
    },
    viewport: {
      viewports: {
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
}

export default preview
