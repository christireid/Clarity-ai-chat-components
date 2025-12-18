'use client'

import * as React from 'react'
import { cn } from '../utils/cn'

export interface UIEnhancements {
  quantumAnimations?: boolean
  glassmorphism?: boolean
  auroraGradients?: boolean
  neumorphism?: boolean
  voiceIntegration?: boolean
  adaptiveColors?: boolean
  wcagAAA?: boolean
}

export interface UIEnhancementsContextValue extends UIEnhancements {
  isEnhanced: boolean
}

const defaultContextValue: UIEnhancementsContextValue = {
  quantumAnimations: false,
  glassmorphism: false,
  auroraGradients: false,
  neumorphism: false,
  voiceIntegration: false,
  adaptiveColors: false,
  wcagAAA: false,
  isEnhanced: false,
}

export const UIEnhancementsContext =
  React.createContext<UIEnhancementsContextValue>(defaultContextValue)

export interface UIEnhancementsProviderProps {
  children: React.ReactNode
  value: UIEnhancements
}

export const UIEnhancementsProvider: React.FC<UIEnhancementsProviderProps> = ({
  children,
  value,
}) => {
  const contextValue = React.useMemo(
    () => ({
      ...value,
      isEnhanced: Object.values(value).some(Boolean),
    }),
    [value]
  )

  return (
    <UIEnhancementsContext.Provider value={contextValue}>
      {children}
    </UIEnhancementsContext.Provider>
  )
}

export const useUIEnhancements = (): UIEnhancementsContextValue => {
  const context = React.useContext(UIEnhancementsContext)

  if (context === undefined) {
    throw new Error(
      'useUIEnhancements must be used within a UIEnhancementsProvider'
    )
  }

  return context
}

export const useQuantumAnimation = (): boolean => {
  const { quantumAnimations } = useUIEnhancements()
  return quantumAnimations ?? false
}

export const useGlassmorphism = (): boolean => {
  const { glassmorphism } = useUIEnhancements()
  return glassmorphism ?? false
}

export const useAuroraGradients = (): boolean => {
  const { auroraGradients } = useUIEnhancements()
  return auroraGradients ?? false
}

export const useVoiceIntegration = (): boolean => {
  const { voiceIntegration } = useUIEnhancements()
  return voiceIntegration ?? false
}

export const useWCAGAAA = (): boolean => {
  const { wcagAAA } = useUIEnhancements()
  return wcagAAA ?? false
}

export interface EnhancedClassNameProps {
  className?: string
  quantumAnimations?: boolean
  glassmorphism?: boolean
  auroraGradients?: boolean
  neumorphism?: boolean
  voiceIntegration?: boolean
  adaptiveColors?: boolean
  wcagAAA?: boolean
}

export const getEnhancedClassName = ({
  className,
  quantumAnimations = false,
  glassmorphism = false,
  auroraGradients = false,
  neumorphism = false,
  voiceIntegration = false,
  adaptiveColors = false,
  wcagAAA = false,
}: EnhancedClassNameProps): string => {
  return cn(
    className,
    quantumAnimations && 'quantum-animations',
    glassmorphism && 'glassmorphism-enabled',
    auroraGradients && 'aurora-gradients-enabled',
    neumorphism && 'neumorphism-enabled',
    voiceIntegration && 'voice-integration-enabled',
    adaptiveColors && 'adaptive-colors-enabled',
    wcagAAA && 'wcag-aaa-compliant'
  )
}

export default {
  UIEnhancementsContext,
  UIEnhancementsProvider,
  useUIEnhancements,
  useQuantumAnimation,
  useGlassmorphism,
  useAuroraGradients,
  useVoiceIntegration,
  useWCAGAAA,
  getEnhancedClassName,
}
