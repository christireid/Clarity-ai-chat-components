#!/bin/bash
set -e

# Detect Affected Packages for Monorepo CI Optimization
# Usage: ./detect-affected-packages.sh [base-ref] [head-ref]

BASE_REF=${1:-"origin/main"}
HEAD_REF=${2:-"HEAD"}

echo "🔍 Detecting affected packages..."
echo "Base: $BASE_REF"
echo "Head: $HEAD_REF"

# Get list of changed files
CHANGED_FILES=$(git diff --name-only $BASE_REF...$HEAD_REF)

if [ -z "$CHANGED_FILES" ]; then
  echo "⚠️ No changed files detected"
  echo "affected_packages=all" >> $GITHUB_OUTPUT
  exit 0
fi

echo "Changed files:"
echo "$CHANGED_FILES"

# Initialize arrays
AFFECTED_PACKAGES=()
AFFECTED_APPS=()

# Check if root files changed (affects all packages)
ROOT_CHANGED=$(echo "$CHANGED_FILES" | grep -E '^(package.json|pnpm-lock.yaml|turbo.json|pnpm-workspace.yaml|tsconfig.json)$' || true)

if [ -n "$ROOT_CHANGED" ]; then
  echo "✅ Root configuration files changed - testing all packages"
  echo "affected_packages=all" >> $GITHUB_OUTPUT
  echo "test_all=true" >> $GITHUB_OUTPUT
  exit 0
fi

# Check each package
for file in $CHANGED_FILES; do
  # Extract package name from path
  if [[ $file =~ ^packages/([^/]+)/ ]]; then
    PACKAGE="${BASH_REMATCH[1]}"
    if [[ ! " ${AFFECTED_PACKAGES[@]} " =~ " ${PACKAGE} " ]]; then
      AFFECTED_PACKAGES+=("$PACKAGE")
    fi
  fi

  # Extract app name from path
  if [[ $file =~ ^apps/([^/]+)/ ]]; then
    APP="${BASH_REMATCH[1]}"
    if [[ ! " ${AFFECTED_APPS[@]} " =~ " ${APP} " ]]; then
      AFFECTED_APPS+=("$APP")
    fi
  fi
done

# Check if shared config/tool files changed
SHARED_CHANGED=$(echo "$CHANGED_FILES" | grep -E '^(\.github/|\.eslintrc|\.prettierrc|scripts/)' || true)

if [ -n "$SHARED_CHANGED" ]; then
  echo "⚠️ Shared configuration changed - testing all packages"
  echo "affected_packages=all" >> $GITHUB_OUTPUT
  echo "test_all=true" >> $GITHUB_OUTPUT
  exit 0
fi

# Build Turbo filter expression
TURBO_FILTER=""

if [ ${#AFFECTED_PACKAGES[@]} -gt 0 ]; then
  echo "Affected packages: ${AFFECTED_PACKAGES[*]}"
  for pkg in "${AFFECTED_PACKAGES[@]}"; do
    TURBO_FILTER="$TURBO_FILTER --filter=@clarity-chat/$pkg..."
  done
fi

if [ ${#AFFECTED_APPS[@]} -gt 0 ]; then
  echo "Affected apps: ${AFFECTED_APPS[*]}"
  for app in "${AFFECTED_APPS[@]}"; do
    TURBO_FILTER="$TURBO_FILTER --filter=@clarity-chat/$app..."
  done
fi

if [ -z "$TURBO_FILTER" ]; then
  echo "⚠️ No affected packages detected, but files changed"
  echo "Running full test suite to be safe"
  echo "affected_packages=all" >> $GITHUB_OUTPUT
  echo "test_all=true" >> $GITHUB_OUTPUT
else
  echo "✅ Turbo filter: $TURBO_FILTER"
  echo "affected_packages=${AFFECTED_PACKAGES[*]}" >> $GITHUB_OUTPUT
  echo "affected_apps=${AFFECTED_APPS[*]}" >> $GITHUB_OUTPUT
  echo "turbo_filter=$TURBO_FILTER" >> $GITHUB_OUTPUT
  echo "test_all=false" >> $GITHUB_OUTPUT
fi

# Output summary
TOTAL_AFFECTED=$((${#AFFECTED_PACKAGES[@]} + ${#AFFECTED_APPS[@]}))
echo ""
echo "📊 Summary:"
echo "  Packages affected: ${#AFFECTED_PACKAGES[@]}"
echo "  Apps affected: ${#AFFECTED_APPS[@]}"
echo "  Total affected: $TOTAL_AFFECTED"

if [ $TOTAL_AFFECTED -eq 0 ]; then
  echo "  ⚡ Potential CI time savings: ~80% (documentation-only changes)"
elif [ $TOTAL_AFFECTED -le 3 ]; then
  echo "  ⚡ Potential CI time savings: ~50% (few packages affected)"
elif [ $TOTAL_AFFECTED -le 6 ]; then
  echo "  ⚡ Potential CI time savings: ~30% (moderate changes)"
else
  echo "  ⚡ Potential CI time savings: ~10% (many packages affected)"
fi
