<template>
  <div class="login-container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow">
          <div class="card-body p-4 p-lg-5">
            <h2 class="text-center mb-4">Login</h2>
            <form @submit.prevent="login" class="needs-validation" novalidate>
              <div class="mb-4">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control form-control-lg"
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

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control form-control-lg"
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

              <div v-if="authStore.error" class="alert alert-danger my-3" role="alert">
                {{ authStore.error }}
              </div>

              <button 
                type="submit" 
                class="btn btn-primary btn-lg w-100 py-2 mt-3" 
                :disabled="isSubmitting || !isFormValid"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isSubmitting ? 'Logging in...' : 'Login' }}
              </button>

              <div class="mt-4 text-center">
                <router-link to="/register">Don't have an account? Register here</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
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
  min-height: calc(100vh - 120px);
}

h2 {
  color: #333;
  font-size: 1.8rem;
}

.form-control-lg {
  font-size: 1rem;
  padding: 0.75rem 1rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
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