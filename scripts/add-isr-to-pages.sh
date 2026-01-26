#!/bin/bash

# Script to add ISR configuration to static documentation pages
# Wave 3.3 Agent 35 - ISR Cache Optimizer

DOCS_DIR="/Users/christireid/Dev/Clarity-ai-chat-components/apps/streamlined-docs/app"

echo "Adding ISR configuration to static documentation pages..."

# Function to add ISR config after metadata export
add_isr_config() {
  local file=$1
  local revalidate_time=$2
  local comment=$3

  # Check if already has revalidate export
  if grep -q "export const revalidate" "$file"; then
    echo "⏭️  Skipping $file - already has ISR config"
    return
  fi

  # Check if file has metadata export
  if grep -q "export const metadata" "$file"; then
    # Add after metadata export
    sed -i '' "/export const metadata = {/,/^}/a\\
\\
// ISR Configuration: $comment\\
export const revalidate = $revalidate_time
" "$file"
    echo "✅ Added ISR config to $file (${revalidate_time}s)"
  elif grep -q "export default function" "$file"; then
    # Add before default export
    sed -i '' "/export default function/i\\
// ISR Configuration: $comment\\
export const revalidate = $revalidate_time\\

" "$file"
    echo "✅ Added ISR config to $file (${revalidate_time}s)"
  else
    echo "⚠️  Skipping $file - no metadata or default export found"
  fi
}

# API Reference pages - 1 hour revalidation
echo ""
echo "📚 API Reference pages (1 hour)..."
for file in "$DOCS_DIR"/api/reference/*/page.tsx; do
  if [ -f "$file" ]; then
    add_isr_config "$file" 3600 "API documentation changes with code updates"
  fi
done

# Get Started pages - 2 hours revalidation
echo ""
echo "🚀 Get Started pages (2 hours)..."
for file in "$DOCS_DIR"/get-started/*/page.tsx; do
  if [ -f "$file" ]; then
    add_isr_config "$file" 7200 "Tutorial content rarely changes"
  fi
done

# Explore pages - 3 hours revalidation
echo ""
echo "🎨 Explore pages (3 hours)..."
for file in "$DOCS_DIR"/explore/*/page.tsx; do
  if [ -f "$file" ]; then
    add_isr_config "$file" 10800 "Static showcase pages"
  fi
done

# About pages - 6 hours revalidation
echo ""
echo "ℹ️  About pages (6 hours)..."
for file in "$DOCS_DIR"/about/*/page.tsx; do
  if [ -f "$file" ]; then
    add_isr_config "$file" 21600 "Company info rarely changes"
  fi
done

# Top-level static pages - 3 hours
echo ""
echo "📄 Top-level static pages (3 hours)..."
for page in changelog contributing license why-clarity playground; do
  file="$DOCS_DIR/$page/page.tsx"
  if [ -f "$file" ]; then
    add_isr_config "$file" 10800 "Static content page"
  fi
done

echo ""
echo "✅ ISR configuration complete!"
echo ""
echo "Summary:"
echo "- API Reference: 1 hour (3600s)"
echo "- Get Started: 2 hours (7200s)"
echo "- Explore: 3 hours (10800s)"
echo "- About: 6 hours (21600s)"
echo "- Static pages: 3 hours (10800s)"
