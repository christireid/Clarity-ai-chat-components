#!/usr/bin/env python3

"""
Wave 3.1 Agent 28: File Naming Standardizer
Convert all kebab-case component files to PascalCase
"""

import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# ANSI color codes
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

def kebab_to_pascal(kebab_str):
    """Convert kebab-case to PascalCase"""
    parts = kebab_str.split('-')
    return ''.join(word.capitalize() for word in parts)

def run_command(cmd, shell=False):
    """Run a shell command and return success status"""
    try:
        if shell:
            result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        else:
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def run_typescript_check():
    """Run TypeScript compilation check"""
    print(f"\n{BLUE}Running TypeScript check...{NC}")
    success, output = run_command(
        ["pnpm", "--filter=@clarity/react", "tsc", "--noEmit"]
    )
    if success:
        print(f"{GREEN}TypeScript check passed!{NC}")
    else:
        print(f"{YELLOW}TypeScript warnings detected (will review at end){NC}")
        # Don't fail on warnings, continue with renames
    return success

def main():
    repo_root = Path("/Users/christireid/Dev/Clarity-ai-chat-components")
    os.chdir(repo_root)

    print(f"{BLUE}=== Wave 3.1 Agent 28: File Naming Standardizer ==={NC}")
    print(f"{BLUE}Converting kebab-case component files to PascalCase{NC}\n")

    # Load mappings
    mapping_file = repo_root / "scripts/rename-mappings.txt"
    if not mapping_file.exists():
        print(f"{RED}Error: Mapping file not found. Run generate-rename-mappings.py first{NC}")
        sys.exit(1)

    mappings = []
    with open(mapping_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            parts = line.split('|')
            if len(parts) == 3:
                mappings.append({
                    'old': parts[0],
                    'new': parts[1],
                    'dir': parts[2]
                })

    print(f"{YELLOW}Found {len(mappings)} files to rename{NC}\n")

    # Counters
    renamed_count = 0
    skipped_count = 0
    error_count = 0

    # Process each file
    for i, mapping in enumerate(mappings, 1):
        old_filename = mapping['old']
        new_filename = mapping['new']
        directory = mapping['dir']

        # Build full paths
        old_path = repo_root / "packages/react/src" / directory / old_filename
        new_path = repo_root / "packages/react/src" / directory / new_filename

        # Check if file exists
        if not old_path.exists():
            print(f"{YELLOW}SKIP [{i}/{len(mappings)}]: {old_filename} (already renamed or missing){NC}")
            skipped_count += 1
            continue

        # Check if target already exists
        if new_path.exists() and old_path != new_path:
            print(f"{RED}ERROR [{i}/{len(mappings)}]: {new_filename} already exists!{NC}")
            error_count += 1
            continue

        # Perform git mv
        print(f"{GREEN}RENAME [{i}/{len(mappings)}]: {old_filename:40} -> {new_filename}{NC}")

        success, output = run_command([
            "git", "mv",
            str(old_path),
            str(new_path)
        ])

        if success:
            renamed_count += 1

            # Run TypeScript check every 25 renames
            if renamed_count % 25 == 0:
                run_typescript_check()

        else:
            print(f"{RED}ERROR: Failed to rename {old_filename}{NC}")
            print(f"{RED}{output}{NC}")
            error_count += 1

    # Summary
    print(f"\n{BLUE}=== Rename Summary ==={NC}")
    print(f"{GREEN}Renamed: {renamed_count} files{NC}")
    print(f"{YELLOW}Skipped: {skipped_count} files{NC}")
    print(f"{RED}Errors: {error_count} files{NC}")

    # Final TypeScript check
    print(f"\n{BLUE}Running final TypeScript compilation check...{NC}")
    run_typescript_check()

    print(f"\n{GREEN}File naming standardization complete!{NC}")
    print(f"{YELLOW}Next steps:{NC}")
    print(f"  1. Run update-imports.py to fix all import statements")
    print(f"  2. Run tests: pnpm test")
    print(f"  3. Commit: git commit -m 'refactor: standardize component file naming to PascalCase (Wave 3.1 Agent 28)'")

    return error_count

if __name__ == '__main__':
    sys.exit(main())
