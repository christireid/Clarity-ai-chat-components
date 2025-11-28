/**
 * Tests for Structured Input Builder Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import {
  StructuredInputBuilder,
  useStructuredInput,
  PRESET_FIELDS,
  type StructuredInputField,
  type StructuredInputResult,
} from '../structured-input-builder'
import { renderHook, act } from '@testing-library/react'

describe('StructuredInputBuilder', () => {
  const defaultFields: StructuredInputField[] = [
    {
      id: 'task',
      name: 'task',
      label: 'Task',
      type: 'text',
      required: true,
      section: 'instruction',
      priority: 'critical',
      placeholder: 'Enter task...',
    },
    {
      id: 'context',
      name: 'context',
      label: 'Context',
      type: 'textarea',
      required: false,
      section: 'context',
      priority: 'medium',
      placeholder: 'Enter context...',
      rows: 3,
    },
  ]

  describe('rendering', () => {
    it('should render all fields', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      expect(screen.getByLabelText(/task/i)).toBeDefined()
      expect(screen.getByLabelText(/context/i)).toBeDefined()
    })

    it('should render required indicator for required fields', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      // Task is required, should have asterisk
      const taskLabel = screen.getByText('Task')
      expect(taskLabel.parentElement?.textContent).toContain('*')
    })

    it('should render title and description when provided', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
          title="Build Your Prompt"
          description="Fill in the fields below to create a structured prompt."
        />
      )

      expect(screen.getByText('Build Your Prompt')).toBeDefined()
      expect(screen.getByText('Fill in the fields below to create a structured prompt.')).toBeDefined()
    })

    it('should render submit button by default', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      expect(screen.getByRole('button', { name: /build prompt/i })).toBeDefined()
    })

    it('should hide submit button when showSubmitButton is false', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
          showSubmitButton={false}
        />
      )

      expect(screen.queryByRole('button', { name: /build prompt/i })).toBeNull()
    })

    it('should render custom submit label', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
          submitLabel="Generate"
        />
      )

      expect(screen.getByRole('button', { name: /generate/i })).toBeDefined()
    })
  })

  describe('field types', () => {
    it('should render text input', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        { id: 'text', name: 'text', label: 'Text Field', type: 'text', required: false },
      ]

      render(
        <StructuredInputBuilder fields={fields} values={{}} onChange={onChange} />
      )

      expect(screen.getByRole('textbox')).toBeDefined()
    })

    it('should render textarea', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        { id: 'textarea', name: 'textarea', label: 'Text Area', type: 'textarea', required: false, rows: 4 },
      ]

      render(
        <StructuredInputBuilder fields={fields} values={{}} onChange={onChange} />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea.tagName).toBe('TEXTAREA')
      expect(textarea.getAttribute('rows')).toBe('4')
    })

    it('should render select with options', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        {
          id: 'select',
          name: 'select',
          label: 'Select Field',
          type: 'select',
          required: false,
          options: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
          ],
        },
      ]

      render(
        <StructuredInputBuilder fields={fields} values={{}} onChange={onChange} />
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeDefined()
      expect(screen.getByText('Option A')).toBeDefined()
      expect(screen.getByText('Option B')).toBeDefined()
    })

    it('should render number input', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        { id: 'num', name: 'num', label: 'Number Field', type: 'number', required: false },
      ]

      render(
        <StructuredInputBuilder fields={fields} values={{}} onChange={onChange} />
      )

      expect(screen.getByRole('spinbutton')).toBeDefined()
    })

    it('should render toggle switch', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        { id: 'toggle', name: 'toggle', label: 'Toggle Field', type: 'toggle', required: false },
      ]

      render(
        <StructuredInputBuilder fields={fields} values={{}} onChange={onChange} />
      )

      expect(screen.getByRole('switch')).toBeDefined()
    })
  })

  describe('interaction', () => {
    it('should call onChange when field value changes', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      const taskInput = screen.getByLabelText(/task/i)
      fireEvent.change(taskInput, { target: { value: 'New task' } })

      expect(onChange).toHaveBeenCalledWith({ task: 'New task' })
    })

    it('should preserve other values when one field changes', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{ context: 'existing context' }}
          onChange={onChange}
        />
      )

      const taskInput = screen.getByLabelText(/task/i)
      fireEvent.change(taskInput, { target: { value: 'New task' } })

      expect(onChange).toHaveBeenCalledWith({
        context: 'existing context',
        task: 'New task',
      })
    })

    it('should toggle switch value on click', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        { id: 'toggle', name: 'toggle', label: 'Toggle', type: 'toggle', required: false },
      ]

      render(
        <StructuredInputBuilder
          fields={fields}
          values={{ toggle: 'false' }}
          onChange={onChange}
        />
      )

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(onChange).toHaveBeenCalledWith({ toggle: 'true' })
    })

    it('should call onSubmit with result when form is submitted', () => {
      const onChange = vi.fn()
      const onSubmit = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{ task: 'My task', context: 'My context' }}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )

      const submitButton = screen.getByRole('button', { name: /build prompt/i })
      fireEvent.click(submitButton)

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          values: { task: 'My task', context: 'My context' },
          isValid: true,
          totalTokens: expect.any(Number),
        })
      )
    })

    it('should not call onSubmit when form is invalid', () => {
      const onChange = vi.fn()
      const onSubmit = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}} // Task is required but empty
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )

      const submitButton = screen.getByRole('button', { name: /build prompt/i })
      fireEvent.click(submitButton)

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('validation', () => {
    it('should show error for required field when empty', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      // Check for validation error (required field is empty)
      expect(screen.getByText(/task is required/i)).toBeDefined()
    })

    it('should disable submit button when form is invalid', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      const submitButton = screen.getByRole('button', { name: /build prompt/i })
      expect(submitButton).toBeDisabled()
    })

    it('should enable submit button when form is valid', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{ task: 'Valid task' }}
          onChange={onChange}
        />
      )

      const submitButton = screen.getByRole('button', { name: /build prompt/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('should run custom validation', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        {
          id: 'email',
          name: 'email',
          label: 'Email',
          type: 'text',
          required: true,
          validate: (value) => {
            if (!value.includes('@')) {
              return 'Invalid email format'
            }
            return true
          },
        },
      ]

      render(
        <StructuredInputBuilder
          fields={fields}
          values={{ email: 'notanemail' }}
          onChange={onChange}
        />
      )

      expect(screen.getByText(/invalid email format/i)).toBeDefined()
    })

    it('should handle validation function that throws an error', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        {
          id: 'dangerous',
          name: 'dangerous',
          label: 'Dangerous Field',
          type: 'text',
          required: false,
          validate: () => {
            throw new Error('Validation exploded!')
          },
        },
      ]

      // Should not throw when rendering
      expect(() => {
        render(
          <StructuredInputBuilder
            fields={fields}
            values={{ dangerous: 'some value' }}
            onChange={onChange}
          />
        )
      }).not.toThrow()

      // Should show validation error message
      expect(screen.getByText(/validation error for dangerous field/i)).toBeDefined()
    })
  })

  describe('token estimation', () => {
    it('should show token usage bar when showTotalTokens is true', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{ task: 'Test task', context: 'Test context' }}
          onChange={onChange}
          showTotalTokens={true}
          maxTokens={1000}
        />
      )

      expect(screen.getByText(/token usage/i)).toBeDefined()
    })

    it('should show token breakdown per field when enabled', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{ task: 'This is a test task' }}
          onChange={onChange}
          showTokenBreakdown={true}
          showTotalTokens={true}
        />
      )

      // Should show tokens for task field
      expect(screen.getAllByText(/tokens/i).length).toBeGreaterThan(0)
    })
  })

  describe('display modes', () => {
    it('should render in compact mode', () => {
      const onChange = vi.fn()
      const { container } = render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
          displayMode="compact"
        />
      )

      // Compact mode uses grid layout
      expect(container.querySelector('.grid')).toBeDefined()
    })

    it('should render in inline mode', () => {
      const onChange = vi.fn()
      const { container } = render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
          displayMode="inline"
        />
      )

      // Inline mode uses flex layout
      expect(container.querySelector('.flex')).toBeDefined()
    })
  })

  describe('disabled state', () => {
    it('should disable all fields when disabled prop is true', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
          disabled={true}
        />
      )

      const taskInput = screen.getByLabelText(/task/i)
      const contextInput = screen.getByLabelText(/context/i)

      expect(taskInput).toBeDisabled()
      expect(contextInput).toBeDisabled()
    })

    it('should disable submit button when disabled prop is true', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{ task: 'Valid' }}
          onChange={onChange}
          disabled={true}
        />
      )

      const submitButton = screen.getByRole('button', { name: /build prompt/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('accessibility', () => {
    it('should have proper form structure', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      // Should render as a form
      expect(document.querySelector('form')).toBeDefined()
    })

    it('should link labels to inputs', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      // getByLabelText will fail if label is not properly associated
      expect(screen.getByLabelText(/task/i)).toBeDefined()
      expect(screen.getByLabelText(/context/i)).toBeDefined()
    })

    it('should mark invalid fields with aria-invalid', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      const taskInput = screen.getByLabelText(/task/i)
      expect(taskInput.getAttribute('aria-invalid')).toBe('true')
    })

    it('should set aria-required for required fields', () => {
      const onChange = vi.fn()
      render(
        <StructuredInputBuilder
          fields={defaultFields}
          values={{}}
          onChange={onChange}
        />
      )

      const taskInput = screen.getByLabelText(/task/i)
      const contextInput = screen.getByLabelText(/context/i)

      // Task is required
      expect(taskInput.getAttribute('aria-required')).toBe('true')
      // Context is not required
      expect(contextInput.getAttribute('aria-required')).toBe('false')
    })
  })

  describe('sections', () => {
    it('should group fields by section', () => {
      const onChange = vi.fn()
      const fields: StructuredInputField[] = [
        { id: '1', name: 'instr1', label: 'Instruction 1', type: 'text', required: false, section: 'instruction' },
        { id: '2', name: 'instr2', label: 'Instruction 2', type: 'text', required: false, section: 'instruction' },
        { id: '3', name: 'ctx1', label: 'Context 1', type: 'text', required: false, section: 'context' },
      ]

      render(
        <StructuredInputBuilder
          fields={fields}
          values={{}}
          onChange={onChange}
        />
      )

      // Should have section headers
      expect(screen.getByText('instruction')).toBeDefined()
      expect(screen.getByText('context')).toBeDefined()
    })
  })
})

describe('useStructuredInput hook', () => {
  const fields: StructuredInputField[] = [
    { id: 'task', name: 'task', label: 'Task', type: 'text', required: true },
    { id: 'notes', name: 'notes', label: 'Notes', type: 'textarea', required: false },
  ]

  it('should initialize with default values from fields', () => {
    const fieldsWithDefaults: StructuredInputField[] = [
      { id: 'task', name: 'task', label: 'Task', type: 'text', required: true, defaultValue: 'Default task' },
    ]

    const { result } = renderHook(() => useStructuredInput(fieldsWithDefaults))

    expect(result.current.values.task).toBe('Default task')
  })

  it('should initialize with provided initial values', () => {
    const { result } = renderHook(() =>
      useStructuredInput(fields, {
        initialValues: { task: 'Initial task' },
      })
    )

    expect(result.current.values.task).toBe('Initial task')
  })

  it('should update values with setValues', () => {
    const { result } = renderHook(() => useStructuredInput(fields))

    act(() => {
      result.current.setValues({ task: 'New task', notes: 'Some notes' })
    })

    expect(result.current.values).toEqual({
      task: 'New task',
      notes: 'Some notes',
    })
  })

  it('should update single field with setFieldValue', () => {
    const { result } = renderHook(() =>
      useStructuredInput(fields, {
        initialValues: { task: 'Original', notes: 'Original notes' },
      })
    )

    act(() => {
      result.current.setFieldValue('task', 'Updated')
    })

    expect(result.current.values.task).toBe('Updated')
    expect(result.current.values.notes).toBe('Original notes')
  })

  it('should reset to initial values', () => {
    const { result } = renderHook(() =>
      useStructuredInput(fields, {
        initialValues: { task: 'Initial' },
      })
    )

    act(() => {
      result.current.setValues({ task: 'Changed', notes: 'New' })
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.values.task).toBe('Initial')
    expect(result.current.values.notes).toBeUndefined()
  })

  it('should calculate token breakdown', () => {
    const { result } = renderHook(() =>
      useStructuredInput(fields, {
        initialValues: { task: 'This is a test task' },
      })
    )

    expect(result.current.result.tokenBreakdown.length).toBe(2)
    expect(result.current.result.totalTokens).toBeGreaterThan(0)
  })

  it('should validate required fields', () => {
    const { result } = renderHook(() => useStructuredInput(fields))

    // Task is required but empty
    expect(result.current.result.isValid).toBe(false)
    expect(result.current.result.errors.task).toBeDefined()
  })

  it('should report valid when requirements met', () => {
    const { result } = renderHook(() =>
      useStructuredInput(fields, {
        initialValues: { task: 'Valid task' },
      })
    )

    expect(result.current.result.isValid).toBe(true)
    expect(Object.keys(result.current.result.errors)).toHaveLength(0)
  })

  it('should detect when over budget', () => {
    const { result } = renderHook(() =>
      useStructuredInput(fields, {
        maxTokens: 10, // Very low budget
        initialValues: { task: 'This is a very long task description that exceeds the token budget' },
      })
    )

    expect(result.current.isOverBudget).toBe(true)
  })

  it('should handle validation function that throws', () => {
    const fieldsWithThrowingValidator: StructuredInputField[] = [
      {
        id: 'boom',
        name: 'boom',
        label: 'Boom',
        type: 'text',
        required: false,
        validate: () => {
          throw new Error('Kaboom!')
        },
      },
    ]

    const { result } = renderHook(() =>
      useStructuredInput(fieldsWithThrowingValidator, {
        initialValues: { boom: 'trigger' },
      })
    )

    // Should not crash and should report invalid
    expect(result.current.result.isValid).toBe(false)
    expect(result.current.result.errors.boom).toBe('Validation error for boom')
  })

  it('should format prompt correctly', () => {
    const { result } = renderHook(() =>
      useStructuredInput(
        [
          { id: '1', name: 'task', label: 'Task', type: 'text', required: true, section: 'instruction' },
          { id: '2', name: 'context', label: 'Context', type: 'text', required: false, section: 'context' },
        ],
        {
          initialValues: { task: 'Do something', context: 'Background info' },
        }
      )
    )

    expect(result.current.result.formattedPrompt).toContain('Task')
    expect(result.current.result.formattedPrompt).toContain('Do something')
    expect(result.current.result.formattedPrompt).toContain('Context')
    expect(result.current.result.formattedPrompt).toContain('Background info')
  })

  it('should handle formatPrompt that throws by falling back to default', () => {
    const throwingFormatter = () => {
      throw new Error('Formatter exploded!')
    }

    const { result } = renderHook(() =>
      useStructuredInput(
        [{ id: 'task', name: 'task', label: 'Task', type: 'text', required: true }],
        {
          initialValues: { task: 'Test value' },
          formatPrompt: throwingFormatter,
        }
      )
    )

    // Should not crash and should use fallback formatter
    expect(result.current.result.formattedPrompt).toContain('Task')
    expect(result.current.result.formattedPrompt).toContain('Test value')
  })
})

describe('PRESET_FIELDS', () => {
  it('should create task field with defaults', () => {
    const field = PRESET_FIELDS.task()

    expect(field.id).toBe('task')
    expect(field.name).toBe('task')
    expect(field.type).toBe('textarea')
    expect(field.required).toBe(true)
    expect(field.section).toBe('instruction')
    expect(field.priority).toBe('critical')
  })

  it('should allow overriding preset field properties', () => {
    const field = PRESET_FIELDS.task({
      label: 'Custom Task Label',
      required: false,
      rows: 5,
    })

    expect(field.label).toBe('Custom Task Label')
    expect(field.required).toBe(false)
    expect(field.rows).toBe(5)
    // Original defaults still apply
    expect(field.id).toBe('task')
  })

  it('should create context field with defaults', () => {
    const field = PRESET_FIELDS.context()

    expect(field.section).toBe('context')
    expect(field.priority).toBe('medium')
    expect(field.required).toBe(false)
  })

  it('should create format field with select options', () => {
    const field = PRESET_FIELDS.format()

    expect(field.type).toBe('select')
    expect(field.options?.length).toBeGreaterThan(0)
    expect(field.options?.some((o) => o.value === 'json')).toBe(true)
  })

  it('should create tone field with select options', () => {
    const field = PRESET_FIELDS.tone()

    expect(field.type).toBe('select')
    expect(field.options?.some((o) => o.value === 'professional')).toBe(true)
  })

  it('should create question field as critical priority', () => {
    const field = PRESET_FIELDS.question()

    expect(field.section).toBe('question')
    expect(field.priority).toBe('critical')
    expect(field.required).toBe(true)
  })

  it('should create examples field', () => {
    const field = PRESET_FIELDS.examples()

    expect(field.section).toBe('example')
    expect(field.priority).toBe('medium')
    expect(field.type).toBe('textarea')
  })

  it('should create constraints field', () => {
    const field = PRESET_FIELDS.constraints()

    expect(field.section).toBe('constraint')
    expect(field.priority).toBe('high')
  })
})

describe('edge cases', () => {
  it('should handle empty fields array', () => {
    const onChange = vi.fn()

    expect(() => {
      render(
        <StructuredInputBuilder
          fields={[]}
          values={{}}
          onChange={onChange}
        />
      )
    }).not.toThrow()
  })

  it('should handle field with no section', () => {
    const onChange = vi.fn()
    const fields: StructuredInputField[] = [
      { id: 'test', name: 'test', label: 'Test', type: 'text', required: false },
    ]

    render(
      <StructuredInputBuilder
        fields={fields}
        values={{}}
        onChange={onChange}
      />
    )

    expect(screen.getByLabelText(/test/i)).toBeDefined()
  })

  it('should handle undefined values gracefully', () => {
    const onChange = vi.fn()

    render(
      <StructuredInputBuilder
        fields={[{ id: 'test', name: 'test', label: 'Test', type: 'text', required: false }]}
        values={{ other: 'value' }}
        onChange={onChange}
      />
    )

    // Should render without error
    expect(screen.getByLabelText(/test/i)).toBeDefined()
  })

  it('should handle maxLength on input', () => {
    const onChange = vi.fn()
    const fields: StructuredInputField[] = [
      { id: 'test', name: 'test', label: 'Test', type: 'text', required: false, maxLength: 100 },
    ]

    render(
      <StructuredInputBuilder
        fields={fields}
        values={{}}
        onChange={onChange}
      />
    )

    const input = screen.getByLabelText(/test/i)
    expect(input.getAttribute('maxlength')).toBe('100')
  })

  it('should handle field descriptions', () => {
    const onChange = vi.fn()
    const fields: StructuredInputField[] = [
      {
        id: 'test',
        name: 'test',
        label: 'Test',
        type: 'text',
        required: false,
        description: 'This is a helpful description',
      },
    ]

    render(
      <StructuredInputBuilder
        fields={fields}
        values={{}}
        onChange={onChange}
      />
    )

    expect(screen.getByText('This is a helpful description')).toBeDefined()
  })

  it('should use defaultValue from field when no value provided', () => {
    const onChange = vi.fn()
    const fields: StructuredInputField[] = [
      { id: 'test', name: 'test', label: 'Test', type: 'text', required: false, defaultValue: 'Default' },
    ]

    render(
      <StructuredInputBuilder
        fields={fields}
        values={{}}
        onChange={onChange}
      />
    )

    const input = screen.getByLabelText(/test/i) as HTMLInputElement
    expect(input.value).toBe('Default')
  })

  it('should handle formatPrompt that throws by falling back to default', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn()
    const throwingFormatter = () => {
      throw new Error('Formatter exploded!')
    }
    const fields: StructuredInputField[] = [
      { id: 'task', name: 'task', label: 'Task', type: 'text', required: true },
    ]

    render(
      <StructuredInputBuilder
        fields={fields}
        values={{ task: 'Test task' }}
        onChange={onChange}
        onSubmit={onSubmit}
        formatPrompt={throwingFormatter}
      />
    )

    // Should not throw when submitting
    const submitButton = screen.getByRole('button', { name: /build prompt/i })
    expect(() => fireEvent.click(submitButton)).not.toThrow()

    // onSubmit should still be called with fallback formatted prompt
    expect(onSubmit).toHaveBeenCalled()
    const result = onSubmit.mock.calls[0][0]
    expect(result.formattedPrompt).toContain('Task')
  })

  it('should sanitize field.id with special characters for valid HTML IDs', () => {
    const onChange = vi.fn()
    const fields: StructuredInputField[] = [
      { id: 'my field!@#', name: 'test', label: 'Test', type: 'text', required: false },
    ]

    render(
      <StructuredInputBuilder
        fields={fields}
        values={{}}
        onChange={onChange}
      />
    )

    // Should render without error and input should be accessible
    const input = screen.getByLabelText(/test/i)
    expect(input).toBeDefined()
    // The ID should be sanitized (no spaces or special chars)
    expect(input.id).not.toContain(' ')
    expect(input.id).not.toContain('!')
    expect(input.id).toMatch(/^field-[a-zA-Z]/)
  })
})
