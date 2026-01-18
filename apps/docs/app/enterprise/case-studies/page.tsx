'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Headphones,
  Sparkles,
  Heart,
  Briefcase,
  Shield,
  TrendingUp,
} from 'lucide-react'

export default function CaseStudiesPage() {
  return (
    <div className="docs-content">
      <div className="docs-header text-center">
        <span className="docs-badge">Case Studies</span>
        <h1 className="text-4xl md:text-5xl font-bold">
          Real Companies, Real Results
        </h1>
        <p className="docs-lead text-xl max-w-2xl mx-auto">
          See how leading companies use Clarity Chat to build production-ready
          AI experiences.
        </p>
      </div>

      {/* Company Logos */}
      <section className="my-12 py-8 border-y border-border">
        <p className="text-sm text-center text-muted-foreground mb-6">
          Trusted by innovative companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <CompanyLogo name="HealthAI" icon={<Heart className="w-5 h-5" />} />
          <CompanyLogo
            name="TechCorp"
            icon={<Briefcase className="w-5 h-5" />}
          />
          <CompanyLogo name="FinanceHub" icon={<TrendingUp className="w-5 h-5" />} />
          <CompanyLogo name="SecureAI" icon={<Shield className="w-5 h-5" />} />
          <CompanyLogo name="EduTech" icon={<Users className="w-5 h-5" />} />
        </div>
      </section>

      {/* Case Study 1: HealthAI */}
      <CaseStudy
        company="HealthAI"
        industry="Healthcare Technology"
        employees={150}
        useCase="HIPAA-compliant AI medical consultation"
        license="Enterprise"
        logo={<Heart className="w-8 h-8 text-rose-500" />}
        gradient="from-rose-500 to-pink-500"
        challenge={[
          'WCAG AAA accessibility for diverse patient population',
          'HIPAA compliance and audit trails',
          'Multi-language support',
          'Mobile-first design for patients on-the-go',
          'Integration with existing EHR system',
          'Tight 8-week launch deadline',
        ]}
        challengeNote="Building from scratch would have taken 6 months and cost $200K+."
        solution="Implemented Clarity Chat Enterprise with WCAG AAA accessible components, audit logging for HIPAA compliance, multi-tenant authentication, custom white-label branding, mobile-optimized interface, and OpenAI GPT-4 integration with medical guardrails."
        metrics={[
          { label: 'Launch Time', value: '5 weeks', detail: '3 weeks ahead of schedule' },
          { label: 'Cost Savings', value: '$150K', detail: 'vs. building from scratch' },
          { label: 'Patient Satisfaction', value: '98%', detail: 'satisfaction score' },
          { label: 'Consultations', value: '3,000+', detail: 'per month' },
        ]}
        results={[
          'Passed WCAG AAA audit on first attempt',
          'Zero HIPAA violations in first 6 months',
          '40% reduction in average consultation time',
        ]}
        testimonial={{
          quote:
            'Clarity Chat was a game-changer. We passed our HIPAA audit with flying colors, and patients love the accessibility features. The money we saved on development went straight into improving our AI models.',
          author: 'Dr. Michael Rodriguez',
          role: 'CTO at HealthAI',
        }}
      />

      {/* Case Study 2: TechCorp */}
      <CaseStudy
        company="TechCorp"
        industry="Enterprise Software"
        employees={2500}
        useCase="Internal knowledge base assistant"
        license="Enterprise Plus"
        logo={<Briefcase className="w-8 h-8 text-blue-500" />}
        gradient="from-blue-500 to-indigo-500"
        challenge={[
          'Query internal documentation (100K+ pages)',
          'Access company policies instantly',
          'Get instant answers to HR and IT questions',
          'Support 24/7 across global offices',
          'Integrate with existing SSO (Okta)',
          'Support multiple languages (11 total)',
        ]}
        challengeNote="Initial quotes from dev agencies ranged from $300K-$500K with 9-12 month timelines."
        solution="Deployed Clarity Chat Enterprise Plus with SSO configuration wizard for Okta integration, RAG implementation with Pinecone vector store, multi-tenant support for different departments, custom branding matching company design system, 11 language translations, and enterprise analytics dashboard."
        metrics={[
          { label: 'Launch Time', value: '8 weeks', detail: '4 months ahead of timeline' },
          { label: 'Cost Savings', value: '$400K', detail: 'vs. agency quotes' },
          { label: 'Answer Accuracy', value: '92%', detail: 'accuracy rate' },
          { label: 'Monthly Queries', value: '15K+', detail: 'across all offices' },
        ]}
        results={[
          '70% reduction in IT help desk tickets',
          'Seamless SSO integration with Okta',
          '11 languages supported across global offices',
        ]}
        testimonial={{
          quote:
            'We went from concept to deployment in 8 weeks. The SSO wizard made Okta integration painless, and the RAG accuracy exceeded our expectations.',
          author: 'Sarah Chen',
          role: 'VP of Engineering at TechCorp',
        }}
      />

      {/* Case Study 3: FinanceHub */}
      <CaseStudy
        company="FinanceHub"
        industry="Financial Services"
        employees={800}
        useCase="Customer support chatbot"
        license="Enterprise"
        logo={<TrendingUp className="w-8 h-8 text-emerald-500" />}
        gradient="from-emerald-500 to-teal-500"
        challenge={[
          'PCI-DSS compliance for financial data',
          'Real-time fraud detection integration',
          'Multi-channel deployment (web, mobile, voice)',
          'Sub-second response times',
          'Audit logging for regulatory compliance',
        ]}
        challengeNote="Previous chatbot solution had 45% containment rate and frequent compliance issues."
        solution="Implemented Clarity Chat Enterprise with PCI-DSS compliant architecture, real-time streaming for instant responses, multi-channel components, comprehensive audit logging, and custom model fine-tuning for financial terminology."
        metrics={[
          { label: 'Containment Rate', value: '78%', detail: 'up from 45%' },
          { label: 'Response Time', value: '<500ms', detail: 'average response' },
          { label: 'Support Cost', value: '-35%', detail: 'reduction' },
          { label: 'CSAT Score', value: '4.6/5', detail: 'customer satisfaction' },
        ]}
        results={[
          'Zero compliance violations since deployment',
          '33% improvement in containment rate',
          'Seamless handoff to human agents when needed',
        ]}
        testimonial={{
          quote:
            'The streaming capabilities and audit logging were exactly what we needed. Our containment rate jumped from 45% to 78% in the first quarter.',
          author: 'James Morrison',
          role: 'Head of Digital at FinanceHub',
        }}
      />

      {/* CTA */}
      <section className="my-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to write your success story?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join these companies and hundreds more building production AI
          experiences with Clarity Chat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/enterprise/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Headphones className="w-5 h-5" />
            Contact Sales
          </Link>
          <Link
            href="/enterprise/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Book a Demo
          </Link>
        </div>
      </section>

      {/* More Resources */}
      <section className="docs-section">
        <h2>Learn More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/enterprise" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Enterprise Features
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Explore all enterprise capabilities</p>
          </Link>
          <Link href="/enterprise/pricing" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Pricing
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Find the right plan for your team</p>
          </Link>
          <Link href="/guides/security" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Security Guide
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Learn about our security practices</p>
          </Link>
        </div>
      </section>
    </div>
  )
}

function CompanyLogo({
  name,
  icon,
}: {
  name: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
      {icon}
      <span className="font-semibold">{name}</span>
    </div>
  )
}

function CaseStudy({
  company,
  industry,
  employees,
  useCase,
  license,
  logo,
  gradient,
  challenge,
  challengeNote,
  solution,
  metrics,
  results,
  testimonial,
}: {
  company: string
  industry: string
  employees: number
  useCase: string
  license: string
  logo: React.ReactNode
  gradient: string
  challenge: string[]
  challengeNote: string
  solution: string
  metrics: { label: string; value: string; detail: string }[]
  results: string[]
  testimonial: { quote: string; author: string; role: string }
}) {
  return (
    <section className="my-16 first:mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
        >
          {logo}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{company}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              {industry}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {employees.toLocaleString()} employees
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {license}
            </span>
          </div>
        </div>
      </div>

      {/* Use Case */}
      <div className="mb-8 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="font-medium">
          <strong>Use Case:</strong> {useCase}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-border text-center"
          >
            <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {metric.value}
            </div>
            <div className="text-sm font-medium">{metric.label}</div>
            <div className="text-xs text-muted-foreground">{metric.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Challenge */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm">
              1
            </span>
            Challenge
          </h3>
          <ul className="space-y-2 mb-4">
            {challenge.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground italic">{challengeNote}</p>
        </div>

        {/* Solution */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              2
            </span>
            Solution
          </h3>
          <p className="text-sm leading-relaxed">{solution}</p>
        </div>
      </div>

      {/* Results */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm">
            3
          </span>
          Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {results.map((result) => (
            <div
              key={result}
              className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">{result}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-border relative">
        <MessageSquare className="w-8 h-8 text-blue-500/20 absolute top-4 left-4" />
        <blockquote className="relative z-10">
          <p className="text-lg italic mb-4 pl-8">&quot;{testimonial.quote}&quot;</p>
          <footer className="pl-8">
            <p className="font-semibold">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
