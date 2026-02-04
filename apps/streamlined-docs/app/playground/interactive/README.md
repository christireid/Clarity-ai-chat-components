# Interactive Component Playground

## Overview

A comprehensive interactive playground for testing and customizing Clarity AI Chat Components in real-time with live preview, prop controls, code export, and URL sharing.

## Features

### 1. Live Component Editor
- **Real-time Preview**: See changes instantly as you modify props
- **5 Demo Components**: Button, Card, Input, Badge, Chat Message
- **Interactive Controls**: Intuitive UI for adjusting component properties
- **Preset Configurations**: Quick-start templates for common use cases

### 2. Prop Controls
Each component includes configurable properties:
- **Text inputs**: For strings and content
- **Number inputs**: With min/max constraints
- **Boolean toggles**: For enable/disable states
- **Select dropdowns**: For variant/size options
- **Color pickers**: For color customization

### 3. Code Export
- **Copy to Clipboard**: One-click code copying
- **Download as File**: Export component code as `.tsx` file
- **Production-Ready**: Generated code follows best practices
- **Syntax Highlighting**: Clear, readable code display

### 4. Theme Switcher
- **Light/Dark Toggle**: Test components in both themes
- **Persistent State**: Theme preference maintained across sessions
- **Smooth Transitions**: Animated theme changes

### 5. Preset Configurations
Pre-built configurations for each component:
- **Primary Actions**: Standard button configurations
- **Card Variants**: Default, elevated, glass morphism
- **Message Types**: User and assistant messages
- **Status Badges**: Success, warning, error states

### 6. Share Playground URL
- **URL State Management**: Encode component state in URL
- **Shareable Links**: Share exact configurations with team
- **One-Click Copy**: Instant clipboard copy with feedback
- **Auto-Load**: URL params automatically restore state

### 7. View Modes
Three flexible viewing options:
- **Split View**: Controls + Preview + Code (default)
- **Preview Only**: Full-width component preview
- **Code Only**: Focus on generated code

## Components

### Button Component
```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `children`: string

**Presets:**
- Primary: Default primary action
- Secondary: Secondary actions
- Call to Action: Large prominent button

### Card Component
```tsx
<Card variant="default" padding="md" elevation="md">
  Card content
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'glass'
- `padding`: 'sm' | 'md' | 'lg'
- `elevation`: 'none' | 'sm' | 'md' | 'lg'
- `children`: string

**Presets:**
- Default Card: Standard container
- Glass Card: Modern glass morphism effect

### Input Component
```tsx
<Input placeholder="Enter text..." size="md" />
```

**Props:**
- `placeholder`: string
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean

**Presets:**
- Default Input: Standard text field
- Search Input: Optimized for search

### Badge Component
```tsx
<Badge variant="default" size="md">
  Badge
</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error'
- `size`: 'sm' | 'md' | 'lg'
- `children`: string

**Presets:**
- Status Badge: Success indicator
- Alert Badge: Warning notification

### Chat Message Component
```tsx
<ChatMessage
  role="user"
  content="Hello!"
  showAvatar
/>
```

**Props:**
- `role`: 'user' | 'assistant'
- `content`: string
- `showAvatar`: boolean

**Presets:**
- User Message: Message from user
- Assistant Message: AI response

## Technical Implementation

### Architecture
- **Next.js 15 App Router**: Server and client components
- **TypeScript**: Full type safety
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Responsive styling
- **React Hooks**: State management

### Key Patterns

#### Component Configuration
```typescript
interface ComponentConfig {
  id: ComponentType
  name: string
  icon: React.ReactNode
  description: string
  component: React.ComponentType<any>
  defaultProps: Record<string, any>
  propControls: PropControl[]
  presets: PresetConfig[]
  codeTemplate: (props: Record<string, any>) => string
}
```

#### URL State Management
```typescript
// Encode state in URL
const params = new URLSearchParams({
  component: selectedComponent,
  props: JSON.stringify(componentProps),
  theme,
})

// Load state from URL
const params = new URLSearchParams(window.location.search)
const component = params.get('component')
const props = JSON.parse(params.get('props'))
```

#### Code Generation
```typescript
codeTemplate: (props) => `<Button
  variant="${props.variant}"
  size="${props.size}"
  ${props.disabled ? 'disabled' : ''}
>
  ${props.children}
</Button>`
```

### Performance Optimizations

1. **Memoization**: `useMemo` for expensive computations
2. **Callbacks**: `useCallback` for stable function references
3. **Lazy Loading**: Components loaded on-demand
4. **Code Splitting**: Route-based splitting

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Management**: Clear focus indicators
- **Theme Support**: Respects system preferences

## Usage

### Basic Usage
1. Navigate to `/playground/interactive`
2. Select a component from the grid
3. Adjust properties in the controls panel
4. View live preview and generated code

### Sharing Configurations
1. Configure component as desired
2. Click "Share" button
3. Share the copied URL with team
4. Recipients see exact configuration

### Exporting Code
1. Configure component
2. Click "Copy" to copy to clipboard
3. Or click "Export" to download `.tsx` file
4. Paste into your project

### View Modes
- **Split View**: See controls, preview, and code simultaneously
- **Preview Only**: Focus on visual appearance
- **Code Only**: Review generated code

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- `react`: ^19.2.0
- `next`: ^16.0.9
- `framer-motion`: ^12.23.25
- `lucide-react`: ^0.556.0
- `tailwindcss`: ^3.4.0

## File Structure

```
app/playground/interactive/
├── page.tsx           # Main playground component
└── README.md         # This file
```

## Future Enhancements

### Planned Features
- [ ] Component composition (nested components)
- [ ] Custom prop validation
- [ ] TypeScript type generation
- [ ] Storybook export
- [ ] Figma plugin integration
- [ ] Accessibility audit tool
- [ ] Performance metrics
- [ ] Mobile-optimized controls

### Potential Components
- [ ] Modal/Dialog
- [ ] Dropdown Menu
- [ ] Tabs
- [ ] Accordion
- [ ] Toast Notifications
- [ ] Tooltip
- [ ] Loading Spinner
- [ ] Progress Bar

## Contributing

To add a new component to the playground:

1. **Create the demo component**:
```typescript
function DemoNewComponent({ prop1, prop2 }: any) {
  return <div>{/* Implementation */}</div>
}
```

2. **Add configuration**:
```typescript
{
  id: 'new-component',
  name: 'New Component',
  icon: <Icon className="w-5 h-5" />,
  description: 'Description',
  component: DemoNewComponent,
  defaultProps: { prop1: 'default' },
  propControls: [/* controls */],
  presets: [/* presets */],
  codeTemplate: (props) => `<NewComponent />`,
}
```

3. **Test thoroughly**:
- Verify all prop controls work
- Test presets
- Check code generation
- Test URL sharing
- Verify theme switching

## Best Practices

### Component Design
- Keep props minimal and intuitive
- Provide sensible defaults
- Include helpful descriptions
- Create useful presets

### Code Generation
- Follow project conventions
- Use proper TypeScript types
- Include necessary imports
- Add helpful comments

### Testing
- Test all prop combinations
- Verify responsive behavior
- Check accessibility
- Test in both themes

## Troubleshooting

### Component not rendering
- Check prop types match controls
- Verify default props are set
- Review console for errors

### Code export issues
- Ensure template uses correct syntax
- Check for special characters in props
- Verify clipboard permissions

### URL sharing not working
- Check URL length limits
- Verify JSON serialization
- Test in different browsers

## License

MIT License - Part of Clarity AI Chat Components

## Support

For issues or questions:
- GitHub Issues: [clarity-ai-chat-components](https://github.com/your-repo)
- Documentation: [clarity-docs](https://clarity-docs.com)
- Email: support@clarity.ai

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
**Status**: Production Ready
