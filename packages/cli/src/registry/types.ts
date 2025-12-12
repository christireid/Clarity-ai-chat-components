/**
 * Type definitions for the component registry
 */

/**
 * Example code snippet for a component
 */
export interface ComponentExample {
  name: string
  code: string
  description?: string
}

/**
 * Component configuration in the registry
 */
export interface ComponentConfig {
  /** Display name */
  name: string
  /** URL-safe identifier */
  slug: string
  /** Brief description */
  description: string
  /** Emoji icon */
  icon: string
  /** Component category */
  category: 'chat' | 'ui' | 'analytics' | 'core'
  /** Files included in the component */
  files: string[]
  /** Required npm dependencies */
  dependencies: string[]
  /** Required dev dependencies */
  devDependencies: string[]
  /** Required peer dependencies */
  peerDependencies: string[]
  /** Other registry components this depends on */
  registryDependencies: string[]
  /** Documentation URL */
  docs: string
  /** Usage examples */
  examples: ComponentExample[]
}

/**
 * Generator configuration in the registry
 */
export interface GeneratorConfig {
  /** Display name */
  name: string
  /** URL-safe identifier */
  slug: string
  /** Emoji icon */
  icon: string
  /** Brief description */
  description: string
  /** Default output directory */
  defaultDir: string
  /** Prompt fields to collect */
  prompts: string[]
  /** Template names to use */
  templates: string[]
}

/**
 * Project template configuration
 */
export interface TemplateConfig {
  /** Display name */
  name: string
  /** URL-safe identifier */
  slug: string
  /** Brief description */
  description: string
  /** Components included in this template */
  components: string[]
  /** Features enabled by this template */
  features: string[]
}

/**
 * Template context for Handlebars rendering
 */
export interface TemplateContext {
  /** Original input name */
  name: string
  /** PascalCase version */
  pascalName: string
  /** camelCase version */
  camelName: string
  /** kebab-case version */
  kebabName: string
  /** Description */
  description: string
  /** Include test file */
  withTest: boolean
  /** Include Storybook story */
  withStory: boolean
  /** Component directory category */
  componentDir: string
  /** Target package */
  package: string
  /** Chat component type (for chat-component generator) */
  chatType?: 'basic' | 'streaming' | 'memory'
  /** Provider for adapters */
  provider?: 'openai' | 'anthropic' | 'google' | 'custom'
  /** Include memory support */
  withMemory?: boolean
  /** Include streaming support */
  withStreaming?: boolean
  /** Current year for copyright */
  year: number
  /** Author name from git config */
  author?: string
}

/**
 * Generated file definition
 */
export interface GeneratedFile {
  /** Relative file path */
  name: string
  /** Template content or template key */
  template: string
  /** Whether this file is enabled */
  enabled?: boolean
}

/**
 * Add command options
 */
export interface AddOptions {
  /** Target installation path */
  path?: string
  /** Install dependencies */
  deps?: boolean
  /** Add multiple components */
  batch?: string
  /** Preview without creating files */
  dryRun?: boolean
  /** Skip confirmation prompts */
  yes?: boolean
  /** Overwrite existing files */
  force?: boolean
}

/**
 * Generate command options
 */
export interface GenerateOptions {
  /** Component/hook name */
  name?: string
  /** Output directory */
  output?: string
  /** Preview without creating files */
  dryRun?: boolean
  /** Include test file */
  withTest?: boolean
  /** Include Storybook story */
  withStory?: boolean
  /** Component type */
  type?: string
  /** Target package */
  package?: string
  /** Output subdirectory */
  dir?: string
  /** Overwrite existing files */
  force?: boolean
  /** Description */
  description?: string
  /** Skip confirmation prompts */
  yes?: boolean
  /** Chat type for chat components */
  chatType?: 'basic' | 'streaming' | 'memory'
  /** Provider for adapters */
  provider?: 'openai' | 'anthropic' | 'google' | 'custom'
  /** Include memory support */
  withMemory?: boolean
  /** Include streaming support */
  withStreaming?: boolean
}

/**
 * Init command options
 */
export interface InitOptions {
  /** Project template */
  template?: string
  /** Framework */
  framework?: string
  /** Install dependencies */
  install?: boolean
  /** Initialize git */
  git?: boolean
  /** Preview without creating files */
  dryRun?: boolean
  /** Skip confirmation prompts */
  yes?: boolean
}
