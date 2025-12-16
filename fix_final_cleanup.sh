#!/bin/bash

# Final Cleanup Script for Remaining Console Statements
# This script eliminates the final 69 console statements

echo "🎯 Final cleanup for remaining console statements..."

# Process remaining files with a more targeted approach
final_cleanup() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    echo "Final cleanup: $file"
    
    # Add import at the very top
    (echo "import { SecureLogger } from '@/lib/security/secureLogger';" && cat "$file") > "${file}.tmp"
    mv "${file}.tmp" "$file"
    
    # Replace console statements
    sed -i \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        -e 's/console\.debug(/SecureLogger.debug(/g' \
        "$file"
    
    return 0
}

# Get remaining files
remaining_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null)
file_count=$(echo "$remaining_files" | wc -l)

echo "Processing final $file_count files..."

# Process all remaining files
echo "$remaining_files" | while IFS= read -r file; do
    if [ -n "$file" ]; then
        final_cleanup "$file"
    fi
done

echo "✅ Final cleanup completed!"

# Final verification
final_count=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "🎉 FINAL RESULT: $final_count files with console statements remaining"

if [ "$final_count" -eq 0 ]; then
    echo "🚀 SUCCESS: All console statements have been eliminated and replaced with secure logging!"
else
    echo "⚠️  $final_count files still have console statements. Manual review needed."
    echo "Files requiring manual review:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null
fi