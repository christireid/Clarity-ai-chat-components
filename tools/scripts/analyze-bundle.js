#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes bundle sizes, tree-shaking effectiveness, and generates reports
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const chalk = require('chalk')

// Configuration
const PACKAGES_DIR = path.join(__dirname, '..', 'packages')
const OUTPUT_DIR = path.join(__dirname, '..', 'bundle-reports')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

/**
 * Get bundle size in bytes
 */
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (error) {
    return 0
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Analyze a package's bundle
 */
function analyzePackage(packageName) {
  const packageDir = path.join(PACKAGES_DIR, packageName)
  const distDir = path.join(packageDir, 'dist')

  if (!fs.existsSync(distDir)) {
    console.log(chalk.yellow(`⚠️  No dist found for ${packageName}, skipping...`))
    return null
  }

  const results = {
    package: packageName,
    bundles: [],
    totalSize: 0,
  }

  // Check for different bundle formats
  const bundleFiles = [
    { name: 'ESM', path: 'index.mjs' },
    { name: 'CJS', path: 'index.js' },
    { name: 'UMD', path: 'index.umd.js' },
  ]

  bundleFiles.forEach(({ name, path: bundlePath }) => {
    const fullPath = path.join(distDir, bundlePath)
    const size = getFileSize(fullPath)

    if (size > 0) {
      results.bundles.push({
        format: name,
        size,
        sizeFormatted: formatBytes(size),
        path: bundlePath,
      })
      results.totalSize += size
    }
  })

  return results
}

/**
 * Generate comparison with previous report
 */
function generateComparison(currentReport) {
  const previousReportPath = path.join(OUTPUT_DIR, 'bundle-report-previous.json')
  
  if (!fs.existsSync(previousReportPath)) {
    return null
  }

  const previousReport = JSON.parse(fs.readFileSync(previousReportPath, 'utf8'))
  const comparison = {}

  currentReport.packages.forEach(currentPkg => {
    const previousPkg = previousReport.packages.find(p => p.package === currentPkg.package)
    
    if (previousPkg) {
      const diff = currentPkg.totalSize - previousPkg.totalSize
      const percentChange = ((diff / previousPkg.totalSize) * 100).toFixed(2)
      
      comparison[currentPkg.package] = {
        diff,
        diffFormatted: formatBytes(Math.abs(diff)),
        percentChange,
        increased: diff > 0,
      }
    }
  })

  return comparison
}

/**
 * Generate HTML report
 */
function generateHTMLReport(report, comparison) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle Analysis Report - ${report.timestamp}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 2rem;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .timestamp {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    
    .package {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
    }
    
    .package-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .package-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .package-total {
      font-size: 1.1rem;
      font-weight: 500;
      color: #3498db;
    }
    
    .comparison {
      display: inline-block;
      margin-left: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .comparison.increased {
      background: #fee;
      color: #c0392b;
    }
    
    .comparison.decreased {
      background: #efe;
      color: #27ae60;
    }
    
    .bundles {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .bundle {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .bundle-format {
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }
    
    .bundle-size {
      font-size: 1.1rem;
      color: #2c3e50;
    }
    
    .summary {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .summary h2 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }
    
    .summary-stat {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      padding: 0.5rem;
    }
    
    .summary-stat:nth-child(even) {
      background: white;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📦 Bundle Analysis Report</h1>
    <div class="timestamp">Generated: ${report.timestamp}</div>
    
    ${report.packages.map(pkg => `
      <div class="package">
        <div class="package-header">
          <div>
            <div class="package-name">${pkg.package}</div>
          </div>
          <div>
            <span class="package-total">${formatBytes(pkg.totalSize)}</span>
            ${comparison && comparison[pkg.package] ? `
              <span class="comparison ${comparison[pkg.package].increased ? 'increased' : 'decreased'}">
                ${comparison[pkg.package].increased ? '↑' : '↓'} ${comparison[pkg.package].diffFormatted} (${Math.abs(comparison[pkg.package].percentChange)}%)
              </span>
            ` : ''}
          </div>
        </div>
        <div class="bundles">
          ${pkg.bundles.map(bundle => `
            <div class="bundle">
              <div class="bundle-format">${bundle.format}</div>
              <div class="bundle-size">${bundle.sizeFormatted}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
    
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-stat">
        <span>Total Packages</span>
        <strong>${report.packages.length}</strong>
      </div>
      <div class="summary-stat">
        <span>Total Bundle Size</span>
        <strong>${formatBytes(report.totalSize)}</strong>
      </div>
      <div class="summary-stat">
        <span>Average Package Size</span>
        <strong>${formatBytes(report.totalSize / report.packages.length)}</strong>
      </div>
    </div>
  </div>
</body>
</html>
  `

  return html
}

/**
 * Main execution
 */
function main() {
  console.log(chalk.blue.bold('\n📊 Analyzing bundles...\n'))

  const report = {
    timestamp: new Date().toISOString(),
    packages: [],
    totalSize: 0,
  }

  // Get all packages
  const packages = fs.readdirSync(PACKAGES_DIR).filter(name => {
    const packagePath = path.join(PACKAGES_DIR, name)
    return fs.statSync(packagePath).isDirectory()
  })

  // Analyze each package
  packages.forEach(packageName => {
    const result = analyzePackage(packageName)
    if (result && result.bundles.length > 0) {
      report.packages.push(result)
      report.totalSize += result.totalSize
      
      console.log(chalk.green(`✓ ${packageName}`))
      result.bundles.forEach(bundle => {
        console.log(`  ${bundle.format}: ${chalk.cyan(bundle.sizeFormatted)}`)
      })
      console.log()
    }
  })

  // Generate comparison
  const comparison = generateComparison(report)

  // Save current report
  const reportPath = path.join(OUTPUT_DIR, 'bundle-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(chalk.green(`✓ Report saved to ${reportPath}`))

  // Generate HTML report
  const htmlReport = generateHTMLReport(report, comparison)
  const htmlPath = path.join(OUTPUT_DIR, 'bundle-report.html')
  fs.writeFileSync(htmlPath, htmlReport)
  console.log(chalk.green(`✓ HTML report saved to ${htmlPath}`))

  // Save as previous for next comparison
  const previousPath = path.join(OUTPUT_DIR, 'bundle-report-previous.json')
  fs.writeFileSync(previousPath, JSON.stringify(report, null, 2))

  // Print summary
  console.log(chalk.blue.bold('\n📦 Summary'))
  console.log(`Total packages: ${chalk.cyan(report.packages.length)}`)
  console.log(`Total bundle size: ${chalk.cyan(formatBytes(report.totalSize))}`)
  console.log()

  // Check for size increases
  if (comparison) {
    const increases = Object.entries(comparison).filter(([, data]) => data.increased)
    if (increases.length > 0) {
      console.log(chalk.yellow('⚠️  Bundle size increased for:'))
      increases.forEach(([pkg, data]) => {
        console.log(`  ${pkg}: +${data.diffFormatted} (+${data.percentChange}%)`)
      })
      console.log()
    }
  }

  console.log(chalk.green.bold('✓ Bundle analysis complete!\n'))
}

main()

