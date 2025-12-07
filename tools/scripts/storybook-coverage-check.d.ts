#!/usr/bin/env node
/**
 * Get all component files
 */
export function getComponents(): any;
/**
 * Get all hook files
 */
export function getHooks(): any;
/**
 * Get all utility files
 */
export function getUtils(): any;
/**
 * Get all story files
 */
export function getStories(): any;
/**
 * Calculate coverage
 */
export function calculateCoverage(items: any, stories: any): {
    total: any;
    covered: any;
    uncovered: number;
    percentage: number;
    withStories: any;
    withoutStories: any;
};
//# sourceMappingURL=storybook-coverage-check.d.ts.map