import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt =
  'Clarity Chat - Production-ready React components for AI chat interfaces'
export const size = {
  width: 1200,
  height: 600, // Twitter prefers slightly shorter
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        backgroundImage:
          'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 60px',
          position: 'relative',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              color: '#a5b4fc',
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            70+ Components · 35+ Hooks · 11 Themes
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '60px',
            fontWeight: 800,
            background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}
        >
          Chat UIs That Work,
        </h1>
        <h1
          style={{
            fontSize: '60px',
            fontWeight: 800,
            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Out of the Box
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: '20px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.4,
            marginBottom: '32px',
          }}
        >
          Production-ready React components for AI chat interfaces.
        </p>

        {/* Install command */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          <span style={{ color: '#6366f1', fontSize: '18px' }}>$</span>
          <span
            style={{
              color: '#e2e8f0',
              fontSize: '18px',
              fontFamily: 'monospace',
            }}
          >
            npm install @clarity-chat/react
          </span>
        </div>
      </div>

      {/* Bottom branding */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          Clarity Chat
        </span>
        <span style={{ color: '#475569', fontSize: '20px' }}>|</span>
        <span style={{ color: '#64748b', fontSize: '18px' }}>
          clarity-chat.dev
        </span>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
