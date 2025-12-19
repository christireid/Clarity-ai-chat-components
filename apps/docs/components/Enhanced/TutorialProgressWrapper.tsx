'use client'

import { TutorialProgress } from './TutorialProgress'
import { useTutorialProgress } from './useTutorialProgress'

interface TutorialProgressWrapperProps {
  steps: Array<{
    id: string
    title: string
    href: string
  }>
}

/**
 * Client-side wrapper for TutorialProgress that tracks scroll position
 * and updates the current step dynamically.
 */
export function TutorialProgressWrapper({ steps }: TutorialProgressWrapperProps) {
  const { currentStep, totalSteps } = useTutorialProgress(steps)

  return (
    <TutorialProgress
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
    />
  )
}
