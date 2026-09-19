"use client";
import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

type Event = {
  _id: string;
  title: string;
  description?: string;
  type?: string;
  category?: string;
  date?: string;
  location?: string;
  attendees?: number;
  capacity?: number;
  image?: string;
  isJoined?: boolean;
};

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const [joined, setJoined] = useState(event.isJoined ?? false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const typeColors: Record<string, string> = {
    conference: "#b8942e", gala: "#7c3a3a", workshop: "#2e5f4a",
    concert: "#2e3d6b", networking: "#5c3a6b", seminar: "#4a5c2e",
    default: "#5c4f42",
  };
  const accent = typeColors[(event.type ?? event.category ?? "default").toLowerCase()] ?? typeColors.default;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const capacityPct = event.capacity && event.attendees
    ? Math.min(100, Math.round((event.attendees / event.capacity) * 100))
    : null;

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleJoin = async () => {
    if (joined || loading) return;
    setLoading(true);
    try {
      await API.post(`/events/${event._id}/join`);
      setJoined(true);
      showToast("You've joined this event.", true);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Could not join. Please try again.", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .ec-card {
          font-family: 'Lato', sans-serif;
          background: #fff;
          border: 1px solid #e4dbd0;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .ec-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(26,20,16,0.11);
          border-color: #c4b59a;
        }

        /* Top accent bar */
        .ec-accent { height: 3px; width: 100%; flex-shrink: 0; }

        /* Image */
        .ec-image {
          width: 100%; height: 168px;
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #f0ece6 0%, #e8e0d4 100%);
          flex-shrink: 0;
        }
        .ec-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .ec-card:hover .ec-image img { transform: scale(1.05); }
        .ec-image-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: #c4b59a;
        }
        .ec-image-placeholder svg { width: 38px; height: 38px; }

        /* Type badge */
        .ec-badge {
          position: absolute; top: 12px; right: 12px;
          padding: 4px 10px;
          font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; border-radius: 1px;
          font-family: 'Lato', sans-serif;
        }

        /* Joined ribbon */
        .ec-ribbon {
          position: absolute; top: 0; left: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 44px 44px 0 0;
          border-color: #2e7d32 transparent transparent transparent;
        }
        .ec-ribbon-icon {
          position: absolute; top: 6px; left: 4px;
          color: #fff;
        }
        .ec-ribbon-icon svg { width: 12px; height: 12px; }

        /* Body */
        .ec-body {
          padding: 20px 22px 0;
          flex: 1;
          display: flex; flex-direction: column;
        }

        .ec-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 700;
          color: #1a1410; line-height: 1.3;
          letter-spacing: -0.01em;
          margin-bottom: 8px;
        }
        .ec-desc {
          font-size: 0.81rem; color: #8c7d6e;
          line-height: 1.65; font-weight: 300;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 14px;
        }

        /* Meta items */
        .ec-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .ec-meta-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; color: #8c7d6e; font-weight: 400;
        }
        .ec-meta-item svg { width: 12px; height: 12px; flex-shrink: 0; }

        /* Capacity bar */
        .ec-capacity { margin-bottom: 16px; }
        .ec-capacity-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 5px;
        }
        .ec-capacity-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9c8b7a; }
        .ec-capacity-num { font-size: 0.68rem; font-weight: 700; color: #5c4f42; letter-spacing: 0.04em; }
        .ec-capacity-track {
          height: 3px; background: #f0ece6; border-radius: 2px; overflow: hidden;
        }
        .ec-capacity-fill {
          height: 100%; border-radius: 2px;
          transition: width 0.6s ease;
        }

        /* Footer */
        .ec-footer {
          border-top: 1px solid #f0ece6;
          padding: 14px 22px;
          display: flex; align-items: center; gap: 10px;
          margin-top: auto;
        }

        /* Join button */
        .ec-join-btn {
          flex: 1;
          padding: 11px 14px;
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          border: none; border-radius: 2px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          position: relative; overflow: hidden;
          transition: background 0.2s, transform 0.15s;
        }
        .ec-join-btn.idle {
          background: #1a1410; color: #e8dfc8;
        }
        .ec-join-btn.idle::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #b8942e, #d4af6a, #b8942e);
        }
        .ec-join-btn.idle:hover { background: #2e241c; transform: translateY(-1px); }
        .ec-join-btn.idle:active { transform: translateY(0); }
        .ec-join-btn.joined {
          background: #f0f7f0; color: #2e7d32;
          border: 1px solid #c8e6c9; cursor: default;
        }
        .ec-join-btn.loading { background: #1a1410; color: rgba(232,223,200,0.5); cursor: not-allowed; }

        .ec-spinner {
          width: 12px; height: 12px;
          border: 2px solid rgba(232,223,200,0.25);
          border-top-color: #e8dfc8;
          border-radius: 50%;
          animation: ec-spin 0.7s linear infinite;
        }
        @keyframes ec-spin { to { transform: rotate(360deg); } }

        /* Details link */
        .ec-detail-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; flex-shrink: 0;
          border: 1px solid #e4dbd0; border-radius: 2px;
          background: none; cursor: pointer;
          color: #9c8b7a;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .ec-detail-btn:hover { border-color: #b8942e; color: #b8942e; background: #fdf9f2; }
        .ec-detail-btn svg { width: 14px; height: 14px; }

        /* Toast */
        .ec-toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          padding: 12px 22px;
          border-radius: 2px;
          font-family: 'Lato', sans-serif;
          font-size: 0.8rem; font-weight: 500; letter-spacing: 0.02em;
          white-space: nowrap;
          z-index: 9999;
          display: flex; align-items: center; gap: 9px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          animation: ec-toast-in 0.3s cubic-bezier(.22,1,.36,1);
        }
        .ec-toast.ok  { background: #1a1410; color: #e8dfc8; border-left: 3px solid #b8942e; }
        .ec-toast.err { background: #fdf3f3; color: #7a1f1f; border-left: 3px solid #c0392b; }
        .ec-toast svg { width: 14px; height: 14px; flex-shrink: 0; }
        @keyframes ec-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`ec-toast ${toast.ok ? "ok" : "err"}`}>
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

      <div className="ec-card">
        {/* Accent bar */}
        <div className="ec-accent" style={{ background: accent }} />

        {/* Image */}
        <div className="ec-image">
          {event.image ? (
            <img src={event.image} alt={event.title} />
          ) : (
            <div className="ec-image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
              </svg>
            </div>
          )}

          {(event.type || event.category) && (
            <span className="ec-badge" style={{ background: accent }}>
              {event.type ?? event.category}
            </span>
          )}

          {joined && (
            <div className="ec-ribbon">
              <span className="ec-ribbon-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="ec-body">
          <h2 className="ec-title">{event.title}</h2>

          {event.description && (
            <p className="ec-desc">{event.description}</p>
          )}

          <div className="ec-meta">
            {formattedDate && (
              <div className="ec-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                {formattedDate}
              </div>
            )}
            {event.location && (
              <div className="ec-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {event.location}
              </div>
            )}
            {event.attendees !== undefined && (
              <div className="ec-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {event.attendees.toLocaleString()} attending
              </div>
            )}
          </div>

          {/* Capacity bar */}
          {capacityPct !== null && (
            <div className="ec-capacity">
              <div className="ec-capacity-header">
                <span className="ec-capacity-label">Capacity</span>
                <span className="ec-capacity-num">{event.attendees?.toLocaleString()} / {event.capacity?.toLocaleString()}</span>
              </div>
              <div className="ec-capacity-track">
                <div
                  className="ec-capacity-fill"
                  style={{
                    width: `${capacityPct}%`,
                    background: capacityPct >= 90 ? "#c0392b" : capacityPct >= 60 ? "#d4a017" : accent,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ec-footer">
          <button
            className={`ec-join-btn ${loading ? "loading" : joined ? "joined" : "idle"}`}
            onClick={handleJoin}
            disabled={joined || loading}
          >
            {loading ? (
              <><div className="ec-spinner" /> Joining…</>
            ) : joined ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 13, height: 13 }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Joined
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
                Join Event
              </>
            )}
          </button>

          <button
            className="ec-detail-btn"
            onClick={() => router.push(`/events/${event._id}`)}
            title="View details"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}