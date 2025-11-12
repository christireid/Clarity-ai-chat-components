/**
 * Reusable SVG Diagram Components
 * 
 * Consistent, brand-aligned visual elements for documentation
 */

'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// Color palette from design system
const colors = {
  brand: '#3b82f6',
  brandLight: '#60a5fa',
  brandDark: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: '#6b7280',
  neutralLight: '#d1d5db',
  background: '#f9fafb',
  backgroundDark: '#1f2937',
}

interface BoxNodeProps {
  x: number
  y: number
  width: number
  height: number
  label: string | ReactNode
  color?: string
  icon?: ReactNode
  animate?: boolean
  delay?: number
}

export function BoxNode({
  x,
  y,
  width,
  height,
  label,
  color = colors.brand,
  icon,
  animate = true,
  delay = 0,
}: BoxNodeProps) {
  const Component = animate ? motion.g : 'g'
  
  return (
    <Component
      initial={animate ? { opacity: 0, y: -10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={animate ? { delay, duration: 0.3 } : undefined}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="12"
        fill="white"
        stroke={color}
        strokeWidth="2"
        className="dark:fill-slate-900 transition-colors"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={8}
        rx="12"
        fill={color}
        opacity="0.15"
      />
      {icon && (
        <foreignObject x={x + 12} y={y + 16} width="32" height="32">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10">
            {icon}
          </div>
        </foreignObject>
      )}
      <foreignObject
        x={x + (icon ? 52 : 16)}
        y={y + 16}
        width={width - (icon ? 68 : 32)}
        height={height - 32}
      >
        <div className="flex items-center h-full">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {label}
          </div>
        </div>
      </foreignObject>
    </Component>
  )
}

interface ArrowProps {
  from: { x: number; y: number }
  to: { x: number; y: number }
  color?: string
  dashed?: boolean
  animated?: boolean
  label?: string
  delay?: number
}

export function Arrow({
  from,
  to,
  color = colors.neutral,
  dashed = false,
  animated = true,
  label,
  delay = 0,
}: ArrowProps) {
  const Component = animated ? motion.g : 'g'
  
  return (
    <Component
      initial={animated ? { opacity: 0 } : undefined}
      animate={animated ? { opacity: 1 } : undefined}
      transition={animated ? { delay, duration: 0.3 } : undefined}
    >
      <defs>
        <marker
          id={`arrowhead-${color.replace('#', '')}`}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={color} />
        </marker>
      </defs>
      
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dashed ? "5,5" : "0"}
        markerEnd={`url(#arrowhead-${color.replace('#', '')})`}
        initial={animated ? { pathLength: 0 } : undefined}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={animated ? { delay: delay + 0.2, duration: 0.5, ease: 'easeOut' } : undefined}
      />
      
      {label && (
        <foreignObject
          x={(from.x + to.x) / 2 - 40}
          y={(from.y + to.y) / 2 - 12}
          width="80"
          height="24"
        >
          <div className="flex items-center justify-center h-full">
            <span className="px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-medium">
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </Component>
  )
}

interface IconBadgeProps {
  icon: ReactNode
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function IconBadge({ icon, color = colors.brand, size = 'md' }: IconBadgeProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
  }
  
  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center text-white shadow-lg`}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      }}
    >
      {icon}
    </div>
  )
}

interface StepIndicatorProps {
  steps: Array<{
    number: number
    label: string
    description?: string
    complete?: boolean
  }>
  currentStep?: number
  orientation?: 'horizontal' | 'vertical'
}

export function StepIndicator({
  steps,
  currentStep,
  orientation = 'horizontal',
}: StepIndicatorProps) {
  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} gap-4`}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                step.complete || (currentStep && step.number <= currentStep)
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-400'
              }`}
            >
              {step.complete ? '✓' : step.number}
            </motion.div>
            <div>
              <div className="font-semibold text-sm">{step.label}</div>
              {step.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {step.description}
                </div>
              )}
            </div>
          </div>
          {index < steps.length - 1 && orientation === 'horizontal' && (
            <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 min-w-[40px]" />
          )}
          {index < steps.length - 1 && orientation === 'vertical' && (
            <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 ml-5" />
          )}
        </div>
      ))}
    </div>
  )
}

interface FeatureGridProps {
  features: Array<{
    icon: ReactNode
    title: string
    description: string
    highlight?: boolean
  }>
  columns?: 2 | 3 | 4
}

export function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }
  
  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6 my-8`}>
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
            feature.highlight
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="mb-4">{feature.icon}</div>
          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

interface ComparisonTableProps {
  headers: string[]
  rows: Array<{
    label: string
    values: Array<string | boolean | ReactNode>
  }>
}

export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b-2"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <motion.tr
              key={row.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-sm">{row.label}</td>
              {row.values.map((value, valueIndex) => (
                <td key={valueIndex} className="px-6 py-4 text-sm">
                  {typeof value === 'boolean' ? (
                    value ? (
                      <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                    ) : (
                      <span className="text-gray-300 dark:text-gray-600 text-lg">–</span>
                    )
                  ) : (
                    value
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface FlowStepProps {
  steps: Array<{
    icon?: ReactNode
    title: string
    description?: string
  }>
  compact?: boolean
}

export function FlowStep({ steps, compact = false }: FlowStepProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 my-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4 flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className={compact ? 'flex items-center gap-3' : 'flex flex-col items-center text-center'}
          >
            {step.icon && (
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                {step.icon}
              </div>
            )}
            <div className={compact ? '' : 'mt-3'}>
              <div className="font-semibold text-sm mb-1">{step.title}</div>
              {step.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {step.description}
                </div>
              )}
            </div>
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.15 + 0.2, duration: 0.3 }}
              className="hidden md:block"
            >
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                <path
                  d="M 0 12 L 32 12"
                  stroke={colors.neutral}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path d="M 28 8 L 36 12 L 28 16" fill={colors.neutral} />
              </svg>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

interface PulsingDotProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

export function PulsingDot({ color = colors.brand, size = 'md' }: PulsingDotProps) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }
  
  return (
    <div className="relative inline-flex">
      <motion.div
        className={`${sizes[size]} rounded-full`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute inset-0 ${sizes[size]} rounded-full`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.5, 1.8],
          opacity: [0.6, 0.3, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </div>
  )
}

interface HighlightBoxProps {
  children: ReactNode
  color?: 'brand' | 'success' | 'warning' | 'error'
  icon?: ReactNode
  title?: string
}

export function HighlightBox({ children, color = 'brand', icon, title }: HighlightBoxProps) {
  const colorClasses = {
    brand: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
  }
  
  return (
    <div className={`p-6 rounded-xl border-2 my-6 ${colorClasses[color]}`}>
      {(icon || title) && (
        <div className="flex items-center gap-3 mb-3">
          {icon && <div className="text-2xl">{icon}</div>}
          {title && <h4 className="font-bold text-lg">{title}</h4>}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  )
}

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({
  value,
  duration = 1000,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-bold text-4xl text-brand-600 dark:text-brand-400"
    >
      <motion.span
        initial={{ textContent: 0 } as any}
        animate={{ textContent: value } as any}
        transition={{ duration: duration / 1000, ease: 'easeOut' }}
      >
        {prefix}{value}{suffix}
      </motion.span>
    </motion.span>
  )
}

export { colors }

