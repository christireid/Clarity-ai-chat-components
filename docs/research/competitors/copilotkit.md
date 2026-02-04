# CopilotKit

## Overview

- Repository URL: https://github.com/CopilotKit/CopilotKit
- Documentation URL: https://docs.copilotkit.ai/
- Website URL: https://www.copilotkit.ai/
- GitHub stars: 28,200+
- License: MIT
- Maintained by: CopilotKit (Open Source)
- Latest version: Active development
- Package: `@copilotkit/react-core` (npm install @copilotkit/react-core)

## Component Inventory

### UI Components

CopilotKit provides a **hybrid approach** - both pre-built components and headless APIs:

**Pre-Built Chat Interfaces**:

- `CopilotChat` - Standard chat interface with full message history
- `CopilotSidebar` - Side panel layout for persistent AI assistance
- `CopilotPopup` - Modal popup interaction for contextual help
- `CopilotTextarea` - AI-enhanced textarea with inline assistance

**Philosophy**: Unlike Vercel AI SDK (purely headless) or shadcn-ai (purely components), CopilotKit
offers both pre-styled components AND the ability to go fully headless. This "dual-mode" approach
allows rapid prototyping with pre-built UI while maintaining customization depth for production.

### Component Customization Levels

**Three Tiers of Control**:

1. **Pre-Built Styling** - Use components out-of-box with props customization
2. **Sub-Component Replacement** - Swap specific UI elements (message bubbles, input fields)
3. **Fully Headless** - Build custom interfaces using hooks only

Example of customization:

```typescript
<CopilotSidebar
  instructions="You are a helpful assistant"
  labels={{
    title: "Custom Title",
    placeholder: "Ask me anything..."
  }}
  // Deep CSS customization
  className="custom-sidebar"
  // Or replace sub-components entirely
  components={{
    Message: CustomMessageComponent,
    Input: CustomInputComponent
  }}
/>
```

## Hooks & Utilities

### useAgent Hook

The primary v2 hook for agent connection and control:

```typescript
// Signature
const { agent } = useAgent({
  agentId: string;
  name?: string;
  initialState?: Record<string, any>;
});

// Agent Interface
interface Agent {
  // State Management
  setState: (state: Record<string, any>) => void;
  state: Record<string, any>;

  // Control
  run: (input?: string) => Promise<void>;
  stop: () => void;

  // Status
  status: 'idle' | 'running' | 'stopped' | 'error';
}

// Usage Example
const { agent } = useAgent({ agentId: "weather_agent" });

// Set agent state (triggers re-render)
agent.setState({ city: "New York", units: "imperial" });

// Access current state
console.log(agent.state.city); // "New York"

// Run agent programmatically
await agent.run("What's the weather?");
```

**Key Features**:

- Bidirectional state sharing (app ↔️ agent)
- Real-time state updates trigger React re-renders
- Programmatic agent control
- Typed state with TypeScript generics

### useCopilotKit Hook

Access root provider for programmatic control:

```typescript
const { copilotkit } = useCopilotKit()

// Programmatically run agents
copilotkit.runAgent({
  agent: myAgentInstance,
  context: { userId: '123' },
})

// Access global configuration
console.log(copilotkit.config)
```

### useFrontendTool Hook

Bind UI components to agent tool calls:

```typescript
// Signature
useFrontendTool({
  name: string;
  description: string;
  parameters: z.ZodSchema;
  render: (args: T, status: ToolStatus) => React.ReactNode;
  handler?: (args: T) => Promise<any>;
});

// Usage Example
useFrontendTool({
  name: "show_weather",
  description: "Display weather information for a city",
  parameters: z.object({
    city: z.string(),
    temperature: z.number(),
    condition: z.string()
  }),
  render: ({ city, temperature, condition }, status) => (
    <WeatherCard
      city={city}
      temp={temperature}
      condition={condition}
      loading={status === 'executing'}
    />
  ),
  handler: async ({ city }) => {
    // Optional: Execute side effects
    await logWeatherRequest(city);
    return { success: true };
  }
});
```

**Key Features**:

- Stream-aware rendering (status: 'pending' | 'executing' | 'complete')
- Zod schema validation
- Optional async handler for side effects
- Real-time UI updates during tool execution
- Generative UI pattern

### useCopilotReadable Hook

Provide context and state to the AI copilot:

```typescript
// Signature
useCopilotReadable({
  description: string;
  value: any;
  parentId?: string;
  categories?: string[];
  convert?: (value: any) => string;
});

// Usage Example
const { user, preferences } = useAppState();

useCopilotReadable({
  description: "Current user information",
  value: user,
  categories: ["user_context"]
});

useCopilotReadable({
  description: "User preferences and settings",
  value: preferences,
  convert: (prefs) => JSON.stringify(prefs, null, 2)
});

// Make component state available
const [selectedItems, setSelectedItems] = useState([]);
useCopilotReadable({
  description: "Currently selected items in the UI",
  value: selectedItems
});
```

**Key Features**:

- Automatic context injection to AI prompts
- Custom value conversion for optimal prompt formatting
- Categories for context organization
- Hierarchical context with parentId
- Reactive - updates when value changes

### useCopilotAdditionalInstructions Hook

Inject dynamic instructions based on app state:

```typescript
useCopilotAdditionalInstructions({
  instructions: string;
  parentId?: string;
});

// Usage Example
const { userRole } = useAuth();

useCopilotAdditionalInstructions({
  instructions: userRole === 'admin'
    ? "You have access to admin functions. You can modify settings and manage users."
    : "You are in read-only mode. You can view information but cannot make changes."
});

// Conditional based on UI state
const [isEditMode, setIsEditMode] = useState(false);

useCopilotAdditionalInstructions({
  instructions: isEditMode
    ? "The user is currently editing. Suggest improvements and help with formatting."
    : "The user is viewing. Focus on explaining content and answering questions."
});
```

**Use Cases**:

- Role-based instructions
- State-dependent behavior
- Contextual guidance based on UI mode
- Feature flag-driven capabilities

### useCopilotChat Hook

Direct access to chat state and controls:

```typescript
const { messages, sendMessage, isLoading, stop, regenerate, setMessages } = useCopilotChat()

// Send message programmatically
sendMessage({ content: 'Hello', role: 'user' })

// Clear chat
setMessages([])

// Stop generation
stop()

// Regenerate last response
regenerate()
```

### useHumanInTheLoop Hook

Enable approval workflows for agent actions:

```typescript
useFrontendTool({
  name: "send_email",
  description: "Send an email to a user",
  parameters: z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string()
  }),
  render: ({ to, subject, body }, status) => (
    <EmailPreview to={to} subject={subject} body={body} />
  ),
  handler: async (args) => {
    // Require human approval
    const approved = await useHumanInTheLoop({
      message: `Send email to ${args.to}?`,
      approvalOptions: {
        approve: "Send Email",
        reject: "Cancel"
      }
    });

    if (approved) {
      return await sendEmail(args);
    }
    return { cancelled: true };
  }
});
```

**Key Features**:

- Custom approval UI
- Async approval flow
- Reject with feedback
- Multi-step approval chains

### useCoAgentStateRender Hook

Render components based on agent state:

```typescript
useCoAgentStateRender({
  name: string;
  render: (state: any) => React.ReactNode;
});

// Usage Example
useCoAgentStateRender({
  name: "weather_visualization",
  render: (state) => {
    if (state.type === 'loading') {
      return <Spinner />;
    }
    if (state.type === 'weather') {
      return <WeatherWidget data={state.data} />;
    }
    if (state.type === 'forecast') {
      return <ForecastChart data={state.data} />;
    }
  }
});
```

### useRenderToolCall Hook

Custom rendering for specific tool calls:

```typescript
useRenderToolCall({
  name: string;
  render: (args: any, result: any, status: string) => React.ReactNode;
});

// Usage Example
useRenderToolCall({
  name: "database_query",
  render: (args, result, status) => (
    <DatabaseQueryResult
      query={args.sql}
      results={result}
      executing={status === 'executing'}
    />
  )
});
```

## SDK Architecture

### Core Design Philosophy

**Deeply-Integrated AI Assistants**:

CopilotKit emphasizes building AI assistants that work _alongside_ users within applications, not as
separate chat interfaces. The architecture enables:

1. **Contextual Awareness** - Apps surface relevant state via `useCopilotReadable`
2. **Bidirectional State** - Agents read and write app state in real-time
3. **Native UI Integration** - Tools render as native UI components, not text responses
4. **Workflow Collaboration** - Humans and AI jointly manage complex tasks

### Three-Layer Architecture

**1. Frontend Layer** (`@copilotkit/react-core`)

React hooks and components providing:

- UI components (CopilotChat, CopilotSidebar, CopilotPopup)
- State management hooks (useAgent, useCopilotKit)
- Context hooks (useCopilotReadable, useCopilotAdditionalInstructions)
- Tool integration (useFrontendTool, useRenderToolCall)

**2. Runtime Layer** (`CopilotRuntime`)

Backend integration supporting:

- LLM adapter flexibility (OpenAI, Anthropic, Google, Groq)
- Agent framework integration (LangGraph, CrewAI, Pydantic AI)
- Direct backend actions (TypeScript/Node.js)
- Remote endpoints (Python, LangGraph Platform)

**3. AG-UI Protocol Layer**

Custom protocol for agent-user interaction:

- Standardized message format
- Tool calling specification
- State synchronization protocol
- Streaming support
- Multi-agent coordination

### Integration Patterns

**Pattern 1: Direct LLM Integration**

```typescript
import { CopilotRuntime } from '@copilotkit/runtime'
import { OpenAIAdapter } from '@copilotkit/runtime'

const runtime = new CopilotRuntime({
  adapter: new OpenAIAdapter({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  }),
})

export async function POST(req: Request) {
  return runtime.handleRequest(req)
}
```

**Pattern 2: Agent Framework Integration**

```typescript
import { LangGraphAdapter } from '@copilotkit/runtime'
import { myAgent } from './agents/myAgent'

const runtime = new CopilotRuntime({
  adapter: new LangGraphAdapter({
    agent: myAgent,
    agentId: 'my_agent',
  }),
})
```

**Pattern 3: Remote Endpoint Integration**

```typescript
const runtime = new CopilotRuntime({
  adapter: new RemoteAdapter({
    url: 'https://my-agent-server.com/api/agent',
    headers: { Authorization: `Bearer ${token}` },
  }),
})
```

### Provider Support

**LLM Adapters**:

- OpenAI (GPT-4o, GPT-4, GPT-3.5)
- Anthropic (Claude 3.5 Sonnet, Claude Opus 4.5)
- Google Generative AI (Gemini)
- Groq (Llama, Mixtral)
- Ollama (Local models)

**Agent Frameworks**:

- LangGraph Deep Agents
- CrewAI
- Pydantic AI
- Llama Index
- ADK (Agent Development Kit)
- Microsoft Agent Framework
- AWS Strands

**Key Feature**: Framework-agnostic architecture via AG-UI protocol allows mixing and matching LLMs
and agent frameworks.

### Generative UI Architecture

**Three Specification Types**:

1. **A2UI** (Google's declarative spec)
   - LLM-friendly UI declarations
   - Component-based rendering
   - Type-safe parameters

2. **Open-JSON-UI** (OpenAI standard)
   - JSON schema-based UI
   - Flexible component definitions
   - Standard format across tools

3. **MCP Apps** (Model Context Protocol)
   - Interactive components from MCP servers
   - Direct MCP integration
   - Bring MCP apps to end users

**Rendering Pipeline**:

```
Agent Tool Call → UI Spec → Component Renderer → React UI
```

### State Management Architecture

**Predictive State Updates**:

CopilotKit streams in-progress state changes before agent execution completes:

```typescript
const { agent } = useAgent({ agentId: 'calculator' })

// Agent sets intermediate state during execution
// UI updates in real-time as agent thinks
useEffect(() => {
  console.log(agent.state.currentStep) // Updates progressively
}, [agent.state])
```

**Bidirectional State Flow**:

```
┌──────────────┐         ┌──────────────┐
│  React App   │ ←────→ │    Agent     │
│              │  State  │              │
│  UI State    │ Sharing │  Agent State │
└──────────────┘         └──────────────┘
       ↓                        ↓
   useCopilotReadable      agent.setState
```

## API Design Patterns

### Hook Design Philosophy

**Principles**:

1. **Hybrid Approach** - Both headless hooks AND pre-built components
2. **Context Awareness** - Deep integration with app state via readables
3. **Generative UI** - Tools render as components, not text
4. **State Synchronization** - Real-time bidirectional state sharing
5. **Framework Flexibility** - Works with any agent framework via AG-UI
6. **Developer Choice** - Use pre-built UI or go fully custom

### Progressive Enhancement Pattern

```typescript
// Level 1: Use pre-built component
<CopilotSidebar />

// Level 2: Customize with props
<CopilotSidebar
  instructions="Custom instructions"
  labels={{ title: "My Assistant" }}
/>

// Level 3: Replace sub-components
<CopilotSidebar
  components={{
    Message: CustomMessage,
    Input: CustomInput
  }}
/>

// Level 4: Go fully headless
const { messages, sendMessage } = useCopilotChat();
// Build custom UI from scratch
```

### Type Safety

**Schema Integration**:

Uses Zod for parameter validation and type inference:

```typescript
const schema = z.object({
  city: z.string(),
  temperature: z.number(),
  units: z.enum(['celsius', 'fahrenheit']),
})

useFrontendTool({
  name: 'show_weather',
  parameters: schema,
  render: (args) => {
    // args is fully typed!
    const { city, temperature, units } = args
    // TypeScript knows: city: string, temperature: number, units: "celsius" | "fahrenheit"
  },
})
```

**Generic Agent State**:

```typescript
interface WeatherState {
  city: string
  temperature: number
  condition: string
}

const { agent } = useAgent<WeatherState>({ agentId: 'weather' })

// Fully typed state access
agent.state.city // string
agent.state.temperature // number
```

### Context Provision Pattern

**Automatic Context Injection**:

```typescript
// Anywhere in your component tree
const { cart } = useShoppingCart()
const { user } = useAuth()

useCopilotReadable({
  description: 'Shopping cart contents',
  value: cart,
})

useCopilotReadable({
  description: 'Logged in user',
  value: user,
})

// Copilot automatically receives this context in prompts
// No manual prompt engineering needed
```

**Dynamic Instructions**:

```typescript
const { permissions } = useAuth()

useCopilotAdditionalInstructions({
  instructions: `
    User permissions: ${permissions.join(', ')}
    ${permissions.includes('admin') ? 'You can modify system settings.' : 'Read-only access.'}
  `,
})
```

### Developer Experience

**What Makes It Easy**:

1. **One-Command Setup** - `npx copilotkit@latest create`
2. **Pre-Built Components** - Working chat in minutes
3. **Context Hooks** - No manual prompt engineering
4. **Generative UI** - Tools render as native components
5. **Framework Agnostic** - Works with any agent framework
6. **TypeScript Native** - Full type safety
7. **Flexible Customization** - Pre-built to fully headless

**Setup Complexity**: Low - Pre-built components work immediately, customization available when
needed

**Learning Curve**:

- Basic usage: 30 minutes
- Context hooks: 1-2 hours
- Agent integration: 2-4 hours
- Generative UI: 4+ hours

## In-App AI Assistant Patterns

### Copilot Pattern Types

**1. Sidekick Pattern** (CopilotSidebar)

Persistent side panel that stays visible while user works:

```typescript
<CopilotSidebar
  instructions="Help users manage their tasks"
  defaultOpen={true}
/>
```

**Use Cases**:

- Documentation assistant
- Code helper
- Research assistant
- Data analysis copilot

**When to Use**: Tasks requiring frequent AI consultation, reference lookups, or ongoing assistance.

**2. Popup Pattern** (CopilotPopup)

On-demand modal for contextual help:

```typescript
<CopilotPopup
  instructions="Answer questions about the current page"
  trigger={<button>Ask AI</button>}
/>
```

**Use Cases**:

- Quick questions
- Contextual help
- Feature explanations
- Form assistance

**When to Use**: Occasional assistance without permanent screen real estate commitment.

**3. Embedded Pattern** (CopilotChat)

Full-page chat interface:

```typescript
<CopilotChat
  instructions="Full-featured customer support assistant"
  showWelcomeMessage={true}
/>
```

**Use Cases**:

- Customer support
- Interactive tutorials
- Conversational interfaces
- AI-first applications

**When to Use**: AI is primary interface, not auxiliary feature.

**4. Inline Pattern** (CopilotTextarea)

AI-enhanced input fields:

```typescript
<CopilotTextarea
  placeholder="Describe your task..."
  autosuggestionsConfig={{
    textareaPurpose: "Task description",
    chatApiConfigs: {}
  }}
/>
```

**Use Cases**:

- Writing assistance
- Code completion
- Email composition
- Form auto-fill

**When to Use**: Enhance existing inputs with AI suggestions.

### Context-Aware Assistant Pattern

**Pattern**: Surface app state to make assistant contextually aware:

```typescript
function TaskManager() {
  const { tasks } = useTasks();
  const { currentProject } = useProject();

  // Make context available to copilot
  useCopilotReadable({
    description: "Current project details",
    value: currentProject
  });

  useCopilotReadable({
    description: "All tasks in current project",
    value: tasks
  });

  return (
    <div>
      <TaskList tasks={tasks} />
      <CopilotSidebar instructions="Help manage tasks in this project" />
    </div>
  );
}
```

**Benefits**:

- No manual context passing
- Automatic prompt enhancement
- Reactive context updates
- Scoped to component tree

### Tool-as-UI Pattern

**Pattern**: Agent tools render as interactive UI components:

```typescript
useFrontendTool({
  name: "create_task",
  description: "Create a new task",
  parameters: z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(["low", "medium", "high"])
  }),
  render: ({ title, description, priority }, status) => (
    <TaskCreationCard
      title={title}
      description={description}
      priority={priority}
      creating={status === 'executing'}
      onConfirm={() => createTask({ title, description, priority })}
      onCancel={() => {}}
    />
  )
});
```

**Benefits**:

- Visual confirmation before actions
- Interactive parameter adjustment
- Native UI/UX consistency
- Human-in-the-loop approval

### Workflow Collaboration Pattern

**Pattern**: Human and AI jointly manage multi-step workflows:

```typescript
const { agent } = useAgent({ agentId: "data_analysis" });

// Agent manages workflow state
useEffect(() => {
  console.log(agent.state.currentStep); // "loading_data" | "cleaning" | "analysis" | "visualization"
}, [agent.state]);

// Render step-specific UI
useFrontendTool({
  name: "show_cleaning_options",
  description: "Show data cleaning options to user",
  parameters: z.object({
    issues: z.array(z.string()),
    suggestions: z.array(z.string())
  }),
  render: ({ issues, suggestions }) => (
    <DataCleaningWizard
      issues={issues}
      suggestions={suggestions}
      onSelect={(selected) => {
        // User choice updates agent state
        agent.setState({ cleaningStrategy: selected });
      }}
    />
  )
});
```

**Benefits**:

- Clear workflow progression
- User intervention at decision points
- Transparent AI reasoning
- Collaborative task completion

## Streaming Capabilities

### Real-Time State Updates

**Progressive State Streaming**:

```typescript
const { agent } = useAgent({ agentId: "calculator" });

// Agent state updates stream in real-time
useEffect(() => {
  console.log(agent.state);
  // { step: "parsing" } → { step: "calculating", expression: "..." } → { step: "complete", result: 42 }
}, [agent.state]);

// UI updates automatically
return (
  <div>
    Current Step: {agent.state.step}
    {agent.state.result && <Result value={agent.state.result} />}
  </div>
);
```

### Tool Execution Streaming

**Stream-Aware Tool Rendering**:

```typescript
useFrontendTool({
  name: "analyze_data",
  parameters: z.object({ data: z.array(z.number()) }),
  render: ({ data }, status) => {
    // Status: 'pending' | 'executing' | 'complete' | 'error'
    return (
      <AnalysisCard
        data={data}
        loading={status === 'executing'}
        error={status === 'error'}
      />
    );
  }
});
```

### Message Streaming

**Progressive Message Rendering**:

```typescript
const { messages } = useCopilotChat();

return messages.map(message => (
  <Message
    key={message.id}
    content={message.content}
    streaming={message.isStreaming}
  >
    {message.isStreaming && <StreamingIndicator />}
  </Message>
));
```

## Visual Design

### Pre-Built Component Styling

**Default Aesthetic**:

- Clean, minimal design
- Light and dark mode support
- Responsive layouts
- Accessible by default

**Customization via Props**:

```typescript
<CopilotSidebar
  className="custom-sidebar"
  defaultOpen={true}
  clickOutsideToClose={false}
  icons={{
    openIcon: <CustomOpenIcon />,
    closeIcon: <CustomCloseIcon />,
    spinnerIcon: <CustomSpinner />
  }}
  labels={{
    title: "My Assistant",
    initial: "How can I help?",
    placeholder: "Ask me anything..."
  }}
/>
```

### Sub-Component Replacement

**Granular UI Control**:

```typescript
<CopilotChat
  components={{
    Message: ({ message }) => <CustomMessageBubble message={message} />,
    Input: ({ onSend }) => <CustomChatInput onSend={onSend} />,
    Header: () => <CustomHeader />,
    Footer: () => <CustomFooter />
  }}
/>
```

### CSS Customization

**Deep Styling Access**:

CopilotKit components expose CSS classes for detailed styling:

```css
/* Target specific elements */
.copilot-sidebar {
  background: var(--sidebar-bg);
}

.copilot-message {
  border-radius: 12px;
}

.copilot-message[data-role='assistant'] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.copilot-input {
  border: 2px solid var(--primary-color);
}
```

### Headless Mode

**Full Custom UI**:

```typescript
const { messages, sendMessage, isLoading } = useCopilotChat();

return (
  <div className="my-custom-chat">
    <div className="messages">
      {messages.map(msg => (
        <div key={msg.id} className={`message ${msg.role}`}>
          {msg.content}
        </div>
      ))}
    </div>
    <input
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          sendMessage({ content: e.target.value, role: 'user' });
        }
      }}
      disabled={isLoading}
    />
  </div>
);
```

## Key Differentiators

### 1. Hybrid Component Architecture

**Unique Aspect**: Only framework providing BOTH pre-built components AND headless APIs

**Comparison**:

- Vercel AI SDK: Headless only, no components
- shadcn-ai: Components only, limited headless flexibility
- CopilotKit: Both, with seamless transition

**Benefit**: Rapid prototyping with pre-built → Gradual customization → Full headless when needed

### 2. AG-UI Protocol

**Unique Aspect**: Custom Agent-User Interaction Protocol

**What It Provides**:

- Standardized agent communication
- Framework-agnostic agent integration
- Multi-agent coordination
- State synchronization specification
- Tool calling standard

**Benefit**: Works with LangGraph, CrewAI, Pydantic AI, custom agents - all through one interface

### 3. Context Awareness Hooks

**Unique Aspect**: `useCopilotReadable` for automatic context injection

**How It Works**:

```typescript
// Just declare what's readable
useCopilotReadable({
  description: 'Shopping cart',
  value: cart,
})

// Copilot automatically knows about cart in prompts
// No manual context management
```

**Benefit**: No prompt engineering, automatic context updates, scoped to component tree

### 4. Generative UI

**Unique Aspect**: Tools render as interactive React components, not text

**How It Works**:

```typescript
useFrontendTool({
  name: "show_weather",
  render: (args) => <WeatherWidget {...args} />
});

// Agent calls tool → WeatherWidget renders in chat
// Not "The weather in NYC is 72°F"
```

**Benefit**: Native UI consistency, interactive components, visual richness

### 5. Bidirectional State Sharing

**Unique Aspect**: Agent can read AND write app state in real-time

**How It Works**:

```typescript
const { agent } = useAgent({ agentId: 'task_manager' })

// Agent reads app state
useCopilotReadable({ value: tasks })

// Agent writes app state
agent.setState({ selectedTask: 'task-123' })

// UI reacts to agent state changes
useEffect(() => {
  highlightTask(agent.state.selectedTask)
}, [agent.state.selectedTask])
```

**Benefit**: True collaboration between user and AI, not just chat

### 6. Human-in-the-Loop Workflows

**Unique Aspect**: Built-in approval workflows for agent actions

**How It Works**:

```typescript
useFrontendTool({
  handler: async (args) => {
    const approved = await useHumanInTheLoop({
      message: 'Delete 50 records?',
      approvalOptions: { approve: 'Delete', reject: 'Cancel' },
    })
    if (approved) return deleteRecords(args)
  },
})
```

**Benefit**: Safe autonomous actions, user control, transparent decision-making

### 7. One-Command Setup

**Unique Aspect**: CLI installer sets up entire stack

```bash
npx copilotkit@latest create
```

**What It Does**:

- Scaffolds project structure
- Installs dependencies
- Configures backend runtime
- Sets up frontend components
- Provides example code

**Benefit**: 5-minute setup, working copilot immediately

### 8. Predictive State Updates

**Unique Aspect**: Stream in-progress state before agent completes

**How It Works**:

- Agent execution streams state changes
- UI updates in real-time as agent "thinks"
- Users see progressive work, not just final result

**Benefit**: Transparent AI reasoning, perceived performance, engaging UX

### 9. MCP Integration

**Unique Aspect**: First-class Model Context Protocol support

**What It Provides**:

- Connect MCP servers directly
- Surface MCP apps to end users
- Interactive MCP components in chat

**Benefit**: Leverage MCP ecosystem, rich integrations, standardized tooling

### 10. Framework-Agnostic Agent Support

**Unique Aspect**: Works with ANY agent framework via AG-UI

**Supported Frameworks**:

- LangGraph, CrewAI, Pydantic AI, Llama Index
- ADK, Microsoft Agent Framework, AWS Strands
- Custom agents (via AG-UI protocol)

**Benefit**: No vendor lock-in, use best tool for job, mix frameworks

## Strengths

1. **Hybrid Architecture**
   - Pre-built components for rapid development
   - Headless hooks for full customization
   - Smooth transition between modes

2. **Exceptional Context Management**
   - Automatic context injection via `useCopilotReadable`
   - No manual prompt engineering
   - Reactive context updates
   - Component-scoped context

3. **Generative UI Excellence**
   - Tools render as native components
   - Interactive, visual experiences
   - Human-in-the-loop approvals
   - UI/UX consistency

4. **True Agent Integration**
   - Works with any framework via AG-UI
   - Bidirectional state sharing
   - Real-time agent state updates
   - Multi-agent support

5. **Developer Experience**
   - One-command setup
   - Pre-built components work immediately
   - TypeScript-first with Zod validation
   - Extensive customization options

6. **Production-Ready**
   - 28.2k GitHub stars
   - Used by Fortune 500s (Cisco, Deloitte, TripAdvisor)
   - 100k+ developers
   - MIT license, open source

7. **Comprehensive Features**
   - Multiple copilot patterns (sidebar, popup, embedded, inline)
   - MCP integration
   - Prompt injection protection
   - Observability and debugging tools

8. **State Management**
   - Predictive state updates
   - Stream-aware rendering
   - React-native state integration
   - Automatic re-renders

9. **Flexibility**
   - Use with or without agent frameworks
   - Direct LLM integration option
   - Remote endpoint support
   - Custom transport layers

10. **Documentation Quality**
    - Clear getting started guides
    - Multiple quickstart paths
    - Framework-specific examples
    - Active community support

## Weaknesses

1. **Complexity for Simple Use Cases**
   - AG-UI protocol may be overkill for basic chat
   - Many concepts to learn (readables, tools, agents, state)
   - Simple chat requires understanding multiple hooks

2. **Agent Framework Dependency**
   - Best features require agent framework
   - Direct LLM mode loses some capabilities
   - Learning curve includes learning agent frameworks

3. **Limited Component Variety**
   - Only 4 main components (Chat, Sidebar, Popup, Textarea)
   - No specialized components (file upload, data viz, etc.)
   - Less variety than larger UI libraries

4. **Documentation Gaps**
   - Some advanced features under-documented
   - AG-UI protocol specs not fully public
   - Limited examples for complex patterns

5. **TypeScript-Focused**
   - Less accessible for JavaScript-only projects
   - Zod schema requirement adds dependency
   - Steeper learning curve for TS beginners

6. **State Management Learning Curve**
   - Bidirectional state powerful but complex
   - Understanding agent state vs app state
   - Potential for state synchronization bugs

7. **Customization Trade-offs**
   - Pre-built components vs headless choice
   - CSS customization requires understanding structure
   - Sub-component replacement has learning curve

8. **Generative UI Constraints**
   - Limited to supported UI specs (A2UI, Open-JSON-UI, MCP)
   - Custom specs require protocol understanding
   - Not all agent frameworks support generative UI

9. **Framework Lock-In (AG-UI)**
   - While framework-agnostic, AG-UI is proprietary
   - Migration away from CopilotKit non-trivial
   - Custom protocol vs industry standards

10. **React-Only**
    - No Vue, Svelte, or Angular support
    - React-only despite "framework agnostic" agents
    - Limits adoption in non-React projects

## Notable Examples

### From Documentation

**1. Email Automation Assistant**

- Approval workflow for sending emails
- Preview before send
- Human-in-the-loop confirmation

**2. Data Analysis Copilot**

- Multi-step workflow collaboration
- Interactive data cleaning
- Progressive analysis visualization

**3. Spreadsheet Copilot**

- Cell mutation with preview
- Formula suggestion
- Data transformation tools

**4. Customer Support Bot**

- Context-aware responses based on user data
- Tool integration (search docs, create tickets)
- Escalation to human agents

### Community Examples

**Production Implementations** (from homepage):

- **Cisco**: Internal tooling copilots
- **Deloitte**: Consulting assistants
- **TripAdvisor**: Travel planning copilots

**Developer Testimonials**:

- "100k+ developers" using CopilotKit
- "Over 10% of Fortune 500s" adoption
- "22.3k GitHub stars" community validation

## Developer Experience

### Setup Complexity

**Rating**: 9/10 - Exceptionally Easy

**Setup Process**:

```bash
# 1. One command creates everything
npx copilotkit@latest create

# 2. Choose options:
#    - Direct LLM or Agent framework
#    - Which LLM provider
#    - Which UI components

# 3. Working copilot in 5 minutes
npm run dev
```

**What's Generated**:

- Project structure
- Dependencies installed
- Backend runtime configured
- Frontend components wired up
- Example code with best practices

**Comparison**:

- Easier than Vercel AI SDK (no manual API routes)
- Easier than shadcn-ai (no manual component installation)
- On par with create-react-app simplicity

### Learning Curve

**Basic Usage**: 30 minutes

- Install CLI
- Run create command
- Understand CopilotSidebar/Chat

**Intermediate**: 2-4 hours

- Context hooks (useCopilotReadable)
- Frontend tools (useFrontendTool)
- Agent integration basics

**Advanced**: 8+ hours

- AG-UI protocol understanding
- Custom agent framework integration
- Generative UI specs
- Multi-agent coordination
- State management patterns

**Steepness**: Medium

- Pre-built components are very easy
- Context hooks intuitive
- Agent integration has learning curve
- Generative UI requires deep understanding

### Documentation Quality

**Rating**: 8/10

**Strengths**:

- Clear getting started guides
- Three quickstart paths (LLM, Agent, MCP)
- Framework-specific integration guides
- Code examples with explanations
- Active Discord community

**Weaknesses**:

- AG-UI protocol specs not fully documented
- Some advanced patterns lack examples
- Generative UI specs could be clearer
- Migration guides missing
- Versioning/changelog could be better

**Documentation Structure**:

- Quickstarts (excellent)
- Core Concepts (good)
- API Reference (comprehensive)
- Examples (could use more)
- Advanced Topics (needs expansion)

### TypeScript Support

**Rating**: 10/10 - Exceptional

**Type Safety Features**:

1. **Generic Hooks**:

```typescript
interface MyAgentState {
  step: string
  data: number[]
}

const { agent } = useAgent<MyAgentState>({ agentId: 'my_agent' })
// agent.state is fully typed
```

2. **Zod Schema Integration**:

```typescript
const schema = z.object({
  city: z.string(),
  temp: z.number(),
})

useFrontendTool({
  parameters: schema,
  render: (args) => {
    // args inferred from schema: { city: string; temp: number }
  },
})
```

3. **Exported Interfaces**:

```typescript
import type { CopilotChatProps, UseAgentOptions, FrontendToolOptions } from '@copilotkit/react-core'
```

4. **Full Inference**:

- Props typed automatically
- Return values inferred
- Generics propagated
- Schema-to-type conversion

**Recommendation**: TypeScript is first-class, highly recommended

## Inspiration for Clarity Chat

### Patterns to Adopt

**1. Hybrid Component Architecture**

**What**: Provide BOTH pre-built components AND headless hooks

**Why**: Best of both worlds - rapid prototyping + full customization

**Implementation**:

```typescript
// Pre-built
import { ClarityChat } from '@clarity/react'

// Headless
import { useClarityChat } from '@clarity/react/hooks'
```

**Benefit**: Attract beginners (components) and advanced users (hooks) alike

---

**2. Context Awareness Hooks**

**What**: `useCopilotReadable` pattern for automatic context injection

**Why**: Eliminates manual prompt engineering, reactive context updates

**Implementation**:

```typescript
export function useClarityContext({
  description: string;
  value: any;
  convert?: (value: any) => string;
}) {
  // Automatically inject into AI prompts
  // Update when value changes
}
```

**Benefit**: Makes AI assistants contextually aware without complex setup

---

**3. Generative UI Pattern**

**What**: Tools render as React components, not text

**Why**: Native UI consistency, interactive experiences, visual richness

**Implementation**:

```typescript
export function useClarityTool({
  name: string;
  render: (args: T, status: ToolStatus) => ReactNode;
}) {
  // Tool calls render as components
}
```

**Benefit**: Better UX than text-only responses, enables visual confirmations

---

**4. Human-in-the-Loop Workflows**

**What**: Built-in approval flows for agent actions

**Why**: Safe autonomous actions, user control, transparent decisions

**Implementation**:

```typescript
export function useClarityApproval({
  onApprove: () => Promise<void>;
  onReject: () => void;
}) {
  // Show approval UI in chat
}
```

**Benefit**: Trust and safety for autonomous AI actions

---

**5. Progressive Component Customization**

**What**: Props → Sub-components → Fully headless progression

**Why**: Easy start, gradual customization, no customization ceiling

**Implementation**:

```typescript
// Level 1: Props
<ClarityChat theme="dark" />

// Level 2: Sub-components
<ClarityChat components={{ Message: CustomMessage }} />

// Level 3: Headless
const { messages } = useClarityChat()
```

**Benefit**: Serves all skill levels without friction

---

**6. One-Command Setup**

**What**: CLI that scaffolds entire working copilot

**Why**: Zero-to-working in 5 minutes, best practices baked in

**Implementation**:

```bash
npx @clarity/create-chat
```

**Benefit**: Reduces friction, increases adoption, ensures quality

---

**7. Status-Aware Rendering**

**What**: Granular status states beyond loading/error

**Why**: Better UX (show stop during streaming, regenerate when ready)

**Implementation**:

```typescript
const { status } = useClarityChat()
// status: 'idle' | 'submitted' | 'streaming' | 'ready' | 'error'
```

**Benefit**: Richer interaction patterns, professional UX

---

**8. Dynamic Instructions**

**What**: `useCopilotAdditionalInstructions` for state-based behavior

**Why**: Role-based instructions, contextual guidance, feature flags

**Implementation**:

```typescript
export function useClarityInstructions({
  instructions: string;
}) {
  // Inject instructions based on app state
}
```

**Benefit**: Adaptive AI behavior without hardcoded prompts

### API Design to Emulate

**1. Zod-First Type Safety**

CopilotKit's pattern of using Zod for both validation AND type inference:

```typescript
const schema = z.object({
  title: z.string(),
  items: z.array(z.string()),
})

useFrontendTool({
  parameters: schema,
  render: (args) => {
    // args automatically typed from schema
  },
})
```

**Adopt**: Use Zod schemas throughout Clarity for consistency

---

**2. Transport Abstraction**

While CopilotKit doesn't emphasize this (Vercel does), consider:

```typescript
export interface ClarityTransport {
  send: (message: Message) => Promise<void>
  subscribe: (onMessage: (msg: Message) => void) => () => void
}

export class HTTPTransport implements ClarityTransport {}
export class DirectTransport implements ClarityTransport {}
```

**Benefit**: Support HTTP, WebSockets, direct agents, etc.

---

**3. Component Prop Flexibility**

CopilotKit's labels, icons, components props pattern:

```typescript
interface ClarityMessageBubbleProps {
  // Content
  message: Message

  // Labels
  labels?: {
    thinking?: string
    error?: string
  }

  // Icons
  icons?: {
    user?: ReactNode
    assistant?: ReactNode
    loading?: ReactNode
  }

  // Sub-components
  components?: {
    Content?: ComponentType<MessageContentProps>
    Actions?: ComponentType<MessageActionsProps>
  }
}
```

**Benefit**: Customization without overwhelming API surface

---

**4. Callback Hooks Pattern**

Provide lifecycle callbacks like:

```typescript
useClarityChat({
  onMessageStart: (message) => {},
  onMessageChunk: (chunk) => {},
  onMessageComplete: (message) => {},
  onError: (error) => {},
  onToolCall: (tool, args) => {},
})
```

**Benefit**: Analytics, logging, custom behaviors without forking

---

**5. Scoped Context Pattern**

CopilotKit's context scoping to component tree:

```typescript
// Only available to copilot in this subtree
function TaskManager() {
  useClarityContext({ value: tasks });

  return <ClarityChat />;
}
```

**Benefit**: Prevents context pollution, enables multiple copilots per page

### Key Takeaways for Clarity Chat

**DO**:

- Provide both pre-built components AND headless hooks
- Implement context awareness hooks for automatic prompt enhancement
- Support generative UI with tool rendering as components
- Include human-in-the-loop approval workflows
- Create CLI for one-command project setup
- Use Zod for schema validation and type inference
- Provide granular status states (not just loading/error)
- Enable progressive customization (props → sub-components → headless)
- Support dynamic instructions based on app state
- Make context scoped to component tree

**DON'T**:

- Force choice between components OR hooks
- Require manual prompt engineering for context
- Limit tools to text-only responses
- Skip approval mechanisms for autonomous actions
- Make setup require multiple manual steps
- Ignore TypeScript users or compromise type safety
- Use only boolean loading states
- Lock users into one customization level
- Hardcode instructions in AI prompts
- Make context global (component scoping is better)

**COMPETITIVE EDGE OPPORTUNITIES**:

1. **Better Documentation** - CopilotKit docs have gaps, Clarity can be comprehensive
2. **Framework Support** - CopilotKit is React-only, Clarity could support Vue/Svelte
3. **Simpler Agent Integration** - AG-UI is proprietary, Clarity could use standards
4. **More Component Variety** - CopilotKit has 4 components, Clarity could have more
5. **Better Customization Docs** - Show how to customize, not just that you can
6. **Open Protocols** - Avoid proprietary protocols, use/create open standards
7. **Clearer State Management** - Bidirectional state is powerful but confusing
8. **Better Examples** - More production-quality examples and templates
9. **Migration Guides** - Help users migrate from other libraries
10. **Performance Focus** - Explicit performance docs and optimizations

**UNIQUE TO COPILOTKIT (Consider Carefully)**:

- AG-UI Protocol (proprietary but powerful)
- MCP Integration (niche but growing)
- Multi-agent coordination (complex, advanced)
- Predictive state updates (nice-to-have, not critical)

**DIFFERENTIATOR SUGGESTIONS**:

- Better docs from day one (avoid CopilotKit's gaps)
- Multi-framework support (not React-only)
- Standard protocols over proprietary (easier adoption)
- More component variety (full UI library)
- Simpler mental model (less concepts to learn)
- Better DX focus (easier than CopilotKit for basics)
