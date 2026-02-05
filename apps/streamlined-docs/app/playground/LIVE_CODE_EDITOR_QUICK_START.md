# Live Code Editor - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Navigate to Playground
```bash
# Start the dev server
cd apps/streamlined-docs
npm run dev

# Open in browser
open http://localhost:3000/playground
```

### 2. Select Live Code Editor Tab
Click "Live Code Editor" from the demo selector (first tab).

### 3. Start Coding
The editor comes pre-loaded with a welcome example. Click **Run** (⌘+Enter) to execute it.

---

## 📝 Basic Usage

### Hello World
```typescript
console.log('Hello, World!')
return 'Success!'
```
**Click Run** → See output in console panel

### With Variables
```typescript
const name = 'Clarity Chat'
const version = '2.0'
console.log(`${name} v${version}`)
return { name, version }
```

### Async Example
```typescript
async function getData() {
  await new Promise(r => setTimeout(r, 1000))
  return { message: 'Data loaded!' }
}
return await getData()
```

---

## ⌨️ Essential Shortcuts

| Shortcut | Action |
|----------|--------|
| **⌘ + Enter** | Run code |
| **⌘ + S** | Save to file |
| **⌘ + /** | Toggle comment |
| **Ctrl + Space** | Auto-complete |
| **Shift + ⌘ + F** | Format code |

---

## 🎨 Quick Settings

Click the **⚙️ Settings** icon in toolbar:

- **Font Size**: 10-24px slider
- **Theme**: Dark or Light
- **Minimap**: Toggle on/off
- **Word Wrap**: Toggle on/off

---

## 📦 Example Templates

Click the **"Select Template..."** dropdown to try:

1. **Hello World** - Simple logging
2. **React Component** - useState hook
3. **Async/Await** - Promise handling
4. **Array Operations** - map, filter, reduce
5. **Error Handling** - try/catch patterns
6. **Clarity Chat Demo** - Message management

---

## 🎯 Common Patterns

### Console Logging
```typescript
console.log('Regular message')
console.error('Error message')
console.warn('Warning message')
console.info('Info message')
```

### Working with Arrays
```typescript
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(n => n * 2)
const sum = numbers.reduce((a, b) => a + b, 0)
console.log({ doubled, sum })
return { doubled, sum }
```

### Error Handling
```typescript
try {
  // Your code here
  throw new Error('Something went wrong')
} catch (error) {
  console.error(error.message)
  return 'Handled gracefully'
}
```

### Async Operations
```typescript
async function fetchUser() {
  console.log('Fetching...')
  await new Promise(r => setTimeout(r, 500))
  return { id: 1, name: 'John' }
}

const user = await fetchUser()
console.log('User:', user)
return user
```

---

## 🐛 Debugging Tips

### Syntax Errors
Red underlines indicate syntax errors. Hover for details.

### Runtime Errors
Displayed in red boxes in the console panel with error message.

### Type Errors
TypeScript checks types in real-time. Fix highlighted issues.

### Console Output
All console.log() calls appear in the output panel with timestamps.

---

## 💡 Pro Tips

### 1. Auto-completion
Type `console.` → Press **Ctrl+Space** → Select method

### 2. Quick Formatting
Messy code? Press **Shift+⌘+F** to auto-format

### 3. Multi-line Selection
Hold **Alt** and click to add multiple cursors

### 4. Line Movement
**Alt+↑/↓** to move lines up/down

### 5. Duplicate Lines
**Shift+Alt+↑/↓** to duplicate lines

### 6. Copy Code
Click **📋 Copy** button to copy all code to clipboard

### 7. Reset Code
Click **↻ Reset** to restore initial example

### 8. Save Code
Click **💾 Save** or press **⌘+S** to download as .ts file

---

## 🔥 Cool Examples to Try

### 1. Fibonacci Sequence
```typescript
function fib(n: number): number {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

const result = Array.from({ length: 10 }, (_, i) => fib(i))
console.log('Fibonacci:', result)
return result
```

### 2. Data Transformation
```typescript
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
]

const adults = users.filter(u => u.age >= 30)
const names = users.map(u => u.name)
const avgAge = users.reduce((sum, u) => sum + u.age, 0) / users.length

console.log('Adults:', adults)
console.log('Names:', names)
console.log('Average age:', avgAge)

return { adults, names, avgAge }
```

### 3. Promise Chain
```typescript
async function processData() {
  console.log('Step 1: Fetching...')
  await new Promise(r => setTimeout(r, 300))

  console.log('Step 2: Processing...')
  await new Promise(r => setTimeout(r, 300))

  console.log('Step 3: Complete!')
  return { status: 'success', timestamp: Date.now() }
}

return await processData()
```

### 4. Object Manipulation
```typescript
const data = {
  name: 'Clarity Chat',
  features: ['Monaco', 'TypeScript', 'Hot Reload'],
  stats: { users: 1000, satisfaction: 98 }
}

// Destructuring
const { name, features, stats: { users } } = data
console.log(`${name} has ${users} users`)

// Spread operator
const enhanced = {
  ...data,
  version: '2.0',
  features: [...features, 'AI Integration']
}

console.log('Enhanced:', enhanced)
return enhanced
```

---

## 🚨 Troubleshooting

### Editor Not Loading
- **Check**: Monaco CDN accessible
- **Fix**: Refresh page, clear cache

### Code Won't Run
- **Check**: Console for syntax errors
- **Fix**: Review red underlines, fix syntax

### Slow Performance
- **Check**: Code complexity
- **Fix**: Disable minimap, reduce font size

### Types Not Working
- **Check**: TypeScript configuration
- **Fix**: Use valid TypeScript syntax

---

## 📚 Learn More

- **Component Docs**: `apps/streamlined-docs/app/playground/components/README.md`
- **Implementation**: `LIVE_CODE_EDITOR_IMPLEMENTATION.md`
- **Monaco Docs**: https://microsoft.github.io/monaco-editor/
- **TypeScript**: https://www.typescriptlang.org/docs/

---

## 🎓 Next Steps

1. **Try Examples**: Run all 6 template examples
2. **Experiment**: Write your own code
3. **Learn Shortcuts**: Master keyboard shortcuts
4. **Customize**: Adjust settings to your preference
5. **Share**: Save and share your code

---

## 💬 Need Help?

- **Console Errors**: Check output panel for detailed errors
- **Type Issues**: Hover over red underlines for hints
- **Shortcuts**: Click "Keyboard Shortcuts" tab for full list
- **Settings**: Click gear icon to customize editor

---

**Happy Coding! 🎉**

---

**Quick Reference Card**

```
┌──────────────────────────────────────┐
│      Live Code Editor Cheatsheet     │
├──────────────────────────────────────┤
│ ⌘+Enter    → Run code                │
│ ⌘+S        → Save to file            │
│ Shift+⌘+F  → Format code             │
│ Ctrl+Space → Auto-complete           │
│ ⌘+/        → Toggle comment          │
│ Alt+↑/↓    → Move line               │
│ ⌘+D        → Select next occurrence  │
├──────────────────────────────────────┤
│ 📝 Write → ▶️ Run → 📊 See Output    │
└──────────────────────────────────────┘
```
