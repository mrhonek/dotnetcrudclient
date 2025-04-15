import { defineStore } from 'pinia';
import axios from 'axios';

interface AuthState {
  token: string | null;
  user: any | null;
  error: string | null;
  isLoading: boolean;
}

interface ApiError {
  status: number;
  data: {
    message?: string;
    errors?: string[];
    title?: string;
  };
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    error: null,
    isLoading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    clearError() {
      this.error = null;
    },

    handleApiError(error: any): string {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError['data'];
        
        // Handle validation errors
        if (error.response?.status === 400 && apiError.errors) {
          return Array.isArray(apiError.errors) 
            ? apiError.errors.join(', ')
            : Object.values(apiError.errors).flat().join(', ');
        }

        // Handle conflict errors (e.g., email already exists)
        if (error.response?.status === 409) {
          return apiError.message || 'A user with this email already exists';
        }

        // Handle unauthorized errors
        if (error.response?.status === 401) {
          return 'Invalid credentials';
        }

        // Handle other API errors with messages
        if (apiError.message || apiError.title) {
          return apiError.message || apiError.title || 'An error occurred';
        }

        // Handle network errors
        if (error.message === 'Network Error') {
          return 'Unable to connect to the server. Please check your internet connection.';
        }

        return error.message || 'An unexpected error occurred';
      }

      return 'An unexpected error occurred';
    },

    async register(firstName: string, lastName: string, email: string, password: string) {
      try {
        this.isLoading = true;
        this.error = null;
        
        // Add fallback and debugging for API URL
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://dotnetcrud-production.up.railway.app';
        console.log('Using API base URL:', apiBaseUrl);
        
        // Create username from email (before @ symbol)
        const username = email.trim().toLowerCase().split('@')[0];
        
        console.log('Sending registration data:', {
          username,
          email: email.trim().toLowerCase(),
          password,
          confirmPassword: password, // Backend requires this field
          firstName: firstName.trim(),
          lastName: lastName.trim()
        });
        
        const response = await axios.post(`${apiBaseUrl}/api/Auth/register`, {
          username,
          email: email.trim().toLowerCase(),
          password,
          confirmPassword: password, // Backend requires this field
          firstName: firstName.trim(),
          lastName: lastName.trim()
        }, {
          timeout: 10000 // 10 second timeout
        });

        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configure axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      } catch (error) {
        this.error = this.handleApiError(error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async login(email: string, password: string) {
      try {
        this.isLoading = true;
        this.error = null;
        
        // Add fallback and debugging for API URL
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://dotnetcrud-production.up.railway.app';
        console.log('Using API base URL:', apiBaseUrl);
        
        // Create username from email or use email as username
        const username = email.trim().includes('@') ? email.trim().toLowerCase().split('@')[0] : email.trim().toLowerCase();
        
        console.log('Sending login data:', {
          username,
          password
        });
        
        const response = await axios.post(`${apiBaseUrl}/api/Auth/login`, {
          username,
          password
        }, {
          timeout: 10000 // 10 second timeout
        });

        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configure axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      } catch (error) {
        this.error = this.handleApiError(error);
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
}); 