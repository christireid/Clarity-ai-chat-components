#!/bin/bash

echo "🔍 Verifying Input Components Integration..."
echo ""

# Check if files exist
echo "📁 Checking files..."
files=(
  "src/components/InputComponentsShowcase.tsx"
  "src/styles/input-showcase.css"
  "INPUT_COMPONENTS_SUMMARY.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

echo ""
echo "🔗 Checking imports..."

# Check App.tsx import
if grep -q "InputComponentsShowcase" src/App.tsx; then
  echo "✅ InputComponentsShowcase imported in App.tsx"
else
  echo "❌ InputComponentsShowcase not imported in App.tsx"
fi

# Check main.tsx CSS import
if grep -q "input-showcase.css" src/main.tsx; then
  echo "✅ input-showcase.css imported in main.tsx"
else
  echo "❌ input-showcase.css not imported in main.tsx"
fi

echo ""
echo "📝 Checking View type..."

# Check View type includes input-components
if grep -q "'input-components'" src/App.tsx; then
  echo "✅ 'input-components' in View type"
else
  echo "❌ 'input-components' not in View type"
fi

echo ""
echo "🎨 Checking renderView function..."

# Check renderView case
if grep -q "case 'input-components':" src/App.tsx; then
  echo "✅ 'input-components' case in renderView"
else
  echo "❌ 'input-components' case missing in renderView"
fi

echo ""
echo "🔘 Checking navigation button..."

# Check navigation button
if grep -A2 "input-components.*active" src/App.tsx | grep -q "Input Components"; then
  echo "✅ Navigation button exists"
else
  echo "❌ Navigation button missing"
fi

echo ""
echo "📊 File statistics..."
tsx_lines=$(wc -l < src/components/InputComponentsShowcase.tsx 2>/dev/null || echo "0")
css_lines=$(wc -l < src/styles/input-showcase.css 2>/dev/null || echo "0")

echo "   InputComponentsShowcase.tsx: $tsx_lines lines"
echo "   input-showcase.css: $css_lines lines"

echo ""
echo "✨ Verification complete!"
