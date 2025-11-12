/**
 * Form Showcase
 * 
 * Demonstrates form inputs, textareas, and form patterns
 */

import { Input, Textarea, Checkbox, Button } from '@clarity-chat/primitives'
import { useState } from 'react'

export function FormShowcase() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Form Components</h2>
        <p className="text-muted-foreground">
          Form inputs with refined focus states and consistent styling
        </p>
      </div>

      {/* Input Variants */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Input Fields</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Input</label>
            <Input placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Input</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password Input</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Disabled Input</label>
            <Input disabled placeholder="Disabled input" />
          </div>
        </div>
      </section>

      {/* Textarea */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Textarea</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea 
              placeholder="Type your message here..."
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* Checkbox */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Checkboxes</h3>
        <div className="space-y-3 max-w-md">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms1" />
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms2" defaultChecked />
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Checked by default
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms3" disabled />
            <label
              htmlFor="terms3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Disabled checkbox
            </label>
          </div>
        </div>
      </section>

      {/* Complete Form Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Complete Form Example</h3>
        <div className="max-w-md p-6 rounded-lg ring-1 ring-border/30 bg-card shadow-xs">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <h4 className="text-lg font-semibold mb-1">Contact Us</h4>
              <p className="text-sm text-muted-foreground">
                Send us a message and we'll get back to you
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll never share your email
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Tell us what you're thinking..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/500 characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label
                  htmlFor="agree"
                  className="text-sm font-medium leading-none"
                >
                  I agree to receive updates
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </div>
      </section>

      {/* Form States */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Form Field States</h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Normal State</label>
            <Input placeholder="ring-1 ring-border/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Focus State</label>
            <Input 
              placeholder="ring-[3px] ring-ring/50"
              className="ring-[3px] ring-ring/50 ring-offset-1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-destructive">Error State</label>
            <Input 
              placeholder="ring-destructive/50"
              className="ring-destructive/50"
            />
            <p className="text-sm text-destructive">This field is required</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-green-600">Success State</label>
            <Input 
              placeholder="ring-green-500/50"
              className="ring-green-500/50"
              defaultValue="Valid input"
            />
            <p className="text-sm text-green-600">Looks good!</p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="bg-muted/30 rounded-lg p-6 ring-1 ring-border/30">
        <h3 className="text-lg font-semibold mb-4">Code Example</h3>
        <pre className="bg-background rounded-md p-4 overflow-x-auto text-sm ring-1 ring-border/30">
          <code>{`import { Input, Textarea, Checkbox, Button } from '@clarity-chat/primitives'

// Form field with label
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <Input 
    type="email" 
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <p className="text-xs text-muted-foreground">
    Helper text here
  </p>
</div>

// Textarea
<Textarea 
  placeholder="Your message..."
  rows={4}
/>

// Checkbox with label
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms">
    I agree to the terms
  </label>
</div>

// Error state
<Input 
  className="ring-destructive/50"
  placeholder="Error input"
/>`}</code>
        </pre>
      </section>

      {/* Pattern Details */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Form Pattern Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Base Styling</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• rounded-md (6px radius)</li>
              <li>• ring-1 ring-border/50</li>
              <li>• shadow-xs (subtle depth)</li>
              <li>• transition-all duration-200</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Focus State</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• focus-visible:ring-[3px]</li>
              <li>• focus-visible:ring-ring/50</li>
              <li>• focus-visible:ring-offset-1</li>
              <li>• focus-visible:border-primary/60</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Hover State</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• hover:ring-border/70</li>
              <li>• Subtle ring darkening</li>
              <li>• Smooth transition</li>
              <li>• No movement</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg ring-1 ring-border/30 bg-card">
            <h4 className="font-medium mb-2">Error State</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ring-destructive/50</li>
              <li>• Red error message</li>
              <li>• Maintains consistency</li>
              <li>• Clear visual feedback</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
