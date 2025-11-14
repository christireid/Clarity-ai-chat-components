# Model Switching Demo

Showcase app highlighting how to toggle between providers and models on the fly.

## Features

- Unified adapter interface for OpenAI, Anthropic, and Google AI.
- Real-time cost and latency comparison per model.
- Persisted operator preferences across sessions.
- Safety guardrails with automatic fallback.

## Running Locally

```bash
cd examples/model-comparison-demo
npm install
npm run dev
```

The demo exposes a control panel with temperature, max tokens, and provider toggles. All state changes flow through the `useChat` hook, so switching models mid-conversation retains context.

## Key Components

- `ModelSelector` – surfaces provider and model dropdowns with cost hints.
- `ChatWindow` – displays the current transcript with streaming updates.
- `ModelStatsPanel` – visualises response time, token usage, and spend.

Review the source in `examples/model-comparison-demo` for implementation details and API integration patterns.
