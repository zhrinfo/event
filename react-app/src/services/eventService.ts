import api from './api';

export interface Event {
  id?: number;
  title: string;
  description: string;
  category: string;
  location: string;
  dateTime: string; // ISO format
  price: number;
  totalSeats: number;
  availableSeats?: number;
  organizerId?: number;
}

export interface EventSearchParams {
  category?: string;
  location?: string;
  from?: string; // ISO format
  to?: string; // ISO format
}

// Créer un événement (nécessite authentification)
export const createEvent = (event: Event) => 
  api.post<Event>('/events', event);

// Mettre à jour un événement
export const updateEvent = (id: number, event: Event) => 
  api.put<Event>(`/events/${id}`, event);

// Supprimer un événement
export const deleteEvent = (id: number) => 
  api.delete<void>(`/events/${id}`);

// Récupérer un événement par ID
export const getEvent = (id: number) => 
  api.get<Event>(`/events/${id}`);

// Rechercher des événements avec filtres
export const searchEvents = (params?: EventSearchParams) => 
  api.get<Event[]>('/events', { params });

// Récupérer tous les événements (sans filtres)
export const getAllEvents = () => 
  api.get<Event[]>('/events');
