import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Interactive Playground',
    description: 'Try out Clarity Chat components with live code editing',
};
const exampleCode = `import { Button, Badge, ToastProvider, useToast } from '@clarity-chat/react'
import { Send } from 'lucide-react'

function App() {
  const { success } = useToast()

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold">Button Examples</h2>

      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="primary" onClick={() => success('Primary clicked!')}>
          Primary
        </Button>
        <Button variant="secondary">
          Secondary
        </Button>
        <Button variant="success">
          Success
        </Button>
        <Button variant="outline">
          Outline
        </Button>
      </div>

      <h2 className="text-2xl font-bold mt-4">Badge Examples</h2>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>

      <h2 className="text-2xl font-bold mt-4">With Icons</h2>

      <div className="flex items-center gap-3">
        <Button variant="primary">
          <Send className="w-4 h-4 mr-2" />
          Send Message
        </Button>
        <Button isLoading variant="secondary">
          Loading...
        </Button>
      </div>
    </div>
  )
}

render(<App />)`;
export default function PlaygroundDemoPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "\uD83C\uDFAE Interactive" }), _jsx("h1", { children: "Live Playground" }), _jsx("p", { className: "docs-lead", children: "Edit the code below to see real Clarity Chat components in action. All components are rendered using the actual library code - no mocks!" })] }), _jsxs("section", { className: "docs-section", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "Try it yourself" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: ["The playground below uses ", _jsx("code", { className: "text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded", children: "react-live" }), " to render real components from ", _jsx("code", { className: "text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded", children: "@clarity-chat/react" }), ". Modify the code to experiment with different props, variants, and compositions."] })] }), _jsx(CodePlayground, { initialCode: exampleCode })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "\u2728 Key Features" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 my-6", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: "Real Components" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Uses actual @clarity-chat/react components, not mocks. See exactly how your components will behave in production." })] }), _jsxs("div", { className: "p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: "Live Preview" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Changes update instantly as you type. Experiment with different props and see results in real-time." })] }), _jsxs("div", { className: "p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: "Full Access" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: "All exported components, hooks, and utilities are available in scope. No imports needed in the playground." })] }), _jsxs("div", { className: "p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800", children: [_jsx("h3", { className: "font-bold text-lg mb-2", children: "Error Handling" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: "See helpful error messages and stack traces when something goes wrong. Great for learning." })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "\uD83D\uDE80 Available in Scope" }), _jsx("p", { className: "mb-4", children: "All Clarity Chat components and React hooks are available without imports:" }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Components" }), _jsx("code", { className: "text-sm text-gray-700 dark:text-gray-300", children: "Button, Badge, ChatWindow, Message, ToastProvider, and all other @clarity-chat/react components" }), _jsx("h4", { className: "font-semibold mt-4 mb-2", children: "Hooks" }), _jsx("code", { className: "text-sm text-gray-700 dark:text-gray-300", children: "useState, useEffect, useCallback, useMemo, useRef, useContext, createContext, useToast, and all other React hooks" }), _jsx("h4", { className: "font-semibold mt-4 mb-2", children: "Utilities" }), _jsx("code", { className: "text-sm text-gray-700 dark:text-gray-300", children: "render (for rendering components)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "\uD83D\uDCA1 Tips" }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: "\u2022 Edit the code in the left panel to see changes in real-time" }), _jsxs("li", { children: ["\u2022 Use ", _jsx("code", { className: "text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded", children: "render(<YourComponent />)" }), " to display your component"] }), _jsx("li", { children: "\u2022 All Clarity components are wrapped with ToastProvider automatically" }), _jsx("li", { children: "\u2022 Errors will appear above the preview with helpful debugging information" }), _jsx("li", { children: "\u2022 Click the reset button to restore the original example code" })] })] })] }));
}
//# sourceMappingURL=page.js.map