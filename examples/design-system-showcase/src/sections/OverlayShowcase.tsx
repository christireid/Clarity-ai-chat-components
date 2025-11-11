/**
 * Overlay Showcase
 * 
 * Demonstrates dialogs, tooltips, popovers, and drawer components
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Tooltip, Button, Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@clarity-chat/primitives'

export function OverlayShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Overlay Components</h2>
        <p className="text-muted-foreground">
          Dialogs, tooltips, popovers, and drawers with refined animations and focus management
        </p>
      </div>

      {/* Dialog Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Dialog (Modal)</h3>
        <div className="space-y-4">
          <Button onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  This is a dialog component with refined styling. Notice the:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>rounded-lg corners (8px)</li>
                  <li>ring-1 ring-border border</li>
                  <li>shadow-xl for high elevation</li>
                  <li>backdrop-blur-sm background</li>
                  <li>Smooth fade-in animation</li>
                </ul>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Confirm
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Dialog Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Backdrop: bg-black/50 backdrop-blur-sm</li>
              <li>• Content: rounded-lg ring-1 ring-border shadow-xl</li>
              <li>• Focus trap and keyboard navigation</li>
              <li>• ESC to close</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tooltip Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Tooltips</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Tooltip content="This is a helpful tooltip">
              <Button>Hover for Tooltip</Button>
            </Tooltip>
            
            <Tooltip content="Tooltips can have longer text that wraps">
              <Button variant="outline">Long Tooltip</Button>
            </Tooltip>
            
            <Tooltip content="Action hint" delay={0}>
              <Button variant="ghost">Instant Tooltip</Button>
            </Tooltip>
          </div>

          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Tooltip Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• rounded-md with ring-1 ring-border/50</li>
              <li>• shadow-xs for subtle depth</li>
              <li>• backdrop-blur-sm</li>
              <li>• Configurable delay</li>
              <li>• Smart positioning</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Drawer Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Drawer (Sidebar)</h3>
        <div className="space-y-4">
          <Button onClick={() => setDrawerOpen(true)}>
            Open Drawer
          </Button>
          
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerContent side="right">
              <DrawerHeader>
                <DrawerTitle>Drawer Title</DrawerTitle>
              </DrawerHeader>
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  This is a drawer component (sidebar) with:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Smooth slide-in animation</li>
                  <li>Refined shadows and borders</li>
                  <li>Focus management</li>
                  <li>Backdrop overlay</li>
                </ul>
                <div className="pt-4">
                  <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                    Close Drawer
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Drawer Features:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Backdrop: bg-black/50 backdrop-blur-sm</li>
              <li>• Content: ring-1 ring-border/50 shadow-xl</li>
              <li>• Slide-in from left/right/top/bottom</li>
              <li>• Focus trap</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Overlay Comparison */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Overlay Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Dialog</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Center screen</li>
              <li>• Modal interaction</li>
              <li>• shadow-xl</li>
              <li>• Use for confirmations</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Tooltip</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Contextual hint</li>
              <li>• Non-blocking</li>
              <li>• shadow-xs</li>
              <li>• Use for help text</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Drawer</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Side panel</li>
              <li>• More content space</li>
              <li>• shadow-xl</li>
              <li>• Use for navigation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Code Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`import { Dialog, Tooltip, Drawer } from '@clarity-chat/primitives'

// Dialog
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>

// Tooltip
<Tooltip content="Helpful tip">
  <Button>Hover me</Button>
</Tooltip>

// Drawer
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
    </DrawerHeader>
    {/* Content */}
  </DrawerContent>
</Drawer>`}</code>
        </pre>
      </section>
    </div>
  )
}
