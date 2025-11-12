#!/bin/bash

# Publish to GitHub Packages Script
# Publishes all @clarity-chat packages to GitHub Packages

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "📦 Publishing Clarity Chat Packages to GitHub Packages"
echo "========================================================"
echo ""

# Check if .npmrc exists
if [ ! -f .npmrc ]; then
    echo -e "${RED}❌ .npmrc not found!${NC}"
    echo -e "${YELLOW}   Run ./setup-github-packages.sh first${NC}"
    exit 1
fi

# Check if GitHub Packages is configured
if ! grep -q "npm.pkg.github.com" .npmrc; then
    echo -e "${RED}❌ .npmrc not configured for GitHub Packages${NC}"
    echo -e "${YELLOW}   Run ./setup-github-packages.sh first${NC}"
    exit 1
fi

# Verify authentication
echo -e "${BLUE}🔍 Verifying authentication...${NC}"
if npm whoami --registry=https://npm.pkg.github.com 2>/dev/null; then
    USERNAME=$(npm whoami --registry=https://npm.pkg.github.com)
    echo -e "${GREEN}✅ Authenticated as: $USERNAME${NC}"
else
    echo -e "${RED}❌ Authentication failed${NC}"
    echo -e "${YELLOW}   Check your GitHub token in .npmrc${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Publish cancelled${NC}"
        exit 1
    fi
fi

# Build all packages
echo ""
echo -e "${BLUE}🔨 Building all packages...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Publish packages
echo ""
echo -e "${BLUE}📤 Publishing packages to GitHub Packages...${NC}"
echo ""

# List of packages to publish
PACKAGES=(
    "packages/types"
    "packages/primitives"
    "packages/errors"
    "packages/dev-tools"
    "packages/error-handling"
    "packages/react"
    "packages/cli"
)

PUBLISHED=()
FAILED=()

for package in "${PACKAGES[@]}"; do
    if [ -d "$package" ]; then
        PACKAGE_NAME=$(node -p "require('./$package/package.json').name")
        PACKAGE_VERSION=$(node -p "require('./$package/package.json').version")
        
        echo -e "${BLUE}📦 Publishing $PACKAGE_NAME@$PACKAGE_VERSION...${NC}"
        
        cd "$package"
        
        if npm publish 2>&1 | tee /tmp/npm-publish.log; then
            echo -e "${GREEN}✅ Published $PACKAGE_NAME@$PACKAGE_VERSION${NC}"
            PUBLISHED+=("$PACKAGE_NAME@$PACKAGE_VERSION")
        else
            # Check if already published
            if grep -q "cannot publish over the previously published versions" /tmp/npm-publish.log || \
               grep -q "You cannot publish over the previously published versions" /tmp/npm-publish.log; then
                echo -e "${YELLOW}⚠️  $PACKAGE_NAME@$PACKAGE_VERSION already published${NC}"
                PUBLISHED+=("$PACKAGE_NAME@$PACKAGE_VERSION (already published)")
            else
                echo -e "${RED}❌ Failed to publish $PACKAGE_NAME${NC}"
                FAILED+=("$PACKAGE_NAME@$PACKAGE_VERSION")
            fi
        fi
        
        cd - > /dev/null
        echo ""
    fi
done

# Summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ Publishing Complete${NC}"
echo "=================================================="
echo ""

if [ ${#PUBLISHED[@]} -gt 0 ]; then
    echo -e "${GREEN}Published packages:${NC}"
    for pkg in "${PUBLISHED[@]}"; do
        echo -e "  ✅ $pkg"
    done
    echo ""
fi

if [ ${#FAILED[@]} -gt 0 ]; then
    echo -e "${RED}Failed packages:${NC}"
    for pkg in "${FAILED[@]}"; do
        echo -e "  ❌ $pkg"
    done
    echo ""
    exit 1
fi

echo -e "${BLUE}🎉 All packages published successfully!${NC}"
echo ""
echo -e "${BLUE}Users can now install with:${NC}"
echo -e "  ${GREEN}npm install @clarity-chat/react${NC}"
echo ""
echo -e "${BLUE}View packages at:${NC}"
echo -e "  ${GREEN}https://github.com/christireid/Clarity-ai-chat-components/packages${NC}"
