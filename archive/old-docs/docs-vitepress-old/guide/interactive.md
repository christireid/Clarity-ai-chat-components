# Interactive Examples

<script setup lang="ts">
import basicChatDemoCode from '../.vitepress/examples/BasicChatDemo.tsx?raw'
import markdownDemoCode from '../.vitepress/examples/MarkdownDemo.tsx?raw'
import streamingDemoCode from '../.vitepress/examples/StreamingDemo.tsx?raw'
import themedDemoCode from '../.vitepress/examples/ThemedDemo.tsx?raw'
import actionsDemoCode from '../.vitepress/examples/ActionsDemo.tsx?raw'
</script>

Try out Clarity Chat components directly in your browser! Edit the code and see changes in real-time.

## Basic Chat Window

<Playground
  title="Simple Chat Interface"
  description="A minimal chat window with message sending capability"
  :code="basicChatDemoCode"
/>

## Message with Markdown

<Playground
  title="Rich Message Formatting"
  description="Messages support Markdown formatting including code blocks, lists, and emphasis"
  :code="markdownDemoCode"
/>

## Streaming Messages

<Playground
  title="Real-time Streaming"
  description="Simulate streaming responses with typing animation"
  :code="streamingDemoCode"
/>

## Custom Styling

<Playground
  title="Themed Chat Interface"
  description="Customize the appearance with your own styles"
  :code="themedDemoCode"
/>

## Message Actions

<Playground
  title="Interactive Message Actions"
  description="Messages with feedback, copy, and retry functionality"
  :code="actionsDemoCode"
/>

## Advanced AI Operations Toolkit

Beyond core chat primitives, Clarity ships a library of AI-operations components that elevate review, safety, and hand-off flows:

- **FollowUpSuggestions** surfaces contextual quick prompts so users can keep the conversation flowing.
- **PersonaPanel** lets operators swap between curated assistant personas with distinct tone and temperatures.
- **ConversationTimeline** visualises user turns, assistant responses, and tool calls in sequence.
- **MemoryInspector** exposes what context is pinned across session, thread, or global scopes.
- **SafetyStatusCard** aggregates moderation outcomes so risk teams can approve or redact a reply.
- **ResponseQualityMeter** charts evaluation metrics like groundedness versus target thresholds.
- **MultiModalPreview** previews images, audio, video, and docs referenced by the assistant.
- **AgentRunFeed** tracks autonomous agent/tool runs with retry and log access.
- **SessionSummaryCard** produces a shareable recap with metrics and recommended next actions.
- **WorkflowSuggestionList** recommends templated flows (e.g., support hand-off, marketing brief) users can trigger.

Combine these modules inside custom dashboards to ship production-ready agent experiences that are auditable, safe, and actionable.

## Tips for Customization

### Styling
- Use the `className` prop to add custom CSS classes
- Override CSS variables for theme customization
- Use Tailwind utility classes for quick styling

### Behavior
- Control loading states with `isLoading` prop
- Handle errors with `onError` callbacks
- Customize placeholders and labels

### Advanced
- Integrate with your backend API
- Add custom middleware for message processing
- Implement file upload and preview
- Add emoji picker and mentions

## Next Steps

- Explore the [API Reference](/api/components) for complete prop documentation
- Check out the [Cookbook](/cookbook) for more advanced recipes
- View the [Examples](/examples/) for full application demos
