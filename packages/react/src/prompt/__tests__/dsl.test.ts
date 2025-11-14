/**
 * Tests for Prompt DSL (toon)
 */

import { describe, it, expect } from 'vitest'
import {
  createPromptRecipe,
  createSimpleRecipe,
  composeRecipes,
} from '../core/dsl'

describe('Prompt DSL', () => {
  describe('createPromptRecipe', () => {
    it('should create a recipe from a template', () => {
      const recipe = createPromptRecipe({
        id: 'test',
        name: 'Test Recipe',
        system: 'You are {{name}}.',
        user: '{{message}}',
        variables: [
          { name: 'name', required: true },
          { name: 'message', required: true },
        ],
      })

      expect(recipe).toBeDefined()
      expect(recipe.getVariables().length).toBe(2)
    })

    it('should build a prompt with variables', () => {
      const recipe = createPromptRecipe({
        id: 'test',
        name: 'Test',
        system: 'You are {{name}}.',
        user: '{{message}}',
        variables: [
          { name: 'name', required: true },
          { name: 'message', required: true },
        ],
      })

      const prompt = recipe.build({
        name: 'Clarity',
        message: 'Hello!',
      })

      expect(prompt.messages.length).toBeGreaterThan(0)
      expect(prompt.system).toContain('Clarity')
      expect(prompt.user).toBe('Hello!')
    })

    it('should use default values for optional variables', () => {
      const recipe = createPromptRecipe({
        id: 'test',
        name: 'Test',
        system: 'You are {{name}}.',
        variables: [
          { name: 'name', defaultValue: 'Assistant' },
        ],
      })

      const prompt = recipe.build({})
      expect(prompt.system).toContain('Assistant')
    })

    it('should throw error for missing required variables', () => {
      const recipe = createPromptRecipe({
        id: 'test',
        name: 'Test',
        system: 'You are {{name}}.',
        variables: [
          { name: 'name', required: true },
        ],
      })

      expect(() => {
        recipe.build({})
      }).toThrow()
    })
  })

  describe('createSimpleRecipe', () => {
    it('should create a simple recipe', () => {
      const recipe = createSimpleRecipe(
        'You are helpful.',
        '{{message}}'
      )

      const prompt = recipe.build({ message: 'Hello!' })
      expect(prompt.system).toBe('You are helpful.')
      expect(prompt.user).toBe('Hello!')
    })
  })

  describe('composeRecipes', () => {
    it('should compose multiple recipes', () => {
      const recipe1 = createSimpleRecipe('You are helpful.', '{{msg1}}')
      const recipe2 = createSimpleRecipe('You are smart.', '{{msg2}}')

      const composed = composeRecipes([recipe1, recipe2])
      const prompt = composed.build({ msg1: 'Hello', msg2: 'World' })

      // Should merge system prompts
      expect(prompt.system).toContain('helpful')
      expect(prompt.system).toContain('smart')
    })
  })

  describe('Variable substitution', () => {
    it('should replace variables in templates', () => {
      const recipe = createPromptRecipe({
        id: 'test',
        name: 'Test',
        system: 'Hello {{name}}, you are {{age}} years old.',
        variables: [
          { name: 'name', required: true },
          { name: 'age', required: true },
        ],
      })

      const prompt = recipe.build({ name: 'Alice', age: '25' })
      expect(prompt.system).toContain('Alice')
      expect(prompt.system).toContain('25')
    })
  })
})
