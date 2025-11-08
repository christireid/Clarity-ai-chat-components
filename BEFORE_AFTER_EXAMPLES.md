# Before & After Code Examples - v2.2

**Real code showing the visual improvements**

---

## 🎯 No Code Changes Required!

**Important:** These examples show the *visual output* difference, not code you need to change. Your existing code automatically gets the refined visuals when you upgrade to v2.2.

---

## 🔘 Button Component

### Your Code (Unchanged)
```tsx
import { Button } from '@clarity-chat/primitives'

export function MyComponent() {
  return (
    <Button variant="default">
      Click Me
    </Button>
  )
}
```

### What Changed Under the Hood

**Before (v2.1):**
```tsx
// Internal classes that were applied
className="
  shadow-sm                    // 0 1px 2px rgba(0,0,0,0.05)
  hover:shadow-md              // Heavier shadow
  hover:-translate-y-0.5       // 2px lift
  focus-visible:ring-2         // 2px hard ring
  focus-visible:ring-ring      // Full opacity
  px-4                         // 16px padding
"
```

**After (v2.2):**
```tsx
// Internal classes now applied (automatically)
className="
  shadow-xs                         // 0 1px 2px rgba(0,0,0,0.04) ✨
  hover:shadow-md                   // Refined (softer)
  hover:-translate-y-px             // 1px lift ✨
  focus-visible:ring-1              // 1px ring ✨
  focus-visible:ring-ring/50        // 50% opacity ✨
  focus-visible:shadow-focus-primary // Soft glow ✨
  px-5                              // 20px padding ✨
  active:scale-[0.98]               // Tactile feedback ✨
"
```

**Visual Difference:**
- Softer shadow (40% reduction)
- Subtle hover (1px vs 2px)
- Soft focus glow (vs hard ring)
- Better optical balance

---

## 📝 Input Component

### Your Code (Unchanged)
```tsx
import { Input } from '@clarity-chat/primitives'

export function MyForm() {
  return (
    <Input 
      placeholder="Enter your email..."
      type="email"
    />
  )
}
```

### What Changed Under the Hood

**Before (v2.1):**
```tsx
className="
  border-2                     // 2px solid border
  border-input                 // Full opacity
  focus-visible:ring-2         // 2px hard ring
  placeholder:text-muted-foreground  // Full opacity
  px-3                         // 12px padding
"
```

**After (v2.2):**
```tsx
className="
  border                            // 1px border ✨
  border-input/40                   // 40% opacity ✨
  hover:border-input/60             // Responsive hover ✨
  focus-visible:border-input        // 100% on focus
  focus-visible:ring-1              // 1px ring ✨
  focus-visible:ring-primary/20     // Soft ring ✨
  focus-visible:shadow-focus-primary // Outer glow ✨
  placeholder:text-muted-foreground/60  // 60% opacity ✨
  px-3.5                            // 14px padding ✨
"
```

**Visual Difference:**
- Much lighter border when not focused
- Soft focus glow instead of hard ring
- Softer placeholder text
- Better spacing

---

## 🃏 Card Component

### Your Code (Unchanged)
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@clarity-chat/primitives'

export function MyCard() {
  return (
    <Card hoverable>
      <CardHeader>
        <CardTitle>Premium Card</CardTitle>
        <CardDescription>
          This card now has refined borders and shadows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content goes here</p>
      </CardContent>
    </Card>
  )
}
```

### What Changed Under the Hood

**Before (v2.1):**
```tsx
// Card
className="
  border border-border         // Full opacity border
  shadow-sm                    // Standard shadow
  hover:shadow-md              // Moderate increase
  hover:-translate-y-0.5       // 2px lift
"

// CardHeader
className="px-6 py-5"          // Spacious padding

// CardDescription
className="text-muted-foreground"  // Full opacity
```

**After (v2.2):**
```tsx
// Card
className="
  border border-border/40           // 40% opacity ✨
  shadow-sm                         // Refined (softer)
  hover:shadow-lg                   // Refined increase ✨
  hover:-translate-y-px             // 1px lift ✨
  hover:border-border/60            // Border highlight ✨
"

// CardHeader
className="px-6 py-4"               // Tighter ✨

// CardDescription
className="
  text-muted-foreground/80          // 80% opacity ✨
  leading-relaxed                   // Better readability ✨
"
```

**Visual Difference:**
- Subtler border (doesn't compete)
- Refined hover (barely-there lift)
- Better spacing (tighter, more refined)
- Softer description text

---

## 🏷️ Badge Component

### Your Code (Unchanged)
```tsx
import { Badge } from '@clarity-chat/primitives'

export function MyBadges() {
  return (
    <div className="flex gap-2">
      <Badge variant="default">New</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="destructive">Error</Badge>
    </div>
  )
}
```

### What Changed Under the Hood

**Before (v2.1):**
```tsx
// Default variant
className="
  border                       // 1px border
  bg-primary/90                // Solid background
  text-primary-foreground      // White text
  shadow-sm                    // Visible shadow
"
```

**After (v2.2):**
```tsx
// Default variant  
className="
  bg-primary/10                // Transparent background ✨
  text-primary                 // Colored text ✨
  hover:bg-primary/15          // Subtle hover ✨
  // No border ✨
  // No shadow ✨
"
```

**Visual Difference:**
- **Major change**: Borderless, transparent backgrounds
- Cleaner, more modern appearance
- Colored text instead of white
- Subtle hover feedback

---

## 💬 Dialog Component

### Your Code (Unchanged)
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clarity-chat/primitives'

export function MyDialog() {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
        </DialogHeader>
        <div>Are you sure?</div>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### What Changed Under the Hood

**Before (v2.1):**
```tsx
// Backdrop
className="
  bg-black/60                  // 60% dark backdrop
  backdrop-blur-md             // 12px blur
"

// Content
className="
  border                       // Standard border
  shadow-2xl                   // Heavy shadow
  // Animation scale: 0.95
  // Animation duration: 250ms
"

// Close button
className="
  w-8 h-8                      // Standard size
  top-4 right-4                // Standard position
  focus:ring-2                 // Hard ring
"
```

**After (v2.2):**
```tsx
// Backdrop
className="
  bg-black/50                       // 50% (lighter) ✨
  backdrop-blur-md                  
  backdrop-saturate-150             // Richer color ✨
"

// Content
className="
  border border-border/20           // Whisper-light ✨
  shadow-2xl                        // Refined (softer)
  // Animation scale: 0.96 ✨
  // Animation duration: 200ms ✨
"

// Close button
className="
  w-7 h-7                           // Smaller ✨
  top-3 right-3                     // Tighter ✨
  hover:bg-accent/50                // More subtle ✨
  focus:ring-1                      // Softer ring ✨
"
```

**Visual Difference:**
- Lighter, more elegant backdrop
- Whisper-light border on content
- Faster, smoother animation
- Refined close button

---

## 💬 Chat Components

### Message Component

**Your Code (Unchanged):**
```tsx
import { Message } from '@clarity-chat/react'

<Message
  message={{
    id: '1',
    role: 'assistant',
    content: 'Hello!',
    createdAt: new Date(),
  }}
/>
```

**What Changed:**

**Before (v2.1):**
```tsx
// Container
className="p-4 rounded-xl hover:bg-muted/50 hover:shadow-sm"

// Avatar
className="flex-shrink-0"  // No border or shadow

// Name
className="font-semibold text-sm"

// User bubble
className="px-4 py-3 rounded-xl shadow-sm"
```

**After (v2.2):**
```tsx
// Container
className="p-3 rounded-2xl hover:bg-muted/30 hover:shadow-xs" ✨

// Avatar
className="flex-shrink-0 border border-border/20 shadow-xs" ✨

// Name
className="font-medium text-xs tracking-wide text-muted-foreground" ✨

// User bubble
className="px-4 py-2.5 rounded-2xl rounded-tr-md shadow-xs" ✨
```

**Visual Difference:**
- Tighter, more refined layout
- Softer rounded corners (rounded-2xl)
- Chat-style bubble corners for user messages
- Lighter typography and shadows

---

### ChatWindow Component

**Your Code (Unchanged):**
```tsx
import { ChatWindow } from '@clarity-chat/react'

<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  showHeader
  sessionTitle="Chat"
/>
```

**What Changed:**

**Before (v2.1):**
```tsx
// Header
className="
  border-b                     // Standard divider
  bg-card                      // Solid background
  px-6 py-3                    // Spacious padding
"

// Icon container
className="h-9 w-9"            // Standard size

// Title
className="font-semibold"      // Heavy weight
```

**After (v2.2):**
```tsx
// Header
className="
  border-b border-border/40         // Light divider ✨
  bg-card/80 backdrop-blur-sm       // Frosted glass ✨
  px-4 py-3                         // Tighter ✨
"

// Icon container
className="h-8 w-8"                 // Smaller ✨

// Title
className="font-medium"             // Lighter ✨
```

**Visual Difference:**
- Frosted glass header effect
- Lighter divider line
- Tighter, more refined spacing
- Smaller, more refined icons

---

### ChatInput Component

**Your Code (Unchanged):**
```tsx
import { ChatInput } from '@clarity-chat/react'

<ChatInput
  value={input}
  onChange={setInput}
  onSubmit={handleSubmit}
/>
```

**What Changed:**

**Before (v2.1):**
```tsx
// Container
className="p-4 border-t-2"

// Send button
className="shadow-sm"  // Standard size

// Focus glow
boxShadow: '0 0 0 4px hsl(var(--primary) / 0.15)'
```

**After (v2.2):**
```tsx
// Container
className="p-3 border-t border-border/40" ✨

// Send button
className="shadow-xs w-9 h-9"              ✨

// Focus glow
boxShadow: '0 0 0 3px hsl(var(--primary) / 0.08)' ✨
```

**Visual Difference:**
- Lighter top divider
- Slightly smaller send button
- Softer focus glow
- Tighter padding

---

## 🎨 CSS Variable Examples

### Using New Shadow Variables

**Before (v2.1) - Custom Shadow:**
```css
/* You had to define custom shadows */
.my-element {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**After (v2.2) - Use Refined System:**
```tsx
// Just use the refined utilities
<div className="shadow-md">  
  {/* Automatically gets: 0 2px 4px rgba(0,0,0,0.06) */}
</div>
```

---

### Using New Focus Shadow Variables

**Before (v2.1) - Manual Focus:**
```tsx
className="
  focus-visible:ring-2 
  focus-visible:ring-ring
  focus-visible:ring-offset-2
"
```

**After (v2.2) - Refined Focus:**
```tsx
className="
  focus-visible:ring-1 
  focus-visible:ring-ring/50
  focus-visible:ring-offset-1
  focus-visible:shadow-focus-primary
"
// Creates a beautiful soft glow ✨
```

---

### Using Border Opacity Pattern

**Before (v2.1) - Solid Borders:**
```tsx
<Card className="border-2">
  {/* Heavy 2px border */}
</Card>
```

**After (v2.2) - Subtle Borders:**
```tsx
<Card>
  {/* Automatically gets: border border-border/40 */}
  {/* Light 1px border at 40% opacity ✨ */}
</Card>
```

---

## 💡 Custom Styling Still Works

### Override If Needed

```tsx
// Want heavier shadow? No problem:
<Button className="shadow-lg">
  Heavy Shadow
</Button>

// Want full opacity border? Easy:
<Card className="border-border">
  Full Border
</Card>

// Want 2px lift on hover? Sure:
<Button className="hover:-translate-y-0.5">
  Big Lift
</Button>
```

**The defaults are refined, but you have full control.**

---

## 🎯 Common Patterns

### Form with Refined Inputs

```tsx
function RefinedForm() {
  return (
    <form className="space-y-4">
      {/* All inputs automatically get refined borders and focus states */}
      <Input 
        placeholder="Email" 
        type="email"
        // Gets: border-input/40, soft focus glow, 60% placeholder
      />
      
      <Input 
        placeholder="Password" 
        type="password"
        // Gets: Same refinements
      />
      
      <Button type="submit">
        Sign In
        {/* Gets: shadow-xs, 1px hover lift, soft focus glow */}
      </Button>
    </form>
  )
}
```

---

### Card Grid with Hover Effects

```tsx
function CardGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(item => (
        <Card key={item.id} hoverable>
          {/* Automatically gets: 
              - border-border/40 (subtle)
              - shadow-sm (refined)
              - hover:-translate-y-px (1px lift)
              - hover:shadow-lg (refined)
              - hover:border-border/60 (highlighted)
          */}
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>
              {/* Now has /80 opacity and leading-relaxed */}
              {item.description}
            </CardDescription>
          </CardHeader>
          <CardContent>{item.content}</CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

### Status Badges (New Style)

```tsx
function StatusIndicators() {
  return (
    <div className="flex gap-2">
      {/* All badges now have transparent backgrounds and colored text */}
      <Badge variant="success">
        Active
        {/* Gets: bg-green-500/10 text-green-700 (no border, no shadow) */}
      </Badge>
      
      <Badge variant="warning">
        Pending
        {/* Gets: bg-yellow-500/10 text-yellow-700 */}
      </Badge>
      
      <Badge variant="destructive">
        Error
        {/* Gets: bg-destructive/10 text-destructive */}
      </Badge>
    </div>
  )
}
```

**Visual Impact:** Cleaner, less prominent, more modern badges that complement content.

---

### Chat Interface (Complete Example)

```tsx
function ChatApp() {
  const [messages, setMessages] = useState([])
  
  return (
    <ChatWindow
      messages={messages}
      onSendMessage={(content) => {
        setMessages([...messages, {
          id: Date.now().toString(),
          role: 'user',
          content,
          createdAt: new Date(),
        }])
      }}
      showHeader
      sessionTitle="Support Chat"
      sessionSubtitle="We're here to help"
      showMessageCount
      onExport={() => console.log('Export')}
      onClear={() => setMessages([])}
    />
  )
}

/* Automatic v2.2 refinements:
   - Header: Frosted glass with lighter border
   - Icons: Smaller and more refined
   - Messages: Tighter padding, softer shadows
   - Input: Light divider, refined focus
   - Actions: Tighter spacing
   - Overall: Premium, polished appearance
*/
```

---

## 🔄 Migration Examples

### Example 1: Custom Button with Shadows

**Your v2.1 Code:**
```tsx
<Button className="shadow-lg">
  Heavy Shadow Button
</Button>
```

**In v2.2:**
```tsx
<Button className="shadow-lg">
  Heavy Shadow Button
</Button>
// Still works! shadow-lg is now refined (softer) automatically
```

**No changes needed.** Your custom shadow is now refined too.

---

### Example 2: Custom Border Card

**Your v2.1 Code:**
```tsx
<Card className="border-2 border-primary">
  Special Card
</Card>
```

**In v2.2:**
```tsx
<Card className="border-2 border-primary">
  Special Card
</Card>
// Still works! Your override takes precedence
```

**No changes needed.** Custom styles still override defaults.

---

### Example 3: Custom Focus State

**Your v2.1 Code:**
```tsx
<Input className="focus:ring-4 focus:ring-blue-500" />
```

**In v2.2:**
```tsx
<Input className="focus:ring-4 focus:ring-blue-500" />
// Still works! Your custom focus overrides the default
```

**No changes needed.** Custom focus states still work.

---

## 💡 Tips for Getting the Most from v2.2

### 1. Trust the Defaults
v2.2 defaults are carefully crafted. Only override when you have specific needs.

### 2. Use the Refined Shadow System
```tsx
// Good - uses refined system
<div className="shadow-xs">...</div>
<div className="shadow-sm">...</div>
<div className="shadow-md">...</div>

// Avoid - custom shadows
<div className="shadow-[0_4px_8px_rgba(0,0,0,0.1)]">...</div>
```

### 3. Embrace Subtle Borders
```tsx
// Good - subtle default
<div className="border border-border/40">...</div>

// Rarely needed - full opacity
<div className="border border-border">...</div>
```

### 4. Let Focus States Glow
```tsx
// Good - soft glow (automatic in v2.2)
<Button>I have a soft focus glow</Button>

// Avoid - hard rings (old style)
<Button className="focus:ring-2">Old style</Button>
```

---

## 🎯 Complete Component Comparison

### Full Button Example

```tsx
// v2.1 Internal Rendering
<button className="
  inline-flex items-center justify-center gap-2
  rounded-lg text-sm font-medium
  bg-primary text-primary-foreground
  shadow-sm                        // OLD: 0 1px 2px rgba(0,0,0,0.05)
  hover:shadow-md                  // OLD: Heavier
  hover:-translate-y-0.5           // OLD: 2px lift
  focus-visible:ring-2             // OLD: 2px ring
  focus-visible:ring-ring          // OLD: Full opacity
  focus-visible:ring-offset-2      // OLD: 2px offset
  px-4 py-2                        // OLD: Standard padding
  h-10
  transition-all duration-200
">
  Click Me
</button>

// v2.2 Internal Rendering
<button className="
  inline-flex items-center justify-center gap-2
  rounded-lg text-sm font-medium
  bg-primary text-primary-foreground
  shadow-xs                                  // NEW: 0 1px 2px rgba(0,0,0,0.04) ✨
  hover:shadow-md                            // NEW: Refined (softer)
  hover:-translate-y-px                      // NEW: 1px lift ✨
  focus-visible:ring-1                       // NEW: 1px ring ✨
  focus-visible:ring-ring/50                 // NEW: 50% opacity ✨
  focus-visible:ring-offset-1                // NEW: 1px offset ✨
  focus-visible:shadow-focus-primary         // NEW: Soft glow ✨
  active:scale-[0.98]                        // NEW: Tactile feedback ✨
  px-5 py-2                                  // NEW: Better balance ✨
  h-10
  transition-all duration-200
">
  Click Me
</button>
```

**Visual Difference:**
Every detail refined. The button feels lighter, more premium, more modern.

---

## ✅ Summary

### What You Need to Change
**Nothing!** ✅

### What Gets Better Automatically
- ✅ Softer shadows (40% reduction)
- ✅ Lighter borders (1px with opacity)
- ✅ Soft focus glows (modern halos)
- ✅ Subtle hover effects (1px lifts)
- ✅ Refined typography (better weights)
- ✅ Cleaner badges (borderless, transparent)
- ✅ Premium overall appearance

### How to Get It
```bash
npm install @clarity-chat/react@2.2.0
```

**Enjoy premium quality!** ✨

---

**For more examples, see:**
- `/examples/v2.2-showcase` - Interactive demo
- `VISUAL_COMPARISON_V2.2.md` - Detailed comparisons
- `V2.2_QUICK_REFERENCE.md` - Pattern cheat sheet
