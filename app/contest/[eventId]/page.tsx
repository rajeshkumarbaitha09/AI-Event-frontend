"use client";
import { useState, useEffect } from "react";
import CodeEditor from "@/components/CodeEditor";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

const LANGUAGES = [
  { value: "cpp", label: "C++", icon: "⬡" },
  { value: "python", label: "Python", icon: "⬡" },
  { value: "java", label: "Java", icon: "⬡" },
  { value: "javascript", label: "JavaScript", icon: "⬡" },
];

export default function ContestPage({ params }: any) {
  const { eventId } = params;
  const router = useRouter();

  const [code, setCode] = useState("// Write your solution here\n");
  const [problemId, setProblemId] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "submissions">("problem");
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Timer
  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const submitCode = async () => {
    if (!problemId.trim()) { showToast("Please enter a Problem ID before submitting.", false); return; }
    if (!code.trim() || code === "// Write your solution here\n") { showToast("Please write your solution before submitting.", false); return; }
    setLoading(true);
    try {
      await API.post("/submissions", { problemId, code, language, eventId });
      setSubmitted(true);
      showToast("Solution submitted successfully!", true);
      setTimerActive(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Submission failed. Please try again.", false);
    } finally { setLoading(false); }
  };

  const resetCode = () => {
    setCode("// Write your solution here\n");
    setSubmitted(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .contest-root {
          font-family: 'Lato', sans-serif;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #faf8f5;
          overflow: hidden;
        }

        /* ── TOP BAR ── */
        .topbar {
          background: #1a1410;
          position: relative;
          flex-shrink: 0;
          padding: 0 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          height: 56px;
          border-bottom: 1px solid rgba(184,148,46,0.15);
        }
        .topbar-rule {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 5%, #b8942e, #d4af6a, #b8942e, transparent 95%);
        }

        .topbar-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .topbar-logo-mark {
          width: 28px; height: 28px;
          border: 1.5px solid rgba(212,175,106,0.5);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .topbar-logo-mark svg { width: 13px; height: 13px; fill: none; stroke: #d4af6a; stroke-width: 1.8; }
        .topbar-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem; font-weight: 600;
          color: #e8dfc8; letter-spacing: 0.15em; text-transform: uppercase;
        }

        .topbar-sep { width: 1px; height: 24px; background: rgba(255,255,255,0.08); }

        .topbar-contest {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem; font-weight: 600;
          color: #d4af6a; letter-spacing: 0.02em;
          flex: 1;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Timer */
        .topbar-timer {
          display: flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem; font-weight: 500;
          color: rgba(200,185,160,0.6);
          letter-spacing: 0.06em;
        }
        .topbar-timer svg { width: 13px; height: 13px; }
        .topbar-timer-val { color: #d4af6a; font-weight: 600; }

        .timer-toggle {
          padding: 4px 10px;
          border: 1px solid rgba(184,148,46,0.3);
          background: none; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(180,160,120,0.6);
          border-radius: 2px;
          transition: all 0.2s;
        }
        .timer-toggle:hover { border-color: #b8942e; color: #d4af6a; }
        .timer-toggle.active { border-color: #2e7d32; color: #66bb6a; }

        .topbar-back {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: none; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(200,185,160,0.5);
          border-radius: 2px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .topbar-back:hover { border-color: rgba(184,148,46,0.3); color: #d4af6a; }
        .topbar-back svg { width: 12px; height: 12px; }

        /* ── SPLIT BODY ── */
        .split-body {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          width: 42%;
          min-width: 320px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #e4dbd0;
          background: #fff;
          overflow: hidden;
        }

        .left-tabs {
          display: flex;
          border-bottom: 1px solid #e4dbd0;
          flex-shrink: 0;
          background: #faf8f5;
        }
        .left-tab {
          padding: 12px 20px;
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #9c8b7a;
          border: none; background: none; cursor: pointer;
          position: relative;
          transition: color 0.2s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .left-tab:hover { color: #5c4f42; }
        .left-tab.active { color: #1a1410; border-bottom-color: #b8942e; }

        .left-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
        }
        .left-scroll::-webkit-scrollbar { width: 4px; }
        .left-scroll::-webkit-scrollbar-track { background: transparent; }
        .left-scroll::-webkit-scrollbar-thumb { background: #ddd5c8; border-radius: 2px; }

        /* Problem header */
        .problem-eyebrow {
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #b8942e; margin-bottom: 8px;
        }
        .problem-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem; font-weight: 700;
          color: #1a1410; line-height: 1.25;
          letter-spacing: -0.01em; margin-bottom: 8px;
        }
        .problem-meta {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap; margin-bottom: 20px;
        }
        .problem-badge {
          padding: 3px 9px;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 1px;
        }
        .badge-medium { background: rgba(212,160,23,0.12); color: #a07800; border: 1px solid rgba(212,160,23,0.25); }
        .badge-easy   { background: rgba(46,127,50,0.1);  color: #2e7d32; border: 1px solid rgba(46,127,50,0.2); }
        .badge-hard   { background: rgba(192,57,43,0.1);  color: #c0392b; border: 1px solid rgba(192,57,43,0.2); }

        .problem-divider { width: 40px; height: 1.5px; background: linear-gradient(90deg, #b8942e, #d4af6a); margin-bottom: 20px; }

        .problem-section { margin-bottom: 22px; }
        .problem-section-title {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #5c4f42; margin-bottom: 10px;
        }
        .problem-text {
          font-size: 0.85rem; color: #5c4f42;
          line-height: 1.75; font-weight: 300;
        }
        .problem-placeholder {
          font-size: 0.84rem; color: #9c8b7a;
          line-height: 1.75; font-weight: 300;
          padding: 16px;
          background: #faf8f5;
          border-left: 2px solid #e4dbd0;
          border-radius: 0 2px 2px 0;
          font-style: italic;
        }

        /* Code block */
        .code-block {
          background: #1a1410;
          border-radius: 2px;
          padding: 14px 16px;
          margin: 10px 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          color: #d4af6a;
          line-height: 1.65;
          overflow-x: auto;
        }

        /* Problem ID input */
        .pid-section { margin-top: 8px; padding-top: 20px; border-top: 1px solid #f0ece6; }
        .pid-label {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #5c4f42; margin-bottom: 8px; display: block;
        }
        .pid-input-wrap { position: relative; }
        .pid-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #c4b59a; display: flex; }
        .pid-input-icon svg { width: 13px; height: 13px; }
        .pid-input {
          width: 100%;
          padding: 11px 12px 11px 36px;
          border: 1px solid #ddd5c8; border-bottom: 2px solid #ddd5c8;
          background: #faf8f5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem; color: #1a1410;
          border-radius: 2px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 0.04em;
          -webkit-appearance: none;
        }
        .pid-input::placeholder { color: #c4b59a; font-weight: 400; font-family: 'Lato', sans-serif; }
        .pid-input:focus { border-color: #c4a84a; border-bottom-color: #b8942e; box-shadow: 0 4px 12px rgba(184,148,46,0.1); }

        /* Submissions placeholder */
        .submissions-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; gap: 14px; padding: 40px 20px;
          color: #9c8b7a; text-align: center;
        }
        .submissions-empty-icon {
          width: 48px; height: 48px;
          border: 1.5px solid #ddd5c8;
          display: flex; align-items: center; justify-content: center; color: #c4b59a;
        }
        .submissions-empty-icon svg { width: 22px; height: 22px; }
        .submissions-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; color: #5c4f42;
        }
        .submissions-empty-sub { font-size: 0.78rem; font-weight: 300; }

        /* ── RIGHT PANEL ── */
        .right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #12100d;
          overflow: hidden;
        }

        /* Code toolbar */
        .code-toolbar {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          background: #1a1410;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .lang-select-wrap { position: relative; }
        .lang-select {
          padding: 6px 28px 6px 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(184,148,46,0.2);
          border-radius: 2px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem; color: #d4af6a;
          letter-spacing: 0.04em;
          outline: none; cursor: pointer;
          -webkit-appearance: none; appearance: none;
          transition: border-color 0.2s;
        }
        .lang-select:focus { border-color: #b8942e; }
        .lang-select-arrow { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #b8942e; pointer-events: none; display: flex; }
        .lang-select-arrow svg { width: 11px; height: 11px; }

        .code-toolbar-sep { width: 1px; height: 20px; background: rgba(255,255,255,0.07); }

        .toolbar-action {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px;
          background: none; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(200,185,160,0.5);
          transition: all 0.2s;
        }
        .toolbar-action:hover { border-color: rgba(184,148,46,0.3); color: #d4af6a; }
        .toolbar-action svg { width: 11px; height: 11px; }

        .code-toolbar-spacer { flex: 1; }

        .submit-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 20px;
          background: #1e3a1e;
          border: 1px solid rgba(46,127,50,0.4);
          border-radius: 2px; cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #66bb6a;
          position: relative; overflow: hidden;
          transition: background 0.2s, transform 0.15s;
        }
        .submit-btn::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
          background: linear-gradient(90deg, #2e7d32, #66bb6a, #2e7d32);
        }
        .submit-btn:hover:not(:disabled) { background: #1a4a1a; transform: translateY(-1px); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .submit-btn.submitted { background: #0d2a0d; border-color: rgba(46,127,50,0.2); color: rgba(102,187,106,0.5); }
        .submit-btn svg { width: 13px; height: 13px; }

        .s-spinner { width: 12px; height: 12px; border: 2px solid rgba(102,187,106,0.2); border-top-color: #66bb6a; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Editor wrapper */
        .editor-wrap {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        /* Status bar */
        .status-bar {
          display: flex; align-items: center; gap: 16px;
          padding: 6px 16px;
          background: #1a1410;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-shrink: 0;
        }
        .status-item {
          display: flex; align-items: center; gap: 5px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; color: rgba(180,160,120,0.45);
          letter-spacing: 0.04em;
        }
        .status-item svg { width: 10px; height: 10px; }
        .status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #2e7d32;
          box-shadow: 0 0 6px rgba(46,127,50,0.6);
        }
        .status-dot.pending { background: #d4a017; box-shadow: 0 0 6px rgba(212,160,23,0.6); }

        /* Toast */
        .toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          padding: 12px 22px;
          border-radius: 2px;
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.02em;
          white-space: nowrap; z-index: 9999;
          display: flex; align-items: center; gap: 9px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          animation: toastIn 0.3s cubic-bezier(.22,1,.36,1);
        }
        .toast.ok  { background: #1a1410; color: #e8dfc8; border-left: 3px solid #b8942e; }
        .toast.err { background: #fdf3f3; color: #7a1f1f; border-left: 3px solid #c0392b; }
        .toast svg { width: 14px; height: 14px; flex-shrink: 0; }
        @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

        @media (max-width: 768px) {
          .split-body { flex-direction: column; }
          .left-panel { width: 100%; height: 40%; min-width: unset; border-right: none; border-bottom: 1px solid #e4dbd0; }
          .right-panel { height: 60%; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.ok ? "ok" : "err"}`}>
          {toast.ok ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="contest-root">

        {/* ── TOP BAR ── */}
        <div className="topbar">
          <div className="topbar-rule" />

          <div className="topbar-logo">
            <div className="topbar-logo-mark">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="topbar-logo-name">Eventum</span>
          </div>

          <div className="topbar-sep" />

          <span className="topbar-contest">
            Contest — Event #{eventId}
          </span>

          {/* Timer */}
          <div className="topbar-timer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="topbar-timer-val">{formatTime(timer)}</span>
          </div>
          <button
            className={`timer-toggle ${timerActive ? "active" : ""}`}
            onClick={() => setTimerActive(v => !v)}
          >
            {timerActive ? "Pause" : "Start"}
          </button>

          <div className="topbar-sep" />

          <button className="topbar-back" onClick={() => router.push("/events")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Events
          </button>
        </div>

        {/* ── SPLIT BODY ── */}
        <div className="split-body">

          {/* ── LEFT: Problem ── */}
          <div className="left-panel">
            <div className="left-tabs">
              <button className={`left-tab ${activeTab === "problem" ? "active" : ""}`} onClick={() => setActiveTab("problem")}>Problem</button>
              <button className={`left-tab ${activeTab === "submissions" ? "active" : ""}`} onClick={() => setActiveTab("submissions")}>Submissions</button>
            </div>

            {activeTab === "problem" ? (
              <div className="left-scroll">
                <p className="problem-eyebrow">Challenge</p>
                <h2 className="problem-title">Problem Statement</h2>
                <div className="problem-meta">
                  <span className="problem-badge badge-medium">Medium</span>
                  <span className="problem-badge" style={{ background: "rgba(46,79,92,0.1)", color: "#2e4f5c", border: "1px solid rgba(46,79,92,0.2)" }}>Algorithms</span>
                </div>
                <div className="problem-divider" />

                <div className="problem-section">
                  <p className="problem-section-title">Description</p>
                  <div className="problem-placeholder">
                    Problem description will be loaded from the backend. It will include the full problem statement, constraints, and examples once connected to your API endpoint.
                  </div>
                </div>

                <div className="problem-section">
                  <p className="problem-section-title">Example Input / Output</p>
                  <div className="code-block">
                    {`Input:  [your input here]\nOutput: [expected output here]`}
                  </div>
                </div>

                <div className="problem-section">
                  <p className="problem-section-title">Constraints</p>
                  <p className="problem-text">Constraints will appear here once the backend is connected.</p>
                </div>

                {/* Problem ID input */}
                <div className="pid-section">
                  <label className="pid-label">Problem ID <span style={{ color: "#b8942e" }}>*</span></label>
                  <div className="pid-input-wrap">
                    <span className="pid-input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                    </span>
                    <input
                      className="pid-input"
                      placeholder="e.g. prob_001"
                      value={problemId}
                      onChange={e => setProblemId(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="left-scroll" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="submissions-empty">
                  <div className="submissions-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <p className="submissions-empty-title">No submissions yet</p>
                  <p className="submissions-empty-sub">Your submission history will appear here once you submit a solution.</p>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Editor ── */}
          <div className="right-panel">

            {/* Code toolbar */}
            <div className="code-toolbar">
              {/* Language selector */}
              <div className="lang-select-wrap">
                <select className="lang-select" value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <span className="lang-select-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </div>

              <div className="code-toolbar-sep" />

              <button className="toolbar-action" onClick={resetCode}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4.06"/>
                </svg>
                Reset
              </button>

              <div className="code-toolbar-spacer" />

              <button
                className={`submit-btn ${submitted ? "submitted" : ""}`}
                onClick={submitCode}
                disabled={loading || submitted}
              >
                {loading ? (
                  <><div className="s-spinner" /> Submitting…</>
                ) : submitted ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Submitted
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>

            {/* Editor */}
            <div className="editor-wrap">
              <CodeEditor code={code} setCode={setCode} />
            </div>

            {/* Status bar */}
            <div className="status-bar">
              <div className="status-item">
                <div className={`status-dot ${submitted ? "" : "pending"}`} />
                {submitted ? "Submitted" : "Ready"}
              </div>
              <div className="status-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
                {LANGUAGES.find(l => l.value === language)?.label ?? language}
              </div>
              <div className="status-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {problemId ? `#${problemId}` : "No problem selected"}
              </div>
              <div className="status-item" style={{ marginLeft: "auto" }}>
                Event #{eventId}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}