"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Contest", href: "/contest" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .nav-root {
          font-family: 'Lato', sans-serif;
          position: sticky; top: 0; z-index: 50;
          background: #1a1410;
          transition: box-shadow 0.3s ease;
        }
        .nav-root.scrolled {
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }

        /* Gold top rule */
        .nav-rule {
          height: 2px;
          background: linear-gradient(90deg, transparent 5%, #b8942e, #d4af6a, #b8942e, transparent 95%);
        }

        /* Ambient glow */
        .nav-bg {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 200% at 80% 50%, rgba(180,140,80,0.07) 0%, transparent 70%);
        }

        /* Inner */
        .nav-inner {
          position: relative;
          max-width: 1200px; margin: 0 auto;
          padding: 0 48px;
          height: 60px;
          display: flex; align-items: center;
          gap: 0;
        }

        /* ── LOGO ── */
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; text-decoration: none;
          flex-shrink: 0;
          margin-right: 48px;
        }
        .nav-logo-mark {
          width: 32px; height: 32px;
          border: 1.5px solid rgba(212,175,106,0.55);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s;
        }
        .nav-logo:hover .nav-logo-mark { border-color: rgba(212,175,106,0.9); }
        .nav-logo-mark svg { width: 15px; height: 15px; fill: none; stroke: #d4af6a; stroke-width: 1.8; }
        .nav-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 600;
          color: #e8dfc8; letter-spacing: 0.15em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-logo:hover .nav-logo-name { color: #f0e6d0; }

        /* ── LINKS ── */
        .nav-links {
          display: flex; align-items: center; gap: 2px;
          flex: 1;
        }

        .nav-link {
          position: relative;
          padding: 8px 14px;
          background: none; border: none; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(200,185,160,0.5);
          border-radius: 2px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: rgba(200,185,160,0.9); background: rgba(255,255,255,0.04); }
        .nav-link.active { color: #d4af6a; }

        /* Active underline */
        .nav-link.active::after {
          content: '';
          position: absolute; bottom: 2px; left: 14px; right: 14px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #b8942e, transparent);
        }

        /* ── ACTIONS ── */
        .nav-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }

        .nav-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn svg { width: 13px; height: 13px; }

        .nav-btn-ghost {
          background: none;
          border: 1px solid rgba(255,255,255,0.09);
          color: rgba(200,185,160,0.55);
        }
        .nav-btn-ghost:hover {
          border-color: rgba(184,148,46,0.35);
          color: #d4af6a;
          background: rgba(184,148,46,0.04);
        }

        .nav-btn-primary {
          background: transparent;
          border: 1px solid rgba(184,148,46,0.45);
          color: #d4af6a;
          position: relative; overflow: hidden;
        }
        .nav-btn-primary::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, #b8942e, #d4af6a, #b8942e);
        }
        .nav-btn-primary:hover {
          background: rgba(184,148,46,0.08);
          border-color: rgba(184,148,46,0.7);
        }

        /* Divider */
        .nav-divider { width: 1px; height: 22px; background: rgba(255,255,255,0.07); margin: 0 4px; }

        /* ── MOBILE HAMBURGER ── */
        .nav-hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          width: 36px; height: 36px;
          align-items: center; justify-content: center;
          background: none; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px; cursor: pointer;
          transition: border-color 0.2s;
          margin-left: auto;
        }
        .nav-hamburger:hover { border-color: rgba(184,148,46,0.3); }
        .nav-hamburger-bar {
          width: 16px; height: 1.5px;
          background: rgba(200,185,160,0.6);
          border-radius: 1px;
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .nav-hamburger.open .nav-hamburger-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav-hamburger.open .nav-hamburger-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open .nav-hamburger-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── MOBILE MENU ── */
        .nav-mobile {
          position: absolute; top: 100%; left: 0; right: 0;
          background: #1a1410;
          border-top: 1px solid rgba(184,148,46,0.12);
          border-bottom: 1px solid rgba(0,0,0,0.3);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
          padding: 12px 24px 20px;
          display: flex; flex-direction: column; gap: 4px;
          animation: mobileIn 0.2s ease;
        }
        @keyframes mobileIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-mobile-link {
          padding: 12px 14px;
          background: none; border: none; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(200,185,160,0.55);
          border-radius: 2px; text-align: left;
          transition: color 0.2s, background 0.2s;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-mobile-link:hover { color: #d4af6a; background: rgba(184,148,46,0.06); }
        .nav-mobile-link.active { color: #d4af6a; }
        .nav-mobile-link svg { width: 12px; height: 12px; opacity: 0.4; }

        .nav-mobile-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }
        .nav-mobile-actions { display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
        .nav-mobile-btn {
          padding: 12px;
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          border-radius: 2px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }
        .nav-mobile-btn-ghost {
          background: none; border: 1px solid rgba(255,255,255,0.09);
          color: rgba(200,185,160,0.55);
        }
        .nav-mobile-btn-ghost:hover { border-color: rgba(184,148,46,0.3); color: #d4af6a; }
        .nav-mobile-btn-primary {
          background: transparent; border: 1px solid rgba(184,148,46,0.45);
          color: #d4af6a; position: relative; overflow: hidden;
        }
        .nav-mobile-btn-primary::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, #b8942e, #d4af6a, #b8942e);
        }
        .nav-mobile-btn-primary:hover { background: rgba(184,148,46,0.08); }
        .nav-mobile-btn svg { width: 13px; height: 13px; }

        @media (max-width: 768px) {
          .nav-inner { padding: 0 20px; }
          .nav-links { display: none; }
          .nav-actions { display: none; }
          .nav-hamburger { display: flex; }
          .nav-logo { margin-right: 0; }
        }
      `}</style>

      <div className={`nav-root ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-rule" />
        <div className="nav-bg" />

        <div className="nav-inner">

          {/* Logo */}
          <div className="nav-logo" onClick={() => router.push("/")}>
            <div className="nav-logo-mark">
              <svg viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="nav-logo-name">Eventum</span>
          </div>

          {/* Nav links */}
          <nav className="nav-links">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <button
              className="nav-btn nav-btn-ghost"
              onClick={() => router.push("/register")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              Register
            </button>

            <div className="nav-divider" />

            <button
              className="nav-btn nav-btn-primary"
              onClick={() => router.push("/login")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Sign In
            </button>
          </div>

          {/* Hamburger */}
          <button
            className={`nav-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <div className="nav-hamburger-bar" />
            <div className="nav-hamburger-bar" />
            <div className="nav-hamburger-bar" />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="nav-mobile">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                className={`nav-mobile-link ${isActive(link.href) ? "active" : ""}`}
                onClick={() => router.push(link.href)}
              >
                {link.label}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            ))}

            <div className="nav-mobile-divider" />

            <div className="nav-mobile-actions">
              <button
                className="nav-mobile-btn nav-mobile-btn-ghost"
                onClick={() => router.push("/register")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Create Account
              </button>
              <button
                className="nav-mobile-btn nav-mobile-btn-primary"
                onClick={() => router.push("/login")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}