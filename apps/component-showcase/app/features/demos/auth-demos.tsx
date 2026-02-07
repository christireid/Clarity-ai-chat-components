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
  cn,
} from '@clarity-chat/primitives'
import {
  RefreshCw,
  Plus,
  Settings,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react'

// ============================================================================
// RETRY LOGIC
// ============================================================================
export function RetryLogicDemo() {
  return (
    <Card className="border-red-500/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <RefreshCw className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Request Failed</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Connection timed out. Retrying automatically...
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Attempt 2 of 3</span>
                  <span>Retrying in 3s</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full animate-pulse"
                    style={{ width: '66%' }}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// SETTINGS PANEL
// ============================================================================
export function SettingsPanelDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: 'Dark Mode', description: 'Use dark theme', enabled: true },
          {
            label: 'Notifications',
            description: 'Receive push notifications',
            enabled: true,
          },
          {
            label: 'Sound Effects',
            description: 'Play sounds for events',
            enabled: false,
          },
          {
            label: 'Auto-save',
            description: 'Save conversations automatically',
            enabled: true,
          },
        ].map((setting, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <div
              className={cn(
                'w-11 h-6 rounded-full relative cursor-pointer transition-colors',
                setting.enabled ? 'bg-primary' : 'bg-muted'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  setting.enabled ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MCP MANAGER
// ============================================================================
export function MCPManagerDemo() {
  const mcpServers = [
    { name: 'filesystem', status: 'connected', tools: 12, version: '1.2.0' },
    { name: 'database', status: 'connected', tools: 8, version: '2.0.1' },
    { name: 'web-search', status: 'disconnected', tools: 5, version: '1.0.0' },
    {
      name: 'code-interpreter',
      status: 'connected',
      tools: 15,
      version: '3.1.0',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">MCP Servers</CardTitle>
            <CardDescription>
              Model Context Protocol connections
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Server
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mcpServers.map((server, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  server.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                )}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium font-mono">{server.name}</p>
                  <Badge variant="outline" className="text-xs">
                    v{server.version}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {server.tools} tools available
                </p>
              </div>
              <Badge
                variant={
                  server.status === 'connected' ? 'default' : 'secondary'
                }
              >
                {server.status}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total tools available</span>
          <span className="font-medium">40 tools from 4 servers</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// LOGIN FORM
// ============================================================================
export function LoginFormDemo() {
  return (
    <Card className="max-w-sm mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="you@example.com" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input type="password" placeholder="••••••••" className="mt-1" />
        </div>
        <Button className="w-full">Sign In</Button>
        <div className="relative">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">Google</Button>
          <Button variant="outline">GitHub</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// PASSWORD INPUT
// ============================================================================
export function PasswordInputDemo() {
  const [show, setShow] = useState(false)
  const [strength, setStrength] = useState(2)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Password Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full',
                  i <= strength
                    ? strength === 1
                      ? 'bg-red-500'
                      : strength === 2
                        ? 'bg-yellow-500'
                        : strength >= 3
                          ? 'bg-green-500'
                          : 'bg-muted'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Password strength:{' '}
            {strength === 1
              ? 'Weak'
              : strength === 2
                ? 'Fair'
                : strength === 3
                  ? 'Good'
                  : 'Strong'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
