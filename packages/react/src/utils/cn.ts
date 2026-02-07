/**
 * Re-export the canonical cn() from @clarity-chat/primitives.
 *
 * This replaces a simplified implementation that did NOT handle
 * Tailwind CSS class conflicts (it used filter+join instead of twMerge).
 * See: docs/consolidation-plan.md P0-1
 */
export { cn } from '@clarity-chat/primitives'
