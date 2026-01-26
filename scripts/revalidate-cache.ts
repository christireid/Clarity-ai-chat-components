#!/usr/bin/env -S npx tsx

/**
 * Manual Cache Revalidation Script
 *
 * Wave 3.3 Agent 35 - ISR Cache Optimizer
 *
 * Usage:
 * ```bash
 * # Revalidate specific path
 * npm run revalidate -- --path=/api/reference/hooks
 *
 * # Revalidate by tag (all API docs)
 * npm run revalidate -- --tag=api-docs
 *
 * # Revalidate multiple paths
 * npm run revalidate -- --path=/api --path=/get-started
 * ```
 */

const PROD_URL = process.env.PROD_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const SECRET = process.env.REVALIDATION_SECRET

if (!SECRET) {
  console.error('❌ REVALIDATION_SECRET environment variable is required')
  console.error('Set it in your .env.local file or provide it inline:')
  console.error('REVALIDATION_SECRET=your-secret npm run revalidate -- --path=/some/path')
  process.exit(1)
}

interface RevalidationResponse {
  revalidated: boolean
  method: 'path' | 'tag'
  path?: string
  tag?: string
  timestamp: string
  now: number
  error?: string
  message?: string
}

async function revalidate(
  pathOrTag: string,
  type: 'path' | 'tag' = 'path'
): Promise<void> {
  const body = type === 'path' ? { path: pathOrTag } : { tag: pathOrTag }

  console.log(`🔄 Revalidating ${type}: ${pathOrTag}`)

  try {
    const response = await fetch(`${PROD_URL}/api/revalidate?secret=${SECRET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data: RevalidationResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    if (data.revalidated) {
      console.log(`✅ Successfully revalidated ${type}: ${pathOrTag}`)
      console.log(`   Timestamp: ${data.timestamp}`)
    } else {
      console.error(`❌ Revalidation failed for ${type}: ${pathOrTag}`)
      console.error(`   Response:`, data)
    }
  } catch (error) {
    console.error(`❌ Revalidation error for ${type}: ${pathOrTag}`)
    console.error(`   ${error instanceof Error ? error.message : error}`)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)

  // Parse command line arguments
  const paths: string[] = []
  const tags: string[] = []

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && args[i + 1]) {
      paths.push(args[i + 1])
      i++
    } else if (args[i] === '--tag' && args[i + 1]) {
      tags.push(args[i + 1])
      i++
    }
  }

  if (paths.length === 0 && tags.length === 0) {
    console.error('❌ Usage: npm run revalidate -- --path=/some/path OR --tag=some-tag')
    console.error('')
    console.error('Examples:')
    console.error('  npm run revalidate -- --path=/api/reference/hooks')
    console.error('  npm run revalidate -- --tag=api-docs')
    console.error('  npm run revalidate -- --path=/api --path=/get-started')
    console.error('')
    console.error('Environment:')
    console.error(`  PROD_URL: ${PROD_URL}`)
    console.error(`  REVALIDATION_SECRET: ${SECRET ? '✓ Set' : '✗ Not set'}`)
    process.exit(1)
  }

  console.log('')
  console.log('🚀 Starting cache revalidation...')
  console.log(`   Target: ${PROD_URL}`)
  console.log('')

  let successCount = 0
  let errorCount = 0

  // Revalidate paths
  for (const path of paths) {
    try {
      await revalidate(path, 'path')
      successCount++
    } catch {
      errorCount++
    }
  }

  // Revalidate tags
  for (const tag of tags) {
    try {
      await revalidate(tag, 'tag')
      successCount++
    } catch {
      errorCount++
    }
  }

  console.log('')
  console.log('📊 Summary:')
  console.log(`   ✅ Successful: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)

  if (errorCount > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
