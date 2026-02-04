#!/bin/bash

# Bundle size measurement script
# Tests the tokenizer split import to verify tree-shaking benefits

set -e

echo ""
echo "📦 Bundle Size Test: Tokenizer Split Import"
echo "============================================================"
echo ""

cd "$(dirname "$0")"

# Ensure we're in the right directory
if [ ! -f "test-without-tokenizers.ts" ]; then
  echo "❌ Error: Test files not found"
  exit 1
fi

# Check if esbuild is available
if ! command -v esbuild &> /dev/null; then
  echo "📥 Installing esbuild..."
  npm install -g esbuild
fi

echo "🔵 Building WITHOUT tokenizers (lightweight estimation)..."
esbuild test-without-tokenizers.ts \
  --bundle \
  --minify \
  --format=esm \
  --platform=browser \
  --target=es2020 \
  --external:react \
  --external:react-dom \
  --outfile=without-tokenizers.bundle.js \
  --analyze

SIZE_WITHOUT=$(stat -f%z "without-tokenizers.bundle.js" 2>/dev/null || stat -c%s "without-tokenizers.bundle.js" 2>/dev/null)
SIZE_WITHOUT_KB=$(echo "scale=2; $SIZE_WITHOUT / 1024" | bc)

echo ""
echo "🔵 Building WITH tokenizers (accurate counting)..."
esbuild test-with-tokenizers.ts \
  --bundle \
  --minify \
  --format=esm \
  --platform=browser \
  --target=es2020 \
  --external:react \
  --external:react-dom \
  --outfile=with-tokenizers.bundle.js \
  --analyze

SIZE_WITH=$(stat -f%z "with-tokenizers.bundle.js" 2>/dev/null || stat -c%s "with-tokenizers.bundle.js" 2>/dev/null)
SIZE_WITH_KB=$(echo "scale=2; $SIZE_WITH / 1024" | bc)

# Calculate savings
SAVINGS=$((SIZE_WITH - SIZE_WITHOUT))
SAVINGS_KB=$(echo "scale=2; $SAVINGS / 1024" | bc)
SAVINGS_PERCENT=$(echo "scale=1; ($SAVINGS * 100) / $SIZE_WITH" | bc)

echo ""
echo "============================================================"
echo ""
echo "📊 RESULTS:"
echo ""
echo "  ✅ Without tokenizers:  ${SIZE_WITHOUT_KB} KB"
echo "     Import: import { estimateTokens } from '@clarity-chat/token-optimization'"
echo ""
echo "  ✅ With tokenizers:     ${SIZE_WITH_KB} KB"
echo "     Import: import { accurateCount } from '@clarity-chat/token-optimization/tokenizers'"
echo ""
echo "============================================================"
echo ""
echo "💰 SAVINGS:"
echo ""
echo "  Size difference: ${SAVINGS_KB} KB"
echo "  Percentage:      ${SAVINGS_PERCENT}%"
echo ""
echo "  By using '@clarity-chat/token-optimization' for estimation"
echo "  instead of '/tokenizers' for accurate counting, you save"
echo "  ${SAVINGS_KB} KB (${SAVINGS_PERCENT}% reduction)."
echo ""
echo "============================================================"
echo ""
echo "📝 RECOMMENDATION:"
echo ""
echo "  Use lightweight estimation by default:"
echo "    import { estimateTokens } from '@clarity-chat/token-optimization'"
echo ""
echo "  Only import tokenizers when you need exact counts:"
echo "    import { accurateCount } from '@clarity-chat/token-optimization/tokenizers'"
echo ""
echo "============================================================"
echo ""
echo "✨ Test complete!"
echo ""
