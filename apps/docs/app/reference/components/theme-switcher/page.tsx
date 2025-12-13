import type { Metadata } from 'next'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Theme-switcher | Clarity Chat',
  description: 'Component documentation for theme-switcher.'
}

export default function ThemeswitcherPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Theme Switcher</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Toggle between light and dark themes with smooth transitions and persistent preferences.
      </p>

      <ViewInStorybook component="ThemeSwitcher" />

      <section className="mb-12">
        <p className="text-muted-foreground">
          Full documentation for this component is coming soon. Try the interactive Storybook demo above to explore its features.
        </p>
      </section>
    </div>
  )
}
