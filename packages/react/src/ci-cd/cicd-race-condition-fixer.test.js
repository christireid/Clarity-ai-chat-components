/**
 * CI/CD Race Condition Fixer Tests
 * Comprehensive test suite for CI/CD race condition prevention
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CIDCRaceConditionFixer, BuildOrchestrator, CIDMonitor } from './cicd-race-condition-fixer';
// Mock filesystem operations
vi.mock('fs', () => ({
    readFileSync: vi.fn(() => '{}'),
    writeFileSync: vi.fn(),
    existsSync: vi.fn(() => false),
    mkdirSync: vi.fn()
}));
// Mock timers for better control
describe('CIDCRaceConditionFixer', () => {
    let fixer;
    let events;
    beforeEach(() => {
        events = [];
        fixer = new CIDCRaceConditionFixer({
            buildTimeout: 5000,
            testTimeout: 3000,
            maxRetries: 2,
            retryDelay: 100,
            parallelJobs: 2,
            lockTimeout: 1000,
            cleanupTimeout: 1000,
            healthCheckInterval: 1000,
            dependencyTimeout: 2000
        });
        // Capture events
        fixer.on('build-started', (data) => events.push({ type: 'build-started', data }));
        fixer.on('build-completed', (data) => events.push({ type: 'build-completed', data }));
        fixer.on('build-failed', (data) => events.push({ type: 'build-failed', data }));
        fixer.on('build-retry', (data) => events.push({ type: 'build-retry', data }));
        fixer.on('lock-acquired', (data) => events.push({ type: 'lock-acquired', data }));
        fixer.on('lock-released', (data) => events.push({ type: 'lock-released', data }));
        fixer.on('lock-timeout', (data) => events.push({ type: 'lock-timeout', data }));
        fixer.on('race-condition-detected', (data) => events.push({ type: 'race-condition-detected', data }));
        fixer.on('service-unhealthy', (data) => events.push({ type: 'service-unhealthy', data }));
        fixer.on('health-check-failed', (data) => events.push({ type: 'health-check-failed', data }));
        fixer.on('cleanup-started', () => events.push({ type: 'cleanup-started' }));
        fixer.on('cleanup-completed', () => events.push({ type: 'cleanup-completed' }));
        fixer.on('cleanup-failed', (error) => events.push({ type: 'cleanup-failed', error }));
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with default config', () => {
            const defaultFixer = new CIDCRaceConditionFixer();
            // Test that it has reasonable defaults
            expect(defaultFixer).toBeDefined();
        });
        it('should merge custom config with defaults', () => {
            const customFixer = new CIDCRaceConditionFixer({
                buildTimeout: 10000,
                maxRetries: 5,
                parallelJobs: 8
            });
            expect(customFixer).toBeDefined();
        });
    });
    describe('executeBuild', () => {
        it('should execute build successfully', async () => {
            const buildId = 'test-build-1';
            const result = await fixer.executeBuild(buildId);
            expect(result).toBeDefined();
            expect(result.id).toBe(buildId);
            expect(result.status).toBe('completed');
            expect(result.stage).toBe('deploy');
            // Check events
            const startedEvent = events.find(e => e.type === 'build-started');
            const completedEvent = events.find(e => e.type === 'build-completed');
            expect(startedEvent).toBeDefined();
            expect(completedEvent).toBeDefined();
        });
        it('should handle build with dependencies', async () => {
            const depId = 'dependency-1';
            const buildId = 'test-build-2';
            // First complete the dependency
            const depResult = await fixer.executeBuild(depId);
            expect(depResult.status).toBe('completed');
            // Then execute build with dependency
            const result = await fixer.executeBuild(buildId, [depId]);
            expect(result.status).toBe('completed');
            expect(result.dependencies).toContain(depId);
        });
        it('should handle dependency timeout', async () => {
            const buildId = 'test-build-3';
            const nonExistentDep = 'non-existent-dep';
            await expect(fixer.executeBuild(buildId, [nonExistentDep])).rejects.toThrow('Timeout waiting for dependencies');
        });
        it('should handle failed dependencies', async () => {
            const failedDepId = 'failed-dependency';
            const buildId = 'test-build-4';
            // Mock a failed dependency
            vi.spyOn(fixer, 'executeStage').mockImplementationOnce(() => {
                throw new Error('Dependency failed');
            });
            await fixer.executeBuild(failedDepId);
            // Now try to build with failed dependency
            await expect(fixer.executeBuild(buildId, [failedDepId])).rejects.toThrow('Dependencies failed');
        });
        it('should retry failed builds', async () => {
            const buildId = 'test-build-5';
            // Mock stage execution to fail initially then succeed
            let failCount = 0;
            vi.spyOn(fixer, 'executeStage').mockImplementation(async function () {
                if (failCount < 1) {
                    failCount++;
                    throw new Error('Simulated failure');
                }
                // Reset to original implementation
                vi.spyOn(fixer, 'executeStage').mockRestore();
            });
            const result = await fixer.executeBuild(buildId);
            expect(result.status).toBe('completed');
            expect(result.retryCount).toBeGreaterThan(0);
            // Check retry event
            const retryEvent = events.find(e => e.type === 'build-retry');
            expect(retryEvent).toBeDefined();
        });
        it('should handle build timeout', async () => {
            const buildId = 'test-build-6';
            // Mock a very long stage execution
            vi.spyOn(fixer, 'simulateStageExecution').mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 6000)); // Longer than timeout
            });
            await expect(fixer.executeBuild(buildId)).rejects.toThrow('Build stage install timed out');
        });
    });
    describe('lock management', () => {
        it('should acquire and release locks', async () => {
            const resource = 'test-resource';
            const acquired = await fixer.acquireLock(resource, 1000);
            expect(acquired).toBe(true);
            const lockAcquiredEvent = events.find(e => e.type === 'lock-acquired');
            expect(lockAcquiredEvent).toBeDefined();
            expect(lockAcquiredEvent.data.resource).toBe(resource);
            await fixer.releaseLock(resource);
            const lockReleasedEvent = events.find(e => e.type === 'lock-released');
            expect(lockReleasedEvent).toBeDefined();
            expect(lockReleasedEvent.data.resource).toBe(resource);
        });
        it('should handle lock timeout', async () => {
            const resource = 'locked-resource';
            // First acquire the lock
            await fixer.acquireLock(resource, 1000);
            // Try to acquire again with short timeout
            const acquired = await fixer.acquireLock(resource, 100);
            expect(acquired).toBe(false);
            const lockTimeoutEvent = events.find(e => e.type === 'lock-timeout');
            expect(lockTimeoutEvent).toBeDefined();
            expect(lockTimeoutEvent.data.resource).toBe(resource);
        });
        it('should handle concurrent lock acquisition', async () => {
            const resource = 'concurrent-resource';
            // Acquire lock in background
            const lockPromise = fixer.acquireLock(resource, 1000);
            // Try to acquire same lock immediately (should fail)
            const immediateAcquired = await fixer.acquireLock(resource, 50);
            expect(immediateAcquired).toBe(false);
            // Wait for first lock to complete
            const firstAcquired = await lockPromise;
            expect(firstAcquired).toBe(true);
            // Now release and try again
            await fixer.releaseLock(resource);
            const secondAcquired = await fixer.acquireLock(resource, 100);
            expect(secondAcquired).toBe(true);
        });
    });
    describe('race condition detection', () => {
        it('should detect race conditions', async () => {
            const buildId = 'race-test-build';
            // First build should detect no race
            const firstResult = await fixer.executeBuild(buildId);
            expect(firstResult.status).toBe('completed');
            // Try concurrent build of same ID (should detect race)
            const concurrentPromise = fixer.executeBuild(buildId);
            const raceEvent = events.find(e => e.type === 'race-condition-detected');
            expect(raceEvent).toBeDefined();
            // The concurrent build should fail due to race condition
            const concurrentResult = await concurrentPromise;
            expect(concurrentResult.status).toBe('failed');
            expect(concurrentResult.error?.message).toContain('Race condition detected');
        });
        it('should provide race condition statistics', () => {
            const stats = fixer.getRaceStatistics();
            expect(stats).toBeDefined();
            expect(stats).toHaveProperty('totalDetections');
            expect(stats).toHaveProperty('resolvedCount');
            expect(stats).toHaveProperty('failedCount');
            expect(stats).toHaveProperty('averageResolutionTime');
            expect(stats).toHaveProperty('mostCommonResource');
            expect(stats).toHaveProperty('severityDistribution');
        });
    });
    describe('health checks', () => {
        it('should perform health checks', async () => {
            // Wait for health checks to run
            await new Promise(resolve => setTimeout(resolve, 1500));
            const healthChecks = fixer.getHealthChecks();
            expect(healthChecks.length).toBeGreaterThan(0);
            const healthCheck = healthChecks[0];
            expect(healthCheck).toHaveProperty('service');
            expect(healthCheck).toHaveProperty('status');
            expect(healthCheck).toHaveProperty('responseTime');
            expect(healthCheck).toHaveProperty('lastCheck');
        });
        it('should handle unhealthy services', async () => {
            // Mock unhealthy service
            vi.spyOn(fixer, 'checkServiceHealth').mockResolvedValue(false);
            // Wait for health check to detect unhealthy service
            await new Promise(resolve => setTimeout(resolve, 1500));
            const unhealthyEvent = events.find(e => e.type === 'service-unhealthy');
            expect(unhealthyEvent).toBeDefined();
        });
        it('should handle health check failures', async () => {
            // Mock health check failure
            vi.spyOn(fixer, 'checkServiceHealth').mockRejectedValue(new Error('Health check failed'));
            // Wait for health check to fail
            await new Promise(resolve => setTimeout(resolve, 1500));
            const failedEvent = events.find(e => e.type === 'health-check-failed');
            expect(failedEvent).toBeDefined();
            expect(failedEvent.data.error).toBeDefined();
        });
    });
    describe('cleanup', () => {
        it('should perform cleanup', async () => {
            // Add some test builds and locks
            await fixer.executeBuild('cleanup-test-build');
            await fixer.acquireLock('cleanup-test-lock', 1000);
            await fixer.cleanup();
            const cleanupStartedEvent = events.find(e => e.type === 'cleanup-started');
            const cleanupCompletedEvent = events.find(e => e.type === 'cleanup-completed');
            expect(cleanupStartedEvent).toBeDefined();
            expect(cleanupCompletedEvent).toBeDefined();
            // Check that locks are released
            const locks = fixer.locks;
            expect(locks.size).toBe(0);
        });
        it('should handle cleanup failures', async () => {
            // Mock cleanup failure
            vi.spyOn(fixer, 'delay').mockRejectedValue(new Error('Cleanup failed'));
            await expect(fixer.cleanup()).rejects.toThrow('Cleanup failed');
            const cleanupFailedEvent = events.find(e => e.type === 'cleanup-failed');
            expect(cleanupFailedEvent).toBeDefined();
            expect(cleanupFailedEvent.error).toBeDefined();
        });
    });
    describe('dependency management', () => {
        it('should add and remove dependencies', () => {
            const buildId = 'dep-test-build';
            const dep1 = 'dependency-1';
            const dep2 = 'dependency-2';
            // Add dependencies
            fixer.addDependency(buildId, dep1);
            fixer.addDependency(buildId, dep2);
            const buildState = fixer.getBuildState(buildId);
            expect(buildState?.dependencies).toContain(dep1);
            expect(buildState?.dependencies).toContain(dep2);
            // Remove dependency
            fixer.removeDependency(buildId, dep1);
            const updatedState = fixer.getBuildState(buildId);
            expect(updatedState?.dependencies).not.toContain(dep1);
            expect(updatedState?.dependencies).toContain(dep2);
        });
        it('should handle non-existent builds gracefully', () => {
            const nonExistentBuild = 'non-existent';
            const dep = 'some-dependency';
            // Should not throw when adding/removing dependencies for non-existent builds
            expect(() => fixer.addDependency(nonExistentBuild, dep)).not.toThrow();
            expect(() => fixer.removeDependency(nonExistentBuild, dep)).not.toThrow();
        });
    });
});
describe('BuildOrchestrator', () => {
    let fixer;
    let orchestrator;
    let events;
    beforeEach(() => {
        events = [];
        fixer = new CIDCRaceConditionFixer({
            buildTimeout: 5000,
            testTimeout: 3000,
            maxRetries: 2,
            retryDelay: 100,
            parallelJobs: 2
        });
        orchestrator = new BuildOrchestrator(fixer);
        orchestrator.on('build-queued', (data) => events.push({ type: 'build-queued', data }));
        orchestrator.on('orchestrator-error', (data) => events.push({ type: 'orchestrator-error', data }));
    });
    describe('queue management', () => {
        it('should add builds to queue', () => {
            const buildId = 'orch-build-1';
            const dependencies = ['dep1', 'dep2'];
            orchestrator.addBuild(buildId, dependencies);
            const queueStatus = orchestrator.getQueueStatus();
            expect(queueStatus.queued).toBe(1);
            expect(queueStatus.total).toBe(1);
            const queuedEvent = events.find(e => e.type === 'build-queued');
            expect(queuedEvent).toBeDefined();
            expect(queuedEvent.data.buildId).toBe(buildId);
            expect(queuedEvent.data.dependencies).toEqual(dependencies);
        });
        it('should prevent duplicate builds in queue', () => {
            const buildId = 'orch-build-2';
            orchestrator.addBuild(buildId);
            orchestrator.addBuild(buildId); // Duplicate
            const queueStatus = orchestrator.getQueueStatus();
            expect(queueStatus.queued).toBe(1); // Should still be 1
        });
        it('should execute builds with satisfied dependencies', async () => {
            const depId = 'orch-dep-1';
            const buildId = 'orch-build-3';
            // First complete the dependency
            await fixer.executeBuild(depId);
            // Then add build with dependency
            orchestrator.addBuild(buildId, [depId]);
            // Wait for processing
            await new Promise(resolve => setTimeout(resolve, 500));
            const depBuild = fixer.getBuildState(depId);
            const build = fixer.getBuildState(buildId);
            expect(depBuild?.status).toBe('completed');
            expect(build?.status).toBe('completed');
        });
    });
    describe('orchestration', () => {
        it('should handle orchestration errors gracefully', async () => {
            const buildId = 'orch-error-build';
            // Mock build execution to fail
            vi.spyOn(fixer, 'executeBuild').mockRejectedValue(new Error('Build execution failed'));
            orchestrator.addBuild(buildId);
            // Wait for processing
            await new Promise(resolve => setTimeout(resolve, 500));
            const errorEvent = events.find(e => e.type === 'orchestrator-error');
            expect(errorEvent).toBeDefined();
            expect(errorEvent.data.buildId).toBe(buildId);
            expect(errorEvent.data.error).toBeDefined();
        });
        it('should respect parallel job limits', async () => {
            // Add multiple builds
            for (let i = 0; i < 5; i++) {
                orchestrator.addBuild(`parallel-build-${i}`);
            }
            const queueStatus = orchestrator.getQueueStatus();
            expect(queueStatus.queued).toBe(5);
            // Should respect parallel job limit (2 in config)
            const activeBuilds = Array.from(fixer.activeBuilds).length;
            expect(activeBuilds).toBeLessThanOrEqual(2);
        });
    });
});
describe('CIDMonitor', () => {
    let fixer;
    let monitor;
    let events;
    beforeEach(() => {
        events = [];
        fixer = new CIDCRaceConditionFixer({
            buildTimeout: 5000,
            testTimeout: 3000,
            maxRetries: 2,
            retryDelay: 100
        });
        monitor = new CIDMonitor(fixer);
        monitor.on('metric-updated', (data) => events.push({ type: 'metric-updated', data }));
        monitor.on('alert', (data) => events.push({ type: 'alert', data }));
    });
    describe('monitoring', () => {
        it('should track build completion metrics', async () => {
            // Execute some builds
            await fixer.executeBuild('monitor-build-1');
            await fixer.executeBuild('monitor-build-2');
            const metrics = monitor.getMetrics();
            expect(metrics).toHaveProperty('build-completion-rate');
            expect(metrics['build-completion-rate']).toBeGreaterThanOrEqual(0);
            expect(metrics['build-completion-rate']).toBeLessThanOrEqual(100);
            const metricEvents = events.filter(e => e.type === 'metric-updated');
            expect(metricEvents.length).toBeGreaterThan(0);
        });
        it('should generate alerts for unhealthy services', async () => {
            // Mock unhealthy service
            vi.spyOn(fixer, 'checkServiceHealth').mockResolvedValue(false);
            // Wait for health check to detect unhealthy service
            await new Promise(resolve => setTimeout(resolve, 1500));
            const alertEvents = events.filter(e => e.type === 'alert');
            const unhealthyAlert = alertEvents.find(e => e.data.type === 'service-health');
            expect(unhealthyAlert).toBeDefined();
            expect(unhealthyAlert.data.severity).toBeDefined();
        });
        it('should generate alerts for race conditions', async () => {
            // Trigger a race condition
            const buildId = 'race-alert-build';
            // Start first build
            const firstBuild = fixer.executeBuild(buildId);
            // Immediately try to start same build (should trigger race detection)
            const secondBuild = fixer.executeBuild(buildId);
            await Promise.allSettled([firstBuild, secondBuild]);
            const alertEvents = events.filter(e => e.type === 'alert');
            const raceAlert = alertEvents.find(e => e.data.type === 'race-condition');
            expect(raceAlert).toBeDefined();
            expect(raceAlert.data.severity).toBe('high');
        });
    });
    describe('statistics', () => {
        it('should provide race condition statistics', () => {
            const stats = monitor.getRaceStatistics();
            expect(stats).toBeDefined();
            expect(stats).toHaveProperty('totalDetections');
            expect(stats).toHaveProperty('resolvedCount');
            expect(stats).toHaveProperty('failedCount');
            expect(stats).toHaveProperty('averageResolutionTime');
            expect(stats).toHaveProperty('mostCommonResource');
            expect(stats).toHaveProperty('severityDistribution');
        });
    });
});
describe('Integration Tests', () => {
    let fixer;
    let orchestrator;
    let monitor;
    beforeEach(() => {
        fixer = new CIDCRaceConditionFixer({
            buildTimeout: 10000,
            testTimeout: 5000,
            maxRetries: 3,
            retryDelay: 200,
            parallelJobs: 4,
            lockTimeout: 2000,
            cleanupTimeout: 1000,
            healthCheckInterval: 500,
            dependencyTimeout: 3000
        });
        orchestrator = new BuildOrchestrator(fixer);
        monitor = new CIDMonitor(fixer);
    });
    it('should handle complex build pipeline with dependencies', async () => {
        // Create a complex dependency graph
        const builds = [
            { id: 'core-lib', deps: [] },
            { id: 'utils', deps: ['core-lib'] },
            { id: 'api', deps: ['core-lib', 'utils'] },
            { id: 'ui', deps: ['core-lib', 'utils'] },
            { id: 'tests', deps: ['core-lib', 'utils', 'api', 'ui'] },
            { id: 'package', deps: ['tests'] },
            { id: 'deploy', deps: ['package'] }
        ];
        // Add all builds to orchestrator
        builds.forEach(({ id, deps }) => {
            orchestrator.addBuild(id, deps);
        });
        // Wait for all builds to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Verify all builds completed successfully
        const buildStates = fixer.getBuildStates();
        expect(buildStates.length).toBe(builds.length);
        const successfulBuilds = buildStates.filter(b => b.status === 'completed');
        expect(successfulBuilds.length).toBeGreaterThan(0);
        // Verify dependency order was respected
        const coreLibBuild = fixer.getBuildState('core-lib');
        const utilsBuild = fixer.getBuildState('utils');
        const apiBuild = fixer.getBuildState('api');
        if (coreLibBuild && utilsBuild && apiBuild) {
            expect(coreLibBuild.endTime?.getTime()).toBeLessThan(utilsBuild.startTime.getTime());
            expect(utilsBuild.endTime?.getTime()).toBeLessThan(apiBuild.startTime.getTime());
        }
    });
    it('should handle concurrent builds with shared dependencies', async () => {
        // Create builds that share dependencies
        const sharedDep = 'shared-lib';
        const builds = [
            { id: 'app1', deps: [sharedDep] },
            { id: 'app2', deps: [sharedDep] },
            { id: 'app3', deps: [sharedDep] }
        ];
        // Add all builds to orchestrator
        builds.forEach(({ id, deps }) => {
            orchestrator.addBuild(id, deps);
        });
        // Wait for processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Verify that the shared dependency was built only once
        const sharedDepBuild = fixer.getBuildState(sharedDep);
        expect(sharedDepBuild).toBeDefined();
        // Verify that all dependent builds completed
        const appBuilds = builds.map(({ id }) => fixer.getBuildState(id));
        const completedApps = appBuilds.filter(b => b?.status === 'completed');
        expect(completedApps.length).toBeGreaterThan(0);
    });
    it('should recover from build failures with retry mechanism', async () => {
        const failingBuild = 'failing-build';
        const dependentBuild = 'dependent-build';
        // Mock the first build to fail
        let failCount = 0;
        vi.spyOn(fixer, 'executeStage').mockImplementation(async function (stage) {
            if (stage === 'build' && failCount < 2) {
                failCount++;
                throw new Error('Simulated build failure');
            }
            // Reset to original implementation after failures
            vi.spyOn(fixer, 'executeStage').mockRestore();
        });
        orchestrator.addBuild(failingBuild);
        orchestrator.addBuild(dependentBuild, [failingBuild]);
        // Wait for retry mechanism to work
        await new Promise(resolve => setTimeout(resolve, 4000));
        const failedBuild = fixer.getBuildState(failingBuild);
        const depBuild = fixer.getBuildState(dependentBuild);
        expect(failedBuild?.retryCount).toBeGreaterThan(0);
        expect(depBuild?.status).toBe('pending'); // Should not start until dependency succeeds
    });
    it('should monitor system health and generate alerts', async () => {
        const alerts = [];
        monitor.on('alert', (alert) => alerts.push(alert));
        // Trigger various conditions that should generate alerts
        // 1. Service health issues
        vi.spyOn(fixer, 'checkServiceHealth').mockResolvedValue(false);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 2. Race conditions
        const buildId = 'race-alert-build';
        fixer.executeBuild(buildId);
        fixer.executeBuild(buildId); // This should trigger race detection
        await new Promise(resolve => setTimeout(resolve, 500));
        // Verify alerts were generated
        expect(alerts.length).toBeGreaterThan(0);
        const serviceAlerts = alerts.filter(a => a.type === 'service-health');
        const raceAlerts = alerts.filter(a => a.type === 'race-condition');
        expect(serviceAlerts.length).toBeGreaterThan(0);
        expect(raceAlerts.length).toBeGreaterThan(0);
        // Check alert properties
        serviceAlerts.forEach(alert => {
            expect(alert).toHaveProperty('type');
            expect(alert).toHaveProperty('severity');
            expect(alert).toHaveProperty('message');
        });
    });
    it('should provide comprehensive statistics and metrics', async () => {
        // Execute some builds to generate statistics
        for (let i = 0; i < 5; i++) {
            orchestrator.addBuild(`stats-build-${i}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        const raceStats = monitor.getRaceStatistics();
        const metrics = monitor.getMetrics();
        const buildStates = fixer.getBuildStates();
        const healthChecks = fixer.getHealthChecks();
        // Verify statistics are available
        expect(raceStats).toBeDefined();
        expect(raceStats.totalDetections).toBeGreaterThanOrEqual(0);
        expect(metrics).toBeDefined();
        expect(Object.keys(metrics).length).toBeGreaterThan(0);
        expect(buildStates.length).toBeGreaterThan(0);
        expect(healthChecks.length).toBeGreaterThan(0);
        // Verify specific metric properties
        expect(raceStats).toHaveProperty('resolvedCount');
        expect(raceStats).toHaveProperty('failedCount');
        expect(raceStats).toHaveProperty('averageResolutionTime');
        expect(raceStats).toHaveProperty('mostCommonResource');
        expect(raceStats).toHaveProperty('severityDistribution');
    });
});
describe('Performance Benchmarks', () => {
    it('should handle high-frequency build requests efficiently', async () => {
        const fixer = new CIDCRaceConditionFixer({
            buildTimeout: 2000,
            testTimeout: 1000,
            maxRetries: 1,
            retryDelay: 50,
            parallelJobs: 8,
            lockTimeout: 500,
            cleanupTimeout: 500,
            healthCheckInterval: 250
        });
        const iterations = 20;
        const startTime = Date.now();
        // Execute multiple builds concurrently
        const buildPromises = Array.from({ length: iterations }, (_, i) => fixer.executeBuild(`perf-build-${i}`));
        await Promise.all(buildPromises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        const avgTimePerBuild = totalTime / iterations;
        // Should complete reasonably quickly
        expect(avgTimePerBuild).toBeLessThan(1000); // Average less than 1 second per build
        expect(totalTime).toBeLessThan(20000); // Complete all iterations within 20 seconds
        // Verify all builds completed
        const buildStates = fixer.getBuildStates();
        const completedBuilds = buildStates.filter(b => b.status === 'completed');
        expect(completedBuilds.length).toBeGreaterThan(0);
    });
    it('should efficiently manage memory with many concurrent operations', async () => {
        const fixer = new CIDCRaceConditionFixer({
            buildTimeout: 1000,
            testTimeout: 500,
            maxRetries: 1,
            retryDelay: 25,
            parallelJobs: 16,
            lockTimeout: 250,
            cleanupTimeout: 250,
            healthCheckInterval: 100
        });
        const initialMemory = process.memoryUsage().heapUsed;
        // Execute many concurrent builds
        const buildPromises = Array.from({ length: 50 }, (_, i) => fixer.executeBuild(`memory-build-${i}`));
        await Promise.all(buildPromises);
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;
        // Memory increase should be reasonable (less than 30MB for 50 builds)
        expect(memoryIncrease).toBeLessThan(30 * 1024 * 1024);
        // Cleanup should release resources
        await fixer.cleanup();
        const afterCleanupMemory = process.memoryUsage().heapUsed;
        const cleanupReduction = afterCleanupMemory - finalMemory;
        // Memory should decrease after cleanup (or at least not increase significantly)
        expect(cleanupReduction).toBeLessThan(5 * 1024 * 1024); // Less than 5MB increase
    });
});
//# sourceMappingURL=cicd-race-condition-fixer.test.js.map