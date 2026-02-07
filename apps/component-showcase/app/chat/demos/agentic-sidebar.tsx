'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator,
} from '@clarity-chat/primitives'
import {
  Globe,
  Zap,
  ImageIcon,
  FileText,
  Terminal,
  Calendar,
  Database,
  Download,
  GitBranch,
  Share,
  Archive,
  Wrench,
} from 'lucide-react'

interface TokenUsage {
  input: number
  output: number
  total: number
  budget: number
}

export function AgenticSidebar({ tokenUsage }: { tokenUsage: TokenUsage }) {
  return (
    <div className="space-y-4">
      {/* Available Tools */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            Available Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { name: 'web_search', icon: Globe, desc: 'Search the web' },
            {
              name: 'code_interpreter',
              icon: Terminal,
              desc: 'Execute code',
            },
            { name: 'file_reader', icon: FileText, desc: 'Read files' },
            { name: 'image_gen', icon: ImageIcon, desc: 'Generate images' },
            { name: 'calendar', icon: Calendar, desc: 'Manage events' },
          ].map((tool) => (
            <div
              key={tool.name}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <tool.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium font-mono">{tool.name}</p>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Ready
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Memory & Token Usage */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Memory & Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-600">
              Memory active &bull; Storing context
            </span>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Input tokens</span>
              <span className="font-mono">
                {tokenUsage.input.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Output tokens</span>
              <span className="font-mono">
                {tokenUsage.output.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-medium">
              <span>Total</span>
              <span className="font-mono">
                {tokenUsage.total.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: `${Math.min(100, (tokenUsage.total / tokenUsage.budget) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {Math.round((tokenUsage.total / tokenUsage.budget) * 100)}% of
              budget
            </p>
          </div>
          <div className="mt-3 p-2 bg-primary/5 rounded-lg">
            <p className="text-xs text-muted-foreground">Estimated cost</p>
            <p className="text-lg font-bold text-primary">
              ${((tokenUsage.total / 1000) * 0.01).toFixed(4)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <Download className="h-4 w-4" />
            Export Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <GitBranch className="h-4 w-4" />
            Branch Conversation
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
