/**
 * Docs Assistant Tools Module
 *
 * Exports tool definitions and handlers for the docs assistant.
 */

export {
  TOOL_NAMES,
  DOCS_ASSISTANT_TOOLS,
  type ToolName,
  type ToolInputs,
  type ToolOutputs,
  type ToolResultChunk,
} from './definitions'

export { executeToolCall } from './handlers'
