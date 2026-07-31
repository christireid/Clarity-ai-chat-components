<div align="center">

<img src="https://img.shields.io/badge/Clarity_Chat-4A90E2?style=for-the-badge&logo=react&logoColor=white" alt="Clarity Chat" />

<h1>Clarity Chat Components</h1>

<p><strong>The React component library for building AI chat interfaces.</strong><br/>
330 components across 23 categories — streaming, reasoning, tools, artifacts, RAG,<br/>token budgets and agent panels — all wired up, themed, and ready to ship.</p>

<p>
  <a href="https://www.npmjs.com/package/@clarity-chat/react"><img src="https://img.shields.io/npm/v/@clarity-chat/react?style=flat&color=4A90E2&label=npm" alt="npm version" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/actions"><img src="https://img.shields.io/github/actions/workflow/status/christireid/Clarity-ai-chat-components/ci.yml?branch=main&label=CI&color=22C55E" alt="Build Status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
  <img src="https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?logo=react&logoColor=white" alt="React 18 and 19" />
  <img src="https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p>
  <a href="#-quick-start"><strong>Quick Start</strong></a> •
  <a href="#-see-it-in-action"><strong>See It Live</strong></a> •
  <a href="./docs/GALLERY.md"><strong>Full Gallery</strong></a> •
  <a href="./docs/getting-started.md"><strong>Docs</strong></a> •
  <a href="./examples"><strong>Examples</strong></a>
</p>

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/readme/overview-dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="./docs/assets/readme/overview-light.png" />
  <img src="./docs/assets/readme/overview-dark.png" alt="Clarity Chat component showcase — 330 components across 23 categories" width="100%" />
</picture>

<sub>☝️ The component showcase, running locally with <code>pnpm --filter
@clarity-chat/component-showcase dev</code></sub>

</div>

<br />

---

<br />

## ⚡ See It In Action

Every clip below is the real showcase app, recorded straight from the browser. No mockups.

<br />

### 💬 Ask a question, watch it stream

Markdown, syntax-highlighted code blocks, related-doc chips and a live cursor — all rendered token
by token as the response arrives.

<img src="./docs/assets/readme/streaming-chat.gif" alt="Streaming chat response with syntax-highlighted code" width="100%" />

<br />

### 🔬 Multi-step research with sources and MCP servers

Enriched source cards with credibility scoring, tool plugins, MCP server status and a
cross-referenced findings panel.

<img src="./docs/assets/readme/deep-research.gif" alt="Deep research assistant streaming enriched sources" width="100%" />

<br />

### 🧱 Artifacts with a live side panel

Ask for a component, get a versioned artifact: code view, live preview, diagrams, HTML rendering and
version history in a Claude-style side panel.

<img src="./docs/assets/readme/artifact-studio.gif" alt="Artifact Studio generating a React component into a side panel" width="100%" />

<br />

<table>
<tr>
<td width="50%" valign="top">

### 🧠 Reasoning you can see

Thinking indicators, chain-of-thought steps, agent panels, thinking blocks and reasoning trees.

<img src="./docs/assets/readme/ai-reasoning.gif" alt="AI reasoning components: chain of thought, agent panel, reasoning tree" width="100%" />

</td>
<td width="50%" valign="top">

### 🎨 Light and dark, everywhere

Every component ships both themes. One toggle, no flash, no half-styled corners.

<img src="./docs/assets/readme/theme-switch.gif" alt="Switching the entire component library between light and dark mode" width="100%" />

</td>
</tr>
</table>

<br />

### 🗺️ 23 categories, one sidebar away

<img src="./docs/assets/readme/component-tour.gif" alt="Touring the component categories: core chat, messages, reasoning, tools, dashboards, primitives" width="100%" />

<br />

### 🪞 Seven familiar interfaces, one component set

Claude, ChatGPT, Perplexity, Grok, Manus, Emergent and Lovable — each rebuilt from the same library.
If it can wear those faces, it can wear yours.

<img src="./docs/assets/readme/clones-tour.gif" alt="Cycling through seven AI interface clones rebuilt from Clarity Chat components" width="100%" />

<br />

<table>
<tr>
<td width="50%" valign="top">

**🛠️ Tool calling, end to end**

Tool cards, live execution, approval gates, confirmations, a registry and metrics.

<img src="./docs/assets/readme/tools-tour.gif" alt="Tool calling: cards, execution, approval, confirmation, registry and metrics" width="100%" />

</td>
<td width="50%" valign="top">

**📊 Five operational dashboards**

Token optimization, prompt library, conversation history, agent observability, SDK devtools.

<img src="./docs/assets/readme/dashboards-tour.gif" alt="Five operational dashboards for running AI in production" width="100%" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

**⌨️ Command palette**

Quick actions with keyboard shortcuts, wired into the chat shell.

<img src="./docs/assets/readme/command-palette.gif" alt="Command palette with keyboard shortcuts" width="100%" />

</td>
<td width="50%" valign="top">

**✍️ Streaming, token by token**

Real-time text generation with a live cursor and a stop control.

<img src="./docs/assets/readme/message-streaming.gif" alt="Streaming message component rendering text in real time" width="100%" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

**⏳ Loading states that fit AI**

Spinners, skeletons, shimmer, progress and AI-specific waiting states.

<img src="./docs/assets/readme/shimmer.gif" alt="Shimmer and skeleton loading placeholders" width="100%" />

</td>
<td width="50%" valign="top">

**🧬 The feature catalogue**

Workflows, forms, realtime status, streaming, provider adapters and more.

<img src="./docs/assets/readme/features-tour.gif" alt="Touring the feature component catalogue" width="100%" />

</td>
</tr>
</table>

<br />

<div align="center">

### 📸 [**See all 103 component views and 26 clips →**](./docs/GALLERY.md)

Every tab of every category, captured from the running showcase.

</div>

<br />

---

<br />

## 🚀 Quick Start

```bash
npm install @clarity-chat/react
```

**One component. Streaming chat, animations, dark mode, keyboard navigation, error recovery.**

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

**Turn on the heavy machinery with a preset:**

```tsx
// memory, token optimization, tools, RAG, safety and observability — all on
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

Presets: `simple` · `pro` · `memory` · `rag` · `tools` · `enterprise`

**Or flip individual features:**

```tsx
<ClarityChatApp api="/api/chat" features={{ memory: true, tokenOptimization: true }} />
```

**Want to own the layout?** Use the hook and render whatever you like:

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true, strategy: 'vector-store' },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
      header={{ show: true, title: 'AI Assistant', showMessageCount: true }}
      prompts={{ starterPrompts: [{ text: 'Tell me about React', category: 'technical' }] }}
    />
  )
}
```

📖 Full walkthrough: **[Getting Started](./docs/getting-started.md)** ·
**[API Reference](./docs/api-reference.md)** · **[Cookbook](./docs/cookbook.md)**

<br />

---

<br />

## 🖼️ The Component Gallery

<img src="./docs/assets/readme/component-grid.png" alt="Grid of Clarity Chat component categories" width="100%" />

<br />

### 💬 Core chat

The pieces you always need: `ChatWindow`, `ChatInput`, message lists, sidebars, expandable
containers, and every input variant.

<img src="./docs/assets/readme/core-chat.png" alt="Core chat components — ChatWindow with a streaming assistant reply" width="100%" />

<br />

### 🫧 Messages, bubbles and delivery states

Bubble variants, rich markdown with code, delivery status, grouping, actions and typing indicators.

<img src="./docs/assets/readme/messages-light.png" alt="Message bubble variants including rich markdown and code blocks" width="100%" />

<br />

<table>
<tr>
<td width="50%" valign="top">

**🧠 Chain of thought**

<img src="./docs/assets/readme/ai-reasoning.png" alt="Chain of thought reasoning visualization" width="100%" />

</td>
<td width="50%" valign="top">

**🤖 Agent orchestration**

<img src="./docs/assets/readme/agent-panel.png" alt="Agent panel showing active agents and tool usage" width="100%" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🛠️ Tool calling**

<img src="./docs/assets/readme/tools.png" alt="Tool cards with availability and approval states" width="100%" />

</td>
<td width="50%" valign="top">

**📊 Ops dashboards**

<img src="./docs/assets/readme/dashboards.png" alt="Token optimization dashboard with usage by model" width="100%" />

</td>
</tr>
<tr>
<td width="50%" valign="top">

**🪙 Token budgets**

<img src="./docs/assets/readme/token-budget.gif" alt="Live token counter tracking context usage" width="100%" />

</td>
<td width="50%" valign="top">

**📚 Citations and sources**

<img src="./docs/assets/readme/citations-tour.gif" alt="Citation chips, source cards, link previews and quote blocks" width="100%" />

</td>
</tr>
</table>

<br />

### 🪞 The Claude clone, up close

One of the seven recreations — sidebar, conversation history, model picker and message actions, all
standard components. [See the other six →](./docs/GALLERY.md#ai-interface-clones)

<img src="./docs/assets/readme/clones.png" alt="The Claude interface clone rebuilt from Clarity Chat components" width="100%" />

<br />

<details>
<summary><strong>🎁 More categories — primitives, input, search, media, code, loading states, themes</strong></summary>

<br />

**🧩 Primitives** — 25 base components on Radix UI and shadcn/ui, the foundation everything else is
built on.

<img src="./docs/assets/readme/primitives.png" alt="Primitive components: buttons, dialogs, dropdowns, popovers, tooltips, tabs" width="100%" />

<br />

**⌨️ Input** — voice, file upload, mentions, slash commands, structured input.

<img src="./docs/assets/readme/input-tour.gif" alt="Input variants: voice, file upload, mentions, rich text and shortcuts" width="100%" />

<br />

**🔍 Search** — semantic search, filters, result lists and highlighting.

<img src="./docs/assets/readme/search-tour.gif" alt="Search: filters, semantic search and history" width="100%" />

<br />

**📎 Media and files** — previews, galleries, attachments and document handling.

<img src="./docs/assets/readme/media-tour.gif" alt="Media: gallery, attachments, audio player and file viewer" width="100%" />

<br />

**💻 Code and data** — code blocks, diffs, tables, charts and structured output.

<img src="./docs/assets/readme/code-data-tour.gif" alt="Code blocks, diffs, terminal, data tables and test results" width="100%" />

<br />

**⏳ Loading states** — skeletons, shimmers, progress and streaming placeholders.

<img src="./docs/assets/readme/ai-states.gif" alt="AI-specific loading states" width="100%" />

<br />

**🎨 Theming** — switchers, palettes, presets and appearance settings.

<img src="./docs/assets/readme/theme-tour.gif" alt="Theme colors, presets and appearance settings" width="100%" />

<br />

**🔔 Feedback and status** — toasts, network status, error states and notifications.

<img src="./docs/assets/readme/feedback-tour.gif" alt="Network status, error states, feedback and notifications" width="100%" />

<br />

**💡 Suggestions** — follow-ups, prompt suggestions, quick replies and chips.

<img src="./docs/assets/readme/suggestions-tour.gif" alt="Follow-ups, prompt suggestions, quick replies and suggestion chips" width="100%" />

<br />

**🧭 Navigation** — conversation lists, history, breadcrumbs and quick nav.

<img src="./docs/assets/readme/navigation-tour.gif" alt="Conversations, history, breadcrumbs and quick nav" width="100%" />

<br />

**💬 Typing indicators** — the three dots, done properly.

<img src="./docs/assets/readme/typing-indicators.gif" alt="Typing indicator variants" width="100%" />

<br />

**🧠 Thinking indicators** — pulsing brain, progress bar and step-by-step status.

<img src="./docs/assets/readme/thinking-indicators.gif" alt="Thinking indicators showing AI reasoning in progress" width="100%" />

<br />

**🧩 Primitives** — 25 base components on Radix UI and shadcn/ui.

<img src="./docs/assets/readme/primitives.png" alt="Primitive components: buttons, dialogs, dropdowns, popovers, tooltips, tabs" width="100%" />

</details>

<br />

---

<br />

## 🏗️ Three Full Applications, Not Just Parts

The showcase ships three production-quality demos that wire the library end to end — model adapters,
RAG, MCP servers, tools and artifacts.

<img src="./docs/assets/readme/advanced-demos.png" alt="Three advanced demos: Library Learning Hub, Deep Research Assistant, Artifact Studio" width="100%" />

<table>
<tr>
<td width="33%" valign="top">

#### 🎓 Library Learning Hub

A RAG-powered tutor indexed over the component library. Ask about any component or hook, get an
answer with source citations and runnable code.

<img src="./docs/assets/readme/demo-library-hub.png" alt="Library Learning Hub answering a question with code" width="100%" />

</td>
<td width="33%" valign="top">

#### 🔬 Deep Research Assistant

Multi-step research with enriched sources, credibility scoring, MCP server plugins and exportable
research reports.

<img src="./docs/assets/readme/demo-deep-research.png" alt="Deep Research Assistant with source cards and MCP servers" width="100%" />

</td>
<td width="33%" valign="top">

#### 🧱 Artifact Studio

Claude-style artifact generation with a live preview panel, version history and export — code, docs,
diagrams and HTML.

<img src="./docs/assets/readme/demo-artifact-studio.png" alt="Artifact Studio with generated code in the side panel" width="100%" />

</td>
</tr>
</table>

**Run them yourself:**

```bash
pnpm install
pnpm build:packages
pnpm --filter @clarity-chat/component-showcase dev   # http://localhost:3100
```

The demos run against mock adapters out of the box — no API key needed to click around.

<br />

---

<br />

## 📦 What's In The Monorepo

| Package                                | What it does                                                        |
| -------------------------------------- | ------------------------------------------------------------------- |
| **`@clarity-chat/react`**              | The component library — chat, reasoning, tools, dashboards, hooks   |
| **`@clarity-chat/primitives`**         | Radix/shadcn base components and `cn()`                             |
| **`@clarity-chat/types`**              | Shared TypeScript types across every package                        |
| **`@clarity-chat/memory`**             | Conversation memory: sliding window, semantic chunks, vector stores |
| **`@clarity-chat/token-optimization`** | Token counting, budgets and prompt compression                      |
| **`@clarity-chat/ai-infrastructure`**  | Provider adapters, RAG pipeline, agent orchestration                |
| **`@clarity-chat/error-handling`**     | Error boundaries, retry and recovery                                |
| **`@clarity-chat/utils`**              | Shared helpers                                                      |
| **`@clarity-chat/testing-utils`**      | Test harnesses and fixtures for consumers                           |
| **`@clarity-chat/cli`**                | Scaffolding and project setup                                       |
| **`@clarity-chat/codemods`**           | Automated migrations between major versions                         |
| **`@clarity-chat/dev-tools`**          | Devtools panel and diagnostics                                      |
| **`@clarity-chat/playground`**         | Embeddable live playground                                          |
| **`@clarity-chat/license`**            | License validation                                                  |
| **`@clarity-chat/typescript-config`**  | Shared tsconfig presets                                             |

<br />

---

<br />

## 🎯 Why This Library

<table>
<tr>
<td width="50%" valign="top">

### Building it yourself

- Weeks of work before the first message renders
- Streaming, reconnection and cancellation from scratch
- Accessibility retrofitted late, if ever
- Markdown, code highlighting and copy buttons hand-rolled
- Token counting bolted on after the first surprise bill
- Reasoning, tool and citation UI invented per project

</td>
<td width="50%" valign="top">

### With Clarity Chat

- One import, one prop, a working chat
- Streaming with auto-reconnect and error recovery built in
- Keyboard navigation and ARIA baked into every component
- Rich markdown, syntax highlighting and message actions included
- Token budgets and optimization behind a feature flag
- Reasoning, tools, citations and artifacts as first-class components

</td>
</tr>
</table>

<br />

---

<br />

## 🧰 Feature Highlights

<table>
<tr>
<td width="33%" valign="top">

#### 🎨 UI

- 330 components, 23 categories
- Light and dark for everything
- Virtualized message lists
- Drag and drop, file previews
- Animation system with reduced-motion support

</td>
<td width="33%" valign="top">

#### ⚙️ Logic

- `useClarityChat` for full chat state
- SSE and WebSocket transports
- Memory: sliding window, semantic, vector
- Token counting and budget enforcement
- Retry, cancellation and error recovery

</td>
<td width="33%" valign="top">

#### 🏢 Platform

- Provider adapters (OpenAI, Anthropic, Google, Cohere)
- RAG pipeline and vector stores
- Agent orchestration and MCP servers
- PII detection and prompt-injection checks
- Analytics and observability hooks

</td>
</tr>
</table>

<br />

---

<br />

## 📚 Documentation

|                                                                        |                                    |
| ---------------------------------------------------------------------- | ---------------------------------- |
| 🚀 [Getting Started](./docs/getting-started.md)                        | Install, first chat, first deploy  |
| 🧭 [Choose Your Path](./docs/choose-your-path.md)                      | Which API level fits your project  |
| 📘 [API Reference](./docs/api-reference.md)                            | Every component, hook and type     |
| 🍳 [Cookbook](./docs/cookbook.md)                                      | Task-shaped recipes                |
| 🏛️ [Architecture](./docs/architecture.md)                              | How the packages fit together      |
| 🧠 [Agent Memory](./docs/agent-memory)                                 | Memory strategies and stores       |
| 🛠️ [Tool Calling](./docs/TOOL_CALLING.md)                              | Function calling and tool security |
| ▲ [Next.js Integration](./docs/frameworks/NEXTJS_INTEGRATION.md)       | App Router setup                   |
| 🎨 [Design System](./docs/design-system)                               | Tokens, theming and presets        |
| ♿ [Responsive Design](./docs/RESPONSIVE_DESIGN_GUIDE.md)              | Layout and breakpoints             |
| 🧪 [Testing](./TESTING.md)                                             | Running and writing tests          |
| 🔀 [Migration Guide](./docs/MIGRATION_GUIDE.md)                        | Upgrading between versions         |
| ❓ [FAQ](./docs/FAQ.md) · [Troubleshooting](./docs/TROUBLESHOOTING.md) | When something's off               |

<br />

---

<br />

## 💡 Examples

Runnable projects live in [`./examples`](./examples):

|                                                     |                                             |                                                   |
| --------------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| [Quickstart](./examples/quickstart)                 | [Basic Chat](./examples/basic-chat)         | [Streaming Chat](./examples/streaming-chat)       |
| [Multi-Provider](./examples/multi-provider)         | [Tool Calling](./examples/tool-calling)     | [Memory](./examples/memory-examples)              |
| [Token Optimization](./examples/token-optimization) | [Custom Theming](./examples/custom-theming) | [Headless Mode](./examples/headless-mode)         |
| [Accessibility](./examples/accessibility)           | [Security](./examples/security-examples)    | [Enterprise AI Ops](./examples/enterprise-ai-ops) |

<br />

---

<br />

## 🛠️ Development

```bash
pnpm install              # install the workspace
pnpm build:packages       # build every package
pnpm check                # typecheck + lint + test
pnpm storybook            # component workbench
pnpm docs                 # documentation site
```

Requires **Node 20+** and **pnpm 10+**. Contributions welcome — see
[CONTRIBUTING.md](./CONTRIBUTING.md) and the [quick reference](./CONTRIBUTING_QUICK_REFERENCE.md).

<br />

---

<br />

<div align="center">

### Built by [Code & Clarity](https://codeclarity.ai)

[MIT Licensed](./LICENSE) · [Security Policy](./SECURITY.md) ·
[Code of Conduct](./CODE_OF_CONDUCT.md) · [Changelog](./CHANGELOG.md)

<br />

**If this saved you a week, a ⭐ goes a long way.**

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/assets/readme/light-dark-split.png" />
  <img src="./docs/assets/readme/light-dark-split.png" alt="Clarity Chat in light and dark mode" width="100%" />
</picture>

</div>
