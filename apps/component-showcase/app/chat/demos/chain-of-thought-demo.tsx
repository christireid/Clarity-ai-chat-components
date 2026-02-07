'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/primitives'
import { Brain, ChevronUp, ChevronDown } from 'lucide-react'

export function ChainOfThoughtDemo() {
  const [expanded, setExpanded] = useState(true)
  const steps = [
    {
      id: 1,
      content: "Understanding the user's question about React hooks",
      time: '0.2s',
    },
    {
      id: 2,
      content:
        'Identifying relevant concepts: useState, useEffect, custom hooks',
      time: '0.4s',
    },
    {
      id: 3,
      content: 'Recalling best practices from documentation',
      time: '0.6s',
    },
    {
      id: 4,
      content: 'Formulating clear explanation with examples',
      time: '0.8s',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full"
        >
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-500" />
            Chain of Thought
          </CardTitle>
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="relative pl-6 space-y-4">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-violet-500/30" />
            {steps.map((step, i) => (
              <div key={step.id} className="relative flex items-start gap-3">
                <div className="absolute left-[-13px] w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium bg-violet-500 text-white">
                  {i + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm">{step.content}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
