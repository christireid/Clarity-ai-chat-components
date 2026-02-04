/**
 * UI Components
 *
 * Generic UI primitives and utilities used across the library.
 */

export * from './AnimatedDots'
export * from './AnimatedList'
export { BatteryIndicator } from './BatteryIndicator'
export * from './CollapsibleSection'
// Re-export DashboardErrorBoundary from canonical location
export {
  DashboardErrorBoundary,
  useDashboardErrorHandler,
  type DashboardErrorBoundaryProps,
} from '@clarity-chat/error-handling'
export {
  DashboardProgress,
  CircularProgress,
  type DashboardProgressProps,
  type CircularProgressProps,
} from './DashboardProgress'
// Dashboard skeleton components
export {
  AnalyticsDashboardSkeleton,
  UsageDashboardSkeleton,
  TokenOptimizationDashboardSkeleton,
  PerformanceDashboardSkeleton,
  DashboardEmptyState,
  MetricCardSkeleton,
  ProgressWidgetSkeleton,
  ListItemSkeleton,
  ChartSkeleton,
  DashboardStateTransition,
  useLoadingAnnouncement,
  LoadingAnnouncer,
  type DashboardSkeletonProps,
  type DashboardEmptyStateProps,
  type DashboardStateTransitionProps,
  type LoadingAnnouncerProps,
} from './DashboardSkeleton'
export { Draggable, DropZone } from './draggable'
export {
  EmptyState,
  EmptyChatState,
  NoSearchResultsState,
  NoConversationsState,
  ErrorState,
  SuccessState,
} from './EmptyState'
export * from './FeedbackAnimation'
export * from './icons'
export * from './InteractiveCard'
export {
  LinkPreview,
  LinkPreviewSkeleton,
  LinkPreviewError,
  LinkPreviewCompact,
  InlineLink,
  SmartLinkPreview,
  RichEmbed,
  useLinkPreview,
  isValidUrl,
  sanitizeUrl,
  detectEmbedType,
  createMetadataFetcher,
  createFallbackMetadata,
  type LinkMetadata,
  type LinkPreviewProps,
  type LinkPreviewVariant,
  type LinkPreviewSkeletonProps,
  type LinkPreviewErrorProps,
  type LinkPreviewCompactProps,
  type InlineLinkProps,
  type SmartLinkPreviewProps,
  type UseLinkPreviewOptions,
  type UseLinkPreviewReturn,
  type MetadataFetcherConfig,
  type EmbedType,
} from './link-preview/'
// Export Progress but exclude StreamingProgress and CircularProgress to avoid conflicts
export {
  Progress,
  type ProgressProps,
  UploadProgress,
  type UploadProgressProps,
  SkeletonProgress,
  // StreamingProgress is excluded - use the one from components/ai instead
  // CircularProgress is excluded - already exported from DashboardProgress
} from './progress'
export * from './ripple'
export * from './skeleton'
// Export toast module excluding 'toast' object to avoid conflict with sonner-toast
export {
  ToastItem,
  ToastContainer,
  ToastProvider,
  useToast,
  type ToastType,
  type ToastPosition,
  type Toast,
  type ToastProps,
  type ToastContainerProps,
  type ToastContextValue,
  type ToastProviderProps,
} from './toast'
