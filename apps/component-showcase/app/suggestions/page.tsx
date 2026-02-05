'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  Lightbulb,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Code,
  FileText,
  MessageSquare,
  Wand2,
  Zap,
  BookOpen,
  HelpCircle,
  TrendingUp,
} from 'lucide-react'

// ============================================================================
// FOLLOW-UP SUGGESTIONS DEMO
// ============================================================================
function FollowUpSuggestionsDemo() {
  const suggestions = [
    'Can you explain this in more detail?',
    'Show me a code example',
    'What are the alternatives?',
    'How do I implement this in React?',
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Follow-up Suggestions</CardTitle>
        <CardDescription>
          Suggested questions after AI responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Horizontal Pills */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Horizontal Pills
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="gap-1 hover:bg-primary/10 hover:border-primary/50"
                >
                  {suggestion}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          {/* Vertical List */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Vertical List</p>
            <div className="space-y-1 p-3 glass-subtle rounded-lg">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-background text-sm text-left transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    {suggestion}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* With Refresh */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Suggested follow-ups
            </span>
            <Button variant="ghost" size="sm" className="gap-1 h-7">
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROMPT SUGGESTIONS DEMO
// ============================================================================
function PromptSuggestionsDemo() {
  const categories = [
    {
      name: 'Code',
      icon: <Code className="h-4 w-4" />,
      prompts: [
        'Write a function that...',
        'Debug this code...',
        'Explain this algorithm...',
      ],
    },
    {
      name: 'Writing',
      icon: <FileText className="h-4 w-4" />,
      prompts: [
        'Write a blog post about...',
        'Summarize this article...',
        'Improve this text...',
      ],
    },
    {
      name: 'Analysis',
      icon: <TrendingUp className="h-4 w-4" />,
      prompts: [
        'Analyze this data...',
        'Compare these options...',
        'Find patterns in...',
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prompt Suggestions</CardTitle>
        <CardDescription>Starter prompts organized by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-muted-foreground">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                {category.prompts.map((prompt, i) => (
                  <button
                    key={i}
                    className="p-3 text-left text-sm border rounded-lg hover:glass-subtle hover:border-primary/50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// QUICK REPLIES DEMO
// ============================================================================
function QuickRepliesDemo() {
  const quickReplies = [
    { label: 'Yes', variant: 'success' },
    { label: 'No', variant: 'destructive' },
    { label: 'More info', variant: 'outline' },
    { label: 'Skip', variant: 'ghost' },
  ]

  const contextualReplies = [
    { label: 'Use TypeScript', icon: <Code className="h-3.5 w-3.5" /> },
    { label: 'Add tests', icon: <Zap className="h-3.5 w-3.5" /> },
    { label: 'Include docs', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { label: 'Explain more', icon: <HelpCircle className="h-3.5 w-3.5" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Replies</CardTitle>
        <CardDescription>Pre-defined response options</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Basic Quick Replies */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Basic Responses
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Yes
              </Button>
              <Button size="sm" variant="destructive">
                No
              </Button>
              <Button size="sm" variant="outline">
                More info
              </Button>
              <Button size="sm" variant="ghost">
                Skip
              </Button>
            </div>
          </div>

          {/* Contextual Quick Replies */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Contextual Options
            </p>
            <div className="flex flex-wrap gap-2">
              {contextualReplies.map((reply, i) => (
                <Button key={i} variant="outline" size="sm" className="gap-2">
                  {reply.icon}
                  {reply.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Card Style */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Card Style Options
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-4 border rounded-lg text-left hover:glass-subtle hover:border-primary/50 transition-colors">
                <Wand2 className="h-5 w-5 text-primary mb-2" />
                <p className="font-medium text-sm">Generate more</p>
                <p className="text-xs text-muted-foreground">
                  Create additional variations
                </p>
              </button>
              <button className="p-4 border rounded-lg text-left hover:glass-subtle hover:border-primary/50 transition-colors">
                <Sparkles className="h-5 w-5 text-purple-500 mb-2" />
                <p className="font-medium text-sm">Improve this</p>
                <p className="text-xs text-muted-foreground">
                  Enhance the quality
                </p>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// RESPONSE ACTIONS DEMO
// ============================================================================
function ResponseActionsDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Response Actions</CardTitle>
        <CardDescription>Actions to take on AI responses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* AI Response Example */}
          <div className="p-4 glass-subtle rounded-xl">
            <p className="text-sm">
              Here&apos;s a React hook that manages form state with validation.
              It supports multiple field types and provides error messages...
            </p>
          </div>

          {/* Action Buttons */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Response Actions
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Code className="h-4 w-4" />
                Show code
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Make shorter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Make longer
              </Button>
            </div>
          </div>

          {/* Inline Actions */}
          <div className="p-4 border rounded-lg">
            <p className="text-xs text-muted-foreground mb-3">Click to apply</p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:glass-subtle text-sm text-left">
                <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Simplify</p>
                  <p className="text-xs text-muted-foreground">
                    Make the explanation simpler
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:glass-subtle text-sm text-left">
                <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Add examples</p>
                  <p className="text-xs text-muted-foreground">
                    Include practical examples
                  </p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:glass-subtle text-sm text-left">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center">
                  <Code className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Add code</p>
                  <p className="text-xs text-muted-foreground">
                    Include code snippets
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SUGGESTION CHIPS DEMO
// ============================================================================
function SuggestionChipsDemo() {
  const [selected, setSelected] = useState<string[]>([])

  const chips = [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'API Design',
    'Database',
    'Testing',
    'DevOps',
    'Security',
    'Performance',
  ]

  const toggleChip = (chip: string) => {
    setSelected((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggestion Chips</CardTitle>
        <CardDescription>Selectable topic tags</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Select topics you&apos;re interested in
            </p>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <Badge
                  key={chip}
                  variant={selected.includes(chip) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    selected.includes(chip)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-primary/10'
                  )}
                  onClick={() => toggleChip(chip)}
                >
                  {chip}
                </Badge>
              ))}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="p-3 glass-subtle rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Selected:</p>
              <p className="text-sm">{selected.join(', ')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function SuggestionsPage() {
  return (
    <div className="space-y-8 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-cyan -top-40 -left-40 opacity-20" />
        <div className="orb-primary bottom-40 -right-40 opacity-20" />
      </div>

      <PageHeader
        title="Suggestions"
        description="Follow-ups, prompts, quick replies, and response actions"
        icon={Lightbulb}
        badge="7+ Components"
      />

      <Tabs defaultValue="followup" className="w-full">
        <TabsList className="mb-6 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger value="followup">Follow-ups</TabsTrigger>
          <TabsTrigger value="prompts">Prompt Suggestions</TabsTrigger>
          <TabsTrigger value="replies">Quick Replies</TabsTrigger>
          <TabsTrigger value="actions">Response Actions</TabsTrigger>
          <TabsTrigger value="chips">Suggestion Chips</TabsTrigger>
        </TabsList>

        <TabsContent value="followup">
          <ComponentSection
            title="Follow-up Suggestions"
            description="Questions to continue the conversation"
          >
            <FollowUpSuggestionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="prompts">
          <ComponentSection
            title="Prompt Suggestions"
            description="Starter prompts by category"
          >
            <PromptSuggestionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="replies">
          <ComponentSection
            title="Quick Replies"
            description="Pre-defined responses"
          >
            <QuickRepliesDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="actions">
          <ComponentSection
            title="Response Actions"
            description="Actions on AI responses"
          >
            <ResponseActionsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="chips">
          <ComponentSection
            title="Suggestion Chips"
            description="Selectable topic tags"
          >
            <SuggestionChipsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
