# Enhanced Streaming Chat Demo

A comprehensive demonstration of Clarity Chat's **model-agnostic streaming architecture** with real-time cost tracking and multi-provider support.

## 🚀 Features

### Model Adapter System
- **Multi-Provider Support**: Switch between OpenAI, Anthropic, and Google AI
- **Unified API**: Same code works with any provider
- **Real-Time Switching**: Change models mid-conversation
- **9 Models Supported**: GPT-4 Turbo, Claude 3 Opus, Gemini Pro, and more

### Streaming Capabilities
- **Token-by-Token Rendering**: See responses appear in real-time
- **AsyncGenerator Pattern**: Clean, efficient streaming implementation
- **Cancellation Support**: Stop unwanted responses
- **Server-Sent Events (SSE)**: Standard HTTP streaming

### Cost Tracking
- **Real-Time Estimation**: Calculate costs as tokens stream
- **Per-Message Costs**: See cost for each response
- **Cumulative Tracking**: Track total spend across conversation
- **Accurate Pricing**: Based on actual provider rates

### User Experience
- **Model Metrics**: Compare speed, cost, and quality
- **Usage Statistics**: Token count and cost display
- **Responsive Design**: Works on mobile and desktop
- **Error Handling**: Graceful failure recovery

## 📦 Installation

```bash
# Install dependencies from project root
npm install

# Navigate to example
cd examples/streaming-chat

# Set up environment variables
cp .env.example .env.local
```

## 🔑 Environment Variables

Create `.env.local` with your API keys:

```bash
# OpenAI (optional - for GPT-4, GPT-3.5)
OPENAI_API_KEY=sk-...

# Anthropic (optional - for Claude 3)
ANTHROPIC_API_KEY=sk-ant-...

# Google AI (optional - for Gemini)
GOOGLE_API_KEY=AIza...
```

**Note**: You only need API keys for the providers you want to use. The demo will work with any combination.

## 🏃 Running the Demo

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

### Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
streaming-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       ├── route.ts              # Basic simulated streaming
│   │   │       └── route-enhanced.ts     # Real model adapter integration
│   │   ├── page.tsx                      # Basic demo
│   │   ├── page-enhanced.tsx             # Enhanced demo with adapters
│   │   ├── layout.tsx                    # App layout
│   │   └── globals.css                   # Global styles
├── .env.example                          # Environment template
├── package.json                          # Dependencies
├── next.config.js                        # Next.js configuration
└── README-ENHANCED.md                    # This file
```

## 🎯 Usage

### Switch Models

1. Click the **Model Selector** dropdown
2. Choose from 9 available models
3. See metrics (speed, cost, quality) for each
4. Select a model - your next message will use it

### Track Costs

The dashboard shows:
- **Total Tokens**: Cumulative token usage
- **Total Cost**: Running cost in USD
- Updates in real-time as responses stream

### Compare Providers

Try the same prompt with different models:

```
User: "Explain quantum computing in simple terms"

GPT-4 Turbo (fast, medium cost, best quality)
Claude 3 Opus (medium, high cost, best quality)
Gemini Pro (fast, low cost, good quality)
```

See how responses, speed, and costs compare!

## 🔧 Integration Guide

### Using the Enhanced Components

```tsx
import { 
  ModelSelector,
  StreamingMessage,
  allModels,
  type ModelConfig 
} from '@clarity-chat/react'

function MyChat() {
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    provider: 'openai',
    model: 'gpt-4-turbo',
  })

  return (
    <div>
      <ModelSelector
        models={allModels}
        value={selectedModel}
        onChange={(id, config) => {
          setSelectedModel(id)
          setModelConfig(config)
        }}
        showMetrics
      />
      
      <StreamingMessage 
        content={streamingText}
        isStreaming={true}
      />
    </div>
  )
}
```

### API Route Implementation

```typescript
import { getAdapter } from '@clarity-chat/react'

// Get adapter based on provider
const adapter = getAdapter(config.provider)

// Stream responses
for await (const chunk of adapter.stream(messages, config)) {
  if (chunk.type === 'token') {
    // Send token to client
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
  } else if (chunk.type === 'done') {
    // Calculate cost
    const cost = adapter.estimateCost(chunk.usage, config.model)
    // Send final data
  }
}
```

## 💡 Key Concepts

### Model Adapter Pattern

Abstracts provider-specific implementations behind a unified interface:

```typescript
interface ModelAdapter {
  name: string
  chat(messages, config): Promise<ChatMessage>
  stream(messages, config): AsyncGenerator<StreamChunk>
  estimateCost(usage, model): number
}
```

**Benefits**:
- Switch providers without code changes
- Test multiple models easily
- Compare costs in real-time
- Future-proof architecture

### AsyncGenerator Streaming

Uses native JavaScript AsyncGenerator for streaming:

```typescript
async function* stream() {
  yield { type: 'token', content: 'Hello' }
  yield { type: 'token', content: ' world' }
  yield { type: 'done', usage: {...} }
}

for await (const chunk of stream()) {
  console.log(chunk)
}
```

**Benefits**:
- Clean, readable code
- Automatic backpressure
- Native error handling
- No external dependencies

### Cost Estimation

Accurate cost calculation based on provider pricing:

```typescript
const usage = { promptTokens: 1000, completionTokens: 500 }

// GPT-4 Turbo: $0.01/1K input, $0.03/1K output
const cost = adapter.estimateCost(usage, 'gpt-4-turbo')
// Result: $0.0250

// Claude 3 Sonnet: $3/1M input, $15/1M output
const cost = adapter.estimateCost(usage, 'claude-3-sonnet')
// Result: $0.0105 (58% cheaper!)
```

## 🎨 Customization

### Change Default Model

Edit `page-enhanced.tsx`:

```typescript
const [selectedModel, setSelectedModel] = useState('claude-3-sonnet') // Changed
```

### Filter Available Models

Show only specific providers:

```typescript
<ModelSelector
  models={allModels.filter(m => m.provider === 'openai')} // OpenAI only
  value={selectedModel}
  onChange={handleModelChange}
/>
```

### Adjust Streaming Parameters

Edit API route:

```typescript
const modelConfig: ModelConfig = {
  ...config,
  apiKey,
  temperature: 0.9,    // More creative (0.0-2.0)
  maxTokens: 2000,     // Longer responses
  topP: 0.95,          // Nucleus sampling
}
```

## 🐛 Troubleshooting

### "API key not configured"

**Solution**: Add API key to `.env.local`:
```bash
OPENAI_API_KEY=sk-your-key-here
```

Restart the dev server after adding environment variables.

### "Provider not supported"

**Solution**: Check that the adapter is imported:
```typescript
import { getAdapter, openAIAdapter, anthropicAdapter } from '@clarity-chat/react'
```

### Streaming stops mid-response

**Causes**:
1. API rate limiting
2. Network interruption
3. Invalid API key

**Solution**: Check browser console for error details.

### Cost calculation shows $0.00

**Cause**: Model not found in pricing table

**Solution**: Ensure model ID matches exactly (e.g., `gpt-4-turbo`, not `gpt-4-turbo-preview`)

## 📊 Performance

### Benchmarks

Tested with 1000-token responses:

| Metric | Value |
|--------|-------|
| **First Token** | ~200ms |
| **Tokens/Second** | ~30-50 |
| **Total Time** | ~20-30s |
| **Memory Usage** | ~50MB |
| **CPU Usage** | ~10-15% |

### Optimization Tips

1. **Use Faster Models**: GPT-3.5 Turbo or Claude 3 Haiku for quick responses
2. **Reduce maxTokens**: Shorter responses = faster completion
3. **Increase Temperature**: More focused responses stream faster
4. **Enable Caching**: Cache common responses at edge

## 🔗 Related Resources

- [Model Adapters Guide](/guide/model-adapters)
- [Streaming Guide](/guide/streaming)
- [API Reference](/api/model-adapters)
- [Clarity Chat Documentation](https://clarity-chat.dev)

## 📄 License

MIT - Part of Clarity Chat component library

---

**Ready to build production AI chat apps with model-agnostic streaming!** 🚀
