import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, join } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  // Use Vite 7.x explicitly
  core: {
    disableTelemetry: true,
  },

  // Docs configuration
  docs: {},

  // TypeScript configuration
  typescript: {
    check: false, // Faster build, rely on IDE for type checking
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        // Filter out props from node_modules except our packages
        if (prop.parent) {
          return (
            !prop.parent.fileName.includes('node_modules') ||
            prop.parent.fileName.includes('@clarity-chat')
          )
        }
        return true
      },
    },
  },

  // Optimize build performance
  viteFinal: async (config) => {
    return {
      ...config,
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include || []),
          '@clarity-chat/primitives',
          '@clarity-chat/utils',
        ],
      },
    }
  },
}

export default config

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}
