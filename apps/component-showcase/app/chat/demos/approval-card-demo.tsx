'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { ShieldCheck, AlertTriangle, CheckCircle, X } from 'lucide-react'

export function ApprovalCardDemo() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(
    'pending'
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Tool Approval
        </CardTitle>
        <CardDescription>
          Human-in-the-loop for sensitive operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'p-4 rounded-lg border-2 border-dashed',
            status === 'pending' && 'border-yellow-500/50 bg-yellow-500/5',
            status === 'approved' && 'border-green-500/50 bg-green-500/5',
            status === 'rejected' && 'border-red-500/50 bg-red-500/5'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                status === 'pending' && 'bg-yellow-500/20',
                status === 'approved' && 'bg-green-500/20',
                status === 'rejected' && 'bg-red-500/20'
              )}
            >
              {status === 'pending' && (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              {status === 'approved' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {status === 'rejected' && <X className="h-5 w-5 text-red-500" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">Delete user data</p>
              <p className="text-sm text-muted-foreground mt-1">
                The AI wants to execute{' '}
                <code className="px-1 py-0.5 bg-muted rounded">
                  delete_user_data
                </code>
              </p>
              <div className="mt-3 p-2 bg-muted rounded font-mono text-xs">
                {`{ "user_id": "usr_123", "reason": "account_deletion" }`}
              </div>
            </div>
          </div>

          {status === 'pending' && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={() => setStatus('approved')}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500"
                onClick={() => setStatus('rejected')}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
          {status !== 'pending' && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setStatus('pending')}
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
