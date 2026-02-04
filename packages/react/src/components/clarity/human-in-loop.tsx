'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@clarity-chat/primitives'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Hand,
  Check,
  X,
  AlertTriangle,
  Shield,
  Clock,
  Eye,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  RefreshCw,
  Pause,
  Play,
  SkipForward,
  UserCheck,
  Bot,
  Sparkles,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'modified'
  | 'skipped'

export interface ApprovalRequest {
  id: string
  type: 'action' | 'response' | 'tool_call' | 'decision'
  title: string
  description?: string
  content?: string
  metadata?: Record<string, unknown>
  status: ApprovalStatus
  requiredBy?: Date
  createdAt: Date
  resolvedAt?: Date
  resolvedBy?: string
  modification?: string
}

export interface ApprovalCardProps {
  request: ApprovalRequest
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
  onModify?: (id: string, modification: string) => void
  onSkip?: (id: string) => void
  showTimer?: boolean
  allowModification?: boolean
  className?: string
}

export interface ApprovalDialogProps {
  request: ApprovalRequest | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
  onModify?: (id: string, modification: string) => void
}

export interface ApprovalQueueProps {
  requests: ApprovalRequest[]
  onApprove: (id: string) => void
  onReject: (id: string, reason?: string) => void
  onModify?: (id: string, modification: string) => void
  onApproveAll?: () => void
  onRejectAll?: () => void
  className?: string
}

export interface InterventionButtonProps {
  onIntervene: () => void
  isPaused?: boolean
  variant?: 'default' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export interface FeedbackCollectorProps {
  messageId: string
  onFeedback: (
    messageId: string,
    feedback: 'positive' | 'negative',
    comment?: string
  ) => void
  variant?: 'inline' | 'card' | 'minimal'
  showComment?: boolean
  className?: string
}

// ============================================================================
// APPROVAL CARD
// ============================================================================

export function ApprovalCard({
  request,
  onApprove,
  onReject,
  onModify,
  onSkip,
  showTimer = true,
  allowModification = true,
  className,
}: ApprovalCardProps) {
  const [isModifying, setIsModifying] = React.useState(false)
  const [modification, setModification] = React.useState(request.content || '')
  const [rejectReason, setRejectReason] = React.useState('')
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)

  const typeIcons = {
    action: <Shield className="h-4 w-4" />,
    response: <MessageSquare className="h-4 w-4" />,
    tool_call: <Sparkles className="h-4 w-4" />,
    decision: <AlertTriangle className="h-4 w-4" />,
  }

  const typeColors = {
    action: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    response:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    tool_call:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    decision:
      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    modified: 'bg-blue-100 text-blue-700',
    skipped: 'bg-gray-100 text-gray-700',
  }

  const handleApprove = () => {
    if (isModifying && modification !== request.content) {
      onModify?.(request.id, modification)
    } else {
      onApprove(request.id)
    }
    setIsModifying(false)
  }

  const handleReject = () => {
    onReject(request.id, rejectReason || undefined)
    setShowRejectDialog(false)
    setRejectReason('')
  }

  // Calculate time remaining if requiredBy is set
  const timeRemaining = React.useMemo(() => {
    if (!request.requiredBy) return null
    const now = new Date()
    const diff = request.requiredBy.getTime() - now.getTime()
    if (diff <= 0) return 'Expired'
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [request.requiredBy])

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded', typeColors[request.type])}>
              {typeIcons[request.type]}
            </div>
            <div>
              <CardTitle className="text-base">{request.title}</CardTitle>
              {request.description && (
                <CardDescription className="text-xs mt-0.5">
                  {request.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showTimer && timeRemaining && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {timeRemaining}
              </Badge>
            )}
            <Badge className={statusColors[request.status]}>
              {request.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {request.content && (
          <div className="relative">
            {isModifying ? (
              <Textarea
                value={modification}
                onChange={(e) => setModification(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
            ) : (
              <div className="p-3 rounded-lg bg-muted/50 border">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {request.content}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {request.status === 'pending' && (
        <CardFooter className="flex items-center gap-2 pt-0">
          <Button
            variant="default"
            size="sm"
            onClick={handleApprove}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1.5" />
            {isModifying ? 'Save & Approve' : 'Approve'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRejectDialog(true)}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1.5" />
            Reject
          </Button>
          {allowModification && !isModifying && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModifying(true)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          {onSkip && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSkip(request.id)}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      )}

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this request? Optionally provide a
              reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

// ============================================================================
// APPROVAL DIALOG
// ============================================================================

export function ApprovalDialog({
  request,
  isOpen,
  onOpenChange,
  onApprove,
  onReject,
  onModify,
}: ApprovalDialogProps) {
  const [modification, setModification] = React.useState('')
  const [isModifying, setIsModifying] = React.useState(false)

  React.useEffect(() => {
    if (request) {
      setModification(request.content || '')
      setIsModifying(false)
    }
  }, [request])

  if (!request) return null

  const handleApprove = () => {
    if (isModifying && modification !== request.content && onModify) {
      onModify(request.id, modification)
    } else {
      onApprove(request.id)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-yellow-500" />
            Human Approval Required
          </DialogTitle>
          <DialogDescription>{request.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {request.description && (
            <p className="text-sm text-muted-foreground">
              {request.description}
            </p>
          )}

          {request.content && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content</label>
                {onModify && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsModifying(!isModifying)}
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                    {isModifying ? 'Cancel Edit' : 'Modify'}
                  </Button>
                )}
              </div>
              {isModifying ? (
                <Textarea
                  value={modification}
                  onChange={(e) => setModification(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 border max-h-[200px] overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {request.content}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onReject(request.id)
              onOpenChange(false)
            }}
          >
            <X className="h-4 w-4 mr-1.5" />
            Reject
          </Button>
          <Button onClick={handleApprove}>
            <Check className="h-4 w-4 mr-1.5" />
            {isModifying ? 'Approve with Changes' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================================================
// APPROVAL QUEUE
// ============================================================================

export function ApprovalQueue({
  requests,
  onApprove,
  onReject,
  onModify,
  onApproveAll,
  onRejectAll,
  className,
}: ApprovalQueueProps) {
  const pendingRequests = requests.filter((r) => r.status === 'pending')

  if (pendingRequests.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
      >
        <UserCheck className="h-12 w-12 text-green-500/30 mb-3" />
        <p className="text-sm text-muted-foreground">No pending approvals</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          All requests have been processed
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hand className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">Pending Approvals</span>
          <Badge variant="secondary">{pendingRequests.length}</Badge>
        </div>
        <div className="flex gap-2">
          {onApproveAll && (
            <Button variant="outline" size="sm" onClick={onApproveAll}>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Approve All
            </Button>
          )}
          {onRejectAll && (
            <Button variant="outline" size="sm" onClick={onRejectAll}>
              <X className="h-3.5 w-3.5 mr-1.5" />
              Reject All
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {pendingRequests.map((request) => (
          <ApprovalCard
            key={request.id}
            request={request}
            onApprove={onApprove}
            onReject={onReject}
            onModify={onModify}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// INTERVENTION BUTTON
// ============================================================================

export function InterventionButton({
  onIntervene,
  isPaused = false,
  variant = 'outline',
  size = 'md',
  showLabel = true,
  className,
}: InterventionButtonProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-9',
    lg: 'h-10',
  }

  return (
    <Button
      variant={isPaused ? 'default' : variant}
      className={cn(sizeClasses[size], className)}
      onClick={onIntervene}
    >
      {isPaused ? (
        <>
          <Play className="h-4 w-4" />
          {showLabel && <span className="ml-2">Resume</span>}
        </>
      ) : (
        <>
          <Pause className="h-4 w-4" />
          {showLabel && <span className="ml-2">Intervene</span>}
        </>
      )}
    </Button>
  )
}

// ============================================================================
// FEEDBACK COLLECTOR
// ============================================================================

export function FeedbackCollector({
  messageId,
  onFeedback,
  variant = 'inline',
  showComment = true,
  className,
}: FeedbackCollectorProps) {
  const [feedback, setFeedback] = React.useState<
    'positive' | 'negative' | null
  >(null)
  const [showCommentBox, setShowCommentBox] = React.useState(false)
  const [comment, setComment] = React.useState('')

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type)
    if (showComment) {
      setShowCommentBox(true)
    } else {
      onFeedback(messageId, type)
    }
  }

  const submitFeedback = () => {
    if (feedback) {
      onFeedback(messageId, feedback, comment || undefined)
      setShowCommentBox(false)
    }
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-6 w-6', feedback === 'positive' && 'text-green-500')}
          onClick={() => handleFeedback('positive')}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-6 w-6', feedback === 'negative' && 'text-red-500')}
          onClick={() => handleFeedback('negative')}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <Card className={cn('p-4', className)}>
        <p className="text-sm font-medium mb-3">Was this response helpful?</p>
        <div className="flex gap-2">
          <Button
            variant={feedback === 'positive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('positive')}
            className={cn(
              feedback === 'positive' && 'bg-green-600 hover:bg-green-700'
            )}
          >
            <ThumbsUp className="h-4 w-4 mr-1.5" />
            Yes
          </Button>
          <Button
            variant={feedback === 'negative' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFeedback('negative')}
            className={cn(
              feedback === 'negative' && 'bg-red-600 hover:bg-red-700'
            )}
          >
            <ThumbsDown className="h-4 w-4 mr-1.5" />
            No
          </Button>
        </div>
        {showCommentBox && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us more (optional)"
              className="h-20"
            />
            <Button size="sm" onClick={submitFeedback}>
              Submit Feedback
            </Button>
          </div>
        )}
      </Card>
    )
  }

  // Inline variant
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7',
            feedback === 'positive' && 'text-green-500 bg-green-50'
          )}
          onClick={() => handleFeedback('positive')}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7',
            feedback === 'negative' && 'text-red-500 bg-red-50'
          )}
          onClick={() => handleFeedback('negative')}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </Button>
      </div>
      {showCommentBox && (
        <div className="flex gap-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="h-8 text-sm"
          />
          <Button size="sm" className="h-8" onClick={submitFeedback}>
            Send
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXECUTION MONITOR - Shows AI execution with pause capability
// ============================================================================

export interface ExecutionMonitorProps {
  steps: Array<{
    id: string
    name: string
    status: 'pending' | 'running' | 'completed' | 'paused' | 'error'
  }>
  currentStepIndex: number
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onIntervene?: (stepId: string) => void
  className?: string
}

export function ExecutionMonitor({
  steps,
  currentStepIndex,
  isPaused,
  onPause,
  onResume,
  onIntervene,
  className,
}: ExecutionMonitorProps) {
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const statusIcons = {
    pending: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
    running: <RefreshCw className="h-3.5 w-3.5 text-blue-500 animate-spin" />,
    completed: <Check className="h-3.5 w-3.5 text-green-500" />,
    paused: <Pause className="h-3.5 w-3.5 text-yellow-500" />,
    error: <X className="h-3.5 w-3.5 text-red-500" />,
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Execution
          </CardTitle>
          <InterventionButton
            onIntervene={isPaused ? onResume : onPause}
            isPaused={isPaused}
            size="sm"
            variant="outline"
          />
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center justify-between p-2 rounded-lg',
                index === currentStepIndex && 'bg-accent'
              )}
            >
              <div className="flex items-center gap-2">
                {statusIcons[step.status]}
                <span
                  className={cn(
                    'text-sm',
                    step.status === 'completed' && 'text-muted-foreground'
                  )}
                >
                  {step.name}
                </span>
              </div>
              {onIntervene && step.status === 'running' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onIntervene(step.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Review
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
