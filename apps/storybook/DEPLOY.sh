#!/bin/bash
# Storybook Deployment Script
# Run this to deploy Storybook to production

set -e

echo "🚀 Clarity Chat Storybook Deployment"
echo "===================================="
echo ""

# Check if build exists
if [ ! -d "storybook-static" ]; then
    echo "❌ Build not found. Running build first..."
    npm run build
    echo "✅ Build complete!"
    echo ""
fi

echo "Choose deployment method:"
echo "1) Vercel (Recommended - Fast)"
echo "2) Netlify (Easy)"
echo "3) Chromatic (Best - includes visual testing)"
echo "4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying to Vercel..."
        echo "=========================="
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo ""
        echo "Follow these steps:"
        echo "1. Login with your GitHub account"
        echo "2. Select or create a project"
        echo "3. Accept default settings"
        echo ""
        
        vercel --prod ./storybook-static
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Your Storybook is now live! 🎉"
        ;;
        
    2)
        echo ""
        echo "📦 Deploying to Netlify..."
        echo "=========================="
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo ""
        echo "Follow these steps:"
        echo "1. Login with your preferred account"
        echo "2. Select or create a site"
        echo "3. Accept default settings"
        echo ""
        
        netlify deploy --prod --dir=storybook-static
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Your Storybook is now live! 🎉"
        ;;
        
    3)
        echo ""
        echo "📦 Deploying to Chromatic..."
        echo "============================"
        
        # Check if chromatic is installed
        if ! npm list chromatic &> /dev/null; then
            echo "Installing Chromatic..."
            npm install --save-dev chromatic
        fi
        
        echo ""
        echo "📝 You'll need a Chromatic project token:"
        echo "1. Go to: https://www.chromatic.com/"
        echo "2. Sign in with GitHub"
        echo "3. Create a new project"
        echo "4. Copy the project token"
        echo ""
        read -p "Enter your Chromatic project token: " token
        
        if [ -z "$token" ]; then
            echo "❌ Token required. Exiting."
            exit 1
        fi
        
        echo ""
        echo "Deploying and running visual tests..."
        npx chromatic --project-token="$token"
        
        echo ""
        echo "✅ Deployment complete with visual testing!"
        echo "Your Storybook is now live with visual regression! 🎉"
        ;;
        
    4)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📝 Next steps:"
echo "1. Copy your Storybook URL"
echo "2. Update README.md with the URL"
echo "3. Share in your social media announcements"
echo "4. Add to GitHub repo description"
echo ""
echo "See 🎉_STORYBOOK_READY_TO_DEPLOY.md for more details"
