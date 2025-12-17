#!/bin/bash

# Final Comprehensive Console Statement Replacement
# This script handles the remaining 199 files with a robust approach

set -e

echo "🧹 Starting final comprehensive console statement replacement..."

# Create a comprehensive replacement function
replace_comprehensive() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        return 1
    fi
    
    # Check if file has any console statements
    if ! grep -q "console\." "$file"; then
        return 0
    fi
    
    echo "Final processing: $file"
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Read the entire file
    content=$(cat "$file")
    
    # Check if import exists, if not add it
    if ! echo "$content" | grep -q "import.*SecureLogger"; then
        # Find the best place to add the import
        if echo "$content" | grep -q "^import"; then
            # Add after the last import
            content=$(echo "$content" | awk '
            /^import/ {last_import=NR}
            NR==last_import+1 && !/^import/ && !/^\/\*/ && !/^\/\// {
                print
                print "import { SecureLogger } from '\''@/lib/security/secureLogger'\'';"
                next
            }
            {print}
            ')
        elif echo "$content" | grep -q "^\\/\\*"; then
            # Add after the first comment block
            content=$(echo "$content" | awk '
            /^\/\*/ {in_comment=1}
            in_comment && /\*\// {in_comment=0; print; next}
            !in_comment && NR==1 && !/^import/ {
                print
                print "import { SecureLogger } from '\''@/lib/security/secureLogger'\'';"
                next
            }
            {print}
            ')
        else
            # Add at the very beginning
            content="import { SecureLogger } from '@/lib/security/secureLogger';\n$content"
        fi
    fi
    
    # Replace console statements with more precise patterns
    content=$(echo "$content" | sed \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        -e 's/console\.debug(/SecureLogger.debug(/g' \
        -e 's/console\.trace(/SecureLogger.debug(/g' \
        -e 's/console\.table(/SecureLogger.debug(/g')
    
    # Write back to file
    echo "$content" > "$file"
    
    # Verify the replacement worked
    if grep -q "console\." "$file"; then
        echo "⚠️  Still has console statements: $file"
        # Restore backup
        mv "${file}.backup" "$file"
        return 1
    else
        # Remove backup on success
        rm -f "${file}.backup"
        return 0
    fi
}

# Process remaining files in batches of 25
batch_size=25
processed=0
remaining_files=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null)
total_remaining=$(echo "$remaining_files" | wc -l)

echo "Processing $total_remaining remaining files in batches of $batch_size..."

echo "$remaining_files" | while IFS= read -r file; do
    if [ -n "$file" ]; then
        replace_comprehensive "$file"
        ((processed++))
        
        if [ $((processed % batch_size)) -eq 0 ]; then
            echo "Processed $processed files..."
        fi
    fi
done

echo "✅ Final comprehensive replacement completed!"
echo "Verifying results..."

# Final verification
final_remaining=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "Remaining files with console statements: $final_remaining"

if [ "$final_remaining" -eq 0 ]; then
    echo "🎉 SUCCESS: All console statements have been replaced with secure logging!"
elif [ "$final_remaining" -lt 10 ]; then
    echo "🎉 Nearly complete! Only $final_remaining files remain."
    echo "Remaining files:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null
else
    echo "⚠️  $final_remaining files still contain console statements."
    echo "Sample remaining files:"
    find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | head -10
fi

# Clean up any remaining backup files
find . -name "*.backup" -delete 2>/dev/null || true