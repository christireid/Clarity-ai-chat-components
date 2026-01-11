/**
 * list command - List available components and templates
 */

import pc from 'picocolors'
import { sectionHeader } from '../ui/banner.js'
import { table, type TableColumn } from '../ui/table.js'
import {
  COMPONENT_REGISTRY,
  TEMPLATE_REGISTRY,
  getCategories,
  getComponentsByCategory,
} from '../registry/index.js'

interface ListOptions {
  category?: string
  templates?: boolean
  json?: boolean
}

export async function listCommand(options: ListOptions) {
  // JSON output mode
  if (options.json) {
    const output = {
      components: Object.values(COMPONENT_REGISTRY).map((c) => ({
        slug: c.slug,
        name: c.name,
        category: c.category,
        description: c.description,
        files: c.files,
        dependencies: c.dependencies,
      })),
      templates: Object.values(TEMPLATE_REGISTRY).map((t) => ({
        slug: t.slug,
        name: t.name,
        description: t.description,
        components: t.components,
      })),
      categories: getCategories(),
    }
    console.log(JSON.stringify(output, null, 2))
    return
  }

  console.log()

  // List templates
  if (options.templates) {
    console.log(sectionHeader('📋 Available Templates'))
    console.log()

    const templateColumns: TableColumn[] = [
      { header: 'Template', width: 20, color: pc.yellow },
      { header: 'Description', width: 40 },
      { header: 'Components', width: 30 },
    ]

    const templateData = Object.values(TEMPLATE_REGISTRY).map((template) => [
      template.name,
      template.description,
      template.components.join(', '),
    ])

    console.log(table(templateData, templateColumns))
    console.log()
    console.log(pc.gray('Initialize a project with a template:'))
    console.log(pc.cyan('  npx @clarity-chat/cli init --template <template>'))
    console.log()
    return
  }

  // Filter by category if provided
  if (options.category) {
    const components = getComponentsByCategory(options.category)

    if (components.length === 0) {
      console.log(pc.red(`No components found in category: ${options.category}`))
      console.log()
      console.log(pc.gray('Available categories: ') + getCategories().join(', '))
      console.log()
      return
    }

    console.log(sectionHeader(`📦 ${options.category.charAt(0).toUpperCase() + options.category.slice(1)} Components`))
    console.log()

    const columns: TableColumn[] = [
      { header: 'Component', width: 25, color: pc.yellow },
      { header: 'Description', width: 50 },
    ]

    const componentData = components.map((comp) => [
      `${comp.icon} ${comp.slug}`,
      comp.description,
    ])

    console.log(table(componentData, columns))
    console.log()
    return
  }

  // List all components grouped by category
  console.log(sectionHeader('📦 Clarity Chat Components'))
  console.log()

  const categories = getCategories()

  for (const category of categories) {
    const components = getComponentsByCategory(category)
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)

    console.log(pc.bold(pc.cyan(`  ${categoryTitle}`)))
    console.log()

    for (const comp of components) {
      const depCount = comp.dependencies.length
      const depBadge = depCount > 0 ? pc.gray(` (${depCount} deps)`) : ''
      console.log(`    ${comp.icon} ${pc.white(comp.slug)}${depBadge}`)
      console.log(`       ${pc.gray(comp.description)}`)
    }
    console.log()
  }

  // Summary
  const totalComponents = Object.keys(COMPONENT_REGISTRY).length
  const totalTemplates = Object.keys(TEMPLATE_REGISTRY).length

  console.log(pc.gray('─'.repeat(60)))
  console.log()
  console.log(
    `  ${pc.bold(totalComponents.toString())} components across ${pc.bold(categories.length.toString())} categories`
  )
  console.log(`  ${pc.bold(totalTemplates.toString())} project templates available`)
  console.log()
  console.log(pc.bold('Quick start:'))
  console.log(pc.cyan('  npx @clarity-chat/cli add chat-interface'))
  console.log(pc.cyan('  npx @clarity-chat/cli init --template basic'))
  console.log()
  console.log(pc.bold('More options:'))
  console.log(pc.gray('  --category <cat>  Filter by category (chat, ui, analytics, core)'))
  console.log(pc.gray('  --templates       List available project templates'))
  console.log(pc.gray('  --json            Output as JSON'))
  console.log()
}
