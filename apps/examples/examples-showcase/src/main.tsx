import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
// Import OKLCH colors first, then main styles
import '@clarity-chat/react/dist/styles/oklch-colors.css'
import '@clarity-chat/react/styles.css'
import './index.css'
import './components/ErrorBoundary.css'
import './styles/token-optimization.css'
import './styles/ai-features.css'
import './styles/input-showcase.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      enableReporting={true}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error)
        console.error('Error Info:', errorInfo)
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)