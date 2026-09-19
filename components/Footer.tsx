"use client";
import { useState } from "react";

export default function Footer() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .footer-pill {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px 10px 12px;
          background: #1a1410;
          border: 1px solid rgba(184,148,46,0.25);
          border-radius: 2px;
          box-shadow:
            0 8px 32px rgba(0,0,0,0.35),
            0 0 0 1px rgba(184,148,46,0.06);
          cursor: default;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s;
          text-decoration: none;
          font-family: 'Lato', sans-serif;
        }
        .footer-pill:hover {
          border-color: rgba(184,148,46,0.55);
          box-shadow:
            0 12px 40px rgba(0,0,0,0.45),
            0 0 0 1px rgba(184,148,46,0.12),
            0 0 24px rgba(184,148,46,0.06);
          transform: translateY(-2px);
        }

        /* Top rule */
        .footer-pill::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #b8942e, #d4af6a, #b8942e, transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .footer-pill:hover::before { opacity: 1; }

        /* LinkedIn icon box */
        .fp-avatar {
          width: 28px; height: 28px;
          border: 1px solid rgba(184,148,46,0.35);
          border-radius: 1px;
          background: linear-gradient(135deg, #2e241c, #1a1410);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.25s, background 0.25s;
          color: #b8942e;
        }
        .footer-pill:hover .fp-avatar {
          border-color: rgba(184,148,46,0.65);
          background: linear-gradient(135deg, #3a2e1e, #2a1e14);
        }
        .fp-avatar svg { width: 14px; height: 14px; }

        /* Divider */
        .fp-sep {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.07);
          flex-shrink: 0;
        }

        /* Text block */
        .fp-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .fp-label {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(180,160,120,0.4);
          line-height: 1;
        }
        .fp-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: #d4af6a;
          letter-spacing: 0.01em;
          line-height: 1.2;
          transition: color 0.2s;
        }
        .footer-pill:hover .fp-name { color: #e8c97a; }

        /* LinkedIn arrow */
        .fp-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px; height: 22px;
          color: rgba(184,148,46,0.35);
          flex-shrink: 0;
          transition: color 0.2s, transform 0.2s;
          margin-left: 2px;
        }
        .footer-pill:hover .fp-link {
          color: #b8942e;
          transform: translate(1px, -1px);
        }
        .fp-link svg { width: 12px; height: 12px; }

        /* Pulse dot */
        .fp-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #2e7d32;
          box-shadow: 0 0 5px rgba(46,127,50,0.7);
          flex-shrink: 0;
          animation: fp-pulse 2.5s ease-in-out infinite;
        }
        @keyframes fp-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 5px rgba(46,127,50,0.7); }
          50%       { opacity: 0.4; box-shadow: 0 0 2px rgba(46,127,50,0.3); }
        }
      `}</style>

      <a
        className="footer-pill"
        href="https://www.linkedin.com/in/rajesh-rajak-4aa5672/"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="View LinkedIn Profile"
      >
        {/* LinkedIn icon */}
        <div className="fp-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>

        <div className="fp-sep" />

        {/* Text */}
        <div className="fp-text">
          <span className="fp-label">Developed by</span>
          <span className="fp-name">Rajesh Rajak</span>
        </div>

        {/* Live dot */}
        <div className="fp-dot" />

        {/* External link arrow */}
        <div className="fp-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
      </a>
    </>
  );
}