# Architect Framework

> **Principal Software Architect & Engineering Lead** - A comprehensive AI prompt engineering framework for software quality, refactoring, and architectural integrity.

## Overview

The Architect Framework provides a structured 4-phase approach to AI-assisted software engineering, implementing the "Master System Prompt" methodology for production-grade code generation.

## The 4-Phase Workflow

### Phase 1: Analysis & Audit (The "Auditor")

Before any code is written, the framework performs comprehensive analysis:

- **Context Gathering**: Identify missing information and ask clarifying questions
- **Security Scan**: OWASP Top 10 vulnerability detection
- **Code Smell Detection**: Anti-pattern identification
- **Technical Debt Assessment**: Classify debt types and impact

```typescript
import {
  createAuditResult,
  createSecurityFinding,
  createCodeSmellFinding,
  OWASP_VULNERABILITIES,
  CODE_SMELL_PATTERNS
} from '@clarity-chat/react/prompt/architect'

// Create an audit result
const audit = createAuditResult({
  securityFindings: [
    createSecurityFinding(
      'A03_INJECTION',
      'high',
      'SQL injection vulnerability in user input',
      'Use parameterized queries'
    )
  ],
  codeSmells: [
    createCodeSmellFinding(
      'HIGH_CYCLOMATIC_COMPLEXITY',
      'medium',
      'Function has 15 decision points',
      'Extract methods to reduce complexity'
    )
  ]
})
```

### Phase 2: Strategic Planning (The "Architect")

Design the solution before implementation:

- **Chain of Thought**: Structured reasoning process
- **Step-by-Step Plan**: Atomic, verifiable steps
- **Design Patterns**: Pattern recommendations with trade-offs
- **Test Strategy**: Verification approach

```typescript
import {
  createStrategicPlan,
  createPlanningStep,
  createPatternRecommendation,
  suggestPatternsForUseCase,
  DESIGN_PATTERN_CATALOG
} from '@clarity-chat/react/prompt/architect'

// Get pattern suggestions
const patterns = suggestPatternsForUseCase('object creation with validation')

// Create a strategic plan
const plan = createStrategicPlan({
  chainOfThought: `
    Understanding: Need to create validated objects
    Approach: Use Builder pattern for step-by-step construction
    Validation: Add validation in the build() method
  `,
  steps: [
    createPlanningStep({
      stepNumber: 1,
      title: 'Create Builder class',
      description: 'Implement fluent builder with validation',
      expectedOutcome: 'Type-safe builder with validation',
      complexity: 'moderate'
    })
  ],
  patternRecommendations: [
    createPatternRecommendation(
      'BUILDER',
      'Allows step-by-step construction with validation at each step'
    )
  ]
})
```

### Phase 3: Implementation (The "Crafter")

Execute with strict adherence to quality standards:

- **Style Guide**: Language-specific conventions
- **Documentation**: JSDoc/docstring requirements
- **Boy Scout Rule**: Leave code cleaner than you found it

```typescript
import {
  getStyleGuidePreset,
  STYLE_GUIDE_PRESETS,
  generateDocTemplate,
  validateAgainstStyleGuide
} from '@clarity-chat/react/prompt/architect'

// Get TypeScript/Airbnb style guide
const styleGuide = getStyleGuidePreset('typescript', 'airbnb')

// Generate documentation template
const docTemplate = generateDocTemplate('typescript', {
  name: 'validateUser',
  description: 'Validates user input against schema',
  params: [
    { name: 'user', type: 'UserInput', description: 'The user input to validate' }
  ],
  returnType: 'ValidationResult',
  returnDescription: 'Validation result with errors if any'
})

// Validate code against style guide
const issues = validateAgainstStyleGuide(code, styleGuide)
```

### Phase 4: Review & Reflection (The "Mentor")

Self-review and continuous improvement:

- **Self-Correction**: Constraint verification checklist
- **DRY Analysis**: Duplication detection
- **Security Re-verification**: Final security check
- **ADR Generation**: Document significant decisions

```typescript
import {
  createReviewResult,
  createDRYCheckResult,
  createADR,
  formatADRAsMarkdown,
  STANDARD_CONSTRAINTS
} from '@clarity-chat/react/prompt/architect'

// Create review result
const review = createReviewResult({
  selfCorrections: STANDARD_CONSTRAINTS.map(constraint => ({
    constraint,
    passed: true
  })),
  dryCheck: createDRYCheckResult({ isDRY: true }),
  securityRecheck: [],
  adr: createADR({
    title: 'Use Builder Pattern for User Creation',
    context: 'Need validated object construction',
    decision: 'Implement Builder pattern with validation',
    consequences: {
      positive: ['Type-safe construction', 'Clear validation flow'],
      negative: ['More classes to maintain']
    }
  })
})
```

## React Hooks

### useArchitectWorkflow

Manage the complete 4-phase workflow:

```typescript
import { useArchitectWorkflow } from '@clarity-chat/react/prompt/architect'

function MyComponent() {
  const workflow = useArchitectWorkflow({
    onPhaseComplete: (phase, result) => {
      console.log(`Completed ${phase}`)
    },
    onWorkflowComplete: (state) => {
      console.log('All phases complete!')
    }
  })

  return (
    <div>
      <p>Phase: {workflow.state.currentPhase}</p>
      <p>Progress: {workflow.progress}%</p>
      <button onClick={() => workflow.completeAudit(auditResult)}>
        Complete Audit
      </button>
    </div>
  )
}
```

### useSecurityAudit

Perform security audits:

```typescript
import { useSecurityAudit } from '@clarity-chat/react/prompt/architect'

function SecurityPanel() {
  const audit = useSecurityAudit({
    onFindingDetected: (finding) => {
      console.log('Found:', finding.type)
    }
  })

  return (
    <div>
      <button onClick={audit.startAudit}>Start Audit</button>
      <p>Risk Score: {audit.state.riskScore}</p>
      <p>Critical Findings: {audit.severityCounts.critical}</p>
    </div>
  )
}
```

### useDesignPatterns

Work with design patterns:

```typescript
import { useDesignPatterns } from '@clarity-chat/react/prompt/architect'

function PatternSelector() {
  const patterns = useDesignPatterns()

  // Get suggestions for a use case
  const suggestions = patterns.suggestPatterns('event handling')

  return (
    <div>
      {patterns.filteredPatterns.map(pattern => (
        <button
          key={pattern}
          onClick={() => patterns.togglePattern(pattern)}
        >
          {pattern} {patterns.isSelected(pattern) ? '✓' : ''}
        </button>
      ))}
    </div>
  )
}
```

## Pre-built Recipes

### Master Architect Recipe

The complete system prompt for production-grade software engineering:

```typescript
import { MASTER_ARCHITECT_RECIPE } from '@clarity-chat/react/prompt'
import { usePromptRecipe } from '@clarity-chat/react/prompt/hooks'

const { messages } = usePromptRecipe(MASTER_ARCHITECT_RECIPE)
```

### Specialized Recipes

- **SECURITY_AUDITOR_RECIPE**: Security-focused code review
- **REFACTORING_SPECIALIST_RECIPE**: Code quality and refactoring
- **ARCHITECTURE_REVIEWER_RECIPE**: System design and patterns
- **TEST_ENGINEER_RECIPE**: Testing strategy and coverage

```typescript
import {
  SECURITY_AUDITOR_RECIPE,
  REFACTORING_SPECIALIST_RECIPE,
  ARCHITECTURE_REVIEWER_RECIPE,
  TEST_ENGINEER_RECIPE
} from '@clarity-chat/react/prompt'
```

## Design Pattern Catalog

Complete catalog of 23 GoF patterns with:
- Intent and use cases
- Trade-offs (pros/cons)
- Implementation examples

```typescript
import { DESIGN_PATTERN_CATALOG } from '@clarity-chat/react/prompt/architect'

// Get pattern info
const factoryInfo = DESIGN_PATTERN_CATALOG.FACTORY_METHOD
console.log(factoryInfo.intent)
console.log(factoryInfo.useCases)
console.log(factoryInfo.tradeoffs)
```

## OWASP Top 10 Reference

Built-in OWASP Top 10 vulnerability definitions:

```typescript
import { OWASP_VULNERABILITIES } from '@clarity-chat/react/prompt/architect'

const injection = OWASP_VULNERABILITIES.A03_INJECTION
console.log(injection.name)           // 'Injection'
console.log(injection.patterns)       // Detection patterns
console.log(injection.recommendations) // Remediation steps
```

## Code Smell Patterns

23 code smell definitions from Martin Fowler's refactoring catalog:

```typescript
import { CODE_SMELL_PATTERNS } from '@clarity-chat/react/prompt/architect'

const godObject = CODE_SMELL_PATTERNS.GOD_OBJECT
console.log(godObject.indicators)     // How to detect
console.log(godObject.refactoring)    // How to fix
```

## Output Formatting

Generate structured output blocks:

```typescript
import {
  generatePlanningBlockTemplate,
  generateCodeBlockTemplate,
  generateReviewBlockTemplate
} from '@clarity-chat/react/prompt/architect'

// <PLANNING>...</PLANNING>
const planningBlock = generatePlanningBlockTemplate()

// <CODE>...</CODE>
const codeBlock = generateCodeBlockTemplate('typescript')

// <REVIEW>...</REVIEW>
const reviewBlock = generateReviewBlockTemplate()
```

## TypeScript Support

Full TypeScript support with comprehensive types:

```typescript
import type {
  // Workflow types
  ArchitectPhase,
  ArchitectWorkflowState,
  ArchitectConfig,

  // Audit types
  AuditResult,
  SecurityFinding,
  CodeSmellFinding,
  TechnicalDebtItem,
  OWASPVulnerability,
  CodeSmellType,

  // Planning types
  StrategicPlan,
  PlanningStep,
  PatternRecommendation,
  DesignPattern,
  DesignPatternCategory,

  // Implementation types
  StyleGuideRules,
  DocumentationRequirements,
  ImplementationOutput,

  // Review types
  ReviewResult,
  ArchitectureDecisionRecord,
  DRYCheckResult
} from '@clarity-chat/react/prompt/architect'
```

## Configuration

Customize the architect behavior:

```typescript
import {
  DEFAULT_ARCHITECT_CONFIG,
  useArchitectWorkflow
} from '@clarity-chat/react/prompt/architect'

const workflow = useArchitectWorkflow({
  config: {
    styleGuide: {
      language: 'typescript',
      styleGuide: 'google',
      preferImmutability: true,
      strictTyping: true
    },
    documentation: {
      requirePublicDocs: true,
      requireParamDocs: true
    },
    enableSecurityScan: true,
    enableCodeSmellDetection: true,
    strictMode: false
  }
})
```

## Best Practices

1. **Always start with audit**: Understand context before planning
2. **Use chain of thought**: Let the AI reason through the problem
3. **Recommend patterns**: Suggest patterns but explain trade-offs
4. **Test strategy first**: Define how code will be verified
5. **Boy Scout Rule**: Always leave code cleaner
6. **Document decisions**: Create ADRs for significant choices
7. **Self-review**: Always verify against constraints

## License

MIT © Clarity Chat
