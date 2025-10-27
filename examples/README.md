# Clarity Chat Examples

**Production-ready AI chat templates showcasing modern AI capabilities**

## 🌟 Overview

This directory contains fully functional examples demonstrating various AI chat patterns and use cases. Each example is production-ready with comprehensive documentation, TypeScript typing, and testing.

## 📦 Featured Demos

### 1. Model Comparison Demo
**Path**: `model-comparison-demo/`  
**Status**: ✅ Completed & Tested

Compare responses from multiple AI providers (OpenAI, Anthropic, Google) side-by-side with quality scoring and cost analysis.

**Key Features**:
- 🤖 Multi-model comparison (GPT-4, Claude 3, Gemini Pro)
- ⚡ Parallel API calls with response time tracking
- 🎯 Quality scoring with highlighted differences
- 💰 Cost calculation per request
- 🔄 Real-time streaming responses

**Technology**: Next.js 15, TypeScript, Tailwind CSS, Server Actions

[→ View README](./model-comparison-demo/README.md) | [→ View Test Results](./model-comparison-demo/TEST_RESULTS.md)

---

### 2. RAG Workbench Demo
**Path**: `rag-workbench-demo/`  
**Status**: ✅ Completed & Tested

Document processing with semantic search and context-aware AI responses using Retrieval Augmented Generation (RAG).

**Key Features**:
- 📄 Document upload and processing (PDF, TXT, MD)
- ✂️ Smart chunking with configurable overlap
- 🔍 Semantic search across document chunks
- 🎯 Context injection for accurate AI responses
- 📊 Chunk visualization and management
- 🧮 Token counting and optimization

**Technology**: Next.js 15, TypeScript, Tailwind CSS, Custom RAG Pipeline

**Note**: Demonstrates RAG logic with in-memory storage. For production, replace with PostgreSQL, MongoDB, or Redis.

[→ View README](./rag-workbench-demo/README.md) | [→ View Test Results](./rag-workbench-demo/TEST_RESULTS.md)

---

### 3. Analytics Console Demo
**Path**: `analytics-console-demo/`  
**Status**: ✅ Completed & Tested

Real-time AI analytics dashboard with token tracking, cost monitoring, and performance metrics.

**Key Features**:
- 📊 Real-time usage tracking across all providers
- 💰 Per-token cost calculation with pricing table
- 📈 Charts and visualizations (Recharts)
- 🎯 Multi-dimensional analytics (by provider, model, time)
- ⚡ Performance metrics (response time, tokens/request)
- 📅 Daily/weekly/monthly breakdowns

**Technology**: Next.js 15, TypeScript, Tailwind CSS, Recharts

**Live Demo**: https://3000-iephevmxzt294ak4sc7vf-cbeee0f9.sandbox.novita.ai

[→ View README](./analytics-console-demo/README.md) | [→ View Test Results](./analytics-console-demo/TEST_RESULTS.md)

---

### 4. Examples Showcase
**Path**: `examples-showcase/`  
**Status**: ✅ Completed

Beautiful marketing landing page showcasing all examples with descriptions, features, and live demo links.

**Features**:
- 🎨 Responsive design with Tailwind CSS
- 🖼️ Interactive demo cards with hover effects
- 📱 Mobile-friendly layout
- 🚀 Quick start guide with code snippets
- 🔗 Direct links to documentation and live demos

**Technology**: Pure HTML/CSS/JavaScript (no build process)

**Live Showcase**: https://3000-iephevmxzt294ak4sc7vf-cbeee0f9.sandbox.novita.ai

[→ View README](./examples-showcase/README.md)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- API keys for AI providers (OpenAI, Anthropic, Google)
- Python 3 (for showcase page only)

### Running Any Example

```bash
# Navigate to the example directory
cd clarity-chat/examples/[example-name]

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Add your API keys to .env.local
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-...
# GOOGLE_AI_API_KEY=...

# Start the development server
npm run dev

# Or use PM2 for production
pm2 start ecosystem.config.cjs
```

### Environment Variables

Each example requires specific API keys. Copy the `.env.local.example` file to `.env.local` and fill in your keys:

**Model Comparison Demo**:
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

**RAG Workbench Demo**:
```bash
OPENAI_API_KEY=sk-...
# Or any other AI provider
```

**Analytics Console Demo**:
```bash
# No API keys required - this is a demo analytics dashboard
```

---

## 🧪 Testing

All examples include comprehensive test results:

- **Test Coverage**: API endpoints, UI functionality, edge cases
- **Performance Metrics**: Response times, token usage, costs
- **Documentation**: Detailed findings and production recommendations

View test results:
- [Model Comparison Tests](./model-comparison-demo/TEST_RESULTS.md)
- [RAG Workbench Tests](./rag-workbench-demo/TEST_RESULTS.md)
- [Analytics Console Tests](./analytics-console-demo/TEST_RESULTS.md)

---

## 📚 Additional Examples

The examples directory also includes starter templates:

### Basic Chat
Simple chat interface with streaming responses.

### AI Assistant
Personal AI assistant with memory and context.

### Customer Support
Multi-turn customer support chatbot with history.

### Multi-User Chat
Real-time chat with multiple users and rooms.

### Streaming Chat
Advanced streaming with typewriter effect.

---

## 🛠️ Technology Stack

All examples are built with modern, production-ready technologies:

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7.2 with strict mode
- **Styling**: Tailwind CSS 3.4.0
- **UI Icons**: FontAwesome 6.4.0
- **Charts**: Recharts 2.10.3 (Analytics demo)
- **Process Management**: PM2 (pre-installed)
- **API Integration**: OpenAI, Anthropic, Google AI

---

## 🎯 Use Cases

These examples demonstrate patterns for:

- **Multi-Model AI**: Compare and evaluate different AI providers
- **Document Processing**: RAG pipelines for context-aware AI
- **Analytics & Monitoring**: Track usage, costs, and performance
- **Production Deployment**: PM2 process management, error handling
- **TypeScript Patterns**: Strict typing, type safety best practices

---

## 📖 Documentation

Each example includes:

- **README.md**: Complete setup and usage guide
- **TEST_RESULTS.md**: Comprehensive test documentation
- **.env.local.example**: Environment variable template
- **ecosystem.config.cjs**: PM2 configuration
- **API Documentation**: Inline JSDoc comments

---

## 🤝 Contributing

We welcome contributions! Each example follows these standards:

- ✅ TypeScript with strict mode
- ✅ Comprehensive error handling
- ✅ Detailed documentation
- ✅ Test coverage with results
- ✅ Production-ready code quality

---

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details

---

## 🔗 Resources

- **Main Repository**: https://github.com/your-org/clarity-chat
- **Documentation**: [Main README](../README.md)
- **Live Showcase**: https://3000-iephevmxzt294ak4sc7vf-cbeee0f9.sandbox.novita.ai
- **Issues**: https://github.com/your-org/clarity-chat/issues

---

## 🌟 Star History

If you find these examples helpful, please star the repository!

---

**Last Updated**: 2025-10-27  
**Examples Count**: 7 (3 featured demos + 4 starter templates)  
**Status**: Production Ready ✅
