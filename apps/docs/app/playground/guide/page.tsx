import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Playground Guide - Clarity Chat',
  description: 'Learn how to use the Interactive Playground effectively.',
}

export default function PlaygroundGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Playground Guide</h1>
        <p className="docs-lead">
          Master the Interactive Playground to rapidly prototype and learn
          Clarity Chat components.
        </p>
      </div>

      <section className="docs-section">
        <h2>Getting Started</h2>
        <Callout type="info" title="No Setup Required">
          The playground runs entirely in your browser - no installation, no
          account, no configuration needed!
        </Callout>

        <h3>Quick Start</h3>
        <ol>
          <li>
            Visit the <a href="/playground">Interactive Playground</a>
          </li>
          <li>Select a template from the sidebar</li>
          <li>Edit the code in the editor</li>
          <li>See live preview instantly</li>
          <li>Copy, download, or export your code</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Interface Overview</h2>

        <h3>Layout</h3>
        <ul>
          <li>
            <strong>Left Sidebar</strong> - Template browser with search and
            categories
          </li>
          <li>
            <strong>Code Editor</strong> - Monaco Editor with TypeScript support
          </li>
          <li>
            <strong>Live Preview</strong> - Real-time component rendering
          </li>
          <li>
            <strong>Top Controls</strong> - Copy, download, share, and export
            buttons
          </li>
        </ul>

        <h3>Editor Features</h3>
        <ul>
          <li>
            ✅ <strong>Syntax Highlighting</strong> - Full TypeScript/React
            syntax
          </li>
          <li>
            ✅ <strong>IntelliSense</strong> - Auto-complete for Clarity Chat
            components
          </li>
          <li>
            ✅ <strong>Error Detection</strong> - Real-time type checking
          </li>
          <li>
            ✅ <strong>Auto-formatting</strong> - Format on paste and type
          </li>
          <li>
            ✅ <strong>Line Numbers</strong> - Easy code navigation
          </li>
          <li>
            ✅ <strong>Word Wrap</strong> - Automatic line wrapping
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Templates</h2>

        <h3>15 Pre-built Templates</h3>

        <h4>Basics (4 templates)</h4>
        <ul>
          <li>
            <strong>Simple Chat</strong> - Basic chat window with streaming
          </li>
          <li>
            <strong>Chat with Avatars</strong> - Custom avatars and metadata
          </li>
          <li>
            <strong>Custom Theme</strong> - Theming and color customization
          </li>
          <li>
            <strong>Thinking Indicator</strong> - AI processing visualization
          </li>
        </ul>

        <h4>Advanced (6 templates)</h4>
        <ul>
          <li>
            <strong>File Upload</strong> - Document upload handling
          </li>
          <li>
            <strong>Markdown & Code</strong> - Rich content rendering
          </li>
          <li>
            <strong>Multi-Modal Preview</strong> - Images and media
          </li>
          <li>
            <strong>RAG Document Chat</strong> - Retrieval with citations
          </li>
          <li>
            <strong>Error Handling</strong> - Graceful error recovery
          </li>
          <li>
            <strong>Streaming Progress</strong> - Progress visualization
          </li>
          <li>
            <strong>Conversation Timeline</strong> - Event flow timeline
          </li>
        </ul>

        <h4>Interactive (3 templates)</h4>
        <ul>
          <li>
            <strong>Command Palette</strong> - Keyboard-driven commands
          </li>
          <li>
            <strong>Follow-up Suggestions</strong> - Smart continuation chips
          </li>
          <li>
            <strong>Keyboard Shortcuts</strong> - Custom hotkeys
          </li>
        </ul>

        <h4>Monitoring (3 templates)</h4>
        <ul>
          <li>
            <strong>Performance Dashboard</strong> - Real-time metrics
          </li>
          <li>
            <strong>Memory Inspector</strong> - Context visualization
          </li>
          <li>
            <strong>Context Visualizer</strong> - AI context view
          </li>
          <li>
            <strong>Token Tracking</strong> - Usage monitoring
          </li>
        </ul>

        <h4>Agents (1 template)</h4>
        <ul>
          <li>
            <strong>Agent with Tools</strong> - Function calling example
          </li>
        </ul>

        <h4>Enterprise (1 template)</h4>
        <ul>
          <li>
            <strong>Enterprise SSO</strong> - Authentication flow
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Editor Tips</h2>

        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li>
            <code>Ctrl/Cmd + S</code> - Save/download code
          </li>
          <li>
            <code>Ctrl/Cmd + F</code> - Find in code
          </li>
          <li>
            <code>Ctrl/Cmd + /</code> - Toggle comment
          </li>
          <li>
            <code>Alt + ↑/↓</code> - Move line up/down
          </li>
          <li>
            <code>Ctrl/Cmd + D</code> - Select next occurrence
          </li>
          <li>
            <code>Ctrl/Cmd + Enter</code> - Re-run preview
          </li>
        </ul>

        <h3>IntelliSense</h3>
        <p>
          Type <code>import &#123;</code> and press <code>Ctrl + Space</code> to
          see all available components:
        </p>
        <pre>
          <code>{`import { 
  ChatWindow,
  Message,
  MessageList,
  Button,
  // ... 50+ more components
} from '@clarity-chat/react'`}</code>
        </pre>

        <h3>Auto-complete Props</h3>
        <p>
          Type a component and press <code>Ctrl + Space</code> inside props:
        </p>
        <pre>
          <code>{`<ChatWindow 
  // Press Ctrl+Space here to see all props
  messages={messages}
  isLoading={true}
/>`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Layout Options</h2>

        <h3>Side-by-Side (Default)</h3>
        <ul>
          <li>Code editor on left</li>
          <li>Live preview on right</li>
          <li>Drag divider to resize (20-80% range)</li>
          <li>Best for larger screens</li>
        </ul>

        <h3>Stacked</h3>
        <ul>
          <li>Code editor on top</li>
          <li>Live preview below</li>
          <li>Vertical resize handle</li>
          <li>Better for narrow screens or mobile</li>
        </ul>

        <Callout type="tip" title="Responsive Testing">
          Use stacked layout and resize the preview panel to test responsive
          behavior.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Sharing & Exporting</h2>

        <h3>Copy Code</h3>
        <p>
          Click "Copy Code" to copy the entire code to clipboard - perfect for
          pasting into your project.
        </p>

        <h3>Download</h3>
        <p>
          Downloads your code as a <code>.tsx</code> file that you can add to
          your project.
        </p>

        <h3>Share URL</h3>
        <p>Generates a shareable URL with your code encoded:</p>
        <pre>
          <code>{`https://docs.clarity-chat.dev/playground?code=BASE64_CODE`}</code>
        </pre>
        <p>Anyone with the link can view and edit your playground.</p>

        <h3>Open in CodeSandbox</h3>
        <p>Creates a full CodeSandbox environment with:</p>
        <ul>
          <li>
            Your code in <code>App.tsx</code>
          </li>
          <li>
            All dependencies in <code>package.json</code>
          </li>
          <li>HTML template</li>
          <li>React setup code</li>
          <li>CSS imports</li>
        </ul>
        <p>Continue building in a full IDE environment!</p>
      </section>

      <section className="docs-section">
        <h2>Advanced Usage</h2>

        <h3>Available Components</h3>
        <p>All Clarity Chat components are available in the playground:</p>
        <pre>
          <code>{`// Core components
ChatWindow, Message, MessageList, ChatInput

// UI components
Button, Input, Avatar, Badge, Tooltip, Modal

// Interactive
CommandPalette, ContextMenu, Draggable

// Advanced
MemoryInspector, PerformanceDashboard, TokenOptimizationPanel

// Enterprise
SSOConfigWizard, ApiTokenManager, AuthTenantDashboard

// And 50+ more...`}</code>
        </pre>

        <h3>React Hooks Available</h3>
        <pre>
          <code>{`// React built-ins
useState, useEffect, useCallback, useMemo, useRef

// Clarity Chat hooks
useChat, useMessages, useTokenOptimization, useModelRouter

// And many more...`}</code>
        </pre>

        <h3>Multiple Components</h3>
        <p>Combine multiple components in your playground:</p>
        <pre>
          <code>{`import { ChatWindow, MemoryInspector, PerformanceDashboard } from '@clarity-chat/react/internal'

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
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>

        <h3>Start with a Template</h3>
        <p>
          Don't start from scratch - templates provide working examples you can
          modify.
        </p>

        <h3>Keep It Simple</h3>
        <p>
          The playground is for demonstrations, not full applications. Focus on
          one feature at a time.
        </p>

        <h3>Use TypeScript</h3>
        <p>Get better autocomplete and catch errors before running:</p>
        <pre>
          <code>{`// Good - TypeScript
const [messages, setMessages] = useState<Message[]>([])

// Also works - but less helpful
const [messages, setMessages] = useState([])`}</code>
        </pre>

        <h3>Check Errors</h3>
        <p>
          Red underlines in the editor indicate TypeScript errors. Hover to see
          details.
        </p>

        <h3>Test Responsiveness</h3>
        <p>
          Resize the preview panel to test how components adapt to different
          screen sizes.
        </p>

        <h3>Share Your Work</h3>
        <p>
          Found something cool? Share the URL with your team or on social media!
        </p>
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>Code Not Running</h3>
        <ul>
          <li>Check for syntax errors (red underlines)</li>
          <li>Ensure all imports are correct</li>
          <li>Look for error messages below the preview</li>
          <li>Try resetting to the original template</li>
        </ul>

        <h3>Preview Not Updating</h3>
        <ul>
          <li>Try switching layout modes</li>
          <li>Refresh the page</li>
          <li>Check browser console for errors</li>
        </ul>

        <h3>Component Not Found</h3>
        <ul>
          <li>Verify component name spelling</li>
          <li>
            Check component is exported from <code>@clarity-chat/react</code>
          </li>
          <li>Some components may be in sub-packages</li>
        </ul>

        <h3>TypeScript Errors</h3>
        <ul>
          <li>Hover over red underlines for details</li>
          <li>Add type annotations to fix</li>
          <li>
            Some playground limitations may require <code>// @ts-ignore</code>
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Use Cases</h2>

        <h3>Learning</h3>
        <p>
          Explore components interactively before adding them to your project.
        </p>

        <h3>Prototyping</h3>
        <p>
          Quickly test ideas and component combinations without setting up a
          project.
        </p>

        <h3>Debugging</h3>
        <p>
          Create minimal reproductions of bugs to share with support or on
          GitHub.
        </p>

        <h3>Sharing Examples</h3>
        <p>
          Share working code examples with team members or in documentation.
        </p>

        <h3>Teaching</h3>
        <p>
          Create interactive tutorials and guides with live, editable examples.
        </p>
      </section>

      <section className="docs-section">
        <h2>Limitations</h2>

        <Callout type="warning" title="Playground Constraints">
          The playground is designed for demonstrations, not full applications.
        </Callout>

        <ul>
          <li>
            <strong>No API Calls</strong> - Can't make real HTTP requests (use
            mocked data)
          </li>
          <li>
            <strong>Single File</strong> - All code in one file (can't import
            custom modules)
          </li>
          <li>
            <strong>Limited Dependencies</strong> - Only pre-installed packages
            available
          </li>
          <li>
            <strong>No Persistence</strong> - Code is lost on page refresh (use
            Share to save)
          </li>
          <li>
            <strong>Browser Only</strong> - No Node.js APIs or server-side code
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Tips & Tricks</h2>

        <h3>Quick Experimentation</h3>
        <pre>
          <code>{`// Try different prop values quickly
<Button variant="primary">Click</Button>
<Button variant="secondary">Click</Button>
<Button variant="danger">Click</Button>

// Test different states
<Message loading />
<Message error="Failed to load" />
<Message content="Success!" />`}</code>
        </pre>

        <h3>Component Composition</h3>
        <pre>
          <code>{`// Build complex UIs from simple components
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
}`}</code>
        </pre>

        <h3>State Debugging</h3>
        <pre>
          <code>{`// Add debug output
logger.debug('Current state:', { messages, isLoading })

// Render state for visibility
<div className="debug">
  <pre>{JSON.stringify(messages, null, 2)}</pre>
</div>`}</code>
        </pre>

        <h3>Styling with Tailwind</h3>
        <pre>
          <code>{`// All Tailwind classes are available
<div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
  <Avatar />
  <div className="flex-1">
    <h3 className="font-semibold">Message Title</h3>
    <p className="text-sm text-gray-600">Content here</p>
  </div>
</div>`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Going to Production</h2>

        <h3>From Playground to Project</h3>
        <ol>
          <li>
            <strong>Export to CodeSandbox</strong> - Click "Open in CodeSandbox"
            to get a full environment
          </li>
          <li>
            <strong>Install Dependencies</strong> - Run{' '}
            <code>npm install @clarity-chat/react</code>
          </li>
          <li>
            <strong>Copy Code</strong> - Copy your playground code to your
            project
          </li>
          <li>
            <strong>Add API Integration</strong> - Connect to real backend
            endpoints
          </li>
          <li>
            <strong>Add Authentication</strong> - Implement user auth if needed
          </li>
          <li>
            <strong>Deploy</strong> - Follow our{' '}
            <a href="/learn/deployment/vercel">deployment guides</a>
          </li>
        </ol>

        <h3>Next Steps After Playground</h3>
        <ul>
          <li>
            📖{' '}
            <a href="/learn/tutorials/building-first-chatbot">
              Build Your First Chatbot Tutorial
            </a>
          </li>
          <li>
            🍳 <a href="/cookbook">Browse Cookbook Recipes</a>
          </li>
          <li>
            📚 <a href="/reference/components">Component Reference</a>
          </li>
          <li>
            🚀 <a href="/learn/deployment">Deployment Guides</a>
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Examples Gallery</h2>

        <h3>Create Your Own</h3>
        <p>Here are some ideas for playground experiments:</p>

        <h4>1. Custom Message Renderer</h4>
        <pre>
          <code>{`<ChatWindow
  messages={messages}
  renderMessage={(msg) => (
    <div className="my-custom-message">
      {/* Your custom JSX */}
    </div>
  )}
/>`}</code>
        </pre>

        <h4>2. Multi-Step Form</h4>
        <pre>
          <code>{`function FormFlow() {
  const [step, setStep] = useState(1)
  
  return (
    <ChatWindow
      messages={[
        { role: 'assistant', content: \`Step \${step}/3\` }
      ]}
    />
  )
}`}</code>
        </pre>

        <h4>3. Voice Input Simulation</h4>
        <pre>
          <code>{`function VoiceChat() {
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
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>FAQ</h2>

        <h3>Can I use npm packages?</h3>
        <p>
          Only pre-installed packages are available. For full npm support,
          export to CodeSandbox.
        </p>

        <h3>Is my code saved?</h3>
        <p>
          Code is not saved automatically. Use "Share" to generate a URL that
          preserves your code.
        </p>

        <h3>Can I make real API calls?</h3>
        <p>
          No, the playground runs in the browser without a backend. Use mocked
          data or export to CodeSandbox.
        </p>

        <h3>Why TypeScript errors?</h3>
        <p>
          TypeScript helps catch errors early. Fix them for better code quality,
          or use <code>// @ts-ignore</code> for playground purposes.
        </p>

        <h3>Can I import custom components?</h3>
        <p>
          No, the playground is single-file. For multi-file projects, export to
          CodeSandbox.
        </p>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/playground" className="docs-card">
            <h3>🎮 Try Playground</h3>
            <p>Start experimenting now</p>
          </a>
          <a
            href="/learn/tutorials/building-first-chatbot"
            className="docs-card"
          >
            <h3>First Chatbot Tutorial</h3>
            <p>30-minute guided tutorial</p>
          </a>
          <a href="/examples" className="docs-card">
            <h3>Full Examples</h3>
            <p>Complete example applications</p>
          </a>
          <a href="/reference/components" className="docs-card">
            <h3>Component Reference</h3>
            <p>API documentation</p>
          </a>
        </div>
      </section>
    </div>
  )
}
