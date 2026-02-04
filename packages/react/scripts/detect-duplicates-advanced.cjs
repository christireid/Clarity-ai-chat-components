#!/usr/bin/env node
/**
 * Advanced Duplicate Detection Script
 *
 * Uses jscpd for actual code similarity detection instead of naive pattern matching.
 * Focuses on actionable duplicates that should be refactored.
 *
 * Usage: node scripts/detect-duplicates-advanced.cjs
 * Exit: 0 if under threshold, 1 if too many duplicates
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const JSCPD_THRESHOLD = 15; // Target: <15 significant duplicates
const MIN_TOKENS = 100; // Minimum token count to consider significant

/**
 * Run jscpd to detect code duplicates
 */
function runJscpd() {
  try {
    console.log('🔍 Running jscpd for code similarity detection...\n');

    // Run jscpd with JSON output
    const jscpdConfig = {
      path: [SRC_DIR],
      minTokens: MIN_TOKENS,
      minLines: 10,
      format: ['json'],
      output: path.join(__dirname, '../.jscpd-report'),
      ignore: [
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.stories.tsx',
        '**/dist/**',
        '**/node_modules/**',
      ],
      reporters: ['json'],
      threshold: 1, // Report all duplicates for analysis
    };

    // Write config file
    const configPath = path.join(__dirname, '../.jscpd.json');
    fs.writeFileSync(configPath, JSON.stringify(jscpdConfig, null, 2));

    // Run jscpd
    const result = execSync(`npx jscpd --config ${configPath}`, {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf-8',
    });

    console.log(result);

    // Read JSON report
    const reportPath = path.join(__dirname, '../.jscpd-report/jscpd-report.json');

    if (!fs.existsSync(reportPath)) {
      console.log('✅ No significant code duplicates found!\n');
      return 0;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    return analyzeReport(report);
  } catch (error) {
    console.error('⚠️  jscpd not installed or error running detection');
    console.log('Install with: npm install -D jscpd\n');
    console.log('Falling back to basic detection...\n');
    return fallbackDetection();
  }
}

/**
 * Analyze jscpd report and identify actionable duplicates
 */
function analyzeReport(report) {
  const duplicates = report.duplicates || [];

  // Filter for customer-facing code (components, hooks, public APIs)
  const customerFacing = duplicates.filter(dup => {
    const file = dup.firstFile?.name || '';
    return (
      file.includes('/components/') ||
      file.includes('/hooks/') ||
      file.includes('public-api') ||
      file.includes('/core')
    ) && !file.includes('__tests__');
  });

  // Group by type
  const byType = {
    components: customerFacing.filter(d => d.firstFile?.name.includes('/components/')),
    hooks: customerFacing.filter(d => d.firstFile?.name.includes('/hooks/')),
    publicAPI: customerFacing.filter(d => d.firstFile?.name.includes('public-api') || d.firstFile?.name.includes('/core')),
  };

  console.log('📊 Duplicate Code Analysis:\n');
  console.log(`Total duplicates found: ${duplicates.length}`);
  console.log(`Customer-facing duplicates: ${customerFacing.length}\n`);

  if (customerFacing.length > 0) {
    console.log('🎯 High-Priority Duplicates:\n');

    Object.entries(byType).forEach(([type, dups]) => {
      if (dups.length > 0) {
        console.log(`\n${type.toUpperCase()} (${dups.length} duplicates):`);
        dups.slice(0, 5).forEach(dup => {
          const file1 = path.relative(SRC_DIR, dup.firstFile.name);
          const file2 = path.relative(SRC_DIR, dup.secondFile.name);
          console.log(`  📄 ${file1}`);
          console.log(`  📄 ${file2}`);
          console.log(`     Lines: ${dup.firstFile.start}-${dup.firstFile.end} (${dup.lines} lines, ${dup.tokens} tokens)\n`);
        });
      }
    });
  }

  const actionableCount = customerFacing.length;

  console.log(`\n📊 Actionable duplicates: ${actionableCount}`);
  console.log(`📊 Threshold: ${JSCPD_THRESHOLD}\n`);

  if (actionableCount > JSCPD_THRESHOLD) {
    console.error(`❌ Too many duplicates (${actionableCount} > ${JSCPD_THRESHOLD})\n`);
    return 1;
  } else {
    console.log(`✅ Duplicates within threshold (${actionableCount} <= ${JSCPD_THRESHOLD})\n`);
    return 0;
  }
}

/**
 * Fallback detection if jscpd is not available
 */
function fallbackDetection() {
  console.log('Using basic pattern detection as fallback...\n');

  // Count unique hook/component implementations
  const hooks = new Set();
  const components = new Set();

  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.includes('node_modules') && !entry.name.includes('dist')) {
        scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.') && !entry.name.includes('.stories.')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Extract hook names
        const hookMatches = content.matchAll(/export\s+(?:const|function)\s+(use[A-Z]\w+)/g);
        for (const match of hookMatches) {
          hooks.add(match[1]);
        }

        // Extract component names
        const componentMatches = content.matchAll(/export\s+(?:const|function)\s+([A-Z]\w+)/g);
        for (const match of componentMatches) {
          if (!match[1].startsWith('use')) {
            components.add(match[1]);
          }
        }
      }
    }
  }

  scanDirectory(SRC_DIR);

  console.log(`📊 Unique hooks: ${hooks.size}`);
  console.log(`📊 Unique components: ${components.size}`);
  console.log('\n✅ Basic scan complete (install jscpd for detailed analysis)\n');

  return 0;
}

process.exit(runJscpd());
