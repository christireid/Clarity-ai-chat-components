/**
 * Token Budget Manager Tests
 */
import { describe, it, expect } from 'vitest';
import { TokenBudgetManager } from '../token-budget';
const createConfig = (overrides) => ({
    maxContextWindow: 10000,
    dynamicAllocation: true,
    allocation: {
        systemPrompt: 0.1,
        userPreferences: 0.1,
        recentContext: 0.2,
        semanticMemory: 0.25,
        episodicMemory: 0.2,
        responseReserve: 0.15,
    },
    ...overrides,
});
describe('TokenBudgetManager', () => {
    describe('getAllocation', () => {
        it('should calculate allocation based on percentages', () => {
            const manager = new TokenBudgetManager(createConfig());
            const allocation = manager.getAllocation();
            expect(allocation.systemPrompt).toBe(1000); // 10% of 10000
            expect(allocation.userPreferences).toBe(1000); // 10%
            expect(allocation.recentContext).toBe(2000); // 20%
            expect(allocation.semanticMemory).toBe(2500); // 25%
            expect(allocation.episodicMemory).toBe(2000); // 20%
            expect(allocation.responseReserve).toBe(1500); // 15%
            expect(allocation.total).toBe(10000);
        });
        it('should respect maxTokens override', () => {
            const manager = new TokenBudgetManager(createConfig());
            const allocation = manager.getAllocation({ maxTokens: 5000 });
            expect(allocation.systemPrompt).toBe(500);
            expect(allocation.total).toBe(5000);
        });
    });
    describe('adjustAllocation', () => {
        it('should not adjust when dynamicAllocation is disabled', () => {
            const manager = new TokenBudgetManager(createConfig({ dynamicAllocation: false }));
            const breakdown = manager.getAllocation();
            const adjusted = manager.adjustAllocation(breakdown, {
                hasPreferences: false,
                hasRecent: false,
                memoryRichness: 0,
            });
            expect(adjusted).toEqual(breakdown);
        });
        it('should redistribute unused preferences allocation', () => {
            const manager = new TokenBudgetManager(createConfig());
            const breakdown = manager.getAllocation();
            const adjusted = manager.adjustAllocation(breakdown, {
                hasPreferences: false,
                hasRecent: true,
                memoryRichness: 0.5,
            });
            expect(adjusted.userPreferences).toBe(0);
            // Preferences redistributed to semantic/episodic
            expect(adjusted.semanticMemory).toBeGreaterThan(breakdown.semanticMemory);
        });
        describe('MEM-006: Token budget rebalancing fix', () => {
            it('should correctly reduce semanticMemory when excess <= semanticMemory', () => {
                const manager = new TokenBudgetManager(createConfig());
                // Create a breakdown that exceeds maxTokens
                const breakdown = manager.getAllocation();
                // Manually set values to create excess scenario
                breakdown.semanticMemory = 3000; // Over-allocated
                breakdown.total = 10000;
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 0.5,
                });
                // Should not go negative
                expect(adjusted.semanticMemory).toBeGreaterThanOrEqual(0);
                expect(adjusted.episodicMemory).toBeGreaterThanOrEqual(0);
            });
            it('should cascade reduction when semanticMemory is not enough', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 1000 }));
                const breakdown = manager.getAllocation({ maxTokens: 1000 });
                // Force a scenario where total exceeds max
                breakdown.systemPrompt = 500;
                breakdown.userPreferences = 500;
                breakdown.recentContext = 500;
                breakdown.semanticMemory = 100;
                breakdown.episodicMemory = 100;
                breakdown.summary = 50;
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 1,
                });
                // All values should remain non-negative
                expect(adjusted.systemPrompt).toBeGreaterThanOrEqual(0);
                expect(adjusted.userPreferences).toBeGreaterThanOrEqual(0);
                expect(adjusted.recentContext).toBeGreaterThanOrEqual(0);
                expect(adjusted.semanticMemory).toBeGreaterThanOrEqual(0);
                expect(adjusted.episodicMemory).toBeGreaterThanOrEqual(0);
            });
            it('should properly calculate remaining after zeroing semanticMemory', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 1000 }));
                // Note: currentTotal excludes responseReserve, only counts:
                // systemPrompt + userPreferences + recentContext + semanticMemory + episodicMemory + summary
                const breakdown = {
                    systemPrompt: 200,
                    userPreferences: 200,
                    recentContext: 200,
                    semanticMemory: 300,
                    episodicMemory: 200,
                    responseReserve: 0,
                    summary: 100,
                    total: 1000, // maxTokens
                };
                // currentTotal = 200 + 200 + 200 + 300 + 200 + 100 = 1200
                // excess = 1200 - 1000 = 200
                // semanticMemory (300) >= excess (200), should be reduced by 200 to 100
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 0.5, // Neutral - doesn't trigger additional adjustments
                });
                expect(adjusted.semanticMemory).toBe(100);
                expect(adjusted.episodicMemory).toBe(200); // Unchanged
            });
            it('should handle edge case where remaining equals episodicMemory exactly', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 1000 }));
                const breakdown = {
                    systemPrompt: 100,
                    userPreferences: 100,
                    recentContext: 200,
                    semanticMemory: 100,
                    episodicMemory: 200,
                    responseReserve: 100,
                    summary: 100,
                    total: 800, // Forces excess of 100
                };
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 1,
                });
                expect(adjusted.semanticMemory).toBeGreaterThanOrEqual(0);
                expect(adjusted.episodicMemory).toBeGreaterThanOrEqual(0);
            });
            it('should cascade to userPreferences when other allocations exhausted', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 500 }));
                const breakdown = {
                    systemPrompt: 200,
                    userPreferences: 200,
                    recentContext: 100,
                    semanticMemory: 100,
                    episodicMemory: 100,
                    responseReserve: 0,
                    summary: 100,
                    total: 500, // maxTokens
                };
                // currentTotal = 200 + 200 + 100 + 100 + 100 + 100 = 800
                // excess = 800 - 500 = 300
                // Reduction order: semanticMemory(100) → episodicMemory(100) → recentContext(100) = 300
                // Should reduce all three to 0
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 0.5,
                });
                expect(adjusted.semanticMemory).toBe(0);
                expect(adjusted.episodicMemory).toBe(0);
                expect(adjusted.recentContext).toBe(0);
                // userPreferences should be unchanged since we absorbed all excess
                expect(adjusted.userPreferences).toBe(200);
            });
            it('should reduce userPreferences when needed', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 300 }));
                const breakdown = {
                    systemPrompt: 200,
                    userPreferences: 200,
                    recentContext: 100,
                    semanticMemory: 100,
                    episodicMemory: 100,
                    responseReserve: 0,
                    summary: 100,
                    total: 300, // maxTokens
                };
                // currentTotal = 200 + 200 + 100 + 100 + 100 + 100 = 800
                // excess = 800 - 300 = 500
                // Reduction: semantic(100) + episodic(100) + recent(100) + userPref(200) = 500
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 0.5,
                });
                expect(adjusted.semanticMemory).toBe(0);
                expect(adjusted.episodicMemory).toBe(0);
                expect(adjusted.recentContext).toBe(0);
                expect(adjusted.userPreferences).toBe(0);
                // systemPrompt unchanged when not needed
                expect(adjusted.systemPrompt).toBe(200);
            });
            it('should reduce systemPrompt as last resort when all else exhausted', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 100 }));
                const breakdown = {
                    systemPrompt: 500,
                    userPreferences: 0,
                    recentContext: 0,
                    semanticMemory: 0,
                    episodicMemory: 0,
                    responseReserve: 0,
                    summary: 0,
                    total: 100, // maxTokens
                };
                // currentTotal = 500, excess = 400
                // Only systemPrompt available to reduce
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 0.5,
                });
                expect(adjusted.systemPrompt).toBe(100);
            });
        });
        describe('Input validation', () => {
            it('should handle NaN memoryRichness', () => {
                const manager = new TokenBudgetManager(createConfig());
                const breakdown = manager.getAllocation();
                // Should not throw, NaN treated as 0
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: NaN,
                });
                expect(adjusted.semanticMemory).toBeGreaterThanOrEqual(0);
            });
            it('should handle negative memoryRichness', () => {
                const manager = new TokenBudgetManager(createConfig());
                const breakdown = manager.getAllocation();
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: -0.5, // Clamped to 0
                });
                // memoryRichness < 0.3 triggers reduction
                expect(adjusted).toBeDefined();
            });
            it('should handle memoryRichness > 1', () => {
                const manager = new TokenBudgetManager(createConfig());
                const breakdown = manager.getAllocation();
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 2.0, // Clamped to 1
                });
                // memoryRichness > 0.7 triggers increase
                expect(adjusted).toBeDefined();
            });
            it('should handle maxTokens = 0', () => {
                const manager = new TokenBudgetManager(createConfig({ maxContextWindow: 0 }));
                const allocation = manager.getAllocation();
                // Should default to 1 to avoid division issues
                expect(allocation.total).toBe(1);
            });
            it('should handle negative allocation values gracefully', () => {
                const manager = new TokenBudgetManager(createConfig());
                const breakdown = {
                    systemPrompt: -100,
                    userPreferences: 100,
                    recentContext: 100,
                    semanticMemory: 100,
                    episodicMemory: 100,
                    responseReserve: 0,
                    summary: 100,
                    total: 1000,
                };
                // Should not throw
                const adjusted = manager.adjustAllocation(breakdown, {
                    hasPreferences: true,
                    hasRecent: true,
                    memoryRichness: 0.5,
                });
                expect(adjusted).toBeDefined();
            });
        });
    });
    describe('isWithinBudget', () => {
        it('should return true when within budget', () => {
            const manager = new TokenBudgetManager(createConfig());
            const breakdown = manager.getAllocation();
            expect(manager.isWithinBudget(breakdown)).toBe(true);
        });
        it('should return false when over budget', () => {
            const manager = new TokenBudgetManager(createConfig());
            const breakdown = manager.getAllocation();
            breakdown.semanticMemory = 50000; // Way over
            expect(manager.isWithinBudget(breakdown)).toBe(false);
        });
    });
});
//# sourceMappingURL=token-budget.test.js.map