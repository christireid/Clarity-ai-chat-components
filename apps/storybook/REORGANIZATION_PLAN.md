# Storybook Reorganization Plan

## Overview
This document outlines the systematic reorganization of 123+ Storybook stories from a flat structure into a logical, hierarchical design system organization following industry best practices from Material-UI, IBM Carbon, Grafana, and Monday.com Vibe.

## Current Problems
1. ✗ 123+ stories dumped at root level - overwhelming navigation
2. ✗ Duplicate stories (root level + `Components/` subdirectories)
3. ✗ No Foundation/design tokens layer
4. ✗ Inconsistent documentation patterns
5. ✗ Disabled package stories due to duplicate IDs
6. ✗ Poor categorization (no functional grouping)

## New Structure

```
📚 Clarity Chat Design System
├── 🎨 Foundation
│   ├── Colors & Themes
│   ├── Typography
│   ├── Spacing & Layout
│   ├── Motion & Animation
│   └── Iconography
│
├── 🧩 Components
│   ├── Inputs
│   ├── Data Display
│   ├── Feedback
│   ├── Layout
│   └── Navigation
│
├── 🔧 Advanced Features
│   ├── AI & Agent Components
│   ├── Memory & Context
│   ├── Streaming & Real-time
│   └── Analytics & Monitoring
│
├── 🪝 Hooks
│   ├── Chat Hooks
│   ├── State Management
│   ├── Performance
│   └── Utilities
│
├── 📐 Patterns
│   ├── Chat Patterns
│   ├── Form Patterns
│   └── Layout Patterns
│
└── 📖 Resources
    ├── Getting Started
    ├── Accessibility
    └── Best Practices
```

## Story Reorganization Map

### Foundation (NEW - Create)
| Current Location | New Location | Status |
|-----------------|--------------|--------|
| N/A | Foundation/Colors & Themes | ✅ Created |
| N/A | Foundation/Typography | ✅ Created |
| N/A | Foundation/Spacing & Layout | 🔄 Create |
| N/A | Foundation/Motion & Animation | 🔄 Create |
| N/A | Foundation/Iconography | 🔄 Create |

### Components/Inputs
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `Button.stories.tsx` | `Components/Inputs/Button/Button.stories.tsx` | Move + Add Overview.mdx |
| `ChatInput.stories.tsx` | `Components/Inputs/ChatInput/ChatInput.stories.tsx` | Move + Enhance docs |
| `AdvancedChatInput.stories.tsx` | `Components/Inputs/ChatInput/Advanced.stories.tsx` | Move + Merge docs |
| `VoiceInput.stories.tsx` | `Components/Inputs/VoiceInput/VoiceInput.stories.tsx` | Move |
| `FileUpload.stories.tsx` | `Components/Inputs/FileUpload/FileUpload.stories.tsx` | Move |
| `Textarea.stories.tsx` (if exists) | `Components/Inputs/Textarea/Textarea.stories.tsx` | Move |

### Components/Data Display
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `Message.stories.tsx` | `Components/Data Display/Message/Message.stories.tsx` | Move + Enhance |
| `MessageList.stories.tsx` | `Components/Data Display/MessageList/MessageList.stories.tsx` | Move + Enhance |
| `MessageOptimized.stories.tsx` | `Components/Data Display/Message/Optimized.stories.tsx` | Move + Merge |
| `StreamingMessage.stories.tsx` | `Components/Data Display/Message/Streaming.stories.tsx` | Move + Merge |
| `MessageMetadata.stories.tsx` | `Components/Data Display/Message/Metadata.stories.tsx` | Move + Merge |
| `MessageSearch.stories.tsx` | `Components/Data Display/MessageSearch/MessageSearch.stories.tsx` | Move |
| `AdvancedMessageSearch.stories.tsx` | `Components/Data Display/MessageSearch/Advanced.stories.tsx` | Move + Merge |
| `VirtualizedMessageList.stories.tsx` | `Components/Data Display/MessageList/Virtualized.stories.tsx` | Move + Merge |
| `Card.stories.tsx` | `Components/Data Display/Card/Card.stories.tsx` | Move |
| `ContextCard.stories.tsx` | `Components/Data Display/Card/Context.stories.tsx` | Move + Merge |
| `SafetyStatusCard.stories.tsx` | `Components/Data Display/Card/SafetyStatus.stories.tsx` | Move + Merge |
| `Avatar.stories.tsx` | `Components/Data Display/Avatar/Avatar.stories.tsx` | Move |
| `Badge.stories.tsx` | `Components/Data Display/Badge/Badge.stories.tsx` | Move |
| `TokenCounter.stories.tsx` | `Components/Data Display/TokenCounter/TokenCounter.stories.tsx` | Move + Enhance |
| `TokenOptimizationBadge.stories.tsx` | `Components/Data Display/Badge/TokenOptimization.stories.tsx` | Move + Merge |
| `CitationCard.stories.tsx` | `Components/Data Display/Citation/CitationCard.stories.tsx` | Move |
| `ToolInvocationCard.stories.tsx` | `Components/Data Display/ToolInvocation/ToolInvocationCard.stories.tsx` | Move |
| `AnimatedList.stories.tsx` | `Components/Data Display/AnimatedList/AnimatedList.stories.tsx` | Move |
| `ConversationList.stories.tsx` | `Components/Data Display/ConversationList/ConversationList.stories.tsx` | Move |

### Components/Feedback
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `ThinkingIndicator.stories.tsx` | `Components/Feedback/ThinkingIndicator/ThinkingIndicator.stories.tsx` | Move |
| `FeedbackAnimation.stories.tsx` | `Components/Feedback/FeedbackAnimation/FeedbackAnimation.stories.tsx` | Move |
| `EmptyState.stories.tsx` | `Components/Feedback/EmptyState/EmptyState.stories.tsx` | Move |
| `ErrorBoundary.stories.tsx` | `Components/Feedback/ErrorBoundary/ErrorBoundary.stories.tsx` | Move |
| `ResponseQualityMeter.stories.tsx` | `Components/Feedback/ResponseQualityMeter/ResponseQualityMeter.stories.tsx` | Move |

### Components/Layout
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `ChatWindow.stories.tsx` | `Components/Layout/ChatWindow/ChatWindow.stories.tsx` | Move + Enhance |
| `Dialog.stories.tsx` | `Components/Layout/Dialog/Dialog.stories.tsx` | Move |
| `Drawer.stories.tsx` | `Components/Layout/Drawer/Drawer.stories.tsx` | Move |
| `BatchExportDialog.stories.tsx` | `Components/Layout/Dialog/BatchExport.stories.tsx` | Move + Merge |
| `ExportDialog.stories.tsx` | `Components/Layout/Dialog/Export.stories.tsx` | Move + Merge |
| `ProjectSidebar.stories.tsx` | `Components/Layout/Sidebar/ProjectSidebar.stories.tsx` | Move |
| `SettingsPanel.stories.tsx` | `Components/Layout/Panel/SettingsPanel.stories.tsx` | Move |
| `PersonaPanel.stories.tsx` | `Components/Layout/Panel/PersonaPanel.stories.tsx` | Move |
| `CollapsibleSection.stories.tsx` | `Components/Layout/CollapsibleSection/CollapsibleSection.stories.tsx` | Move |
| `Draggable.stories.tsx` | `Components/Layout/Draggable/Draggable.stories.tsx` | Move |

### Components/Navigation
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `DropdownMenu.stories.tsx` | `Components/Navigation/DropdownMenu/DropdownMenu.stories.tsx` | Move |
| `ContextMenu.stories.tsx` | `Components/Navigation/ContextMenu/ContextMenu.stories.tsx` | Move |
| `CommandPalette.stories.tsx` | `Components/Navigation/CommandPalette/CommandPalette.stories.tsx` | Move |

### Advanced Features/AI & Agent
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `AgentRunFeed.stories.tsx` | `Advanced Features/AI & Agent/AgentRunFeed.stories.tsx` | Move |
| `AIOperations.stories.tsx` | `Advanced Features/AI & Agent/AIOperations.stories.tsx` | Move |
| `AiExperience.stories.tsx` | `Advanced Features/AI & Agent/AiExperience.stories.tsx` | Move |
| `PromptLibrary.stories.tsx` | `Advanced Features/AI & Agent/PromptLibrary.stories.tsx` | Move |
| `PromptSuggestions.stories.tsx` | `Advanced Features/AI & Agent/PromptSuggestions.stories.tsx` | Move |
| `FollowUpSuggestions.stories.tsx` | `Advanced Features/AI & Agent/FollowUpSuggestions.stories.tsx` | Move |
| `WorkflowSuggestionList.stories.tsx` | `Advanced Features/AI & Agent/WorkflowSuggestionList.stories.tsx` | Move |

### Advanced Features/Memory & Context
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `MemoryInspector.stories.tsx` | `Advanced Features/Memory & Context/MemoryInspector.stories.tsx` | Move |
| `ContextManager.stories.tsx` | `Advanced Features/Memory & Context/ContextManager.stories.tsx` | Move |
| `ContextVisualizer.stories.tsx` | `Advanced Features/Memory & Context/ContextVisualizer.stories.tsx` | Move |
| `KnowledgeBaseViewer.stories.tsx` | `Advanced Features/Memory & Context/KnowledgeBaseViewer.stories.tsx` | Move |

### Advanced Features/Streaming
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `StreamBlock.stories.tsx` | `Advanced Features/Streaming/StreamBlock.stories.tsx` | Move |
| `StreamingTextRenderer.stories.tsx` | `Advanced Features/Streaming/StreamingTextRenderer.stories.tsx` | Move |
| `StreamingExamples.stories.tsx` | `Advanced Features/Streaming/Examples.stories.tsx` | Move + Merge |

### Advanced Features/Analytics
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `AnalyticsDashboard.stories.tsx` | `Advanced Features/Analytics/AnalyticsDashboard.stories.tsx` | Move |
| `PerformanceDashboard.stories.tsx` | `Advanced Features/Analytics/PerformanceDashboard.stories.tsx` | Move |
| `TokenOptimizationDashboard.stories.tsx` | `Advanced Features/Analytics/TokenOptimizationDashboard.stories.tsx` | Move |
| `TokenOptimizationPanel.stories.tsx` | `Advanced Features/Analytics/TokenOptimizationPanel.stories.tsx` | Move |
| `AuditLogViewer.stories.tsx` | `Advanced Features/Analytics/AuditLogViewer.stories.tsx` | Move |
| `EvaluationDashboard.stories.tsx` | `Advanced Features/Analytics/EvaluationDashboard.stories.tsx` | Move |

### Advanced Features/Enterprise
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `Enterprise.stories.tsx` | `Advanced Features/Enterprise/Overview.stories.tsx` | Move |
| `AuthTenantDashboard.stories.tsx` | `Advanced Features/Enterprise/AuthTenantDashboard.stories.tsx` | Move |
| `SSOConfigWizard.stories.tsx` | `Advanced Features/Enterprise/SSOConfigWizard.stories.tsx` | Move |
| `SafetyReviewConsole.stories.tsx` | `Advanced Features/Enterprise/SafetyReviewConsole.stories.tsx` | Move |
| `SessionSummaryCard.stories.tsx` | `Advanced Features/Enterprise/SessionSummaryCard.stories.tsx` | Move |

### Hooks/Chat Hooks
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `UseChat.stories.tsx` | `Hooks/Chat Hooks/useChat.stories.tsx` | Move + Enhance |
| `UseAssistant.stories.tsx` | `Hooks/Chat Hooks/useAssistant.stories.tsx` | Move + Enhance |
| `UseCompletion.stories.tsx` | `Hooks/Chat Hooks/useCompletion.stories.tsx` | Move |
| `UseMessageOperations.stories.tsx` | `Hooks/Chat Hooks/useMessageOperations.stories.tsx` | Move |
| `UseClarity*.stories.tsx` | `Hooks/Chat Hooks/[specific].stories.tsx` | Move |

### Hooks/Streaming
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `UseStreaming.stories.tsx` | `Hooks/Streaming/useStreaming.stories.tsx` | Move |
| `UseStreamableUI.stories.tsx` | `Hooks/Streaming/useStreamableUI.stories.tsx` | Move |
| `UseStreamingSSE.stories.tsx` | `Hooks/Streaming/useStreamingSSE.stories.tsx` | Move |
| `UseStreamingWebsocket.stories.tsx` | `Hooks/Streaming/useStreamingWebsocket.stories.tsx` | Move |

### Hooks/State Management
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `UseLocalStorage.stories.tsx` | `Hooks/State Management/useLocalStorage.stories.tsx` | Move |
| `UsePrevious.stories.tsx` | `Hooks/State Management/usePrevious.stories.tsx` | Move |
| `UseToggle.stories.tsx` | `Hooks/State Management/useToggle.stories.tsx` | Move |

### Hooks/Performance
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `UseDebounce.stories.tsx` | `Hooks/Performance/useDebounce.stories.tsx` | Move |
| `UseThrottle.stories.tsx` | `Hooks/Performance/useThrottle.stories.tsx` | Move |
| `UseAutoScroll.stories.tsx` | `Hooks/Performance/useAutoScroll.stories.tsx` | Move |
| `UseTokenTracker.stories.tsx` | `Hooks/Performance/useTokenTracker.stories.tsx` | Move |

### Hooks/Utilities
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `UseClipboard.stories.tsx` | `Hooks/Utilities/useClipboard.stories.tsx` | Move |
| `UseErrorRecovery.stories.tsx` | `Hooks/Utilities/useErrorRecovery.stories.tsx` | Move |
| `UseVoiceInput.stories.tsx` | `Hooks/Utilities/useVoiceInput.stories.tsx` | Move |
| `UseWindowSize.stories.tsx` | `Hooks/Utilities/useWindowSize.stories.tsx` | Move |

### Patterns (NEW - Create from existing stories)
| Components to Combine | New Pattern | Action |
|----------------------|-------------|--------|
| ChatWindow + ChatInput + MessageList | Patterns/Chat Patterns/BasicChat.stories.tsx | Create |
| ChatWindow + Message + Streaming | Patterns/Chat Patterns/StreamingChat.stories.tsx | Create |
| Form components | Patterns/Form Patterns/FormExamples.stories.tsx | Create |

### Resources (Reorganize existing MDX)
| Current Location | New Location | Action |
|-----------------|--------------|--------|
| `Introduction.mdx` | `Resources/Getting Started/Introduction.mdx` | Move |
| `GettingStarted.mdx` | `Resources/Getting Started/QuickStart.mdx` | Move + Rename |
| `Accessibility.mdx` | `Resources/Accessibility/Guidelines.mdx` | Move |
| `BestPractices.mdx` | `Resources/Best Practices/Development.mdx` | Move |
| `FAQ.mdx` | `Resources/FAQ.mdx` | Move |

## Implementation Steps

### Phase 1: Foundation (DONE)
- [x] Create Foundation/Colors & Themes
- [x] Create Foundation/Typography
- [ ] Create Foundation/Spacing & Layout
- [ ] Create Foundation/Motion & Animation
- [ ] Create Foundation/Iconography

### Phase 2: Component Reorganization
- [ ] Create new directory structure
- [ ] Move Input components
- [ ] Move Data Display components
- [ ] Move Feedback components
- [ ] Move Layout components
- [ ] Move Navigation components

### Phase 3: Advanced Features
- [ ] Create Advanced Features structure
- [ ] Organize AI & Agent components
- [ ] Organize Memory & Context components
- [ ] Organize Streaming components
- [ ] Organize Analytics components
- [ ] Organize Enterprise components

### Phase 4: Hooks Reorganization
- [ ] Create Hooks structure
- [ ] Organize Chat Hooks
- [ ] Organize Streaming Hooks
- [ ] Organize State Management Hooks
- [ ] Organize Performance Hooks
- [ ] Organize Utility Hooks

### Phase 5: Patterns & Resources
- [ ] Create Pattern examples
- [ ] Reorganize Resources/documentation
- [ ] Update navigation

### Phase 6: Configuration Updates
- [ ] Update .storybook/preview.tsx with new sidebar order
- [ ] Add status badges to stories
- [ ] Update component metadata
- [ ] Fix duplicate ID issues
- [ ] Re-enable package stories

### Phase 7: Documentation Enhancement
- [ ] Add Overview.mdx to each component category
- [ ] Enhance component stories with better examples
- [ ] Add accessibility notes to each component
- [ ] Add usage guidelines

### Phase 8: Polish & Testing
- [ ] Update branding and theme
- [ ] Test all stories load correctly
- [ ] Verify no broken links
- [ ] Check navigation flow
- [ ] Performance optimization

## Success Criteria
- ✅ Clear, logical hierarchy with max 3 levels of nesting
- ✅ All 123+ stories properly categorized
- ✅ No duplicate stories
- ✅ Foundation layer complete with design tokens
- ✅ Consistent documentation pattern across all components
- ✅ Status badges on all components
- ✅ Package stories re-enabled
- ✅ Improved navigation and discoverability
- ✅ Enhanced visual design matching docs site quality

## Timeline
- **Phase 1-2**: Foundation + Component Reorganization (Current)
- **Phase 3-4**: Advanced Features + Hooks
- **Phase 5-6**: Patterns + Configuration
- **Phase 7-8**: Documentation + Polish

Total estimated time: Systematic implementation over multiple sessions
