# Error Handling Demo - Quick Start Guide

## 🚀 Getting Started

### View the Demo

1. Navigate to the examples-showcase app
2. Click the "Error Handling" tab in the navigation
3. Explore the four interactive demos

### Demo Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  ERROR HANDLING DEMO                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │  Error Recovery  │  │  Retry Logic    │              │
│  │  Patterns        │  │  with Backoff   │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐              │
│  │  Fallback        │  │  Error Logging  │              │
│  │  Strategies      │  │  & Monitoring   │              │
│  └──────────────────┘  └──────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Files Included

```
demos/
├── ErrorHandlingDemo.tsx          # Main component (26KB)
├── ErrorHandlingDemo.css          # Glassmorphism styles (24KB)
├── README-ErrorHandling.md        # Detailed documentation
└── ERROR_HANDLING_QUICK_START.md  # This file
```

## 🎯 Try These First

### 1. Error Recovery (30 seconds)

1. Click **"Trigger Error"** button
2. Watch automatic retry (3 attempts)
3. Switch to **"Fallback"** strategy
4. Click **"Trigger Error"** again
5. See instant fallback activation

### 2. Retry Logic (1 minute)

1. Set **Max Attempts** to 5
2. Set **Initial Delay** to 500ms
3. Set **Backoff Multiplier** to 2
4. Click **"Start Retry Sequence"**
5. Watch the countdown and progress

### 3. Fallback Strategies (1 minute)

1. Select **"Cache Fallback"** card
2. Toggle **"Simulate Primary Failure"** ON
3. Watch metrics update
4. Try other strategies:
   - Default Values
   - Alternative API
   - Degraded Mode
5. Compare response times and quality

### 4. Error Monitoring (2 minutes)

1. Enable **"Live Monitoring"**
2. Watch auto-generated errors
3. Click error type buttons:
   - Network
   - Timeout
   - Rate Limit
4. Filter by error type
5. Examine detailed logs

## 🎨 Visual Features

### Glassmorphism UI

- **Animated gradient background** (15s cycle)
- **Frosted glass cards** with blur
- **Color-coded status indicators**
- **Smooth hover effects**
- **Loading animations**

### Status Colors

```css
✓ Success: Green   rgba(34, 197, 94)
✗ Error:   Red     rgba(239, 68, 68)
⚠ Warning: Orange  rgba(245, 158, 11)
ℹ Info:    Blue    rgba(59, 130, 246)
```

## 💻 Code Snippets

### Copy-Paste: Retry with Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxAttempts - 1) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          10000 // max 10s
        )
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Usage
const data = await retryWithBackoff(
  () => fetch('/api/data').then(r => r.json()),
  3,    // max attempts
  1000, // initial delay
  2     // backoff multiplier
)
```

### Copy-Paste: Fallback Pattern

```typescript
async function fetchWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  try {
    return await primary()
  } catch (primaryError) {
    console.warn('Primary failed, trying fallback:', primaryError)

    try {
      return await fallback()
    } catch (fallbackError) {
      console.warn('Fallback failed, using default:', fallbackError)
      return defaultValue
    }
  }
}

// Usage
const data = await fetchWithFallback(
  () => fetch('/api/primary').then(r => r.json()),
  () => fetch('/api/backup').then(r => r.json()),
  { status: 'degraded', data: [] }
)
```

### Copy-Paste: Error Logger

```typescript
interface ErrorLog {
  id: string
  type: 'network' | 'timeout' | 'rate-limit' | 'server' | 'validation'
  message: string
  timestamp: Date
  context?: any
  recovered: boolean
}

class ErrorLogger {
  private logs: ErrorLog[] = []

  log(error: Error, type: ErrorLog['type'], context?: any): void {
    const log: ErrorLog = {
      id: crypto.randomUUID(),
      type,
      message: error.message,
      timestamp: new Date(),
      context,
      recovered: false
    }

    this.logs.push(log)
    console.error(`[${type}]`, error, context)

    // Send to monitoring service
    this.sendToMonitoring(log)
  }

  markRecovered(id: string, strategy: string): void {
    const log = this.logs.find(l => l.id === id)
    if (log) {
      log.recovered = true
      log.context = { ...log.context, recoveryStrategy: strategy }
    }
  }

  private sendToMonitoring(log: ErrorLog): void {
    // Implementation depends on your monitoring service
  }
}

// Usage
const logger = new ErrorLogger()

try {
  await riskyOperation()
} catch (error) {
  logger.log(error, 'network', { endpoint: '/api/data' })
}
```

## 🎓 Learning Objectives

After exploring the demos, you'll understand:

✅ **Error Recovery Patterns**
- When to retry vs. fallback
- Graceful degradation strategies
- User experience during failures

✅ **Exponential Backoff**
- Why it prevents server overload
- How to calculate delays
- Configuration trade-offs

✅ **Fallback Strategies**
- Cache vs. alternative APIs
- Quality vs. availability trade-offs
- Default values as last resort

✅ **Error Monitoring**
- What to log
- How to classify errors
- Tracking recovery success

## 🔍 Deep Dive Topics

### Advanced: Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failures = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private nextAttempt = 0

  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN')
      }
      this.state = 'half-open'
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failures = 0
    this.state = 'closed'
  }

  private onFailure(): void {
    this.failures++
    if (this.failures >= this.threshold) {
      this.state = 'open'
      this.nextAttempt = Date.now() + this.timeout
    }
  }
}
```

## 📊 Key Metrics to Monitor

1. **Error Rate**: Errors / Total Requests
2. **Recovery Rate**: Recovered / Total Errors
3. **Mean Time to Recovery (MTTR)**
4. **Error Distribution**: By type
5. **Retry Success Rate**: By attempt number

## 🎯 Best Practices Checklist

- [ ] Always set max retry limits
- [ ] Use exponential backoff for retries
- [ ] Implement circuit breakers for failing services
- [ ] Log errors with context
- [ ] Track recovery success
- [ ] Provide user feedback during retries
- [ ] Have fallback strategies ready
- [ ] Monitor error rates in production
- [ ] Test failure scenarios
- [ ] Document recovery procedures

## 🐛 Common Pitfalls

❌ **Don't:**
- Retry without backoff (server overload)
- Retry indefinitely (infinite loops)
- Ignore error types (treat all errors same)
- Block UI during retries
- Forget to log errors
- Use sync operations for retries

✅ **Do:**
- Implement exponential backoff
- Set maximum retry attempts
- Classify error types
- Show loading states
- Log with context
- Use async/await properly

## 🔧 Customization

### Change Colors

Edit `ErrorHandlingDemo.css`:

```css
/* Success color */
.status-badge.status-success {
  background: rgba(YOUR, COLORS, HERE, 0.3);
}

/* Error color */
.status-badge.status-error {
  background: rgba(YOUR, COLORS, HERE, 0.3);
}
```

### Change Retry Defaults

Edit `ErrorHandlingDemo.tsx`:

```typescript
const [config, setConfig] = useState<RetryConfig>({
  maxAttempts: 5,        // Change this
  initialDelay: 1000,    // Change this
  maxDelay: 10000,       // Change this
  backoffMultiplier: 2   // Change this
})
```

### Add New Error Types

```typescript
type ErrorType =
  | 'network'
  | 'timeout'
  | 'rate-limit'
  | 'server'
  | 'validation'
  | 'YOUR_NEW_TYPE' // Add here
```

## 📱 Mobile Experience

All demos are fully responsive:

- **Portrait mode**: Stacked cards
- **Landscape mode**: Side-by-side
- **Touch**: All interactions work
- **Swipe**: Scroll log viewers

## ⌨️ Keyboard Shortcuts

- `Tab`: Navigate between elements
- `Enter`: Activate buttons
- `Space`: Toggle switches
- `Esc`: Close dialogs (if any)

## 🎬 Demo Recordings

Want to share? Screen record these flows:

1. **Quick Win** (30s): Show all 4 demos
2. **Retry Deep Dive** (1m): Configure and run retry
3. **Fallback Comparison** (1m): Compare all 4 strategies
4. **Monitoring Dashboard** (2m): Live monitoring session

## 💡 Tips for Presentations

1. Start with Error Recovery (easiest)
2. Show Retry Logic with slow delays (2s initial)
3. Toggle Fallback simulation on/off rapidly
4. Let Monitoring run in background

## 🔗 Related Demos

Check out these complementary demos:

- **Network Status**: Shows connection state
- **Token Optimization**: Performance patterns
- **Performance Dashboard**: Metrics tracking

## 📚 Further Reading

- [Retry Pattern - Microsoft](https://docs.microsoft.com/en-us/azure/architecture/patterns/retry)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Error Handling Best Practices](https://google.github.io/styleguide/jsguide.html#features-exceptions)

## 🤝 Contributing

Found a bug or have a suggestion?

1. Check existing issues
2. Open a new issue
3. Submit a PR

## 📄 License

MIT License - Feel free to use in your projects!

---

## Quick Reference Card

```
╔══════════════════════════════════════════════════════════╗
║  ERROR HANDLING DEMO - QUICK REFERENCE                  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Retry Formula:                                          ║
║    delay = min(initial × multiplier^attempt, max)       ║
║                                                          ║
║  Recovery Strategies:                                    ║
║    1. Retry      → Try again with backoff               ║
║    2. Fallback   → Use alternative source               ║
║    3. Graceful   → Reduce functionality                 ║
║                                                          ║
║  Error Types:                                            ║
║    • Network    → Connection issues                      ║
║    • Timeout    → Request took too long                  ║
║    • Rate Limit → Too many requests                      ║
║    • Server     → Backend error (500)                    ║
║    • Validation → Invalid input                          ║
║                                                          ║
║  Key Metrics:                                            ║
║    • Error Rate     = Errors / Total                     ║
║    • Recovery Rate  = Recovered / Errors                 ║
║    • MTTR           = Time to recover                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

**Happy Error Handling!** 🎉
