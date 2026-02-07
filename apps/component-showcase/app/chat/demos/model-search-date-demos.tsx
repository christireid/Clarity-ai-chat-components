'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  cn,
} from '@clarity-chat/primitives'
import {
  Search,
  MessageSquare,
  Layers,
  Calendar,
  ChevronUp,
} from 'lucide-react'

export function MessageSearchDemo() {
  const [query, setQuery] = useState('')
  const results = [
    { id: 1, content: 'How to implement React hooks...', time: 'Yesterday' },
    { id: 2, content: 'Best practices for TypeScript...', time: '3 days ago' },
    { id: 3, content: 'Understanding async/await...', time: 'Last week' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Message Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="pl-9"
          />
        </div>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm truncate">{result.content}</span>
              <span className="text-xs text-muted-foreground">
                {result.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ModelFallbackDemo() {
  const models = [
    { name: 'GPT-4o', status: 'primary', latency: '234ms' },
    { name: 'Claude 3.5', status: 'fallback', latency: '198ms' },
    { name: 'GPT-4o-mini', status: 'fallback', latency: '89ms' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Model Fallback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {models.map((model, i) => (
            <div
              key={model.name}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border',
                i === 0 && 'border-primary bg-primary/5'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold',
                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{model.name}</p>
                <p className="text-xs text-muted-foreground">
                  Latency: {model.latency}
                </p>
              </div>
              <Badge variant={i === 0 ? 'default' : 'secondary'}>
                {model.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DatePickerDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const now = new Date()
  const currentMonth = now.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })
  // Calculate correct number of days in the current month
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date Picker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-3 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon">
              <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
            </Button>
            <span className="font-medium">{currentMonth}</span>
            <Button variant="ghost" size="icon">
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {days.map((day) => (
              <div key={day} className="text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                className={cn(
                  'py-2 rounded-lg hover:bg-muted transition-colors',
                  day === now.getDate() && 'bg-primary text-primary-foreground'
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
