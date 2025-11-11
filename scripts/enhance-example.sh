#!/bin/bash

# Enhancement automation script for Clarity Chat examples
# Usage: ./scripts/enhance-example.sh <example-name>

set -e

EXAMPLE_NAME=$1
EXAMPLE_DIR="examples/$EXAMPLE_NAME"

if [ -z "$EXAMPLE_NAME" ]; then
  echo "Usage: ./scripts/enhance-example.sh <example-name>"
  echo "Example: ./scripts/enhance-example.sh basic-chat"
  exit 1
fi

if [ ! -d "$EXAMPLE_DIR" ]; then
  echo "Error: Example directory not found: $EXAMPLE_DIR"
  exit 1
fi

echo "🚀 Enhancing example: $EXAMPLE_NAME"
echo "=================================="

# Step 1: Check for type errors
echo ""
echo "📋 Step 1: Checking for type errors..."
cd "$EXAMPLE_DIR"
if npx tsc --noEmit 2>&1 | tee /tmp/tsc-errors.txt | grep -q "error TS"; then
  echo "⚠️  Type errors found. Review /tmp/tsc-errors.txt"
  ERROR_COUNT=$(grep -c "error TS" /tmp/tsc-errors.txt || echo "0")
  echo "   Found $ERROR_COUNT type errors"
else
  echo "✅ No type errors found!"
fi
cd - > /dev/null

# Step 2: Check for common issues
echo ""
echo "📋 Step 2: Checking for common issues..."

# Check for @ts-nocheck
if grep -q "@ts-nocheck" "$EXAMPLE_DIR/src"/**/*.tsx 2>/dev/null; then
  echo "⚠️  Found @ts-nocheck directives - should be removed"
fi

# Check for timestamp instead of createdAt
if grep -q "timestamp:" "$EXAMPLE_DIR/src"/**/*.tsx 2>/dev/null; then
  echo "⚠️  Found 'timestamp' - should use 'createdAt' and 'updatedAt'"
fi

# Check for old Message structure
if grep -q "role: 'assistant' as const" "$EXAMPLE_DIR/src"/**/*.tsx 2>/dev/null; then
  if ! grep -q "chatId:" "$EXAMPLE_DIR/src"/**/*.tsx 2>/dev/null; then
    echo "⚠️  Message objects missing 'chatId' field"
  fi
  if ! grep -q "status:" "$EXAMPLE_DIR/src"/**/*.tsx 2>/dev/null; then
    echo "⚠️  Message objects missing 'status' field"
  fi
fi

# Step 3: Check for README
echo ""
echo "📋 Step 3: Checking documentation..."
if [ ! -f "$EXAMPLE_DIR/README.md" ]; then
  echo "⚠️  No README.md found - will generate template"
  echo "   Run: ./scripts/generate-readme.sh $EXAMPLE_NAME"
else
  LINES=$(wc -l < "$EXAMPLE_DIR/README.md")
  if [ "$LINES" -lt 50 ]; then
    echo "⚠️  README.md is short ($LINES lines) - consider expanding"
  else
    echo "✅ README.md exists ($LINES lines)"
  fi
fi

# Step 4: Check for package.json
echo ""
echo "📋 Step 4: Checking package configuration..."
if [ ! -f "$EXAMPLE_DIR/package.json" ]; then
  echo "❌ No package.json found"
else
  echo "✅ package.json exists"
  
  # Check for workspace dependencies
  if grep -q '"workspace:\*"' "$EXAMPLE_DIR/package.json"; then
    echo "⚠️  Found workspace:* dependencies - should use '*' for npm compatibility"
  fi
fi

# Step 5: Summary
echo ""
echo "=================================="
echo "📊 Enhancement Summary"
echo "=================================="
echo "Example: $EXAMPLE_NAME"
echo "Directory: $EXAMPLE_DIR"
echo ""
echo "Next steps:"
echo "1. Fix any type errors shown above"
echo "2. Run: ./scripts/generate-readme.sh $EXAMPLE_NAME"
echo "3. Test: cd $EXAMPLE_DIR && npm run dev"
echo "4. Verify: cd $EXAMPLE_DIR && npx tsc --noEmit"
echo ""
echo "See CONTRIBUTING_EXAMPLES.md for detailed enhancement guide"
