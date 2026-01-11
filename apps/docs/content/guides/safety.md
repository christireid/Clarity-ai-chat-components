# Safety & Content Moderation

Clarity Chat includes comprehensive safety features for detecting PII, filtering content, and preventing prompt injection attacks.

## Overview

Safety features help you:
- Detect and redact personally identifiable information (PII)
- Filter inappropriate or harmful content
- Prevent prompt injection attacks
- Comply with content policies
- Protect user privacy

## PII Detection

Detect and redact personally identifiable information:

```tsx
import { PIIDetector } from '@clarity-chat/react'

const detector = new PIIDetector({
  enabled: true,
  redact: true, // Automatically redact detected PII
  types: ['email', 'phone', 'ssn', 'credit_card', 'ip_address'],
})

// Detect PII in text
const result = await detector.detect(userInput)

if (result.hasPII) {
  console.log('Detected PII:', result.entities)
  // Use result.redactedText for safe text
}
```

### Supported PII Types

- Email addresses
- Phone numbers
- Social Security Numbers
- Credit card numbers
- IP addresses
- Physical addresses
- Dates of birth
- Driver's license numbers

### Custom PII Patterns

```tsx
const detector = new PIIDetector({
  customPatterns: [
    {
      name: 'employee_id',
      pattern: /EMP-\d{6}/g,
      redaction: '***',
    },
  ],
})
```

## Content Filtering

Filter inappropriate or harmful content:

```tsx
import { ContentFilter } from '@clarity-chat/react'

const filter = new ContentFilter({
  enabled: true,
  categories: ['hate', 'harassment', 'self-harm', 'violence'],
  severity: 'medium', // 'low', 'medium', 'high'
})

const result = await filter.check(userInput)

if (result.flagged) {
  console.log('Content flagged:', result.categories)
  // Handle flagged content
}
```

### Content Categories

- **Hate**: Hate speech and discriminatory content
- **Harassment**: Harassing or bullying content
- **Self-harm**: Content promoting self-harm
- **Violence**: Violent or threatening content
- **Sexual**: Sexual content
- **Spam**: Spam or promotional content

### Custom Filter Rules

```tsx
const filter = new ContentFilter({
  customRules: [
    {
      pattern: /badword/gi,
      category: 'harassment',
      action: 'block',
    },
  ],
})
```

## Prompt Injection Prevention

Protect against prompt injection attacks:

```tsx
import { PromptInjectionDetector } from '@clarity-chat/react'

const detector = new PromptInjectionDetector({
  enabled: true,
  sensitivity: 'high',
})

const result = await detector.detect(userInput)

if (result.isInjection) {
  console.log('Prompt injection detected!')
  // Reject or sanitize input
}
```

### Injection Patterns Detected

- System prompt leaks
- Instruction overrides
- Context manipulation
- Jailbreak attempts
- Role-playing attacks

## Safety Status Card

Display safety checks to users:

```tsx
import { SafetyStatusCard } from '@clarity-chat/react'

function ChatWithSafety() {
  const [safetyChecks, setSafetyChecks] = useState([])

  const handleSend = async (message: string) => {
    // Run safety checks
    const piiResult = await detector.detect(message)
    const contentResult = await filter.check(message)
    const injectionResult = await injectionDetector.detect(message)

    setSafetyChecks([
      {
        id: 'pii',
        label: 'PII Detection',
        status: piiResult.hasPII ? 'warn' : 'pass',
        detail: piiResult.hasPII ? 'PII detected and redacted' : undefined,
      },
      {
        id: 'content',
        label: 'Content Filter',
        status: contentResult.flagged ? 'fail' : 'pass',
      },
      {
        id: 'injection',
        label: 'Prompt Injection',
        status: injectionResult.isInjection ? 'fail' : 'pass',
      },
    ])

    // Only send if all checks pass
    if (!piiResult.hasPII && !contentResult.flagged && !injectionResult.isInjection) {
      // Send message
    }
  }

  return (
    <div>
      <SafetyStatusCard checks={safetyChecks} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

## Complete Safety Setup

```tsx
import {
  PIIDetector,
  ContentFilter,
  PromptInjectionDetector,
  SafetyStatusCard,
} from '@clarity-chat/react'

function SafeChat() {
  const detector = new PIIDetector({ redact: true })
  const filter = new ContentFilter({ enabled: true })
  const injectionDetector = new PromptInjectionDetector({ enabled: true })

  const handleSend = async (message: string) => {
    // Run all safety checks
    const [piiResult, contentResult, injectionResult] = await Promise.all([
      detector.detect(message),
      filter.check(message),
      injectionDetector.detect(message),
    ])

    // Check if safe to proceed
    const isSafe = 
      !piiResult.hasPII &&
      !contentResult.flagged &&
      !injectionResult.isInjection

    if (!isSafe) {
      // Show safety warnings
      return
    }

    // Use redacted text if PII was detected
    const safeMessage = piiResult.redactedText || message

    // Send message
    await sendMessage(safeMessage)
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Safety Review Console

Review flagged content before approval:

```tsx
import { SafetyReviewConsole } from '@clarity-chat/react'

function SafetyReview({ content, highlights }) {
  return (
    <SafetyReviewConsole
      content={content}
      highlights={highlights}
      onRedact={(highlight) => {
        // Redact highlighted section
      }}
      onApprove={() => {
        // Approve content
      }}
      onReject={() => {
        // Reject content
      }}
    />
  )
}
```

## Best Practices

1. **Enable by Default**: Enable safety features in production
2. **User Feedback**: Show users when content is filtered
3. **False Positives**: Allow manual review for edge cases
4. **Privacy**: Don't log sensitive PII
5. **Performance**: Cache safety check results when possible
6. **Compliance**: Ensure compliance with regulations (GDPR, etc.)
7. **Transparency**: Be transparent about safety measures

## Next Steps

- [Safety API Reference](/api/safety) - Complete safety API
- [Safety Status Card](/api/components/safety-status-card) - Display safety checks
- [Privacy Guide](/guide/privacy) - Privacy best practices
- [Compliance](/guide/compliance) - Regulatory compliance
