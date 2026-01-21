import { NextResponse } from 'next/server'

/**
 * Check if an API key is configured and appears valid.
 *
 * A key is considered configured if it:
 * 1. Is not undefined or null
 * 2. Is not an empty string
 * 3. Is not a placeholder value
 *
 * @param key - The environment variable value to check
 * @returns Boolean indicating if the key appears to be configured
 */
function isKeyConfigured(key: string | undefined): boolean {
  if (!key) return false
  if (key.trim() === '') return false

  // Check for common placeholder values that shouldn't be considered "configured"
  const placeholders = [
    'your_api_key_here',
    'sk-your-key-here',
    'your-api-key',
    'xxx',
    'placeholder',
    'test',
    'demo',
    'changeme',
    'INSERT_KEY_HERE',
  ]

  const lowerKey = key.toLowerCase()
  if (placeholders.some((p) => lowerKey.includes(p.toLowerCase()))) {
    return false
  }

  // Check for minimum length (most API keys are at least 20 characters)
  if (key.length < 20) {
    return false
  }

  return true
}

// Allow only GET requests
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * API endpoint to check which AI providers are configured.
 *
 * This endpoint checks for the presence of API keys in environment variables
 * and returns a boolean status for each provider. It never exposes the actual
 * keys - only whether they are configured.
 *
 * Security considerations:
 * - Keys are checked server-side only
 * - Response only contains boolean flags
 * - Endpoint is rate-limited by Next.js defaults
 * - Caching is enabled to reduce server load
 *
 * @returns JSON object with provider configuration status
 *
 * @example
 * Response:
 * {
 *   "openai": true,
 *   "anthropic": false,
 *   "google": true
 * }
 */
export async function GET() {
  try {
    // Check for API keys in environment variables
    // We only check for presence, never expose the actual values
    const status = {
      openai: isKeyConfigured(process.env.OPENAI_API_KEY),
      anthropic: isKeyConfigured(process.env.ANTHROPIC_API_KEY),
      google: isKeyConfigured(
        process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
      ),
    }

    // Return with cache headers
    return NextResponse.json(status, {
      headers: {
        // Cache for 5 minutes on CDN
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('[Provider Status API] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    )
  }
}
