# GitHub Actions CI/CD Setup

## Issue

The CI/CD workflow file (`.github/workflows/ci.yml`) cannot be pushed via GitHub App due to permission restrictions. It needs to be added manually through the GitHub web interface or with a personal access token.

## Solution Options

### Option 1: Add via GitHub Web Interface (Recommended)

1. Go to your repository on GitHub:
   https://github.com/christireid/Clarity-ai-chat-components

2. Navigate to: **Settings → Actions → General**

3. Ensure "Allow all actions and reusable workflows" is selected

4. Create the workflow file manually:
   - Go to the **Actions** tab
   - Click "New workflow"
   - Click "set up a workflow yourself"
   - Copy the content from `ci.yml.backup` in the repository root
   - Name the file: `.github/workflows/ci.yml`
   - Commit directly to main branch

### Option 2: Using Git with Personal Access Token

```bash
# 1. Create a Personal Access Token (PAT) on GitHub
# Go to: Settings → Developer settings → Personal access tokens → Tokens (classic)
# Create token with 'repo' and 'workflow' scopes

# 2. Configure git to use the PAT
git remote set-url origin https://YOUR_TOKEN@github.com/christireid/Clarity-ai-chat-components.git

# 3. Move the workflow file back and push
mv ci.yml.backup .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: Add GitHub Actions workflow for automated testing"
git push origin main

# 4. Restore original remote URL (optional but recommended)
git remote set-url origin https://github.com/christireid/Clarity-ai-chat-components.git
```

### Option 3: Using GitHub CLI

```bash
# 1. Authenticate with workflow permissions
gh auth refresh -s workflow

# 2. Move workflow file back and push
mv ci.yml.backup .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: Add GitHub Actions workflow for automated testing"
git push origin main
```

## Workflow File Location

The complete CI/CD workflow configuration is saved in:
```
/home/user/webapp/ci.yml.backup
```

## Workflow Features

The CI/CD pipeline includes:

- ✅ **Lint & Type Check**: ESLint and TypeScript validation
- ✅ **Unit Tests**: Vitest with coverage reporting
- ✅ **Integration Tests**: Package builds and imports
- ✅ **E2E Tests**: Playwright (on PR and main branch)
- ✅ **Storybook Build**: Component story validation
- ✅ **Docs Build**: VitePress documentation
- ✅ **Security Audit**: npm audit and Snyk scanning
- ✅ **All Checks Gate**: Final verification

## Required Secrets (Optional)

For full functionality, add these secrets in GitHub:
- **Settings → Secrets and variables → Actions**

```yaml
CODECOV_TOKEN: (optional) For coverage reports
SNYK_TOKEN: (optional) For security scanning
NPM_TOKEN: (optional) For automated publishing
```

## Testing the Workflow

After adding the workflow file:

1. Make a small change to any file
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: Trigger CI/CD pipeline"
   git push origin main
   ```
3. Go to **Actions** tab on GitHub
4. Watch the workflow run

## Expected Results

All jobs should pass:
- ✅ lint-and-typecheck
- ✅ test-unit
- ✅ test-integration
- ✅ build-storybook
- ✅ build-docs
- ✅ security-audit (may show warnings)
- ✅ all-checks-passed

## Troubleshooting

### Issue: "npm audit" fails
**Solution**: Update dependencies or adjust audit level in workflow

### Issue: Tests fail on CI but pass locally
**Solution**: Check for environment-specific issues (timezone, Node version)

### Issue: Build artifacts not uploaded
**Solution**: Ensure branch is main or PR targets main

## Next Steps

1. Add the workflow file using one of the methods above
2. Verify all checks pass
3. Set up branch protection rules to require checks
4. Configure auto-merge for dependabot PRs

## Branch Protection (Recommended)

After workflow is working:

1. Go to: **Settings → Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - Select: lint-and-typecheck, test-unit, test-integration, build-storybook, build-docs
   - ✅ Require signed commits (optional)
   - ✅ Include administrators

This ensures all code is tested before merging.

---

**Created**: October 25, 2024  
**Status**: Workflow ready, waiting for manual addition to repository
