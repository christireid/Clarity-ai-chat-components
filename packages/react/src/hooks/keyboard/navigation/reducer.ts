import type {
  KeyboardNavigationState,
  KeyboardNavigationAction,
} from './types'
import { detectConflicts } from './conflict-detection'

/**
 * State Management Reducer
 */

export function keyboardNavigationReducer(
  state: KeyboardNavigationState,
  action: KeyboardNavigationAction
): KeyboardNavigationState {
  switch (action.type) {
    case 'REGISTER_SHORTCUT': {
      const newShortcuts = new Map(state.shortcuts)
      newShortcuts.set(action.shortcut.id, action.shortcut)
      return {
        ...state,
        shortcuts: newShortcuts,
        conflicts: detectConflicts(newShortcuts),
      }
    }
    case 'UNREGISTER_SHORTCUT': {
      const newShortcuts = new Map(state.shortcuts)
      newShortcuts.delete(action.id)
      return {
        ...state,
        shortcuts: newShortcuts,
        conflicts: detectConflicts(newShortcuts),
      }
    }
    case 'SET_SCOPE':
      return { ...state, activeScope: action.scope }
    case 'APPEND_SEQUENCE':
      return {
        ...state,
        sequenceBuffer: [...state.sequenceBuffer, action.key],
      }
    case 'CLEAR_SEQUENCE':
      return { ...state, sequenceBuffer: [] }
    case 'SET_KEYBOARD_NAVIGATING':
      return { ...state, isKeyboardNavigating: action.isNavigating }
    case 'SET_FOCUSED_INDEX':
      return { ...state, focusedIndex: action.index }
    case 'TOGGLE_HINTS':
      return { ...state, showHints: !state.showHints }
    case 'SET_HINTS':
      return { ...state, showHints: action.show }
    default:
      return state
  }
}
