# Minimal Chat Example

The simplest way to add AI chat to your application - just 5 lines of code!

## Usage

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

That's it! You now have a fully functional AI chat interface with:
- ✨ Beautiful UI with animations
- ⌨️ Full keyboard navigation
- 📱 Mobile responsive
- ⚡ Optimized performance
- ♿ WCAG AAA accessibility
- 🔒 Error handling built-in
- 📊 Token tracking
- 🌐 Network status monitoring

## Customization

```tsx
<ClarityChat
  api="/api/chat"
  theme="dark"
  enableMemory
  showTokenCounter
  onMessageSent={(msg) => console.log('Sent:', msg)}
/>
```

## Run This Example

```bash
cd apps/examples/minimal-chat
pnpm install
pnpm dev
```
