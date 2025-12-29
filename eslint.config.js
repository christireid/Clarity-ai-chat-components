import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import clarityAnimations from './eslint-plugin-clarity-animations/index.js'
import clarityDeprecations from './eslint-plugin-clarity-deprecations/index.mjs'

// Security-focused rules to catch common vulnerabilities
const securityRules = {
  // Prevent eval() usage
  'no-eval': 'error',
  // Prevent implied eval via setTimeout/setInterval with strings
  'no-implied-eval': 'error',
  // Prevent new Function() with string arguments
  'no-new-func': 'warn',
  // Prevent script URL usage
  'no-script-url': 'error',
  // Warn on prototype pollution patterns
  'no-prototype-builtins': 'warn',
  // Prevent Buffer() constructor (security issues in older Node)
  'no-buffer-constructor': 'error',
  // Ensure consistent return in callbacks (helps prevent logic errors)
  'array-callback-return': 'error',
  // Require radix parameter to parseInt
  radix: 'error',
  // Prevent void operator (can be used for injection)
  'no-void': 'warn',
}

const sharedRules = {
  'react/react-in-jsx-scope': 'off',
  'react/prop-types': 'off',
  'react-hooks/rules-of-hooks': 'error',
  // Note: exhaustive-deps is intentionally off to avoid false positives with
  // intentional dependency omissions. See React docs on when to omit dependencies.
  // TODO: Consider enabling as 'warn' after comprehensive dependency audit.
  'react-hooks/exhaustive-deps': 'off',
  'jsx-a11y/alt-text': 'error',
  'jsx-a11y/aria-props': 'error',
  'jsx-a11y/aria-proptypes': 'error',
  'jsx-a11y/aria-unsupported-elements': 'error',
  'jsx-a11y/role-has-required-aria-props': 'error',
  'jsx-a11y/role-supports-aria-props': 'error',
}

const sharedPlugins = {
  '@typescript-eslint': tseslint,
  react: reactPlugin,
  'react-hooks': reactHooksPlugin,
  'jsx-a11y': jsxA11yPlugin,
}

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/coverage/',
      '**/.next/',
      '**/out/',
      '**/storybook-static/',
      '**/.turbo/',
      '**/*.d.ts.map',
      '**/*.js.map',
      '**/*.config.d.ts',
      '**/*.config.js.map',
      '**/*.config.d.ts.map',
      '**/tsup.config.bundled_*.mjs',
      '**/tsup.config.bundled_*.d.mts',
      'apps/docs/.vitepress/examples/MarkdownDemo.tsx',
    ],
  },

  // Base JavaScript config
  js.configs.recommended,

  // JavaScript/JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: sharedPlugins,
    rules: {
      ...sharedRules,
      ...securityRules,
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // TypeScript/TSX files
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        React: 'readonly',
        JSX: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      ...sharedPlugins,
      'clarity-animations': clarityAnimations,
      'clarity-deprecations': clarityDeprecations,
    },
    settings: {
      react: { version: '19.0' },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...sharedRules,
      ...securityRules,
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      // Security: Detect dangerous React patterns
      'react/no-danger': 'warn',
      'react/no-danger-with-children': 'error',
      // Clarity Animations rules
      'clarity-animations/no-hardcoded-duration': 'warn',
      'clarity-animations/no-layout-animation': 'error',
      'clarity-animations/prefer-animation-library': 'warn',
      // WCAG 2.3.3: All animation components must support reduced motion
      'clarity-animations/require-reduced-motion': 'error',
      // Clarity Deprecations rules - catch deprecated hook imports
      'clarity-deprecations/no-deprecated-hooks': 'warn',
      'clarity-deprecations/no-deprecated-hook-calls': 'warn',
    },
  },

  // Storybook files - disable hooks rules for story render functions
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },

  // Type declaration files
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },

  // Testing utilities package - exports functions that use expect
  {
    files: ['packages/testing-utils/src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        expect: 'readonly',
      },
    },
  },

  // Package-specific overrides for zero-error linting
  {
    files: ['packages/react/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-import-assign': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'jsx-a11y/role-supports-aria-props': 'off',
      'react-hooks/rules-of-hooks': 'off',
      // Security: Allow controlled use of danger in library code
      'react/no-danger': 'off',
      // Security: Allow new Function in safe-evaluate.ts with documentation
      'no-new-func': 'off',
      // React 19: Warn on forwardRef usage - prefer ref-as-prop pattern
      // See: packages/react/REACT_19_REF_MIGRATION.md
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.name="forwardRef"]',
          message:
            'React 19: Prefer ref-as-prop pattern over forwardRef. See REACT_19_REF_MIGRATION.md for migration guide.',
        },
        {
          selector:
            'CallExpression[callee.object.name="React"][callee.property.name="forwardRef"]',
          message:
            'React 19: Prefer ref-as-prop pattern over React.forwardRef. See REACT_19_REF_MIGRATION.md for migration guide.',
        },
      ],
    },
  },
  {
    files: [
      'packages/dev-tools/**/*.{ts,tsx,js,jsx}',
      'packages/cli/**/*.{ts,tsx,js,jsx}',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['packages/token-optimization/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Playground - needs unsafe-eval for live code preview
  {
    files: ['packages/playground/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-new-func': 'off',
      'no-eval': 'off',
    },
  },

  // Apps and examples overrides
  {
    files: ['apps/**/*.{ts,tsx,js,jsx}', 'examples/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-undef': 'off',
      'no-case-declarations': 'off',
    },
  },

  // Test files - relaxed security rules for testing
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/test-utils/**/*.{ts,tsx,js,jsx}',
      '**/test-setup.{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        jest: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    plugins: sharedPlugins,
    settings: {
      react: { version: '19.0' },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...sharedRules,
      'no-undef': 'off', // TypeScript handles this
      'no-unexpected-multiline': 'off', // TypeScript handles this
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      // Relax security rules in tests
      'no-eval': 'off',
      'no-new-func': 'off',
    },
  },

  // Linter options
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },

  // Storybook plugin config
  ...storybook.configs['flat/recommended'],

  // Storybook overrides (must come after storybook config)
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    rules: {
      'storybook/no-renderer-packages': 'off',
    },
  },
]
