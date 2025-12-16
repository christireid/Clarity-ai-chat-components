import { NextResponse } from 'next/server'
import { SecurityManager, ConsoleAlertHandler } from '@clarity-chat/react'

import { SecureLogger } from '@/lib/security/secureLogger';
/**
 * Server-side Security Validation API
 *
 * POST /api/validate
 *
 * This endpoint validates user input server-side before it's processed.
 * This is the proper way to implement security - client-side validation
 * can be bypassed, but server-side cannot.
 *
 * Uses SecurityManager from @clarity-chat/react for comprehensive security.
 */

// Initialize SecurityManager with full configuration
const security = new SecurityManager({
  promptInjection: { enabled: true },
  pii: {
    enabled: true,
    redactionStrategy: 'mask',
  },
  jailbreakPrevention: { enabled: true },
  contentModeration: { enabled: false }, // Enable if needed
  monitoring: {
    enabled: true,
    logEvents: true,
    alertHandlers: [new ConsoleAlertHandler()],
  },
  rateLimiting: {
    enabled: false, // Enable and configure for production
    maxRequestsPerMinute: 60,
  },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { input, options } = body

    if (typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input must be a string' },
        { status: 400 }
      )
    }

    // Validate the input using SecurityManager from @clarity-chat/react
    const result = await security.validateInput(input, {
      userId: options?.userId,
      sessionId: options?.sessionId,
    })

    // Log security events (in production, send to monitoring service)
    if (!result.allowed) {
      SecureLogger.warn('[SECURITY] Blocked input:', {
        timestamp: new Date().toISOString(),
        action: result.action,
        reason: result.reason,
        checks: result.checks?.map((c) => ({
          name: c.name,
          passed: c.passed,
          confidence: c.confidence,
        })),
      })
    }

    // Return appropriate response
    if (!result.allowed) {
      const injectionCheck = result.checks?.find(
        (c) => c.name === 'prompt_injection'
      )
      const jailbreakCheck = result.checks?.find(
        (c) => c.name === 'jailbreak_prevention'
      )

      return NextResponse.json(
        {
          allowed: false,
          reason: 'Security policy violation',
          severity:
            (injectionCheck?.confidence ?? 0) > 0.8 ||
            (jailbreakCheck?.confidence ?? 0) > 0.8
              ? 'critical'
              : 'high',
          details: {
            injection: injectionCheck?.details,
            jailbreak: jailbreakCheck?.details,
          },
        },
        { status: 403 }
      )
    }

    // Get PII check result
    const piiCheck = result.checks?.find((c) => c.name === 'pii_detection')
    const wasRedacted =
      piiCheck && !piiCheck.passed && piiCheck.action === 'redact'

    return NextResponse.json({
      allowed: true,
      sanitizedInput: result.sanitizedInput,
      redacted: wasRedacted,
      piiDetails: wasRedacted ? piiCheck.details : null,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

/**
 * Health check for the security API
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'security-validation',
    library: '@clarity-chat/react SecurityManager',
    timestamp: new Date().toISOString(),
  })
}
