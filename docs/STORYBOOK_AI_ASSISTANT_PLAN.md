# Storybook AI Assistant - Implementation Plan

## Overview

Implement a comprehensive AI assistant for the Clarity Chat Storybook to help users discover, understand, and implement components.

**Goal:** Create a public-facing Storybook with an integrated AI assistant that mirrors the documentation assistant's capabilities, customized for component exploration.

---

## Key Differences from Docs Assistant

### Documentation Assistant Focus
- Guides, tutorials, and concepts
- Text-heavy documentation
- Learning paths

### Storybook Assistant Focus
- Component discovery and exploration
- Interactive examples and props
- Visual component previews
- Code examples for specific variants
- Props/controls documentation

---

## Core Features to Port

### Phase 1: Foundation (Port existing features)

1. **Basic Chat Interface** ✅ (Use existing components)
   - ChatWindow from docs assistant
   - Streaming support
   - Message history

2. **RAG with Storybook Context**
   - Index Storybook stories as documentation
   - Index component props and metadata
   - Index story source code
   - Vector embeddings for semantic search

3. **Caching** ✅ (Use existing)
   - Response caching for repeated queries
   - Same Redis/Local dual-mode

4. **Feedback** ✅ (Use existing)
   - Thumbs up/down for responses
   - Track which component queries are most helpful

5. **Analytics** ✅ (Use existing)
   - Track popular components
   - Most searched features
   - User engagement

### Phase 2: Storybook-Specific Features

6. **Component-Aware Suggestions**
   - Suggest related components
   - Suggest similar variants
   - Suggest props to explore

7. **Interactive Component Preview**
   - Show component previews in chat
   - Link directly to stories
   - Deep links to specific args/controls

8. **Code Generation**
   - Generate code for specific configurations
   - Export current story args as code
   - Copy-paste ready implementations

9. **Props Explorer**
   - Natural language prop queries
   - "Show me all props for ChatWindow"
   - "What does the 'variant' prop do?"

10. **Visual Search**
    - "Show me components with badges"
    - "Find all button variants"
    - "Components that use icons"

---

## Implementation Strategy

### 1. Storybook Addon Structure

```
packages/storybook-ai-assistant/
├── src/
│   ├── addon/           # Storybook addon UI
│   │   ├── Panel.tsx    # AI chat panel
│   │   ├── Tab.tsx      # Optional tab view
│   │   └── Toolbar.tsx  # Quick access button
│   ├── manager/         # Storybook manager integration
│   │   └── register.tsx
│   ├── preview/         # Story decoration
│   │   └── decorator.tsx
│   └── lib/             # Shared utilities (from docs)
│       ├── ai/          # AI logic
│       ├── components/  # Chat UI components
│       └── utils/
├── preset.js
└── package.json
```

### 2. Data Sources for RAG

#### Story Metadata
```typescript
interface StoryMetadata {
  componentName: string
  storyName: string
  category: string
  props: Record<string, PropDef>
  source: string
  tags: string[]
  description?: string
}
```

#### Indexing Strategy
1. **Component Documentation**
   - Parse JSDoc comments
   - Extract prop types
   - Component descriptions

2. **Story Source Code**
   - Actual story implementations
   - Example usage patterns
   - Common configurations

3. **Args/Controls**
   - Default values
   - Accepted values
   - Control types

### 3. Query Understanding

#### Component Queries
```
User: "How do I use ChatWindow?"
→ Retrieve: ChatWindow stories, props, examples

User: "Show me button variants"
→ Retrieve: Button stories, variant prop, visual examples

User: "What icons are available?"
→ Retrieve: Icon stories, icon names, usage examples
```

#### Prop Queries
```
User: "What does the 'streaming' prop do?"
→ Retrieve: StreamingMessage props, streaming examples

User: "How do I customize colors?"
→ Retrieve: Theming docs, CSS variables, theme props
```

#### Comparison Queries
```
User: "Difference between ChatWindow and MessageList?"
→ Compare components, use cases, show examples
```

### 4. Response Format

#### Component Responses
```markdown
The ChatWindow component is the main container for chat interfaces.

**Key Props:**
- `messages`: Array of message objects
- `onSend`: Handler for sending messages
- `streaming`: Enable streaming mode

**Example:**
[Live Preview - ChatWindow/Default]

```tsx
<ChatWindow
  messages={messages}
  onSend={handleSend}
  streaming
/>
```

**Related:**
- MessageList for custom layouts
- StreamingMessage for AI responses
- [View in Storybook →](link)
```

### 5. UI Integration

#### Option A: Panel (Recommended)
- Dedicated panel in Storybook
- Always accessible
- Doesn't interfere with stories
- Can be docked/undocked

#### Option B: Floating Widget
- Floating chat bubble
- Collapsible
- Overlay mode for full chat

#### Option C: Dedicated Tab
- Full-screen AI assistant
- Side-by-side with docs

**Recommendation:** Panel + Floating Widget
- Panel for primary interface
- Widget for quick access

---

## Technical Implementation

### 1. Vector Store for Stories

```typescript
// Build index from stories
async function indexStories() {
  const stories = await loadAllStories()

  for (const story of stories) {
    const embedding = await generateEmbedding(
      `${story.componentName} ${story.storyName} ${story.description} ${formatProps(story.props)}`
    )

    await vectorStore.upsert({
      id: story.id,
      embedding,
      metadata: {
        component: story.componentName,
        story: story.storyName,
        source: story.source,
        props: story.props,
        category: story.category,
      }
    })
  }
}
```

### 2. Storybook API Integration

```typescript
import { useChannel, useStorybookApi } from '@storybook/manager-api'

function StorybookAssistant() {
  const api = useStorybookApi()

  const navigateToStory = (componentName: string, storyName: string) => {
    api.selectStory(componentName, storyName)
  }

  const getStoryArgs = (storyId: string) => {
    return api.getData(storyId).args
  }
}
```

### 3. Component Preview in Chat

```tsx
// Embed story preview in chat response
<div className="story-preview">
  <iframe src={`/iframe.html?id=${storyId}`} />
  <a href="#" onClick={() => navigateToStory(...)}>
    Open in Storybook →
  </a>
</div>
```

### 4. Code Generation

```typescript
function generateComponentCode(
  component: string,
  args: Record<string, any>
): string {
  const props = Object.entries(args)
    .map(([key, value]) => {
      if (typeof value === 'string') return `${key}="${value}"`
      if (typeof value === 'boolean') return value ? key : null
      return `${key}={${JSON.stringify(value)}}`
    })
    .filter(Boolean)
    .join('\n  ')

  return `<${component}\n  ${props}\n/>`
}
```

---

## Prompts for Storybook

### System Prompt
```typescript
export const STORYBOOK_SYSTEM_PROMPT = `You are the Clarity Chat Storybook Assistant, helping developers explore and use components.

## Your Role
Help developers discover components, understand props, and see examples. You have access to:
- All Storybook stories and examples
- Component props and types
- Interactive previews
- Source code

## Response Guidelines

### When User Asks About Components:
1. Explain what the component does
2. Show key props with types
3. Provide code example from a story
4. Link to live preview
5. Suggest related components

### When User Asks About Props:
1. Explain the prop purpose
2. Show accepted values/types
3. Provide example usage
4. Show stories that demonstrate it

### Format:
**Component:** [Name]
**Purpose:** [Brief description]

**Key Props:**
- \`propName\`: Type - Description

**Example:**
[Code block]

**See it in action:** [Story link]

**Related:** [Component links]

## Special Features
- Use [View Story →] links to navigate
- Include live preview embeds when helpful
- Show TypeScript types
- Suggest variants to explore
`
```

---

## Deployment Strategy

### 1. Storybook Build Configuration

```javascript
// .storybook/main.js
module.exports = {
  addons: [
    '@clarity-chat/storybook-ai-assistant',
  ],
  env: (config) => ({
    ...config,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    // etc.
  }),
}
```

### 2. Public Deployment

**Hosting:** Vercel/Netlify
**Build Command:** `npm run build-storybook`
**Environment:** Production with all AI features enabled

### 3. Security Considerations

- Rate limiting on API calls
- CORS configuration
- Analytics tracking
- Cost monitoring

---

## Migration Path

### Phase 1: Setup (Week 1)
- [ ] Create addon package structure
- [ ] Port core AI components
- [ ] Set up basic chat UI in Storybook panel

### Phase 2: RAG Implementation (Week 2)
- [ ] Story metadata extraction
- [ ] Vector store indexing
- [ ] Semantic search implementation
- [ ] Test with sample queries

### Phase 3: Storybook Integration (Week 3)
- [ ] Story navigation integration
- [ ] Component preview embeds
- [ ] Args/controls integration
- [ ] Code generation

### Phase 4: Enhanced Features (Week 4)
- [ ] Smart suggestions for components
- [ ] Visual component search
- [ ] Comparison queries
- [ ] Related component recommendations

### Phase 5: Polish & Deploy (Week 5)
- [ ] UI refinement
- [ ] Performance optimization
- [ ] Documentation
- [ ] Public deployment

---

## Success Metrics

### Engagement
- % of Storybook visitors using AI
- Average queries per session
- Return user rate

### Usefulness
- Positive feedback rate
- Successfully resolved queries
- Time to find components

### Discovery
- Components discovered via AI
- Props explored
- Stories viewed from AI suggestions

---

## Future Enhancements

1. **Visual Component Search**
   - Upload image, find similar components
   - Screenshot-based queries

2. **Design System Integration**
   - Token recommendations
   - Accessibility suggestions
   - Design pattern guidance

3. **Code Playground**
   - Edit props in chat
   - See live updates
   - Export to CodeSandbox

4. **Multi-Framework Support**
   - React, Vue, Svelte versions
   - Framework-specific examples

---

## Next Steps

1. Review and approve plan
2. Set up addon package
3. Begin Phase 1 implementation
4. Parallel work on:
   - Story indexing
   - UI integration
   - RAG customization

**Estimated Timeline:** 5 weeks to public launch
**Team:** 1-2 developers
**Dependencies:** Existing docs AI codebase (90% reusable)

---

**Status:** 📋 Planning Phase
**Last Updated:** 2025-11-17
