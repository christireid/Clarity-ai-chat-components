# CI/CD Monitoring and Observability

**Date Created**: January 27, 2026 **Purpose**: Track workflow performance, quality trends, and
system health

---

## Overview

This document describes how to monitor the CI/CD quality automation system to ensure optimal
performance, catch issues early, and track quality trends over time.

---

## Key Metrics to Track

### 1. Workflow Execution Metrics

| Metric                | Target      | Alert Threshold | Tool           |
| --------------------- | ----------- | --------------- | -------------- |
| **Workflow Duration** | <8 minutes  | >10 minutes     | GitHub Actions |
| **Success Rate**      | >95%        | <90%            | GitHub Actions |
| **Queue Time**        | <30 seconds | >2 minutes      | GitHub Actions |
| **Concurrent Runs**   | 3-5         | >10             | GitHub Actions |

### 2. Quality Score Metrics

| Metric                        | Target | Alert Threshold | Tracking              |
| ----------------------------- | ------ | --------------- | --------------------- |
| **Audit Score**               | 90/100 | <75             | `.api-dx-audit/` docs |
| **Duplicate Files**           | 0      | >5              | jscpd                 |
| **Security Vulns (Critical)** | 0      | >0              | pnpm audit            |
| **Security Vulns (High)**     | 0      | >3              | pnpm audit            |
| **Bundle Size**               | <500KB | >600KB          | Bundle check          |
| **Lighthouse Score**          | >85    | <70             | Lighthouse CI         |

### 3. Developer Experience Metrics

| Metric                  | Target   | Alert Threshold | Tracking        |
| ----------------------- | -------- | --------------- | --------------- |
| **PR Review Time**      | <2 hours | >8 hours        | Manual tracking |
| **CI Blocking Time**    | <5% PRs  | >15% PRs        | GitHub insights |
| **False Positive Rate** | <5%      | >15%            | Issue labels    |
| **Emergency Bypasses**  | 0/month  | >2/month        | Audit log       |

---

## Monitoring Dashboards

### GitHub Actions Dashboard (Built-in)

**Location**: `https://github.com/[org]/[repo]/actions`

**What to Monitor**:

- Workflow runs timeline
- Success/failure trends
- Execution time trends
- Most common failure points

**Weekly Review Checklist**:

```markdown
- [ ] Check success rate (target: >95%)
- [ ] Review failed runs and common errors
- [ ] Identify slowest jobs (optimize if >3 min)
- [ ] Check queue times (should be <30s)
- [ ] Review artifact storage usage
```

### Quality Trends Dashboard (Custom)

**Location**: `.github/dashboards/quality-trends.md` (auto-generated)

**Metrics Tracked**:

```markdown
## Quality Trends (Last 30 Days)

### Audit Score History

| Date       | Score  | Change | Grade |
| ---------- | ------ | ------ | ----- |
| 2026-01-27 | 72/100 | +2     | C     |
| 2026-01-26 | 70/100 | +5     | C     |
| 2026-01-25 | 65/100 | +30    | D     |

### Duplicate Code Trend

📉 Decreasing (Good!)

- Week 1: 12 files
- Week 2: 5 files
- Week 3: 0 files ✅

### Security Vulnerabilities

🔒 Stable

- Critical: 0 ✅
- High: 1 ⚠️
- Moderate: 3

### Performance Metrics

⚡ Improving

- Lighthouse Score: 78 → 85
- LCP: 2800ms → 2200ms ✅
- CLS: 0.15 → 0.08 ✅
```

**Auto-generation Script**:

```bash
# .github/scripts/generate-dashboard.sh

#!/bin/bash
set -e

echo "Generating quality trends dashboard..."

# Fetch historical data from GitHub Actions cache
gh cache list --json key,createdAt | \
  jq -r '.[] | select(.key | startswith("quality-score-"))' > cache-keys.json

# Generate markdown dashboard
cat > .github/dashboards/quality-trends.md <<EOF
# Quality Trends Dashboard

Last Updated: $(date)

$(node .github/scripts/generate-trends.js)
EOF

echo "✅ Dashboard generated"
```

---

## Alerting and Notifications

### Slack Notifications

#### Channel Setup

| Channel          | Purpose           | Notifications                 |
| ---------------- | ----------------- | ----------------------------- |
| **#engineering** | Main dev channel  | Main branch CI failures       |
| **#quality**     | Quality metrics   | Daily quality report          |
| **#security**    | Security alerts   | Critical/high vulnerabilities |
| **#oncall**      | Incident response | Emergency bypasses            |

#### Notification Configuration

**Main Branch Failures** (Already implemented):

```yaml
# In .github/workflows/quality-checks.yml
- name: Send Slack notification on failure
  if: failure() && github.ref == 'refs/heads/main'
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: |
      {
        "text": "🚨 Quality Gate Failed on Main Branch",
        ...
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Daily Quality Report** (To be added):

```yaml
# .github/workflows/daily-quality-report.yml

name: Daily Quality Report

on:
  schedule:
    - cron: '0 9 * * 1-5' # 9 AM weekdays

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - name: Generate report
        run: |
          # Collect metrics from last 24 hours
          ./scripts/generate-daily-report.sh

      - name: Send to Slack
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload-file-path: ./daily-report.json
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_QUALITY_WEBHOOK }}
```

### Email Alerts

**Critical Issues**:

```yaml
# Add to workflow for critical alerts

- name: Send email on critical security vulnerability
  if: steps.audit.outputs.critical > 0
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: 🔴 CRITICAL: Security Vulnerability Detected
    to: security-team@company.com
    from: GitHub Actions <noreply@github.com>
    body: |
      Critical security vulnerability detected in PR #${{ github.event.number }}

      Repository: ${{ github.repository }}
      Branch: ${{ github.head_ref }}

      View details: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

---

## Performance Monitoring

### Workflow Execution Time Tracking

**Script to Track Job Duration**:

```bash
# .github/scripts/track-performance.sh

#!/bin/bash

# Fetch recent workflow runs
gh run list --workflow=quality-checks.yml --limit 50 --json durationMs,conclusion > runs.json

# Calculate statistics
node -e "
const runs = require('./runs.json');
const successful = runs.filter(r => r.conclusion === 'success');
const durations = successful.map(r => r.durationMs / 1000 / 60); // Convert to minutes

const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
const max = Math.max(...durations);
const min = Math.min(...durations);

console.log(\`
Workflow Performance Statistics (Last 50 runs):
- Average Duration: \${avg.toFixed(2)} minutes
- Max Duration: \${max.toFixed(2)} minutes
- Min Duration: \${min.toFixed(2)} minutes
- Target: <8 minutes
- Status: \${avg < 8 ? '✅ Within target' : '⚠️ Exceeds target'}
\`);
"
```

**Run Weekly**:

```bash
# Add to cron or run manually
./github/scripts/track-performance.sh
```

### Job-Level Performance Analysis

**Identify Slowest Jobs**:

```bash
# Fetch detailed timing for each job
gh run view [RUN_ID] --json jobs | \
  jq -r '.jobs[] | "\(.name): \(.steps[] | "\(.name): \(.conclusion) (\(.durationMs / 1000)s)")"'
```

**Optimization Targets**:

1. Any job >3 minutes → investigate caching
2. Install dependencies >1 minute → use cached node_modules
3. Build step >2 minutes → use Turbo Cache
4. Test suite >2 minutes → parallel execution

---

## Quality Trend Analysis

### Historical Data Collection

**Store Quality Metrics**:

```bash
# .github/scripts/store-quality-metrics.sh

#!/bin/bash
set -e

TIMESTAMP=$(date +%Y-%m-%d)
AUDIT_SCORE=$(grep "Current Score:" .api-dx-audit/*.md | head -1 | grep -oE '[0-9]+')
DUPLICATE_COUNT=$(jq '.statistics.total.percentage' .jscpd-report/jscpd-report.json 2>/dev/null || echo "0")
VULN_CRITICAL=$(pnpm audit --json | jq '.metadata.vulnerabilities.critical // 0')
VULN_HIGH=$(pnpm audit --json | jq '.metadata.vulnerabilities.high // 0')

# Append to CSV
echo "$TIMESTAMP,$AUDIT_SCORE,$DUPLICATE_COUNT,$VULN_CRITICAL,$VULN_HIGH" >> \
  .github/metrics/quality-history.csv

# Commit to repo (in separate branch)
git add .github/metrics/quality-history.csv
git commit -m "chore: update quality metrics for $TIMESTAMP"
```

### Trend Visualization

**Generate ASCII Charts**:

```bash
# .github/scripts/visualize-trends.sh

#!/bin/bash

cat .github/metrics/quality-history.csv | \
  termgraph --title "Audit Score Trend" --width 50 --format '{:.0f}'
```

**Weekly Email Report**:

```markdown
# Weekly Quality Report (Week of Jan 21-27, 2026)

## Executive Summary

📈 Quality improving overall ✅ 5 PRs merged ⚠️ 1 security vulnerability found (resolved)

## Metrics

| Metric             | This Week | Last Week | Change   |
| ------------------ | --------- | --------- | -------- |
| Audit Score        | 72/100    | 70/100    | +2 ✅    |
| PRs Merged         | 5         | 8         | -3       |
| CI Success Rate    | 96%       | 94%       | +2% ✅   |
| Avg PR Review Time | 1.5h      | 2.2h      | -0.7h ✅ |

## Top Contributors

1. @developer1 - 3 PRs
2. @developer2 - 2 PRs

## Issues to Address

- Bundle size trending upward (480KB → 495KB)
- 1 high-severity vulnerability in lodash (fix available)
```

---

## Logging and Debugging

### Workflow Logs

**Access Logs**:

```
GitHub → Actions → Select workflow run → Select job → View logs
```

**Download Logs for Analysis**:

```bash
gh run download [RUN_ID] --name [JOB_NAME]-logs
```

**Common Log Patterns to Monitor**:

```bash
# Search for errors
cat workflow.log | grep "ERROR"

# Search for warnings
cat workflow.log | grep "WARN"

# Check timing
cat workflow.log | grep "took"
```

### Artifact Analysis

**Download All Artifacts**:

```bash
gh run download [RUN_ID]
```

**Artifact Retention Policy**:

```yaml
# In workflow
- uses: actions/upload-artifact@v4
  with:
    retention-days: 7 # Keep for 7 days (vs 90 days default)
```

**Artifact Storage Monitoring**:

```bash
# Check storage usage
gh api -X GET /repos/:owner/:repo/actions/cache/usage | jq
```

---

## Health Checks

### Daily Health Check Script

```bash
# .github/scripts/health-check.sh

#!/bin/bash
set -e

echo "🏥 Running CI/CD Health Check..."

# 1. Check recent workflow success rate
SUCCESS_RATE=$(gh run list --workflow=quality-checks.yml --limit 20 --json conclusion | \
  jq '[.[] | select(.conclusion == "success")] | length')

if [ $SUCCESS_RATE -lt 17 ]; then # 85% of 20
  echo "⚠️ Success rate below 85%: $SUCCESS_RATE/20"
else
  echo "✅ Success rate healthy: $SUCCESS_RATE/20 (85%+)"
fi

# 2. Check average execution time
AVG_TIME=$(gh run list --workflow=quality-checks.yml --limit 10 --json durationMs | \
  jq '[.[].durationMs] | add / length / 1000 / 60')

if (( $(echo "$AVG_TIME > 8" | bc -l) )); then
  echo "⚠️ Average execution time exceeds target: ${AVG_TIME}min"
else
  echo "✅ Execution time within target: ${AVG_TIME}min"
fi

# 3. Check for stuck/pending runs
PENDING=$(gh run list --status pending --limit 1 | wc -l)
if [ $PENDING -gt 0 ]; then
  echo "⚠️ Pending workflow detected (might be stuck)"
else
  echo "✅ No pending workflows"
fi

# 4. Check storage usage
STORAGE=$(gh api /repos/:owner/:repo/actions/cache/usage | jq '.active_caches_size_in_bytes / 1024 / 1024')
if (( $(echo "$STORAGE > 5000" | bc -l) )); then
  echo "⚠️ Cache storage high: ${STORAGE}MB"
else
  echo "✅ Cache storage healthy: ${STORAGE}MB"
fi

echo "✅ Health check complete"
```

**Run Daily**:

```yaml
# .github/workflows/health-check.yml

name: Daily Health Check

on:
  schedule:
    - cron: '0 8 * * 1-5' # 8 AM weekdays

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run health check
        run: ./.github/scripts/health-check.sh

      - name: Notify if unhealthy
        if: failure()
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload: |
            {
              "text": "⚠️ CI/CD Health Check Failed"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Continuous Improvement

### Monthly Review Process

**Agenda**:

1. Review key metrics
2. Analyze trends
3. Identify pain points
4. Plan improvements

**Template**:

```markdown
# CI/CD Monthly Review - [Month Year]

## Metrics Summary

- Workflow Success Rate: XX%
- Average Execution Time: XX minutes
- Emergency Bypasses: X
- Quality Score: XX/100

## What Went Well

- [Achievement 1]
- [Achievement 2]

## Areas for Improvement

- [Issue 1]
- [Issue 2]

## Action Items

- [ ] [Action 1] - Owner: @developer - Due: YYYY-MM-DD
- [ ] [Action 2] - Owner: @developer - Due: YYYY-MM-DD
```

### Optimization Ideas Backlog

| Idea                               | Impact | Effort | Priority |
| ---------------------------------- | ------ | ------ | -------- |
| Add Turbo Cache for monorepo       | High   | Medium | P0       |
| Parallel test execution            | Medium | Low    | P1       |
| Self-hosted runners for heavy jobs | High   | High   | P2       |
| Visual regression testing          | Medium | High   | P3       |

---

## Version History

| Version | Date       | Changes                          |
| ------- | ---------- | -------------------------------- |
| 1.0     | 2026-01-27 | Initial monitoring documentation |

---

**Last Updated**: January 27, 2026 **Owner**: DevOps Team **Review Frequency**: Monthly
