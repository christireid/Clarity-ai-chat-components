import { NextResponse } from 'next/server'
import { validateInput } from '@/lib/security'

/**
 * Server-side Security Validation API
 *
 * POST /api/validate
 *
 * This endpoint validates user input server-side before it's processed.
 * This is the proper way to implement security - client-side validation
 * can be bypassed, but server-side cannot.
 */

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

    // Validate the input
    const result = validateInput(input, options)

    // Log security events (in production, send to monitoring service)
    if (!result.allowed) {
      console.warn('[SECURITY] Blocked input:', {
        timestamp: new Date().toISOString(),
        threatCount: result.summary.totalThreats,
        severity: result.summary.highestSeverity,
        injection: result.results.injection.matchedPatterns,
        jailbreak: result.results.jailbreak.matchedPatterns,
      })
    }

    // Return appropriate response
    if (!result.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          reason: 'Security policy violation',
          severity: result.summary.highestSeverity,
          details: {
            injection: result.results.injection.details,
            jailbreak: result.results.jailbreak.details,
          },
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      allowed: true,
      sanitizedInput: result.sanitizedInput,
      redacted: result.summary.redacted,
      piiDetails:
        result.results.pii.matchedPatterns.length > 0
          ? result.results.pii.details
          : null,
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
    timestamp: new Date().toISOString(),
  })
}
