# Ant Design X - Competitive Analysis

**Research Date:** January 27, 2026 **Product URL:** https://x.ant.design/ **GitHub:**
https://github.com/ant-design/x **Status:** PRIMARY INSPIRATION TARGET - STRONG STRONG INFLUENCE

## Executive Summary

Ant Design X is an enterprise-grade React component library specifically designed for AI-driven
interfaces. It stands out with its **RICH interaction paradigm**, beautiful visual design,
exceptional API simplicity, and comprehensive SDK architecture. The library is structured as a
monorepo with three core packages: UI components, markdown renderer, and SDK utilities.

**Key Strengths:**

- Beautifully designed component system based on systematic AI UX principles
- Exceptionally simple and intuitive API design
- Comprehensive SDK architecture with multiple provider support
- Enterprise-grade component quality and TypeScript support
- Streaming-first approach to AI responses
- Atomic component design enabling maximum flexibility

---

## 1. Component Inventory

### Core Components (Full List)

#### **General Components**

- **Bubble** - Message bubble component with streaming support
  - Variants: `Bubble.List`, `Bubble.System`, `Bubble.Divider`
  - Supports streaming rendering, animations, editable content
  - Role-based rendering (ai, user, system, divider)

- **Conversations** - Multi-conversation management
  - Switch between multiple agents
  - Update conversation turns
  - Manage conversation history

#### **Awaken Stage** (RICH Paradigm)

- **Welcome** - Welcome component to reduce learning curve
  - Helps users understand AI capabilities quickly
  - Lowers entry barriers for new users

- **Prompts** - Predefined question/suggestion display
  - Context-aware recommendations
  - Quick-start templates

#### **Expression Stage**

- **Sender** - Input component with extensive customization
  - Slot-based architecture (header, footer, prefix, suffix)
  - Skill tags with close actions
  - Multiple operation methods
  - Support for pasting complex content (Excel text, etc.)

- **Attachments** - Input attachment component
  - File types: image, video, audio, document
  - Visual file preview and management

- **Suggestion** - Quick command suggestions
  - Contextual command recommendations

#### **Confirmation Stage**

- **Think** - Thinking process visualization
  - Display AI reasoning steps

- **ThoughtChain** - Chain of thought display
  - `ThoughtChain.Item` for individual thought steps
  - Multiple visual types for different statuses
  - Improved long-task execution visualization
  - Collapsible/expandable thought processes

#### **Feedback Stage**

- **Actions** - Action list component
  - Display available actions on AI responses

- **FileCard** - File attachment cards
  - Rich file preview and metadata

- **Sources** - Source citation component
  - Display references and citations

- **CodeHighlighter** - Code syntax highlighting
  - Multiple language support
  - Theme customization

- **Mermaid** - Diagram visualization
  - Built-in mermaid diagram support

#### **Configuration**

- **XProvider** - Global configuration provider
  - Theme configuration
  - Locale management
  - Provider settings

### Hooks & Utilities

- **useXChat** - Session data management
  - Returns: `{ messages, onRequest }`
  - Simple API for conversation state

- **useXAgent** (v1.x, migrated to SDK in v2.x) - Agent request handling
  - Manages AI request lifecycle

- **useXConversations** - Conversation list management
  - Create, delete, update sessions

- **XRequest** - API configuration utility
  - Easy model provider setup

---

## 2. Visual Design System

### Color System

Ant Design X inherits from Ant Design's comprehensive token system:

**Primary Color Tokens:**

- `--ant-color-primary` - Brand primary color
- `--ant-color-success` - Success states
- `--ant-color-error` - Error states
- `--ant-color-warning` - Warning states
- `--ant-color-info` - Info states

**Semantic Text Colors:**

- `--ant-color-text` - Primary text
- `--ant-color-text-heading` - Heading text
- `--ant-color-text-disabled` - Disabled text
- `--ant-color-text-placeholder` - Placeholder text

**Background Colors:**

- `--ant-color-bg-container` - Container backgrounds
- `--ant-color-bg-elevated` - Elevated surfaces
- `--ant-color-bg-container-disabled` - Disabled states

**Border Colors:**

- Border colors with hover and active states
- Consistent border treatment across components

### Typography System

**Font Family:**

```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji'
```

**Size Variants:**

- `sm` - Small text (compact displays)
- `base` - Base text (default)
- `lg` - Large text (emphasis)

**Line Height:**

- Systematic line-height with sm/base/lg options
- Optimized for readability

### Spacing System

**Padding Scale:**

- `xxs` - Extra extra small (2px typical)
- `xs` - Extra small (4px typical)
- `sm` - Small (8px typical)
- `md` - Medium (16px typical)

**Grid System:**

- Default 4px base grid
- Consistent increments across components
- Gap utilities for flex layouts

### Component Structure

**Border Radius:**

- `sm` - Small radius (2px)
- `md` - Medium radius (4px)
- `lg` - Large radius (8px)

**Elevation/Shadows:**

- `tertiary` - Subtle elevation
- `secondary` - Medium elevation
- Consistent depth hierarchy

**Size Variants (Universal):**

- `sm` - Small/compact
- Default - Standard size
- `lg` - Large/prominent

**State Variants:**

- Default
- Hover
- Active
- Focus (with focus-visible outlines)
- Disabled
- Error
- Warning
- Success
- Validating

### Layout Patterns

- **Flexbox-first** layout approach
- **Slot-based architecture** for maximum flexibility
- **Responsive** by default
- **RTL support** built-in
- **Dark theme** support via algorithm

---

## 3. API Simplicity Analysis

### Simple Use Case Example

```typescript
import { useXAgent, useXChat, Bubble, Sender } from '@ant-design/x';

// SIMPLE: Complete AI chat in ~15 lines
const ChatApp = () => {
  // 1. Create agent with request handler
  const [agent] = useXAgent({
    request: async (info, callbacks) => {
      // Your AI API call here
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify(info),
      });

      const data = await response.json();
      callbacks.onSuccess(data.message);
    },
  });

  // 2. Get chat state and handlers
  const { messages, onRequest } = useXChat({ agent });

  // 3. Map messages to bubble items
  const items = messages.map(({ message, id }) => ({
    key: id,
    content: message,
  }));

  // 4. Render UI
  return (
    <div>
      <Bubble.List items={items} />
      <Sender onSubmit={onRequest} />
    </div>
  );
};
```

### SDK Integration (Even Simpler)

```typescript
import { XRequest } from '@ant-design/x'

// ULTRA-SIMPLE: One config, ready to go
const { create } = XRequest({
  baseURL: 'https://api.openai.com/v1',
  dangerouslyApiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
})

// Built-in providers
import { OpenAIChatProvider, DeepSeekChatProvider } from '@ant-design/x'
```

### What They Avoid (Complexity Reduction)

**1. No Prop Explosion**

- Components have focused, minimal prop surfaces
- Smart defaults for common use cases
- Slot-based customization instead of 50+ props

**2. No State Management Boilerplate**

- `useXChat` handles all conversation state
- No need to manage message arrays manually
- Automatic streaming state management

**3. No Provider Configuration Hell**

- Built-in providers for common AI services
- Simple base configuration
- Standardized API across providers

**4. No Manual Streaming Logic**

- Automatic streaming detection
- Built-in loading states
- Smooth animations out of the box

### Props API Design Philosophy

**Principle 1: Role-Based Simplification**

```typescript
// Instead of: type="ai" | "user" | "system"
// They use: role="ai" | "user" | "system" | "divider"
// Automatically renders the right component variant
<Bubble.List items={[
  { role: 'user', content: 'Hello' },
  { role: 'ai', content: 'Hi there!' },
  { role: 'system', content: 'Connection established' },
  { role: 'divider' } // Auto-renders Bubble.Divider
]} />
```

**Principle 2: Slot-Based Customization**

```typescript
// Instead of: prefixIcon, suffixIcon, headerContent, footerContent props
// They use: Slots for maximum flexibility
<Sender
  header={<CustomHeader />}
  prefix={<CustomPrefix />}
  suffix={<CustomSuffix />}
  footer={<CustomFooter />}
  onSubmit={handleSubmit}
/>
```

**Principle 3: Context-Aware Defaults**

```typescript
// Components inherit from XProvider
<XProvider theme={theme} locale="en-US">
  {/* All children automatically get theme and locale */}
  <Bubble.List />
  <Sender />
</XProvider>
```

**Principle 4: Composition Over Configuration**

```typescript
// Instead of: bubble.header.show, bubble.footer.show, bubble.actions.enabled
// They use: Composable sub-components
<Bubble>
  <Bubble.Header>{header}</Bubble.Header>
  <Bubble.Content>{content}</Bubble.Content>
  <Bubble.Footer>{footer}</Bubble.Footer>
</Bubble>
```

---

## 4. SDK Architecture

### SDK Structure (v2.0 Monorepo)

```
@ant-design/x/              # UI Components
├── Bubble
├── Sender
├── Prompts
├── Welcome
├── Conversations
├── ThoughtChain
├── Attachments
└── ... (all UI components)

@ant-design/x-sdk/          # Data Flow Management
├── useXChat              # Session management
├── useXConversations     # Multi-session management
├── XRequest              # Request configuration
├── XStream               # Stream processing
├── Providers/
│   ├── DefaultChatProvider
│   ├── OpenAIChatProvider
│   ├── DeepSeekChatProvider
│   └── Custom providers
└── Types & Utilities

@ant-design/x-markdown/     # Markdown Renderer
├── Streaming support
├── LaTeX plugin
├── Mermaid plugin
├── Code highlighting
├── Custom component extension
└── Loading effect detection
```

### Integration Patterns

#### Pattern 1: Direct Provider Usage

```typescript
import { OpenAIChatProvider } from '@ant-design/x-sdk';
import { useXChat, Bubble, Sender } from '@ant-design/x';

const App = () => {
  const { messages, onRequest } = useXChat({
    provider: OpenAIChatProvider({
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4',
    }),
  });

  return (
    <>
      <Bubble.List items={messages} />
      <Sender onSubmit={onRequest} />
    </>
  );
};
```

#### Pattern 2: Custom Provider

```typescript
import { defineProvider } from '@ant-design/x-sdk'

const MyCustomProvider = defineProvider({
  request: async (messages, config) => {
    // Your custom AI service integration
    const response = await myAIService.chat(messages)
    return response
  },

  stream: async function* (messages, config) {
    // Your streaming implementation
    const stream = await myAIService.chatStream(messages)
    for await (const chunk of stream) {
      yield chunk
    }
  },
})
```

#### Pattern 3: Multi-Model Support

```typescript
import { OpenAIChatProvider, DeepSeekChatProvider } from '@ant-design/x-sdk'
import { useXConversations } from '@ant-design/x-sdk'

const App = () => {
  const { conversations, createConversation } = useXConversations({
    providers: {
      gpt4: OpenAIChatProvider({ model: 'gpt-4' }),
      deepseek: DeepSeekChatProvider({ model: 'deepseek-chat' }),
    },
  })

  // Switch between models seamlessly
  const handleNewChat = (providerKey) => {
    createConversation({ provider: providerKey })
  }
}
```

### Developer Experience Features

**1. Out-of-the-Box Model Integration**

- Pre-configured providers for major AI services
- OpenAI-compatible standard
- Easy custom provider creation

**2. Streaming-First Architecture**

- Automatic streaming detection
- Efficient data flow management
- Built-in backpressure handling

**3. Type Safety**

- 98.1% TypeScript codebase
- Complete type definitions
- IntelliSense everywhere

**4. Modular Design**

- Use only what you need
- Tree-shakeable packages
- Independent versioning

**5. Developer Tools**

- Rich error messages
- Debug utilities
- Performance monitoring

---

## 5. Component Composability

### Composition Philosophy

Ant Design X follows a **"Atomic Components + Composition"** philosophy:

1. **Atomic Building Blocks** - Each component does one thing well
2. **Flexible Composition** - Components compose naturally
3. **Smart Defaults** - Works great out of the box
4. **Customization Points** - Override when needed

### Real Composition Examples

#### Example 1: Message Bubble Composition

```typescript
// Simple: Auto-layout with roles
<Bubble.List items={[
  { role: 'user', content: 'Hello', avatar: userAvatar },
  { role: 'ai', content: 'Hi!', avatar: aiAvatar },
]} />

// Advanced: Custom composition
<Bubble.List
  items={messages.map(msg => ({
    key: msg.id,
    role: msg.role,
    avatar: <CustomAvatar user={msg.user} />,
    header: msg.timestamp && (
      <Bubble.Header>
        <span>{msg.user.name}</span>
        <time>{msg.timestamp}</time>
      </Bubble.Header>
    ),
    content: (
      <Bubble.Content>
        {msg.content}
        {msg.attachments && (
          <Attachments files={msg.attachments} />
        )}
      </Bubble.Content>
    ),
    footer: msg.sources && (
      <Bubble.Footer>
        <Sources items={msg.sources} />
      </Bubble.Footer>
    ),
  }))}
/>
```

#### Example 2: Sender Composition

```typescript
// Simple: Just input and submit
<Sender onSubmit={handleSubmit} />

// Advanced: Full customization with slots
<Sender
  header={
    <div>
      <Prompts suggestions={suggestions} />
      <SkillTags tags={selectedSkills} />
    </div>
  }
  prefix={<MicrophoneButton />}
  placeholder="Type your message..."
  suffix={
    <>
      <AttachButton />
      <EmojiButton />
    </>
  }
  footer={
    <div>
      <Attachments files={attachedFiles} />
      <CharacterCount current={text.length} max={4000} />
    </div>
  }
  onSubmit={handleSubmit}
/>
```

#### Example 3: ThoughtChain + Bubble Composition

```typescript
// Show AI reasoning process
<Bubble.List items={[
  {
    role: 'user',
    content: 'Explain quantum computing',
  },
  {
    role: 'ai',
    content: (
      <>
        <ThoughtChain>
          <ThoughtChain.Item status="done">
            Breaking down the concept
          </ThoughtChain.Item>
          <ThoughtChain.Item status="active">
            Gathering relevant information
          </ThoughtChain.Item>
          <ThoughtChain.Item status="pending">
            Composing explanation
          </ThoughtChain.Item>
        </ThoughtChain>

        {response && <div>{response}</div>}
      </>
    ),
    streaming: true,
  },
]} />
```

#### Example 4: Multi-Conversation Layout

```typescript
// Complete AI chat application structure
<div className="chat-layout">
  <aside>
    <Conversations
      items={conversations}
      activeId={activeConversationId}
      onSelect={setActiveConversationId}
      onCreate={handleCreateConversation}
    />
  </aside>

  <main>
    <Welcome show={!messages.length}>
      <Welcome.Title>Welcome to AI Chat</Welcome.Title>
      <Prompts items={starterPrompts} onSelect={handlePromptSelect} />
    </Welcome>

    <Bubble.List items={messages} />

    <Sender
      onSubmit={handleSubmit}
      suggestions={suggestions}
      attachments={attachments}
    />
  </main>

  <aside>
    <XProvider theme="dark">
      <Sources items={currentSources} />
      <Actions items={availableActions} />
    </XProvider>
  </aside>
</div>
```

### Flexibility Analysis

**High Flexibility Points:**

- Slot-based architecture allows any React node
- Context inheritance for global settings
- Composable sub-components (List, Item, Header, Footer, etc.)
- Custom provider support in SDK
- Markdown component extensibility

**Controlled Flexibility Points:**

- Consistent API patterns across components
- Standardized prop names (role, content, avatar, etc.)
- Guided composition through sub-components
- Smart defaults reduce configuration needs

**Flexibility vs Simplicity Balance:**

- **Score: 9/10** - Exceptional balance
- Simple by default (1-liner usage possible)
- Deep customization when needed (slot-based extension)
- No "middle complexity" - either dead simple or fully custom

---

## 6. Key Differentiators

### 1. RICH Interaction Paradigm (Systematic AI UX Theory)

**Unique Approach:** Ant Design X is the ONLY library with a complete, systematic theory of AI
interaction design.

**RICH Stages:**

- **R** - Awaken (Reveal capabilities)
- **I** - Express (Intent clarification)
- **C** - Confirm (Control and status)
- **H** - Feedback (Help trust and apply results)

**Why This Matters:**

- Not just random components, but a complete UX methodology
- Each component maps to specific user needs
- Guides developers to build better AI experiences
- Based on research from real AI products

### 2. Streaming-First Architecture

**Unlike competitors:**

- Built for streaming from the ground up
- Not "streaming support added", but "streaming by default"
- Automatic detection of streaming state
- Smooth animations during content arrival
- Backpressure handling in SDK

### 3. Enterprise-Grade SDK

**No other AI component library has:**

- Dedicated SDK package (@ant-design/x-sdk)
- Multiple provider support out of the box
- Standardized API across providers
- Data flow management utilities
- Custom provider framework

### 4. Markdown Renderer as First-Class Citizen

**@ant-design/x-markdown features:**

- Independent, high-performance package
- Streaming-friendly rendering
- LaTeX, Mermaid, code highlighting built-in
- Custom component extension
- Loading effect detection
- Open Marked hooks for customization

### 5. Monorepo Architecture

**Developer benefits:**

- Use only what you need
- Independent package versioning
- Mix and match packages
- Tree-shaking optimization
- Clearer separation of concerns

### 6. Atomic Component Philosophy

**Why it's better:**

- Maximum flexibility with minimum API surface
- Compose complex UIs from simple parts
- No "kitchen sink" components
- Easier to learn (one concept per component)
- Better tree-shaking

### 7. TypeScript-First Development

**98.1% TypeScript codebase:**

- Complete type definitions
- No "any" escapes
- IntelliSense everywhere
- Catch errors at compile time
- Self-documenting APIs

### 8. Theme System Integration

**Inherits from Ant Design:**

- Mature, battle-tested theming
- CSS variable-based
- Dark/light algorithms built-in
- Fine-grained customization
- Consistent with Ant Design ecosystem

### Why This Design Is Beautiful

**Visual Excellence:**

1. **Consistency** - Every component feels like part of a system
2. **Polish** - Smooth animations, perfect spacing, careful typography
3. **Clarity** - Clear visual hierarchy, easy to scan
4. **Professionalism** - Enterprise-ready aesthetics
5. **Attention to Detail** - States, transitions, edge cases all considered

**UX Excellence:**

1. **Thoughtful** - Every component solves a real user need
2. **Predictable** - Consistent patterns across components
3. **Accessible** - Focus states, keyboard nav, screen reader support
4. **Responsive** - Works on all screen sizes
5. **Internationalized** - RTL support, locale management

**DX Excellence:**

1. **Simple** - Easy to start, powerful when needed
2. **Typed** - Full TypeScript support
3. **Documented** - Clear examples and API docs
4. **Modular** - Use only what you need
5. **Extensible** - Customize anything

---

## 7. Comparison to Our Current Approach

### What We Should Adopt

1. **RICH Paradigm Structure**
   - Organize components by interaction stage
   - Clear mental model for developers
   - Better UX guidance

2. **API Simplicity**
   - Reduce prop count, increase slot usage
   - Smart defaults everywhere
   - Context-based configuration

3. **SDK Architecture**
   - Separate UI from data management
   - Provider pattern for AI services
   - Streaming-first design

4. **Monorepo Structure**
   - `@clarity/react` - UI components
   - `@clarity/sdk` - AI integration utilities
   - `@clarity/markdown` - Markdown renderer

5. **TypeScript Quality**
   - Zero "any" types
   - Complete type coverage
   - Self-documenting APIs

6. **Composition Patterns**
   - Atomic components
   - Sub-component variants (List, Item, Header, Footer)
   - Slot-based customization

### What We Do Better (Or Should Do Differently)

1. **Token Optimization Focus**
   - We have unique token optimization components
   - Ant Design X doesn't address token costs
   - Opportunity for differentiation

2. **Prompt Engineering Tools**
   - Our prompt optimization engine
   - Strategy routing system
   - Real-time prompt analysis

3. **Developer Tools**
   - Token usage visualization
   - Cost tracking
   - Performance monitoring

4. **Framework Agnostic**
   - Consider Vue, Svelte versions
   - Framework-independent core
   - Broader reach than React-only

### Gaps We Need to Fill

1. **No systematic interaction theory** (need RICH equivalent)
2. **Component composition is complex** (need slot-based approach)
3. **No SDK package** (need data management utilities)
4. **Markdown rendering is basic** (need streaming-friendly renderer)
5. **No provider pattern** (need standardized AI service integration)
6. **TypeScript coverage incomplete** (need 100% type safety)

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Immediate)

**1.1 Adopt RICH Paradigm**

- Document our own interaction stages
- Reorganize components by stage
- Create stage-based navigation

**1.2 API Simplification**

- Audit all component props
- Replace config objects with slots
- Implement context providers

**1.3 TypeScript Hardening**

- Remove all "any" types
- Add comprehensive type tests
- Export all types publicly

### Phase 2: Architecture (Next Sprint)

**2.1 Monorepo Split**

- Create `@clarity/react` package
- Create `@clarity/sdk` package
- Create `@clarity/markdown` package

**2.2 Provider Pattern**

- Implement base provider interface
- Add OpenAI provider
- Add Anthropic provider
- Add custom provider support

**2.3 Streaming Infrastructure**

- Rewrite with streaming-first mindset
- Add automatic streaming detection
- Implement backpressure handling

### Phase 3: Components (Following Sprints)

**3.1 Atomic Refactor**

- Break complex components into atoms
- Add sub-component variants
- Implement slot-based customization

**3.2 New Components**

- ThoughtChain equivalent (reasoning display)
- Welcome component
- Conversations list
- System message display

**3.3 Composition Utilities**

- Context providers
- Layout primitives
- Helper hooks

### Phase 4: Developer Experience (Ongoing)

**4.1 Documentation**

- API reference for every component
- Composition examples
- Migration guides

**4.2 Developer Tools**

- Debug utilities
- Performance monitoring
- Error messages

**4.3 Templates**

- Starter templates
- Example applications
- Integration guides

---

## 9. Key Takeaways

### API Design Lessons

1. **Simple by default, powerful when needed**
   - One-line usage for common cases
   - Deep customization through slots
   - No middle complexity

2. **Composition over configuration**
   - Atomic components that compose
   - Sub-components for variants
   - Slots instead of prop explosion

3. **Context over props**
   - Global settings via providers
   - Reduce prop drilling
   - Consistent configuration

4. **Types as documentation**
   - Self-documenting APIs
   - IntelliSense-driven development
   - Catch errors early

### Architecture Lessons

1. **Separate concerns cleanly**
   - UI components in one package
   - Data management in another
   - Utilities in a third

2. **Streaming is not optional**
   - Build for streaming from day one
   - Not a feature, but a foundation
   - Affects every design decision

3. **Providers, not hardcoded services**
   - Standardized interface
   - Multiple implementations
   - Custom extensions

4. **Monorepo for modularity**
   - Independent versioning
   - Clear dependencies
   - Tree-shaking benefits

### Design Lessons

1. **Systematic theory matters**
   - RICH paradigm guides everything
   - Not just components, but methodology
   - Helps developers build better UX

2. **Atomic components enable flexibility**
   - Small, focused components
   - Compose into complex UIs
   - Easy to learn, powerful to use

3. **Polish is not optional**
   - Animations matter
   - States matter
   - Edge cases matter

4. **Enterprise-grade from the start**
   - Accessibility
   - Internationalization
   - Theme customization
   - TypeScript support

---

## 10. Specific Components to Study Further

### High Priority

1. **Bubble.List** - Study streaming implementation, role-based rendering
2. **Sender** - Study slot-based architecture, skill tags
3. **ThoughtChain** - Study reasoning display, status visualization
4. **useXChat** - Study state management, API design
5. **XRequest** - Study provider pattern, configuration API

### Medium Priority

1. **Conversations** - Multi-session management
2. **Prompts** - Suggestion display patterns
3. **Welcome** - Onboarding UX patterns
4. **Attachments** - File handling UI
5. **XProvider** - Global configuration approach

### Low Priority (But Interesting)

1. **Sources** - Citation display
2. **FileCard** - File preview UI
3. **CodeHighlighter** - Syntax highlighting integration
4. **Mermaid** - Diagram rendering
5. **Notification** - System message display

---

## Sources

This research was compiled from the following sources:

- [Ant Design X Official Website](https://x.ant.design/)
- [Ant Design X GitHub Repository](https://github.com/ant-design/x)
- [Ant Design X Introduction](https://ant-design-x.antgroup.com/docs/react/introduce)
- [Ant Design X 2.0 Release Announcement](https://github.com/ant-design/x/issues/1357)
- [Ant Design X Components Overview](https://x.ant.design/components/overview/)
- [Bubble Component Documentation](https://x.ant.design/components/bubble/)
- [Sender Component Documentation](https://x.ant.design/components/sender/)
- [useXChat Hook Documentation](https://x.ant.design/components/use-x-chat/)
- [useXAgent Hook Documentation](https://x.ant.design/components/use-x-agent/)
- [ThoughtChain Component Documentation](https://x.ant.design/components/thought-chain/)
- [Attachments Component Documentation](https://x.ant.design/components/attachments/)
- [Prompts Component Documentation](https://x.ant.design/components/prompts/)
- [Welcome Component Documentation](https://x.ant.design/components/welcome/)
- [Conversations Component Documentation](https://x.ant.design/components/conversations/)
- [Ant Design Theme Customization](https://ant.design/docs/react/customize-theme/)
- [Ant Design X Introduction on StableLearn](https://stable-learn.com/en/ant-design-x-introduction/)
- [Ant Design X Changelog](https://x.ant.design/changelog/)

---

**Research Status:** COMPLETE **Next Action:** Share with team, plan adoption strategy **Confidence
Level:** HIGH - Comprehensive analysis based on official documentation and community resources
