#!/usr/bin/env python3

import os
import sys
from pathlib import Path
from datetime import datetime

def kebab_to_pascal(kebab_str):
    """Convert kebab-case to PascalCase"""
    parts = kebab_str.split('-')
    return ''.join(word.capitalize() for word in parts)

def main():
    repo_root = Path("/Users/christireid/Dev/Clarity-ai-chat-components")
    components_dir = repo_root / "packages/react/src/components"
    mapping_file = repo_root / "scripts/rename-mappings.txt"

    print("Generating rename mappings...")

    # Find all kebab-case .tsx component files
    component_files = []
    for tsx_file in components_dir.rglob("*.tsx"):
        # Skip test files, stories, and __tests__ directories
        if (
            ".test.tsx" in str(tsx_file) or
            ".stories.tsx" in str(tsx_file) or
            "/__tests__/" in str(tsx_file)
        ):
            continue

        filename = tsx_file.name
        # Only process files with hyphens
        if '-' in filename:
            component_files.append(tsx_file)

    component_files.sort()

    # Generate mappings
    mappings = []
    with open(mapping_file, 'w') as f:
        f.write("# File rename mappings (OLD -> NEW)\n")
        f.write(f"# Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("\n")

        for file_path in component_files:
            old_filename = file_path.name
            base_name = old_filename.replace('.tsx', '')

            # Convert to PascalCase
            pascal_name = kebab_to_pascal(base_name)
            new_filename = f"{pascal_name}.tsx"

            # Skip if already correct
            if old_filename == new_filename:
                continue

            # Get directory relative to packages/react/src
            rel_dir = file_path.parent.relative_to(repo_root / "packages/react/src")

            mapping = f"{old_filename}|{new_filename}|{rel_dir}"
            mappings.append(mapping)
            f.write(mapping + "\n")

    print(f"Mapping file generated: {mapping_file}")
    print(f"Total mappings: {len(mappings)}")
    print("\nFirst 10 examples:")
    for mapping in mappings[:10]:
        old, new, directory = mapping.split('|')
        print(f"  {old:40} -> {new:40} in {directory}")

if __name__ == '__main__':
    main()
