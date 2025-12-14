# @clarity-chat/types

> **TypeScript type definitions** - Comprehensive, type-safe types for Clarity Chat

TypeScript type definitions for Clarity Chat - a comprehensive AI chat component library. Provides **89+ types** with full TypeScript support and strict type safety.

## ✨ Features

- 🎯 **89+ Types** - Comprehensive type coverage
- 🔒 **Strict Type Safety** - No implicit `any`, strict null checks
- 📦 **Framework Agnostic** - Works with any TypeScript project
- 🚀 **Tree Shakeable** - Import only what you need
- 📚 **Well Documented** - JSDoc comments on all types

## 📦 Installation

```bash
npm install @clarity-chat/types
# or
pnpm add @clarity-chat/types
# or
yarn add @clarity-chat/types
```

## 🚀 Quick Start

> 📖 **New to Clarity?** Check the [Getting Started Guide](../../docs/getting-started.md) or browse the [Cookbook](../../docs/cookbook/) for copy-paste ready patterns.

### Basic Usage

```typescript
import type { Message, Chat, User, Context, Project } from '@clarity-chat/types'
import type { MemoryItem, ContextType } from '@clarity-chat/types'

// Use in your components
function ChatComponent({ messages }: { messages: Message[] }) {
  // TypeScript knows the structure of Message
  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
```

## 📖 Type Categories

### Core Types

**Message** - Chat message types with attachments, metadata, and feedback
```typescript
import type { Message, MessageRole, MessageStatus } from '@clarity-chat/types'

const message: Message = {
  id: 'msg-123',
  chatId: 'chat-456',
  role: 'user',
  content: 'Hello!',
  createdAt: Date.now(),
  status: 'sent',
}
```

**Chat** - Chat conversation types with history and filtering
```typescript
import type { Chat, ChatStatus } from '@clarity-chat/types'
```

**User** - User authentication and profile types
```typescript
import type { User, UserRole } from '@clarity-chat/types'
```

**Project** - Project management types with context and knowledge bases
```typescript
import type { Project, ProjectSettings } from '@clarity-chat/types'
```

### Advanced Features

**Memory** - Hybrid memory architecture types (episodic, semantic, short-term, long-term)
```typescript
import type { MemoryItem, MemoryType, MemoryStrategy } from '@clarity-chat/types'
```

**Context** - Context management types for documents, images, links, etc.
```typescript
import type { Context, ContextType, ContextItem } from '@clarity-chat/types'
```

**Knowledge Base** - Knowledge base types with sections and references
```typescript
import type { KnowledgeBase, KnowledgeSection } from '@clarity-chat/types'
```

**Prompt** - Prompt library types with variables and templates
```typescript
import type { Prompt, PromptVariable } from '@clarity-chat/types'
```

### UI & Settings

**Theme** - Theme customization types with colors, spacing, typography
```typescript
import type { Theme, ThemeColors, ThemeConfig } from '@clarity-chat/types'
```

**Settings** - User settings types for AI personality, UI preferences, privacy
```typescript
import type { UserSettings, AIPersonality } from '@clarity-chat/types'
```

**Export** - Export functionality types for PDF, DOCX, Markdown, etc.
```typescript
import type { ExportFormat, ExportOptions } from '@clarity-chat/types'
```

### Status & Usage

**AI Status** - AI processing status and capabilities types
```typescript
import type { AIStatus, AICapabilities } from '@clarity-chat/types'
```

**Usage** - Usage metrics, billing, and limits types
```typescript
import type { UsageMetrics, BillingInfo, UsageLimits } from '@clarity-chat/types'
```

## Type Safety

All types are strictly typed with TypeScript's `strict` mode enabled, ensuring:
- No implicit `any` types
- Strict null checks
- Proper type inference
- Complete type coverage

## Package Structure

```
@clarity-chat/types/
├── dist/
│   ├── index.d.ts      # TypeScript declarations (CJS)
│   ├── index.d.mts     # TypeScript declarations (ESM)
│   ├── index.js        # CommonJS entry point
│   └── index.mjs       # ESM entry point
└── src/
    ├── message.ts      # Message types
    ├── chat.ts         # Chat types
    ├── user.ts         # User types
    ├── project.ts      # Project types
    ├── context.ts      # Context types
    ├── memory.ts       # Memory types
    ├── knowledge-base.ts # Knowledge base types
    ├── prompt.ts        # Prompt types
    ├── settings.ts      # Settings types
    ├── theme.ts         # Theme types
    ├── usage.ts         # Usage types
    ├── ai-status.ts     # AI status types
    ├── export.ts        # Export types
    └── index.ts         # Main export file
```

## Exported Types

This package exports **89 types** including:
- 20+ interfaces for core entities
- 15+ union/string literal types
- 50+ supporting interfaces and types

## 📚 Documentation

- [Getting Started Guide](../../docs/getting-started.md)
- [Cookbook](../../docs/cookbook/) - Copy-paste ready patterns
- [API Reference](../../docs/api-reference.md) - Complete API documentation
- [Type Examples](./examples/) - Usage examples

## 🔧 Requirements

- TypeScript 5.0+
- Node.js 20.0+

## 📄 License

MIT

## 🔗 Links

- [GitHub Repository](https://github.com/christireid/Clarity-ai-chat-components)
- [Documentation](../../apps/docs/)
- [Examples](../../examples/)
- [Storybook](http://localhost:6006)

## 🤝 Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

[Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
