#!/usr/bin/env node

/**
 * Clarity Chat License Key Generator CLI
 *
 * Usage:
 *   npx tsx scripts/generate-license.ts generate --licensee "Acme Corp" --email "dev@acme.com" --plan pro
 *
 * Required environment variable:
 *   CLARITY_LICENSE_SECRET - Secret key for signing licenses
 */

import {
  generateLicenseKey,
  parseLicenseKey,
  verifyLicenseChecksum,
} from '../src/generateLicense'
import { verifyLicense } from '../src/verifyLicense'
import { base64Decode } from '../src/utils'
import type { LicensePlan, LicenseScope } from '../src/types'

const args = process.argv.slice(2)

function printUsage() {
  console.log(`
Clarity Chat License Key Generator

USAGE:
  generate-license generate [options]    Generate a new license key
  generate-license verify <key>          Verify a license key
  generate-license decode <key>          Decode and display license info
  generate-license help                  Show this help message

GENERATE OPTIONS:
  --licensee <name>     Name of the licensee (required)
  --email <email>       Contact email (required)
  --plan <plan>         License plan: community, pro, enterprise (required)
  --scope <scope>       License scope: individual, team, organization (default: individual)
  --days <number>       License duration in days (default: 365)
  --order <number>      Order number (default: auto-generated)
  --devs <number>       Max developers (for team/org licenses)
  --domains <list>      Comma-separated domain restrictions

ENVIRONMENT:
  CLARITY_LICENSE_SECRET  Secret key for generating licenses (required for generate)

EXAMPLES:
  # Generate a Pro license
  CLARITY_LICENSE_SECRET=xxx generate-license generate \\
    --licensee "Acme Corp" \\
    --email "dev@acme.com" \\
    --plan pro \\
    --scope team \\
    --days 365

  # Verify a license key
  generate-license verify "CC-1-eyJ..."

  # Decode a license key
  generate-license decode "CC-1-eyJ..."
`)
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CC-${timestamp}-${random}`
}

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      const value = args[i + 1]
      if (value && !value.startsWith('--')) {
        result[key] = value
        i++
      }
    }
  }
  return result
}

async function main() {
  const command = args[0]

  if (!command || command === 'help') {
    printUsage()
    process.exit(0)
  }

  if (command === 'generate') {
    const secret = process.env.CLARITY_LICENSE_SECRET
    if (!secret) {
      console.error(
        'Error: CLARITY_LICENSE_SECRET environment variable is required'
      )
      process.exit(1)
    }

    const options = parseArgs(args.slice(1))

    if (!options.licensee || !options.email || !options.plan) {
      console.error('Error: --licensee, --email, and --plan are required')
      printUsage()
      process.exit(1)
    }

    const validPlans: LicensePlan[] = ['community', 'pro', 'enterprise']
    const validScopes: LicenseScope[] = ['individual', 'team', 'organization']

    if (!validPlans.includes(options.plan as LicensePlan)) {
      console.error(
        `Error: Invalid plan. Must be one of: ${validPlans.join(', ')}`
      )
      process.exit(1)
    }

    const scope = (options.scope as LicenseScope) || 'individual'
    if (!validScopes.includes(scope)) {
      console.error(
        `Error: Invalid scope. Must be one of: ${validScopes.join(', ')}`
      )
      process.exit(1)
    }

    try {
      const key = generateLicenseKey(
        {
          orderNumber: options.order || generateOrderNumber(),
          licensee: options.licensee,
          email: options.email,
          plan: options.plan as LicensePlan,
          scope,
          durationDays: options.days ? parseInt(options.days, 10) : 365,
          maxDevelopers: options.devs ? parseInt(options.devs, 10) : undefined,
          domains: options.domains ? options.domains.split(',') : undefined,
        },
        secret
      )

      console.log('\n✅ License key generated successfully!\n')
      console.log('License Key:')
      console.log('─'.repeat(60))
      console.log(key)
      console.log('─'.repeat(60))
      console.log('\nDetails:')
      console.log(`  Licensee: ${options.licensee}`)
      console.log(`  Email: ${options.email}`)
      console.log(`  Plan: ${options.plan}`)
      console.log(`  Scope: ${scope}`)
      console.log(`  Duration: ${options.days || 365} days`)
      if (options.devs) console.log(`  Max Developers: ${options.devs}`)
      if (options.domains) console.log(`  Domains: ${options.domains}`)
      console.log()
    } catch (error) {
      console.error('Error generating license:', error)
      process.exit(1)
    }
  } else if (command === 'verify') {
    const key = args[1]
    if (!key) {
      console.error('Error: License key is required')
      process.exit(1)
    }

    const result = verifyLicense(key)
    console.log('\nLicense Verification Result:')
    console.log('─'.repeat(40))
    console.log(`  Status: ${result.status}`)
    if (result.reason) console.log(`  Reason: ${result.reason}`)
    if (result.payload) {
      console.log(`  Licensee: ${result.payload.licensee}`)
      console.log(`  Plan: ${result.payload.plan}`)
      console.log(`  Scope: ${result.payload.scope}`)
    }
    console.log()

    // Also check checksum if secret is available
    const secret = process.env.CLARITY_LICENSE_SECRET
    if (secret) {
      const checksumValid = verifyLicenseChecksum(key, secret)
      console.log(`  Checksum Valid: ${checksumValid ? '✅ Yes' : '❌ No'}`)
    }
  } else if (command === 'decode') {
    const key = args[1]
    if (!key) {
      console.error('Error: License key is required')
      process.exit(1)
    }

    const parsed = parseLicenseKey(key)
    if (!parsed) {
      console.error('Error: Invalid license key format')
      process.exit(1)
    }

    try {
      const payload = JSON.parse(base64Decode(parsed.encodedPayload))
      console.log('\nDecoded License:')
      console.log('─'.repeat(40))
      console.log(JSON.stringify(payload, null, 2))
      console.log()
    } catch (error) {
      console.error('Error decoding license payload:', error)
      process.exit(1)
    }
  } else {
    console.error(`Unknown command: ${command}`)
    printUsage()
    process.exit(1)
  }
}

main().catch(console.error)
