"use client";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          font-family: 'Lato', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #faf8f5;
        }

        /* ── LEFT PANEL ── */
        .left {
          position: relative;
          background: #1a1410;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 56px;
        }

        .left-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 30% 70%, rgba(180,140,80,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 20%, rgba(120,80,40,0.1) 0%, transparent 60%);
        }

        /* Textured grain overlay */
        .left-grain {
          position: absolute; inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        /* Thin gold horizontal rule */
        .left-rule {
          position: absolute;
          top: 0; left: 56px; right: 56px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #b8942e, #d4af6a, #b8942e, transparent);
        }

        .left-logo {
          position: relative;
          display: flex; align-items: center; gap: 12px;
        }
        .left-logo-mark {
          width: 36px; height: 36px;
          border: 1.5px solid rgba(212,175,106,0.6);
          display: flex; align-items: center; justify-content: center;
        }
        .left-logo-mark svg { width: 18px; height: 18px; fill: #d4af6a; }
        .left-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #e8dfc8;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .left-body { position: relative; }

        .left-ornament {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 28px;
        }
        .left-ornament-line {
          flex: 0 0 40px; height: 1px;
          background: linear-gradient(90deg, transparent, #b8942e);
        }
        .left-ornament-diamond {
          width: 6px; height: 6px;
          background: #b8942e;
          transform: rotate(45deg);
        }

        .left-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 700;
          color: #f0e6d0;
          line-height: 1.18;
          letter-spacing: -0.01em;
          margin-bottom: 20px;
        }
        .left-heading em {
          font-style: italic;
          color: #d4af6a;
        }

        .left-desc {
          font-size: 0.9rem;
          color: rgba(200,185,160,0.65);
          line-height: 1.75;
          font-weight: 300;
          max-width: 320px;
          letter-spacing: 0.02em;
        }

        .left-footer {
          position: relative;
          display: flex; align-items: center; gap: 16px;
        }
        .left-footer-line { flex: 1; height: 1px; background: rgba(184,148,46,0.2); }
        .left-footer-text {
          font-size: 0.7rem;
          color: rgba(180,160,120,0.4);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 400;
          white-space: nowrap;
        }

        /* ── RIGHT PANEL ── */
        .right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          background: #faf8f5;
          position: relative;
        }

        /* Subtle corner ornament */
        .right::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 120px; height: 120px;
          border-top: 1px solid rgba(184,148,46,0.15);
          border-right: 1px solid rgba(184,148,46,0.15);
        }
        .right::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 120px; height: 120px;
          border-bottom: 1px solid rgba(184,148,46,0.15);
          border-left: 1px solid rgba(184,148,46,0.15);
        }

        .form-wrap {
          width: 100%;
          max-width: 360px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .form-wrap.visible { opacity: 1; transform: translateY(0); }

        .form-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b8942e;
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1410;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .form-sub {
          font-size: 0.84rem;
          color: #8c7d6e;
          font-weight: 300;
          margin-bottom: 36px;
          letter-spacing: 0.01em;
        }

        /* Thin gold divider */
        .form-divider {
          width: 48px; height: 1.5px;
          background: linear-gradient(90deg, #b8942e, #d4af6a);
          margin-bottom: 36px;
        }

        /* Field */
        .field { margin-bottom: 22px; }
        .field label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5c4f42;
          margin-bottom: 8px;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #c4b59a;
          pointer-events: none;
          display: flex;
        }
        .input-icon svg { width: 15px; height: 15px; }

        .input-wrap input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 1px solid #ddd5c8;
          border-bottom: 2px solid #ddd5c8;
          background: #ffffff;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          color: #1a1410;
          outline: none;
          border-radius: 2px;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .input-wrap input::placeholder { color: #c4b59a; font-weight: 300; }
        .input-wrap input:focus {
          border-color: #c4a84a;
          border-bottom-color: #b8942e;
          box-shadow: 0 4px 12px rgba(184,148,46,0.1);
        }

        .pw-toggle {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #b8aa9a; display: flex;
          transition: color 0.2s;
          padding: 2px;
        }
        .pw-toggle:hover { color: #5c4f42; }
        .pw-toggle svg { width: 15px; height: 15px; }

        /* Forgot */
        .forgot-row {
          text-align: right;
          margin-top: -12px;
          margin-bottom: 28px;
        }
        .forgot-row a {
          font-size: 0.75rem;
          color: #9c8b7a;
          text-decoration: none;
          font-weight: 400;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
        }
        .forgot-row a:hover { color: #b8942e; border-bottom-color: #b8942e; }

        /* Error */
        .error {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 11px 14px;
          background: #fdf3f3;
          border-left: 2px solid #c0392b;
          margin-bottom: 20px;
          font-size: 0.8rem;
          color: #7a1f1f;
          line-height: 1.5;
          animation: errIn 0.2s ease;
        }
        .error svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
        @keyframes errIn { from { opacity: 0; } to { opacity: 1; } }

        /* Button */
        .btn {
          width: 100%;
          padding: 14px;
          background: #1a1410;
          border: none;
          color: #e8dfc8;
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #b8942e, #d4af6a, #b8942e);
        }
        .btn:hover:not(:disabled) { background: #2e241c; transform: translateY(-1px); }
        .btn:active:not(:disabled) { transform: translateY(0); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(232,223,200,0.3);
          border-top-color: #e8dfc8;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* OR divider */
        .or-row {
          display: flex; align-items: center; gap: 14px;
          margin: 26px 0;
        }
        .or-row::before, .or-row::after {
          content: ''; flex: 1; height: 1px;
          background: #e4dbd0;
        }
        .or-row span {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #b8aa9a;
        }

        /* SSO */
        .sso-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .sso-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px;
          background: #fff;
          border: 1px solid #ddd5c8;
          border-radius: 2px;
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #4a3d30;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .sso-btn:hover { border-color: #b8942e; background: #fdf9f2; }
        .sso-btn svg { width: 15px; height: 15px; }

        /* Footer */
        .register-row {
          text-align: center;
          margin-top: 28px;
          font-size: 0.82rem;
          color: #9c8b7a;
          font-weight: 300;
        }
        .register-row button {
          background: none; border: none; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1a1410;
          margin-left: 5px;
          letter-spacing: 0.02em;
          border-bottom: 1px solid #b8942e;
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .register-row button:hover { color: #b8942e; }

        /* Responsive */
        @media (max-width: 768px) {
          .root { grid-template-columns: 1fr; }
          .left { display: none; }
          .right { padding: 48px 28px; background: #faf8f5; }
        }
      `}</style>

      <div className="root">

        {/* ── LEFT ── */}
        <div className="left">
          <div className="left-rule" />
          <div className="left-grain" />
          <div className="left-bg" />

          <div className="left-logo">
            <div className="left-logo-mark">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="left-logo-name">Eventum</span>
          </div>

          <div className="left-body">
            <div className="left-ornament">
              <div className="left-ornament-line" />
              <div className="left-ornament-diamond" />
            </div>
            <h2 className="left-heading">
              Curate <em>moments</em><br />that endure.
            </h2>
            <p className="left-desc">
              A refined platform for those who believe every event deserves to be remembered. Crafted with intention, delivered with excellence.
            </p>
          </div>

          <div className="left-footer">
            <div className="left-footer-line" />
            <span className="left-footer-text">Est. 2024 · Trusted by 12,000+</span>
            <div className="left-footer-line" />
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="right">
          <div className={`form-wrap ${mounted ? "visible" : ""}`}>

            <p className="form-eyebrow">Member Access</p>
            <h1 className="form-title">Sign in</h1>
            <p className="form-sub">Welcome back — your events are waiting.</p>
            <div className="form-divider" />

            {/* Email */}
            <div className="field">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
                <button className="pw-toggle" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="forgot-row"><a href="#">Forgot password?</a></div>

            {error && (
              <div className="error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button className="btn" onClick={handleLogin} disabled={loading}>
              {loading ? <><div className="spinner" /> Signing in…</> : "Sign In"}
            </button>

            <div className="or-row"><span>Or continue with</span></div>

            <div className="sso-row">
              <button className="sso-btn">
                <svg viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="sso-btn">
                <svg viewBox="0 0 24 24" fill="#1a1410">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>

            <p className="register-row">
              Don't have an account?
              <button onClick={() => router.push("/register")}>Create one</button>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}