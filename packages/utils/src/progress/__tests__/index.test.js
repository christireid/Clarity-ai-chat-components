/**
 * Progress Utilities Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureProgress, startSpinner, startSpinnerSync, updateSpinner, succeedSpinner, failSpinner, warnSpinner, stopSpinner, pauseSpinner, resumeSpinner, ProgressTracker, } from '../index.js';
// Mock ora module
const mockSpinner = {
    text: '',
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
};
vi.mock('ora', () => ({
    default: vi.fn((options) => {
        mockSpinner.text = options.text;
        return mockSpinner;
    }),
}));
describe('Progress Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        configureProgress({ silent: false });
        stopSpinner(); // Ensure no lingering spinner
    });
    afterEach(() => {
        stopSpinner();
    });
    describe('configureProgress', () => {
        it('should enable silent mode', async () => {
            configureProgress({ silent: true });
            const spinner = await startSpinner('Test');
            // In silent mode, we get a no-op spinner
            spinner.start();
            expect(mockSpinner.start).not.toHaveBeenCalled();
        });
        it('should disable silent mode', async () => {
            configureProgress({ silent: false });
            await startSpinner('Test');
            expect(mockSpinner.start).toHaveBeenCalled();
        });
    });
    describe('startSpinner', () => {
        it('should create and start a spinner', async () => {
            const spinner = await startSpinner('Loading...');
            expect(spinner).toBeDefined();
            expect(mockSpinner.start).toHaveBeenCalled();
        });
        it('should stop existing spinner before starting new one', async () => {
            await startSpinner('First');
            await startSpinner('Second');
            expect(mockSpinner.stop).toHaveBeenCalled();
        });
        it('should return no-op spinner in silent mode', async () => {
            configureProgress({ silent: true });
            const spinner = await startSpinner('Test');
            // No-op spinner methods don't throw
            expect(() => {
                spinner.start();
                spinner.stop();
                spinner.succeed();
                spinner.fail();
                spinner.warn();
            }).not.toThrow();
        });
    });
    describe('startSpinnerSync', () => {
        it('should create spinner synchronously when ora is loaded', async () => {
            // First load ora via async call
            await startSpinner('Preload');
            stopSpinner();
            vi.clearAllMocks();
            const spinner = startSpinnerSync('Sync spinner');
            expect(spinner).toBeDefined();
        });
        it('should return no-op spinner in silent mode', () => {
            configureProgress({ silent: true });
            const spinner = startSpinnerSync('Test');
            // No-op spinner should work without errors
            spinner.start();
            spinner.stop();
        });
    });
    describe('updateSpinner', () => {
        it('should update spinner text', async () => {
            await startSpinner('Initial');
            updateSpinner('Updated text');
            expect(mockSpinner.text).toBe('Updated text');
        });
        it('should not throw if no spinner exists', () => {
            expect(() => updateSpinner('No spinner')).not.toThrow();
        });
    });
    describe('succeedSpinner', () => {
        it('should succeed the spinner with text', async () => {
            await startSpinner('Processing');
            succeedSpinner('Done!');
            expect(mockSpinner.succeed).toHaveBeenCalledWith('Done!');
        });
        it('should succeed without text', async () => {
            await startSpinner('Processing');
            succeedSpinner();
            expect(mockSpinner.succeed).toHaveBeenCalledWith(undefined);
        });
        it('should not throw if no spinner exists', () => {
            expect(() => succeedSpinner('No spinner')).not.toThrow();
        });
    });
    describe('failSpinner', () => {
        it('should fail the spinner with text', async () => {
            await startSpinner('Processing');
            failSpinner('Error occurred');
            expect(mockSpinner.fail).toHaveBeenCalledWith('Error occurred');
        });
        it('should not throw if no spinner exists', () => {
            expect(() => failSpinner('No spinner')).not.toThrow();
        });
    });
    describe('warnSpinner', () => {
        it('should warn the spinner with text', async () => {
            await startSpinner('Processing');
            warnSpinner('Warning!');
            expect(mockSpinner.warn).toHaveBeenCalledWith('Warning!');
        });
        it('should not throw if no spinner exists', () => {
            expect(() => warnSpinner('No spinner')).not.toThrow();
        });
    });
    describe('stopSpinner', () => {
        it('should stop the spinner', async () => {
            await startSpinner('Processing');
            stopSpinner();
            expect(mockSpinner.stop).toHaveBeenCalled();
        });
        it('should not throw if no spinner exists', () => {
            expect(() => stopSpinner()).not.toThrow();
        });
    });
    describe('pauseSpinner / resumeSpinner', () => {
        it('should pause and resume spinner', async () => {
            await startSpinner('Processing');
            pauseSpinner();
            expect(mockSpinner.stop).toHaveBeenCalled();
            vi.clearAllMocks();
            resumeSpinner();
            expect(mockSpinner.start).toHaveBeenCalled();
        });
        it('should not throw if no spinner exists', () => {
            expect(() => pauseSpinner()).not.toThrow();
            expect(() => resumeSpinner()).not.toThrow();
        });
    });
    describe('ProgressTracker', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.restoreAllMocks();
        });
        it('should create tracker with total and label', () => {
            const tracker = new ProgressTracker(100, 'Processing');
            expect(tracker.getProgress()).toEqual({
                current: 0,
                total: 100,
                percent: 0,
            });
        });
        it('should start tracking', async () => {
            const tracker = new ProgressTracker(10, 'Test');
            await tracker.start();
            expect(mockSpinner.start).toHaveBeenCalled();
        });
        it('should increment progress', async () => {
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            tracker.increment();
            expect(tracker.getProgress().current).toBe(1);
            expect(tracker.getProgress().percent).toBe(10);
            tracker.increment();
            expect(tracker.getProgress().current).toBe(2);
            expect(tracker.getProgress().percent).toBe(20);
        });
        it('should update spinner text on increment', async () => {
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            tracker.increment('item1.txt');
            expect(mockSpinner.text).toContain('1/10');
            expect(mockSpinner.text).toContain('item1.txt');
        });
        it('should show percent when no item name provided', async () => {
            const tracker = new ProgressTracker(4, 'Processing');
            await tracker.start();
            tracker.increment();
            expect(mockSpinner.text).toContain('25%');
        });
        it('should complete with success message', async () => {
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            for (let i = 0; i < 10; i++) {
                tracker.increment();
            }
            tracker.complete();
            expect(mockSpinner.succeed).toHaveBeenCalled();
        });
        it('should complete with custom message', async () => {
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            tracker.complete('All done!');
            expect(mockSpinner.succeed).toHaveBeenCalledWith('All done!');
        });
        it('should fail with message', async () => {
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            tracker.fail('Something went wrong');
            expect(mockSpinner.fail).toHaveBeenCalledWith('Something went wrong');
        });
        it('should track elapsed time', async () => {
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            vi.advanceTimersByTime(1000);
            expect(tracker.getElapsedTime()).toBe(1000);
        });
        it('should not start spinner in silent mode', async () => {
            configureProgress({ silent: true });
            vi.clearAllMocks();
            const tracker = new ProgressTracker(10, 'Processing');
            await tracker.start();
            expect(mockSpinner.start).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=index.test.js.map