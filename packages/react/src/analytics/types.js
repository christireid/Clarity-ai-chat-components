/**
 * Analytics Types
 *
 * Type definitions for the analytics system
 */
/**
 * Pre-defined event names
 */
export const AnalyticsEvents = {
    // Message events
    MESSAGE_SENT: 'message_sent',
    MESSAGE_RECEIVED: 'message_received',
    MESSAGE_EDITED: 'message_edited',
    MESSAGE_DELETED: 'message_deleted',
    MESSAGE_COPIED: 'message_copied',
    // Streaming events
    STREAMING_STARTED: 'streaming_started',
    STREAMING_COMPLETED: 'streaming_completed',
    STREAMING_CANCELLED: 'streaming_cancelled',
    STREAMING_ERROR: 'streaming_error',
    // Feedback events
    FEEDBACK_POSITIVE: 'feedback_positive',
    FEEDBACK_NEGATIVE: 'feedback_negative',
    // File events
    FILE_UPLOADED: 'file_uploaded',
    FILE_DOWNLOAD: 'file_download',
    FILE_PREVIEW: 'file_preview',
    // Conversation events
    CONVERSATION_STARTED: 'conversation_started',
    CONVERSATION_ENDED: 'conversation_ended',
    CONVERSATION_EXPORTED: 'conversation_exported',
    CONVERSATION_SHARED: 'conversation_shared',
    // UI events
    BUTTON_CLICKED: 'button_clicked',
    LINK_CLICKED: 'link_clicked',
    MODAL_OPENED: 'modal_opened',
    MODAL_CLOSED: 'modal_closed',
    TAB_CHANGED: 'tab_changed',
    // Theme events
    THEME_CHANGED: 'theme_changed',
    DARK_MODE_TOGGLED: 'dark_mode_toggled',
    // Feature usage
    FEATURE_USED: 'feature_used',
    SETTING_CHANGED: 'setting_changed',
    // Error events
    ERROR_OCCURRED: 'error_occurred',
    ERROR_RECOVERED: 'error_recovered',
    // Performance events
    PERFORMANCE_MEASURED: 'performance_measured',
    PAGE_LOAD: 'page_load',
    // Search events
    SEARCH_PERFORMED: 'search_performed',
    SEARCH_RESULT_CLICKED: 'search_result_clicked',
    // Copy/Export events
    CODE_COPIED: 'code_copied',
    DATA_EXPORTED: 'data_exported',
};
//# sourceMappingURL=types.js.map