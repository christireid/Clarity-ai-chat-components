# Showcase Components

Custom components for the Clarity Chat Components Showcase application.

## Components

### Command System

#### CommandPalette
A glassmorphism command palette for executing slash commands.

**Features:**
- Glassmorphism design with backdrop blur
- Category-based organization
- Real-time search and filtering
- Full keyboard navigation
- Responsive layout
- Dark mode support

#### CommandInput
Enhanced textarea with slash command detection.

**Features:**
- Automatic command palette trigger
- Visual command mode indicator
- Auto-resizing textarea
- Send button with states
- Keyboard shortcuts display

## File Structure

```
components/
├── CommandPalette.tsx          # Command palette component
├── CommandPalette.css          # Glassmorphism styles
├── CommandInput.tsx            # Input with command detection
├── CommandInput.css            # Input styles
├── ErrorBoundary.tsx           # Error boundary component
├── index.ts                    # Component exports
└── README.md                   # This file
```

## Development

### Adding New Components

1. Create component file: `MyComponent.tsx`
2. Create styles file: `MyComponent.css`
3. Export from `index.ts`
4. Add documentation
5. Test in all themes

