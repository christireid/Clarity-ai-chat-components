#!/bin/bash
#
# Migrate Example Configurations Script
#
# This script migrates existing example apps to use shared base configurations,
# eliminating duplication and ensuring consistency.
#
# Usage:
#   ./scripts/migrate-example-configs.sh [--dry-run] [--example name]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
DRY_RUN=false
SPECIFIC_EXAMPLE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --example)
      SPECIFIC_EXAMPLE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

EXAMPLES_DIR="apps/examples"
MIGRATED=0
SKIPPED=0
FAILED=0

echo -e "${BLUE}🔄 Starting example configuration migration...${NC}\n"

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}⚠️  DRY RUN MODE - No files will be modified${NC}\n"
fi

# Function to backup a file
backup_file() {
  local file=$1
  if [ -f "$file" ]; then
    if [ "$DRY_RUN" = false ]; then
      cp "$file" "${file}.backup"
      echo -e "   ${GREEN}✓${NC} Backed up: $(basename $file)"
    else
      echo -e "   ${YELLOW}→${NC} Would backup: $(basename $file)"
    fi
  fi
}

# Function to migrate Tailwind config
migrate_tailwind_config() {
  local example_dir=$1
  local config_file="$example_dir/tailwind.config.ts"
  local js_config_file="$example_dir/tailwind.config.js"

  # Remove .js version if it exists
  if [ -f "$js_config_file" ]; then
    if [ "$DRY_RUN" = false ]; then
      rm "$js_config_file"
      echo -e "   ${GREEN}✓${NC} Removed legacy: tailwind.config.js"
    else
      echo -e "   ${YELLOW}→${NC} Would remove: tailwind.config.js"
    fi
  fi

  # Backup existing config
  backup_file "$config_file"

  # Create new config
  if [ "$DRY_RUN" = false ]; then
    cat > "$config_file" <<'EOF'
import { baseConfig } from '../../../config/examples/tailwind.config.base'

export default baseConfig
EOF
    echo -e "   ${GREEN}✓${NC} Migrated: tailwind.config.ts"
  else
    echo -e "   ${YELLOW}→${NC} Would migrate: tailwind.config.ts"
  fi
}

# Function to migrate Next.js config
migrate_next_config() {
  local example_dir=$1
  local config_file="$example_dir/next.config.ts"

  # Backup existing config
  backup_file "$config_file"

  # Check if example has custom Next.js config
  if grep -q "experimental\|env\|webpack\|redirects\|rewrites" "$config_file" 2>/dev/null; then
    echo -e "   ${YELLOW}⚠${NC}  Custom config detected - manual migration needed"
    return
  fi

  # Create new config
  if [ "$DRY_RUN" = false ]; then
    cat > "$config_file" <<'EOF'
import type { NextConfig } from 'next'
import { baseNextConfig } from '../../../config/examples/next.config.base'

const nextConfig: NextConfig = {
  ...baseNextConfig,
  // Add example-specific overrides here
}

export default nextConfig
EOF
    echo -e "   ${GREEN}✓${NC} Migrated: next.config.ts"
  else
    echo -e "   ${YELLOW}→${NC} Would migrate: next.config.ts"
  fi
}

# Function to migrate Vitest config
migrate_vitest_config() {
  local example_dir=$1
  local config_file="$example_dir/vitest.config.ts"

  if [ ! -f "$config_file" ]; then
    return
  fi

  # Backup existing config
  backup_file "$config_file"

  # Create new config
  if [ "$DRY_RUN" = false ]; then
    cat > "$config_file" <<'EOF'
import { baseVitestConfig } from '../../../config/examples/vitest.config.base'

export default baseVitestConfig
EOF
    echo -e "   ${GREEN}✓${NC} Migrated: vitest.config.ts"
  else
    echo -e "   ${YELLOW}→${NC} Would migrate: vitest.config.ts"
  fi
}

# Function to create PostCSS config
create_postcss_config() {
  local example_dir=$1
  local config_file="$example_dir/postcss.config.js"

  if [ "$DRY_RUN" = false ]; then
    cat > "$config_file" <<'EOF'
module.exports = require('../../../config/examples/postcss.config')
EOF
    echo -e "   ${GREEN}✓${NC} Created: postcss.config.js"
  else
    echo -e "   ${YELLOW}→${NC} Would create: postcss.config.js"
  fi
}

# Main migration loop
for dir in "$EXAMPLES_DIR"/*/ ; do
  example=$(basename "$dir")

  # Skip special directories
  if [ "$example" = "_template" ] || [ "$example" = "_shared" ]; then
    continue
  fi

  # If specific example provided, skip others
  if [ -n "$SPECIFIC_EXAMPLE" ] && [ "$example" != "$SPECIFIC_EXAMPLE" ]; then
    continue
  fi

  echo -e "${BLUE}📦 Processing: ${example}${NC}"

  # Check if example has required structure
  if [ ! -d "$dir/src" ]; then
    echo -e "   ${YELLOW}⚠${NC}  Skipping: No src directory found"
    ((SKIPPED++))
    echo ""
    continue
  fi

  # Migrate configurations
  {
    migrate_tailwind_config "$dir"
    migrate_next_config "$dir"
    migrate_vitest_config "$dir"
    create_postcss_config "$dir"
    ((MIGRATED++))
  } || {
    echo -e "   ${RED}✗${NC} Migration failed"
    ((FAILED++))
  }

  echo ""
done

# Summary
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Migration Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "Examples migrated: ${GREEN}${MIGRATED}${NC}"
echo -e "Examples skipped:  ${YELLOW}${SKIPPED}${NC}"
echo -e "Examples failed:   ${RED}${FAILED}${NC}"
echo ""

if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}This was a dry run. Run without --dry-run to apply changes.${NC}"
else
  echo -e "${GREEN}✅ Migration complete!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Test migrated examples:  pnpm build --filter './apps/examples/*'"
  echo "2. Review backup files:     find apps/examples -name '*.backup'"
  echo "3. Commit changes:          git add . && git commit -m 'chore: migrate examples to shared configs'"
fi
