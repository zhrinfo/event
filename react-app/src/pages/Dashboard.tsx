import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './dashboard.css';


// Types pour les événements
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  organizer: string;
  attendees: number;
  status: 'confirmé' | 'en attente' | 'annulé';
  category: string;
}

// Données statiques pour les événements
const events: Event[] = [
  {
    id: 1,
    title: 'Réunion Direction',
    description: 'Réunion trimestrielle du comité de direction',
    date: '2025-11-10',
    startTime: '09:00',
    endTime: '11:00',
    room: 'Salle de Conférence B',
    organizer: 'Marie Dubois',
    attendees: 15,
    status: 'confirmé',
    category: 'réunion'
  },
  {
    id: 2,
    title: 'Formation React',
    description: 'Session de formation sur React et TypeScript',
    date: '2025-11-11',
    startTime: '14:00',
    endTime: '17:00',
    room: 'Salle de Formation',
    organizer: 'Pierre Martin',
    attendees: 12,
    status: 'confirmé',
    category: 'formation'
  },
  {
    id: 3,
    title: 'Team Building',
    description: 'Activité de cohésion d\'équipe',
    date: '2025-11-12',
    startTime: '16:00',
    endTime: '18:00',
    room: 'Espace Open Space',
    organizer: 'Sophie Lambert',
    attendees: 25,
    status: 'en attente',
    category: 'social'
  },
  {
    id: 4,
    title: 'Présentation Client',
    description: 'Présentation du nouveau produit',
    date: '2025-11-13',
    startTime: '10:00',
    endTime: '12:00',
    room: 'Salle de Réunion A',
    organizer: 'Thomas Bernard',
    attendees: 8,
    status: 'confirmé',
    category: 'présentation'
  }
];

// Données pour les salles


const Dashboard: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filter, setFilter] = useState<string>('tous');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const userEmail = localStorage.getItem('email');

  // Calcul des statistiques
  const totalEvents = events.length;
  const confirmedEvents = events.filter(event => event.status === 'confirmé').length;
  const pendingEvents = events.filter(event => event.status === 'en attente').length;
  const todayEvents = events.filter(event => event.date === new Date().toISOString().split('T')[0]).length;

  // Événements filtrés
  const filteredEvents = filter === 'tous' 
    ? events 
    : events.filter(event => event.status === filter);

  // Prochains événements (triés par date)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="dashboard">
      <Navbar />
      
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard Événements</h1>
        {userEmail && (
         <p
  style={{
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#111827',
    padding: '12px 18px',
    borderRadius: 9999,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  }}
>
  <span>Bonjour</span>
  <strong style={{ fontWeight: 600 }}>{userEmail}</strong>
</p>
        )}
        
        {/* Cartes de statistiques */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2 className="card-title">Événements</h2>
            <div className="card-content">
              <div className="stat-number">{totalEvents}</div>
              <div className="stat-label">Total des événements</div>
              <div className="stat-subtext">
                <span className="confirmed">{confirmedEvents} confirmés</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">Aujourd'hui</h2>
            <div className="card-content">
              <div className="stat-number">{todayEvents}</div>
              <div className="stat-label">Événements programmés</div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2 className="card-title">En Attente</h2>
            <div className="card-content">
              <div className="stat-number">{pendingEvents}</div>
              <div className="stat-label">Réservations en attente</div>
            </div>
          </div>

      
        </div>

        <div className="dashboard-main">
          <section className="events-section" aria-labelledby="events-heading">
            <div className="section-header">
              <h2 id="events-heading" className="section-title">Prochains Événements</h2>
              <div className="view-controls" role="group" aria-label="Changer la vue">
                <button
                  type="button"
                  className={`view-button ${view === 'list' ? 'active' : ''}`}
                  aria-pressed={view === 'list'}
                  onClick={() => setView('list')}
                >📋 Liste</button>
                <button
                  type="button"
                  className={`view-button ${view === 'calendar' ? 'active' : ''}`}
                  aria-pressed={view === 'calendar'}
                  onClick={() => setView('calendar')}
                >🗓️ Calendrier</button>
              </div>
            </div>
            <div className="filters" role="group" aria-label="Filtrer par statut">
              <button
                type="button"
                className={`filter-button ${filter === 'tous' ? 'active' : ''}`}
                aria-pressed={filter === 'tous'}
                onClick={() => setFilter('tous')}
              >Tous ({events.length})</button>
              <button
                type="button"
                className={`filter-button ${filter === 'confirmé' ? 'active' : ''}`}
                aria-pressed={filter === 'confirmé'}
                onClick={() => setFilter('confirmé')}
              >Confirmés ({confirmedEvents})</button>
              <button
                type="button"
                className={`filter-button ${filter === 'en attente' ? 'active' : ''}`}
                aria-pressed={filter === 'en attente'}
                onClick={() => setFilter('en attente')}
              >En attente ({pendingEvents})</button>
            </div>

            {/* Vue liste */}
            {view === 'list' && (
              <div className="events-grid">
                {filteredEvents.map(event => (
                  <div
                    key={event.id}
                    className={`event-card status-${event.status.replace(' ', '-')}${selectedEvent?.id === event.id ? ' selected' : ''}`}
                    data-status={event.status}
                    tabIndex={0}
                    onClick={() => setSelectedEvent(event)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedEvent(event);
                      }
                    }}
                    style={{
                      padding: 16,                  // inner padding
                      borderRadius: 12,             // optional rounding improvement
                    }}
                  >
                    <div className="event-header" style={{ marginBottom: 8 }}>
                      <h3 className="event-title" style={{ margin: 0 }}>{event.title}</h3>
                      <span className={`event-status ${event.status.replace(' ', '-')}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="event-details" style={{ display: 'grid', gap: 10 }}>
                      <div className="event-info" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                        <span className="info-item">📅 {new Date(event.date).toLocaleDateString('fr-FR')}</span>
                        <span className="info-item">🕒 {event.startTime} - {event.endTime}</span>
                        <span className="info-item">📍 {event.room}</span>
                      </div>
                      
                      <div className="event-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 6 }}>
                        <span className="organizer">👤 {event.organizer}</span>
                        <span className="attendees">👥 {event.attendees} personnes</span>
                      </div>
                      
                      <p className="event-description" style={{ margin: '4px 0 8px 0', lineHeight: 1.5 }}>
                        {event.description}
                      </p>
                      
                      <div className="event-category" style={{ marginTop: 6 }}>
                        <span className="category-badge">{event.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Vue calendrier simplifiée */}
            {view === 'calendar' && (
              <div className="calendar-view">
                <div className="calendar-grid">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="calendar-event">
                      <div className="calendar-date">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                      <div className="calendar-content">
                        <h4>{event.title}</h4>
                        <p>{event.startTime} - {event.room}</p>
                        <span className={`status-dot ${event.status.replace(' ', '-')}`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Détails de l'événement sélectionné */}
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;