#!/bin/bash

# Check all examples for common issues
# Usage: ./scripts/check-all-examples.sh

echo "🔍 Checking all examples..."
echo "=================================="

EXAMPLES_DIR="examples"
TOTAL=0
WITH_README=0
WITH_ERRORS=0
WITH_NOCHECK=0

for dir in "$EXAMPLES_DIR"/*; do
  if [ -d "$dir" ]; then
    EXAMPLE_NAME=$(basename "$dir")
    TOTAL=$((TOTAL + 1))
    
    # Check for README
    HAS_README=" "
    if [ -f "$dir/README.md" ]; then
      LINES=$(wc -l < "$dir/README.md")
      if [ "$LINES" -gt 50 ]; then
        WITH_README=$((WITH_README + 1))
        HAS_README="✅"
      else
        HAS_README="📄"
      fi
    else
      HAS_README="❌"
    fi
    
    # Check for type errors (quick check)
    HAS_ERRORS=" "
    if [ -f "$dir/src/App.tsx" ] || [ -f "$dir/src/app/page.tsx" ]; then
      if grep -q "@ts-nocheck" "$dir/src"/**/*.tsx 2>/dev/null; then
        WITH_NOCHECK=$((WITH_NOCHECK + 1))
        HAS_ERRORS="⚠️ "
      fi
    fi
    
    printf "%-40s %s %s\n" "$EXAMPLE_NAME" "$HAS_README" "$HAS_ERRORS"
  fi
done

echo ""
echo "=================================="
echo "📊 Summary"
echo "=================================="
echo "Total examples: $TOTAL"
echo "With comprehensive README (>50 lines): $WITH_README"
echo "With @ts-nocheck: $WITH_NOCHECK"
echo "Without README: $((TOTAL - WITH_README))"
echo ""
echo "Legend:"
echo "  ✅ = Has comprehensive README (>50 lines)"
echo "  📄 = Has README but short (<50 lines)"
echo "  ❌ = No README"
echo "  ⚠️  = Has @ts-nocheck or type issues"
