import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://dotnetcrud-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
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
  register: (name: string, email: string, password: string) => {
    const registerData = {
      username: name.toLowerCase().replace(/\s+/g, ''), // Convert spaces to nothing and lowercase
      email,
      password,
      confirmPassword: password,
      firstName: name.split(' ')[0] || name, // Take first part of name or full name if no space
      lastName: name.split(' ').slice(1).join(' ') || '' // Take rest of name or empty string
    };
    
    console.log('Registering user:', { ...registerData, password: '[REDACTED]' });
    return apiClient.post('/api/auth/register', registerData);
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