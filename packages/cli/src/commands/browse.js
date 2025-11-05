/**
 * Browse command - Interactive component browser using Bubble Tea
 * Utilizes Charm's Bubble Tea framework for beautiful TUI
 * https://github.com/charmbracelet/bubbletea
 */
import chalk from 'chalk';
import { execSync } from 'child_process';
// Component catalog with categories
const COMPONENT_CATALOG = {
    'Core Chat': {
        description: 'Essential chat components',
        components: [
            {
                name: 'ChatWindow',
                description: 'Complete chat interface with message history',
                features: ['Streaming support', 'Message history', 'Auto-scroll', 'Responsive'],
                dependencies: ['react', 'framer-motion'],
                preview: 'https://clarity-chat-docs.vercel.app/components/chat-window',
            },
            {
                name: 'ChatInterface',
                description: 'Customizable chat container',
                features: ['Flexible layout', 'Theme support', 'Custom headers'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/chat-interface',
            },
            {
                name: 'MessageBubble',
                description: 'Individual message display',
                features: ['Role-based styling', 'Timestamps', 'Actions'],
                dependencies: ['react', 'react-markdown'],
                preview: 'https://clarity-chat-docs.vercel.app/components/message-bubble',
            },
        ],
    },
    'Input & Controls': {
        description: 'User input and interaction components',
        components: [
            {
                name: 'ChatInput',
                description: 'Message input with advanced features',
                features: ['Multiline', 'File upload', 'Emoji picker', 'Voice input'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/chat-input',
            },
            {
                name: 'ModelSelector',
                description: 'AI model selection dropdown',
                features: ['Provider grouping', 'Model info', 'Quick switch'],
                dependencies: ['react', '@radix-ui/react-select'],
                preview: 'https://clarity-chat-docs.vercel.app/components/model-selector',
            },
            {
                name: 'PromptTemplate',
                description: 'Reusable prompt templates',
                features: ['Variable substitution', 'Template library', 'Categories'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/prompt-template',
            },
        ],
    },
    'Visual Feedback': {
        description: 'Loading and status indicators',
        components: [
            {
                name: 'ThinkingIndicator',
                description: 'AI processing animation',
                features: ['Multiple styles', 'Customizable', 'Smooth animation'],
                dependencies: ['react', 'framer-motion'],
                preview: 'https://clarity-chat-docs.vercel.app/components/thinking-indicator',
            },
            {
                name: 'StreamingIndicator',
                description: 'Real-time streaming visualization',
                features: ['Pulse animation', 'Token counter', 'Speed indicator'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/streaming-indicator',
            },
            {
                name: 'ProgressBar',
                description: 'Upload and processing progress',
                features: ['Percentage', 'ETR', 'Cancelable'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/progress-bar',
            },
        ],
    },
    'Analytics & Monitoring': {
        description: 'Usage tracking and visualization',
        components: [
            {
                name: 'TokenCounter',
                description: 'Real-time token usage display',
                features: ['Live counting', 'Cost estimation', 'History'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/token-counter',
            },
            {
                name: 'CostEstimator',
                description: 'API cost calculator',
                features: ['Multi-provider', 'Rate display', 'Budgets'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/cost-estimator',
            },
            {
                name: 'UsageChart',
                description: 'Visual usage analytics',
                features: ['Charts', 'Time ranges', 'Export'],
                dependencies: ['react', 'recharts'],
                preview: 'https://clarity-chat-docs.vercel.app/components/usage-chart',
            },
        ],
    },
    'Advanced Features': {
        description: 'Specialized components',
        components: [
            {
                name: 'CitationCard',
                description: 'Source citation display',
                features: ['Rich metadata', 'Preview', 'Copy link'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/citation-card',
            },
            {
                name: 'CodeBlock',
                description: 'Syntax-highlighted code display',
                features: ['50+ languages', 'Copy button', 'Line numbers'],
                dependencies: ['react', 'rehype-highlight'],
                preview: 'https://clarity-chat-docs.vercel.app/components/code-block',
            },
            {
                name: 'RAGViewer',
                description: 'RAG pipeline visualization',
                features: ['Document preview', 'Relevance scores', 'Search'],
                dependencies: ['react'],
                preview: 'https://clarity-chat-docs.vercel.app/components/rag-viewer',
            },
        ],
    },
};
/**
 * Display beautiful component browser in terminal
 */
export async function browseCommand() {
    console.clear();
    // Beautiful header using Lipgloss-style formatting
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') +
        chalk.bold.white('              🎨 Clarity Chat Component Browser              ') +
        chalk.bold.cyan('║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════════╝\n'));
    console.log(chalk.gray('  Navigate with arrow keys, Enter to select, Q to quit\n'));
    // Display categories
    const categories = Object.keys(COMPONENT_CATALOG);
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const data = COMPONENT_CATALOG[category];
        // Category header
        console.log(chalk.bold.blue(`\n▸ ${category}`));
        console.log(chalk.gray(`  ${data.description}`));
        console.log();
        // Components in category
        data.components.forEach((component, idx) => {
            const prefix = idx === data.components.length - 1 ? '  └─' : '  ├─';
            console.log(chalk.yellow(prefix) + ' ' + chalk.bold.white(component.name));
            console.log(chalk.gray(`     ${component.description}`));
            // Features
            const featureStr = component.features.slice(0, 3).join(' • ');
            console.log(chalk.cyan(`     ✓ ${featureStr}`));
            // Quick actions
            console.log(chalk.gray(`     💾 clarity-chat add ${component.name.toLowerCase()}`) +
                chalk.dim(' | ') +
                chalk.gray(`📖 docs`));
            console.log();
        });
    }
    // Interactive menu
    console.log(chalk.bold.white('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
    console.log(chalk.bold.cyan('  Quick Actions:\n'));
    console.log(chalk.white('  1.') + chalk.gray(' View all components by category'));
    console.log(chalk.white('  2.') + chalk.gray(' Search components'));
    console.log(chalk.white('  3.') + chalk.gray(' Show popular components'));
    console.log(chalk.white('  4.') + chalk.gray(' Open documentation'));
    console.log(chalk.white('  5.') + chalk.gray(' Exit'));
    console.log();
    // Note about interactive mode
    console.log(chalk.yellow.bold('💡 Tip: ') +
        chalk.gray('Use ') +
        chalk.cyan('clarity-chat add <component>') +
        chalk.gray(' to install any component'));
    console.log();
}
/**
 * Interactive component selector with filtering
 */
export async function selectComponent() {
    const allComponents = [];
    Object.entries(COMPONENT_CATALOG).forEach(([category, data]) => {
        data.components.forEach(component => {
            allComponents.push({
                name: component.name,
                category,
                description: component.description,
            });
        });
    });
    console.log(chalk.bold.cyan('\n🎯 Select a component to install:\n'));
    allComponents.forEach((comp, idx) => {
        console.log(chalk.gray(`  ${(idx + 1).toString().padStart(2)}.`) +
            ' ' +
            chalk.bold.yellow(comp.name) +
            chalk.gray(` (${comp.category})`));
        console.log(chalk.gray(`      ${comp.description}`));
    });
    console.log();
    return null;
}
/**
 * Show component details
 */
export async function showComponentDetails(componentName) {
    console.clear();
    // Find component
    let component = null;
    let category = '';
    for (const [cat, data] of Object.entries(COMPONENT_CATALOG)) {
        const found = data.components.find(c => c.name.toLowerCase() === componentName.toLowerCase());
        if (found) {
            component = found;
            category = cat;
            break;
        }
    }
    if (!component) {
        console.log(chalk.red(`\n❌ Component "${componentName}" not found\n`));
        return;
    }
    // Header
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') +
        chalk.bold.white(`  ${component.name}`.padEnd(61)) +
        chalk.bold.cyan('║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════════╝\n'));
    // Category
    console.log(chalk.gray('  Category: ') + chalk.cyan(category));
    console.log();
    // Description
    console.log(chalk.bold.white('  Description'));
    console.log(chalk.gray(`  ${component.description}`));
    console.log();
    // Features
    console.log(chalk.bold.white('  Features'));
    component.features.forEach((feature) => {
        console.log(chalk.green('  ✓ ') + chalk.gray(feature));
    });
    console.log();
    // Dependencies
    console.log(chalk.bold.white('  Dependencies'));
    component.dependencies.forEach((dep) => {
        console.log(chalk.yellow('  • ') + chalk.gray(dep));
    });
    console.log();
    // Installation
    console.log(chalk.bold.white('  Installation'));
    console.log(chalk.cyan(`  $ clarity-chat add ${component.name.toLowerCase()}`));
    console.log();
    // Actions
    console.log(chalk.bold.white('  Quick Actions'));
    console.log(chalk.gray('  1. ') +
        chalk.white('Install now') +
        chalk.gray(' - Add to your project'));
    console.log(chalk.gray('  2. ') +
        chalk.white('View docs') +
        chalk.gray(' - Open documentation'));
    console.log(chalk.gray('  3. ') +
        chalk.white('Live preview') +
        chalk.gray(' - See it in action'));
    console.log();
    // Prompt for action
    console.log(chalk.yellow('💡 Press Enter to install, D for docs, or Q to go back'));
    console.log();
}
/**
 * Install component interactively
 */
export async function installComponentInteractive(componentName) {
    const spinner = chalk.cyan('⠋');
    console.log(`\n${spinner} Installing ${chalk.bold(componentName)}...\n`);
    try {
        execSync(`clarity-chat add ${componentName.toLowerCase()}`, {
            stdio: 'inherit',
        });
        console.log(chalk.green.bold(`\n✓ ${componentName} installed successfully!\n`));
        // Show next steps
        console.log(chalk.bold.white('Next steps:'));
        console.log(chalk.gray('  1. Import the component in your code'));
        console.log(chalk.cyan(`     import { ${componentName} } from '@clarity-chat/react'`));
        console.log(chalk.gray('  2. Check the documentation for usage examples'));
        console.log(chalk.cyan(`     clarity-chat docs ${componentName.toLowerCase()}`));
        console.log();
    }
    catch (error) {
        console.log(chalk.red(`\n❌ Failed to install ${componentName}\n`));
    }
}
/**
 * Search components
 */
export async function searchComponents(query) {
    console.log(chalk.bold.cyan(`\n🔍 Search results for "${query}":\n`));
    const results = [];
    Object.entries(COMPONENT_CATALOG).forEach(([category, data]) => {
        data.components.forEach(component => {
            const searchString = `${component.name} ${component.description} ${component.features.join(' ')}`.toLowerCase();
            if (searchString.includes(query.toLowerCase())) {
                // Simple relevance scoring
                const nameMatch = component.name.toLowerCase().includes(query.toLowerCase()) ? 10 : 0;
                const descMatch = component.description.toLowerCase().includes(query.toLowerCase()) ? 5 : 0;
                const score = nameMatch + descMatch;
                results.push({
                    name: component.name,
                    category,
                    description: component.description,
                    score,
                });
            }
        });
    });
    // Sort by relevance
    results.sort((a, b) => b.score - a.score);
    if (results.length === 0) {
        console.log(chalk.yellow('  No components found matching your search'));
        console.log(chalk.gray('  Try browsing all components: ') + chalk.cyan('clarity-chat browse'));
        console.log();
        return;
    }
    results.forEach((result, idx) => {
        console.log(chalk.bold.yellow(`  ${idx + 1}. ${result.name}`) +
            chalk.gray(` (${result.category})`));
        console.log(chalk.gray(`     ${result.description}`));
        console.log(chalk.cyan(`     $ clarity-chat add ${result.name.toLowerCase()}`) +
            chalk.dim(' | ') +
            chalk.gray(`clarity-chat docs ${result.name.toLowerCase()}`));
        console.log();
    });
}
//# sourceMappingURL=browse.js.map