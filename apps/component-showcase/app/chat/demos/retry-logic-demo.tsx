'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import { useSafeTimeout } from '@clarity-chat/react/internal'
import { RotateCw, Loader2, CheckCircle } from 'lucide-react'
import { STATUS_STYLES } from '@/lib/demo-utils'

export function RetryLogicDemo() {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<
    'idle' | 'retrying' | 'success' | 'failed'
  >('idle')
  const { setSafeTimeout } = useSafeTimeout()

  const simulateRetry = async () => {
    setStatus('retrying')
    setAttempt(1)

    for (let i = 1; i <= 3; i++) {
      await new Promise<void>((r) => {
        setSafeTimeout(r, 1000)
      })
      setAttempt(i + 1)
      if (i === 3) {
        setStatus('success')
      }
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <RotateCw className="h-5 w-5" />
          Retry Logic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Request Status</span>
              <Badge className={cn(STATUS_STYLES[status])}>{status}</Badge>
            </div>
            {status === 'retrying' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Attempt {attempt} of 3...
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{ width: `${(attempt / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Request successful after {attempt - 1} retries
              </div>
            )}
          </div>
          <Button
            onClick={simulateRetry}
            disabled={status === 'retrying'}
            className="w-full gap-2"
          >
            {status === 'retrying' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCw className="h-4 w-4" />
            )}
            Simulate Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
