# useClarityChat Documentation Index

Complete documentation for Clarity's flagship chat hook.

## 📚 Documentation

### Getting Started
- **[Quick Start](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Migrate from Vercel AI SDK
- **[useClarityChat README](./USECLARITYCHAT_README.md)** - Comprehensive overview

### Reference
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[TypeScript Guide](./TYPESCRIPT_GUIDE.md)** - Type definitions and patterns
- **[Performance Guide](./PERFORMANCE_GUIDE.md)** - Optimization strategies

### Implementation
- **[Phase 2 Complete](./PHASE_2_COMPLETE.md)** - Initial implementation summary
- **[Phase 2 Enhancements](./PHASE_2_ENHANCEMENTS.md)** - Memory strategy implementation
- **[Continuation Enhancements](./CONTINUATION_ENHANCEMENTS.md)** - Examples and tests
- **[Implementation Complete](./IMPLEMENTATION_COMPLETE.md)** - Final implementation summary

## 🚀 Quick Links

### For New Users
1. Start with [Quick Start](./QUICK_START.md)
2. Review [API Reference](./API_REFERENCE.md)
3. Check [Examples](../../apps/examples/use-clarity-chat-showcase/)

### For Vercel AI SDK Users
1. Read [Migration Guide](./MIGRATION_GUIDE.md)
2. See [API Compatibility](./MIGRATION_GUIDE.md#api-compatibility)
3. Try [Examples](../../apps/examples/vercel-ai-sdk-compatible/)

### For Advanced Users
1. Review [Performance Guide](./PERFORMANCE_GUIDE.md)
2. Study [TypeScript Guide](./TYPESCRIPT_GUIDE.md)
3. Explore [Storybook Stories](../../apps/storybook/stories/UseClarityChat.stories.tsx)

## 📖 Documentation Structure

```
packages/react/
├── QUICK_START.md              # Quick start guide
├── MIGRATION_GUIDE.md           # Vercel AI SDK migration
├── USECLARITYCHAT_README.md     # Comprehensive overview
├── API_REFERENCE.md              # Complete API docs
├── TYPESCRIPT_GUIDE.md           # TypeScript patterns
├── PERFORMANCE_GUIDE.md          # Performance optimization
├── DOCUMENTATION_INDEX.md        # This file
└── [Implementation docs]
```

## 🎯 Common Tasks

### Basic Chat Setup
See [Quick Start](./QUICK_START.md#basic-example)

### Enable Memory
See [Quick Start](./QUICK_START.md#with-memory)

### Choose Transport
See [API Reference](./API_REFERENCE.md#transport-protocols)

### Optimize Performance
See [Performance Guide](./PERFORMANCE_GUIDE.md)

### TypeScript Types
See [TypeScript Guide](./TYPESCRIPT_GUIDE.md)

## 📝 Examples

### Code Examples
- [Basic Example](../../apps/examples/use-clarity-chat-showcase/src/App.tsx)
- [Vercel-Compatible Example](../../apps/examples/vercel-ai-sdk-compatible/src/App.tsx)
- [Storybook Stories](../../apps/storybook/stories/UseClarityChat.stories.tsx)

### Example Apps
- [Showcase Example](../../apps/examples/use-clarity-chat-showcase/)
- [Vercel-Compatible Examples](../../apps/examples/vercel-ai-sdk-compatible/)

## 🔗 Related Documentation

- [Clarity vs Vercel AI SDK Audit](../../CLARITY_VS_VERCEL_AI_SDK_AUDIT.md)
- [React Package Index](../react/src/index.ts)
- [Memory Package](../../packages/memory/README.md)

## 💡 Tips

1. **Start Simple**: Begin with basic `useClarityChat` without memory
2. **Add Memory Gradually**: Enable memory after basic setup works
3. **Choose Strategy Wisely**: Use `sliding-window` for most cases
4. **Monitor Performance**: Use React DevTools Profiler
5. **Read Error Messages**: They provide helpful context

## 🆘 Need Help?

- Check [API Reference](./API_REFERENCE.md) for specific options
- Review [Examples](../../apps/examples/) for patterns
- See [Performance Guide](./PERFORMANCE_GUIDE.md) for optimization
- Read [TypeScript Guide](./TYPESCRIPT_GUIDE.md) for type issues
