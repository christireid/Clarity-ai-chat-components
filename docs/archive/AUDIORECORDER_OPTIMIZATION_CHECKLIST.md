# AudioRecorder Performance Optimization - Implementation Checklist

**Date**: 2026-01-28
**Component**: `packages/react/src/components/input/AudioRecorder.tsx`
**Estimated Total Effort**: 2-3 days (16-24 hours)
**Expected Performance Gain**: 60-70% overall improvement

---

## Phase 1: Quick Wins (2-4 hours)

### ✅ Task 1.1: Reuse Uint8Array Buffer
**Priority**: HIGH | **Effort**: 15 min | **Impact**: Eliminates GC pressure

- [ ] Add `dataArrayRef` to store reusable buffer
- [ ] Modify `updateAmplitude()` to check if buffer exists before creating
- [ ] Add buffer cleanup in `stopMediaStream()`

**Files Modified**:
- `AudioRecorder.tsx` (lines 195-236)

**Test**:
```typescript
// Verify buffer is created once
const allocations = []
// Spy on Uint8Array constructor
// Assert allocations.length < 3 after 100ms recording
```

**Success Criteria**: No new Uint8Array allocations during recording loop

---

### ✅ Task 1.2: Fix Random Multipliers in Waveform
**Priority**: LOW | **Effort**: 10 min | **Impact**: Smoother visualization

- [ ] Use `React.useMemo()` to generate random multipliers once
- [ ] Apply consistent multipliers to bars

**Files Modified**:
- `AudioRecorder.tsx` (lines 545-554)

**Before**:
```typescript
const height = amplitude * 100 * (0.5 + Math.random() * 0.5)
```

**After**:
```typescript
const randomMultipliers = React.useMemo(() =>
  Array.from({ length: 60 }, () => 0.5 + Math.random() * 0.5), []
)
const height = amplitude * 100 * randomMultipliers[i]
```

**Success Criteria**: Waveform bars maintain consistent relative heights

---

### ✅ Task 1.3: Add Error Handling to Cleanup
**Priority**: MEDIUM | **Effort**: 30 min | **Impact**: Prevents crashes during cleanup

- [ ] Wrap MediaRecorder.stop() in try-catch
- [ ] Wrap AudioContext.close() in try-catch
- [ ] Add console.warn for caught errors
- [ ] Add null checks before cleanup operations

**Files Modified**:
- `AudioRecorder.tsx` (lines 473-494)

**Success Criteria**: Component never throws during unmount

---

### ✅ Task 1.4: Explicit Audio Node Disconnection
**Priority**: MEDIUM | **Effort**: 45 min | **Impact**: Proper memory cleanup

- [ ] Add `sourceNodeRef` to store MediaStreamSourceNode
- [ ] Disconnect source from analyser before closing context
- [ ] Call `analyser.disconnect()`
- [ ] Nullify all refs after disconnection

**Files Modified**:
- `AudioRecorder.tsx` (lines 281-282, 451-463)

**Before**:
```typescript
if (audioContextRef.current) {
  audioContextRef.current.close()
}
```

**After**:
```typescript
if (sourceNodeRef.current && analyserRef.current) {
  sourceNodeRef.current.disconnect(analyserRef.current)
  analyserRef.current.disconnect()
}
if (audioContextRef.current?.state !== 'closed') {
  audioContextRef.current.close()
}
```

**Success Criteria**: No AudioContext memory leaks detected

---

## Phase 2: Major Optimizations (1-2 days)

### ✅ Task 2.1: Implement Canvas-Based Waveform
**Priority**: HIGH | **Effort**: 4 hours | **Impact**: 90% CPU reduction

#### Subtask 2.1.1: Create useWaveformCanvas Hook
- [ ] Create `packages/react/src/components/input/hooks/useWaveformCanvas.ts`
- [ ] Implement canvas rendering logic
- [ ] Add smoothing and color options
- [ ] Add proper TypeScript types

**Files Created**:
- `hooks/useWaveformCanvas.ts` (~150 lines)

**API**:
```typescript
const { canvasRef, updateWaveform } = useWaveformCanvas({
  width: 600,
  height: 128,
  barCount: 60,
  color: '#3b82f6',
  smoothing: true
})
```

#### Subtask 2.1.2: Integrate into AudioRecorder
- [ ] Import and use `useWaveformCanvas` hook
- [ ] Replace DOM-based waveform with `<canvas>`
- [ ] Call `updateWaveform(amplitude)` in amplitude loop
- [ ] Update tests to check for canvas element

**Files Modified**:
- `AudioRecorder.tsx` (lines 537-569)

**Success Criteria**:
- CPU usage < 3% during waveform visualization
- Smooth 60fps rendering on mobile devices

---

### ✅ Task 2.2: Implement Adaptive Audio Processing
**Priority**: HIGH | **Effort**: 2 hours | **Impact**: 50-75% audio processing CPU reduction

#### Subtask 2.2.1: Create useAdaptiveAudioProcessing Hook
- [ ] Create `hooks/useAdaptiveAudioProcessing.ts`
- [ ] Implement device capability detection
- [ ] Add battery status monitoring
- [ ] Calculate optimal FFT size and frame rate

**Files Created**:
- `hooks/useAdaptiveAudioProcessing.ts` (~200 lines)

**API**:
```typescript
const { config, isPowerSavingMode } = useAdaptiveAudioProcessing({
  showWaveform,
  showAmplitudeMeter,
  voiceActivityDetection
})
// config = { fftSize: 1024, frameSkip: 1, updateInterval: 16 }
```

#### Subtask 2.2.2: Integrate Adaptive FFT
- [ ] Use adaptive FFT size when creating AnalyserNode
- [ ] Implement frame skipping in `updateAmplitude()`
- [ ] Add power saving mode indicator to UI
- [ ] Update tests for adaptive behavior

**Files Modified**:
- `AudioRecorder.tsx` (lines 277-278, 195-236)

**Success Criteria**:
- FFT size adapts to feature requirements
- Frame rate reduces in low battery mode
- Mobile devices use lower FFT by default

---

### ✅ Task 2.3: Implement Streaming Mode
**Priority**: HIGH | **Effort**: 2 hours | **Impact**: 30-50% memory reduction

- [ ] Add `streamingMode` and `chunkDuration` props
- [ ] Modify `ondataavailable` to skip accumulation in streaming mode
- [ ] Update `onstop` to handle empty chunks array
- [ ] Add TypeScript types for new props
- [ ] Update documentation

**Files Modified**:
- `AudioRecorder.tsx` (lines 33-105, 294-318)

**Success Criteria**:
- Memory usage flat during streaming mode
- Chunks passed to callback immediately
- Final blob empty in streaming mode

---

### ✅ Task 2.4: Blob URL Lifecycle Management
**Priority**: MEDIUM | **Effort**: 1 hour | **Impact**: Prevents memory leaks

- [ ] Add `createdUrlsRef` to track created URLs
- [ ] Add URL to set when creating
- [ ] Implement auto-revoke after 5 minutes
- [ ] Revoke all URLs on unmount
- [ ] Add `revokeUrl()` imperative handle

**Files Modified**:
- `AudioRecorder.tsx` (lines 308-310, 473-494)

**Success Criteria**:
- URLs automatically revoked after timeout
- All URLs revoked on unmount
- Manual revoke available via ref

---

## Phase 3: Mobile Enhancements (2-3 days)

### ✅ Task 3.1: Battery-Aware Performance
**Priority**: MEDIUM | **Effort**: 2 hours | **Impact**: Better mobile battery life

- [ ] Battery detection already in `useAdaptiveAudioProcessing`
- [ ] Add visual indicator for power saving mode
- [ ] Update documentation

**Files Modified**:
- `AudioRecorder.tsx` (UI section)

**Success Criteria**:
- Performance reduces when battery < 20%
- User sees power saving indicator

---

### ✅ Task 3.2: Network-Aware Bitrate
**Priority**: LOW | **Effort**: 2 hours | **Impact**: Better streaming

- [ ] Create `useNetworkAwareBitrate()` hook
- [ ] Detect connection type (2G, 3G, 4G)
- [ ] Adjust bitrate recommendation
- [ ] Add prop to enable/disable

**Files Created**:
- `hooks/useNetworkAwareBitrate.ts` (~100 lines)

**Success Criteria**:
- Bitrate adapts to network conditions
- Lower bitrate on slow connections

---

### ✅ Task 3.3: Fix Touch Target Sizes
**Priority**: MEDIUM | **Effort**: 30 min | **Impact**: Better mobile accessibility

- [ ] Update button classes to use `px-6 py-3`
- [ ] Add `min-h-[44px] min-w-[44px]` to all buttons
- [ ] Test on mobile devices

**Files Modified**:
- `AudioRecorder.tsx` (lines 616-657)

**Success Criteria**:
- All buttons meet 44×44px WCAG requirement
- Easy to tap on mobile

---

### ✅ Task 3.4: Component Memoization
**Priority**: LOW | **Effort**: 15 min | **Impact**: Minor re-render reduction

- [ ] Wrap component with `React.memo()`
- [ ] Keep `displayName` assignment

**Files Modified**:
- `AudioRecorder.tsx` (component export)

**Before**:
```typescript
export function AudioRecorder({ ... }) { ... }
```

**After**:
```typescript
export const AudioRecorder = React.memo(function AudioRecorder({ ... }) { ... })
```

**Success Criteria**:
- Component doesn't re-render when parent updates with same props

---

## Phase 4: Testing & Documentation (1 day)

### ✅ Task 4.1: Add Performance Tests
**Priority**: HIGH | **Effort**: 4 hours

- [ ] Create `AudioRecorder.perf.test.tsx`
- [ ] Test buffer reuse (no allocations)
- [ ] Test frame rate (60fps)
- [ ] Test memory usage (< 10MB for 60s)
- [ ] Test cleanup time (< 100ms)
- [ ] Test adaptive FFT sizing
- [ ] Test streaming mode memory

**Files Created**:
- `__tests__/AudioRecorder.perf.test.tsx` (~300 lines)

**Success Criteria**:
- All performance tests pass
- CI runs performance tests

---

### ✅ Task 4.2: Update Documentation
**Priority**: MEDIUM | **Effort**: 2 hours

- [ ] Add performance section to component documentation
- [ ] Document new props (`streamingMode`, etc.)
- [ ] Add usage examples for optimization features
- [ ] Update README with performance characteristics

**Files Modified**:
- `AudioRecorder.tsx` (JSDoc comments)
- `README.md` (if exists)

---

### ✅ Task 4.3: Create Performance Monitoring
**Priority**: LOW | **Effort**: 2 hours

- [ ] Add `onMetricsChange` callback prop
- [ ] Track key metrics (memory, CPU, frame time)
- [ ] Implement metrics reporting

**Files Modified**:
- `AudioRecorder.tsx` (add metrics tracking)

---

## Verification Checklist

After completing all phases, verify:

### Performance Metrics
- [ ] CPU usage < 8% during recording with waveform (was ~20%)
- [ ] Memory usage < 14MB for 300s recording (was ~20MB)
- [ ] Waveform renders at stable 60fps
- [ ] Cleanup completes in < 100ms
- [ ] No memory leaks after 10 record/stop cycles

### Functionality
- [ ] All existing tests pass
- [ ] All new tests pass
- [ ] Recording works on desktop
- [ ] Recording works on mobile (iOS/Android)
- [ ] Waveform visualization smooth
- [ ] Streaming mode works correctly
- [ ] Power saving mode activates

### Accessibility
- [ ] All buttons meet 44×44px touch target
- [ ] Keyboard navigation works
- [ ] Screen reader announcements work
- [ ] ARIA labels correct

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Mobile Chrome (Android 10+)

---

## Progress Tracking

### Phase 1: Quick Wins ⏸️
- [ ] Task 1.1: Reuse Uint8Array Buffer
- [ ] Task 1.2: Fix Random Multipliers
- [ ] Task 1.3: Add Error Handling
- [ ] Task 1.4: Explicit Node Disconnection

**Status**: Not started
**Estimated Completion**: 4 hours
**Blocker**: None

---

### Phase 2: Major Optimizations ⏸️
- [ ] Task 2.1: Canvas-Based Waveform (4h)
- [ ] Task 2.2: Adaptive Audio Processing (2h)
- [ ] Task 2.3: Streaming Mode (2h)
- [ ] Task 2.4: Blob URL Management (1h)

**Status**: Not started
**Estimated Completion**: 1-2 days
**Blocker**: Phase 1 completion

---

### Phase 3: Mobile Enhancements ⏸️
- [ ] Task 3.1: Battery-Aware Performance (2h)
- [ ] Task 3.2: Network-Aware Bitrate (2h)
- [ ] Task 3.3: Fix Touch Targets (30min)
- [ ] Task 3.4: Component Memoization (15min)

**Status**: Not started
**Estimated Completion**: 2-3 days
**Blocker**: Phase 2 completion

---

### Phase 4: Testing & Documentation ⏸️
- [ ] Task 4.1: Performance Tests (4h)
- [ ] Task 4.2: Update Documentation (2h)
- [ ] Task 4.3: Performance Monitoring (2h)

**Status**: Not started
**Estimated Completion**: 1 day
**Blocker**: Phase 3 completion

---

## Quick Reference

### Files to Create
```
packages/react/src/components/input/hooks/
├── useWaveformCanvas.ts           # ~150 lines
├── useAdaptiveAudioProcessing.ts  # ~200 lines
└── useNetworkAwareBitrate.ts      # ~100 lines

packages/react/src/components/input/__tests__/
└── AudioRecorder.perf.test.tsx    # ~300 lines
```

### Files to Modify
```
packages/react/src/components/input/
└── AudioRecorder.tsx              # ~50 line changes, +100 new

packages/react/src/components/input/__tests__/
└── AudioRecorder.test.tsx         # Add 5-10 new tests
```

### Total Line Changes
- **New Lines**: ~850
- **Modified Lines**: ~50
- **Deleted Lines**: ~30
- **Net Addition**: ~870 lines

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking changes | Low | High | Comprehensive test coverage, backward compatibility |
| Browser compatibility | Medium | High | Feature detection, graceful fallbacks |
| Performance regression | Low | High | Benchmark tests, profiling |
| Memory leaks | Low | Medium | Memory profiling, leak detection tests |

---

## Support & Questions

**Primary Contact**: Performance Engineering Team
**Slack Channel**: #performance-optimization
**Documentation**: See `AUDIORECORDER_PERFORMANCE_AUDIT.md`
**Code Examples**: See `AUDIORECORDER_OPTIMIZATION_EXAMPLES.md`

---

**Last Updated**: 2026-01-28
**Next Review**: After Phase 1 completion
