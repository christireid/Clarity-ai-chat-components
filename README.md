<div align="center">

<br />

<img src="https://img.shields.io/badge/Clarity_Chat-4A90E2?style=for-the-badge&logo=react&logoColor=white" alt="Clarity Chat" />

<h1>Build Beautiful AI Chat Interfaces<br/>in Minutes, Not Months</h1>

<p><strong>The most complete, production-ready AI chat component library for React.</strong><br/>
249K+ lines of code. 155+ components. 70+ hooks. Trusted by developers worldwide.</p>

<p>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/stargazers"><img src="https://img.shields.io/github/stars/christireid/Clarity-ai-chat-components?style=social" alt="GitHub Stars" /></a>
  <a href="https://www.npmjs.com/package/@clarity-chat/react"><img src="https://img.shields.io/npm/dm/@clarity-chat/react?style=flat&color=4A90E2" alt="NPM Downloads" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/actions"><img src="https://img.shields.io/github/actions/workflow/status/christireid/Clarity-ai-chat-components/ci.yml?branch=main&label=CI&color=22C55E" alt="Build Status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
</p>

<p>
  <a href="#-quick-start" aria-label="Jump to Quick Start section"><strong>Quick Start</strong></a> •
  <a href="./docs/getting-started.md" aria-label="View full documentation"><strong>Documentation</strong></a> •
  <a href="./examples" aria-label="Browse code examples"><strong>Examples</strong></a> •
  <a href="https://discord.gg/clarity-chat" aria-label="Join Discord community"><strong>Discord</strong></a>
</p>

</div>

<br />
<br />

---

<br />

## ⚡ Quick Start

Get a production-ready AI chat interface running in **under 3 minutes**:

```bash
npm install @clarity-chat/react
```

```tsx
import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

**That's it.** You now have:

- ✅ Streaming responses with auto-reconnection
- ✅ Beautiful animations and dark mode
- ✅ Full keyboard navigation (try `Shift + ?`)
- ✅ WCAG AAA accessibility
- ✅ Mobile responsive design
- ✅ Error recovery with retry

### Enable Advanced Features with One Line

```tsx
// Add memory - conversations persist and context is injected automatically
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Add token optimization - reduce AI costs by 60-90%
<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Use a preset for common configurations
<ClarityChatApp api="/api/chat" preset="pro" />

// Enterprise preset - memory, tokens, safety, analytics all enabled
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

**Available presets:** `simple` | `pro` | `memory` | `rag` | `tools` | `enterprise`

<br />

---

<br />

## 💎 Why Clarity Chat?

<table>
<tr>
<td width="50%">

### **Without Clarity Chat**

- ⏱️ **Weeks** of development
- 🔧 **10+** dependencies to manage
- ♿ DIY accessibility compliance
- 🐛 Custom error handling
- 💰 Manual token optimization
- 📊 Build analytics from scratch

</td>
<td width="50%">

### **With Clarity Chat**

- ⚡ **Minutes** to production
- 📦 **1** tree-shakeable package
- ✨ WCAG AAA built-in
- 🛡️ Battle-tested recovery
- 💸 Automatic optimization (60-90% savings)
- 📈 7 analytics providers included

</td>
</tr>
</table>

<br />

---

<br />

## 🚀 What's Inside

<div align="center">

### **The Complete AI Chat Development Platform**

</div>

<table>
<tr>
<td width="33%" valign="top">

#### 🎨 **Components**

- **155+** React components
- **15** theme presets
- **150+** animations
- Virtual scrolling
- Drag & drop support

</td>
<td width="33%" valign="top">

#### ⚙️ **Hooks & Logic**

- **70+** custom hooks
- Streaming (SSE/WebSocket)
- Token optimization
- Error recovery
- Voice input

</td>
<td width="33%" valign="top">

#### 🤖 **Enterprise AI**

- Vector stores (4 providers)
- RAG pipeline
- Agent orchestration
- PII detection
- Multi-tenancy

</td>
</tr>
</table>

<br />

<div align="center">

**📊 249K+ Lines of Code** • **🧪 313 Tests (80%+ Coverage)** • **📚 47 Documentation Guides** •
**🎯 100% TypeScript**

</div>

<br />

---

<br />

## 🎯 Choose Your Path

<table>
<tr>
<td width="33%" valign="top">

### 🚀 **Quick Start**

_"I just want a chat UI"_

```tsx
<ClarityChatApp api="/api/chat" />
```

**You get:** Streaming, animations, accessibility, error recovery

</td>
<td width="33%" valign="top">

### 🧠 **With Memory**

_"I need conversation persistence"_

```tsx
<ClarityChatApp api="/api/chat" features={{ memory: true }} />
```

**You get:** + Context injection, sliding window, vector search

</td>
<td width="33%" valign="top">

### 🏢 **Enterprise**

_"I need everything"_

```tsx
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

**You get:** + Token optimization, safety, RAG, analytics, tools

</td>
</tr>
</table>

<br />

## 🔧 Key Features

### **💰 Token Optimization** → _Save 60-90% on AI costs_

```tsx
// Enabled with one flag - no setup required
;<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Access stats in your custom UI
const chat = useClarityChatApp({ api: '/api/chat', features: { tokenOptimization: true } })
console.log(chat.meta.token.totalTokens) // Real-time token tracking
console.log(chat.meta.token.budgetRemaining) // Budget monitoring
```

### **🛡️ Enterprise Security** → _OWASP LLM Top 10 2025 compliant_

```tsx
// Safety features enabled with enterprise preset
<ClarityChatApp api="/api/chat" preset="enterprise" />

// Or enable specific features
<ClarityChatApp
  api="/api/chat"
  features={{ safety: true }}
  config={{ safety: { piiRedaction: true, promptInjectionDetection: true } }}
/>
```

### **🎨 Beautiful Design System** → _15 themes, 150+ animations_

```tsx
import { ThemeProvider, ClarityChatApp } from '@clarity-chat/react'

<ThemeProvider theme="glassmorphism">  {/* ✨ Modern glass effect */}
<ThemeProvider theme="ocean">           {/* 🌊 Ocean vibes */}
<ThemeProvider theme="neon">            {/* 💜 Cyberpunk neon */}
  <ClarityChatApp api="/api/chat" />
</ThemeProvider>
```

### **⚡ Headless Mode** → _Full control, zero UI constraints_

```tsx
import { useClarityChatApp } from '@clarity-chat/react'

const chat = useClarityChatApp({ api: '/api/chat', preset: 'pro' })

// Full control over UI
<div>{chat.messages.map(m => <MyMessage key={m.id} message={m} />)}</div>
<input value={chat.input} onChange={chat.handleInputChange} />
<button onClick={chat.handleSubmit}>Send</button>

// Access metadata from all systems
chat.meta.token.totalTokens    // Token stats
chat.meta.memory.totalItems    // Memory stats
chat.meta.safety.riskLevel     // Safety stats
```

<br />

---

<br />

## 📦 Installation

<details>
<summary><strong>📋 Prerequisites</strong></summary>

- Node.js 20+
- React 18+ or 19+ (both supported)
- Modern browser (last 2 versions)

</details>

### Install the package

```bash
# npm
npm install @clarity-chat/react

# pnpm
pnpm add @clarity-chat/react

# yarn
yarn add @clarity-chat/react

# bun
bun add @clarity-chat/react
```

### Quick Patterns

<details>
<summary><strong>🧠 Chat with Memory</strong></summary>

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
;<ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="sliding-window" maxTokens={4000} />
```

</details>

<details>
<summary><strong>🏢 Enterprise Chat</strong></summary>

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
;<ClarityChatPresets.Enterprise api="/api/chat" enableRAG enableSafety enableAnalytics />
```

</details>

<details>
<summary><strong>🎨 Custom Theme</strong></summary>

```tsx
import { ThemeProvider, ClarityChat } from '@clarity-chat/react'
;<ThemeProvider theme="ocean">
  <ClarityChat api="/api/chat" />
</ThemeProvider>
```

</details>

<br />

---

<br />

## 🌟 Showcase

### **Production-Ready Examples**

<table>
<tr>
<td width="50%">

#### 🛍️ **Multi-Provider Chat**

AI-powered chat with OpenAI, Anthropic, Google support

[View Example →](./examples/multi-provider)

</td>
<td width="50%">

#### 💻 **Tool Calling Demo**

AI function calling with weather, search, calculator tools

[View Example →](./examples/tool-calling)

</td>
</tr>
<tr>
<td width="50%">

#### 🛡️ **Security Features**

Prompt injection detection, PII redaction, security policies

[View Example →](./examples/security-examples)

</td>
<td width="50%">

#### ⚡ **Advanced Features**

Battery-aware streaming, performance optimization, analytics

[View Example →](./examples/advanced-features)

</td>
</tr>
</table>

**[→ Browse All 12+ Example Apps](./examples)**

<br />

---

<br />

## 🏆 How We Compare

<table>
<thead>
<tr>
<th>Feature</th>
<th><strong>Clarity Chat</strong></th>
<th>Vercel AI SDK</th>
<th>Stream Chat</th>
<th>Sendbird</th>
</tr>
</thead>
<tbody>
<tr><td>Setup Time</td><td><strong>3 minutes</strong></td><td>~15 min</td><td>~30 min</td><td>~10 min</td></tr>
<tr><td>Components</td><td><strong>155+</strong></td><td>~20</td><td>~50</td><td>~40</td></tr>
<tr><td>React Hooks</td><td><strong>70+</strong></td><td>~5</td><td>~10</td><td>~8</td></tr>
<tr><td>Token Optimization</td><td><strong>✅ 60-90% savings</strong></td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Memory/Context</td><td><strong>Built-in</strong></td><td>Manual</td><td>Manual</td><td>Manual</td></tr>
<tr><td>RAG Pipeline</td><td><strong>✅</strong></td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Preset System</td><td><strong>6 presets</strong></td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Accessibility</td><td><strong>WCAG AAA</strong></td><td>Basic</td><td>WCAG AA</td><td>WCAG AA</td></tr>
<tr><td>Bundle Size (core)</td><td><strong>~30KB</strong></td><td>~15KB</td><td>~200KB</td><td>~150KB</td></tr>
<tr><td>License</td><td><strong>MIT</strong></td><td>MIT</td><td>Commercial</td><td>Commercial</td></tr>
</tbody>
</table>

<br />

---

<br />

## 📚 Documentation

<div align="center">

|               Getting Started                |                    Guides                    |                 API Reference                 |                 Examples                 |
| :------------------------------------------: | :------------------------------------------: | :-------------------------------------------: | :--------------------------------------: |
|   [Quick Start](./docs/getting-started.md)   |    [Architecture](./docs/architecture.md)    |    [React API](./packages/react/README.md)    |         [Browse All](./examples)         |
|  [Best Practices](./docs/best-practices.md)  |   [Token Optimization](./docs/cookbook.md)   | [Hooks](./packages/react/src/hooks/README.md) |   [Basic Chat](./examples/basic-chat)    |
| [Migration](./docs/migrating-from-vercel.md) | [Troubleshooting](./docs/TROUBLESHOOTING.md) | [Primitives](./packages/primitives/README.md) | [Advanced](./examples/advanced-features) |

</div>

<br />

---

<br />

## 💬 Community & Support

<div align="center">

**Join developers worldwide building with Clarity Chat**

<p>
  <a href="https://discord.gg/clarity-chat"><img src="https://img.shields.io/badge/Discord-Join%20Community-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/discussions"><img src="https://img.shields.io/badge/GitHub-Discussions-181717?style=for-the-badge&logo=github&logoColor=white" alt="Discussions" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components"><img src="https://img.shields.io/badge/GitHub-Star-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</p>

**[📧 Email Support](mailto:support@codeclarity.ai)** •
**[🐛 Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)** •
**[💡 Feature Requests](https://github.com/christireid/Clarity-ai-chat-components/discussions)**

</div>

<br />

---

<br />

## 🎯 Quick Stats

<div align="center">

<table>
<tr>
<td align="center"><strong>4,935</strong><br/>Files</td>
<td align="center"><strong>249K+</strong><br/>Lines of Code</td>
<td align="center"><strong>2,767</strong><br/>Commits</td>
<td align="center"><strong>80%+</strong><br/>Test Coverage</td>
<td align="center"><strong>100%</strong><br/>TypeScript</td>
<td align="center"><strong>~30KB</strong><br/>Core Bundle</td>
</tr>
</table>

</div>

<br />

---

<br />

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

**⚠️ Documentation Policy:** We maintain a clean repository structure. Please review our
[Documentation Policy](./.github/DOCUMENTATION_POLICY.md) before adding documentation files.

<br />

---

<br />

## 📄 License

MIT © 2024 [Code & Clarity](https://codeclarity.ai)

---

<br />

<div align="center">

**Built with ❤️ by developers, for developers**

<p>
  <a href="https://github.com/christireid/Clarity-ai-chat-components"><strong>⭐ Star on GitHub</strong></a> •
  <a href="./docs/getting-started.md"><strong>📚 Read the Docs</strong></a> •
  <a href="./examples"><strong>🎯 Browse Examples</strong></a> •
  <a href="https://discord.gg/clarity-chat"><strong>💬 Join Discord</strong></a>
</p>

<sub>Made with [React](https://react.dev) • [TypeScript](https://www.typescriptlang.org) •
[Tailwind CSS](https://tailwindcss.com) • [Framer Motion](https://www.framer.com/motion) •
[Radix UI](https://www.radix-ui.com)</sub>

</div>
