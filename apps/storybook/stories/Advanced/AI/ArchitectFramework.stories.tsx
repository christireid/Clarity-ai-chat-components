import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useMemo } from 'react'
import { Button, Card, Badge } from '@clarity-chat/primitives'
import {
  // Master prompt
  renderMasterSystemPrompt,
  MASTER_ARCHITECT_RECIPE,
  SECURITY_AUDITOR_RECIPE,
  REFACTORING_SPECIALIST_RECIPE,
  getArchitectRecipe,
  ARCHITECT_RECIPES,

  // Design patterns
  DESIGN_PATTERN_CATALOG,
  ALL_PATTERNS,
  getPatternById,
  getPatternsByCategory,
  getCreationalPatterns,
  getStructuralPatterns,
  getBehavioralPatterns,

  // Phase utilities
  OWASP_VULNERABILITIES,
  createSecurityFinding,
  createAuditResult,
  calculateRiskScore,
  createStrategicPlan,
  createReviewResult,

  // Hooks
  useArchitectWorkflow,
  useSecurityAudit,
  useDesignPatterns,

  // Types
  type DesignPattern,
  type DesignPatternCategory,
  type OWASPVulnerability,
  type SecurityFinding,
  type DebtSeverity,
} from '@clarity-chat/react/internal'

/**
 * **Architect Framework**
 *
 * A comprehensive prompt engineering framework implementing the
 * "Principal Software Architect & Engineering Lead" workflow.
 *
 * **4-Phase Approach:**
 * 1. Analysis & Audit - Security scanning, code smell detection
 * 2. Strategic Planning - Chain of thought, design patterns
 * 3. Implementation - Style guide adherence, Boy Scout Rule
 * 4. Review & Reflection - Self-correction, ADR generation
 *
 * **Key Features:**
 * - OWASP Top 10 security analysis
 * - 23 GoF design pattern catalog
 * - Technical debt assessment
 * - Architecture Decision Records (ADRs)
 */
const meta = {
  title: 'Advanced/AI/ArchitectFramework',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Architect Framework provides a comprehensive prompt engineering toolkit for
building AI-assisted software engineering workflows.

## Core Recipes

- **Master Architect** - Full 4-phase workflow
- **Security Auditor** - OWASP-focused security analysis
- **Refactoring Specialist** - Code quality and patterns
- **Architecture Reviewer** - Design and structure analysis
- **Test Engineer** - Testing strategy and coverage

## Usage

\`\`\`tsx
import {
  renderMasterSystemPrompt,
  MASTER_ARCHITECT_RECIPE,
  useArchitectWorkflow,
} from '@clarity-chat/react'

// Use as system prompt
const systemPrompt = renderMasterSystemPrompt({
  language: 'typescript',
  styleGuide: 'airbnb',
  enableSecurityScan: true,
})

// Or use the workflow hook
const workflow = useArchitectWorkflow({
  onPhaseComplete: (phase, result) => {
    console.log(\`Phase \${phase} complete\`)
  },
})
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Master Prompt Demo
// ============================================================================

function MasterPromptDemo() {
  const [language, setLanguage] = useState<string>('typescript')
  const [styleGuide, setStyleGuide] = useState<string>('airbnb')
  const [enableSecurity, setEnableSecurity] = useState(true)
  const [showPrompt, setShowPrompt] = useState(false)

  const systemPrompt = useMemo(() => {
    return renderMasterSystemPrompt({
      language: language as any,
      styleGuide: styleGuide as any,
      enableSecurityScan: enableSecurity,
      enableCodeSmellDetection: true,
      enableDebtAssessment: true,
    })
  }, [language, styleGuide, enableSecurity])

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">
        Master System Prompt Generator
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-background"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Style Guide</label>
          <select
            value={styleGuide}
            onChange={(e) => setStyleGuide(e.target.value)}
            className="w-full border rounded p-2 text-sm bg-background"
          >
            <option value="airbnb">Airbnb</option>
            <option value="google">Google</option>
            <option value="standard">Standard</option>
            <option value="prettier">Prettier</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="security"
            checked={enableSecurity}
            onChange={(e) => setEnableSecurity(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="security" className="text-sm font-medium">
            Enable Security Scan
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Button onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? 'Hide' : 'Show'} Generated Prompt
        </Button>
        <span className="text-sm text-muted-foreground">
          {systemPrompt.length.toLocaleString()} characters
        </span>
      </div>

      {showPrompt && (
        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
          {systemPrompt}
        </pre>
      )}
    </Card>
  )
}

// ============================================================================
// Recipe Selector Demo
// ============================================================================

function RecipeSelectorDemo() {
  const [selectedRecipe, setSelectedRecipe] =
    useState<string>('master-architect')

  const recipeNames = Object.keys(ARCHITECT_RECIPES)
  const recipe = getArchitectRecipe(selectedRecipe)

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">Architect Recipe Selector</h3>

      <div className="flex gap-2 mb-6 flex-wrap">
        {recipeNames.map((name) => (
          <Button
            key={name}
            variant={selectedRecipe === name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRecipe(name)}
          >
            {name
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')}
          </Button>
        ))}
      </div>

      {recipe && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
            <p className="text-lg">{recipe.name}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground">
              Description
            </h4>
            <p className="text-sm">{recipe.description}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">
              Fragments
            </h4>
            <div className="flex gap-2 flex-wrap">
              {recipe.fragments.map((fragment, idx) => (
                <Badge key={idx} variant="secondary">
                  {fragment.name || `Fragment ${idx + 1}`}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// Design Patterns Catalog Demo
// ============================================================================

function DesignPatternsCatalogDemo() {
  const [selectedCategory, setSelectedCategory] = useState<
    DesignPatternCategory | 'all'
  >('all')
  const [selectedPattern, setSelectedPattern] = useState<DesignPattern | null>(
    null
  )

  const patterns = useMemo(() => {
    if (selectedCategory === 'all') {
      return Object.values(ALL_PATTERNS)
    }
    return getPatternsByCategory(selectedCategory)
  }, [selectedCategory])

  const patternDetails = selectedPattern
    ? getPatternById(selectedPattern)
    : null

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">
        GoF Design Patterns Catalog
      </h3>

      <div className="flex gap-2 mb-6">
        {(['all', 'creational', 'structural', 'behavioral'] as const).map(
          (cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(cat)
                setSelectedPattern(null)
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {cat !== 'all' && (
                <Badge variant="secondary" className="ml-2">
                  {cat === 'creational' ? 5 : cat === 'structural' ? 7 : 11}
                </Badge>
              )}
            </Button>
          )
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 max-h-96 overflow-auto">
          <h4 className="font-medium mb-2">Patterns ({patterns.length})</h4>
          <div className="space-y-1">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern.id)}
                className={`w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors ${
                  selectedPattern === pattern.id ? 'bg-muted font-medium' : ''
                }`}
              >
                <span className="flex items-center justify-between">
                  {pattern.name}
                  <Badge variant="outline" className="text-xs">
                    {pattern.category}
                  </Badge>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          {patternDetails ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{patternDetails.name}</h4>
                <Badge variant="info">{patternDetails.category}</Badge>
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground">
                  Intent
                </h5>
                <p className="text-sm">{patternDetails.intent}</p>
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground">
                  Use Cases
                </h5>
                <ul className="text-sm list-disc list-inside">
                  {patternDetails.useCases.map((uc, idx) => (
                    <li key={idx}>{uc}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm text-green-600">Pros</h5>
                  <ul className="text-xs list-disc list-inside">
                    {patternDetails.tradeoffs.pros.map((pro, idx) => (
                      <li key={idx}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm text-red-600">Cons</h5>
                  <ul className="text-xs list-disc list-inside">
                    {patternDetails.tradeoffs.cons.map((con, idx) => (
                      <li key={idx}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground">
                  Implementation
                </h5>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-32">
                  {patternDetails.implementation}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Select a pattern to view details
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// OWASP Catalog Demo
// ============================================================================

function OWASPCatalogDemo() {
  const [selectedVuln, setSelectedVuln] = useState<string | null>(null)

  const vulnDetails = selectedVuln
    ? OWASP_VULNERABILITIES[selectedVuln as OWASPVulnerability]
    : null

  const getSeverity = (id: OWASPVulnerability): DebtSeverity => {
    // Lightweight mapping for demo purposes.
    if (id === 'A03_INJECTION' || id === 'A01_BROKEN_ACCESS_CONTROL')
      return 'critical'
    if (id === 'A02_CRYPTOGRAPHIC_FAILURES' || id === 'A07_AUTH_FAILURES')
      return 'high'
    return 'medium'
  }

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">
        OWASP Top 10 Security Catalog
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 max-h-96 overflow-auto">
          <h4 className="font-medium mb-2">Vulnerabilities</h4>
          <div className="space-y-1">
            {Object.entries(OWASP_VULNERABILITIES).map(([id, vuln]) => (
              <button
                key={id}
                onClick={() => setSelectedVuln(id)}
                className={`w-full text-left p-2 rounded text-sm hover:bg-muted transition-colors ${
                  selectedVuln === id ? 'bg-muted font-medium' : ''
                }`}
              >
                <span className="flex items-center justify-between">
                  {vuln.name}
                  <Badge
                    variant={
                      getSeverity(id as OWASPVulnerability) === 'critical'
                        ? 'destructive'
                        : getSeverity(id as OWASPVulnerability) === 'high'
                          ? 'warning'
                          : 'secondary'
                    }
                    className="text-xs"
                  >
                    {getSeverity(id as OWASPVulnerability)}
                  </Badge>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          {vulnDetails ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{vulnDetails.name}</h4>
                <Badge
                  variant={
                    getSeverity(selectedVuln as OWASPVulnerability) ===
                    'critical'
                      ? 'destructive'
                      : getSeverity(selectedVuln as OWASPVulnerability) ===
                          'high'
                        ? 'warning'
                        : 'secondary'
                  }
                >
                  {getSeverity(selectedVuln as OWASPVulnerability)}
                </Badge>
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground">
                  Description
                </h5>
                <p className="text-sm">{vulnDetails.description}</p>
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground">
                  Detection Patterns
                </h5>
                <ul className="text-sm list-disc list-inside">
                  {vulnDetails.patterns.slice(0, 3).map((pattern, idx) => (
                    <li key={idx} className="font-mono text-xs">
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-sm text-muted-foreground">
                  Recommendations
                </h5>
                <ul className="text-sm list-disc list-inside">
                  {vulnDetails.recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Select a vulnerability to view details
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ============================================================================
// Workflow Demo
// ============================================================================

function WorkflowDemo() {
  const workflow = useArchitectWorkflow({
    onPhaseComplete: (phase, result) => {
      console.log(`Phase ${phase} complete:`, result)
    },
  })

  const phaseColors = {
    analysis: 'bg-blue-100 text-blue-800',
    planning: 'bg-purple-100 text-purple-800',
    implementation: 'bg-green-100 text-green-800',
    review: 'bg-orange-100 text-orange-800',
  }

  const phaseLabels = {
    analysis: 'Auditor',
    planning: 'Architect',
    implementation: 'Crafter',
    review: 'Mentor',
  }

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">4-Phase Workflow</h3>

      <div className="flex items-center justify-between mb-6">
        {(['analysis', 'planning', 'implementation', 'review'] as const).map(
          (phase, idx) => (
            <div key={phase} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  workflow.currentPhase === phase
                    ? phaseColors[phase]
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {idx + 1}
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium">{phaseLabels[phase]}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {phase}
                </p>
              </div>
              {idx < 3 && <div className="w-12 h-0.5 bg-muted mx-2" />}
            </div>
          )
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => workflow.setPhase('analysis')}
          variant={workflow.currentPhase === 'analysis' ? 'default' : 'outline'}
          size="sm"
        >
          Analysis
        </Button>
        <Button
          onClick={() => workflow.setPhase('planning')}
          variant={workflow.currentPhase === 'planning' ? 'default' : 'outline'}
          size="sm"
        >
          Planning
        </Button>
        <Button
          onClick={() => workflow.setPhase('implementation')}
          variant={
            workflow.currentPhase === 'implementation' ? 'default' : 'outline'
          }
          size="sm"
        >
          Implementation
        </Button>
        <Button
          onClick={() => workflow.setPhase('review')}
          variant={workflow.currentPhase === 'review' ? 'default' : 'outline'}
          size="sm"
        >
          Review
        </Button>
        <Button onClick={workflow.reset} variant="ghost" size="sm">
          Reset
        </Button>
      </div>

      <div className={`p-4 rounded-lg ${phaseColors[workflow.currentPhase]}`}>
        <h4 className="font-semibold mb-2">
          Phase{' '}
          {['analysis', 'planning', 'implementation', 'review'].indexOf(
            workflow.currentPhase
          ) + 1}
          : {phaseLabels[workflow.currentPhase]}
        </h4>
        <p className="text-sm">
          {workflow.currentPhase === 'analysis' &&
            'Context gathering, security scanning, code smell detection'}
          {workflow.currentPhase === 'planning' &&
            'Chain of thought reasoning, design pattern selection'}
          {workflow.currentPhase === 'implementation' &&
            'Style guide adherence, Boy Scout Rule application'}
          {workflow.currentPhase === 'review' &&
            'Self-correction, DRY verification, ADR generation'}
        </p>
      </div>
    </Card>
  )
}

// ============================================================================
// Pattern Suggestion Demo
// ============================================================================

function PatternSuggestionDemo() {
  const [useCase, setUseCase] = useState('')
  const [suggestions, setSuggestions] = useState<DesignPattern[]>([])

  const handleSearch = () => {
    if (useCase.trim()) {
      // Simple heuristic suggestions for demo: rely on catalog keywords.
      const normalized = useCase.toLowerCase()
      const matches = (Object.keys(DESIGN_PATTERN_CATALOG) as DesignPattern[])
        .filter((id) => {
          const info = DESIGN_PATTERN_CATALOG[id]
          return (
            id.toLowerCase().includes(normalized) ||
            info.name.toLowerCase().includes(normalized) ||
            info.intent.toLowerCase().includes(normalized) ||
            info.useCases.some((uc) => uc.toLowerCase().includes(normalized))
          )
        })
        .slice(0, 6)

      setSuggestions(
        matches.length
          ? matches
          : (Object.keys(DESIGN_PATTERN_CATALOG) as DesignPattern[]).slice(0, 6)
      )
    }
  }

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">Pattern Suggestion Engine</h3>

      <div className="flex gap-2 mb-4">
        <input
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Describe your use case (e.g., 'database connection', 'event system')"
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <Button onClick={handleSearch}>Suggest Patterns</Button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          'database',
          'logging',
          'event',
          'cache',
          'ui components',
          'algorithm',
        ].map((example) => (
          <Button
            key={example}
            variant="ghost"
            size="sm"
            onClick={() => {
              setUseCase(example)
              const normalized = example.toLowerCase()
              const matches = (
                Object.keys(DESIGN_PATTERN_CATALOG) as DesignPattern[]
              )
                .filter((id) => {
                  const info = DESIGN_PATTERN_CATALOG[id]
                  return (
                    id.toLowerCase().includes(normalized) ||
                    info.name.toLowerCase().includes(normalized) ||
                    info.intent.toLowerCase().includes(normalized) ||
                    info.useCases.some((uc) =>
                      uc.toLowerCase().includes(normalized)
                    )
                  )
                })
                .slice(0, 6)
              setSuggestions(matches)
            }}
          >
            {example}
          </Button>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">
            Suggested Patterns ({suggestions.length})
          </h4>
          {suggestions.map((pattern) => {
            const info = DESIGN_PATTERN_CATALOG[pattern]
            return (
              <div key={pattern} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{info.name}</span>
                  <div className="flex gap-2">
                    <Badge variant="info">{info.category}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{info.intent}</p>
              </div>
            )
          })}
        </div>
      )}

      {suggestions.length === 0 && useCase && (
        <p className="text-muted-foreground text-center py-8">
          No patterns found for "{useCase}". Try a different description.
        </p>
      )}
    </Card>
  )
}

// ============================================================================
// Security Finding Demo
// ============================================================================

function SecurityFindingDemo() {
  const [findings, setFindings] = useState<SecurityFinding[]>([])

  const addFinding = (type: OWASPVulnerability) => {
    const vuln = OWASP_VULNERABILITIES[type]
    const severity: DebtSeverity =
      type === 'A03_INJECTION' || type === 'A01_BROKEN_ACCESS_CONTROL'
        ? 'critical'
        : 'high'

    const finding = createSecurityFinding(
      type,
      severity,
      `Potential ${vuln.name.toLowerCase()} issue detected`,
      vuln.recommendations[0] ?? 'Review and remediate',
      { location: 'src/api/handler.ts:42' }
    )
    setFindings((prev) => [...prev, finding])
  }

  const riskScore = calculateRiskScore(findings)

  return (
    <Card className="p-6 max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">
        Security Findings Generator
      </h3>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          size="sm"
          onClick={() => addFinding('A01_BROKEN_ACCESS_CONTROL')}
        >
          Add Access Control
        </Button>
        <Button size="sm" onClick={() => addFinding('A03_INJECTION')}>
          Add Injection
        </Button>
        <Button size="sm" onClick={() => addFinding('A07_AUTH_FAILURES')}>
          Add Auth Failure
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setFindings([])}>
          Clear All
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium">Risk Score:</span>
        <Badge
          variant={
            riskScore > 70
              ? 'destructive'
              : riskScore > 40
                ? 'warning'
                : 'success'
          }
          className="text-lg px-3 py-1"
        >
          {riskScore}/100
        </Badge>
      </div>

      {findings.length > 0 ? (
        <div className="space-y-2">
          {findings.map((finding, idx) => (
            <div key={idx} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{finding.type}</span>
                <Badge
                  variant={
                    finding.severity === 'critical'
                      ? 'destructive'
                      : finding.severity === 'high'
                        ? 'warning'
                        : 'secondary'
                  }
                >
                  {finding.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {finding.description}
              </p>
              {finding.location && (
                <p className="text-xs font-mono mt-1">{finding.location}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No security findings. Add some to see the risk score calculation.
        </p>
      )}
    </Card>
  )
}

// ============================================================================
// Stories
// ============================================================================

export const MasterPrompt: Story = {
  render: () => <MasterPromptDemo />,
}

export const RecipeSelector: Story = {
  render: () => <RecipeSelectorDemo />,
}

export const DesignPatterns: Story = {
  render: () => <DesignPatternsCatalogDemo />,
}

export const OWASPSecurity: Story = {
  render: () => <OWASPCatalogDemo />,
}

export const Workflow: Story = {
  render: () => <WorkflowDemo />,
}

export const PatternSuggestion: Story = {
  render: () => <PatternSuggestionDemo />,
}

export const SecurityFindings: Story = {
  render: () => <SecurityFindingDemo />,
}
