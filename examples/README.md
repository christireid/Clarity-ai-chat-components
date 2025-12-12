# Clarity Chat Examples

Commercial-grade example applications showcasing Clarity Chat capabilities.

## Getting Started

Each example is a standalone Next.js application that can be run independently:

```bash
cd examples/<example-name>
pnpm install
cp .env.example .env.local  # Add your API keys
pnpm dev
```

## Available Examples

### Core Examples

| Example                            | Description                           | Port | Complexity   |
| ---------------------------------- | ------------------------------------- | ---- | ------------ |
| [basic-chat](./basic-chat)         | Simplest chat implementation          | 3000 | Beginner     |
| [streaming-chat](./streaming-chat) | Advanced SSE with token metrics       | 3001 | Intermediate |
| [multi-provider](./multi-provider) | OpenAI, Anthropic, Google support     | 3002 | Intermediate |
| [custom-theming](./custom-theming) | 8 preset themes with live preview     | 3003 | Beginner     |
| [tool-calling](./tool-calling)     | AI function calling with visual cards | 3004 | Advanced     |
| [accessibility](./accessibility)   | WCAG 2.1 AA compliant interface       | 3005 | Intermediate |

### Reference Implementations

| Example                                    | Description                   |
| ------------------------------------------ | ----------------------------- |
| [memory-examples](./memory-examples)       | Context management patterns   |
| [security-examples](./security-examples)   | Security best practices       |
| [advanced-features](./advanced-features)   | Advanced component usage      |
| [token-optimization](./token-optimization) | Cost optimization strategies  |
| [standalone](./standalone)                 | Vanilla JS integration        |
| [utils](./utils)                           | Utility functions and helpers |

## Example Features

### basic-chat

- Message state management
- SSE streaming responses
- Error handling
- Loading states
- Accessibility patterns

### streaming-chat

- Real-time token counting
- Stream cancellation (AbortController)
- Retry on failure
- Stream speed metrics (tokens/sec)
- Connection status indicator

### multi-provider

- Provider selector (OpenAI, Anthropic, Google)
- Model comparison
- Cost estimation
- Context window visualization
- Automatic fallback

### custom-theming

- 8 preset themes (4 light, 4 dark)
- Live theme preview
- CSS variable export
- Custom color picker
- Theme persistence

### tool-calling

- 4 built-in tools (weather, search, calculator, stock)
- Visual tool execution cards
- Real-time execution status
- Custom result renderers
- Multi-turn tool conversations

### accessibility

- Full keyboard navigation
- Screen reader announcements
- High contrast mode
- Large font mode
- Reduced motion support
- WCAG 2.1 AA compliance

## Project Structure

Each example follows this structure:

```
example-name/
├── app/
│   ├── api/chat/route.ts    # API endpoint
│   ├── globals.css          # Styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── main-component.tsx   # Primary component
│   └── error-boundary.tsx   # Error handling
├── lib/                     # Utilities (if needed)
├── .env.example             # Environment template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Running Multiple Examples

Start multiple examples simultaneously:

```bash
# Terminal 1
cd examples/basic-chat && pnpm dev

# Terminal 2
cd examples/streaming-chat && pnpm dev

# Terminal 3
cd examples/tool-calling && pnpm dev
```

Or use a process manager:

```bash
# Using concurrently
pnpm add -g concurrently
concurrently \
  "cd basic-chat && pnpm dev" \
  "cd streaming-chat && pnpm dev" \
  "cd multi-provider && pnpm dev"
```

## Customization Guide

### Adding a New Example

1. Copy an existing example as a template:

```bash
cp -r basic-chat my-new-example
```

2. Update `package.json`:

```json
{
  "name": "my-new-example",
  "scripts": {
    "dev": "next dev -p 3006"
  }
}
```

3. Customize the components and API routes

4. Add documentation in README.md

### Connecting to Real APIs

Replace simulated functions with real API calls:

```typescript
// Before (simulated)
async function getWeather(location: string) {
  return { temp: 72, condition: 'Sunny' }
}

// After (real API)
async function getWeather(location: string) {
  const res = await fetch(`https://api.weather.com/v1?location=${location}`, {
    headers: { 'API-Key': process.env.WEATHER_API_KEY },
  })
  return res.json()
}
```

## Requirements

- Node.js 18+
- pnpm (recommended) or npm
- OpenAI API key (most examples)
- Anthropic API key (multi-provider)
- Google AI API key (multi-provider)

## License

MIT
