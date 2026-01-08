/**
 * Tests for useTimeTravel hook
 * Tests React 19 useOptimistic functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
// Store mock instance for assertions
let mockInstance = null;
let snapshotCounter = 0;
// Mock the TimeTravelDebugger class - must be hoisted
vi.mock('../../debug/time-travel', () => {
    // Helper to create snapshots
    const createSnapshot = (messages = [], label) => ({
        id: `snapshot-${++snapshotCounter}`,
        messages,
        config: {},
        metadata: {},
        label: label || 'Test Snapshot',
        timestamp: new Date(),
    });
    // Create a proper mock class
    class MockTimeTravelDebugger {
        record = vi.fn(() => `snapshot-${snapshotCounter + 1}`);
        getCurrent = vi.fn(() => createSnapshot());
        jumpTo = vi.fn(() => createSnapshot());
        goBack = vi.fn(() => createSnapshot());
        goForward = vi.fn(() => createSnapshot());
        clear = vi.fn();
        getAll = vi.fn(() => []);
        getTimeline = vi.fn(() => []);
        getStats = vi.fn(() => ({
            totalSnapshots: 0,
            totalTransitions: 0,
            timeSpan: 0,
            averageMessageCount: 0,
            actionCounts: {},
        }));
        currentIndex = -1;
        constructor() {
            // Store reference to this instance for test assertions
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            mockInstance = this;
        }
    }
    return {
        TimeTravelDebugger: MockTimeTravelDebugger,
    };
});
// Import after mock is set up
import { useTimeTravel } from '../hooks/use-time-travel';
describe('useTimeTravel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        snapshotCounter = 0;
        mockInstance = null;
    });
    it('should initialize with empty snapshots', () => {
        const { result } = renderHook(() => useTimeTravel());
        expect(result.current.snapshots).toEqual([]);
        expect(result.current.currentIndex).toBe(-1);
        expect(result.current.current).toBeNull();
    });
    it('should record a snapshot and call the debugger', () => {
        const { result } = renderHook(() => useTimeTravel());
        act(() => {
            result.current.record([], {}, {}, 'Test Label');
        });
        expect(mockInstance.record).toHaveBeenCalled();
        expect(mockInstance.getCurrent).toHaveBeenCalled();
    });
    it('should jump to a snapshot', () => {
        const { result } = renderHook(() => useTimeTravel());
        act(() => {
            result.current.jumpTo('snapshot-1');
        });
        expect(mockInstance.jumpTo).toHaveBeenCalledWith('snapshot-1');
    });
    it('should go back in history', () => {
        const { result } = renderHook(() => useTimeTravel());
        act(() => {
            result.current.goBack(1);
        });
        expect(mockInstance.goBack).toHaveBeenCalledWith(1);
    });
    it('should go forward in history', () => {
        const { result } = renderHook(() => useTimeTravel());
        act(() => {
            result.current.goForward(1);
        });
        expect(mockInstance.goForward).toHaveBeenCalledWith(1);
    });
    it('should clear all snapshots', () => {
        const { result } = renderHook(() => useTimeTravel());
        act(() => {
            result.current.clear();
        });
        expect(mockInstance.clear).toHaveBeenCalled();
        expect(result.current.snapshots.length).toBe(0);
        expect(result.current.currentIndex).toBe(-1);
    });
    it('should return stats from debugger', () => {
        const { result } = renderHook(() => useTimeTravel());
        // Stats come from the mocked getStats
        expect(result.current.stats).toEqual({
            totalSnapshots: 0,
            totalTransitions: 0,
            timeSpan: 0,
            averageMessageCount: 0,
            actionCounts: {},
        });
        expect(mockInstance.getStats).toHaveBeenCalled();
    });
});
//# sourceMappingURL=use-time-travel.test.js.map