/**
 * Compare two tree-shaking reports to detect regressions
 */
const fs = require('fs');

const [baselineFile, currentFile] = process.argv.slice(2);

if (!baselineFile || !currentFile) {
  console.error('Usage: node compare-reports.js <baseline.json> <current.json>');
  process.exit(1);
}

if (!fs.existsSync(baselineFile) || !fs.existsSync(currentFile)) {
  console.error('❌ Report files not found');
  process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf-8'));
const current = JSON.parse(fs.readFileSync(currentFile, 'utf-8'));

console.log('\n📊 Tree-shaking Regression Analysis');
console.log('='.repeat(80));

let hasRegression = false;
const regressionThreshold = 0.05; // 5% increase is a warning
const criticalThreshold = 0.10; // 10% increase fails the build

baseline.forEach(baseTest => {
  const currTest = current.find(t => t.test === baseTest.test);
  if (!currTest) return;

  const baseSize = baseTest.rollup.gzip;
  const currSize = currTest.rollup.gzip;
  const diff = currSize - baseSize;
  const percentChange = (diff / baseSize * 100);

  let status = '✅';
  let severity = 'PASS';

  if (percentChange > criticalThreshold * 100) {
    status = '❌';
    severity = 'CRITICAL';
    hasRegression = true;
  } else if (percentChange > regressionThreshold * 100) {
    status = '⚠️';
    severity = 'WARNING';
  } else if (percentChange < -regressionThreshold * 100) {
    status = '🎉';
    severity = 'IMPROVEMENT';
  }

  console.log(`\n${status} ${baseTest.test.toUpperCase()} [${severity}]`);
  console.log(`   Baseline: ${formatBytes(baseSize)}`);
  console.log(`   Current:  ${formatBytes(currSize)}`);
  console.log(`   Change:   ${diff > 0 ? '+' : ''}${formatBytes(diff)} (${percentChange.toFixed(2)}%)`);

  if (severity === 'CRITICAL') {
    console.log('   ⚠️  BUNDLE SIZE REGRESSION DETECTED');
    console.log(`   This exceeds the ${criticalThreshold * 100}% threshold`);
  } else if (severity === 'WARNING') {
    console.log('   ⚠️  Noticeable size increase');
  } else if (severity === 'IMPROVEMENT') {
    console.log('   ✨ Bundle size improved!');
  }
});

// Summary
console.log('\n' + '='.repeat(80));
if (hasRegression) {
  console.log('❌ REGRESSION DETECTED: Bundle sizes increased significantly');
  console.log('\nPlease investigate:');
  console.log('  1. Were new dependencies added?');
  console.log('  2. Are imports following best practices?');
  console.log('  3. Is tree-shaking working correctly?');
  console.log('  4. Review the TREE-SHAKING-REPORT.md for details');
  process.exit(1);
} else {
  console.log('✅ No significant bundle size regressions detected');
  process.exit(0);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
