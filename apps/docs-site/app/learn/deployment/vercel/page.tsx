import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Deploy to Vercel - Clarity Chat',
  description: 'Step-by-step guide to deploying Clarity Chat applications on Vercel.',
}

export default function VercelDeploymentPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Deployment</span>
        <h1>Deploy to Vercel</h1>
        <p className="docs-lead">
          Deploy your Clarity Chat application to Vercel with streaming, edge functions, and optimal performance.
        </p>
      </div>

      <section className="docs-section">
        <h2>Prerequisites</h2>
        <ul>
          <li>Vercel account (<a href="https://vercel.com/signup">sign up free</a>)</li>
          <li>GitHub, GitLab, or Bitbucket repository</li>
          <li>OpenAI API key or other LLM credentials</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Deploy</h2>
        <Callout type="info" title="One-Click Deploy">
          Deploy a starter template with one click:
        </Callout>
        <a href="https://vercel.com/new/clone?repository-url=https://github.com/clarity-chat/starter" className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
          Deploy to Vercel →
        </a>
      </section>

      <section className="docs-section">
        <h2>Manual Deployment</h2>

        <h3>1. Prepare Your Project</h3>
        <p>Ensure your Next.js project is configured for production:</p>
        <pre><code>{`// next.config.js
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
}`}</code></pre>

        <h3>2. Configure Environment Variables</h3>
        <p>Create <code>.env.example</code> for documentation:</p>
        <pre><code>{`# OpenAI
OPENAI_API_KEY=sk-...

# Optional: Vector Database
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=clarity-chat

# Optional: Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=...`}</code></pre>

        <h3>3. Connect Repository to Vercel</h3>
        <ol>
          <li>Go to <a href="https://vercel.com/new">vercel.com/new</a></li>
          <li>Import your Git repository</li>
          <li>Select framework preset: <strong>Next.js</strong></li>
          <li>Configure project:
            <ul>
              <li>Build Command: <code>npm run build</code></li>
              <li>Output Directory: <code>.next</code></li>
              <li>Install Command: <code>npm install</code></li>
            </ul>
          </li>
        </ol>

        <h3>4. Add Environment Variables</h3>
        <p>In Vercel dashboard → Settings → Environment Variables:</p>
        <ul>
          <li>Add all variables from <code>.env.example</code></li>
          <li>Set for Production, Preview, and Development</li>
          <li>Sensitive keys: Use Production only</li>
        </ul>

        <h3>5. Deploy</h3>
        <p>Click <strong>Deploy</strong> and wait for build to complete (~2 minutes).</p>
      </section>

      <section className="docs-section">
        <h2>Enable Streaming</h2>
        <p>Configure streaming for AI responses:</p>
        
        <h3>Option 1: vercel.json (Recommended)</h3>
        <pre><code>{`{
  "functions": {
    "app/api/chat/route.ts": {
      "maxDuration": 60
    },
    "app/api/*/route.ts": {
      "maxDuration": 30
    }
  }
}`}</code></pre>

        <h3>Option 2: Route Segment Config</h3>
        <pre><code>{`// app/api/chat/route.ts
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // Your streaming code
}`}</code></pre>

        <Callout type="warning" title="Timeout Limits">
          • Hobby: 10s<br/>
          • Pro: 60s<br/>
          • Enterprise: 900s (15 min)
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Edge Functions</h2>
        <p>Use Edge Runtime for lower latency (120+ global regions):</p>
        <pre><code>{`// app/api/chat/route.ts
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
}`}</code></pre>

        <Callout type="info" title="Edge Limitations">
          • No Node.js APIs (fs, child_process)<br/>
          • Max response: 4MB<br/>
          • Use for simple proxying and streaming
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Custom Domain</h2>
        <ol>
          <li>Go to Project → Settings → Domains</li>
          <li>Add your domain: <code>chat.yourdomain.com</code></li>
          <li>Configure DNS:
            <ul>
              <li><strong>A Record:</strong> <code>76.76.21.21</code></li>
              <li>Or <strong>CNAME:</strong> <code>cname.vercel-dns.com</code></li>
            </ul>
          </li>
          <li>SSL automatically provisioned (~5 minutes)</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Performance Optimization</h2>

        <h3>Caching</h3>
        <pre><code>{`// Revalidate static pages
export const revalidate = 3600 // 1 hour

// Cache API responses
export async function GET() {
  const data = await fetchData()
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  })
}`}</code></pre>

        <h3>Image Optimization</h3>
        <pre><code>{`import Image from 'next/image'

<Image
  src="/avatar.png"
  width={40}
  height={40}
  alt="User avatar"
  loading="lazy"
/>`}</code></pre>

        <h3>Bundle Analysis</h3>
        <pre><code>{`// Install analyzer
npm install @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  // your config
})

// Run analysis
ANALYZE=true npm run build`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Monitoring & Analytics</h2>

        <h3>Vercel Analytics</h3>
        <pre><code>{`// app/layout.tsx
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
}`}</code></pre>

        <h3>Speed Insights</h3>
        <pre><code>{`npm install @vercel/speed-insights

// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

<SpeedInsights />`}</code></pre>

        <h3>Custom Monitoring</h3>
        <pre><code>{`// Track API errors
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
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Environment-Specific Configuration</h2>
        <pre><code>{`// Different configs per environment
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
export const appConfig = config[env]`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>CI/CD Workflow</h2>

        <h3>Automatic Deployments</h3>
        <ul>
          <li><strong>Production:</strong> Push to <code>main</code> branch</li>
          <li><strong>Preview:</strong> Any pull request</li>
          <li><strong>Development:</strong> Any branch push</li>
        </ul>

        <h3>Deploy Hooks</h3>
        <p>Trigger deploys via API:</p>
        <pre><code>{`# Get deploy hook URL from Settings → Git
curl -X POST https://api.vercel.com/v1/integrations/deploy/...

# Use in CI/CD
- name: Deploy to Vercel
  run: |
    curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}`}</code></pre>

        <h3>Preview Comments</h3>
        <p>Vercel automatically comments on PRs with preview URLs</p>
      </section>

      <section className="docs-section">
        <h2>Security Best Practices</h2>

        <h3>Environment Variables</h3>
        <ul>
          <li>Never commit API keys to Git</li>
          <li>Use different keys for prod/preview/dev</li>
          <li>Rotate keys regularly</li>
          <li>Limit key permissions</li>
        </ul>

        <h3>CORS Configuration</h3>
        <pre><code>{`// middleware.ts
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
}`}</code></pre>

        <h3>Rate Limiting</h3>
        <pre><code>{`import { Ratelimit } from '@upstash/ratelimit'
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
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>Build Failures</h3>
        <ul>
          <li>Check build logs in Vercel dashboard</li>
          <li>Verify all dependencies are in <code>package.json</code></li>
          <li>Test build locally: <code>npm run build</code></li>
          <li>Clear build cache: Settings → General → Clear Cache</li>
        </ul>

        <h3>Slow Cold Starts</h3>
        <ul>
          <li>Use Edge Runtime where possible</li>
          <li>Keep bundle size small</li>
          <li>Lazy load heavy dependencies</li>
          <li>Consider serverless function warming</li>
        </ul>

        <h3>Function Timeouts</h3>
        <ul>
          <li>Increase <code>maxDuration</code> in <code>vercel.json</code></li>
          <li>Upgrade plan for longer timeouts</li>
          <li>Use background jobs for long tasks</li>
          <li>Stream responses to keep connection alive</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Cost Optimization</h2>

        <h3>Hobby Plan (Free)</h3>
        <ul>
          <li>100GB bandwidth/month</li>
          <li>100 serverless function invocations/day</li>
          <li>Perfect for personal projects</li>
        </ul>

        <h3>Pro Plan ($20/month)</h3>
        <ul>
          <li>1TB bandwidth</li>
          <li>Unlimited invocations</li>
          <li>60s function timeout</li>
          <li>Password protection</li>
        </ul>

        <h3>Reduce Costs</h3>
        <ul>
          <li>Cache aggressively</li>
          <li>Optimize images</li>
          <li>Use ISR instead of SSR where possible</li>
          <li>Enable Gzip/Brotli compression</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/learn/deployment/aws" className="docs-card">
            <h3>Deploy to AWS</h3>
            <p>Lambda + API Gateway deployment</p>
          </a>
          <a href="/learn/deployment/docker" className="docs-card">
            <h3>Docker Deployment</h3>
            <p>Self-hosted with containers</p>
          </a>
          <a href="/guides/performance" className="docs-card">
            <h3>Performance Guide</h3>
            <p>Optimization techniques</p>
          </a>
          <a href="/learn/troubleshooting" className="docs-card">
            <h3>Troubleshooting</h3>
            <p>Common issues and solutions</p>
          </a>
        </div>
      </section>
    </div>
  )
}
