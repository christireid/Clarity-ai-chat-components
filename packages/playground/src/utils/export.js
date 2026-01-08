/**
 * Export Utilities for Playground
 *
 * Generates CodeSandbox and StackBlitz URLs for exporting playground code.
 */
import LZString from 'lz-string';
const DEFAULT_DEPENDENCIES = {
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    '@clarity-chat/react': 'latest',
    'framer-motion': '^12.0.0',
    'lucide-react': '^0.400.0',
};
const DEFAULT_DEV_DEPENDENCIES = {
    '@types/react': '^19.0.0',
    '@types/react-dom': '^19.0.0',
    typescript: '^5.0.0',
    '@vitejs/plugin-react': '^4.0.0',
    vite: '^6.0.0',
};
/**
 * Compresses files for CodeSandbox URL
 */
function compressFiles(files) {
    return LZString.compressToBase64(JSON.stringify({ files }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
/**
 * Generates index.html content
 */
function generateIndexHtml(title) {
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
</html>`;
}
/**
 * Generates main.tsx entry point
 */
function generateMain() {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;
}
/**
 * Generates basic CSS reset
 */
function generateIndexCss() {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #ffffff;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #fff;
  }
}`;
}
/**
 * Generates package.json content
 */
function generatePackageJson(config) {
    return JSON.stringify({
        name: config.title?.toLowerCase().replace(/\s+/g, '-') ||
            'clarity-chat-example',
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
    }, null, 2);
}
/**
 * Generates vite.config.ts content
 */
function generateViteConfig() {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;
}
/**
 * Generates tsconfig.json content
 */
function generateTsConfig() {
    return JSON.stringify({
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
    }, null, 2);
}
/**
 * Wraps user code in a proper App component if needed
 */
function wrapCodeAsApp(code) {
    // Check if code already exports a default component
    if (code.includes('export default') || code.includes('export { default }')) {
        return code;
    }
    // Check if code contains a function component definition
    const componentMatch = code.match(/function\s+(\w+)\s*\(/);
    if (componentMatch) {
        const componentName = componentMatch[1];
        return `${code}\n\nexport default ${componentName}`;
    }
    // Wrap in an App component
    return `import React from 'react'

export default function App() {
  ${code}
}`;
}
/**
 * Ensures the code has necessary React imports
 */
function ensureImports(code) {
    let result = code;
    // Add React import if not present
    if (!code.includes("from 'react'") && !code.includes('from "react"')) {
        result = `import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'\n${result}`;
    }
    // Add Clarity Chat import if using components but not importing
    const clarityComponents = [
        'ChatWindow',
        'ClarityChat',
        'Message',
        'MessageList',
        'ChatInput',
        'StreamingMessage',
        'StreamingTextRenderer',
        'useClarityChat',
        'useChatEnhanced',
        'useChat',
        'Button',
        'Badge',
        'Toast',
        'ToastProvider',
        'useToast',
        'TokenCounter',
        'PromptSuggestions',
    ];
    const usedComponents = clarityComponents.filter((comp) => code.includes(comp) && !code.includes(`import.*${comp}`));
    if (usedComponents.length > 0 && !code.includes('@clarity-chat/react')) {
        const importStatement = `import { ${usedComponents.join(', ')} } from '@clarity-chat/react'\n`;
        result = importStatement + result;
    }
    return result;
}
/**
 * Generates a CodeSandbox URL
 */
export function generateCodeSandboxUrl(config) {
    const title = config.title || 'Clarity Chat Example';
    const processedCode = ensureImports(wrapCodeAsApp(config.code));
    const files = {
        'package.json': { content: generatePackageJson(config) },
        'vite.config.ts': { content: generateViteConfig() },
        'tsconfig.json': { content: generateTsConfig() },
        'index.html': { content: generateIndexHtml(title) },
        'src/main.tsx': { content: generateMain() },
        'src/App.tsx': { content: processedCode },
        'src/index.css': { content: generateIndexCss() },
    };
    const parameters = compressFiles(files);
    return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
}
/**
 * Generates a StackBlitz URL
 */
export function generateStackBlitzUrl(config) {
    const title = config.title || 'Clarity Chat Example';
    const processedCode = ensureImports(wrapCodeAsApp(config.code));
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
    };
    const encoded = encodeURIComponent(JSON.stringify(project));
    return `https://stackblitz.com/fork?project=${encoded}`;
}
/**
 * Opens the code in CodeSandbox in a new tab
 */
export function openInCodeSandbox(config) {
    const url = generateCodeSandboxUrl(config);
    window.open(url, '_blank', 'noopener,noreferrer');
}
/**
 * Opens the code in StackBlitz in a new tab
 */
export function openInStackBlitz(config) {
    const url = generateStackBlitzUrl(config);
    window.open(url, '_blank', 'noopener,noreferrer');
}
/**
 * Downloads code as a zip file
 */
export async function downloadAsZip(config) {
    // For now, just download as a single file
    // Full zip support would require a library like JSZip
    const processedCode = ensureImports(wrapCodeAsApp(config.code));
    const blob = new Blob([processedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.title?.toLowerCase().replace(/\s+/g, '-') || 'clarity-chat-example'}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
/**
 * Copies text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text) {
    // Try modern Clipboard API first
    if (navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function') {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        }
        catch {
            // Fall through to fallback
        }
    }
    // Fallback for older browsers using execCommand
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.pointerEvents = 'none';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    }
    catch {
        return false;
    }
}
/**
 * Copies code to clipboard (alias for copyToClipboard for backwards compatibility)
 */
export async function copyCode(code) {
    return copyToClipboard(code);
}
//# sourceMappingURL=export.js.map