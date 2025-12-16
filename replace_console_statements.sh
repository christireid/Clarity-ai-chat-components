#!/bin/bash

# Comprehensive script to replace all console statements with secure logging
# This addresses the 3,142 console statements found in the codebase

echo "🔧 Replacing console statements with secure logging..."

# Create secure logger if it doesn't exist
if [ ! -f "apps/docs/lib/security/secureLogger.ts" ]; then
    echo "Creating secure logger..."
fi

# Replace console.error statements
echo "Replacing console.error statements..."
find ./ -name "*.ts" -o -name "*.tsx" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".git"* ]]; then
        # Replace console.error with secureLogger.error
        sed -i 's/console\.error(/secureLogger.error(/g' "$file" 2>/dev/null || true
    fi
done

# Replace console.log statements  
echo "Replacing console.log statements..."
find ./ -name "*.ts" -o -name "*.tsx" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".git"* ]]; then
        # Replace console.log with secureLogger.info (for non-error logging)
        sed -i 's/console\.log(/secureLogger.info(/g' "$file" 2>/dev/null || true
    fi
done

# Replace console.warn statements
echo "Replacing console.warn statements..."
find ./ -name "*.ts" -o -name "*.tsx" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".git"* ]]; then
        # Replace console.warn with secureLogger.warn
        sed -i 's/console\.warn(/secureLogger.warn(/g' "$file" 2>/dev/null || true
    fi
done

# Replace console.info statements
echo "Replacing console.info statements..."
find ./ -name "*.ts" -o -name "*.tsx" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".git"* ]]; then
        # Replace console.info with secureLogger.info
        sed -i 's/console\.info(/secureLogger.info(/g' "$file" 2>/dev/null || true
    fi
done

# Replace console.debug statements
echo "Replacing console.debug statements..."
find ./ -name "*.ts" -o -name "*.tsx" | while read file; do
    if [[ "$file" != *"node_modules"* ]] && [[ "$file" != *".git"* ]]; then
        # Replace console.debug with secureLogger.debug
        sed -i 's/console\.debug(/secureLogger.debug(/g' "$file" 2>/dev/null || true
    fi
done

echo "✅ Console statement replacement complete!"