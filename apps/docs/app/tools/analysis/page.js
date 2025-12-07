import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const metadata = {
    title: 'Bundle & Performance Analysis - Developer Tools',
    description: 'Use the built-in analysis and benchmarking scripts to monitor bundle size, performance, and regression drift.',
};
export default function AnalysisToolsPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Tooling" }), _jsx("h1", { children: "Bundle & Performance Analysis" }), _jsx("p", { className: "docs-lead", children: "Keep bundle size and runtime performance under control with repeatable scripts that generate HTML dashboards and regression reports." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Commands" }), _jsx(CodeBlock, { language: "bash", code: `# Analyse bundle sizes (ESM/CJS/UMD) and generate HTML report
npm run analyze

# Benchmark JSON parsing, array operations, and cloning (100 iterations)
npm run benchmark

# Check size-limit budgets
npm run size` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Outputs" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("code", { children: "bundle-reports/bundle-report.html" }), " \u2014 per-package size breakdown with history comparisons"] }), _jsxs("li", { children: [_jsx("code", { children: "benchmark-results/benchmark-report.html" }), " \u2014 latency statistics (mean, p95, p99) for key operations"] }), _jsx("li", { children: "JSON counterparts for both reports (use in CI dashboards or Grafana)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Bundle Analysis Script" }), _jsx("p", { children: "The analyze script traverses every workspace package, measures ESM/CJS/UMD bundles, and compares them with the previous report." }), _jsx(CodeBlock, { language: "ts", code: `// scripts/analyze-bundle.js
const report = {
  timestamp: new Date().toISOString(),
  packages: packages.map(analyzePackage),
  totalSize: 0,
}
const comparison = generateComparison(report) // highlights increases/decreases
writeHTMLReport(report, comparison)
` }), _jsxs(Callout, { type: "tip", children: ["Commit the latest ", _jsx("code", { children: "bundle-report.json" }), " to your telemetry pipeline to graph bundle size over time."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Benchmark Script" }), _jsx("p", { children: "Benchmarks simulate heavy operations (JSON parsing, array filtering, deep cloning) with warmup runs and 100 iterations." }), _jsx(CodeBlock, { language: "ts", code: `const results = {
  timestamp: new Date().toISOString(),
  benchmarks: [
    await benchmarkJSONParsing(),
    await benchmarkArrayOperations(),
    await benchmarkObjectCloning(),
  ],
}
` }), _jsx(Callout, { type: "info", children: "Extend the script with your own benchmarks (e.g. streaming throughput, serialization) to track domain-specific performance budgets." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Integrating with CI" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Run ", _jsx("code", { children: "npm run analyze" }), " + ", _jsx("code", { children: "npm run benchmark" }), " in every PR"] }), _jsx("li", { children: "Upload HTML/JSON reports as artifacts (see the CI/CD guide)" }), _jsx("li", { children: "Alert when bundle growth exceeds thresholds (size-limit fails the build)" }), _jsx("li", { children: "Feed JSON output into Grafana/Datadog for trends" })] })] })] }));
}
//# sourceMappingURL=page.js.map