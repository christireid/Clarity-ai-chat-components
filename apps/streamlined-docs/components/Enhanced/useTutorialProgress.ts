'use client'

import { useState, useEffect } from 'react'

interface TutorialStep {
  id: string
  title: string
  href: string
}

export function useTutorialProgress(steps: TutorialStep[]) {
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      // Get all step sections based on href (which should be anchor links)
      const stepIds = steps.map((step) => step.href.replace('#', ''))

      let activeStep = 1

      for (let i = stepIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(stepIds[i])
        if (element) {
          const rect = element.getBoundingClientRect()
          // Consider a section active if its top is above the middle of the viewport
          if (rect.top <= window.innerHeight / 2) {
            activeStep = i + 1
            break
          }
        }
      }

      setCurrentStep(activeStep)
    }

    // Initial check
    handleScroll()

    // Listen for scroll events with throttling
    let ticking = false
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [steps])

  return {
    currentStep,
    totalSteps: steps.length,
    isComplete: currentStep === steps.length,
  }
}
