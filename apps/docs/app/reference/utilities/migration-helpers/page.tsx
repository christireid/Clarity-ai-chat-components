import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Migration Helpers',
  description:
    'Easy migration utilities from other chat libraries to Clarity Chat.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>Migration Helpers</h1>
        <p className="lead">
          Comprehensive migration utilities to help you move from other chat
          libraries to Clarity Chat with minimal friction and clear migration
          paths.
        </p>
      </div>

      <div className="docs-section">
        <h2>🚀 Quick Migration</h2>
        <p>One-line migration for common libraries.</p>

        <div className="code-block">
          <pre>
            <code>{`import { migrateQuick } from '@clarity-chat/react'

// Migrate from Vercel AI SDK
const vercelMigration = migrateQuick('vercel-ai', {
  api: '/api/chat'
})

// Migrate from OpenAI direct usage
const openaiMigration = migrateQuick('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
})

// Migrate from custom implementation
const customMigration = migrateQuick('custom', {
  chatFunction: myExistingChatFunction
})`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>⚡ Vercel AI SDK Migration</h2>
        <p>Migrate from Vercel's AI SDK to Clarity Chat.</p>

        <h3>Message Conversion</h3>
        <div className="code-block">
          <pre>
            <code>{`import { VercelAdapter } from '@clarity-chat/react'

// Convert Vercel messages to Clarity format
const clarityMessages = VercelAdapter.convertMessages(vercelMessages)

// Example usage
const messages = [
  { id: '1', content: 'Hello', role: 'user' },
  { id: '2', content: 'Hi!', role: 'assistant' }
]

const converted = VercelAdapter.convertMessages(messages)
// Result: Messages with Clarity Chat format`}</code>
          </pre>
        </div>

        <h3>Hook Migration</h3>
        <div className="code-block">
          <pre>
            <code>{`import { VercelAdapter } from '@clarity-chat/react'

// Convert useChat hook to useClarityChat format
function MyComponent() {
  const vercelChat = useChat() // Your existing Vercel hook
  const clarityAPI = VercelAdapter.convertChatHook(vercelChat)

  // Now you have Clarity Chat API
  return (
    <div>
      {clarityAPI.messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`}</code>
          </pre>
        </div>

        <h3>Gradual Migration</h3>
        <div className="code-block">
          <pre>
            <code>{`import { VercelAdapter } from '@clarity-chat/react'

function ChatContainer({ children }) {
  return (
    <VercelAdapter.MigrationWrapper api="/api/chat">
      {(vercelAPI) => children(vercelAPI)}
    </VercelAdapter.MigrationWrapper>
  )
}

// Use existing components with gradual migration
function MyChat() {
  return (
    <ChatContainer>
      {(chatAPI) => (
        <ExistingChatComponent chat={chatAPI} />
      )}
    </ChatContainer>
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🤖 OpenAI Direct Migration</h2>
        <p>Migrate from direct OpenAI API usage.</p>

        <h3>API Route Creation</h3>
        <div className="code-block">
          <pre>
            <code>{`// app/api/chat/route.ts
import { OpenAIAdapter } from '@clarity-chat/react'

export async function POST(request: Request) {
  return OpenAIAdapter.createAPIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    options: {
      temperature: 0.7,
      max_tokens: 1000
    }
  })(request)
}`}</code>
          </pre>
        </div>

        <h3>Message Format Conversion</h3>
        <div className="code-block">
          <pre>
            <code>{`import { OpenAIAdapter } from '@clarity-chat/react'

// Convert OpenAI messages to Clarity format
const openaiMessages = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' }
]

const clarityMessages = OpenAIAdapter.convertMessages(openaiMessages)
// Result: Messages with Clarity Chat format and OpenAI metadata`}</code>
          </pre>
        </div>

        <h3>Streaming Support</h3>
        <div className="code-block">
          <pre>
            <code>{`// The adapter automatically handles streaming
// Just add stream: true to your options

export async function POST(request: Request) {
  return OpenAIAdapter.createAPIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    options: {
      stream: true, // Enable streaming
      temperature: 0.7
    }
  })(request)
}

// Frontend automatically supports streaming
import { useClarityChat } from '@clarity-chat/react'

function StreamingChat() {
  const { messages, isLoading } = useClarityChat({
    api: '/api/chat',
    transport: 'sse' // or 'websocket'
  })

  return <ChatWindow messages={messages} isLoading={isLoading} />
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 React Chatbot Kit Migration</h2>
        <p>Migrate from react-chatbot-kit.</p>

        <h3>Configuration Conversion</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ChatbotKitAdapter } from '@clarity-chat/react'

const kitConfig = {
  title: 'My Chatbot',
  placeholder: 'Type your message...',
  showAvatar: true,
  showHeader: true
}

const clarityConfig = ChatbotKitAdapter.convertConfig(kitConfig)
// Result: Equivalent Clarity Chat configuration`}</code>
          </pre>
        </div>

        <h3>Message Conversion</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ChatbotKitAdapter } from '@clarity-chat/react'

const kitMessages = [
  { id: '1', message: 'Hello', type: 'user' },
  { id: '2', message: 'Hi!', type: 'bot' }
]

const clarityMessages = ChatbotKitAdapter.convertMessages(kitMessages)
// Result: Messages in Clarity Chat format`}</code>
          </pre>
        </div>

        <h3>Migration Component</h3>
        <div className="code-block">
          <pre>
            <code>{`import { ChatbotKitAdapter } from '@clarity-chat/react'

function MigratedChat() {
  return (
    <ChatbotKitAdapter.MigrationComponent
      kitConfig={{
        title: 'My Chatbot',
        showHeader: true,
        placeholder: 'Type here...'
      }}
      api="/api/chat"
    >
      {/* Your existing kit components can be gradually migrated */}
    </ChatbotKitAdapter.MigrationComponent>
  )
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔧 Custom Implementation Migration</h2>
        <p>Migrate from custom chat implementations.</p>

        <h3>API Route Creation</h3>
        <div className="code-block">
          <pre>
            <code>{`import { CustomAdapter } from '@clarity-chat/react'

// Your existing chat function
async function myChatFunction(messages) {
  // Your existing logic
  const response = await callMyAI(messages)
  return {
    content: response.text,
    role: 'assistant',
    timestamp: Date.now()
  }
}

// Create API route
export async function POST(request: Request) {
  return CustomAdapter.createAPIRoute(myChatFunction)(request)
}`}</code>
          </pre>
        </div>

        <h3>Message Format Conversion</h3>
        <div className="code-block">
          <pre>
            <code>{`import { CustomAdapter } from '@clarity-chat/react'

// Define converters for your custom format
const converters = {
  id: (msg) => msg.customId || \`msg-\${Date.now()}\`,
  content: (msg) => msg.text || msg.body || msg.message,
  role: (msg) => msg.sender === 'user' ? 'user' : 'assistant',
  timestamp: (msg) => msg.sentAt || msg.created || Date.now()
}

const customMessages = [
  { customId: '1', text: 'Hello', sender: 'user', sentAt: 1234567890 },
  { customId: '2', body: 'Hi!', sender: 'bot', created: 1234567900 }
]

const clarityMessages = CustomAdapter.convertMessages(
  customMessages,
  converters
)
// Result: Messages in standard Clarity Chat format`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📊 Migration Tracking</h2>
        <p>Track your migration progress systematically.</p>

        <div className="code-block">
          <pre>
            <code>{`import { MigrationTracker } from '@clarity-chat/react'

const tracker = new MigrationTracker()

// Mark steps as completed
tracker.markCompleted('Convert messages to Clarity format')
tracker.markCompleted('Replace useChat with useClarityChat', 'Used VercelAdapter')

// Mark pending steps
tracker.markPending('Update API routes', 'Need to handle streaming')
tracker.markPending('Test all user flows')

// Get progress
const progress = tracker.getProgress()
console.log(\`\${progress.completed}/\${progress.total} steps completed\`)

// Get next steps
const nextSteps = tracker.getNextSteps()
console.log('Next steps:', nextSteps)

// Generate report
const report = tracker.generateReport()
console.log(report)`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Migration Analysis</h2>
        <p>Automatically analyze your code for migration opportunities.</p>

        <div className="code-block">
          <pre>
            <code>{`import { MigrationAnalyzer, generateMigrationReport } from '@clarity-chat/react'

const analyzer = new MigrationAnalyzer()

// Analyze your code
const code = \`
  import { useChat } from 'ai/react'
  const { messages, input, handleSubmit } = useChat()
  const response = await openai.chat.completions.create()
\`

const analysis = analyzer.analyzeCode(code)
console.log(\`Detected: \${analysis.library} (\${Math.round(analysis.confidence * 100)}%)\`)

// Generate migration report
const report = generateMigrationReport(code)
console.log(report)

// Get specific migration guide
const guide = analyzer.generateMigrationGuide('vercel-ai')
console.log(guide)`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Migration Presets</h2>
        <p>Pre-configured migration setups for common scenarios.</p>

        <div className="code-block">
          <pre>
            <code>{`import { MigrationPresets } from '@clarity-chat/react'

// Vercel AI SDK migration
const vercelSetup = MigrationPresets.fromVercelAI({
  api: '/api/chat'
})

// OpenAI direct usage migration
const openaiSetup = MigrationPresets.fromOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
})

// React chatbot kit migration
const kitSetup = MigrationPresets.fromChatbotKit({
  title: 'My Chatbot',
  showHeader: true
})

// Custom implementation migration
const customSetup = MigrationPresets.fromCustom({
  chatFunction: myExistingChatFunction,
  messageConverters: {
    content: (msg) => msg.text,
    role: (msg) => msg.sender === 'user' ? 'user' : 'assistant'
  }
})`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📚 API Reference</h2>

        <h3>Adapters</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>VercelAdapter.convertMessages(messages)</code>
            <p>Convert Vercel AI SDK messages to Clarity format.</p>
          </div>
          <div className="api-item">
            <code>VercelAdapter.convertChatHook(vercelChat)</code>
            <p>Convert Vercel useChat to Clarity API.</p>
          </div>
          <div className="api-item">
            <code>OpenAIAdapter.createAPIAdapter(config)</code>
            <p>Create API route for OpenAI integration.</p>
          </div>
          <div className="api-item">
            <code>ChatbotKitAdapter.convertConfig(kitConfig)</code>
            <p>Convert react-chatbot-kit config to Clarity config.</p>
          </div>
          <div className="api-item">
            <code>CustomAdapter.convertMessages(messages, converters)</code>
            <p>Convert custom messages using provided converters.</p>
          </div>
        </div>

        <h3>Migration Tools</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>new MigrationTracker()</code>
            <p>Track migration progress step by step.</p>
          </div>
          <div className="api-item">
            <code>new MigrationAnalyzer()</code>
            <p>Analyze code for migration opportunities.</p>
          </div>
          <div className="api-item">
            <code>generateMigrationReport(code)</code>
            <p>Generate detailed migration analysis and guide.</p>
          </div>
          <div className="api-item">
            <code>migrateQuick(library, config)</code>
            <p>Quick migration setup for common libraries.</p>
          </div>
        </div>

        <h3>Migration Presets</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>MigrationPresets.fromVercelAI(config)</code>
            <p>Preset for Vercel AI SDK migration.</p>
          </div>
          <div className="api-item">
            <code>MigrationPresets.fromOpenAI(config)</code>
            <p>Preset for OpenAI direct API migration.</p>
          </div>
          <div className="api-item">
            <code>MigrationPresets.fromChatbotKit(config)</code>
            <p>Preset for react-chatbot-kit migration.</p>
          </div>
          <div className="api-item">
            <code>MigrationPresets.fromCustom(config)</code>
            <p>Preset for custom implementation migration.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>Migration Strategy</h3>
        <ul>
          <li>
            Use <code>migrateQuick</code> for rapid prototyping
          </li>
          <li>
            Track progress with <code>MigrationTracker</code>
          </li>
          <li>
            Analyze code with <code>MigrationAnalyzer</code> first
          </li>
          <li>Test thoroughly after each migration step</li>
        </ul>

        <h3>Message Conversion</h3>
        <ul>
          <li>Always preserve message IDs when possible</li>
          <li>Handle different content formats gracefully</li>
          <li>Add timestamps if missing</li>
          <li>Preserve original message data for debugging</li>
        </ul>

        <h3>API Migration</h3>
        <ul>
          <li>Use adapter functions for API route creation</li>
          <li>Test streaming functionality thoroughly</li>
          <li>Handle error responses consistently</li>
          <li>Implement proper rate limiting</li>
        </ul>

        <h3>Testing During Migration</h3>
        <ul>
          <li>Use testing helpers to validate conversions</li>
          <li>Test all user interaction flows</li>
          <li>Verify accessibility remains intact</li>
          <li>Performance test after migration</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>Complete Vercel Migration</h3>
        <div className="code-block">
          <pre>
            <code>{`// 1. Analyze existing code
import { MigrationAnalyzer } from '@clarity-chat/react'
const analyzer = new MigrationAnalyzer()
const analysis = analyzer.analyzeCode(existingCode)

// 2. Create migration tracker
const tracker = new MigrationTracker()
tracker.markCompleted('Analysis complete')

// 3. Use quick migration
const migration = migrateQuick('vercel-ai', { api: '/api/chat' })

// 4. Update components gradually
function MigratingComponent() {
  return (
    <migration.component api="/api/chat">
      {(api) => <MyExistingComponent api={api} />}
    </migration.component>
  )
}

// 5. Track progress
tracker.markCompleted('Components migrated')
console.log(tracker.generateReport())`}</code>
          </pre>
        </div>

        <h3>Custom Implementation Migration</h3>
        <div className="code-block">
          <pre>
            <code>{`// 1. Define message converters
const converters = {
  id: (msg) => msg._id || \`msg-\${Date.now()}\`,
  content: (msg) => msg.payload?.text || msg.content,
  role: (msg) => msg.from === 'human' ? 'user' : 'assistant',
  timestamp: (msg) => new Date(msg.created_at).getTime()
}

// 2. Create API adapter
const chatFunction = async (messages) => {
  const response = await myExistingAI(messages)
  return {
    content: response.answer,
    role: 'assistant',
    timestamp: Date.now(),
    metadata: response.metadata
  }
}

const migration = MigrationPresets.fromCustom({
  chatFunction,
  messageConverters: converters
})

// 3. Update frontend
import { useClarityChat } from '@clarity-chat/react'

function MigratedChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat' // Now uses the adapted API
  })

  return <ChatWindow messages={messages} onSendMessage={append} />
}`}</code>
          </pre>
        </div>

        <h3>Gradual Migration Strategy</h3>
        <div className="code-block">
          <pre>
            <code>{`// Phase 1: Wrap existing implementation
import { CustomAdapter } from '@clarity-chat/react'

function Phase1Chat() {
  return (
    <div>
      <ExistingChatComponent />
      {/* Add Clarity Chat alongside */}
      <ClarityChat api="/api/chat" style={{ display: 'none' }} />
    </div>
  )
}

// Phase 2: Gradual component replacement
function Phase2Chat() {
  const [useNew, setUseNew] = useState(false)

  return useNew ? (
    <ClarityChat api="/api/chat" />
  ) : (
    <ExistingChatComponent onMigrate={() => setUseNew(true)} />
  )
}

// Phase 3: Full migration
function Phase3Chat() {
  return <ClarityChat api="/api/chat" />
}`}</code>
          </pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>Message conversion fails</h4>
            <p>
              Check that your converters handle all message formats and provide
              fallbacks for missing fields.
            </p>
          </div>
          <div className="issue">
            <h4>API adapter doesn't work</h4>
            <p>
              Ensure your existing API returns data in the expected format and
              handles streaming correctly.
            </p>
          </div>
          <div className="issue">
            <h4>Hooks migration is complex</h4>
            <p>
              Use the adapter wrappers for gradual migration instead of complete
              replacement.
            </p>
          </div>
          <div className="issue">
            <h4>Performance degrades after migration</h4>
            <p>
              Use lazy loading and performance monitoring to identify and
              optimize bottlenecks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
