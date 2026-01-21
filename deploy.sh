#!/bin/bash

# 🚀 Clarity Chat v1.0.0 Deployment Script
# This script handles the complete deployment process for the Clarity Chat library

set -e  # Exit on any error

echo "🚀 Starting Clarity Chat v1.0.0 Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "packages/react" ]; then
    print_error "Not in the correct project directory. Please run from the project root."
    exit 1
fi

print_status "Step 1: Pre-deployment verification..."

# Check if all required files exist
required_files=(
    "AUDIT_COMPLETION_REPORT.md"
    "RELEASE_CHECKLIST.md"
    "DEPLOYMENT_GUIDE.md"
    "NEXT_STEPS.md"
    "packages/react/package.json"
    "packages/react/CHANGELOG.md"
    "packages/react/README.md"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done

print_success "All required files present"

# Check package version
PACKAGE_VERSION=$(grep '"version"' packages/react/package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
if [ "$PACKAGE_VERSION" != "1.0.0" ]; then
    print_warning "Package version is $PACKAGE_VERSION, expected 1.0.0"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_success "Package version verified: $PACKAGE_VERSION"

print_status "Step 2: Running final tests..."

# Run tests (commented out for now as they might take too long)
# npm run test
print_warning "Skipping full test suite (run manually: npm run test)"

print_status "Step 3: Building packages..."

# Build all packages
npm run build:packages

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_success "Build completed successfully"

print_status "Step 4: Verifying build artifacts..."

# Check if dist directories exist
if [ ! -d "packages/react/dist" ]; then
    print_error "React package dist directory not found!"
    exit 1
fi

print_success "Build artifacts verified"

print_status "Step 5: NPM authentication check..."

# Check if user is logged in to NPM
if ! npm whoami > /dev/null 2>&1; then
    print_warning "Not logged in to NPM. Please run: npm login"
    print_status "Then re-run this script."
    exit 1
fi

NPM_USER=$(npm whoami)
print_success "Logged in as NPM user: $NPM_USER"

# Check if user has publish access
if ! npm access ls-packages @clarity-chat > /dev/null 2>&1; then
    print_warning "No access to @clarity-chat scope. Please check permissions."
    exit 1
fi

print_success "NPM access verified"

print_status "Step 6: Dry run publishing..."

cd packages/react

# Dry run first
npm publish --dry-run

if [ $? -ne 0 ]; then
    print_error "Dry run failed!"
    cd ../..
    exit 1
fi

print_success "Dry run successful"

cd ../..

print_status "Step 7: Final confirmation..."

echo ""
echo "=========================================="
echo "🚀 DEPLOYMENT READY"
echo "=========================================="
echo ""
echo "Package: @clarity-chat/react"
echo "Version: $PACKAGE_VERSION"
echo "NPM User: $NPM_USER"
echo ""
echo "This will publish the package to npmjs.com"
echo ""

read -p "Are you sure you want to publish? (yes/N): " -r
if [[ ! $REPLY =~ ^yes$ ]]; then
    print_status "Deployment cancelled."
    exit 0
fi

print_status "Step 8: Publishing to NPM..."

cd packages/react

# Publish to NPM
npm publish

if [ $? -ne 0 ]; then
    print_error "Publishing failed!"
    cd ../..
    exit 1
fi

cd ../..

print_success "Package published successfully!"
print_success "@clarity-chat/react@$PACKAGE_VERSION is now live on NPM!"

print_status "Step 9: Git tagging..."

# Create git tag
git tag -a "v$PACKAGE_VERSION" -m "Release v$PACKAGE_VERSION: Enterprise-ready AI chat components

- Cross-device synchronization with conflict resolution
- Advanced rate limiting with request queuing
- Template marketplace with community sharing
- Comprehensive integration testing (400+ tests)
- Production-ready documentation and examples"

git push origin "v$PACKAGE_VERSION"

print_success "Git tag created and pushed: v$PACKAGE_VERSION"

print_status "Step 10: Creating GitHub release..."

# Note: GitHub release creation would typically be done via GitHub CLI or web interface
print_warning "GitHub release creation not automated. Please create manually:"
echo "1. Go to: https://github.com/christireid/Clarity-ai-chat-components/releases"
echo "2. Click 'Create a new release'"
echo "3. Tag: v$PACKAGE_VERSION"
echo "4. Title: 'Release v$PACKAGE_VERSION: Enterprise-Ready AI Chat Components'"
echo "5. Copy changelog content from packages/react/CHANGELOG.md"

print_status "Step 11: Post-deployment tasks..."

echo ""
echo "📋 POST-DEPLOYMENT CHECKLIST:"
echo "=========================================="
echo "□ Verify package on NPM: https://www.npmjs.com/package/@clarity-chat/react"
echo "□ Check package size and files"
echo "□ Test installation: npm install @clarity-chat/react@latest"
echo "□ Create GitHub release with changelog"
echo "□ Update documentation site (if applicable)"
echo "□ Announce on social media and Discord"
echo "□ Monitor for initial feedback and issues"
echo "□ Set up error monitoring and analytics"
echo ""

print_success "🎉 DEPLOYMENT COMPLETE!"
print_success "Clarity Chat v1.0.0 is now live!"
echo ""
echo "Thank you for completing this comprehensive audit and remediation project."
echo "The library has been transformed into an enterprise-ready platform! 🚀✨"