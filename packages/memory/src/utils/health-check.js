/**
 * Health Check Utilities
 *
 * Verify system health and provide diagnostics
 */
/**
 * Perform health check on memory instance
 */
export async function healthCheck(memory) {
    const result = {
        healthy: true,
        checks: {
            storage: { status: 'ok', message: '' },
            embedding: { status: 'ok', message: '' },
            tokenBudget: { status: 'ok', message: '' },
            compression: { status: 'ok', message: '' },
        },
        recommendations: [],
    };
    try {
        // Check storage
        try {
            const stats = await memory.getStats();
            result.checks.storage = {
                status: 'ok',
                message: `Storage operational. ${stats.totalMemories} memories stored.`,
            };
        }
        catch (error) {
            result.checks.storage = {
                status: 'error',
                message: `Storage check failed: ${error instanceof Error ? error.message : String(error)}`,
            };
            result.healthy = false;
        }
        // Check embedding provider
        try {
            await memory.embed('test');
            result.checks.embedding = {
                status: 'ok',
                message: 'Embedding provider operational.',
            };
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            if (errorMsg.includes('not configured') || errorMsg.includes('not available')) {
                result.checks.embedding = {
                    status: 'warning',
                    message: 'No embedding provider configured. Semantic search will be limited.',
                };
                result.recommendations.push('Consider adding an embedding provider for better semantic search.');
            }
            else {
                result.checks.embedding = {
                    status: 'error',
                    message: `Embedding provider error: ${errorMsg}`,
                };
            }
        }
        // Check token budget
        try {
            const context = await memory.context({ maxTokens: 100 });
            if (context.tokenBreakdown.total > 0) {
                result.checks.tokenBudget = {
                    status: 'ok',
                    message: `Token budgeting operational. Current allocation: ${context.tokenBreakdown.total} tokens.`,
                };
            }
            else {
                result.checks.tokenBudget = {
                    status: 'warning',
                    message: 'Token budget not configured. Context optimization disabled.',
                };
                result.recommendations.push('Configure tokenBudget for automatic context optimization.');
            }
        }
        catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error);
            if (errorMsg.includes('not available') || errorMsg.includes('not configured')) {
                result.checks.tokenBudget = {
                    status: 'warning',
                    message: 'Token budget not configured.',
                };
                result.recommendations.push('Configure tokenBudget for automatic context optimization.');
            }
            else {
                result.checks.tokenBudget = {
                    status: 'error',
                    message: `Token budget error: ${errorMsg}`,
                };
            }
        }
        // Check compression
        try {
            const testMemoryId = await memory.add('Test memory for compression check');
            try {
                await memory.compress(testMemoryId);
                result.checks.compression = {
                    status: 'ok',
                    message: 'Compression engine operational.',
                };
                // Clean up test memory
                await memory.forget(testMemoryId);
            }
            catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                if (errorMsg.includes('not configured') || errorMsg.includes('not available')) {
                    result.checks.compression = {
                        status: 'warning',
                        message: 'Compression not configured. Memory compression disabled.',
                    };
                    result.recommendations.push('Configure compression for automatic memory optimization.');
                }
                else {
                    result.checks.compression = {
                        status: 'error',
                        message: `Compression error: ${errorMsg}`,
                    };
                }
                // Clean up test memory
                await memory.forget(testMemoryId).catch(() => { });
            }
        }
        catch (error) {
            result.checks.compression = {
                status: 'error',
                message: `Compression check failed: ${error instanceof Error ? error.message : String(error)}`,
            };
        }
    }
    catch {
        // Unexpected error during health check
        result.healthy = false;
    }
    return result;
}
/**
 * Format health check result as a user-friendly message
 */
export function formatHealthCheck(result) {
    const parts = [];
    parts.push(result.healthy ? '✅ System Healthy' : '❌ System Issues Detected');
    parts.push('');
    Object.entries(result.checks).forEach(([name, check]) => {
        const icon = check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
        parts.push(`${icon} ${name.charAt(0).toUpperCase() + name.slice(1)}: ${check.message}`);
    });
    if (result.recommendations.length > 0) {
        parts.push('');
        parts.push('💡 Recommendations:');
        result.recommendations.forEach(rec => parts.push(`  - ${rec}`));
    }
    return parts.join('\n');
}
//# sourceMappingURL=health-check.js.map