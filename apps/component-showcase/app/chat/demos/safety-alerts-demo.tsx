'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@clarity-chat/primitives'
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Timer,
} from 'lucide-react'

export function SafetyAlertsDemo() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Safety & Guardrails
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          {
            type: 'success',
            title: 'Safe Response',
            message: 'Content passed all safety checks',
            icon: ShieldCheck,
          },
          {
            type: 'warning',
            title: 'Caution',
            message: 'Response may contain sensitive information',
            icon: AlertTriangle,
          },
          {
            type: 'error',
            title: 'Blocked',
            message: 'Request was blocked due to policy violation',
            icon: ShieldAlert,
          },
          {
            type: 'info',
            title: 'Rate Limited',
            message: 'Request throttled - 5 requests per minute',
            icon: Timer,
          },
        ].map((alert) => (
          <div
            key={alert.type}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border',
              alert.type === 'success' && 'bg-green-500/10 border-green-500/30',
              alert.type === 'warning' &&
                'bg-yellow-500/10 border-yellow-500/30',
              alert.type === 'error' && 'bg-red-500/10 border-red-500/30',
              alert.type === 'info' && 'bg-blue-500/10 border-blue-500/30'
            )}
          >
            <alert.icon
              className={cn(
                'h-5 w-5 shrink-0',
                alert.type === 'success' && 'text-green-500',
                alert.type === 'warning' && 'text-yellow-500',
                alert.type === 'error' && 'text-red-500',
                alert.type === 'info' && 'text-blue-500'
              )}
            />
            <div>
              <p className="font-medium text-sm">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
