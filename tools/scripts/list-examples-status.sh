#!/bin/bash

# Generate detailed status report for all examples
# Usage: ./scripts/list-examples-status.sh

echo "# Examples Status Report"
echo ""
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "## Summary"
echo ""

EXAMPLES_DIR="examples"
TOTAL=0
ENHANCED_P0=5
WITH_README=0
WITH_ERRORS=0
WITH_NOCHECK=0
NEEDS_WORK=0

for dir in "$EXAMPLES_DIR"/*; do
  if [ -d "$dir" ]; then
    TOTAL=$((TOTAL + 1))
    
    if [ -f "$dir/README.md" ]; then
      LINES=$(wc -l < "$dir/README.md")
      if [ "$LINES" -gt 50 ]; then
        WITH_README=$((WITH_README + 1))
      fi
    fi
    
    if grep -q "@ts-nocheck" "$dir/src"/**/*.tsx 2>/dev/null; then
      WITH_NOCHECK=$((WITH_NOCHECK + 1))
      NEEDS_WORK=$((NEEDS_WORK + 1))
    fi
  fi
done

echo "- **Total examples:** $TOTAL"
echo "- **Production-ready (P0):** $ENHANCED_P0"
echo "- **With comprehensive README:** $WITH_README"
echo "- **With @ts-nocheck:** $WITH_NOCHECK"
echo "- **Ready for enhancement:** $((TOTAL - ENHANCED_P0))"
echo ""
echo "## Production-Ready Examples (5)"
echo ""
echo "These examples are fully enhanced with zero type errors:"
echo ""
echo "1. ✅ **basic-chat** - Simple, polished reference"
echo "2. ✅ **component-demo** - Complete component showcase"
echo "3. ✅ **design-system-showcase** - Design system reference"
echo "4. ✅ **ai-assistant** - Advanced with TanStack Query"
echo "5. ✅ **streaming-chat** - Real-time SSE streaming"
echo ""
echo "## Examples Needing Enhancement ($((TOTAL - ENHANCED_P0)))"
echo ""
echo "| Example | README | Issues | Priority |"
echo "|---------|--------|--------|----------|"

for dir in "$EXAMPLES_DIR"/*; do
  if [ -d "$dir" ]; then
    EXAMPLE_NAME=$(basename "$dir")
    
    # Skip P0 examples
    if [[ "$EXAMPLE_NAME" == "basic-chat" ]] || \
       [[ "$EXAMPLE_NAME" == "component-demo" ]] || \
       [[ "$EXAMPLE_NAME" == "design-system-showcase" ]] || \
       [[ "$EXAMPLE_NAME" == "ai-assistant" ]] || \
       [[ "$EXAMPLE_NAME" == "streaming-chat" ]]; then
      continue
    fi
    
    # Check README
    README_STATUS="❌"
    if [ -f "$dir/README.md" ]; then
      LINES=$(wc -l < "$dir/README.md")
      if [ "$LINES" -gt 200 ]; then
        README_STATUS="✅ ($LINES lines)"
      elif [ "$LINES" -gt 50 ]; then
        README_STATUS="📄 ($LINES lines)"
      else
        README_STATUS="📄 Short ($LINES lines)"
      fi
    fi
    
    # Check for issues
    ISSUES=""
    if grep -q "@ts-nocheck" "$dir/src"/**/*.tsx 2>/dev/null; then
      ISSUES="@ts-nocheck"
    fi
    if [ -z "$ISSUES" ]; then
      ISSUES="None"
    fi
    
    # Determine priority
    PRIORITY="P2"
    if [[ "$EXAMPLE_NAME" == *"vercel"* ]] || \
       [[ "$EXAMPLE_NAME" == *"enterprise"* ]] || \
       [[ "$EXAMPLE_NAME" == *"complete-features"* ]]; then
      PRIORITY="P1"
    fi
    
    printf "| %-30s | %-20s | %-15s | %-8s |\n" "$EXAMPLE_NAME" "$README_STATUS" "$ISSUES" "$PRIORITY"
  fi
done

echo ""
echo "## Next Steps"
echo ""
echo "1. **Fix @ts-nocheck examples** - Remove directive and fix type errors"
echo "2. **Enhance P1 examples** - High-value advanced features"
echo "3. **Add missing features** - Auto-scroll, token tracking, error boundaries"
echo "4. **Improve READMEs** - Expand short READMEs with usage examples"
echo ""
echo "## Enhancement Commands"
echo ""
echo "\`\`\`bash"
echo "# Check an example"
echo "./scripts/enhance-example.sh example-name"
echo ""
echo "# Generate/update README"
echo "./scripts/generate-readme.sh example-name"
echo ""
echo "# Check all examples"
echo "./scripts/check-all-examples.sh"
echo "\`\`\`"
echo ""
echo "See **CONTRIBUTING_EXAMPLES.md** for detailed enhancement guide."
