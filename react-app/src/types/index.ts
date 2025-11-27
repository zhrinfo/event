// Interfaces TypeScript pour correspondre aux modèles backend

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  location: string;
  category: string;
  startDateTime: string; // ISO string
  capacity: number;
  seatsAvailable: number;
  creator?: User;
}

// Type pour compatibilité avec Events.tsx existant
export interface EventItem extends Event {
  date: string; // Alias pour startDateTime
}

export interface Reservation {
  id?: number;
  eventId: number;
  userId: number;
  reservationDate?: string;
  status?: string;
  paid?: boolean;
  event?: Event;
  user?: User;
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

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  token: string;
  email: string;
  role: string;
}

// Types pour les filtres de recherche
export interface EventFilters {
  category?: string;
  location?: string;
  from?: string;
  to?: string;
}
