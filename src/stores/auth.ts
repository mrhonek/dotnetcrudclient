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
        console.log('Full error object:', error);
        console.log('Response data:', error.response?.data);
        
        const apiError = error.response?.data;
        
        // Handle detailed validation errors in the specific format returned by ASP.NET Core
        if (error.response?.status === 400 && apiError?.errors) {
          // Check if errors is an object with validation fields as keys
          if (typeof apiError.errors === 'object' && !Array.isArray(apiError.errors)) {
            // Convert the object of arrays into a flat array of error messages
            const errorMessages = Object.entries(apiError.errors)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return messages.map(msg => `${field}: ${msg}`);
                }
                return `${field}: ${messages}`;
              })
              .flat()
              .join(', ');
            return errorMessages;
          }
          
          // Handle the array format
          if (Array.isArray(apiError.errors)) {
            return apiError.errors.join(', ');
          }
          
          // Handle string format
          if (typeof apiError.errors === 'string') {
            return apiError.errors;
          }
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
        if (apiError?.message || apiError?.title) {
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
        
        // Create username from email (before @ symbol) with timestamp for uniqueness
        const emailBase = email.trim().toLowerCase().split('@')[0];
        const timestamp = new Date().getTime();
        const username = `${emailBase}${timestamp}`;
        
        // Create the request payload
        const requestPayload = {
          username,
          email: email.trim().toLowerCase(),
          password,
          confirmPassword: password, // Backend requires this field
          firstName: firstName.trim(),
          lastName: lastName.trim()
        };
        
        console.log('Sending registration data:', requestPayload);
        
        // Log the exact URL being requested
        const requestUrl = `${apiBaseUrl}/api/Auth/register`;
        console.log('Request URL:', requestUrl);
        
        try {
          // Set up axios with debugging
          console.log('Starting API request...');
          
          // Make the request with more debugging
          const response = await axios.post(requestUrl, requestPayload, {
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('API request successful, response:', response);

          const { token, user } = response.data;
          
          this.token = token;
          this.user = user;
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Configure axios defaults for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return true;
        } catch (apiError) {
          // Log detailed error information
          if (axios.isAxiosError(apiError) && apiError.response) {
            console.error('Registration error details:', {
              status: apiError.response.status,
              statusText: apiError.response.statusText,
              data: apiError.response.data
            });
          }
          throw apiError; // Re-throw for the outer catch
        }

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
        
        // Use the full email as the username - the backend will handle both
        const loginPayload = {
          username: email.trim(),
          password
        };
        
        console.log('Sending login data:', {
          username: loginPayload.username,
          password: '[REDACTED]'
        });
        
        const response = await axios.post(`${apiBaseUrl}/api/Auth/login`, loginPayload, {
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