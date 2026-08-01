# Clarity Chat Examples

Commercial-grade example applications showcasing Clarity Chat capabilities.

<!-- visual-gallery -->

## 🖼️ The Examples, At A Glance

Every image below is a capture of that example running locally. Click one to open it.

<table>
<tr>
<td width="50%" valign="top">

#### [Quickstart](./quickstart)

Zero config, demo mode, works the moment it boots.

<a href="./quickstart"><img src="./quickstart/assets/demo.gif" alt="Quickstart example" width="100%" /></a>

`pnpm dev` → `localhost:3000`

</td>
<td width="50%" valign="top">

#### [Basic Chat](./basic-chat)

The smallest useful chat: header, messages, composer.

<a href="./basic-chat"><img src="./basic-chat/assets/demo.gif" alt="Basic Chat example" width="100%" /></a>

`pnpm dev` → `localhost:3000`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Custom Theming](./custom-theming)

Eight presets and a live preview that recolors instantly.

<a href="./custom-theming"><img src="./custom-theming/assets/demo.gif" alt="Custom Theming example" width="100%" /></a>

`pnpm dev` → `localhost:3003`

</td>
<td width="50%" valign="top">

#### [Enterprise AI Ops](./enterprise-ai-ops)

Requests, tokens, cost, latency, safety alerts.

<a href="./enterprise-ai-ops"><img src="./enterprise-ai-ops/assets/demo.gif" alt="Enterprise AI Ops example" width="100%" /></a>

`pnpm dev` → `localhost:3002`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Tool Calling](./tool-calling)

Weather, search, calculator and stock tools.

<a href="./tool-calling"><img src="./tool-calling/assets/demo.gif" alt="Tool Calling example" width="100%" /></a>

`pnpm dev` → `localhost:3004`

</td>
<td width="50%" valign="top">

#### [Accessibility](./accessibility)

WCAG 2.1 AA, contrast and motion controls.

<a href="./accessibility"><img src="./accessibility/assets/demo.gif" alt="Accessibility example" width="100%" /></a>

`pnpm dev` → `localhost:3005`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Security](./security-examples)

Prompt injection, PII and jailbreak validation.

<a href="./security-examples"><img src="./security-examples/assets/demo.gif" alt="Security example" width="100%" /></a>

`pnpm dev` → `localhost:3007`

</td>
<td width="50%" valign="top">

#### [Multi-Provider](./multi-provider)

Switch providers and models with live pricing.

<a href="./multi-provider"><img src="./multi-provider/assets/hero.png" alt="Multi-Provider example" width="100%" /></a>

`pnpm dev` → `localhost:3008`

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### [Headless Mode](./headless-mode)

Your markup, the library's chat state.

<a href="./headless-mode"><img src="./headless-mode/assets/demo.gif" alt="Headless Mode example" width="100%" /></a>

`pnpm dev` → `localhost:3010`

</td>
<td width="50%" valign="top">

#### [Token Optimization](./token-optimization)

TOON, compression and cache preparation.

<a href="./token-optimization"><img src="./token-optimization/assets/demo.gif" alt="Token Optimization example" width="100%" /></a>

`pnpm dev` → `localhost:3003`

</td>
</tr>
</table>

### Not pictured

These have no screenshot, and here is why:

- **[streaming-chat](./streaming-chat)** — does not currently boot — its `@/*` alias points at
  `./src/*` while the app Next.js serves lives in `./app`.
- **[advanced-features](./advanced-features)** — does not currently boot — it imports
  `useBatteryAware`, which `@clarity-chat/react` does not export.
- **[memory-examples](./memory-examples)** — runs as an Express/Fastify server and an interactive
  CLI, so there is no browser UI to capture.
- **[standalone](./standalone)** — is a set of copy-paste snippets rather than a runnable app.
- **[standalone-tools](./standalone-tools)** — is a set of copy-paste snippets rather than a
  runnable app.
- **[utils](./utils)** — is the shared helper package the other examples import, not a demo.

<!-- visual-gallery -->

## Getting Started

Each example is a standalone Next.js application that can be run independently:

```bash
cd examples/<example-name>
pnpm install
cp .env.example .env.local  # Add your API keys
pnpm dev
```

## Available Examples

### Start Here

| Example                        | Description                                | Time  | API Key Required |
| ------------------------------ | ------------------------------------------ | ----- | ---------------- |
| **[quickstart](./quickstart)** | **Works immediately - no API key needed!** | 5 min | No (demo mode)   |

### Runnable Examples

All examples below can be run with `pnpm dev`:

| Example                                  | Description                                  | Port | Complexity   |
| ---------------------------------------- | -------------------------------------------- | ---- | ------------ |
| [quickstart](./quickstart)               | Zero-config demo mode, upgrade to production | 3000 | Beginner     |
| [basic-chat](./basic-chat)               | Simplest chat implementation                 | 3000 | Beginner     |
| [streaming-chat](./streaming-chat)       | Advanced SSE with token metrics              | 3001 | Intermediate |
| [enterprise-ai-ops](./enterprise-ai-ops) | Enterprise AI operations dashboard           | 3002 | Advanced     |
| [custom-theming](./custom-theming)       | 8 preset themes with live preview            | 3003 | Beginner     |
| [tool-calling](./tool-calling)           | AI function calling with visual cards        | 3004 | Advanced     |
| [accessibility](./accessibility)         | WCAG 2.1 AA compliant interface              | 3005 | Intermediate |
| [advanced-features](./advanced-features) | Battery-aware & performance features         | 3006 | Advanced     |
| [security-examples](./security-examples) | Security validation & PII redaction          | 3007 | Intermediate |
| [multi-provider](./multi-provider)       | OpenAI, Anthropic, Google support            | 3008 | Intermediate |
| [headless-mode](./headless-mode)         | Core hooks only, bring your own UI           | 3010 | Advanced     |

### Reference Implementations

| Example                                    | Description                   |
| ------------------------------------------ | ----------------------------- |
| [memory-examples](./memory-examples)       | Context management patterns   |
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

### enterprise-ai-ops

- Real-time monitoring dashboard
- Model performance metrics
- Cost tracking and analytics
- Safety evaluation scores
- Request/response logging

### advanced-features

- Battery-aware streaming (reduces activity on low battery)
- Performance optimization dashboard
- Enhanced prompt suggestions
- Adaptive UI components
- Resource usage monitoring

### security-examples

- Prompt injection detection
- PII (Personal Identifiable Information) redaction
- Jailbreak prevention patterns
- Security event monitoring
- Configurable security policies

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
  "name": "@clarity-chat/example-my-new-example",
  "scripts": {
    "dev": "next dev -p 3009"
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

- Node.js 20+
- pnpm 10+ (required)
- OpenAI API key (most examples)
- Anthropic API key (multi-provider)
- Google AI API key (multi-provider)

## License

MIT
