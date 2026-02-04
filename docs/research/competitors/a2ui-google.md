# A2UI (Agent-to-User Interface)

## Overview

- **Repository URL**: https://github.com/google/A2UI
- **Documentation URL**: https://a2ui.org/
- **GitHub stars**: 800+ (launched December 2025)
- **License**: Apache 2.0 (Open Source)
- **Maintained by**: Google (with contributions from CopilotKit and community)
- **Current Version**: v0.8 (Public Preview)
- **Platform**: Cross-platform protocol
- **Maintenance Status**: Active development

## Project Philosophy

A2UI is **not a component library** but rather an **open protocol and specification** for how AI
agents communicate UI to applications. It's Google's answer to how agents should "speak UI."

**Core Concept**:

> "A2UI enables AI agents to generate rich, interactive user interfaces that render natively across
> web, mobile, and desktop—without executing arbitrary code."

**Design Principles**:

- **Declarative Protocol**: JSON format describing UI intent
- **Security-First**: No code execution, only data
- **Cross-Platform**: Same JSON renders on web, mobile, desktop
- **LLM-Friendly**: Easy for AI models to generate
- **Real-Time Streaming**: Stream UI updates as they're generated
- **Component Catalog**: Clients provide trusted component libraries

## What A2UI Is

### A Protocol, Not a Library

**A2UI provides**:

1. **Specification**: JSON format for agent-generated UIs
2. **Reference Implementations**: Example renderers for various platforms
3. **Type Definitions**: TypeScript types for the protocol
4. **Documentation**: How to implement A2UI in your application

**A2UI does NOT provide**:

- Pre-built React components (you build these)
- A component library to npm install
- Ready-to-use chat interfaces
- Styling or theming

### How It Works

**Traditional Approach**:

```
Agent → Text Response → Developer Renders UI
```

**A2UI Approach**:

```
Agent → A2UI JSON → Client Renders from Trusted Catalog
```

**Example A2UI JSON**:

```json
{
  "version": "0.8",
  "components": [
    {
      "id": "msg-1",
      "type": "MessageBubble",
      "props": {
        "text": "Here are the search results",
        "role": "assistant"
      }
    },
    {
      "id": "results-1",
      "type": "SearchResults",
      "props": {
        "results": [
          { "title": "Result 1", "url": "..." },
          { "title": "Result 2", "url": "..." }
        ]
      }
    },
    {
      "id": "btn-1",
      "type": "Button",
      "props": {
        "label": "See More",
        "action": { "type": "agent-event", "event": "load-more" }
      }
    }
  ],
  "layout": {
    "type": "vertical",
    "children": ["msg-1", "results-1", "btn-1"]
  }
}
```

## Architecture

### Declarative JSON Format

**Core Structure**:

```typescript
interface A2UIDocument {
  version: string
  components: Component[]
  layout: Layout
  metadata?: Metadata
}

interface Component {
  id: string
  type: string // from client's component catalog
  props: Record<string, any>
  children?: string[] // IDs of child components
}

interface Layout {
  type: 'vertical' | 'horizontal' | 'grid' | 'custom'
  children: string[] // component IDs
}
```

### Component Catalog

**Client-Side Catalog**:

```typescript
// Your application provides the component catalog
const componentCatalog = {
  MessageBubble: MessageBubbleComponent,
  SearchResults: SearchResultsComponent,
  Button: ButtonComponent,
  Card: CardComponent,
  // ... your trusted components
};

// A2UI renderer uses your catalog
<A2UIRenderer
  document={a2uiJSON}
  catalog={componentCatalog}
/>
```

### Security Model

**Why A2UI is Secure**:

1. **Declarative Data**: JSON, not executable code
2. **Component Whitelist**: Agent can only request components from your catalog
3. **No Code Execution**: Agent cannot run arbitrary JavaScript
4. **Trusted Rendering**: Your components, your security rules
5. **Sandboxed Props**: Props are validated against component schemas

**Contrast with Code Generation**:

```javascript
// DANGEROUS: Agent generates and executes code
eval(agentGeneratedCode) // ❌ Security risk

// SAFE: Agent generates A2UI JSON
;<A2UIRenderer document={agentJSON} catalog={trustedComponents} /> // ✅ Secure
```

## Platform Implementations

### Web (React/Lit/Angular)

```tsx
import { A2UIRenderer } from '@a2ui/react'

function ChatInterface() {
  const [a2uiDocument, setA2UIDocument] = useState(null)

  const handleAgentResponse = async (response) => {
    // Agent returns A2UI JSON
    const json = await response.json()
    setA2UIDocument(json)
  }

  return <A2UIRenderer document={a2uiDocument} catalog={myComponentCatalog} />
}
```

### Mobile (Flutter/SwiftUI/Jetpack Compose)

**Same JSON, Different Renderer**:

```dart
// Flutter
A2UIRenderer(
  document: a2uiDocument,
  catalog: flutterComponentCatalog,
)
```

```swift
// SwiftUI
A2UIRenderer(
  document: a2uiDocument,
  catalog: swiftUIComponentCatalog
)
```

### Desktop (Electron/Tauri)

**Cross-Platform Rendering**:

- Same A2UI JSON from agent
- Platform-native component catalogs
- Consistent UX across platforms

## Integration Patterns

### With LLMs

**Prompt Engineering for A2UI**:

```typescript
const systemPrompt = `
You are an AI assistant that generates user interfaces using A2UI.

Available components:
- MessageBubble: Display text messages
  Props: { text: string, role: 'user' | 'assistant' }
- SearchResults: Display search results
  Props: { results: Array<{title: string, url: string}> }
- Button: Interactive button
  Props: { label: string, action: Action }

Generate A2UI JSON to respond to user requests.
`

const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Search for React tutorials' },
  ],
  response_format: { type: 'json_object' }, // A2UI JSON
})
```

### Streaming A2UI

**Real-Time UI Updates**:

```typescript
const stream = await fetch('/api/agent', {
  method: 'POST',
  body: JSON.stringify({ message: 'Show me charts' }),
})

const reader = stream.body.getReader()
let partialDocument = { components: [] }

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  // Incrementally update UI as JSON streams in
  const chunk = JSON.parse(decoder.decode(value))
  partialDocument = mergeA2UIChunks(partialDocument, chunk)

  // Re-render with updated document
  setA2UIDocument(partialDocument)
}
```

### With CopilotKit Integration

**A2UI + AG-UI**:

```typescript
import { A2UIRenderer } from '@a2ui/react';
import { CopilotKit } from '@copilotkit/react-core';

<CopilotKit>
  <A2UIRenderer
    document={a2uiDocument}
    catalog={componentCatalog}
    onAction={(action) => {
      // Handle agent actions
      if (action.type === 'agent-event') {
        copilotKit.sendEvent(action.event);
      }
    }}
  />
</CopilotKit>
```

## Strengths

### Security

1. **No Code Execution**: Declarative JSON, not code
2. **Component Whitelist**: Only trusted components
3. **Sandboxed**: Agent can't access arbitrary code
4. **Validated Props**: Type-safe component props
5. **No Injection Risks**: No eval() or dynamic imports

### Cross-Platform

1. **Platform Agnostic**: Same JSON everywhere
2. **Native Rendering**: Platform-native components
3. **Consistent UX**: Same interface across platforms
4. **Single Agent Logic**: Write once, render anywhere
5. **Framework Neutral**: Works with React, Vue, Flutter, SwiftUI, etc.

### LLM-Friendly

1. **Simple Structure**: Flat component list with IDs
2. **Easy to Generate**: LLMs can create valid A2UI
3. **Incremental**: Generate and correct mistakes easily
4. **Streamable**: Add components incrementally
5. **Type-Safe**: Schema-validated JSON

### Real-Time Updates

1. **Streaming**: Stream UI as it's generated
2. **Incremental Rendering**: Show UI building in real-time
3. **Progressive Enhancement**: Add details as they arrive
4. **Responsive**: Users see progress immediately

## Weaknesses

### Protocol Overhead

1. **Implementation Required**: You must build renderer
2. **Component Catalog**: Must define and maintain catalog
3. **Learning Curve**: New paradigm to learn
4. **Debugging**: Harder to debug than direct component usage
5. **Tooling**: Limited IDE support for A2UI JSON

### Limited Adoption

1. **New Protocol**: Launched December 2025
2. **Small Ecosystem**: Few pre-built implementations
3. **Beta Status**: v0.8, API may change
4. **Documentation**: Still being developed
5. **Examples**: Limited production examples

### Complexity

1. **Added Layer**: Extra abstraction between agent and UI
2. **Schema Management**: Must maintain component schemas
3. **Prompt Engineering**: LLMs must learn A2UI format
4. **Validation**: Need robust JSON validation
5. **Error Handling**: Agent can generate invalid A2UI

### Not a Component Library

1. **No Pre-Built Components**: You build everything
2. **No Styling**: No design system provided
3. **No Chat Components**: Must implement chat UI yourself
4. **Platform-Specific**: Need renderer for each platform
5. **Maintenance**: You maintain component implementations

## Component Comparison with Clarity

| Feature                  | A2UI                     | Clarity AI            |
| ------------------------ | ------------------------ | --------------------- |
| **Type**                 | Protocol/Spec            | Component Library     |
| **Pre-Built Components** | ❌ No                    | ✅ Yes                |
| **Distribution**         | Spec + reference impl    | npm install           |
| **Security Model**       | ✅ Declarative JSON      | ⚠️ React components   |
| **Cross-Platform**       | ✅ Web, Mobile, Desktop  | ⚠️ Web only           |
| **LLM Generation**       | ✅ Designed for LLMs     | ❌ Developer-built    |
| **Chat Components**      | ❌ You build             | ✅ Pre-built          |
| **Code Blocks**          | ❌ You build             | ✅ Shiki built-in     |
| **Streaming**            | ✅ Protocol support      | ✅ Component support  |
| **Styling**              | ❌ You decide            | ✅ Tailwind CSS       |
| **Learning Curve**       | ⚠️ Steep (new concept)   | ✅ Gentle             |
| **Implementation Time**  | ⚠️ High (build renderer) | ✅ Low (npm install)  |
| **Flexibility**          | ✅ Total control         | ✅ Props-based        |
| **Maintenance**          | ⚠️ You maintain all      | ✅ Library maintained |

## Strategic Insights for Clarity

### What to Learn From A2UI

1. **Security-First**: Declarative approach is inherently safer
   - **Action**: Document Clarity's security practices
   - **Action**: Consider A2UI integration layer for Clarity

2. **Cross-Platform Vision**: Think beyond web
   - **Action**: Design Clarity components with cross-platform in mind
   - **Action**: Consider React Native port in future

3. **LLM-Friendly**: Make it easy for LLMs to work with components
   - **Action**: Provide clear component schemas for LLMs
   - **Action**: Documentation in LLM-friendly format

4. **Streaming Architecture**: Built for real-time from ground up
   - **Action**: Ensure Clarity's streaming is first-class
   - **Action**: Incremental rendering support

5. **Component Catalog**: Well-defined component API
   - **Action**: Clear, documented component APIs in Clarity
   - **Action**: JSON schema for all component props

### What to Avoid

1. **Not a Library**: A2UI requires building everything
   - **Action**: Provide pre-built components in Clarity
   - **Action**: Developers want ready-to-use solutions

2. **Implementation Burden**: High barrier to entry
   - **Action**: Make Clarity easy to adopt (npm install & go)
   - **Action**: Minimize setup and configuration

3. **Complexity**: Extra abstraction layer
   - **Action**: Keep Clarity's API simple and direct
   - **Action**: Standard React patterns, not new protocols

4. **Limited Tooling**: Hard to debug A2UI JSON
   - **Action**: Excellent TypeScript support in Clarity
   - **Action**: Great error messages and DevTools

### Opportunities for Clarity

1. **Ready-to-Use**: A2UI requires building everything
   - **Opportunity**: Clarity provides components immediately
   - **Opportunity**: Minutes to working chat interface

2. **A2UI Renderer**: Could implement A2UI renderer
   - **Opportunity**: Clarity components as A2UI component catalog
   - **Opportunity**: Support both direct use and A2UI protocol

3. **Best of Both**: Direct React + A2UI support
   - **Opportunity**: Use Clarity directly OR via A2UI
   - **Opportunity**: Flexibility for different architectures

4. **Web-First**: A2UI requires platform-specific implementations
   - **Opportunity**: Clarity excels at web (primary platform)
   - **Opportunity**: Optimize for web developer experience

### Potential Integration

**Clarity + A2UI**:

```typescript
// Clarity could provide A2UI renderer
import { ClarityA2UIRenderer } from '@clarity/a2ui';
import * as ClarityComponents from '@clarity/react';

// Use Clarity components as A2UI catalog
<ClarityA2UIRenderer
  document={a2uiJSON}
  catalog={ClarityComponents}
/>

// Or use Clarity directly
import { ChatInterface } from '@clarity/react';

<ChatInterface messages={messages} />
```

## Use Cases

### When to Choose A2UI

1. **Cross-Platform**: Need web, mobile, and desktop
2. **Security Critical**: Agent-generated UIs must be sandboxed
3. **LLM-Generated UIs**: AI controls all UI decisions
4. **Custom Components**: Building unique component library
5. **Platform Consistency**: Same UI across all platforms
6. **Research**: Exploring agent-driven interfaces

### When to Choose Clarity

1. **Web Applications**: Building web-based AI chat
2. **Quick Development**: Need chat interface quickly
3. **Pre-Built Components**: Want ready-to-use components
4. **Traditional Chat**: Standard AI chat interactions
5. **Code Display**: Syntax highlighting and code blocks
6. **Production Apps**: Battle-tested components needed

### When to Use Both

**Hybrid Approach**:

- Implement A2UI renderer using Clarity components
- Get cross-platform support (A2UI) + pre-built components (Clarity)
- Clarity as component catalog for A2UI
- Best of both protocols and libraries

## Conclusion

A2UI is a **groundbreaking protocol** from Google that reimagines how AI agents generate user
interfaces. It's not a component library but rather a specification for secure, cross-platform,
agent-driven UI generation.

**Key Takeaways**:

1. **Protocol, Not Library**: Specification for agent-generated UIs
2. **Security-First**: Declarative JSON, no code execution
3. **Cross-Platform**: Same JSON renders everywhere
4. **LLM-Friendly**: Easy for AI models to generate
5. **Requires Implementation**: You build renderer and components

**For Clarity**: A2UI represents a different paradigm (protocol vs library) but validates the need
for secure, LLM-friendly, agent-driven interfaces. Clarity's opportunity is to:

- **Provide pre-built components** that A2UI requires building
- **Implement A2UI renderer** using Clarity components as catalog
- **Support both paradigms**: Direct React usage + A2UI protocol
- **Excel at web first**: Optimize for primary platform

A2UI and Clarity are complementary:

- A2UI defines how agents communicate UI
- Clarity provides the actual UI components
- Together, they enable secure, cross-platform, agent-driven interfaces

## Resources

- **GitHub Repository**: https://github.com/google/A2UI
- **Official Website**: https://a2ui.org/
- **Documentation**: https://a2ui.org/introduction/what-is-a2ui/
- **Specification**: Available on GitHub
- **NPM Package**: @zhama/a2ui (community implementation)
- **Google Blog**:
  https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/

## References

- [Google Introduces A2UI](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)
- [A2UI GitHub](https://github.com/google/A2UI)
- [What is A2UI?](https://a2ui.org/introduction/what-is-a2ui/)
- [Google Introduces A2UI (MarkTechPost)](https://www.marktechpost.com/2025/12/22/google-introduces-a2ui-agent-to-user-interface-an-open-sourc-protocol-for-agent-driven-interfaces/)
- [Build with Google's A2UI + AG-UI (CopilotKit)](https://www.copilotkit.ai/blog/build-with-googles-new-a2ui-spec-agent-user-interfaces-with-a2ui-ag-ui)
- [A2UI Components Explained (Medium)](https://medium.com/@visrow/a2ui-components-explained-building-agent-driven-user-interfaces-with-a-declarative-protocol-8f413167c1a9)
- [What is A2UI (Medium)](https://medium.com/@tahirbalarabe2/what-is-a2ui-agent-to-ui-e01da785fe26)
