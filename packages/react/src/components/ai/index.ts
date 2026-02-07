/**
 * AI Components
 *
 * AI-specific components including agent displays, model selection,
 * personas, and AI-powered features.
 */

export { AgentRunFeed } from './AgentRunFeed'
export { AuditLogViewer } from './AuditLogViewer'
export {
  CollaborativeEditor,
  CollaborativeMessageList,
  PresenceIndicator,
  useCollaborativeSession,
} from './CollaborativeEditing'
export { EnhancedCodeBlock } from './EnhancedCodeBlock'
export { EnhancedMarkdownRenderer } from './EnhancedMarkdownRenderer'
export { ModelSelector } from './ModelSelector'
export { SafetyStatusCard } from './SafetyStatusCard'
export { SessionSummaryCard } from './SessionSummaryCard'
export { WorkflowSuggestionList } from './WorkflowSuggestionList'
export { Citation, type CitationProps, type CitationSource } from './citation'

// ThinkingBar - AI processing status indicator
export {
  ThinkingBar,
  useThinkingBar,
  type ThinkingBarProps,
  type ThinkingBarStatus,
  type ThinkingBarVariant,
  type UseThinkingBarOptions,
  type UseThinkingBarReturn,
} from './ThinkingBar'

// ToolExecutionCard - Tool call execution status display
export {
  ToolExecutionCard,
  useToolExecution,
  type ToolExecutionCardProps,
  type ToolExecution,
  type ToolExecutionStatus,
  type UseToolExecutionOptions,
  type UseToolExecutionReturn,
} from './ToolExecutionCard'

// StreamStatusProgress - Comprehensive streaming progress visualization
// Note: Different from ui/progress.tsx's simple StreamingProgress (animated dots)
export {
  StreamStatusProgress,
  StreamStatusProgressWithFields,
  type StreamStatusProgressProps,
  type StreamStatusProgressWithFieldsProps,
  type StreamStatusProgressVariant,
  type StreamStatusProgressSize,
  type StreamStatusProgressColor,
  type StreamStatusTokens,
} from './StreamingProgress'

// TextShimmer - Skeleton/placeholder shimmer for loading states
export {
  TextShimmer,
  ParagraphShimmer,
  HeadingShimmer,
  CodeShimmer,
  InlineShimmer,
  TextShimmerGroup,
  useTextShimmer,
  type TextShimmerProps,
  type TextShimmerVariant,
  type TextShimmerSpeed,
  type TextShimmerSize,
  type TextShimmerGroupProps,
  type UseTextShimmerOptions,
  type UseTextShimmerReturn,
} from './TextShimmer'

// StreamingTextShimmer - Shimmer animation for streaming text content
export {
  StreamingTextShimmer,
  StreamingCursor,
  useStreamingShimmer,
  type StreamingTextShimmerProps,
  type StreamingTextShimmerSpeed,
  type StreamingTextShimmerVariant,
  type UseStreamingShimmerOptions,
  type UseStreamingShimmerReturn,
} from './StreamingTextShimmer'

// ThinkingPill - Lightweight pill-shaped thinking indicator
export {
  ThinkingPill,
  useThinkingPill,
  type ThinkingPillProps,
  type ThinkingPillVariant,
  type ThinkingPillSize,
  type UseThinkingPillOptions,
  type UseThinkingPillReturn,
} from './ThinkingPill'

// Think - Collapsible reasoning/thinking display panel
export {
  Think,
  useThink,
  type ThinkProps,
  type ThinkStep,
  type ThinkStepStatus,
  type ThinkVariant,
  type UseThinkOptions,
  type UseThinkReturn,
} from './Think'

// ChainOfThought - Step-by-step reasoning visualization
export {
  ChainOfThought,
  useChainOfThought,
  type ChainOfThoughtProps,
  type ChainOfThoughtStep,
  type ChainOfThoughtStepStatus,
  type ChainOfThoughtVariant,
  type UseChainOfThoughtOptions,
  type UseChainOfThoughtReturn,
} from './ChainOfThought'

// ToolCard - Lightweight color-coded tool indicator
export {
  ToolCard,
  ToolCardList,
  useToolCard,
  type ToolCardProps,
  type ToolCardStatus,
  type ToolCardSize,
  type ToolCardListProps,
  type UseToolCardOptions,
  type UseToolCardReturn,
} from './ToolCard'

// Source - Citation/reference component for AI-generated content
export {
  Source,
  SourceList,
  type SourceProps,
  type SourceData,
  type SourceVariant,
  type SourceListProps,
} from './Source'

// Steps - Workflow/progress component for sequential steps
export {
  Steps,
  useSteps,
  type StepsProps,
  type StepData,
  type StepStatus,
  type StepsVariant,
  type StepsSize,
  type UseStepsOptions,
  type UseStepsReturn,
} from './Steps'

// LinkPreview - Rich link preview component
export {
  LinkPreview,
  LinkPreviewList,
  useLinkPreview,
  type LinkPreviewProps,
  type LinkPreviewData,
  type LinkPreviewVariant,
  type LinkPreviewSize,
  type LinkPreviewListProps,
  type UseLinkPreviewOptions,
  type UseLinkPreviewReturn,
} from './LinkPreview'

// Terminal - Interactive terminal with themes (Night Owl default)
export {
  Terminal,
  useTerminal,
  type TerminalProps,
  type TerminalLine,
  type TerminalLineType,
  type TerminalTheme,
  type UseTerminalOptions,
  type UseTerminalReturn,
} from './Terminal'

// Plan - Task planning and tracking component
export {
  Plan,
  usePlan,
  type PlanProps,
  type PlanTask,
  type PlanVariant,
  type TaskStatus as PlanTaskStatus,
  type TaskPriority,
  type UsePlanOptions,
  type UsePlanReturn,
} from './Plan'

// ProgressTracker - Multi-step progress visualization
export {
  ProgressTracker,
  useProgressTracker,
  type ProgressTrackerProps,
  type ProgressTrackerVariant,
  type ProgressStep,
  type ProgressStepStatus,
  type UseProgressTrackerOptions,
  type UseProgressTrackerReturn,
} from './ProgressTracker'

// StatsDisplay - Statistics and metrics display
export {
  StatsDisplay,
  useStatsDisplay,
  type StatsDisplayProps,
  type StatsDisplayVariant,
  type StatsDisplaySize,
  type StatData,
  type StatTrend,
  type UseStatsDisplayOptions,
  type UseStatsDisplayReturn,
} from './StatsDisplay'

// ItemCarousel - Carousel for items, team members, products
export {
  ItemCarousel,
  useItemCarousel,
  type ItemCarouselProps,
  type ItemCarouselVariant,
  type ItemCarouselSize,
  type CarouselItem,
  type UseItemCarouselOptions,
  type UseItemCarouselReturn,
} from './ItemCarousel'

// Attachments - File attachment display with multiple variants
export {
  Attachments,
  AttachmentItem,
  useAttachments,
  type AttachmentsProps,
  type AttachmentsVariant,
  type AttachmentData,
  type AttachmentItemProps,
  type UseAttachmentsOptions,
  type UseAttachmentsReturn,
} from './Attachments'

// Confirmation - Confirmation dialog/card for user approval
export {
  Confirmation,
  ConfirmationProvider,
  useConfirmation,
  type ConfirmationProps,
  type ConfirmationVariant,
  type ConfirmationIntent,
  type ConfirmationAction,
  type ConfirmationProviderProps,
} from './Confirmation'

// Suggestion - Suggestion chips/cards for quick replies
export {
  Suggestion,
  SuggestionList,
  useSuggestions,
  type SuggestionProps,
  type SuggestionData,
  type SuggestionVariant,
  type SuggestionSize,
  type SuggestionListProps,
  type UseSuggestionsOptions,
  type UseSuggestionsReturn,
} from './Suggestion'

// FileTree - File/folder tree with expand/collapse and selection
export {
  FileTree,
  useFileTree,
  type FileTreeProps,
  type FileTreeNode,
  type FileTreeVariant,
  type UseFileTreeOptions,
  type UseFileTreeReturn,
} from './FileTree'

// CodeSnippet - Code display with syntax highlighting and themes
export {
  CodeSnippet,
  CodeSnippetGroup,
  type CodeSnippetProps,
  type CodeSnippetTheme,
  type CodeSnippetLanguage,
  type CodeSnippetGroupProps,
} from './CodeSnippet'

// StackTrace - Error stack trace display
export {
  StackTrace,
  type StackTraceProps,
  type StackTraceTheme,
  type StackFrame,
} from './StackTrace'

// TestResults - Test results display with pass/fail/skip
export {
  TestResults,
  TestSuite,
  useTestResults,
  type TestResultsProps,
  type TestSuiteProps,
  type TestResult,
  type TestSuiteData,
  type TestStatus,
  type UseTestResultsOptions,
  type UseTestResultsReturn,
} from './TestResults'

// ResponseActions - Action buttons for AI responses
export {
  ResponseActions,
  useResponseActions,
  type ResponseActionsProps,
  type ResponseActionsVariant,
  type ResponseActionsSize,
  type ResponseAction,
  type UseResponseActionsOptions,
  type UseResponseActionsReturn,
} from './ResponseActions'

// ImageGallery - Image gallery with lightbox
export {
  ImageGallery,
  useImageGallery,
  type ImageGalleryProps,
  type ImageGalleryVariant,
  type GalleryImage,
  type UseImageGalleryOptions,
  type UseImageGalleryReturn,
} from './ImageGallery'

// DataTable - Data table with sorting, filtering, pagination
export {
  DataTable,
  useDataTable,
  type DataTableProps,
  type DataTableColumn,
  type DataTableVariant,
  type UseDataTableOptions,
  type UseDataTableReturn,
} from './DataTable'

// ApprovalCard - Approval request card with details
export {
  ApprovalCard,
  type ApprovalCardProps,
  type ApprovalCardIntent,
  type ApprovalCardSize,
  type ApprovalDetail,
} from './ApprovalCard'

// InlineCitation - Inline citation with hover preview
export {
  InlineCitation,
  InlineCitationList,
  CitationFootnotes,
  useCitations,
  type InlineCitationProps,
  type InlineCitationVariant,
  type CitationSource as InlineCitationSource,
  type InlineCitationListProps,
  type CitationFootnotesProps,
  type UseCitationsOptions,
  type UseCitationsReturn,
} from './InlineCitation'

// OptionList - Selectable option list
export {
  OptionList,
  useOptionList,
  type OptionListProps,
  type OptionListVariant,
  type OptionListSize,
  type OptionItem,
  type OptionGroup,
  type UseOptionListOptions,
  type UseOptionListReturn,
} from './OptionList'

/** @deprecated For chat messages use TanStackMessageList. See CODE_REUSE_AUDIT.md P0-12 */
// VirtualScroller - Virtualized list for large datasets
export {
  VirtualScroller,
  FixedSizeList,
  VariableSizeList,
  useVirtualScroller,
  type VirtualScrollerProps,
  type VirtualScrollerRef,
  type VirtualScrollerOrientation,
  type FixedSizeListProps,
  type VariableSizeListProps,
  type UseVirtualScrollerOptions,
  type UseVirtualScrollerReturn,
} from './VirtualScroller'

// ============================================================================
// Generative UI Utilities
// ============================================================================

// ComponentRegistry - AI component registration with schemas
export {
  ComponentRegistryProvider,
  createComponentRegistry,
  useComponentRegistry,
  useRegisteredComponent,
  GenerativeComponent,
  defineComponent,
  defineComponents,
  type RegisteredComponent,
  type GenerativeComponentType,
  type PropsSchema,
  type ComponentRegistryConfig,
  type ComponentRegistry,
  type ComponentRegistryContextValue,
  type ComponentRegistryProviderProps,
  type GenerativeComponentProps,
  type InferComponentProps,
} from './ComponentRegistry'

// withInteractable - HOC for AI-updatable persistent components
export {
  withInteractable,
  InteractableProvider,
  useInteractable,
  useInteractableInstance,
  getInteractableConfig,
  isInteractableComponent,
  type InteractableConfig,
  type InteractableProps,
  type InteractableUpdate,
  type InteractableState,
  type InteractableContextValue,
  type InteractableProviderProps,
} from './withInteractable'

// ============================================================================
// Ant Design X-inspired Components
// ============================================================================

// Conversations - Chat conversation list and display
export {
  Conversations,
  ConversationItem,
  useConversations,
  type ConversationsProps,
  type ConversationItemProps,
  type ConversationData,
  type ConversationMessage,
  type ConversationsVariant,
  type UseConversationsOptions,
  type UseConversationsReturn,
} from './Conversations'

// Sender - Message input component
export {
  Sender,
  useSender,
  type SenderProps,
  type SenderVariant,
  type SenderSize,
  type SenderAttachment,
  type SenderAction,
  type UseSenderOptions,
  type UseSenderReturn,
} from './Sender'

// Prompts - Prompt template selector
export {
  Prompts,
  usePrompts,
  type PromptsProps,
  type PromptItem,
  type PromptVariable,
  type PromptCategory,
  type PromptsVariant,
  type PromptsSize,
  type UsePromptsOptions,
  type UsePromptsReturn,
} from './Prompts'

// FileCard - File display component
export {
  FileCard,
  FileCardList,
  useFileCard,
  formatFileSize,
  getFileExtension,
  getFileCategory,
  type FileCardProps,
  type FileCardListProps,
  type FileData,
  type FileCardVariant,
  type FileCardSize,
  type UseFileCardOptions,
  type UseFileCardReturn,
} from './FileCard'

// Welcome - Chat welcome/landing screen
export {
  Welcome,
  WelcomeLogo,
  useWelcome,
  type WelcomeProps,
  type WelcomeLogoProps,
  type WelcomeAction,
  type WelcomeSuggestion,
  type WelcomeFeature,
  type WelcomeVariant,
  type WelcomeSize,
  type UseWelcomeOptions,
  type UseWelcomeReturn,
} from './Welcome'

// ============================================================================
// Composition & Layout Components
// ============================================================================

// ChatComposer - Declarative chat layout builder
export {
  ChatComposer,
  useChatComposer,
  useIsChatComposerChild,
  useChatComposerBuilder,
  // Prebuilt layouts
  MinimalChat,
  StandardChat,
  AgentChat,
  FullscreenChat,
  // Types
  type ChatComposerProps,
  type ChatComposerLayout,
  type ChatComposerFeature,
  type ChatComposerSlot,
  type ChatComposerContextValue,
  type HeaderSlotProps,
  type MessagesSlotProps,
  type SidebarSlotProps,
  type InputSlotProps,
  type SlotProps as ChatComposerSlotProps,
  type UseChatComposerOptions,
  type UseChatComposerReturn,
  type PrebuiltChatProps,
} from './ChatComposer'

// MessageRenderer - Plugin-based message rendering
export {
  MessageRenderer,
  // Default plugins
  defaultPlugins,
  codeBlockPlugin,
  inlineCodePlugin,
  citationPlugin,
  linkPlugin,
  imagePlugin,
  tablePlugin,
  toolResultPlugin,
  filePlugin,
  boldPlugin,
  italicPlugin,
  strikethroughPlugin,
  headingPlugin,
  listPlugin,
  blockquotePlugin,
  hrPlugin,
  // Plugin utilities
  createPlugin,
  createReplacementPlugin,
  extendPlugins,
  // Types
  type MessageRendererProps,
  type MessagePlugin,
  type PluginMatch,
  type PluginRenderContext,
  type ComponentOverrides,
  type CodeBlockProps,
  type InlineCodeProps,
  type CitationProps as MessageCitationProps,
  type LinkProps as MessageLinkProps,
  type ImageProps as MessageImageProps,
  type TableProps as MessageTableProps,
  type ToolResultProps as MessageToolResultProps,
  type FileCardProps as MessageFileCardProps,
  type TextProps as MessageTextProps,
} from './MessageRenderer'

// AgentPanel - Unified agent execution view
export {
  AgentPanel,
  useAgentPanel,
  useIsAgentPanelChild,
  useConnectedAgentPanel,
  // Types
  type AgentPanelProps,
  type AgentPanelVariant,
  type AgentPanelSection,
  type AgentPanelContextValue,
  type PlanSectionProps,
  type ThinkingSectionProps,
  type ToolsSectionProps,
  type ApprovalsSectionProps,
  type SlotProps as AgentPanelSlotProps,
  type ConnectedAgentPanelProps,
} from './AgentPanel'
