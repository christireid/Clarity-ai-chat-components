# Emergency CI/CD Bypass Procedure

**Date Created**: January 27, 2026
**Purpose**: Enable emergency deployments when CI/CD is blocking critical fixes

---

## When to Use Emergency Bypass

Use this procedure **ONLY** in these scenarios:

1. **Production Outage**: Critical bug causing service disruption
2. **Security Hotfix**: Urgent security vulnerability needs immediate patching
3. **CI/CD System Failure**: GitHub Actions itself is down or malfunctioning
4. **False Positive Blocking**: Quality check has a known false positive that can't be fixed immediately

**DO NOT use for:**
- Feature deadlines
- Convenience ("I don't want to fix the linting errors")
- Skipping code review
- Avoiding quality standards

---

## Bypass Methods

### Method 1: Admin Override (Recommended)

**Who Can Use**: Repository administrators only

**Steps**:

1. **Get Approval**:
   ```
   - Post in #engineering Slack channel
   - Explain emergency situation
   - Get approval from CTO or tech lead
   - Document incident number
   ```

2. **Disable Branch Protection Temporarily**:
   ```
   GitHub → Settings → Branches → main
   → Edit branch protection rule
   → Temporarily uncheck "Require status checks to pass"
   → Save changes
   ```

3. **Merge PR**:
   ```bash
   # Merge the emergency PR
   git checkout main
   git merge emergency-fix-branch
   git push origin main
   ```

4. **Re-enable Branch Protection**:
   ```
   GitHub → Settings → Branches → main
   → Edit branch protection rule
   → Re-check "Require status checks to pass"
   → Save changes
   ```

5. **Document in Postmortem**:
   ```
   Create .incidents/YYYY-MM-DD-bypass.md with:
   - Timestamp
   - PR number
   - Reason for bypass
   - Who approved
   - Actions taken post-deployment
   ```

### Method 2: Workflow Dispatch Override

**Who Can Use**: Any developer with write access

**Steps**:

1. **Use Manual Workflow Trigger**:
   ```
   GitHub → Actions → Quality Checks workflow
   → Run workflow
   → Select branch
   → Set "bypass_quality_gates" parameter to true
   → Run workflow
   ```

   This requires adding to `.github/workflows/quality-checks.yml`:
   ```yaml
   on:
     workflow_dispatch:
       inputs:
         bypass_quality_gates:
           description: 'Bypass quality gates (emergency only)'
           required: false
           type: boolean
           default: false
   ```

2. **Document Why**:
   ```
   Add comment to PR:
   "Emergency bypass approved by [NAME] for [INCIDENT_ID]"
   ```

### Method 3: Skip CI Commit Message

**Who Can Use**: Any developer (use sparingly)

**Steps**:

1. **Add Skip Tag to Commit**:
   ```bash
   git commit -m "hotfix: critical security patch [skip ci]

   Emergency bypass approved by [CTO_NAME]
   Incident: INC-2026-001
   Reason: Production outage - database connection leak

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

2. **Push and Merge**:
   ```bash
   git push origin emergency-fix
   # Admin merges via GitHub UI (bypass checks)
   ```

3. **Create Follow-up Issue**:
   ```
   Title: "Post-emergency quality check for [PR_NUMBER]"
   Body: Run all quality checks manually and fix any issues
   ```

---

## Post-Bypass Actions (MANDATORY)

After using emergency bypass, you **MUST**:

1. **Run Quality Checks Manually** (within 24 hours):
   ```bash
   # Run all checks locally
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm audit
   pnpm build

   # Run duplicate detection
   pnpm exec jscpd --min-lines 10 --min-tokens 100 \
     packages/react/src apps/streamlined-docs
   ```

2. **Create Follow-up PR** (if issues found):
   ```bash
   git checkout -b fix/post-emergency-cleanup
   # Fix any issues found
   git commit -m "fix: address quality issues from emergency deployment"
   git push origin fix/post-emergency-cleanup
   # Create PR with normal CI checks
   ```

3. **Document in Postmortem**:
   ```markdown
   # Incident Report: Emergency CI Bypass

   **Date**: YYYY-MM-DD HH:MM
   **PR Number**: #123
   **Approved By**: [Name]
   **Reason**: [Brief description]

   ## Timeline
   - HH:MM - Incident detected
   - HH:MM - Emergency bypass approved
   - HH:MM - Fix deployed
   - HH:MM - Service restored

   ## Quality Checks Status
   - [ ] Linting: Pass/Fail (details)
   - [ ] Type checking: Pass/Fail (details)
   - [ ] Security scan: Pass/Fail (details)
   - [ ] Tests: Pass/Fail (details)

   ## Follow-up Actions
   - [ ] Fix quality issues
   - [ ] Update documentation
   - [ ] Improve monitoring to prevent recurrence
   ```

---

## Monitoring Bypass Usage

### Audit Trail

All bypasses are tracked via:

1. **GitHub Audit Log**:
   ```
   Settings → Security → Audit log
   Filter: "branch protection" changes
   ```

2. **Slack Notifications**:
   ```
   All main branch merges without CI trigger #emergency-deploys alert
   ```

3. **Monthly Report**:
   ```
   .incidents/monthly-bypass-report.md
   - Number of bypasses this month
   - Reasons
   - Follow-up completion rate
   ```

### Red Flags

Alert leadership if:
- More than 2 bypasses per month
- Same developer bypassing repeatedly
- Bypasses without postmortem documentation
- Follow-up PRs not created within 48 hours

---

## Preventing Future Bypasses

### Root Cause Categories

| Category | Prevention Strategy |
|----------|-------------------|
| **False Positives** | Adjust tool thresholds, add ignore patterns |
| **Flaky Tests** | Fix or quarantine flaky tests |
| **Slow CI** | Optimize caching, parallelize jobs |
| **Missing Features** | Add feature flags for safer deploys |
| **Time Pressure** | Better sprint planning, earlier testing |

### Continuous Improvement

After each bypass:
1. Identify root cause
2. Update CI/CD to prevent similar issues
3. Document in this file under "Known Issues"
4. Train team on proper procedures

---

## Known Issues and Workarounds

### Issue 1: jscpd False Positives on Test Fixtures

**Symptom**: Test fixtures trigger duplicate detection

**Workaround**:
```bash
# Add to .jscpd.json ignore list
{
  "ignore": [
    "**/__fixtures__/**",
    "**/__mocks__/**",
    "**/test-data/**"
  ]
}
```

### Issue 2: Lighthouse Fails on Network Errors

**Symptom**: Lighthouse CI fails intermittently due to network

**Workaround**:
```yaml
# In workflow, add retry logic
- name: Run Lighthouse CI
  uses: nick-fields/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: lhci autorun
```

### Issue 3: Security Scan Blocks on Transitive Dependencies

**Symptom**: Vulnerability in deep dependency with no fix available

**Workaround**:
```json
// package.json - Add resolutions
{
  "pnpm": {
    "overrides": {
      "vulnerable-package": "^safe-version"
    }
  }
}
```

---

## Emergency Contacts

| Role | Name | Slack | GitHub |
|------|------|-------|--------|
| **CTO** | [Name] | @cto | @cto-github |
| **Tech Lead** | [Name] | @tech-lead | @lead-github |
| **DevOps** | [Name] | @devops | @devops-github |
| **On-Call** | Rotation | #oncall | See PagerDuty |

---

## Appendix: Quality Check Commands

### Full Local Quality Check Suite

```bash
#!/bin/bash
# save as scripts/quality-check.sh

set -e

echo "🔍 Running comprehensive quality checks..."

echo "1️⃣ Installing dependencies..."
pnpm install --frozen-lockfile

echo "2️⃣ Running linter..."
pnpm lint

echo "3️⃣ Running Prettier..."
pnpm format:check

echo "4️⃣ Type checking..."
pnpm typecheck

echo "5️⃣ Running tests..."
pnpm test

echo "6️⃣ Security audit..."
pnpm audit --audit-level=moderate

echo "7️⃣ Duplicate detection..."
pnpm exec jscpd \
  --min-lines 10 \
  --min-tokens 100 \
  --threshold 0 \
  packages/react/src apps/streamlined-docs

echo "8️⃣ Building packages..."
pnpm build

echo "✅ All quality checks passed!"
```

Make executable:
```bash
chmod +x scripts/quality-check.sh
./scripts/quality-check.sh
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-27 | Initial emergency bypass procedure |

---

**Last Updated**: January 27, 2026
**Owner**: DevOps Team
**Review Frequency**: Quarterly
