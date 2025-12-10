/**
 * Storybook Main Configuration
 *
 * Industry-leading documentation system for Clarity Chat
 * Features: accessibility testing, theme switching, API mocking, visual testing
 */
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: [
    // Documentation pages (MDX) - Introduction, DesignSystem, etc.
    '../stories/**/*.mdx',
    // Storybook stories (organized hierarchy)
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Note: Package stories temporarily disabled to fix MSW resolution issues
    // They can be re-enabled once msw is properly configured for monorepo
    // '../../../packages/react/src/components/**/*.stories.@(ts|tsx)',
    // '../../../packages/react/src/hooks/**/*.stories.@(ts|tsx)',
  ],

  staticDirs: ['../public'],

  addons: [
    // Essential addons (controls, actions, viewport, backgrounds, docs)
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-links'),

    // Accessibility testing with axe-core
    getAbsolutePath('@storybook/addon-a11y'),

    // Theme switching for light/dark mode
    getAbsolutePath('@storybook/addon-themes'),

    // Visual testing with Chromatic
    getAbsolutePath('@chromatic-com/storybook'),

    // API mocking for streaming demos
    'msw-storybook-addon',

    // Dark mode for Storybook UI
    getAbsolutePath('storybook-dark-mode'),

    // CSS pseudo states (:hover, :focus, :active)
    getAbsolutePath('storybook-addon-pseudo-states'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      },
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
      : Object.entries(config.resolve.alias || {}).map(
          ([find, replacement]) => ({
            find,
            replacement,
          })
        )

    config.resolve.alias = [
      {
        find: /^@clarity-chat\/react\/(.+)$/,
        replacement: path.resolve(__dirname, '../../../packages/react/src/$1'),
      },
      {
        find: '@clarity-chat/react',
        replacement: path.resolve(
          __dirname,
          '../../../packages/react/src/index.ts'
        ),
      },
      {
        find: /^@clarity-chat\/primitives\/(.+)$/,
        replacement: path.resolve(
          __dirname,
          '../../../packages/primitives/src/$1'
        ),
      },
      {
        find: '@clarity-chat/primitives',
        replacement: path.resolve(
          __dirname,
          '../../../packages/primitives/src/index.ts'
        ),
      },
      {
        find: /^@clarity-chat\/types\/(.+)$/,
        replacement: path.resolve(__dirname, '../../../packages/types/src/$1'),
      },
      {
        find: '@clarity-chat/types',
        replacement: path.resolve(
          __dirname,
          '../../../packages/types/src/index.ts'
        ),
      },
      {
        find: /^@clarity-chat\/error-handling\/(.+)$/,
        replacement: path.resolve(
          __dirname,
          '../../../packages/error-handling/src/$1'
        ),
      },
      {
        find: '@clarity-chat/error-handling',
        replacement: path.resolve(
          __dirname,
          '../../../packages/error-handling/src/index.ts'
        ),
      },
      {
        find: /^@clarity-chat\/memory\/(.+)$/,
        replacement: path.resolve(__dirname, '../../../packages/memory/src/$1'),
      },
      {
        find: '@clarity-chat/memory',
        replacement: path.resolve(
          __dirname,
          '../../../packages/memory/src/index.ts'
        ),
      },
      // shadcn/ui path alias for primitives package
      {
        find: /^@\/(.+)$/,
        replacement: path.resolve(
          __dirname,
          '../../../packages/primitives/src/$1'
        ),
      },
      ...existingAlias,
    ]

    // Dedupe React and other heavy dependencies to ensure single versions
    config.resolve.dedupe = [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
    ]

    // Pre-bundle dependencies that are imported from package source files
    config.optimizeDeps = config.optimizeDeps || {}
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'framer-motion',
      'lucide-react',
      'react-markdown',
      'clsx',
      'class-variance-authority',
      'tailwind-merge',
      'highlight.js',
      'katex',
      'mermaid',
      'prismjs',
      'js-tiktoken',
    ]

    // Configure build options for CSS imports and externals
    config.build = config.build || {}
    config.build.rollupOptions = config.build.rollupOptions || {}
    config.build.rollupOptions.external =
      config.build.rollupOptions.external || []

    // Vite 7: Need to externalize dependencies properly
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

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
