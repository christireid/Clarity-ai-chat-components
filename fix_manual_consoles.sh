#!/bin/bash

# Simple Manual Console Replacement for Final Files
# Process the remaining files one by one with manual verification

echo "🔧 Manual console replacement for final files..."

# Create a simple replacement function
replace_in_file() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        echo "File not found: $file"
        return 1
    fi
    
    echo "Processing: $file"
    
    # First, add the import if not present
    if ! grep -q "import.*SecureLogger" "$file"; then
        # Find first line that's not a comment and add import after it
        awk '
        /^[^\/]/ && !found { 
            print
            print "import { SecureLogger } from '\''@/lib/security/secureLogger'\'';"
            found=1
            next
        }
        {print}
        ' "$file" > "${file}.tmp"
        mv "${file}.tmp" "$file"
    fi
    
    # Replace console statements
    sed -i \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        "$file"
    
    return 0
}

# Get list of remaining files
remaining_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null)

echo "Found $(echo "$remaining_files" | wc -l) files with console statements"

# Process first 25 files manually
echo "$remaining_files" | head -25 | while IFS= read -r file; do
    if [ -n "$file" ]; then
        replace_in_file "$file"
    fi
done

echo "✅ First batch completed!"
echo "Checking remaining count..."

remaining=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "Remaining files: $remaining"

if [ "$remaining" -gt 25 ]; then
    echo "Processing next batch..."
    echo "$remaining_files" | tail -n +26 | head -25 | while IFS= read -r file; do
        if [ -n "$file" ]; then
            replace_in_file "$file"
        fi
    done
fi

final_remaining=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "🎯 Final count: $final_remaining files remaining"