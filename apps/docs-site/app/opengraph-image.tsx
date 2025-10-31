import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Clarity Chat UI - Beautiful, Accessible React Components'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Clarity Chat UI
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#cbd5e1',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Beautiful, Accessible React Components
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '40px',
              fontSize: '24px',
              color: '#94a3b8',
            }}
          >
            <span>📦 24 Components</span>
            <span>•</span>
            <span>🪝 6 Hooks</span>
            <span>•</span>
            <span>♿ Accessible</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
