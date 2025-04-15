<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="register" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': firstNameError }"
            id="firstName"
            v-model="firstName"
            required
            autocomplete="given-name"
          />
          <div class="invalid-feedback" v-if="firstNameError">
            {{ firstNameError }}
          </div>
        </div>

        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': lastNameError }"
            id="lastName"
            v-model="lastName"
            required
            autocomplete="family-name"
          />
          <div class="invalid-feedback" v-if="lastNameError">
            {{ lastNameError }}
          </div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            :class="{ 'is-invalid': emailError }"
            id="email"
            v-model="email"
            required
            autocomplete="email"
          />
          <div class="invalid-feedback" v-if="emailError">
            {{ emailError }}
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': passwordError }"
            id="password"
            v-model="password"
            required
            autocomplete="new-password"
          />
          <div class="invalid-feedback" v-if="passwordError">
            {{ passwordError }}
          </div>
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            :class="{ 'is-invalid': confirmPasswordError }"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            autocomplete="new-password"
          />
          <div class="invalid-feedback" v-if="confirmPasswordError">
            {{ confirmPasswordError }}
          </div>
        </div>

        <div v-if="authStore.error" class="alert alert-danger" role="alert">
          {{ authStore.error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-100" 
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
          {{ isSubmitting ? 'Creating account...' : 'Register' }}
        </button>

        <div class="mt-3 text-center">
          <router-link to="/login">Already have an account? Login here</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);

// Clear any existing errors when component mounts
authStore.clearError();

const firstNameError = computed(() => {
  if (!firstName.value) return 'First name is required';
  if (firstName.value.length < 2) return 'First name must be at least 2 characters long';
  if (firstName.value.length > 50) return 'First name must be less than 50 characters';
  return '';
});

const lastNameError = computed(() => {
  if (!lastName.value) return 'Last name is required';
  if (lastName.value.length < 2) return 'Last name must be at least 2 characters long';
  if (lastName.value.length > 50) return 'Last name must be less than 50 characters';
  return '';
});

const emailError = computed(() => {
  if (!email.value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return 'Please enter a valid email address';
  }
  return '';
});

const passwordError = computed(() => {
  if (!password.value) return 'Password is required';
  if (password.value.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/[A-Z]/.test(password.value)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password.value)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password.value)) {
    return 'Password must contain at least one number';
  }
  if (!/[^a-zA-Z0-9]/.test(password.value)) {
    return 'Password must contain at least one special character';
  }
  return '';
});

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return 'Please confirm your password';
  if (confirmPassword.value !== password.value) {
    return 'Passwords do not match';
  }
  return '';
});

const isFormValid = computed(() => {
  return !firstNameError.value && !lastNameError.value && !emailError.value && 
         !passwordError.value && !confirmPasswordError.value &&
         firstName.value.length > 0 && lastName.value.length > 0 &&
         email.value.length > 0 && password.value.length > 0 && 
         confirmPassword.value.length > 0;
});

async function register() {
  if (!isFormValid.value) return;
  
  try {
    isSubmitting.value = true;
    
    // Combine first and last name for display/feedback
    const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`;
    
    // Create username from first name, first letter of last name + random number
    const username = (firstName.value.trim().toLowerCase() + 
                     (lastName.value ? lastName.value.trim()[0].toLowerCase() : '') + 
                     Math.floor(Math.random() * 1000));
    
    // Prepare registration data with simplified structure
    const registerData = {
      username: username,
      email: email.value.toLowerCase().trim(),
      password: password.value,
      confirmPassword: password.value,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim()
    };
    
    // Also try a modified version with fully expanded data
    console.log('Original registration data:', {
      ...registerData,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]'
    });
    
    // Try with a simpler format that strictly matches the backend model
    const simplifiedData = {
      username: "testuser" + Math.floor(Math.random() * 1000),
      email: email.value.toLowerCase().trim(),
      password: password.value,
      confirmPassword: password.value,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim()
    };
    
    console.log('Simplified registration data:', {
      ...simplifiedData,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]'
    });
    
    // Add logging of password format requirements
    const passwordChecks = {
      length: password.value.length >= 6,
      hasUppercase: /[A-Z]/.test(password.value),
      hasLowercase: /[a-z]/.test(password.value),
      hasNumber: /[0-9]/.test(password.value),
      hasSpecial: /[^a-zA-Z0-9]/.test(password.value),
      passwordsMatch: password.value === confirmPassword.value
    };
    console.log('Password requirements check:', passwordChecks);
    
    // Use direct fetch with explicit URL instead of the auth store
    const apiUrl = 'https://dotnetcrud-production.up.railway.app/api/Auth/register';
    console.log('Sending registration request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simplifiedData), // Use the simplified data instead
    });
    
    // Log raw response details
    console.log('Raw response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([...response.headers.entries()])
    });
    
    const data = await response.json();
    console.log('Registration response data:', data);
    console.log('Complete registration response:', {
      status: response.status,
      statusText: response.statusText,
      data,
      errors: data.errors || 'No specific errors returned'
    });
    
    if (!response.ok) {
      // Handle errors
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        authStore.error = data.errors.join(', ');
      } else if (data.errors && typeof data.errors === 'object') {
        authStore.error = Object.values(data.errors).flat().join(', ');
      } else if (data.message) {
        authStore.error = data.message;
      } else {
        authStore.error = 'Registration failed. Please try again.';
      }
      return false;
    }
    
    // Handle successful registration
    if (data.isSuccess && data.token) {
      // Store user info
      const user = {
        username,
        email: email.value.toLowerCase().trim(),
        name: fullName,
        token: data.token
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      authStore.token = data.token;
      authStore.user = user;
      authStore.error = null;
      
      router.push('/todos');
      return true;
    } else {
      authStore.error = 'Registration successful but no token received. Please try logging in.';
      return false;
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    authStore.error = error.message || 'An unexpected error occurred';
    return false;
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

a {
  color: #0d6efd;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style> 