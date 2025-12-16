#!/bin/bash

# Comprehensive Console Statement Replacement Script
# This script systematically replaces all console.log/error/warn statements with secure logging

set -e

echo "🚀 Starting comprehensive console statement replacement..."

# Create the secure logger import and replacement patterns
cat > /tmp/secure_logger_patterns.txt << 'EOF'
# Import pattern to add
import { SecureLogger } from '@/lib/security/secureLogger';

# Common replacement patterns
s/console\.error\((.*?)\)/SecureLogger.error(\1)/g
s/console\.warn\((.*?)\)/SecureLogger.warn(\1)/g  
s/console\.info\((.*?)\)/SecureLogger.info(\1)/g
s/console\.log\((.*?)\)/SecureLogger.debug(\1)/g
s/console\.debug\((.*?)\)/SecureLogger.debug(\1)/g
EOF

# Function to safely replace console statements in a file
replace_console_statements() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "Processing: $file"
    
    # Check if file already has the import
    if ! grep -q "import.*SecureLogger" "$file"; then
        # Add import at the top after existing imports or at the beginning
        if grep -q "^import" "$file"; then
            # Find the last import statement and add after it
            awk '
            /^import/ {last_import=NR}
            NR==last_import+1 && !/^import/ {
                print
                print "import { SecureLogger } from '\''@/lib/security/secureLogger'\'';"
                next
            }
            {print}
            ' "$file" > "$temp_file"
        else
            # No imports exist, add at the top
            echo "import { SecureLogger } from '@/lib/security/secureLogger';" > "$temp_file"
            cat "$file" >> "$temp_file"
        fi
        mv "$temp_file" "$file"
    fi
    
    # Replace console statements
    sed -i \
        -e 's/console\.error(/SecureLogger.error(/g' \
        -e 's/console\.warn(/SecureLogger.warn(/g' \
        -e 's/console\.info(/SecureLogger.info(/g' \
        -e 's/console\.log(/SecureLogger.debug(/g' \
        -e 's/console\.debug(/SecureLogger.debug(/g' \
        "$file"
}

# Export the function so it can be used by find -exec
export -f replace_console_statements

# Find all TypeScript files with console statements and process them
echo "Finding TypeScript files with console statements..."

# Change to the webapp directory
cd /home/user/webapp

# Process files in smaller batches to avoid memory issues
batch_size=50
batch_num=1

while IFS= read -r -d '' file; do
    # Create batch file list
    echo "$file" >> "/tmp/batch_${batch_num}.txt"
    
    # When batch is full, process it
    if [ $(wc -l < "/tmp/batch_${batch_num}.txt") -ge $batch_size ]; then
        echo "Processing batch $batch_num..."
        while IFS= read -r f; do
            replace_console_statements "$f"
        done < "/tmp/batch_${batch_num}.txt"
        
        # Clean up and prepare next batch
        rm "/tmp/batch_${batch_num}.txt"
        ((batch_num++))
    fi
done < <(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git)

# Process remaining files in last batch
if [ -f "/tmp/batch_${batch_num}.txt" ]; then
    echo "Processing final batch $batch_num..."
    while IFS= read -r f; do
        replace_console_statements "$f"
    done < "/tmp/batch_${batch_num}.txt"
    rm "/tmp/batch_${batch_num}.txt"
fi

# Clean up temporary files
rm -f /tmp/secure_logger_patterns.txt

echo "✅ Console statement replacement completed!"
echo "Verifying results..."

# Count remaining console statements
remaining=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .git | xargs grep -l "console\." 2>/dev/null | wc -l)
echo "Remaining files with console statements: $remaining"

if [ "$remaining" -eq 0 ]; then
    echo "🎉 All console statements successfully replaced!"
else
    echo "⚠️  Some console statements remain. Manual review needed for $remaining files."
fi