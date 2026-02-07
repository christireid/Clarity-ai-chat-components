'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  cn,
} from '@clarity-chat/primitives'
import {
  Settings,
  Trash2,
  Activity,
  TrendingUp,
  SkipBack,
  SkipForward,
} from 'lucide-react'

// ============================================================================
// DEV TOOLS DASHBOARD
// ============================================================================
export function DevToolsDashboardDemo() {
  const [activeTab, setActiveTab] = useState('api')

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dev Tools Dashboard
          </CardTitle>
          <Badge className="bg-green-500/20 text-green-600">Connected</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="perf">Performance</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>
          <TabsContent value="api" className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-sm">POST /api/chat</span>
                </div>
                <Badge variant="outline">200 OK</Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>234ms</span>
                <span>2.1KB</span>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-sm">GET /api/models</span>
                </div>
                <Badge variant="outline">200 OK</Badge>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>45ms</span>
                <span>512B</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="perf"
            className="text-center py-8 text-muted-foreground"
          >
            Performance metrics panel
          </TabsContent>
          <TabsContent
            value="state"
            className="text-center py-8 text-muted-foreground"
          >
            State time travel panel
          </TabsContent>
          <TabsContent
            value="models"
            className="text-center py-8 text-muted-foreground"
          >
            Model comparison panel
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// API INSPECTOR
// ============================================================================
export function APIInspectorDemo() {
  const requests = [
    {
      id: 1,
      method: 'POST',
      endpoint: '/api/chat',
      status: 200,
      time: '234ms',
      size: '2.1KB',
    },
    {
      id: 2,
      method: 'GET',
      endpoint: '/api/models',
      status: 200,
      time: '45ms',
      size: '512B',
    },
    {
      id: 3,
      method: 'POST',
      endpoint: '/api/stream',
      status: 200,
      time: '1.2s',
      size: '15KB',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">API Inspector</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              3 requests
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-3 p-2 bg-muted rounded-lg text-sm"
          >
            <Badge
              className={cn(
                'font-mono text-xs',
                req.method === 'POST'
                  ? 'bg-blue-500/20 text-blue-600'
                  : 'bg-green-500/20 text-green-600'
              )}
            >
              {req.method}
            </Badge>
            <span className="font-mono flex-1 truncate">{req.endpoint}</span>
            <Badge variant="outline">{req.status}</Badge>
            <span className="text-muted-foreground text-xs">{req.time}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PROFILER PANEL
// ============================================================================
export function ProfilerPanelDemo() {
  const metrics = [
    { name: 'Render Time', value: '12.3ms', trend: 'down' },
    { name: 'Re-renders', value: '3', trend: 'neutral' },
    { name: 'Memory', value: '45MB', trend: 'up' },
    { name: 'FPS', value: '60', trend: 'neutral' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Performance Profiler</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Activity className="h-3.5 w-3.5" />
            Record
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div key={metric.name} className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">{metric.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-lg font-bold">{metric.value}</p>
                {metric.trend === 'down' && (
                  <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                )}
                {metric.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// TIME TRAVEL
// ============================================================================
export function TimeTravelDemo() {
  const [currentIndex, setCurrentIndex] = useState(3)
  const states = [
    { id: 0, action: 'INIT', time: '0:00' },
    { id: 1, action: 'SET_MESSAGE', time: '0:02' },
    { id: 2, action: 'SEND_REQUEST', time: '0:03' },
    { id: 3, action: 'RECEIVE_RESPONSE', time: '0:05' },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">State Time Travel</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            >
              <SkipBack className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                setCurrentIndex(Math.min(states.length - 1, currentIndex + 1))
              }
            >
              <SkipForward className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {states.map((state, i) => (
          <button
            key={state.id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              'w-full flex items-center gap-3 p-2 rounded-lg text-sm text-left transition-colors',
              i === currentIndex
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-muted'
            )}
          >
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
              {i}
            </span>
            <span className="flex-1 font-mono">{state.action}</span>
            <span className="text-xs text-muted-foreground">{state.time}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MODEL COMPARISON
// ============================================================================
export function ModelComparisonDemo() {
  const models = [
    { name: 'GPT-4o', cost: '$0.005', latency: '234ms', quality: 95 },
    { name: 'Claude 3.5', cost: '$0.003', latency: '198ms', quality: 97 },
    { name: 'GPT-4o-mini', cost: '$0.0001', latency: '89ms', quality: 85 },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {models.map((model, i) => (
            <div
              key={model.name}
              className={cn(
                'p-3 rounded-lg border',
                i === 0 && 'border-primary bg-primary/5'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{model.name}</span>
                {i === 0 && <Badge>Best Value</Badge>}
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Cost</p>
                  <p className="font-mono">{model.cost}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Latency</p>
                  <p className="font-mono">{model.latency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quality</p>
                  <p className="font-mono">{model.quality}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
