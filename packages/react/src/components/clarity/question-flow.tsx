'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { RadioGroup, RadioGroupItem } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  HelpCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react'

// Types
export interface QuestionOption {
  label: string
  value: string
  description?: string
  icon?: React.ReactNode
}

export interface Question {
  id: string
  type:
    | 'text'
    | 'textarea'
    | 'single-choice'
    | 'multi-choice'
    | 'rating'
    | 'scale'
  question: string
  description?: string
  placeholder?: string
  options?: QuestionOption[]
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface QuestionFlowProps {
  questions: Question[]
  onComplete: (answers: Record<string, unknown>) => void
  onCancel?: () => void
  title?: string
  description?: string
  showProgress?: boolean
  allowSkip?: boolean
  className?: string
}

export function QuestionFlow({
  questions,
  onComplete,
  onCancel,
  title = 'Questions',
  description,
  showProgress = true,
  allowSkip = false,
  className,
}: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, unknown>>({})
  const [isComplete, setIsComplete] = React.useState(false)

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const currentAnswer = answers[currentQuestion?.id]

  const canProceed = React.useMemo(() => {
    if (!currentQuestion?.required) return true
    if (
      currentAnswer === undefined ||
      currentAnswer === null ||
      currentAnswer === ''
    )
      return false
    if (Array.isArray(currentAnswer) && currentAnswer.length === 0) return false
    return true
  }, [currentQuestion, currentAnswer])

  const handleAnswer = (value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsComplete(true)
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setAnswers({})
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <Card className={cn('max-w-xl mx-auto', className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold">Complete!</h3>
            <p className="text-muted-foreground">
              Thank you for answering all {questions.length} questions.
            </p>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('max-w-xl mx-auto', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>
        {showProgress && <Progress value={progress} className="mt-4" />}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              {currentQuestion.question}
              {currentQuestion.required && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            {currentQuestion.description && (
              <p className="text-sm text-muted-foreground">
                {currentQuestion.description}
              </p>
            )}
          </div>

          <QuestionInput
            question={currentQuestion}
            value={currentAnswer}
            onChange={handleAnswer}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {allowSkip && !currentQuestion.required && (
              <Button variant="ghost" onClick={handleNext}>
                Skip
              </Button>
            )}
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleNext} disabled={!canProceed && !allowSkip}>
              {currentIndex === questions.length - 1 ? (
                <>
                  Complete
                  <Check className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Question Input Component
interface QuestionInputProps {
  question: Question
  value: unknown
  onChange: (value: unknown) => void
}

function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  switch (question.type) {
    case 'text':
      return (
        <Input
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      )

    case 'textarea':
      return (
        <Textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
        />
      )

    case 'single-choice':
      return (
        <RadioGroup
          value={(value as string) || ''}
          onValueChange={onChange}
          className="space-y-2"
        >
          {question.options?.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="mt-0.5"
              />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </div>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )

    case 'multi-choice':
      const selectedValues = (value as string[]) || []
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
            >
              <Checkbox
                id={option.value}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...selectedValues, option.value])
                  } else {
                    onChange(selectedValues.filter((v) => v !== option.value))
                  }
                }}
              />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                </div>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </Label>
            </div>
          ))}
        </div>
      )

    case 'rating':
      const ratingValue = (value as number) || 0
      return (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={cn(
                'w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-medium transition-all',
                ratingValue === rating
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {rating}
            </button>
          ))}
        </div>
      )

    case 'scale':
      const scaleValue = (value as number) || 5
      const min = question.validation?.min || 1
      const max = question.validation?.max || 10
      return (
        <div className="space-y-4">
          <input
            type="range"
            min={min}
            max={max}
            value={scaleValue}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{min}</span>
            <span className="font-medium text-foreground">{scaleValue}</span>
            <span>{max}</span>
          </div>
        </div>
      )

    default:
      return null
  }
}

// Guided Question Flow with AI Suggestions
export interface GuidedQuestionFlowProps {
  initialQuestion: string
  onAnswer: (
    question: string,
    answer: string
  ) => Promise<{ nextQuestion?: string; done?: boolean }>
  onComplete: (history: Array<{ question: string; answer: string }>) => void
  className?: string
}

export function GuidedQuestionFlow({
  initialQuestion,
  onAnswer,
  onComplete,
  className,
}: GuidedQuestionFlowProps) {
  const [history, setHistory] = React.useState<
    Array<{ question: string; answer: string }>
  >([])
  const [currentQuestion, setCurrentQuestion] = React.useState(initialQuestion)
  const [answer, setAnswer] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDone, setIsDone] = React.useState(false)

  const handleSubmit = async () => {
    if (!answer.trim()) return

    setIsLoading(true)
    const newHistory = [...history, { question: currentQuestion, answer }]
    setHistory(newHistory)

    try {
      const result = await onAnswer(currentQuestion, answer)
      if (result.done) {
        setIsDone(true)
        onComplete(newHistory)
      } else if (result.nextQuestion) {
        setCurrentQuestion(result.nextQuestion)
        setAnswer('')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isDone) {
    return (
      <Card className={cn('max-w-xl mx-auto', className)}>
        <CardContent className="pt-6 text-center space-y-4">
          <Sparkles className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-xl font-semibold">All Done!</h3>
          <p className="text-muted-foreground">
            Answered {history.length} questions
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('max-w-xl mx-auto', className)}>
      <CardContent className="pt-6 space-y-6">
        {history.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="space-y-1 text-sm">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{item.question}</span>
                </div>
                <div className="ml-6 text-foreground">{item.answer}</div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Circle className="h-4 w-4 text-primary mt-1 animate-pulse" />
            <p className="font-medium">{currentQuestion}</p>
          </div>
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleSubmit()
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Survey Component
export interface QuickSurveyProps {
  question: string
  options: string[]
  onSelect: (option: string) => void
  allowOther?: boolean
  className?: string
}

export function QuickSurvey({
  question,
  options,
  onSelect,
  allowOther = false,
  className,
}: QuickSurveyProps) {
  const [showOther, setShowOther] = React.useState(false)
  const [otherValue, setOtherValue] = React.useState('')

  return (
    <div className={cn('space-y-4', className)}>
      <p className="font-medium">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            variant="outline"
            onClick={() => onSelect(option)}
            className="h-auto py-2 px-4"
          >
            {option}
          </Button>
        ))}
        {allowOther && !showOther && (
          <Button
            variant="ghost"
            onClick={() => setShowOther(true)}
            className="h-auto py-2 px-4"
          >
            Other...
          </Button>
        )}
      </div>
      {showOther && (
        <div className="flex items-center gap-2">
          <Input
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            placeholder="Enter your answer"
            className="flex-1"
          />
          <Button
            onClick={() => {
              if (otherValue.trim()) {
                onSelect(otherValue)
              }
            }}
            disabled={!otherValue.trim()}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  )
}
