# RALPH MASTER PROMPT: Clarity AI Chat Components Enhancement

**Project**: @clarity-chat/react
**Goal**: Transform Clarity into the most comprehensive, production-ready AI chat component library
**Method**: Ralph Wiggum iterative loop with parallel subagent execution
**Completion Signal**: `<promise>CLARITY_ENHANCEMENT_COMPLETE</promise>`

---

## PHASE 0: TOOLING INVENTORY

### Available Plugins & Skills

**Core Development:**
- `superpowers:brainstorming` - Collaborative idea refinement
- `superpowers:writing-plans` - Implementation planning
- `superpowers:test-driven-development` - TDD workflow
- `superpowers:systematic-debugging` - Bug investigation
- `superpowers:dispatching-parallel-agents` - Parallel subagent coordination
- `superpowers:verification-before-completion` - Quality verification
- `superpowers:using-git-worktrees` - Isolated development

**Code Quality:**
- `code-review:code-review` - PR review
- `compound-engineering:review:*` - Multiple specialized reviewers
  - `kieran-rails-reviewer`, `kieran-python-reviewer`, `kieran-typescript-reviewer`
  - `security-sentinel` - Security audits
  - `performance-oracle` - Performance analysis
  - `architecture-strategist` - Architecture review
  - `code-simplicity-reviewer` - Simplification

**Frontend & UI:**
- `frontend-design:frontend-design` - Production-grade UI creation
- `frontend-developer:frontend-developer` - React/component implementation
- `ui-designer:ui-designer` - UI design
- `compound-engineering:design:figma-design-sync` - Design verification
- `compound-engineering:design:design-iterator` - Iterative refinement

**Documentation:**
- `codebase-documenter:codebase-documenter` - CLAUDE.md creation
- `compound-engineering:docs:ankane-readme-writer` - README writing

**Research:**
- `compound-engineering:research:framework-docs-researcher` - Documentation gathering
- `compound-engineering:research:best-practices-researcher` - Industry best practices
- `compound-engineering:research:repo-research-analyst` - Repository analysis

**AI Engineering:**
- `ai-engineer:ai-engineer` - AI feature implementation
- `ultrathink:ultrathink` - Complex problem solving with 4 specialist agents

### Available MCP Servers

**Browser Automation:**
- `chrome-devtools` - Chrome inspection, screenshots, console, network
- `playwright (pw)` - Browser automation, testing, screenshots

**Documentation:**
- `context7` - Library documentation lookup

### Available Subagent Types

- `Explore` - Codebase exploration
- `Plan` - Architecture planning
- `Bash` - Command execution
- `general-purpose` - Multi-step tasks
- `feature-dev:code-explorer` - Deep feature analysis
- `feature-dev:code-architect` - Architecture blueprints
- `feature-dev:code-reviewer` - Code review

---

## PHASE 1: COMPETITIVE AI COMPONENT INVENTORY

### Research Summary from 40+ Component Libraries

#### Tier 1: AI-Native Libraries

**assistant-ui** (https://www.assistant-ui.com/)
- Drop-in ChatGPT-style UX with theming
- Streaming message handling with interruptions/retries
- Multi-turn conversation support
- Optimized rendering, minimal bundle (~50KB core)
- LangChain/LangGraph/LangSmith integration
- Generative UI support

**AI SDK / AI Elements** (https://ai-sdk.dev/)
- `useChat` hook - Primary chat state management
- `useCompletion` - Single-turn completions
- `useObject` - Structured output streaming
- `useAssistant` - OpenAI Assistants API
- Tool calling with `tools` definition
- Multi-provider support (OpenAI, Anthropic, Google, etc.)
- Streaming utilities with `StreamingTextResponse`

**Prompt-Kit** (https://www.prompt-kit.com/)
- Message component, Chat Container, Avatar
- Prompt Input with suggestions
- Markdown component, Code Block with syntax highlighting
- Chain of Thought reasoning visualization
- Thinking Bar for processing indicators
- Tool component for function calling UI
- Source component for citations
- Text Shimmer for loading states
- CLI: `npx shadcn@latest add https://prompt-kit.com/c/[COMPONENT].json`

**Tambo** (https://docs.tambo.co/)
- Generative UI components (one-time renders)
- Interactable components (persistent, update by ID)
- `useTamboThread()` - Thread state management
- `useTamboThreadInput()` - Input management
- `useTamboRegistry()` - Dynamic component registration
- `useTamboStreamStatus()` - Streaming progress
- MCP server integration
- Multi-provider support

**LangUI** (https://www.langui.dev/)
- 60+ Tailwind components for GPT projects
- Prompt Message Inputs: Minimal, Rounded, Voice Input, Loading Indicator, Suggestions Panel
- Zero dependencies, copy & paste
- Dark/light mode support

**Thesys** (https://www.thesys.dev/)
- Interactive UI elements: Forms, Cards, Lists, Tables, Charts
- Tool call integration
- Dynamic agent response rendering
- Context-aware frontends for AI apps

#### Tier 2: AI Extensions to General Libraries

**HeroUI Pro** (https://www.heroui.pro/)
- Prompt Container Empty with suggestion cards
- Prompt Container With Conversation
- Prompt Container With Failed Messages
- Prompt Container With Regenerate Button
- Prompt Layout With Recent Messages
- File attachments, voice commands, templates picker

**Kendo React AIPrompt** (https://www.telerik.com/kendo-react-ui/)
- Real-time streaming responses
- AI service integration
- Voice input (Speech-to-Text)
- Custom suggestion lists
- WCAG 2.2 AA compliance
- Dialog-based or inline implementations

**ElevenLabs UI** (https://ui.elevenlabs.io/)
- Speech Input - real-time transcription
- Voice Button with waveform visualization
- Conversation Bar - voice + text input
- Live Waveform, Bar Visualizer
- Orb - 3D animated audio-reactive agent visualization
- Response - streaming markdown with character animation
- Audio Player, Voice Picker, Transcript Viewer

**Flowbite React** (https://flowbite-react.com/)
- LLM-optimized documentation endpoints
- `/llms.txt` for context-efficient prompting

#### Tier 3: Foundation Libraries

**shadcn/ui** (https://ui.shadcn.com/)
- 59 components (Accordion, Dialog, Command, etc.)
- Open code architecture - edit source directly
- AI-ready design for LLM modification
- Radix UI primitives foundation
- CLI: `npx shadcn@latest add [component]`
- 1110+ blocks via shadcnblocks.com

**Radix UI** (https://www.radix-ui.com/)
- Unstyled accessible primitives
- WAI-ARIA compliance
- Full keyboard navigation
- Focus management

**React Aria** (https://react-aria.adobe.com/)
- 50+ components with built-in behavior
- Internationalization support
- Drag-and-drop, multi-selection
- Form validation

**Mantine** (https://mantine.dev/)
- 120+ customizable components
- 70+ hooks
- Rich text editor, Spotlight command palette
- Notifications system

#### AI/LLM Patterns & Best Practices

From patterns.dev and competitive analysis:

**Chat Architecture:**
- Message-based state: `{ role, content }` array
- Separate logic from presentation
- System messages at conversation start

**Streaming:**
- Server-side: `stream: true`, `StreamingTextResponse`
- Incremental UI updates (typing effect)
- Typing indicators during streaming

**Input Handling:**
- Debounced input (300-500ms)
- Submission guarding (disable during streaming)
- Form-based with explicit submit

**Error Handling:**
- Server-side try/catch
- Client error state with retry
- Input validation before API calls

**Agentic Patterns:**
- Structured response handling
- Multi-step visualization
- Tool call display with progress

---

## PHASE 2: CLARITY CURRENT STATE AUDIT

### Existing Components (200+)

| Category | Count | Key Components |
|----------|-------|----------------|
| Chat | 11 | ClarityChat, ChatWindow, ChatInput, FloatingWidget |
| Message | 28 | Message, MessageList, StreamingMessage |
| Input | 6 | VoiceInput, FileUpload, AdvancedChatInput |
| Token | 7 | TokenCounter, TokenBudgetBar, TokenCostPreview |
| AI | 13 | ModelSelector, Citation, EnhancedCodeBlock |
| Prompt | 7 | PromptSuggestions, PromptLibrary, FollowUpSuggestions |
| Dashboard | 8 | AnalyticsDashboard, UsageDashboard |
| Feedback | 8 | ErrorBoundary, NetworkStatus, ThinkingIndicator |
| Navigation | 9 | CommandPalette, ContextMenu, KeyboardShortcuts |

### Existing Hooks (76+)

| Category | Count | Key Hooks |
|----------|-------|-----------|
| Chat | 14 | useClarityChat, useChatEnhanced, useChatWithTools |
| Streaming | 5 | useStreaming, useStreamingSSE, useStreamingWebSocket |
| UI | 18 | useAutoScroll, useClipboard, useDebounce |
| Token | 4 | useTokenBudgetMonitor, useTokenTracker |
| Resilience | 4 | useRetryWithBackoff, useCircuitBreaker |
| Performance | 5 | useSmartCache, useDeferredSearch |

### Critical Issues (from COMPONENT_LIBRARY_AUDIT.md)

1. **Module Resolution Failures** - Import `@clarity-chat/utils/logger` does not exist
2. **744 TypeScript `any` usages** - Weakens type safety
3. **14 chat-related hooks** - Confusing, unclear boundaries
4. **Message format confusion** - Two formats requiring conversion
5. **Bundle size** - 2.4MB internal bundle
6. **No CLI installer** - Manual npm + CSS + config

### Current Score: 3.52/5.0 (Acceptable with notable gaps)

---

## PHASE 3: GAP ANALYSIS - AI COMPONENTS TO ADD

### Priority 1: Core AI Chat Enhancements

| Component | Competitor Reference | Priority |
|-----------|---------------------|----------|
| `ChainOfThought` | Prompt-Kit | HIGH |
| `ReasoningVisualization` | Prompt-Kit | HIGH |
| `ThinkingBar` | Prompt-Kit | HIGH |
| `ToolExecutionCard` | assistant-ui, Tambo | HIGH |
| `SourceCitation` | Prompt-Kit | HIGH |
| `TextShimmer` | Prompt-Kit | MEDIUM |
| `StreamingProgress` | Tambo | HIGH |

### Priority 2: Voice & Multimodal

| Component | Competitor Reference | Priority |
|-----------|---------------------|----------|
| `SpeechInput` | ElevenLabs | MEDIUM |
| `VoiceButton` | ElevenLabs | MEDIUM |
| `ConversationBar` | ElevenLabs | MEDIUM |
| `LiveWaveform` | ElevenLabs | LOW |
| `AudioPlayer` | ElevenLabs | LOW |
| `TranscriptViewer` | ElevenLabs | LOW |

### Priority 3: Prompt Management

| Component | Competitor Reference | Priority |
|-----------|---------------------|----------|
| `PromptContainer` | HeroUI Pro | HIGH |
| `PromptTemplatesPicker` | HeroUI Pro | MEDIUM |
| `SuggestionCards` | HeroUI Pro | HIGH |
| `PromptInput` variants | LangUI | MEDIUM |

### Priority 4: Agent & Tool Calling

| Component | Competitor Reference | Priority |
|-----------|---------------------|----------|
| `AgentOrb` | ElevenLabs | LOW |
| `ToolCallProgress` | AG-UI | HIGH |
| `InteractableComponent` | Tambo | MEDIUM |
| `GenerativeUIContainer` | Tambo | HIGH |

### Priority 5: Hooks & Utilities

| Hook | Competitor Reference | Priority |
|------|---------------------|----------|
| `useStreamStatus` | Tambo | HIGH |
| `useThreadInput` | Tambo | HIGH |
| `useComponentRegistry` | Tambo | MEDIUM |
| `useToolExecution` | AG-UI | HIGH |
| `useAgentState` | AG-UI | HIGH |
| `useSpeechToText` | Kendo | MEDIUM |

---

## PHASE 4: IMPLEMENTATION PLAN

### Stage 1: Foundation Fixes (CRITICAL)

1. **Fix module resolution** - Create `@clarity-chat/utils/logger` export
2. **Consolidate hooks** - Reduce 14 chat hooks to 3 clear ones
3. **Unify message format** - Single `Message` type
4. **Fix 744 `any` usages** - Systematic typing
5. **Add CLI installer** - `npx clarity-chat add [component]`

### Stage 2: Core AI Components

1. **ChainOfThought** - Reasoning visualization
2. **ThinkingBar** - Processing indicator
3. **ToolExecutionCard** - Tool call display
4. **SourceCitation** - Reference attribution
5. **StreamingProgress** - Per-prop streaming status

### Stage 3: Prompt Management

1. **PromptContainer** - Full prompt input experience
2. **SuggestionCards** - Quick action cards
3. **PromptTemplatesPicker** - Template selection

### Stage 4: Voice & Multimodal

1. **SpeechInput** - Voice-to-text
2. **VoiceButton** - Recording with waveform
3. **AudioPlayer** - Playback controls

### Stage 5: Agent & Generative UI

1. **GenerativeUIContainer** - Dynamic component rendering
2. **ToolCallProgress** - Execution progress
3. **AgentStateVisualization** - Agent status display

---

## PHASE 5: DOCUMENTATION UPDATES

### Pages to Create/Update

1. `/learn/quick-start` - Update with new components
2. `/guides/ai-components` - NEW: AI-specific patterns
3. `/guides/tool-calling` - Enhanced with new ToolExecutionCard
4. `/guides/voice` - NEW: Voice input/output guide
5. `/guides/generative-ui` - NEW: Dynamic component rendering
6. `/reference/components/*` - Individual component docs

### Interactive Examples

1. Update Storybook with all new components
2. Add live playground demos
3. Create CodeSandbox templates

---

## PHASE 6: VERIFICATION CHECKLIST

### Code Quality
- [ ] All new components have TypeScript strict types
- [ ] No new `any` usages introduced
- [ ] Unit tests for all new components
- [ ] Integration tests for hooks
- [ ] Accessibility audit (WCAG AA)
- [ ] Bundle size within limits

### Documentation
- [ ] All new components documented
- [ ] Interactive examples working
- [ ] API reference complete
- [ ] Migration guide if breaking changes

### Production Readiness
- [ ] Error boundaries in place
- [ ] Loading states handled
- [ ] Empty states designed
- [ ] Keyboard navigation works
- [ ] Screen reader tested

---

## EXECUTION INSTRUCTIONS

### For Each Iteration

1. **Check current state**: Read `PROGRESS.md` to see what's done
2. **Pick next task**: Choose highest priority incomplete item
3. **Use appropriate tools**:
   - For exploration: `Task` with `subagent_type=Explore`
   - For implementation: `frontend-developer` agent
   - For review: `code-review` skill
   - For docs: `codebase-documenter` agent
   - For verification: `chrome-devtools` or `playwright` MCP

4. **Update progress**: Write to `PROGRESS.md`
5. **Commit work**: Git commit with descriptive message

### Completion Criteria

Output this when ALL phases complete:

```
<promise>CLARITY_ENHANCEMENT_COMPLETE</promise>
```

### Parallel Execution Strategy

Use `superpowers:dispatching-parallel-agents` to run these in parallel:
- Stage 2 components (independent of each other)
- Stage 3 components (independent of each other)
- Documentation updates (can parallel with implementation)

---

## PROGRESS TRACKING

Create/update `docs/ENHANCEMENT_PROGRESS.md` after each iteration:

```markdown
# Enhancement Progress

## Completed
- [ ] Phase 1: Research (DONE)
- [ ] Phase 2: Audit (DONE)
- [ ] Phase 3: Gap Analysis (DONE)
- [ ] Phase 4 Stage 1: Foundation Fixes
- [ ] Phase 4 Stage 2: Core AI Components
- [ ] Phase 4 Stage 3: Prompt Management
- [ ] Phase 4 Stage 4: Voice & Multimodal
- [ ] Phase 4 Stage 5: Agent & Generative UI
- [ ] Phase 5: Documentation
- [ ] Phase 6: Verification

## Current Focus
[Current task]

## Blockers
[Any issues]

## Next Steps
[What's next]
```

---

## REFERENCE: WEBSITES INDEXED

1. https://www.assistant-ui.com/
2. https://ai-sdk.dev/
3. https://www.prompt-kit.com/
4. https://docs.tambo.co/
5. https://www.langui.dev/
6. https://www.thesys.dev/
7. https://www.heroui.pro/
8. https://www.telerik.com/kendo-react-ui/aiprompt
9. https://ui.elevenlabs.io/
10. https://flowbite-react.com/
11. https://docs.ag-ui.com/
12. https://ui.shadcn.com/
13. https://www.shadcnblocks.com/
14. https://www.radix-ui.com/
15. https://react-aria.adobe.com/
16. https://mantine.dev/
17. https://www.patterns.dev/react/ai-ui-patterns/
18. https://magicui.design/
19. https://www.helicone.ai/
20. https://mui.com/
21. https://primereact.org/
22. https://ant.design/
23. https://chakra-ui.com/
24. https://once-ui.com/
25. https://flyonui.com/
26. https://reactbits.dev/
27. https://park-ui.com/
28. https://coreui.io/
29. https://floatui.com/
30. https://www.badtz-ui.com/
31. https://www.kibo-ui.com/
32. https://layouts.dev/
33. https://thefrontkit.com/
34. https://blocks.serp.co/
35. https://www.visily.ai/
36. https://c3.ai/
37. https://www.tooljet.com/
38. https://llamastack.github.io/
39. https://ui.full.dev/
40. https://www.relume.io/
41. https://www.untitledui.com/

---

**START EXECUTION NOW**

Read PROGRESS.md (create if doesn't exist), identify current phase, and begin work.
