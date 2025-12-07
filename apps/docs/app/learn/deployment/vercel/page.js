import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const metadata = {
    title: 'Deploy to Vercel - Clarity Chat',
    description: 'Step-by-step guide to deploying Clarity Chat applications on Vercel.',
};
export default function VercelDeploymentPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Deployment" }), _jsx("h1", { children: "Deploy to Vercel" }), _jsx("p", { className: "docs-lead", children: "Deploy your Clarity Chat application to Vercel with streaming, edge functions, and optimal performance." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Prerequisites" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Vercel account (", _jsx("a", { href: "https://vercel.com/signup", children: "sign up free" }), ")"] }), _jsx("li", { children: "GitHub, GitLab, or Bitbucket repository" }), _jsx("li", { children: "OpenAI API key or other LLM credentials" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Deploy" }), _jsx(Callout, { type: "info", title: "One-Click Deploy", children: "Deploy a starter template with one click:" }), _jsx("a", { href: "https://vercel.com/new/clone?repository-url=https://github.com/clarity-chat/starter", className: "inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800", children: "Deploy to Vercel \u2192" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Manual Deployment" }), _jsx("h3", { children: "1. Prepare Your Project" }), _jsx("p", { children: "Ensure your Next.js project is configured for production:" }), _jsx("pre", { children: _jsx("code", { children: `// next.config.js
module.exports = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize images
  images: {
    domains: ['your-cdn.com'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL 
      ? \`https://\${process.env.VERCEL_URL}\`
      : 'http://localhost:3000'
  }
}` }) }), _jsx("h3", { children: "2. Configure Environment Variables" }), _jsxs("p", { children: ["Create ", _jsx("code", { children: ".env.example" }), " for documentation:"] }), _jsx("pre", { children: _jsx("code", { children: `# OpenAI
OPENAI_API_KEY=sk-...

# Optional: Vector Database
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=clarity-chat

# Optional: Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=...` }) }), _jsx("h3", { children: "3. Connect Repository to Vercel" }), _jsxs("ol", { children: [_jsxs("li", { children: ["Go to ", _jsx("a", { href: "https://vercel.com/new", children: "vercel.com/new" })] }), _jsx("li", { children: "Import your Git repository" }), _jsxs("li", { children: ["Select framework preset: ", _jsx("strong", { children: "Next.js" })] }), _jsxs("li", { children: ["Configure project:", _jsxs("ul", { children: [_jsxs("li", { children: ["Build Command: ", _jsx("code", { children: "npm run build" })] }), _jsxs("li", { children: ["Output Directory: ", _jsx("code", { children: ".next" })] }), _jsxs("li", { children: ["Install Command: ", _jsx("code", { children: "npm install" })] })] })] })] }), _jsx("h3", { children: "4. Add Environment Variables" }), _jsx("p", { children: "In Vercel dashboard \u2192 Settings \u2192 Environment Variables:" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Add all variables from ", _jsx("code", { children: ".env.example" })] }), _jsx("li", { children: "Set for Production, Preview, and Development" }), _jsx("li", { children: "Sensitive keys: Use Production only" })] }), _jsx("h3", { children: "5. Deploy" }), _jsxs("p", { children: ["Click ", _jsx("strong", { children: "Deploy" }), " and wait for build to complete (~2 minutes)."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Enable Streaming" }), _jsx("p", { children: "Configure streaming for AI responses:" }), _jsx("h3", { children: "Option 1: vercel.json (Recommended)" }), _jsx("pre", { children: _jsx("code", { children: `{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 60
    },
    "app/api/*/route.ts": {
      "maxDuration": 30
    }
  }
}` }) }), _jsx("h3", { children: "Option 2: Route Segment Config" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/chat/route.ts
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Your streaming code
}` }) }), _jsxs(Callout, { type: "warning", title: "Timeout Limits", children: ["\u2022 Hobby: 10s", _jsx("br", {}), "\u2022 Pro: 60s", _jsx("br", {}), "\u2022 Enterprise: 900s (15 min)"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Edge Functions" }), _jsx("p", { children: "Use Edge Runtime for lower latency (120+ global regions):" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/chat/route.ts
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true
    })
  })
  
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}` }) }), _jsxs(Callout, { type: "info", title: "Edge Limitations", children: ["\u2022 No Node.js APIs (fs, child_process)", _jsx("br", {}), "\u2022 Max response: 4MB", _jsx("br", {}), "\u2022 Use for simple proxying and streaming"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Domain" }), _jsxs("ol", { children: [_jsx("li", { children: "Go to Project \u2192 Settings \u2192 Domains" }), _jsxs("li", { children: ["Add your domain: ", _jsx("code", { children: "chat.yourdomain.com" })] }), _jsxs("li", { children: ["Configure DNS:", _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "A Record:" }), " ", _jsx("code", { children: "76.76.21.21" })] }), _jsxs("li", { children: ["Or ", _jsx("strong", { children: "CNAME:" }), " ", _jsx("code", { children: "cname.vercel-dns.com" })] })] })] }), _jsx("li", { children: "SSL automatically provisioned (~5 minutes)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Performance Optimization" }), _jsx("h3", { children: "Caching" }), _jsx("pre", { children: _jsx("code", { children: `// Revalidate static pages
export const revalidate = 3600 // 1 hour

// Cache API responses
export async function GET() {
  const data = await fetchData()
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  })
}` }) }), _jsx("h3", { children: "Image Optimization" }), _jsx("pre", { children: _jsx("code", { children: `import Image from 'next/image'

<Image
  src="/avatar.png"
  width={40}
  height={40}
  alt="User avatar"
  loading="lazy"
/>` }) }), _jsx("h3", { children: "Bundle Analysis" }), _jsx("pre", { children: _jsx("code", { children: `// Install analyzer
npm install @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  // your config
})

// Run analysis
ANALYZE=true npm run build` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Monitoring & Analytics" }), _jsx("h3", { children: "Vercel Analytics" }), _jsx("pre", { children: _jsx("code", { children: `// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}` }) }), _jsx("h3", { children: "Speed Insights" }), _jsx("pre", { children: _jsx("code", { children: `npm install @vercel/speed-insights

// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

<SpeedInsights />` }) }), _jsx("h3", { children: "Custom Monitoring" }), _jsx("pre", { children: _jsx("code", { children: `// Track API errors
export async function POST(req: Request) {
  try {
    return await handleRequest(req)
  } catch (error) {
    console.error('API Error:', error)
    
    // Send to monitoring service
    await fetch('https://api.your-monitoring.com/errors', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        url: req.url,
        timestamp: Date.now()
      })
    })
    
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Environment-Specific Configuration" }), _jsx("pre", { children: _jsx("code", { children: `// Different configs per environment
const config = {
  production: {
    apiUrl: 'https://api.production.com',
    enableAnalytics: true,
    logLevel: 'error'
  },
  preview: {
    apiUrl: 'https://api.staging.com',
    enableAnalytics: false,
    logLevel: 'warn'
  },
  development: {
    apiUrl: 'http://localhost:3000',
    enableAnalytics: false,
    logLevel: 'debug'
  }
}

const env = process.env.VERCEL_ENV || 'development'
export const appConfig = config[env]` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "CI/CD Workflow" }), _jsx("h3", { children: "Automatic Deployments" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Production:" }), " Push to ", _jsx("code", { children: "main" }), " branch"] }), _jsxs("li", { children: [_jsx("strong", { children: "Preview:" }), " Any pull request"] }), _jsxs("li", { children: [_jsx("strong", { children: "Development:" }), " Any branch push"] })] }), _jsx("h3", { children: "Deploy Hooks" }), _jsx("p", { children: "Trigger deploys via API:" }), _jsx("pre", { children: _jsx("code", { children: `# Get deploy hook URL from Settings → Git
curl -X POST https://api.vercel.com/v1/integrations/deploy/...

# Use in CI/CD
- name: Deploy to Vercel
  run: |
    curl -X POST \${{ secrets.VERCEL_DEPLOY_HOOK }}` }) }), _jsx("h3", { children: "Preview Comments" }), _jsx("p", { children: "Vercel automatically comments on PRs with preview URLs" })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Security Best Practices" }), _jsx("h3", { children: "Environment Variables" }), _jsxs("ul", { children: [_jsx("li", { children: "Never commit API keys to Git" }), _jsx("li", { children: "Use different keys for prod/preview/dev" }), _jsx("li", { children: "Rotate keys regularly" }), _jsx("li", { children: "Limit key permissions" })] }), _jsx("h3", { children: "CORS Configuration" }), _jsx("pre", { children: _jsx("code", { children: `// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  const response = NextResponse.next()
  
  // Only allow your domain
  const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ]
  
  const origin = request.headers.get('origin')
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}` }) }), _jsx("h3", { children: "Rate Limiting" }), _jsx("pre", { children: _jsx("code", { children: `import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }
  
  // Process request
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Troubleshooting" }), _jsx("h3", { children: "Build Failures" }), _jsxs("ul", { children: [_jsx("li", { children: "Check build logs in Vercel dashboard" }), _jsxs("li", { children: ["Verify all dependencies are in ", _jsx("code", { children: "package.json" })] }), _jsxs("li", { children: ["Test build locally: ", _jsx("code", { children: "npm run build" })] }), _jsx("li", { children: "Clear build cache: Settings \u2192 General \u2192 Clear Cache" })] }), _jsx("h3", { children: "Slow Cold Starts" }), _jsxs("ul", { children: [_jsx("li", { children: "Use Edge Runtime where possible" }), _jsx("li", { children: "Keep bundle size small" }), _jsx("li", { children: "Lazy load heavy dependencies" }), _jsx("li", { children: "Consider serverless function warming" })] }), _jsx("h3", { children: "Function Timeouts" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Increase ", _jsx("code", { children: "maxDuration" }), " in ", _jsx("code", { children: "vercel.json" })] }), _jsx("li", { children: "Upgrade plan for longer timeouts" }), _jsx("li", { children: "Use background jobs for long tasks" }), _jsx("li", { children: "Stream responses to keep connection alive" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Cost Optimization" }), _jsx("h3", { children: "Hobby Plan (Free)" }), _jsxs("ul", { children: [_jsx("li", { children: "100GB bandwidth/month" }), _jsx("li", { children: "100 serverless function invocations/day" }), _jsx("li", { children: "Perfect for personal projects" })] }), _jsx("h3", { children: "Pro Plan ($20/month)" }), _jsxs("ul", { children: [_jsx("li", { children: "1TB bandwidth" }), _jsx("li", { children: "Unlimited invocations" }), _jsx("li", { children: "60s function timeout" }), _jsx("li", { children: "Password protection" })] }), _jsx("h3", { children: "Reduce Costs" }), _jsxs("ul", { children: [_jsx("li", { children: "Cache aggressively" }), _jsx("li", { children: "Optimize images" }), _jsx("li", { children: "Use ISR instead of SSR where possible" }), _jsx("li", { children: "Enable Gzip/Brotli compression" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/learn/deployment/aws", className: "docs-card", children: [_jsx("h3", { children: "Deploy to AWS" }), _jsx("p", { children: "Lambda + API Gateway deployment" })] }), _jsxs("a", { href: "/learn/deployment/docker", className: "docs-card", children: [_jsx("h3", { children: "Docker Deployment" }), _jsx("p", { children: "Self-hosted with containers" })] }), _jsxs("a", { href: "/guides/performance", className: "docs-card", children: [_jsx("h3", { children: "Performance Guide" }), _jsx("p", { children: "Optimization techniques" })] }), _jsxs("a", { href: "/learn/troubleshooting", className: "docs-card", children: [_jsx("h3", { children: "Troubleshooting" }), _jsx("p", { children: "Common issues and solutions" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map