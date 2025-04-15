import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dotnetcrud-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to attach the JWT token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', { 
      url: config.url, 
      method: config.method, 
      data: config.data 
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', { 
      status: response.status, 
      data: response.data 
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authApi = {
  login: (email: string, password: string) => {
    return apiClient.post('/api/auth/login', { email, password });
  },
  register: async (name: string, email: string, password: string) => {
    // Split name into parts, handling potential empty parts
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName; // Use firstName as lastName if no lastName provided
    
    // Generate username: firstname + first letter of lastname (if exists) + random number for uniqueness
    const username = (firstName + (lastName ? lastName[0] : '') + Math.floor(Math.random() * 1000)).toLowerCase();
    
    const registerData = {
      username,
      email: email.trim().toLowerCase(),
      password,
      confirmPassword: password,
      firstName,
      lastName
    };
    
    console.log('Registration data prepared:', {
      ...registerData,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]'
    });

    try {
      const response = await apiClient.post('/api/Auth/register', registerData);
      console.log('Registration successful:', {
        status: response.status,
        data: response.data
      });
      return response;
    } catch (error: any) {
      console.error('Registration failed:', {
        status: error.response?.status,
        error: error.response?.data?.message || error.message,
        validationErrors: error.response?.data?.errors
      });
      
      // Enhanced error handling
      if (error.response?.status === 409) {
        throw new Error('Email or username already exists');
      } else if (error.response?.status === 400) {
        const validationErrors = error.response.data.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          throw new Error(validationErrors.join(', '));
        } else if (validationErrors && typeof validationErrors === 'object') {
          throw new Error(Object.values(validationErrors).flat().join(', '));
        } else if (error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.response?.status === 405) {
        throw new Error('Registration method not allowed. Please contact support.');
      }
      
      throw error;
    }
  }
};

// Products API calls
export const productsApi = {
  getAll: () => {
    return apiClient.get('/api/products');
  },
  getById: (id: number) => {
    return apiClient.get(`/api/products/${id}`);
  },
  getByCategory: (categoryId: number) => {
    return apiClient.get(`/api/products/category/${categoryId}`);
  },
  create: (product: any) => {
    return apiClient.post('/api/products', product);
  },
  update: (id: number, product: any) => {
    return apiClient.put(`/api/products/${id}`, product);
  },
  delete: (id: number) => {
    return apiClient.delete(`/api/products/${id}`);
  }
};

// Categories API calls
export const categoriesApi = {
  getAll: () => {
    return apiClient.get('/api/categories');
  },
  getById: (id: number) => {
    return apiClient.get(`/api/categories/${id}`);
  },
  create: (category: any) => {
    return apiClient.post('/api/categories', category);
  },
  update: (id: number, category: any) => {
    return apiClient.put(`/api/categories/${id}`, category);
  },
  delete: (id: number) => {
    return apiClient.delete(`/api/categories/${id}`);
  }
};

export default apiClient; 