#!/bin/bash

# Story Reorganization Script
# This script helps move stories to their new locations and updates their titles

set -e

STORIES_DIR="/Users/christireid/Dev/Clarity-ai-chat-components/apps/storybook/stories"

echo "🚀 Starting story reorganization..."
echo ""

# Function to move and update a story
move_story() {
    local source=$1
    local dest=$2
    local new_title=$3

    if [ -f "$source" ]; then
        echo "  Moving: $(basename $source) → $dest"

        # Create destination directory if it doesn't exist
        mkdir -p "$(dirname $dest)"

        # Copy the file
        cp "$source" "$dest"

        # Update the title in the new file (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|title: '[^']*'|title: '$new_title'|g" "$dest"
        else
            sed -i "s|title: '[^']*'|title: '$new_title'|g" "$dest"
        fi

        echo "    ✓ Updated title to: $new_title"
    else
        echo "    ⚠ Source file not found: $source"
    fi
}

# ================================================================
# COMPONENTS - INPUTS
# ================================================================
echo "📝 Reorganizing Input Components..."

move_story \
    "$STORIES_DIR/Button.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/Button.stories.tsx" \
    "Components/Inputs/Button"

move_story \
    "$STORIES_DIR/ChatInput.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/ChatInput.stories.tsx" \
    "Components/Inputs/ChatInput"

move_story \
    "$STORIES_DIR/AdvancedChatInput.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/AdvancedChatInput.stories.tsx" \
    "Components/Inputs/AdvancedChatInput"

move_story \
    "$STORIES_DIR/Textarea.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/Textarea.stories.tsx" \
    "Components/Inputs/Textarea"

move_story \
    "$STORIES_DIR/Checkbox.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/Checkbox.stories.tsx" \
    "Components/Inputs/Checkbox"

move_story \
    "$STORIES_DIR/VoiceInput.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/VoiceInput.stories.tsx" \
    "Components/Inputs/VoiceInput"

move_story \
    "$STORIES_DIR/FileUpload.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/FileUpload.stories.tsx" \
    "Components/Inputs/FileUpload"

# ================================================================
# COMPONENTS - DATA DISPLAY
# ================================================================
echo ""
echo "📊 Reorganizing Data Display Components..."

move_story \
    "$STORIES_DIR/Message.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Message.stories.tsx" \
    "Components/DataDisplay/Message"

move_story \
    "$STORIES_DIR/MessageEssentials.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MessageEssentials.stories.tsx" \
    "Components/DataDisplay/MessageEssentials"

move_story \
    "$STORIES_DIR/MessageList.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MessageList.stories.tsx" \
    "Components/DataDisplay/MessageList"

move_story \
    "$STORIES_DIR/StreamingMessage.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/StreamingMessage.stories.tsx" \
    "Components/DataDisplay/StreamingMessage"

move_story \
    "$STORIES_DIR/TokenCounter.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/TokenCounter.stories.tsx" \
    "Components/DataDisplay/TokenCounter"

move_story \
    "$STORIES_DIR/Avatar.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Avatar.stories.tsx" \
    "Components/DataDisplay/Avatar"

move_story \
    "$STORIES_DIR/Badge.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Badge.stories.tsx" \
    "Components/DataDisplay/Badge"

move_story \
    "$STORIES_DIR/Card.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Card.stories.tsx" \
    "Components/DataDisplay/Card"

move_story \
    "$STORIES_DIR/CitationCard.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/CitationCard.stories.tsx" \
    "Components/DataDisplay/CitationCard"

# ================================================================
# COMPONENTS - LAYOUT
# ================================================================
echo ""
echo "🏗️  Reorganizing Layout Components..."

move_story \
    "$STORIES_DIR/ChatWindow.stories.tsx" \
    "$STORIES_DIR/Components/Layout/ChatWindow.stories.tsx" \
    "Components/Layout/ChatWindow"

move_story \
    "$STORIES_DIR/Dialog.stories.tsx" \
    "$STORIES_DIR/Components/Layout/Dialog.stories.tsx" \
    "Components/Layout/Dialog"

move_story \
    "$STORIES_DIR/Drawer.stories.tsx" \
    "$STORIES_DIR/Components/Layout/Drawer.stories.tsx" \
    "Components/Layout/Drawer"

# ================================================================
# COMPONENTS - NAVIGATION
# ================================================================
echo ""
echo "🧭 Reorganizing Navigation Components..."

move_story \
    "$STORIES_DIR/CommandPalette.stories.tsx" \
    "$STORIES_DIR/Components/Navigation/CommandPalette.stories.tsx" \
    "Components/Navigation/CommandPalette"

move_story \
    "$STORIES_DIR/ContextMenu.stories.tsx" \
    "$STORIES_DIR/Components/Navigation/ContextMenu.stories.tsx" \
    "Components/Navigation/ContextMenu"

# ================================================================
# ADVANCED - AI
# ================================================================
echo ""
echo "🤖 Reorganizing AI Components..."

move_story \
    "$STORIES_DIR/AgentRunFeed.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/AgentRunFeed.stories.tsx" \
    "Advanced/AI/AgentRunFeed"

move_story \
    "$STORIES_DIR/ToolInvocationCard.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/ToolInvocationCard.stories.tsx" \
    "Advanced/AI/ToolInvocationCard"

move_story \
    "$STORIES_DIR/PromptLibrary.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/PromptLibrary.stories.tsx" \
    "Advanced/AI/PromptLibrary"

echo ""
echo "✅ Story reorganization complete!"
echo ""
echo "Next steps:"
echo "1. Review the moved stories"
echo "2. Test that all stories render correctly"
echo "3. Run 'pnpm dev' to verify"
echo "4. Delete old story files once verified"
