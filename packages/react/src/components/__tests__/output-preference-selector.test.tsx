/**
 * Tests for Output Preference Selector Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  OutputPreferenceSelector,
  UncontrolledOutputPreferenceSelector,
  useOutputPreference,
  type OutputPreferenceValue,
  type UncontrolledOutputPreferenceSelectorRef,
} from '../output-preference-selector'
import { renderHook, act } from '@testing-library/react'

describe('OutputPreferenceSelector', () => {
  describe('rendering', () => {
    it('should render all three preference options', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
        />
      )

      expect(screen.getByText('Concise')).toBeDefined()
      expect(screen.getByText('Balanced')).toBeDefined()
      expect(screen.getByText('Detailed')).toBeDefined()
    })

    it('should render descriptions in expanded mode', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          displayMode="expanded"
        />
      )

      expect(screen.getByText('Short, to-the-point responses')).toBeDefined()
      expect(screen.getByText('Standard response length')).toBeDefined()
      expect(screen.getByText('Comprehensive explanations')).toBeDefined()
    })

    it('should render compact mode with short labels when size is sm', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          displayMode="compact"
          size="sm"
        />
      )

      expect(screen.getByText('Brief')).toBeDefined()
      expect(screen.getByText('Normal')).toBeDefined()
      expect(screen.getByText('Full')).toBeDefined()
    })

    it('should render compact mode with full labels when size is md or lg', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          displayMode="compact"
          size="md"
        />
      )

      expect(screen.getByText('Concise')).toBeDefined()
      expect(screen.getByText('Balanced')).toBeDefined()
      expect(screen.getByText('Detailed')).toBeDefined()
    })

    it('should show token estimates when enabled', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          showTokenEstimate={true}
          modelCapacity={128000}
          inputTokens={5000}
        />
      )

      // Should show token estimates (format is ~X.XK or ~XXX)
      const tokenEstimates = screen.getAllByText(/~[\d.]+K?/)
      expect(tokenEstimates.length).toBeGreaterThan(0)
    })

    it('should indicate selected option', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="concise"
          onChange={onChange}
        />
      )

      const conciseButton = screen.getByRole('radio', { name: /concise/i })
      expect(conciseButton.getAttribute('aria-checked')).toBe('true')
    })

    it('should apply custom className', () => {
      const onChange = vi.fn()
      const { container } = render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          className="custom-class"
        />
      )

      expect(container.firstChild?.className).toContain('custom-class')
    })
  })

  describe('interaction', () => {
    it('should call onChange with correct values when option selected', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          modelCapacity={128000}
          inputTokens={5000}
        />
      )

      const conciseButton = screen.getByRole('radio', { name: /concise/i })
      fireEvent.click(conciseButton)

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'concise',
          maxTokens: expect.any(Number),
          brevityInstruction: expect.any(String),
        })
      )
    })

    it('should emit different maxTokens for different preferences', () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          modelCapacity={128000}
          inputTokens={5000}
        />
      )

      // Click concise
      fireEvent.click(screen.getByRole('radio', { name: /concise/i }))
      const conciseTokens = onChange.mock.calls[0]?.[0]?.maxTokens

      // Click detailed
      fireEvent.click(screen.getByRole('radio', { name: /detailed/i }))
      const detailedTokens = onChange.mock.calls[1]?.[0]?.maxTokens

      expect(detailedTokens).toBeGreaterThan(conciseTokens)
    })

    it('should not call onChange when disabled', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          disabled={true}
        />
      )

      const conciseButton = screen.getByRole('radio', { name: /concise/i })
      fireEvent.click(conciseButton)

      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('should navigate with arrow keys', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          displayMode="compact"
        />
      )

      const balancedButton = screen.getByRole('radio', { name: /balanced/i })
      fireEvent.keyDown(balancedButton, { key: 'ArrowRight' })

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'detailed' })
      )
    })

    it('should wrap around when navigating past last option', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="detailed"
          onChange={onChange}
          displayMode="compact"
        />
      )

      const detailedButton = screen.getByRole('radio', { name: /detailed/i })
      fireEvent.keyDown(detailedButton, { key: 'ArrowRight' })

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'concise' })
      )
    })

    it('should navigate to first option with Home key', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="detailed"
          onChange={onChange}
          displayMode="compact"
        />
      )

      const detailedButton = screen.getByRole('radio', { name: /detailed/i })
      fireEvent.keyDown(detailedButton, { key: 'Home' })

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'concise' })
      )
    })

    it('should navigate to last option with End key', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="concise"
          onChange={onChange}
          displayMode="compact"
        />
      )

      const conciseButton = screen.getByRole('radio', { name: /concise/i })
      fireEvent.keyDown(conciseButton, { key: 'End' })

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'detailed' })
      )
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
        />
      )

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup.getAttribute('aria-label')).toBe('Response length preference')

      const options = screen.getAllByRole('radio')
      expect(options.length).toBe(3)
    })

    it('should mark disabled options correctly', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          disabled={true}
        />
      )

      const options = screen.getAllByRole('radio')
      options.forEach((option) => {
        expect(option).toBeDisabled()
      })
    })
  })

  describe('token calculation', () => {
    it('should calculate lower tokens for concise preference', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          modelCapacity={128000}
          inputTokens={5000}
        />
      )

      // Get concise tokens
      fireEvent.click(screen.getByRole('radio', { name: /concise/i }))
      const conciseResult = onChange.mock.calls[0]?.[0] as OutputPreferenceValue

      // Get balanced tokens
      onChange.mockClear()
      fireEvent.click(screen.getByRole('radio', { name: /balanced/i }))
      const balancedResult = onChange.mock.calls[0]?.[0] as OutputPreferenceValue

      expect(conciseResult.maxTokens).toBeLessThan(balancedResult.maxTokens)
    })

    it('should include brevity instruction', () => {
      const onChange = vi.fn()
      render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          modelCapacity={128000}
          inputTokens={5000}
        />
      )

      fireEvent.click(screen.getByRole('radio', { name: /concise/i }))
      const result = onChange.mock.calls[0]?.[0] as OutputPreferenceValue

      expect(result.brevityInstruction).toBeDefined()
      expect(result.brevityInstruction.length).toBeGreaterThan(0)
    })

    it('should respect task type in calculation', () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          modelCapacity={128000}
          inputTokens={5000}
          taskType="classification"
        />
      )

      fireEvent.click(screen.getByRole('radio', { name: /balanced/i }))
      const classificationTokens = onChange.mock.calls[0]?.[0]?.maxTokens

      onChange.mockClear()

      rerender(
        <OutputPreferenceSelector
          value="balanced"
          onChange={onChange}
          modelCapacity={128000}
          inputTokens={5000}
          taskType="generation"
        />
      )

      fireEvent.click(screen.getByRole('radio', { name: /balanced/i }))
      const generationTokens = onChange.mock.calls[0]?.[0]?.maxTokens

      // Generation should have more tokens than classification
      expect(generationTokens).toBeGreaterThan(classificationTokens)
    })
  })
})

describe('UncontrolledOutputPreferenceSelector', () => {
  it('should manage its own state', () => {
    const onValueChange = vi.fn()
    render(
      <UncontrolledOutputPreferenceSelector
        defaultValue="balanced"
        onValueChange={onValueChange}
      />
    )

    // Initially balanced should be selected
    const balancedButton = screen.getByRole('radio', { name: /balanced/i })
    expect(balancedButton.getAttribute('aria-checked')).toBe('true')

    // Click concise
    fireEvent.click(screen.getByRole('radio', { name: /concise/i }))

    // Now concise should be selected
    const conciseButton = screen.getByRole('radio', { name: /concise/i })
    expect(conciseButton.getAttribute('aria-checked')).toBe('true')

    expect(onValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'concise' })
    )
  })

  it('should expose getValue via ref', () => {
    const ref = React.createRef<UncontrolledOutputPreferenceSelectorRef>()
    render(
      <UncontrolledOutputPreferenceSelector
        ref={ref}
        defaultValue="detailed"
        modelCapacity={128000}
        inputTokens={5000}
      />
    )

    const value = ref.current?.getValue()
    expect(value?.mode).toBe('detailed')
    expect(value?.maxTokens).toBeGreaterThan(0)
    expect(value?.brevityInstruction).toBeDefined()
  })

  it('should allow setting value via ref', () => {
    const ref = React.createRef<UncontrolledOutputPreferenceSelectorRef>()
    render(
      <UncontrolledOutputPreferenceSelector
        ref={ref}
        defaultValue="balanced"
      />
    )

    act(() => {
      ref.current?.setValue('concise')
    })

    const conciseButton = screen.getByRole('radio', { name: /concise/i })
    expect(conciseButton.getAttribute('aria-checked')).toBe('true')
  })
})

describe('useOutputPreference hook', () => {
  it('should initialize with default mode', () => {
    const { result } = renderHook(() => useOutputPreference('balanced'))

    expect(result.current.preference).toBe('balanced')
  })

  it('should calculate maxTokens based on config', () => {
    const { result } = renderHook(() =>
      useOutputPreference('balanced', {
        modelCapacity: 128000,
        inputTokens: 5000,
      })
    )

    expect(result.current.maxTokens).toBeGreaterThan(0)
  })

  it('should provide brevity instruction', () => {
    const { result } = renderHook(() =>
      useOutputPreference('concise', {
        modelCapacity: 128000,
        inputTokens: 5000,
      })
    )

    expect(result.current.brevityInstruction).toBeDefined()
    expect(result.current.brevityInstruction.length).toBeGreaterThan(0)
  })

  it('should update when preference changes', () => {
    const { result } = renderHook(() =>
      useOutputPreference('balanced', {
        modelCapacity: 128000,
        inputTokens: 5000,
      })
    )

    const balancedTokens = result.current.maxTokens

    act(() => {
      result.current.setPreference('detailed')
    })

    expect(result.current.preference).toBe('detailed')
    expect(result.current.maxTokens).toBeGreaterThan(balancedTokens)
  })

  it('should handle preference change via handler', () => {
    const { result } = renderHook(() => useOutputPreference('balanced'))

    act(() => {
      result.current.handlePreferenceChange({
        mode: 'concise',
        maxTokens: 500,
        brevityInstruction: 'Be brief',
      })
    })

    expect(result.current.preference).toBe('concise')
  })

  it('should provide full result object', () => {
    const { result } = renderHook(() =>
      useOutputPreference('balanced', {
        modelCapacity: 128000,
        inputTokens: 5000,
        taskType: 'chat',
      })
    )

    expect(result.current.result).toBeDefined()
    expect(result.current.result.recommendedMaxTokens).toBe(result.current.maxTokens)
    expect(result.current.result.inputUtilization).toBeGreaterThan(0)
  })
})
