#!/bin/bash
# Pre-Launch Verification Script
# Verifies everything is ready for v2.0 launch

set -e

echo "🔍 Clarity Chat v2.0 - Launch Readiness Verification"
echo "====================================================="
echo ""

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((ERRORS++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "$1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 1. Check Git Status
section "1️⃣  Git Repository"

if git diff-index --quiet HEAD --; then
    pass "No uncommitted changes"
else
    warn "Uncommitted changes detected"
fi

if git tag | grep -q "v2.0.0"; then
    pass "v2.0.0 tag exists"
else
    fail "v2.0.0 tag missing"
fi

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    pass "On main branch"
else
    warn "Not on main branch (current: $CURRENT_BRANCH)"
fi

# 2. Check Package Builds
section "2️⃣  Package Builds"

if [ -d "packages/primitives/dist" ]; then
    pass "Primitives built"
else
    fail "Primitives not built (run: npm run build --workspace=@clarity-chat/primitives)"
fi

if [ -d "packages/react/dist" ]; then
    pass "React package built"
else
    fail "React package not built (run: npm run build --workspace=@clarity-chat/react)"
fi

# 3. Check Storybook
section "3️⃣  Storybook"

if [ -d "apps/storybook/storybook-static" ]; then
    SIZE=$(du -sh apps/storybook/storybook-static | cut -f1)
    pass "Storybook built ($SIZE)"
    
    if [ -f "apps/storybook/storybook-static/index.html" ]; then
        pass "Storybook index.html exists"
    else
        fail "Storybook index.html missing"
    fi
else
    fail "Storybook not built (run: npm run build --workspace=@clarity-chat/storybook)"
fi

if [ -x "apps/storybook/DEPLOY.sh" ]; then
    pass "Deployment script executable"
else
    warn "Deployment script not executable (run: chmod +x apps/storybook/DEPLOY.sh)"
fi

# 4. Check Documentation
section "4️⃣  Documentation"

REQUIRED_DOCS=(
    "README.md"
    "UI_UX_ENHANCEMENT_COMPLETE.md"
    "DESIGN_SYSTEM_GUIDE_V2.md"
    "SOCIAL_MEDIA_ANNOUNCEMENTS.md"
    "STORYBOOK_FIX_SUMMARY.md"
    "🎉_STORYBOOK_READY_TO_DEPLOY.md"
    "🎊_COMPLETE_SUCCESS_REPORT.md"
)

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ -f "$doc" ]; then
        pass "$doc exists"
    else
        fail "$doc missing"
    fi
done

# Check README has v2.0 announcement
if grep -q "NEW in v2.0" README.md; then
    pass "README has v2.0 announcement"
else
    warn "README missing v2.0 announcement"
fi

# 5. Check Enhanced Components
section "5️⃣  Enhanced Components"

ENHANCED_COUNT=0

# Check primitives
PRIMITIVES=(
    "packages/primitives/src/components/button.tsx"
    "packages/primitives/src/components/input.tsx"
    "packages/primitives/src/components/card.tsx"
    "packages/primitives/src/components/badge.tsx"
    "packages/primitives/src/components/dialog.tsx"
)

for component in "${PRIMITIVES[@]}"; do
    if [ -f "$component" ]; then
        # Check for v2.0 enhancements (rounded-xl, shadow system, etc.)
        if grep -q "rounded-xl\|shadow-xs\|ease-out" "$component"; then
            ((ENHANCED_COUNT++))
        fi
    fi
done

if [ $ENHANCED_COUNT -ge 5 ]; then
    pass "Primitives enhanced ($ENHANCED_COUNT components verified)"
else
    warn "Only $ENHANCED_COUNT primitives verified as enhanced"
fi

# Check React components
REACT_COMPONENTS=(
    "packages/react/src/components/chat-window.tsx"
    "packages/react/src/components/chat-input.tsx"
    "packages/react/src/components/voice-input.tsx"
)

REACT_ENHANCED=0
for component in "${REACT_COMPONENTS[@]}"; do
    if [ -f "$component" ] && grep -q "shadow-\|ease-\|cubic-bezier" "$component"; then
        ((REACT_ENHANCED++))
    fi
done

if [ $REACT_ENHANCED -ge 2 ]; then
    pass "React components enhanced ($REACT_ENHANCED verified)"
else
    warn "Only $REACT_ENHANCED React components verified"
fi

# 6. Check Design Tokens
section "6️⃣  Design Tokens"

if [ -f "tailwind.config.js" ]; then
    if grep -q "shadow-xs\|shadow-sm\|shadow-md" tailwind.config.js; then
        pass "Shadow system in tailwind.config.js"
    else
        fail "Shadow system missing from tailwind.config.js"
    fi
    
    if grep -q "smooth.*cubic-bezier\|snappy.*cubic-bezier" tailwind.config.js; then
        pass "Custom timing functions defined"
    else
        warn "Custom timing functions not found"
    fi
fi

if [ -f "styles/globals.css" ] || [ -f "packages/primitives/src/styles/globals.css" ]; then
    pass "Global styles exist"
else
    warn "Global styles file not found"
fi

# 7. Check Launch Materials
section "7️⃣  Launch Materials"

if [ -f "SOCIAL_MEDIA_ANNOUNCEMENTS.md" ]; then
    TEMPLATE_COUNT=$(grep -c "^###" SOCIAL_MEDIA_ANNOUNCEMENTS.md || echo 0)
    if [ "$TEMPLATE_COUNT" -gt 5 ]; then
        pass "Social media templates ready ($TEMPLATE_COUNT templates)"
    else
        warn "Limited social media templates ($TEMPLATE_COUNT found)"
    fi
fi

# Check if GitHub release notes are ready
if grep -q "GitHub Release Notes" SOCIAL_MEDIA_ANNOUNCEMENTS.md 2>/dev/null; then
    pass "GitHub release notes template ready"
else
    warn "GitHub release notes template not found"
fi

# 8. Check Examples
section "8️⃣  Example Applications"

EXAMPLE_COUNT=0
if [ -d "examples" ]; then
    EXAMPLE_COUNT=$(find examples -maxdepth 1 -type d | wc -l)
    ((EXAMPLE_COUNT--)) # Subtract parent dir
    
    if [ $EXAMPLE_COUNT -gt 0 ]; then
        pass "Example applications exist ($EXAMPLE_COUNT found)"
    else
        warn "No example applications found"
    fi
fi

# 9. Dependencies
section "9️⃣  Dependencies"

if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        pass "npm available"
    else
        fail "npm not installed"
    fi
    
    if [ -d "node_modules" ]; then
        pass "Dependencies installed"
    else
        warn "node_modules missing (run: npm install)"
    fi
fi

# 10. Deployment Readiness
section "🔟 Deployment Readiness"

if command -v vercel &> /dev/null; then
    pass "Vercel CLI installed"
else
    info "Vercel CLI not installed (optional, can install on demand)"
fi

if command -v netlify &> /dev/null; then
    pass "Netlify CLI installed"
else
    info "Netlify CLI not installed (optional, can install on demand)"
fi

# Final Summary
section "📊 Summary"

echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ PERFECT! Everything is ready for launch!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Deploy Storybook: ./apps/storybook/DEPLOY.sh"
    echo "   2. Post announcements: See SOCIAL_MEDIA_ANNOUNCEMENTS.md"
    echo "   3. Create GitHub release from v2.0.0 tag"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚠️  Ready with $WARNINGS warning(s)${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "You can proceed with launch, but consider addressing warnings."
    echo ""
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Please fix errors before launching."
    echo ""
    exit 1
fi

echo ""
echo "Report generated: $(date)"
echo ""
