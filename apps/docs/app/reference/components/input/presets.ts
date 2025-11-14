import { PlaygroundPreset, PlaygroundControl } from '@/components/Demo/EnhancedPlayground'

export const inputPresets: PlaygroundPreset[] = [
  {
    name: 'Basic',
    description: 'Simple text input',
    code: `import { Input } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Input placeholder="Type something..." />
    </div>
  )
}`,
  },
  {
    name: 'With Label',
    description: 'Input with label',
    code: `import { Input } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-2">
      <label className="block text-sm font-medium">
        Your Name
      </label>
      <Input placeholder="John Doe" />
    </div>
  )
}`,
  },
  {
    name: 'With Icon',
    description: 'Input with icon prefix',
    code: `import { Input } from '@clarity-chat/react'
import { Search, Mail } from 'lucide-react'

export default function Example() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search..."
          className="pl-10"
        />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="email"
          placeholder="email@example.com"
          className="pl-10"
        />
      </div>
    </div>
  )
}`,
  },
  {
    name: 'Disabled',
    description: 'Disabled input state',
    code: `import { Input } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <Input
        placeholder="Disabled input"
        disabled
        value="Cannot edit this"
      />
    </div>
  )
}`,
  },
  {
    name: 'Error State',
    description: 'Input with error styling',
    code: `import { Input } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-8 max-w-md mx-auto space-y-2">
      <Input
        placeholder="Enter valid email"
        className="border-red-500"
      />
      <p className="text-sm text-red-600">
        Please enter a valid email address
      </p>
    </div>
  )
}`,
  },
]

export const inputControls: PlaygroundControl[] = [
  {
    name: 'type',
    label: 'Input Type',
    type: 'select',
    defaultValue: 'text',
    options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    description: 'HTML input type',
  },
  {
    name: 'placeholder',
    label: 'Placeholder',
    type: 'text',
    defaultValue: 'Type something...',
    description: 'Placeholder text',
  },
  {
    name: 'disabled',
    label: 'Disabled',
    type: 'boolean',
    defaultValue: false,
    description: 'Disable the input',
  },
  {
    name: 'required',
    label: 'Required',
    type: 'boolean',
    defaultValue: false,
    description: 'Mark as required field',
  },
]
