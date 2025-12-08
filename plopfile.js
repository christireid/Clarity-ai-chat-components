/**
 * Clarity Chat Code Generators
 *
 * Usage:
 *   pnpm generate:component  - Create a new React component
 *   pnpm generate:hook       - Create a new React hook
 *   pnpm generate:context    - Create a new React context
 *
 * @see https://plopjs.com/documentation/
 */

import { readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TEMPLATES_DIR = join(__dirname, 'tools/generators/templates')

/**
 * Validate PascalCase naming
 */
function validatePascalCase(value) {
  if (/^[A-Z][a-zA-Z0-9]*$/.test(value)) return true
  return 'Name must be PascalCase (e.g., ChatInput, MessageList)'
}

/**
 * Validate camelCase naming
 */
function validateCamelCase(value) {
  if (/^[a-z][a-zA-Z0-9]*$/.test(value)) return true
  return 'Name must be camelCase (e.g., chatState, messageHandler)'
}

/**
 * Get available packages for component generation
 */
function getPackages() {
  const packagesDir = join(__dirname, 'packages')
  const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      // Only include packages with src directory
      const srcPath = join(packagesDir, dirent.name, 'src')
      return existsSync(srcPath)
    })
    .map((dirent) => ({
      name: dirent.name,
      value: dirent.name,
    }))

  return packages
}

export default function (plop) {
  // === COMPONENT GENERATOR ===
  plop.setGenerator('component', {
    description: 'Create a new React component with tests and story',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
        validate: validatePascalCase,
      },
      {
        type: 'list',
        name: 'package',
        message: 'Which package should this component belong to?',
        choices: getPackages,
        default: 'react',
      },
      {
        type: 'list',
        name: 'componentDir',
        message: 'Component subdirectory:',
        choices: [
          { name: 'components (default)', value: 'components' },
          { name: 'ui (primitives/atoms)', value: 'ui' },
          { name: 'chat (chat-specific)', value: 'chat' },
          { name: 'layout (layout components)', value: 'layout' },
        ],
        default: 'components',
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include test file?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'withStory',
        message: 'Include Storybook story?',
        default: true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Brief description of the component:',
        default: 'A React component',
      },
    ],
    actions: (data) => {
      const basePath = `packages/${data.package}/src/${data.componentDir}/{{pascalCase name}}`
      const actions = [
        // Main component file
        {
          type: 'add',
          path: `${basePath}/{{pascalCase name}}.tsx`,
          templateFile: `${TEMPLATES_DIR}/component.tsx.hbs`,
        },
        // Index file for exports
        {
          type: 'add',
          path: `${basePath}/index.ts`,
          templateFile: `${TEMPLATES_DIR}/component-index.ts.hbs`,
        },
      ]

      // Add test file if requested
      if (data.withTests) {
        actions.push({
          type: 'add',
          path: `${basePath}/{{pascalCase name}}.test.tsx`,
          templateFile: `${TEMPLATES_DIR}/component.test.tsx.hbs`,
        })
      }

      // Add story file if requested
      if (data.withStory) {
        actions.push({
          type: 'add',
          path: `${basePath}/{{pascalCase name}}.stories.tsx`,
          templateFile: `${TEMPLATES_DIR}/component.stories.tsx.hbs`,
        })
      }

      // Add export to package's components/index.ts
      const exportPath = `packages/${data.package}/src/${data.componentDir}/index.ts`
      if (existsSync(join(__dirname, exportPath))) {
        actions.push({
          type: 'append',
          path: exportPath,
          template: "export * from './{{pascalCase name}}'\n",
        })
      }

      // Success message
      actions.push({
        type: 'add',
        path: `${basePath}/.generated`,
        template: `Generated at ${new Date().toISOString()}\n`,
        skipIfExists: true,
      })

      return actions
    },
  })

  // === HOOK GENERATOR ===
  plop.setGenerator('hook', {
    description: 'Create a new React hook with tests',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Hook name (without "use" prefix, camelCase):',
        validate: validateCamelCase,
      },
      {
        type: 'list',
        name: 'package',
        message: 'Which package should this hook belong to?',
        choices: getPackages,
        default: 'react',
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include test file?',
        default: true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Brief description of the hook:',
        default: 'A custom React hook',
      },
    ],
    actions: (data) => {
      const basePath = `packages/${data.package}/src/hooks`
      const actions = [
        // Main hook file
        {
          type: 'add',
          path: `${basePath}/use{{pascalCase name}}.ts`,
          templateFile: `${TEMPLATES_DIR}/hook.ts.hbs`,
        },
      ]

      // Add test file if requested
      if (data.withTests) {
        actions.push({
          type: 'add',
          path: `${basePath}/__tests__/use{{pascalCase name}}.test.ts`,
          templateFile: `${TEMPLATES_DIR}/hook.test.ts.hbs`,
        })
      }

      // Add export to package's hooks/index.ts
      const exportPath = `packages/${data.package}/src/hooks/index.ts`
      if (existsSync(join(__dirname, exportPath))) {
        actions.push({
          type: 'append',
          path: exportPath,
          template: "export * from './use{{pascalCase name}}'\n",
        })
      }

      return actions
    },
  })

  // === CONTEXT GENERATOR ===
  plop.setGenerator('context', {
    description: 'Create a new React context with provider and hook',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Context name (PascalCase, without "Context" suffix):',
        validate: validatePascalCase,
      },
      {
        type: 'list',
        name: 'package',
        message: 'Which package should this context belong to?',
        choices: getPackages,
        default: 'react',
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Include test file?',
        default: true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Brief description of the context:',
        default: 'A React context for state management',
      },
    ],
    actions: (data) => {
      const basePath = `packages/${data.package}/src/contexts`
      const actions = [
        // Main context file
        {
          type: 'add',
          path: `${basePath}/{{pascalCase name}}Context.tsx`,
          templateFile: `${TEMPLATES_DIR}/context.tsx.hbs`,
        },
      ]

      // Add test file if requested
      if (data.withTests) {
        actions.push({
          type: 'add',
          path: `${basePath}/__tests__/{{pascalCase name}}Context.test.tsx`,
          templateFile: `${TEMPLATES_DIR}/context.test.tsx.hbs`,
        })
      }

      // Add export to package's contexts/index.ts (create if doesn't exist)
      const exportPath = `packages/${data.package}/src/contexts/index.ts`
      if (existsSync(join(__dirname, exportPath))) {
        actions.push({
          type: 'append',
          path: exportPath,
          template: "export * from './{{pascalCase name}}Context'\n",
        })
      }

      return actions
    },
  })

  // === HELPER: Kebab case ===
  plop.setHelper('kebabCase', (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  })
}
