#!/bin/bash
# Script to update all example packages to React 19, Next.js 16, and TypeScript 5.9

set -e

EXAMPLES_DIR="examples"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Updating all example packages...${NC}"

# Find all package.json files in examples directory
find "$EXAMPLES_DIR" -name "package.json" -type f | while read -r pkg_file; do
  dir=$(dirname "$pkg_file")
  echo -e "${GREEN}Updating: $dir${NC}"
  
  # Update React versions
  if grep -q '"react":' "$pkg_file"; then
    sed -i 's/"react": "\^18\.[0-9]\+\.[0-9]\+"/"react": "^19.2.0"/g' "$pkg_file"
    sed -i 's/"react-dom": "\^18\.[0-9]\+\.[0-9]\+"/"react-dom": "^19.2.0"/g' "$pkg_file"
  fi
  
  # Update Next.js versions
  if grep -q '"next":' "$pkg_file"; then
    sed -i 's/"next": "\^14\.[0-9]\+\.[0-9]\+"/"next": "^16.0.1"/g' "$pkg_file"
  fi
  
  # Update TypeScript versions
  if grep -q '"typescript":' "$pkg_file"; then
    sed -i 's/"typescript": "\^5\.[0-9]\+\.[0-9]\+"/"typescript": "^5.9.3"/g' "$pkg_file"
  fi
  
  # Update @types/react versions
  if grep -q '"@types/react":' "$pkg_file"; then
    sed -i 's/"@types\/react": "\^18\.[0-9]\+\.[0-9]\+"/"@types\/react": "^19.0.0"/g' "$pkg_file"
    sed -i 's/"@types\/react-dom": "\^18\.[0-9]\+\.[0-9]\+"/"@types\/react-dom": "^19.0.0"/g' "$pkg_file"
  fi
  
  # Update Vite versions
  if grep -q '"vite":' "$pkg_file"; then
    sed -i 's/"vite": "\^[0-9]\+\.[0-9]\+\.[0-9]\+"/"vite": "^6.0.0"/g' "$pkg_file"
  fi
  
  # Update @vitejs/plugin-react if present
  if grep -q '"@vitejs/plugin-react":' "$pkg_file"; then
    sed -i 's/"@vitejs\/plugin-react": "\^[0-9]\+\.[0-9]\+\.[0-9]\+"/"@vitejs\/plugin-react": "^5.0.4"/g' "$pkg_file"
  fi
done

echo -e "${GREEN}All example packages updated!${NC}"
