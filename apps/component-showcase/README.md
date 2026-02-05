# Clarity Chat Component Showcase

> Comprehensive showcase of all Clarity Chat components organized by category

## Overview

This application provides an interactive showcase of all components in the Clarity Chat library, including:

- Live component demos
- Interactive documentation viewer
- Code examples and snippets
- Best practices and usage guidelines
- Troubleshooting guides
- Props tables with type information

## Features

### 1. Interactive Documentation Viewer

The showcase includes a comprehensive documentation system with:

- **Props Tables**: Detailed prop definitions with types, descriptions, and default values
- **Code Examples**: Copy-paste ready code snippets for common use cases
- **Best Practices**: Guidelines for optimal component usage
- **Troubleshooting**: Solutions to common problems
- **Related Components**: Links to similar or complementary components
- **Search**: Fast, fuzzy search across all documentation

### 2. Component Categories

Components are organized by functionality:

- Core Chat
- Messages
- Input
- AI Reasoning
- Tools
- Search
- Token Management
- Code & Data
- Media Files
- Navigation
- Feedback & Status
- Suggestions
- Theme
- Loading States
- Citations
- Primitives

### 3. Documentation Features

#### Props Table
- Type information with syntax highlighting
- Required/optional indicators
- Default values
- Descriptions and examples
- Copy-to-clipboard functionality

#### Code Examples
- Multiple examples per component
- Syntax-highlighted code blocks
- Copy-to-clipboard
- Descriptive titles and explanations

#### Best Practices
- Do's and don'ts
- Performance tips
- Accessibility guidelines
- Common patterns

#### Troubleshooting Guide
- Problem/solution format
- Code snippets for fixes
- Common pitfalls

#### Search
- Fuzzy search across all docs
- Search by component name, category, or tag
- Keyboard shortcut (⌘K)
- Instant results

## Getting Started

### Installation

```bash
# Navigate to the showcase directory
cd apps/component-showcase

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The showcase will be available at `http://localhost:3100`

### Adding Documentation

To add documentation for a new component:

1. Open `/lib/component-docs-data.ts`
2. Add a new entry to `componentDocsDatabase`:

```typescript
{
  name: 'YourComponent',
  description: 'Brief description of what the component does',
  category: 'Component Category',
  tags: ['tag1', 'tag2'],
  props: [
    {
      name: 'propName',
      type: 'string',
      required: true,
      description: 'What this prop does'
    },
    // ... more props
  ],
  examples: [
    {
      title: 'Basic Usage',
      description: 'How to use the component',
      code: `import { YourComponent } from '@clarity-chat/react'

<YourComponent prop="value" />`
    },
    // ... more examples
  ],
  bestPractices: [
    'Always do this when using the component',
    'Avoid doing this',
    // ... more practices
  ],
  troubleshooting: [
    {
      problem: 'Component not rendering',
      solution: 'Check that you imported it correctly',
      code: `// Correct import
import { YourComponent } from '@clarity-chat/react'`
    },
    // ... more troubleshooting
  ],
  relatedComponents: ['RelatedComponent1', 'RelatedComponent2']
}
```

### Integrating Docs into Component Pages

You can add documentation viewers to any component demo page:

```tsx
import { DocumentationViewer } from '@/components/docs'
import { getComponentDocs } from '@/lib/component-docs-data'

function MyComponentPage() {
  const docs = getComponentDocs('MyComponent')

  return (
    <div>
      {/* Your demo */}
      <ComponentDemo />

      {/* Documentation */}
      {docs && <DocumentationViewer docs={docs} />}
    </div>
  )
}
```

See `/app/token-management/with-docs-page.tsx` for a complete example.

## File Structure

```
apps/component-showcase/
├── app/
│   ├── docs/                    # Documentation viewer page
│   │   └── page.tsx
│   ├── token-management/        # Example category pages
│   │   └── with-docs-page.tsx   # Example with docs integration
│   └── [category]/              # Other category pages
├── components/
│   ├── docs/                    # Documentation components
│   │   ├── DocumentationViewer.tsx
│   │   ├── DocumentationSearch.tsx
│   │   ├── PropsTable.tsx
│   │   ├── CodeExample.tsx
│   │   ├── BestPractices.tsx
│   │   ├── TroubleshootingGuide.tsx
│   │   └── RelatedComponents.tsx
│   └── component-section.tsx    # Layout components
├── lib/
│   ├── docs-parser.ts           # Documentation parsing utilities
│   └── component-docs-data.ts   # Documentation database
└── README.md
```

## Key Components

### DocumentationViewer
Main documentation display component with tabbed interface.

**Features:**
- Tabbed navigation (Overview, Props, Examples, Best Practices, Troubleshooting)
- Search within documentation
- Category badges
- External documentation links

### DocumentationSearch
Searchable component finder with keyboard shortcuts.

**Features:**
- Fuzzy search across all components
- Keyboard shortcut (⌘K)
- Category and tag filtering
- Instant results dropdown

### PropsTable
Interactive table displaying component props.

**Features:**
- Type information with formatting
- Required/optional indicators
- Default values
- Expandable complex types
- Copy prop names to clipboard

### CodeExample
Syntax-highlighted code blocks with copy functionality.

**Features:**
- Syntax highlighting
- Copy to clipboard
- Title and description
- Multiple examples per component

## Usage Examples

### Basic Documentation Page

```tsx
import { DocumentationViewer } from '@/components/docs'
import { getComponentDocs } from '@/lib/component-docs-data'

export default function Page() {
  const docs = getComponentDocs('TokenCounter')

  return (
    <div>
      {docs && <DocumentationViewer docs={docs} />}
    </div>
  )
}
```

### With Search

```tsx
import { DocumentationSearch, DocumentationViewer } from '@/components/docs'
import { getComponentDocs } from '@/lib/component-docs-data'

export default function Page() {
  const [selected, setSelected] = useState('TokenCounter')
  const docs = getComponentDocs(selected)

  return (
    <div>
      <DocumentationSearch onSelectComponent={setSelected} />
      {docs && <DocumentationViewer docs={docs} />}
    </div>
  )
}
```

### Side-by-Side Demo and Docs

```tsx
<div className="grid grid-cols-2 gap-6">
  <div>
    <h2>Live Demo</h2>
    <ComponentDemo />
  </div>
  <div>
    <h2>Documentation</h2>
    <DocumentationViewer docs={docs} />
  </div>
</div>
```

## Search Functionality

The documentation system includes powerful search capabilities:

- **Component Name Search**: Find components by name
- **Prop Search**: Search by prop names or types
- **Content Search**: Search in descriptions, examples, and guides
- **Category Filter**: Filter by component category
- **Tag Filter**: Filter by component tags
- **Keyboard Shortcut**: Press ⌘K (Mac) or Ctrl+K (Windows/Linux) to focus search

## Best Practices

### Documentation Writing

1. **Clear Descriptions**: Write concise, jargon-free descriptions
2. **Complete Props**: Document all props with types and descriptions
3. **Real Examples**: Provide copy-paste ready code examples
4. **Practical Tips**: Include best practices from real usage
5. **Common Issues**: Document solutions to frequently encountered problems

### Component Integration

1. **Progressive Enhancement**: Start with basic demos, add docs as needed
2. **Context-Aware**: Show documentation relevant to the current demo
3. **Searchable**: Make sure components are findable via search
4. **Linked**: Connect related components for easy navigation

## Development

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Building

```bash
pnpm build
```

## Contributing

When adding new components to the showcase:

1. Create demo page in appropriate category
2. Add documentation to `component-docs-data.ts`
3. Include code examples and best practices
4. Add troubleshooting guidance
5. Link related components
6. Test search functionality

## Links

- [Main Documentation](https://docs.clarity-chat.com)
- [Component API Reference](https://docs.clarity-chat.com/api)
- [GitHub Repository](https://github.com/clarity-chat/components)

## License

MIT License - see LICENSE file for details
