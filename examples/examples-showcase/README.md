# Clarity Chat Examples Showcase

**A beautiful landing page showcasing all Clarity Chat examples and demos**

## 🎯 Purpose

This showcase page serves as the marketing hub for Clarity Chat examples, featuring:

- **Interactive demo cards** with screenshots and live links
- **Feature highlights** for each example
- **Getting started guides** for developers
- **Beautiful, responsive design** with Tailwind CSS
- **No build process** - pure HTML/CSS/JavaScript

## 🚀 Quick Start

```bash
# Start the showcase page
npm start

# Or use PM2 for production
pm2 start ecosystem.config.cjs

# Access at http://localhost:3000
```

## 📦 Included Demos

### 1. Model Comparison Demo
Compare responses across OpenAI, Anthropic, and Google AI models side-by-side.

**Features**:
- 🤖 Multi-model comparison (GPT-4, Claude, Gemini)
- ⚡ Parallel API calls with response time tracking
- 🎯 Quality scoring with highlighted differences
- 💰 Cost calculation per request

### 2. RAG Workbench Demo
Document processing with semantic search and context-aware AI responses.

**Features**:
- 📄 Document upload and chunking (PDF, TXT, MD)
- 🔍 Semantic search across documents
- 🎯 Context injection for accurate AI responses
- 📊 Chunk visualization and management

### 3. Analytics Console Demo
Real-time AI analytics dashboard with cost tracking and performance metrics.

**Features**:
- 📊 Real-time usage tracking
- 💰 Per-token cost calculation
- 📈 Charts and visualizations (Recharts)
- 🎯 Multi-dimensional analytics (provider, model, time)

## 🎨 Design Features

- **Responsive Grid Layout**: Adapts to all screen sizes
- **Icon-Rich Interface**: FontAwesome icons throughout
- **Gradient Backgrounds**: Modern, eye-catching design
- **Hover Effects**: Interactive card animations
- **Call-to-Action Buttons**: Clear navigation to demos

## 🛠️ Technology Stack

- **Pure HTML/CSS/JavaScript**: No build process required
- **Tailwind CSS**: Utility-first styling via CDN
- **FontAwesome Icons**: Beautiful icon library
- **Simple HTTP Server**: Python's http.server or npm serve

## 📋 Project Structure

```
examples-showcase/
├── index.html                # Main landing page
├── package.json              # npm scripts
├── ecosystem.config.cjs      # PM2 configuration
└── README.md                 # This file
```

## 🌐 Deployment

The showcase page is a static HTML file that can be deployed anywhere:

- **Local Development**: `npm start` or `python3 -m http.server 3000`
- **Production**: Any static hosting (Cloudflare Pages, Netlify, Vercel)
- **PM2**: `pm2 start ecosystem.config.cjs` for daemon mode

## 📸 Screenshots

The landing page includes:
- Hero section with Clarity Chat branding
- Demo cards grid (3 columns on desktop)
- Feature highlights for each demo
- Live demo links and documentation
- Footer with GitHub and documentation links

## 🔗 Links

- **GitHub Repository**: https://github.com/your-org/clarity-chat
- **Documentation**: [Main README](../../README.md)
- **Live Demos**: Linked from individual cards

## 📝 License

MIT License - See main project LICENSE file
