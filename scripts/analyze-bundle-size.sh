#!/bin/bash
set -e

echo "=== BUNDLE SIZE ANALYSIS ==="
echo ""

# Build packages
echo "Building packages..."
pnpm -C packages/react build 2>&1 | grep -E "(Built|Error)" || true
pnpm -C packages/token-optimization build 2>&1 | grep -E "(Built|Error)" || true

# Analyze React package
echo ""
echo "=== REACT PACKAGE ==="
echo "Total dist size:"
du -sh packages/react/dist

echo ""
echo "Entry points (top 10 largest):"
find packages/react/dist -name "*.js" -o -name "*.mjs" | head -10 | xargs ls -lh | awk '{printf "%-50s %10s\n", $9, $5}'

echo ""
echo "Gzipped main bundle:"
if [ -f packages/react/dist/index.js ]; then
  gzip -k -f packages/react/dist/index.js
  ls -lh packages/react/dist/index.js.gz | awk '{print $5}'
else
  echo "index.js not found"
fi

# Analyze Token-Optimization package
echo ""
echo "=== TOKEN-OPTIMIZATION PACKAGE ==="
echo "Total dist size:"
du -sh packages/token-optimization/dist

echo ""
echo "Entry points:"
find packages/token-optimization/dist -name "*.js" -o -name "*.mjs" | head -10 | xargs ls -lh | awk '{printf "%-50s %10s\n", $9, $5}'

echo ""
echo "Gzipped main bundle:"
if [ -f packages/token-optimization/dist/index.js ]; then
  gzip -k -f packages/token-optimization/dist/index.js
  ls -lh packages/token-optimization/dist/index.js.gz | awk '{print $5}'
else
  echo "index.js not found"
fi

# Summary
echo ""
echo "=== SUMMARY ==="
echo "React dist: $(du -sh packages/react/dist | awk '{print $1}')"
echo "Token-opt dist: $(du -sh packages/token-optimization/dist | awk '{print $1}')"

# Calculate total
react_size=$(du -s packages/react/dist | awk '{print $1}')
token_size=$(du -s packages/token-optimization/dist | awk '{print $1}')
total_size=$((react_size + token_size))
total_mb=$(echo "scale=2; $total_size / 1024" | bc)

echo "Total: ${total_mb} MB"

# Targets
echo ""
echo "=== TARGETS ==="
echo "React: ≤ 800 KB (current: $(du -sh packages/react/dist | awk '{print $1}'))"
echo "Token-opt: ≤ 2.5 MB (current: $(du -sh packages/token-optimization/dist | awk '{print $1}'))"
echo "Total: ≤ 3.3 MB (current: ${total_mb} MB)"
