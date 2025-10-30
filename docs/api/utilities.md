# 🛠️ Utilities API Reference

> **Helper functions and utilities for common tasks**

---

## 📚 Overview

Clarity Chat includes a comprehensive collection of utility functions for:
- 🎨 **Styling** - Class name merging and CSS utilities
- ⏰ **Time Formatting** - Relative and absolute time formatting
- 📋 **Clipboard** - Copy to clipboard functionality
- 🔤 **Text Processing** - Truncation, formatting, validation
- 📊 **File Handling** - File size formatting and validation
- 🔢 **ID Generation** - Unique identifier creation
- 🎭 **Animations** - Animation variant creators
- 🔄 **Data Transformation** - Common data operations

---

## 🎨 Styling Utilities

### `cn(...inputs)`

Merge and deduplicate CSS class names, with Tailwind CSS conflict resolution.

```typescript
import { cn } from '@clarity-chat/primitives'

// Basic usage
cn('px-4', 'py-2', 'bg-blue-500')
// => "px-4 py-2 bg-blue-500"

// Conditional classes
cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')
// => "base-class active-class" (if isActive is true)

// Tailwind conflict resolution
cn('px-2', 'px-4')
// => "px-4" (later class wins)

// With objects
cn({
  'text-red-500': hasError,
  'text-green-500': !hasError,
})

// Complex example
const buttonClasses = cn(
  'px-4 py-2 rounded font-medium',
  {
    'bg-blue-500 text-white': variant === 'primary',
    'bg-gray-200 text-gray-800': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled,
  },
  className
)
```

**Parameters:**
- `...inputs: ClassValue[]` - Class names, objects, arrays

**Returns:** `string` - Merged class string

---

## ⏰ Time & Date Utilities

### `formatRelativeTime(date)`

Format a date as relative time (e.g., "2 hours ago").

```typescript
import { formatRelativeTime } from '@clarity-chat/primitives'

const timestamp = new Date(Date.now() - 3600000)
formatRelativeTime(timestamp)
// => "1h ago"

// Examples of output:
formatRelativeTime(new Date(Date.now() - 30000))     // "just now"
formatRelativeTime(new Date(Date.now() - 120000))    // "2m ago"
formatRelativeTime(new Date(Date.now() - 7200000))   // "2h ago"
formatRelativeTime(new Date(Date.now() - 86400000))  // "1d ago"
formatRelativeTime(new Date(Date.now() - 604800000)) // "12/25/2024"
```

**Parameters:**
- `date: Date` - The date to format

**Returns:** `string` - Relative time string

---

## 📋 Clipboard Utilities

### `copyToClipboard(text)`

Copy text to the system clipboard.

```typescript
import { copyToClipboard } from '@clarity-chat/primitives'

const handleCopy = async () => {
  const success = await copyToClipboard('Hello, World!')
  
  if (success) {
    console.log('Copied successfully')
  } else {
    console.error('Failed to copy')
  }
}

// With error handling
try {
  await copyToClipboard(message.content)
  showToast('Copied to clipboard')
} catch (error) {
  showToast('Failed to copy')
}
```

**Parameters:**
- `text: string` - Text to copy

**Returns:** `Promise<boolean>` - Success status

---

## 🔤 Text Processing

### `truncate(text, maxLength)`

Truncate text with ellipsis.

```typescript
import { truncate } from '@clarity-chat/primitives'

truncate('This is a very long message', 10)
// => "This is..."

truncate('Short', 10)
// => "Short"

// In component
function MessagePreview({ content }) {
  return <p>{truncate(content, 100)}</p>
}
```

**Parameters:**
- `text: string` - Text to truncate
- `maxLength: number` - Maximum length (including ellipsis)

**Returns:** `string` - Truncated text

---

## 📊 File Utilities

### `formatFileSize(bytes)`

Format file size in human-readable format.

```typescript
import { formatFileSize } from '@clarity-chat/primitives'

formatFileSize(0)          // => "0 Bytes"
formatFileSize(1024)       // => "1 KB"
formatFileSize(1048576)    // => "1 MB"
formatFileSize(1073741824) // => "1 GB"

// In component
function FileUpload({ file }) {
  return (
    <div>
      <span>{file.name}</span>
      <span>{formatFileSize(file.size)}</span>
    </div>
  )
}
```

**Parameters:**
- `bytes: number` - File size in bytes

**Returns:** `string` - Formatted size (e.g., "1.5 MB")

---

## 🔢 ID Generation

### `generateId()`

Generate a unique identifier.

```typescript
import { generateId } from '@clarity-chat/primitives'

const messageId = generateId()
// => "1730000000000-abc123"

const newMessage = {
  id: generateId(),
  content: 'Hello',
  timestamp: new Date(),
}

// Use with React key
messages.map(msg => (
  <Message key={msg.id || generateId()} {...msg} />
))
```

**Returns:** `string` - Unique ID (timestamp + random string)

---

## 🎭 Animation Utilities

### `createFadeVariant(duration, easing)`

Create a fade animation variant for Framer Motion.

```typescript
import { createFadeVariant } from '@clarity-chat/react'
import { motion } from 'framer-motion'

const fadeVariant = createFadeVariant('normal', 'default')

function Component() {
  return (
    <motion.div
      variants={fadeVariant}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      Content
    </motion.div>
  )
}
```

**Parameters:**
- `duration?: 'instant' | 'fast' | 'normal' | 'slow'` - Animation duration
- `easing?: 'default' | 'in' | 'out' | 'inOut' | 'spring'` - Easing function

**Returns:** `Variants` - Framer Motion variants

### `createSlideVariant(direction, distance, duration, easing)`

Create a slide animation variant.

```typescript
import { createSlideVariant } from '@clarity-chat/react'

// Slide from left
const slideLeft = createSlideVariant('left', 20, 'fast', 'out')

// Slide up
const slideUp = createSlideVariant('up', 30, 'normal', 'spring')

<motion.div variants={slideLeft} initial="initial" animate="animate">
  Slides in from left
</motion.div>
```

**Parameters:**
- `direction: 'up' | 'down' | 'left' | 'right'` - Slide direction
- `distance?: number` - Slide distance in pixels (default: 20)
- `duration?: AnimationDuration` - Animation duration
- `easing?: AnimationEasing` - Easing function

**Returns:** `Variants` - Framer Motion variants

### `createScaleVariant(initialScale, duration, easing)`

Create a scale animation variant.

```typescript
import { createScaleVariant } from '@clarity-chat/react'

const scaleVariant = createScaleVariant(0.8, 'fast', 'spring')

<motion.div variants={scaleVariant} initial="initial" animate="animate">
  Scales in
</motion.div>
```

**Parameters:**
- `initialScale?: number` - Initial scale (default: 0.9)
- `duration?: AnimationDuration` - Animation duration
- `easing?: AnimationEasing` - Easing function

**Returns:** `Variants` - Framer Motion variants

### `createStaggerContainerVariant(staggerSpeed, delayChildren)`

Create a stagger container for list animations.

```typescript
import { 
  createStaggerContainerVariant,
  createStaggerChildVariant,
} from '@clarity-chat/react'

const container = createStaggerContainerVariant('normal', 0)
const child = createStaggerChildVariant('slide', 'fast')

<motion.ul variants={container} initial="initial" animate="animate">
  {items.map(item => (
    <motion.li key={item.id} variants={child}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

**Parameters:**
- `staggerSpeed?: 'fast' | 'normal' | 'slow'` - Stagger timing
- `delayChildren?: number` - Delay before children animate

**Returns:** `Variants` - Framer Motion variants

### `createPulseAnimation(minOpacity, maxOpacity, duration)`

Create a pulsing animation.

```typescript
import { createPulseAnimation } from '@clarity-chat/react'

const pulse = createPulseAnimation(0.5, 1, 1.5)

<motion.div variants={pulse} animate="animate">
  Pulsing indicator
</motion.div>
```

**Parameters:**
- `minOpacity?: number` - Minimum opacity (default: 0.5)
- `maxOpacity?: number` - Maximum opacity (default: 0.8)
- `duration?: number` - Animation duration in seconds

**Returns:** `Variants` - Framer Motion variants

### `createSpinnerAnimation(duration)`

Create a spinner rotation animation.

```typescript
import { createSpinnerAnimation } from '@clarity-chat/react'

const spinner = createSpinnerAnimation(1)

<motion.div variants={spinner} animate="animate">
  ⟳
</motion.div>
```

**Parameters:**
- `duration?: number` - Rotation duration in seconds (default: 1)

**Returns:** `Variants` - Framer Motion variants

---

## 🔄 Data Transformation

### `debounce(fn, delay)`

Create a debounced function.

```typescript
import { debounce } from '@clarity-chat/react'

const handleSearch = debounce((query: string) => {
  performSearch(query)
}, 300)

<input onChange={(e) => handleSearch(e.target.value)} />
```

**Parameters:**
- `fn: Function` - Function to debounce
- `delay: number` - Delay in milliseconds

**Returns:** `Function` - Debounced function

### `throttle(fn, delay)`

Create a throttled function.

```typescript
import { throttle } from '@clarity-chat/react'

const handleScroll = throttle(() => {
  checkScrollPosition()
}, 100)

window.addEventListener('scroll', handleScroll)
```

**Parameters:**
- `fn: Function` - Function to throttle
- `delay: number` - Minimum delay between calls

**Returns:** `Function` - Throttled function

---

## 🔗 Utility Hooks

See [Hooks API](./hooks.md) for utility hooks like:
- `useDebounce` - Debounce values
- `useThrottle` - Throttle function calls
- `useMediaQuery` - Responsive design
- `useLocalStorage` - Persistent state
- `useClipboard` - Clipboard operations
- `useWindowSize` - Viewport dimensions

---

## 💡 Usage Examples

### Complete Example

```tsx
import {
  cn,
  formatRelativeTime,
  copyToClipboard,
  truncate,
  formatFileSize,
  generateId,
} from '@clarity-chat/primitives'

function MessageCard({ message, isOwn, file }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={cn(
        'message-card',
        'p-4 rounded-lg shadow',
        isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
      )}
    >
      <p>{truncate(message.content, 200)}</p>
      
      {file && (
        <div className="file-info">
          <span>{file.name}</span>
          <span>{formatFileSize(file.size)}</span>
        </div>
      )}

      <div className="message-footer">
        <span className="timestamp">
          {formatRelativeTime(message.timestamp)}
        </span>
        
        <button onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
```

---

## 📚 Best Practices

### ✅ Do's
- Use `cn()` for all class name merging
- Use `formatRelativeTime()` for timestamps
- Handle clipboard errors gracefully
- Truncate long text for previews
- Use `generateId()` for React keys
- Leverage animation utilities for consistency

### ❌ Don'ts
- Don't concatenate class names manually
- Don't format dates inconsistently
- Don't ignore clipboard failures
- Don't truncate without ellipsis
- Don't use `Math.random()` for IDs
- Don't create animations from scratch

---

## 🔗 Related Documentation

- **[Hooks API](./hooks.md)** - Utility hooks
- **[Components API](./components.md)** - Component APIs
- **[Types](./types.md)** - TypeScript types
- **[Theming](../guides/theming.md)** - Styling and themes

---

**Make development easier with these utilities!** 🛠️
