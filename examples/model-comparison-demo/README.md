# Model Comparison Demo

Compare AI model responses side-by-side with real-time streaming using Clarity Chat.

## Features

- **Side-by-Side Comparison**: Compare responses from different AI models simultaneously
- **Real-time Streaming**: See tokens appear in real-time for both models
- **Cost & Performance Metrics**: Track response time and estimated costs
- **Model Selector**: Choose from 9 AI models across 3 providers (OpenAI, Anthropic, Google)
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Dark Mode**: Full dark mode support

## Tech Stack

- **Next.js 15** - React framework with App Router
- **Clarity Chat** - AI chat component library
  - `@clarity-chat/react` - UI components
  - Model adapters (OpenAI, Anthropic, Google AI)
  - Streaming components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

From the project root:

```bash
# Install dependencies
npm install

# Navigate to demo directory
cd examples/model-comparison-demo

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Environment Variables

For real AI integration, create `.env.local`:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google AI
GOOGLE_API_KEY=AIza...
```

## How It Works

### Model Selection

Choose any two models from:
- **OpenAI**: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- **Anthropic**: Claude 3 Opus, Sonnet, Haiku
- **Google**: Gemini Pro, Gemini Vision

### Streaming Comparison

1. Enter a prompt in the text area
2. Click "Compare Models" or press Enter
3. Watch as both models stream their responses simultaneously
4. See real-time metrics (time, cost, tokens)

### Metrics Tracked

- **Response Time**: How long each model takes to complete
- **Estimated Cost**: Calculated using provider-specific pricing
- **Token Count**: Approximate number of tokens generated
- **Performance Comparison**: Automatic winner selection

## Code Examples

### Basic Model Comparison

```tsx
import { ModelSelector, StreamingMessage, allModels } from '@clarity-chat/react'

function ComparisonView() {
  const [model, setModel] = useState('gpt-4-turbo')
  const [response, setResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  return (
    <div>
      <ModelSelector
        models={allModels}
        value={model}
        onChange={(id) => setModel(id)}
        showMetrics
      />
      
      <StreamingMessage
        content={response}
        isStreaming={isStreaming}
      />
    </div>
  )
}
```

### Streaming with Model Adapter

```tsx
import { openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

// Stream from OpenAI
const config = { 
  provider: 'openai', 
  model: 'gpt-4-turbo',
  apiKey: process.env.OPENAI_API_KEY 
}

for await (const chunk of openAIAdapter.stream(messages, config)) {
  if (chunk.type === 'token') {
    setResponse(prev => prev + chunk.content)
  } else if (chunk.type === 'done') {
    const cost = openAIAdapter.estimateCost(chunk.usage, config.model)
    console.log(`Cost: $${cost.toFixed(4)}`)
  }
}
```

### Cost Estimation

```tsx
import { openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

const usage = { 
  promptTokens: 1000, 
  completionTokens: 500,
  totalTokens: 1500 
}

// GPT-4 Turbo: $0.025
const gpt4Cost = openAIAdapter.estimateCost(usage, 'gpt-4-turbo')

// Claude 3 Sonnet: $0.0105
const claudeCost = anthropicAdapter.estimateCost(usage, 'claude-3-sonnet')

console.log(`Savings: ${((gpt4Cost - claudeCost) / gpt4Cost * 100).toFixed(1)}%`)
// Savings: 58.0%
```

## Features Demonstrated

### 1. Model Adapter System
- Unified API for multiple providers
- Easy provider switching
- Consistent streaming interface

### 2. Streaming Components
- `StreamingMessage` - Real-time token display
- `ModelSelector` - Visual model picker with metrics
- Cursor animation during streaming
- Performance metrics display

### 3. Cost Optimization
- Real-time cost estimation
- Side-by-side cost comparison
- Percentage savings calculation
- Per-token pricing transparency

### 4. Developer Experience
- Type-safe APIs
- Comprehensive error handling
- Responsive design
- Dark mode support
- Keyboard shortcuts

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables for Production

Set these in your deployment platform:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `NEXT_PUBLIC_API_URL` (optional)

## Customization

### Change Models

Edit the model list in `page.tsx`:

```tsx
const models = allModels.filter(m => 
  m.provider === 'openai' || m.provider === 'anthropic'
)
```

### Add Custom Metrics

Track additional metrics in the comparison:

```tsx
const [accuracy, setAccuracy] = useState(0)
const [creativity, setCreativity] = useState(0)
```

### Styling

Customize colors in `tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    },
  },
}
```

## Troubleshooting

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Streaming Not Working

Check that API keys are set:

```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Build Errors

```bash
# Type check
npm run typecheck

# Lint
npm run lint
```

## Learn More

- [Clarity Chat Documentation](https://clarity-chat.dev/docs)
- [Model Adapters Guide](https://clarity-chat.dev/guide/model-adapters)
- [Streaming Guide](https://clarity-chat.dev/guide/streaming)
- [API Reference](https://clarity-chat.dev/api/model-adapters)

## License

MIT

## Contributing

Contributions are welcome! Please read the [contributing guide](../../CONTRIBUTING.md) first.

## Support

- [GitHub Issues](https://github.com/yourusername/clarity-chat/issues)
- [Documentation](https://clarity-chat.dev)
- [Discord Community](https://discord.gg/clarity-chat)
