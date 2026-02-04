#!/usr/bin/env tsx
/**
 * Bundle Visualizer
 *
 * Creates visual representations of bundle composition:
 * - Treemap of bundle contents
 * - Dependency graph
 * - Size breakdown by category
 * - Export size chart
 *
 * Usage:
 *   pnpm tsx scripts/bundle-visualizer.ts           # Generate all visualizations
 *   pnpm tsx scripts/bundle-visualizer.ts --html    # Open HTML report
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface ModuleInfo {
  name: string
  size: number
  gzipSize: number
  imports: string[]
  exports: string[]
}

interface BundleAnalysis {
  entry: string
  modules: ModuleInfo[]
  totalSize: number
  totalGzipSize: number
  categories: {
    components: number
    hooks: number
    utils: number
    external: number
    other: number
  }
}

const DIST_DIR = path.join(process.cwd(), 'dist')
const OUTPUT_DIR = path.join(
  process.cwd(),
  '.bundle-analysis',
  'visualizations'
)

function ensureOutputDir() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function analyzeBundle(entryFile: string): BundleAnalysis | null {
  const filePath = path.join(DIST_DIR, entryFile)

  if (!fs.existsSync(filePath)) {
    return null
  }

  console.log(`🔍 Analyzing ${entryFile}...`)

  const stats = fs.statSync(filePath)
  const content = fs.readFileSync(filePath, 'utf-8')

  // Extract module information (simplified)
  const modules: ModuleInfo[] = []
  const categories = {
    components: 0,
    hooks: 0,
    utils: 0,
    external: 0,
    other: 0,
  }

  // Parse imports/exports (simplified regex-based parsing)
  const importRegex = /import\s+.*?\s+from\s+['"](.+?)['"]/g
  const exportRegex = /export\s+{([^}]+)}/g

  let match
  const imports = new Set<string>()
  const exports: string[] = []

  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1])
  }

  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(...match[1].split(',').map((e) => e.trim()))
  }

  // Categorize by import path
  for (const imp of imports) {
    const moduleSize = Math.floor(stats.size / imports.size) // Rough estimate

    if (imp.includes('/components/')) {
      categories.components += moduleSize
    } else if (imp.includes('/hooks/') || imp.includes('use')) {
      categories.hooks += moduleSize
    } else if (imp.includes('/utils/')) {
      categories.utils += moduleSize
    } else if (!imp.startsWith('.') && !imp.startsWith('@clarity-chat')) {
      categories.external += moduleSize
    } else {
      categories.other += moduleSize
    }
  }

  return {
    entry: entryFile,
    modules,
    totalSize: stats.size,
    totalGzipSize: 0, // Calculated separately
    categories,
  }
}

function generateTreemapHTML(analyses: BundleAnalysis[]): string {
  const data = analyses.map((analysis) => ({
    name: analysis.entry,
    children: [
      { name: 'Components', value: analysis.categories.components },
      { name: 'Hooks', value: analysis.categories.hooks },
      { name: 'Utils', value: analysis.categories.utils },
      { name: 'External', value: analysis.categories.external },
      { name: 'Other', value: analysis.categories.other },
    ].filter((c) => c.value > 0),
  }))

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Composition Treemap - Clarity Chat</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    #treemap {
      background: #1e293b;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .node {
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .node:hover {
      opacity: 0.8;
    }
    .node-label {
      font-size: 12px;
      font-weight: 600;
      fill: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      pointer-events: none;
    }
    .node-size {
      font-size: 10px;
      fill: rgba(255,255,255,0.8);
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      pointer-events: none;
    }
    .legend {
      margin-top: 2rem;
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>📦 Bundle Composition Treemap</h1>
  <p class="subtitle">Visual breakdown of bundle sizes by category</p>

  <div id="treemap"></div>

  <div class="legend">
    <div class="legend-item">
      <div class="legend-color" style="background: #3b82f6;"></div>
      <span>Components</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background: #8b5cf6;"></div>
      <span>Hooks</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background: #10b981;"></div>
      <span>Utils</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background: #f59e0b;"></div>
      <span>External</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background: #64748b;"></div>
      <span>Other</span>
    </div>
  </div>

  <script>
    const data = ${JSON.stringify(data)};

    const width = 1200;
    const height = 600;

    const colorScale = d3.scaleOrdinal()
      .domain(['Components', 'Hooks', 'Utils', 'External', 'Other'])
      .range(['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#64748b']);

    const root = d3.hierarchy({ name: 'root', children: data })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .padding(2)
      .round(true)(root);

    const svg = d3.select('#treemap')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const leaf = svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => \`translate(\${d.x0},\${d.y0})\`)
      .attr('class', 'node');

    leaf.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => colorScale(d.data.name))
      .attr('rx', 4);

    leaf.append('text')
      .attr('class', 'node-label')
      .attr('x', 4)
      .attr('y', 16)
      .text(d => d.data.name);

    leaf.append('text')
      .attr('class', 'node-size')
      .attr('x', 4)
      .attr('y', 30)
      .text(d => formatBytes(d.value));

    function formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return \`\${(bytes / Math.pow(k, i)).toFixed(2)} \${sizes[i]}\`;
    }
  </script>
</body>
</html>
`
}

function generateChartHTML(analyses: BundleAnalysis[]): string {
  const data = analyses.map((a) => ({
    name: a.entry,
    size: a.totalSize,
    components: a.categories.components,
    hooks: a.categories.hooks,
    utils: a.categories.utils,
    external: a.categories.external,
    other: a.categories.other,
  }))

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Size Chart - Clarity Chat</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    .charts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }
    .chart-container {
      background: #1e293b;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    canvas {
      max-width: 100%;
    }
  </style>
</head>
<body>
  <h1>📊 Bundle Size Charts</h1>
  <p class="subtitle">Comparative analysis of bundle sizes and composition</p>

  <div class="charts">
    <div class="chart-container">
      <canvas id="sizeChart"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="compositionChart"></canvas>
    </div>
  </div>

  <script>
    const data = ${JSON.stringify(data)};

    // Total Size Chart
    new Chart(document.getElementById('sizeChart'), {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          label: 'Bundle Size (KB)',
          data: data.map(d => (d.size / 1024).toFixed(2)),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Bundle Sizes',
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

    // Composition Chart
    new Chart(document.getElementById('compositionChart'), {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [
          {
            label: 'Components',
            data: data.map(d => (d.components / 1024).toFixed(2)),
            backgroundColor: 'rgba(59, 130, 246, 0.8)'
          },
          {
            label: 'Hooks',
            data: data.map(d => (d.hooks / 1024).toFixed(2)),
            backgroundColor: 'rgba(139, 92, 246, 0.8)'
          },
          {
            label: 'Utils',
            data: data.map(d => (d.utils / 1024).toFixed(2)),
            backgroundColor: 'rgba(16, 185, 129, 0.8)'
          },
          {
            label: 'External',
            data: data.map(d => (d.external / 1024).toFixed(2)),
            backgroundColor: 'rgba(245, 158, 11, 0.8)'
          },
          {
            label: 'Other',
            data: data.map(d => (d.other / 1024).toFixed(2)),
            backgroundColor: 'rgba(100, 116, 139, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Bundle Composition (Stacked)',
            color: '#e2e8f0',
            font: { size: 16 }
          },
          legend: {
            labels: { color: '#e2e8f0' }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(148, 163, 184, 0.1)' }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { color: '#94a3b8' },
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

function generateIndexHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Analysis - Clarity Chat</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      width: 100%;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1.25rem;
      margin-bottom: 3rem;
    }
    .links {
      display: grid;
      gap: 1rem;
    }
    .link {
      background: #1e293b;
      padding: 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .link:hover {
      background: #334155;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    }
    .link-icon {
      font-size: 2rem;
    }
    .link-content {
      flex: 1;
    }
    .link-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .link-desc {
      color: #94a3b8;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📦 Bundle Analysis</h1>
    <p class="subtitle">Visual insights into bundle composition and size</p>

    <div class="links">
      <a href="treemap.html" class="link">
        <div class="link-icon">🗺️</div>
        <div class="link-content">
          <div class="link-title">Treemap Visualization</div>
          <div class="link-desc">Interactive treemap of bundle composition by category</div>
        </div>
      </a>

      <a href="charts.html" class="link">
        <div class="link-icon">📊</div>
        <div class="link-content">
          <div class="link-title">Size Charts</div>
          <div class="link-desc">Comparative charts of bundle sizes and composition</div>
        </div>
      </a>

      <a href="../current.json" class="link">
        <div class="link-icon">📋</div>
        <div class="link-content">
          <div class="link-title">Current Measurements</div>
          <div class="link-desc">Raw JSON data of latest bundle measurements</div>
        </div>
      </a>

      <a href="../phase2-baseline.json" class="link">
        <div class="link-icon">📍</div>
        <div class="link-content">
          <div class="link-title">Phase 2 Baseline</div>
          <div class="link-desc">Reference baseline after peer dependency externalization</div>
        </div>
      </a>
    </div>
  </div>
</body>
</html>
`
}

// Main execution
ensureOutputDir()

const entryFiles = [
  'index.js',
  'index.mjs',
  'core.js',
  'core.mjs',
  'core-minimal.js',
  'core-minimal.mjs',
  'slim.js',
]

console.log('🎨 Generating bundle visualizations...\n')

const analyses = entryFiles
  .map((file) => analyzeBundle(file))
  .filter((a): a is BundleAnalysis => a !== null)

if (analyses.length === 0) {
  console.error('❌ No bundles found. Run `pnpm build` first.')
  process.exit(1)
}

// Generate HTML files
const treemapHTML = generateTreemapHTML(analyses)
fs.writeFileSync(path.join(OUTPUT_DIR, 'treemap.html'), treemapHTML)
console.log('✅ Generated treemap.html')

const chartHTML = generateChartHTML(analyses)
fs.writeFileSync(path.join(OUTPUT_DIR, 'charts.html'), chartHTML)
console.log('✅ Generated charts.html')

const indexHTML = generateIndexHTML()
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML)
console.log('✅ Generated index.html')

console.log(`\n📁 Visualizations saved to: ${OUTPUT_DIR}`)
console.log(`🌐 Open: file://${path.join(OUTPUT_DIR, 'index.html')}`)

// Open in browser if --html flag provided
if (process.argv.includes('--html')) {
  const platform = process.platform
  const command =
    platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'

  try {
    execSync(`${command} ${path.join(OUTPUT_DIR, 'index.html')}`, {
      stdio: 'ignore',
    })
    console.log('\n🌐 Opening in browser...')
  } catch (error) {
    console.warn('\n⚠️  Could not open browser automatically')
  }
}
