# CommandPalette Component - API Documentation

> **Component**: CommandPalette
> **Package**: @clarity-chat/react
> **Version**: 1.0.0
> **Last Updated**: January 28, 2026

Comprehensive API documentation for the CommandPalette component, including TypeScript interfaces, usage examples, testing guides, and migration information.

---

## Documentation Index

This documentation package includes the following files:

### 1. [CommandPalette.md](./CommandPalette.md)
**Main API Documentation** - Complete reference guide

- Overview and features
- Installation instructions
- TypeScript interfaces (CommandItem, AIContext, CommandPaletteProps)
- Detailed prop documentation
- Usage examples
- Event handlers
- Keyboard navigation
- Accessibility features
- Styling and customization
- Performance optimization
- Best practices
- Troubleshooting

**When to use**: Primary reference for understanding the component API.

---

### 2. [CommandPalette.d.ts](./CommandPalette.d.ts)
**TypeScript Definitions** - Complete type definitions

- CommandItem interface
- AIContext interface
- CommandPaletteProps interface
- Utility types (CommandId, CommandCategory, etc.)
- Type guards and helpers
- JSDoc comments with examples
- Constants and display names

**When to use**: TypeScript type checking, IDE autocomplete, and type safety.

---

### 3. [CommandPalette.openapi.yaml](./CommandPalette.openapi.yaml)
**OpenAPI Specification** - Machine-readable API spec

- Component schemas
- Request/response formats
- Type definitions
- Example payloads
- Error responses
- Validation rules

**When to use**: API tooling integration, documentation generation, SDK creation.

---

### 4. [CommandPalette.examples.tsx](./CommandPalette.examples.tsx)
**Code Examples** - 12 complete implementation examples

1. Basic Usage
2. With Categories and Icons
3. With AI Context
4. With Loading State
5. Dynamic Commands
6. Custom Styling
7. Error Handling
8. Navigation Integration
9. Toast Notifications
10. Custom Hook Pattern
11. Analytics Tracking
12. Full-Featured Example

**When to use**: Copy-paste examples for quick implementation.

---

### 5. [CommandPalette.test-guide.md](./CommandPalette.test-guide.md)
**Testing Guide** - Comprehensive testing documentation

- Test setup and configuration
- Unit tests (rendering, search, events)
- Integration tests (user flows)
- Accessibility tests (WCAG compliance)
- Keyboard navigation tests
- Performance tests
- Visual regression tests
- E2E tests with Playwright
- Coverage requirements
- CI/CD integration

**When to use**: Writing tests for components using CommandPalette.

---

### 6. [CommandPalette.changelog.md](./CommandPalette.changelog.md)
**Changelog & Migration Guide** - Version history and upgrades

- Current version features
- Version history
- Migration guides (0.8.x → 1.0.0)
- Breaking changes
- Deprecations
- Future roadmap
- Support policy

**When to use**: Upgrading from older versions or planning future updates.

---

## Quick Start

### Installation

```bash
pnpm add @clarity-chat/react framer-motion
```

### Basic Usage

```tsx
import { useState } from 'react'
import { CommandPalette, CommandItem } from '@clarity-chat/react'

function App() {
  const [open, setOpen] = useState(false)

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'New Chat',
      description: 'Start a new conversation',
      onSelect: () => console.log('New chat'),
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings',
      onSelect: () => console.log('Settings'),
    },
  ]

  return (
    <CommandPalette
      items={commands}
      open={open}
      onClose={() => setOpen(false)}
    />
  )
}
```

For more examples, see [CommandPalette.examples.tsx](./CommandPalette.examples.tsx).

---

## Key Features

### Accessibility
- WCAG 2.1 AA compliant
- Full keyboard navigation
- Screen reader support
- Focus management
- Reduced motion support

### Performance
- Debounced search (150ms)
- Memoized filtering
- Portal rendering
- Optimized animations
- Supports 100+ items

### Developer Experience
- Full TypeScript support
- Comprehensive documentation
- 12+ code examples
- Testing utilities
- Migration guides

### User Experience
- Smooth animations
- Category grouping
- Icon and shortcut display
- AI context footer
- Loading states

---

## Component Props Overview

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `CommandItem[]` | Array of command items to display |
| `open` | `boolean` | Whether the palette is open |
| `onClose` | `() => void` | Callback when palette should close |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'Type a command...'` | Search input placeholder |
| `className` | `string` | `undefined` | Additional CSS classes |
| `loading` | `boolean` | `false` | Show loading spinner |
| `aria-label` | `string` | `'Command palette'` | Accessible label |
| `aiContext` | `AIContext` | `undefined` | AI context information |

See [CommandPalette.md](./CommandPalette.md) for complete prop documentation.

---

## TypeScript Interfaces

### CommandItem

```typescript
interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  shortcut?: string[]
  category?: string
  onSelect: () => void | Promise<void>
}
```

### AIContext

```typescript
interface AIContext {
  modelName?: string
  conversationId?: string
  tokenUsage?: {
    input?: number
    output?: number
    total?: number
  }
  metadata?: Record<string, string | number>
}
```

See [CommandPalette.d.ts](./CommandPalette.d.ts) for complete type definitions.

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Cmd/Ctrl + K` | Open palette (implement externally) |
| `Escape` | Close palette |
| `ArrowDown` | Select next command |
| `ArrowUp` | Select previous command |
| `Home` | Select first command |
| `End` | Select last command |
| `Enter` | Execute selected command |
| `Tab` | Focus next element |

See [CommandPalette.md](./CommandPalette.md) for complete keyboard documentation.

---

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react'
import { CommandPalette } from '@clarity-chat/react'

it('renders commands', () => {
  const commands = [
    { id: '1', label: 'Test', onSelect: vi.fn() }
  ]

  render(
    <CommandPalette
      items={commands}
      open={true}
      onClose={vi.fn()}
    />
  )

  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

See [CommandPalette.test-guide.md](./CommandPalette.test-guide.md) for comprehensive testing documentation.

---

## Migration

### From 0.9.x to 1.0.0
No breaking changes. Fully backward compatible.

### From 0.8.x to 1.0.0
Breaking changes:
- `commands` → `items`
- `isOpen` → `open`
- `onDismiss` → `onClose`
- `CommandItem.title` → `CommandItem.label`
- `CommandItem.onClick` → `CommandItem.onSelect`

See [CommandPalette.changelog.md](./CommandPalette.changelog.md) for complete migration guide.

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 14+, Chrome Android latest

---

## Performance

- First Paint: <100ms
- Search Response: <200ms (150ms debounce + filtering)
- Render Time: ~16ms per frame (60fps)
- Memory: Minimal overhead

See [CommandPalette.md](./CommandPalette.md) for performance optimization tips.

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

- **Perceivable**: Color contrast ratios meet standards
- **Operable**: Full keyboard navigation support
- **Understandable**: Clear labels and instructions
- **Robust**: Proper ARIA markup for assistive technologies

### ARIA Patterns

- Combobox pattern for search input
- Listbox pattern for command results
- Live regions for screen reader announcements
- Proper focus management

See [CommandPalette.md](./CommandPalette.md) for complete accessibility documentation.

---

## Development Workflow

### Adding New Features

1. Read [CommandPalette.md](./CommandPalette.md) for API design patterns
2. Update [CommandPalette.d.ts](./CommandPalette.d.ts) with new types
3. Add examples to [CommandPalette.examples.tsx](./CommandPalette.examples.tsx)
4. Write tests following [CommandPalette.test-guide.md](./CommandPalette.test-guide.md)
5. Update [CommandPalette.changelog.md](./CommandPalette.changelog.md)
6. Update [CommandPalette.openapi.yaml](./CommandPalette.openapi.yaml) if needed

### Documentation Updates

Keep all files in sync:
- API changes → Update all files
- New examples → Add to examples file
- Bug fixes → Update changelog
- Breaking changes → Update migration guide

---

## Resources

### Internal Documentation
- [Main CLAUDE.md](../../../../apps/streamlined-docs/CLAUDE.md) - Repository guide
- [React Package Guide](../../CLAUDE.md) - Package-specific guide
- [Architecture Docs](../../../../docs/architecture.md) - System architecture

### External Links
- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Getting Help

### Documentation
1. Start with [CommandPalette.md](./CommandPalette.md) for API reference
2. Check [CommandPalette.examples.tsx](./CommandPalette.examples.tsx) for code examples
3. Review [CommandPalette.test-guide.md](./CommandPalette.test-guide.md) for testing

### Support
- **Bug Reports**: [GitHub Issues](https://github.com/your-org/clarity-ai-chat-components/issues)
- **Questions**: [GitHub Discussions](https://github.com/your-org/clarity-ai-chat-components/discussions)
- **Community**: [Discord](https://discord.gg/clarity-chat)

---

## File Structure

```
packages/react/docs/api/
├── CommandPalette.README.md         # This file (index)
├── CommandPalette.md                # Main API documentation
├── CommandPalette.d.ts              # TypeScript definitions
├── CommandPalette.openapi.yaml      # OpenAPI specification
├── CommandPalette.examples.tsx      # Code examples
├── CommandPalette.test-guide.md     # Testing guide
└── CommandPalette.changelog.md      # Changelog & migration
```

---

## Contributing

When contributing to CommandPalette documentation:

1. **Follow existing patterns**: Match the style and structure of existing docs
2. **Update all relevant files**: Keep documentation in sync
3. **Add examples**: Include practical code examples
4. **Write tests**: Add test cases for new features
5. **Update changelog**: Document all changes

---

## License

MIT License - Part of the Clarity AI Chat Components library.

---

## Version Information

- **Current Version**: 1.0.0
- **Release Date**: January 28, 2026
- **Status**: Stable
- **Support**: Active development

---

**Last Updated**: January 28, 2026
**Maintained by**: Clarity AI Chat Components Team
