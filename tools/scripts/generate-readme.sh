#!/bin/bash

# Generate README template for examples
# Usage: ./scripts/generate-readme.sh <example-name>

EXAMPLE_NAME=$1
EXAMPLE_DIR="examples/$EXAMPLE_NAME"

if [ -z "$EXAMPLE_NAME" ]; then
  echo "Usage: ./scripts/generate-readme.sh <example-name>"
  exit 1
fi

if [ ! -d "$EXAMPLE_DIR" ]; then
  echo "Error: Example directory not found: $EXAMPLE_DIR"
  exit 1
fi

# Convert kebab-case to Title Case
TITLE=$(echo "$EXAMPLE_NAME" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')

README_FILE="$EXAMPLE_DIR/README.md"

# Check if README already exists
if [ -f "$README_FILE" ]; then
  echo "⚠️  README.md already exists at $README_FILE"
  echo "   Backup created at $README_FILE.backup"
  cp "$README_FILE" "$README_FILE.backup"
fi

# Generate README
cat > "$README_FILE" << EOF
# $TITLE

[Brief description of what this example demonstrates]

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
\`\`\`

## What's Demonstrated

### [Feature Category 1]

Description of what's shown...

### [Feature Category 2]

Description of what's shown...

## Usage Patterns

\`\`\`typescript
// Example code pattern
import { Component } from '@clarity-chat/react'

function Example() {
  // Implementation
}
\`\`\`

## Customization

### [Customization Option 1]

How to customize...

### [Customization Option 2]

How to customize...

## Architecture

[If applicable, describe the architecture]

## Dependencies

Core dependencies:
- \`@clarity-chat/react\` - Chat components and hooks
- \`@clarity-chat/primitives\` - UI primitives
- \`@clarity-chat/types\` - TypeScript types

## Enhancement Status

⚠️ This example is functional but could be enhanced with:
- [ ] Auto-scroll functionality
- [ ] Token tracking
- [ ] Error boundary
- [ ] Comprehensive error handling
- [ ] Mobile responsiveness
- [ ] Additional features...

**Contributions welcome!** See [CONTRIBUTING_EXAMPLES.md](../../CONTRIBUTING_EXAMPLES.md)

## Known Issues

[List any known issues or limitations]

## Next Steps

To learn more:
- Check out [Basic Chat](../basic-chat) for simple patterns
- Explore [AI Assistant](../ai-assistant) for advanced features
- Read the [Component Documentation](../../docs)

## License

MIT - see repository root for details
EOF

echo "✅ README template generated at $README_FILE"
echo ""
echo "Next steps:"
echo "1. Edit $README_FILE and fill in the details"
echo "2. Add specific features and usage examples"
echo "3. Document any known issues or limitations"
echo "4. Update enhancement status checklist"
