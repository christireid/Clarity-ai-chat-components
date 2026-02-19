#!/bin/bash
# Quick Launch Helper - Interactive guide through launch process

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🚀 Clarity Chat v2.0 - Quick Launch Assistant         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This script will guide you through launching v2.0 in 30 minutes!"
echo ""

# Check if everything is ready
echo "📋 Checking if everything is ready..."
if [ -d "apps/storybook/storybook-static" ] && [ -f "apps/storybook/DEPLOY.sh" ]; then
    echo "✅ All systems ready!"
else
    echo "❌ Something is missing. Run: ./scripts/verify-launch-ready.sh"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   QUICK LAUNCH PLAN (30 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Deploy Storybook (5 min)"
echo "2. Post to Twitter (2 min)"
echo "3. Post to LinkedIn (5 min)"
echo "4. Create GitHub Release (8 min)"
echo "5. Post to Reddit (5 min)"
echo "6. Update README (5 min)"
echo ""
echo "Ready to start?"
read -p "Press Enter to continue or Ctrl+C to exit..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   STEP 1: Deploy Storybook (5 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "We'll now deploy your Storybook to Vercel (fastest option)"
echo ""
read -p "Ready to deploy? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd apps/storybook
    ./DEPLOY.sh
    cd ../..
    
    echo ""
    echo "📝 IMPORTANT: Copy your Storybook URL!"
    read -p "Paste your Storybook URL here: " STORYBOOK_URL
    
    if [ -z "$STORYBOOK_URL" ]; then
        echo "⚠️  No URL provided. You can add it later."
        STORYBOOK_URL="[YOUR_STORYBOOK_URL]"
    fi
else
    echo "Skipping deployment. You can run ./apps/storybook/DEPLOY.sh later"
    STORYBOOK_URL="[YOUR_STORYBOOK_URL]"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   STEP 2: Twitter Post (2 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Copy this tweet:"
echo ""
echo "🚀 Clarity Chat v2.0 is here!"
echo ""
echo "✨ 50+ components with world-class UI/UX"
echo "⚡ 6-level shadow system"
echo "🎨 Professional animations"
echo "♿ WCAG AA with AAA targets"
echo ""
echo "GitHub: https://github.com/YOUR_USERNAME/Clarity-ai-chat-components"
echo "Storybook: $STORYBOOK_URL"
echo ""
echo "#React #OpenSource #DesignSystem #AI #ChatUI"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Posted to Twitter? (y/n): " -n 1 -r
echo

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   STEP 3: LinkedIn Post (5 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Open: SOCIAL_MEDIA_ANNOUNCEMENTS.md"
echo "Find: LinkedIn section"
echo "Copy: Professional announcement"
echo "Add: Your Storybook URL ($STORYBOOK_URL)"
echo "Post to LinkedIn"
echo ""
read -p "Posted to LinkedIn? (y/n): " -n 1 -r
echo

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   STEP 4: GitHub Release (8 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Go to: https://github.com/YOUR_USERNAME/Clarity-ai-chat-components/releases/new"
echo "2. Select tag: v2.0.0-ui-ux-elevation"
echo "3. Title: v2.0.0: UI/UX Elevation - World-Class Design System"
echo "4. Copy content from: GITHUB_RELEASE.md"
echo "5. Publish release"
echo ""
read -p "Created GitHub release? (y/n): " -n 1 -r
echo

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   STEP 5: Reddit Post (5 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Go to: https://reddit.com/r/reactjs"
echo "Title: v2.0 of my AI chat component library - obsessed over every pixel"
echo "Copy post from: SOCIAL_MEDIA_ANNOUNCEMENTS.md (Reddit section)"
echo "Add your URLs"
echo "Post!"
echo ""
read -p "Posted to Reddit? (y/n): " -n 1 -r
echo

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   STEP 6: Update README (5 minutes)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "If you haven't already, add Storybook badge to README:"
echo ""
echo "[![Storybook](https://img.shields.io/badge/Storybook-Live-ff4785)](STORYBOOK_URL)"
echo ""
echo "Replace [YOUR_STORYBOOK_URL] placeholders in:"
echo "- README.md"
echo "- SOCIAL_MEDIA_ANNOUNCEMENTS.md"
echo ""
read -p "Updated README? (y/n): " -n 1 -r
echo

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🎉 LAUNCH COMPLETE! 🎉                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Storybook deployed: $STORYBOOK_URL"
echo "✅ Posted to Twitter"
echo "✅ Posted to LinkedIn"
echo "✅ Created GitHub release"
echo "✅ Posted to Reddit"
echo "✅ Updated README"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   WHAT'S NEXT?"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Track metrics (see LAUNCH_CHECKLIST.md)"
echo "💬 Engage with comments (respond within 24hrs)"
echo "🎨 Create graphics (see VISUAL_ASSETS_GUIDE.md)"
echo "📝 Write Dev.to article (this week)"
echo "🚀 Plan Product Hunt launch (next week)"
echo ""
echo "📚 Resources:"
echo "- Full checklist: LAUNCH_CHECKLIST.md"
echo "- 3-month roadmap: 🎯_STRATEGIC_RECOMMENDATIONS.md"
echo "- Success metrics: Track GitHub stars, npm downloads"
echo ""
echo "🎊 Congratulations on launching v2.0!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
