/**
 * Analytics Types
 *
 * Type definitions for the analytics system
 */
/**
 * Analytics event
 */
export interface AnalyticsEvent {
    /**
     * Event name (e.g., 'message_sent', 'button_clicked')
     */
    name: string;
    /**
     * Event properties/metadata
     */
    properties?: Record<string, any>;
    /**
     * Event timestamp (defaults to now)
     */
    timestamp?: number;
    /**
     * User ID (if available)
     */
    userId?: string;
    /**
     * Session ID (if available)
     */
    sessionId?: string;
}
/**
 * User identification
 */
export interface AnalyticsUser {
    id: string;
    email?: string;
    name?: string;
    properties?: Record<string, any>;
}
/**
 * Page view event
 */
export interface PageView {
    path: string;
    title?: string;
    referrer?: string;
    properties?: Record<string, any>;
}
/**
 * Analytics provider interface
 */
export interface AnalyticsProvider {
    /**
     * Provider name
     */
    name: string;
    /**
     * Initialize the provider
     */
    init?: () => void | Promise<void>;
    /**
     * Track an event
     */
    track: (event: AnalyticsEvent) => void | Promise<void>;
    /**
     * Identify a user
     */
    identify?: (user: AnalyticsUser) => void | Promise<void>;
    /**
     * Track a page view
     */
    page?: (pageView: PageView) => void | Promise<void>;
    /**
     * Reset/clear user data
     */
    reset?: () => void | Promise<void>;
}
/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
    /**
     * Enable/disable analytics
     */
    enabled?: boolean;
    /**
     * Enable debug logging
     */
    debug?: boolean;
    /**
     * Providers to use
     */
    providers?: AnalyticsProvider[];
    /**
     * Auto-track page views
     */
    autoTrackPageViews?: boolean;
    /**
     * Auto-track performance metrics
     */
    autoTrackPerformance?: boolean;
    /**
     * Auto-track errors
     */
    autoTrackErrors?: boolean;
    /**
     * Event name prefix
     */
    eventPrefix?: string;
    /**
     * Respect "Do Not Track" browser setting
     */
    respectDoNotTrack?: boolean;
}
/**
 * Pre-defined event names
 */
export declare const AnalyticsEvents: {
    readonly MESSAGE_SENT: "message_sent";
    readonly MESSAGE_RECEIVED: "message_received";
    readonly MESSAGE_EDITED: "message_edited";
    readonly MESSAGE_DELETED: "message_deleted";
    readonly MESSAGE_COPIED: "message_copied";
    readonly STREAMING_STARTED: "streaming_started";
    readonly STREAMING_COMPLETED: "streaming_completed";
    readonly STREAMING_CANCELLED: "streaming_cancelled";
    readonly STREAMING_ERROR: "streaming_error";
    readonly FEEDBACK_POSITIVE: "feedback_positive";
    readonly FEEDBACK_NEGATIVE: "feedback_negative";
    readonly FILE_UPLOADED: "file_uploaded";
    readonly FILE_DOWNLOAD: "file_download";
    readonly FILE_PREVIEW: "file_preview";
    readonly CONVERSATION_STARTED: "conversation_started";
    readonly CONVERSATION_ENDED: "conversation_ended";
    readonly CONVERSATION_EXPORTED: "conversation_exported";
    readonly CONVERSATION_SHARED: "conversation_shared";
    readonly BUTTON_CLICKED: "button_clicked";
    readonly LINK_CLICKED: "link_clicked";
    readonly MODAL_OPENED: "modal_opened";
    readonly MODAL_CLOSED: "modal_closed";
    readonly TAB_CHANGED: "tab_changed";
    readonly THEME_CHANGED: "theme_changed";
    readonly DARK_MODE_TOGGLED: "dark_mode_toggled";
    readonly FEATURE_USED: "feature_used";
    readonly SETTING_CHANGED: "setting_changed";
    readonly ERROR_OCCURRED: "error_occurred";
    readonly ERROR_RECOVERED: "error_recovered";
    readonly PERFORMANCE_MEASURED: "performance_measured";
    readonly PAGE_LOAD: "page_load";
    readonly SEARCH_PERFORMED: "search_performed";
    readonly SEARCH_RESULT_CLICKED: "search_result_clicked";
    readonly CODE_COPIED: "code_copied";
    readonly DATA_EXPORTED: "data_exported";
};
export type AnalyticsEventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];
//# sourceMappingURL=types.d.ts.map