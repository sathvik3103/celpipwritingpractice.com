import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'CELPIP Writing Practice - Free AI-powered writing practice';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
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
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: 32,
            background: 'rgba(59, 130, 246, 0.2)',
            marginBottom: 40,
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            CELPIP Writing Practice
          </h1>
          <p
            style={{
              fontSize: 28,
              color: '#94a3b8',
              margin: 0,
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            Free AI-powered writing practice with instant feedback
          </p>
        </div>

        {/* Features row */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            marginTop: 48,
          }}
        >
          {[
            '26-min Timer',
            'AI Evaluation',
            'Track Progress',
          ].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: '#60a5fa',
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {feature}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#64748b',
            fontWeight: 500,
          }}
        >
          celpipwritingpractice.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
