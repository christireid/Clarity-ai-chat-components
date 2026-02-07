'use client'

import { useState } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  Button, Badge, cn,
} from '@clarity-chat/primitives'
import {
  AlertTriangle,
  Check,
  X,
  Edit,
  Info,
  Download,
  Workflow,
  Loader2,
  PanelTop,
  Code,
  FileText,
  Layers,
  ExternalLink,
  Bookmark,
  BookmarkPlus,
  Trash2,
  Brain,
} from 'lucide-react'

// ============================================================================
// HUMAN IN THE LOOP
// ============================================================================
export function HumanInTheLoop() {
  const [decision, setDecision] = useState<string | null>(null)

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Human Review Required</CardTitle>
        </div>
        <CardDescription>
          The AI has generated a response that requires your approval before
          proceeding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg mb-4">
          <p className="text-sm font-medium mb-2">Proposed Action:</p>
          <p className="text-sm text-muted-foreground">
            Delete all files in the /temp directory and restart the server
            process.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setDecision('approved')}
            className="gap-2"
            disabled={decision !== null}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            onClick={() => setDecision('rejected')}
            variant="outline"
            className="gap-2"
            disabled={decision !== null}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            onClick={() => setDecision('modified')}
            variant="outline"
            className="gap-2"
            disabled={decision !== null}
          >
            <Edit className="h-4 w-4" />
            Modify
          </Button>
        </div>
        {decision && (
          <Badge
            className="mt-3"
            variant={decision === 'approved' ? 'default' : 'secondary'}
          >
            {decision === 'approved'
              ? 'Approved'
              : decision === 'rejected'
                ? 'Rejected'
                : 'Modification Requested'}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CONFIRMATION DIALOG
// ============================================================================
export function ConfirmationDialogDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirmation Dialogs</CardTitle>
        <CardDescription>
          Various confirmation patterns for user actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Danger Confirmation */}
        <div className="p-4 border border-red-500/50 rounded-lg bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-600">Delete Conversation?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone. All messages will be permanently
                deleted.
              </p>
              <div className="flex gap-2 mt-3">
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Confirmation */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium">Save Changes?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You have unsaved changes. Would you like to save them before
                leaving?
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm">Save</Button>
                <Button variant="outline" size="sm">
                  Don&apos;t Save
                </Button>
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// COMPONENT CARDS
// ============================================================================
export function ComponentCardsDemo() {
  const components = [
    {
      name: 'ChatInput',
      status: 'stable',
      downloads: '12.5k',
      version: '2.1.0',
    },
    {
      name: 'MessageList',
      status: 'stable',
      downloads: '10.2k',
      version: '2.1.0',
    },
    {
      name: 'TokenMeter',
      status: 'beta',
      downloads: '5.4k',
      version: '1.0.0-beta',
    },
    {
      name: 'VoiceInput',
      status: 'experimental',
      downloads: '2.1k',
      version: '0.5.0',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {components.map((comp, i) => (
        <Card
          key={i}
          className="hover:border-primary/50 transition-colors cursor-pointer"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{comp.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  v{comp.version}
                </p>
              </div>
              <Badge
                variant={
                  comp.status === 'stable'
                    ? 'default'
                    : comp.status === 'beta'
                      ? 'secondary'
                      : 'outline'
                }
              >
                {comp.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {comp.downloads}
              </span>
              <Button variant="ghost" size="sm" className="ml-auto">
                View Docs
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ============================================================================
// TASK ORCHESTRATOR
// ============================================================================
export function TaskOrchestratorDemo() {
  const workflow = [
    { name: 'Parse Input', status: 'completed', duration: '0.2s' },
    { name: 'Validate Request', status: 'completed', duration: '0.1s' },
    { name: 'Generate Response', status: 'running', duration: '2.3s' },
    { name: 'Format Output', status: 'pending', duration: null },
    { name: 'Send Response', status: 'pending', duration: null },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Task Orchestrator</CardTitle>
        </div>
        <CardDescription>
          Visualize multi-step AI task execution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {workflow.map((step, i) => (
            <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  step.status === 'completed' && 'bg-green-500/20',
                  step.status === 'running' && 'bg-blue-500/20',
                  step.status === 'pending' && 'bg-muted'
                )}
              >
                {step.status === 'completed' && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {step.status === 'running' && (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    step.status === 'pending' && 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </p>
              </div>
              {step.duration && (
                <span className="text-xs text-muted-foreground">
                  {step.duration}
                </span>
              )}
              {i < workflow.length - 1 && (
                <div
                  className="absolute left-4 ml-3.5 w-px h-4 bg-border"
                  style={{ top: `${(i + 1) * 48 - 8}px` }}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ARTIFACT PANEL
// ============================================================================
export function ArtifactPanel() {
  const artifacts = [
    { type: 'code', title: 'React Component', language: 'typescript' },
    { type: 'document', title: 'API Documentation', format: 'markdown' },
    { type: 'diagram', title: 'System Architecture', format: 'mermaid' },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PanelTop className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Artifacts</CardTitle>
        </div>
        <CardDescription>Generated content and outputs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {artifacts.map((artifact, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
            >
              {artifact.type === 'code' && (
                <Code className="h-5 w-5 text-blue-500" />
              )}
              {artifact.type === 'document' && (
                <FileText className="h-5 w-5 text-green-500" />
              )}
              {artifact.type === 'diagram' && (
                <Layers className="h-5 w-5 text-purple-500" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{artifact.title}</p>
                <p className="text-xs text-muted-foreground">
                  {artifact.language || artifact.format}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// BOOKMARKS
// ============================================================================
export function BookmarksPanel() {
  const bookmarks = [
    {
      title: 'React Hooks Explanation',
      date: '2 hours ago',
      tags: ['react', 'tutorial'],
    },
    {
      title: 'API Rate Limiting Discussion',
      date: '1 day ago',
      tags: ['api', 'performance'],
    },
    {
      title: 'TypeScript Best Practices',
      date: '3 days ago',
      tags: ['typescript'],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Bookmarks</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            <BookmarkPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookmarks.map((bookmark, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
            >
              <Bookmark className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">{bookmark.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {bookmark.date}
                  </span>
                  <div className="flex gap-1">
                    {bookmark.tags.map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// CHAIN OF THOUGHT
// ============================================================================
export function ChainOfThoughtDemo() {
  const steps = [
    {
      step: 1,
      thought:
        'First, I need to understand what the user is asking about React hooks...',
    },
    {
      step: 2,
      thought:
        'The question involves useEffect, so I should explain the dependency array...',
    },
    {
      step: 3,
      thought: 'I should provide a code example to illustrate the concept...',
    },
    {
      step: 4,
      thought: 'Finally, I&apos;ll mention common pitfalls to avoid...',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-lg">Chain of Thought</CardTitle>
        </div>
        <CardDescription>AI reasoning process visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20"
            >
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-purple-600">
                  {step.step}
                </span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{step.thought}"
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
