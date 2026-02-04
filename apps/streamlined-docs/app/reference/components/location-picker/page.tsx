'use client'

/**
 * LocationPicker Component - Comprehensive API Reference Documentation
 *
 * Interactive map-based location picker with geocoding, current location detection,
 * and place search capabilities. Supports multiple map providers.
 */

import * as React from 'react'
import {
  MapPin,
  Map,
  Search,
  Navigation,
  Globe,
  Lock,
  AlertTriangle,
  Key,
  Settings,
  Zap,
} from 'lucide-react'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import { Section } from '@/components/Docs/Section'
import { SubSection } from '@/components/Docs/Section'
import { PropsTable, type PropDefinition } from '@/components/Docs/PropsTable'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import type { TocItem } from '@/components/Docs/TableOfContents'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'LocationValue',
    required: true,
    description:
      'Current location value with lat/lng coordinates and optional address',
  },
  {
    name: 'onChange',
    type: '(location: LocationValue) => void',
    required: true,
    description: 'Callback when location is selected or changed',
  },
  {
    name: 'provider',
    type: "'google' | 'mapbox' | 'openstreetmap'",
    default: "'google'",
    description: 'Map provider to use for rendering and geocoding',
  },
  {
    name: 'apiKey',
    type: 'string',
    required: true,
    description:
      'API key for the selected map provider (not required for OpenStreetMap)',
  },
  {
    name: 'defaultCenter',
    type: '{ lat: number; lng: number }',
    description: 'Default map center when no location is selected',
  },
  {
    name: 'defaultZoom',
    type: 'number',
    default: '15',
    description: 'Default zoom level (1-20, higher is more zoomed in)',
  },
  {
    name: 'height',
    type: 'string | number',
    default: "'400px'",
    description: 'Map container height (CSS value or pixel number)',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container',
  },
]

const interactionProps: PropDefinition[] = [
  {
    name: 'allowPinDrag',
    type: 'boolean',
    default: 'true',
    description: 'Allow dragging the location pin to select new locations',
  },
  {
    name: 'allowMapClick',
    type: 'boolean',
    default: 'true',
    description: 'Allow clicking on map to select new locations',
  },
  {
    name: 'allowZoom',
    type: 'boolean',
    default: 'true',
    description: 'Enable zoom controls and mouse wheel zoom',
  },
  {
    name: 'allowPan',
    type: 'boolean',
    default: 'true',
    description: 'Allow panning the map by dragging',
  },
  {
    name: 'onMapMove',
    type: '(center: LatLng, zoom: number) => void',
    description: 'Callback when map is moved or zoomed',
  },
]

const searchProps: PropDefinition[] = [
  {
    name: 'enableSearch',
    type: 'boolean',
    default: 'true',
    description: 'Show search box for address and POI search',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    default: "'Search for a location...'",
    description: 'Placeholder text for search input',
  },
  {
    name: 'searchTypes',
    type: "('address' | 'establishment' | 'geocode')[]",
    description: 'Types of places to include in search results',
  },
  {
    name: 'searchBounds',
    type: 'LatLngBounds',
    description: 'Restrict search results to specific geographic bounds',
  },
  {
    name: 'searchCountry',
    type: 'string | string[]',
    description: 'ISO country code(s) to restrict search results (e.g., "US")',
  },
  {
    name: 'onSearchResults',
    type: '(results: SearchResult[]) => void',
    description: 'Callback when search results are available',
  },
]

const geolocationProps: PropDefinition[] = [
  {
    name: 'enableCurrentLocation',
    type: 'boolean',
    default: 'true',
    description: 'Show button to use current device location',
  },
  {
    name: 'currentLocationLabel',
    type: 'string',
    default: "'Use my location'",
    description: 'Label for current location button',
  },
  {
    name: 'geolocationOptions',
    type: 'PositionOptions',
    description: 'Browser geolocation API options',
  },
  {
    name: 'onGeolocationError',
    type: '(error: GeolocationPositionError) => void',
    description: 'Callback when geolocation fails or is denied',
  },
  {
    name: 'onGeolocationSuccess',
    type: '(position: GeolocationPosition) => void',
    description: 'Callback when current location is obtained',
  },
]

const geocodingProps: PropDefinition[] = [
  {
    name: 'enableGeocoding',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic address lookup for selected coordinates',
  },
  {
    name: 'geocodeOnSelect',
    type: 'boolean',
    default: 'true',
    description: 'Automatically geocode when location is selected',
  },
  {
    name: 'showAddress',
    type: 'boolean',
    default: 'true',
    description: 'Display formatted address below the map',
  },
  {
    name: 'addressFormat',
    type: "'short' | 'long'",
    default: "'long'",
    description: 'Address format: short (city, state) or long (full address)',
  },
  {
    name: 'onGeocodeComplete',
    type: '(address: string, components: AddressComponents) => void',
    description: 'Callback when geocoding completes',
  },
  {
    name: 'onGeocodeError',
    type: '(error: Error) => void',
    description: 'Callback when geocoding fails',
  },
]

const appearanceProps: PropDefinition[] = [
  {
    name: 'markerIcon',
    type: 'string | React.ReactNode',
    description: 'Custom marker icon (URL or React component)',
  },
  {
    name: 'markerColor',
    type: 'string',
    default: "'#ef4444'",
    description: 'Marker color (hex, rgb, or named color)',
  },
  {
    name: 'mapStyle',
    type: 'string | MapStyleObject',
    description:
      'Custom map style (provider-specific style URL or object)',
  },
  {
    name: 'theme',
    type: "'light' | 'dark' | 'auto'",
    default: "'auto'",
    description: 'Map theme (follows system preference in auto mode)',
  },
  {
    name: 'controls',
    type: 'MapControlsConfig',
    description: 'Configure map controls visibility and position',
  },
]

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'interaction-props', title: 'Interaction' },
      { id: 'search-props', title: 'Search' },
      { id: 'geolocation-props', title: 'Geolocation' },
      { id: 'geocoding-props', title: 'Geocoding' },
      { id: 'appearance-props', title: 'Appearance' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'basic-usage', title: 'Basic Usage' },
      { id: 'with-search', title: 'With Search' },
      { id: 'current-location', title: 'Current Location' },
      { id: 'custom-styling', title: 'Custom Styling' },
    ],
  },
  {
    id: 'map-providers',
    title: 'Map Providers',
    children: [
      { id: 'google-maps', title: 'Google Maps' },
      { id: 'mapbox', title: 'Mapbox' },
      { id: 'openstreetmap', title: 'OpenStreetMap' },
    ],
  },
  { id: 'api-keys', title: 'API Keys Setup' },
  { id: 'privacy', title: 'Privacy & Permissions' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
]

// ============================================================================
// Code Examples
// ============================================================================

const basicUsageCode = `import { LocationPicker } from '@clarity-chat/react'
import { useState } from 'react'

function App() {
  const [location, setLocation] = useState({
    lat: 37.7749,
    lng: -122.4194,
    address: 'San Francisco, CA'
  })

  return (
    <LocationPicker
      value={location}
      onChange={setLocation}
      provider="google"
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      height="500px"
    />
  )
}`

const withSearchCode = `import { LocationPicker } from '@clarity-chat/react'
import { useState } from 'react'

function LocationSearch() {
  const [location, setLocation] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  return (
    <LocationPicker
      value={location}
      onChange={setLocation}
      provider="google"
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      enableSearch
      searchPlaceholder="Search for restaurants, hotels, or addresses..."
      searchTypes={['address', 'establishment']}
      searchCountry="US"
      onSearchResults={setSearchResults}
      height="600px"
    />
  )
}`

const currentLocationCode = `import { LocationPicker } from '@clarity-chat/react'
import { useState } from 'react'
import { toast } from 'sonner'

function CurrentLocationPicker() {
  const [location, setLocation] = useState(null)

  const handleGeolocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error('Location permission denied')
        break
      case error.POSITION_UNAVAILABLE:
        toast.error('Location information unavailable')
        break
      case error.TIMEOUT:
        toast.error('Location request timed out')
        break
    }
  }

  return (
    <LocationPicker
      value={location}
      onChange={setLocation}
      provider="google"
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      enableCurrentLocation
      currentLocationLabel="Use my current location"
      geolocationOptions={{
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }}
      onGeolocationError={handleGeolocationError}
      onGeolocationSuccess={(position) => {
        toast.success('Location detected successfully')
      }}
    />
  )
}`

const customStylingCode = `import { LocationPicker } from '@clarity-chat/react'
import { useState } from 'react'

function StyledLocationPicker() {
  const [location, setLocation] = useState(null)

  return (
    <LocationPicker
      value={location}
      onChange={setLocation}
      provider="mapbox"
      apiKey={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      height="700px"
      theme="dark"
      markerColor="#8b5cf6"
      markerIcon="/custom-marker.svg"
      mapStyle="mapbox://styles/mapbox/dark-v11"
      controls={{
        zoom: true,
        fullscreen: true,
        geolocate: true,
        navigation: true,
        scale: true
      }}
      className="rounded-xl shadow-2xl"
    />
  )
}`

const googleMapsSetupCode = `// 1. Get API key from Google Cloud Console
// https://console.cloud.google.com/

// 2. Enable these APIs:
// - Maps JavaScript API
// - Geocoding API
// - Places API

// 3. Add to .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

// 4. Use in component
<LocationPicker
  provider="google"
  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
  {...props}
/>`

const mapboxSetupCode = `// 1. Get API key from Mapbox
// https://account.mapbox.com/

// 2. Add to .env.local
NEXT_PUBLIC_MAPBOX_API_KEY=your_api_key_here

// 3. Use in component
<LocationPicker
  provider="mapbox"
  apiKey={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
  {...props}
/>`

const osmSetupCode = `// No API key required for OpenStreetMap!

<LocationPicker
  provider="openstreetmap"
  // No apiKey needed
  {...props}
/>

// Note: OSM has usage limits and is slower for geocoding
// Consider using Nominatim API with your own server for production`

const typescriptCode = `import type { LocationPickerProps, LocationValue } from '@clarity-chat/react'

// Location value structure
interface LocationValue {
  lat: number
  lng: number
  address?: string
  components?: AddressComponents
}

// Address components from geocoding
interface AddressComponents {
  streetNumber?: string
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  formatted: string
}

// Search result structure
interface SearchResult {
  id: string
  name: string
  address: string
  location: { lat: number; lng: number }
  types: string[]
}

// Map controls configuration
interface MapControlsConfig {
  zoom?: boolean
  fullscreen?: boolean
  geolocate?: boolean
  navigation?: boolean
  scale?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

// Usage example
const MyComponent: React.FC = () => {
  const [location, setLocation] = useState<LocationValue | null>(null)

  const handleLocationChange = (newLocation: LocationValue) => {
    console.log('Selected:', newLocation)
    setLocation(newLocation)
  }

  return (
    <LocationPicker
      value={location}
      onChange={handleLocationChange}
      provider="google"
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
    />
  )
}`

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [location, setLocation] = React.useState<{
    lat: number
    lng: number
    address: string
  } | null>({
    lat: 37.7749,
    lng: -122.4194,
    address: 'San Francisco, CA, USA',
  })

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-sm text-muted-foreground mb-2">
          This is a visual demonstration. The actual LocationPicker component
          requires a map provider API key.
        </p>
        {location && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <span className="ml-2 font-mono">{location.lat.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <span className="ml-2 font-mono">{location.lng.toFixed(6)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Address:</span>
              <span className="ml-2">{location.address}</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative h-[400px] rounded-lg bg-muted/20 border border-border/50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-brand-500 mx-auto mb-4" />
          <p className="text-muted-foreground max-w-sm">
            Interactive map component will be rendered here with your API key
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            See installation guide below for setup instructions
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function LocationPickerPage() {
  return (
    <DocumentationPage
      title="LocationPicker"
      description="Interactive map-based location picker with geocoding, current location detection, and place search. Supports Google Maps, Mapbox, and OpenStreetMap providers."
      icon={MapPin}
      badges={[{ label: 'Beta', variant: 'beta' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Map,
          label: 'Interactive Map',
          description: 'Pan, zoom, and pin selection',
        },
        {
          icon: Navigation,
          label: 'Geolocation',
          description: 'Current location detection',
        },
        {
          icon: Search,
          label: 'Place Search',
          description: 'Address and POI search',
        },
        {
          icon: Globe,
          label: 'Geocoding',
          description: 'Lat/lng to address conversion',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'MapView',
          type: 'component',
          description: 'Read-only map display component',
          href: '/reference/components/map-view',
        },
        {
          name: 'AddressInput',
          type: 'component',
          description: 'Text-based address input with autocomplete',
          href: '/reference/components/address-input',
        },
        {
          name: 'useGeolocation',
          type: 'hook',
          description: 'Hook for accessing device location',
          href: '/reference/hooks/use-geolocation',
        },
      ]}
      footerNavigation={[
        {
          label: 'MapView',
          href: '/reference/components/map-view',
          direction: 'previous',
        },
        {
          label: 'AddressInput',
          href: '/reference/components/address-input',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            LocationPicker is an interactive map component that allows users to
            select geographic locations through multiple input methods: clicking
            on the map, dragging a pin, searching for addresses or places, or
            using their current device location.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Use Cases</h4>
          <ul className="space-y-2">
            <li>
              <strong>Delivery Addresses:</strong> Let users pinpoint exact
              delivery locations on a map
            </li>
            <li>
              <strong>Event Locations:</strong> Select venues or meeting points
              for events
            </li>
            <li>
              <strong>Store Locators:</strong> Find nearby stores or service
              locations
            </li>
            <li>
              <strong>Property Listings:</strong> Mark property locations in
              real estate apps
            </li>
            <li>
              <strong>Travel Planning:</strong> Select destinations and points
              of interest
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>Multi-Provider Support:</strong> Works with Google Maps,
              Mapbox, or OpenStreetMap
            </li>
            <li>
              <strong>Smart Geocoding:</strong> Automatic address lookup from
              coordinates
            </li>
            <li>
              <strong>Place Search:</strong> Integrated search for addresses and
              POIs
            </li>
            <li>
              <strong>Current Location:</strong> One-click access to device GPS
            </li>
            <li>
              <strong>Fully Typed:</strong> Complete TypeScript definitions
            </li>
            <li>
              <strong>Privacy Aware:</strong> Handles location permissions
              gracefully
            </li>
          </ul>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the component:</p>

          <CodeBlock
            code={`import { LocationPicker } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-amber-900 dark:text-amber-100 font-semibold mb-1">
                  API Key Required
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  You'll need an API key from your chosen map provider (Google
                  Maps or Mapbox). OpenStreetMap doesn't require a key but has
                  rate limits. See the API Keys Setup section below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Interactive demonstration of the LocationPicker component. The actual
          implementation requires a map provider API key.
        </p>
        <LiveDemo />
      </Section>

      {/* Props Reference Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <p className="text-muted-foreground mb-4">
            Essential props for basic location picker functionality:
          </p>
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="interaction-props" title="Interaction Props">
          <p className="text-muted-foreground mb-4">
            Control how users can interact with the map:
          </p>
          <PropsTable props={interactionProps} />
        </SubSection>

        <SubSection id="search-props" title="Search Props">
          <p className="text-muted-foreground mb-4">
            Configure the address and place search functionality:
          </p>
          <PropsTable props={searchProps} />
        </SubSection>

        <SubSection id="geolocation-props" title="Geolocation Props">
          <p className="text-muted-foreground mb-4">
            Configure current location detection:
          </p>
          <PropsTable props={geolocationProps} />
        </SubSection>

        <SubSection id="geocoding-props" title="Geocoding Props">
          <p className="text-muted-foreground mb-4">
            Configure automatic address lookup from coordinates:
          </p>
          <PropsTable props={geocodingProps} />
        </SubSection>

        <SubSection id="appearance-props" title="Appearance Props">
          <p className="text-muted-foreground mb-4">
            Customize the visual appearance of the map:
          </p>
          <PropsTable props={appearanceProps} />
        </SubSection>
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="basic-usage" title="Basic Usage">
          <p className="text-muted-foreground mb-4">
            Simple location picker with minimal configuration:
          </p>
          <CodeBlock code={basicUsageCode} language="tsx" filename="App.tsx" />
        </SubSection>

        <SubSection id="with-search" title="With Search">
          <p className="text-muted-foreground mb-4">
            Enable place search with custom filters:
          </p>
          <CodeBlock
            code={withSearchCode}
            language="tsx"
            filename="LocationSearch.tsx"
          />
        </SubSection>

        <SubSection id="current-location" title="Current Location">
          <p className="text-muted-foreground mb-4">
            Add current location detection with error handling:
          </p>
          <CodeBlock
            code={currentLocationCode}
            language="tsx"
            filename="CurrentLocationPicker.tsx"
          />
        </SubSection>

        <SubSection id="custom-styling" title="Custom Styling">
          <p className="text-muted-foreground mb-4">
            Customize appearance with dark theme and custom marker:
          </p>
          <CodeBlock
            code={customStylingCode}
            language="tsx"
            filename="StyledPicker.tsx"
          />
        </SubSection>
      </Section>

      {/* Map Providers Section */}
      <Section id="map-providers" title="Map Providers">
        <p className="text-muted-foreground mb-6">
          LocationPicker supports three map providers, each with different
          features and pricing:
        </p>

        <SubSection id="google-maps" title="Google Maps">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h5 className="font-semibold mb-2 text-foreground">
                  Advantages
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Most comprehensive place database</li>
                  <li>• Best geocoding accuracy</li>
                  <li>• Street View integration</li>
                  <li>• Real-time traffic data</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h5 className="font-semibold mb-2 text-foreground">
                  Considerations
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Requires billing account</li>
                  <li>• $200/month free credit</li>
                  <li>• Usage limits apply</li>
                  <li>• Terms of service restrictions</li>
                </ul>
              </div>
            </div>
            <CodeBlock
              code={googleMapsSetupCode}
              language="tsx"
              filename="google-maps-setup.tsx"
            />
          </div>
        </SubSection>

        <SubSection id="mapbox" title="Mapbox">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h5 className="font-semibold mb-2 text-foreground">
                  Advantages
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Beautiful custom map styles</li>
                  <li>• Better pricing for high volume</li>
                  <li>• Excellent SDK and docs</li>
                  <li>• 3D terrain and buildings</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h5 className="font-semibold mb-2 text-foreground">
                  Considerations
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Smaller place database vs Google</li>
                  <li>• 50,000 free requests/month</li>
                  <li>• Custom styling complexity</li>
                  <li>• Learning curve for advanced features</li>
                </ul>
              </div>
            </div>
            <CodeBlock
              code={mapboxSetupCode}
              language="tsx"
              filename="mapbox-setup.tsx"
            />
          </div>
        </SubSection>

        <SubSection id="openstreetmap" title="OpenStreetMap">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h5 className="font-semibold mb-2 text-foreground">
                  Advantages
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Completely free and open source</li>
                  <li>• No API key required</li>
                  <li>• Community-driven data</li>
                  <li>• No vendor lock-in</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h5 className="font-semibold mb-2 text-foreground">
                  Considerations
                </h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Strict usage policies</li>
                  <li>• Slower geocoding performance</li>
                  <li>• Less POI coverage</li>
                  <li>• Best for low-traffic apps</li>
                </ul>
              </div>
            </div>
            <CodeBlock
              code={osmSetupCode}
              language="tsx"
              filename="openstreetmap-setup.tsx"
            />
          </div>
        </SubSection>
      </Section>

      {/* API Keys Setup Section */}
      <Section id="api-keys" title="API Keys Setup">
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-1">
                  Environment Variables
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Store API keys in environment variables, never commit them to
                  version control. Use <code>.env.local</code> for local
                  development and configure production keys in your hosting
                  platform.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h4 className="text-lg font-semibold">
              Security Best Practices
            </h4>
            <ul className="space-y-2">
              <li>
                <strong>Restrict API Keys:</strong> Use domain restrictions and
                IP allowlists
              </li>
              <li>
                <strong>Monitor Usage:</strong> Set up alerts for unusual
                activity
              </li>
              <li>
                <strong>Rotate Keys:</strong> Regularly rotate API keys
              </li>
              <li>
                <strong>Rate Limiting:</strong> Implement client-side rate
                limiting
              </li>
              <li>
                <strong>Server-Side Proxy:</strong> Consider proxying geocoding
                requests through your backend
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Privacy & Permissions Section */}
      <Section id="privacy" title="Privacy & Permissions">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            LocationPicker handles browser geolocation permissions gracefully
            and respects user privacy:
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Permission Handling
            </h4>
            <ul className="space-y-2">
              <li>
                <strong>Always Request Permission:</strong> Never access
                location without user action
              </li>
              <li>
                <strong>Clear Communication:</strong> Explain why you need
                location access
              </li>
              <li>
                <strong>Graceful Degradation:</strong> Provide alternatives if
                permission is denied
              </li>
              <li>
                <strong>No Persistent Storage:</strong> Don't store location
                data without consent
              </li>
            </ul>

            <h4 className="text-lg font-semibold mt-6">
              GDPR Compliance
            </h4>
            <p>
              Location data is personal data under GDPR. Ensure you:
            </p>
            <ul className="space-y-2">
              <li>Obtain explicit consent before collecting location</li>
              <li>Provide a privacy policy explaining data usage</li>
              <li>Allow users to delete their location data</li>
              <li>Process location data lawfully and transparently</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-purple-900 dark:text-purple-100 font-semibold mb-1">
                  HTTPS Required
                </p>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Browser geolocation API only works on HTTPS sites (except
                  localhost). Ensure your production site uses HTTPS to enable
                  current location features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Full TypeScript definitions for LocationPicker and related types:
        </p>
        <CodeBlock
          code={typescriptCode}
          language="tsx"
          filename="types.ts"
          showLineNumbers
        />
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            LocationPicker includes comprehensive accessibility features:
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Keyboard Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Tab</kbd> -
              Navigate between map controls
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Enter</kbd> -
              Activate controls and select search results
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">
                Arrow Keys
              </kbd>{' '}
              - Navigate through search results
            </li>
            <li>
              <kbd className="px-2 py-1 rounded bg-muted text-xs">Escape</kbd> -
              Close search dropdown
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Screen Reader Support
          </h4>
          <ul className="space-y-2">
            <li>
              <strong>ARIA Labels:</strong> All interactive elements have
              descriptive labels
            </li>
            <li>
              <strong>Live Regions:</strong> Location changes announced to
              screen readers
            </li>
            <li>
              <strong>Role Attributes:</strong> Proper semantic roles for map
              and controls
            </li>
            <li>
              <strong>Status Messages:</strong> Clear feedback for actions and
              errors
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            Alternative Input Methods
          </h4>
          <p>
            Provide multiple ways to select locations:
          </p>
          <ul className="space-y-2">
            <li>Click or tap on map</li>
            <li>Text search with autocomplete</li>
            <li>Current location button</li>
            <li>Manual coordinate entry (optional)</li>
          </ul>
        </div>
      </Section>

      {/* Troubleshooting Section */}
      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Map not displaying
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The map container is empty or shows error.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Verify API key is correct and has proper permissions</li>
                  <li>Check that required APIs are enabled in provider console</li>
                  <li>Ensure container has defined height (not 0)</li>
                  <li>Check browser console for specific error messages</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Current location not working
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Geolocation button doesn't detect location.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Ensure site is served over HTTPS (required for geolocation)</li>
                  <li>Check that browser has location permissions</li>
                  <li>Verify GPS/location services are enabled on device</li>
                  <li>Use <code>onGeolocationError</code> to debug permission issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Search not returning results
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Place search returns empty or incorrect results.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Verify Places API is enabled (Google Maps)</li>
                  <li>Check search bounds and country restrictions aren't too narrow</li>
                  <li>Ensure search types match desired result categories</li>
                  <li>Monitor API quota and usage limits</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Geocoding fails or is slow
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Address lookup takes too long or returns errors.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Implement client-side caching for recent geocode results</li>
                  <li>Use debouncing to reduce API calls during pin dragging</li>
                  <li>Consider server-side geocoding for better performance</li>
                  <li>OpenStreetMap geocoding is slower - use Google/Mapbox for production</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
