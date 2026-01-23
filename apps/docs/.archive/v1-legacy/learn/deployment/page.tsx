import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Deployment Guides - Clarity Chat',
  description: 'Deploy your Clarity Chat application to production with our platform-specific guides.',
}

export default function DeploymentPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Deployment</span>
        <h1>Deployment Guides</h1>
        <p className="docs-lead">
          Deploy your Clarity Chat application to production with optimized configurations
          for your preferred hosting platform.
        </p>
      </div>

      <Callout type="info" title="Recommended">
        For most Next.js applications, we recommend <strong>Vercel</strong> for the
        simplest deployment experience with automatic optimizations.
      </Callout>

      <section className="docs-section">
        <h2>Choose Your Platform</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link
            href="/learn/deployment/vercel"
            className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-black" viewBox="0 0 116 100" fill="currentColor">
                  <path d="M57.5 0L115 100H0L57.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold group-hover:text-brand-600 transition-colors">Vercel</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Zero-config deployment with edge functions, streaming support, and automatic optimizations.
            </p>
            <ul className="mt-4 text-sm text-gray-500 dark:text-gray-500 space-y-1">
              <li>Edge Functions</li>
              <li>Streaming SSR</li>
              <li>Preview Deployments</li>
            </ul>
          </Link>

          <Link
            href="/learn/deployment/aws"
            className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#232F3E] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.75 11.35a4.32 4.32 0 0 1-.79-.08 3.9 3.9 0 0 1-.73-.23l-.17-.04h-.12q-.15 0-.15.21v.33a.43.43 0 0 0 0 .19.5.5 0 0 0 .21.19 3 3 0 0 0 .76.26 4.38 4.38 0 0 0 1 .12 2.24 2.24 0 0 0 1.54-.47 1.54 1.54 0 0 0 .54-1.22 1.43 1.43 0 0 0-.32-1 2.61 2.61 0 0 0-1.05-.64l-.57-.22a1.67 1.67 0 0 1-.59-.35.59.59 0 0 1-.17-.44.62.62 0 0 1 .26-.54 1.22 1.22 0 0 1 .72-.19 2.56 2.56 0 0 1 1.12.27.35.35 0 0 0 .12 0q.14 0 .14-.18v-.3a.46.46 0 0 0-.06-.22.36.36 0 0 0-.2-.14 2.84 2.84 0 0 0-1.18-.24 2.08 2.08 0 0 0-1.43.46 1.53 1.53 0 0 0-.52 1.2 1.54 1.54 0 0 0 .42 1.14 2.47 2.47 0 0 0 1.14.69c.26.09.49.17.68.25a1.33 1.33 0 0 1 .49.33.63.63 0 0 1 .15.43.66.66 0 0 1-.27.56 1.29 1.29 0 0 1-.77.2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold group-hover:text-brand-600 transition-colors">AWS</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Enterprise-grade deployment with Lambda, CloudFront, and full AWS ecosystem integration.
            </p>
            <ul className="mt-4 text-sm text-gray-500 dark:text-gray-500 space-y-1">
              <li>Lambda Functions</li>
              <li>CloudFront CDN</li>
              <li>DynamoDB/S3 Storage</li>
            </ul>
          </Link>

          <Link
            href="/learn/deployment/docker"
            className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#2496ED] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.98 11.08h2.12a.19.19 0 0 0 .19-.19V9.01a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .11.08.19.19.19m-2.95-5.43h2.12a.19.19 0 0 0 .19-.19V3.58a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .1.09.19.19.19m0 2.71h2.12a.19.19 0 0 0 .19-.19V6.29a.19.19 0 0 0-.19-.19h-2.12a.19.19 0 0 0-.19.19v1.88c0 .11.09.19.19.19m-2.93 0h2.12a.19.19 0 0 0 .19-.19V6.29a.19.19 0 0 0-.19-.19H8.1a.19.19 0 0 0-.19.19v1.88c0 .11.08.19.19.19m-2.96 0h2.12a.19.19 0 0 0 .19-.19V6.29a.19.19 0 0 0-.19-.19H5.14a.19.19 0 0 0-.18.19v1.88c0 .11.08.19.18.19" />
                </svg>
              </div>
              <h3 className="text-xl font-bold group-hover:text-brand-600 transition-colors">Docker</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Self-hosted deployment with Docker containers for any cloud or on-premises infrastructure.
            </p>
            <ul className="mt-4 text-sm text-gray-500 dark:text-gray-500 space-y-1">
              <li>Any Cloud Provider</li>
              <li>On-Premises Support</li>
              <li>Full Control</li>
            </ul>
          </Link>
        </div>
      </section>

      <section className="docs-section">
        <h2>Pre-Deployment Checklist</h2>
        <p className="mb-4">Before deploying, ensure you have:</p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded flex items-center justify-center text-xs">✓</span>
            <span>Environment variables configured (API keys, database URLs)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded flex items-center justify-center text-xs">✓</span>
            <span>Build passes locally (<code>npm run build</code>)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded flex items-center justify-center text-xs">✓</span>
            <span>Tests passing (<code>npm test</code>)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded flex items-center justify-center text-xs">✓</span>
            <span>CORS and security headers configured</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-5 h-5 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded flex items-center justify-center text-xs">✓</span>
            <span>Rate limiting in place for API routes</span>
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related Resources</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <a href="/guides/production-deployment" className="docs-card">
            <strong>Production Deployment Guide</strong>
            <span>Best practices for production</span>
          </a>
          <a href="/guides/security" className="docs-card">
            <strong>Security Guide</strong>
            <span>Secure your deployment</span>
          </a>
          <a href="/guides/performance" className="docs-card">
            <strong>Performance Guide</strong>
            <span>Optimize for production</span>
          </a>
          <a href="/cookbook/production-monitoring" className="docs-card">
            <strong>Production Monitoring</strong>
            <span>Monitor your application</span>
          </a>
        </div>
      </section>
    </div>
  )
}
