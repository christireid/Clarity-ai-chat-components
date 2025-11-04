import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**'],
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
        React: 'readonly',
        JSX: 'readonly',
        // Browser globals
        document: 'readonly',
        window: 'readonly',
        Window: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        getComputedStyle: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        // HTML Elements
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLParagraphElement: 'readonly',
        HTMLUListElement: 'readonly',
        HTMLLIElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLElementEventMap: 'readonly',
        Element: 'readonly',
        // SVG Elements
        SVGSVGElement: 'readonly',
        SVGPathElement: 'readonly',
        // Events
        Event: 'readonly',
        EventTarget: 'readonly',
        EventListener: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        TouchEvent: 'readonly',
        FocusEvent: 'readonly',
        // Modern fetch API
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        // Modern JavaScript APIs
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        // DOM APIs
        Node: 'readonly',
        NodeList: 'readonly',
        CustomEvent: 'readonly',
        // Storage
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        StorageEvent: 'readonly',
        // Observers
        IntersectionObserver: 'readonly',
        IntersectionObserverEntry: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        // File APIs
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        DataTransfer: 'readonly',
        // Performance API
        performance: 'readonly',
        PerformanceEntry: 'readonly',
        PerformanceObserver: 'readonly',
        // Error types
        ErrorEvent: 'readonly',
        PromiseRejectionEvent: 'readonly',
        DOMException: 'readonly',
        // Other browser APIs
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        IntersectionObserverInit: 'readonly',
        MediaQueryList: 'readonly',
        MediaQueryListEvent: 'readonly',
        // WebSocket
        WebSocket: 'readonly',
        MessageEvent: 'readonly',
        CloseEvent: 'readonly',
        // Streams API
        ReadableStream: 'readonly',
        ReadableStreamDefaultReader: 'readonly',
        WritableStream: 'readonly',
        TransformStream: 'readonly',
        // DOM Parser
        DOMParser: 'readonly',
        // Scroll behavior
        ScrollBehavior: 'readonly',
        // Event Maps
        WindowEventMap: 'readonly',
        DocumentEventMap: 'readonly',
        AddEventListenerOptions: 'readonly',
        // Document type
        Document: 'readonly',
        // Crypto
        crypto: 'readonly',
        Crypto: 'readonly',
        SubtleCrypto: 'readonly',
        // Node globals for build
        process: 'readonly',
        NodeJS: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
    },
    settings: {
      react: {
        version: '19.0',
      },
    },
  },
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
    ],
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
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        // Browser globals for tests
        global: 'readonly',
        fetch: 'readonly',
        TextDecoder: 'readonly',
        TextEncoder: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        FocusEvent: 'readonly',
        Node: 'readonly',
        document: 'readonly',
        window: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        HTMLInputElement: 'readonly',
        navigator: 'readonly',
        File: 'readonly',
        HTMLTextAreaElement: 'readonly',
        alert: 'readonly',
        DataTransfer: 'readonly',
        // WebSocket and Streaming APIs for tests
        WebSocket: 'readonly',
        MessageEvent: 'readonly',
        CloseEvent: 'readonly',
        Event: 'readonly',
        ReadableStream: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in tests
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '.storybook/',
      'packages/*/dist/',
      'storybook-static/',
    ],
  },
]
