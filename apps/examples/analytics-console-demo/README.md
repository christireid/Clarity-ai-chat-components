# Analytics Console Demo

**Token Usage Tracking & Cost Analytics for AI Applications**

A comprehensive analytics dashboard for monitoring AI API usage, tracking costs, and optimizing token consumption across multiple models and providers.

## 🎯 What This Demonstrates

- **Usage Tracking**: Log every AI request with tokens, costs, and metadata
- **Cost Analytics**: Real-time cost calculations across providers
- **Performance Metrics**: Response times, token efficiency, error rates
- **Model Comparison**: Compare costs and performance across models
- **Data Visualization**: Charts and graphs for usage patterns
- **Budget Monitoring**: Set limits and receive alerts

## 🚀 Features

### 1. Request Logging
- Capture all AI API requests
- Track tokens (input/output/total)
- Calculate costs per request
- Store metadata (model, provider, user)
- Response time monitoring

### 2. Analytics Dashboard
- **Total Usage**: Cumulative tokens and costs
- **Daily Breakdown**: Usage trends over time
- **Model Distribution**: Which models are used most
- **Cost by Provider**: OpenAI vs Anthropic vs Google
- **Token Efficiency**: Tokens per request averages

### 3. Data Visualizations
- Line charts for usage trends
- Pie charts for model distribution
- Bar charts for cost comparison
- Heatmaps for usage patterns
- Export data as CSV/JSON

### 4. Budget Management
- Set monthly budget limits
- Real-time spending alerts
- Projected monthly costs
- Budget utilization percentage
- Email/webhook notifications

## 📋 Quick Start

### 1. Install Dependencies

```bash
cd examples/analytics-console-demo
npm install --legacy-peer-deps
```

### 2. Set Up API Keys

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003)

## 🏗️ Architecture

### Data Model

```typescript
interface AnalyticsEntry {
  id: string
  timestamp: Date
  provider: 'openai' | 'anthropic' | 'google'
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  responseTime: number
  userId?: string
  metadata?: Record<string, any>
}

interface DailySummary {
  date: string
  totalRequests: number
  totalTokens: number
  totalCost: number
  byProvider: Record<string, {
    requests: number
    tokens: number
    cost: number
  }>
  byModel: Record<string, {
    requests: number
    tokens: number
    cost: number
  }>
}
```

### API Endpoints

```
POST   /api/analytics/log       - Log new AI request
GET    /api/analytics/summary   - Get aggregate stats
GET    /api/analytics/daily     - Get daily breakdown
GET    /api/analytics/models    - Get model-specific stats
GET    /api/analytics/export    - Export data as CSV
DELETE /api/analytics/clear     - Clear all data (dev only)
```

## 💡 Usage Examples

### Log an AI Request

```typescript
// After making an AI request
await fetch('/api/analytics/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'openai',
    model: 'gpt-4-turbo',
    promptTokens: 150,
    completionTokens: 300,
    cost: 0.0105,
    responseTime: 2500,
    metadata: {
      endpoint: '/api/chat',
      userId: 'user-123'
    }
  })
})
```

### Get Summary Stats

```typescript
const response = await fetch('/api/analytics/summary')
const data = await response.json()

console.log(`Total Requests: ${data.totalRequests}`)
console.log(`Total Cost: $${data.totalCost.toFixed(4)}`)
console.log(`Average Tokens: ${data.avgTokensPerRequest}`)
```

### Get Daily Breakdown

```typescript
const response = await fetch('/api/analytics/daily?days=30')
const dailyData = await response.json()

// Display in chart
dailyData.forEach(day => {
  console.log(`${day.date}: ${day.totalRequests} requests, $${day.totalCost}`)
})
```

## 📊 Dashboard Screens

### 1. Overview
- Total requests (all-time)
- Total tokens consumed
- Total cost
- Average cost per request
- Current month spending
- Budget utilization

### 2. Usage Trends
- Line chart: Requests over time
- Line chart: Tokens over time
- Line chart: Cost over time
- Selectable time range (7/30/90 days)

### 3. Model Analytics
- Pie chart: Model usage distribution
- Bar chart: Cost by model
- Table: Model efficiency metrics
- Most/least expensive models

### 4. Provider Comparison
- Pie chart: Provider usage share
- Bar chart: Cost by provider
- Table: Provider statistics
- Recommendations

### 5. Recent Activity
- Live feed of recent requests
- Real-time updates
- Detailed request viewer
- Search and filter

## 🎨 UI Components

### Summary Cards
```tsx
<SummaryCard
  title="Total Requests"
  value="15,234"
  change="+12.5%"
  icon="📊"
/>
```

### Usage Chart
```tsx
<UsageChart
  data={dailyData}
  metric="tokens"
  timeRange="30d"
/>
```

### Model Distribution
```tsx
<ModelPieChart
  data={modelStats}
  showPercentages={true}
/>
```

### Activity Feed
```tsx
<ActivityFeed
  entries={recentEntries}
  limit={50}
  realTime={true}
/>
```

## 📈 Cost Calculation

### Pricing Tables (per 1K tokens)

**OpenAI**:
- GPT-4 Turbo: $0.01 input, $0.03 output
- GPT-3.5 Turbo: $0.0015 input, $0.002 output

**Anthropic**:
- Claude 3 Opus: $0.015 input, $0.075 output
- Claude 3 Sonnet: $0.003 input, $0.015 output
- Claude 3 Haiku: $0.00025 input, $0.00125 output

**Google**:
- Gemini Pro: $0.00025 input, $0.0005 output

### Calculation Example
```typescript
function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): number {
  const pricing = PRICING_TABLE[model]
  return (
    (promptTokens * pricing.input / 1000) +
    (completionTokens * pricing.output / 1000)
  )
}
```

## 🧪 Testing

### Generate Test Data

```bash
# Generate 100 random analytics entries
npm run test:generate-data
```

### Manual Test

```bash
# Log a test request
curl -X POST http://localhost:3003/api/analytics/log \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "promptTokens": 50,
    "completionTokens": 100,
    "cost": 0.000225,
    "responseTime": 1500
  }'

# Get summary
curl http://localhost:3003/api/analytics/summary
```

## 🚀 Deployment

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_API_KEY=your_key

# Optional
ANALYTICS_RETENTION_DAYS=90
BUDGET_LIMIT_USD=100
ALERT_EMAIL=admin@example.com
```

### Vercel Deployment

```bash
npm run build
npx vercel --prod

# Set environment variables in Vercel dashboard
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["npm", "start"]
```

## 📊 Integration with Clarity Chat

### Automatic Logging

Wrap Clarity Chat components to auto-log:

```typescript
import { ChatInterface } from '@clarity-chat/react'
import { logAnalytics } from '@/lib/analytics'

export function AnalyticsWrappedChat() {
  const handleStream = async (message, config) => {
    const startTime = Date.now()
    
    // Make AI request
    const result = await streamChat(message, config)
    
    // Log analytics
    await logAnalytics({
      provider: config.provider,
      model: config.model,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
      cost: result.cost,
      responseTime: Date.now() - startTime
    })
    
    return result
  }
  
  return <ChatInterface onSend={handleStream} />
}
```

### Middleware Logging

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
    const response = await next()
    
    // Extract usage from response headers
    const usage = response.headers.get('x-ai-usage')
    if (usage) {
      await logAnalytics(JSON.parse(usage))
    }
    
    return response
  }
}
```

## 🔧 Configuration

### Analytics Settings

```typescript
// analytics.config.ts
export const ANALYTICS_CONFIG = {
  retention: 90, // days
  aggregateInterval: 3600, // seconds (1 hour)
  enableRealTime: true,
  budget: {
    monthly: 100, // USD
    alertThreshold: 0.8, // 80%
    notifyEmail: true
  },
  export: {
    format: 'csv', // or 'json'
    includeMetadata: true
  }
}
```

## 📝 Best Practices

1. **Privacy**: Don't log sensitive user data
2. **Retention**: Set appropriate data retention policies
3. **Aggregation**: Pre-aggregate for better performance
4. **Caching**: Cache summary stats (5-minute TTL)
5. **Indexing**: Index by date and provider for fast queries
6. **Archiving**: Move old data to cold storage

## 🐛 Troubleshooting

**High memory usage**:
- Implement pagination for large datasets
- Use database instead of in-memory storage

**Slow dashboard**:
- Enable caching for aggregate queries
- Pre-calculate daily summaries

**Missing entries**:
- Check logging middleware is enabled
- Verify API endpoint accessibility

## 📚 Learn More

- [Token Counting Best Practices](https://platform.openai.com/docs/guides/token-counting)
- [Cost Optimization Strategies](https://www.anthropic.com/cost-optimization)
- [Analytics Dashboard Design](https://www.nngroup.com/articles/dashboard-design/)

## 🔐 Security

- Never expose raw analytics data publicly
- Implement authentication for dashboard access
- Rate limit analytics API endpoints
- Sanitize user inputs
- Use HTTPS in production

## 📝 License

Part of Clarity Chat - MIT License
