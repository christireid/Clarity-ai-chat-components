import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '.storybook/', 'src/**/*.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        React: 'readonly',
        JSX: 'readonly',
        fetch: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setImmediate: 'readonly',
        ReadableStream: 'readonly',
        ReadableStreamDefaultReader: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        IntersectionObserver: 'readonly',
        IntersectionObserverEntry: 'readonly',
        IntersectionObserverInit: 'readonly',
        IntersectionObserverCallback: 'readonly',
        ResizeObserver: 'readonly',
        ResizeObserverEntry: 'readonly',
        ResizeObserverCallback: 'readonly',
        RequestCredentials: 'readonly',
        ScrollBehavior: 'readonly',
        WindowEventMap: 'readonly',
        DocumentEventMap: 'readonly',
        HTMLElementEventMap: 'readonly',
        AddEventListenerOptions: 'readonly',
        EventListener: 'readonly',
        vi: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'warn', // Warn instead of error for now
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn', // Warn for require imports
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'warn', // Warn for aria issues
      'no-redeclare': 'warn', // Warn for function overloads
      'no-case-declarations': 'warn', // Warn for case declarations
    },
    settings: {
      react: {
        version: '19.0',
      },
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        fetch: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        IntersectionObserver: 'readonly',
        IntersectionObserverEntry: 'readonly',
        IntersectionObserverInit: 'readonly',
        IntersectionObserverCallback: 'readonly',
        ResizeObserver: 'readonly',
        ResizeObserverEntry: 'readonly',
        ResizeObserverCallback: 'readonly',
        RequestCredentials: 'readonly',
        ScrollBehavior: 'readonly',
        WindowEventMap: 'readonly',
        DocumentEventMap: 'readonly',
        HTMLElementEventMap: 'readonly',
        AddEventListenerOptions: 'readonly',
        EventListener: 'readonly',
        vi: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
