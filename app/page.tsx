"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="13 2 13 9 20 9"/>
        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
      </svg>
    ),
    label: "Real-time Contests",
    desc: "Live leaderboard with instant score updates as participants submit their solutions.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
        <path d="M12 8v4l3 3"/>
        <path d="M9.5 14.5L6 18M14.5 9.5L18 6"/>
      </svg>
    ),
    label: "AI Code Feedback",
    desc: "Receive instant, context-aware insights on your code quality, complexity, and correctness.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    ),
    label: "Secure Execution",
    desc: "Code runs in isolated sandboxed environments — safe, fast, and fully contained.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    label: "Host & Compete",
    desc: "Create your own events or join community-run contests across skill levels.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    label: "Multi-language Support",
    desc: "Submit in C++, Python, Java, or JavaScript — all evaluated in real time.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    label: "Rankings & Badges",
    desc: "Earn recognition through a global leaderboard and achievement milestones.",
  },
];

const STATS = [
  { value: "12,000+", label: "Registered Users" },
  { value: "3,400+", label: "Contests Hosted" },
  { value: "98ms", label: "Avg. Execution Time" },
  { value: "99.9%", label: "Platform Uptime" },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Lato:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .home {
          font-family: 'Lato', sans-serif;
          background: #faf8f5;
          color: #1a1410;
          overflow-x: hidden;
        }

        /* ══════════════════════════════════════════
           HERO
        ══════════════════════════════════════════ */
        .hero {
          background: #1a1410;
          position: relative;
          overflow: hidden;
          padding: 100px 48px 96px;
        }
        .hero-rule {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 5%, #b8942e, #d4af6a, #b8942e, transparent 95%);
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 80% at 15% 40%, rgba(180,140,80,0.11) 0%, transparent 65%),
            radial-gradient(ellipse 60% 70% at 85% 60%, rgba(100,80,40,0.08) 0%, transparent 60%);
        }
        /* Grid texture */
        .hero-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        .hero-inner {
          position: relative;
          max-width: 860px; margin: 0 auto;
          text-align: center;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .hero-inner.visible { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.24em; text-transform: uppercase;
          color: #b8942e; margin-bottom: 24px;
        }
        .hero-eyebrow-line { width: 32px; height: 1px; background: #b8942e; }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 700; line-height: 1.12;
          color: #f0e6d0; letter-spacing: -0.02em;
          margin-bottom: 24px;
        }
        .hero-title em { font-style: italic; color: #d4af6a; }

        .hero-sub {
          font-size: 1rem; color: rgba(200,185,160,0.6);
          font-weight: 300; line-height: 1.75;
          max-width: 560px; margin: 0 auto 40px;
          letter-spacing: 0.015em;
        }

        /* CTA buttons */
        .hero-cta { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

        .cta-primary {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: transparent;
          border: 1px solid rgba(184,148,46,0.55);
          border-radius: 2px; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #d4af6a;
          position: relative; overflow: hidden;
          transition: background 0.2s, transform 0.15s;
        }
        .cta-primary::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #b8942e, #d4af6a, #b8942e);
        }
        .cta-primary:hover { background: rgba(184,148,46,0.08); transform: translateY(-2px); }
        .cta-primary svg { width: 14px; height: 14px; }

        .cta-ghost {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(200,185,160,0.55);
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .cta-ghost:hover { border-color: rgba(184,148,46,0.3); color: #d4af6a; transform: translateY(-2px); }
        .cta-ghost svg { width: 14px; height: 14px; }

        /* Ornament */
        .hero-ornament {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          margin-top: 56px;
        }
        .orn-line { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, rgba(184,148,46,0.4)); }
        .orn-line.right { background: linear-gradient(90deg, rgba(184,148,46,0.4), transparent); }
        .orn-diamond { width: 6px; height: 6px; background: rgba(184,148,46,0.5); transform: rotate(45deg); }

        /* ══════════════════════════════════════════
           STATS BAND
        ══════════════════════════════════════════ */
        .stats-band {
          background: #fff;
          border-top: 1px solid #e4dbd0;
          border-bottom: 1px solid #e4dbd0;
          padding: 0 48px;
        }
        .stats-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat-item {
          padding: 32px 24px;
          text-align: center;
          border-right: 1px solid #f0ece6;
          transition: background 0.2s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: #fdf9f2; }
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700;
          color: #1a1410; letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #9c8b7a;
        }
        .stat-accent { width: 24px; height: 1.5px; background: linear-gradient(90deg, #b8942e, #d4af6a); margin: 8px auto 0; }

        /* ══════════════════════════════════════════
           FEATURES SECTION
        ══════════════════════════════════════════ */
        .section {
          padding: 96px 48px;
        }
        .section-inner { max-width: 1100px; margin: 0 auto; }

        .section-header { text-align: center; margin-bottom: 64px; }
        .section-eyebrow {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #b8942e; margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
          color: #1a1410; letter-spacing: -0.02em; line-height: 1.2;
          margin-bottom: 14px;
        }
        .section-title em { font-style: italic; color: #b8942e; }
        .section-sub {
          font-size: 0.9rem; color: #8c7d6e; font-weight: 300;
          max-width: 480px; margin: 0 auto; line-height: 1.75;
        }
        .section-divider {
          width: 48px; height: 1.5px;
          background: linear-gradient(90deg, #b8942e, #d4af6a);
          margin: 20px auto 0;
        }

        /* Features grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #e4dbd0;
          border: 1px solid #e4dbd0;
        }

        .feature-card {
          background: #fff;
          padding: 36px 32px;
          display: flex; flex-direction: column; gap: 14px;
          transition: background 0.2s;
          position: relative;
        }
        .feature-card:hover { background: #fdf9f2; }
        .feature-card::before {
          content: '';
          position: absolute; top: 0; left: 32px; right: 32px;
          height: 0;
          background: linear-gradient(90deg, transparent, #b8942e, transparent);
          transition: height 0.25s;
        }
        .feature-card:hover::before { height: 1.5px; }

        .feature-icon {
          width: 44px; height: 44px;
          border: 1px solid #e4dbd0;
          display: flex; align-items: center; justify-content: center;
          color: #b8942e;
          transition: border-color 0.2s;
        }
        .feature-card:hover .feature-icon { border-color: #b8942e; }
        .feature-icon svg { width: 20px; height: 20px; }

        .feature-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; font-weight: 700;
          color: #1a1410; letter-spacing: -0.01em;
        }
        .feature-desc {
          font-size: 0.84rem; color: #8c7d6e;
          line-height: 1.7; font-weight: 300;
        }
        .feature-link {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #b8942e; margin-top: auto; padding-top: 4px;
          opacity: 0;
          transition: opacity 0.2s, gap 0.2s;
        }
        .feature-card:hover .feature-link { opacity: 1; }
        .feature-link svg { width: 10px; height: 10px; }

        /* ══════════════════════════════════════════
           CTA BANNER
        ══════════════════════════════════════════ */
        .cta-banner {
          background: #1a1410;
          position: relative; overflow: hidden;
          padding: 80px 48px;
          text-align: center;
        }
        .cta-banner-rule {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 5%, #b8942e, #d4af6a, #b8942e, transparent 95%);
        }
        .cta-banner-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 120% at 50% 50%, rgba(184,148,46,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-banner-inner { position: relative; max-width: 640px; margin: 0 auto; }
        .cta-banner-eyebrow {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #b8942e; margin-bottom: 16px;
        }
        .cta-banner-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
          color: #f0e6d0; line-height: 1.18; letter-spacing: -0.02em;
          margin-bottom: 14px;
        }
        .cta-banner-title em { font-style: italic; color: #d4af6a; }
        .cta-banner-sub {
          font-size: 0.88rem; color: rgba(200,185,160,0.55);
          font-weight: 300; line-height: 1.7; margin-bottom: 36px;
        }
        .cta-banner-actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }

        /* ══════════════════════════════════════════
           FOOTER
        ══════════════════════════════════════════ */
        .footer {
          background: #12100d;
          padding: 28px 48px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
        .footer-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .footer-logo-mark {
          width: 26px; height: 26px;
          border: 1px solid rgba(184,148,46,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .footer-logo-mark svg { width: 12px; height: 12px; fill: none; stroke: rgba(184,148,46,0.5); stroke-width: 1.8; }
        .footer-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.78rem; font-weight: 600;
          color: rgba(232,223,200,0.4); letter-spacing: 0.15em; text-transform: uppercase;
        }
        .footer-copy {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem; color: rgba(180,160,120,0.25);
          letter-spacing: 0.06em;
        }

        /* ══════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat-item:nth-child(2) { border-right: none; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .hero { padding: 72px 24px 64px; }
          .section { padding: 64px 24px; }
          .stats-band { padding: 0 24px; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .footer { padding: 24px; flex-direction: column; align-items: center; text-align: center; }
          .hero-cta { flex-direction: column; }
          .cta-banner { padding: 64px 24px; }
        }
      `}</style>

      <div className="home">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-rule" />
          <div className="hero-bg" />
          <div className="hero-grid" />

          <div className={`hero-inner ${mounted ? "visible" : ""}`}>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              AI-Powered Platform
              <div className="hero-eyebrow-line" />
            </div>

            <h1 className="hero-title">
              Where <em>code</em> meets<br />competition & craft.
            </h1>

            <p className="hero-sub">
              Host coding contests, join live events, compete in real-time, and receive AI-powered feedback — all in one refined platform.
            </p>

            <div className="hero-cta">
              <button className="cta-primary" onClick={() => router.push("/events")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                Explore Events
              </button>
              <button className="cta-ghost" onClick={() => router.push("/register")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Get Started Free
              </button>
            </div>

            <div className="hero-ornament">
              <div className="orn-line" />
              <div className="orn-diamond" />
              <div className="orn-line right" />
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-band">
          <div className="stats-inner">
            {STATS.map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-accent" />
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="section" style={{ background: "#faf8f5" }}>
          <div className="section-inner">
            <div className="section-header">
              <p className="section-eyebrow">Platform Capabilities</p>
              <h2 className="section-title">Everything you need to <em>compete</em> and create.</h2>
              <p className="section-sub">A complete suite of tools for hosts and participants — built with precision and intention.</p>
              <div className="section-divider" />
            </div>

            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.label}</div>
                  <div className="feature-desc">{f.desc}</div>
                  <div className="feature-link">
                    Learn more
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="cta-banner">
          <div className="cta-banner-rule" />
          <div className="cta-banner-bg" />
          <div className="cta-banner-inner">
            <p className="cta-banner-eyebrow">Ready to Begin?</p>
            <h2 className="cta-banner-title">Your next <em>victory</em><br />starts with one contest.</h2>
            <p className="cta-banner-sub">Join thousands of developers competing, learning, and growing — one problem at a time.</p>
            <div className="cta-banner-actions">
              <button className="cta-primary" onClick={() => router.push("/register")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create Free Account
              </button>
              <button className="cta-ghost" onClick={() => router.push("/events")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Browse Events
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-logo">
            <div className="footer-logo-mark">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="footer-logo-name">Eventum</span>
          </div>
          <span className="footer-copy">© {new Date().getFullYear()} Eventum. All rights reserved.</span>
        </footer>

      </div>
    </>
  );
}