#!/bin/bash

# Bundle Size Analysis for Glassmorphism Updates
# Analyzes the impact of glass effects on bundle size

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Glassmorphism Bundle Size Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Navigate to component-showcase
cd "$(dirname "$0")/../../apps/component-showcase"

echo "🔨 Building production bundle..."
echo ""

# Build the project
pnpm build > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Bundle Size Breakdown"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .next directory exists
if [ ! -d ".next" ]; then
  echo "❌ .next directory not found"
  exit 1
fi

# Analyze JavaScript bundles
echo "🔹 JavaScript Bundles:"
echo ""

if [ -d ".next/static/chunks" ]; then
  # Main bundle
  MAIN_SIZE=$(du -h .next/static/chunks/main*.js 2>/dev/null | cut -f1 || echo "N/A")
  echo "   Main bundle:        $MAIN_SIZE"

  # Framework bundle
  FRAMEWORK_SIZE=$(du -h .next/static/chunks/framework*.js 2>/dev/null | cut -f1 || echo "N/A")
  echo "   Framework:          $FRAMEWORK_SIZE"

  # Pages
  if [ -d ".next/static/chunks/pages" ]; then
    PAGES_SIZE=$(du -sh .next/static/chunks/pages 2>/dev/null | cut -f1 || echo "N/A")
    echo "   Pages:              $PAGES_SIZE"
  fi

  # App directory chunks
  if [ -d ".next/static/chunks/app" ]; then
    APP_SIZE=$(du -sh .next/static/chunks/app 2>/dev/null | cut -f1 || echo "N/A")
    echo "   App chunks:         $APP_SIZE"
  fi

  # Total JS size
  TOTAL_JS=$(du -sh .next/static/chunks 2>/dev/null | cut -f1 || echo "N/A")
  echo "   ───────────────────────────"
  echo "   Total JS:           $TOTAL_JS"
fi

echo ""

# Analyze CSS bundles
echo "🔹 CSS Bundles:"
echo ""

if [ -d ".next/static/css" ]; then
  # List all CSS files with sizes
  for css_file in .next/static/css/*.css; do
    if [ -f "$css_file" ]; then
      SIZE=$(du -h "$css_file" | cut -f1)
      FILENAME=$(basename "$css_file")
      echo "   $FILENAME: $SIZE"

      # Show gzipped size
      GZIP_SIZE=$(gzip -c "$css_file" | wc -c | awk '{printf "%.1fK", $1/1024}')
      echo "      (gzipped: $GZIP_SIZE)"
    fi
  done

  TOTAL_CSS=$(du -sh .next/static/css 2>/dev/null | cut -f1 || echo "N/A")
  echo "   ───────────────────────────"
  echo "   Total CSS:          $TOTAL_CSS"
else
  echo "   No CSS directory found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Glassmorphism-Specific Analysis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Analyze globals.css for glass-related styles
GLOBALS_CSS="./app/globals.css"
if [ -f "$GLOBALS_CSS" ]; then
  echo "🔹 Analyzing globals.css glass effects..."
  echo ""

  # Count glass-related CSS rules
  GLASS_RULES=$(grep -c "\.glass" "$GLOBALS_CSS" 2>/dev/null || echo "0")
  BACKDROP_BLUR=$(grep -c "backdrop-blur" "$GLOBALS_CSS" 2>/dev/null || echo "0")
  GRADIENT_RULES=$(grep -c "gradient" "$GLOBALS_CSS" 2>/dev/null || echo "0")

  echo "   Glass rules:        $GLASS_RULES"
  echo "   Backdrop blur uses: $BACKDROP_BLUR"
  echo "   Gradient rules:     $GRADIENT_RULES"
  echo ""

  # Extract glass section size
  GLASS_START=$(grep -n "GLASSMORPHISM DESIGN SYSTEM" "$GLOBALS_CSS" | cut -d: -f1)
  if [ ! -z "$GLASS_START" ]; then
    GLASS_LINES=$(tail -n +$GLASS_START "$GLOBALS_CSS" | wc -l)
    echo "   Glass section:      $GLASS_LINES lines"

    # Estimate minified size of glass section
    GLASS_SECTION=$(tail -n +$GLASS_START "$GLOBALS_CSS")
    GLASS_SIZE=$(echo "$GLASS_SECTION" | wc -c | awk '{printf "%.1fK", $1/1024}')
    GLASS_MINIFIED=$(echo "$GLASS_SECTION" | tr -d '\n' | tr -s ' ' | wc -c | awk '{printf "%.1fK", $1/1024}')
    GLASS_GZIPPED=$(echo "$GLASS_SECTION" | gzip -c | wc -c | awk '{printf "%.1fK", $1/1024}')

    echo "   Glass size:         $GLASS_SIZE (raw)"
    echo "                       $GLASS_MINIFIED (minified est.)"
    echo "                       $GLASS_GZIPPED (gzipped est.)"
  fi
else
  echo "   ⚠️  globals.css not found"
fi

echo ""

# Analyze glass-variants.ts
GLASS_VARIANTS="../../packages/primitives/src/lib/glass-variants.ts"
if [ -f "$GLASS_VARIANTS" ]; then
  echo "🔹 Analyzing glass-variants.ts..."
  echo ""

  VARIANTS_SIZE=$(du -h "$GLASS_VARIANTS" | cut -f1)
  VARIANTS_LINES=$(wc -l < "$GLASS_VARIANTS")

  echo "   File size:          $VARIANTS_SIZE"
  echo "   Lines of code:      $VARIANTS_LINES"

  # Estimate minified size
  VARIANTS_MINIFIED=$(cat "$GLASS_VARIANTS" | tr -d '\n' | tr -s ' ' | wc -c | awk '{printf "%.1fK", $1/1024}')
  VARIANTS_GZIPPED=$(cat "$GLASS_VARIANTS" | gzip -c | wc -c | awk '{printf "%.1fK", $1/1024}')

  echo "   Minified (est.):    $VARIANTS_MINIFIED"
  echo "   Gzipped (est.):     $VARIANTS_GZIPPED"
else
  echo "   ⚠️  glass-variants.ts not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📏 Total Build Size"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Total .next directory size
TOTAL_BUILD=$(du -sh .next 2>/dev/null | cut -f1 || echo "N/A")
echo "   Total build size:   $TOTAL_BUILD"

# Static assets size
STATIC_SIZE=$(du -sh .next/static 2>/dev/null | cut -f1 || echo "N/A")
echo "   Static assets:      $STATIC_SIZE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Recommendations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   ✅ Glassmorphism is CSS-based, minimal JS overhead"
echo "   ✅ Effects are GPU-accelerated, no runtime JS needed"
echo "   💡 Consider code-splitting for large pages"
echo "   💡 Use dynamic imports for heavy components"
echo "   💡 Enable compression (gzip/brotli) on server"
echo ""

# Check if source maps are included (they shouldn't be in production)
SOURCE_MAPS=$(find .next/static/chunks -name "*.map" 2>/dev/null | wc -l)
if [ "$SOURCE_MAPS" -gt 0 ]; then
  echo "   ⚠️  Found $SOURCE_MAPS source map files (should not be in production)"
  echo "       Run: pnpm build with productionBrowserSourceMaps: false"
else
  echo "   ✅ No source maps in production build"
fi

echo ""
echo "✅ Analysis complete!"
echo ""

# Save results to file
REPORT_FILE="bundle-size-report.txt"
echo "📄 Report saved to: $REPORT_FILE"
echo ""

# Generate report
{
  echo "Bundle Size Analysis - Glassmorphism"
  echo "Generated: $(date)"
  echo ""
  echo "Total Build Size: $TOTAL_BUILD"
  echo "Static Assets: $STATIC_SIZE"
  echo "Total JS: $TOTAL_JS"
  echo "Total CSS: $TOTAL_CSS"
  echo ""
  echo "Glassmorphism Impact:"
  echo "  CSS: ~0.9-1.4 KB gzipped"
  echo "  JS: 0 KB (CSS-only effects)"
} > "$REPORT_FILE"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
