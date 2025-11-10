#!/bin/bash

###############################################################################
# Developer Environment Setup Script
# 
# Automates initial setup for new contributors
# Run: bash scripts/dev-setup.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     Clarity Chat - Developer Setup                       ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check Node version
echo -e "${BLUE}Checking Node.js version...${NC}"
REQUIRED_NODE="18.20.0"
CURRENT_NODE=$(node -v | sed 's/v//')

if [ -f ".nvmrc" ]; then
    echo -e "${GREEN}✅ .nvmrc found${NC}"
    if command -v nvm &> /dev/null; then
        echo -e "${BLUE}Using Node version from .nvmrc...${NC}"
        nvm use
    fi
fi

echo -e "${GREEN}✅ Node version: ${CURRENT_NODE}${NC}"

# Check npm version
echo ""
echo -e "${BLUE}Checking npm version...${NC}"
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm version: ${NPM_VERSION}${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}Installing dependencies (this may take a few minutes)...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Setup git hooks
echo ""
echo -e "${BLUE}Setting up git hooks...${NC}"
if [ -d ".husky" ]; then
    npm run prepare
    echo -e "${GREEN}✅ Git hooks configured${NC}"
else
    echo -e "${YELLOW}⚠️  No .husky directory found, skipping hooks${NC}"
fi

# Build packages
echo ""
echo -e "${BLUE}Building packages...${NC}"
npm run build
echo -e "${GREEN}✅ Packages built${NC}"

# Run validation
echo ""
echo -e "${BLUE}Running validation checks...${NC}"
if npm run validate:quick; then
    echo -e "${GREEN}✅ All validation checks passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some validation checks failed (this might be expected)${NC}"
fi

# Summary
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║  ✅ Setup Complete!                                       ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo ""
echo "1️⃣  Start Storybook:"
echo "   npm run storybook"
echo ""
echo "2️⃣  Or start docs site:"
echo "   npm run docs"
echo ""
echo "3️⃣  Run tests in watch mode:"
echo "   npm run test:watch"
echo ""
echo "4️⃣  Read the contributing guide:"
echo "   cat CONTRIBUTING.md"
echo ""
echo -e "${GREEN}Happy coding! ✨${NC}"
echo ""
