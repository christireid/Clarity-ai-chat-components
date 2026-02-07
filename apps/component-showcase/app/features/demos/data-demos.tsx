'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Separator,
  Checkbox,
} from '@clarity-chat/primitives'
import {
  Link,
  DollarSign,
  Key,
  Eye,
  EyeOff,
  Copy,
  Inbox,
  Search,
} from 'lucide-react'

// ============================================================================
// CITATION CHIPS
// ============================================================================
export function CitationChipsDemo() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Citation Chips</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            React hooks were introduced in React 16.8
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer hover:bg-primary/20"
            >
              <Link className="h-3 w-3 mr-1" />
              [1]
            </Badge>
            . The useEffect hook allows you to perform side effects in function
            components
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer hover:bg-primary/20"
            >
              <Link className="h-3 w-3 mr-1" />
              [2]
            </Badge>
            . It combines the functionality of componentDidMount,
            componentDidUpdate, and componentWillUnmount
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer hover:bg-primary/20"
            >
              <Link className="h-3 w-3 mr-1" />
              [3]
            </Badge>
            .
          </p>
          <Separator className="my-4" />
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Sources:
            </p>
            {[
              { num: 1, title: 'React Hooks Documentation', url: 'react.dev' },
              { num: 2, title: 'useEffect API Reference', url: 'react.dev' },
              { num: 3, title: 'React Blog Announcement', url: 'reactjs.org' },
            ].map((source) => (
              <div key={source.num} className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                  {source.num}
                </Badge>
                <span className="font-medium">{source.title}</span>
                <span className="text-muted-foreground">— {source.url}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// COST TRACKER
// ============================================================================
export function CostTrackerDemo() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg">Cost Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-green-500">$0.034</p>
            <p className="text-xs text-muted-foreground">This message</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">$2.45</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">$47.82</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: '48%' }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          48% of $100 monthly budget
        </p>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DATA TABLE
// ============================================================================
export function DataTableDemo() {
  const data = [
    { id: 1, name: 'GPT-4o', requests: 1234, tokens: '2.4M', cost: '$72.00' },
    {
      id: 2,
      name: 'Claude 3.5',
      requests: 856,
      tokens: '1.7M',
      cost: '$51.00',
    },
    {
      id: 3,
      name: 'GPT-4o-mini',
      requests: 2341,
      tokens: '4.2M',
      cost: '$12.60',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Data Table</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t">
          <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-muted text-sm font-medium text-muted-foreground">
            <span>Model</span>
            <span>Requests</span>
            <span>Tokens</span>
            <span>Cost</span>
            <span>Actions</span>
          </div>
          {data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-5 gap-4 px-4 py-3 border-t text-sm hover:bg-muted/50"
            >
              <span className="font-medium">{row.name}</span>
              <span>{row.requests.toLocaleString()}</span>
              <span>{row.tokens}</span>
              <span className="font-mono">{row.cost}</span>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// DYNAMIC FORM
// ============================================================================
export function DynamicFormDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dynamic Form</CardTitle>
        <CardDescription>AI-generated form based on schema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Project Name *</label>
          <Input placeholder="Enter project name" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input placeholder="Enter description" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Model Selection *</label>
          <div className="mt-2 space-y-2">
            {['GPT-4o', 'Claude 3.5 Sonnet', 'GPT-4o-mini'].map((model) => (
              <label
                key={model}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox />
                <span className="text-sm">{model}</span>
              </label>
            ))}
          </div>
        </div>
        <Button className="w-full">Submit</Button>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================
export function EnvironmentVariablesDemo() {
  const envVars = [
    { key: 'OPENAI_API_KEY', value: 'sk-...abc123', masked: true },
    { key: 'ANTHROPIC_API_KEY', value: 'sk-ant-...xyz789', masked: true },
    { key: 'MODEL_TEMPERATURE', value: '0.7', masked: false },
    { key: 'MAX_TOKENS', value: '4096', masked: false },
  ]

  const [showValues, setShowValues] = useState<{ [key: string]: boolean }>({})

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-lg">Environment Variables</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {envVars.map((env, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
            >
              <code className="text-sm font-medium text-primary">
                {env.key}
              </code>
              <span className="text-muted-foreground">=</span>
              <code className="text-sm flex-1 font-mono">
                {env.masked && !showValues[env.key] ? '••••••••••' : env.value}
              </code>
              {env.masked && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setShowValues((prev) => ({
                      ...prev,
                      [env.key]: !prev[env.key],
                    }))
                  }
                >
                  {showValues[env.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// EMPTY STATE
// ============================================================================
export function EmptyStateDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-8">
        <div className="text-center">
          <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-1">No messages yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start a conversation to see messages here
          </p>
          <Button>Start Chat</Button>
        </div>
      </Card>

      <Card className="p-8">
        <div className="text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search or filters
          </p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      </Card>
    </div>
  )
}
