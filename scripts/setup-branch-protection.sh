#!/usr/bin/env bash
#
# Branch Protection Setup Script
# ================================
# This script configures branch protection rules for the Clarity Chat repository.
# Run this once after cloning the repo (requires admin access).
#
# Prerequisites:
# - GitHub CLI installed and authenticated: gh auth login
# - Admin access to the repository
#
# Usage:
#   chmod +x scripts/setup-branch-protection.sh
#   ./scripts/setup-branch-protection.sh
#

set -euo pipefail

# Configuration
REPO="${GITHUB_REPOSITORY:-christireid/Clarity-ai-chat-components}"
MAIN_BRANCH="main"
DEVELOP_BRANCH="develop"

echo "🔒 Setting up branch protection for $REPO"
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Please install it first:"
    echo "   brew install gh  # macOS"
    echo "   See: https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI. Please run:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Function to set branch protection
setup_branch_protection() {
    local branch=$1
    local required_approvals=$2
    local strict_updates=$3

    echo "📋 Configuring protection for '$branch' branch..."

    # Required status checks
    local status_checks='["Lint","Typecheck","Test","Build","Lint Workflows"]'

    # Build the API payload
    local payload=$(cat <<EOF
{
  "required_status_checks": {
    "strict": $strict_updates,
    "contexts": $status_checks
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": $required_approvals
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true
}
EOF
)

    # Apply branch protection
    if gh api -X PUT "/repos/$REPO/branches/$branch/protection" \
        -H "Accept: application/vnd.github+json" \
        --input - <<< "$payload" > /dev/null 2>&1; then
        echo "   ✅ Branch protection applied to '$branch'"
    else
        echo "   ⚠️  Could not apply protection to '$branch' (branch may not exist or insufficient permissions)"
    fi
}

# Setup main branch protection (stricter)
echo "=== Main Branch ==="
setup_branch_protection "$MAIN_BRANCH" 1 true

echo ""

# Setup develop branch protection (lighter)
echo "=== Develop Branch ==="
setup_branch_protection "$DEVELOP_BRANCH" 0 false

echo ""
echo "🎉 Branch protection setup complete!"
echo ""
echo "📝 Summary of protections:"
echo ""
echo "   Main branch ($MAIN_BRANCH):"
echo "   • Required approvals: 1"
echo "   • Required checks: Lint, Typecheck, Test, Build, Lint Workflows"
echo "   • Require up-to-date before merge: Yes"
echo "   • Dismiss stale reviews: Yes"
echo "   • Required conversation resolution: Yes"
echo ""
echo "   Develop branch ($DEVELOP_BRANCH):"
echo "   • Required approvals: 0"
echo "   • Required checks: Lint, Typecheck, Test, Build, Lint Workflows"
echo "   • Require up-to-date before merge: No"
echo ""
echo "💡 To modify these settings, edit this script or use GitHub UI:"
echo "   Settings → Branches → Branch protection rules"
