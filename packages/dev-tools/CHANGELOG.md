# Changelog

## [Unreleased]

### Added - React 19 Components and Hooks

#### Components
- **APIInspectorPanel** - React component for displaying API call logs with real-time updates
- **ProfilerPanel** - React component for displaying performance metrics
- **ValidationForm** - React component for configuration validation
- **TimeTravelPanel** - React component for time-travel debugging
- **DevToolsDashboard** - Comprehensive dashboard combining all dev tools

#### Hooks
- **useAPIInspector** - Hook for API inspector with optimistic updates using `useOptimistic`
- **useProfiler** - Hook for performance profiling with optimistic updates
- **useEnvValidation** - Hook for environment variable validation
- **useAPIKeyValidation** - Hook for API key validation
- **useChatConfigValidation** - Hook for chat configuration validation
- **useMessageValidation** - Hook for message validation
- **useTimeTravel** - Hook for time-travel debugging with optimistic updates

#### React 19 Features
- **useOptimistic** - Used in API inspector, profiler, and time-travel hooks for optimistic UI updates
- **Client-Side Form State** - Used in validation forms for form submission state (useFormStatus requires Server Actions)
- Real-time updates - Components automatically update as data changes
- Optimistic updates - Instant UI feedback with automatic error handling

#### Documentation
- **REACT_19_MIGRATION.md** - Complete migration guide
- **REACT_19_RESEARCH.md** - React 19 features research document
- Updated README with React 19 components section
- Comprehensive examples and Storybook stories

#### Testing
- Test files for all hooks
- Coverage for optimistic updates, state management, and error handling

#### Examples
- React 19 demo example
- Storybook stories for all components
- Comprehensive dashboard example

### Changed
- Added React 19 peer dependencies
- Updated TypeScript configuration for React support
- Enhanced package exports to include React components

### Requirements
- React 19.0.0 or higher (for React components)
- React DOM 19.0.0 or higher (for React components)

### Breaking Changes
None! All existing TypeScript utilities continue to work. React components and hooks are additive.
