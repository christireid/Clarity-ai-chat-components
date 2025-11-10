# Component Demo

Comprehensive demonstration of common patterns with Clarity Chat Components.

## Features

✅ **Complete Component Showcase** - All major components demonstrated  
✅ **Interactive Examples** - Try buttons, forms, dialogs, chat  
✅ **Auto-Scroll Chat** - Messages automatically scroll into view  
✅ **Token Tracking** - Real-time token usage display  
✅ **Toast Notifications** - Success/error feedback  
✅ **Error Boundary** - Crash protection  
✅ **Network Status** - Connection indicator  
✅ **Responsive Design** - Works on all screen sizes  
✅ **TypeScript** - Full type safety  

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## What's Demonstrated

### 1. Primitive Components

**Buttons**
- All variants (default, secondary, outline, ghost, destructive)
- All sizes (sm, default, lg)
- Disabled state

**Form Elements**
- Input fields with proper labels
- Form submission with validation
- Toast notifications on submit

**Cards**
- Basic cards
- Interactive cards with hover effects
- Selected cards with ring highlight

**Badges & Status**
- All badge variants
- Status indicators

**Progress & Loading**
- Progress bars
- Loading skeletons

### 2. Advanced Components

**Dialog / Modal**
- Backdrop blur
- Smooth animations
- Proper accessibility (focus trap, ESC to close)

**Tooltips**
- Multiple positions (top, right, bottom, left)
- Auto-positioning
- Smooth transitions

**Chat Interface**
- Message display with Message component
- Empty state with icon and description
- ChatInput with proper callbacks
- ThinkingIndicator for loading
- Auto-scroll with useAutoScroll hook
- Token counting with useTokenTracker

### 3. Feature Grid
- Responsive card grid
- Interactive hover effects
- Emoji icons

## Component Patterns

### Button Usage

```typescript
// Basic button
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Disabled
<Button disabled>Disabled</Button>
```

### Form Pattern

```typescript
const [formData, setFormData] = useState({ name: '', email: '' })

<Input 
  placeholder="Enter your name"
  value={formData.name}
  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
/>

<Button onClick={handleSubmit}>
  Submit Form
</Button>
```

### Chat Pattern

```typescript
// Use proper hooks
const { scrollRef } = useAutoScroll({ dependencies: [messages] })
const { totalTokens, addInputTokens, addOutputTokens } = useTokenTracker({
  modelName: 'gpt-3.5-turbo'
})

// Render messages
<div ref={scrollRef}>
  {messages.map(message => (
    <Message key={message.id} message={message} />
  ))}
</div>
```

### Dialog Pattern

```typescript
const [dialogOpen, setDialogOpen] = useState(false)

<Button onClick={() => setDialogOpen(true)}>
  Open Dialog
</Button>

<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Content</p>
  </DialogContent>
</Dialog>
```

### Toast Pattern

```typescript
import { useToast } from '@clarity-chat/react'

const { show: showToast } = useToast()

// Show toast
showToast({
  title: 'Success!',
  description: 'Action completed',
  variant: 'success' // or 'error', 'warning', 'info'
})

// Add Toast component to your app
<Toast />
```

## Hooks Used

### useAutoScroll
Auto-scrolls chat messages when new content is added.

```typescript
const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
  dependencies: [messages]
})
```

### useTokenTracker
Tracks token usage and estimates costs.

```typescript
const { totalTokens, addInputTokens, addOutputTokens, estimatedCost } = useTokenTracker({
  modelName: 'gpt-3.5-turbo'
})
```

### useToast
Manages toast notifications.

```typescript
const { show, hide, toasts } = useToast()

show({
  title: 'Title',
  description: 'Message',
  variant: 'success',
  duration: 3000
})
```

## Customization

### Change Theme
```typescript
import { ThemeProvider } from '@clarity-chat/react'

<ThemeProvider theme="dark">
  <App />
</ThemeProvider>
```

### Custom Colors
Update your CSS variables:

```css
:root {
  --primary: 220 70% 50%;
  --secondary: 220 30% 40%;
  /* ... */
}
```

### Custom Styles
All components accept `className` prop:

```typescript
<Button className="custom-styles">
  Custom Button
</Button>
```

## Code Structure

```
component-demo/
├── src/
│   ├── App.tsx          # Main demo application
│   ├── main.tsx         # Entry point
│   └── index.css        # Styles
├── package.json         # Dependencies
└── README.md           # This file
```

## Dependencies

Core dependencies:
- `@clarity-chat/primitives` - UI primitives (Button, Input, Card, etc.)
- `@clarity-chat/react` - Chat components and hooks
- `@clarity-chat/types` - TypeScript types
- `react` - UI framework
- `react-dom` - React renderer

## Best Practices Shown

1. **Proper TypeScript Types** - All props properly typed
2. **Error Boundaries** - Graceful error handling
3. **Auto-scroll** - Better UX for chat interfaces
4. **Token Tracking** - Cost visibility
5. **Toast Notifications** - User feedback
6. **Network Status** - Connection awareness
7. **Responsive Design** - Mobile-friendly layouts
8. **Accessibility** - Proper labels and ARIA attributes

## Next Steps

To learn more:
- Check out [AI Assistant Example](../ai-assistant) for advanced chat features
- Explore [Design System Showcase](../design-system-showcase) for design tokens
- Read the [Component Documentation](../../docs)

## Troubleshooting

### Components not styled
Ensure you import the CSS:
```typescript
import '@clarity-chat/primitives/dist/index.css'
import '@clarity-chat/react/dist/styles/index.css'
```

### Toast not showing
Add the `<Toast />` component to your app root.

### Auto-scroll not working
Ensure the ref is attached to a scrollable container with `overflow-y-auto`.

## License

MIT - see repository root for details
