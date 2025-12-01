import axios from 'axios';

// Instance Axios configurée avec le baseURL et les intercepteurs
const api = axios.create({
  baseURL: '/api', // Retour au proxy Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si 401 (non autorisé), rediriger vers la page de login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      localStorage.removeItem('roles');
      window.location.href = '/login';
    }
    // Si 403 (interdit), afficher un message d'erreur
    if (error.response?.status === 403) {
      console.error('Accès refusé - Vérifiez vos permissions');
      // Optionnel: rediriger vers une page d'erreur
    }
    return Promise.reject(error);
  }
);

export default api;
