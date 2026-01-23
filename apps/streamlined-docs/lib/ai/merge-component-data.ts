/**
 * Merge Generated and Curated Component/Hook Data
 *
 * Combines auto-generated data from source files with manually curated
 * documentation to provide the most complete and accurate API data.
 */

import {
  generatedComponents,
  generatedHooks,
  generationMetadata,
  type GeneratedComponent,
  type GeneratedHook,
} from './generated-data'
import {
  getExamplesForComponent,
  getVariantsForComponent,
  storybookMetadata,
} from './storybook-examples'
import {
  type ComponentInfo,
  type HookInfo,
  BASE_URL,
  PACKAGE_VERSION,
} from './types'

/**
 * Convert generated component to API format
 */
function toComponentInfo(
  component: GeneratedComponent,
  category: string = 'general'
): ComponentInfo {
  // Convert kebab-case filename to component page URL
  const urlName = component.file.replace('.tsx', '').toLowerCase()

  // Get examples from Storybook if available
  const storybookExamples = getExamplesForComponent(component.name)
  const examples =
    storybookExamples.length > 0
      ? storybookExamples
      : component.examples.length > 0
        ? component.examples
        : []

  // Get Storybook variants as additional metadata
  const storybookVariants = getVariantsForComponent(component.name)

  return {
    name: component.name,
    description:
      component.description || `${component.name} component from Clarity Chat`,
    category: category as ComponentInfo['category'],
    props: component.props.map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required,
      description: p.description,
    })),
    importPath: component.importPath,
    docsUrl: `${BASE_URL}/reference/components/${urlName}`,
    examples,
    relatedComponents: [],
    accessibility: [],
    version: PACKAGE_VERSION,
    ...(storybookVariants.length > 0 && { storybookVariants }),
  } as ComponentInfo
}

/**
 * Convert generated hook to API format
 */
function toHookInfo(
  hook: GeneratedHook,
  category: string = 'general'
): HookInfo {
  // Convert kebab-case filename to hook page URL
  const urlName = hook.file.replace('.ts', '').toLowerCase()

  return {
    name: hook.name,
    description: hook.description || `${hook.name} hook from Clarity Chat`,
    category: category as HookInfo['category'],
    signature: `${hook.name}(options?: ${hook.name.replace('use', '')}Options)`,
    parameters: hook.parameters.map((p) => ({
      name: p.name,
      type: p.type,
      required: p.required,
      description: p.description,
    })),
    returns: {
      type: `${hook.name.replace('use', '')}Return`,
      properties: hook.returns.map((r) => ({
        name: r.name,
        type: r.type,
        description: r.description,
      })),
    },
    importPath: hook.importPath,
    docsUrl: `${BASE_URL}/reference/hooks/${urlName}`,
    examples: hook.examples.length > 0 ? hook.examples : [],
    relatedHooks: [],
    version: PACKAGE_VERSION,
    deprecated: hook.deprecated,
  }
}

/**
 * Categorize component based on name patterns
 */
function inferComponentCategory(name: string): ComponentInfo['category'] {
  const nameLower = name.toLowerCase()

  if (nameLower.includes('chat') || nameLower.includes('message')) return 'core'
  if (
    nameLower.includes('input') ||
    nameLower.includes('upload') ||
    nameLower.includes('voice')
  )
    return 'input'
  if (
    nameLower.includes('button') ||
    nameLower.includes('avatar') ||
    nameLower.includes('badge')
  )
    return 'ui'
  if (
    nameLower.includes('toast') ||
    nameLower.includes('indicator') ||
    nameLower.includes('skeleton')
  )
    return 'feedback'
  if (
    nameLower.includes('token') ||
    nameLower.includes('dashboard') ||
    nameLower.includes('analytics')
  )
    return 'analytics'
  if (
    nameLower.includes('code') ||
    nameLower.includes('markdown') ||
    nameLower.includes('preview')
  )
    return 'display'

  return 'general'
}

/**
 * Categorize hook based on name patterns
 */
function inferHookCategory(name: string): HookInfo['category'] {
  const nameLower = name.toLowerCase()

  if (nameLower.includes('chat') || nameLower.includes('message')) return 'chat'
  if (nameLower.includes('stream')) return 'streaming'
  if (nameLower.includes('token') || nameLower.includes('optimization'))
    return 'optimization'
  if (
    nameLower.includes('voice') ||
    nameLower.includes('keyboard') ||
    nameLower.includes('clipboard')
  )
    return 'input'
  if (nameLower.includes('storage') || nameLower.includes('persist'))
    return 'persistence'
  if (
    nameLower.includes('media') ||
    nameLower.includes('scroll') ||
    nameLower.includes('resize')
  )
    return 'ui'
  if (nameLower.includes('error') || nameLower.includes('retry'))
    return 'error-handling'

  return 'general'
}

/**
 * Merge curated components with generated components
 * Curated data takes precedence over generated data
 */
export function mergeComponentData(
  curatedComponents: ComponentInfo[]
): ComponentInfo[] {
  const curatedNames = new Set(
    curatedComponents.map((c) => c.name.toLowerCase())
  )

  // Add generated components that aren't in curated list
  const additionalComponents = generatedComponents
    .filter((gc) => !curatedNames.has(gc.name.toLowerCase()))
    .map((gc) => toComponentInfo(gc, inferComponentCategory(gc.name)))

  return [...curatedComponents, ...additionalComponents]
}

/**
 * Merge curated hooks with generated hooks
 * Curated data takes precedence over generated data
 */
export function mergeHookData(curatedHooks: HookInfo[]): HookInfo[] {
  const curatedNames = new Set(curatedHooks.map((h) => h.name.toLowerCase()))

  // Add generated hooks that aren't in curated list
  const additionalHooks = generatedHooks
    .filter((gh) => !curatedNames.has(gh.name.toLowerCase()))
    .filter((gh) => !gh.deprecated) // Exclude deprecated hooks
    .map((gh) => toHookInfo(gh, inferHookCategory(gh.name)))

  return [...curatedHooks, ...additionalHooks]
}

/**
 * Get all generated components (for standalone use)
 */
export function getAllGeneratedComponents(): ComponentInfo[] {
  return generatedComponents.map((gc) =>
    toComponentInfo(gc, inferComponentCategory(gc.name))
  )
}

/**
 * Get all generated hooks (for standalone use)
 */
export function getAllGeneratedHooks(): HookInfo[] {
  return generatedHooks
    .filter((gh) => !gh.deprecated)
    .map((gh) => toHookInfo(gh, inferHookCategory(gh.name)))
}

/**
 * Get data source metadata
 */
export function getDataSourceInfo() {
  return {
    generated: generationMetadata,
    storybook: storybookMetadata,
    curatedDataSource: 'manually maintained',
    mergeStrategy:
      'curated takes precedence over generated, storybook examples enriched',
  }
}
