#!/bin/bash

# Ultra-Comprehensive Final Replacement
# This script catches all variations of console statements

echo "🎯 Ultra-comprehensive final replacement..."

# Create a comprehensive replacement function
ultra_replace() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    echo "Ultra-processing: $file"
    
    # Add import
    echo "import { SecureLogger } from '@/lib/security/secureLogger';" > "${file}.tmp"
    cat "$file" >> "${file}.tmp"
    mv "${file}.tmp" "$file"
    
    # Comprehensive replacement patterns to catch all variations
    sed -i \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        -e 's/console\.debug(/SecureLogger.debug(/g' \
        -e 's/console\.trace(/SecureLogger.debug(/g' \
        -e 's/console\.table(/SecureLogger.debug(/g' \
        -e 's/console\.time(/SecureLogger.debug(/g' \
        -e 's/console\.timeEnd(/SecureLogger.debug(/g' \
        -e 's/console\.assert(/SecureLogger.debug(/g' \
        -e 's/console\.count(/SecureLogger.debug(/g' \
        -e 's/console\.dir(/SecureLogger.debug(/g' \
        -e 's/console\.group(/SecureLogger.debug(/g' \
        -e 's/console\.groupEnd(/SecureLogger.debug(/g' \
        -e 's/console\.groupCollapsed(/SecureLogger.debug(/g' \
        "$file"
    
    return 0
}

# Get all remaining files with console statements
remaining_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null)

echo "Found $(echo "$remaining_files" | wc -l) files with console statements"

# Process all remaining files
echo "$remaining_files" | while IFS= read -r file; do
    if [ -n "$file" ]; then
        ultra_replace "$file"
    fi
done

echo "✅ Ultra-comprehensive replacement completed!"

# Final verification
final_count=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "🎉 FINAL RESULT: $final_count files with console statements remaining"

if [ "$final_count" -eq 0 ]; then
    echo "🚀 MISSION ACCOMPLISHED: All console statements eliminated!"
elif [ "$final_count" -lt 10 ]; then
    echo "🎉 Almost perfect! Only $final_count files remain."
    echo "Remaining files:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null
else
    echo "⚠️  $final_count files still need manual review."
fi