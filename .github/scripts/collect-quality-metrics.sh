#!/bin/bash
set -e

# Collect Quality Metrics for Dashboard
# Usage: ./collect-quality-metrics.sh

TIMESTAMP=$(date +%Y-%m-%d)
METRICS_DIR=".github/metrics"
HISTORY_FILE="$METRICS_DIR/quality-history.csv"

# Create metrics directory if it doesn't exist
mkdir -p "$METRICS_DIR"

echo "📊 Collecting quality metrics for $TIMESTAMP..."

# Initialize metrics
AUDIT_SCORE=0
DUPLICATE_PERCENTAGE=0
VULN_CRITICAL=0
VULN_HIGH=0
VULN_MODERATE=0
LIGHTHOUSE_SCORE=0
BUNDLE_SIZE_KB=0
TEST_COVERAGE=0

# 1. Extract audit score from documentation
if [ -f ".api-dx-audit/QUICK_WINS.md" ]; then
  AUDIT_SCORE=$(grep -oE 'Cumulative Score.*\|.*\|.*\|.*\|.*[0-9]+/100' .api-dx-audit/QUICK_WINS.md | tail -1 | grep -oE '[0-9]+/100' | cut -d'/' -f1 || echo "0")
  echo "  Audit Score: $AUDIT_SCORE/100"
fi

# 2. Run duplicate detection (if not already done)
if command -v jscpd &> /dev/null; then
  echo "  Running jscpd..."
  pnpm exec jscpd \
    --min-lines 10 \
    --min-tokens 100 \
    --threshold 0 \
    --reporters "json" \
    --output "$METRICS_DIR/.jscpd-temp" \
    --ignore "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/node_modules/**,**/dist/**,**/.next/**,**/build/**" \
    --format "typescript,javascript,tsx,jsx" \
    "packages/react/src" \
    "apps/streamlined-docs" > /dev/null 2>&1 || true

  if [ -f "$METRICS_DIR/.jscpd-temp/jscpd-report.json" ]; then
    DUPLICATE_PERCENTAGE=$(node -e "
      const fs = require('fs');
      try {
        const report = JSON.parse(fs.readFileSync('$METRICS_DIR/.jscpd-temp/jscpd-report.json', 'utf8'));
        const percentage = report.statistics?.total?.percentage || 0;
        console.log(percentage.toFixed(2));
      } catch (e) {
        console.log('0');
      }
    ")
    echo "  Duplicate Code: ${DUPLICATE_PERCENTAGE}%"
    rm -rf "$METRICS_DIR/.jscpd-temp"
  fi
fi

# 3. Run security audit
echo "  Running pnpm audit..."
pnpm audit --json > "$METRICS_DIR/audit-temp.json" 2>/dev/null || true

if [ -f "$METRICS_DIR/audit-temp.json" ]; then
  VULN_CRITICAL=$(node -e "
    const fs = require('fs');
    try {
      const report = JSON.parse(fs.readFileSync('$METRICS_DIR/audit-temp.json', 'utf8'));
      const critical = report.metadata?.vulnerabilities?.critical || 0;
      console.log(critical);
    } catch (e) {
      console.log('0');
    }
  ")

  VULN_HIGH=$(node -e "
    const fs = require('fs');
    try {
      const report = JSON.parse(fs.readFileSync('$METRICS_DIR/audit-temp.json', 'utf8'));
      const high = report.metadata?.vulnerabilities?.high || 0;
      console.log(high);
    } catch (e) {
      console.log('0');
    }
  ")

  VULN_MODERATE=$(node -e "
    const fs = require('fs');
    try {
      const report = JSON.parse(fs.readFileSync('$METRICS_DIR/audit-temp.json', 'utf8'));
      const moderate = report.metadata?.vulnerabilities?.moderate || 0;
      console.log(moderate);
    } catch (e) {
      console.log('0');
    }
  ")

  echo "  Security: Critical=$VULN_CRITICAL, High=$VULN_HIGH, Moderate=$VULN_MODERATE"
  rm -f "$METRICS_DIR/audit-temp.json"
fi

# 4. Check bundle size (if dist exists)
if [ -d "packages/react/dist" ]; then
  BUNDLE_SIZE_BYTES=$(du -sb packages/react/dist 2>/dev/null | cut -f1 || echo "0")
  BUNDLE_SIZE_KB=$((BUNDLE_SIZE_BYTES / 1024))
  echo "  Bundle Size: ${BUNDLE_SIZE_KB}KB"
fi

# 5. Check Lighthouse score (if results exist)
if [ -f ".lighthouseci/manifest.json" ]; then
  LIGHTHOUSE_SCORE=$(node -e "
    const fs = require('fs');
    try {
      const manifest = JSON.parse(fs.readFileSync('.lighthouseci/manifest.json', 'utf8'));
      if (manifest && manifest.length > 0) {
        const score = Math.round((manifest[0].summary.performance || 0) * 100);
        console.log(score);
      } else {
        console.log('0');
      }
    } catch (e) {
      console.log('0');
    }
  ")
  echo "  Lighthouse Score: $LIGHTHOUSE_SCORE/100"
fi

# 6. Check test coverage (if coverage report exists)
if [ -f "coverage/coverage-summary.json" ]; then
  TEST_COVERAGE=$(node -e "
    const fs = require('fs');
    try {
      const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
      const total = coverage.total;
      const linesPct = total?.lines?.pct || 0;
      console.log(linesPct.toFixed(2));
    } catch (e) {
      console.log('0');
    }
  ")
  echo "  Test Coverage: ${TEST_COVERAGE}%"
fi

# Create CSV header if file doesn't exist
if [ ! -f "$HISTORY_FILE" ]; then
  echo "date,audit_score,duplicate_pct,vuln_critical,vuln_high,vuln_moderate,lighthouse_score,bundle_size_kb,test_coverage" > "$HISTORY_FILE"
  echo "✨ Created new metrics history file"
fi

# Append metrics to CSV
echo "$TIMESTAMP,$AUDIT_SCORE,$DUPLICATE_PERCENTAGE,$VULN_CRITICAL,$VULN_HIGH,$VULN_MODERATE,$LIGHTHOUSE_SCORE,$BUNDLE_SIZE_KB,$TEST_COVERAGE" >> "$HISTORY_FILE"

echo "✅ Metrics collected and saved to $HISTORY_FILE"

# Output for GitHub Actions
if [ -n "$GITHUB_OUTPUT" ]; then
  echo "audit_score=$AUDIT_SCORE" >> $GITHUB_OUTPUT
  echo "duplicate_pct=$DUPLICATE_PERCENTAGE" >> $GITHUB_OUTPUT
  echo "vuln_critical=$VULN_CRITICAL" >> $GITHUB_OUTPUT
  echo "vuln_high=$VULN_HIGH" >> $GITHUB_OUTPUT
  echo "lighthouse_score=$LIGHTHOUSE_SCORE" >> $GITHUB_OUTPUT
  echo "bundle_size_kb=$BUNDLE_SIZE_KB" >> $GITHUB_OUTPUT
fi
