/**
 * Demo analytics utilities
 * Track user engagement with demos for conversion insights
 */

import { logger } from '@/lib/logger'

export type DemoName =
  | 'zero-to-chat'
  | 'provider-hotswap'
  | 'streaming-states'
  | 'token-visualizer'
  | 'memory-context'
  | 'accessibility-audit'
  | 'bundle-comparison'
  | 'tool-calling'
  | 'customization-playground'
  | 'enterprise-production'

export type DemoAction =
  | 'demo_viewed'
  | 'demo_started'
  | 'demo_completed'
  | 'demo_reset'
  | 'code_copied'
  | 'full_example_copied'
  | 'provider_switched'
  | 'message_sent'
  | 'tool_executed'
  | 'config_changed'
  | 'cta_clicked'

interface DemoEventData {
  demo_name: DemoName
  action: DemoAction
  label?: string
  value?: number
  metadata?: Record<string, unknown>
}

/**
 * Check if Google Analytics is available
 */
const hasGtag = (): boolean =>
  typeof window !== 'undefined' &&
  typeof (window as { gtag?: unknown }).gtag === 'function'

/**
 * Track a demo event
 * Sends to Google Analytics if available, logs to console in development
 *
 * @param data - Event data to track
 *
 * @example
 * trackDemoEvent({
 *   demo_name: 'zero-to-chat',
 *   action: 'code_copied',
 *   label: 'hero_code'
 * })
 */
export const trackDemoEvent = (data: DemoEventData): void => {
  const { demo_name, action, label, value, metadata } = data

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    logger.debug('[Demo Analytics]', {
      demo_name,
      action,
      label,
      value,
      metadata,
    })
  }

  // Send to Google Analytics if available
  if (hasGtag()) {
    const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag
    gtag('event', action, {
      event_category: 'demos',
      event_label: label || demo_name,
      value,
      demo_name,
      ...metadata,
    })
  }
}

/**
 * Track when a demo page is viewed
 */
export const trackDemoViewed = (demoName: DemoName): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'demo_viewed',
  })
}

/**
 * Track when a demo is started (user interaction)
 */
export const trackDemoStarted = (demoName: DemoName): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'demo_started',
  })
}

/**
 * Track when a demo runs to completion
 */
export const trackDemoCompleted = (
  demoName: DemoName,
  duration?: number
): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'demo_completed',
    value: duration,
  })
}

/**
 * Track when code is copied from a demo
 */
export const trackCodeCopied = (demoName: DemoName, codeType: string): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'code_copied',
    label: codeType,
  })
}

/**
 * Track when full example is copied
 */
export const trackFullExampleCopied = (demoName: DemoName): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'full_example_copied',
  })
}

/**
 * Track when a provider is switched in the hotswap demo
 */
export const trackProviderSwitched = (
  demoName: DemoName,
  fromProvider: string,
  toProvider: string
): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'provider_switched',
    label: `${fromProvider}_to_${toProvider}`,
    metadata: { from: fromProvider, to: toProvider },
  })
}

/**
 * Track when a message is sent in a chat demo
 */
export const trackMessageSent = (demoName: DemoName): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'message_sent',
  })
}

/**
 * Track when a tool is executed in the tool-calling demo
 */
export const trackToolExecuted = (demoName: DemoName, toolId: string): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'tool_executed',
    label: toolId,
  })
}

/**
 * Track when a CTA button is clicked
 */
export const trackCtaClicked = (demoName: DemoName, ctaLabel: string): void => {
  trackDemoEvent({
    demo_name: demoName,
    action: 'cta_clicked',
    label: ctaLabel,
  })
}

/**
 * Hook to track demo view on mount
 * Use this in demo pages to automatically track page views
 *
 * @example
 * export default function ZeroToChatDemo() {
 *   useDemoViewTracking('zero-to-chat')
 *   // ...
 * }
 */
export const useDemoViewTracking = (demoName: DemoName): void => {
  if (typeof window !== 'undefined') {
    // Use setTimeout to ensure tracking happens after hydration
    setTimeout(() => trackDemoViewed(demoName), 0)
  }
}
