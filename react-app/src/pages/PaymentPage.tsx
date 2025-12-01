import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { Reservation, PaymentIntent, PaymentRequest } from '../types';
import { initiatePayment, confirmPayment } from '../services/reservationService';

const PaymentPage: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState(1000); // Default 10€ in cents

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vous devez être connecté pour effectuer un paiement');
        }

        // Fetch reservation details
        const response = await fetch(`http://localhost:8090/api/reservations/${reservationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Réservation non trouvée');
        }

        const reservationData = await response.json();
        setReservation(reservationData);

        // Fetch event details to calculate amount
        if (reservationData.event) {
          const eventResponse = await fetch(`http://localhost:8090/api/events/${reservationData.event.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (eventResponse.ok) {
            const eventData = await eventResponse.json();
            // Calculate amount based on event category (mock pricing)
            const calculatedAmount = calculateEventPrice(eventData);
            setAmount(calculatedAmount);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      fetchReservation();
    }
  }, [reservationId]);

  const calculateEventPrice = (event: any): number => {
    // Mock pricing logic based on category
    switch (event.category) {
      case 'CONFERENCE':
        return 5000; // 50€
      case 'WORKSHOP':
        return 3000; // 30€
      case 'MEETUP':
        return 1000; // 10€
      default:
        return 1500; // 15€
    }
  };

  const handleInitiatePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      const paymentRequest: PaymentRequest = {
        amount,
        currency: 'eur'
      };

      const intent = await initiatePayment(Number(reservationId), paymentRequest);
      setPaymentIntent(intent.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'initialisation du paiement');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paymentIntent) return;

    setProcessing(true);
    setError(null);

    try {
      const confirmation = await confirmPayment(Number(reservationId), paymentIntent.paymentIntentId);
      
      if (confirmation.data.status === 'succeeded') {
        setSuccess(true);
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        setError('Le paiement a échoué. Veuillez réessayer.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la confirmation du paiement');
    } finally {
      setProcessing(false);
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

  if (error && !reservation) {
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
            padding: '2rem',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>Paiement réussi!</h2>
            <p>Votre réservation est maintenant confirmée.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
              Vous allez être redirigé vers votre profil...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '1rem',
        boxShadow: '0 12px 28px rgba(2,6,23,0.08)',
        backdropFilter: 'blur(6px)'
      }}>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ margin: '0 0 1.5rem 0', fontSize: '2rem', color: '#1f2937' }}>
            Payer votre réservation
          </h1>

          {reservation && reservation.event && (
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ margin: '0 0 1rem 0', color: '#374151' }}>{reservation.event.title}</h2>
              
              <div style={{ display: 'grid', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                <div>📅 {new Date(reservation.event.startDateTime).toLocaleDateString('fr-FR')}</div>
                
                <div>📍 {reservation.event.location}</div>
                <div>🏷️ {reservation.event.title}</div>
              </div>
            </div>
          )}


          {!paymentIntent ? (
            <div>
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '0.5rem' }}>
                  Montant à payer
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {reservation?.event?.prix ?? 'N/A'}€
                </div>
              </div>

              <button
                onClick={handleInitiatePayment}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: processing ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  boxShadow: processing ? 'none' : '0 6px 14px rgba(59, 130, 246, 0.25)'
                }}
              >
                {processing ? 'Initialisation...' : 'Initier le paiement'}
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '1rem',
                borderRadius: '0.375rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.875rem' }}>
                  ID de paiement: {paymentIntent.paymentIntentId}
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                  Statut: {paymentIntent.status}
                </p>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  backgroundColor: processing ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  boxShadow: processing ? 'none' : '0 6px 14px rgba(16, 185, 129, 0.25)'
                }}
              >
                {processing ? 'Traitement...' : 'Confirmer le paiement (Mock)'}
              </button>
              
              <p style={{ 
                margin: '1rem 0 0 0', 
                fontSize: '0.75rem', 
                color: '#6b7280',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Ceci est une simulation de paiement. En production, vous seriez redirigé vers un vrai prestataire de paiement.
              </p>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '1rem',
              borderRadius: '0.375rem',
              border: '1px solid #fecaca',
              marginTop: '1rem'
            }}>
              {error}
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

export default PaymentPage;
