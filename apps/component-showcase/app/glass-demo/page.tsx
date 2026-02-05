'use client'

import { useState } from 'react'
import { PageHeader, ComponentSection } from '@/components/component-section'
import {
  GlassMessageBubble,
  GlassToolCard,
  GlassStatusBadge,
  GlassActionButton,
  GlassPanel,
  GlassInputContainer,
  GlassCard,
  GlassDivider,
  GlassIconContainer,
} from '@/components/glass-molecules'
import {
  Avatar,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@clarity-chat/primitives'
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Settings,
  Globe,
  Terminal,
  CheckCircle,
  Loader2,
  Search,
  Mic,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  Brain,
  Zap,
  Code,
  FileText,
  Wrench,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
  Info,
  AlertTriangle,
  Check,
  X,
  Plus,
  Edit3,
  Sparkles,
  Shield,
} from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// ============================================================================
// GLASS MESSAGE BUBBLE DEMO
// ============================================================================
function GlassMessageBubbleDemo() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Assistant Message */}
      <GlassMessageBubble
        variant="assistant"
        avatar={
          <Avatar
            fallback="AI"
            className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 text-white"
          />
        }
        timestamp={<span className="text-muted-foreground">2:30 PM</span>}
        actions={
          <>
            <GlassActionButton variant="ghost" size="sm">
              <Copy className="h-3.5 w-3.5" />
            </GlassActionButton>
            <GlassActionButton variant="ghost" size="sm">
              <ThumbsUp className="h-3.5 w-3.5" />
            </GlassActionButton>
            <GlassActionButton variant="ghost" size="sm">
              <ThumbsDown className="h-3.5 w-3.5" />
            </GlassActionButton>
            <GlassActionButton variant="ghost" size="sm">
              <RefreshCw className="h-3.5 w-3.5" />
            </GlassActionButton>
          </>
        }
      >
        <p className="text-sm">
          I can help you with that! Here's a comprehensive solution to your
          problem. The glassmorphism effect creates a beautiful, modern UI that
          enhances the user experience.
        </p>
      </GlassMessageBubble>

      {/* User Message */}
      <GlassMessageBubble
        variant="user"
        avatar={
          <Avatar
            fallback="U"
            className="w-8 h-8 bg-primary text-primary-foreground"
          />
        }
        timestamp={<span className="text-muted-foreground">2:31 PM</span>}
        status={
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-blue-500" />
            <span>Read</span>
          </div>
        }
      >
        <p className="text-sm">
          That's exactly what I was looking for, thank you!
        </p>
      </GlassMessageBubble>

      {/* System Message */}
      <GlassMessageBubble variant="system">
        <p className="text-xs">
          <Clock className="h-3 w-3 inline mr-1" />
          Conversation started at 2:28 PM
        </p>
      </GlassMessageBubble>
    </div>
  )
}

// ============================================================================
// GLASS TOOL CARD DEMO
// ============================================================================
function GlassToolCardDemo() {
  return (
    <div className="grid gap-3">
      <GlassToolCard
        icon={Globe}
        title="web_search"
        description="Search the web for information"
        status="completed"
        duration="1.2s"
        badge={
          <GlassStatusBadge variant="success" size="sm">
            Ready
          </GlassStatusBadge>
        }
      />

      <GlassToolCard
        icon={Terminal}
        title="code_interpreter"
        description="Execute code in a sandbox"
        status="running"
        duration="0.8s"
        badge={
          <GlassStatusBadge variant="warning" size="sm" pulse>
            Running
          </GlassStatusBadge>
        }
      />

      <GlassToolCard
        icon={FileText}
        title="file_reader"
        description="Read and analyze files"
        status="idle"
        badge={
          <GlassStatusBadge variant="info" size="sm">
            Idle
          </GlassStatusBadge>
        }
      />

      <GlassToolCard
        icon={Brain}
        title="reasoning_engine"
        description="Complex problem solving"
        status="error"
        duration="Failed"
        badge={
          <GlassStatusBadge variant="error" size="sm">
            Error
          </GlassStatusBadge>
        }
      />
    </div>
  )
}

// ============================================================================
// GLASS STATUS BADGE DEMO
// ============================================================================
function GlassStatusBadgeDemo() {
  return (
    <div className="space-y-6">
      {/* Size Variants */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">Sizes</p>
        <div className="flex flex-wrap gap-3">
          <GlassStatusBadge size="sm">Small</GlassStatusBadge>
          <GlassStatusBadge size="md">Medium</GlassStatusBadge>
          <GlassStatusBadge size="lg">Large</GlassStatusBadge>
        </div>
      </div>

      {/* Color Variants */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <GlassStatusBadge variant="default" icon={Activity}>
            Default
          </GlassStatusBadge>
          <GlassStatusBadge variant="success" icon={CheckCircle}>
            Success
          </GlassStatusBadge>
          <GlassStatusBadge variant="warning" icon={AlertTriangle}>
            Warning
          </GlassStatusBadge>
          <GlassStatusBadge variant="error" icon={X}>
            Error
          </GlassStatusBadge>
          <GlassStatusBadge variant="info" icon={Info}>
            Info
          </GlassStatusBadge>
        </div>
      </div>

      {/* With Pulse */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          Animated
        </p>
        <div className="flex flex-wrap gap-3">
          <GlassStatusBadge variant="success" pulse icon={Activity}>
            Active
          </GlassStatusBadge>
          <GlassStatusBadge variant="warning" pulse icon={Loader2}>
            Processing
          </GlassStatusBadge>
          <GlassStatusBadge variant="error" pulse icon={AlertCircle}>
            Alert
          </GlassStatusBadge>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// GLASS ACTION BUTTON DEMO
// ============================================================================
function GlassActionButtonDemo() {
  return (
    <div className="space-y-6">
      {/* Variants */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <GlassActionButton variant="default" icon={Send}>
            Default
          </GlassActionButton>
          <GlassActionButton variant="subtle" icon={Settings}>
            Subtle
          </GlassActionButton>
          <GlassActionButton variant="strong" icon={Zap}>
            Strong
          </GlassActionButton>
          <GlassActionButton variant="ghost" icon={Edit3}>
            Ghost
          </GlassActionButton>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">Sizes</p>
        <div className="flex flex-wrap items-center gap-3">
          <GlassActionButton size="sm" icon={Plus}>
            Small
          </GlassActionButton>
          <GlassActionButton size="md" icon={Plus}>
            Medium
          </GlassActionButton>
          <GlassActionButton size="lg" icon={Plus}>
            Large
          </GlassActionButton>
        </div>
      </div>

      {/* With Icons */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          Icon Positions
        </p>
        <div className="flex flex-wrap gap-3">
          <GlassActionButton icon={Send} iconPosition="left">
            Send Message
          </GlassActionButton>
          <GlassActionButton icon={Search} iconPosition="right">
            Search
          </GlassActionButton>
        </div>
      </div>

      {/* With Glow */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          With Glow Effect
        </p>
        <div className="flex flex-wrap gap-3">
          <GlassActionButton variant="strong" glow icon={Sparkles}>
            Primary Action
          </GlassActionButton>
          <GlassActionButton variant="default" glow icon={Zap}>
            Special
          </GlassActionButton>
        </div>
      </div>

      {/* States */}
      <div>
        <p className="text-sm font-medium mb-3 text-muted-foreground">
          States
        </p>
        <div className="flex flex-wrap gap-3">
          <GlassActionButton icon={Send}>Active</GlassActionButton>
          <GlassActionButton icon={Send} disabled>
            Disabled
          </GlassActionButton>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// GLASS PANEL DEMO
// ============================================================================
function GlassPanelDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Default Panel */}
      <GlassPanel>
        <h3 className="font-semibold mb-2">Default Panel</h3>
        <p className="text-sm text-muted-foreground">
          Standard glass effect with medium padding and border
        </p>
      </GlassPanel>

      {/* Subtle Panel */}
      <GlassPanel variant="subtle">
        <h3 className="font-semibold mb-2">Subtle Panel</h3>
        <p className="text-sm text-muted-foreground">
          Lighter glass effect for secondary content
        </p>
      </GlassPanel>

      {/* Strong Panel */}
      <GlassPanel variant="strong" shadow="lg">
        <h3 className="font-semibold mb-2">Strong Panel</h3>
        <p className="text-sm text-muted-foreground">
          More opaque glass with stronger shadow
        </p>
      </GlassPanel>

      {/* Panel with Glow */}
      <GlassPanel glow gradient>
        <h3 className="font-semibold mb-2">Panel with Effects</h3>
        <p className="text-sm text-muted-foreground">
          Glass panel with glow and gradient background
        </p>
      </GlassPanel>

      {/* Different Paddings */}
      <GlassPanel padding="sm">
        <h3 className="font-semibold mb-2">Small Padding</h3>
        <p className="text-sm text-muted-foreground">Compact content area</p>
      </GlassPanel>

      <GlassPanel padding="lg">
        <h3 className="font-semibold mb-2">Large Padding</h3>
        <p className="text-sm text-muted-foreground">Spacious content area</p>
      </GlassPanel>
    </div>
  )
}

// ============================================================================
// GLASS INPUT CONTAINER DEMO
// ============================================================================
function GlassInputContainerDemo() {
  const [focused1, setFocused1] = useState(false)
  const [focused2, setFocused2] = useState(false)
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Basic Input */}
      <div>
        <label className="text-sm font-medium mb-2 block">Basic Input</label>
        <GlassInputContainer
          focused={focused1}
          icon={<Search className="h-4 w-4" />}
          iconPosition="left"
        >
          <Input
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            onFocus={() => setFocused1(true)}
            onBlur={() => setFocused1(false)}
            placeholder="Search messages..."
            className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
          />
        </GlassInputContainer>
      </div>

      {/* Input with Actions */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Input with Actions
        </label>
        <GlassInputContainer
          focused={focused2}
          actions={
            <>
              <GlassActionButton variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </GlassActionButton>
              <GlassActionButton variant="ghost" size="sm">
                <Mic className="h-4 w-4" />
              </GlassActionButton>
              <GlassActionButton size="sm" icon={Send}>
                Send
              </GlassActionButton>
            </>
          }
        >
          <Input
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            onFocus={() => setFocused2(true)}
            onBlur={() => setFocused2(false)}
            placeholder="Type a message..."
            className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
          />
        </GlassInputContainer>
      </div>

      {/* Error State */}
      <div>
        <label className="text-sm font-medium mb-2 block">Error State</label>
        <GlassInputContainer error icon={<AlertCircle className="h-4 w-4" />}>
          <Input
            placeholder="Invalid input"
            className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
          />
        </GlassInputContainer>
        <p className="text-xs text-red-500 mt-1">This field is required</p>
      </div>

      {/* Variants */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Variant Options
        </label>
        <div className="space-y-3">
          <GlassInputContainer variant="subtle">
            <Input
              placeholder="Subtle variant"
              className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
            />
          </GlassInputContainer>
          <GlassInputContainer variant="default">
            <Input
              placeholder="Default variant"
              className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
            />
          </GlassInputContainer>
          <GlassInputContainer variant="strong">
            <Input
              placeholder="Strong variant"
              className="border-0 bg-transparent focus:ring-0 focus-visible:ring-0"
            />
          </GlassInputContainer>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// GLASS CARD DEMO
// ============================================================================
function GlassCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Simple Card */}
      <GlassCard>
        <h3 className="font-semibold mb-2">Simple Card</h3>
        <p className="text-sm text-muted-foreground">
          A basic glass card with default styling and rounded corners.
        </p>
      </GlassCard>

      {/* Card with Header */}
      <GlassCard
        header={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlassIconContainer icon={Wrench} size="sm" />
              <h3 className="font-semibold">Card with Header</h3>
            </div>
            <GlassStatusBadge variant="success" size="sm">
              Active
            </GlassStatusBadge>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          This card includes a header section with icons and badges.
        </p>
      </GlassCard>

      {/* Card with Footer */}
      <GlassCard
        footer={
          <div className="flex justify-end gap-2">
            <GlassActionButton variant="ghost" size="sm">
              Cancel
            </GlassActionButton>
            <GlassActionButton size="sm" icon={Check}>
              Confirm
            </GlassActionButton>
          </div>
        }
      >
        <h3 className="font-semibold mb-2">Card with Footer</h3>
        <p className="text-sm text-muted-foreground">
          This card has action buttons in the footer.
        </p>
      </GlassCard>

      {/* Complete Card */}
      <GlassCard
        variant="strong"
        shadow="lg"
        glow
        header={
          <div className="flex items-center gap-3">
            <GlassIconContainer icon={Shield} variant="primary" />
            <div>
              <h3 className="font-semibold">Complete Card</h3>
              <p className="text-xs text-muted-foreground">
                With all features
              </p>
            </div>
          </div>
        }
        footer={
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Last updated</span>
            <GlassActionButton size="sm" icon={Edit3}>
              Edit
            </GlassActionButton>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          A fully featured card with header, footer, glow, and strong variant.
        </p>
        <GlassDivider className="my-3" />
        <div className="flex gap-2">
          <GlassStatusBadge variant="success" size="sm">
            Verified
          </GlassStatusBadge>
          <GlassStatusBadge variant="info" size="sm">
            Premium
          </GlassStatusBadge>
        </div>
      </GlassCard>
    </div>
  )
}

// ============================================================================
// UTILITY COMPONENTS DEMO
// ============================================================================
function UtilityComponentsDemo() {
  return (
    <div className="space-y-8">
      {/* Icon Containers */}
      <div>
        <h3 className="font-semibold mb-4">Icon Containers</h3>
        <div className="flex flex-wrap gap-4">
          <GlassIconContainer icon={Brain} variant="primary" size="sm" />
          <GlassIconContainer icon={CheckCircle} variant="success" size="md" />
          <GlassIconContainer icon={AlertTriangle} variant="warning" size="lg" />
          <GlassIconContainer icon={X} variant="error" size="md" />
          <GlassIconContainer icon={Info} variant="info" size="sm" />
        </div>
      </div>

      {/* Dividers */}
      <div>
        <h3 className="font-semibold mb-4">Dividers</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Solid</p>
            <GlassDivider variant="solid" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Gradient</p>
            <GlassDivider variant="gradient" />
          </div>
          <div className="flex gap-4 items-center h-20">
            <p className="text-sm text-muted-foreground">Vertical</p>
            <GlassDivider orientation="vertical" />
            <p className="text-sm text-muted-foreground">Content</p>
            <GlassDivider orientation="vertical" variant="gradient" />
            <p className="text-sm text-muted-foreground">Separator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function GlassDemoPage() {
  return (
    <div className="space-y-12 relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-primary -top-40 -right-40 opacity-30" />
        <div className="orb-violet top-1/2 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Glassmorphism Component Molecules"
        description="Reusable glass-effect components for building modern, beautiful chat interfaces"
        icon={Sparkles}
        badge="6 Molecules"
      />

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-8 flex-wrap h-auto gap-2 p-1 glass-panel">
          <TabsTrigger
            value="messages"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Message Bubbles
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Wrench className="h-4 w-4" />
            Tool Cards
          </TabsTrigger>
          <TabsTrigger
            value="badges"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="h-4 w-4" />
            Status Badges
          </TabsTrigger>
          <TabsTrigger
            value="buttons"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Zap className="h-4 w-4" />
            Action Buttons
          </TabsTrigger>
          <TabsTrigger
            value="panels"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code className="h-4 w-4" />
            Panels & Cards
          </TabsTrigger>
          <TabsTrigger
            value="inputs"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Edit3 className="h-4 w-4" />
            Input Containers
          </TabsTrigger>
          <TabsTrigger
            value="utilities"
            className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="h-4 w-4" />
            Utilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-8">
          <ComponentSection
            title="GlassMessageBubble"
            description="Message containers with glassmorphism effects for different message types"
            icon={MessageSquare}
          >
            <GlassMessageBubbleDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="tools" className="space-y-8">
          <ComponentSection
            title="GlassToolCard"
            description="Tool display cards with status indicators and animations"
            icon={Wrench}
          >
            <GlassToolCardDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="badges" className="space-y-8">
          <ComponentSection
            title="GlassStatusBadge"
            description="Status indicators with multiple variants and sizes"
            icon={Activity}
          >
            <GlassStatusBadgeDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-8">
          <ComponentSection
            title="GlassActionButton"
            description="Interactive buttons with glass effects and glow options"
            icon={Zap}
          >
            <GlassActionButtonDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="panels" className="space-y-8">
          <ComponentSection
            title="GlassPanel"
            description="Content sections with customizable glass effects"
            icon={Code}
          >
            <GlassPanelDemo />
          </ComponentSection>

          <ComponentSection
            title="GlassCard"
            description="Complete card components with header and footer support"
            icon={FileText}
          >
            <GlassCardDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="inputs" className="space-y-8">
          <ComponentSection
            title="GlassInputContainer"
            description="Input wrappers with icons, actions, and state management"
            icon={Edit3}
          >
            <GlassInputContainerDemo />
          </ComponentSection>
        </TabsContent>

        <TabsContent value="utilities" className="space-y-8">
          <ComponentSection
            title="Utility Components"
            description="Icon containers, dividers, and other helper components"
            icon={Settings}
          >
            <UtilityComponentsDemo />
          </ComponentSection>
        </TabsContent>
      </Tabs>
    </div>
  )
}
