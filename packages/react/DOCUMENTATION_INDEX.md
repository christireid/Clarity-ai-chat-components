# Clarity React Library Documentation Index

Complete documentation for Clarity's React library, including all phases and features.

## 📚 Documentation

### Getting Started
- **[Getting Started Guide](./GETTING_STARTED.md)** - Complete guide covering all features ⭐ **START HERE**
- **[Quick Start](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Migrate from Vercel AI SDK
- **[useClarityChat README](./USECLARITYCHAT_README.md)** - Comprehensive overview

### Reference
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[TypeScript Guide](./TYPESCRIPT_GUIDE.md)** - Type definitions and patterns
- **[Performance Guide](./PERFORMANCE_GUIDE.md)** - Optimization strategies

### Phase-Specific Documentation
- **[Phase 3 README](./README_PHASE_3.md)** - Structured output & tool UI registry
- **[Phase 3 Examples](./PHASE_3_EXAMPLES.md)** - Usage patterns and examples
- **[Phase 3 Summary](./PHASE_3_SUMMARY.md)** - Comparison to Vercel AI SDK
- **[All Phases Summary](./ALL_PHASES_SUMMARY.md)** - Complete overview of all phases

### Implementation
- **[Phase 2 Complete](./PHASE_2_COMPLETE.md)** - Initial implementation summary
- **[Phase 2 Enhancements](./PHASE_2_ENHANCEMENTS.md)** - Memory strategy implementation
- **[Continuation Enhancements](./CONTINUATION_ENHANCEMENTS.md)** - Examples and tests
- **[Implementation Complete](./IMPLEMENTATION_COMPLETE.md)** - Final implementation summary

## 🚀 Quick Links

### For New Users
1. Start with [Getting Started Guide](./GETTING_STARTED.md) ⭐
2. Review [API Reference](./API_REFERENCE.md)
3. Check [Examples](../../apps/examples/use-clarity-chat-showcase/)

### For Vercel AI SDK Users
1. Read [Migration Guide](./MIGRATION_GUIDE.md)
2. See [API Compatibility](./MIGRATION_GUIDE.md#api-compatibility)
3. Try [Examples](../../apps/examples/vercel-ai-sdk-compatible/)

### For Advanced Users
1. Review [Performance Guide](./PERFORMANCE_GUIDE.md)
2. Study [TypeScript Guide](./TYPESCRIPT_GUIDE.md)
3. Explore [Phase 3 Features](./README_PHASE_3.md) - Structured output & tool UI
4. Explore [Storybook Stories](../../apps/storybook/stories/UseClarityChat.stories.tsx)

## 📖 Documentation Structure

```
packages/react/
├── GETTING_STARTED.md            # Complete getting started guide ⭐
├── QUICK_START.md                # Quick start guide
├── MIGRATION_GUIDE.md             # Vercel AI SDK migration
├── USECLARITYCHAT_README.md       # Comprehensive overview
├── API_REFERENCE.md               # Complete API docs
├── TYPESCRIPT_GUIDE.md            # TypeScript patterns
├── PERFORMANCE_GUIDE.md           # Performance optimization
├── README_PHASE_3.md              # Phase 3 features
├── PHASE_3_EXAMPLES.md            # Phase 3 examples
├── ALL_PHASES_SUMMARY.md          # All phases overview
├── DOCUMENTATION_INDEX.md         # This file
└── [Implementation docs]
```

## 🎯 Common Tasks

### Basic Chat Setup
See [Getting Started](./GETTING_STARTED.md#basic-chat) or [Quick Start](./QUICK_START.md#basic-example)

### Enable Memory
See [Getting Started](./GETTING_STARTED.md#memory-integration) or [Quick Start](./QUICK_START.md#with-memory)

### Structured Output
See [Getting Started](./GETTING_STARTED.md#structured-output) or [Phase 3 README](./README_PHASE_3.md)

### Tool UI Registry
See [Getting Started](./GETTING_STARTED.md#tool-ui-registry) or [Phase 3 Examples](./PHASE_3_EXAMPLES.md)

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
