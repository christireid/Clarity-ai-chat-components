#!/bin/bash

# Quick setup script for Clarity Chat Components
# This script sets up minimal dependencies to get started quickly

echo "🚀 Clarity Chat - Quick Setup"
echo "================================"
echo ""

# Create a minimal lock file to speed up installation
echo "📦 Creating optimized package-lock.json..."
cat > package-lock.json << 'EOF'
{
  "name": "clarity-chat",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "clarity-chat",
      "version": "0.1.0",
      "workspaces": [
        "packages/*",
        "apps/*",
        "examples/*"
      ],
      "devDependencies": {
        "typescript": "^5.3.3"
      }
    }
  }
}
EOF

# Install only essential dependencies first
echo "📦 Installing core dependencies..."
npm install --no-audit --no-fund typescript prettier husky turbo --save-dev

# Set up TypeScript in packages
echo "🔧 Setting up TypeScript configuration..."
for pkg in packages/*/; do
  if [ -f "$pkg/package.json" ]; then
    echo "  - Setting up $(basename $pkg)"
    (cd "$pkg" && npm install --no-audit --no-fund typescript tsup --save-dev 2>/dev/null)
  fi
done

echo ""
echo "✅ Quick setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. For full installation: npm install"
echo "  2. To run development: npm run dev"
echo "  3. To build packages: npm run build"
echo ""
echo "💡 For a specific example:"
echo "  cd examples/basic-chat"
echo "  npm install"
echo "  npm run dev"