import Link from 'next/link'
import {
  Terminal,
  Wrench,
  Code2,
  TestTube,
  Gauge,
  Workflow,
  Eye,
  GitBranch,
  Sparkles,
  Calculator,
} from 'lucide-react'

export default function ToolsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold mb-4">Developer Tools</h1>
        <p className="text-xl text-text-secondary">
          World-class developer experience with beautiful CLI, interactive
          playground, and comprehensive testing.
        </p>
      </div>

      {/* Overview */}
      <section className="bg-bg-secondary rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">🎯 Overview</h2>
        <p className="text-lg text-text-secondary mb-6">
          Clarity Chat includes a complete suite of developer tools inspired by
          the amazing{' '}
          <a
            href="https://github.com/charmbracelet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-500 hover:underline"
          >
            charmbracelet
          </a>{' '}
          ecosystem, featuring beautiful terminal UIs, automated testing, and
          advanced debugging capabilities.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-bg rounded-lg p-6">
            <div className="text-3xl font-bold text-brand-500 mb-2">96%</div>
            <div className="text-sm text-text-secondary">Tooling Complete</div>
          </div>
          <div className="bg-bg rounded-lg p-6">
            <div className="text-3xl font-bold text-brand-500 mb-2">12</div>
            <div className="text-sm text-text-secondary">CLI Commands</div>
          </div>
          <div className="bg-bg rounded-lg p-6">
            <div className="text-3xl font-bold text-brand-500 mb-2">5</div>
            <div className="text-sm text-text-secondary">CI/CD Workflows</div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Available Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* CLI */}
          <Link href="/tools/cli" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Terminal className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Beautiful CLI</h3>
                  <p className="text-text-secondary mb-4">
                    Gorgeous terminal UI inspired by Charm's Bubble Tea and
                    Lipgloss. Interactive component browser, smart upgrades, and
                    more.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      12 commands
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      9+ TUI components
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Charm-inspired
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Playground */}
          <Link href="/tools/playground" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Code2 className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Interactive Playground
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Monaco-based REPL for testing components in real-time. Live
                    preview, templates, and share functionality.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Monaco Editor
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Live preview
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Templates
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Testing */}
          <Link href="/tools/testing" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <TestTube className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Testing Infrastructure
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Playwright E2E testing, visual regression with Chromatic,
                    and accessibility testing with Axe.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      6 browsers
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Visual regression
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      A11y testing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Dev Tools */}
          <Link href="/tools/dev-tools" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Wrench className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Advanced Dev-Tools</h3>
                  <p className="text-text-secondary mb-4">
                    Time-travel debugging for conversation replay, AI model
                    comparison, and performance profiling.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Time-travel
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Model comparison
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Profiling
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* CI/CD */}
          <Link href="/tools/cicd" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Workflow className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">CI/CD Automation</h3>
                  <p className="text-text-secondary mb-4">
                    5 GitHub Actions workflows for automated testing, building,
                    and releasing with 100% CI automation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      5 workflows
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Renovate
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Changesets
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Codemods */}
          <Link href="/tools/codemods" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <GitBranch className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Codemods</h3>
                  <p className="text-text-secondary mb-4">
                    Automated code transformations for version migrations using
                    AST-based transformations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      AST-based
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Dry-run
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Safe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* VSCode Extension */}
          <Link href="/tools/vscode" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Eye className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">VSCode Extension</h3>
                  <p className="text-text-secondary mb-4">
                    Rich IDE integration with 60+ snippets, IntelliSense,
                    diagnostics, and component preview.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      60+ snippets
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Diagnostics
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Bundle Analysis */}
          <Link href="/tools/analysis" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Gauge className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Analysis & Monitoring
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Bundle analysis, performance benchmarking, and automated
                    reporting with HTML visualizations.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Bundle size
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Benchmarks
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Reports
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* ROI Calculator */}
          <Link href="/tools/roi-calculator" className="group block">
            <div className="bg-bg border border-border rounded-xl p-6 hover:border-brand-500 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                  <Calculator className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">ROI Calculator</h3>
                  <p className="text-text-secondary mb-4">
                    Estimate potential cost savings from token optimization,
                    prompt caching, and TOON format.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Cost savings
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Interactive
                    </span>
                    <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-xs rounded">
                      Enterprise
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Unique Features */}
      <section>
        <h2 className="text-3xl font-bold mb-6">✨ Unique Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-3">🎨 Charm-Inspired CLI</h3>
            <p className="text-text-secondary mb-4">
              Most beautiful CLI in the component library ecosystem, inspired by{' '}
              <a
                href="https://github.com/charmbracelet/bubbletea"
                className="text-brand-500 hover:underline"
              >
                Bubble Tea
              </a>{' '}
              and{' '}
              <a
                href="https://github.com/charmbracelet/lipgloss"
                className="text-brand-500 hover:underline"
              >
                Lipgloss
              </a>
              .
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ Interactive component browser</li>
              <li>✓ Beautiful spinners and progress bars</li>
              <li>✓ Gorgeous box drawing and tables</li>
              <li>✓ Real-time visual feedback</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-3">⏱️ Time-Travel Debugger</h3>
            <p className="text-text-secondary mb-4">
              Record and replay conversation states for advanced debugging - a
              feature no other component library has.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ Jump to any point in history</li>
              <li>✓ State diff visualization</li>
              <li>✓ Timeline rendering</li>
              <li>✓ Import/export sessions</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-xl font-bold mb-3">🤖 AI Model Comparison</h3>
            <p className="text-text-secondary mb-4">
              Compare responses from different AI models side-by-side with cost,
              speed, and quality metrics.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ Side-by-side response analysis</li>
              <li>✓ Automatic recommendations</li>
              <li>✓ Quality scoring</li>
              <li>✓ Cost optimization</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
            <h3 className="text-xl font-bold mb-3">
              🎮 Interactive Playground
            </h3>
            <p className="text-text-secondary mb-4">
              Full-featured code playground with Monaco Editor, real-time
              preview, and component templates.
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ TypeScript support</li>
              <li>✓ Live preview</li>
              <li>✓ Share and export</li>
              <li>✓ 5 templates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-bg-secondary rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">🚀 Get Started</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/tools/cli"
            className="flex items-center gap-3 p-4 bg-bg rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <Terminal className="w-5 h-5 text-brand-500" />
            <div>
              <div className="font-semibold">CLI Documentation</div>
              <div className="text-sm text-text-secondary">
                Learn all CLI commands
              </div>
            </div>
          </Link>

          <Link
            href="/tools/playground"
            className="flex items-center gap-3 p-4 bg-bg rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <Code2 className="w-5 h-5 text-brand-500" />
            <div>
              <div className="font-semibold">Try the Playground</div>
              <div className="text-sm text-text-secondary">
                Interactive component testing
              </div>
            </div>
          </Link>

          <Link
            href="/tools/testing"
            className="flex items-center gap-3 p-4 bg-bg rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <TestTube className="w-5 h-5 text-brand-500" />
            <div>
              <div className="font-semibold">Testing Guide</div>
              <div className="text-sm text-text-secondary">
                Set up automated testing
              </div>
            </div>
          </Link>

          <Link
            href="/tools/codemods"
            className="flex items-center gap-3 p-4 bg-bg rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <GitBranch className="w-5 h-5 text-brand-500" />
            <div>
              <div className="font-semibold">Migration Guide</div>
              <div className="text-sm text-text-secondary">
                Automated code migrations
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-3xl font-bold mb-6">📊 By The Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-bg border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">5</div>
            <div className="text-sm text-text-secondary">CI/CD Workflows</div>
          </div>
          <div className="bg-bg border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">12</div>
            <div className="text-sm text-text-secondary">CLI Commands</div>
          </div>
          <div className="bg-bg border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">6</div>
            <div className="text-sm text-text-secondary">Browsers Tested</div>
          </div>
          <div className="bg-bg border border-border rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-brand-500 mb-2">100%</div>
            <div className="text-sm text-text-secondary">CI Automation</div>
          </div>
        </div>
      </section>
    </div>
  )
}
