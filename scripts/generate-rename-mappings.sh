#!/bin/bash

# Generate rename mappings for import updates

set -e

REPO_ROOT="/Users/christireid/Dev/Clarity-ai-chat-components"
MAPPING_FILE="$REPO_ROOT/scripts/rename-mappings.txt"

# Convert kebab-case to PascalCase
kebab_to_pascal() {
    echo "$1" | sed -r 's/(^|-)([a-z])/\U\2/g'
}

echo "Generating rename mappings..."
echo "# File rename mappings (OLD -> NEW)" > "$MAPPING_FILE"
echo "# Generated on $(date)" >> "$MAPPING_FILE"
echo "" >> "$MAPPING_FILE"

# Find all kebab-case .tsx component files
find "$REPO_ROOT/packages/react/src/components" -type f -name "*-*.tsx" \
  ! -name "*.test.tsx" \
  ! -name "*.stories.tsx" \
  ! -path "*/__tests__/*" | sort | while read OLD_PATH; do

    OLD_FILENAME=$(basename "$OLD_PATH")

    # Skip if no hyphens
    if [[ ! "$OLD_FILENAME" =~ - ]]; then
        continue
    fi

    # Convert to PascalCase
    BASE_NAME="${OLD_FILENAME%.tsx}"
    PASCAL_NAME=$(kebab_to_pascal "$BASE_NAME")
    NEW_FILENAME="${PASCAL_NAME}.tsx"

    # Skip if already correct
    if [ "$OLD_FILENAME" = "$NEW_FILENAME" ]; then
        continue
    fi

    # Get relative path from packages/react/src
    REL_PATH=$(echo "$OLD_PATH" | sed "s|$REPO_ROOT/packages/react/src/||")
    DIR=$(dirname "$REL_PATH")

    echo "${OLD_FILENAME}|${NEW_FILENAME}|${DIR}" >> "$MAPPING_FILE"
done

echo "Mapping file generated: $MAPPING_FILE"
wc -l "$MAPPING_FILE"
