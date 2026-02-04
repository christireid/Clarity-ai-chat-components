# CLI Templates

Organized template system for code generation using Handlebars.

## Directory Structure

```
templates/
├── index.ts              # Main barrel export with TEMPLATES registry
├── helpers/
│   └── handlebars.ts     # Handlebars configuration and helper registration
├── components/
│   ├── basic.ts          # Basic React component templates
│   └── chat.ts           # Chat-specific component templates
├── hooks/
│   └── index.ts          # React hooks and context templates
├── adapters/
│   └── index.ts          # AI provider adapter templates
└── api/
    ├── routes.ts         # Next.js API route templates
    └── test.ts           # Generic test templates
```

## Organization Principles

### By Template Type

Templates are organized by their purpose:

- **components/** - React component templates (basic, chat-specific)
- **hooks/** - React hooks, custom hooks, and context providers
- **adapters/** - AI provider adapters with streaming support
- **api/** - Next.js API routes and generic tests
- **helpers/** - Handlebars configuration and helpers

### Naming Convention

Each template module exports named constants matching the template key:

```typescript
// components/basic.ts
export const component = `...`
export const componentTest = `...`
export const componentStory = `...`
```

These are re-exported through the main `index.ts` for backward compatibility.

## Template Context Variables

All templates have access to these Handlebars variables:

### Name Variations
- `{{name}}` - Original input name
- `{{pascalName}}` - PascalCase (ChatMessage)
- `{{camelName}}` - camelCase (chatMessage)
- `{{kebabName}}` - kebab-case (chat-message)

### Configuration
- `{{description}}` - Component/feature description
- `{{componentDir}}` - Component directory for Storybook
- `{{year}}` - Current year
- `{{author}}` - Git author name

### AI Provider Options
- `{{provider}}` - AI provider (openai, anthropic, google)
- `{{withStreaming}}` - Include streaming support
- `{{withMemory}}` - Include memory support

## Available Templates

### Component Templates

- `component` - Basic React component
- `componentIndex` - Component barrel export
- `componentTest` - Component test suite
- `componentStory` - Storybook story

### Chat Component Templates

- `chatComponent` - Chat component with streaming/memory
- `chatComponentIndex` - Chat component barrel export
- `chatComponentTest` - Chat component test suite
- `chatComponentStory` - Chat component Storybook story

### Hook Templates

- `hook` - Custom React hook
- `hookTest` - Hook test suite
- `context` - React Context provider with hook
- `contextTest` - Context provider test suite

### Adapter Templates

- `adapter` - AI provider adapter
- `adapterTest` - Adapter test suite

### API Templates

- `apiRoute` - Next.js API route with security
- `test` - Generic test template

## Usage

### Import Templates

```typescript
import { TEMPLATES, compileTemplate } from './templates/index.js'
```

### Compile a Template

```typescript
const code = compileTemplate('component', {
  pascalName: 'ChatMessage',
  camelName: 'chatMessage',
  kebabName: 'chat-message',
  description: 'A chat message component',
})
```

### Get Raw Template

```typescript
import { getTemplate } from './templates/index.js'

const templateString = getTemplate('component')
```

## Handlebars Helpers

Custom helpers are registered automatically:

- `pascalCase` - Convert to PascalCase
- `camelCase` - Convert to camelCase
- `kebabCase` - Convert to kebab-case
- `uppercase` - Convert to UPPERCASE
- `lowercase` - Convert to lowercase
- `eq` - Equality comparison
- `or` - Logical OR

### Example Usage

```handlebars
{{#if (eq provider "openai")}}
  import OpenAI from 'openai'
{{/if}}

{{pascalCase name}}Component
```

## Adding New Templates

1. Create a new file in the appropriate directory
2. Export template strings as named constants
3. Import and add to `TEMPLATES` registry in `index.ts`

Example:

```typescript
// templates/components/new.ts
export const newTemplate = `...template content...`

// templates/index.ts
import * as newTemplates from './components/new.js'

export const TEMPLATES = {
  // ... existing templates
  newTemplate: newTemplates.newTemplate,
}
```

## Benefits

### Maintainability
- **Single Responsibility**: Each file focuses on one type of template
- **Logical Grouping**: Related templates are co-located
- **Easy Navigation**: Clear directory structure

### Scalability
- **Simple to Extend**: Add new templates without bloating existing files
- **Type Safety**: TypeScript ensures template keys match
- **Modular**: Import only what you need

### Developer Experience
- **Better IDE Support**: Smaller files load faster
- **Clear Purpose**: File names indicate content
- **Organized Imports**: Clean barrel exports
