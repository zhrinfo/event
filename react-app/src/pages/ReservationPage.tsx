import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { Event } from '../types';
import { reserveEvent } from '../services/reservationService';

const ReservationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vous devez être connecté pour réserver un événement');
        }

        const response = await fetch(`http://localhost:8090/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Événement non trouvé');
        }

        const eventData = await response.json();
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleReserve = async () => {
    if (!event) return;

    setReserving(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour réserver');
      }

      console.log('Token trouvé:', token ? 'Oui' : 'Non');
      console.log('Token complet:', token);
      console.log('Tentative de réservation pour l\'événement:', eventId);

      const reservation = await reserveEvent(Number(eventId));
      setSuccess(true);
      
      // Rediriger vers la page de paiement après 2 secondes
      setTimeout(() => {
        navigate(`/payment/${reservation.data.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Erreur de réservation:', err);
      if (err.response?.status === 403) {
        setError('Accès refusé. Vous n\'avez pas les permissions nécessaires pour réserver cet événement.');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
      }
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</div>
          <button 
            onClick={() => navigate('/events')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <Navbar />
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0',
            marginBottom: '1rem'
          }}>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Réservation réussie!</h2>
            <p>Redirection vers la page de paiement...</p>
          </div>
        </div>
      </div>
    );
  }

  const isFullyBooked = event.seatsAvailable === 0;

  return (
    <div>
      <Navbar />
      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '1rem',
        boxShadow: '0 12px 28px rgba(2,6,23,0.08)',
        backdropFilter: 'blur(6px)'
      }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', color: '#1f2937' }}>
            Réserver l'événement
          </h1>

          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#374151' }}>{event.title}</h2>
            
            <div style={{ display: 'grid', gap: '0.75rem', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📅</span>
                <span>{new Date(event.startDateTime).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🕒</span>
                <span>{new Date(event.startDateTime).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📍</span>
                <span>{event.location}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🏷️</span>
                <span>{event.category}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👥</span>
                <span>{event.seatsAvailable} places disponibles sur {event.capacity}</span>
              </div>
            </div>

            {event.description && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6 }}>
                  {event.description}
                </p>
              </div>
            )}
          </div>

          {isFullyBooked ? (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #fecaca',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Complet</h3>
              <p style={{ margin: 0 }}>Cet événement est complet. Il n'y a plus de places disponibles.</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleReserve}
                disabled={reserving}
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: reserving ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: reserving ? 'not-allowed' : 'pointer',
                  boxShadow: reserving ? 'none' : '0 6px 14px rgba(59, 130, 246, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {reserving ? 'Réservation en cours...' : 'Confirmer la réservation'}
              </button>
              
              <p style={{ 
                margin: '1rem 0 0 0', 
                fontSize: '0.875rem', 
                color: '#6b7280' 
              }}>
                Un paiement sera requis pour finaliser votre réservation
              </p>
            </div>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/events')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Annuler et retourner aux événements
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
