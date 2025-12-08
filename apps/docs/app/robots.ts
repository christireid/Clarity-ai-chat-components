import type { MetadataRoute } from 'next'

/**
 * Robots.txt configuration for AI documentation
 *
 * Uses Next.js App Router convention for dynamic generation.
 * Environment-aware: blocks all crawlers in development.
 *
 * AI Crawlers Supported:
 * - GPTBot (OpenAI)
 * - ChatGPT-User (OpenAI)
 * - Claude-Web (Anthropic)
 * - Anthropic-AI (Anthropic)
 * - Google-Extended (Google AI)
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://clarity-chat.dev'
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Block all crawlers in development
  if (isDevelopment) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/private/'],
      },
      // AI-specific crawler rules - allow access to AI endpoints and docs
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/api/ai/',
          '/reference/',
          '/guides/',
          '/cookbook/',
        ],
        disallow: ['/api/auth/', '/api/internal/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/api/ai/',
          '/reference/',
          '/guides/',
          '/cookbook/',
        ],
        disallow: ['/api/auth/', '/api/internal/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/api/ai/',
          '/reference/',
          '/guides/',
          '/cookbook/',
        ],
        disallow: ['/api/auth/', '/api/internal/'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/api/ai/',
          '/reference/',
          '/guides/',
          '/cookbook/',
        ],
        disallow: ['/api/auth/', '/api/internal/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
      },
      // Standard search engine bots
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
