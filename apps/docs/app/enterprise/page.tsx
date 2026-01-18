'use client'

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Database,
  Users,
  Zap,
  Lock,
  BarChart3,
  Globe,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Building,
  Sparkles,
} from 'lucide-react'

export default function EnterprisePage() {
  return (
    <div className="docs-content">
      {/* Hero Section */}
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Enterprise-Grade AI Chat
        </h1>
        <p className="docs-lead text-xl">
          Production-ready AI components with enterprise security, compliance,
          and dedicated support for teams building at scale.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/enterprise/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Headphones className="w-5 h-5" />
            Contact Sales
          </Link>
          <Link
            href="/enterprise/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Request Demo
          </Link>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="my-12 py-8 border-y border-border">
        <p className="text-sm text-center text-muted-foreground mb-6">
          Trusted by leading companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="font-semibold">HealthAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="font-semibold">TechCorp</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="font-semibold">FinanceHub</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="font-semibold">RetailAI</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-6 h-6" />
            <span className="font-semibold">EduTech</span>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="docs-section">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border border-blue-100 dark:border-blue-900">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              70+
            </div>
            <div className="text-sm text-muted-foreground mt-1">Components</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-900">
            <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
              99.9%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Uptime SLA</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-900">
            <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
              4hr
            </div>
            <div className="text-sm text-muted-foreground mt-1">Support SLA</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
              SOC2
            </div>
            <div className="text-sm text-muted-foreground mt-1">Certified</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="docs-section">
        <h2>Enterprise Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title="Vector Stores"
            description="Pinecone, Qdrant, Weaviate, Chroma integrations for RAG"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Agent Orchestration"
            description="Multi-agent systems with tool calling and memory"
          />
          <FeatureCard
            icon={<Lock className="w-6 h-6" />}
            title="SSO & RBAC"
            description="SAML/OIDC single sign-on with role-based access"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Compliance"
            description="HIPAA, SOC2, GDPR compliant with audit logging"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Multi-Tenancy"
            description="Isolated tenant environments with custom branding"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Analytics"
            description="Usage metrics, cost tracking, and performance insights"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Global CDN"
            description="Edge deployment for low-latency worldwide access"
          />
          <FeatureCard
            icon={<Headphones className="w-6 h-6" />}
            title="Dedicated Support"
            description="Named engineer with 4-hour response SLA"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="White Label"
            description="Full customization with your branding"
          />
        </div>
      </section>

      {/* Full Feature List */}
      <section className="docs-section">
        <h2>Complete Feature List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {enterpriseFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2 py-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="docs-section">
        <h2>Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/guides/rag" className="docs-card group">
            <h3 className="flex items-center gap-2">
              RAG Guide
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Build retrieval-augmented generation applications</p>
          </Link>
          <Link href="/guides/multi-tenancy-setup" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Multi-Tenancy
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Configure multi-tenant architecture</p>
          </Link>
          <Link href="/guides/security" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Security Guide
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Security best practices and compliance</p>
          </Link>
          <Link href="/guides/sso-configuration" className="docs-card group">
            <h3 className="flex items-center gap-2">
              SSO Configuration
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Set up single sign-on authentication</p>
          </Link>
          <Link href="/enterprise/pricing" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Pricing
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Enterprise pricing information</p>
          </Link>
          <Link href="/enterprise/case-studies" className="docs-card group">
            <h3 className="flex items-center gap-2">
              Case Studies
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p>Real-world enterprise implementations</p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="my-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to scale your AI chat?
        </h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Get in touch with our team to discuss your enterprise needs and see a
          personalized demo of Clarity Chat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/enterprise/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Headphones className="w-5 h-5" />
            Talk to Sales
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
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

const enterpriseFeatures = [
  'Vector Stores (Pinecone, Qdrant, Weaviate, Chroma)',
  'Embeddings with automatic caching',
  'Agent Orchestration',
  'Prompt Templates',
  'Document Loaders',
  'Model Fallback',
  'Context Window Management',
  'Rate Limiting',
  'Hybrid Search',
  'AI Safety & Guardrails',
  'Observability & Tracing',
  'Reranking',
  'Webhooks',
  'Plugins',
  'Audit Logging',
  'Usage Quotas',
  'Multi-Tenancy',
  'Role-Based Access Control',
  'SSO (SAML/OIDC)',
  'White-Label Branding',
  'Custom Model Adapters',
  'Priority Support',
]
