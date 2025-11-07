import { TestTube, CheckCircle2, Accessibility, Gauge } from 'lucide-react'

export default function TestingToolsPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">Testing Infrastructure</h1>
        </div>
        <p className="text-xl text-text-secondary">
          Production-grade QA pipelines with Vitest, Playwright, Axe, and Storybook visual regression.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <StatCard label="Unit Tests" value="420+" description="Vitest + Testing Library suites" />
        <StatCard label="E2E Flows" value="38" description="Playwright scenarios" />
        <StatCard label="Coverage Target" value="85%" description="Enforced in CI" />
      </section>

      <section className="bg-bg-secondary rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">🧪 Unit &amp; Component Testing</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>Vitest configuration exports Jest-compatible globals for easy migration.</li>
          <li>Testing Library helpers triage streaming updates and asynchronous retries.</li>
          <li>
            Run <code>npm run test -- --coverage</code> to generate Istanbul reports ingested by CI dashboards.
          </li>
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <FeatureTile
          icon={<Accessibility className="w-6 h-6" />}
          title="Accessibility Automation"
          description="Playwright + Axe-core cover keyboard navigation, colour contrast, and ARIA compliance every deploy."
          bullets={[
            'ship-ready playwright fixtures',
            'auto-screenshots on failure',
            'CI annotations for WCAG violations',
          ]}
        />
        <FeatureTile
          icon={<Gauge className="w-6 h-6" />}
          title="Performance Benchmarks"
          description="Automated bundle analysis and streaming benchmarks with budget thresholds."
          bullets={[
            'size-limit checks by package',
            'bundle analyzer HTML artifacts',
            'baseline comparison with alerts',
          ]}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">✅ CI Workflow</h2>
        <p className="text-text-secondary">
          The <code>.github/workflows/test.yml</code> pipeline runs lint, unit tests, e2e tests, axe audits,
          and bundle analysis in parallel. Failures block merges, while coverage reports publish to the
          GitHub summary page.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">🚀 Quick Commands</h2>
        <pre className="bg-bg-secondary rounded-lg p-4 overflow-x-auto">
          <code>{`# Unit tests
npm run test -- --watch

# End-to-end suite
npm run test:e2e

# Accessibility audits
npm run test:e2e -- --grep \"a11y\"

# Visual regression (Chromatic)
npm run chromatic`}</code>
        </pre>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="bg-bg border border-border rounded-xl p-6">
      <div className="text-sm uppercase tracking-wide text-text-tertiary mb-2">{label}</div>
      <div className="text-3xl font-bold text-brand-500 mb-1">{value}</div>
      <div className="text-sm text-text-secondary">{description}</div>
    </div>
  )
}

function FeatureTile({
  icon,
  title,
  description,
  bullets,
}: {
  icon: React.ReactNode
  title: string
  description: string
  bullets: string[]
}) {
  return (
    <div className="bg-bg border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary">{description}</p>
      <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
