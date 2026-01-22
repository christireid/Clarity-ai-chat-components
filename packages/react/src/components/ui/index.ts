/**
 * UI Components
 *
 * Generic UI primitives and utilities used across the library.
 */

export * from './animated-dots'
export * from './animated-list'
export { BatteryIndicator } from './battery-indicator'
export * from './collapsible-section'
export {
  DashboardErrorBoundary,
  useDashboardErrorHandler,
  type DashboardErrorBoundaryProps,
} from './dashboard-error-boundary'
export {
  DashboardProgress,
  CircularProgress,
  type DashboardProgressProps,
  type CircularProgressProps,
} from './dashboard-progress'
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
} from './dashboard-skeleton'
export { Draggable, DropZone } from './draggable'
export {
  EmptyState,
  EmptyChatState,
  NoSearchResultsState,
  NoConversationsState,
  ErrorState,
  SuccessState,
} from './empty-state'
export * from './feedback-animation'
export * from './icons'
export * from './interactive-card'
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
} from './link-preview'
export * from './progress'
export * from './ripple'
export * from './skeleton'
// Export toast module excluding 'toast' object to avoid conflict with sonner-toast
export {
  ToastItem,
  ToastContainer,
  ToastProvider,
  useToast,
  // type ToastType, // NOTE: Commented out - toast.tsx source file missing (only compiled .js exists)
  // type ToastPosition, // NOTE: Commented out - toast.tsx source file missing
  type Toast,
  // type ToastProps, // NOTE: Commented out - toast.tsx source file missing
  type ToastContainerProps,
  // type ToastContextValue, // NOTE: Commented out - toast.tsx source file missing
  type ToastProviderProps,
} from './toast'
