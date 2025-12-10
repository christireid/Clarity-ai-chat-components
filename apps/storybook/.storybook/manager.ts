/**
 * Storybook Manager Configuration
 *
 * Controls the Storybook UI (sidebar, toolbar, panels).
 * Uses custom Clarity Chat themes for brand consistency.
 */
import { addons } from 'storybook/manager-api'
import clarityTheme from './clarity-theme'
import clarityDarkTheme from './clarity-theme-dark'

addons.setConfig({
  // Use custom light theme (will be overridden by dark mode addon)
  theme: clarityTheme,

  // Panel position
  panelPosition: 'bottom',

  // Enable keyboard shortcuts
  enableShortcuts: true,

  // Show toolbar
  showToolbar: true,

  // Initial active state
  initialActive: 'sidebar',

  // Sidebar configuration
  sidebar: {
    showRoots: true,
    collapsedRoots: ['Resources', 'API Reference'],
    renderLabel: ({ name, type }) => {
      // Add icons to different sections for better visual hierarchy
      if (type === 'root') {
        if (name === 'Introduction') return `🏠 ${name}`
        if (name === 'Welcome') return `🌟 ${name}`
        if (name === 'Design System') return `🎨 ${name}`
        if (name === 'Foundation') return `🎨 ${name}`
        if (name === 'Components') return `🧩 ${name}`
        if (name === 'Advanced Features') return `🚀 ${name}`
        if (name === 'Hooks') return `🪝 ${name}`
        if (name === 'Patterns') return `📐 ${name}`
        if (name === 'Examples') return `💼 ${name}`
        if (name === 'Resources') return `📖 ${name}`
        if (name === 'API Reference') return `📚 ${name}`
        // Legacy categories (during transition)
        if (name === 'Primitives') return `🔧 ${name}`
        if (name === 'Getting Started') return `🚀 ${name}`
      }
      return name
    },
  },

  // Toolbar configuration
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
})

// Export themes for dark mode addon
export { clarityTheme, clarityDarkTheme }
