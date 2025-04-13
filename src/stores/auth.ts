import { defineStore } from 'pinia';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  }),

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.login(email, password);
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        localStorage.setItem('token', token);
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to login';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await authApi.register(name, email, password);
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        localStorage.setItem('token', token);
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to register';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  },
}); 