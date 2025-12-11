# Branch Protection Configuration

This document outlines the recommended branch protection rules for the Clarity Chat repository to ensure code quality and security.

## Main Branch (`main`)

### Required Status Checks

The following status checks should be required before merging to `main`:

| Check Name | Workflow | Description |
|------------|----------|-------------|
| `Lint` | ci.yml | ESLint and formatting checks |
| `Typecheck` | ci.yml | TypeScript type checking |
| `Test` | ci.yml | Unit test suite |
| `Build` | ci.yml | Production build verification |
| `Lint Workflows` | workflow-lint.yml | GitHub Actions syntax validation |

### Recommended Settings

```yaml
# Branch protection rule for 'main'
protection_rules:
  require_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: false

  require_status_checks:
    strict: true  # Require branch to be up to date before merging
    contexts:
      - "Lint"
      - "Typecheck"
      - "Test"
      - "Build"
      - "Lint Workflows"

  require_conversation_resolution: true
  require_signed_commits: false  # Optional but recommended

  restrictions:
    users: []
    teams: []
    apps: []

  allow_force_pushes: false
  allow_deletions: false
```

## Setup Instructions

### Via GitHub UI

1. Navigate to **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Enter `main` as the branch name pattern
4. Configure the following:

   **Protect matching branches:**
   - ✅ Require a pull request before merging
     - ✅ Require approvals (1)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - Add required checks: `Lint`, `Typecheck`, `Test`, `Build`, `Lint Workflows`
   - ✅ Require conversation resolution before merging
   - ❌ Do not allow bypassing the above settings

5. Click **Create** or **Save changes**

### Via GitHub CLI

```bash
# Enable branch protection for main
gh api -X PUT /repos/{owner}/{repo}/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":["Lint","Typecheck","Test","Build","Lint Workflows"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
  -f restrictions=null
```

## Develop Branch (`develop`)

For the `develop` branch, consider lighter protection:

| Setting | Value |
|---------|-------|
| Required approvals | 0 (or 1) |
| Required checks | `Lint`, `Test` |
| Require up-to-date | No |
| Allow force push | No |

## Security Considerations

### Why These Checks Matter

1. **Lint** - Catches code style issues and potential bugs before they reach production
2. **Typecheck** - Ensures type safety across the codebase
3. **Test** - Validates functionality and prevents regressions
4. **Build** - Confirms the code compiles and bundles correctly
5. **Workflow Lint** - Prevents broken CI/CD configurations

### Additional Recommendations

- **Enable Dependabot alerts** - Automatic security vulnerability detection
- **Enable secret scanning** - Prevent accidental credential exposure
- **Enable push protection** - Block commits containing secrets

## Troubleshooting

### "Required status check is expected"

If a required check isn't running:

1. Verify the workflow file exists and has correct triggers
2. Check that path filters don't exclude your changes
3. Ensure the job name matches exactly (case-sensitive)

### "Branch is not up to date"

When "Require branches to be up to date" is enabled:

```bash
# Update your branch with latest main
git fetch origin main
git rebase origin/main
git push --force-with-lease
```

---

*Last updated: December 2025*
