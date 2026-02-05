'use client'

import { useState } from 'react'
import {
  ComponentSection,
  PageHeader,
  ComponentGrid,
} from '@/components/component-section'
import { CodeSnippet, CodeShowcase } from '@/components/code-snippet'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  Checkbox,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Textarea,
  Label,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollArea,
  Separator,
  Kbd,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Progress,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@clarity-chat/primitives'
import {
  ChevronDown,
  Info,
  Plus,
  Minus,
  Play,
  Pause,
} from 'lucide-react'

export default function PrimitivesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [radioValue, setRadioValue] = useState('option1')
  const [sliderValue, setSliderValue] = useState([50])
  const [progressValue, setProgressValue] = useState(60)
  const [buttonVariant, setButtonVariant] = useState<
    'default' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
  >('default')
  const [buttonSize, setButtonSize] = useState<'sm' | 'default' | 'lg'>('default')
  const [badgeVariant, setBadgeVariant] = useState<
    'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
  >('default')

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-cyan -top-40 -right-40 opacity-20" />
        <div className="orb-primary bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Primitives Components"
        description="Base UI components built on Radix UI and shadcn/ui - the foundation for all other components. All components include interactive demos and code examples."
        badge="30+ Components"
      />

      <div className="mb-8 glass-card p-6">
        <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
        <CodeSnippet
          title="Installation & Import"
          code={`// Install the package
npm install @clarity-chat/primitives

// Import components
import {
  Button,
  Dialog,
  Badge,
  Card,
  Tooltip,
  Select,
  RadioGroup,
  Slider,
  Progress,
  // ... and more
} from '@clarity-chat/primitives'`}
        />
      </div>

      <ComponentSection
        title="Button"
        description="Buttons with various variants and states - Interactive controls to test different combinations"
      >
        <div className="space-y-6">
          {/* Interactive Controls */}
          <div className="glass-panel p-4 rounded-lg space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Select Variant
              </Label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'default',
                    'secondary',
                    'outline',
                    'ghost',
                    'link',
                    'destructive',
                  ] as const
                ).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setButtonVariant(variant)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      buttonVariant === variant
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Select Size
              </Label>
              <div className="flex flex-wrap gap-2">
                {(['sm', 'default', 'lg'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setButtonSize(size)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      buttonSize === size
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium mb-3 block">Preview</Label>
              <div className="flex flex-wrap gap-3">
                <Button variant={buttonVariant} size={buttonSize}>
                  Click Me
                </Button>
                <Button variant={buttonVariant} size={buttonSize} state="loading">
                  Loading
                </Button>
                <Button variant={buttonVariant} size={buttonSize} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>

          {/* All Variants Grid */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              All Button Variants
            </Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Button Sizes</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* States */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Button States</Label>
            <div className="flex flex-wrap gap-2">
              <Button state="loading">Loading</Button>
              <Button disabled>Disabled</Button>
              <Button>Normal</Button>
            </div>
          </div>

          {/* Code Example */}
          <Collapsible className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">View Code Example</Label>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <CodeSnippet
                code={`import { Button } from '@clarity-chat/primitives'

// Basic usage
<Button variant="default">Click Me</Button>
<Button variant="destructive">Delete</Button>

// With size
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>

// With loading state
<Button state="loading">Processing...</Button>

// Disabled
<Button disabled>Disabled Button</Button>

// Icon button
<Button size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>`}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ComponentSection>

      <ComponentGrid cols={2}>
        <ComponentSection
          title="Dialog"
          description="Modal dialog with animations"
        >
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This is a description of the dialog. It explains what the
                  dialog is for.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Dialog content goes here. You can put any content inside.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="mt-4">
            <Collapsible>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">View Code Example</Label>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CodeSnippet
                  code={`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@clarity-chat/primitives'

function MyDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Description text here
          </DialogDescription>
        </DialogHeader>
        <div>
          {/* Dialog content */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ComponentSection>

        <ComponentSection
          title="DropdownMenu"
          description="Dropdown menu with items"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ComponentSection>
      </ComponentGrid>

      <ComponentGrid cols={2}>
        <ComponentSection title="Popover" description="Floating popover panel">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <h4 className="font-medium">Popover Content</h4>
                <p className="text-sm text-muted-foreground">
                  This is the popover content. You can put any content here.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </ComponentSection>

        <ComponentSection
          title="Tooltip"
          description="Helpful tooltips on hover"
        >
          <div className="flex gap-4">
            <Tooltip content="This is a tooltip">
              <Button variant="outline">Hover me</Button>
            </Tooltip>
            <Tooltip content="Another tooltip with more information">
              <span className="px-3 py-2 bg-muted rounded cursor-help">
                Info
              </span>
            </Tooltip>
          </div>
        </ComponentSection>
      </ComponentGrid>

      <ComponentSection title="Tabs" description="Tab navigation component">
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Settings</TabsTrigger>
            <TabsTrigger value="tab3">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="p-4 border rounded-lg mt-2">
            <h3 className="font-medium mb-2">Overview Tab</h3>
            <p className="text-sm text-muted-foreground">
              This is the overview content. Tab panels can contain any content.
            </p>
          </TabsContent>
          <TabsContent value="tab2" className="p-4 border rounded-lg mt-2">
            <h3 className="font-medium mb-2">Settings Tab</h3>
            <p className="text-sm text-muted-foreground">
              Configure your settings here.
            </p>
          </TabsContent>
          <TabsContent value="tab3" className="p-4 border rounded-lg mt-2">
            <h3 className="font-medium mb-2">Analytics Tab</h3>
            <p className="text-sm text-muted-foreground">
              View your analytics data.
            </p>
          </TabsContent>
        </Tabs>
      </ComponentSection>

      <ComponentSection
        title="Form Elements"
        description="Input, textarea, checkbox, switch, and select"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Text Input</Label>
              <Input
                id="input"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="textarea">Textarea</Label>
              <Textarea
                id="textarea"
                placeholder="Enter longer text..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="select">Select</Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox"
                checked={checkboxChecked}
                onCheckedChange={(checked) =>
                  setCheckboxChecked(checked as boolean)
                }
              />
              <Label htmlFor="checkbox">Accept terms and conditions</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="switch"
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />
              <Label htmlFor="switch">Enable notifications</Label>
            </div>

            <div className="space-y-2">
              <Label>Input States</Label>
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="With error" className="border-destructive" />
            </div>
          </div>
        </div>
      </ComponentSection>

      <ComponentGrid cols={2}>
        <ComponentSection title="Avatar" description="User avatar display">
          <div className="flex items-center gap-4">
            <Avatar
              src="https://i.pravatar.cc/150?u=1"
              alt="User 1"
              size="sm"
            />
            <Avatar
              src="https://i.pravatar.cc/150?u=2"
              alt="User 2"
              size="default"
            />
            <Avatar
              src="https://i.pravatar.cc/150?u=3"
              alt="User 3"
              size="lg"
            />
            <Avatar fallback="AB" size="lg" />
          </div>
        </ComponentSection>

        <ComponentSection title="Badge" description="Status and label badges - Click to change variant">
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-lg">
              <Label className="text-sm font-medium mb-3 block">
                Select Badge Variant
              </Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {(
                  [
                    'default',
                    'secondary',
                    'outline',
                    'destructive',
                    'success',
                    'warning',
                  ] as const
                ).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setBadgeVariant(variant)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      badgeVariant === variant
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium mb-3 block">Preview</Label>
                <Badge variant={badgeVariant}>Badge Text</Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                All Badge Variants
              </Label>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Badge Examples
              </Label>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Priority:</span>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Count:</span>
                  <Badge>42</Badge>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <Collapsible className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">View Code Example</Label>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CodeSnippet
                  code={`import { Badge } from '@clarity-chat/primitives'

// Different variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>

// Usage examples
<Badge variant="success">Active</Badge>
<Badge variant="destructive">High Priority</Badge>
<Badge>New</Badge>`}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ComponentSection>
      </ComponentGrid>

      <ComponentSection title="Card" description="Content card container">
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card content goes here.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>Click to interact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar src="https://i.pravatar.cc/150?u=4" size="sm" />
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Developer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground">Total users</p>
            </CardContent>
          </Card>
        </div>
      </ComponentSection>

      <ComponentGrid cols={2}>
        <ComponentSection
          title="ScrollArea"
          description="Custom scrollable container"
        >
          <ScrollArea className="h-48 border rounded-lg p-4">
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-sm">
                  Scrollable content item {i + 1}. This demonstrates the
                  ScrollArea component with a custom scrollbar.
                </p>
              ))}
            </div>
          </ScrollArea>
        </ComponentSection>

        <ComponentSection
          title="Separator & Kbd"
          description="Dividers and keyboard keys"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2">Horizontal Separator:</p>
              <Separator />
            </div>

            <div>
              <p className="text-sm mb-2">Keyboard Shortcuts:</p>
              <div className="flex flex-wrap items-center gap-2">
                <Kbd shortcut="mod+k" />
                <span className="text-muted-foreground">
                  Open command palette
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Kbd shortcut="mod+s" />
                <span className="text-muted-foreground">Save</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Kbd shortcut="Escape" />
                <span className="text-muted-foreground">Close dialog</span>
              </div>
            </div>
          </div>
        </ComponentSection>
      </ComponentGrid>

      <ComponentSection
        title="Radio Group"
        description="Radio button group for single selection"
      >
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-lg">
            <Label className="text-sm font-medium mb-3 block">
              Select an option
            </Label>
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="option1" />
                <Label htmlFor="option1" className="cursor-pointer">
                  Option 1
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="option2" />
                <Label htmlFor="option2" className="cursor-pointer">
                  Option 2
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="option3" />
                <Label htmlFor="option3" className="cursor-pointer">
                  Option 3
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option4" id="option4" disabled />
                <Label htmlFor="option4" className="cursor-not-allowed opacity-50">
                  Disabled Option
                </Label>
              </div>
            </RadioGroup>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{radioValue}</span>
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Collapsible>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">View Code Example</Label>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CodeSnippet
                  code={`import { RadioGroup, RadioGroupItem, Label } from '@clarity-chat/primitives'

function MyRadioGroup() {
  const [value, setValue] = useState('option1')

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  )
}`}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </ComponentSection>

      <ComponentGrid cols={2}>
        <ComponentSection title="Slider" description="Range slider input">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Adjust Value: {sliderValue[0]}
              </Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Disabled Slider
              </Label>
              <Slider value={[75]} disabled max={100} step={1} />
            </div>

            <div className="glass-panel p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Current Value:
              </p>
              <p className="text-2xl font-bold">{sliderValue[0]}%</p>
            </div>
          </div>
        </ComponentSection>

        <ComponentSection title="Progress" description="Progress indicator">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Loading...</Label>
                <span className="text-sm text-muted-foreground">
                  {progressValue}%
                </span>
              </div>
              <Progress value={progressValue} />
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setProgressValue(Math.max(0, progressValue - 10))
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setProgressValue(Math.min(100, progressValue + 10))
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  setProgressValue((prev) => (prev >= 100 ? 0 : prev + 1))
                }
              >
                {progressValue >= 100 ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Reset
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Simulate
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Other Examples:
              </Label>
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
          </div>
        </ComponentSection>
      </ComponentGrid>

      <ComponentGrid cols={2}>
        <ComponentSection
          title="AlertDialog"
          description="Alert dialog for critical actions"
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ComponentSection>

        <ComponentSection
          title="HoverCard"
          description="Rich hover preview card"
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="px-0">
                <Info className="h-4 w-4 mr-1" />
                Hover for details
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">HoverCard Component</h4>
                <p className="text-sm text-muted-foreground">
                  A popover that displays rich content when hovering over a
                  trigger element. Perfect for showing additional context without
                  cluttering the interface.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary" className="text-xs">
                    Radix UI
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Accessible
                  </Badge>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </ComponentSection>
      </ComponentGrid>

      <ComponentSection
        title="Collapsible"
        description="Expandable content sections"
      >
        <div className="space-y-4">
          <Collapsible className="glass-panel rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Can I use this in my project?
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Yes! All components in @clarity-chat/primitives are open source
                  and free to use in your projects. They are built on top of Radix
                  UI and are fully customizable with Tailwind CSS.
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Collapsible className="glass-panel rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  What about accessibility?
                </h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  All components follow WCAG 2.1 AA standards and include full
                  keyboard navigation, screen reader support, and focus management.
                </p>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </ComponentSection>
    </div>
  )
}
