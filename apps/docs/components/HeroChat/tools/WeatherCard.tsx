'use client'

import { motion } from 'framer-motion'
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudSun, Wind, Droplets } from 'lucide-react'

interface ForecastDay {
  day: string
  high: number
  low: number
  condition: string
}

interface WeatherCardProps {
  city: string
  country?: string
  temperature: number
  condition: string
  humidity?: number
  windSpeed?: number
  forecast?: ForecastDay[]
}

const conditionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'sunny': Sun,
  'partly-cloudy': CloudSun,
  'cloudy': Cloud,
  'rainy': CloudRain,
  'stormy': CloudLightning,
  'snowy': CloudSnow,
  'foggy': Cloud,
  'windy': Wind,
}

const conditionGradients: Record<string, string> = {
  'sunny': 'from-amber-400 via-orange-400 to-yellow-300',
  'partly-cloudy': 'from-blue-400 via-sky-400 to-cyan-300',
  'cloudy': 'from-slate-400 via-gray-400 to-zinc-300',
  'rainy': 'from-slate-600 via-blue-500 to-indigo-400',
  'stormy': 'from-slate-800 via-purple-700 to-indigo-600',
  'snowy': 'from-slate-200 via-blue-100 to-white',
  'foggy': 'from-gray-300 via-slate-300 to-zinc-200',
  'windy': 'from-teal-400 via-cyan-400 to-sky-300',
}

export function WeatherCard({
  city,
  country,
  temperature,
  condition,
  humidity,
  windSpeed,
  forecast
}: WeatherCardProps) {
  const Icon = conditionIcons[condition] || Cloud
  const gradient = conditionGradients[condition] || conditionGradients['cloudy']
  const isLight = ['sunny', 'snowy', 'foggy'].includes(condition)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Main Card */}
      <div className={`relative bg-gradient-to-br ${gradient} p-6`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {condition === 'sunny' && (
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-yellow-200/30 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          )}
          {condition === 'rainy' && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-4 bg-white/30 rounded-full"
                  style={{ left: `${Math.random() * 100}%`, top: -20 }}
                  animate={{ y: [0, 200], opacity: [0.7, 0] }}
                  transition={{
                    duration: 0.8 + Math.random() * 0.4,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </>
          )}
          {condition === 'snowy' && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{ left: `${Math.random() * 100}%`, top: -10 }}
                  animate={{
                    y: [0, 200],
                    x: [0, Math.random() * 40 - 20],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Content */}
        <div className={`relative z-10 ${isLight ? 'text-slate-800' : 'text-white'}`}>
          {/* Location */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{city}</h3>
              {country && <p className="text-sm opacity-80">{country}</p>}
            </div>
            <motion.div
              animate={{ rotate: condition === 'sunny' ? 360 : 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className="w-12 h-12" />
            </motion.div>
          </div>

          {/* Temperature */}
          <div className="flex items-end gap-2 mb-6">
            <motion.span
              className="text-7xl font-light"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {Math.round(temperature)}
            </motion.span>
            <span className="text-3xl font-light mb-3">°C</span>
          </div>

          {/* Condition */}
          <p className="text-lg capitalize mb-4">{condition.replace('-', ' ')}</p>

          {/* Stats */}
          <div className="flex gap-6">
            {humidity !== undefined && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Droplets className="w-4 h-4" />
                <span className="text-sm">{humidity}%</span>
              </motion.div>
            )}
            {windSpeed !== undefined && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Wind className="w-4 h-4" />
                <span className="text-sm">{windSpeed} km/h</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4">
          <div className="flex justify-between">
            {forecast.map((day, index) => {
              const DayIcon = conditionIcons[day.condition] || Cloud
              return (
                <motion.div
                  key={day.day}
                  className="flex flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <span className="text-xs text-slate-500 dark:text-slate-400">{day.day}</span>
                  <DayIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  <div className="flex gap-1 text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{Math.round(day.high)}°</span>
                    <span className="text-slate-400">{Math.round(day.low)}°</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}
