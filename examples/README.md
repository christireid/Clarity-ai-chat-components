# Clarity Chat Component Examples

This directory contains example applications showcasing Clarity Chat Components.

## 📦 Examples

### 1. **basic-chat**
Simple chat interface with message operations (edit, regenerate, delete) and undo/redo support.

**Features:**
- Message operations
- Undo/Redo functionality
- Token tracking
- Auto-scroll
- Error handling

### 2. **advanced-chat-features**
Comprehensive demonstration of all modern AI chat features.

**Features:**
- Message operations (edit, regenerate, delete)
- Undo/Redo with keyboard shortcuts
- Conversation branching
- Export functionality (Markdown, JSON, plain text)
- Token tracking and cost estimation
- Auto-scroll

### 3. **comprehensive-chat-demo**
Complete integration example showing all features working together.

**Features:**
- All message operations
- Multiple conversations with list
- Advanced search with filters
- Command palette (Ctrl+K)
- Citation display (RAG)
- Token tracking
- Export functionality
- Keyboard shortcuts throughout

### 3. **design-system-showcase**
Interactive showcase of the design system with live examples of all design tokens, components, and animation patterns.

**Features:**
- Design tokens visualization
- Component showcases (Buttons, Forms, Cards, Overlays, Chat, Animations)
- Live interactive examples
- Pattern demonstrations

### 2. **component-demo**
Simple demonstrations of common component patterns and usage.

**Features:**
- Basic component usage
- Form patterns
- Dialog examples
- Chat interface example
- Feature grid layouts

### 3. **theme-builder**
Interactive tool for customizing and building custom themes.

**Features:**
- Live color picker
- Theme presets
- Real-time preview
- Export functionality
- Accessibility contrast checking

### 4. **performance-dashboard**
Real-time performance monitoring and benchmarking dashboard.

**Features:**
- Live render performance metrics
- Component benchmarks
- Performance budgets
- Data visualization with Recharts
- Export capabilities

## 🚀 Getting Started

### Prerequisites

Make sure all packages are built first:

```bash
# From workspace root
npm install
npm run build --workspace=@clarity-chat/primitives
npm run build --workspace=@clarity-chat/react  
npm run build --workspace=@clarity-chat/types
```

### Running Examples

Each example can be run independently:

```bash
# Design System Showcase
cd examples/design-system-showcase
npm install
npm run dev

# Component Demo  
cd examples/component-demo
npm install
npm run dev

# Theme Builder
cd examples/theme-builder
npm install
npm run dev

# Performance Dashboard
cd examples/performance-dashboard
npm install
npm run dev
```

## 📝 Note on Building Examples

**Current Status:** The examples are designed for development mode (`npm run dev`) and work perfectly for exploring and testing components.

**Build Limitations:** Some examples may encounter TypeScript strictness issues during `npm run build` due to:
- Strict type checking in build mode
- Complex type inference with workspace dependencies
- Type definition generation in the react package

**Recommendation:** Use `npm run dev` for development and exploration. For production builds, additional type refinements may be needed.

## 🎯 What to Explore

### Design Patterns
- Modern shadows and borders
- Smooth animations
- Accessible focus states
- Interactive feedback
- Responsive layouts

### Component Usage
- Form handling
- Chat interfaces
- Modal patterns
- Tooltip placement
- Card interactions

### Theming
- Color customization
- Design token usage
- Dark mode support
- Accessibility considerations

### Performance
- Render optimization
- Component benchmarks
- Budget monitoring
- Profiling tools

## 📚 Documentation

For complete documentation on using Clarity Chat Components, see:
- [Main Documentation](../docs/)
- [Component Guide](../COMPONENT_PATTERNS_GUIDE.md)
- [Design System Guide](../DESIGN_SYSTEM_GUIDE_V2.md)
- [Quick Reference](../QUICK_REFERENCE_CARD.md)

## 🤝 Contributing

These examples serve as both documentation and testing grounds. Feel free to:
- Add new examples
- Improve existing patterns
- Fix any issues
- Enhance documentation

## ⚡ Quick Commands

```bash
# Install all example dependencies
for dir in */; do cd "$dir" && npm install && cd ..; done

# Run all examples in dev mode (open in separate terminals)
cd design-system-showcase && npm run dev
cd component-demo && npm run dev  
cd theme-builder && npm run dev
cd performance-dashboard && npm run dev
```

## 🎨 Design Philosophy

All examples follow the Clarity Chat design principles:
- ✅ Clean, modern aesthetics
- ✅ Smooth, purposeful animations
- ✅ Accessible by default (WCAG 2.1 AA)
- ✅ Responsive and mobile-friendly
- ✅ Performance-optimized

## 📞 Support

For questions or issues with examples:
1. Check the main documentation
2. Review component source code in `/packages`
3. Open an issue on GitHub

---

**Happy Coding! 🚀**
