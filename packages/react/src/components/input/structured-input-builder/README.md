# Structured Input Builder - Modular Architecture

## Overview

The Structured Input Builder has been refactored from a monolithic 1,219-line file into a modular, maintainable structure. This improves code organization, testability, and developer experience.

## File Structure

```
structured-input-builder/
├── index.ts                         # Public API barrel export
├── types.ts                          # Type definitions (137 lines)
├── utils.ts                          # Utility functions (122 lines)
├── field-components.tsx              # Field UI components (248 lines)
├── presets.ts                        # Pre-built field configs (111 lines)
├── use-structured-input.ts           # State management hook (119 lines)
├── structured-input-builder.tsx      # Main component (399 lines)
└── README.md                         # This file
```

## Module Breakdown

### 1. types.ts
**Purpose**: Type definitions for the entire module
- `FieldPriority`, `FieldSection`, `FieldType` - Field configuration types
- `SelectOption` - Select dropdown options
- `StructuredInputField` - Complete field configuration interface
- `TokenBreakdown` - Token usage analysis per field
- `StructuredInputResult` - Built output with validation
- `StructuredInputBuilderProps` - Component props

### 2. utils.ts
**Purpose**: Pure utility functions
- `sanitizeHtmlId()` - Converts strings to valid HTML IDs with hash collision prevention
- `validateFields()` - Centralized field validation logic
- `defaultFormatPrompt()` - Default prompt formatting with section ordering

### 3. field-components.tsx
**Purpose**: Presentational field components
- `FieldInput` - Polymorphic input component (text, textarea, select, number, toggle)
- `PriorityBadge` - Visual priority indicator
- `TokenUsageBar` - Token usage visualization with warnings

### 4. presets.ts
**Purpose**: Pre-configured common field patterns
- `PRESET_FIELDS.task()` - Task description field
- `PRESET_FIELDS.context()` - Background context field
- `PRESET_FIELDS.constraints()` - Constraints field
- `PRESET_FIELDS.format()` - Output format selector
- `PRESET_FIELDS.tone()` - Tone/style selector
- `PRESET_FIELDS.examples()` - Examples field
- `PRESET_FIELDS.question()` - Question field

### 5. use-structured-input.ts
**Purpose**: Hook for state management
- Manages field values
- Computes token breakdown
- Handles validation
- Formats prompts
- Provides reset and field update utilities

### 6. structured-input-builder.tsx
**Purpose**: Main component implementation
- Three display modes: `form`, `compact`, `inline`
- Section-based field grouping
- Token budget tracking
- Form submission handling
- Accessibility features (ARIA labels, error associations)

### 7. index.ts
**Purpose**: Public API surface
- Exports all public components, hooks, types, and utilities
- Re-exports field components for custom layouts
- Maintains stable API contract

## Backward Compatibility

The original file path is maintained as a barrel export:
```typescript
// packages/react/src/components/input/structured-input-builder.tsx
export * from './structured-input-builder/'
```

All existing imports continue to work without changes:
```typescript
import {
  StructuredInputBuilder,
  useStructuredInput,
  PRESET_FIELDS,
  type StructuredInputField,
} from '@clarity-chat/react'
```

## Benefits of Refactoring

1. **Maintainability**: Each module has a single, clear responsibility
2. **Testability**: Utilities and components can be tested in isolation
3. **Reusability**: Field components and utilities can be used independently
4. **Developer Experience**: Easier to navigate and understand
5. **Bundle Size**: Tree-shaking can remove unused presets and utilities
6. **Type Safety**: Type definitions are centralized and easy to extend

## Usage Examples

### Basic Usage
```typescript
import { StructuredInputBuilder, PRESET_FIELDS } from '@clarity-chat/react'

const fields = [
  PRESET_FIELDS.task(),
  PRESET_FIELDS.context(),
]

<StructuredInputBuilder
  fields={fields}
  values={values}
  onChange={setValues}
  onSubmit={handleSubmit}
/>
```

### Custom Fields
```typescript
import { StructuredInputBuilder, type StructuredInputField } from '@clarity-chat/react'

const customFields: StructuredInputField[] = [
  {
    id: 'goal',
    name: 'goal',
    label: 'Project Goal',
    type: 'textarea',
    required: true,
    section: 'instruction',
    priority: 'critical',
  },
]
```

### Using the Hook
```typescript
import { useStructuredInput, PRESET_FIELDS } from '@clarity-chat/react'

const { values, setValues, result, reset } = useStructuredInput(
  [PRESET_FIELDS.task(), PRESET_FIELDS.context()],
  { maxTokens: 4000 }
)

console.log(result.totalTokens) // Real-time token count
console.log(result.isValid) // Validation state
```

### Custom Layout with Field Components
```typescript
import { FieldInput, TokenUsageBar, type StructuredInputField } from '@clarity-chat/react'

// Build your own layout using the exposed components
<div>
  <TokenUsageBar current={tokens} max={maxTokens} breakdown={breakdown} />
  <FieldInput field={field} value={value} onChange={onChange} />
</div>
```

## Migration Guide

No migration needed! The refactoring maintains 100% backward compatibility.

However, you may want to update imports for better tree-shaking:

**Before:**
```typescript
import { StructuredInputBuilder } from '@clarity-chat/react'
```

**After (optional, for explicit imports):**
```typescript
import { StructuredInputBuilder } from '@clarity-chat/react/components/input/structured-input-builder'
```

## Testing

All 65 existing tests pass without modification. The test file was updated to import from the correct path, but the test logic remains unchanged.

Run tests:
```bash
npm test -- structured-input-builder.test.tsx
```

## Future Improvements

1. **Accessibility**: Add keyboard navigation enhancements
2. **Validation**: Add more built-in validators
3. **Presets**: Add more common field patterns
4. **Token Optimization**: Add automatic field trimming based on priority
5. **Internationalization**: Add i18n support for labels and errors
