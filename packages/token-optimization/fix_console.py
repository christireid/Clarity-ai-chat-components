#!/usr/bin/env python3
"""
Fix all console statements in TypeScript files by wrapping them in development checks.
"""

import os
import re
from pathlib import Path

SRC_DIR = Path(__file__).parent / 'src'

def wrap_console_statement(content):
    """Wrap console statements in development checks."""

    # Pattern 1: Single-line console statements
    # Matches: console.log('message')
    pattern1 = r'^(\s*)(console\.(log|error|warn|info|debug)\([^)]*\);?)$'

    def replace_single_line(match):
        indent = match.group(1)
        statement = match.group(0).strip()
        return f"{indent}if (process.env.NODE_ENV === 'development') {{\n{indent}  {statement}\n{indent}}}"

    content = re.sub(pattern1, replace_single_line, content, flags=re.MULTILINE)

    # Pattern 2: Multi-line console statements (opening)
    # Matches: console.log(
    pattern2 = r'^(\s*)(console\.(log|error|warn|info|debug)\()$'

    lines = content.split('\n')
    result_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]
        match = re.match(pattern2, line)

        if match:
            indent = match.group(1)
            # Found opening of multi-line console statement
            # Find the closing parenthesis
            console_lines = [line]
            j = i + 1
            depth = 1

            while j < len(lines) and depth > 0:
                console_lines.append(lines[j])
                depth += lines[j].count('(') - lines[j].count(')')
                j += 1

            # Wrap the entire console statement
            result_lines.append(f"{indent}if (process.env.NODE_ENV === 'development') {{")
            for cl in console_lines:
                result_lines.append(f"  {cl}")
            result_lines.append(f"{indent}}}")

            i = j
        else:
            result_lines.append(line)
            i += 1

    return '\n'.join(result_lines)

def process_file(file_path):
    """Process a single TypeScript file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Count console statements before
        before_count = len(re.findall(r'console\.(log|error|warn|info|debug)\(', content))

        if before_count == 0:
            return 0, 0

        # Check if already wrapped
        if 'process.env.NODE_ENV' in content:
            # Some may already be wrapped, count unwrapped ones
            pass

        # Apply fixes
        new_content = wrap_console_statement(content)

        # Count console statements after (should still be same)
        after_count = len(re.findall(r'console\.(log|error|warn|info|debug)\(', new_content))

        # Only write if content changed
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return 1, before_count

        return 0, 0

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0, 0

def main():
    """Main entry point."""
    total_files_modified = 0
    total_statements_fixed = 0

    # Find all TypeScript files
    for file_path in SRC_DIR.rglob('*.ts'):
        if file_path.suffix not in ['.ts', '.tsx'] or file_path.name.endswith('.d.ts'):
            continue

        files_modified, statements_fixed = process_file(file_path)

        if files_modified > 0:
            total_files_modified += files_modified
            total_statements_fixed += statements_fixed
            rel_path = file_path.relative_to(SRC_DIR)
            print(f"✓ {rel_path}: {statements_fixed} console statements wrapped")

    print(f"\n✅ Complete!")
    print(f"   Files modified: {total_files_modified}")
    print(f"   Console statements fixed: {total_statements_fixed}")

if __name__ == '__main__':
    main()
