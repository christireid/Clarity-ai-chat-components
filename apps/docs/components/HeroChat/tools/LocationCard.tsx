'use client'

import { motion } from 'framer-motion'
import { MapPin, Navigation, ExternalLink, Copy, Check } from 'lucide-react'
import { useState, useCallback } from 'react'

interface LocationCardProps {
  name: string
  address?: string
  city?: string
  country?: string
  latitude?: number
  longitude?: number
  description?: string
  placeType?:
    | 'restaurant'
    | 'hotel'
    | 'attraction'
    | 'business'
    | 'address'
    | 'city'
}

const placeTypeColors: Record<string, string> = {
  restaurant: 'from-orange-500 to-red-500',
  hotel: 'from-blue-500 to-indigo-500',
  attraction: 'from-purple-500 to-pink-500',
  business: 'from-slate-500 to-gray-500',
  address: 'from-emerald-500 to-teal-500',
  city: 'from-cyan-500 to-blue-500',
}

const placeTypeLabels: Record<string, string> = {
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  attraction: 'Attraction',
  business: 'Business',
  address: 'Address',
  city: 'City',
}

export function LocationCard({
  name,
  address,
  city,
  country,
  latitude,
  longitude,
  description,
  placeType = 'address',
}: LocationCardProps) {
  const [copied, setCopied] = useState(false)

  const fullAddress = [address, city, country].filter(Boolean).join(', ')
  const hasCoordinates = latitude !== undefined && longitude !== undefined

  // Static map URL using OpenStreetMap tiles (no API key needed)
  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`
    : null

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress || name)}`

  const handleCopyAddress = useCallback(async () => {
    const textToCopy = fullAddress || name
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [fullAddress, name])

  const gradient = placeTypeColors[placeType] || placeTypeColors.address

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700"
    >
      {/* Map Preview */}
      {mapUrl && (
        <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <iframe
            src={mapUrl}
            className="w-full h-full border-0"
            loading="lazy"
            title={`Map of ${name}`}
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <motion.div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
            whileHover={{ scale: 1.05 }}
          >
            <MapPin className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {name}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white`}
            >
              {placeTypeLabels[placeType] || 'Location'}
            </span>
          </div>
        </div>

        {/* Address */}
        {fullAddress && (
          <motion.div
            className="flex items-start gap-2 mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Navigation className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-300 flex-1">
              {fullAddress}
            </p>
            <motion.button
              onClick={handleCopyAddress}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Description */}
        {description && (
          <motion.p
            className="text-sm text-slate-500 dark:text-slate-400 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}

        {/* Coordinates */}
        {hasCoordinates && (
          <motion.div
            className="flex items-center gap-4 mb-4 text-xs text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>Lat: {latitude?.toFixed(4)}</span>
            <span>Lng: {longitude?.toFixed(4)}</span>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-medium hover:opacity-90 transition-opacity`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ExternalLink className="w-4 h-4" />
          Open in Google Maps
        </motion.a>
      </div>
    </motion.div>
  )
}
