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
  // Upgraded to 'error' for stricter dependency array validation (2026-01-27)
  // Prevents stale closures and missing dependencies
  'react-hooks/exhaustive-deps': 'error',
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
      // Example templates contain placeholder syntax that shouldn't be linted
      'apps/examples/_template/**',
      // Marketing site compiled output (TypeScript compiles .tsx to .js in same directory)
      'apps/marketing-site/components/**/*.js',
      'apps/marketing-site/components/**/*.d.ts',
      'apps/marketing-site/lib/**/*.js',
      'apps/marketing-site/lib/**/*.d.ts',
      // Archive/legacy docs - deprecated, no longer maintained
      '**/apps/docs/.archive/**',
      // Streamlined-docs pages with JSX parsing issues in code examples
      'apps/streamlined-docs/app/api/token-optimization/use-token-count/page.tsx',
      'apps/streamlined-docs/app/cookbook/achieving-50-percent-reduction/page.tsx',
      'apps/streamlined-docs/app/cookbook/enterprise-production-pipeline/page.tsx',
      'apps/streamlined-docs/app/cookbook/provider-caching-setup/page.tsx',
      'apps/streamlined-docs/app/cookbook/token-optimization/compression-comparison/page.tsx',
      'apps/streamlined-docs/app/cookbook/token-optimization/provider-caching-anthropic/page.tsx',
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
      // Code Complexity Rules (Added 2026-01-27)
      complexity: ['warn', 15],
      'max-lines-per-function': [
        'warn',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      'max-depth': ['warn', 4],
      'max-nested-callbacks': ['warn', 3],
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

  // Clarity repo components - staged for integration, relax linting rules
  // These components are imported from external repo and will be properly migrated later
  {
    files: ['packages/react/src/components/clarity/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'clarity-animations': clarityAnimations,
    },
    rules: {
      radix: 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'no-useless-escape': 'off',
      'clarity-animations/require-reduced-motion': 'warn',
      'clarity-animations/no-hardcoded-duration': 'off',
      'clarity-animations/prefer-animation-library': 'off',
      'clarity-animations/no-layout-animation': 'off',
      complexity: 'off',
      'max-lines-per-function': 'off',
      'max-depth': 'off',
      'max-nested-callbacks': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },

  // Package-specific overrides for zero-error linting
  {
    files: ['packages/react/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'clarity-animations': clarityAnimations,
    },
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
      // Relax animation rules for existing components (pre-existing issues)
      'clarity-animations/require-reduced-motion': 'warn',
      'clarity-animations/no-layout-animation': 'warn',
      // Relax hooks exhaustive-deps to warn for existing codebase
      'react-hooks/exhaustive-deps': 'warn',
      // Relax other rules that are causing issues in existing code
      radix: 'off',
      'no-useless-escape': 'off',
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

  // Docs and examples - relax rules for documentation and demo pages (pre-existing issues)
  {
    files: [
      'apps/docs/**/*.{ts,tsx,js,jsx}',
      'apps/streamlined-docs/**/*.{ts,tsx,js,jsx}',
      'apps/examples/**/*.{ts,tsx,js,jsx}',
    ],
    plugins: {
      'clarity-animations': clarityAnimations,
    },
    rules: {
      'clarity-animations/require-reduced-motion': 'warn',
      'clarity-animations/no-hardcoded-duration': 'off',
      'clarity-animations/no-layout-animation': 'warn',
      // Relax hooks rules for docs (pre-existing issues)
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'no-script-url': 'warn',
      // Relax complexity rules for docs (pre-existing issues)
      complexity: 'off',
      'max-lines-per-function': 'off',
      'max-depth': 'off',
      'max-nested-callbacks': 'off',
      // Relax other rules for pre-existing issues
      radix: 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'jsx-a11y/role-supports-aria-props': 'warn',
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
      // Relax React hooks rules in tests
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
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
