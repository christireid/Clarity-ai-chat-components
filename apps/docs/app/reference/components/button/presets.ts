import { PlaygroundPreset, PlaygroundControl } from '@/components/Demo/EnhancedPlayground'

export const buttonPresets: PlaygroundPreset[] = [
  {
    name: 'Basic',
    description: 'Simple default button',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <Button>Click me</Button>
    </div>
  )
}`,
  },
  {
    name: 'Variants',
    description: 'All button style variants',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="success">Success</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
}`,
  },
  {
    name: 'Sizes',
    description: 'Different button sizes',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <Button size="xs" variant="primary">Extra Small</Button>
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  )
}`,
  },
  {
    name: 'With Icons',
    description: 'Buttons with icon elements',
    code: `import { Button } from '@clarity-chat/react'
import { Send, Download, Plus } from 'lucide-react'

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <Button variant="primary">
        <Send className="w-4 h-4 mr-2" />
        Send Message
      </Button>
      <Button variant="secondary">
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
      <Button variant="success" size="sm">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  )
}`,
  },
  {
    name: 'Loading State',
    description: 'Button with loading spinner',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <Button variant="primary" isLoading>
        Saving...
      </Button>
      <Button variant="secondary" isLoading>
        Processing
      </Button>
      <Button variant="success" isLoading disabled>
        Loading
      </Button>
    </div>
  )
}`,
  },
  {
    name: 'Disabled',
    description: 'Disabled button state',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <Button disabled>Default Disabled</Button>
      <Button variant="primary" disabled>Primary Disabled</Button>
      <Button variant="danger" disabled>Danger Disabled</Button>
    </div>
  )
}`,
  },
  {
    name: 'Full Width',
    description: 'Button spanning full width',
    code: `import { Button } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="space-y-3 p-8 max-w-md mx-auto">
      <Button variant="primary" fullWidth>
        Sign In
      </Button>
      <Button variant="secondary" fullWidth>
        Create Account
      </Button>
      <Button variant="ghost" fullWidth>
        Cancel
      </Button>
    </div>
  )
}`,
  },
]

export const buttonControls: PlaygroundControl[] = [
  {
    name: 'variant',
    label: 'Variant',
    type: 'select',
    defaultValue: 'primary',
    options: [
      'default',
      'primary',
      'secondary',
      'success',
      'warning',
      'danger',
      'ghost',
      'link',
      'outline',
    ],
    description: 'Visual style of the button',
  },
  {
    name: 'size',
    label: 'Size',
    type: 'select',
    defaultValue: 'md',
    options: ['xs', 'sm', 'md', 'lg'],
    description: 'Button size',
  },
  {
    name: 'disabled',
    label: 'Disabled',
    type: 'boolean',
    defaultValue: false,
    description: 'Disable button interaction',
  },
  {
    name: 'isLoading',
    label: 'Loading State',
    type: 'boolean',
    defaultValue: false,
    description: 'Show loading spinner',
  },
  {
    name: 'fullWidth',
    label: 'Full Width',
    type: 'boolean',
    defaultValue: false,
    description: 'Span full container width',
  },
]
