#!/bin/bash

# shadcn/ui Visual Test - Quick Browser Validation
# Run this to visually test the new shadcn components in a browser

set -e

echo "=================================================="
echo "  shadcn/ui Visual Test Helper"
echo "=================================================="
echo ""
echo "This script helps you visually validate shadcn components."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from workspace root"
    exit 1
fi

echo "📦 Step 1: Installing dependencies..."
pnpm install --silent

echo ""
echo "🔨 Step 2: Building primitives package..."
pnpm build --filter @clarity-chat/primitives --silent

echo ""
echo "✨ Step 3: Creating visual test page..."

# Create a simple test app if it doesn't exist
TEST_APP="apps/examples/shadcn-visual-test"

if [ ! -d "$TEST_APP" ]; then
    echo "  Creating new test app..."
    mkdir -p "$TEST_APP/src"
    
    # Create package.json
    cat > "$TEST_APP/package.json" << 'EOF'
{
  "name": "shadcn-visual-test",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@clarity-chat/primitives": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.556.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.4.1",
    "typescript": "^5.9.3"
  }
}
EOF

    # Create index.html
    cat > "$TEST_APP/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>shadcn/ui Visual Test</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

    # Create vite.config.ts
    cat > "$TEST_APP/vite.config.ts" << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
EOF

    # Create tsconfig.json
    cat > "$TEST_APP/tsconfig.json" << 'EOF'
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "skipLibCheck": true
  },
  "include": ["src"]
}
EOF

    # Create main.tsx
    cat > "$TEST_APP/src/main.tsx" << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

    # Create global CSS with required CSS variables
    cat > "$TEST_APP/src/index.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}
EOF

    # Create App.tsx
    cat > "$TEST_APP/src/App.tsx" << 'EOF'
import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Checkbox,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@clarity-chat/primitives'
import { Loader2, ChevronDown } from 'lucide-react'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">shadcn/ui Visual Test</h1>
            <p className="text-muted-foreground">
              Visual validation of all shadcn components
            </p>
          </div>

          {/* Button Tests */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Buttons</h2>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium">Variants</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Sizes</h3>
                <div className="flex gap-2 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Loader2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Enhanced Features (Loading State)</h3>
                <div className="flex gap-2">
                  <Button loading={loading} onClick={handleLoadingClick}>
                    {loading ? 'Loading...' : 'Click to Test Loading'}
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Dialog Test */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Dialog</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog description. Dialog content goes here.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Dialog body content.</p>
                </div>
              </DialogContent>
            </Dialog>
          </section>

          {/* Dropdown Test */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Dropdown Menu</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Open Menu <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Item 1</DropdownMenuItem>
                <DropdownMenuItem>Item 2</DropdownMenuItem>
                <DropdownMenuItem>Item 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>

          {/* Popover Test */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Popover</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <h3 className="font-medium">Popover Content</h3>
                  <p className="text-sm text-muted-foreground">
                    This is popover content.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </section>

          {/* Tooltip Test */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Tooltip</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip</p>
              </TooltipContent>
            </Tooltip>
          </section>

          {/* Checkbox Test */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Checkbox</h2>
            <div className="flex items-center space-x-2">
              <Checkbox 
                checked={checked} 
                onCheckedChange={setChecked}
                id="terms"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Checked: {checked ? 'Yes' : 'No'}
            </p>
          </section>

          {/* Drawer Test */}
          <section className="space-y-4 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Drawer</h2>
            <Drawer>
              <DrawerTrigger asChild>
                <Button>Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Title</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <p>Drawer content goes here.</p>
                </div>
              </DrawerContent>
            </Drawer>
          </section>

          {/* Success Message */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✅ If you can see and interact with all components above, the migration is successful!
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
EOF

    echo "  ✅ Test app created at: $TEST_APP"
fi

echo ""
echo "🚀 Step 4: Starting development server..."
echo ""
echo "=================================================="
echo "  Opening browser at http://localhost:5173"
echo "=================================================="
echo ""
echo "👀 Visual Checklist:"
echo "  1. ✓ All buttons render correctly"
echo "  2. ✓ Loading button shows spinner"
echo "  3. ✓ Dialog opens and closes"
echo "  4. ✓ Dropdown menu works"
echo "  5. ✓ Popover appears on click"
echo "  6. ✓ Tooltip shows on hover"
echo "  7. ✓ Checkbox toggles"
echo "  8. ✓ Drawer slides in"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$TEST_APP"
pnpm install
pnpm dev
