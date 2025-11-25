import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { User, Reservation } from '../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('email');
        
        if (!token || !userEmail) {
          throw new Error('Vous devez être connecté pour voir votre profil');
        }

        // Fetch user info
        const userResponse = await fetch(`http://localhost:8090/api/users/email/${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) {
          throw new Error('Utilisateur non trouvé');
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user reservations
        const reservationsResponse = await fetch(`http://localhost:8090/api/reservations/user/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json();
          setReservations(reservationsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
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

  if (error || !user) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</div>
          <button 
            onClick={() => navigate('/login')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const upcomingReservations = reservations.filter(r => r.event && isUpcoming(r.event.startDateTime));
  const pastReservations = reservations.filter(r => r.event && !isUpcoming(r.event.startDateTime));

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* User Info Section */}
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '1rem',
          boxShadow: '0 12px 28px rgba(2,6,23,0.08)',
          backdropFilter: 'blur(6px)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1f2937' }}>
                Mon Profil
              </h1>
              <div style={{ display: 'grid', gap: '0.5rem', color: '#6b7280' }}>
                <div style={{ fontSize: '1.1rem', color: '#374151' }}>
                  📧 {user.email}
                </div>
                <div>
                  🏷️ Rôle: <span style={{ 
                    backgroundColor: '#dbeafe', 
                    color: '#1e40af', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem'
                  }}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(2,6,23,0.08)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {reservations.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Total des réservations
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(2,6,23,0.08)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem' }}>
              {upcomingReservations.length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Événements à venir
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(2,6,23,0.08)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {reservations.filter(r => r.paid).length}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Réservations payées
            </div>
          </div>
        </div>

        {/* Upcoming Reservations */}
        {upcomingReservations.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '1rem',
            boxShadow: '0 12px 28px rgba(2,6,23,0.08)',
            backdropFilter: 'blur(6px)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '1.5rem' }}>
              📅 Événements à venir
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {upcomingReservations.map(reservation => (
                <div key={reservation.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb'
                }}>
                  {reservation.event && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.1rem' }}>
                            {reservation.event.title}
                          </h3>
                          <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            <div>📅 {formatDate(reservation.event.startDateTime)}</div>
                            <div>📍 {reservation.event.location}</div>
                            <div>🏷️ {reservation.event.category}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: reservation.paid ? '#dcfce7' : '#fef3c7',
                            color: reservation.paid ? '#166534' : '#92400e'
                          }}>
                            {reservation.paid ? '✅ Payé' : '⏳ En attente de paiement'}
                          </span>
                        </div>
                      </div>
                      
                      {!reservation.paid && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button
                            onClick={() => navigate(`/payment/${reservation.id}`)}
                            style={{
                              padding: '0.5rem 1rem',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Payer maintenant
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Reservations */}
        {pastReservations.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '1rem',
            boxShadow: '0 12px 28px rgba(2,6,23,0.08)',
            backdropFilter: 'blur(6px)',
            padding: '2rem'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#1f2937', fontSize: '1.5rem' }}>
              📚 Historique des réservations
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pastReservations.map(reservation => (
                <div key={reservation.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  opacity: 0.8
                }}>
                  {reservation.event && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '1rem' }}>
                            {reservation.event.title}
                          </h3>
                          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                            {formatDate(reservation.event.startDateTime)}
                          </div>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280'
                        }}>
                          Terminé
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {reservations.length === 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '1rem',
            boxShadow: '0 12px 28px rgba(2,6,23,0.08)',
            backdropFilter: 'blur(6px)',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>
              Aucune réservation
            </h2>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280' }}>
              Vous n'avez pas encore réservé d'événements.
            </p>
            <button
              onClick={() => navigate('/events')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Découvrir les événements
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
