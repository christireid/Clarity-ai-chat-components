#!/bin/bash
set -e

# Generate Quality Trends Dashboard
# Usage: ./generate-dashboard.sh

METRICS_DIR=".github/metrics"
HISTORY_FILE="$METRICS_DIR/quality-history.csv"
DASHBOARD_FILE=".github/dashboards/quality-trends.md"

# Create dashboards directory if it doesn't exist
mkdir -p ".github/dashboards"

if [ ! -f "$HISTORY_FILE" ]; then
  echo "❌ No metrics history found. Run collect-quality-metrics.sh first."
  exit 1
fi

echo "📈 Generating quality trends dashboard..."

# Get latest metrics
LATEST=$(tail -n 1 "$HISTORY_FILE")
AUDIT_SCORE=$(echo "$LATEST" | cut -d',' -f2)
DUPLICATE_PCT=$(echo "$LATEST" | cut -d',' -f3)
VULN_CRITICAL=$(echo "$LATEST" | cut -d',' -f4)
VULN_HIGH=$(echo "$LATEST" | cut -d',' -f5)
LIGHTHOUSE_SCORE=$(echo "$LATEST" | cut -d',' -f7)
BUNDLE_SIZE=$(echo "$LATEST" | cut -d',' -f8)

# Calculate trends (compare with 7 days ago)
TREND_DAYS=7
LINE_COUNT=$(wc -l < "$HISTORY_FILE")

if [ $LINE_COUNT -gt $((TREND_DAYS + 1)) ]; then
  PREVIOUS=$(tail -n $((TREND_DAYS + 1)) "$HISTORY_FILE" | head -n 1)
  PREV_AUDIT_SCORE=$(echo "$PREVIOUS" | cut -d',' -f2)
  PREV_DUPLICATE_PCT=$(echo "$PREVIOUS" | cut -d',' -f3)
  PREV_VULN_CRITICAL=$(echo "$PREVIOUS" | cut -d',' -f4)
  PREV_VULN_HIGH=$(echo "$PREVIOUS" | cut -d',' -f5)
  PREV_LIGHTHOUSE=$(echo "$PREVIOUS" | cut -d',' -f7)
  PREV_BUNDLE=$(echo "$PREVIOUS" | cut -d',' -f8)

  # Calculate changes
  AUDIT_CHANGE=$((AUDIT_SCORE - PREV_AUDIT_SCORE))
  DUPLICATE_CHANGE=$(echo "$DUPLICATE_PCT - $PREV_DUPLICATE_PCT" | bc)
  VULN_CHANGE=$((VULN_CRITICAL + VULN_HIGH - PREV_VULN_CRITICAL - PREV_VULN_HIGH))
  LIGHTHOUSE_CHANGE=$((LIGHTHOUSE_SCORE - PREV_LIGHTHOUSE))
  BUNDLE_CHANGE=$((BUNDLE_SIZE - PREV_BUNDLE))
else
  AUDIT_CHANGE=0
  DUPLICATE_CHANGE=0
  VULN_CHANGE=0
  LIGHTHOUSE_CHANGE=0
  BUNDLE_CHANGE=0
fi

# Generate trend indicators
get_trend_indicator() {
  local change=$1
  local reverse=${2:-false}  # Some metrics are better when lower

  if [ "$reverse" = "true" ]; then
    if (( $(echo "$change < 0" | bc -l) )); then
      echo "📈 Improving"
    elif (( $(echo "$change > 0" | bc -l) )); then
      echo "📉 Regressing"
    else
      echo "➡️ Stable"
    fi
  else
    if (( $(echo "$change > 0" | bc -l) )); then
      echo "📈 Improving"
    elif (( $(echo "$change < 0" | bc -l) )); then
      echo "📉 Regressing"
    else
      echo "➡️ Stable"
    fi
  fi
}

AUDIT_TREND=$(get_trend_indicator "$AUDIT_CHANGE" false)
DUPLICATE_TREND=$(get_trend_indicator "$DUPLICATE_CHANGE" true)
VULN_TREND=$(get_trend_indicator "$VULN_CHANGE" true)
LIGHTHOUSE_TREND=$(get_trend_indicator "$LIGHTHOUSE_CHANGE" false)
BUNDLE_TREND=$(get_trend_indicator "$BUNDLE_CHANGE" true)

# Generate ASCII charts using awk
generate_sparkline() {
  local column=$1
  local max_points=30

  # Extract column values (skip header)
  VALUES=$(tail -n +2 "$HISTORY_FILE" | tail -n $max_points | cut -d',' -f$column)

  # Generate sparkline
  echo "$VALUES" | awk '
  BEGIN {
    chars[1] = "▁"
    chars[2] = "▂"
    chars[3] = "▃"
    chars[4] = "▄"
    chars[5] = "▅"
    chars[6] = "▆"
    chars[7] = "▇"
    chars[8] = "█"
  }
  {
    values[NR] = $1
    if (NR == 1 || $1 < min) min = $1
    if (NR == 1 || $1 > max) max = $1
  }
  END {
    range = max - min
    if (range == 0) range = 1
    for (i = 1; i <= NR; i++) {
      normalized = (values[i] - min) / range
      index = int(normalized * 7) + 1
      if (index > 8) index = 8
      printf "%s", chars[index]
    }
    print ""
  }
  '
}

# Generate complete dashboard
cat > "$DASHBOARD_FILE" <<EOF
# Quality Trends Dashboard

**Last Updated**: $(date '+%Y-%m-%d %H:%M:%S')
**Data Points**: $((LINE_COUNT - 1)) days
**Trend Period**: Last $TREND_DAYS days

---

## 📊 Current Metrics

| Metric | Current | 7d Change | Trend |
|--------|---------|-----------|-------|
| **Audit Score** | $AUDIT_SCORE/100 | ${AUDIT_CHANGE:+$AUDIT_CHANGE} | $AUDIT_TREND |
| **Duplicate Code** | ${DUPLICATE_PCT}% | ${DUPLICATE_CHANGE:+$DUPLICATE_CHANGE}% | $DUPLICATE_TREND |
| **Critical Vulnerabilities** | $VULN_CRITICAL | ${VULN_CHANGE:+$VULN_CHANGE} | $VULN_TREND |
| **High Vulnerabilities** | $VULN_HIGH | - | - |
| **Lighthouse Score** | $LIGHTHOUSE_SCORE/100 | ${LIGHTHOUSE_CHANGE:+$LIGHTHOUSE_CHANGE} | $LIGHTHOUSE_TREND |
| **Bundle Size** | ${BUNDLE_SIZE}KB | ${BUNDLE_CHANGE:+$BUNDLE_CHANGE}KB | $BUNDLE_TREND |

---

## 📈 Trends (Last 30 Days)

### Audit Score
\`\`\`
$(generate_sparkline 2)
\`\`\`
Target: 90/100
Current: $AUDIT_SCORE/100
Status: $([ "$AUDIT_SCORE" -ge 90 ] && echo "✅ At target" || echo "⚠️ Below target ($(( 90 - AUDIT_SCORE )) points needed)")

### Duplicate Code Percentage
\`\`\`
$(generate_sparkline 3)
\`\`\`
Target: 0%
Current: ${DUPLICATE_PCT}%
Status: $(echo "$DUPLICATE_PCT == 0" | bc -l | grep -q 1 && echo "✅ No duplicates" || echo "⚠️ Duplicates detected")

### Security Vulnerabilities (Critical + High)
\`\`\`
$(tail -n +2 "$HISTORY_FILE" | tail -n 30 | awk -F',' '{print $4 + $5}' | awk '
  BEGIN {
    chars[1] = "▁"; chars[2] = "▂"; chars[3] = "▃"; chars[4] = "▄";
    chars[5] = "▅"; chars[6] = "▆"; chars[7] = "▇"; chars[8] = "█"
  }
  {
    values[NR] = $1
    if (NR == 1 || $1 < min) min = $1
    if (NR == 1 || $1 > max) max = $1
  }
  END {
    range = max - min
    if (range == 0) range = 1
    for (i = 1; i <= NR; i++) {
      normalized = (values[i] - min) / range
      index = int(normalized * 7) + 1
      if (index > 8) index = 8
      printf "%s", chars[index]
    }
    print ""
  }
')
\`\`\`
Target: 0
Current: $((VULN_CRITICAL + VULN_HIGH))
Status: $([ $((VULN_CRITICAL + VULN_HIGH)) -eq 0 ] && echo "✅ No critical/high vulnerabilities" || echo "⚠️ $((VULN_CRITICAL + VULN_HIGH)) vulnerabilities found")

### Lighthouse Performance Score
\`\`\`
$(generate_sparkline 7)
\`\`\`
Target: 85+
Current: $LIGHTHOUSE_SCORE/100
Status: $([ "$LIGHTHOUSE_SCORE" -ge 85 ] && echo "✅ Meeting target" || echo "⚠️ Below target")

### Bundle Size (KB)
\`\`\`
$(generate_sparkline 8)
\`\`\`
Target: <500KB
Current: ${BUNDLE_SIZE}KB
Status: $([ "$BUNDLE_SIZE" -lt 500 ] && echo "✅ Within budget" || echo "⚠️ Exceeds budget by $((BUNDLE_SIZE - 500))KB")

---

## 📅 Historical Data (Last 7 Days)

| Date | Audit | Duplicates | Vulns | Lighthouse | Bundle |
|------|-------|------------|-------|------------|--------|
$(tail -n 8 "$HISTORY_FILE" | tail -n 7 | awk -F',' '{printf "| %s | %s/100 | %s%% | %d | %s/100 | %sKB |\n", $1, $2, $3, $4+$5, $7, $8}')

---

## 🎯 Quality Goals

- [ ] Audit Score: 90/100 (Currently: $AUDIT_SCORE/100)
- [$(echo "$DUPLICATE_PCT == 0" | bc -l | grep -q 1 && echo "x" || echo " ")] Duplicate Code: 0% (Currently: ${DUPLICATE_PCT}%)
- [$([ $VULN_CRITICAL -eq 0 ] && echo "x" || echo " ")] Critical Vulnerabilities: 0 (Currently: $VULN_CRITICAL)
- [$([ $VULN_HIGH -eq 0 ] && echo "x" || echo " ")] High Vulnerabilities: 0 (Currently: $VULN_HIGH)
- [$([ "$LIGHTHOUSE_SCORE" -ge 85 ] && echo "x" || echo " ")] Lighthouse Score: 85+ (Currently: $LIGHTHOUSE_SCORE/100)
- [$([ "$BUNDLE_SIZE" -lt 500 ] && echo "x" || echo " ")] Bundle Size: <500KB (Currently: ${BUNDLE_SIZE}KB)

---

## 📊 Score Breakdown

### Audit Score Components
- **Base Score**: 35 points
- **Phase 1** (Build Stabilization): 20 points
- **Phase 2** (Verification Gates): 10 points
- **Phase 3** (Incremental Consolidation): 5 points
- **Quick Wins**: 2 points
- **Current Total**: $AUDIT_SCORE/100

### Remaining Work
$([ "$AUDIT_SCORE" -lt 90 ] && echo "**$(( 90 - AUDIT_SCORE )) points needed to reach 90/100 target**" || echo "**Target reached!** 🎉")

---

## 🔧 Generated Data

This dashboard is automatically generated from \`.github/metrics/quality-history.csv\`.

**Update Frequency**: Daily at 9 AM (weekdays)
**Data Retention**: 90 days
**Last Collection**: $(tail -n 1 "$HISTORY_FILE" | cut -d',' -f1)

To manually update:
\`\`\`bash
./.github/scripts/collect-quality-metrics.sh
./.github/scripts/generate-dashboard.sh
\`\`\`

---

**Generated**: $(date '+%Y-%m-%d %H:%M:%S')
EOF

echo "✅ Dashboard generated: $DASHBOARD_FILE"

# Display summary
echo ""
echo "📊 Dashboard Summary:"
echo "  - Audit Score: $AUDIT_SCORE/100 ($AUDIT_TREND)"
echo "  - Duplicate Code: ${DUPLICATE_PCT}% ($DUPLICATE_TREND)"
echo "  - Vulnerabilities: $((VULN_CRITICAL + VULN_HIGH)) ($VULN_TREND)"
echo "  - Lighthouse: $LIGHTHOUSE_SCORE/100 ($LIGHTHOUSE_TREND)"
echo "  - Bundle Size: ${BUNDLE_SIZE}KB ($BUNDLE_TREND)"
