'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  AlertCircle,
  Check,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import { Label } from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import { Checkbox } from '@clarity-chat/primitives'
import { Switch } from '@clarity-chat/primitives'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'
import { Slider } from '@clarity-chat/primitives'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@clarity-chat/primitives'

// Types
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'
  | 'slider'
  | 'array'
  | 'group'

export interface FieldOption {
  label: string
  value: string
  disabled?: boolean
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: any
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    message?: string
  }
  options?: FieldOption[]
  fields?: FormField[] // For group type
  itemField?: FormField // For array type
}

export interface FormSchema {
  fields: FormField[]
  submitLabel?: string
  cancelLabel?: string
}

// Field error display
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  )
}

// Field description/help
function FieldDescription({ text }: { text?: string }) {
  if (!text) return null
  return <p className="text-xs text-muted-foreground mt-1">{text}</p>
}

// Field wrapper
interface FieldWrapperProps {
  field: FormField
  children: React.ReactNode
  error?: string
}

function FieldWrapper({ field, children, error }: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={field.id} className="flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </Label>
        {field.description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">{field.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
      <FieldError message={error} />
    </div>
  )
}

// Individual field renderers
interface RenderFieldProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  error?: string
}

function TextField({ field, value, onChange, error }: RenderFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <Input
        id={field.id}
        type={
          field.type === 'email'
            ? 'email'
            : field.type === 'password'
              ? 'password'
              : 'text'
        }
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        className={cn(error && 'border-destructive')}
      />
    </FieldWrapper>
  )
}

function NumberField({ field, value, onChange, error }: RenderFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <Input
        id={field.id}
        type="number"
        placeholder={field.placeholder}
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : undefined)
        }
        disabled={field.disabled}
        min={field.validation?.min}
        max={field.validation?.max}
        className={cn(error && 'border-destructive')}
      />
    </FieldWrapper>
  )
}

function TextareaField({ field, value, onChange, error }: RenderFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <Textarea
        id={field.id}
        placeholder={field.placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={field.disabled}
        className={cn('min-h-[100px]', error && 'border-destructive')}
        maxLength={field.validation?.maxLength}
      />
      {field.validation?.maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {value?.length || 0} / {field.validation.maxLength}
        </div>
      )}
    </FieldWrapper>
  )
}

function SelectField({ field, value, onChange, error }: RenderFieldProps) {
  return (
    <FieldWrapper field={field} error={error}>
      <Select
        value={value || ''}
        onValueChange={onChange}
        disabled={field.disabled}
      >
        <SelectTrigger className={cn(error && 'border-destructive')}>
          <SelectValue placeholder={field.placeholder || 'Select...'} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  )
}

function CheckboxField({ field, value, onChange }: RenderFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={field.id}
        checked={value || false}
        onCheckedChange={onChange}
        disabled={field.disabled}
      />
      <div className="space-y-1">
        <Label htmlFor={field.id} className="cursor-pointer">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.description && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}
      </div>
    </div>
  )
}

function SwitchField({ field, value, onChange }: RenderFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.description && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}
      </div>
      <Switch
        id={field.id}
        checked={value || false}
        onCheckedChange={onChange}
        disabled={field.disabled}
      />
    </div>
  )
}

function SliderField({ field, value, onChange, error }: RenderFieldProps) {
  const min = field.validation?.min ?? 0
  const max = field.validation?.max ?? 100

  return (
    <FieldWrapper field={field} error={error}>
      <div className="space-y-3">
        <Slider
          id={field.id}
          value={[value ?? min]}
          onValueChange={(v) => onChange(v[0])}
          min={min}
          max={max}
          disabled={field.disabled}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{min}</span>
          <span className="font-medium text-foreground">{value ?? min}</span>
          <span>{max}</span>
        </div>
      </div>
    </FieldWrapper>
  )
}

function ArrayField({ field, value, onChange, error }: RenderFieldProps) {
  const items = value || []

  const addItem = () => {
    onChange([...items, field.itemField?.defaultValue ?? ''])
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_: any, i: number) => i !== index))
  }

  const updateItem = (index: number, newValue: any) => {
    const newItems = [...items]
    newItems[index] = newValue
    onChange(newItems)
  }

  return (
    <FieldWrapper field={field} error={error}>
      <div className="space-y-2">
        {items.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={field.itemField?.placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="h-8 w-8 p-0 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full bg-transparent"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add {field.itemField?.label || 'Item'}
        </Button>
      </div>
    </FieldWrapper>
  )
}

function GroupField({
  field,
  value,
  onChange,
  errors,
}: RenderFieldProps & { errors?: Record<string, string> }) {
  const groupValue = value || {}

  const handleFieldChange = (fieldId: string, fieldValue: any) => {
    onChange({ ...groupValue, [fieldId]: fieldValue })
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h4 className="font-medium text-sm">{field.label}</h4>
      {field.fields?.map((subField) => (
        <DynamicField
          key={subField.id}
          field={subField}
          value={groupValue[subField.id]}
          onChange={(v) => handleFieldChange(subField.id, v)}
          error={errors?.[subField.id]}
        />
      ))}
    </div>
  )
}

// Dynamic field renderer
interface DynamicFieldProps {
  field: FormField
  value: any
  onChange: (value: any) => void
  error?: string
  errors?: Record<string, string>
}

export function DynamicField({
  field,
  value,
  onChange,
  error,
  errors,
}: DynamicFieldProps) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <TextField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'number':
      return (
        <NumberField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'textarea':
      return (
        <TextareaField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'select':
      return (
        <SelectField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'checkbox':
      return (
        <CheckboxField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'switch':
      return (
        <SwitchField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'slider':
      return (
        <SliderField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'array':
      return (
        <ArrayField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
        />
      )
    case 'group':
      return (
        <GroupField
          field={field}
          value={value}
          onChange={onChange}
          error={error}
          errors={errors}
        />
      )
    default:
      return null
  }
}

// Main dynamic form component
interface DynamicFormProps {
  schema: FormSchema
  defaultValues?: Record<string, any>
  onSubmit: (values: Record<string, any>) => void
  onCancel?: () => void
  loading?: boolean
  className?: string
}

export function DynamicForm({
  schema,
  defaultValues = {},
  onSubmit,
  onCancel,
  loading = false,
  className,
}: DynamicFormProps) {
  const [values, setValues] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    schema.fields.forEach((field) => {
      initial[field.id] = defaultValues[field.id] ?? field.defaultValue
    })
    return initial
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleFieldChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
    // Clear error when field changes
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    schema.fields.forEach((field) => {
      const value = values[field.id]

      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        newErrors[field.id] = `${field.label} is required`
        return
      }

      if (field.validation) {
        const { min, max, minLength, maxLength, pattern, message } =
          field.validation

        if (typeof value === 'number') {
          if (min !== undefined && value < min) {
            newErrors[field.id] = message || `Must be at least ${min}`
          }
          if (max !== undefined && value > max) {
            newErrors[field.id] = message || `Must be at most ${max}`
          }
        }

        if (typeof value === 'string') {
          if (minLength !== undefined && value.length < minLength) {
            newErrors[field.id] =
              message || `Must be at least ${minLength} characters`
          }
          if (maxLength !== undefined && value.length > maxLength) {
            newErrors[field.id] =
              message || `Must be at most ${maxLength} characters`
          }
          if (pattern && !new RegExp(pattern).test(value)) {
            newErrors[field.id] = message || 'Invalid format'
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(values)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {schema.fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={(value) => handleFieldChange(field.id, value)}
          error={errors[field.id]}
          errors={errors}
        />
      ))}

      <div className="flex items-center justify-end gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {schema.cancelLabel || 'Cancel'}
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <span className="mr-2 animate-spin">...</span>}
          {schema.submitLabel || 'Submit'}
        </Button>
      </div>
    </form>
  )
}
