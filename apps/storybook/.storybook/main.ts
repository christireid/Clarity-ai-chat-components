import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  
  docs: {
    autodocs: 'tag',
  },
  
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
      propFilter: (prop) => {
        // Filter out props from node_modules except our packages
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules') ||
            prop.parent.fileName.includes('@clarity-chat')
        }
        return true
      },
    },
  },
  
  core: {
    disableTelemetry: true,
  },
  
  features: {
    storyStoreV7: true,
    buildStoriesJson: true,
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@clarity-chat/react': path.resolve(__dirname, '../../../packages/react/src'),
      '@clarity-chat/primitives': path.resolve(__dirname, '../../../packages/primitives/src'),
      '@clarity-chat/types': path.resolve(__dirname, '../../../packages/types/src'),
    };
    return config;
  },

}

export default config
