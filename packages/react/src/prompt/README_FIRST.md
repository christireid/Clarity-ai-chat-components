# 👋 Welcome to Prompt & Token Optimization

**Start here if you're new to this feature.**

## What Is This?

A powerful, optional layer that automatically optimizes your chat prompts to:
- ✅ Stay within token budgets
- ✅ Reduce costs
- ✅ Improve model performance
- ✅ Preserve important context

## Quick Start (30 seconds)

```tsx
import { useClarityChat } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
  },
})
```

**That's it!** Your chat now optimizes prompts automatically.

## Choose Your Path

### 🎯 I want to get started quickly
→ Read [GETTING_STARTED.md](./GETTING_STARTED.md) (5 minutes)

### 📖 I want to understand how it works
→ Read [README.md](./README.md) (full documentation)

### 🚀 I want to see code examples
→ Read [QUICK_START.md](./QUICK_START.md) (code snippets)

### ⚙️ I need setup help
→ Read [SETUP.md](./SETUP.md) (configuration guide)

### 🔬 I want advanced features
→ Read [ADVANCED.md](./ADVANCED.md) (Phase 2 features)

## Key Features

- **Zero Configuration**: Works out of the box
- **Opt-in Design**: Doesn't affect existing code
- **Model-Aware**: Works with GPT, Claude, Gemini, Mistral, and more
- **Smart Optimization**: Preserves important messages automatically
- **Cost-Aware**: Helps reduce API costs
- **TypeScript**: Full type safety

## Common Use Cases

1. **Keep conversations under token limits**
   ```tsx
   promptOptimization: { enabled: true, targetTokens: 4000 }
   ```

2. **Reduce API costs**
   ```tsx
   promptOptimization: { enabled: true, targetTokens: 2000, model: 'gpt-3.5-turbo' }
   ```

3. **Preserve important context**
   ```tsx
   promptOptimization: { enabled: true, strategy: 'hybrid' }
   ```

4. **Track token usage**
   ```tsx
   const chat = useClarityChat({ promptOptimization: { enabled: true } })
   console.log(chat.tokenStats?.inputTokens)
   ```

## Examples

- **Basic**: `apps/examples/prompt-optimization-example.tsx`
- **Advanced**: `apps/examples/advanced-prompt-optimization-example.tsx`

## Documentation Structure

```
GETTING_STARTED.md  ← Start here (5-min guide)
README.md           ← Full documentation
QUICK_START.md      ← Code snippets
SETUP.md            ← Configuration
ADVANCED.md         ← Phase 2 features
EXPORTS.md          ← API reference
TYPES.md            ← Type reference
```

## Need Help?

1. Check [GETTING_STARTED.md](./GETTING_STARTED.md) for step-by-step guide
2. See [SETUP.md](./SETUP.md) for configuration help
3. Review examples in `apps/examples/`
4. Read [README.md](./README.md) for full documentation

---

**Ready to start?** → [GETTING_STARTED.md](./GETTING_STARTED.md)
