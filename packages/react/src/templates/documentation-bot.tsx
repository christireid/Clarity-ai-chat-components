/**
 * Documentation Bot Template
 * 
 * Interactive documentation assistant
 */

export { CustomerSupportTemplate as DocumentationBotTemplate } from './customer-support'

// Re-export with documentation-specific configuration
export function createDocumentationBot(_config: {
  docsSite: string
  searchEndpoint?: string
  categories?: string[]
}) {
  // This would be implemented with documentation-specific features
  // TODO: Implement documentation-specific features using config
  return null // Placeholder
}