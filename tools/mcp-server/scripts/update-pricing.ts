import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
#!/usr/bin/env tsx
/**
 * Model Pricing Update Script
 *
 * Updates AI model pricing in the model-registry.ts file.
 * Can be used with manual JSON input or extended to fetch from provider APIs.
 *
 * Usage:
 *   npx tsx scripts/update-pricing.ts                    # Check for updates
 *   npx tsx scripts/update-pricing.ts --apply           # Apply updates from pricing.json
 *   npx tsx scripts/update-pricing.ts --generate-sample # Generate sample pricing.json
 *
 * @module update-pricing
 */

import * as fs from 'fs'
import * as path from 'path'

// Types
interface PricingUpdate {
  modelId: string
  input: number
  output: number
  cached?: number
}

interface PricingConfig {
  lastUpdated: string
  source: string
  updates: PricingUpdate[]
}

// Configuration
const MODEL_REGISTRY_PATH = path.join(
  __dirname,
  '../src/data/model-registry.ts'
)
const PRICING_CONFIG_PATH = path.join(__dirname, '../pricing.json')

/**
 * Generate sample pricing.json file
 */
function generateSamplePricingConfig(): void {
  const sampleConfig: PricingConfig = {
    lastUpdated: new Date().toISOString(),
    source: 'manual',
    updates: [
      {
        modelId: 'gpt-4o',
        input: 2.5,
        output: 10.0,
        cached: 1.25,
      },
      {
        modelId: 'gpt-4o-mini',
        input: 0.15,
        output: 0.6,
        cached: 0.075,
      },
      {
        modelId: 'claude-3-5-sonnet-20241022',
        input: 3.0,
        output: 15.0,
        cached: 0.3,
      },
      {
        modelId: 'claude-3-5-haiku-20241022',
        input: 0.8,
        output: 4.0,
        cached: 0.08,
      },
      {
        modelId: 'gemini-2.0-flash',
        input: 0.1,
        output: 0.4,
      },
      {
        modelId: 'gemini-1.5-pro',
        input: 1.25,
        output: 5.0,
      },
      {
        modelId: 'gemini-1.5-flash',
        input: 0.075,
        output: 0.3,
      },
    ],
  }

  fs.writeFileSync(PRICING_CONFIG_PATH, JSON.stringify(sampleConfig, null, 2))
  SecureLogger.debug(`Sample pricing config written to: ${PRICING_CONFIG_PATH}`)
}

/**
 * Load pricing config from JSON file
 */
function loadPricingConfig(): PricingConfig | null {
  if (!fs.existsSync(PRICING_CONFIG_PATH)) {
    SecureLogger.debug(
      'No pricing.json found. Run with --generate-sample to create one.'
    )
    return null
  }

  try {
    const content = fs.readFileSync(PRICING_CONFIG_PATH, 'utf-8')
    return JSON.parse(content) as PricingConfig
  } catch (error) {
    SecureLogger.error('Error reading pricing.json:', error)
    return null
  }
}

/**
 * Read current model registry
 */
function readModelRegistry(): string {
  return fs.readFileSync(MODEL_REGISTRY_PATH, 'utf-8')
}

/**
 * Update pricing in model registry
 */
function updatePricing(update: PricingUpdate, registryContent: string): string {
  // Create regex to find the pricing section for this model
  const modelPattern = new RegExp(
    `('${update.modelId}':\\s*\\{[^}]*pricing:\\s*\\{)[^}]*(\\})`,
    's'
  )

  const match = registryContent.match(modelPattern)
  if (!match) {
    SecureLogger.warn(`Model ${update.modelId} not found in registry`)
    return registryContent
  }

  // Build new pricing object
  let newPricing = ` input: ${update.input}, output: ${update.output}`
  if (update.cached !== undefined) {
    newPricing += `, cached: ${update.cached}`
  }
  newPricing += ' '

  return registryContent.replace(modelPattern, `$1${newPricing}$2`)
}

/**
 * Validate pricing update
 */
function validatePricing(update: PricingUpdate): string[] {
  const errors: string[] = []

  if (!update.modelId || typeof update.modelId !== 'string') {
    errors.push('Invalid modelId')
  }
  if (typeof update.input !== 'number' || update.input < 0) {
    errors.push(`Invalid input price for ${update.modelId}`)
  }
  if (typeof update.output !== 'number' || update.output < 0) {
    errors.push(`Invalid output price for ${update.modelId}`)
  }
  if (
    update.cached !== undefined &&
    (typeof update.cached !== 'number' || update.cached < 0)
  ) {
    errors.push(`Invalid cached price for ${update.modelId}`)
  }

  return errors
}

/**
 * Compare current and new pricing
 */
function comparePricing(config: PricingConfig): void {
  const registryContent = readModelRegistry()

  SecureLogger.debug('\n=== Pricing Comparison ===\n')
  SecureLogger.debug(`Source: ${config.source}`)
  SecureLogger.debug(`Last Updated: ${config.lastUpdated}`)
  SecureLogger.debug('')

  for (const update of config.updates) {
    // Extract current pricing from registry
    const pricePattern = new RegExp(
      `'${update.modelId}':\\s*\\{[^}]*pricing:\\s*\\{\\s*input:\\s*([\\d.]+),\\s*output:\\s*([\\d.]+)(?:,\\s*cached:\\s*([\\d.]+))?`,
      's'
    )
    const match = registryContent.match(pricePattern)

    if (match) {
      const currentInput = parseFloat(match[1])
      const currentOutput = parseFloat(match[2])
      const currentCached = match[3] ? parseFloat(match[3]) : undefined

      const inputChanged = currentInput !== update.input
      const outputChanged = currentOutput !== update.output
      const cachedChanged = currentCached !== update.cached

      if (inputChanged || outputChanged || cachedChanged) {
        SecureLogger.debug(`${update.modelId}:`)
        if (inputChanged) {
          SecureLogger.debug(`  Input:  $${currentInput}/1M -> $${update.input}/1M`)
        }
        if (outputChanged) {
          SecureLogger.debug(`  Output: $${currentOutput}/1M -> $${update.output}/1M`)
        }
        if (cachedChanged) {
          SecureLogger.debug(
            `  Cached: $${currentCached ?? 'N/A'}/1M -> $${update.cached ?? 'N/A'}/1M`
          )
        }
      } else {
        SecureLogger.debug(`${update.modelId}: No changes`)
      }
    } else {
      SecureLogger.debug(`${update.modelId}: Not found in registry`)
    }
  }

  SecureLogger.debug('\nRun with --apply to apply these changes.')
}

/**
 * Apply pricing updates to registry
 */
function applyPricingUpdates(config: PricingConfig): void {
  SecureLogger.debug('\n=== Applying Pricing Updates ===\n')

  // Validate all updates first
  const allErrors: string[] = []
  for (const update of config.updates) {
    const errors = validatePricing(update)
    allErrors.push(...errors)
  }

  if (allErrors.length > 0) {
    SecureLogger.error('Validation errors:')
    allErrors.forEach((e) => SecureLogger.error(`  - ${e}`))
    process.exit(1)
  }

  // Read and update registry
  let registryContent = readModelRegistry()

  for (const update of config.updates) {
    registryContent = updatePricing(update, registryContent)
    SecureLogger.debug(`Updated: ${update.modelId}`)
  }

  // Update the "Last updated" comment
  const datePattern = /Last updated: \w+ \d{4}/
  const newDate = `Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
  registryContent = registryContent.replace(datePattern, newDate)

  // Write updated registry
  fs.writeFileSync(MODEL_REGISTRY_PATH, registryContent)

  SecureLogger.debug(`\nUpdated ${config.updates.length} models.`)
  SecureLogger.debug(`Registry written to: ${MODEL_REGISTRY_PATH}`)
}

/**
 * Fetch latest pricing from provider APIs (placeholder)
 *
 * In a production implementation, this would:
 * 1. Fetch from OpenAI API: https://api.openai.com/v1/models
 * 2. Fetch from Anthropic API: https://api.anthropic.com/v1/models
 * 3. Parse Google AI documentation
 *
 * For now, this returns the manual config.
 */
async function fetchLatestPricing(): Promise<PricingConfig | null> {
  SecureLogger.debug('Note: Automatic pricing fetching not implemented.')
  SecureLogger.debug('Using manual pricing.json configuration.')
  return loadPricingConfig()
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  SecureLogger.debug('Model Pricing Update Tool')
  SecureLogger.debug('=========================')

  if (args.includes('--generate-sample')) {
    generateSamplePricingConfig()
    return
  }

  const config = await fetchLatestPricing()
  if (!config) {
    SecureLogger.debug('\nTo create a pricing config:')
    SecureLogger.debug('  npx tsx scripts/update-pricing.ts --generate-sample')
    return
  }

  if (args.includes('--apply')) {
    applyPricingUpdates(config)
  } else {
    comparePricing(config)
  }
}

main().catch(console.error)
