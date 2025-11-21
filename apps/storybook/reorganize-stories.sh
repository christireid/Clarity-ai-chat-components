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

move_story \
    "$STORIES_DIR/PromptSuggestions.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/PromptSuggestions.stories.tsx" \
    "Advanced/AI/PromptSuggestions"

move_story \
    "$STORIES_DIR/FollowUpSuggestions.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/FollowUpSuggestions.stories.tsx" \
    "Advanced/AI/FollowUpSuggestions"

move_story \
    "$STORIES_DIR/WorkflowSuggestionList.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/WorkflowSuggestionList.stories.tsx" \
    "Advanced/AI/WorkflowSuggestionList"

move_story \
    "$STORIES_DIR/AIOperations.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/AIOperations.stories.tsx" \
    "Advanced/AI/AIOperations"

move_story \
    "$STORIES_DIR/ClarityToolResult.stories.tsx" \
    "$STORIES_DIR/Advanced/AI/ClarityToolResult.stories.tsx" \
    "Advanced/AI/ClarityToolResult"

# ================================================================
# COMPONENTS - DATA DISPLAY (Additional)
# ================================================================
echo ""
echo "📊 Reorganizing Additional Data Display Components..."

move_story \
    "$STORIES_DIR/MessageOptimized.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MessageOptimized.stories.tsx" \
    "Components/DataDisplay/MessageOptimized"

move_story \
    "$STORIES_DIR/MessageMetadata.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MessageMetadata.stories.tsx" \
    "Components/DataDisplay/MessageMetadata"

move_story \
    "$STORIES_DIR/MessageSearch.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MessageSearch.stories.tsx" \
    "Components/DataDisplay/MessageSearch"

move_story \
    "$STORIES_DIR/AdvancedMessageSearch.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/AdvancedMessageSearch.stories.tsx" \
    "Components/DataDisplay/AdvancedMessageSearch"

move_story \
    "$STORIES_DIR/ContextCard.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/ContextCard.stories.tsx" \
    "Components/DataDisplay/ContextCard"

move_story \
    "$STORIES_DIR/AnimatedList.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/AnimatedList.stories.tsx" \
    "Components/DataDisplay/AnimatedList"

move_story \
    "$STORIES_DIR/InteractiveCard.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/InteractiveCard.stories.tsx" \
    "Components/DataDisplay/InteractiveCard"

move_story \
    "$STORIES_DIR/VirtualizedMessageList.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/VirtualizedMessageList.stories.tsx" \
    "Components/DataDisplay/VirtualizedMessageList"

move_story \
    "$STORIES_DIR/ConversationTimeline.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/ConversationTimeline.stories.tsx" \
    "Components/DataDisplay/ConversationTimeline"

move_story \
    "$STORIES_DIR/ConversationBranchVisualizer.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/ConversationBranchVisualizer.stories.tsx" \
    "Components/DataDisplay/ConversationBranchVisualizer"

move_story \
    "$STORIES_DIR/Tooltip.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Tooltip.stories.tsx" \
    "Components/DataDisplay/Tooltip"

move_story \
    "$STORIES_DIR/Progress.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Progress.stories.tsx" \
    "Components/DataDisplay/Progress"

move_story \
    "$STORIES_DIR/Skeleton.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/Skeleton.stories.tsx" \
    "Components/DataDisplay/Skeleton"

move_story \
    "$STORIES_DIR/PersonaPanel.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/PersonaPanel.stories.tsx" \
    "Components/DataDisplay/PersonaPanel"

move_story \
    "$STORIES_DIR/MultiModalPreview.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MultiModalPreview.stories.tsx" \
    "Components/DataDisplay/MultiModalPreview"

move_story \
    "$STORIES_DIR/EnhancedMarkdownRenderer.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/EnhancedMarkdownRenderer.stories.tsx" \
    "Components/DataDisplay/EnhancedMarkdownRenderer"

move_story \
    "$STORIES_DIR/MarkdownRendererEnhanced.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/MarkdownRendererEnhanced.stories.tsx" \
    "Components/DataDisplay/MarkdownRendererEnhanced"

move_story \
    "$STORIES_DIR/EnhancedCodeBlock.stories.tsx" \
    "$STORIES_DIR/Components/DataDisplay/EnhancedCodeBlock.stories.tsx" \
    "Components/DataDisplay/EnhancedCodeBlock"

# ================================================================
# COMPONENTS - INPUTS (Additional)
# ================================================================
echo ""
echo "📝 Reorganizing Additional Input Components..."

move_story \
    "$STORIES_DIR/Input.stories.tsx" \
    "$STORIES_DIR/Components/Inputs/Input.stories.tsx" \
    "Components/Inputs/Input"

# ================================================================
# COMPONENTS - FEEDBACK
# ================================================================
echo ""
echo "💬 Reorganizing Feedback Components..."

move_story \
    "$STORIES_DIR/ThinkingIndicator.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/ThinkingIndicator.stories.tsx" \
    "Components/Feedback/ThinkingIndicator"

move_story \
    "$STORIES_DIR/EmptyState.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/EmptyState.stories.tsx" \
    "Components/Feedback/EmptyState"

move_story \
    "$STORIES_DIR/ErrorBoundary.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/ErrorBoundary.stories.tsx" \
    "Components/Feedback/ErrorBoundary"

move_story \
    "$STORIES_DIR/Toast.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/Toast.stories.tsx" \
    "Components/Feedback/Toast"

move_story \
    "$STORIES_DIR/NetworkStatus.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/NetworkStatus.stories.tsx" \
    "Components/Feedback/NetworkStatus"

move_story \
    "$STORIES_DIR/FeedbackAnimation.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/FeedbackAnimation.stories.tsx" \
    "Components/Feedback/FeedbackAnimation"

move_story \
    "$STORIES_DIR/ResponseQualityMeter.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/ResponseQualityMeter.stories.tsx" \
    "Components/Feedback/ResponseQualityMeter"

move_story \
    "$STORIES_DIR/SafetyStatusCard.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/SafetyStatusCard.stories.tsx" \
    "Components/Feedback/SafetyStatusCard"

move_story \
    "$STORIES_DIR/SessionSummaryCard.stories.tsx" \
    "$STORIES_DIR/Components/Feedback/SessionSummaryCard.stories.tsx" \
    "Components/Feedback/SessionSummaryCard"

# ================================================================
# COMPONENTS - LAYOUT (Additional)
# ================================================================
echo ""
echo "🏗️  Reorganizing Additional Layout Components..."

move_story \
    "$STORIES_DIR/CollapsibleSection.stories.tsx" \
    "$STORIES_DIR/Components/Layout/CollapsibleSection.stories.tsx" \
    "Components/Layout/CollapsibleSection"

move_story \
    "$STORIES_DIR/ConversationList.stories.tsx" \
    "$STORIES_DIR/Components/Layout/ConversationList.stories.tsx" \
    "Components/Layout/ConversationList"

move_story \
    "$STORIES_DIR/ProjectSidebar.stories.tsx" \
    "$STORIES_DIR/Components/Layout/ProjectSidebar.stories.tsx" \
    "Components/Layout/ProjectSidebar"

move_story \
    "$STORIES_DIR/SettingsPanel.stories.tsx" \
    "$STORIES_DIR/Components/Layout/SettingsPanel.stories.tsx" \
    "Components/Layout/SettingsPanel"

# ================================================================
# COMPONENTS - NAVIGATION (Additional)
# ================================================================
echo ""
echo "🧭 Reorganizing Additional Navigation Components..."

move_story \
    "$STORIES_DIR/DropdownMenu.stories.tsx" \
    "$STORIES_DIR/Components/Navigation/DropdownMenu.stories.tsx" \
    "Components/Navigation/DropdownMenu"

move_story \
    "$STORIES_DIR/Popover.stories.tsx" \
    "$STORIES_DIR/Components/Navigation/Popover.stories.tsx" \
    "Components/Navigation/Popover"

move_story \
    "$STORIES_DIR/Draggable.stories.tsx" \
    "$STORIES_DIR/Components/Navigation/Draggable.stories.tsx" \
    "Components/Navigation/Draggable"

# ================================================================
# ADVANCED - MEMORY
# ================================================================
echo ""
echo "🧠 Reorganizing Memory Components..."

move_story \
    "$STORIES_DIR/MemoryInspector.stories.tsx" \
    "$STORIES_DIR/Advanced/Memory/MemoryInspector.stories.tsx" \
    "Advanced/Memory/MemoryInspector"

move_story \
    "$STORIES_DIR/ContextManager.stories.tsx" \
    "$STORIES_DIR/Advanced/Memory/ContextManager.stories.tsx" \
    "Advanced/Memory/ContextManager"

move_story \
    "$STORIES_DIR/ContextVisualizer.stories.tsx" \
    "$STORIES_DIR/Advanced/Memory/ContextVisualizer.stories.tsx" \
    "Advanced/Memory/ContextVisualizer"

move_story \
    "$STORIES_DIR/KnowledgeBaseViewer.stories.tsx" \
    "$STORIES_DIR/Advanced/Memory/KnowledgeBaseViewer.stories.tsx" \
    "Advanced/Memory/KnowledgeBaseViewer"

move_story \
    "$STORIES_DIR/DocumentViewer.stories.tsx" \
    "$STORIES_DIR/Advanced/Memory/DocumentViewer.stories.tsx" \
    "Advanced/Memory/DocumentViewer"

# ================================================================
# ADVANCED - STREAMING
# ================================================================
echo ""
echo "📡 Reorganizing Streaming Components..."

move_story \
    "$STORIES_DIR/StreamBlock.stories.tsx" \
    "$STORIES_DIR/Advanced/Streaming/StreamBlock.stories.tsx" \
    "Advanced/Streaming/StreamBlock"

move_story \
    "$STORIES_DIR/StreamCancellation.stories.tsx" \
    "$STORIES_DIR/Advanced/Streaming/StreamCancellation.stories.tsx" \
    "Advanced/Streaming/StreamCancellation"

move_story \
    "$STORIES_DIR/StreamingTextRenderer.stories.tsx" \
    "$STORIES_DIR/Advanced/Streaming/StreamingTextRenderer.stories.tsx" \
    "Advanced/Streaming/StreamingTextRenderer"

move_story \
    "$STORIES_DIR/StreamingExamples.stories.tsx" \
    "$STORIES_DIR/Advanced/Streaming/StreamingExamples.stories.tsx" \
    "Advanced/Streaming/StreamingExamples"

# ================================================================
# ADVANCED - ANALYTICS
# ================================================================
echo ""
echo "📈 Reorganizing Analytics & Monitoring Components..."

move_story \
    "$STORIES_DIR/PerformanceDashboard.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/PerformanceDashboard.stories.tsx" \
    "Advanced/Analytics/PerformanceDashboard"

move_story \
    "$STORIES_DIR/AnalyticsDashboard.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/AnalyticsDashboard.stories.tsx" \
    "Advanced/Analytics/AnalyticsDashboard"

move_story \
    "$STORIES_DIR/UsageDashboard.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/UsageDashboard.stories.tsx" \
    "Advanced/Analytics/UsageDashboard"

move_story \
    "$STORIES_DIR/TokenOptimizationDashboard.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/TokenOptimizationDashboard.stories.tsx" \
    "Advanced/Analytics/TokenOptimizationDashboard"

move_story \
    "$STORIES_DIR/TokenOptimizationPanel.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/TokenOptimizationPanel.stories.tsx" \
    "Advanced/Analytics/TokenOptimizationPanel"

move_story \
    "$STORIES_DIR/TokenOptimizationBadge.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/TokenOptimizationBadge.stories.tsx" \
    "Advanced/Analytics/TokenOptimizationBadge"

move_story \
    "$STORIES_DIR/TokenOptimization.stories.tsx" \
    "$STORIES_DIR/Advanced/Analytics/TokenOptimization.stories.tsx" \
    "Advanced/Analytics/TokenOptimization"

# ================================================================
# ADVANCED - ENTERPRISE
# ================================================================
echo ""
echo "🏢 Reorganizing Enterprise Components..."

move_story \
    "$STORIES_DIR/AuthTenantDashboard.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/AuthTenantDashboard.stories.tsx" \
    "Advanced/Enterprise/AuthTenantDashboard"

move_story \
    "$STORIES_DIR/SSOConfigWizard.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/SSOConfigWizard.stories.tsx" \
    "Advanced/Enterprise/SSOConfigWizard"

move_story \
    "$STORIES_DIR/SeatInviteDialog.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/SeatInviteDialog.stories.tsx" \
    "Advanced/Enterprise/SeatInviteDialog"

move_story \
    "$STORIES_DIR/ApiTokenManager.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/ApiTokenManager.stories.tsx" \
    "Advanced/Enterprise/ApiTokenManager"

move_story \
    "$STORIES_DIR/AuditLogViewer.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/AuditLogViewer.stories.tsx" \
    "Advanced/Enterprise/AuditLogViewer"

move_story \
    "$STORIES_DIR/SafetyReviewConsole.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/SafetyReviewConsole.stories.tsx" \
    "Advanced/Enterprise/SafetyReviewConsole"

move_story \
    "$STORIES_DIR/EvaluationDashboard.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/EvaluationDashboard.stories.tsx" \
    "Advanced/Enterprise/EvaluationDashboard"

move_story \
    "$STORIES_DIR/BatchExportDialog.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/BatchExportDialog.stories.tsx" \
    "Advanced/Enterprise/BatchExportDialog"

move_story \
    "$STORIES_DIR/ExportDialog.stories.tsx" \
    "$STORIES_DIR/Advanced/Enterprise/ExportDialog.stories.tsx" \
    "Advanced/Enterprise/ExportDialog"

# ================================================================
# HOOKS - CHAT
# ================================================================
echo ""
echo "🪝 Reorganizing Chat Hooks..."

move_story \
    "$STORIES_DIR/UseChat.stories.tsx" \
    "$STORIES_DIR/Hooks/Chat/UseChat.stories.tsx" \
    "Hooks/Chat/UseChat"

move_story \
    "$STORIES_DIR/UseChatEnhanced.stories.tsx" \
    "$STORIES_DIR/Hooks/Chat/UseChatEnhanced.stories.tsx" \
    "Hooks/Chat/UseChatEnhanced"

move_story \
    "$STORIES_DIR/UseClarityChat.stories.tsx" \
    "$STORIES_DIR/Hooks/Chat/UseClarityChat.stories.tsx" \
    "Hooks/Chat/UseClarityChat"

move_story \
    "$STORIES_DIR/UseAssistant.stories.tsx" \
    "$STORIES_DIR/Hooks/Chat/UseAssistant.stories.tsx" \
    "Hooks/Chat/UseAssistant"

move_story \
    "$STORIES_DIR/UseCompletion.stories.tsx" \
    "$STORIES_DIR/Hooks/Chat/UseCompletion.stories.tsx" \
    "Hooks/Chat/UseCompletion"

# ================================================================
# HOOKS - STREAMING
# ================================================================
echo ""
echo "🪝 Reorganizing Streaming Hooks..."

move_story \
    "$STORIES_DIR/UseStreaming.stories.tsx" \
    "$STORIES_DIR/Hooks/Streaming/UseStreaming.stories.tsx" \
    "Hooks/Streaming/UseStreaming"

move_story \
    "$STORIES_DIR/UseStreamableUI.stories.tsx" \
    "$STORIES_DIR/Hooks/Streaming/UseStreamableUI.stories.tsx" \
    "Hooks/Streaming/UseStreamableUI"

move_story \
    "$STORIES_DIR/UseStreamingSSE.stories.tsx" \
    "$STORIES_DIR/Hooks/Streaming/UseStreamingSSE.stories.tsx" \
    "Hooks/Streaming/UseStreamingSSE"

move_story \
    "$STORIES_DIR/UseStreamingWebSocket.stories.tsx" \
    "$STORIES_DIR/Hooks/Streaming/UseStreamingWebSocket.stories.tsx" \
    "Hooks/Streaming/UseStreamingWebSocket"

# ================================================================
# HOOKS - STATE
# ================================================================
echo ""
echo "🪝 Reorganizing State Management Hooks..."

move_story \
    "$STORIES_DIR/UseLocalStorage.stories.tsx" \
    "$STORIES_DIR/Hooks/State/UseLocalStorage.stories.tsx" \
    "Hooks/State/UseLocalStorage"

move_story \
    "$STORIES_DIR/UsePrevious.stories.tsx" \
    "$STORIES_DIR/Hooks/State/UsePrevious.stories.tsx" \
    "Hooks/State/UsePrevious"

move_story \
    "$STORIES_DIR/UseToggle.stories.tsx" \
    "$STORIES_DIR/Hooks/State/UseToggle.stories.tsx" \
    "Hooks/State/UseToggle"

move_story \
    "$STORIES_DIR/UseClarityObject.stories.tsx" \
    "$STORIES_DIR/Hooks/State/UseClarityObject.stories.tsx" \
    "Hooks/State/UseClarityObject"

move_story \
    "$STORIES_DIR/UseMessageOperations.stories.tsx" \
    "$STORIES_DIR/Hooks/State/UseMessageOperations.stories.tsx" \
    "Hooks/State/UseMessageOperations"

# ================================================================
# HOOKS - PERFORMANCE
# ================================================================
echo ""
echo "🪝 Reorganizing Performance Hooks..."

move_story \
    "$STORIES_DIR/UseDebounce.stories.tsx" \
    "$STORIES_DIR/Hooks/Performance/UseDebounce.stories.tsx" \
    "Hooks/Performance/UseDebounce"

move_story \
    "$STORIES_DIR/UseThrottle.stories.tsx" \
    "$STORIES_DIR/Hooks/Performance/UseThrottle.stories.tsx" \
    "Hooks/Performance/UseThrottle"

move_story \
    "$STORIES_DIR/UseTokenTracker.stories.tsx" \
    "$STORIES_DIR/Hooks/Performance/UseTokenTracker.stories.tsx" \
    "Hooks/Performance/UseTokenTracker"

move_story \
    "$STORIES_DIR/UseAutoScroll.stories.tsx" \
    "$STORIES_DIR/Hooks/Performance/UseAutoScroll.stories.tsx" \
    "Hooks/Performance/UseAutoScroll"

# ================================================================
# HOOKS - UTILITIES
# ================================================================
echo ""
echo "🪝 Reorganizing Utility Hooks..."

move_story \
    "$STORIES_DIR/UseClipboard.stories.tsx" \
    "$STORIES_DIR/Hooks/Utilities/UseClipboard.stories.tsx" \
    "Hooks/Utilities/UseClipboard"

move_story \
    "$STORIES_DIR/UseErrorRecovery.stories.tsx" \
    "$STORIES_DIR/Hooks/Utilities/UseErrorRecovery.stories.tsx" \
    "Hooks/Utilities/UseErrorRecovery"

move_story \
    "$STORIES_DIR/UseVoiceInput.stories.tsx" \
    "$STORIES_DIR/Hooks/Utilities/UseVoiceInput.stories.tsx" \
    "Hooks/Utilities/UseVoiceInput"

move_story \
    "$STORIES_DIR/UseWindowSize.stories.tsx" \
    "$STORIES_DIR/Hooks/Utilities/UseWindowSize.stories.tsx" \
    "Hooks/Utilities/UseWindowSize"

move_story \
    "$STORIES_DIR/UseKeyboardShortcuts.stories.tsx" \
    "$STORIES_DIR/Hooks/Utilities/UseKeyboardShortcuts.stories.tsx" \
    "Hooks/Utilities/UseKeyboardShortcuts"

# ================================================================
# EXAMPLES & PATTERNS
# ================================================================
echo ""
echo "🎯 Reorganizing Examples & Patterns..."

move_story \
    "$STORIES_DIR/Templates.stories.tsx" \
    "$STORIES_DIR/Examples/Templates.stories.tsx" \
    "Examples/Templates"

move_story \
    "$STORIES_DIR/CompositeExamples.stories.tsx" \
    "$STORIES_DIR/Examples/CompositeExamples.stories.tsx" \
    "Examples/CompositeExamples"

move_story \
    "$STORIES_DIR/AdvancedInteractions.stories.tsx" \
    "$STORIES_DIR/Examples/AdvancedInteractions.stories.tsx" \
    "Examples/AdvancedInteractions"

move_story \
    "$STORIES_DIR/AiExperience.stories.tsx" \
    "$STORIES_DIR/Examples/AiExperience.stories.tsx" \
    "Examples/AiExperience"

move_story \
    "$STORIES_DIR/IndustrySolutions.stories.tsx" \
    "$STORIES_DIR/Examples/IndustrySolutions.stories.tsx" \
    "Examples/IndustrySolutions"

move_story \
    "$STORIES_DIR/Enterprise.stories.tsx" \
    "$STORIES_DIR/Examples/Enterprise.stories.tsx" \
    "Examples/Enterprise"

move_story \
    "$STORIES_DIR/Hooks.stories.tsx" \
    "$STORIES_DIR/Examples/HooksShowcase.stories.tsx" \
    "Examples/HooksShowcase"

# ================================================================
# FOUNDATION (Additional)
# ================================================================
echo ""
echo "🎨 Reorganizing Additional Foundation Components..."

move_story \
    "$STORIES_DIR/ThemePreview.stories.tsx" \
    "$STORIES_DIR/Foundation/ThemePreview.stories.tsx" \
    "Foundation/ThemePreview"

move_story \
    "$STORIES_DIR/ThemeSelector.stories.tsx" \
    "$STORIES_DIR/Foundation/ThemeSelector.stories.tsx" \
    "Foundation/ThemeSelector"

echo ""
echo "✅ Story reorganization complete!"
echo ""
echo "📊 Summary:"
echo "  ✓ Input Components: 8 stories"
echo "  ✓ Data Display: 18 stories"
echo "  ✓ Feedback: 9 stories"
echo "  ✓ Layout: 7 stories"
echo "  ✓ Navigation: 5 stories"
echo "  ✓ AI Components: 9 stories"
echo "  ✓ Memory: 5 stories"
echo "  ✓ Streaming: 4 stories"
echo "  ✓ Analytics: 7 stories"
echo "  ✓ Enterprise: 9 stories"
echo "  ✓ Chat Hooks: 5 stories"
echo "  ✓ Streaming Hooks: 4 stories"
echo "  ✓ State Hooks: 5 stories"
echo "  ✓ Performance Hooks: 4 stories"
echo "  ✓ Utility Hooks: 5 stories"
echo "  ✓ Examples: 7 stories"
echo "  ✓ Foundation: 2 additional stories"
echo ""
echo "Next steps:"
echo "1. Review the moved stories"
echo "2. Create overview pages for new categories"
echo "3. Test that all stories render correctly"
echo "4. Run 'pnpm dev' to verify"
echo "5. Delete old story files once verified"
