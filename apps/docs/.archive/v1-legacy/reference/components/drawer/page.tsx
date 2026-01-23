import React from 'react';
import { Metadata } from 'next';
import { ViewInStorybook } from '@/components/Links/StorybookLink';

export const metadata: Metadata = {
  title: 'Drawer Component - Clarity Chat Components',
  description: 'A slide-out panel component that overlays content from the side of the screen, perfect for navigation menus, filters, and detailed views.',
};

export default function DrawerPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Drawer</h1>
        <p className="docs-lead">
          A slide-out panel component that overlays content from the side of the screen, perfect for navigation menus, filters, and detailed views.
        </p>
      </div>

      <ViewInStorybook component="Drawer" />

      <section className="docs-section">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Note: Full documentation for this component is being migrated. Please refer to the storybook for interactive examples.
        </p>
      </section>
    </div>
  );
}
