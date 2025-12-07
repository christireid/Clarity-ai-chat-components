/**
 * In-memory analytics storage
 * Production should use a database (PostgreSQL, MongoDB, etc.)
 */
import type { AnalyticsEntry, DailySummary, SummaryStats } from '../types/analytics';
/**
 * Add an analytics entry
 */
export declare function addEntry(entry: Omit<AnalyticsEntry, 'id' | 'timestamp'>): AnalyticsEntry;
/**
 * Get all entries
 */
export declare function getEntries(limit?: number): AnalyticsEntry[];
/**
 * Get entries within time range
 */
export declare function getEntriesByDateRange(start: Date, end: Date): AnalyticsEntry[];
/**
 * Get summary statistics
 */
export declare function getSummaryStats(): SummaryStats;
/**
 * Get daily summaries
 */
export declare function getDailySummaries(days?: number): DailySummary[];
/**
 * Clear all entries (for testing)
 */
export declare function clearAllEntries(): void;
/**
 * Get entry count
 */
export declare function getEntryCount(): number;
//# sourceMappingURL=storage.d.ts.map