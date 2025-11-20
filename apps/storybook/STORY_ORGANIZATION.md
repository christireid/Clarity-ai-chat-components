# Story Organization Plan

## Overview

This document outlines the complete reorganization of 132+ stories into a clear, intuitive hierarchy. Each story will be moved to its appropriate category with consistent naming and structure.

## New Directory Structure

```
stories/
├── Welcome/                    ✅ COMPLETE
│   ├── Introduction.mdx
│   ├── GettingStarted.mdx
│   ├── Playground.stories.tsx
│   └── WhatsNew.mdx
│
├── Foundation/                 ✅ COMPLETE
│   ├── Overview.mdx
│   ├── ColorsThemes.stories.tsx
│   ├── Typography.stories.tsx
│   ├── SpacingLayout.stories.tsx
│   ├── Motion.stories.tsx
│   └── Iconography.stories.tsx
│
├── Components/                 🚧 IN PROGRESS
│   ├── Overview.mdx ✅
│   │
│   ├── Inputs/
│   │   ├── Overview.mdx
│   │   ├── Button.stories.tsx (from /Button.stories.tsx)
│   │   ├── ChatInput.stories.tsx (from /ChatInput.stories.tsx)
│   │   ├── AdvancedChatInput.stories.tsx (from /AdvancedChatInput.stories.tsx)
│   │   ├── Textarea.stories.tsx (from /Textarea.stories.tsx)
│   │   ├── Checkbox.stories.tsx (from /Checkbox.stories.tsx)
│   │   ├── FileUpload.stories.tsx (from /FileUpload.stories.tsx)
│   │   └── VoiceInput.stories.tsx (from /VoiceInput.stories.tsx)
│   │
│   ├── DataDisplay/
│   │   ├── Overview.mdx
│   │   ├── Message.stories.tsx (from /Message.stories.tsx)
│   │   ├── MessageEssentials.stories.tsx (from /MessageEssentials.stories.tsx)
│   │   ├── MessageList.stories.tsx (from /MessageList.stories.tsx)
│   │   ├── MessageOptimized.stories.tsx (from /MessageOptimized.stories.tsx)
│   │   ├── MessageMetadata.stories.tsx (from /MessageMetadata.stories.tsx)
│   │   ├── MessageSearch.stories.tsx (from /MessageSearch.stories.tsx)
│   │   ├── StreamingMessage.stories.tsx (from /StreamingMessage.stories.tsx)
│   │   ├── TokenCounter.stories.tsx (from /TokenCounter.stories.tsx)
│   │   ├── Avatar.stories.tsx (from /Avatar.stories.tsx)
│   │   ├── Badge.stories.tsx (from /Badge.stories.tsx)
│   │   ├── Card.stories.tsx (from /Card.stories.tsx)
│   │   ├── CitationCard.stories.tsx (from /CitationCard.stories.tsx)
│   │   ├── ContextCard.stories.tsx (from /ContextCard.stories.tsx)
│   │   ├── AnimatedList.stories.tsx (from /AnimatedList.stories.tsx)
│   │   └── InteractiveCard.stories.tsx (from /InteractiveCard.stories.tsx)
│   │
│   ├── Feedback/
│   │   ├── Overview.mdx
│   │   ├── ThinkingIndicator.stories.tsx (from /ThinkingIndicator.stories.tsx)
│   │   ├── EmptyState.stories.tsx (from /EmptyState.stories.tsx)
│   │   ├── ErrorBoundary.stories.tsx (from /ErrorBoundary.stories.tsx)
│   │   ├── Toast.stories.tsx (from /Toast.stories.tsx)
│   │   ├── NetworkStatus.stories.tsx (from /NetworkStatus.stories.tsx)
│   │   ├── FeedbackAnimation.stories.tsx (from /FeedbackAnimation.stories.tsx)
│   │   ├── ResponseQualityMeter.stories.tsx (from /ResponseQualityMeter.stories.tsx)
│   │   ├── SafetyStatusCard.stories.tsx (from /SafetyStatusCard.stories.tsx)
│   │   └── SessionSummaryCard.stories.tsx (from /SessionSummaryCard.stories.tsx)
│   │
│   ├── Layout/
│   │   ├── Overview.mdx
│   │   ├── ChatWindow.stories.tsx (from /ChatWindow.stories.tsx)
│   │   ├── Dialog.stories.tsx (from /Dialog.stories.tsx)
│   │   ├── Drawer.stories.tsx (from /Drawer.stories.tsx)
│   │   ├── CollapsibleSection.stories.tsx (from /CollapsibleSection.stories.tsx)
│   │   ├── ConversationList.stories.tsx (from /ConversationList.stories.tsx)
│   │   ├── ProjectSidebar.stories.tsx (from /ProjectSidebar.stories.tsx)
│   │   └── SettingsPanel.stories.tsx (from /SettingsPanel.stories.tsx)
│   │
│   └── Navigation/
│       ├── Overview.mdx
│       ├── CommandPalette.stories.tsx (from /CommandPalette.stories.tsx)
│       ├── ContextMenu.stories.tsx (from /ContextMenu.stories.tsx)
│       ├── DropdownMenu.stories.tsx (from /DropdownMenu.stories.tsx)
│       └── Popover.stories.tsx (from /Popover.stories.tsx)
│
├── Advanced/                   📝 TO DO
│   ├── Overview.mdx
│   │
│   ├── AI/
│   │   ├── Overview.mdx
│   │   ├── AgentRunFeed.stories.tsx (from /AgentRunFeed.stories.tsx)
│   │   ├── ToolInvocationCard.stories.tsx (from /ToolInvocationCard.stories.tsx)
│   │   ├── ClarityToolResult.stories.tsx (from /ClarityToolResult.stories.tsx)
│   │   ├── PromptLibrary.stories.tsx (from /PromptLibrary.stories.tsx)
│   │   ├── PromptSuggestions.stories.tsx (from /PromptSuggestions.stories.tsx)
│   │   ├── FollowUpSuggestions.stories.tsx (from /FollowUpSuggestions.stories.tsx)
│   │   ├── WorkflowSuggestionList.stories.tsx (from /WorkflowSuggestionList.stories.tsx)
│   │   └── AIOperations.stories.tsx (from /AIOperations.stories.tsx)
│   │
│   ├── Memory/
│   │   ├── Overview.mdx
│   │   ├── MemoryInspector.stories.tsx (from /MemoryInspector.stories.tsx)
│   │   ├── ContextManager.stories.tsx (from /ContextManager.stories.tsx)
│   │   ├── ContextVisualizer.stories.tsx (from /ContextVisualizer.stories.tsx)
│   │   ├── KnowledgeBaseViewer.stories.tsx (from /KnowledgeBaseViewer.stories.tsx)
│   │   └── DocumentViewer.stories.tsx (from /DocumentViewer.stories.tsx)
│   │
│   ├── Streaming/
│   │   ├── Overview.mdx
│   │   ├── StreamBlock.stories.tsx (from /StreamBlock.stories.tsx)
│   │   ├── StreamCancellation.stories.tsx (from /StreamCancellation.stories.tsx)
│   │   ├── StreamingTextRenderer.stories.tsx (from /StreamingTextRenderer.stories.tsx)
│   │   └── StreamingExamples.stories.tsx (from /StreamingExamples.stories.tsx)
│   │
│   ├── Analytics/
│   │   ├── Overview.mdx
│   │   ├── PerformanceDashboard.stories.tsx (from /PerformanceDashboard.stories.tsx)
│   │   ├── AnalyticsDashboard.stories.tsx (from /AnalyticsDashboard.stories.tsx)
│   │   ├── UsageDashboard.stories.tsx (from /UsageDashboard.stories.tsx)
│   │   ├── TokenOptimizationDashboard.stories.tsx (from /TokenOptimizationDashboard.stories.tsx)
│   │   ├── TokenOptimizationPanel.stories.tsx (from /TokenOptimizationPanel.stories.tsx)
│   │   └── TokenOptimizationBadge.stories.tsx (from /TokenOptimizationBadge.stories.tsx)
│   │
│   └── Enterprise/
│       ├── Overview.mdx
│       ├── AuthTenantDashboard.stories.tsx (from /AuthTenantDashboard.stories.tsx)
│       ├── SSOConfigWizard.stories.tsx (from /SSOConfigWizard.stories.tsx)
│       ├── SeatInviteDialog.stories.tsx (from /SeatInviteDialog.stories.tsx)
│       ├── ApiTokenManager.stories.tsx (from /ApiTokenManager.stories.tsx)
│       ├── AuditLogViewer.stories.tsx (from /AuditLogViewer.stories.tsx)
│       ├── SafetyReviewConsole.stories.tsx (from /SafetyReviewConsole.stories.tsx)
│       ├── EvaluationDashboard.stories.tsx (from /EvaluationDashboard.stories.tsx)
│       ├── BatchExportDialog.stories.tsx (from /BatchExportDialog.stories.tsx)
│       └── ExportDialog.stories.tsx (from /ExportDialog.stories.tsx)
│
├── Hooks/                      📝 TO DO
│   ├── Overview.mdx
│   │
│   ├── Chat/
│   │   ├── Overview.mdx
│   │   ├── UseChat.stories.tsx (from /UseChat.stories.tsx)
│   │   ├── UseChatEnhanced.stories.tsx (from /UseChatEnhanced.stories.tsx)
│   │   ├── UseClarityChat.stories.tsx (from /UseClarityChat.stories.tsx)
│   │   ├── UseAssistant.stories.tsx (from /UseAssistant.stories.tsx)
│   │   └── UseCompletion.stories.tsx (from /UseCompletion.stories.tsx)
│   │
│   ├── Streaming/
│   │   ├── Overview.mdx
│   │   ├── UseStreaming.stories.tsx (from /UseStreaming.stories.tsx)
│   │   ├── UseStreamableUI.stories.tsx (from /UseStreamableUI.stories.tsx)
│   │   ├── UseStreamingSSE.stories.tsx (from /UseStreamingSSE.stories.tsx)
│   │   └── UseStreamingWebSocket.stories.tsx (from /UseStreamingWebSocket.stories.tsx)
│   │
│   ├── State/
│   │   ├── Overview.mdx
│   │   ├── UseLocalStorage.stories.tsx (from /UseLocalStorage.stories.tsx)
│   │   ├── UsePrevious.stories.tsx (from /UsePrevious.stories.tsx)
│   │   ├── UseToggle.stories.tsx (from /UseToggle.stories.tsx)
│   │   ├── UseClarityObject.stories.tsx (from /UseClarityObject.stories.tsx)
│   │   └── UseMessageOperations.stories.tsx (from /UseMessageOperations.stories.tsx)
│   │
│   ├── Performance/
│   │   ├── Overview.mdx
│   │   ├── UseDebounce.stories.tsx (from /UseDebounce.stories.tsx)
│   │   ├── UseThrottle.stories.tsx (from /UseThrottle.stories.tsx)
│   │   ├── UseTokenTracker.stories.tsx (from /UseTokenTracker.stories.tsx)
│   │   └── UseAutoScroll.stories.tsx (from /UseAutoScroll.stories.tsx)
│   │
│   └── Utilities/
│       ├── Overview.mdx
│       ├── UseClipboard.stories.tsx (from /UseClipboard.stories.tsx)
│       ├── UseErrorRecovery.stories.tsx (from /UseErrorRecovery.stories.tsx)
│       ├── UseVoiceInput.stories.tsx (from /UseVoiceInput.stories.tsx)
│       ├── UseWindowSize.stories.tsx (from /UseWindowSize.stories.tsx)
│       └── UseKeyboardShortcuts.stories.tsx (from /UseKeyboardShortcuts.stories.tsx)
│
├── Patterns/                   📝 TO CREATE
│   ├── Overview.mdx
│   ├── ChatPatterns/
│   │   ├── BasicChat.stories.tsx
│   │   ├── StreamingChat.stories.tsx
│   │   ├── MultiTurnConversation.stories.tsx
│   │   └── ContextAwareChat.stories.tsx
│   ├── FormPatterns/
│   ├── LayoutPatterns/
│   └── AIPatterns/
│
└── Examples/                   📝 TO CREATE
    ├── Overview.mdx
    ├── Applications/
    │   ├── CustomerSupportChat.stories.tsx
    │   ├── CodeAssistant.stories.tsx
    │   └── DocumentQA.stories.tsx
    ├── Integrations/
    │   ├── NextJsAppRouter.stories.tsx
    │   ├── RemixIntegration.stories.tsx
    │   └── ViteReact.stories.tsx
    └── UseCases/
        ├── MultiLanguage.stories.tsx
        ├── CustomTheming.stories.tsx
        └── PerformanceOptimization.stories.tsx
```

## Story Naming Convention

### Current (Before)
```
/Button.stories.tsx
/ChatInput.stories.tsx
/UseChat.stories.tsx
```

### New (After)
```
Components/Inputs/Button.stories.tsx
Components/Inputs/ChatInput.stories.tsx
Hooks/Chat/UseChat.stories.tsx
```

### Title Format
```typescript
// Old
title: 'Button'

// New
title: 'Components/Inputs/Button'
```

## Migration Strategy

### Phase 1: Core Components ✅
- Create folder structure
- Create overview pages
- Move essential components (Button, ChatInput, Message, ChatWindow)

### Phase 2: Specialized Components 🚧
- Move Advanced Features (AI, Memory, Streaming, Analytics, Enterprise)
- Move Feedback and Layout components
- Move Navigation components

### Phase 3: Hooks 📝
- Reorganize all hooks by category
- Create hook overview pages
- Add interactive examples

### Phase 4: New Content 📝
- Create Patterns section
- Create Examples section
- Create integration guides

## Story Template

Each story should follow this pattern:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from '@clarity-chat/react'
import { StatusBadge } from '../../../.storybook/blocks'

const meta: Meta<typeof ComponentName> = {
  title: 'Components/Category/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: `
# ComponentName

Brief description of what this component does.

## Key Features
- Feature 1
- Feature 2
- Feature 3

## When to Use
- Use case 1
- Use case 2
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    // Default props
  },
}

export const Interactive: Story = {
  render: () => {
    // Interactive example with state
  },
}

export const AllVariants: Story = {
  // Show all visual variants
}
```

## Benefits of New Organization

### Before (Problems)
- ❌ 132+ stories at root level
- ❌ Hard to find related components
- ❌ No clear categorization
- ❌ Overwhelming navigation
- ❌ Duplicates and inconsistency

### After (Solutions)
- ✅ Clear 3-level hierarchy (max)
- ✅ Logical categorization
- ✅ Related components grouped
- ✅ Intuitive navigation with emoji icons
- ✅ Consistent naming and structure
- ✅ Easy to find anything in ≤3 clicks

## Progress Tracking

### Completed
- ✅ Welcome section (4 pages)
- ✅ Foundation section (6 stories)
- ✅ Components structure created
- ✅ Advanced structure created
- ✅ Hooks structure created

### In Progress
- 🚧 Moving Components stories
- 🚧 Creating category overviews

### To Do
- 📝 Move Advanced Features stories
- 📝 Move Hooks stories
- 📝 Create Patterns section
- 📝 Create Examples section

## Estimated Timeline

- **Phase 1** (Core Components): 1 day
- **Phase 2** (Specialized): 1 day
- **Phase 3** (Hooks): 1 day
- **Phase 4** (New Content): 2 days

**Total**: 5 days for complete reorganization

## Testing Checklist

After reorganization:
- [ ] All stories render correctly
- [ ] No broken imports
- [ ] Navigation works smoothly
- [ ] Search finds components
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Accessibility passes
- [ ] Build succeeds
