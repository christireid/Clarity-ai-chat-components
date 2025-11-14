# @clarity-chat/types

TypeScript type definitions for Clarity Chat - a comprehensive AI chat component library.

## Installation

```bash
npm install @clarity-chat/types
# or
pnpm add @clarity-chat/types
# or
yarn add @clarity-chat/types
```

## Usage

```typescript
import type { Message, Chat, User, Context, Project } from '@clarity-chat/types';
import type { MemoryItem, ContextType } from '@clarity-chat/types';
```

## Type Categories

### Core Types
- **Message** - Chat message types with attachments, metadata, and feedback
- **Chat** - Chat conversation types with history and filtering
- **User** - User authentication and profile types
- **Project** - Project management types with context and knowledge bases

### Advanced Features
- **Memory** - Hybrid memory architecture types (episodic, semantic, short-term, long-term)
- **Context** - Context management types for documents, images, links, etc.
- **Knowledge Base** - Knowledge base types with sections and references
- **Prompt** - Prompt library types with variables and templates

### UI & Settings
- **Theme** - Theme customization types with colors, spacing, typography
- **Settings** - User settings types for AI personality, UI preferences, privacy
- **Export** - Export functionality types for PDF, DOCX, Markdown, etc.

### Status & Usage
- **AI Status** - AI processing status and capabilities types
- **Usage** - Usage metrics, billing, and limits types

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

## Requirements

- TypeScript 5.0+
- Node.js 20.0+

## License

MIT

## Repository

[GitHub Repository](https://github.com/christireid/Clarity-ai-chat-components)

## Support

[Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
