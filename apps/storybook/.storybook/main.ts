// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import path, { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: [
    // IMPORTANT:
    // - Story sources in this repo are TypeScript.
    // - The `stories/` directory also contains compiled `.js` artifacts (and maps/types) which
    //   MUST NOT be loaded by Storybook or you'll get duplicate story IDs (TSX + JS).
    '../stories/**/*.stories.@(ts|tsx)',

    // Docs pages (MDX)
    '../stories/**/*.mdx',
  ],

  staticDirs: ['../public'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@vueless/storybook-dark-mode'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
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
        find: /^@clarity-chat\/license\/(.+)$/,
        replacement: path.resolve(
          __dirname,
          '../../../packages/license/src/$1'
        ),
      },
      {
        find: '@clarity-chat/license',
        replacement: path.resolve(
          __dirname,
          '../../../packages/license/src/index.ts'
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
      {
        find: /^@clarity-chat\/utils\/(.+)$/,
        replacement: path.resolve(__dirname, '../../../packages/utils/src/$1'),
      },
      {
        find: '@clarity-chat/utils',
        replacement: path.resolve(
          __dirname,
          '../../../packages/utils/src/index.ts'
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
        find: /^@clarity-chat\/token-optimization\/(.+)$/,
        replacement: path.resolve(
          __dirname,
          '../../../packages/token-optimization/src/$1'
        ),
      },
      {
        find: '@clarity-chat/token-optimization',
        replacement: path.resolve(
          __dirname,
          '../../../packages/token-optimization/src/index.ts'
        ),
      },
      ...existingAlias,
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
        'katex/dist/katex.min.css',
        /^react-window$/,
        /^react-virtualized-auto-sizer$/
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
