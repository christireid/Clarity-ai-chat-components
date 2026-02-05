# Component Playground

An interactive playground for customizing and testing Clarity Chat components in real-time.

## Features

### 1. Component Selector
- Browse all available components organized by category
- Search and filter components
- View component descriptions and import paths
- Quick access to recently used components

### 2. Props Editor
- Dynamic form based on component prop definitions
- Support for multiple prop types:
  - String inputs
  - Number sliders with range controls
  - Boolean toggles
  - Select dropdowns
  - Color pickers
  - JSON editors
- Real-time validation
- Quick example presets
- Reset to defaults button

### 3. Live Preview
- Real-time component rendering
- Theme toggle (light/dark)
- Fullscreen mode
- Error boundary protection
- Loading states
- Component metadata display

### 4. Code Generation
- TypeScript and JavaScript support
- Component-only and full example modes
- Syntax highlighting
- Copy to clipboard
- Download as file
- Line and character counts

### 5. Configuration Management
- Export configuration as JSON
- Import saved configurations
- Share URL with embedded config
- Reset all settings
- Persistent state

## Usage

### Basic Workflow

1. **Select a Component**
   - Click the component selector dropdown
   - Browse by category or search
   - Select your desired component

2. **Customize Props**
   - Adjust props using the editor panel
   - Use quick example presets for common configurations
   - Reset individual props or all props at once

3. **Preview Changes**
   - View live updates in the preview panel
   - Toggle between light and dark themes
   - Use fullscreen mode for detailed inspection

4. **Export Code**
   - Switch between TypeScript and JavaScript
   - Choose component-only or full example
   - Copy to clipboard or download as file

### Sharing Configurations

Share your component configuration with others:

1. Click the **Share** button in the toolbar
2. URL is automatically copied to clipboard
3. Share the URL with teammates
4. Recipients see your exact configuration

### Saving Configurations

Export your configuration for later use:

1. Click **Export** in the toolbar
2. JSON file is downloaded
3. Later, click **Import** to restore the configuration

## Component Definitions

Components are defined in `/config/components.ts`:

```typescript
{
  id: 'ChatInput',
  name: 'Chat Input',
  category: 'Core',
  description: 'Multi-line chat input with voice, attachments, and mentions',
  importPath: '@clarity-chat/react',
  props: [
    {
      name: 'placeholder',
      type: 'string',
      default: 'Type a message...',
      description: 'Placeholder text for the input',
    },
    // ... more props
  ],
  examples: [
    {
      name: 'Minimal',
      description: 'Simple input without extra features',
      props: { variant: 'minimal', enableVoice: false },
    },
  ],
}
```

## Adding New Components

To add a new component to the playground:

1. Add definition to `/config/components.ts`
2. Create demo component in `/components/LivePreview.tsx`
3. Component automatically appears in selector

## Prop Types

### String
```typescript
{
  name: 'placeholder',
  type: 'string',
  default: 'Type here...',
  description: 'Input placeholder text',
}
```

### Number
```typescript
{
  name: 'maxLength',
  type: 'number',
  default: 1000,
  min: 100,
  max: 5000,
  step: 100,
  description: 'Maximum character count',
}
```

### Boolean
```typescript
{
  name: 'disabled',
  type: 'boolean',
  default: false,
  description: 'Disable the component',
}
```

### Select
```typescript
{
  name: 'variant',
  type: 'select',
  default: 'default',
  options: [
    { label: 'Default', value: 'default' },
    { label: 'Minimal', value: 'minimal' },
  ],
  description: 'Visual variant',
}
```

### Color
```typescript
{
  name: 'color',
  type: 'color',
  default: '#3b82f6',
  description: 'Primary color',
}
```

### JSON
```typescript
{
  name: 'config',
  type: 'json',
  default: { theme: 'light' },
  description: 'Configuration object',
}
```

## Code Generation

The code generator creates production-ready code:

### Component Only
```tsx
<ChatInput
  placeholder="Ask me anything..."
  maxLength={4000}
  enableVoice
/>
```

### Full Example
```tsx
import { ChatInput } from '@clarity-chat/react'
import type { ChatInputProps } from '@clarity-chat/react'

export function Example() {
  return (
    <div className="container mx-auto p-4">
      <ChatInput
        placeholder="Ask me anything..."
        maxLength={4000}
        enableVoice
      />
    </div>
  )
}
```

## URL Parameters

The playground supports URL-based configuration:

```
/playground?config=BASE64_ENCODED_JSON
```

Configuration format:
```json
{
  "component": "ChatInput",
  "props": {
    "placeholder": "Custom text",
    "maxLength": 5000
  },
  "showCode": true,
  "codeLanguage": "tsx",
  "theme": "dark"
}
```

## Keyboard Shortcuts

- `Cmd/Ctrl + K` - Focus component search
- `Cmd/Ctrl + /` - Toggle code view
- `Cmd/Ctrl + C` - Copy code
- `Cmd/Ctrl + S` - Export configuration
- `Cmd/Ctrl + R` - Reset props
- `F` - Toggle fullscreen preview

## Architecture

### File Structure
```
playground/
├── page.tsx                    # Main playground page
├── context/
│   └── PlaygroundContext.tsx  # State management
├── components/
│   ├── ComponentSelector.tsx  # Component dropdown
│   ├── PropsEditor.tsx        # Props form
│   ├── LivePreview.tsx        # Preview panel
│   ├── CodeDisplay.tsx        # Code viewer
│   └── PlaygroundToolbar.tsx  # Action buttons
├── config/
│   └── components.ts          # Component definitions
├── types/
│   └── index.ts              # TypeScript types
└── utils/
    └── codeGenerator.ts      # Code generation logic
```

### State Management

The playground uses React Context for state:

```typescript
interface PlaygroundState {
  selectedComponent: string
  props: Record<string, PropValue>
  showCode: boolean
  codeLanguage: 'tsx' | 'jsx'
  theme: 'light' | 'dark'
}
```

### Code Generation

The code generator supports multiple output formats:
- Component JSX/TSX
- Full example with imports
- Props interface (TypeScript)
- Usage examples

## Performance

The playground is optimized for performance:
- Lazy loading of components
- Debounced prop updates
- Memoized code generation
- Efficient re-renders with React Context
- Minimal bundle size impact

## Accessibility

All playground features are keyboard accessible:
- Dropdown navigation with arrow keys
- Tab navigation through props
- Screen reader announcements
- Focus management
- ARIA labels

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (with touch support)

## Future Enhancements

- [ ] Component comparison mode
- [ ] A/B testing layouts
- [ ] Performance profiling
- [ ] Component variants gallery
- [ ] Theme builder integration
- [ ] Collaborative editing
- [ ] Version history
- [ ] Component screenshots
- [ ] Accessibility checker
- [ ] Responsive preview modes
