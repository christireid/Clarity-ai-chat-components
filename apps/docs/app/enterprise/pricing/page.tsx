import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Pricing - Clarity Chat Enterprise',
  description: 'Professional AI Chat Components for Modern Applications',
}

export default function PricingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>Clarity Chat Pricing Guide</h1>
        <p className="docs-lead">
          Professional AI Chat Components for Modern Applications
        </p>
      </div>

      <section className="docs-section">
        <h2>Quick Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-4 text-left">Feature</th>
                <th className="border border-border p-4 text-left">Free</th>
                <th className="border border-border p-4 text-left">Pro Individual</th>
                <th className="border border-border p-4 text-left">Pro Team</th>
                <th className="border border-border p-4 text-left">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-4 font-semibold">Price</td>
                <td className="border border-border p-4">$0</td>
                <td className="border border-border p-4">$149/year or $499 lifetime</td>
                <td className="border border-border p-4">$499/year or $1,499 lifetime</td>
                <td className="border border-border p-4">Starting at $2,499/year</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-semibold">Developer Seats</td>
                <td className="border border-border p-4">Unlimited</td>
                <td className="border border-border p-4">1</td>
                <td className="border border-border p-4">5 (+$99/seat)</td>
                <td className="border border-border p-4">10-Unlimited</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-semibold">Core Components</td>
                <td className="border border-border p-4">✅ 15+</td>
                <td className="border border-border p-4">✅ 15+</td>
                <td className="border border-border p-4">✅ 15+</td>
                <td className="border border-border p-4">✅ 15+</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-semibold">Premium Components</td>
                <td className="border border-border p-4">❌</td>
                <td className="border border-border p-4">✅ 55+</td>
                <td className="border border-border p-4">✅ 55+</td>
                <td className="border border-border p-4">✅ 70+</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-semibold">AI Provider Adapters</td>
                <td className="border border-border p-4">❌</td>
                <td className="border border-border p-4">✅ 4 providers</td>
                <td className="border border-border p-4">✅ 4 providers</td>
                <td className="border border-border p-4">✅ Unlimited</td>
              </tr>
              <tr>
                <td className="border border-border p-4 font-semibold">Support</td>
                <td className="border border-border p-4">Community</td>
                <td className="border border-border p-4">Email (48h)</td>
                <td className="border border-border p-4">Email (24h)</td>
                <td className="border border-border p-4">Dedicated (4h SLA)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="docs-section">
        <h2>Free Tier (MIT License)</h2>
        <p>
          <strong>Perfect for:</strong> Personal projects, open-source, learning, prototyping
        </p>
        <p>
          <strong>Get Started:</strong>
        </p>
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/primitives
npm install @clarity-chat/types`}
        />
      </section>

      <section className="docs-section">
        <h2>Pro Individual - $149/year or $499 lifetime</h2>
        <p>
          <strong>Perfect for:</strong> Freelancers, indie developers, small projects
        </p>
        <p>
          Everything in Free, plus 55+ premium components, 11 themes, 4 AI providers, and email support.
        </p>
      </section>

      <section className="docs-section">
        <h2>Pro Team - $499/year or $1,499 lifetime</h2>
        <p>
          <strong>Perfect for:</strong> Startups, small teams
        </p>
        <p>
          Everything in Pro Individual, plus 5 developer seats, priority support, VS Code extension, and CLI tools.
        </p>
      </section>

      <section className="docs-section">
        <h2>Enterprise - Starting at $2,499/year</h2>
        <p>
          <strong>Perfect for:</strong> Companies, SaaS products
        </p>
        <p>
          70+ components (everything), unlimited AI providers, vector databases & RAG, white-label support, 4-hour SLA, and dedicated engineer.
        </p>
      </section>
    </div>
  )
}
