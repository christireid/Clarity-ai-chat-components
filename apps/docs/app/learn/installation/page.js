import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { InstallationFlow } from '@/components/Diagrams/InstallationFlow';
export const metadata = {
    title: 'Installation',
    description: 'How to install Clarity Chat UI in your project',
};
export default function InstallationPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "Installation" }), _jsx("p", { className: "lead", children: "Learn how to install and configure Clarity Chat UI in your React project. We support multiple frameworks and build tools." }), _jsx("h2", { id: "requirements", children: "Requirements" }), _jsx("p", { children: "Clarity Chat UI requires the following:" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "React 18.0.0" }), " or higher"] }), _jsxs("li", { children: [_jsx("strong", { children: "Node.js 18.0.0" }), " or higher"] }), _jsxs("li", { children: [_jsx("strong", { children: "TypeScript 5.0.0" }), " or higher (recommended)"] })] }), _jsx(InstallationFlow, {}), _jsx("h2", { id: "package-managers", children: "Package Managers" }), _jsx("p", { children: "Install using your preferred package manager:" }), _jsx("h3", { children: "npm" }), _jsx(CodeBlock, { code: "npm install @clarity-chat/react", language: "bash" }), _jsx("h3", { children: "yarn" }), _jsx(CodeBlock, { code: "yarn add @clarity-chat/react", language: "bash" }), _jsx("h3", { children: "pnpm" }), _jsx(CodeBlock, { code: "pnpm add @clarity-chat/react", language: "bash" }), _jsx("h3", { children: "bun" }), _jsx(CodeBlock, { code: "bun add @clarity-chat/react", language: "bash" }), _jsx("h2", { id: "peer-dependencies", children: "Peer Dependencies" }), _jsx("p", { children: "Clarity Chat UI has the following peer dependencies that should already be in your project:" }), _jsx(CodeBlock, { code: `{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}`, language: "json" }), _jsx(Callout, { type: "info", children: "These are usually already installed in React projects. If not, install them with your package manager." }), _jsx("h2", { id: "import-styles", children: "Import Styles" }), _jsx("p", { children: "Import the CSS file in your root component or entry file:" }), _jsx(CodeBlock, { code: `// In your main App.tsx or index.tsx
import '@clarity-chat/react/styles.css'`, language: "tsx" }), _jsx("h2", { id: "framework-setup", children: "Framework-Specific Setup" }), _jsx("h3", { children: "Next.js" }), _jsx("p", { children: "For Next.js 13+ with App Router:" }), _jsx(CodeBlock, { code: `// app/layout.tsx
import '@clarity-chat/react/styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`, language: "tsx", title: "app/layout.tsx" }), _jsxs(Callout, { type: "warning", children: ["Some components use client-side features. Make sure to use", ' ', _jsx("code", { children: "'use client'" }), " directive when needed."] }), _jsx("h3", { children: "Vite" }), _jsx("p", { children: "For Vite projects, import styles in your main.tsx:" }), _jsx(CodeBlock, { code: `// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@clarity-chat/react/styles.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`, language: "tsx", title: "src/main.tsx" }), _jsx("h3", { children: "Create React App" }), _jsx("p", { children: "For CRA projects, import styles in index.tsx:" }), _jsx(CodeBlock, { code: `// src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@clarity-chat/react/styles.css'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`, language: "tsx", title: "src/index.tsx" }), _jsx("h2", { id: "typescript", children: "TypeScript Configuration" }), _jsx("p", { children: "Clarity Chat UI is written in TypeScript and includes type definitions. No additional setup needed!" }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: [_jsx("strong", { children: "Full TypeScript support" }), " - Get autocomplete, type checking, and inline documentation in your IDE."] }) }), _jsx("p", { children: "For optimal experience, ensure your tsconfig.json includes:" }), _jsx(CodeBlock, { code: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}`, language: "json", title: "tsconfig.json" }), _jsx("h2", { id: "tailwind-css", children: "Tailwind CSS (Optional)" }), _jsx("p", { children: "Clarity Chat UI uses Tailwind CSS internally but doesn't require it in your project. However, if you want to customize styles using Tailwind:" }), _jsx(CodeBlock, { code: `// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`, language: "javascript", title: "tailwind.config.js" }), _jsx("h2", { id: "verification", children: "Verify Installation" }), _jsx("p", { children: "Test your installation with a simple component:" }), _jsx(CodeBlock, { code: `import { ChatWindow } from '@clarity-chat/react'

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <ChatWindow
        messages={[]}
        onSendMessage={(text) => console.log(text)}
      />
    </div>
  )
}

export default App`, language: "tsx" }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["If you see the chat window, you're all set! If you encounter issues, check our", ' ', _jsx("a", { href: "/learn/guides/troubleshooting", children: "Troubleshooting Guide" }), "."] }) }), _jsx("h2", { id: "cdn", children: "CDN (Not Recommended)" }), _jsx("p", { children: "While not recommended for production, you can use Clarity Chat via CDN for quick prototyping:" }), _jsx(CodeBlock, { code: `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://unpkg.com/@clarity-chat/react/dist/styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@clarity-chat/react/dist/index.umd.js"></script>
  </body>
</html>`, language: "html" }), _jsx(Callout, { type: "warning", children: "CDN usage is not recommended for production. Use npm/yarn for better performance and tree-shaking." }), _jsx(Pagination, { prev: {
                    title: 'Quick Start',
                    href: '/learn/quick-start',
                }, next: {
                    title: 'Tutorial',
                    href: '/learn/tutorial',
                } })] }));
}
//# sourceMappingURL=page.js.map