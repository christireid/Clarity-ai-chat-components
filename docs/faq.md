# Frequently Asked Questions (FAQ)

Quick answers to common questions about Clarity Chat.

---

## 🎯 Getting Started

### What is Clarity Chat?

Clarity Chat is a production-ready React component library for building AI chat interfaces. It provides:
- 180+ pre-built components
- 95+ composable hooks
- Automatic streaming, error handling, and token optimization
- Built-in accessibility (WCAG 2.1 AA)
- Support for OpenAI, Anthropic, Google, and custom providers

### Which hook should I use?

**90% of projects:** Use `useClarityChat`

```tsx
const chat = useClarityChat({ api: '/api/chat' })
```

**Need more?** See [Choosing the Right Hook](./guides/choosing-hooks.md)

### How do I get started?

1. Install: `npm install @clarity-chat/react`
2. Follow the [Quick Start Guide](./quick-start.md)
3. You'll have a working chat in 5 minutes!

---

## 💰 Cost & Performance

### How much does it cost?

Clarity Chat is **free and open source** (MIT license).

You pay for:
- AI provider API calls (OpenAI, Anthropic, etc.)
- Optional: Hosting and infrastructure

**Cost savings:** Enable token optimization to save 50-70% on AI costs:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // Saves 50-70%!
})
```

### How can I reduce AI costs?

1. **Enable token optimization** (automatic caching, compression, routing)
2. **Use semantic caching** (40-60% cache hit rate)
3. **Compress prompts** (20-30% token reduction)
4. **Choose cheaper models** for simple tasks
5. **Set token budgets** to limit spending

See [Token Optimization Guide](./guides/token-optimization.md)

### Is it fast enough for production?

Yes! Clarity Chat includes:
- ✅ Virtual scrolling for 1000+ messages
- ✅ Optimized re-renders with React.memo
- ✅ Streaming responses (sub-second TTFT)
- ✅ Request deduplication
- ✅ Smart caching

**Performance:**
- First render: < 100ms
- Message render: < 16ms (60 FPS)
- 1000+ messages: No lag with virtualization

---

## 🔧 Technical Questions

### Which AI providers are supported?

**Built-in support:**
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude 3)
- Google (Gemini, PaLM)

**Easy to add:**
- Custom providers
- Local models (Ollama, etc.)
- Any REST API

See [Custom Adapters Guide](./advanced/adapters.md)

### Does it work with Next.js?

Yes! Fully compatible with:
- Next.js 13+ App Router
- Next.js Pages Router
- React Server Components
- Server Actions

See [Next.js examples](./examples/)

### Does it work with TypeScript?

Yes! Fully typed with:
- Complete TypeScript definitions
- Strict mode compatible
- Generic type parameters
- IntelliSense support

### Can I use it with React Native?

Not currently. Clarity Chat is designed for web browsers.

**Alternatives:**
- Use our headless hooks
- Build custom React Native components
- Wait for official React Native support (planned)

### Does it support Server-Sent Events (SSE)?

Yes! SSE is the default streaming protocol.

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // Default
})
```

Also supports WebSocket:
```tsx
transport: 'websocket'
```

---

## 🎨 Customization

### Can I customize the UI?

Yes! Three options:

1. **Use pre-built components** (fastest)
```tsx
<ChatWindow messages={messages} onSend={append} />
```

2. **Customize with props** (flexible)
```tsx
<ChatWindow
  messages={messages}
  onSend={append}
  theme="dark"
  className="my-custom-class"
  components={{ Message: MyCustomMessage }}
/>
```

3. **Build custom UI** (full control)
```tsx
const { messages, append } = useClarityChat({ api: '/api/chat' })

return (
  <div className="my-custom-chat">
    {messages.map(msg => <MyMessage key={msg.id} {...msg} />)}
    <MyInput onSend={append} />
  </div>
)
```

### Can I change the styling?

Yes! Use:
- Tailwind CSS classes
- CSS modules
- Styled components
- Emotion
- Any CSS-in-JS solution

See [Styling Guide](./guides/styling.md)

### Can I add custom components?

Yes! Replace any component:

```tsx
<ChatWindow
  components={{
    Message: MyCustomMessage,
    Input: MyCustomInput,
    LoadingIndicator: MyCustomSpinner,
  }}
/>
```

---

## 🔒 Security & Privacy

### Is it secure?

Yes! Includes:
- ✅ XSS protection (DOMPurify)
- ✅ Input sanitization
- ✅ Content Security Policy support
- ✅ HTTPS required for production
- ✅ No eval() or dangerous patterns

See [Security Best Practices](./advanced/security.md)

### Where is data stored?

**Client-side:**
- Messages: In React state (ephemeral)
- Memory: IndexedDB or localStorage (optional)
- Cached responses: In-memory or IndexedDB (optional)

**Server-side:**
- You control all server storage
- API calls go to your backend
- No data sent to Clarity servers

### Does it send data to external services?

Only if you configure it:
- AI provider APIs (OpenAI, etc.) - you configure
- Analytics (optional) - you configure
- No telemetry sent by default

### Is it GDPR compliant?

The library itself is GDPR-ready, but compliance depends on your implementation:

**Your responsibilities:**
- [ ] Get user consent for AI processing
- [ ] Provide privacy policy
- [ ] Allow data deletion
- [ ] Secure API keys
- [ ] Log and audit access

### Can I use it for healthcare/financial apps?

**Healthcare (HIPAA):**
- Use BAA-compliant AI providers
- Encrypt data at rest and in transit
- Implement audit logging
- No PHI in client storage

**Financial:**
- Follow PCI DSS if handling payments
- Encrypt sensitive data
- Implement session timeouts
- Use secure API authentication

**Consult legal/compliance before deploying in regulated industries.**

---

## ♿ Accessibility

### Is it accessible?

Yes! WCAG 2.1 AA compliant with:
- ✅ Screen reader support (ARIA)
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ High contrast support
- ✅ Reduced motion support
- ✅ Semantic HTML

### Does it work with screen readers?

Yes! Tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (Mac/iOS)
- TalkBack (Android)

See [Accessibility Guide](./integration/accessibility.md)

### What keyboard shortcuts are supported?

Default shortcuts:
- `Enter` - Send message
- `Shift+Enter` - New line
- `Escape` - Clear input
- `Ctrl+K` - Command palette
- `Arrow Up/Down` - Navigate messages

Customize with `useKeyboardShortcuts`:
```tsx
useKeyboardShortcuts({
  'Ctrl+Enter': sendMessage,
  'Ctrl+/': showHelp,
})
```

---

## 🚀 Deployment

### Can I deploy to Vercel/Netlify?

Yes! Works with any hosting platform:
- ✅ Vercel
- ✅ Netlify
- ✅ AWS Amplify
- ✅ Cloudflare Pages
- ✅ GitHub Pages
- ✅ Any Node.js host

### Do I need a backend?

Yes, you need an API route to:
- Call AI provider (with your API key)
- Stream responses
- Handle authentication

**Example:** Next.js API route
```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  return new StreamingTextResponse(OpenAIStream(response))
}
```

### What are the system requirements?

**Browser support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 5+)

**React version:**
- React 18.0+
- React DOM 18.0+

**Node.js (for build):**
- Node 16+
- npm 8+ or yarn 1.22+

---

## 🐛 Common Issues

### Why isn't streaming working?

See [Troubleshooting: Streaming](./troubleshooting.md#streaming-not-working)

### Why am I hitting token limits?

Enable token optimization:
```tsx
tokenOptimization: 'smart'
```

See [Troubleshooting: Token Budget](./troubleshooting.md#token-budget-exceeded)

### Why is memory not persisting?

Use persistent storage:
```tsx
memoryOptions: {
  storageBackend: 'indexeddb'
}
```

See [Troubleshooting: Memory](./troubleshooting.md#memory-not-persisting)

**More issues?** Check the [Troubleshooting Guide](./troubleshooting.md)

---

## 📚 Learning Resources

### Where can I find examples?

- [Examples Gallery](./examples/README.md) - 20+ working examples
- [Cookbook](./cookbook/README.md) - Copy-paste recipes
- [API Reference](./api/hooks/README.md) - Complete hook/component docs

### Are there video tutorials?

Coming soon! Meanwhile:
- [Quick Start Guide](./quick-start.md) - 5-minute written guide
- [Choosing the Right Hook](./guides/choosing-hooks.md) - Decision guide

### How do I stay updated?

- [Changelog](./changelog.md) - Version history
- [GitHub Releases](https://github.com/clarity-chat/clarity/releases)
- [Discord](https://discord.gg/clarity-chat) - Community updates
- [Twitter](https://twitter.com/clarity_chat) - Announcements

---

## 🤝 Community & Support

### How do I get help?

1. **Documentation** - Start here (you're reading it!)
2. **Troubleshooting** - [Common issues](./troubleshooting.md)
3. **Discord** - [Join community](https://discord.gg/clarity-chat)
4. **GitHub Issues** - [Report bugs](https://github.com/clarity-chat/clarity/issues)
5. **Discussions** - [Ask questions](https://github.com/clarity-chat/clarity/discussions)

### Can I contribute?

Yes! We welcome:
- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions
- 💬 Community support

See [Contributing Guide](../CONTRIBUTING.md)

### Is there commercial support?

**Free community support:**
- Discord
- GitHub Discussions
- Documentation

**Coming soon:**
- Priority support
- Custom integrations
- Training/workshops

Contact: [email protected]

---

## 📖 More Questions?

**Didn't find your answer?**

- Check [Troubleshooting](./troubleshooting.md)
- Search [Documentation](./README.md)
- Ask in [Discord](https://discord.gg/clarity-chat)
- Open [Discussion](https://github.com/clarity-chat/clarity/discussions)

We're here to help! 🚀
