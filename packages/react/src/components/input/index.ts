/**
 * Input Components
 *
 * User input components including advanced inputs, voice input,
 * file uploads, and structured input builders.
 */

export { AdvancedChatInput } from './advanced-chat-input'
export { FileUpload } from './file-upload'
export {
  MentionInput,
  MentionList,
  useMentions,
} from './mention-system'
export {
  OutputPreferenceSelector,
  UncontrolledOutputPreferenceSelector,
  useOutputPreference,
  type OutputPreferenceValue,
  type OutputPreferenceSelectorProps,
  type UncontrolledOutputPreferenceSelectorProps,
  type UncontrolledOutputPreferenceSelectorRef,
} from './output-preference-selector'
export {
  StructuredInputBuilder,
  useStructuredInput,
  PRESET_FIELDS,
  type StructuredInputField,
  type StructuredInputResult,
  type StructuredInputBuilderProps,
  type FieldPriority,
  type FieldSection,
  type FieldType,
  type SelectOption,
  type TokenBreakdown,
} from './structured-input-builder'
export { VoiceInput, InlineVoiceInput } from './voice-input'
