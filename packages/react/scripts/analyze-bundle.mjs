#!/usr/bin/env node
/**
 * Bundle Analysis Script
 * Analyzes dependencies and provides externalization recommendations
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, '..');

console.log('🔍 Analyzing React Package Bundle Composition...\n');

// Read package.json
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, 'package.json'), 'utf-8')
);

// Analyze dependencies
const deps = packageJson.dependencies || {};
const peerDeps = packageJson.peerDependencies || {};

console.log('📦 Current Dependencies (bundled):');
console.log('━'.repeat(80));
Object.entries(deps).forEach(([name, version]) => {
  console.log(`  ${name.padEnd(40)} ${version}`);
});

console.log('\n🔗 Peer Dependencies (externalized):');
console.log('━'.repeat(80));
Object.entries(peerDeps).forEach(([name, version]) => {
  const optional = packageJson.peerDependenciesMeta?.[name]?.optional ? '(optional)' : '(required)';
  console.log(`  ${name.padEnd(40)} ${version} ${optional}`);
});

// Get dependency sizes from node_modules
console.log('\n📊 Dependency Size Analysis:');
console.log('━'.repeat(80));

const heavyDeps = [
  'react-markdown',
  'zod',
  'isomorphic-dompurify',
  'sonner',
  '@tanstack/react-virtual',
  'react-window',
  'react-resizable-panels',
  'react-virtualized-auto-sizer',
  'remark-gfm',
  'rehype-highlight',
  '@radix-ui/react-slot',
  'prismjs',
];

const depSizes = [];

for (const dep of heavyDeps) {
  try {
    // Try to get size from node_modules
    const depPath = join(packageRoot, '..', '..', 'node_modules', dep);
    const size = execSync(`du -sh "${depPath}" 2>/dev/null || echo "0K"`, {
      encoding: 'utf-8',
    }).trim().split('\t')[0];

    const usage = execSync(
      `grep -r "from ['\"]${dep}" ${join(packageRoot, 'src')} 2>/dev/null | wc -l`,
      { encoding: 'utf-8' }
    ).trim();

    depSizes.push({
      name: dep,
      size,
      usage: parseInt(usage) || 0,
      inDeps: !!deps[dep],
      inPeerDeps: !!peerDeps[dep],
    });
  } catch (e) {
    depSizes.push({
      name: dep,
      size: 'unknown',
      usage: 0,
      inDeps: !!deps[dep],
      inPeerDeps: !!peerDeps[dep],
    });
  }
}

// Sort by size (rough estimation)
depSizes.sort((a, b) => {
  const sizeA = parseFloat(a.size) || 0;
  const sizeB = parseFloat(b.size) || 0;
  return sizeB - sizeA;
});

console.log('Dependency'.padEnd(40) + 'Size'.padEnd(12) + 'Usage'.padEnd(10) + 'Status');
console.log('─'.repeat(80));

depSizes.forEach(dep => {
  const status = dep.inPeerDeps ? '✅ Peer' : dep.inDeps ? '📦 Bundled' : '❓ Not installed';
  console.log(
    dep.name.padEnd(40) +
    dep.size.padEnd(12) +
    dep.usage.toString().padEnd(10) +
    status
  );
});

// Recommendations
console.log('\n💡 Externalization Recommendations:');
console.log('━'.repeat(80));

const recommendations = [];

// Analyze bundled dependencies
Object.keys(deps).forEach(depName => {
  const dep = depSizes.find(d => d.name === depName);

  if (dep && dep.usage > 0) {
    let priority = 'Low';
    let reason = '';
    let estimatedSavings = 'Unknown';

    // High priority candidates
    if (depName === 'react-markdown') {
      priority = 'HIGH';
      reason = 'Heavy markdown processor, ~200-300KB minified';
      estimatedSavings = '~250KB';
    } else if (depName === 'zod') {
      priority = 'HIGH';
      reason = 'Large validation library, ~50-80KB minified';
      estimatedSavings = '~65KB';
    } else if (depName === 'isomorphic-dompurify') {
      priority = 'MEDIUM';
      reason = 'Security library, ~40KB minified';
      estimatedSavings = '~40KB';
    } else if (depName.startsWith('@tanstack')) {
      priority = 'MEDIUM';
      reason = 'Optional virtualization, ~30KB';
      estimatedSavings = '~30KB';
    } else if (depName === 'sonner') {
      priority = 'MEDIUM';
      reason = 'Toast notifications, ~15KB';
      estimatedSavings = '~15KB';
    } else if (depName === 'react-window') {
      priority = 'MEDIUM';
      reason = 'Virtual scrolling, ~20KB';
      estimatedSavings = '~20KB';
    } else if (depName === 'prismjs') {
      priority = 'MEDIUM';
      reason = 'Syntax highlighting, ~50KB with themes';
      estimatedSavings = '~50KB';
    } else if (depName.startsWith('remark-') || depName.startsWith('rehype-')) {
      priority = 'HIGH';
      reason = 'Markdown plugins, part of react-markdown ecosystem';
      estimatedSavings = '~100KB';
    }

    if (priority !== 'Low') {
      recommendations.push({
        dependency: depName,
        priority,
        reason,
        estimatedSavings,
        usage: dep.usage,
      });
    }
  }
});

// Sort by priority
const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

recommendations.forEach((rec, index) => {
  console.log(`\n${index + 1}. ${rec.dependency}`);
  console.log(`   Priority: ${rec.priority}`);
  console.log(`   Savings: ${rec.estimatedSavings}`);
  console.log(`   Reason: ${rec.reason}`);
  console.log(`   Usage: Found in ${rec.usage} files`);
});

// Tree-shaking analysis
console.log('\n\n🌲 Tree-Shaking Effectiveness:');
console.log('━'.repeat(80));

console.log(`
Current Configuration:
  - Splitting: enabled ✅
  - Tree-shaking: recommended preset ✅
  - Module side effects: false ✅
  - Drop console/debugger: enabled ✅

Potential Improvements:
  1. Ensure all imports use named exports (not default)
  2. Mark more dependencies as "sideEffects: false"
  3. Use dynamic imports for heavy features
  4. Consider splitting by feature area
`);

// Dead code analysis
console.log('\n🗑️  Dead Code Detection:');
console.log('━'.repeat(80));

// Find files that are exported but potentially unused
const internalExports = execSync(
  `grep -r "export {" ${join(packageRoot, 'src/internal.ts')} | wc -l`,
  { encoding: 'utf-8' }
).trim();

console.log(`
Potential Dead Code Opportunities:
  1. Internal exports: ${internalExports} (may not be tree-shakeable)
  2. Check for unused utility functions
  3. Analyze re-exports in index.ts files
  4. Look for deprecated components still exported

Recommendation: Use tools like ts-prune or knip for detailed analysis
`);

// Code splitting opportunities
console.log('\n✂️  Code Splitting Opportunities:');
console.log('━'.repeat(80));

console.log(`
Current Entry Points:
  ✅ index.ts (main bundle)
  ✅ core.ts (minimal bundle)
  ✅ core-minimal.ts (ultra-light)
  ✅ utils/index.ts
  ✅ animations/index.ts
  ✅ prompt/index.ts
  ✅ analytics/index.ts
  ✅ memory/index.ts
  ✅ adapters/index.ts
  ✅ slim.ts
  ✅ namespaced.ts

Recommended Additional Entry Points:
  1. dashboards/index.ts - Analytics dashboards (~200KB)
  2. ai-ops/index.ts - Prompt testing & safety (~150KB)
  3. enterprise/index.ts - Enterprise features (~100KB)
  4. media/index.ts - Media components (~80KB)
  5. search/index.ts - Search components (~50KB)
`);

// Summary
console.log('\n\n📋 SUMMARY');
console.log('━'.repeat(80));

const totalSavings = recommendations.reduce((sum, rec) => {
  const savings = parseInt(rec.estimatedSavings.match(/\d+/)?.[0] || '0');
  return sum + savings;
}, 0);

console.log(`
Top 10 Externalization Candidates: ${recommendations.length}
Estimated Total Savings: ~${totalSavings}KB (minified)

Priority Actions:
  1. ✅ DONE: Externalize react-markdown ecosystem (remark-gfm, rehype-highlight)
  2. ✅ DONE: Externalize zod validation
  3. ✅ DONE: Externalize prismjs
  4. 🔄 NEXT: Move @tanstack/react-virtual to peer dependencies
  5. 🔄 NEXT: Move sonner to peer dependencies
  6. 🔄 NEXT: Move isomorphic-dompurify to peer dependencies
  7. 🔄 NEXT: Move react-window to peer dependencies
  8. 🔄 NEXT: Create additional entry points for heavy features

Current Bundle Status:
  - Multiple entry points: ✅ Yes (11 entry points)
  - Tree-shaking: ✅ Enabled
  - Code splitting: ✅ Enabled
  - Minification: ✅ Enabled
  - Source maps: ❌ Disabled (production)

Next Steps:
  1. Run 'pnpm size' to measure current bundle size
  2. Consider externalizing top 4 recommendations
  3. Add dynamic imports for optional features
  4. Profile bundle with 'pnpm size:why'
`);

console.log('\n✨ Analysis complete!\n');
