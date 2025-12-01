import api from './api';

export interface Reservation {
  id?: number;
  eventId: number;
  userId: number;
  reservationDate?: string;
  status?: string;
  paid?: boolean;
}

export interface PaymentRequest {
  amount?: number;
  currency?: string;
}

export interface PaymentIntent {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentConfirmation {
  reservationId: number;
  paymentIntentId: string;
  status: string;
  message: string;
}

// Créer une réservation pour un événement
export const reserveEvent = (eventId: number) => 
  api.post<Reservation>(`/reservations/event/${eventId}`);

// Initier le paiement d'une réservation
export const initiatePayment = (reservationId: number, paymentRequest?: PaymentRequest) => 
  api.post<PaymentIntent>(`/reservations/${reservationId}/pay`, paymentRequest);

// Confirmer le paiement
export const confirmPayment = (reservationId: number, paymentIntentId: string) => 
  api.get<PaymentConfirmation>(`/reservations/${reservationId}/confirm`, {
    params: { paymentIntentId }
  });
