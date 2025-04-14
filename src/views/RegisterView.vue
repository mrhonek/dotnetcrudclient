<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Register</h2>
      <form @submit.prevent="register" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': nameError }"
            id="name"
            v-model="name"
            required
            autocomplete="name"
          />
          <div class="invalid-feedback" v-if="nameError">
            {{ nameError }}
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

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);

// Clear any existing errors when component mounts
authStore.clearError();

const nameError = computed(() => {
  if (!name.value) return 'Name is required';
  if (name.value.length < 2) return 'Name must be at least 2 characters long';
  if (name.value.length > 50) return 'Name must be less than 50 characters';
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
  return !nameError.value && !emailError.value && 
         !passwordError.value && !confirmPasswordError.value &&
         name.value.length > 0 && email.value.length > 0 &&
         password.value.length > 0 && confirmPassword.value.length > 0;
});

async function register() {
  if (!isFormValid.value) return;
  
  try {
    isSubmitting.value = true;
    const success = await authStore.register(name.value.trim(), email.value.toLowerCase().trim(), password.value);
    
    if (success) {
      router.push('/todos');
    }
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