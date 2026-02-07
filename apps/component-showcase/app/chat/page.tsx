'use client'

import { PageHeader, ComponentSection } from '@/components/component-section'
import { chatDocs } from '@/data/docs/chat-docs'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import {
  MessageSquare,
  Brain,
  Code,
  Terminal,
  FolderOpen,
  Wrench,
  Shield,
  ShieldCheck,
  RotateCw,
  Layers,
  Edit3,
  Reply,
  Search,
  Link,
  FileText,
  Bell,
  Users,
  Inbox,
  AlertCircle,
  Calendar,
} from 'lucide-react'

// Demo components extracted into focused modules
import { AdvancedAgenticChatDemo } from './demos/agentic-chat-demo'
import { CodeTerminalDemo } from './demos/code-terminal-demo'
import { FileTreeDemo } from './demos/file-tree-demo'
import { SafetyAlertsDemo } from './demos/safety-alerts-demo'
import { ApprovalCardDemo } from './demos/approval-card-demo'
import { ChainOfThoughtDemo } from './demos/chain-of-thought-demo'
import { RetryLogicDemo } from './demos/retry-logic-demo'
import {
  MessageSearchDemo,
  ModelFallbackDemo,
  DatePickerDemo,
} from './demos/model-search-date-demos'
import {
  EmptyStateDemo,
  ErrorPageDemo,
  MessageDraftsDemo,
  QuickRepliesDemo,
  NotificationsDemo,
  PersonasDemo,
  SourcesDemo,
  InlineCitationsDemo,
} from './demos/small-demos'

// Force dynamic rendering to avoid SSR issues with complex components
export const dynamic = 'force-dynamic'

export default function ChatPage() {
  return (
    <div className="space-y-12 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-30" />
        <div className="orb-violet top-1/2 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Advanced Chat Components"
        description="Comprehensive showcase of all chat, agentic, code, tool-calling, and workflow components with full working functionality"
        icon={MessageSquare}
        badge="45+ Components"
      />

      <Tabs defaultValue="agentic" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="agentic"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Brain className="h-4 w-4" />
            Agentic Chat
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code className="h-4 w-4" />
            Code & Files
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Wrench className="h-4 w-4" />
            Tools & Approval
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="ui"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layers className="h-4 w-4" />
            UI Components
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agentic" className="space-y-8">
          <ComponentSection
            title="Agentic Chat with Tool Calling"
            description="Full-featured chat with thinking, tools, citations, and token tracking"
            icon={Brain}
            docs={chatDocs['Agentic Chat with Tool Calling']}
          >
            <AdvancedAgenticChatDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="code" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Code Editor & Terminal"
              description="Syntax-highlighted code with live execution"
              icon={Terminal}
              docs={chatDocs['Code Editor & Terminal']}
            >
              <CodeTerminalDemo />
            </ComponentSection>
            <ComponentSection
              title="File Explorer"
              description="Navigate project structure"
              icon={FolderOpen}
              docs={chatDocs['File Explorer']}
            >
              <FileTreeDemo />
            </ComponentSection>
          </div>
          <ComponentSection
            title="Chain of Thought"
            description="AI reasoning visualization"
            icon={Brain}
            docs={chatDocs['Chain of Thought']}
          >
            <ChainOfThoughtDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tools" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Tool Approval"
              description="Human-in-the-loop"
              icon={ShieldCheck}
              docs={chatDocs['Tool Approval']}
            >
              <ApprovalCardDemo />
            </ComponentSection>
            <ComponentSection
              title="Safety & Guardrails"
              description="Content moderation"
              icon={Shield}
              docs={chatDocs['Safety & Guardrails']}
            >
              <SafetyAlertsDemo />
            </ComponentSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Retry Logic"
              description="Automatic retry with backoff"
              icon={RotateCw}
              docs={chatDocs['Retry Logic']}
            >
              <RetryLogicDemo />
            </ComponentSection>
            <ComponentSection
              title="Model Fallback"
              description="Automatic model failover"
              icon={Layers}
              docs={chatDocs['Model Fallback']}
            >
              <ModelFallbackDemo />
            </ComponentSection>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Drafts & Archive"
              description="Message drafts and archiving"
              icon={Edit3}
              docs={chatDocs['Drafts & Archive']}
            >
              <MessageDraftsDemo />
            </ComponentSection>
            <ComponentSection
              title="Quick Replies"
              description="Pre-defined responses"
              icon={Reply}
              docs={chatDocs['Quick Replies']}
            >
              <QuickRepliesDemo />
            </ComponentSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Message Search"
              description="Full-text search"
              icon={Search}
              docs={chatDocs['Message Search']}
            >
              <MessageSearchDemo />
            </ComponentSection>
            <ComponentSection
              title="Sources"
              description="Citation sources"
              icon={Link}
              docs={chatDocs['Sources']}
            >
              <SourcesDemo />
            </ComponentSection>
          </div>
          <ComponentSection
            title="Inline Citations"
            description="Citations within text"
            icon={FileText}
            docs={chatDocs['Inline Citations']}
          >
            <InlineCitationsDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="ui" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Notifications"
              description="Real-time alerts"
              icon={Bell}
              docs={chatDocs['Notifications']}
            >
              <NotificationsDemo />
            </ComponentSection>
            <ComponentSection
              title="Personas"
              description="AI personas"
              icon={Users}
              docs={chatDocs['Personas']}
            >
              <PersonasDemo />
            </ComponentSection>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentSection
              title="Empty States"
              description="Empty content handling"
              icon={Inbox}
              docs={chatDocs['Empty States']}
            >
              <EmptyStateDemo />
            </ComponentSection>
            <ComponentSection
              title="Error States"
              description="Error handling"
              icon={AlertCircle}
              docs={chatDocs['Error States']}
            >
              <ErrorPageDemo />
            </ComponentSection>
          </div>
          <ComponentSection
            title="Date Picker"
            description="Date selection"
            icon={Calendar}
            docs={chatDocs['Date Picker']}
          >
            <DatePickerDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
