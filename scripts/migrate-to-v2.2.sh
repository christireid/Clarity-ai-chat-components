#!/bin/bash

###############################################################################
# Clarity Chat v2.2 Migration Helper Script
# 
# Automates the upgrade process from v2.1 to v2.2
# Run: bash scripts/migrate-to-v2.2.sh
###############################################################################

set -e  # Exit on error

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     Clarity Chat v2.2 Migration Helper                   ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a Node project
if [ ! -f "package.json" ]; then
    error "No package.json found. Are you in a Node.js project?"
    exit 1
fi

success "Found package.json"

# Step 1: Backup current state
echo ""
info "Step 1: Creating backup..."

BACKUP_DIR="backup-pre-v2.2-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup package files
cp package.json "$BACKUP_DIR/"
if [ -f "package-lock.json" ]; then
    cp package-lock.json "$BACKUP_DIR/"
fi
if [ -f "yarn.lock" ]; then
    cp yarn.lock "$BACKUP_DIR/"
fi
if [ -f "pnpm-lock.yaml" ]; then
    cp pnpm-lock.yaml "$BACKUP_DIR/"
fi

success "Backup created at: $BACKUP_DIR"

# Step 2: Check current version
echo ""
info "Step 2: Checking current version..."

CURRENT_VERSION=$(npm list @clarity-chat/react 2>/dev/null | grep @clarity-chat/react | head -1 | sed 's/.*@//' | sed 's/ .*//' || echo "not installed")

if [ "$CURRENT_VERSION" = "not installed" ]; then
    warning "@clarity-chat/react not found. Will perform fresh installation."
elif [ "$CURRENT_VERSION" = "2.2.0" ]; then
    success "Already on v2.2.0! Nothing to do."
    exit 0
else
    info "Current version: $CURRENT_VERSION"
fi

# Step 3: Clean install
echo ""
info "Step 3: Upgrading to v2.2.0..."

# Detect package manager
if [ -f "yarn.lock" ]; then
    PKG_MANAGER="yarn"
    INSTALL_CMD="yarn add"
elif [ -f "pnpm-lock.yaml" ]; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm add"
else
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install"
fi

info "Using package manager: $PKG_MANAGER"

# Install v2.2.0
if $INSTALL_CMD @clarity-chat/react@2.2.0; then
    success "Installed @clarity-chat/react@2.2.0"
else
    error "Failed to install @clarity-chat/react@2.2.0"
    exit 1
fi

# Install primitives if used
if grep -q "@clarity-chat/primitives" package.json; then
    info "Detected @clarity-chat/primitives, upgrading..."
    if $INSTALL_CMD @clarity-chat/primitives@2.2.0; then
        success "Installed @clarity-chat/primitives@2.2.0"
    else
        warning "Failed to install @clarity-chat/primitives@2.2.0"
    fi
fi

# Step 4: Clear caches
echo ""
info "Step 4: Clearing build caches..."

# Clear common framework caches
if [ -d ".next" ]; then
    rm -rf .next
    success "Cleared Next.js cache"
fi

if [ -d "dist" ]; then
    rm -rf dist
    success "Cleared dist/"
fi

if [ -d "build" ]; then
    rm -rf build
    success "Cleared build/"
fi

if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    success "Cleared node_modules/.cache"
fi

if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    success "Cleared Vite cache"
fi

# Step 5: Validate installation
echo ""
info "Step 5: Validating installation..."

NEW_VERSION=$(npm list @clarity-chat/react 2>/dev/null | grep @clarity-chat/react | head -1 | sed 's/.*@//' | sed 's/ .*//' || echo "error")

if [ "$NEW_VERSION" = "2.2.0" ]; then
    success "Successfully upgraded to v2.2.0!"
else
    warning "Version validation failed. Please verify manually."
fi

# Step 6: Run validation script if available
echo ""
info "Step 6: Running validation checks..."

if [ -f "scripts/validate-v2.2-migration.js" ]; then
    if node scripts/validate-v2.2-migration.js; then
        success "All validation checks passed!"
    else
        warning "Some validation checks failed. Review output above."
    fi
else
    warning "Validation script not found. Skipping automated checks."
fi

# Step 7: Summary and next steps
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║  Migration Complete! 🎉                                  ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

success "Upgraded to v2.2.0"
info "Backup saved at: $BACKUP_DIR"
echo ""
echo "Next Steps:"
echo ""
echo "1️⃣  Start your dev server:"
echo "   npm run dev (or yarn dev / pnpm dev)"
echo ""
echo "2️⃣  Test your components:"
echo "   - Hover over buttons (see 1px lift?)"
echo "   - Tab through inputs (see soft focus glow?)"
echo "   - Check cards and badges"
echo ""
echo "3️⃣  Update visual regression tests:"
echo "   npx playwright test --update-snapshots"
echo ""
echo "4️⃣  Read what's new:"
echo "   - VISUAL_COMPARISON_V2.2.md"
echo "   - ⏱️_5_MINUTE_WALKTHROUGH.md"
echo ""
echo "Need help? Check:"
echo "  - ❓_FAQ.md"
echo "  - 🔧_TROUBLESHOOTING_GUIDE.md"
echo "  - UPGRADE_GUIDE_V2.2.md"
echo ""
success "Happy coding with premium quality! ✨"
echo ""
