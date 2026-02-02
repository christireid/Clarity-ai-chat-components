'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  Search,
  ServerCrash,
  ShieldX,
  Wifi,
  WifiOff,
  FileQuestion,
  Construction,
  Lock,
  Clock,
  Ban,
  HelpCircle,
  Mail,
  MessageCircle,
} from 'lucide-react'

// Base Error Page Component
interface ErrorPageProps {
  code?: string | number
  title: string
  description: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  showSearch?: boolean
  onSearch?: (query: string) => void
  className?: string
  children?: React.ReactNode
}

export function ErrorPage({
  code,
  title,
  description,
  icon,
  actions,
  showSearch,
  onSearch,
  className,
  children,
}: ErrorPageProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center px-4 py-16 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center">
        {icon || (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Error Code */}
      {code && (
        <p className="mb-2 text-7xl font-bold text-muted-foreground/30">
          {code}
        </p>
      )}

      {/* Title */}
      <h1 className="mb-3 text-2xl font-bold tracking-tight md:text-3xl">
        {title}
      </h1>

      {/* Description */}
      <p className="mb-8 max-w-md text-muted-foreground">{description}</p>

      {/* Search */}
      {showSearch && (
        <div className="mb-8 w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for content..."
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  onSearch?.(searchQuery)
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actions}
      </div>

      {/* Additional Content */}
      {children}
    </div>
  )
}

// 404 Not Found
interface NotFoundPageProps {
  onGoHome?: () => void
  onGoBack?: () => void
  onSearch?: (query: string) => void
  suggestedLinks?: { label: string; href: string }[]
  className?: string
}

export function NotFoundPage({
  onGoHome,
  onGoBack,
  onSearch,
  suggestedLinks,
  className,
}: NotFoundPageProps) {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      description="Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed."
      icon={
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
            <Ban className="h-4 w-4" />
          </div>
        </div>
      }
      showSearch
      onSearch={onSearch}
      actions={
        <>
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
        </>
      }
      className={className}
    >
      {suggestedLinks && suggestedLinks.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm text-muted-foreground">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestedLinks.map((link) => (
              <Button key={link.href} variant="link" asChild>
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>
        </div>
      )}
    </ErrorPage>
  )
}

// 500 Server Error
interface ServerErrorPageProps {
  onRetry?: () => void
  onGoHome?: () => void
  onReport?: () => void
  errorId?: string
  className?: string
}

export function ServerErrorPage({
  onRetry,
  onGoHome,
  onReport,
  errorId,
  className,
}: ServerErrorPageProps) {
  return (
    <ErrorPage
      code="500"
      title="Something went wrong"
      description="We're experiencing technical difficulties. Our team has been notified and is working on a fix."
      icon={
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <ServerCrash className="h-12 w-12 text-destructive" />
        </div>
      }
      actions={
        <>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
          {onReport && (
            <Button variant="ghost" onClick={onReport}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          )}
        </>
      }
      className={className}
    >
      {errorId && (
        <p className="mt-6 text-xs text-muted-foreground">
          Error ID:{' '}
          <code className="rounded bg-muted px-1.5 py-0.5">{errorId}</code>
        </p>
      )}
    </ErrorPage>
  )
}

// 403 Forbidden
interface ForbiddenPageProps {
  onGoHome?: () => void
  onGoBack?: () => void
  onRequestAccess?: () => void
  className?: string
}

export function ForbiddenPage({
  onGoHome,
  onGoBack,
  onRequestAccess,
  className,
}: ForbiddenPageProps) {
  return (
    <ErrorPage
      code="403"
      title="Access denied"
      description="You don't have permission to access this page. Please contact your administrator if you think this is a mistake."
      icon={
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <ShieldX className="h-12 w-12 text-destructive" />
        </div>
      }
      actions={
        <>
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
          {onGoHome && (
            <Button onClick={onGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
          {onRequestAccess && (
            <Button variant="secondary" onClick={onRequestAccess}>
              <Lock className="mr-2 h-4 w-4" />
              Request Access
            </Button>
          )}
        </>
      }
      className={className}
    />
  )
}

// Offline Page
interface OfflinePageProps {
  onRetry?: () => void
  className?: string
}

export function OfflinePage({ onRetry, className }: OfflinePageProps) {
  return (
    <ErrorPage
      title="You're offline"
      description="It looks like you've lost your internet connection. Please check your network and try again."
      icon={
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
      }
      actions={
        onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )
      }
      className={className}
    />
  )
}

// Maintenance Page
interface MaintenancePageProps {
  estimatedTime?: string
  onNotifyMe?: (email: string) => void
  className?: string
}

export function MaintenancePage({
  estimatedTime,
  onNotifyMe,
  className,
}: MaintenancePageProps) {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = () => {
    if (email && onNotifyMe) {
      onNotifyMe(email)
      setSubmitted(true)
    }
  }

  return (
    <ErrorPage
      title="Under maintenance"
      description="We're currently performing scheduled maintenance to improve your experience. We'll be back soon!"
      icon={
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10">
          <Construction className="h-12 w-12 text-yellow-600" />
        </div>
      }
      className={className}
    >
      {estimatedTime && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Estimated downtime: {estimatedTime}
        </div>
      )}

      {onNotifyMe && (
        <div className="mt-8 w-full max-w-sm">
          {submitted ? (
            <p className="text-sm text-green-600">
              We'll notify you when we're back online!
            </p>
          ) : (
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={handleSubmit}>
                <Mail className="mr-2 h-4 w-4" />
                Notify Me
              </Button>
            </div>
          )}
        </div>
      )}
    </ErrorPage>
  )
}

// Timeout Page
interface TimeoutPageProps {
  onRetry?: () => void
  onGoHome?: () => void
  className?: string
}

export function TimeoutPage({
  onRetry,
  onGoHome,
  className,
}: TimeoutPageProps) {
  return (
    <ErrorPage
      code="408"
      title="Request timeout"
      description="The server took too long to respond. This might be due to high traffic or a slow connection."
      icon={
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Clock className="h-12 w-12 text-muted-foreground" />
        </div>
      }
      actions={
        <>
          {onRetry && (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button variant="outline" onClick={onGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
        </>
      }
      className={className}
    />
  )
}

// Generic Error Component
interface GenericErrorProps {
  error?: Error
  reset?: () => void
  className?: string
}

export function GenericError({ error, reset, className }: GenericErrorProps) {
  return (
    <ErrorPage
      title="Something went wrong"
      description={
        error?.message || 'An unexpected error occurred. Please try again.'
      }
      icon={
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
      }
      actions={
        reset && (
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )
      }
      className={className}
    />
  )
}
