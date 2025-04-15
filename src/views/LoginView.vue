<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Login</h2>
      <form @submit.prevent="login" class="needs-validation" novalidate>
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
            placeholder="Enter your email address"
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
            autocomplete="current-password"
            placeholder="Enter your password"
          />
          <div class="invalid-feedback" v-if="passwordError">
            {{ passwordError }}
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
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>

        <div class="mt-3 text-center">
          <router-link to="/register">Don't have an account? Register here</router-link>
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

const email = ref('');
const password = ref('');
const isSubmitting = ref(false);

// Clear any existing errors when component mounts
authStore.clearError();

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
  return '';
});

const isFormValid = computed(() => {
  return !emailError.value && !passwordError.value && 
         email.value.length > 0 && password.value.length > 0;
});

async function login() {
  if (!isFormValid.value) return;
  
  try {
    isSubmitting.value = true;
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      router.push('/dashboard');
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px); /* Account for header */
  background-color: #f8f9fa;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
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

/* Additional spacing for inputs */
.form-control {
  padding: 0.75rem;
  font-size: 1rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.alert {
  margin-bottom: 1.5rem;
}
</style> 