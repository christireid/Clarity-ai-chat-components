import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic' // Avoid serialization errors during static generation

export const metadata: Metadata = {
  title: 'Case Studies - Clarity Chat Enterprise',
  description: 'Real companies, real results',
}

export default function CaseStudiesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>Clarity Chat Case Studies</h1>
        <p className="docs-lead">
          Real companies, real results
        </p>
      </div>

      <section className="docs-section">
        <h2>🏥 HealthAI - Medical Consultation Assistant</h2>
        <h3>Company Profile</h3>
        <ul>
          <li><strong>Industry:</strong> Healthcare Technology</li>
          <li><strong>Size:</strong> 150 employees</li>
          <li><strong>Use Case:</strong> HIPAA-compliant AI medical consultation</li>
          <li><strong>License:</strong> Enterprise</li>
        </ul>

        <h3>Challenge</h3>
        <p>
          HealthAI needed to build a HIPAA-compliant AI chat interface for patient consultations. Requirements included:
        </p>
        <ul>
          <li>WCAG AAA accessibility for diverse patient population</li>
          <li>HIPAA compliance and audit trails</li>
          <li>Multi-language support</li>
          <li>Mobile-first design for patients on-the-go</li>
          <li>Integration with existing EHR system</li>
          <li>Tight 8-week launch deadline</li>
        </ul>
        <p>
          Building from scratch would have taken 6 months and cost $200K+.
        </p>

        <h3>Solution</h3>
        <p>
          Implemented Clarity Chat Enterprise with WCAG AAA accessible components, audit logging for HIPAA compliance, multi-tenant authentication, custom white-label branding, mobile-optimized interface, and OpenAI GPT-4 integration with medical guardrails.
        </p>

        <h3>Results</h3>
        <ul>
          <li>✅ <strong>Launched in 5 weeks</strong> (3 weeks ahead of schedule)</li>
          <li>✅ <strong>Passed WCAG AAA audit</strong> on first attempt</li>
          <li>✅ <strong>Zero HIPAA violations</strong> in first 6 months</li>
          <li>✅ <strong>$150K saved</strong> in development costs</li>
          <li>✅ <strong>98% patient satisfaction</strong> score</li>
          <li>✅ <strong>40% reduction</strong> in average consultation time</li>
          <li>✅ <strong>3,000+ consultations/month</strong> within first quarter</li>
        </ul>

        <Callout type="quote">
          "Clarity Chat was a game-changer. We passed our HIPAA audit with flying colors, and patients love the accessibility features. The money we saved on development went straight into improving our AI models."
          <br />
          <strong>— Dr. Michael Rodriguez, CTO at HealthAI</strong>
        </Callout>
      </section>

      <section className="docs-section">
        <h2>💼 TechCorp - Internal AI Assistant</h2>
        <h3>Company Profile</h3>
        <ul>
          <li><strong>Industry:</strong> Enterprise Software</li>
          <li><strong>Size:</strong> 2,500 employees</li>
          <li><strong>Use Case:</strong> Internal knowledge base assistant</li>
          <li><strong>License:</strong> Enterprise Plus</li>
        </ul>

        <h3>Challenge</h3>
        <p>
          TechCorp wanted to build an internal AI assistant for their 2,500 employees to query internal documentation (100K+ pages), access company policies, get instant answers to HR and IT questions, support 24/7 across global offices, integrate with existing SSO (Okta), and support multiple languages.
        </p>
        <p>
          Initial quotes from dev agencies ranged from $300K-$500K with 9-12 month timelines.
        </p>

        <h3>Solution</h3>
        <p>
          Deployed Clarity Chat Enterprise Plus with SSO configuration wizard for Okta integration, RAG implementation with Pinecone vector store, multi-tenant support for different departments, custom branding matching company design system, 11 language translations, and enterprise analytics dashboard.
        </p>

        <h3>Results</h3>
        <ul>
          <li>✅ <strong>Launched in 8 weeks</strong> (4 months ahead of original timeline)</li>
          <li>✅ <strong>$400K cost savings</strong> vs. agency quotes</li>
          <li>✅ <strong>15,000+ queries/month</strong> across all offices</li>
          <li>✅ <strong>92% answer accuracy</strong> rate</li>
          <li>✅ <strong>70% reduction</strong> in IT help desk tickets</li>
        </ul>
      </section>
    </div>
  )
}
