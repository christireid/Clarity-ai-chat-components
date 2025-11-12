import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Bundle & Performance Analysis - Developer Tools',
  description:
    'Use the built-in analysis and benchmarking scripts to monitor bundle size, performance, and regression drift.',
}

export default function AnalysisToolsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Tooling</span>
        <h1>Bundle &amp; Performance Analysis</h1>
        <p className="docs-lead">
          Keep bundle size and runtime performance under control with repeatable
          scripts that generate HTML dashboards and regression reports.
        </p>
      </div>

      <section className="docs-section">
        <h2>Commands</h2>
        <CodeBlock
          language="bash"
          code={`# Analyse bundle sizes (ESM/CJS/UMD) and generate HTML report
npm run analyze

# Benchmark JSON parsing, array operations, and cloning (100 iterations)
npm run benchmark

# Check size-limit budgets
npm run size`}
        />
      </section>

      <section className="docs-section">
        <h2>Outputs</h2>
        <ul>
          <li>
            <code>bundle-reports/bundle-report.html</code> — per-package size breakdown with history comparisons
          </li>
          <li>
            <code>benchmark-results/benchmark-report.html</code> — latency statistics (mean, p95, p99) for key operations
          </li>
          <li>
            JSON counterparts for both reports (use in CI dashboards or Grafana)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Bundle Analysis Script</h2>
        <p>
          The analyze script traverses every workspace package, measures ESM/CJS/UMD
          bundles, and compares them with the previous report.
        </p>
        <CodeBlock
          language="ts"
          code={`// scripts/analyze-bundle.js
const report = {
  timestamp: new Date().toISOString(),
  packages: packages.map(analyzePackage),
  totalSize: 0,
}
const comparison = generateComparison(report) // highlights increases/decreases
writeHTMLReport(report, comparison)
`}
        />
        <Callout type="tip">
          Commit the latest <code>bundle-report.json</code> to your telemetry
          pipeline to graph bundle size over time.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Benchmark Script</h2>
        <p>
          Benchmarks simulate heavy operations (JSON parsing, array filtering,
          deep cloning) with warmup runs and 100 iterations.
        </p>
        <CodeBlock
          language="ts"
          code={`const results = {
  timestamp: new Date().toISOString(),
  benchmarks: [
    await benchmarkJSONParsing(),
    await benchmarkArrayOperations(),
    await benchmarkObjectCloning(),
  ],
}
`}
        />
        <Callout type="info">
          Extend the script with your own benchmarks (e.g. streaming throughput,
          serialization) to track domain-specific performance budgets.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Integrating with CI</h2>
        <ul>
          <li>Run <code>npm run analyze</code> + <code>npm run benchmark</code> in every PR</li>
          <li>Upload HTML/JSON reports as artifacts (see the CI/CD guide)</li>
          <li>Alert when bundle growth exceeds thresholds (size-limit fails the build)</li>
          <li>Feed JSON output into Grafana/Datadog for trends</li>
        </ul>
      </section>
    </div>
  )
}

