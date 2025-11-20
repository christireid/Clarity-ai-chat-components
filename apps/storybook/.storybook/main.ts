import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../stories/**/!(GettingStarted|Introduction).mdx',
    // TODO: Re-enable package stories once duplicates are resolved
    // Temporarily disabled to fix duplicate story IDs error
    // '../../../packages/error-handling/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // '../../../packages/react/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
    'storybook-dark-mode',
    // '@storybook/addon-designs', // Commented out - requires Storybook 10
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
    // Storybook 10 uses storyStoreV8 by default
    buildStoriesJson: true,
  },
    viteFinal: async (config) => {
      config.resolve = config.resolve || {}
      const existingAlias = Array.isArray(config.resolve.alias)
        ? config.resolve.alias
        : Object.entries(config.resolve.alias || {}).map(([find, replacement]) => ({
            find,
            replacement,
          }))

      config.resolve.alias = [
        { find: /^@clarity-chat\/react\/(.+)$/, replacement: path.resolve(__dirname, '../../../packages/react/src/$1') },
        { find: '@clarity-chat/react', replacement: path.resolve(__dirname, '../../../packages/react/src/index.ts') },
        { find: /^@clarity-chat\/primitives\/(.+)$/, replacement: path.resolve(__dirname, '../../../packages/primitives/src/$1') },
        { find: '@clarity-chat/primitives', replacement: path.resolve(__dirname, '../../../packages/primitives/src/index.ts') },
        { find: /^@clarity-chat\/types\/(.+)$/, replacement: path.resolve(__dirname, '../../../packages/types/src/$1') },
        { find: '@clarity-chat/types', replacement: path.resolve(__dirname, '../../../packages/types/src/index.ts') },
        { find: /^@clarity-chat\/error-handling\/(.+)$/, replacement: path.resolve(__dirname, '../../../packages/error-handling/src/$1') },
        { find: '@clarity-chat/error-handling', replacement: path.resolve(__dirname, '../../../packages/error-handling/src/index.ts') },
        ...existingAlias,
      ]
      
      // Configure build options for CSS imports
      config.build = config.build || {}
      config.build.rollupOptions = config.build.rollupOptions || {}
      config.build.rollupOptions.external = config.build.rollupOptions.external || []

      if (Array.isArray(config.build.rollupOptions.external)) {
        config.build.rollupOptions.external.push(
          'highlight.js/styles/github-dark.css',
          'katex/dist/katex.min.css'
        )
      }

      // Add process polyfill for browser compatibility
      config.define = config.define || {}
      config.define['process.env'] = JSON.stringify({})

      return config
    },

}

export default config
