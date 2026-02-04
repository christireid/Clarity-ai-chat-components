/**
 * Basic Component Templates
 *
 * Templates for generating standard React components with tests and stories.
 */

export const component = `import { forwardRef } from 'react'
import { cn } from '@/lib/utils'


export interface {{pascalName}}Props {
  /** Additional CSS classes */
  className?: string
  /** Component children */
  children?: React.ReactNode
}

/**
 * {{pascalName}} - {{description}}
 *
 * @example
 * \`\`\`tsx
 * <{{pascalName}}>
 *   Content here
 * </{{pascalName}}>
 * \`\`\`
 */
export const {{pascalName}} = forwardRef<HTMLDivElement, {{pascalName}}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'clarity-{{kebabName}}',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

{{pascalName}}.displayName = '{{pascalName}}'
`

export const componentIndex = `export { {{pascalName}} } from './{{pascalName}}'
export type { {{pascalName}}Props } from './{{pascalName}}'
`

export const componentTest = `import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { {{pascalName}} } from './{{pascalName}}'


describe('{{pascalName}}', () => {
  it('should render children correctly', () => {
    render(<{{pascalName}}>Test content</{{pascalName}}>)

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <{{pascalName}} className="custom-class">
        Content
      </{{pascalName}}>
    )

    const element = screen.getByText('Content').closest('div')
    expect(element).toHaveClass('custom-class')
    expect(element).toHaveClass('clarity-{{kebabName}}')
  })

  it('should forward ref correctly', () => {
    const ref = createRef<HTMLDivElement>()
    render(<{{pascalName}} ref={ref}>Content</{{pascalName}}>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should spread additional props', () => {
    render(
      <{{pascalName}} data-testid="test-component" aria-label="Test">
        Content
      </{{pascalName}}>
    )

    const element = screen.getByTestId('test-component')
    expect(element).toHaveAttribute('aria-label', 'Test')
  })
})
`

export const componentStory = `import type { Meta, StoryObj } from '@storybook/react'
import { {{pascalName}} } from './{{pascalName}}'


const meta: Meta<typeof {{pascalName}}> = {
  title: '{{componentDir}}/{{pascalName}}',
  component: {{pascalName}},
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '{{description}}',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    children: {
      control: 'text',
      description: 'Component children',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state of the {{pascalName}} component.
 */
export const Default: Story = {
  args: {
    children: '{{pascalName}} content',
  },
}

/**
 * {{pascalName}} with custom styling.
 */
export const CustomStyle: Story = {
  args: {
    children: 'Custom styled content',
    className: 'bg-blue-100 p-4 rounded-lg',
  },
}
`
