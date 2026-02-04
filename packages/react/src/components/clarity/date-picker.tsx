'use client'

import * as React from 'react'
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  addMonths,
  subMonths,
} from 'date-fns'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Input } from '@clarity-chat/primitives'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@clarity-chat/primitives'
import { Calendar, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@clarity-chat/primitives'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  showTime?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  minDate,
  maxDate,
  showTime = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(value ?? new Date())
  const [selectedTime, setSelectedTime] = React.useState({
    hours: value?.getHours() ?? 12,
    minutes: value?.getMinutes() ?? 0,
  })

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date))
    const end = endOfWeek(endOfMonth(date))
    const days: Date[] = []
    let current = start
    while (current <= end) {
      days.push(current)
      current = addDays(current, 1)
    }
    return days
  }

  const days = getDaysInMonth(currentMonth)

  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, minDate)) return true
    if (maxDate && isAfter(date, maxDate)) return true
    return false
  }

  const handleDateSelect = (date: Date) => {
    let newDate = date
    if (showTime) {
      newDate = new Date(date)
      newDate.setHours(selectedTime.hours)
      newDate.setMinutes(selectedTime.minutes)
    }
    onChange?.(newDate)
    if (!showTime) {
      setOpen(false)
    }
  }

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    const numVal = parseInt(val)
    const newTime = { ...selectedTime, [type]: numVal }
    setSelectedTime(newTime)
    if (value) {
      const newDate = new Date(value)
      newDate.setHours(newTime.hours)
      newDate.setMinutes(newTime.minutes)
      onChange?.(newDate)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? (
            format(value, showTime ? 'PPP p' : 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={(v) => {
                  const newDate = new Date(currentMonth)
                  newDate.setMonth(parseInt(v))
                  setCurrentMonth(newDate)
                }}
              >
                <SelectTrigger className="h-7 w-28 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, i) => (
                    <SelectItem key={month} value={i.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={(v) => {
                  const newDate = new Date(currentMonth)
                  newDate.setFullYear(parseInt(v))
                  setCurrentMonth(newDate)
                }}
              >
                <SelectTrigger className="h-7 w-20 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => {
                    const year = new Date().getFullYear() - 10 + i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth()
              const isSelected = value && isSameDay(day, value)
              const isDisabled = isDateDisabled(day)

              return (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  disabled={isDisabled}
                  className={cn(
                    'h-8 w-8 p-0 font-normal',
                    !isCurrentMonth && 'text-muted-foreground/50',
                    isToday(day) && 'border border-accent',
                    isSelected &&
                      'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => handleDateSelect(day)}
                >
                  {day.getDate()}
                </Button>
              )
            })}
          </div>

          {/* Time Picker */}
          {showTime && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedTime.hours.toString()}
                  onValueChange={(v) => handleTimeChange('hours', v)}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>:</span>
                <Select
                  value={selectedTime.minutes.toString()}
                  onValueChange={(v) => handleTimeChange('minutes', v)}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = new Date()
                setCurrentMonth(today)
                handleDateSelect(today)
              }}
            >
              Today
            </Button>
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange?.(undefined)
                  setOpen(false)
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Date Range Picker
interface DateRangePickerProps {
  value?: { from: Date; to: Date }
  onChange?: (range: { from: Date; to: Date } | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Select date range',
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(
    value?.from ?? new Date()
  )
  const [selecting, setSelecting] = React.useState<'from' | 'to'>('from')
  const [tempRange, setTempRange] = React.useState(value)

  const presets = [
    { label: 'Today', getValue: () => ({ from: new Date(), to: new Date() }) },
    {
      label: 'Last 7 days',
      getValue: () => ({ from: addDays(new Date(), -7), to: new Date() }),
    },
    {
      label: 'Last 30 days',
      getValue: () => ({ from: addDays(new Date(), -30), to: new Date() }),
    },
    {
      label: 'This month',
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
  ]

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const getDaysInMonth = (date: Date) => {
    const start = startOfWeek(startOfMonth(date))
    const end = endOfWeek(endOfMonth(date))
    const days: Date[] = []
    let current = start
    while (current <= end) {
      days.push(current)
      current = addDays(current, 1)
    }
    return days
  }

  const days = getDaysInMonth(currentMonth)
  const nextMonthDays = getDaysInMonth(addMonths(currentMonth, 1))

  const isInRange = (day: Date) => {
    if (!tempRange?.from || !tempRange?.to) return false
    return isAfter(day, tempRange.from) && isBefore(day, tempRange.to)
  }

  const handleDayClick = (day: Date) => {
    if (selecting === 'from') {
      setTempRange({ from: day, to: day })
      setSelecting('to')
    } else {
      if (isBefore(day, tempRange?.from ?? new Date())) {
        setTempRange({ from: day, to: tempRange?.from ?? day })
      } else {
        setTempRange({ ...tempRange!, to: day })
      }
      setSelecting('from')
    }
  }

  const handleApply = () => {
    if (tempRange) {
      onChange?.(tempRange)
    }
    setOpen(false)
  }

  const renderMonth = (monthDate: Date, monthDays: Date[]) => (
    <div>
      <div className="text-center text-sm font-medium mb-2">
        {format(monthDate, 'MMMM yyyy')}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, i) => {
          const isCurrentMonth = day.getMonth() === monthDate.getMonth()
          const isStart = tempRange?.from && isSameDay(day, tempRange.from)
          const isEnd = tempRange?.to && isSameDay(day, tempRange.to)
          const inRange = isInRange(day)

          return (
            <Button
              key={i}
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 p-0 font-normal',
                !isCurrentMonth && 'text-muted-foreground/50',
                (isStart || isEnd) && 'bg-accent text-accent-foreground',
                inRange && 'bg-accent/20',
                isToday(day) && 'border border-accent'
              )}
              onClick={() => handleDayClick(day)}
            >
              {day.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal min-w-[240px]',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value ? (
            <>
              {format(value.from, 'LLL dd, y')} -{' '}
              {format(value.to, 'LLL dd, y')}
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Presets */}
          <div className="border-r border-border p-3 space-y-1">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const range = preset.getValue()
                  setTempRange(range)
                  onChange?.(range)
                  setOpen(false)
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-4">
              {renderMonth(currentMonth, days)}
              {renderMonth(addMonths(currentMonth, 1), nextMonthDays)}
            </div>

            <div className="mt-3 pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Relative time display
interface TimeAgoProps {
  date: Date
  className?: string
}

export function TimeAgo({ date, className }: TimeAgoProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    const interval = setInterval(forceUpdate, 60000)
    return () => clearInterval(interval)
  }, [])

  const getTimeAgo = (d: Date) => {
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return format(d, 'MMM d')
  }

  return (
    <span
      className={cn('text-muted-foreground', className)}
      title={format(date, 'PPpp')}
    >
      {getTimeAgo(date)}
    </span>
  )
}

// Timestamp display
interface TimestampProps {
  date: Date
  format?: 'relative' | 'absolute' | 'datetime'
  className?: string
}

export function Timestamp({
  date,
  format: formatType = 'relative',
  className,
}: TimestampProps) {
  if (formatType === 'relative') {
    return <TimeAgo date={date} className={className} />
  }

  const formatStr = formatType === 'datetime' ? 'PPpp' : 'PPP'

  return (
    <span className={cn('text-muted-foreground', className)}>
      {format(date, formatStr)}
    </span>
  )
}
