# Clarity Chat Documentation - Comprehensive Improvement Plan

## Research Synthesis from 20+ Documentation Sites

Based on deep analysis of leading documentation sites, this plan outlines specific improvements to
reach 100/100 quality score.

---

## Key Patterns Identified

### From AI SDK (Vercel)

- **llms.txt** - Documentation optimized for AI assistants
- **Framework-specific entry points** - Let users start with their stack
- **Three-layer architecture** - Core → UI → RSC
- **Status-driven UI** - `ready`, `submitted`, `streaming`, `error`
- **Start/delta/end protocol** - For rich streaming content

### From shadcn/ui & shadcn.io/ai

- **Copy-paste philosophy** - Users own the code
- **Registry-based distribution** - `npx shadcn add` pattern
- **Compound component pattern** - Composition over configuration
- **AI Elements** - 31+ AI-specific components

### From assistant-ui & CopilotKit

- **Primitive-first architecture** - Radix-style primitives
- **Three-tier customization** - CSS vars → Props → Headless
- **Context/scope system** - Automatic context inheritance
- **asChild prop** - Element replacement pattern

### From PrimeReact, KendoReact, Syncfusion

- **Pass Through (PT) API** - Access internal DOM structure
- **WCAG compliance tables** - Per-component accessibility
- **Props/Events/Methods tables** - Comprehensive API docs
- **Design token system** - Primitive → Semantic → Component

### From Google A2UI & AG-UI Protocol

- **Declarative UI generation** - Agents describe, don't code
- **Component catalog/registry** - Security through approved components
- **Adjacency list model** - Flat list with ID references for streaming
- **Event-based streaming** - ~16 standard event types

### From LibreChat, Stainless, C3.ai

- **Multi-provider support** - Consistent API across providers
- **Enterprise patterns** - RBAC, SSO, audit logging
- **Model-driven architecture** - Type system abstraction
- **MCP integration** - Universal tool protocol

### From Magic UI, Prompt Kit, LangUI

- **Animation documentation** - Variants, timing, easing
- **Component gallery** - Visual-first showcase
- **Zero dependencies** - Copy-paste ready HTML/JSX

---

## Immediate Improvements (Priority 1)

### 1. New AI Components

#### 1.1 MessageBranch Component

From shadcn.io/ai research - version navigation for regenerated messages:

```tsx
<MessageBranch currentIndex={2} totalVersions={3} onNavigate={(index) => setVersion(index)} />
```

#### 1.2 ToolApproval Component

From assistant-ui - human-in-the-loop approval:

```tsx
<ToolApproval
  tool={tool}
  status="approval_required"
  onApprove={() => executeTool()}
  onReject={() => cancelTool()}
/>
```

#### 1.3 GenerativeUI Component

From CopilotKit - render tool results as UI:

```tsx
<GenerativeUI
  toolName="weather"
  args={{ location: 'SF' }}
  render={({ status, args }) => <WeatherCard {...args} />}
/>
```

#### 1.4 PromptSuggestions Component

From Prompt Kit - suggested prompts:

```tsx
<PromptSuggestions
  suggestions={['Tell me about...', 'How do I...']}
  onSelect={(suggestion) => setInput(suggestion)}
/>
```

### 2. New Documentation Pages

#### Getting Started Enhancements

- `/get-started/providers` - Multi-provider setup guide
- `/get-started/frameworks` - Framework-specific guides (Next.js, Vite, CRA)

#### Reference Pages

- `/reference/components/message-branch` - Version navigation
- `/reference/components/tool-approval` - Approval patterns
- `/reference/components/generative-ui` - Tool UI rendering
- `/reference/components/prompt-suggestions` - Suggestion chips

#### Guides

- `/guides/providers` - OpenAI, Anthropic, Google, Custom setup
- `/guides/enterprise` - RBAC, SSO, audit logging
- `/guides/security` - Authentication, encryption, compliance
- `/guides/streaming-patterns` - Advanced streaming techniques

### 3. Registry-Based Distribution

Add shadcn-style component installation:

```bash
npx clarity-chat add message-branch
npx clarity-chat add tool-approval
npx clarity-chat add chain-of-thought
```

Create registry at `/api/registry/[component].json`

---

## Component Structure Standards

### Every Component Page Must Include:

1. **Overview Section**
   - What it does
   - When to use it
   - Visual preview

2. **Installation**
   - CLI: `npx clarity-chat add [component]`
   - Manual: Copy-paste code block

3. **Basic Usage**
   - Minimal working example
   - Framework tabs (Next.js App Router, Pages, Vite)

4. **Props Table** | Prop | Type | Default | Description | |------|------|---------|-------------|

5. **Events Table** | Event | Payload | Description | |-------|---------|-------------|

6. **Accessibility**
   - WCAG compliance level
   - Keyboard navigation table
   - Screen reader guidance
   - ARIA attributes

7. **Theming**
   - CSS variables
   - Pass Through (PT) API sections
   - Dark mode support

8. **Examples**
   - Basic → Streaming → Advanced progression
   - Copy-paste ready with imports

9. **Related Components**
   - Links to related components and hooks

---

## Pass Through (PT) API Documentation

### Standard PT Sections per Component

```tsx
<ClarityChat
  pt={{
    root: { className: 'my-chat-root', 'data-testid': 'chat' },
    header: { className: 'my-chat-header' },
    messageList: { className: 'my-messages' },
    message: { className: 'my-message' },
    composer: { className: 'my-composer' },
    input: { className: 'my-input' },
    sendButton: { className: 'my-send-btn' },
    footer: { className: 'my-footer' },
  }}
/>
```

### PT Section Reference Table

| Section     | Element             | Description          |
| ----------- | ------------------- | -------------------- |
| root        | `.clarity-chat`     | Root container       |
| header      | `.clarity-header`   | Header area          |
| messageList | `.clarity-messages` | Messages container   |
| message     | `.clarity-message`  | Individual message   |
| composer    | `.clarity-composer` | Input area container |
| input       | `.clarity-input`    | Text input element   |
| sendButton  | `.clarity-send`     | Send button          |
| footer      | `.clarity-footer`   | Footer area          |

---

## Accessibility Standards

### WCAG Compliance Table (Per Component)

| Standard     | Level | Status       |
| ------------ | ----- | ------------ |
| WCAG 2.2     | AA    | ✅ Compliant |
| Section 508  | -     | ✅ Compliant |
| WAI-ARIA 1.2 | -     | ✅ Compliant |

### Keyboard Navigation Table

| Key           | Action                             |
| ------------- | ---------------------------------- |
| Tab           | Move to next focusable element     |
| Shift+Tab     | Move to previous focusable element |
| Enter         | Submit message / Select option     |
| Escape        | Close dropdowns / Cancel action    |
| Arrow Up/Down | Navigate message history / options |
| Ctrl+Enter    | Submit (alternative)               |

### Screen Reader Announcements

| Event              | Announcement                    |
| ------------------ | ------------------------------- |
| Message sent       | "Message sent"                  |
| Response streaming | "Assistant is typing"           |
| Response complete  | "Assistant response: [content]" |
| Error              | "Error: [message]"              |

---

## Provider Setup Guides

### Consistent Structure per Provider

```markdown
## [Provider Name] Setup

### Prerequisites

- Account at [provider]
- API key with [permissions]

### Installation

\`\`\`bash npm install @clarity/[provider]-adapter \`\`\`

### Configuration

\`\`\`typescript import { createClarityChat } from '@clarity/react'; import { [provider]Adapter }
from '@clarity/[provider]-adapter';

const chat = createClarityChat({ adapter: [provider]Adapter({ apiKey:
process.env.[PROVIDER]\_API_KEY, }), }); \`\`\`

### Supported Models

| Model     | Context | Notes       |
| --------- | ------- | ----------- |
| [model-1] | 128k    | Recommended |
| [model-2] | 32k     | Faster      |

### Rate Limits

- Requests per minute: [X]
- Tokens per minute: [X]

### Error Handling

\`\`\`typescript try { await chat.send(message); } catch (error) { if (error.code === 'RATE_LIMIT')
{ // Handle rate limiting } } \`\`\`
```

---

## Enhanced llms.txt Structure

```markdown
# Clarity Chat Documentation

> Clarity Chat is a React component library for building AI chat interfaces. It provides 30+
> components, 15+ hooks, and supports all major AI providers.

## Quick Start

Install: `npm install @clarity/react`

Basic usage: \`\`\`tsx import { ClarityChat } from '@clarity/react';

function App() { return <ClarityChat apiKey={process.env.OPENAI_API_KEY} />; } \`\`\`

## Core Components

### ClarityChat

Main chat interface component.

- Props: apiKey, model, systemPrompt, onMessage, onError
- Streaming: Real-time token display
- Memory: Conversation persistence

### ChainOfThought

AI reasoning visualization.

- Auto-opens during streaming
- Auto-collapses when complete
- Shows duration and step count

### MessageBranch

Navigate between message versions.

- Props: currentIndex, totalVersions, onNavigate

## Core Hooks

### useClarityChat

Main hook for chat state management.

- Returns: messages, sendMessage, isStreaming, error

### useStreaming

Low-level streaming control.

- Returns: startStream, stopStream, streamStatus

## Providers

Supported: OpenAI, Anthropic, Google, Azure, Ollama, Custom

## MCP Tools

Available tools for AI assistants:

- clarity_add_component - Add a component to project
- clarity_get_docs - Fetch documentation
- clarity_search - Search documentation
```

---

## Implementation Checklist

### Phase 1: Components (This Session)

- [ ] Create MessageBranch component
- [ ] Create ToolApproval component
- [ ] Create GenerativeUI component
- [ ] Create PromptSuggestions component
- [ ] Create ModelSelector component

### Phase 2: Documentation Pages (This Session)

- [ ] /reference/components/message-branch
- [ ] /reference/components/tool-approval
- [ ] /reference/components/generative-ui
- [ ] /reference/components/prompt-suggestions
- [ ] /guides/providers (multi-provider setup)
- [ ] /guides/enterprise (RBAC, SSO, audit)
- [ ] /guides/streaming-patterns

### Phase 3: Infrastructure (This Session)

- [ ] Registry API endpoints
- [ ] Enhanced llms.txt
- [ ] PT API documentation
- [ ] WCAG compliance tables

### Phase 4: Verification

- [ ] Test all new pages
- [ ] Verify code examples
- [ ] Update quality score

---

## Expected Score Improvement

| Category        | Current    | After       | Change |
| --------------- | ---------- | ----------- | ------ |
| Coverage        | 24/25      | 25/25       | +1     |
| Accuracy        | 19/20      | 20/20       | +1     |
| Clarity         | 15/15      | 15/15       | -      |
| Examples        | 15/15      | 15/15       | -      |
| AI Optimization | 10/10      | 10/10       | -      |
| Accessibility   | 10/10      | 10/10       | -      |
| Navigation      | 5/5        | 5/5         | -      |
| **TOTAL**       | **98/100** | **100/100** | **+2** |

---

## Sources

- ai-sdk.dev (Vercel AI SDK)
- ui.shadcn.com & shadcn.io/ai
- www.assistant-ui.com
- docs.copilotkit.ai
- magicui.design
- prompt-kit.com
- langui.dev
- librechat.ai/docs
- stainless.com
- c3.ai
- primereact.org
- telerik.com/kendo-react-ui
- syncfusion.com
- ui.tambo.co
- github.com/google/A2UI
- docs.ag-ui.com
- patterns.dev
- puckeditor.com
