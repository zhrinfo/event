import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Styles centralisés
const styles = {
  page: {
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#0f172a",
    minHeight: "100vh",
  } as React.CSSProperties,
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "32px 16px",
  } as React.CSSProperties,
  card: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 12px 28px rgba(2,6,23,0.08)",
    backdropFilter: "blur(6px)",
  } as React.CSSProperties,
  title: {
    fontSize: 28,
    marginBottom: 18,
    letterSpacing: 0.2,
  } as React.CSSProperties,
  label: {
    display: "grid",
    gap: 6,
  } as React.CSSProperties,
  input: {
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    background: "#fff",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  } as React.CSSProperties,
  textarea: {
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    background: "#fff",
    outline: "none",
    resize: "vertical",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  } as React.CSSProperties,
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  } as React.CSSProperties,
  buttonRow: {
    display: "flex",
    gap: 10,
    marginTop: 12,
  } as React.CSSProperties,
  primaryBtn: {
    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(37,99,235,0.25)",
  } as React.CSSProperties,
  secondaryBtn: {
    background: "#eef2f6",
    color: "#0f172a",
    border: "1px solid #e2e8f0",
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
  } as React.CSSProperties,
};

type EventForm = {
  title: string;
  startDateTime: string;
  location: string;
  description: string;
  maxParticipants: number;
};

const initialForm: EventForm = {
  title: "",
  startDateTime: "",
  location: "",
  description: "",
  maxParticipants: 0,
};

const AjouteEvent: React.FC = () => {
  const [form, setForm] = useState<EventForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const prevBackground = document.body.style.background;
    document.body.style.background =
      "linear-gradient(135deg, #ffffff 0%, #1708f19e 100%)";
    return () => {
      document.body.style.background = prevBackground;
    };
  }, []);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    
    try {
      const eventData = {
        ...form,
        startDateTime: form.startDateTime,
      };

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour créer un événement');
      }

      const response = await fetch('http://localhost:8090/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de l\'événement');
      }

      const result = await response.json();
      console.log('Événement créé:', result);
      setMessage("Événement ajouté avec succès!");
      setForm(initialForm);
    } catch (err) {
      console.error('Erreur:', err);
      setMessage(err instanceof Error ? err.message : "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>Ajouter un événement</h1>

          {message && (
            <div
              role="status"
              style={{
                marginBottom: 16,
                padding: "10px 12px",
                background: "#ecfeff",
                color: "#155e75",
                border: "1px solid #a5f3fc",
                borderRadius: 6,
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            <label style={styles.label}>
              <span>Titre</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Titre de l'événement"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span>Date et heure de l'événement</span>
              <input
                type="datetime-local"
                name="startDateTime"
                value={form.startDateTime}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span>Lieu</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Lieu"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description de l'événement"
                rows={4}
                style={styles.textarea}
              />
            </label>

            <label style={styles.label}>
              <span>Nombre maximum de participants</span>
              <input
                type="number"
                name="maxParticipants"
                min="1"
                value={form.maxParticipants}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </label>

            <div style={styles.buttonRow}>
              <button
                type="submit"
                disabled={submitting}
                style={styles.primaryBtn}
              >
                {submitting ? "Ajout..." : "Ajouter l'événement"}
              </button>
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                disabled={submitting}
                style={styles.secondaryBtn}
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AjouteEvent;
