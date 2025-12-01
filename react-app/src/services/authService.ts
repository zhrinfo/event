import axios from "axios";
const APP_URL = "http://localhost:8090/api/auth";

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  token: string;
  email: string;
  role: string;
  roles?: string[]; // Pour gérer plusieurs rôles
}

export const register = (data: RegisterData) => 
  axios.post(`${APP_URL}/register`, data);

export const login = (data: LoginData) => 
  axios.post(`${APP_URL}/login`, data);

export const forgotPassword = (data: { email: string }) => 
  axios.post(`${APP_URL}/forgot-password`, data);

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Fonction pour récupérer les rôles de l'utilisateur
export const getUserRoles = (): string[] => {
  const roles = localStorage.getItem('roles');
  return roles ? JSON.parse(roles) : [];
};

// Fonction pour récupérer le rôle principal (pour compatibilité)
export const getUserRole = (): string | null => {
  const roles = getUserRoles();
  return roles.length > 0 ? roles[0] : null;
};

// Fonction pour vérifier si l'utilisateur a un rôle spécifique
export const hasRole = (role: string): boolean => {
  return getUserRoles().includes(role);
};

// Fonction pour vérifier si l'utilisateur est admin
export const isAdmin = (): boolean => {
  return hasRole('ROLE_ADMIN');
};

// Fonction pour vérifier si l'utilisateur est un utilisateur normal
export const isUser = (): boolean => {
  return hasRole('ROLE_USER');
};

// Fonction pour définir les rôles après connexion
export const setUserRoles = (roles: string[]): void => {
  localStorage.setItem('roles', JSON.stringify(roles));
  // Garder le premier rôle pour compatibilité
  if (roles.length > 0) {
    localStorage.setItem('role', roles[0]);
  }
};

// Fonction pour se déconnecter
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  localStorage.removeItem('role');
  localStorage.removeItem('roles');
};

