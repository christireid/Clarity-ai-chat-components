# Multi-Provider Chat

> Switch between OpenAI, Anthropic Claude, and Google Gemini with a unified interface.

## Features

- Provider switching (OpenAI, Anthropic, Google)
- Model selection per provider
- Cost comparison display
- Context window visualization
- Automatic provider availability detection
- Unified streaming interface

## Quick Start

```bash
# Clone the example
npx degit clarity-chat/clarity-chat/examples/multi-provider my-multi-provider-app
cd my-multi-provider-app

# Install dependencies
pnpm install

# Set up environment (add at least one API key)
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) to see the demo.

## Environment Variables

At least one API key is required:

```bash
# OpenAI - https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-key

# Anthropic - https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Google - https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=your-google-key
```

## What You'll Learn

1. How to abstract multiple AI providers
2. Provider-specific streaming implementations
3. Model configuration and cost tracking
4. Dynamic provider availability detection

## Key Code

### Provider Abstraction

```typescript
// lib/providers.ts
export const PROVIDERS = {
  openai: { name: 'OpenAI', icon: '🤖', ... },
  anthropic: { name: 'Anthropic', icon: '🧠', ... },
  google: { name: 'Google', icon: '✨', ... },
}

export const MODELS: ModelInfo[] = [
  { id: 'gpt-4-turbo', provider: 'openai', ... },
  { id: 'claude-3-5-sonnet', provider: 'anthropic', ... },
  { id: 'gemini-1.5-pro', provider: 'google', ... },
]
```

### Unified API Route

```typescript
// app/api/chat/route.ts
switch (provider) {
  case 'openai':
    await streamOpenAI(messages, model, controller, encoder)
    break
  case 'anthropic':
    await streamAnthropic(messages, model, controller, encoder)
    break
  case 'google':
    await streamGoogle(messages, model, controller, encoder)
    break
}
```

### Provider Detection

```typescript
// Check which providers have API keys configured
export async function GET() {
  return Response.json({
    available: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      google: !!process.env.GOOGLE_API_KEY,
    },
  })
}
```

## Project Structure

```
multi-provider/
├── app/
│   ├── api/chat/route.ts       # Unified API with provider routing
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── multi-provider-chat.tsx # Main component (~400 lines)
├── lib/
│   └── providers.ts            # Provider and model definitions
├── .env.example
└── README.md
```

## Available Models

### OpenAI

- **GPT-4 Turbo** - Most capable, 128K context
- **GPT-4o** - Fast multimodal, 128K context
- **GPT-3.5 Turbo** - Cost-effective, 16K context

### Anthropic

- **Claude 3 Opus** - Most intelligent, 200K context
- **Claude 3.5 Sonnet** - Best balance, 200K context
- **Claude 3 Haiku** - Fastest, 200K context

### Google

- **Gemini 1.5 Pro** - 2M context window
- **Gemini 1.5 Flash** - Fast, 1M context

## Customization

### Add a New Provider

1. Add to `lib/providers.ts`:

```typescript
export const PROVIDERS = {
  // ...existing
  newprovider: {
    name: 'New Provider',
    icon: '🆕',
    color: 'rgb(100, 100, 100)',
    description: 'New AI provider',
  },
}
```

2. Add models:

```typescript
{
  id: 'new-model-id',
  name: 'New Model',
  provider: 'newprovider',
  // ...
}
```

3. Implement streaming in `app/api/chat/route.ts`

### Customize Cost Display

Edit the ModelSelector component to show different cost metrics:

```typescript
<span className="text-xs text-muted-foreground">
  ~${((model.costPer1kInput + model.costPer1kOutput) * 2).toFixed(4)}/msg
</span>
```

## Related Examples

- [basic-chat](../basic-chat) - Single provider implementation
- [streaming-chat](../streaming-chat) - Advanced streaming features
- [token-optimization](../token-optimization) - Cost optimization

## Tech Stack

- [Next.js 15](https://nextjs.org)
- [React 19](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [OpenAI SDK](https://github.com/openai/openai-node)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Google Generative AI](https://github.com/google/generative-ai-js)

## License

MIT
