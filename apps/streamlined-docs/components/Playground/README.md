# Playground Components

## CodePlayground

The **CodePlayground** component is the primary interactive playground for demonstrating Clarity Chat components. It uses `react-live` to render **real components** from `@clarity-chat/react` - not mocks!

### Why CodePlayground?

- ✅ **Real Components**: Uses actual @clarity-chat/react components via scope
- ✅ **Live Editing**: Changes update instantly as you type
- ✅ **Full Access**: All exported components and hooks are available
- ✅ **No Setup**: No need to configure dependencies or imports

### Usage

```tsx
import { CodePlayground } from '@/components/Playground/CodePlayground'

const exampleCode = `function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Badge>New</Badge>
    </div>
  )
}

render(<App />)`

export default function MyPage() {
  return <CodePlayground initialCode={exampleCode} />
}
```

### Available in Scope

All of these are automatically available without imports:

- **All Clarity Components**: `Button`, `Badge`, `ChatWindow`, `Message`, etc.
- **React Hooks**: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `useContext`, `createContext`
- **Clarity Hooks**: `useToast`, `useChat`, etc.
- **Utilities**: `React`, `ToastProvider`, `render()`

### Code Format

The code in the playground should:

1. Define a function component (usually called `App`)
2. End with `render(<App />)` to display it
3. NOT include import statements (they're auto-removed)

**Example:**

```typescript
function App() {
  const [count, setCount] = useState(0)
  const { success } = useToast()

  return (
    <div>
      <Button onClick={() => {
        setCount(count + 1)
        success(`Count: ${count + 1}`)
      }}>
        Clicked {count} times
      </Button>
    </div>
  )
}

render(<App />)
```

### ToastProvider

The playground automatically wraps all previews with `ToastProvider`, so `useToast()` works out of the box!

## Removed Components

### EnhancedPlayground (REMOVED)

This component used Sandpack with **mock implementations** and has been removed. Use `CodePlayground` instead.

### LiveDemo (REMOVED)

This component used Sandpack with **mock implementations** and has been removed. Use `CodePlayground` instead.

## Migration Guide

If you're updating old documentation that used `EnhancedPlayground` or `LiveDemo`:

**Before:**
```tsx
import { LiveDemo } from '@/components/Demo/LiveDemo'

<LiveDemo
  code={exampleCode}
  title="Example"
/>
```

**After:**
```tsx
import { CodePlayground } from '@/components/Playground/CodePlayground'

<CodePlayground initialCode={exampleCode} />
```

## Best Practices

1. **Keep examples focused**: Show one concept per playground
2. **Add comments**: Help users understand what's happening
3. **Use real props**: Show actual component APIs, not simplified versions
4. **Handle errors gracefully**: Wrap state updates in try-catch if needed
5. **Show interactive examples**: Demonstrate state, events, and hooks

## Troubleshooting

**Error: "X is not defined"**
- Make sure you're not importing anything (imports are removed)
- Check that you're using components/hooks that exist in @clarity-chat/react

**Component not rendering**
- Make sure you end with `render(<App />)`
- Check that your function is called `App` (or update the render call)

**TypeScript errors**
- The playground runs JavaScript, so TypeScript types are stripped
- Don't rely on type checking in playground code
