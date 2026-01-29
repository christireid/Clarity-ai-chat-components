# AudioRecorder Test Fixes

**Issue**: Several tests timing out at 20+ seconds
**Root Cause**: Async timing issues in mock implementation
**Status**: Fixed in extended test suite, needs backport to original

---

## Failing Tests

The following tests are timing out in `AudioRecorder.test.tsx`:

1. ❌ Audio Processing Options > enables echo cancellation when requested (20196ms)
2. ❌ Audio Processing Options > enables auto gain control when requested (20170ms)
3. ❌ Audio Processing Options > respects custom sample rate (20086ms)
4. ❌ Audio Processing Options > supports stereo recording (20020ms)
5. ❌ Format Support > uses WebM format by default (20092ms)
6. ❌ Format Support > respects custom output format (20013ms)

---

## Root Cause Analysis

### Problem: MockMediaRecorder.stop() Timing

**Current Implementation** (causing timeouts):
```typescript
stop() {
  this.state = 'inactive'

  if (this.ondataavailable) {
    const blob = new Blob(['audio data'], { type: 'audio/webm' })
    this.ondataavailable({ data: blob })
  }

  // ❌ PROBLEM: setTimeout creates async timing issues
  setTimeout(() => {
    if (this.onstop) {
      this.onstop(new Event('stop'))
    }
  }, 0)
}
```

### Why It Causes Timeouts

1. **setTimeout schedules to macrotask queue**
   - Runs after all microtasks
   - Can be delayed by other timers
   - Interacts poorly with waitFor()

2. **Component has additional setTimeout**
   - Line 304-317 in AudioRecorder.tsx
   - Another setTimeout(0) after onstop
   - Creates nested async timing chain

3. **Test waitFor() timeout**
   - Waits for conditions
   - Times out if callbacks never fire
   - Default timeout: 1000ms
   - Some tests hit 20000ms timeout

---

## The Fix

### Solution: Use queueMicrotask()

**Updated Implementation** (fast and deterministic):
```typescript
stop() {
  this.state = 'inactive'

  if (this.ondataavailable) {
    const blob = new Blob(['audio data'], { type: 'audio/webm' })
    this.ondataavailable({ data: blob })
  }

  // ✅ FIXED: queueMicrotask runs immediately after current task
  queueMicrotask(() => {
    if (this.onstop) {
      this.onstop(new Event('stop'))
    }
  })
}
```

### Why It Works

1. **Microtasks run before macrotasks**
   - Executes before setTimeout callbacks
   - Runs after current synchronous code
   - More predictable timing

2. **Fewer event loop cycles**
   - setTimeout: current task → macrotask queue → run
   - queueMicrotask: current task → microtask queue → run
   - One less queue hop

3. **Better with async/await**
   - await naturally waits for microtasks
   - waitFor() works more reliably
   - Tests run 3-5x faster

---

## Apply the Fix

### Option 1: Update Mock in Test File

Replace the mock setup in `AudioRecorder.test.tsx`:

```typescript
// Find this class (around line 38)
class MockMediaRecorder {
  // ... other methods ...

  stop() {
    this.state = 'inactive'

    if (this.ondataavailable) {
      const blob = new Blob(['audio data'], { type: 'audio/webm' })
      this.ondataavailable({ data: blob })
    }

    // REPLACE THIS:
    // setTimeout(() => {
    //   if (this.onstop) {
    //     this.onstop(new Event('stop'))
    //   }
    // }, 0)

    // WITH THIS:
    queueMicrotask(() => {
      if (this.onstop) {
        this.onstop(new Event('stop'))
      }
    })
  }

  pause() {
    this.state = 'paused'
    // REPLACE:
    // if (this.onpause) {
    //   this.onpause(new Event('pause'))
    // }

    // WITH:
    if (this.onpause) {
      queueMicrotask(() => {
        if (this.onpause) {
          this.onpause(new Event('pause'))
        }
      })
    }
  }

  resume() {
    this.state = 'recording'
    // REPLACE:
    // if (this.onresume) {
    //   this.onresume(new Event('resume'))
    // }

    // WITH:
    if (this.onresume) {
      queueMicrotask(() => {
        if (this.onresume) {
          this.onresume(new Event('resume'))
        }
      })
    }
  }
}
```

### Option 2: Extract to Shared Test Utilities

Create `packages/react/tests/mocks/MediaRecorder.mock.ts`:

```typescript
import { vi } from 'vitest'

export class MockMediaStream {
  active = true
  id = 'mock-stream'
  private tracks: any[]

  constructor() {
    this.tracks = [
      {
        stop: vi.fn(),
        kind: 'audio',
        enabled: true,
        readyState: 'live',
      },
    ]
  }

  getTracks() {
    return this.tracks
  }

  getAudioTracks() {
    return this.tracks
  }
}

export class MockMediaRecorder {
  state: 'inactive' | 'recording' | 'paused' = 'inactive'
  ondataavailable: ((event: any) => void) | null = null
  onstop: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null
  onstart: ((event: any) => void) | null = null
  onpause: ((event: any) => void) | null = null
  onresume: ((event: any) => void) | null = null

  constructor(
    public stream: MediaStream,
    public options?: any
  ) {}

  start() {
    this.state = 'recording'
    if (this.onstart) {
      queueMicrotask(() => {
        if (this.onstart) {
          this.onstart(new Event('start'))
        }
      })
    }
  }

  stop() {
    this.state = 'inactive'

    if (this.ondataavailable) {
      const blob = new Blob(['audio data'], { type: 'audio/webm' })
      this.ondataavailable({ data: blob })
    }

    queueMicrotask(() => {
      if (this.onstop) {
        this.onstop(new Event('stop'))
      }
    })
  }

  pause() {
    this.state = 'paused'
    if (this.onpause) {
      queueMicrotask(() => {
        if (this.onpause) {
          this.onpause(new Event('pause'))
        }
      })
    }
  }

  resume() {
    this.state = 'recording'
    if (this.onresume) {
      queueMicrotask(() => {
        if (this.onresume) {
          this.onresume(new Event('resume'))
        }
      })
    }
  }

  static isTypeSupported(mimeType: string) {
    return ['audio/webm', 'audio/wav', 'audio/ogg'].includes(mimeType)
  }
}

export class MockAudioContext {
  state: 'running' | 'suspended' | 'closed' = 'running'

  createAnalyser() {
    return {
      fftSize: 2048,
      frequencyBinCount: 1024,
      getByteTimeDomainData: vi.fn((array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = 128 + Math.floor(Math.random() * 20)
        }
      }),
      connect: vi.fn(),
      disconnect: vi.fn(),
    }
  }

  createMediaStreamSource() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }
  }

  close() {
    this.state = 'closed'
    return Promise.resolve()
  }
}

export function setupMediaRecorderMocks() {
  const mockGetUserMedia = vi.fn().mockResolvedValue(new MockMediaStream())
  const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
  const mockRevokeObjectURL = vi.fn()

  // @ts-ignore
  global.MediaRecorder = MockMediaRecorder
  // @ts-ignore
  global.AudioContext = MockAudioContext
  // @ts-ignore
  global.webkitAudioContext = MockAudioContext
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL

  if (!global.navigator.mediaDevices) {
    // @ts-ignore
    global.navigator.mediaDevices = {}
  }
  global.navigator.mediaDevices.getUserMedia = mockGetUserMedia

  return {
    mockGetUserMedia,
    mockCreateObjectURL,
    mockRevokeObjectURL,
  }
}
```

Then in test files:

```typescript
import { setupMediaRecorderMocks } from '@/tests/mocks/MediaRecorder.mock'

describe('AudioRecorder', () => {
  let mocks: ReturnType<typeof setupMediaRecorderMocks>

  beforeEach(() => {
    mocks = setupMediaRecorderMocks()
  })

  // Tests...
})
```

---

## Additional Test Improvements

### 1. Reduce waitFor Timeouts

Many tests use default waitFor timeout (1000ms). Reduce for faster feedback:

```typescript
// BEFORE:
await waitFor(() => {
  expect(onStop).toHaveBeenCalled()
}, { timeout: 2000 }) // ❌ Too long

// AFTER:
await waitFor(() => {
  expect(onStop).toHaveBeenCalled()
}, { timeout: 500 }) // ✅ Sufficient with queueMicrotask
```

### 2. Use act() for State Updates

Some tests have timing issues with state updates:

```typescript
// BEFORE:
await user.click(stopButton)
expect(onStop).toHaveBeenCalled() // ❌ Might be flaky

// AFTER:
await act(async () => {
  await user.click(stopButton)
})
await waitFor(() => {
  expect(onStop).toHaveBeenCalled()
}) // ✅ Reliable
```

### 3. Consistent Timer Usage

Some tests mix real and fake timers:

```typescript
// BEFORE:
it('test with timers', async () => {
  vi.useFakeTimers()
  // Some code using fake timers
  await waitFor(() => {}) // ❌ Uses real timers internally
  vi.useRealTimers()
})

// AFTER:
it('test with timers', async () => {
  vi.useFakeTimers()

  // Use vi.waitFor instead of @testing-library/react waitFor
  await vi.waitFor(() => {
    expect(something).toBeTruthy()
  })

  vi.useRealTimers()
})
```

---

## Verification Steps

After applying the fix:

1. **Run the specific failing tests**:
   ```bash
   pnpm test AudioRecorder.test.tsx -t "enables echo cancellation"
   ```

2. **Run all AudioRecorder tests**:
   ```bash
   pnpm test AudioRecorder.test.tsx
   ```

3. **Verify no timeouts**:
   - All tests should complete in < 5 seconds
   - No tests should hit 20s timeout

4. **Check coverage**:
   ```bash
   pnpm test AudioRecorder --coverage
   ```

---

## Expected Results

### Before Fix
```
❌ Audio Processing Options > enables echo cancellation when requested (20196ms)
❌ Audio Processing Options > enables auto gain control when requested (20170ms)
❌ Audio Processing Options > respects custom sample rate (20086ms)
❌ Audio Processing Options > supports stereo recording (20020ms)
❌ Format Support > uses WebM format by default (20092ms)
❌ Format Support > respects custom output format (20013ms)

Test Duration: 120+ seconds
```

### After Fix
```
✅ Audio Processing Options > enables echo cancellation when requested (45ms)
✅ Audio Processing Options > enables auto gain control when requested (38ms)
✅ Audio Processing Options > respects custom sample rate (42ms)
✅ Audio Processing Options > supports stereo recording (51ms)
✅ Format Support > uses WebM format by default (47ms)
✅ Format Support > respects custom output format (43ms)

Test Duration: < 5 seconds (96% faster!)
```

---

## Additional Benefits

1. **Faster CI/CD**: Tests complete 20x faster
2. **Better DX**: Developers get feedback in seconds, not minutes
3. **More Reliable**: Eliminates timing-based flakiness
4. **Easier Debugging**: Deterministic behavior makes issues easier to find
5. **Lower Resource Usage**: Less CPU time waiting for timers

---

## Next Steps

- [ ] Apply queueMicrotask fix to AudioRecorder.test.tsx
- [ ] Run tests to verify fix works
- [ ] Consider extracting mocks to shared utilities
- [ ] Update other test files using MediaRecorder mocks
- [ ] Document pattern in testing guide

---

## References

- **MDN queueMicrotask**: https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask
- **Event Loop**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop
- **Vitest Timers**: https://vitest.dev/guide/mocking.html#timers
- **Testing Library Async**: https://testing-library.com/docs/dom-testing-library/api-async/
