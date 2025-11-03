/**
 * Prompt Library
 * 
 * Optional collection management for prompt templates.
 * Users can build their own libraries or use this helper.
 */

import type { PromptTemplate, PromptVersion } from './types'

export class PromptLibrary {
  private templates = new Map<string, PromptTemplate>()
  private versions = new Map<string, PromptVersion[]>()
  
  /**
   * Add a template to the library
   */
  add(template: PromptTemplate): void {
    this.templates.set(template.id, template)
  }
  
  /**
   * Get a template by ID
   */
  get(id: string): PromptTemplate | undefined {
    return this.templates.get(id)
  }
  
  /**
   * Get template by name
   */
  getByName(name: string): PromptTemplate | undefined {
    return Array.from(this.templates.values()).find(t => t.name === name)
  }
  
  /**
   * Get all templates
   */
  getAll(): PromptTemplate[] {
    return Array.from(this.templates.values())
  }
  
  /**
   * Search templates by query
   */
  search(query: string): PromptTemplate[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description?.toLowerCase().includes(lowerQuery) ||
      t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  /**
   * Get templates by tag
   */
  getByTag(tag: string): PromptTemplate[] {
    return this.getAll().filter(t => t.tags?.includes(tag))
  }
  
  /**
   * Remove a template
   */
  remove(id: string): boolean {
    return this.templates.delete(id)
  }
  
  /**
   * Save a version of a template
   */
  saveVersion(version: PromptVersion): void {
    const versions = this.versions.get(version.templateId) || []
    
    // Deactivate other versions if this is active
    if (version.isActive) {
      versions.forEach(v => { v.isActive = false })
    }
    
    versions.push(version)
    this.versions.set(version.templateId, versions)
  }
  
  /**
   * Get versions of a template
   */
  getVersions(templateId: string): PromptVersion[] {
    return this.versions.get(templateId) || []
  }
  
  /**
   * Get active version of a template
   */
  getActiveVersion(templateId: string): PromptVersion | undefined {
    const versions = this.getVersions(templateId)
    return versions.find(v => v.isActive) || versions[versions.length - 1]
  }
  
  /**
   * Export library to JSON
   */
  export(): string {
    return JSON.stringify({
      templates: Array.from(this.templates.entries()),
      versions: Array.from(this.versions.entries()),
    })
  }
  
  /**
   * Import library from JSON
   */
  import(json: string): void {
    try {
      const data = JSON.parse(json)
      
      if (data.templates) {
        this.templates = new Map(data.templates)
      }
      
      if (data.versions) {
        this.versions = new Map(data.versions)
      }
    } catch (error) {
      throw new Error('Invalid library JSON')
    }
  }
  
  /**
   * Clear library
   */
  clear(): void {
    this.templates.clear()
    this.versions.clear()
  }
}

