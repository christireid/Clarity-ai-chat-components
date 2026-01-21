import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IntelliSense Helpers',
  description: 'Enhanced TypeScript experience with better IntelliSense and type inference.',
}

export default function Page() {
  return (
    <div className="docs-content">
      <div className="docs-section">
        <h1>IntelliSense Helpers</h1>
        <p className="lead">
          Enhanced TypeScript experience with better IntelliSense,
          type inference, and developer-friendly APIs.
        </p>
      </div>

      <div className="docs-section">
        <h2>🔗 API URL Types</h2>
        <p>Type-safe URL configurations with IntelliSense.</p>

        <div className="code-block">
          <pre><code>{`import { ChatApiConfig, createApiUrl } from '@clarity-chat/react'

// IntelliSense will suggest valid URL formats
function setupChat(api: ChatApiConfig) {
  return useClarityChat({ api })
}

// Type-safe URL creation
const apiUrl = createApiUrl('/api/chat')

// This will cause a TypeScript error:
// const invalidUrl = createApiUrl('invalid-url') // ❌

setupChat('/api/chat')        // ✅ Relative path
setupChat('https://api.com/chat') // ✅ Full URL
setupChat('ws://api.com/chat') // ✅ WebSocket`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Chat Configuration Types</h2>
        <p>IntelliSense-friendly configuration interfaces.</p>

        <div className="code-block">
          <pre><code>{`import {
  MemoryConfigHelper,
  StreamingConfigHelper,
  RateLimitConfigHelper
} from '@clarity-chat/react'

function configureChat() {
  const memory: MemoryConfigHelper = {
    enabled: true,
    strategy: 'vector-store', // IntelliSense shows options
    maxTokens: 4000,
    retryOnError: true
  }

  const streaming: StreamingConfigHelper = {
    transport: 'sse', // IntelliSense: 'sse' | 'websocket'
    websocket: {
      autoReconnect: true, // Only shown when transport is 'websocket'
      maxReconnectAttempts: 5
    }
  }

  const rateLimiting: RateLimitConfigHelper = {
    enabled: true,
    maxRequestsPerMinute: 60, // IntelliSense shows description
    queueSize: 10
  }

  return { memory, streaming, rateLimiting }
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎨 UI Configuration Types</h2>
        <p>Component configuration with better IntelliSense.</p>

        <div className="code-block">
          <pre><code>{`import {
  HeaderConfigHelper,
  MessageActionsConfigHelper,
  PromptsConfigHelper
} from '@clarity-chat/react'

function configureUI() {
  const header: HeaderConfigHelper = {
    show: true,
    title: 'AI Assistant', // IntelliSense shows description
    subtitle: 'Powered by Clarity',
    showMessageCount: true
  }

  const messageActions: MessageActionsConfigHelper = {
    onCopy: (id, content) => console.log('Copied:', content),
    onFeedback: (id, type, comment) => {
      // type is 'up' | 'down', IntelliSense shows this
    },
    onEdit: (id) => console.log('Edit:', id),
    onRegenerate: (id) => console.log('Regenerate:', id)
  }

  const prompts: PromptsConfigHelper = {
    showStarterPrompts: true,
    starterPrompts: [
      {
        text: 'Explain this code', // IntelliSense shows field descriptions
        category: 'technical'
      }
    ],
    showFollowUpSuggestions: true,
    followUpSuggestions: [
      {
        text: 'Tell me more',
        confidence: 0.95 // IntelliSense shows this is optional
      }
    ]
  }

  return { header, messageActions, prompts }
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🚨 Error Handling Types</h2>
        <p>Type-safe error handling with helpful IntelliSense.</p>

        <div className="code-block">
          <pre><code>{`import {
  ChatErrorType,
  ErrorHandlingConfigHelper
} from '@clarity-chat/react'

function handleErrors() {
  const errorType: ChatErrorType = 'network'
  // IntelliSense shows: 'network' | 'auth' | 'ratelimit' | 'server' | 'validation' | 'timeout' | 'parse' | 'memory' | 'unknown'

  const errorConfig: ErrorHandlingConfigHelper = {
    enabled: true,
    showErrorUI: true,
    showRetryButton: true,
    onError: (error, type) => {
      // 'type' parameter has full ChatErrorType IntelliSense
      switch (type) {
        case 'network':
          console.log('Network error:', error.message)
          break
        case 'auth':
          console.log('Authentication failed')
          break
        case 'ratelimit':
          console.log('Rate limited, retry after some time')
          break
        // IntelliSense shows all cases
      }
    }
  }

  return errorConfig
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🏗️ Builder Pattern Types</h2>
        <p>Type-safe builder pattern with IntelliSense.</p>

        <div className="code-block">
          <pre><code>{`import { TypeSafeChatConfig } from '@clarity-chat/react'

function buildChatConfig() {
  const builder = new TypeSafeChatConfig()

  const config = builder
    .api('/api/chat') // IntelliSense validates URL format
    .withMemory({
      enabled: true,
      strategy: 'vector-store', // IntelliSense shows options
      maxTokens: 4000
    })
    .withStreaming({
      transport: 'sse' // IntelliSense: 'sse' | 'websocket'
    })
    .withRateLimiting({
      enabled: true,
      maxRequestsPerMinute: 60 // IntelliSense shows description
    })
    .withHeader({
      show: true,
      title: 'Assistant' // IntelliSense shows field descriptions
    })
    .withMessageActions({
      onCopy: (id, content) => {} // IntelliSense shows parameter types
    })
    .withPrompts({
      starterPrompts: [{
        text: 'Hello', // IntelliSense shows required fields
        category: 'general' // IntelliSense shows optional fields
      }]
    })
    .withErrorHandling({
      enabled: true,
      onError: (error, type) => {} // IntelliSense shows parameter types
    })
    .build()

  return config
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔧 Utility Types</h2>
        <p>Helper types for advanced TypeScript patterns.</p>

        <h3>RequireAtLeastOne</h3>
        <div className="code-block">
          <pre><code>{`import { RequireAtLeastOne } from '@clarity-chat/react'

type MessageActions = RequireAtLeastOne<{
  onCopy?: () => void
  onEdit?: () => void
  onDelete?: () => void
}, 'onCopy' | 'onEdit' | 'onDelete'>

// This is valid:
const actions1: MessageActions = { onCopy: () => {} }
const actions2: MessageActions = { onEdit: () => {}, onDelete: () => {} }

// This causes TypeScript error:
// const actions3: MessageActions = {} // ❌ Must have at least one`}</code></pre>
        </div>

        <h3>ComponentConfig</h3>
        <div className="code-block">
          <pre><code>{`import { ComponentConfig } from '@clarity-chat/react'

interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'small' | 'medium' | 'large'
  disabled: boolean
  onClick: () => void
}

type ButtonConfig = ComponentConfig<ButtonProps>

// All properties are optional, allowing flexible configuration
const config: ButtonConfig = {
  variant: 'primary', // optional override
  size: 'large'       // optional override
  // onClick remains required in actual component
}`}</code></pre>
        </div>

        <h3>Branded Types</h3>
        <div className="code-block">
          <pre><code>{`import { ApiUrl, ChatId, MessageId } from '@clarity-chat/react'

// Branded types prevent mixing incompatible strings
function sendMessage(chatId: ChatId, messageId: MessageId, api: ApiUrl) {
  // TypeScript ensures correct parameter types
}

const chatId: ChatId = 'chat-123' as ChatId
const messageId: MessageId = 'msg-456' as MessageId
const api: ApiUrl = 'https://api.com' as ApiUrl

sendMessage(chatId, messageId, api) // ✅ Correct types

// These would cause TypeScript errors:
// sendMessage(messageId, chatId, api) // ❌ Wrong parameter order
// sendMessage(chatId, chatId, api)    // ❌ Wrong types`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📊 Async State Types</h2>
        <p>Type-safe async operation states.</p>

        <div className="code-block">
          <pre><code>{`import { AsyncState } from '@clarity-chat/react'

type ChatState = AsyncState<ChatData>

function ChatComponent() {
  const [state, setState] = useState<ChatState>({ status: 'idle' })

  const loadChat = async () => {
    setState({ status: 'loading' })
    try {
      const data = await fetchChat()
      setState({ status: 'success', data })
    } catch (error) {
      setState({ status: 'error', error: error as Error })
    }
  }

  if (state.status === 'loading') {
    return <div>Loading...</div>
  }

  if (state.status === 'error') {
    return <div>Error: {state.error.message}</div>
  }

  if (state.status === 'success') {
    // IntelliSense knows 'data' is available
    return <ChatView data={state.data} />
  }

  return <button onClick={loadChat}>Load Chat</button>
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 API Response Types</h2>
        <p>Type-safe API response handling.</p>

        <div className="code-block">
          <pre><code>{`import { ApiResponse } from '@clarity-chat/react'

type ChatResponse = ApiResponse<ChatData>

function handleApiResponse(response: ChatResponse) {
  if (response.success) {
    // IntelliSense knows 'data' is available
    console.log('Success:', response.data)
  } else {
    // IntelliSense knows 'error' is available
    console.error('Error:', response.error.message)
    console.error('Code:', response.error.code)
  }
}

// Usage with fetch
async function fetchChat(): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat')
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: (error as Error).message,
        code: 'NETWORK_ERROR'
      }
    }
  }
}`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>📚 API Reference</h2>

        <h3>Type Imports</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>ChatApiConfig</code>
            <p>Valid API URL formats with IntelliSense validation.</p>
          </div>
          <div className="api-item">
            <code>ChatPreset</code>
            <p>Available chat configuration presets.</p>
          </div>
          <div className="api-item">
            <code>MemoryConfigHelper</code>
            <p>Memory configuration with detailed IntelliSense.</p>
          </div>
          <div className="api-item">
            <code>StreamingConfigHelper</code>
            <p>Streaming configuration with conditional fields.</p>
          </div>
          <div className="api-item">
            <code>RateLimitConfigHelper</code>
            <p>Rate limiting configuration with descriptions.</p>
          </div>
          <div className="api-item">
            <code>HeaderConfigHelper</code>
            <p>Header configuration with field descriptions.</p>
          </div>
          <div className="api-item">
            <code>MessageActionsConfigHelper</code>
            <p>Message actions configuration with callback types.</p>
          </div>
          <div className="api-item">
            <code>PromptsConfigHelper</code>
            <p>Prompt configuration with starter/follow-up options.</p>
          </div>
          <div className="api-item">
            <code>ErrorHandlingConfigHelper</code>
            <p>Error handling configuration with callback types.</p>
          </div>
          <div className="api-item">
            <code>ChatErrorType</code>
            <p>Enumeration of possible chat error types.</p>
          </div>
        </div>

        <h3>Utility Types</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>RequireAtLeastOne&lt;T, K&gt;</code>
            <p>Require at least one property from a set of keys.</p>
          </div>
          <div className="api-item">
            <code>ComponentConfig&lt;T&gt;</code>
            <p>Make all properties of a component config optional.</p>
          </div>
          <div className="api-item">
            <code>Branded&lt;T, Brand&gt;</code>
            <p>Create branded types for better type safety.</p>
          </div>
          <div className="api-item">
            <code>ApiResponse&lt;T&gt;</code>
            <p>Type-safe API response with success/error states.</p>
          </div>
          <div className="api-item">
            <code>AsyncState&lt;T&gt;</code>
            <p>Type-safe async operation states.</p>
          </div>
        </div>

        <h3>Functions</h3>
        <div className="api-reference">
          <div className="api-item">
            <code>createApiUrl(url: string): ApiUrl</code>
            <p>Create a validated API URL with type safety.</p>
          </div>
          <div className="api-item">
            <code>TypeSafeChatConfig</code>
            <p>Builder class for type-safe chat configuration.</p>
          </div>
        </div>
      </div>

      <div className="docs-section">
        <h2>🎯 Best Practices</h2>

        <h3>TypeScript Configuration</h3>
        <ul>
          <li>Use strict mode for better IntelliSense</li>
          <li>Enable <code>noImplicitAny</code> for type safety</li>
          <li>Use branded types for domain-specific strings</li>
          <li>Leverage IntelliSense helper types in your components</li>
        </ul>

        <h3>IDE Support</h3>
        <ul>
          <li>Install TypeScript ESLint for better error detection</li>
          <li>Use VS Code with TypeScript extensions</li>
          <li>Enable IntelliSense in your editor</li>
          <li>Use JSDoc comments for additional IntelliSense hints</li>
        </ul>

        <h3>Configuration Patterns</h3>
        <ul>
          <li>Use <code>TypeSafeChatConfig</code> builder for complex setups</li>
          <li>Leverage branded types for API endpoints and IDs</li>
          <li>Use <code>AsyncState</code> for consistent loading states</li>
          <li>Apply <code>RequireAtLeastOne</code> for flexible but safe APIs</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>🔧 Integration Examples</h2>

        <h3>With Custom Components</h3>
        <div className="code-block">
          <pre><code>{`import { ComponentConfig, RequireAtLeastOne } from '@clarity-chat/react'

interface CustomButtonProps {
  variant: 'primary' | 'secondary'
  size: 'small' | 'medium' | 'large'
  onClick: () => void
  disabled?: boolean
}

type CustomButtonConfig = ComponentConfig<CustomButtonProps>
type RequiredAction = RequireAtLeastOne<CustomButtonProps, 'onClick'>

function CustomButton(props: RequiredAction & CustomButtonConfig) {
  // Component implementation with great IntelliSense
  return <button {...props} />
}`}</code></pre>
        </div>

        <h3>With API Integration</h3>
        <div className="code-block">
          <pre><code>{`import { ApiResponse, AsyncState, ApiUrl, createApiUrl } from '@clarity-chat/react'

type UserData = { id: string; name: string }
type UserResponse = ApiResponse<UserData>
type UserState = AsyncState<UserData>

function useUser(apiUrl: ApiUrl): UserState {
  const [state, setState] = useState<UserState>({ status: 'idle' })

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then((data: UserData) => {
        setState({ status: 'success', data })
      })
      .catch(error => {
        setState({ status: 'error', error })
      })
  }, [apiUrl])

  return state
}

// Usage with type safety
const apiUrl = createApiUrl('/api/user')
const userState = useUser(apiUrl)`}</code></pre>
        </div>

        <h3>With Form Libraries</h3>
        <div className="code-block">
          <pre><code>{`import { RequireAtLeastOne } from '@clarity-chat/react'

interface FormField {
  name: string
  type?: 'text' | 'email' | 'password'
  required?: boolean
  validation?: (value: string) => boolean
}

type ValidFormField = RequireAtLeastOne<FormField, 'name' | 'type'>

function createField(config: ValidFormField): FormField {
  return {
    type: 'text',
    required: false,
    ...config
  }
}

// IntelliSense ensures at least name or type is provided
const field1 = createField({ name: 'email' })     // ✅
const field2 = createField({ type: 'password' })  // ✅
const field3 = createField({ name: 'email', type: 'email' }) // ✅
// const field4 = createField({}) // ❌ TypeScript error`}</code></pre>
        </div>
      </div>

      <div className="docs-section">
        <h2>🔍 Troubleshooting</h2>

        <h3>Common Issues</h3>
        <div className="issue-list">
          <div className="issue">
            <h4>IntelliSense not working</h4>
            <p>Ensure TypeScript language server is running and types are properly exported.</p>
          </div>
          <div className="issue">
            <h4>Branded types causing errors</h4>
            <p>Use type assertions or helper functions to create branded types properly.</p>
          </div>
          <div className="issue">
            <h4>Complex types slowing down IDE</h4>
            <p>Consider breaking down complex types or using simpler alternatives for performance.</p>
          </div>
          <div className="issue">
            <h4>Utility types not applying correctly</h4>
            <p>Check TypeScript version compatibility and ensure proper generic usage.</p>
          </div>
        </div>
      </div>
    </div>
  )
}