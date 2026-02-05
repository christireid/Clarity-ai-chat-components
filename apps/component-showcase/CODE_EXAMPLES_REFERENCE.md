# Code Examples Reference

Quick reference for all code examples added to the primitives showcase.

## Button

```tsx
import { Button } from '@clarity-chat/primitives'

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
</Button>
```

## Badge

```tsx
import { Badge } from '@clarity-chat/primitives'

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
<Badge>New</Badge>
```

## Dialog

```tsx
import {
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
}
```

## RadioGroup

```tsx
import { RadioGroup, RadioGroupItem, Label } from '@clarity-chat/primitives'

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
}
```

## Slider

```tsx
import { Slider } from '@clarity-chat/primitives'

function MySlider() {
  const [value, setValue] = useState([50])

  return (
    <div>
      <p>Value: {value[0]}</p>
      <Slider
        value={value}
        onValueChange={setValue}
        max={100}
        step={1}
      />
    </div>
  )
}
```

## Progress

```tsx
import { Progress } from '@clarity-chat/primitives'

function MyProgress() {
  const [progress, setProgress] = useState(60)

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span>Loading...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} />
      <Button onClick={() => setProgress(prev => Math.min(100, prev + 10))}>
        Increment
      </Button>
    </div>
  )
}
```

## AlertDialog

```tsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@clarity-chat/primitives'

function MyAlertDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## HoverCard

```tsx
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@clarity-chat/primitives'

function MyHoverCard() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Hover for details</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">Title</h4>
          <p className="text-sm text-muted-foreground">
            Description content here
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
```

## Collapsible

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@clarity-chat/primitives'

function MyCollapsible() {
  return (
    <Collapsible>
      <div className="flex items-center justify-between p-4">
        <h4 className="font-semibold">Question?</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="px-4 pb-4">
        <p className="text-sm text-muted-foreground">
          Answer content here
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

## Select

```tsx
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@clarity-chat/primitives'

function MySelect() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## Checkbox

```tsx
import { Checkbox, Label } from '@clarity-chat/primitives'

function MyCheckbox() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(checked) => setChecked(checked as boolean)}
      />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
```

## Switch

```tsx
import { Switch, Label } from '@clarity-chat/primitives'

function MySwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="notifications"
        checked={enabled}
        onCheckedChange={setEnabled}
      />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  )
}
```

## Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clarity-chat/primitives'

function MyTabs() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Settings</TabsTrigger>
        <TabsTrigger value="tab3">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        Overview content
      </TabsContent>
      <TabsContent value="tab2">
        Settings content
      </TabsContent>
      <TabsContent value="tab3">
        Analytics content
      </TabsContent>
    </Tabs>
  )
}
```

## Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@clarity-chat/primitives'

function MyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}
```

## Tooltip

```tsx
import { Tooltip } from '@clarity-chat/primitives'

function MyTooltip() {
  return (
    <Tooltip content="Helpful tooltip text">
      <Button>Hover me</Button>
    </Tooltip>
  )
}

// Or use the raw components for more control
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from '@clarity-chat/primitives'

function AdvancedTooltip() {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip content</p>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}
```

## Input

```tsx
import { Input, Label } from '@clarity-chat/primitives'

function MyInput() {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-2">
      <Label htmlFor="input">Text Input</Label>
      <Input
        id="input"
        placeholder="Enter text..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
```

## Textarea

```tsx
import { Textarea, Label } from '@clarity-chat/primitives'

function MyTextarea() {
  return (
    <div className="space-y-2">
      <Label htmlFor="textarea">Textarea</Label>
      <Textarea
        id="textarea"
        placeholder="Enter longer text..."
        rows={4}
      />
    </div>
  )
}
```

## Installation

```bash
npm install @clarity-chat/primitives
```

## All Available Components

```tsx
import {
  // Buttons
  Button,

  // Overlays
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
  Popover, PopoverTrigger, PopoverContent,
  Tooltip, TooltipProvider, TooltipTrigger, TooltipContent,
  HoverCard, HoverCardTrigger, HoverCardContent,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,

  // Form Inputs
  Input,
  Textarea,
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
  Checkbox,
  RadioGroup, RadioGroupItem,
  Switch,
  Slider,
  Label,

  // Data Display
  Badge,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Avatar,
  Progress,
  Separator,
  Kbd,

  // Layout
  Tabs, TabsList, TabsTrigger, TabsContent,
  ScrollArea,
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from '@clarity-chat/primitives'
```
