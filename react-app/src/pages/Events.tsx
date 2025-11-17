import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";

type EventItem = {
  id: string;
  title: string;
  date: string; // ISO
  description?: string;
};

const mockEvents: EventItem[] = [
  { id: "1", title: "Conférence Tech", date: new Date().toISOString(), description: "Rencontre des devs." },
  { id: "2", title: "Atelier React", date: new Date(Date.now() + 86400000).toISOString(), description: "Hooks et performance." },
];

function toInputDate(iso: string) {
  const d = new Date(iso);
  const tz = d.getTimezoneOffset();
  const local = new Date(d.getTime() - tz * 60000);
  return local.toISOString().slice(0, 10);
}

// Affichage amélioré: formatage date et statut
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
function isPast(iso: string) {
  return new Date(iso).getTime() < Date.now();
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState<EventItem | null>(null);
  const [form, setForm] = useState<{ title: string; date: string; description: string }>({
    title: "",
    date: "",
    description: "",
  });

  // Recherche + filtre + tri
  const [query, setQuery] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  // Style focus + ref pour la barre de recherche
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // TODO: remplacer par un appel API réel (GET /api/events)
    // try { const res = await fetch("/api/events"); setEvents(await res.json()); } catch { setEvents(mockEvents); }
    setEvents(mockEvents);
  }, []);

  useEffect(() => {
    const prev = {
      background: document.body.style.background,
      backgroundAttachment: document.body.style.backgroundAttachment,
      backgroundRepeat: document.body.style.backgroundRepeat,
      backgroundSize: document.body.style.backgroundSize,
      minHeight: document.body.style.minHeight,
    };
    document.body.style.background =
      "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgba(23, 8, 241, 0.62) 100%)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.minHeight = "100vh";
    return () => {
      document.body.style.background = prev.background;
      document.body.style.backgroundAttachment = prev.backgroundAttachment;
      document.body.style.backgroundRepeat = prev.backgroundRepeat;
      document.body.style.backgroundSize = prev.backgroundSize;
      document.body.style.minHeight = prev.minHeight;
    };
  }, []);

  const openEdit = (e: EventItem) => {
    setCurrent(e);
    setForm({
      title: e.title,
      date: toInputDate(e.date),
      description: e.description ?? "",
    });
    setEditing(true);
  };

  const closeEdit = () => {
    setEditing(false);
    setCurrent(null);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Supprimer cet événement ?")) return;
    // TODO: await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!current) return;
    const updated: EventItem = {
      ...current,
      title: form.title.trim(),
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
    };
    // TODO: await fetch(`/api/events/${current.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setEvents((prev) => prev.map((e) => (e.id === current.id ? updated : e)));
    closeEdit();
  };

  // Liste filtrée/triée
  const filteredEvents = useMemo(() => {
    let list = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || (e.description ?? "").toLowerCase().includes(q)
      );
    }
    if (upcomingOnly) {
      list = list.filter((e) => !isPast(e.date));
    }
    return list;
  }, [events, query, upcomingOnly]);

  const overlayStyle: React.CSSProperties = useMemo(
    () => ({
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.25)", // arrière-plan transparent
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 50,
    }),
    []
  );

  const modalStyle: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      maxWidth: 520,
      background: "rgba(255,255,255,0.9)", // léger transparent
      backdropFilter: "blur(2px)",
      borderRadius: 8,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      padding: 16,
    }),
    []
  );

  const buttonStyle: React.CSSProperties = { padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer" };

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
        {/* En-tête avec recherche et filtre */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: 0 }}>Événements</h1>
            <div style={{ fontSize: 12, color: "#555" }}>{filteredEvents.length} événement(s)</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Barre de recherche améliorée */}
            <div
              style={{
                position: "relative",
                width: "min(320px, 100%)",
              }}
            >
              {/* Icône */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  opacity: 0.65,
                }}
              >
                <path d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              <input
                ref={searchRef}
                aria-label="Rechercher les événements"
                placeholder="Rechercher..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  padding: "10px 38px 10px 38px",
                  borderRadius: 999,
                  border: `1px solid ${searchFocused ? "#6366f1" : "#e5e7eb"}`,
                  outline: "none",
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: searchFocused
                    ? "0 0 0 3px rgba(99,102,241,0.25)"
                    : "0 1px 2px rgba(0,0,0,0.06)",
                  transition: "box-shadow 150ms ease, border-color 150ms ease, background 150ms ease",
                  width: "100%",
                }}
              />

              {/* Bouton effacer */}
              {query && (
                <button
                  type="button"
                  title="Effacer"
                  onClick={() => {
                    setQuery("");
                    requestAnimationFrame(() => searchRef.current?.focus());
                  }}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    color: "#6b7280",
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, background: "rgba(255,255,255,0.7)", padding: "6px 10px", borderRadius: 999, border: "1px solid #e5e7eb" }}>
              <input type="checkbox" checked={upcomingOnly} onChange={(e) => setUpcomingOnly(e.target.checked)} />
              À venir seulement
            </label>
          </div>
        </div>

        {/* Grille responsive */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {filteredEvents.map((e) => {
            const past = isPast(e.date);
            const msTo = new Date(e.date).getTime() - Date.now();
            const soon = !past && msTo <= 48 * 3600 * 1000;
            const leftColor = past ? "#9ca3af" : soon ? "#16a34a" : "#2563eb";
            const badge =
              past
                ? { label: "Passé", bg: "#fee2e2", color: "#991b1b" }
                : soon
                ? { label: "Bientôt", bg: "#dcfce7", color: "#166534" }
                : { label: "À venir", bg: "#e0e7ff", color: "#3730a3" };

            return (
              <li
                key={e.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderLeft: `4px solid ${leftColor}`,
                  borderRadius: 10,
                  padding: 12,
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  opacity: past ? 0.9 : 1,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>{e.title}</div>
                  <span style={{ padding: "2px 8px", borderRadius: 999, background: badge.bg, color: badge.color, fontSize: 12, border: `1px solid ${badge.color}22` }}>
                    {badge.label}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#444" }}>
                  <span style={{ marginRight: 6 }}>📅</span>
                  {formatDateTime(e.date)}
                </div>
                {e.description ? (
                  <p style={{ margin: "2px 0 6px 0", color: "#333" }}>{e.description}</p>
                ) : null}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #c7d2fe", cursor: "pointer", background: "#eef2ff" }} onClick={() => openEdit(e)}>
                    Modifier
                  </button>
                  <button
                    style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #fecaca", cursor: "pointer", background: "#fee2e2", color: "#991b1b" }}
                    onClick={() => onDelete(e.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
          {filteredEvents.length === 0 && <li>Aucun événement.</li>}
        </ul>
      </main>

      {editing && current && (
        <div style={overlayStyle} onClick={closeEdit}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Modifier l’événement</h3>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span>Titre</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span>Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", resize: "vertical" }}
                />
              </label>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                <button type="button" style={{ ...buttonStyle }} onClick={closeEdit}>
                  Annuler
                </button>
                <button type="submit" style={{ ...buttonStyle, background: "#dcfce7", borderColor: "#bbf7d0", color: "#065f46" }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
