import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Playground Guide - Clarity Chat',
    description: 'Learn how to use the Interactive Playground effectively.',
};
export default function PlaygroundGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "Playground Guide" }), _jsx("p", { className: "docs-lead", children: "Master the Interactive Playground to rapidly prototype and learn Clarity Chat components." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Getting Started" }), _jsx(Callout, { type: "info", title: "No Setup Required", children: "The playground runs entirely in your browser - no installation, no account, no configuration needed!" }), _jsx("h3", { children: "Quick Start" }), _jsxs("ol", { children: [_jsxs("li", { children: ["Visit the ", _jsx("a", { href: "/playground", children: "Interactive Playground" })] }), _jsx("li", { children: "Select a template from the sidebar" }), _jsx("li", { children: "Edit the code in the editor" }), _jsx("li", { children: "See live preview instantly" }), _jsx("li", { children: "Copy, download, or export your code" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Interface Overview" }), _jsx("h3", { children: "Layout" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Left Sidebar" }), " - Template browser with search and categories"] }), _jsxs("li", { children: [_jsx("strong", { children: "Code Editor" }), " - Monaco Editor with TypeScript support"] }), _jsxs("li", { children: [_jsx("strong", { children: "Live Preview" }), " - Real-time component rendering"] }), _jsxs("li", { children: [_jsx("strong", { children: "Top Controls" }), " - Copy, download, share, and export buttons"] })] }), _jsx("h3", { children: "Editor Features" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "Syntax Highlighting" }), " - Full TypeScript/React syntax"] }), _jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "IntelliSense" }), " - Auto-complete for Clarity Chat components"] }), _jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "Error Detection" }), " - Real-time type checking"] }), _jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "Auto-formatting" }), " - Format on paste and type"] }), _jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "Line Numbers" }), " - Easy code navigation"] }), _jsxs("li", { children: ["\u2705 ", _jsx("strong", { children: "Word Wrap" }), " - Automatic line wrapping"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Templates" }), _jsx("h3", { children: "15 Pre-built Templates" }), _jsx("h4", { children: "Basics (4 templates)" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Simple Chat" }), " - Basic chat window with streaming"] }), _jsxs("li", { children: [_jsx("strong", { children: "Chat with Avatars" }), " - Custom avatars and metadata"] }), _jsxs("li", { children: [_jsx("strong", { children: "Custom Theme" }), " - Theming and color customization"] }), _jsxs("li", { children: [_jsx("strong", { children: "Thinking Indicator" }), " - AI processing visualization"] })] }), _jsx("h4", { children: "Advanced (6 templates)" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "File Upload" }), " - Document upload handling"] }), _jsxs("li", { children: [_jsx("strong", { children: "Markdown & Code" }), " - Rich content rendering"] }), _jsxs("li", { children: [_jsx("strong", { children: "Multi-Modal Preview" }), " - Images and media"] }), _jsxs("li", { children: [_jsx("strong", { children: "RAG Document Chat" }), " - Retrieval with citations"] }), _jsxs("li", { children: [_jsx("strong", { children: "Error Handling" }), " - Graceful error recovery"] }), _jsxs("li", { children: [_jsx("strong", { children: "Streaming Progress" }), " - Progress visualization"] }), _jsxs("li", { children: [_jsx("strong", { children: "Conversation Timeline" }), " - Event flow timeline"] })] }), _jsx("h4", { children: "Interactive (3 templates)" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Command Palette" }), " - Keyboard-driven commands"] }), _jsxs("li", { children: [_jsx("strong", { children: "Follow-up Suggestions" }), " - Smart continuation chips"] }), _jsxs("li", { children: [_jsx("strong", { children: "Keyboard Shortcuts" }), " - Custom hotkeys"] })] }), _jsx("h4", { children: "Monitoring (3 templates)" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Performance Dashboard" }), " - Real-time metrics"] }), _jsxs("li", { children: [_jsx("strong", { children: "Memory Inspector" }), " - Context visualization"] }), _jsxs("li", { children: [_jsx("strong", { children: "Context Visualizer" }), " - AI context view"] }), _jsxs("li", { children: [_jsx("strong", { children: "Token Tracking" }), " - Usage monitoring"] })] }), _jsx("h4", { children: "Agents (1 template)" }), _jsx("ul", { children: _jsxs("li", { children: [_jsx("strong", { children: "Agent with Tools" }), " - Function calling example"] }) }), _jsx("h4", { children: "Enterprise (1 template)" }), _jsx("ul", { children: _jsxs("li", { children: [_jsx("strong", { children: "Enterprise SSO" }), " - Authentication flow"] }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Editor Tips" }), _jsx("h3", { children: "Keyboard Shortcuts" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "Ctrl/Cmd + S" }), " - Save/download code"] }), _jsxs("li", { children: [_jsx("code", { children: "Ctrl/Cmd + F" }), " - Find in code"] }), _jsxs("li", { children: [_jsx("code", { children: "Ctrl/Cmd + /" }), " - Toggle comment"] }), _jsxs("li", { children: [_jsx("code", { children: "Alt + \u2191/\u2193" }), " - Move line up/down"] }), _jsxs("li", { children: [_jsx("code", { children: "Ctrl/Cmd + D" }), " - Select next occurrence"] }), _jsxs("li", { children: [_jsx("code", { children: "Ctrl/Cmd + Enter" }), " - Re-run preview"] })] }), _jsx("h3", { children: "IntelliSense" }), _jsxs("p", { children: ["Type ", _jsx("code", { children: "import {" }), " and press ", _jsx("code", { children: "Ctrl + Space" }), " to see all available components:"] }), _jsx("pre", { children: _jsx("code", { children: `import { 
  ChatWindow,
  Message,
  MessageList,
  Button,
  // ... 50+ more components
} from '@clarity-chat/react'` }) }), _jsx("h3", { children: "Auto-complete Props" }), _jsxs("p", { children: ["Type a component and press ", _jsx("code", { children: "Ctrl + Space" }), " inside props:"] }), _jsx("pre", { children: _jsx("code", { children: `<ChatWindow 
  // Press Ctrl+Space here to see all props
  messages={messages}
  isLoading={true}
/>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Layout Options" }), _jsx("h3", { children: "Side-by-Side (Default)" }), _jsxs("ul", { children: [_jsx("li", { children: "Code editor on left" }), _jsx("li", { children: "Live preview on right" }), _jsx("li", { children: "Drag divider to resize (20-80% range)" }), _jsx("li", { children: "Best for larger screens" })] }), _jsx("h3", { children: "Stacked" }), _jsxs("ul", { children: [_jsx("li", { children: "Code editor on top" }), _jsx("li", { children: "Live preview below" }), _jsx("li", { children: "Vertical resize handle" }), _jsx("li", { children: "Better for narrow screens or mobile" })] }), _jsx(Callout, { type: "tip", title: "Responsive Testing", children: "Use stacked layout and resize the preview panel to test responsive behavior." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Sharing & Exporting" }), _jsx("h3", { children: "Copy Code" }), _jsx("p", { children: "Click \"Copy Code\" to copy the entire code to clipboard - perfect for pasting into your project." }), _jsx("h3", { children: "Download" }), _jsxs("p", { children: ["Downloads your code as a ", _jsx("code", { children: ".tsx" }), " file that you can add to your project."] }), _jsx("h3", { children: "Share URL" }), _jsx("p", { children: "Generates a shareable URL with your code encoded:" }), _jsx("pre", { children: _jsx("code", { children: `https://docs.clarity-chat.dev/playground?code=BASE64_CODE` }) }), _jsx("p", { children: "Anyone with the link can view and edit your playground." }), _jsx("h3", { children: "Open in CodeSandbox" }), _jsx("p", { children: "Creates a full CodeSandbox environment with:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Your code in ", _jsx("code", { children: "App.tsx" })] }), _jsxs("li", { children: ["All dependencies in ", _jsx("code", { children: "package.json" })] }), _jsx("li", { children: "HTML template" }), _jsx("li", { children: "React setup code" }), _jsx("li", { children: "CSS imports" })] }), _jsx("p", { children: "Continue building in a full IDE environment!" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Advanced Usage" }), _jsx("h3", { children: "Available Components" }), _jsx("p", { children: "All Clarity Chat components are available in the playground:" }), _jsx("pre", { children: _jsx("code", { children: `// Core components
ChatWindow, Message, MessageList, ChatInput

// UI components
Button, Input, Avatar, Badge, Tooltip, Modal

// Interactive
CommandPalette, ContextMenu, Draggable

// Advanced
MemoryInspector, PerformanceDashboard, TokenOptimizationPanel

// Enterprise
SSOConfigWizard, ApiTokenManager, AuthTenantDashboard

// And 50+ more...` }) }), _jsx("h3", { children: "React Hooks Available" }), _jsx("pre", { children: _jsx("code", { children: `// React built-ins
useState, useEffect, useCallback, useMemo, useRef

// Clarity Chat hooks
useChat, useMessages, useTokenOptimization, useModelRouter

// And many more...` }) }), _jsx("h3", { children: "Multiple Components" }), _jsx("p", { children: "Combine multiple components in your playground:" }), _jsx("pre", { children: _jsx("code", { children: `import { ChatWindow, MemoryInspector, PerformanceDashboard } from '@clarity-chat/react'

export default function App() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <ChatWindow messages={messages} />
      </div>
      <div className="space-y-4">
        <MemoryInspector />
        <PerformanceDashboard compact />
      </div>
    </div>
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsx("h3", { children: "Start with a Template" }), _jsx("p", { children: "Don't start from scratch - templates provide working examples you can modify." }), _jsx("h3", { children: "Keep It Simple" }), _jsx("p", { children: "The playground is for demonstrations, not full applications. Focus on one feature at a time." }), _jsx("h3", { children: "Use TypeScript" }), _jsx("p", { children: "Get better autocomplete and catch errors before running:" }), _jsx("pre", { children: _jsx("code", { children: `// Good - TypeScript
const [messages, setMessages] = useState<Message[]>([])

// Also works - but less helpful
const [messages, setMessages] = useState([])` }) }), _jsx("h3", { children: "Check Errors" }), _jsx("p", { children: "Red underlines in the editor indicate TypeScript errors. Hover to see details." }), _jsx("h3", { children: "Test Responsiveness" }), _jsx("p", { children: "Resize the preview panel to test how components adapt to different screen sizes." }), _jsx("h3", { children: "Share Your Work" }), _jsx("p", { children: "Found something cool? Share the URL with your team or on social media!" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Troubleshooting" }), _jsx("h3", { children: "Code Not Running" }), _jsxs("ul", { children: [_jsx("li", { children: "Check for syntax errors (red underlines)" }), _jsx("li", { children: "Ensure all imports are correct" }), _jsx("li", { children: "Look for error messages below the preview" }), _jsx("li", { children: "Try resetting to the original template" })] }), _jsx("h3", { children: "Preview Not Updating" }), _jsxs("ul", { children: [_jsx("li", { children: "Try switching layout modes" }), _jsx("li", { children: "Refresh the page" }), _jsx("li", { children: "Check browser console for errors" })] }), _jsx("h3", { children: "Component Not Found" }), _jsxs("ul", { children: [_jsx("li", { children: "Verify component name spelling" }), _jsxs("li", { children: ["Check component is exported from ", _jsx("code", { children: "@clarity-chat/react" })] }), _jsx("li", { children: "Some components may be in sub-packages" })] }), _jsx("h3", { children: "TypeScript Errors" }), _jsxs("ul", { children: [_jsx("li", { children: "Hover over red underlines for details" }), _jsx("li", { children: "Add type annotations to fix" }), _jsxs("li", { children: ["Some playground limitations may require ", _jsx("code", { children: "// @ts-ignore" })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Use Cases" }), _jsx("h3", { children: "Learning" }), _jsx("p", { children: "Explore components interactively before adding them to your project." }), _jsx("h3", { children: "Prototyping" }), _jsx("p", { children: "Quickly test ideas and component combinations without setting up a project." }), _jsx("h3", { children: "Debugging" }), _jsx("p", { children: "Create minimal reproductions of bugs to share with support or on GitHub." }), _jsx("h3", { children: "Sharing Examples" }), _jsx("p", { children: "Share working code examples with team members or in documentation." }), _jsx("h3", { children: "Teaching" }), _jsx("p", { children: "Create interactive tutorials and guides with live, editable examples." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Limitations" }), _jsx(Callout, { type: "warning", title: "Playground Constraints", children: "The playground is designed for demonstrations, not full applications." }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "No API Calls" }), " - Can't make real HTTP requests (use mocked data)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Single File" }), " - All code in one file (can't import custom modules)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Limited Dependencies" }), " - Only pre-installed packages available"] }), _jsxs("li", { children: [_jsx("strong", { children: "No Persistence" }), " - Code is lost on page refresh (use Share to save)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Browser Only" }), " - No Node.js APIs or server-side code"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tips & Tricks" }), _jsx("h3", { children: "Quick Experimentation" }), _jsx("pre", { children: _jsx("code", { children: `// Try different prop values quickly
<Button variant="primary">Click</Button>
<Button variant="secondary">Click</Button>
<Button variant="danger">Click</Button>

// Test different states
<Message loading />
<Message error="Failed to load" />
<Message content="Success!" />` }) }), _jsx("h3", { children: "Component Composition" }), _jsx("pre", { children: _jsx("code", { children: `// Build complex UIs from simple components
function CustomChatWindow() {
  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-4">
        <h1>My Chat</h1>
      </header>
      <MessageList messages={messages} className="flex-1" />
      <footer className="border-t">
        <ChatInput onSend={handleSend} />
      </footer>
    </div>
  )
}` }) }), _jsx("h3", { children: "State Debugging" }), _jsx("pre", { children: _jsx("code", { children: `// Add debug output
console.log('Current state:', { messages, isLoading })

// Render state for visibility
<div className="debug">
  <pre>{JSON.stringify(messages, null, 2)}</pre>
</div>` }) }), _jsx("h3", { children: "Styling with Tailwind" }), _jsx("pre", { children: _jsx("code", { children: `// All Tailwind classes are available
<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
  <Avatar />
  <div className="flex-1">
    <h3 className="font-semibold">Message Title</h3>
    <p className="text-sm text-gray-600">Content here</p>
  </div>
</div>` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Going to Production" }), _jsx("h3", { children: "From Playground to Project" }), _jsxs("ol", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Export to CodeSandbox" }), " - Click \"Open in CodeSandbox\" to get a full environment"] }), _jsxs("li", { children: [_jsx("strong", { children: "Install Dependencies" }), " - Run ", _jsx("code", { children: "npm install @clarity-chat/react" })] }), _jsxs("li", { children: [_jsx("strong", { children: "Copy Code" }), " - Copy your playground code to your project"] }), _jsxs("li", { children: [_jsx("strong", { children: "Add API Integration" }), " - Connect to real backend endpoints"] }), _jsxs("li", { children: [_jsx("strong", { children: "Add Authentication" }), " - Implement user auth if needed"] }), _jsxs("li", { children: [_jsx("strong", { children: "Deploy" }), " - Follow our ", _jsx("a", { href: "/learn/deployment/vercel", children: "deployment guides" })] })] }), _jsx("h3", { children: "Next Steps After Playground" }), _jsxs("ul", { children: [_jsxs("li", { children: ["\uD83D\uDCD6 ", _jsx("a", { href: "/learn/tutorials/building-first-chatbot", children: "Build Your First Chatbot Tutorial" })] }), _jsxs("li", { children: ["\uD83C\uDF73 ", _jsx("a", { href: "/cookbook", children: "Browse Cookbook Recipes" })] }), _jsxs("li", { children: ["\uD83D\uDCDA ", _jsx("a", { href: "/reference/components", children: "Component Reference" })] }), _jsxs("li", { children: ["\uD83D\uDE80 ", _jsx("a", { href: "/learn/deployment", children: "Deployment Guides" })] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Examples Gallery" }), _jsx("h3", { children: "Create Your Own" }), _jsx("p", { children: "Here are some ideas for playground experiments:" }), _jsx("h4", { children: "1. Custom Message Renderer" }), _jsx("pre", { children: _jsx("code", { children: `<ChatWindow
  messages={messages}
  renderMessage={(msg) => (
    <div className="my-custom-message">
      {/* Your custom JSX */}
    </div>
  )}
/>` }) }), _jsx("h4", { children: "2. Multi-Step Form" }), _jsx("pre", { children: _jsx("code", { children: `function FormFlow() {
  const [step, setStep] = useState(1)
  
  return (
    <ChatWindow
      messages={[
        { role: 'assistant', content: \`Step \${step}/3\` }
      ]}
    />
  )
}` }) }), _jsx("h4", { children: "3. Voice Input Simulation" }), _jsx("pre", { children: _jsx("code", { children: `function VoiceChat() {
  const [isListening, setIsListening] = useState(false)
  
  return (
    <ChatWindow
      input={isListening ? '🎤 Listening...' : ''}
      rightActions={
        <button onClick={() => setIsListening(!isListening)}>
          {isListening ? '⏸️' : '🎤'}
        </button>
      }
    />
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "FAQ" }), _jsx("h3", { children: "Can I use npm packages?" }), _jsx("p", { children: "Only pre-installed packages are available. For full npm support, export to CodeSandbox." }), _jsx("h3", { children: "Is my code saved?" }), _jsx("p", { children: "Code is not saved automatically. Use \"Share\" to generate a URL that preserves your code." }), _jsx("h3", { children: "Can I make real API calls?" }), _jsx("p", { children: "No, the playground runs in the browser without a backend. Use mocked data or export to CodeSandbox." }), _jsx("h3", { children: "Why TypeScript errors?" }), _jsxs("p", { children: ["TypeScript helps catch errors early. Fix them for better code quality, or use ", _jsx("code", { children: "// @ts-ignore" }), " for playground purposes."] }), _jsx("h3", { children: "Can I import custom components?" }), _jsx("p", { children: "No, the playground is single-file. For multi-file projects, export to CodeSandbox." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/playground", className: "docs-card", children: [_jsx("h3", { children: "\uD83C\uDFAE Try Playground" }), _jsx("p", { children: "Start experimenting now" })] }), _jsxs("a", { href: "/learn/tutorials/building-first-chatbot", className: "docs-card", children: [_jsx("h3", { children: "First Chatbot Tutorial" }), _jsx("p", { children: "30-minute guided tutorial" })] }), _jsxs("a", { href: "/examples", className: "docs-card", children: [_jsx("h3", { children: "Full Examples" }), _jsx("p", { children: "Complete example applications" })] }), _jsxs("a", { href: "/reference/components", className: "docs-card", children: [_jsx("h3", { children: "Component Reference" }), _jsx("p", { children: "API documentation" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map