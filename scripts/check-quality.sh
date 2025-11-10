#!/bin/bash

###############################################################################
# Quality Check Script
# 
# Runs all quality checks before pushing or releasing
# Run: bash scripts/check-quality.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

CHECKS_PASSED=0
CHECKS_FAILED=0

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     Clarity Chat - Quality Checks                        ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Function to run a check
run_check() {
    local name=$1
    local command=$2
    
    echo -e "${BLUE}Running: ${name}...${NC}"
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${name} passed${NC}"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ ${name} failed${NC}"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Run checks
run_check "Format Check" "npm run format:check"
run_check "Linting" "npm run lint"
run_check "Type Checking" "npm run typecheck"
echo ""
echo -e "${BLUE}Running tests (this may take a minute)...${NC}"
if npm run test > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Tests passed${NC}"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}❌ Tests failed${NC}"
    ((CHECKS_FAILED++))
fi

run_check "Build" "npm run build"
run_check "Bundle Size" "npm run size"

# Summary
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║  Quality Check Results                                    ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "Passed: ${GREEN}${CHECKS_PASSED}${NC}"
echo -e "Failed: ${RED}${CHECKS_FAILED}${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All quality checks passed! Ready to push.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix before pushing.${NC}"
    echo ""
    echo "Run individual checks to see details:"
    echo "  npm run format:check"
    echo "  npm run lint"
    echo "  npm run typecheck"
    echo "  npm run test"
    echo "  npm run build"
    echo ""
    exit 1
fi
