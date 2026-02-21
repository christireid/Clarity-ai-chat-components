/**
 * Storybook Examples and Variants
 *
 * Provides examples and variant information from Storybook stories
 * for enriching component documentation in the AI API.
 */

export interface StorybookVariant {
  name: string
  description?: string
  props: Record<string, unknown>
}

export interface StorybookMetadata {
  totalStories: number
  lastUpdated: string
}

// Empty implementations as fallback
export function getExamplesForComponent(componentName: string): string[] {
  return []
}

export function getVariantsForComponent(componentName: string): StorybookVariant[] {
  return []
}

export const storybookMetadata: StorybookMetadata = {
  totalStories: 0,
  lastUpdated: new Date().toISOString(),
}
