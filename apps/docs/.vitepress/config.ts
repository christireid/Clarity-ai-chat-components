import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Clarity Chat',
  description: 'Enterprise-grade React AI chat component library',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/components' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Cookbook', link: '/cookbook' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Components Overview', link: '/guide/components' },
            { text: 'Hooks', link: '/guide/hooks' },
            { text: 'Message Handling', link: '/guide/messages' },
            { text: 'Streaming', link: '/guide/streaming' },
            { text: 'Error Handling', link: '/guide/error-handling' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Customization', link: '/guide/customization' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Performance', link: '/guide/performance' },
            { text: 'Accessibility', link: '/guide/accessibility' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Components', link: '/api/components' },
            { text: 'Hooks', link: '/api/hooks' },
            { text: 'Types', link: '/api/types' },
            { text: 'Utilities', link: '/api/utilities' },
          ],
        },
      ],
      '/integrations/': [
        {
          text: 'Framework Integration',
          items: [
            { text: 'Next.js', link: '/integrations/nextjs' },
            { text: 'Remix', link: '/integrations/remix' },
            { text: 'Vite', link: '/integrations/vite' },
          ],
        },
        {
          text: 'Backend Integration',
          items: [
            { text: 'OpenAI', link: '/integrations/openai' },
            { text: 'Anthropic', link: '/integrations/anthropic' },
            { text: 'Supabase', link: '/integrations/supabase' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/clarity-chat' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Clarity Chat',
    },

    search: {
      provider: 'local',
    },
  },
})
