/**
 * usePromptCommands Tests
 *
 * Tests for command detection, filtering, and execution.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import * as React from 'react'
import { usePromptCommands, BUILTIN_COMMANDS } from '../usePromptCommands'
import type { Command, CommandsConfig } from '../types'

describe('usePromptCommands', () => {
  const mockSearchCommand: Command = {
    id: 'search',
    trigger: '/search',
    label: 'Search Documentation',
    description: 'Search through documentation',
    icon: React.createElement('span', {}, 'Search'),
    category: 'tools',
    execute: vi.fn().mockResolvedValue(undefined),
  }

  const mockCodeCommand: Command = {
    id: 'code',
    trigger: '/code',
    label: 'Generate Code',
    description: 'Generate code snippets',
    icon: React.createElement('span', {}, 'Code'),
    category: 'development',
    execute: vi.fn().mockResolvedValue(undefined),
  }

  const mockDebugCommand: Command = {
    id: 'debug',
    trigger: '/debug',
    label: 'Debug Issue',
    description: 'Debug application issues',
    icon: React.createElement('span', {}, 'Debug'),
    category: 'development',
    available: true,
    execute: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Initialization Tests
  // ==========================================================================

  describe('Initialization', () => {
    it('initializes with inactive state', () => {
      const { result } = renderHook(() => usePromptCommands())

      expect(result.current.isActive).toBe(false)
      expect(result.current.query).toBe('')
      expect(result.current.selectedIndex).toBe(0)
      expect(result.current.activeCommand).toBeNull()
    })

    it('loads built-in commands', () => {
      const { result } = renderHook(() => usePromptCommands())

      const availableCommands = result.current.getAvailableCommands()
      expect(availableCommands.length).toBeGreaterThanOrEqual(BUILTIN_COMMANDS.length)
    })

    it('accepts custom commands in config', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      const availableCommands = result.current.getAvailableCommands()
      const hasCustom = availableCommands.some((cmd) => cmd.id === 'search')
      expect(hasCustom).toBe(true)
    })
  })

  // ==========================================================================
  // Search Tests
  // ==========================================================================

  describe('Search', () => {
    it('activates on search', () => {
      const { result } = renderHook(() => usePromptCommands())

      act(() => {
        result.current.search('clear')
      })

      expect(result.current.isActive).toBe(true)
      expect(result.current.query).toBe('clear')
    })

    it('filters commands by trigger', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      act(() => {
        result.current.search('search')
      })

      const hasSearch = result.current.filteredCommands.some(
        (cmd) => cmd.id === 'search'
      )
      expect(hasSearch).toBe(true)
    })

    it('filters commands by label', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('Generate')
      })

      const hasCode = result.current.filteredCommands.some((cmd) => cmd.id === 'code')
      expect(hasCode).toBe(true)
    })

    it('filters commands by description', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      act(() => {
        result.current.search('documentation')
      })

      const hasSearch = result.current.filteredCommands.some(
        (cmd) => cmd.id === 'search'
      )
      expect(hasSearch).toBe(true)
    })

    it('returns all commands for empty query', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand, mockCodeCommand, mockDebugCommand],
        })
      )

      act(() => {
        result.current.search('')
      })

      // Should have custom commands plus built-ins
      expect(result.current.filteredCommands.length).toBeGreaterThanOrEqual(3)
    })

    it('is case insensitive', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockDebugCommand],
        })
      )

      act(() => {
        result.current.search('DEBUG')
      })

      const hasDebug = result.current.filteredCommands.some(
        (cmd) => cmd.id === 'debug'
      )
      expect(hasDebug).toBe(true)
    })

    it('resets selectedIndex on new search', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('code')
      })

      expect(result.current.selectedIndex).toBe(0)
    })
  })

  // ==========================================================================
  // Execute Tests
  // ==========================================================================

  describe('Execute', () => {
    it('executes command', async () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      await act(async () => {
        await result.current.execute(mockSearchCommand)
      })

      expect(mockSearchCommand.execute).toHaveBeenCalled()
    })

    it('deactivates after execution', async () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('code')
      })

      expect(result.current.isActive).toBe(true)

      await act(async () => {
        await result.current.execute(mockCodeCommand)
      })

      expect(result.current.isActive).toBe(false)
    })

    it('adds executed command to recent commands', async () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
          maxRecent: 5,
        })
      )

      await act(async () => {
        await result.current.execute(mockSearchCommand)
      })

      const hasInRecent = result.current.recentCommands.some(
        (cmd) => cmd.id === 'search'
      )
      expect(hasInRecent).toBe(true)
    })

    it('limits recent commands to maxRecent', async () => {
      const commands: Command[] = Array.from({ length: 10 }, (_, i) => ({
        id: `cmd-${i}`,
        trigger: `/cmd${i}`,
        label: `Command ${i}`,
        description: `Description ${i}`,
        icon: React.createElement('div'),
        execute: vi.fn().mockResolvedValue(undefined),
      }))

      const { result } = renderHook(() =>
        usePromptCommands({
          commands,
          maxRecent: 3,
        })
      )

      // Execute 5 commands
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await result.current.execute(commands[i])
        })
      }

      // Should only keep last 3
      expect(result.current.recentCommands).toHaveLength(3)
    })

    it('handles execution errors gracefully', async () => {
      const error = new Error('Execution failed')
      const errorCommand: Command = {
        ...mockSearchCommand,
        execute: vi.fn().mockRejectedValue(error),
      }

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [errorCommand],
        })
      )

      await expect(
        act(async () => {
          await result.current.execute(errorCommand)
        })
      ).rejects.toThrow('Execution failed')

      expect(consoleError).toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  // ==========================================================================
  // Cancel Tests
  // ==========================================================================

  describe('Cancel', () => {
    it('deactivates command palette', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('code')
      })

      expect(result.current.isActive).toBe(true)

      act(() => {
        result.current.cancel()
      })

      expect(result.current.isActive).toBe(false)
    })

    it('clears query', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('code')
      })

      expect(result.current.query).toBe('code')

      act(() => {
        result.current.cancel()
      })

      expect(result.current.query).toBe('')
    })

    it('resets selected index', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('code')
      })

      act(() => {
        result.current.cancel()
      })

      expect(result.current.selectedIndex).toBe(0)
    })
  })

  // ==========================================================================
  // Command Registration Tests
  // ==========================================================================

  describe('Command Registration', () => {
    it('registers new command', () => {
      const { result } = renderHook(() => usePromptCommands())

      const newCommand: Command = {
        id: 'test',
        trigger: '/test',
        label: 'Test Command',
        description: 'Test command',
        icon: React.createElement('span', {}, 'Test'),
        execute: vi.fn(),
      }

      act(() => {
        result.current.registerCommand(newCommand)
      })

      const commands = result.current.getAvailableCommands()
      const hasTest = commands.some((cmd) => cmd.id === 'test')
      expect(hasTest).toBe(true)
    })

    it('does not register duplicate commands', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const commandsBefore = result.current.getAvailableCommands().length

      act(() => {
        result.current.registerCommand(mockSearchCommand)
      })

      const commandsAfter = result.current.getAvailableCommands().length

      expect(commandsAfter).toBe(commandsBefore)
      expect(consoleWarn).toHaveBeenCalled()

      consoleWarn.mockRestore()
    })

    it('unregisters command', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      act(() => {
        result.current.unregisterCommand('search')
      })

      const commands = result.current.getAvailableCommands()
      const hasSearch = commands.some((cmd) => cmd.id === 'search')
      expect(hasSearch).toBe(false)
    })

    it('handles unregistering non-existent command', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
        })
      )

      const initialLength = result.current.getAvailableCommands().length

      act(() => {
        result.current.unregisterCommand('non-existent')
      })

      expect(result.current.getAvailableCommands()).toHaveLength(initialLength)
    })
  })

  // ==========================================================================
  // Command Availability Tests
  // ==========================================================================

  describe('Command Availability', () => {
    it('filters out unavailable commands', () => {
      const unavailableCommand: Command = {
        ...mockSearchCommand,
        id: 'unavailable',
        available: false,
      }

      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand, unavailableCommand],
        })
      )

      const commands = result.current.getAvailableCommands()
      const hasUnavailable = commands.some((cmd) => cmd.id === 'unavailable')
      expect(hasUnavailable).toBe(false)
    })

    it('respects dynamic availability', () => {
      let isAvailable = false
      const dynamicCommand: Command = {
        ...mockSearchCommand,
        id: 'dynamic',
        available: () => isAvailable,
      }

      const { result, rerender } = renderHook(() =>
        usePromptCommands({
          commands: [dynamicCommand],
        })
      )

      // Initially unavailable
      let commands = result.current.getAvailableCommands()
      let hasDynamic = commands.some((cmd) => cmd.id === 'dynamic')
      expect(hasDynamic).toBe(false)

      // Make available
      isAvailable = true
      rerender()

      commands = result.current.getAvailableCommands()
      hasDynamic = commands.some((cmd) => cmd.id === 'dynamic')
      expect(hasDynamic).toBe(true)
    })
  })

  // ==========================================================================
  // Selection Navigation Tests
  // ==========================================================================

  describe('Selection Navigation', () => {
    it('selects next command', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand, mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('') // Get all commands
      })

      const initialIndex = result.current.selectedIndex

      act(() => {
        result.current.selectNext()
      })

      expect(result.current.selectedIndex).toBeGreaterThan(initialIndex)
    })

    it('selects previous command', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand, mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('')
        result.current.selectNext()
        result.current.selectNext()
      })

      const indexBefore = result.current.selectedIndex

      act(() => {
        result.current.selectPrevious()
      })

      expect(result.current.selectedIndex).toBeLessThan(indexBefore)
    })

    it('selects first command', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand, mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('')
        result.current.selectNext()
        result.current.selectNext()
        result.current.selectFirst()
      })

      expect(result.current.selectedIndex).toBe(0)
    })

    it('selects last command', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand, mockCodeCommand],
        })
      )

      act(() => {
        result.current.search('') // Get all commands
        result.current.selectLast()
      })

      expect(result.current.selectedIndex).toBe(
        result.current.filteredCommands.length - 1
      )
    })
  })

  // ==========================================================================
  // Fuzzy Search Tests
  // ==========================================================================

  describe('Fuzzy Search', () => {
    it('supports fuzzy matching when enabled', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
          fuzzySearch: true,
        })
      )

      act(() => {
        result.current.search('srch') // Fuzzy match for 'search'
      })

      expect(result.current.filteredCommands.length).toBeGreaterThan(0)
    })

    it('uses exact matching when fuzzy disabled', () => {
      const { result } = renderHook(() =>
        usePromptCommands({
          commands: [mockSearchCommand],
          fuzzySearch: false,
        })
      )

      act(() => {
        result.current.search('search')
      })

      const hasSearch = result.current.filteredCommands.some(
        (cmd) => cmd.id === 'search'
      )
      expect(hasSearch).toBe(true)
    })
  })
})
