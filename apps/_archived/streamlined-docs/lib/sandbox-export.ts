/**
 * CodeSandbox export utility
 *
 * Generates URLs for opening code examples in CodeSandbox
 * Uses the define API: https://codesandbox.io/docs/learn/sandboxes/cli-api
 */

import LZString from 'lz-string'

interface SandboxFile {
  content: string
  isBinary?: boolean
}

interface SandboxFiles {
  [path: string]: SandboxFile
}

interface SandboxConfig {
  code: string
  title?: string
  description?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  template?: 'create-react-app' | 'create-react-app-typescript' | 'vite-react' | 'vite-react-ts'
}

const DEFAULT_DEPENDENCIES = {
  react: '^18.2.0',
  'react-dom': '^18.2.0',
  '@clarity-chat/react': 'latest',
  'framer-motion': '^11.0.0',
  'lucide-react': '^0.400.0',
}

const DEFAULT_DEV_DEPENDENCIES = {
  '@types/react': '^18.2.0',
  '@types/react-dom': '^18.2.0',
  typescript: '^5.0.0',
  '@vitejs/plugin-react': '^4.0.0',
  vite: '^5.0.0',
}

/**
 * Compresses files into CodeSandbox's expected format
 */
function compressFiles(files: SandboxFiles): string {
  return LZString.compressToBase64(JSON.stringify({ files }))
    .replace(/\+/g, '-') // URL safe base64
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Generates the index.html file content
 */
function generateIndexHtml(title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
}

/**
 * Generates the main.tsx entry point
 */
function generateMain(): string {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
}

/**
 * Generates basic CSS reset and Clarity Chat styles
 */
function generateIndexCss(): string {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }
}`
}

/**
 * Generates package.json content
 */
function generatePackageJson(config: SandboxConfig): string {
  return JSON.stringify(
    {
      name: config.title?.toLowerCase().replace(/\s+/g, '-') || 'clarity-chat-example',
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        ...DEFAULT_DEPENDENCIES,
        ...config.dependencies,
      },
      devDependencies: {
        ...DEFAULT_DEV_DEPENDENCIES,
        ...config.devDependencies,
      },
    },
    null,
    2
  )
}

/**
 * Generates vite.config.ts content
 */
function generateViteConfig(): string {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
}

/**
 * Generates tsconfig.json content
 */
function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    },
    null,
    2
  )
}

/**
 * Wraps user code in a proper App component if needed
 */
function wrapCodeAsApp(code: string): string {
  // Check if code already exports a default component
  if (code.includes('export default') || code.includes('export { default }')) {
    return code
  }

  // Check if code contains a function component definition
  const componentMatch = code.match(/function\s+(\w+)\s*\(/)
  if (componentMatch) {
    const componentName = componentMatch[1]
    return `${code}\n\nexport default ${componentName}`
  }

  // Wrap in an App component
  return `import React from 'react'

export default function App() {
  ${code}
}`
}

/**
 * Ensures the code has necessary React imports
 */
function ensureImports(code: string): string {
  let result = code

  // Add React import if not present
  if (!code.includes("from 'react'") && !code.includes('from "react"')) {
    result = `import React, { useState, useEffect, useCallback, useMemo } from 'react'\n${result}`
  }

  // Add Clarity Chat import if using components but not importing
  const clarityComponents = [
    'ChatWindow',
    'ClarityChat',
    'Message',
    'MessageList',
    'ChatInput',
    'StreamingMessage',
    'useClarityChat',
    'useChatEnhanced',
  ]

  const usedComponents = clarityComponents.filter(
    (comp) => code.includes(comp) && !code.includes(`import.*${comp}`)
  )

  if (usedComponents.length > 0 && !code.includes('@clarity-chat/react')) {
    const importStatement = `import { ${usedComponents.join(', ')} } from '@clarity-chat/react'\n`
    result = importStatement + result
  }

  return result
}

/**
 * Generates a CodeSandbox URL for the given code
 */
export function generateCodeSandboxUrl(config: SandboxConfig): string {
  const title = config.title || 'Clarity Chat Example'
  const processedCode = ensureImports(wrapCodeAsApp(config.code))

  const files: SandboxFiles = {
    'package.json': {
      content: generatePackageJson(config),
    },
    'vite.config.ts': {
      content: generateViteConfig(),
    },
    'tsconfig.json': {
      content: generateTsConfig(),
    },
    'index.html': {
      content: generateIndexHtml(title),
    },
    'src/main.tsx': {
      content: generateMain(),
    },
    'src/App.tsx': {
      content: processedCode,
    },
    'src/index.css': {
      content: generateIndexCss(),
    },
  }

  const parameters = compressFiles(files)

  return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`
}

/**
 * Generates a StackBlitz URL for the given code
 * Alternative to CodeSandbox
 */
export function generateStackBlitzUrl(config: SandboxConfig): string {
  const title = config.title || 'Clarity Chat Example'
  const processedCode = ensureImports(wrapCodeAsApp(config.code))

  const project = {
    title,
    description: config.description || 'Clarity Chat Example',
    template: 'node',
    files: {
      'package.json': generatePackageJson(config),
      'vite.config.ts': generateViteConfig(),
      'tsconfig.json': generateTsConfig(),
      'index.html': generateIndexHtml(title),
      'src/main.tsx': generateMain(),
      'src/App.tsx': processedCode,
      'src/index.css': generateIndexCss(),
    },
  }

  // StackBlitz uses a different encoding
  const encoded = encodeURIComponent(JSON.stringify(project))
  return `https://stackblitz.com/fork?project=${encoded}`
}

/**
 * Opens the code in CodeSandbox in a new tab
 */
export function openInCodeSandbox(config: SandboxConfig): void {
  const url = generateCodeSandboxUrl(config)
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Opens the code in StackBlitz in a new tab
 */
export function openInStackBlitz(config: SandboxConfig): void {
  const url = generateStackBlitzUrl(config)
  window.open(url, '_blank', 'noopener,noreferrer')
}
