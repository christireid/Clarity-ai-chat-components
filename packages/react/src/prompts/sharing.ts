/**
 * Prompt Template Sharing and Import/Export
 *
 * Handles sharing templates between users, importing/exporting template collections,
 * and managing template marketplaces.
 */

import type { PromptTemplate, PromptVersion, PromptAnalytics } from './types'

/**
 * Shared template metadata
 */
export interface SharedTemplate extends PromptTemplate {
  /** Original author */
  author: {
    id: string
    name: string
    avatar?: string
  }
  /** When shared */
  sharedAt: number
  /** Sharing options */
  sharing: {
    isPublic: boolean
    allowFork: boolean
    requireAttribution: boolean
  }
  /** Usage statistics */
  stats: {
    downloads: number
    forks: number
    rating: number
    reviews: number
  }
  /** Version when shared */
  sharedVersion: string
}

/**
 * Template collection for export/import
 */
export interface TemplateCollection {
  /** Collection metadata */
  metadata: {
    name: string
    description?: string
    author: {
      id: string
      name: string
    }
    createdAt: number
    version: string
  }
  /** Templates in collection */
  templates: SharedTemplate[]
  /** Collection tags */
  tags: string[]
}

/**
 * Sharing service interface
 */
export interface TemplateSharingService {
  /** Share a template */
  shareTemplate: (template: PromptTemplate, options: SharingOptions) => Promise<SharedTemplate>

  /** Get shared templates */
  getSharedTemplates: (filters?: SharingFilters) => Promise<SharedTemplate[]>

  /** Download a shared template */
  downloadTemplate: (templateId: string) => Promise<SharedTemplate>

  /** Fork a shared template */
  forkTemplate: (templateId: string, newName: string) => Promise<PromptTemplate>

  /** Rate a shared template */
  rateTemplate: (templateId: string, rating: number, review?: string) => Promise<void>
}

/**
 * Sharing options
 */
export interface SharingOptions {
  /** Make template publicly discoverable */
  isPublic: boolean
  /** Allow others to fork/modify */
  allowFork: boolean
  /** Require attribution when used */
  requireAttribution: boolean
  /** Target audience/platforms */
  targetPlatforms?: string[]
  /** License type */
  license?: 'MIT' | 'Apache-2.0' | 'CC-BY' | 'Proprietary'
}

/**
 * Sharing filters for discovery
 */
export interface SharingFilters {
  /** Search query */
  query?: string
  /** Filter by tags */
  tags?: string[]
  /** Filter by author */
  authorId?: string
  /** Sort order */
  sortBy?: 'popular' | 'recent' | 'rating' | 'downloads'
  /** Minimum rating */
  minRating?: number
  /** Template category */
  category?: string
  /** License filter */
  license?: string[]
}

/**
 * Template marketplace interface
 */
export class TemplateMarketplace {
  private sharedTemplates = new Map<string, SharedTemplate>()

  /**
   * Share a template to the marketplace
   */
  async shareTemplate(
    template: PromptTemplate,
    author: { id: string; name: string; avatar?: string },
    options: SharingOptions
  ): Promise<SharedTemplate> {
    const sharedTemplate: SharedTemplate = {
      ...template,
      author,
      sharedAt: Date.now(),
      sharing: {
        isPublic: options.isPublic,
        allowFork: options.allowFork,
        requireAttribution: options.requireAttribution,
      },
      stats: {
        downloads: 0,
        forks: 0,
        rating: 0,
        reviews: 0,
      },
      sharedVersion: template.version || '1.0.0',
    }

    this.sharedTemplates.set(template.id, sharedTemplate)
    return sharedTemplate
  }

  /**
   * Get shared templates with filtering
   */
  async getSharedTemplates(filters: SharingFilters = {}): Promise<SharedTemplate[]> {
    let templates = Array.from(this.sharedTemplates.values())

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase()
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (filters.tags && filters.tags.length > 0) {
      templates = templates.filter(t =>
        filters.tags!.some(tag => t.tags?.includes(tag))
      )
    }

    if (filters.authorId) {
      templates = templates.filter(t => t.author.id === filters.authorId)
    }

    if (filters.minRating) {
      templates = templates.filter(t => t.stats.rating >= filters.minRating!)
    }

    // Sort
    const sortBy = filters.sortBy || 'popular'
    templates.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.stats.downloads - a.stats.downloads
        case 'recent':
          return b.sharedAt - a.sharedAt
        case 'rating':
          return b.stats.rating - a.stats.rating
        case 'downloads':
          return b.stats.downloads - a.stats.downloads
        default:
          return 0
      }
    })

    return templates
  }

  /**
   * Download a shared template
   */
  async downloadTemplate(templateId: string): Promise<SharedTemplate | null> {
    const template = this.sharedTemplates.get(templateId)
    if (!template) return null

    // Increment download count
    template.stats.downloads++
    this.sharedTemplates.set(templateId, template)

    return template
  }

  /**
   * Fork a shared template
   */
  async forkTemplate(
    templateId: string,
    newName: string,
    newAuthor: { id: string; name: string; avatar?: string }
  ): Promise<PromptTemplate | null> {
    const originalTemplate = this.sharedTemplates.get(templateId)
    if (!originalTemplate) return null

    // Create forked template
    const forkedTemplate: PromptTemplate = {
      ...originalTemplate,
      id: `fork_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      name: newName,
      version: '1.0.0',
      metadata: {
        ...originalTemplate.metadata,
        forkedFrom: {
          templateId: originalTemplate.id,
          author: originalTemplate.author,
          sharedAt: originalTemplate.sharedAt,
        },
      },
    }

    // Increment fork count
    originalTemplate.stats.forks++
    this.sharedTemplates.set(templateId, originalTemplate)

    return forkedTemplate
  }

  /**
   * Rate a template
   */
  async rateTemplate(
    templateId: string,
    rating: number,
    review?: string
  ): Promise<void> {
    const template = this.sharedTemplates.get(templateId)
    if (!template) return

    // Simple rating calculation (in real implementation, would aggregate all ratings)
    template.stats.rating = rating
    template.stats.reviews++

    this.sharedTemplates.set(templateId, template)
  }
}

/**
 * Template collection management
 */
export class TemplateCollectionManager {
  /**
   * Export templates to a collection
   */
  static exportCollection(
    templates: PromptTemplate[],
    metadata: {
      name: string
      description?: string
      author: { id: string; name: string }
      tags?: string[]
    }
  ): TemplateCollection {
    return {
      metadata: {
        ...metadata,
        createdAt: Date.now(),
        version: '1.0.0',
      },
      templates: templates.map(template => ({
        ...template,
        author: metadata.author,
        sharedAt: Date.now(),
        sharing: {
          isPublic: false,
          allowFork: true,
          requireAttribution: false,
        },
        stats: {
          downloads: 0,
          forks: 0,
          rating: 0,
          reviews: 0,
        },
        sharedVersion: template.version || '1.0.0',
      })),
      tags: metadata.tags || [],
    }
  }

  /**
   * Import templates from a collection
   */
  static importCollection(collection: TemplateCollection): PromptTemplate[] {
    return collection.templates.map(sharedTemplate => ({
      id: sharedTemplate.id,
      name: sharedTemplate.name,
      description: sharedTemplate.description,
      template: sharedTemplate.template,
      variables: sharedTemplate.variables,
      version: sharedTemplate.sharedVersion,
      tags: sharedTemplate.tags,
      metadata: sharedTemplate.metadata,
    }))
  }

  /**
   * Validate collection format
   */
  static validateCollection(data: any): data is TemplateCollection {
    return (
      data &&
      typeof data === 'object' &&
      data.metadata &&
      typeof data.metadata.name === 'string' &&
      Array.isArray(data.templates) &&
      Array.isArray(data.tags)
    )
  }
}

/**
 * Template synchronization for cross-device sharing
 */
export class TemplateSyncManager {
  private lastSyncTime = 0
  private syncQueue: Array<{ type: 'upload' | 'download'; data: any }> = []

  /**
   * Sync templates with remote service
   */
  async syncTemplates(
    localTemplates: PromptTemplate[],
    remoteService: {
      uploadTemplates: (templates: PromptTemplate[]) => Promise<void>
      downloadTemplates: (since?: number) => Promise<PromptTemplate[]>
      resolveConflicts: (conflicts: any[]) => Promise<PromptTemplate[]>
    }
  ): Promise<{
    uploaded: number
    downloaded: number
    conflicts: number
  }> {
    // Upload local changes
    const localChanges = localTemplates.filter(t =>
      t.metadata?.lastModified && t.metadata.lastModified > this.lastSyncTime
    )

    if (localChanges.length > 0) {
      await remoteService.uploadTemplates(localChanges)
    }

    // Download remote changes
    const remoteTemplates = await remoteService.downloadTemplates(this.lastSyncTime)

    // Check for conflicts (same template modified in both places)
    const conflicts = this.findConflicts(localTemplates, remoteTemplates)

    let resolvedTemplates: PromptTemplate[] = []
    if (conflicts.length > 0) {
      resolvedTemplates = await remoteService.resolveConflicts(conflicts)
    }

    // Update sync time
    this.lastSyncTime = Date.now()

    return {
      uploaded: localChanges.length,
      downloaded: remoteTemplates.length,
      conflicts: conflicts.length,
    }
  }

  private findConflicts(
    local: PromptTemplate[],
    remote: PromptTemplate[]
  ): Array<{ local: PromptTemplate; remote: PromptTemplate }> {
    const conflicts: Array<{ local: PromptTemplate; remote: PromptTemplate }> = []

    for (const remoteTemplate of remote) {
      const localTemplate = local.find(t => t.id === remoteTemplate.id)
      if (localTemplate) {
        const localModified = localTemplate.metadata?.lastModified || 0
        const remoteModified = remoteTemplate.metadata?.lastModified || 0

        // Both modified since last sync
        if (localModified > this.lastSyncTime && remoteModified > this.lastSyncTime) {
          conflicts.push({ local: localTemplate, remote: remoteTemplate })
        }
      }
    }

    return conflicts
  }
}

// Global instances for easy access
export const templateMarketplace = new TemplateMarketplace()
export const templateSyncManager = new TemplateSyncManager()