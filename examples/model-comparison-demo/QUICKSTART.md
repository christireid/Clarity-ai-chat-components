# Quick Start Guide - Model Comparison Demo

Get the Model Comparison demo running in under 5 minutes.

## Prerequisites

- Node.js 18+
- At least one API key (OpenAI, Anthropic, or Google AI)

## Setup (3 steps)

### 1. Install Dependencies

```bash
cd /home/user/webapp
npm install
```

### 2. Configure API Keys

```bash
cd examples/model-comparison-demo
cp .env.local.example .env.local
```

Edit `.env.local` and add your API key(s):

```bash
# Add at least one of these:
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

### 3. Start Dev Server

```bash
npm run dev
```

Open http://localhost:3001 in your browser.

## First Test

1. **Select Models**: Choose any two models from the dropdowns
2. **Enter Prompt**: Type a question like "What is machine learning?"
3. **Compare**: Click "Compare Models" or press Enter
4. **Watch**: See both models stream their responses in real-time

## What to Try

### Quick Tests

- Compare GPT-4 vs GPT-3.5 for speed difference
- Compare Claude vs GPT for response quality
- Try long prompts (500+ words) to see token handling
- Switch models mid-comparison to see state reset

### Check Metrics

- **Time**: Which model responds faster?
- **Cost**: Which model is more economical?
- **Quality**: Which response is more helpful?

### Error Testing

- Remove an API key and select that provider's model
- Should see clear error message in red box
- Other model should continue working

## Common Issues

### "API key not found"

**Solution**: 
1. Verify `.env.local` exists in `examples/model-comparison-demo/`
2. Restart dev server: `Ctrl+C` then `npm run dev`

### Streaming doesn't start

**Solution**:
1. Open browser console (F12)
2. Check for errors in Network tab
3. Verify API key is valid

### Wrong port

**Solution**: 
- Model Comparison uses port **3001** (not 3000)
- Check `package.json` if different

## What's Happening Under the Hood

```
Your Prompt
    ↓
Frontend (page.tsx)
    ↓
useStreamingChat Hook
    ↓
POST /api/chat (SSE Stream)
    ↓
Model Adapter (OpenAI/Anthropic/Google)
    ↓
Real AI API
    ↓
Stream Tokens Back
    ↓
Display in Real-Time
```

## Next Steps

- Read [TESTING.md](./TESTING.md) for comprehensive test cases
- Check [README.md](./README.md) for deployment options
- Explore code in `src/` to understand implementation

## Getting API Keys

### OpenAI

1. Go to https://platform.openai.com/api-keys
2. Create account / sign in
3. Click "Create new secret key"
4. Copy key (starts with `sk-`)

### Anthropic

1. Go to https://console.anthropic.com/settings/keys
2. Create account / sign in
3. Click "Create Key"
4. Copy key (starts with `sk-ant-`)

### Google AI

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy key (starts with `AIza`)

## Cost Information

All providers offer free tiers or credits:

- **OpenAI**: $5 free credit for new accounts
- **Anthropic**: Credits for new accounts
- **Google AI**: Generous free tier

For this demo, each comparison costs:
- GPT-3.5: ~$0.0005
- GPT-4: ~$0.02
- Claude 3 Sonnet: ~$0.01
- Gemini Pro: Free (within limits)

## Support

Having issues? Check:

1. [TESTING.md](./TESTING.md) - Troubleshooting section
2. [README.md](./README.md) - Full documentation
3. Browser console - For JavaScript errors
4. Terminal - For server errors

---

**Time to First Demo**: < 5 minutes  
**Difficulty**: Beginner-friendly  
**Cost**: Nearly free with trial credits
