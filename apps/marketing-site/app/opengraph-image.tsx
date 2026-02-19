import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Clarity Chat - Premium AI Chat Components'
export const size = {
  width: 1200,
  height: 630,
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
          top: '20%',
          left: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Logo / Brand mark */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
            boxShadow: '0 0 60px rgba(0, 212, 255, 0.4)',
          }}
        >
          <svg
            width="48"
            height="48"
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
      </div>

      {/* Main heading */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}
        >
          Clarity Chat
        </h1>
        <p
          style={{
            fontSize: '32px',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #00d4ff 0%, #a855f7 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            margin: '0 0 24px 0',
          }}
        >
          Build AI Chat Faster Than Ever
        </p>
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '800px',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          React components for AI chat.
          <br />
          Multi-provider support, intelligent memory, 40%+ cost savings.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: '48px',
          marginTop: '48px',
        }}
      >
        {[
          { value: '50+', label: 'Components' },
          { value: '3', label: 'AI Providers' },
          { value: '40%', label: 'Cost Savings' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#00d4ff',
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

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
