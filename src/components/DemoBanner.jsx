import { X } from 'lucide-react'
import { useState } from 'react'

export default function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="demo-banner" role="region" aria-label="Demo site notice">
      <div className="demo-banner-content">
        <span className="demo-badge">🤖 AI DEMO</span>
        <span className="demo-text">
          This is a prototype designed and built with AI. StudentLogger LMS is not yet available for purchase.
        </span>
      </div>
      <button
        className="demo-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close banner"
      >
        <X size={18} />
      </button>

      <style>{`
        .demo-banner {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.875rem;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .demo-banner-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          margin: 0 auto;
        }

        .demo-badge {
          font-weight: 700;
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .demo-text {
          flex: 1;
        }

        .demo-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .demo-close:hover {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .demo-banner {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.75rem;
          }

          .demo-banner-content {
            width: 100%;
            justify-content: center;
          }

          .demo-text {
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
