# Design System Showcase

Comprehensive demonstration of Clarity Chat Components' design system, patterns, and best practices.

## Features

✅ **Interactive Navigation** - Sidebar navigation between sections  
✅ **6 Component Sections** - Buttons, Forms, Cards, Overlays, Chat, Animations  
✅ **Design Tokens** - Color system, spacing, typography  
✅ **Code Examples** - Shows implementation patterns  
✅ **Live Demonstrations** - Interactive component examples  
✅ **Feature Documentation** - Explains design decisions  
✅ **TypeScript** - Zero type errors, fully typed  

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Sections

### 1. Design Tokens 🎨
- Color system (primary, secondary, destructive, etc.)
- Spacing scale (shadow-xs, shadow-sm, shadow-md, etc.)
- Typography scale
- Border radius values
- Opacity levels

### 2. Buttons 🔘
- All button variants (default, secondary, outline, ghost, destructive, link)
- All sizes (sm, default, lg, icon)
- States (normal, hover, disabled, loading)
- With icons
- Button groups

### 3. Forms 📝
- Input fields
- Textareas
- Checkboxes
- Select dropdowns
- Form layouts
- Validation states
- Interactive form example

### 4. Cards 🎴
- Basic cards
- Interactive cards
- Stat cards
- Content cards
- Card variants

### 5. Overlays 🪟
- Dialogs/Modals
- Popovers
- Tooltips
- Drawers
- Dropdowns

### 6. Chat Components 💬
- Message bubbles
- Thinking indicator
- Chat input
- Empty states
- Full chat interface example

### 7. Animations ✨
- Timing functions
- Duration values
- Hover effects
- Focus rings
- Transition patterns

## Design Principles

### 1. Ring-Based Borders
Instead of traditional borders, uses rings for focus and selection:
```css
ring-1 ring-primary/20
focus-visible:ring-[3px] focus-visible:ring-primary/30
```

### 2. Refined Shadows
Precise shadow system for depth hierarchy:
- `shadow-xs` - Subtle depth (cards, inputs)
- `shadow-sm` - Hover states
- `shadow-md` - Popovers, dropdowns
- `shadow-lg` - Modals, dialogs

### 3. Consistent Radius
Unified border radius scale:
- `rounded-sm` - 2px (tags, badges)
- `rounded-md` - 6px (buttons, inputs)
- `rounded-lg` - 8px (cards, containers)
- `rounded-xl` - 12px (large cards)

### 4. Enhanced Focus States
Visible keyboard navigation:
```css
focus-visible:ring-[3px] focus-visible:ring-primary/30
focus-visible:outline-none
```

### 5. Precise Hover Effects
Subtle interactions:
```css
hover:shadow-sm
hover:-translate-y-[2px]
hover:bg-muted/30
transition-all duration-200
```

### 6. Consistent Opacity
Standardized transparency:
- `/10` - Very subtle backgrounds
- `/20` - Ring borders, dividers
- `/30` - Hover states
- `/50` - Disabled states

## Code Patterns

### Component Import Pattern
```typescript
import { Button, Input, Card } from '@clarity-chat/primitives'
import { ChatInput, Message, ThinkingIndicator } from '@clarity-chat/react'
```

### Message Type Pattern
```typescript
import type { Message as MessageType } from '@clarity-chat/types'

const messages: MessageType[] = [
  {
    id: '1',
    chatId: 'showcase',
    role: 'assistant',
    content: 'Hello!',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'sent',
  }
]
```

### ChatInput Pattern
```typescript
const [input, setInput] = useState('')

<ChatInput
  value={input}
  onChange={(value) => setInput(value)} // Takes string, not event
  onSubmit={() => console.log(input)}
  placeholder="Type a message..."
/>
```

### Toast Provider Pattern
```typescript
import { ToastProvider } from '@clarity-chat/react'

<ToastProvider>
  <App />
</ToastProvider>
```

## File Structure

```
design-system-showcase/
├── src/
│   ├── App.tsx                      # Main app with navigation
│   ├── main.tsx                     # Entry point
│   └── sections/
│       ├── DesignTokens.tsx         # Token showcase
│       ├── ButtonShowcase.tsx       # Button demos
│       ├── FormShowcase.tsx         # Form demos
│       ├── CardShowcase.tsx         # Card demos
│       ├── OverlayShowcase.tsx      # Overlay demos
│       ├── ChatShowcase.tsx         # Chat demos
│       └── AnimationShowcase.tsx    # Animation demos
├── package.json
└── README.md
```

## Customization

### Change Active Section
Modify the `activeSection` state in `App.tsx`:
```typescript
const [activeSection, setActiveSection] = useState('buttons')
```

### Add New Section
1. Create file in `sections/`
2. Import in `App.tsx`
3. Add to `sections` array
4. Add conditional render in main content

### Customize Navigation
Update the `sections` array in `App.tsx`:
```typescript
const sections = [
  { id: 'custom', label: 'Custom Section', icon: '🎯' },
  // ...
]
```

## Best Practices Demonstrated

1. **Proper TypeScript Types** - All Message types include required fields
2. **Correct Hook APIs** - ChatInput onChange receives string, not event
3. **Checkbox API** - Uses onChange, not onCheckedChange
4. **EmptyState Action** - Uses object with label and onClick, not JSX
5. **Clean Imports** - Only imports what's used
6. **Consistent Styling** - Uses design tokens throughout
7. **Responsive Layout** - Grid adapts to screen size

## Known Patterns

### Button Loading State
```typescript
const [loading, setLoading] = useState(false)

<Button loading={loading} onClick={() => setLoading(true)}>
  Click me
</Button>
```

### Checkbox State
```typescript
const [checked, setChecked] = useState(false)

<Checkbox
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

### Select Dropdown
```typescript
<select className="w-full px-3 py-2 rounded-md...">
  <option>Option 1</option>
</select>
```

## Next Steps

To learn more:
- Try the [Component Demo](../component-demo) for focused examples
- Check [Basic Chat](../basic-chat) for simple integration
- Explore [AI Assistant](../ai-assistant) for advanced features

## Troubleshooting

### Type Errors on Message
Ensure all required fields are present:
```typescript
{
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: Date
  updatedAt: Date
  status: 'sending' | 'sent' | 'error'
}
```

### ChatInput onChange not working
Use string callback, not event:
```typescript
onChange={(value: string) => setInput(value)}
// NOT: onChange={(e) => setInput(e.target.value)}
```

### Styles not applied
Import CSS files:
```typescript
import '@clarity-chat/primitives/dist/index.css'
import '@clarity-chat/react/dist/styles/index.css'
```

## License

MIT - see repository root for details
