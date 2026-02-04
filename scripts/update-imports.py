#!/usr/bin/env python3

"""
Wave 3.1 Agent 28: Import Update Script
Update all import statements to reflect renamed PascalCase files
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

# ANSI color codes
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

def load_mappings(mapping_file):
    """Load rename mappings from file"""
    mappings = {}
    with open(mapping_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split('|')
            if len(parts) == 3:
                old_filename = parts[0].replace('.tsx', '')
                new_filename = parts[1].replace('.tsx', '')
                # Store mapping without extension
                mappings[old_filename] = new_filename
    return mappings

def update_imports_in_file(file_path, mappings):
    """Update import statements in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes = []

        # Find all import/export statements
        # Matches: import ... from './chat-message'
        #          import ... from '../ai/model-selector'
        #          export { ... } from './file-name'
        pattern = r"(import|export)\s+.*?\s+from\s+['\"]([^'\"]+)['\"]"

        def replace_import(match):
            statement_type = match.group(1)  # import or export
            import_path = match.group(2)     # the path

            # Get the filename from the path
            if '/' in import_path:
                path_parts = import_path.split('/')
                filename = path_parts[-1]
                directory = '/'.join(path_parts[:-1])
            else:
                filename = import_path
                directory = ''

            # Check if this filename needs to be renamed
            if filename in mappings:
                new_filename = mappings[filename]
                if directory:
                    new_path = f"{directory}/{new_filename}"
                else:
                    new_path = new_filename

                old_full = match.group(0)
                new_full = old_full.replace(import_path, new_path)

                changes.append({
                    'old': import_path,
                    'new': new_path,
                    'line': old_full
                })

                return new_full

            return match.group(0)

        # Replace all imports
        content = re.sub(pattern, replace_import, content)

        # Only write if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, changes
        else:
            return False, []

    except Exception as e:
        print(f"{RED}Error processing {file_path}: {e}{NC}")
        return False, []

def main():
    repo_root = Path("/Users/christireid/Dev/Clarity-ai-chat-components")
    mapping_file = repo_root / "scripts/rename-mappings.txt"

    print(f"{BLUE}=== Wave 3.1 Agent 28: Import Update Script ==={NC}")
    print(f"{BLUE}Updating import statements for renamed files{NC}\n")

    # Load mappings
    if not mapping_file.exists():
        print(f"{RED}Error: Mapping file not found{NC}")
        sys.exit(1)

    mappings = load_mappings(mapping_file)
    print(f"{YELLOW}Loaded {len(mappings)} rename mappings{NC}\n")

    # Find all TypeScript/JavaScript files to process
    extensions = ['*.ts', '*.tsx', '*.js', '*.jsx']
    files_to_process = []

    for ext in extensions:
        files_to_process.extend(repo_root.rglob(ext))

    # Filter out node_modules and build directories
    files_to_process = [
        f for f in files_to_process
        if 'node_modules' not in str(f)
        and 'dist' not in str(f)
        and '.next' not in str(f)
    ]

    print(f"{YELLOW}Processing {len(files_to_process)} files...{NC}\n")

    # Process files
    updated_count = 0
    total_changes = 0
    file_changes = defaultdict(list)

    for i, file_path in enumerate(files_to_process, 1):
        if i % 100 == 0:
            print(f"{BLUE}Progress: {i}/{len(files_to_process)} files processed...{NC}")

        changed, changes = update_imports_in_file(file_path, mappings)

        if changed:
            updated_count += 1
            total_changes += len(changes)
            rel_path = file_path.relative_to(repo_root)
            file_changes[str(rel_path)] = changes

    # Summary
    print(f"\n{BLUE}=== Import Update Summary ==={NC}")
    print(f"{GREEN}Files updated: {updated_count}{NC}")
    print(f"{GREEN}Total import changes: {total_changes}{NC}")

    # Show some examples
    if file_changes:
        print(f"\n{YELLOW}Example changes:{NC}")
        shown = 0
        for file_path, changes in list(file_changes.items())[:5]:
            print(f"\n{BLUE}{file_path}:{NC}")
            for change in changes[:3]:  # Show first 3 changes per file
                print(f"  {change['old']:40} -> {change['new']}")
            shown += 1

    print(f"\n{GREEN}Import update complete!{NC}")
    print(f"{YELLOW}Next steps:{NC}")
    print(f"  1. Run TypeScript check: pnpm --filter=@clarity/react tsc --noEmit")
    print(f"  2. Run tests: pnpm test")
    print(f"  3. Review changes: git diff")

    return 0

if __name__ == '__main__':
    sys.exit(main())
