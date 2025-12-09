#!/bin/bash
# Verify that documented exports actually exist in index.ts
# This script is run by CI to catch documentation drift

set -e

# Core exports that should be directly exported
DIRECT_EXPORTS=(
  "ClarityChat"
  "useClarityChat"
  "ChatWindow"
  "useSecureChat"
  "MemoryProvider"
)

# Exports that come from wildcard re-exports
WILDCARD_SOURCES=(
  "use-streamable-ui"
  "vector-stores"
  "theme"
)

INDEX_FILE="packages/react/src/index.ts"
FAILED=0

echo "🔍 Verifying documented exports exist in $INDEX_FILE..."
echo ""

echo "Checking direct exports..."
for exp in "${DIRECT_EXPORTS[@]}"; do
  if ! grep -qE "(export.*${exp}|^  ${exp},)" "$INDEX_FILE"; then
    echo "❌ Missing direct export: $exp"
    FAILED=1
  else
    echo "✅ Found: $exp"
  fi
done

echo ""
echo "Checking wildcard re-exports..."
for source in "${WILDCARD_SOURCES[@]}"; do
  if ! grep -q "export \* from '.*${source}'" "$INDEX_FILE"; then
    echo "❌ Missing wildcard export from: $source"
    FAILED=1
  else
    echo "✅ Found wildcard: $source"
  fi
done

echo ""

if [ $FAILED -eq 1 ]; then
  echo "❌ Some documented exports are missing!"
  exit 1
else
  echo "✅ All documented exports verified!"
  exit 0
fi
