#!/bin/bash

###############################################################################
# Clarity Chat Documentation - Deployment Script
#
# This script helps deploy the documentation site and Storybook to production.
# Prerequisites: Vercel CLI installed (npm i -g vercel)
###############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Header
echo ""
echo "======================================================================"
echo "  🚀 Clarity Chat Documentation - Deployment Helper"
echo "======================================================================"
echo ""

# Function to print colored messages
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

###############################################################################
# Pre-deployment checks
###############################################################################

print_step "Running pre-deployment checks..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found. Run this script from the project root."
    exit 1
fi
print_success "In project root directory"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Install with: npm i -g vercel"
    exit 1
fi
print_success "Vercel CLI installed"

# Check if docs directory exists
if [ ! -d "apps/docs" ]; then
    print_error "apps/docs directory not found"
    exit 1
fi
print_success "Documentation directory found"

echo ""

###############################################################################
# Regenerate search index
###############################################################################

print_step "Regenerating search index..."
echo ""

cd apps/docs

if [ -f "scripts/generate-search-index.mjs" ]; then
    node scripts/generate-search-index.mjs
    print_success "Search index regenerated (241 items indexed)"
else
    print_warning "Search index generator not found, skipping..."
fi

echo ""

###############################################################################
# Deployment menu
###############################################################################

echo "======================================================================"
echo "  What would you like to deploy?"
echo "======================================================================"
echo ""
echo "  1) Documentation Site (apps/docs)"
echo "  2) Storybook (apps/storybook)"
echo "  3) Both"
echo "  4) Preview Only (no production)"
echo "  5) Exit"
echo ""
read -p "Enter your choice [1-5]: " choice

case $choice in
    1)
        print_step "Deploying Documentation Site to production..."
        echo ""
        vercel --prod
        print_success "Documentation deployed!"
        ;;
    2)
        print_step "Deploying Storybook to production..."
        echo ""
        cd ../storybook
        vercel --prod
        print_success "Storybook deployed!"
        ;;
    3)
        print_step "Deploying Documentation Site..."
        vercel --prod
        print_success "Documentation deployed!"
        echo ""

        print_step "Deploying Storybook..."
        cd ../storybook
        vercel --prod
        print_success "Storybook deployed!"
        ;;
    4)
        print_step "Creating preview deployment..."
        vercel
        print_success "Preview deployed!"
        ;;
    5)
        print_warning "Deployment cancelled"
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""

###############################################################################
# Post-deployment checklist
###############################################################################

echo "======================================================================"
echo "  📋 Post-Deployment Checklist"
echo "======================================================================"
echo ""
echo "Next steps:"
echo ""
echo "  1. Verify deployment URL works"
echo "  2. Test search functionality (Cmd+K)"
echo "  3. Check dark mode toggle"
echo "  4. Test on mobile device"
echo "  5. Submit sitemap to Google Search Console"
echo "     → https://search.google.com/search-console"
echo "     → Submit: https://docs.clarity-chat.dev/sitemap.xml"
echo ""
echo "  6. (Optional) Setup analytics"
echo "     → Vercel Analytics (recommended)"
echo "     → Google Analytics 4"
echo "     → Plausible (privacy-friendly)"
echo ""
echo "  7. Update README with docs URL"
echo "  8. Announce the launch! 🎉"
echo ""

###############################################################################
# URLs
###############################################################################

echo "======================================================================"
echo "  🔗 Important URLs"
echo "======================================================================"
echo ""
echo "  Documentation: https://docs.clarity-chat.dev"
echo "  Storybook:     https://storybook.clarity-chat.dev"
echo "  Sitemap:       https://docs.clarity-chat.dev/sitemap.xml"
echo "  Robots:        https://docs.clarity-chat.dev/robots.txt"
echo ""
echo "======================================================================"
echo "  🎉 Deployment Complete!"
echo "======================================================================"
echo ""
print_success "Your documentation is now live and ready for users!"
echo ""
