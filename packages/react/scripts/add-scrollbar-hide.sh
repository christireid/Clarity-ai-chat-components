#!/bin/bash
# Add scrollbar-hide class to all overflow containers

# List of files with overflow classes
files=(
  "src/components/context/SettingsPanel.tsx"
  "src/components/context/ContextVisualizer.tsx"
  "src/components/chat/MobileChatOptimized.tsx"
  "src/components/chat/FloatingChatWidget.tsx"
  "src/components/chat/SlashCommandMenu.tsx"
  "src/components/chat/ResizableChatLayout.tsx"
  "src/components/chat/TanstackMessageList.tsx"
  "src/components/enterprise/ApiTokenManager.tsx"
  "src/components/input/VoiceInput.tsx"
  "src/components/input/MentionSystem.tsx"
  "src/components/input/AdvancedChatInput.tsx"
  "src/components/code/StreamingCodeBlock.tsx"
  "src/components/code/CodeBlock.tsx"
  "src/components/navigation/CommandPaletteEnhanced.tsx"
  "src/components/navigation/CommandPalette.tsx"
  "src/components/navigation/KeyboardHint.tsx"
  "src/components/navigation/KeyboardShortcutsModal.tsx"
  "src/components/message/StreamingMessage.tsx"
  "src/components/message/EditableMessageContent.tsx"
  "src/components/message/MessageOptimized.tsx"
  "src/components/message/MessageThreadView.tsx"
  "src/components/message/ClarityToolResult.tsx"
  "src/components/message/ToolInvocationCard.tsx"
  "src/components/feedback/ErrorMessage.tsx"
  "src/components/search/AdvancedMessageSearchSemantic.tsx"
  "src/components/search/components/SavedSearchesPanel.tsx"
  "src/components/search/MessageSearch.tsx"
  "src/components/search/semantic/components/SemanticSearchHistory.tsx"
  "src/components/prompt/PromptVersionHistory.tsx"
  "src/components/prompt/PromptPlayground.tsx"
  "src/components/dashboards/UserInteractionAnalytics.tsx"
  "src/components/ai/EnhancedCodeBlock.tsx"
  "src/components/ai/ModelSelector.tsx"
  "src/components/ai/AuditLogViewer.tsx"
  "src/components/ai/ToolExecutionCard.tsx"
  "src/components/ai/EnhancedMarkdownRenderer.tsx"
  "src/components/theme-components/ThemeCustomizer/index.tsx"
  "src/components/theme-components/ThemeCustomizer/Preview.tsx"
  "src/components/theme-components/ThemeSelector.tsx"
  "src/components/ai-ops/PromptTestHarness.tsx"
  "src/components/demos/prompt-architect/PromptArchitectDemo.tsx"
  "src/components/demos/prompt-architect/components/PreviewPane.tsx"
  "src/components/demos/prompt-architect/components/ErrorFallback.tsx"
  "src/components/demos/prompt-architect/components/DebugView.tsx"
  "src/components/demos/prompt-architect/components/VersionSelector.tsx"
  "src/components/demos/prompt-architect/components/PresetSelector.tsx"
  "src/components/conversation/ConversationList.tsx"
  "src/components/conversation/ConversationSharing.tsx"
  "src/components/media/DocumentViewer.tsx"
  "src/components/media/DocumentIntegration.tsx"
)

cd "$(dirname "$0")/.."

echo "Adding scrollbar-hide to overflow containers..."
count=0

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Add scrollbar-hide to overflow classes (if not already present)
    if grep -q "overflow-y-auto\|overflow-x-auto\|overflow-auto" "$file"; then
      # Use sed to add scrollbar-hide to overflow classes
      sed -i '' -E 's/overflow-(y-|x-)?auto([^"])/overflow-\1auto scrollbar-hide\2/g' "$file"
      # Remove duplicate scrollbar-hide if it was already there
      sed -i '' 's/scrollbar-hide scrollbar-hide/scrollbar-hide/g' "$file"
      ((count++))
      echo "✓ Updated $file"
    fi
  else
    echo "✗ File not found: $file"
  fi
done

echo ""
echo "✅ Added scrollbar-hide to $count files"
