/**
 * Prompt Manager
 *
 * This module provides a centralized manager for creating, saving,
 * versioning, and running prompts. It is designed to be the core
 * of the prompt management system in Clarity Chat.
 *
 * @packageDocumentation
 */
import {
  PromptTemplate,
  PromptVersion,
  PromptVariable,
  RenderPromptOptions,
  PromptRenderResult,
  PromptTemplateEngine,
} from '../prompts'

/**
 * A managed prompt that extends the basic PromptTemplate with versioning
 * and other management-related properties.
 */
export interface ManagedPrompt extends PromptTemplate {
  /** When the prompt was created */
  createdAt: Date
  /** When the prompt was last updated */
  updatedAt: Date
  /** All versions of the prompt */
  versions: PromptVersion[]
}

/**
 * The PromptManager class provides a centralized API for all
 * prompt-related operations.
 */
export class PromptManager {
  private prompts: Map<string, ManagedPrompt> = new Map()
  private engine: PromptTemplateEngine = new PromptTemplateEngine()

  constructor() {
    // TODO: Load prompts from a persistent storage (e.g., localStorage)
  }

  /**
   * Creates a new managed prompt from a template.
   * @param template - The prompt template to create the prompt from.
   * @returns The newly created managed prompt.
   */
  createPrompt(template: Omit<PromptTemplate, 'id'>): ManagedPrompt {
    const now = new Date()
    const id = crypto.randomUUID()
    const newPrompt: ManagedPrompt = {
      ...template,
      id,
      createdAt: now,
      updatedAt: now,
      versions: [
        {
          id: crypto.randomUUID(),
          templateId: id,
          version: '1.0.0',
          template: template.template,
          createdAt: now.getTime(),
          isActive: true,
        },
      ],
    }
    this.savePrompt(newPrompt)
    return newPrompt
  }

  /**
   * Saves a prompt to the manager.
   * @param prompt - The prompt to save.
   */
  savePrompt(prompt: ManagedPrompt): void {
    prompt.updatedAt = new Date()
    this.prompts.set(prompt.id, prompt)
  }

  /**
   * Retrieves a prompt by its ID.
   * @param id - The ID of the prompt to retrieve.
   * @returns The managed prompt, or undefined if not found.
   */
  getPrompt(id: string): ManagedPrompt | undefined {
    return this.prompts.get(id)
  }

  /**
   * Retrieves all prompts from the manager.
   * @returns An array of all managed prompts.
   */
  getPrompts(): ManagedPrompt[] {
    return Array.from(this.prompts.values())
  }

  /**
   * Deletes a prompt from the manager.
   * @param promptId - The ID of the prompt to delete.
   */
  deletePrompt(promptId: string): void {
    this.prompts.delete(promptId)
  }

  /**
   * Creates a new version of a prompt.
   * @param promptId - The ID of the prompt to version.
   * @returns The updated managed prompt with the new version.
   */
  versionPrompt(promptId: string, newTemplate: string): ManagedPrompt {
    const prompt = this.getPrompt(promptId)
    if (!prompt) {
      throw new Error(`Prompt with id "${promptId}" not found.`)
    }

    const latestVersion = prompt.versions.sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : 1
    )[0]
    const [major, minor] = latestVersion.version.split('.').map(Number)
    const newVersionString = `${major}.${minor + 1}.0`

    const newVersion: PromptVersion = {
      id: crypto.randomUUID(),
      templateId: promptId,
      version: newVersionString,
      template: newTemplate,
      createdAt: new Date().getTime(),
      isActive: true,
    }

    // Deactivate old versions
    prompt.versions.forEach((v) => (v.isActive = false))

    prompt.versions.push(newVersion)
    prompt.template = newTemplate // Update the prompt's main template
    this.savePrompt(prompt)
    return prompt
  }

  /**
   * Runs a prompt with the given variables.
   * @param prompt - The prompt to run.
   * @param variables - The variables to substitute into the prompt.
   * @returns The result of the prompt rendering.
   */
  runPrompt(
    prompt: ManagedPrompt,
    variables: Record<string, any>
  ): PromptRenderResult {
    const activeVersion = prompt.versions.find((v) => v.isActive)
    if (!activeVersion) {
      throw new Error(`No active version found for prompt "${prompt.id}".`)
    }

    return this.engine.render(activeVersion.template, {
      variables,
      validate: true,
    })
  }
}
