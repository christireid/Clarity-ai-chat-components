'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  Eye,
  EyeOff,
  Check,
  X,
  Copy,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Password Input with Toggle
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean
  onStrengthChange?: (strength: PasswordStrength) => void
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, showStrength, onStrengthChange, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [strength, setStrength] = React.useState<PasswordStrength | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrength) {
      const newStrength = calculatePasswordStrength(e.target.value)
      setStrength(newStrength)
      onStrengthChange?.(newStrength)
    }
    props.onChange?.(e)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {showStrength && strength && (
        <PasswordStrengthIndicator strength={strength} />
      )}
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'

// Password Strength Types
export interface PasswordStrength {
  score: number // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'
  color: string
  feedback: string[]
  checks: PasswordCheck[]
}

interface PasswordCheck {
  label: string
  passed: boolean
}

// Calculate Password Strength
export function calculatePasswordStrength(password: string): PasswordStrength {
  const checks: PasswordCheck[] = [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'Contains uppercase', passed: /[A-Z]/.test(password) },
    { label: 'Contains lowercase', passed: /[a-z]/.test(password) },
    { label: 'Contains number', passed: /\d/.test(password) },
    {
      label: 'Contains special character',
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    { label: 'At least 12 characters', passed: password.length >= 12 },
  ]

  const passedCount = checks.filter((c) => c.passed).length

  let score: number
  let label: PasswordStrength['label']
  let color: string

  if (password.length === 0) {
    score = 0
    label = 'Very Weak'
    color = 'bg-muted'
  } else if (passedCount <= 1) {
    score = 0
    label = 'Very Weak'
    color = 'bg-destructive'
  } else if (passedCount <= 2) {
    score = 1
    label = 'Weak'
    color = 'bg-orange-500'
  } else if (passedCount <= 3) {
    score = 2
    label = 'Fair'
    color = 'bg-yellow-500'
  } else if (passedCount <= 4) {
    score = 3
    label = 'Strong'
    color = 'bg-green-500'
  } else {
    score = 4
    label = 'Very Strong'
    color = 'bg-green-600'
  }

  const feedback = checks.filter((c) => !c.passed).map((c) => c.label)

  return { score, label, color, feedback, checks }
}

// Password Strength Indicator
interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength
  showChecks?: boolean
  className?: string
}

export function PasswordStrengthIndicator({
  strength,
  showChecks = false,
  className,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 w-8 rounded-full transition-colors',
                i <= strength.score ? strength.color : 'bg-muted'
              )}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{strength.label}</span>
      </div>
      {showChecks && (
        <div className="grid grid-cols-2 gap-1">
          {strength.checks.map((check) => (
            <div key={check.label} className="flex items-center gap-1 text-xs">
              {check.passed ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground" />
              )}
              <span
                className={cn(
                  check.passed ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {check.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Password Generator
interface PasswordGeneratorProps {
  length?: number
  onGenerate?: (password: string) => void
  className?: string
}

export function PasswordGenerator({
  length = 16,
  onGenerate,
  className,
}: PasswordGeneratorProps) {
  const [password, setPassword] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [options, setOptions] = React.useState({
    length,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })

  const generatePassword = React.useCallback(() => {
    let chars = ''
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (options.numbers) chars += '0123456789'
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz'

    let result = ''
    for (let i = 0; i < options.length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
    onGenerate?.(result)
    return result
  }, [options, onGenerate])

  const copyPassword = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  React.useEffect(() => {
    generatePassword()
  }, [])

  const strength = calculatePasswordStrength(password)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={password}
            readOnly
            className="pr-20 font-mono text-sm"
          />
          <div className="absolute right-1 top-1 flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={copyPassword}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? 'Copied!' : 'Copy'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => generatePassword()}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate new</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <PasswordStrengthIndicator strength={strength} />

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="length" className="text-sm">
            Length: {options.length}
          </Label>
          <input
            id="length"
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) =>
              setOptions({ ...options, length: parseInt(e.target.value) })
            }
            className="w-32"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'uppercase', label: 'Uppercase (A-Z)' },
            { key: 'lowercase', label: 'Lowercase (a-z)' },
            { key: 'numbers', label: 'Numbers (0-9)' },
            { key: 'symbols', label: 'Symbols (!@#)' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={options[key as keyof typeof options] as boolean}
                onChange={(e) =>
                  setOptions({ ...options, [key]: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={() => generatePassword()} className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate New Password
      </Button>
    </div>
  )
}

// Password Confirmation Input
interface PasswordConfirmationProps {
  password: string
  onConfirmChange?: (isMatch: boolean) => void
  className?: string
}

export function PasswordConfirmation({
  password,
  onConfirmChange,
  className,
}: PasswordConfirmationProps) {
  const [confirm, setConfirm] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const isMatch = password === confirm && confirm.length > 0
  const showError = confirm.length > 0 && !isMatch

  React.useEffect(() => {
    onConfirmChange?.(isMatch)
  }, [isMatch, onConfirmChange])

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="confirm-password">Confirm Password</Label>
      <div className="relative">
        <Input
          id="confirm-password"
          type={showPassword ? 'text' : 'password'}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={cn(
            'pr-16',
            showError && 'border-destructive focus-visible:ring-destructive'
          )}
          placeholder="Re-enter password"
        />
        <div className="absolute right-0 top-0 flex h-full items-center gap-1 pr-3">
          {confirm.length > 0 &&
            (isMatch ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-destructive" />
            ))}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
      {showError && (
        <p className="text-xs text-destructive">Passwords do not match</p>
      )}
    </div>
  )
}

// Password Security Badge
interface PasswordSecurityBadgeProps {
  strength: PasswordStrength
  className?: string
}

export function PasswordSecurityBadge({
  strength,
  className,
}: PasswordSecurityBadgeProps) {
  const getIcon = () => {
    if (strength.score <= 1) return <ShieldAlert className="h-4 w-4" />
    if (strength.score <= 2) return <Shield className="h-4 w-4" />
    return <ShieldCheck className="h-4 w-4" />
  }

  const getColorClass = () => {
    if (strength.score <= 1) return 'text-destructive bg-destructive/10'
    if (strength.score === 2) return 'text-yellow-600 bg-yellow-500/10'
    return 'text-green-600 bg-green-500/10'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        getColorClass(),
        className
      )}
    >
      {getIcon()}
      {strength.label}
    </div>
  )
}
