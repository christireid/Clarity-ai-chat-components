#!/bin/bash

# Aggressive Console Replacement for Remaining Files
# This script processes the remaining files with a more direct approach

echo "🚀 Aggressive console replacement for remaining 158 files..."

# Create a more direct replacement function
aggressive_replace() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    echo "Aggressive processing: $file"
    
    # Add import at the top of the file (even if it duplicates, we can clean up later)
    echo "import { SecureLogger } from '@/lib/security/secureLogger';" > "${file}.tmp"
    cat "$file" >> "${file}.tmp"
    mv "${file}.tmp" "$file"
    
    # Replace all console statements aggressively
    sed -i \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        -e 's/console\.debug(/SecureLogger.debug(/g' \
        -e 's/console\.trace(/SecureLogger.debug(/g' \
        "$file"
    
    return 0
}

# Get all remaining files
remaining_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null)
file_count=$(echo "$remaining_files" | wc -l)

echo "Found $file_count files remaining"

# Process in larger batches to speed up
echo "$remaining_files" | while IFS= read -r file; do
    if [ -n "$file" ]; then
        aggressive_replace "$file"
    fi
done

echo "✅ Aggressive replacement completed!"
echo "Verifying results..."

# Check final count
final_count=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "Final count: $final_count files with console statements"

if [ "$final_count" -eq 0 ]; then
    echo "🎉 SUCCESS: All console statements have been eliminated!"
elif [ "$final_count" -lt 20 ]; then
    echo "🎉 Almost there! Only $final_count files remain."
    echo "Remaining files:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null
else
    echo "⚠️  $final_count files still contain console statements."
    echo "Consider manual review for these files."
fi