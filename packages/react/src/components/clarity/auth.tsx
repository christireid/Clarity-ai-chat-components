'use client'

import { Textarea } from '@clarity-chat/primitives'

import * as React from 'react'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Github,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  KeyRound,
  Shield,
  Smartphone,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Separator } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Password Strength Indicator
interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++
    return score
  }

  const strength = getStrength(password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = [
    'bg-destructive',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-green-600',
  ]

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i < strength ? strengthColors[strength - 1] : 'bg-muted'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Password strength:{' '}
        <span className="font-medium">
          {strengthLabels[strength - 1] || 'Too short'}
        </span>
      </p>
    </div>
  )
}

// Login Form
interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
  onSocialLogin?: (provider: 'google' | 'github' | 'apple') => void
  isLoading?: boolean
  error?: string
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  onSocialLogin,
  isLoading = false,
  error,
}: LoginFormProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email, password)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-xs text-accent hover:underline"
                onClick={onForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onSocialLogin?.('google')}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" onClick={() => onSocialLogin?.('github')}>
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-accent hover:underline"
            onClick={onSignUp}
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}

// Sign Up Form
interface SignUpFormProps {
  onSubmit?: (data: { name: string; email: string; password: string }) => void
  onSignIn?: () => void
  onSocialLogin?: (provider: 'google' | 'github' | 'apple') => void
  isLoading?: boolean
  error?: string
}

export function SignUpForm({
  onSubmit,
  onSignIn,
  onSocialLogin,
  isLoading = false,
  error,
}: SignUpFormProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ name, email, password })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onSocialLogin?.('google')}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" onClick={() => onSocialLogin?.('github')}>
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            className="text-accent hover:underline"
            onClick={onSignIn}
          >
            Sign in
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}

// OTP Input
interface OTPInputProps {
  length?: number
  onComplete?: (otp: string) => void
  isLoading?: boolean
  error?: string
}

export function OTPInput({
  length = 6,
  onComplete,
  isLoading = false,
  error,
}: OTPInputProps) {
  const [otp, setOtp] = React.useState(Array(length).fill(''))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit) && newOtp.join('').length === length) {
      onComplete?.(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((digit, i) => {
      if (i < length) newOtp[i] = digit
    })
    setOtp(newOtp)

    if (newOtp.every((digit) => digit)) {
      onComplete?.(newOtp.join(''))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            className={cn(
              'w-12 h-12 text-center text-lg font-semibold',
              error && 'border-destructive'
            )}
          />
        ))}
      </div>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  )
}

// API Key Display
interface APIKeyDisplayProps {
  apiKey: string
  name?: string
  createdAt?: Date
  lastUsed?: Date
  onRevoke?: () => void
  onRegenerate?: () => void
}

export function APIKeyDisplay({
  apiKey,
  name,
  createdAt,
  lastUsed,
  onRevoke,
  onRegenerate,
}: APIKeyDisplayProps) {
  const [isRevealed, setIsRevealed] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const maskedKey = apiKey.slice(0, 8) + '•'.repeat(24) + apiKey.slice(-4)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              {name && <p className="font-medium text-sm">{name}</p>}
              <code className="text-xs font-mono text-muted-foreground">
                {isRevealed ? apiKey : maskedKey}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsRevealed(!isRevealed)}
            >
              {isRevealed ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </Button>
          </div>
        </div>
        {(createdAt || lastUsed) && (
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {createdAt && (
              <span>Created: {createdAt.toLocaleDateString()}</span>
            )}
            {lastUsed && (
              <span>Last used: {lastUsed.toLocaleDateString()}</span>
            )}
          </div>
        )}
        {(onRevoke || onRegenerate) && (
          <div className="flex items-center gap-2 mt-3">
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                Regenerate
              </Button>
            )}
            {onRevoke && (
              <Button variant="destructive" size="sm" onClick={onRevoke}>
                Revoke
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Profile Card Component
interface ProfileCardProps {
  user: {
    name: string
    email: string
    avatar?: string
    role?: string
    joinedAt?: Date
    plan?: string
  }
  onEdit?: () => void
  onSignOut?: () => void
  className?: string
}

export function ProfileCard({
  user,
  onEdit,
  onSignOut,
  className,
}: ProfileCardProps) {
  return (
    <Card className={cn('w-full max-w-sm', className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
            {user.avatar ? (
              <img
                src={user.avatar || '/placeholder.svg'}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            {user.role && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                {user.role}
              </span>
            )}
          </div>
        </div>
        {(user.joinedAt || user.plan) && (
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
            {user.joinedAt && (
              <div className="flex justify-between">
                <span>Member since</span>
                <span>{user.joinedAt.toLocaleDateString()}</span>
              </div>
            )}
            {user.plan && (
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-medium text-foreground">{user.plan}</span>
              </div>
            )}
          </div>
        )}
        {(onEdit || onSignOut) && (
          <div className="mt-4 pt-4 border-t border-border flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={onEdit}
              >
                Edit Profile
              </Button>
            )}
            {onSignOut && (
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Profile Editor Component
interface ProfileEditorProps {
  user: {
    name: string
    email: string
    avatar?: string
    bio?: string
  }
  onSave?: (data: { name: string; email: string; bio?: string }) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function ProfileEditor({
  user,
  onSave,
  onCancel,
  isLoading = false,
  className,
}: ProfileEditorProps) {
  const [name, setName] = React.useState(user.name)
  const [email, setEmail] = React.useState(user.email)
  const [bio, setBio] = React.useState(user.bio || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.({ name, email, bio })
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-semibold text-primary">
                {user.avatar ? (
                  <img
                    src={user.avatar || '/placeholder.svg'}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-transparent"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
