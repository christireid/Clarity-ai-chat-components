# Testing Guide - Model Comparison Demo

This guide explains how to test the real AI integration in the Model Comparison demo.

## Prerequisites

### 1. API Keys

You need at least one API key from the following providers:

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/settings/keys
- **Google AI**: https://makersuite.google.com/app/apikey

### 2. Environment Setup

1. Copy the example environment file:
   ```bash
   cd examples/model-comparison-demo
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   ```bash
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=AIza...
   ```

   **Note**: You don't need all three keys - just the ones for models you want to test.

### 3. Install Dependencies

From the monorepo root:
```bash
cd /home/user/webapp
npm install
```

## Running the Demo

### Start Development Server

```bash
cd examples/model-comparison-demo
npm run dev
```

The demo will be available at: http://localhost:3001

### Access Public URL (Sandbox)

If running in a sandbox environment:

1. Start the dev server
2. Get the public URL:
   ```bash
   # The URL will be displayed in the terminal
   # Or use: curl http://localhost:3001
   ```

## Test Cases

### Test 1: Basic Streaming (OpenAI)

**Setup**:
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Model A: GPT-4 Turbo
- Model B: GPT-3.5 Turbo

**Steps**:
1. Open the demo in browser
2. Enter prompt: "Explain quantum computing in 3 sentences"
3. Click "Compare Models"

**Expected Results**:
- ✅ Both models start streaming simultaneously
- ✅ Tokens appear in real-time with cursor animation
- ✅ Response time displayed (GPT-3.5 should be faster)
- ✅ Cost displayed (GPT-3.5 should be cheaper)
- ✅ Comparison summary shows winner

### Test 2: Cross-Provider Comparison

**Setup**:
- Ensure `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` are set
- Model A: GPT-4 Turbo
- Model B: Claude 3 Sonnet

**Steps**:
1. Select GPT-4 Turbo for Model A
2. Select Claude 3 Sonnet for Model B
3. Enter prompt: "Write a haiku about artificial intelligence"
4. Click "Compare Models"

**Expected Results**:
- ✅ Both providers stream successfully
- ✅ Different response styles/formats
- ✅ Accurate cost calculation for both
- ✅ Performance metrics displayed

### Test 3: Google AI Streaming

**Setup**:
- Ensure `GOOGLE_API_KEY` is set
- Model A: Gemini Pro
- Model B: GPT-4 Turbo

**Steps**:
1. Select Gemini Pro for Model A
2. Select GPT-4 Turbo for Model B
3. Enter prompt: "What are the benefits of edge computing?"
4. Click "Compare Models"

**Expected Results**:
- ✅ Gemini Pro streams successfully
- ✅ Cost calculation for Gemini Pro
- ✅ Side-by-side comparison works

### Test 4: Error Handling (Missing API Key)

**Setup**:
- Remove `ANTHROPIC_API_KEY` from `.env.local`
- Model A: Claude 3 Opus
- Model B: GPT-4 Turbo

**Steps**:
1. Select Claude 3 Opus for Model A
2. Select GPT-4 Turbo for Model B
3. Enter any prompt
4. Click "Compare Models"

**Expected Results**:
- ✅ Model A shows error message in red box
- ✅ Model B streams successfully
- ✅ Error message is user-friendly
- ✅ No console errors or crashes

### Test 5: Long Prompt Handling

**Setup**:
- Any two models with valid API keys

**Steps**:
1. Enter a long prompt (500+ words)
2. Click "Compare Models"

**Expected Results**:
- ✅ Both models handle long prompts
- ✅ Streaming works correctly
- ✅ Cost reflects increased token usage
- ✅ No timeouts or errors

### Test 6: Rapid Model Switching

**Setup**:
- Multiple API keys configured

**Steps**:
1. Start a comparison
2. Immediately change Model A to different provider
3. Start another comparison before previous completes

**Expected Results**:
- ✅ New comparison starts fresh
- ✅ Previous state clears
- ✅ No race conditions or mixed responses

### Test 7: Dark Mode

**Steps**:
1. Toggle system dark mode
2. Perform any comparison

**Expected Results**:
- ✅ UI adapts to dark mode
- ✅ All text remains readable
- ✅ Error messages visible in dark mode
- ✅ Streaming animations work

## API Endpoint Testing

### Test Direct API Route

```bash
# Test OpenAI streaming
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "config": {
      "provider": "openai",
      "model": "gpt-4-turbo",
      "temperature": 0.7,
      "maxTokens": 100
    }
  }'

# Expected: SSE stream with data: prefix
# Sample output:
# data: {"type":"token","content":"Hello"}
# data: {"type":"token","content":" there"}
# ...
# data: {"type":"done","usage":{"promptTokens":8,"completionTokens":12}}
```

### Test Anthropic Endpoint

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hi"}],
    "config": {
      "provider": "anthropic",
      "model": "claude-3-sonnet",
      "temperature": 0.7,
      "maxTokens": 100
    }
  }'
```

### Test Google AI Endpoint

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hi"}],
    "config": {
      "provider": "google",
      "model": "gemini-pro",
      "temperature": 0.7,
      "maxTokens": 100
    }
  }'
```

## Performance Benchmarks

### Expected Response Times

| Model | First Token | Full Response (100 tokens) |
|-------|-------------|----------------------------|
| GPT-3.5 Turbo | < 500ms | 2-3s |
| GPT-4 Turbo | < 1s | 4-6s |
| Claude 3 Sonnet | < 800ms | 3-4s |
| Claude 3 Opus | < 1.5s | 6-8s |
| Gemini Pro | < 600ms | 2-4s |

### Expected Costs (per 1000 tokens)

| Model | Input | Output |
|-------|-------|--------|
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-3.5 Turbo | $0.0015 | $0.002 |
| Claude 3 Opus | $0.015 | $0.075 |
| Claude 3 Sonnet | $0.003 | $0.015 |
| Gemini Pro | Free tier, then $0.00025 | $0.0005 |

## Troubleshooting

### Issue: "API key not found" error

**Solution**:
1. Verify `.env.local` exists in `examples/model-comparison-demo/`
2. Confirm API key format is correct
3. Restart dev server after adding keys
4. Check environment variables: `console.log(process.env.OPENAI_API_KEY)`

### Issue: Streaming doesn't start

**Solution**:
1. Open browser console (F12)
2. Check Network tab for `/api/chat` request
3. Look for CORS or 500 errors
4. Verify API key is valid: test with curl command above

### Issue: Wrong cost calculation

**Solution**:
1. Check adapter implementation in `packages/react/src/adapters/`
2. Verify model name matches adapter's cost map
3. Update pricing if provider changed rates

### Issue: Race condition with rapid clicks

**Solution**:
1. Implement debouncing on "Compare" button
2. Disable button while streaming
3. Add abort controller cleanup

### Issue: Dark mode styling issues

**Solution**:
1. Check Tailwind dark: prefix on affected elements
2. Verify dark mode toggle works system-wide
3. Test in different browsers

## Code Coverage

### API Route Tests

- [x] POST /api/chat with OpenAI
- [x] POST /api/chat with Anthropic
- [x] POST /api/chat with Google
- [x] Error handling for missing API key
- [x] Error handling for invalid config
- [x] SSE format correctness
- [x] Cost calculation accuracy
- [x] Duration tracking

### Hook Tests

- [x] useStreamingChat token callback
- [x] useStreamingChat complete callback
- [x] useStreamingChat error callback
- [x] Cancel functionality
- [x] Multiple concurrent streams
- [x] Buffer handling for partial SSE messages

### Component Tests

- [x] Model selector changes
- [x] Prompt input and submission
- [x] Streaming animation
- [x] Error display
- [x] Cost/time metrics
- [x] Comparison summary
- [x] Dark mode support

## Next Steps

After completing these tests:

1. ✅ Mark Task 18 complete (Update demo app to use real API routes)
2. ✅ Mark Task 19 complete (Test real AI integration)
3. 📝 Document any issues found
4. 🚀 Deploy to production (Vercel/Cloudflare)
5. 📊 Monitor real-world performance

## Support

If you encounter issues:

1. Check browser console for errors
2. Review API provider status pages
3. Verify API key permissions and quotas
4. Test with curl commands to isolate frontend/backend issues
5. Check Next.js server logs

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0
**Status**: Ready for Testing
