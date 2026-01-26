#!/bin/bash

# Wave 3.1 Agent 28: File Naming Standardizer
# Convert all kebab-case component files to PascalCase

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
RENAMED_COUNT=0
SKIPPED_COUNT=0
ERROR_COUNT=0

# Convert kebab-case to PascalCase
# Example: "chat-message" -> "ChatMessage"
kebab_to_pascal() {
    echo "$1" | sed -r 's/(^|-)([a-z])/\U\2/g'
}

# Get the repository root
REPO_ROOT="/Users/christireid/Dev/Clarity-ai-chat-components"
cd "$REPO_ROOT"

echo -e "${BLUE}=== Wave 3.1 Agent 28: File Naming Standardizer ===${NC}"
echo -e "${BLUE}Converting kebab-case component files to PascalCase${NC}\n"

# Find all kebab-case .tsx component files (excluding tests and stories)
COMPONENT_FILES=$(find packages/react/src/components -type f -name "*-*.tsx" \
  ! -name "*.test.tsx" \
  ! -name "*.stories.tsx" \
  ! -path "*/__tests__/*" | sort)

TOTAL_FILES=$(echo "$COMPONENT_FILES" | wc -l | tr -d ' ')
echo -e "${YELLOW}Found $TOTAL_FILES component files to rename${NC}\n"

# Process each file
for OLD_PATH in $COMPONENT_FILES; do
    # Extract directory and filename
    DIR=$(dirname "$OLD_PATH")
    OLD_FILENAME=$(basename "$OLD_PATH")

    # Check if filename contains hyphens
    if [[ ! "$OLD_FILENAME" =~ - ]]; then
        echo -e "${YELLOW}SKIP: $OLD_FILENAME (already correct naming)${NC}"
        ((SKIPPED_COUNT++))
        continue
    fi

    # Remove .tsx extension
    BASE_NAME="${OLD_FILENAME%.tsx}"

    # Convert to PascalCase
    PASCAL_NAME=$(kebab_to_pascal "$BASE_NAME")
    NEW_FILENAME="${PASCAL_NAME}.tsx"
    NEW_PATH="${DIR}/${NEW_FILENAME}"

    # Skip if already correctly named
    if [ "$OLD_FILENAME" = "$NEW_FILENAME" ]; then
        echo -e "${YELLOW}SKIP: $OLD_FILENAME (already correct)${NC}"
        ((SKIPPED_COUNT++))
        continue
    fi

    # Perform git mv
    echo -e "${GREEN}RENAME: $OLD_FILENAME -> $NEW_FILENAME${NC}"

    if git mv "$OLD_PATH" "$NEW_PATH" 2>/dev/null; then
        ((RENAMED_COUNT++))

        # Run TypeScript check every 10 renames
        if [ $((RENAMED_COUNT % 10)) -eq 0 ]; then
            echo -e "\n${BLUE}Running TypeScript check (batch $((RENAMED_COUNT / 10)))...${NC}"
            if ! pnpm --filter=@clarity/react tsc --noEmit 2>&1 | head -20; then
                echo -e "${RED}TypeScript errors detected! Please review.${NC}"
            else
                echo -e "${GREEN}TypeScript check passed!${NC}"
            fi
            echo ""
        fi
    else
        echo -e "${RED}ERROR: Failed to rename $OLD_FILENAME${NC}"
        ((ERROR_COUNT++))
    fi
done

echo -e "\n${BLUE}=== Rename Summary ===${NC}"
echo -e "${GREEN}Renamed: $RENAMED_COUNT files${NC}"
echo -e "${YELLOW}Skipped: $SKIPPED_COUNT files${NC}"
echo -e "${RED}Errors: $ERROR_COUNT files${NC}"

echo -e "\n${BLUE}Running final TypeScript compilation check...${NC}"
pnpm --filter=@clarity/react tsc --noEmit

echo -e "\n${GREEN}File naming standardization complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Update all imports across the codebase"
echo -e "  2. Run tests to verify no broken imports"
echo -e "  3. Commit changes with: git commit -m 'refactor: standardize component file naming to PascalCase (Wave 3.1 Agent 28)'"
