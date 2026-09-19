"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

type Event = {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  category?: string;
  attendees?: number;
  image?: string;
};

// ── CREATE EVENT MODAL ────────────────────────────────────────────────────────
function CreateEventModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("coding");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const eventTypes = ["coding", "conference", "workshop", "gala", "concert", "networking", "seminar"];

  const handleCreate = async () => {
    if (!title.trim()) { setError("Event title is required."); return; }
    if (!startTime || !endTime) { setError("Please set start and end times."); return; }
    if (new Date(endTime) <= new Date(startTime)) { setError("End time must be after start time."); return; }
    setError(""); setLoading(true);
    try {
      await API.post("/events", {
        title: title.trim(),
        description: description.trim() || "New Event",
        type,
        location: location.trim(),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create event. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-rule" />

        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Host an Event</p>
            <h2 className="modal-title">Create <em>New Event</em></h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-ornament">
          <div className="modal-ornament-line" />
          <div className="modal-ornament-diamond" />
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="mfield mfield-full">
            <label>Event Title <span className="req">*</span></label>
            <div className="minput-wrap">
              <span className="minput-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
              <input type="text" placeholder="e.g. Annual Tech Summit 2025" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            </div>
          </div>

          {/* Description */}
          <div className="mfield mfield-full">
            <label>Description</label>
            <div className="mtextarea-wrap">
              <textarea placeholder="What is this event about?" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
          </div>

          {/* Type + Location */}
          <div className="mfield-row">
            <div className="mfield">
              <label>Event Type <span className="req">*</span></label>
              <div className="mselect-wrap">
                <select value={type} onChange={e => setType(e.target.value)}>
                  {eventTypes.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <span className="mselect-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
              </div>
            </div>

            <div className="mfield">
              <label>Location</label>
              <div className="minput-wrap">
                <span className="minput-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <input type="text" placeholder="Venue or Online" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Start + End time */}
          <div className="mfield-row">
            <div className="mfield">
              <label>Start Time <span className="req">*</span></label>
              <div className="minput-wrap">
                <span className="minput-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
            </div>

            <div className="mfield">
              <label>End Time <span className="req">*</span></label>
              <div className="minput-wrap">
                <span className="minput-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
            </div>
          </div>

          {error && (
            <div className="modal-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-submit" onClick={handleCreate} disabled={loading}>
            {loading ? (
              <><div className="modal-spinner" /> Publishing…</>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Publish Event
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EVENT CARD ────────────────────────────────────────────────────────────────
function EventCard({ event, index }: { event: Event; index: number }) {
  const router = useRouter();
  const categories: Record<string, string> = {
    conference: "#b8942e", gala: "#7c3a3a", workshop: "#2e5f4a",
    concert: "#2e3d6b", networking: "#5c3a6b", coding: "#2e4f5c",
    seminar: "#4a5c2e", default: "#5c4f42",
  };
  const accentColor = categories[event.category?.toLowerCase() ?? "default"] ?? categories.default;
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="event-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="card-accent" style={{ background: accentColor }} />
      <div className="card-image">
        {event.image ? (
          <img src={event.image} alt={event.title} />
        ) : (
          <div className="card-image-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
            </svg>
          </div>
        )}
        {event.category && (
          <span className="card-badge" style={{ background: accentColor }}>{event.category}</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        {event.description && <p className="card-desc">{event.description}</p>}
        <div className="card-meta">
          {formattedDate && (
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              {formattedDate}
            </div>
          )}
          {event.location && (
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {event.location}
            </div>
          )}
          {event.attendees !== undefined && (
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {event.attendees.toLocaleString()} attending
            </div>
          )}
        </div>
        <div className="card-footer">
          <button className="card-btn" onClick={() => router.push(`/events/${event._id}`)}>
            View Details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SKELETON ──────────────────────────────────────────────────────────────────
function SkeletonCard({ index }: { index: number }) {
  return (
    <div className="skeleton-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="sk sk-image" />
      <div className="sk-body">
        <div className="sk sk-title" />
        <div className="sk sk-line" />
        <div className="sk sk-line" style={{ width: "70%" }} />
        <div className="sk sk-meta" />
      </div>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    setLoading(true); setError("");
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch {
      setError("Unable to load events. Please try again.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category).filter(Boolean))) as string[]];
  const filtered = events.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.category?.toLowerCase() === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Lato:wght@300;400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page { font-family: 'Lato', sans-serif; min-height: 100vh; background: #faf8f5; color: #1a1410; }

        .header { background: #1a1410; position: relative; overflow: hidden; padding: 0 48px; }
        .header-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 140% at 80% 50%, rgba(180,140,80,0.1) 0%, transparent 70%); pointer-events: none; }
        .header-rule { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent 5%, #b8942e, #d4af6a, #b8942e, transparent 95%); }
        .header-inner { position: relative; max-width: 1200px; margin: 0 auto; padding: 28px 0 0; }
        .header-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px; }
        .header-logo { display: flex; align-items: center; gap: 12px; }
        .header-logo-mark { width: 34px; height: 34px; border: 1.5px solid rgba(212,175,106,0.6); display: flex; align-items: center; justify-content: center; }
        .header-logo-mark svg { width: 16px; height: 16px; fill: none; stroke: #d4af6a; stroke-width: 1.8; }
        .header-logo-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: #e8dfc8; letter-spacing: 0.15em; text-transform: uppercase; }
        .header-actions { display: flex; align-items: center; gap: 10px; }
        .header-btn { display: flex; align-items: center; gap: 7px; padding: 9px 18px; font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
        .header-btn-ghost { background: none; border: 1px solid rgba(255,255,255,0.1); color: rgba(200,185,160,0.6); }
        .header-btn-ghost:hover { border-color: rgba(184,148,46,0.4); color: #d4af6a; }
        .header-btn-primary { background: transparent; border: 1px solid rgba(184,148,46,0.5); color: #d4af6a; position: relative; overflow: hidden; }
        .header-btn-primary::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px; background: linear-gradient(90deg, #b8942e, #d4af6a); }
        .header-btn-primary:hover { background: rgba(184,148,46,0.08); }
        .header-btn svg { width: 14px; height: 14px; }
        .hero { padding-bottom: 48px; }
        .hero-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #b8942e; margin-bottom: 10px; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 700; color: #f0e6d0; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 12px; }
        .hero-title em { font-style: italic; color: #d4af6a; }
        .hero-sub { font-size: 0.9rem; color: rgba(200,185,160,0.55); font-weight: 300; letter-spacing: 0.02em; }
        .hero-ornament { display: flex; align-items: center; gap: 12px; margin: 20px 0 0; }
        .hero-ornament-line { flex: 0 0 36px; height: 1px; background: linear-gradient(90deg, transparent, #b8942e); }
        .hero-ornament-diamond { width: 5px; height: 5px; background: #b8942e; transform: rotate(45deg); }

        .toolbar { background: #fff; border-bottom: 1px solid #e4dbd0; padding: 0 48px; position: sticky; top: 0; z-index: 10; }
        .toolbar-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; padding: 16px 0; flex-wrap: wrap; }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #b8aa9a; pointer-events: none; display: flex; }
        .search-icon svg { width: 14px; height: 14px; }
        .search-input { width: 100%; padding: 10px 13px 10px 38px; border: 1px solid #ddd5c8; border-bottom: 2px solid #ddd5c8; background: #faf8f5; font-family: 'Lato', sans-serif; font-size: 0.85rem; color: #1a1410; border-radius: 2px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-input::placeholder { color: #c4b59a; font-weight: 300; }
        .search-input:focus { border-color: #c4a84a; border-bottom-color: #b8942e; box-shadow: 0 4px 12px rgba(184,148,46,0.1); }
        .filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
        .filter-tab { padding: 8px 14px; font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid transparent; border-radius: 2px; cursor: pointer; background: none; color: #9c8b7a; transition: all 0.2s; }
        .filter-tab:hover { color: #5c4f42; border-color: #ddd5c8; }
        .filter-tab.active { background: #1a1410; color: #e8dfc8; border-color: #1a1410; position: relative; overflow: hidden; }
        .filter-tab.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px; background: linear-gradient(90deg, #b8942e, #d4af6a); }
        .count-badge { margin-left: auto; font-size: 0.72rem; font-weight: 400; color: #9c8b7a; letter-spacing: 0.06em; white-space: nowrap; }
        .count-badge strong { color: #5c4f42; font-weight: 700; }

        .main { max-width: 1200px; margin: 0 auto; padding: 48px 48px 80px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        .event-card { background: #fff; border: 1px solid #e4dbd0; border-radius: 2px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; opacity: 0; animation: cardIn 0.45s ease forwards; position: relative; }
        @keyframes cardIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .event-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(26,20,16,0.1); border-color: #c4b59a; }
        .card-accent { height: 3px; width: 100%; }
        .card-image { width: 100%; height: 160px; position: relative; overflow: hidden; background: #f0ece6; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .event-card:hover .card-image img { transform: scale(1.04); }
        .card-image-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0ece6 0%, #e8e0d4 100%); color: #c4b59a; }
        .card-image-placeholder svg { width: 36px; height: 36px; }
        .card-badge { position: absolute; top: 12px; right: 12px; padding: 4px 10px; font-family: 'Lato', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; border-radius: 1px; }
        .card-body { padding: 20px 22px 0; flex: 1; display: flex; flex-direction: column; }
        .card-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #1a1410; line-height: 1.3; letter-spacing: -0.01em; margin-bottom: 8px; }
        .card-desc { font-size: 0.82rem; color: #8c7d6e; line-height: 1.65; font-weight: 300; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; }
        .card-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #8c7d6e; font-weight: 400; }
        .meta-item svg { width: 12px; height: 12px; flex-shrink: 0; color: #b8942e; }
        .card-footer { border-top: 1px solid #f0ece6; padding: 14px 0; margin-top: auto; }
        .card-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer; font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #5c4f42; padding: 0; transition: color 0.2s, gap 0.2s; }
        .card-btn:hover { color: #b8942e; gap: 10px; }
        .card-btn svg { width: 13px; height: 13px; }

        .skeleton-card { background: #fff; border: 1px solid #e4dbd0; border-radius: 2px; overflow: hidden; opacity: 0; animation: cardIn 0.4s ease forwards; }
        .sk { background: #f0ece6; border-radius: 2px; animation: shimmer 1.4s ease-in-out infinite; }
        @keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        .sk-image { height: 160px; width: 100%; border-radius: 0; }
        .sk-body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; }
        .sk-title { height: 18px; width: 75%; }
        .sk-line { height: 12px; width: 100%; }
        .sk-meta { height: 12px; width: 50%; margin-top: 4px; }

        .empty { grid-column: 1/-1; text-align: center; padding: 80px 20px; }
        .empty-icon { width: 56px; height: 56px; margin: 0 auto 20px; border: 1.5px solid #ddd5c8; display: flex; align-items: center; justify-content: center; color: #c4b59a; }
        .empty-icon svg { width: 24px; height: 24px; }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #5c4f42; margin-bottom: 8px; }
        .empty-sub { font-size: 0.84rem; color: #9c8b7a; font-weight: 300; }
        .empty-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 24px; padding: 12px 24px; background: #1a1410; border: none; cursor: pointer; font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #e8dfc8; border-radius: 2px; position: relative; overflow: hidden; transition: background 0.2s; }
        .empty-btn::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #b8942e, #d4af6a); }
        .empty-btn:hover { background: #2e241c; }
        .error-box { grid-column: 1/-1; display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #fdf3f3; border-left: 2px solid #c0392b; font-size: 0.84rem; color: #7a1f1f; line-height: 1.5; }
        .error-box svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }

        /* ── MODAL ── */
        .modal-overlay { position: fixed; inset: 0; z-index: 100; background: rgba(10,8,6,0.72); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 24px; animation: overlayIn 0.2s ease; }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        .modal { background: #faf8f5; width: 100%; max-width: 560px; border-radius: 2px; border: 1px solid #e4dbd0; position: relative; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.35); animation: modalIn 0.3s cubic-bezier(.22,1,.36,1); max-height: 90vh; overflow-y: auto; }
        @keyframes modalIn { from { opacity: 0; transform: translateY(24px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .modal-rule { position: sticky; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent 5%, #b8942e, #d4af6a, #b8942e, transparent 95%); z-index: 1; }
        .modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 32px 32px 0; }
        .modal-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #b8942e; margin-bottom: 8px; }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; font-weight: 700; color: #1a1410; letter-spacing: -0.02em; line-height: 1.2; }
        .modal-title em { font-style: italic; color: #b8942e; }
        .modal-close { background: none; border: 1px solid #e4dbd0; border-radius: 2px; cursor: pointer; color: #9c8b7a; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s, color 0.2s; }
        .modal-close:hover { border-color: #b8942e; color: #b8942e; }
        .modal-close svg { width: 14px; height: 14px; }
        .modal-ornament { display: flex; align-items: center; gap: 10px; padding: 16px 32px 0; }
        .modal-ornament-line { flex: 0 0 32px; height: 1px; background: linear-gradient(90deg, transparent, #b8942e); }
        .modal-ornament-diamond { width: 5px; height: 5px; background: #b8942e; transform: rotate(45deg); }
        .modal-body { padding: 24px 32px 0; }
        .mfield { margin-bottom: 18px; }
        .mfield-full { margin-bottom: 18px; }
        .mfield-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .mfield label, .mfield-full label { display: block; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #5c4f42; margin-bottom: 7px; }
        .req { color: #b8942e; }
        .minput-wrap { position: relative; }
        .minput-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #c4b59a; pointer-events: none; display: flex; }
        .minput-icon svg { width: 13px; height: 13px; }
        .minput-wrap input { width: 100%; padding: 11px 12px 11px 36px; border: 1px solid #ddd5c8; border-bottom: 2px solid #ddd5c8; background: #fff; font-family: 'Lato', sans-serif; font-size: 0.86rem; color: #1a1410; border-radius: 2px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }
        .minput-wrap input::placeholder { color: #c4b59a; font-weight: 300; }
        .minput-wrap input:focus { border-color: #c4a84a; border-bottom-color: #b8942e; box-shadow: 0 4px 12px rgba(184,148,46,0.1); }
        .mtextarea-wrap textarea { width: 100%; padding: 11px 14px; border: 1px solid #ddd5c8; border-bottom: 2px solid #ddd5c8; background: #fff; font-family: 'Lato', sans-serif; font-size: 0.86rem; color: #1a1410; line-height: 1.6; border-radius: 2px; outline: none; resize: vertical; transition: border-color 0.2s, box-shadow 0.2s; -webkit-appearance: none; }
        .mtextarea-wrap textarea::placeholder { color: #c4b59a; font-weight: 300; }
        .mtextarea-wrap textarea:focus { border-color: #c4a84a; border-bottom-color: #b8942e; box-shadow: 0 4px 12px rgba(184,148,46,0.1); }
        .mselect-wrap { position: relative; }
        .mselect-wrap select { width: 100%; padding: 11px 36px 11px 14px; border: 1px solid #ddd5c8; border-bottom: 2px solid #ddd5c8; background: #fff; font-family: 'Lato', sans-serif; font-size: 0.86rem; color: #1a1410; border-radius: 2px; outline: none; cursor: pointer; -webkit-appearance: none; appearance: none; transition: border-color 0.2s; }
        .mselect-wrap select:focus { border-color: #c4a84a; border-bottom-color: #b8942e; }
        .mselect-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #b8aa9a; pointer-events: none; display: flex; }
        .mselect-arrow svg { width: 13px; height: 13px; }
        .modal-error { display: flex; align-items: flex-start; gap: 9px; padding: 11px 14px; background: #fdf3f3; border-left: 2px solid #c0392b; font-size: 0.8rem; color: #7a1f1f; line-height: 1.5; margin-bottom: 4px; animation: errIn 0.2s ease; }
        .modal-error svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
        @keyframes errIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 24px 32px 28px; border-top: 1px solid #f0ece6; margin-top: 20px; }
        .modal-cancel { padding: 10px 20px; background: none; border: 1px solid #ddd5c8; border-radius: 2px; cursor: pointer; font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #9c8b7a; transition: border-color 0.2s, color 0.2s; }
        .modal-cancel:hover { border-color: #b8942e; color: #5c4f42; }
        .modal-submit { padding: 11px 22px; background: #1a1410; border: none; border-radius: 2px; cursor: pointer; font-family: 'Lato', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #e8dfc8; display: flex; align-items: center; gap: 8px; position: relative; overflow: hidden; transition: background 0.2s, transform 0.15s; }
        .modal-submit::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #b8942e, #d4af6a, #b8942e); }
        .modal-submit:hover:not(:disabled) { background: #2e241c; transform: translateY(-1px); }
        .modal-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .modal-spinner { width: 12px; height: 12px; border: 2px solid rgba(232,223,200,0.25); border-top-color: #e8dfc8; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, 1fr); } .main, .toolbar, .header { padding-left: 28px; padding-right: 28px; } .header-inner { padding-left: 0; padding-right: 0; } }
        @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } .hero-title { font-size: 2rem; } .toolbar-inner { gap: 12px; } .count-badge { display: none; } .mfield-row { grid-template-columns: 1fr; } }
      `}</style>

      {showModal && (
        <CreateEventModal onClose={() => setShowModal(false)} onCreated={fetchEvents} />
      )}

      <div className="page">
        <div className="header">
          <div className="header-rule" />
          <div className="header-bg" />
          <div className="header-inner">
            <nav className="header-nav">
              <div className="header-logo">
                <div className="header-logo-mark">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <span className="header-logo-name">Eventum</span>
              </div>
              <div className="header-actions">
                <button className="header-btn header-btn-ghost" onClick={() => router.push("/login")}>Sign out</button>
                <button className="header-btn header-btn-primary" onClick={() => setShowModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Event
                </button>
              </div>
            </nav>
            <div className="hero">
              <p className="hero-eyebrow">Your Collection</p>
              <h1 className="hero-title">Upcoming <em>Events</em></h1>
              <p className="hero-sub">Curated experiences, crafted with intention.</p>
              <div className="hero-ornament">
                <div className="hero-ornament-line" />
                <div className="hero-ornament-diamond" />
              </div>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="toolbar-inner">
            <div className="search-wrap">
              <span className="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>
              <input className="search-input" placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {categories.length > 1 && (
              <div className="filter-tabs">
                {categories.map(cat => (
                  <button key={cat} className={`filter-tab ${filter === cat ? "active" : ""}`} onClick={() => setFilter(cat)}>{cat}</button>
                ))}
              </div>
            )}
            <span className="count-badge"><strong>{filtered.length}</strong> of {events.length} events</span>
          </div>
        </div>

        <main className="main">
          <div className="grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)
            ) : error ? (
              <div className="error-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
                <button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, color: "#c0392b", letterSpacing: "0.08em", textTransform: "uppercase" }} onClick={fetchEvents}>Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9.5 16l1.5-1.5 1.5 1.5 3-3"/>
                  </svg>
                </div>
                <h3 className="empty-title">No events found</h3>
                <p className="empty-sub">{search ? `No results for "${search}"` : "Be the first to host an event."}</p>
                {!search && (
                  <button className="empty-btn" onClick={() => setShowModal(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Create Event
                  </button>
                )}
              </div>
            ) : (
              filtered.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
            )}
          </div>
        </main>
      </div>
    </>
  );
}