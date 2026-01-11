# Deployment Guide

## Vercel Deployment (Recommended)

Clarity Chat is optimized for deployment on Vercel.

### 1. Environment Variables

Ensure the following environment variables are configured in your Vercel project settings:

```bash
# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Commercial License (Required for Production)
CLARITY_LICENSE_KEY=CLARITY_ENT_...

# App Config
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `apps/docs` (or your app root)
- **Build Command**: `pnpm build` (handled by Turbo)
- **Output Directory**: `.next`

### 3. Edge Functions

This project uses Edge Runtime for the Chat API (`/api/chat`). Vercel automatically handles the edge
function deployment.

### 4. WASM Support

The `token-optimization` and `rag` packages utilize WebAssembly. Next.js 15+ usually handles this
out of the box, but ensure your `next.config.js` includes the necessary webpack configuration if you
encounter issues:

```javascript
// next.config.mjs
const nextConfig = {
  webpack(config) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}
```

## Docker Deployment

A `Dockerfile` is provided in the root for containerized deployments.

```bash
docker build -t clarity-chat .
docker run -p 3000:3000 --env-file .env clarity-chat
```
