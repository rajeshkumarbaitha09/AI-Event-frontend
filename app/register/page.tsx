"use client";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#c0392b", "#d4a017", "#2e7d32"];

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      router.push("/events");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleRegister(); };

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
            radial-gradient(ellipse 80% 60% at 20% 60%, rgba(180,140,80,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 85% 15%, rgba(120,80,40,0.1) 0%, transparent 60%);
        }
        .left-grain {
          position: absolute; inset: 0; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
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
        .left-logo-mark svg { width: 18px; height: 18px; fill: none; stroke: #d4af6a; stroke-width: 1.8; }
        .left-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; font-weight: 600;
          color: #e8dfc8; letter-spacing: 0.15em; text-transform: uppercase;
        }
        .left-body { position: relative; }
        .left-ornament { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .left-ornament-line { flex: 0 0 40px; height: 1px; background: linear-gradient(90deg, transparent, #b8942e); }
        .left-ornament-diamond { width: 6px; height: 6px; background: #b8942e; transform: rotate(45deg); }
        .left-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.7rem; font-weight: 700;
          color: #f0e6d0; line-height: 1.18;
          letter-spacing: -0.01em; margin-bottom: 20px;
        }
        .left-heading em { font-style: italic; color: #d4af6a; }
        .left-desc {
          font-size: 0.9rem; color: rgba(200,185,160,0.65);
          line-height: 1.75; font-weight: 300;
          max-width: 320px; letter-spacing: 0.02em;
        }

        /* Steps list */
        .steps { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
        .step { display: flex; align-items: flex-start; gap: 14px; }
        .step-num {
          flex-shrink: 0;
          width: 24px; height: 24px;
          border: 1px solid rgba(184,148,46,0.4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 0.7rem; font-weight: 700;
          color: #b8942e; margin-top: 1px;
        }
        .step-text { font-size: 0.82rem; color: rgba(200,185,160,0.55); line-height: 1.55; font-weight: 300; }
        .step-text strong { color: rgba(212,175,106,0.75); font-weight: 500; }

        .left-footer {
          position: relative;
          display: flex; align-items: center; gap: 16px;
        }
        .left-footer-line { flex: 1; height: 1px; background: rgba(184,148,46,0.2); }
        .left-footer-text {
          font-size: 0.7rem; color: rgba(180,160,120,0.4);
          letter-spacing: 0.12em; text-transform: uppercase;
          font-weight: 400; white-space: nowrap;
        }

        /* ── RIGHT PANEL ── */
        .right {
          display: flex; align-items: center; justify-content: center;
          padding: 52px 48px;
          background: #faf8f5;
          position: relative;
          overflow-y: auto;
        }
        .right::before {
          content: ''; position: absolute; top: 0; right: 0;
          width: 120px; height: 120px;
          border-top: 1px solid rgba(184,148,46,0.15);
          border-right: 1px solid rgba(184,148,46,0.15);
        }
        .right::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 120px; height: 120px;
          border-bottom: 1px solid rgba(184,148,46,0.15);
          border-left: 1px solid rgba(184,148,46,0.15);
        }

        .form-wrap {
          width: 100%; max-width: 380px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .form-wrap.visible { opacity: 1; transform: translateY(0); }

        .form-eyebrow {
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #b8942e; margin-bottom: 10px;
        }
        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 700;
          color: #1a1410; letter-spacing: -0.02em;
          line-height: 1.2; margin-bottom: 6px;
        }
        .form-sub {
          font-size: 0.84rem; color: #8c7d6e;
          font-weight: 300; margin-bottom: 28px; letter-spacing: 0.01em;
        }
        .form-divider {
          width: 48px; height: 1.5px;
          background: linear-gradient(90deg, #b8942e, #d4af6a);
          margin-bottom: 28px;
        }

        /* Two-column name + email row */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .field { margin-bottom: 18px; }
        .field label {
          display: block; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #5c4f42; margin-bottom: 7px;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #c4b59a;
          pointer-events: none; display: flex;
        }
        .input-icon svg { width: 14px; height: 14px; }
        .input-wrap input {
          width: 100%;
          padding: 12px 13px 12px 40px;
          border: 1px solid #ddd5c8;
          border-bottom: 2px solid #ddd5c8;
          background: #ffffff;
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem; color: #1a1410;
          outline: none; border-radius: 2px;
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
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #b8aa9a; display: flex;
          transition: color 0.2s; padding: 2px;
        }
        .pw-toggle:hover { color: #5c4f42; }
        .pw-toggle svg { width: 14px; height: 14px; }

        /* Password strength */
        .strength-row {
          display: flex; align-items: center; gap: 10px;
          margin-top: 7px; margin-bottom: 4px;
        }
        .strength-bars { display: flex; gap: 4px; flex: 1; }
        .strength-bar {
          height: 3px; flex: 1; border-radius: 2px;
          background: #e4dbd0;
          transition: background 0.3s;
        }
        .strength-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          min-width: 36px; text-align: right;
        }

        /* Error */
        .error {
          display: flex; align-items: flex-start; gap: 9px;
          padding: 11px 14px;
          background: #fdf3f3;
          border-left: 2px solid #c0392b;
          margin-bottom: 18px;
          font-size: 0.8rem; color: #7a1f1f; line-height: 1.5;
          animation: errIn 0.2s ease;
        }
        .error svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
        @keyframes errIn { from { opacity: 0; } to { opacity: 1; } }

        /* Button */
        .btn {
          width: 100%; padding: 14px;
          background: #1a1410; border: none;
          color: #e8dfc8;
          font-family: 'Lato', sans-serif;
          font-size: 0.78rem; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          position: relative; overflow: hidden;
          transition: background 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn::after {
          content: ''; position: absolute;
          bottom: 0; left: 0; right: 0; height: 2px;
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

        /* Terms */
        .terms {
          font-size: 0.73rem; color: #a09080;
          line-height: 1.6; margin-top: 14px;
          text-align: center; font-weight: 300;
        }
        .terms a { color: #b8942e; text-decoration: none; border-bottom: 1px solid rgba(184,148,46,0.3); }
        .terms a:hover { border-bottom-color: #b8942e; }

        /* Footer */
        .login-row {
          text-align: center; margin-top: 24px;
          font-size: 0.82rem; color: #9c8b7a; font-weight: 300;
        }
        .login-row button {
          background: none; border: none; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          color: #1a1410; margin-left: 5px;
          letter-spacing: 0.02em;
          border-bottom: 1px solid #b8942e;
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .login-row button:hover { color: #b8942e; }

        @media (max-width: 768px) {
          .root { grid-template-columns: 1fr; }
          .left { display: none; }
          .right { padding: 48px 28px; }
          .field-row { grid-template-columns: 1fr; gap: 0; }
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
              Begin your<br /><em>journey</em> with<br />excellence.
            </h2>
            <p className="left-desc">
              Join thousands of event curators who trust Eventum to bring their vision to life — with precision and grace.
            </p>

            <div className="steps">
              {[
                ["I", "Create your account", "takes less than 60 seconds"],
                ["II", "Build your first event", "rich tools, zero friction"],
                ["III", "Invite & delight guests", "a seamless experience end-to-end"],
              ].map(([num, title, sub]) => (
                <div className="step" key={num}>
                  <div className="step-num">{num}</div>
                  <div className="step-text"><strong>{title}</strong> — {sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="left-footer">
            <div className="left-footer-line" />
            <span className="left-footer-text">Free to start · No credit card</span>
            <div className="left-footer-line" />
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="right">
          <div className={`form-wrap ${mounted ? "visible" : ""}`}>

            <p className="form-eyebrow">New Account</p>
            <h1 className="form-title">Create account</h1>
            <p className="form-sub">Fill in your details to get started for free.</p>
            <div className="form-divider" />

            {/* Name + Email row */}
            <div className="field-row">
              <div className="field">
                <label>Full Name</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </span>
                  <input
                    type="text" placeholder="Jane Smith"
                    value={name} onChange={e => setName(e.target.value)}
                    onKeyDown={handleKey} autoComplete="name"
                  />
                </div>
              </div>

              <div className="field">
                <label>Email</label>
                <div className="input-wrap">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email" placeholder="you@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={handleKey} autoComplete="email"
                  />
                </div>
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
                  placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKey} autoComplete="new-password"
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
              {/* Strength meter */}
              {password && (
                <div className="strength-row">
                  <div className="strength-bars">
                    {[1,2,3].map(i => (
                      <div key={i} className="strength-bar" style={{ background: strength >= i ? strengthColor[strength] : "#e4dbd0" }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="field">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 12l2 2 4-4"/>
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirm} onChange={e => setConfirm(e.target.value)}
                  onKeyDown={handleKey} autoComplete="new-password"
                  style={confirm && confirm !== password ? { borderBottomColor: "#c0392b" } : confirm && confirm === password ? { borderBottomColor: "#2e7d32" } : {}}
                />
                <button className="pw-toggle" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  {showConfirm ? (
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

            <button className="btn" onClick={handleRegister} disabled={loading}>
              {loading ? <><div className="spinner" /> Creating account…</> : "Create Account"}
            </button>

            <p className="terms">
              By registering you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>

            <p className="login-row">
              Already have an account?
              <button onClick={() => router.push("/login")}>Sign in</button>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}