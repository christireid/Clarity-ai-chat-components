import { Eye, Keyboard, Sparkles, FilePlus } from 'lucide-react'

export default function VSCodeToolsPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">VS Code Extension</h1>
        </div>
        <p className="text-xl text-text-secondary max-w-2xl">
          Intelligent completions, inline docs, snippets, CodeLens, and project automation for the Clarity
          Chat ecosystem—directly inside VS Code.
        </p>
      </header>

      <section className="bg-bg-secondary rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">✨ Highlights</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>Model-aware completions with pricing, context window, and documentation links.</li>
          <li>Hover tooltips for API keys, provider capabilities, and best practices.</li>
          <li>60+ snippets covering adapters, API routes, hooks, and RAG flows.</li>
          <li>Command palette helpers: initialise projects, add providers, validate configuration.</li>
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          icon={<Eye className="w-6 h-6" />}
          title="Hover Intelligence"
          description="Hover model IDs or env vars to see context windows, pricing, setup instructions, and quick docs links."
        />
        <FeatureCard
          icon={<Keyboard className="w-6 h-6" />}
          title="Smart Completions"
          description="Autocomplete provider models, environment variables, adapter APIs, and component props with inline docs."
        />
        <FeatureCard
          icon={<FilePlus className="w-6 h-6" />}
          title="Snippets"
          description="Prefix with `cc-` for production-ready snippets: chat UI, streaming hooks, Next.js API routes, cost tracking, and RAG workflows."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Commands</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-1">
          <li>
            <strong>Clarity Chat: Initialize Project</strong> – bootstrap Next.js, Express, or Hono apps with
            configured providers.
          </li>
          <li>
            <strong>Clarity Chat: Add Provider</strong> – install SDKs, create env vars, and scaffold example code.
          </li>
          <li>
            <strong>Clarity Chat: Validate Configuration</strong> – lint env files, detect missing keys, and check
            error handling.
          </li>
          <li>
            <strong>Clarity Chat: Show Examples</strong> – insert ready-to-run patterns (streaming, RAG, function
            calling, cost tracking, etc.).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Installation</h2>
        <pre className="bg-bg-secondary rounded-lg p-4 overflow-x-auto">
          <code>{`# Marketplace
# Search "Clarity Chat" and click Install

# VSIX
code --install-extension clarity-chat-0.1.0.vsix`}</code>
        </pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Configuration</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-1">
          <li>Enable/disable IntelliSense, CodeLens, and inline hints in <code>Preferences → Settings → Clarity Chat</code>.</li>
          <li>Set default provider for snippets (<code>openai</code>, <code>anthropic</code>, <code>google</code>).</li>
          <li>Manage API keys with the built-in secure key manager (encrypted via VS Code secrets storage).</li>
        </ul>
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
    <div className="bg-bg border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
    </div>
  )
}
