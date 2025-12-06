/**
 * Example: Using shadcn/ui Button Component
 * 
 * This example demonstrates how to use the official shadcn/ui Button
 * component in your Clarity Chat application.
 */

import { ShadcnButton } from '@clarity-chat/primitives'
import { Loader2, Mail, ChevronRight } from 'lucide-react'

export function ButtonExamples() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Basic Variants */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Button Variants</h2>
        <div className="flex gap-2 flex-wrap">
          <ShadcnButton variant="default">Default</ShadcnButton>
          <ShadcnButton variant="secondary">Secondary</ShadcnButton>
          <ShadcnButton variant="destructive">Destructive</ShadcnButton>
          <ShadcnButton variant="outline">Outline</ShadcnButton>
          <ShadcnButton variant="ghost">Ghost</ShadcnButton>
          <ShadcnButton variant="link">Link</ShadcnButton>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Button Sizes</h2>
        <div className="flex gap-2 items-center flex-wrap">
          <ShadcnButton size="sm">Small</ShadcnButton>
          <ShadcnButton size="default">Default</ShadcnButton>
          <ShadcnButton size="lg">Large</ShadcnButton>
        </div>
      </section>

      {/* With Icons */}
      <section>
        <h2 className="text-lg font-semibold mb-3">With Icons</h2>
        <div className="flex gap-2 flex-wrap">
          <ShadcnButton>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </ShadcnButton>
          <ShadcnButton variant="outline">
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </ShadcnButton>
          <ShadcnButton size="icon" variant="outline">
            <Mail className="h-4 w-4" />
          </ShadcnButton>
        </div>
      </section>

      {/* Loading State (Manual) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Loading State</h2>
        <div className="flex gap-2 flex-wrap">
          <ShadcnButton disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </ShadcnButton>
          <ShadcnButton variant="secondary" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </ShadcnButton>
        </div>
      </section>

      {/* Disabled */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Disabled State</h2>
        <div className="flex gap-2 flex-wrap">
          <ShadcnButton disabled>Disabled</ShadcnButton>
          <ShadcnButton variant="secondary" disabled>Disabled</ShadcnButton>
        </div>
      </section>

      {/* As Child (Composition) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">As Child (Link)</h2>
        <ShadcnButton asChild>
          <a href="/dashboard">Go to Dashboard</a>
        </ShadcnButton>
      </section>
    </div>
  )
}

/**
 * Example: Creating a Reusable LoadingButton
 * 
 * Extend shadcn/ui Button with custom loading state functionality
 */
export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

export function LoadingButton({ 
  loading, 
  disabled, 
  children, 
  ...props 
}: LoadingButtonProps) {
  return (
    <ShadcnButton disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  )
}

// Usage:
// <LoadingButton loading={isSubmitting} onClick={handleSubmit}>
//   Submit Form
// </LoadingButton>
