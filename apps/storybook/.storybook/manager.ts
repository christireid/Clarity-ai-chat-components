import { addons } from '@storybook/manager-api'
import { themes } from '@storybook/theming'

addons.setConfig({
  // Use dark theme for the manager UI
  theme: themes.dark,

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
    collapsedRoots: ['other'],
    renderLabel: ({ name, type }) => {
      // Add icons to different sections
      if (type === 'root') {
        if (name === 'Documentation') return `📚 ${name}`
        if (name === 'Components') return `🧩 ${name}`
        if (name === 'Primitives') return `🔧 ${name}`
        if (name === 'Hooks') return `🪝 ${name}`
        if (name === 'Examples') return `💡 ${name}`
        if (name === 'Templates') return `📋 ${name}`
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
