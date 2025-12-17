#!/usr/bin/env node
import { logger } from '@clarity-chat/utils/logger';

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
  logger.debug(`
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
      logger.logger.error(
        'Error: CLARITY_LICENSE_SECRET environment variable is required'
      )
      process.exit(1)
    }

    const options = parseArgs(args.slice(1))

    if (!options.licensee || !options.email || !options.plan) {
      logger.logger.error('Error: --licensee, --email, and --plan are required')
      printUsage()
      process.exit(1)
    }

    const validPlans: LicensePlan[] = ['community', 'pro', 'enterprise']
    const validScopes: LicenseScope[] = ['individual', 'team', 'organization']

    if (!validPlans.includes(options.plan as LicensePlan)) {
      logger.logger.error(
        `Error: Invalid plan. Must be one of: ${validPlans.join(', ')}`
      )
      process.exit(1)
    }

    const scope = (options.scope as LicenseScope) || 'individual'
    if (!validScopes.includes(scope)) {
      logger.logger.error(
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

      logger.debug('\n✅ License key generated successfully!\n')
      logger.debug('License Key:')
      logger.debug('─'.repeat(60))
      logger.debug(key)
      logger.debug('─'.repeat(60))
      logger.debug('\nDetails:')
      logger.debug(`  Licensee: ${options.licensee}`)
      logger.debug(`  Email: ${options.email}`)
      logger.debug(`  Plan: ${options.plan}`)
      logger.debug(`  Scope: ${scope}`)
      logger.debug(`  Duration: ${options.days || 365} days`)
      if (options.devs) logger.debug(`  Max Developers: ${options.devs}`)
      if (options.domains) logger.debug(`  Domains: ${options.domains}`)
      logger.debug()
    } catch (error) {
      logger.logger.error('Error generating license:', error)
      process.exit(1)
    }
  } else if (command === 'verify') {
    const key = args[1]
    if (!key) {
      logger.logger.error('Error: License key is required')
      process.exit(1)
    }

    const result = verifyLicense(key)
    logger.debug('\nLicense Verification Result:')
    logger.debug('─'.repeat(40))
    logger.debug(`  Status: ${result.status}`)
    if (result.reason) logger.debug(`  Reason: ${result.reason}`)
    if (result.payload) {
      logger.debug(`  Licensee: ${result.payload.licensee}`)
      logger.debug(`  Plan: ${result.payload.plan}`)
      logger.debug(`  Scope: ${result.payload.scope}`)
    }
    logger.debug()

    // Also check checksum if secret is available
    const secret = process.env.CLARITY_LICENSE_SECRET
    if (secret) {
      const checksumValid = verifyLicenseChecksum(key, secret)
      logger.debug(`  Checksum Valid: ${checksumValid ? '✅ Yes' : '❌ No'}`)
    }
  } else if (command === 'decode') {
    const key = args[1]
    if (!key) {
      logger.logger.error('Error: License key is required')
      process.exit(1)
    }

    const parsed = parseLicenseKey(key)
    if (!parsed) {
      logger.logger.error('Error: Invalid license key format')
      process.exit(1)
    }

    try {
      const payload = JSON.parse(base64Decode(parsed.encodedPayload))
      logger.debug('\nDecoded License:')
      logger.debug('─'.repeat(40))
      logger.debug(JSON.stringify(payload, null, 2))
      logger.debug()
    } catch (error) {
      logger.logger.error('Error decoding license payload:', error)
      process.exit(1)
    }
  } else {
    logger.logger.error(`Unknown command: ${command}`)
    printUsage()
    process.exit(1)
  }
}

main().catch(console.error)
