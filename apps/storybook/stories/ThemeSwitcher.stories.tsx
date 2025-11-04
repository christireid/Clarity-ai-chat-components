import type { Meta, StoryObj } from '@storybook/react'
import { ThemeSwitcher } from '@clarity-chat/react'

/**
 * ThemeSwitcher allows users to toggle between light and dark themes.
 * 
 * **Key Features:**
 * - Light/Dark/System modes
 * - Smooth transitions
 * - Persistent preference
 * - Accessible
 * 
 * **Use Cases:**
 * - User preferences
 * - Accessibility
 * - Brand customization
 */
const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toggle between light, dark, and system theme preferences.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-3">
      <label className="text-sm font-medium">Theme</label>
      <ThemeSwitcher />
    </div>
  ),
}

export const InHeader: Story = {
  render: () => (
    <div className="w-full max-w-2xl border rounded-lg">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold">Chat Application</h2>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <ThemeSwitcher />
          <button className="p-2 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600">
          Use the theme switcher in the header to toggle between light and dark modes.
        </p>
      </div>
    </div>
  ),
}

export const InSidebar: Story = {
  render: () => (
    <div className="flex h-96 w-full max-w-3xl border rounded-lg overflow-hidden">
      <div className="w-64 bg-gray-50 border-r p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Settings</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded">
                Profile
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded">
                Notifications
              </button>
              <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-200 rounded">
                Privacy
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium block">Appearance</label>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-2">Appearance Settings</h2>
        <p className="text-gray-600">
          Choose your preferred theme from the sidebar. Your selection will be saved
          and applied across all sessions.
        </p>
      </div>
    </div>
  ),
}

export const CompactMode: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <span className="text-sm">Theme:</span>
      <ThemeSwitcher />
    </div>
  ),
}
