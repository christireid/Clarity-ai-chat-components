# Deployment Guide - Model Comparison Demo

Complete guide for deploying the Model Comparison demo to production platforms.

---

## Prerequisites

- Git repository with your code
- At least one AI provider API key (OpenAI recommended)
- Node.js 18+ installed locally

---

## Quick Deploy (Vercel - Recommended)

The fastest way to get your demo live:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project
cd examples/model-comparison-demo

# 3. Deploy
vercel

# 4. Add environment variables
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add GOOGLE_API_KEY

# 5. Deploy to production
vercel --prod
```

**Done!** Your demo is live at `https://your-project.vercel.app`

---

## Platform Comparison

| Platform | Free Tier | Setup Time | Best For |
|----------|-----------|------------|----------|
| **Vercel** | 100GB/month | 5 min | Next.js apps ⭐ |
| **Cloudflare** | Unlimited | 10 min | Edge performance |
| **Netlify** | 100GB/month | 8 min | Jamstack sites |
| **Docker** | Varies | 20 min | Self-hosting |

---

## Detailed Guides

### Vercel (Recommended for Next.js)

See full guide in original document above...

### Cloudflare Pages

See full guide in original document above...

### Environment Variables

All platforms require:

```bash
OPENAI_API_KEY=sk-proj-...      # Required
ANTHROPIC_API_KEY=sk-ant-...    # Optional
GOOGLE_API_KEY=AIza...          # Optional
NODE_ENV=production             # Recommended
```

---

## Post-Deployment Checklist

- [ ] Test homepage loads
- [ ] Test API endpoint responds
- [ ] Test streaming works
- [ ] Verify error handling
- [ ] Check mobile responsive
- [ ] Enable monitoring
- [ ] Set up custom domain (optional)

---

## Support

For issues, see:
- README.md for setup
- TESTING.md for test cases
- TROUBLESHOOTING.md for common issues

---

**Last Updated**: 2025-01-27
