/**
 * Strict TypeScript type definitions for enhanced type safety
 */

/**
 * Strict component props with comprehensive typing
 */
export interface StrictComponentProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-disabled'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-live'?: 'off' | 'assertive' | 'polite';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals';
  'aria-busy'?: boolean;
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  'aria-required'?: boolean;
  'aria-readonly'?: boolean;
  'aria-multiselectable'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-controls'?: string;
  'aria-owns'?: string;
  'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  tabIndex?: number;
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  draggable?: boolean;
  contentEditable?: boolean | 'true' | 'false' | 'inherit';
  spellCheck?: boolean;
  translate?: 'yes' | 'no';
  accessKey?: string;
  contextMenu?: string;
  hidden?: boolean | 'hidden' | 'until-found';
  'data-testid'?: string;
  'data-cy'?: string;
  'data-qa'?: string;
  'data-tracking'?: string;
  'data-analytics'?: string;
  'data-ga'?: string;
  'data-gtm'?: string;
  'data-layer'?: string;
  'data-action'?: string;
  'data-category'?: string;
  'data-label'?: string;
  'data-value'?: string;
  'data-interaction'?: string;
  'data-element'?: string;
  'data-component'?: string;
  'data-variant'?: string;
  'data-size'?: string;
  'data-color'?: string;
  'data-state'?: string;
  'data-status'?: string;
  'data-loading'?: boolean;
  'data-disabled'?: boolean;
  'data-active'?: boolean;
  'data-selected'?: boolean;
  'data-checked'?: boolean;
  'data-expanded'?: boolean;
  'data-collapsed'?: boolean;
  'data-open'?: boolean;
  'data-closed'?: boolean;
  'data-valid'?: boolean;
  'data-invalid'?: boolean;
  'data-error'?: boolean;
  'data-warning'?: boolean;
  'data-success'?: boolean;
  'data-info'?: boolean;
  'data-pending'?: boolean;
  'data-processing'?: boolean;
  'data-completed'?: boolean;
  'data-cancelled'?: boolean;
  'data-failed'?: boolean;
  'data-visible'?: boolean;
  'data-hidden'?: boolean;
  'data-animating'?: boolean;
  'data-transitioning'?: boolean;
  'data-dragging'?: boolean;
  'data-dropping'?: boolean;
  'data-hovering'?: boolean;
  'data-focusing'?: boolean;
  'data-pressed'?: boolean;
  'data-grabbing'?: boolean;
  'data-resizing'?: boolean;
  'data-scrolling'?: boolean;
  'data-loading'?: boolean;
  'data-mounted'?: boolean;
  'data-unmounted'?: boolean;
  'data-ready'?: boolean;
  'data-initialized'?: boolean;
  'data-rendered'?: boolean;
  'data-updated'?: boolean;
  'data-changed'?: boolean;
  'data-modified'?: boolean;
  'data-edited'?: boolean;
  'data-saved'?: boolean;
  'data-submitted'?: boolean;
  'data-reset'?: boolean;
  'data-cleared'?: boolean;
  'data-deleted'?: boolean;
  'data-removed'?: boolean;
  'data-added'?: boolean;
  'data-inserted'?: boolean;
  'data-appended'?: boolean;
  'data-prepend'?: boolean;
  'data-replaced'?: boolean;
  'data-swapped'?: boolean;
  'data-moved'?: boolean;
  'data-shifted'?: boolean;
  'data-rotated'?: boolean;
  'data-flipped'?: boolean;
  'data-scaled'?: boolean;
  'data-resized'?: boolean;
  'data-transformed'?: boolean;
  'data-transitioned'?: boolean;
  'data-animated'?: boolean;
}

/**
 * Strict function types with proper error handling
 */
export type StrictFunction<TArgs extends readonly unknown[], TReturn> = 
  (...args: TArgs) => TReturn extends Promise<infer T> ? Promise<T> : TReturn;

/**
 * Strict async function with error handling
 */
export type StrictAsyncFunction<TArgs extends readonly unknown[], TReturn> = 
  (...args: TArgs) => Promise<TReturn>;

/**
 * Strict event handler types
 */
export type StrictEventHandler<TEvent extends Event = Event> = {
  (event: TEvent): void;
  (this: HTMLElement, event: TEvent): void;
};

/**
 * Strict form types with validation
 */
export interface StrictFormField<TValue = unknown> {
  value: TValue;
  error?: string;
  touched: boolean;
  disabled: boolean;
  required: boolean;
  validating: boolean;
}

/**
 * Strict validation result
 */
export interface StrictValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Strict API response types
 */
export interface StrictApiResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * Strict pagination types
 */
export interface StrictPaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Strict paginated response
 */
export interface StrictPaginatedResponse<TItem = unknown> extends StrictPaginationParams {
  items: TItem[];
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Strict filter types
 */
export interface StrictFilterOption {
  value: string | number | boolean;
  label: string;
  count?: number;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * Strict sorting types
 */
export interface StrictSortOption {
  value: string;
  label: string;
  direction: 'asc' | 'desc';
  active?: boolean;
}

/**
 * Strict loading states
 */
export type StrictLoadingState = 'idle' | 'loading' | 'success' | 'error' | 'retry';

/**
 * Strict error types
 */
export interface StrictError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  stack?: string;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
}

/**
 * Strict theme types
 */
export interface StrictTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    divider: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  borderRadius: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      linear: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

/**
 * Strict accessibility types
 */
export interface StrictAccessibilityFeatures {
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  focusIndicators: boolean;
  skipLinks: boolean;
  ariaLabels: boolean;
  colorContrast: 'aa' | 'aaa';
  language: string;
  readingLevel: string;
}

/**
 * Strict performance metrics
 */
export interface StrictPerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  tti: number; // Time to Interactive
  loadTime: number;
  domContentLoaded: number;
  resources: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    total: number;
  };
  memory: {
    used: number;
    total: number;
    limit: number;
  };
}

/**
 * Strict security types
 */
export interface StrictSecurityHeaders {
  'X-Content-Type-Options': 'nosniff';
  'X-Frame-Options': 'DENY' | 'SAMEORIGIN';
  'X-XSS-Protection': '1; mode=block';
  'Strict-Transport-Security': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Content-Security-Policy': string;
}

/**
 * Strict analytics types
 */
export interface StrictAnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  customDimensions?: Record<string, string | number | boolean>;
  timestamp: string;
  sessionId: string;
  userId?: string;
  url: string;
  referrer: string;
  userAgent: string;
  viewport: string;
  screenResolution: string;
  colorDepth: number;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  online: boolean;
  loadTime: number;
}

/**
 * Strict testing types
 */
export interface StrictTestCase {
  name: string;
  description: string;
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  test: () => Promise<void>;
  assertions: number;
  timeout: number;
  retries: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[];
}