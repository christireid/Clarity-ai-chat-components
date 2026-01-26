#!/usr/bin/env tsx
/**
 * Bundle Size Dashboard
 *
 * Generates a comprehensive dashboard showing:
 * - Current bundle sizes
 * - Historical trends
 * - Size limits and compliance
 * - Tree-shaking effectiveness
 * - Peer dependency analysis
 *
 * Usage:
 *   pnpm tsx scripts/bundle-dashboard.ts           # Generate dashboard
 *   pnpm tsx scripts/bundle-dashboard.ts --open    # Open in browser
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { gzipSync } from 'zlib'

const DIST_DIR = path.join(process.cwd(), 'dist')
const ANALYSIS_DIR = path.join(process.cwd(), '.bundle-analysis')
const OUTPUT_FILE = path.join(ANALYSIS_DIR, 'dashboard.html')

interface BundleInfo {
  file: string
  name: string
  size: number
  gzipSize: number
  limit: string
  limitBytes: number
  withinLimit: boolean
  percentOfLimit: number
}

function parseLimit(limit: string): number {
  const match = limit.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB)$/i)
  if (!match) return 0

  const [, value, unit] = match
  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
  }

  return parseFloat(value) * multipliers[unit.toUpperCase()]
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function getGzipSize(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath)
    const compressed = gzipSync(content, { level: 9 })
    return compressed.length
  } catch {
    return 0
  }
}

function analyzeBundles(): BundleInfo[] {
  // Load size limit config
  const configPath = path.join(process.cwd(), '.size-limit.js')
  const config = require(configPath)

  const bundles: BundleInfo[] = []

  for (const entry of config) {
    const filePath = path.join(process.cwd(), entry.path)

    if (!fs.existsSync(filePath)) {
      continue
    }

    const stats = fs.statSync(filePath)
    const gzipSize = getGzipSize(filePath)
    const limitBytes = parseLimit(entry.limit)

    bundles.push({
      file: entry.path,
      name: entry.name,
      size: stats.size,
      gzipSize,
      limit: entry.limit,
      limitBytes,
      withinLimit: gzipSize <= limitBytes,
      percentOfLimit: (gzipSize / limitBytes) * 100,
    })
  }

  return bundles
}

function generateDashboardHTML(bundles: BundleInfo[]): string {
  const totalSize = bundles.reduce((sum, b) => sum + b.size, 0)
  const totalGzipSize = bundles.reduce((sum, b) => sum + b.gzipSize, 0)
  const totalWithinLimit = bundles.filter((b) => b.withinLimit).length
  const compliancePercent = (totalWithinLimit / bundles.length) * 100

  // Load historical data
  let historyData = '[]'
  try {
    const historyDir = path.join(ANALYSIS_DIR, 'history')
    const files = fs.readdirSync(historyDir).filter((f) => f.endsWith('.json'))
    const history = files
      .map((f) => {
        const content = fs.readFileSync(path.join(historyDir, f), 'utf-8')
        return JSON.parse(content)
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
      .slice(-30) // Last 30 measurements

    historyData = JSON.stringify(
      history.map((h) => ({
        timestamp: h.timestamp,
        size: h.totalGzipSize,
      }))
    )
  } catch {
    // No history available
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Size Dashboard - Clarity Chat</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
    }
    .header {
      max-width: 1400px;
      margin: 0 auto 3rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1rem;
    }
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      gap: 2rem;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    .metric {
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .metric-label {
      color: #94a3b8;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #e2e8f0;
    }
    .metric-trend {
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    .metric-trend.positive { color: #10b981; }
    .metric-trend.negative { color: #ef4444; }
    .chart-container {
      background: #1e293b;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .bundles-table {
      background: #1e293b;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #334155;
    }
    th {
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }
    tr:hover {
      background: rgba(51, 65, 85, 0.5);
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .status.success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    .status.warning {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
    .status.danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #334155;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }
    .progress-fill.success { background: #10b981; }
    .progress-fill.warning { background: #f59e0b; }
    .progress-fill.danger { background: #ef4444; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📦 Bundle Size Dashboard</h1>
    <p class="subtitle">Real-time monitoring of bundle sizes and limits</p>
  </div>

  <div class="dashboard">
    <!-- Key Metrics -->
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Total Size (Gzip)</div>
        <div class="metric-value">${formatBytes(totalGzipSize)}</div>
        <div class="metric-trend">Raw: ${formatBytes(totalSize)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Bundle Count</div>
        <div class="metric-value">${bundles.length}</div>
        <div class="metric-trend">${bundles.filter((b) => b.name.includes('Tree-shake')).length} tree-shake tests</div>
      </div>
      <div class="metric">
        <div class="metric-label">Compliance</div>
        <div class="metric-value">${compliancePercent.toFixed(0)}%</div>
        <div class="metric-trend">${totalWithinLimit}/${bundles.length} within limits</div>
      </div>
      <div class="metric">
        <div class="metric-label">Compression Ratio</div>
        <div class="metric-value">${((totalGzipSize / totalSize) * 100).toFixed(1)}%</div>
        <div class="metric-trend">${formatBytes(totalSize - totalGzipSize)} saved</div>
      </div>
    </div>

    <!-- Historical Trend Chart -->
    <div class="chart-container">
      <canvas id="trendChart"></canvas>
    </div>

    <!-- Size Distribution Chart -->
    <div class="chart-container">
      <canvas id="distributionChart"></canvas>
    </div>

    <!-- Bundles Table -->
    <div class="bundles-table">
      <h2 style="margin-bottom: 1.5rem; font-size: 1.5rem;">Bundle Details</h2>
      <table>
        <thead>
          <tr>
            <th>Bundle</th>
            <th>Size (Gzip)</th>
            <th>Limit</th>
            <th>Usage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${bundles
            .map((bundle) => {
              const statusClass =
                bundle.percentOfLimit > 100
                  ? 'danger'
                  : bundle.percentOfLimit > 90
                    ? 'warning'
                    : 'success'
              const statusText =
                bundle.percentOfLimit > 100
                  ? 'Over Limit'
                  : bundle.percentOfLimit > 90
                    ? 'Near Limit'
                    : 'Good'
              const progressClass =
                bundle.percentOfLimit > 100
                  ? 'danger'
                  : bundle.percentOfLimit > 90
                    ? 'warning'
                    : 'success'

              return `
              <tr>
                <td><strong>${bundle.name}</strong></td>
                <td>${formatBytes(bundle.gzipSize)}</td>
                <td>${bundle.limit}</td>
                <td>
                  <div>${bundle.percentOfLimit.toFixed(1)}%</div>
                  <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${Math.min(bundle.percentOfLimit, 100)}%"></div>
                  </div>
                </td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
              </tr>
            `
            })
            .join('')}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    // Historical trend chart
    const historyData = ${historyData};

    if (historyData.length > 0) {
      new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
          labels: historyData.map(d => new Date(d.timestamp).toLocaleDateString()),
          datasets: [{
            label: 'Total Bundle Size (KB)',
            data: historyData.map(d => (d.size / 1024).toFixed(2)),
            borderColor: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Bundle Size Trend (Last 30 Measurements)',
              color: '#e2e8f0',
              font: { size: 16 }
            },
            legend: {
              labels: { color: '#e2e8f0' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#94a3b8' },
              grid: { color: 'rgba(148, 163, 184, 0.1)' }
            },
            x: {
              ticks: { color: '#94a3b8' },
              grid: { color: 'rgba(148, 163, 184, 0.1)' }
            }
          }
        }
      });
    }

    // Size distribution chart
    const bundles = ${JSON.stringify(bundles)};
    const mainBundles = bundles.filter(b => !b.name.includes('Tree-shake'));

    new Chart(document.getElementById('distributionChart'), {
      type: 'bar',
      data: {
        labels: mainBundles.map(b => b.name),
        datasets: [{
          label: 'Size (KB)',
          data: mainBundles.map(b => (b.gzipSize / 1024).toFixed(2)),
          backgroundColor: mainBundles.map(b =>
            b.percentOfLimit > 100 ? 'rgba(239, 68, 68, 0.8)' :
            b.percentOfLimit > 90 ? 'rgba(245, 158, 11, 0.8)' :
            'rgba(16, 185, 129, 0.8)'
          ),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Bundle Size Distribution',
            color: '#e2e8f0',
            font: { size: 16 }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          x: {
            ticks: {
              color: '#94a3b8',
              maxRotation: 45,
              minRotation: 45
            },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          }
        }
      }
    });
  </script>
</body>
</html>
`
}

// Main execution
console.log('📊 Generating bundle size dashboard...\n')

const bundles = analyzeBundles()

if (bundles.length === 0) {
  console.error('❌ No bundles found. Run `pnpm build` first.')
  process.exit(1)
}

const html = generateDashboardHTML(bundles)
fs.mkdirSync(ANALYSIS_DIR, { recursive: true })
fs.writeFileSync(OUTPUT_FILE, html)

console.log(`✅ Dashboard generated: ${OUTPUT_FILE}`)
console.log(`🌐 Open: file://${OUTPUT_FILE}\n`)

// Summary
console.log('📊 Summary:')
console.log(`  Total bundles: ${bundles.length}`)
console.log(
  `  Within limits: ${bundles.filter((b) => b.withinLimit).length}/${bundles.length}`
)
console.log(
  `  Total size: ${formatBytes(bundles.reduce((sum, b) => sum + b.gzipSize, 0))} (gzip)`
)

const overLimit = bundles.filter((b) => !b.withinLimit)
if (overLimit.length > 0) {
  console.log('\n⚠️  Bundles over limit:')
  for (const bundle of overLimit) {
    console.log(
      `  - ${bundle.name}: ${formatBytes(bundle.gzipSize)} / ${bundle.limit} (${bundle.percentOfLimit.toFixed(1)}%)`
    )
  }
}

// Open in browser if --open flag provided
if (process.argv.includes('--open')) {
  const platform = process.platform
  const command =
    platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'

  try {
    execSync(`${command} ${OUTPUT_FILE}`, { stdio: 'ignore' })
    console.log('\n🌐 Opening dashboard in browser...')
  } catch (error) {
    console.warn('\n⚠️  Could not open browser automatically')
  }
}
