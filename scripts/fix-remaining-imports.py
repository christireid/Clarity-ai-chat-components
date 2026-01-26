#!/usr/bin/env python3

"""Fix remaining kebab-case imports that the main script missed"""

import re
from pathlib import Path

# Mapping of kebab-case to PascalCase (components only)
COMPONENT_MAPPINGS = {
    'chain-of-thought': 'ChainOfThought',
    'thinking-bar': 'ThinkingBar',
    'tool-execution-card': 'ToolExecutionCard',
    'streaming-progress': 'StreamingProgress',
    'text-shimmer': 'TextShimmer',
    'collaborative-editing': 'CollaborativeEditing',
    'floating-chat-widget': 'FloatingChatWidget',
    'offline-chat-sync': 'OfflineChatSync',
    'chat-sync-status': 'ChatSyncStatus',
    'tanstack-message-list': 'TanstackMessageList',
    'flowtoken-adapter': 'FlowtokenAdapter',
    'resizable-chat-layout': 'ResizableChatLayout',
    'message-search': 'MessageSearch',
    'prompt-container': 'PromptContainer',
    'suggestion-cards': 'SuggestionCards',
    'prompt-suggestions': 'PromptSuggestions',
    'sonner-toast': 'SonnerToast',
    'token-usage-meter': 'TokenUsageMeter',
    'token-budget-bar': 'TokenBudgetBar',
    'document-integration': 'DocumentIntegration',
    'console-alert-handler': 'ConsoleAlertHandler',
    'error-boundary': 'ErrorBoundary',
    'chat-recipes': 'ChatRecipes',
    'clarity-chat': 'ClarityChat',
    'clarity-chat-simple': 'ClarityChatSimple',
    'chat-with-error-boundary': 'ChatWithErrorBoundary',
    'virtualized-message-list': 'VirtualizedMessageList',
    'command-palette-enhanced': 'CommandPaletteEnhanced',
    'focus-indicator': 'FocusIndicator',
    'keyboard-hint': 'KeyboardHint',
    'keyboard-hints-overlay': 'KeyboardHintsOverlay',
    'keyboard-shortcut-hint': 'KeyboardShortcutHint',
    'keyboard-shortcuts-modal': 'KeyboardShortcutsModal',
    'skip-links': 'SkipLinks',
    'theme-preview-thumbnail': 'ThemePreviewThumbnail',
    'theme-selector': 'ThemeSelector',
    'theme-contrast-checker': 'ThemeContrastChecker',
    'dashboard-progress': 'DashboardProgress',
    'dashboard-skeleton': 'DashboardSkeleton',
    'empty-state': 'EmptyState',
    'error-message': 'ErrorMessage',
    'mention-system': 'MentionSystem',
    'output-preference-selector': 'OutputPreferenceSelector',
    'typing-indicator': 'TypingIndicator',
    'message-actions-secure': 'MessageActionsSecure',
    'conversation-sharing': 'ConversationSharing',
    'history-manager': 'HistoryManager',
    'user-interaction-analytics': 'UserInteractionAnalytics',
    'response-quality-meter': 'ResponseQualityMeter',
    'chat-window-header': 'ChatWindowHeader',
    'source-citation': 'SourceCitation',
    'link-preview': 'LinkPreview',
    'ai-ops': 'AiOps',
    'theme-components': 'ThemeComponents',
}

def fix_file_imports(file_path: Path) -> bool:
    """Fix imports in a single file"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original = content

        for kebab, pascal in COMPONENT_MAPPINGS.items():
            # Pattern: from './kebab-case' or from '../path/kebab-case'
            pattern = rf"from (['\"])(\./|../(?:[\w-]+/)*){kebab}(['\"])"
            replacement = rf"from \1\2{pascal}\3"
            content = re.sub(pattern, replacement, content)

        if content != original:
            file_path.write_text(content, encoding='utf-8')
            return True
        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    repo_root = Path("/Users/christireid/Dev/Clarity-ai-chat-components")
    src_dir = repo_root / "packages/react/src"

    print("Fixing remaining kebab-case imports...")

    files_updated = 0
    for pattern in ["*.ts", "*.tsx"]:
        for file_path in src_dir.rglob(pattern):
            if "__tests__" in str(file_path) or "node_modules" in str(file_path):
                continue

            if fix_file_imports(file_path):
                rel_path = file_path.relative_to(repo_root)
                print(f"  Fixed: {rel_path}")
                files_updated += 1

    print(f"\n✅ Updated {files_updated} files")

if __name__ == '__main__':
    main()
