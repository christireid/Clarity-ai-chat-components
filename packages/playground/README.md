# @clarity-chat/playground

**Interactive component playground powered by Sandpack**

Experience Clarity Chat components in a live, interactive environment.

---

## ✨ **Features**

### **Core Features**
- 🎨 **Live Code Editor** - Monaco-powered with TypeScript support
- 👁️ **Real-time Preview** - See changes instantly with Sandpack
- 📚 **15+ Templates** - Pre-built examples using actual components
- 🔒 **Secure Execution** - Sandpack sandboxing (same as CodeSandbox)
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 💾 **Auto-save** - Code persists in localStorage
- 🔗 **URL Sharing** - Share your code via compressed URLs
- 📱 **Responsive Testing** - Mobile, tablet, desktop views

### **Advanced Features**
- ⚡ **Auto-run** - Automatic preview updates (toggleable)
- 🐛 **Console Output** - See console.log in preview
- 🎯 **Error Handling** - Clear error messages
- 📥 **Export** - Download code or open in CodeSandbox
- 🔍 **Template Search** - Find templates quickly
- ⌨️ **Keyboard Shortcuts** - Efficient workflow

---

## 🚀 **Quick Start**

### **Development**

```bash
# From root
npm run dev --workspace=@clarity-chat/playground

# Or from package directory
cd packages/playground
npm run dev
```

Opens at [http://localhost:5174](http://localhost:5174)

---

### **Build**

```bash
npm run build
```

### **Preview Build**

```bash
npm run preview
```

---

## 📚 **Available Templates**

### **Getting Started (4)**
1. **Basic Example** - Simple card and button
2. **Simple Chat** - Chat with messages
3. **Streaming** - Streaming response demo
4. **Conversation** - Multi-turn chat

### **Chat Components (4)**
5. **Chat Window** - Full chat interface
6. **Message Variants** - Different message types
7. **Chat Input** - Input with features
8. **Thinking Indicator** - Loading states

### **UI Components (3)**
9. **Buttons** - All button variants
10. **Inputs** - All input variants
11. **Cards** - Card layouts

### **Advanced (5)**
12. **All Components** - Complete showcase
13. **Form Example** - Working form
14. **Full Chat App** - Complete app
15. **Theme Demo** - Light/dark toggle
16. **Responsive** - Mobile/tablet/desktop

---

## 🎯 **Features in Detail**

### **Code Editor**

**Powered by Monaco Editor:**
- Full TypeScript support
- Intelligent autocomplete
- Syntax highlighting
- Error detection
- Format on type/paste
- Keyboard shortcuts

**Shortcuts:**
- `Cmd/Ctrl + S` - Save
- `Cmd/Ctrl + Enter` - Run code
- `Cmd/Ctrl + /` - Toggle comment
- `Cmd/Ctrl + D` - Duplicate line
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

---

### **Live Preview**

**Powered by Sandpack:**
- ✅ Secure sandbox execution
- ✅ npm package support
- ✅ Real Clarity Chat components
- ✅ Hot module reload
- ✅ Console output capture
- ✅ Error overlay
- ✅ TypeScript support

**All imports work:**
```tsx
import { Button, Input, Card } from '@clarity-chat/primitives'
import { ChatWindow, Message, ChatInput } from '@clarity-chat/react'
import { useState, useEffect } from 'react'
import { Search, Send } from 'lucide-react'
```

---

### **View Modes**

Test your components at different sizes:

- **Mobile** - 375px (iPhone)
- **Tablet** - 768px (iPad)
- **Desktop** - Full width

Toggle between modes with toolbar buttons or settings.

---

### **State Persistence**

Automatically saves to localStorage:
- Current code
- Selected template
- Theme preference
- Auto-run setting
- View mode

**Your work is never lost!** ✅

---

### **Sharing**

**Share your code:**
1. Click the Share button
2. URL is copied to clipboard
3. Send to anyone
4. They see your exact code

**URL format:**
```
https://playground.clarity-chat.dev/?code=<compressed>
```

Compressed with LZ-string for small URLs.

---

## 💡 **Usage Examples**

### **Experiment with Components**

```tsx
import { Button, Card } from '@clarity-chat/primitives'

export default function MyComponent() {
  return (
    <Card className="p-6">
      <Button>Click me!</Button>
    </Card>
  )
}
```

Edit the code, see instant results!

---

### **Test Chat Functionality**

```tsx
import { useState } from 'react'
import { ChatWindow, Message, ChatInput } from '@clarity-chat/react'

export default function ChatTest() {
  const [messages, setMessages] = useState([])

  return (
    <ChatWindow>
      {messages.map(msg => (
        <Message key={msg.id} {...msg} />
      ))}
      <ChatInput onSend={handleSend} />
    </ChatWindow>
  )
}
```

---

### **Explore Variants**

```tsx
import { Button } from '@clarity-chat/primitives'

export default function Variants() {
  return (
    <div className="space-y-2">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}
```

---

## 🔧 **Troubleshooting**

### **Preview Not Updating**

**Check:**
- Auto-run is enabled (Settings)
- No syntax errors in code
- Code exports a default component

**Fix:**
- Click the Run button manually
- Check console for errors

---

### **Components Not Rendering**

**Check:**
- Imports are correct
- Component names match
- Props are valid

**Example:**
```tsx
// ✅ Correct
import { Button } from '@clarity-chat/primitives'

// ❌ Wrong
import { Button } from '@clarity-chat/react'
```

---

### **TypeScript Errors**

**Sandpack provides:**
- Type checking
- IntelliSense
- Error underlining

**If types are wrong:**
- Check component props
- Refer to type definitions
- Use TypeScript hover info

---

## ⌨️ **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + S` | Save code |
| `Cmd/Ctrl + Enter` | Run preview |
| `Cmd/Ctrl + /` | Toggle comment |
| `Cmd/Ctrl + D` | Duplicate line |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + F` | Find |
| `Cmd/Ctrl + H` | Find and replace |

---

## 🎯 **Pro Tips**

1. **Start with a Template** - Don't start from scratch
2. **Use Auto-run** - Instant feedback while coding
3. **Toggle Console** - Debug with console output
4. **Test Responsive** - Check mobile, tablet, desktop
5. **Share Early** - Get feedback with share URLs
6. **Save Often** - Auto-saved, but copy important code
7. **Explore Examples** - Learn from all 15+ templates

---

## 📦 **Technology Stack**

- **Editor:** Monaco Editor (VS Code's editor)
- **Preview:** Sandpack (CodeSandbox's engine)
- **Framework:** React 19
- **Components:** Clarity Chat (latest)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Compression:** LZ-string

---

## 🎨 **Customization**

### **Theme**

Toggle between light and dark themes:
- Matches Clarity Chat design system
- Smooth transitions
- Persists across sessions

### **View Modes**

Test at different widths:
- Mobile: 375px
- Tablet: 768px
- Desktop: 100%

### **Settings**

- Auto-run on/off
- Split view toggle
- Console visibility

---

## 🐛 **Known Limitations**

1. **External APIs** - Won't work (CORS restrictions)
2. **File System** - Read-only (Sandpack limitation)
3. **Large Files** - May be slow (keep code concise)
4. **npm Packages** - Only pre-configured packages work

---

## 🚀 **Deployment**

Build for production:

```bash
npm run build
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static host

---

## 📖 **Learn More**

- **Clarity Chat Docs:** See main documentation
- **Sandpack Docs:** https://sandpack.codesandbox.io
- **Monaco Editor:** https://microsoft.github.io/monaco-editor

---

## 🤝 **Contributing**

Found a bug or want to add templates?

1. Fork the repository
2. Create a feature branch
3. Add your template to `src/templates.ts`
4. Submit a pull request

---

## 📄 **License**

MIT - Same as Clarity Chat

---

**Happy coding!** ✨

Experiment, learn, and build amazing AI chat interfaces with Clarity Chat components.
