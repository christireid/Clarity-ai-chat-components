'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

interface ComponentSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ComponentSection({
  title,
  description,
  children,
  className,
}: ComponentSectionProps) {
  return (
    <Card className={cn('mb-8', className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  )
}

export function ComponentGrid({
  children,
  cols = 1,
}: {
  children: React.ReactNode
  cols?: 1 | 2 | 3
}) {
  return (
    <div
      className={cn(
        'grid gap-6',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-2 lg:grid-cols-3'
      )}
    >
      {children}
    </div>
  )
}
