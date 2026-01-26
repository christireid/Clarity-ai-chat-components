#!/usr/bin/env python3

import sys

def kebab_to_pascal(kebab_str):
    """Convert kebab-case to PascalCase
    
    Examples:
        chat-message -> ChatMessage
        multi-modal-preview -> MultiModalPreview
        ab-testing-dashboard -> AbTestingDashboard
    """
    # Split by hyphen and capitalize each part
    parts = kebab_str.split('-')
    return ''.join(word.capitalize() for word in parts)

if __name__ == '__main__':
    if len(sys.argv) > 1:
        print(kebab_to_pascal(sys.argv[1]))
    else:
        # Read from stdin
        for line in sys.stdin:
            print(kebab_to_pascal(line.strip()))
