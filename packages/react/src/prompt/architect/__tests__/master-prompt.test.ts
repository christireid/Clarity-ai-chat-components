/**
 * Tests for Master Prompt utilities
 */

import { describe, it, expect } from 'vitest'
import {
  buildMasterSystemPrompt,
  renderMasterSystemPrompt,
  buildIdentitySection,
  buildPhase1AuditSection,
  buildPhase2PlanningSection,
  buildPhase3ImplementationSection,
  buildPhase4ReviewSection,
  buildConstraintsSection,
  buildOutputFormattingSection,
  MASTER_ARCHITECT_RECIPE,
  SECURITY_AUDITOR_RECIPE,
  REFACTORING_SPECIALIST_RECIPE,
  ARCHITECTURE_REVIEWER_RECIPE,
  TEST_ENGINEER_RECIPE,
  ARCHITECT_RECIPES,
  getArchitectRecipe,
} from '../master-prompt'
import { toon } from '../../core/toon'

describe('Master Prompt', () => {
  describe('buildIdentitySection', () => {
    it('should build identity section with core values', () => {
      const builder = toon()
      buildIdentitySection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)

      const text = nodes
        .filter((n) => n.type === 'text' || n.type === 'section')
        .map((n) => {
          if (n.type === 'text') return n.content
          if (n.type === 'section') return n.title
          return ''
        })
        .join(' ')

      expect(text).toContain('IDENTITY')
      expect(text).toContain('Clean Code')
      expect(text).toContain('Security')
    })
  })

  describe('buildPhase1AuditSection', () => {
    it('should build audit section with OWASP references', () => {
      const builder = toon()
      buildPhase1AuditSection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)

      // Check that it includes key audit concepts
      const hasAuditContent = nodes.some((n) => {
        if (n.type === 'section') {
          return n.title?.includes('AUDIT') || n.title?.includes('Auditor')
        }
        return false
      })
      expect(hasAuditContent).toBe(true)
    })
  })

  describe('buildPhase2PlanningSection', () => {
    it('should build planning section with chain of thought', () => {
      const builder = toon()
      buildPhase2PlanningSection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)
    })
  })

  describe('buildPhase3ImplementationSection', () => {
    it('should build implementation section with style guide', () => {
      const builder = toon()
      buildPhase3ImplementationSection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)
    })

    it('should accept custom config', () => {
      const builder = toon()
      buildPhase3ImplementationSection(builder, {
        styleGuide: {
          language: 'python',
          styleGuide: 'google',
          naming: {
            variables: 'snake_case',
            functions: 'snake_case',
            classes: 'PascalCase',
            constants: 'SCREAMING_SNAKE_CASE',
            files: 'snake_case',
          },
          preferImmutability: false,
          strictTyping: true,
          indentation: 'spaces',
          indentSize: 4,
        },
      })
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)
    })
  })

  describe('buildPhase4ReviewSection', () => {
    it('should build review section with ADR guidance', () => {
      const builder = toon()
      buildPhase4ReviewSection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)
    })
  })

  describe('buildConstraintsSection', () => {
    it('should build constraints with security rules', () => {
      const builder = toon()
      buildConstraintsSection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)
    })
  })

  describe('buildOutputFormattingSection', () => {
    it('should build formatting section with XML tags', () => {
      const builder = toon()
      buildOutputFormattingSection(builder)
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(0)
    })
  })

  describe('buildMasterSystemPrompt', () => {
    it('should build complete master prompt', () => {
      const builder = buildMasterSystemPrompt()
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(10)
    })

    it('should accept custom config', () => {
      const builder = buildMasterSystemPrompt({
        styleGuide: {
          language: 'rust',
          styleGuide: 'custom',
          naming: {
            variables: 'snake_case',
            functions: 'snake_case',
            classes: 'PascalCase',
            constants: 'SCREAMING_SNAKE_CASE',
            files: 'snake_case',
          },
          preferImmutability: true,
          strictTyping: true,
          indentation: 'spaces',
          indentSize: 4,
        },
      })
      const nodes = builder.build()

      expect(nodes.length).toBeGreaterThan(10)
    })
  })

  describe('renderMasterSystemPrompt', () => {
    it('should render prompt as string', () => {
      const rendered = renderMasterSystemPrompt()

      expect(typeof rendered).toBe('string')
      expect(rendered.length).toBeGreaterThan(1000)
      expect(rendered).toContain('PRINCIPAL SOFTWARE ARCHITECT')
      expect(rendered).toContain('PHASE 1')
      expect(rendered).toContain('PHASE 2')
      expect(rendered).toContain('PHASE 3')
      expect(rendered).toContain('PHASE 4')
    })

    it('should include all key sections', () => {
      const rendered = renderMasterSystemPrompt()

      expect(rendered).toContain('IDENTITY')
      expect(rendered).toContain('AUDIT')
      expect(rendered).toContain('PLANNING')
      expect(rendered).toContain('IMPLEMENTATION')
      expect(rendered).toContain('REVIEW')
      expect(rendered).toContain('CONSTRAINTS')
    })
  })

  describe('Pre-built Recipes', () => {
    describe('MASTER_ARCHITECT_RECIPE', () => {
      it('should have correct structure', () => {
        expect(MASTER_ARCHITECT_RECIPE.name).toBe('master-architect')
        expect(MASTER_ARCHITECT_RECIPE.description).toBeTruthy()
        expect(MASTER_ARCHITECT_RECIPE.systemPrompt).toBeTruthy()
        expect(typeof MASTER_ARCHITECT_RECIPE.systemPrompt).toBe('string')
      })

      it('should have metadata', () => {
        expect(MASTER_ARCHITECT_RECIPE.metadata?.author).toBe('Clarity Chat')
        expect(MASTER_ARCHITECT_RECIPE.metadata?.version).toBe('1.0.0')
        expect(MASTER_ARCHITECT_RECIPE.metadata?.tags).toContain('architect')
      })
    })

    describe('SECURITY_AUDITOR_RECIPE', () => {
      it('should focus on security', () => {
        expect(SECURITY_AUDITOR_RECIPE.name).toBe('security-auditor')
        expect(SECURITY_AUDITOR_RECIPE.systemPrompt).toContain('OWASP')
        expect(SECURITY_AUDITOR_RECIPE.metadata?.tags).toContain('security')
      })
    })

    describe('REFACTORING_SPECIALIST_RECIPE', () => {
      it('should focus on refactoring', () => {
        expect(REFACTORING_SPECIALIST_RECIPE.name).toBe('refactoring-specialist')
        expect(REFACTORING_SPECIALIST_RECIPE.systemPrompt).toContain('Martin Fowler')
        expect(REFACTORING_SPECIALIST_RECIPE.metadata?.tags).toContain('refactoring')
      })
    })

    describe('ARCHITECTURE_REVIEWER_RECIPE', () => {
      it('should focus on architecture', () => {
        expect(ARCHITECTURE_REVIEWER_RECIPE.name).toBe('architecture-reviewer')
        expect(ARCHITECTURE_REVIEWER_RECIPE.systemPrompt).toContain('SOLID')
        expect(ARCHITECTURE_REVIEWER_RECIPE.metadata?.tags).toContain('architecture')
      })
    })

    describe('TEST_ENGINEER_RECIPE', () => {
      it('should focus on testing', () => {
        expect(TEST_ENGINEER_RECIPE.name).toBe('test-engineer')
        expect(TEST_ENGINEER_RECIPE.systemPrompt).toContain('Testing Pyramid')
        expect(TEST_ENGINEER_RECIPE.metadata?.tags).toContain('testing')
      })
    })
  })

  describe('ARCHITECT_RECIPES', () => {
    it('should contain all recipes', () => {
      expect(ARCHITECT_RECIPES.masterArchitect).toBe(MASTER_ARCHITECT_RECIPE)
      expect(ARCHITECT_RECIPES.securityAuditor).toBe(SECURITY_AUDITOR_RECIPE)
      expect(ARCHITECT_RECIPES.refactoringSpecialist).toBe(REFACTORING_SPECIALIST_RECIPE)
      expect(ARCHITECT_RECIPES.architectureReviewer).toBe(ARCHITECTURE_REVIEWER_RECIPE)
      expect(ARCHITECT_RECIPES.testEngineer).toBe(TEST_ENGINEER_RECIPE)
    })
  })

  describe('getArchitectRecipe', () => {
    it('should return recipe by name', () => {
      expect(getArchitectRecipe('masterArchitect')).toBe(MASTER_ARCHITECT_RECIPE)
      expect(getArchitectRecipe('securityAuditor')).toBe(SECURITY_AUDITOR_RECIPE)
    })
  })
})
