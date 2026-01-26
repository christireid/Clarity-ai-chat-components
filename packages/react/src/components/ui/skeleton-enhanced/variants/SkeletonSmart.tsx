/**
 * Smart Loading Predictions
 */

import * as React from 'react'
import { LoadingPredictor } from '../utils'
import type { SmartSkeletonProps } from '../types'

export const SmartSkeleton: React.FC<SmartSkeletonProps> = ({
  children,
  isLoading,
  predictionMode = 'adaptive',
  onPredictionUpdate,
  enableLearning = true,
}) => {
  const [predictedDuration, setPredictedDuration] = React.useState(2000)
  const [actualDuration, setActualDuration] = React.useState(0)
  const startTime = React.useRef<number>(0)

  React.useEffect(() => {
    if (isLoading) {
      startTime.current = Date.now()

      const predictor = LoadingPredictor.getInstance()
      const predicted = predictor.predictDuration()

      // Adjust based on prediction mode
      let adjustedPrediction = predicted
      switch (predictionMode) {
        case 'conservative':
          adjustedPrediction = predicted * 1.2
          break
        case 'aggressive':
          adjustedPrediction = predicted * 0.8
          break
        case 'adaptive':
        default:
          adjustedPrediction = predicted
      }

      setPredictedDuration(adjustedPrediction)

      if (onPredictionUpdate) {
        onPredictionUpdate(adjustedPrediction)
      }
    } else if (startTime.current > 0) {
      const duration = Date.now() - startTime.current
      setActualDuration(duration)

      if (enableLearning) {
        LoadingPredictor.getInstance().recordLoadingDuration(duration)
      }
    }
  }, [isLoading, predictionMode, onPredictionUpdate, enableLearning])

  return (
    <div className="smart-skeleton-container">
      {children}
      {process.env['NODE_ENV'] === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded">
          <div>Predicted: {predictedDuration}ms</div>
          <div>Actual: {actualDuration}ms</div>
        </div>
      )}
    </div>
  )
}
