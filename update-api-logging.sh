#!/bin/bash

# Script to replace console statements with secure logging in API routes

echo "Updating API routes to use secure logging..."

# List of API route files to update
API_FILES=(
  "apps/docs/app/api/ai/components/route.ts"
  "apps/docs/app/api/ai/hooks/[name]/route.ts"
  "apps/docs/app/api/ai/hooks/route.ts"
  "apps/docs/app/api/ai/search/route.ts"
  "apps/docs/app/api/analytics/route.ts"
  "apps/docs/app/api/docs-assistant-optimized/route.ts"
  "apps/docs/app/api/docs-assistant/route.ts"
  "apps/docs/app/api/feedback/route.ts"
  "apps/docs/app/api/hero-chat/route.ts"
  "apps/docs/app/api/live-demo-chat/route.ts"
)

# Function to update a single file
update_file() {
  local file="$1"
  local basename=$(basename "$file" .ts)
  
  echo "Updating $file..."
  
  # Add import for secure logger
  if ! grep -q "import.*logApiError.*from.*@/lib/security/secureLogger" "$file"; then
    # Find the line after the last import and add our import
    local last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
    if [ -n "$last_import_line" ]; then
      local insert_line=$((last_import_line + 1))
      sed -i "${insert_line}i\\nimport { logApiError } from '@/lib/security/secureLogger'" "$file"
    else
      # If no imports found, add at the top
      sed -i '1i\import { logApiError } from \'@/lib/security/secureLogger\'\n' "$file"
    fi
  fi
  
  # Replace console.error statements
  sed -i "s/console\.error\(\[.*\]\?.*'Error:'.*,\s*error\)/logApiError(error as Error, '${basename} API', null)/g" "$file"
  sed -i "s/console\.error\(\[.*\]\]\?.*Error:.*,\s*error\)/logApiError(error as Error, '${basename} API', null)/g" "$file"
  sed -i "s/console\.error('Error:'.*,\s*error)/logApiError(error as Error, '${basename} API', null)/g" "$file"
  
  # Replace any remaining console.log statements
  sed -i "s/console\.log(.*)//g" "$file"
  sed -i "s/console\.warn(.*)//g" "$file"
  
  echo "Updated $file"
}

# Update each API file
for file in "${API_FILES[@]}"; do
  if [ -f "$file" ]; then
    update_file "$file"
  else
    echo "Warning: $file not found"
  fi
done

echo "API routes updated successfully!"