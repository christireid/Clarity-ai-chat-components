# Conversational Data Analytics Platform

**Natural language queries, real-time dashboards, and AI-powered insights**

## 🌟 Overview

This demo showcases how Clarity Chat can transform data analytics through conversational interfaces.
Users can:

- **Ask Questions in Natural Language** - "Show me sales by region" instead of writing SQL
- **Get Instant Visualizations** - Charts and graphs generated automatically
- **Receive AI Insights** - Key findings and recommendations extracted automatically
- **Build Dashboards** - Interactive dashboards from conversations
- **Explore Data** - Browse schemas and understand your data

## ✨ Key Features

### Natural Language Queries

- **Intelligent Parsing** - Understands business questions
- **SQL Generation** - Converts queries to database queries
- **Multi-Data Source** - Works with various databases
- **Query Suggestions** - Helps users ask better questions
- **Query History** - Saves and reuses queries

### Automatic Visualization

- **Chart Generation** - Creates appropriate chart types
- **Chart Gallery** - Collection of generated visualizations
- **Interactive Charts** - Click, zoom, filter
- **Export Options** - Download charts and data
- **Responsive Design** - Works on all screen sizes

### AI-Powered Insights

- **Key Findings** - Automatically extracts important insights
- **Trends Detection** - Identifies patterns and anomalies
- **Recommendations** - Suggests actions based on data
- **Contextual Understanding** - Understands business context
- **Insight Cards** - Beautiful, shareable insight cards

### Dashboard Builder

- **Drag & Drop** - Build dashboards visually
- **Real-Time Updates** - Dashboards update automatically
- **Custom Layouts** - Arrange charts your way
- **Saving & Sharing** - Save and share dashboards
- **Templates** - Pre-built dashboard templates

### Data Explorer

- **Schema Browser** - Explore database schemas
- **Table Preview** - See table structures
- **Column Details** - Understand data types
- **Relationship Mapping** - Visualize data relationships
- **Query Builder** - Visual query builder

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Database connection (optional for demo)

### Installation

```bash
cd examples/conversational-analytics
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3004](http://localhost:3004)

## 🏗️ Architecture

### Frontend

- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Framer Motion** for animations

### Clarity Chat Components Used

```typescript
import {
  // Core Components
  ChatWindow,
  AdvancedChatInput,
  ThemeProvider,

  // Advanced Features
  CommandPalette,
  FollowUpSuggestions,
  InteractiveCard,

  // Hooks
  useMessageOperations,
  useStreamingSSE,
} from '@clarity-chat/react'
```

## 📊 Example Queries

### Sales Analytics

```
"Show me sales trends for the last quarter"
"Compare revenue by product category"
"What are the top performing regions?"
"Show me customer acquisition by month"
```

### User Analytics

```
"How many active users do we have?"
"Show me user retention rates"
"What's the average session duration?"
"Compare signups by channel"
```

### Financial Analytics

```
"What's our total revenue this month?"
"Show me expenses by category"
"Compare profit margins by product"
"What's our cash flow trend?"
```

## 🎯 Use Cases

### 1. Business Intelligence

```
Scenario: Executive wants quick insights

User: "Show me our top products this quarter"
System:
- Generates SQL query
- Executes against database
- Creates bar chart
- Extracts key insights
- Returns visual + insights
```

### 2. Marketing Analytics

```
Scenario: Marketer analyzing campaign performance

User: "Compare conversion rates by channel"
System:
- Queries marketing data
- Creates comparison chart
- Identifies best channels
- Recommends optimization
```

### 3. Operational Analytics

```
Scenario: Operations team monitoring metrics

User: "Show me system uptime and error rates"
System:
- Connects to monitoring system
- Creates time series chart
- Highlights anomalies
- Suggests improvements
```

## 🔧 Customization

### Adding Data Sources

```typescript
const dataSources = [
  { name: 'PostgreSQL', type: 'postgres', connection: '...' },
  { name: 'MySQL', type: 'mysql', connection: '...' },
  { name: 'MongoDB', type: 'mongodb', connection: '...' },
  { name: 'BigQuery', type: 'bigquery', connection: '...' },
]
```

### Custom Chart Types

```typescript
const chartTypes = [
  { type: 'bar', label: 'Bar Chart' },
  { type: 'line', label: 'Line Chart' },
  { type: 'pie', label: 'Pie Chart' },
  { type: 'area', label: 'Area Chart' },
  { type: 'scatter', label: 'Scatter Plot' },
]
```

### Custom Insights

```typescript
const insightPrompts = [
  'Identify key trends',
  'Find anomalies',
  'Compare performance',
  'Predict future values',
  'Recommend actions',
]
```

## 📈 Features in Detail

### Natural Language Processing

- Uses GPT-4 or Claude for query understanding
- Converts to structured queries
- Handles ambiguity and context
- Suggests improvements

### Query Execution

- Generates optimized SQL
- Handles joins and aggregations
- Supports complex queries
- Error handling and validation

### Visualization Engine

- Auto-selects chart type
- Handles different data formats
- Responsive and interactive
- Export capabilities

### Insight Generation

- Extracts key findings
- Identifies patterns
- Provides context
- Suggests actions

## 🚧 Backend Integration

This demo includes mock data. For production use:

1. **Set Up NLP Service**
   - Use OpenAI or Anthropic API
   - Configure query understanding
   - Set up SQL generation

2. **Connect Data Sources**
   - Configure database connections
   - Set up query execution
   - Implement caching

3. **Enable Visualization**
   - Set up chart generation
   - Configure export options
   - Enable sharing

4. **Configure Insights**
   - Set up insight extraction
   - Configure recommendations
   - Enable notifications

## 📚 Documentation

- [Clarity Chat Docs](https://docs.clarity-chat.dev)
- [API Reference](../../docs/api-reference.md)
- [Best Practices](../../docs/best-practices.md)

## 🤝 Contributing

This is a demo application. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See [LICENSE](../../LICENSE)

---

**Built with ❤️ using Clarity Chat by Code & Clarity**

This demo showcases how conversational interfaces can revolutionize data analytics.
