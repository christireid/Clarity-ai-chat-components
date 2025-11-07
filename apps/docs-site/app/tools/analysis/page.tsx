import { Gauge, BarChart2, Cpu } from 'lucide-react'

export default function AnalysisToolsPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-4">
          <Gauge className="w-10 h-10 text-brand-500" />
          <h1 className="text-5xl font-bold">Analysis & Monitoring</h1>
        </div>
        <p className="text-xl text-text-secondary max-w-2xl">
          Understand bundle size, runtime performance, and cost metrics with first-class tooling and
          automated reports.
        </p>
      </header>

      <section className="bg-bg-secondary rounded-xl p-8 space-y-4">
        <h2 className="text-2xl font-bold">📦 Bundle Analysis</h2>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>
            <code>npm run analyze</code> generates interactive visualization (rollup + source-map-explorer)
            saved to <code>artifacts/bundle-analysis.html</code>.
          </li>
          <li>
            <code>npm run size</code> (size-limit) enforces budgets per package; CI fails if thresholds are exceeded.
          </li>
          <li>Tree-shaking guidance and import suggestions included in the generated report.</li>
        </ul>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Tile
          icon={<Cpu className="w-6 h-6" />}
          title="Runtime Benchmarks"
          bulletPoints={[
            'scripts/benchmark.js simulates streaming workloads with concurrency controls.',
            'Outputs latency percentiles, throughput, and memory stats.',
            'Integrates with dev-tools profiler for deep dives.',
          ]}
        />
        <Tile
          icon={<BarChart2 className="w-6 h-6" />}
          title="Cost Dashboards"
          bulletPoints={[
            'Usage telemetry connects to token tracker hooks.',
            'Reports aggregate spend by provider + conversation.',
            'Exports CSV/JSON for finance hand-off.',
          ]}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Artifacts</h2>
        <p className="text-text-secondary">
          CI uploads bundle reports, benchmark summaries, and token analytics as build artifacts. They are
          linked in PR comments for quick review.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-3xl font-bold">Local Workflow</h2>
        <pre className="bg-bg-secondary rounded-lg p-4 overflow-x-auto">
          <code>{`# Analyze bundle composition
npm run analyze

# Size-limit budgets
npm run size

# Performance benchmark
npm run benchmark

# Token analytics dashboard
npm run dev --workspace=@clarity-chat/dev-tools`}</code>
        </pre>
      </section>
    </div>
  )
}

function Tile({
  icon,
  title,
  bulletPoints,
}: {
  icon: React.ReactNode
  title: string
  bulletPoints: string[]
}) {
  return (
    <div className="bg-bg border border-border rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-brand-500">{icon}</span>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
        {bulletPoints.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
