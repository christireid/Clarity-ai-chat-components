import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary
      enableReporting={true}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error)
        console.error('Error Info:', errorInfo)
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
)