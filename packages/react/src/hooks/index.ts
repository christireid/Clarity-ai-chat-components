/**
 * Hooks Index
 *
 * This module provides organized access to all hooks.
 * Hooks are grouped by domain for better discoverability:
 *
 * - chat/        Core chat and AI hooks
 * - streaming/   Streaming response hooks
 * - message/     Message management hooks
 * - ui/          UI utility hooks
 * - keyboard/    Keyboard navigation hooks
 * - storage/     Data persistence hooks
 * - token/       Token management hooks
 * - theme/       Theme hooks
 * - resilience/  Error handling and retry hooks
 * - performance/ Performance optimization hooks
 * - dashboard/   Dashboard data hooks
 * - input/       Input handling hooks
 * - context/     Context monitoring hooks
 * - model/       Model selection hooks
 * - security/    Security hooks
 */

// Chat Hooks
export * from './chat'

// Streaming Hooks
export * from './streaming'

// Message Hooks
export * from './message'

// UI Hooks
export * from './ui'

// Keyboard Hooks
export * from './keyboard'

// Storage Hooks
export * from './storage'

// Token Hooks
export * from './token'

// Theme Hooks
export * from './theme'

// Resilience Hooks
export * from './resilience'

// Performance Hooks
export * from './performance'

// Dashboard Hooks
export * from './dashboard'

// Input Hooks
export * from './input'

// Context Hooks
export * from './context'

// Model Hooks
export * from './model'

// Security Hooks (excluded from build due to cross-package dependencies)
// export * from './security'
