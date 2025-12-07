import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../card'
import { Button } from '../ui/button-enhanced'

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render Card component', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render CardHeader', () => {
      render(
        <Card>
          <CardHeader>Header</CardHeader>
        </Card>
      )
      expect(screen.getByText('Header')).toBeInTheDocument()
    })

    it('should render CardTitle', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('should render CardDescription', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
        </Card>
      )
      expect(screen.getByText('Card description')).toBeInTheDocument()
    })

    it('should render CardContent', () => {
      render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render CardFooter', () => {
      render(
        <Card>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    it('should render complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply default card styles', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('rounded-xl')
    })

    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>)
      const card = container.firstChild
      expect(card).toHaveClass('custom-card')
    })

    it('should apply header styles', () => {
      const { container } = render(
        <Card>
          <CardHeader>Header</CardHeader>
        </Card>
      )
      const header = container.querySelector('.flex.flex-col.space-y-1\\.5')
      expect(header).toBeInTheDocument()
    })

    it('should apply content styles', () => {
      const { container } = render(
        <Card>
          <CardContent>Content</CardContent>
        </Card>
      )
      const content = container.querySelector('.p-6')
      expect(content).toBeInTheDocument()
    })

    it('should apply footer styles', () => {
      const { container } = render(
        <Card>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
      const footer = container.querySelector('.flex.items-center')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with proper structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This is an accessible card</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      )

      expect(screen.getByText('Accessible Card')).toBeInTheDocument()
      expect(screen.getByText('This is an accessible card')).toBeInTheDocument()
      expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    })

    it('should support semantic HTML structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Semantic Card</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      // Card should have proper structure with rounded-xl
      const card = container.querySelector('.rounded-xl')
      expect(card).toBeInTheDocument()
      // Should have h3 for title
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })

  describe('Composition', () => {
    it('should work with Button in footer', () => {
      render(
        <Card>
          <CardFooter>
            <Button>Click me</Button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should work with multiple elements', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </CardContent>
          <CardFooter>
            <Button>Action 1</Button>
            <Button variant="outline">Action 2</Button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument()
    })
  })
})
