import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Project Sidebar | Clarity Chat', description: 'Project and chat navigation sidebar with search and organization.' }
export default function ProjectSidebarPage() {
  return (<div className="max-w-5xl mx-auto px-4 py-8"><h1 className="text-4xl font-bold mb-4">Project Sidebar</h1><p className="text-xl text-muted-foreground mb-8">Hierarchical navigation for projects and chats with search and management.</p><section className="mb-12"><h2 className="text-3xl font-semibold mb-4">Features</h2><ul className="list-disc list-inside space-y-2 text-muted-foreground"><li>Project/chat hierarchy</li><li>Search across projects</li><li>Expand/collapse projects</li><li>Create/edit/delete actions</li><li>Active item highlighting</li></ul></section></div>)
}
