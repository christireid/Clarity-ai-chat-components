'use client'

import { useState } from 'react'
import {
  ComponentSection,
  PageHeader,
  ComponentGrid,
} from '@/components/component-section'
import { primitivesDocs } from '@/data/docs/primitives-docs'
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
} from '@clarity-chat/primitives'

export default function PrimitivesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(false)
  const [selectValue, setSelectValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="orb-cyan -top-40 -right-40 opacity-20" />
        <div className="orb-primary bottom-40 -left-40 opacity-20" />
      </div>

      <PageHeader
        title="Primitives Components"
        description="Base UI components built on Radix UI and shadcn/ui - the foundation for all other components"
        badge="25+ Components"
      />

      <ComponentSection
        title="Button"
        description="Buttons with various variants and states"
        docs={primitivesDocs['Button']}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">+</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button state="loading">Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </ComponentSection>

      <ComponentGrid cols={2}>
        <ComponentSection
          title="Dialog"
          description="Modal dialog with animations"
          docs={primitivesDocs['Dialog']}
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
        </ComponentSection>

        <ComponentSection
          title="DropdownMenu"
          description="Dropdown menu with items"
          docs={primitivesDocs['DropdownMenu']}
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
        <ComponentSection
          title="Popover"
          description="Floating popover panel"
          docs={primitivesDocs['Popover']}
        >
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
          docs={primitivesDocs['Tooltip']}
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

      <ComponentSection
        title="Tabs"
        description="Tab navigation component"
        docs={primitivesDocs['Tabs']}
      >
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
        docs={primitivesDocs['Form Elements']}
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
        <ComponentSection
          title="Avatar"
          description="User avatar display"
          docs={primitivesDocs['Avatar']}
        >
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

        <ComponentSection
          title="Badge"
          description="Status and label badges"
          docs={primitivesDocs['Badge']}
        >
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </ComponentSection>
      </ComponentGrid>

      <ComponentSection
        title="Card"
        description="Content card container"
        docs={primitivesDocs['Card']}
      >
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
          docs={primitivesDocs['ScrollArea']}
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
          docs={primitivesDocs['Separator & Kbd']}
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
    </div>
  )
}
