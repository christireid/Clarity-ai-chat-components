import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Clarity Chat - Premium AI Chat Components'
export const size = {
  width: 1200,
  height: 600,
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
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
      }}
    >
      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.4)',
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01" />
            <path d="M12 10h.01" />
            <path d="M16 10h.01" />
          </svg>
        </div>

        {/* Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Clarity Chat
          </h1>
          <p
            style={{
              fontSize: '28px',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #00d4ff 0%, #a855f7 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
            }}
          >
            Build AI Chat Faster Than Ever
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.6)',
          marginTop: '32px',
          textAlign: 'center',
        }}
      >
        50+ Components | Multi-Provider Support | 40% Cost Savings
      </p>

      {/* Bottom border accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background:
            'linear-gradient(90deg, #00d4ff 0%, #a855f7 50%, #ec4899 100%)',
        }}
      />
    </div>,
    {
      ...size,
    }
  )
}
