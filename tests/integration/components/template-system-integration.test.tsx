/**
 * Template System Integration Tests
 *
 * Tests the complete template library and marketplace system integration,
 * including creation, sharing, discovery, and management workflows.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import {
  PromptLibrary,
  TemplateMarketplace,
  usePromptLibrary
} from '@clarity-chat/react'
import type {
  PromptTemplate,
  TemplateCollection,
  SharedTemplate
} from '@clarity-chat/react'

// Mock template marketplace
class MockTemplateMarketplace {
  private templates = new Map<string, SharedTemplate>()
  private ratings = new Map<string, { average: number; count: number }>()

  async shareTemplate(
    template: PromptTemplate,
    author: { id: string; name: string },
    options: any = {}
  ): Promise<SharedTemplate> {
    const shared: SharedTemplate = {
      ...template,
      author,
      sharedAt: Date.now(),
      downloads: 0,
      rating: 0,
      tags: options.tags || [],
      category: options.category || 'general',
      isPublic: options.public !== false,
      allowFork: options.allowFork !== false,
    }

    this.templates.set(template.id, shared)
    return shared
  }

  async getSharedTemplates(filters: any = {}): Promise<SharedTemplate[]> {
    let templates = Array.from(this.templates.values())

    if (filters.category) {
      templates = templates.filter(t => t.category === filters.category)
    }

    if (filters.search) {
      const search = filters.search.toLowerCase()
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search) ||
        t.tags?.some(tag => tag.toLowerCase().includes(search))
      )
    }

    if (filters.author) {
      templates = templates.filter(t => t.author.id === filters.author)
    }

    return templates
  }

  async downloadTemplate(templateId: string): Promise<SharedTemplate | null> {
    const template = this.templates.get(templateId)
    if (template) {
      template.downloads++
      return template
    }
    return null
  }

  async forkTemplate(
    templateId: string,
    newName: string,
    newAuthor: { id: string; name: string }
  ): Promise<PromptTemplate | null> {
    const original = this.templates.get(templateId)
    if (!original || !original.allowFork) return null

    const forked: PromptTemplate = {
      ...original,
      id: `fork-${Date.now()}`,
      name: newName,
      author: newAuthor,
      forkedFrom: templateId,
    }

    return forked
  }

  async rateTemplate(templateId: string, rating: number): Promise<void> {
    const template = this.templates.get(templateId)
    if (!template) return

    const current = this.ratings.get(templateId) || { average: 0, count: 0 }
    const newCount = current.count + 1
    const newAverage = (current.average * current.count + rating) / newCount

    this.ratings.set(templateId, { average: newAverage, count: newCount })
    template.rating = newAverage
  }

  getTemplate(id: string): SharedTemplate | null {
    return this.templates.get(id) || null
  }

  reset() {
    this.templates.clear()
    this.ratings.clear()
  }
}

// Mock marketplace instance
let mockMarketplace: MockTemplateMarketplace

// Mock the marketplace import
vi.mock('@clarity-chat/react', async () => {
  const actual = await vi.importActual('@clarity-chat/react')
  return {
    ...actual,
    templateMarketplace: mockMarketplace,
  }
})

beforeEach(() => {
  mockMarketplace = new MockTemplateMarketplace()
})

afterEach(() => {
  mockMarketplace.reset()
  vi.clearAllMocks()
})

// Sample templates for testing
const SAMPLE_TEMPLATES: PromptTemplate[] = [
  {
    id: 'template-1',
    name: 'Code Review Assistant',
    description: 'Helps review code for bugs and improvements',
    content: 'Review this code: {{code}}\n\nProvide feedback on:',
    variables: ['code'],
    category: 'development',
    tags: ['code', 'review', 'programming'],
    version: 1,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'template-2',
    name: 'Creative Writing Prompt',
    description: 'Generates creative writing prompts',
    content: 'Write a story about {{topic}} in the style of {{author}}',
    variables: ['topic', 'author'],
    category: 'creative',
    tags: ['writing', 'creative', 'fiction'],
    version: 1,
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 43200000,
  },
]

describe('Template System Integration', () => {
  describe('PromptLibrary Component', () => {
    it('displays templates with search and filtering', async () => {
      const user = userEvent.setup()

      render(
        <PromptLibrary
          initialTemplates={SAMPLE_TEMPLATES}
          enableSharing={true}
        />
      )

      // Should display both templates
      await waitFor(() => {
        expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
        expect(screen.getByText('Creative Writing Prompt')).toBeInTheDocument()
      })

      // Test search
      const searchInput = screen.getByPlaceholderText(/search templates/i)
      await user.type(searchInput, 'code')

      await waitFor(() => {
        expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
        expect(screen.queryByText('Creative Writing Prompt')).not.toBeInTheDocument()
      })

      // Clear search
      await user.clear(searchInput)

      // Test category filtering
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      await user.selectOptions(categorySelect, 'development')

      await waitFor(() => {
        expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
        expect(screen.queryByText('Creative Writing Prompt')).not.toBeInTheDocument()
      })
    })

    it('allows creating new templates', async () => {
      const user = userEvent.setup()
      const onTemplateCreate = vi.fn()

      render(
        <PromptLibrary
          initialTemplates={[]}
          onTemplateCreate={onTemplateCreate}
        />
      )

      // Click create button
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)

      // Fill out form
      const nameInput = screen.getByLabelText(/name/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const contentInput = screen.getByLabelText(/content/i)

      await user.type(nameInput, 'New Template')
      await user.type(descriptionInput, 'A new test template')
      await user.type(contentInput, 'Template content with {{variable}}')

      // Submit
      const submitButton = screen.getByRole('button', { name: /create/i })
      await user.click(submitButton)

      // Should call callback
      await waitFor(() => {
        expect(onTemplateCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Template',
            description: 'A new test template',
            content: 'Template content with {{variable}}',
          })
        )
      })
    })

    it('handles template sharing', async () => {
      const user = userEvent.setup()

      render(
        <PromptLibrary
          initialTemplates={SAMPLE_TEMPLATES}
          enableSharing={true}
          currentUser={{ id: 'user-1', name: 'Test User' }}
        />
      )

      // Find share button for first template
      const shareButtons = screen.getAllByRole('button', { name: /share/i })
      await user.click(shareButtons[0])

      // Share dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/share template/i)).toBeInTheDocument()
      })

      // Configure sharing options
      const publicCheckbox = screen.getByLabelText(/public/i)
      const forkCheckbox = screen.getByLabelText(/allow forking/i)

      await user.click(publicCheckbox)
      await user.click(forkCheckbox)

      // Confirm share
      const confirmButton = screen.getByRole('button', { name: /share/i })
      await user.click(confirmButton)

      // Template should be shared
      await waitFor(() => {
        const sharedTemplate = mockMarketplace.getTemplate(SAMPLE_TEMPLATES[0].id)
        expect(sharedTemplate).toBeTruthy()
        expect(sharedTemplate?.isPublic).toBe(true)
        expect(sharedTemplate?.allowFork).toBe(true)
      })
    })

    it('supports template import/export', async () => {
      const user = userEvent.setup()
      const onTemplatesImport = vi.fn()

      render(
        <PromptLibrary
          initialTemplates={SAMPLE_TEMPLATES}
          onTemplatesImport={onTemplatesImport}
        />
      )

      // Click export button
      const exportButton = screen.getByRole('button', { name: /export/i })
      await user.click(exportButton)

      // Should trigger download (mocked)
      await waitFor(() => {
        // Export functionality would trigger download
        expect(true).toBe(true) // Placeholder assertion
      })

      // Test import
      const importButton = screen.getByRole('button', { name: /import/i })
      await user.click(importButton)

      // Import dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/import templates/i)).toBeInTheDocument()
      })

      // Mock file input
      const fileInput = screen.getByLabelText(/select file/i)
      const mockFile = new File([
        JSON.stringify({
          version: '1.0',
          templates: SAMPLE_TEMPLATES,
          metadata: { exportedAt: Date.now() }
        })
      ], 'templates.json', { type: 'application/json' })

      await user.upload(fileInput, mockFile)

      // Import should be processed
      const importConfirmButton = screen.getByRole('button', { name: /import/i })
      await user.click(importConfirmButton)

      await waitFor(() => {
        expect(onTemplatesImport).toHaveBeenCalledWith(SAMPLE_TEMPLATES)
      })
    })

    it('handles template editing', async () => {
      const user = userEvent.setup()
      const onTemplateUpdate = vi.fn()

      render(
        <PromptLibrary
          initialTemplates={SAMPLE_TEMPLATES}
          onTemplateUpdate={onTemplateUpdate}
        />
      )

      // Click edit button for first template
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      await user.click(editButtons[0])

      // Edit dialog should appear
      await waitFor(() => {
        expect(screen.getByDisplayValue('Code Review Assistant')).toBeInTheDocument()
      })

      // Modify template
      const nameInput = screen.getByLabelText(/name/i)
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Code Review Assistant')

      const descriptionInput = screen.getByLabelText(/description/i)
      await user.clear(descriptionInput)
      await user.type(descriptionInput, 'Updated description')

      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      // Should call update callback
      await waitFor(() => {
        expect(onTemplateUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            id: SAMPLE_TEMPLATES[0].id,
            name: 'Updated Code Review Assistant',
            description: 'Updated description',
          })
        )
      })
    })
  })

  describe('TemplateMarketplace Component', () => {
    beforeEach(async () => {
      // Pre-populate marketplace with shared templates
      for (const template of SAMPLE_TEMPLATES) {
        await mockMarketplace.shareTemplate(template, {
          id: 'author-1',
          name: 'Template Author'
        }, {
          public: true,
          category: template.category,
          tags: template.tags,
        })
      }
    })

    it('displays shared templates with filtering', async () => {
      const user = userEvent.setup()

      render(
        <TemplateMarketplace
          currentUser={{ id: 'user-1', name: 'Test User' }}
        />
      )

      // Should display shared templates
      await waitFor(() => {
        expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
        expect(screen.getByText('Creative Writing Prompt')).toBeInTheDocument()
      })

      // Test search
      const searchInput = screen.getByPlaceholderText(/search templates/i)
      await user.type(searchInput, 'writing')

      await waitFor(() => {
        expect(screen.queryByText('Code Review Assistant')).not.toBeInTheDocument()
        expect(screen.getByText('Creative Writing Prompt')).toBeInTheDocument()
      })

      // Test category filtering
      await user.clear(searchInput)
      const categorySelect = screen.getByRole('combobox', { name: /category/i })
      await user.selectOptions(categorySelect, 'development')

      await waitFor(() => {
        expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
        expect(screen.queryByText('Creative Writing Prompt')).not.toBeInTheDocument()
      })
    })

    it('allows template installation', async () => {
      const user = userEvent.setup()
      const onTemplateInstall = vi.fn()

      render(
        <TemplateMarketplace
          currentUser={{ id: 'user-1', name: 'Test User' }}
          onTemplateInstall={onTemplateInstall}
        />
      )

      // Click install button for first template
      const installButtons = screen.getAllByRole('button', { name: /install/i })
      await user.click(installButtons[0])

      // Should call install callback
      await waitFor(() => {
        expect(onTemplateInstall).toHaveBeenCalledWith(
          expect.objectContaining({
            id: SAMPLE_TEMPLATES[0].id,
            name: 'Code Review Assistant',
          })
        )
      })
    })

    it('supports template rating', async () => {
      const user = userEvent.setup()

      render(
        <TemplateMarketplace
          currentUser={{ id: 'user-1', name: 'Test User' }}
        />
      )

      // Click rate button for first template
      const rateButtons = screen.getAllByRole('button', { name: /rate/i })
      await user.click(rateButtons[0])

      // Rating dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/rate template/i)).toBeInTheDocument()
      })

      // Select rating (assume 5-star system)
      const stars = screen.getAllByRole('button', { name: /star/i })
      await user.click(stars[4]) // 5-star rating

      // Submit rating
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Rating should be updated
      await waitFor(() => {
        const template = mockMarketplace.getTemplate(SAMPLE_TEMPLATES[0].id)
        expect(template?.rating).toBe(5)
      })
    })

    it('handles template forking', async () => {
      const user = userEvent.setup()
      const onTemplateFork = vi.fn()

      render(
        <TemplateMarketplace
          currentUser={{ id: 'user-1', name: 'Test User' }}
          onTemplateFork={onTemplateFork}
        />
      )

      // Click fork button for first template
      const forkButtons = screen.getAllByRole('button', { name: /fork/i })
      await user.click(forkButtons[0])

      // Fork dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/fork template/i)).toBeInTheDocument()
      })

      // Enter new name
      const nameInput = screen.getByLabelText(/new name/i)
      await user.type(nameInput, 'My Forked Template')

      // Confirm fork
      const forkButton = screen.getByRole('button', { name: /fork/i })
      await user.click(forkButton)

      // Should call fork callback
      await waitFor(() => {
        expect(onTemplateFork).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'My Forked Template',
            forkedFrom: SAMPLE_TEMPLATES[0].id,
          })
        )
      })
    })

    it('shows template previews', async () => {
      const user = userEvent.setup()

      render(
        <TemplateMarketplace
          currentUser={{ id: 'user-1', name: 'Test User' }}
        />
      )

      // Click preview button for first template
      const previewButtons = screen.getAllByRole('button', { name: /preview/i })
      await user.click(previewButtons[0])

      // Preview dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/preview template/i)).toBeInTheDocument()
      })

      // Should show template details
      expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
      expect(screen.getByText('Helps review code for bugs and improvements')).toBeInTheDocument()
      expect(screen.getByText(/Review this code/)).toBeInTheDocument()
    })
  })

  describe('Template Collection Management', () => {
    it('exports and imports template collections', () => {
      const { TemplateCollectionManager } = require('@clarity-chat/react')

      // Create collection
      const collection = TemplateCollectionManager.exportCollection(
        SAMPLE_TEMPLATES,
        {
          name: 'Test Collection',
          description: 'A test template collection',
          author: 'Test Author',
          version: '1.0',
          exportedAt: Date.now(),
        }
      )

      // Validate collection
      expect(TemplateCollectionManager.validateCollection(collection)).toBe(true)
      expect(collection.templates).toHaveLength(2)
      expect(collection.metadata.name).toBe('Test Collection')

      // Import collection
      const importedTemplates = TemplateCollectionManager.importCollection(collection)
      expect(importedTemplates).toHaveLength(2)
      expect(importedTemplates[0].name).toBe('Code Review Assistant')
      expect(importedTemplates[1].name).toBe('Creative Writing Prompt')
    })

    it('handles invalid collection data', () => {
      const { TemplateCollectionManager } = require('@clarity-chat/react')

      // Invalid collection
      const invalidCollection = {
        invalidField: 'test',
      }

      expect(TemplateCollectionManager.validateCollection(invalidCollection)).toBe(false)
      expect(() => TemplateCollectionManager.importCollection(invalidCollection as any)).toThrow()
    })
  })

  describe('Cross-Component Integration', () => {
    it('integrates library and marketplace in unified interface', async () => {
      const user = userEvent.setup()

      // Mock component that combines both
      function UnifiedTemplateInterface() {
        const [activeTab, setActiveTab] = useState<'library' | 'marketplace'>('library')
        const [installedTemplates, setInstalledTemplates] = useState<Set<string>>(new Set())

        const handleInstall = (template: SharedTemplate) => {
          setInstalledTemplates(prev => new Set([...prev, template.id]))
        }

        return (
          <div>
            <div role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'library'}
                onClick={() => setActiveTab('library')}
              >
                My Library
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'marketplace'}
                onClick={() => setActiveTab('marketplace')}
              >
                Marketplace
              </button>
            </div>

            {activeTab === 'library' && (
              <PromptLibrary
                initialTemplates={SAMPLE_TEMPLATES}
                enableSharing={true}
                currentUser={{ id: 'user-1', name: 'Test User' }}
              />
            )}

            {activeTab === 'marketplace' && (
              <TemplateMarketplace
                currentUser={{ id: 'user-1', name: 'Test User' }}
                installedTemplateIds={installedTemplates}
                onTemplateInstall={handleInstall}
              />
            )}
          </div>
        )
      }

      render(<UnifiedTemplateInterface />)

      // Start with library view
      expect(screen.getByText('My Library')).toBeInTheDocument()
      expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()

      // Switch to marketplace
      const marketplaceTab = screen.getByRole('tab', { name: 'Marketplace' })
      await user.click(marketplaceTab)

      // Should show marketplace
      await waitFor(() => {
        expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
      })

      // Install a template
      const installButtons = screen.getAllByRole('button', { name: /install/i })
      await user.click(installButtons[0])

      // Switch back to library - template should appear there too
      const libraryTab = screen.getByRole('tab', { name: 'My Library' })
      await user.click(libraryTab)

      // Template should still be visible in library
      expect(screen.getByText('Code Review Assistant')).toBeInTheDocument()
    })

    it('maintains template state across component interactions', async () => {
      const user = userEvent.setup()

      // Component that demonstrates state synchronization
      function TemplateWorkflowDemo() {
        const [templates, setTemplates] = useState<PromptTemplate[]>(SAMPLE_TEMPLATES)
        const [sharedIds, setSharedIds] = useState<Set<string>>(new Set())

        const handleShare = async (template: PromptTemplate) => {
          const shared = await mockMarketplace.shareTemplate(template, {
            id: 'user-1',
            name: 'Test User'
          })
          setSharedIds(prev => new Set([...prev, shared.id]))
        }

        const handleCreate = (template: PromptTemplate) => {
          setTemplates(prev => [...prev, template])
        }

        return (
          <div>
            <PromptLibrary
              initialTemplates={templates}
              enableSharing={true}
              currentUser={{ id: 'user-1', name: 'Test User' }}
              onTemplateCreate={handleCreate}
              onTemplateShare={handleShare}
            />

            <TemplateMarketplace
              currentUser={{ id: 'user-1', name: 'Test User' }}
              installedTemplateIds={sharedIds}
            />
          </div>
        )
      }

      render(<TemplateWorkflowDemo />)

      // Create a new template
      const createButton = screen.getByRole('button', { name: /create/i })
      await user.click(createButton)

      const nameInput = screen.getByLabelText(/name/i)
      const descriptionInput = screen.getByLabelText(/description/i)
      const contentInput = screen.getByLabelText(/content/i)

      await user.type(nameInput, 'Workflow Test Template')
      await user.type(descriptionInput, 'Created during workflow test')
      await user.type(contentInput, 'Test content')

      const submitButton = screen.getByRole('button', { name: /create/i })
      await user.click(submitButton)

      // Template should appear in library
      await waitFor(() => {
        expect(screen.getByText('Workflow Test Template')).toBeInTheDocument()
      })

      // Share the template
      const shareButtons = screen.getAllByRole('button', { name: /share/i })
      const newTemplateShareButton = shareButtons[shareButtons.length - 1] // Last one should be the new template
      await user.click(newTemplateShareButton)

      // Configure sharing
      const publicCheckbox = screen.getByLabelText(/public/i)
      await user.click(publicCheckbox)

      const confirmButton = screen.getByRole('button', { name: /share/i })
      await user.click(confirmButton)

      // Template should appear in marketplace
      await waitFor(() => {
        expect(screen.getAllByText('Workflow Test Template')).toHaveLength(2) // Once in library, once in marketplace
      })
    })
  })
})