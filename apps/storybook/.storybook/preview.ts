import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import '../../../styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    darkMode: {
      current: 'light',
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'html',
      stylePreview: true,
      dark: { ...themes.dark },
      light: { ...themes.normal },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'gray',
          value: '#f1f5f9',
        },
      ],
    },
    // Viewport configurations for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        mobileLandscape: {
          name: 'Mobile Landscape',
          styles: {
            width: '667px',
            height: '375px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        tabletLandscape: {
          name: 'Tablet Landscape',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        desktopLarge: {
          name: 'Desktop Large',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    // Accessibility panel configuration
    a11y: {
      config: {
        rules: [
          {
            // Enable color contrast checking
            id: 'color-contrast',
            enabled: true,
          },
          {
            // Enable ARIA attribute checking
            id: 'aria-allowed-attr',
            enabled: true,
          },
          {
            // Enable button name checking
            id: 'button-name',
            enabled: true,
          },
          {
            // Enable image alt text checking
            id: 'image-alt',
            enabled: true,
          },
          {
            // Enable label checking for form inputs
            id: 'label',
            enabled: true,
          },
        ],
      },
      // Run a11y checks automatically
      manual: false,
    },
    // Layout configuration
    layout: 'centered',
    // Options panel configuration
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Components',
          [
            'Chat',
            'Messages',
            'Input',
            'Context',
            'Streaming',
            'Tools',
            'Citations',
            'Settings',
            'Utilities',
          ],
          'Hooks',
          'Examples',
        ],
      },
    },
  },
}

export default preview
