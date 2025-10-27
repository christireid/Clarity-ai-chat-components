# Deployment Guide - Model Comparison Demo

Complete guide for deploying the Model Comparison demo to production platforms.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Platform-Specific Guides](#platform-specific-guides)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Cloudflare Pages](#cloudflare-pages)
   - [Netlify](#netlify)
   - [Docker](#docker)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- Git repository with the code
- At least one AI provider API key (OpenAI, Anthropic, or Google AI)
- Node.js 18+ (for local builds)
- npm 9+ (for dependency management)

### Recommended

- Custom domain (optional but professional)
- SSL certificate (usually provided by platforms)
- Monitoring setup (error tracking)

---

## Environment Variables

All platforms require these environment variables:

### Required (at least one)

```bash
# OpenAI (Recommended - most reliable)
OPENAI_API_KEY=sk-proj-...

# Anthropic (Optional - requires account credits)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Google AI (Optional - may need activation)
GOOGLE_API_KEY=AIza...
```

### Optional

```bash
# Node environment
NODE_ENV=production

# Custom API URL (if using external API)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Security Notes

- ⚠️ **NEVER** commit API keys to git
- ✅ **ALWAYS** use platform environment variable management
- ✅ **NEVER** expose keys in client-side code
- ✅ **USE** server-side API routes only

---

## Platform-Specific Guides

### Vercel (Recommended)

**Why Vercel?**
- Built by Next.js creators
- Zero configuration
- Edge functions support
- Automatic HTTPS
- Free tier generous

#### Method 1: Git Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/clarity-chat.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your repository
   - **Root Directory**: `examples/model-comparison-demo`
   - Click "Import"

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add each API key:
     - Name: `OPENAI_API_KEY`
     - Value: `sk-proj-...`
     - Environment: Production, Preview, Development
   - Repeat for `ANTHROPIC_API_KEY` and `GOOGLE_API_KEY`

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL: `https://your-project.vercel.app`

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to project
cd examples/model-comparison-demo

# Deploy to preview
vercel

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add GOOGLE_API_KEY

# Deploy to production
vercel --prod
```

#### Custom Domain

```bash
# Add custom domain
vercel domains add yourdomain.com

# Add DNS records (provided by Vercel)
# A record: 76.76.21.21
# CNAME: cname.vercel-dns.com
```

#### Continuous Deployment

Vercel automatically deploys on every push to `main`:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches
- **Comments**: Deployment URLs in PR comments

---

### Cloudflare Pages

**Why Cloudflare?**
- Edge network (fast globally)
- Generous free tier
- Built-in analytics
- DDoS protection

#### Step 1: Create Cloudflare Pages Project

```bash
# Login to Cloudflare
npx wrangler login

# Navigate to project
cd examples/model-comparison-demo

# Build the project
npm run build

# Create Pages project
npx wrangler pages project create model-comparison-demo \
  --production-branch main
```

#### Step 2: Deploy

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy dist \
  --project-name model-comparison-demo \
  --branch main
```

**You'll receive**:
- Production URL: `https://model-comparison-demo.pages.dev`
- Preview URL: `https://main.model-comparison-demo.pages.dev`

#### Step 3: Add Environment Variables

```bash
# Add secrets (production)
npx wrangler pages secret put OPENAI_API_KEY \
  --project-name model-comparison-demo

npx wrangler pages secret put ANTHROPIC_API_KEY \
  --project-name model-comparison-demo

npx wrangler pages secret put GOOGLE_API_KEY \
  --project-name model-comparison-demo

# List all secrets
npx wrangler pages secret list \
  --project-name model-comparison-demo
```

#### Step 4: Configure Git Integration

1. Go to Cloudflare Dashboard
2. Navigate to Pages → model-comparison-demo
3. Settings → Builds & deployments
4. Connect to Git repository
5. Set build configuration:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `examples/model-comparison-demo`

#### Custom Domain

```bash
# Add custom domain
npx wrangler pages domain add yourdomain.com \
  --project-name model-comparison-demo

# Verify DNS records
# CNAME: yourdomain.com → model-comparison-demo.pages.dev
```

---

### Netlify

**Why Netlify?**
- Simple deployment
- Form handling
- Split testing
- Good free tier

#### Method 1: Netlify UI

1. **Push to GitHub** (if not already):
   ```bash
   git push origin main
   ```

2. **Connect Repository**:
   - Go to https://app.netlify.com/start
   - Click "Import from Git"
   - Select GitHub repository
   - Choose the repo

3. **Configure Build**:
   - **Base directory**: `examples/model-comparison-demo`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

4. **Environment Variables**:
   - Site Settings → Environment Variables
   - Add `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`

5. **Deploy**:
   - Click "Deploy site"
   - Get URL: `https://random-name.netlify.app`

#### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Navigate to project
cd examples/model-comparison-demo

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

#### Custom Domain

```bash
# Add domain
netlify domains:add yourdomain.com

# Configure DNS (shown in Netlify UI)
```

---

### Docker

**Why Docker?**
- Self-hosted control
- Reproducible builds
- Multi-platform support
- Easy scaling

#### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Rebuild source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  model-comparison-demo:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### Build and Run

```bash
# Create .env file
cat > .env << EOF
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
EOF

# Build image
docker build -t model-comparison-demo .

# Run container
docker run -d \
  --name model-comparison-demo \
  -p 3001:3001 \
  --env-file .env \
  --restart unless-stopped \
  model-comparison-demo

# Or use docker-compose
docker-compose up -d

# View logs
docker logs -f model-comparison-demo

# Stop container
docker stop model-comparison-demo
```

#### Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag model-comparison-demo yourusername/model-comparison-demo:latest

# Push to Docker Hub
docker push yourusername/model-comparison-demo:latest

# Pull and run on server
docker pull yourusername/model-comparison-demo:latest
docker run -d -p 3001:3001 --env-file .env yourusername/model-comparison-demo:latest
```

---

## Post-Deployment

### 1. Verify Deployment

**Test Homepage**:
```bash
curl -I https://your-deployment-url.com
# Should return: HTTP/2 200
```

**Test API Endpoint**:
```bash
curl -X POST https://your-deployment-url.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"config":{"provider":"openai","model":"gpt-3.5-turbo"}}'
# Should return: SSE stream with tokens
```

**Test UI**:
- Open browser to your URL
- Select two models
- Enter a prompt
- Click "Compare Models"
- Verify streaming works

### 2. Monitor Performance

**Vercel Analytics**:
- Enable in Project Settings
- View metrics: Response time, visitors, errors

**Cloudflare Analytics**:
- Automatic in dashboard
- View: Requests, bandwidth, cache hit rate

**Custom Monitoring**:
```javascript
// Add to your app
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // Send to your monitoring service
    fetch('/api/log-error', {
      method: 'POST',
      body: JSON.stringify({ error: e.message })
    })
  })
}
```

### 3. Set Up Alerts

**Vercel**:
- Project Settings → Notifications
- Enable email/Slack for failed deployments

**Cloudflare**:
- Workers & Pages → Notifications
- Set up error rate alerts

**Custom**:
- Use Sentry, LogRocket, or similar
- Track: Errors, performance, user actions

### 4. Optimize Performance

**Enable Caching**:
```typescript
// In route.ts
export const revalidate = 60 // Cache for 60 seconds
```

**Add CDN Headers**:
```typescript
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'CDN-Cache-Control': 'no-store',
  }
})
```

**Compress Responses**:
- Vercel/Cloudflare do this automatically
- For Docker, use nginx reverse proxy

---

## Troubleshooting

### Issue 1: Build Fails

**Symptom**: Deployment fails during build  
**Common Causes**:
- Missing dependencies
- TypeScript errors
- Environment variable issues

**Solutions**:
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npm run typecheck

# Verify dependencies
npm install

# Check logs in platform dashboard
```

### Issue 2: API Keys Not Working

**Symptom**: 401 errors or "API key not found"  
**Solutions**:
- Verify environment variables are set
- Check variable names match exactly
- Ensure variables are in production environment
- Redeploy after adding variables

**Test locally**:
```bash
# Check if env vars are loaded
node -e "console.log(process.env.OPENAI_API_KEY)"
```

### Issue 3: Streaming Not Working

**Symptom**: No tokens appear, request hangs  
**Solutions**:
- Check API key is valid
- Verify provider API status
- Test with curl directly
- Check browser console for errors

**Debug**:
```typescript
// Add logging to route.ts
console.log('Starting stream with provider:', config.provider)
console.log('API key present:', !!apiKey)
```

### Issue 4: CORS Errors

**Symptom**: Browser shows CORS policy errors  
**Solutions**:
- Add CORS headers to API route
- Ensure same-origin requests
- Check API route configuration

**Fix**:
```typescript
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*', // Or your domain
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
})
```

### Issue 5: Slow Response Times

**Symptom**: API takes >10s to respond  
**Solutions**:
- Use faster models (GPT-3.5 vs GPT-4)
- Reduce maxTokens parameter
- Enable caching for repeated queries
- Use edge functions (Vercel Edge, Cloudflare Workers)

### Issue 6: High Costs

**Symptom**: Unexpected API bills  
**Solutions**:
- Set rate limits per user
- Add caching layer
- Use cheaper models for testing
- Monitor usage dashboards

**Add rate limiting**:
```typescript
// Simple in-memory rate limit
const rateLimits = new Map()

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')
  const count = rateLimits.get(ip) || 0
  
  if (count > 10) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  
  rateLimits.set(ip, count + 1)
  // ... rest of handler
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] Code pushed to Git repository
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] API keys obtained
- [ ] Build succeeds locally
- [ ] .gitignore includes .env files

### During Deployment

- [ ] Platform connected to repository
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled

### Post-Deployment

- [ ] Homepage loads correctly
- [ ] API endpoint responds
- [ ] Streaming works
- [ ] All models available
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Monitoring enabled
- [ ] Alerts configured
- [ ] Documentation updated

---

## Cost Estimates

### Platform Costs (Free Tier)

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Vercel | 100GB bandwidth/month | $20/month Pro |
| Cloudflare | Unlimited requests | $20/month Pro |
| Netlify | 100GB bandwidth/month | $19/month Pro |
| Docker (DigitalOcean) | N/A | $6/month droplet |

### API Costs (Per 1M Tokens)

| Provider | Model | Input | Output |
|----------|-------|-------|--------|
| OpenAI | GPT-3.5 Turbo | $0.50 | $1.50 |
| OpenAI | GPT-4 Turbo | $10 | $30 |
| Anthropic | Claude 3 Haiku | $0.25 | $1.25 |
| Anthropic | Claude 3 Sonnet | $3 | $15 |
| Google | Gemini Pro | $0.25 | $0.50 |

### Estimated Monthly Costs

**Small Site** (1,000 comparisons/month):
- Platform: Free tier
- API: ~$5-10
- **Total**: $5-10/month

**Medium Site** (10,000 comparisons/month):
- Platform: Free tier or $20
- API: ~$50-100
- **Total**: $50-120/month

**Large Site** (100,000 comparisons/month):
- Platform: $20
- API: ~$500-1,000
- CDN: $50
- **Total**: $570-1,070/month

---

## Next Steps

After successful deployment:

1. **Monitor Usage**: Check analytics daily for first week
2. **Gather Feedback**: Share with users, collect issues
3. **Optimize**: Based on performance metrics
4. **Scale**: Add more models, features
5. **Market**: Share on social media, Product Hunt

---

## Support

**Documentation**: See README.md and TESTING.md  
**Issues**: GitHub Issues (if public)  
**Questions**: Check MASTER_CONTEXT.md for detailed architecture

---

**Last Updated**: 2025-01-27  
**Version**: 1.0.0  
**Status**: Production Ready
