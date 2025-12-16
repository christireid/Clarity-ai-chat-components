#!/bin/bash

# Targeted Console Statement Replacement for Remaining Files
# This script handles the remaining 722 files with console statements

set -e

echo "🎯 Starting targeted console statement replacement for remaining files..."

# First, let's create a backup of the secure logger
cp /home/user/webapp/lib/security/secureLogger.ts /home/user/webapp/lib/security/secureLogger.ts.backup 2>/dev/null || true

# Function to replace console statements in a single file
replace_file() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        echo "File not found: $file"
        return 1
    fi
    
    echo "Processing: $file"
    
    # Check if we need to add the import
    if ! grep -q "import.*SecureLogger" "$file"; then
        # Find the first import statement or the beginning of the file
        if grep -q "^import" "$file"; then
            # Add after the last import
            awk '
            /^import/ {last_import=NR}
            NR==last_import+1 && !/^import/ && !/^\/\*/ && !/^\/\// {
                print
                print "import { SecureLogger } from '\''@/lib/security/secureLogger'\'';"
                next
            }
            {print}
            ' "$file" > "${file}.tmp"
            mv "${file}.tmp" "$file"
        else
            # Add at the very beginning
            echo "import { SecureLogger } from '@/lib/security/secureLogger';" > "${file}.tmp"
            cat "$file" >> "${file}.tmp"
            mv "${file}.tmp" "$file"
        fi
    fi
    
    # Replace console statements with sed
    sed -i \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        -e 's/console\.debug(/SecureLogger.debug(/g' \
        "$file"
    
    return 0
}

# Process API routes first (highest priority)
echo "Processing API routes..."
find apps/docs/app/api -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "console\." "$file"; then
        replace_file "$file"
    fi
done

# Process critical application files
echo "Processing critical app files..."
find apps/docs/app -name "*.ts" -o -name "*.tsx" | grep -E "(layout|page|error|loading)" | while read -r file; do
    if grep -q "console\." "$file"; then
        replace_file "$file"
    fi
done

# Process component files
echo "Processing component files..."
find apps/docs/components -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "console\." "$file"; then
        replace_file "$file"
    fi
done

# Process library files
echo "Processing library files..."
find apps/docs/lib -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "console\." "$file"; then
        replace_file "$file"
    fi
done

# Process utility files
echo "Processing utility files..."
find packages -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "console\." "$file"; then
        replace_file "$file"
    fi
done

echo "Processing examples..."
find examples -name "*.ts" -o -name "*.tsx" | while read -r file; do
    if grep -q "console\." "$file"; then
        replace_file "$file"
    fi
done

echo "✅ Targeted replacement completed!"
echo "Verifying remaining console statements..."

# Count remaining
remaining=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "Remaining files with console statements: $remaining"

if [ "$remaining" -lt 100 ]; then
    echo "🎉 Significant progress! Less than 100 files remaining."
    echo "Remaining files:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | head -20
else
    echo "Continuing with remaining files..."
fi