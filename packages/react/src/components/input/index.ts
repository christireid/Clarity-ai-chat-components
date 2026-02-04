/**
 * Input Components
 *
 * User input components including advanced inputs, voice input,
 * file uploads, and structured input builders.
 */

export { AdvancedChatInput } from './AdvancedChatInput'
export { FileUpload } from './FileUpload'
export { MentionInput, MentionList, useMentions } from './MentionSystem'
export {
  OutputPreferenceSelector,
  UncontrolledOutputPreferenceSelector,
  useOutputPreference,
  type OutputPreferenceValue,
  type OutputPreferenceSelectorProps,
  type UncontrolledOutputPreferenceSelectorProps,
  type UncontrolledOutputPreferenceSelectorRef,
} from './OutputPreferenceSelector'
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
export { VoiceInput, InlineVoiceInput } from './VoiceInput'

// AudioRecorder - Browser-based audio recording with waveform visualization
export {
  AudioRecorder,
  type AudioRecorderProps,
} from './AudioRecorder'

// PillChatInput - Modern pill-shaped chat input
export {
  PillChatInput,
  usePillChatInput,
  type PillChatInputProps,
  type PillChatInputVariant,
  type UsePillChatInputOptions,
  type UsePillChatInputReturn,
} from './PillChatInput'
