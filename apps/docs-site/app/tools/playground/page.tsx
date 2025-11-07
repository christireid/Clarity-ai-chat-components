import { Code2, Share2, Sparkles, TabletSmartphone } from 'lucide-react'

export default function PlaygroundToolPage() {
  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">Interactive Playground</h1>
        </div>
        <p className="text-xl text-text-secondary">
          Explore Clarity Chat components with live code editing, responsive previews, accessibility
          panels, and instant code generation.
        </p>
      </div>

      <section className="bg-bg-secondary rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold">🎮 EnhancedPlayground</h2>
        <p className="text-text-secondary">
          The <code>&lt;EnhancedPlayground /&gt;</code> component powers every interactive example on
          this site. It combines Monaco Editor, preset states, responsive viewports, quick actions, and
          code generation in a single package.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <FeatureCard title="Live code editing" icon={<Sparkles className="w-5 h-5" />}>
            TypeScript + JSX editing with linting, formatting, and hot reload previews.
          </FeatureCard>
          <FeatureCard title="Responsive previews" icon={<TabletSmartphone className="w-5 h-5" />}>
            Toggle mobile, tablet, and desktop breakpoints or set custom dimensions.
          </FeatureCard>
          <FeatureCard title="Quick actions" icon={<Share2 className="w-5 h-5" />}>
            Copy code, import statements, or open in CodeSandbox/StackBlitz instantly.
          </FeatureCard>
          <FeatureCard title="State inspector" icon={<Sparkles className="w-5 h-5" />}>
            Visualize props, internal state, and emitted events to debug complex flows.
          </FeatureCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">♿ Accessibility Panel</h2>
        <p className="text-text-secondary">
          Every playground includes the AccessibilityPanel component—expose keyboard shortcuts, ARIA
          attributes, WCAG status, and reduced motion hints directly in the UI.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">⚙️ Usage</h2>
        <pre className="bg-bg-secondary rounded-lg p-4 overflow-x-auto">
          <code>{`<EnhancedPlayground
  title="ChatWindow Playground"
  description="Experiment with message layouts, input behaviours, and themes."
  component="ChatWindow"
  initialCode={code}
  presets={chatWindowPresets}
  controls={chatWindowControls}
  showResponsiveControls
  showQuickActions
/>`}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold">🚀 Roadmap</h2>
        <ul className="space-y-2 text-text-secondary">
          <li>✓ Monaco Editor with TypeScript declarations</li>
          <li>✓ Integrated state inspector &amp; accessibility audit</li>
          <li>✓ Shareable presets and code generation</li>
          <li>⋯ Planned: AI-assisted code suggestions</li>
          <li>⋯ Planned: Shareable playground URLs</li>
        </ul>
      </section>
    </div>
  )
}

function FeatureCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-bg rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-brand-500">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{children}</p>
    </div>
  )
}
