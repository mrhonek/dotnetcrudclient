<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2 class="login-title">Login</h2>
      
      <div v-if="authStore.error" class="alert alert-danger" role="alert">
        {{ authStore.error }}
      </div>
      
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            :class="{ 'is-error': emailError }"
            id="email"
            v-model="email"
            required
            autocomplete="email"
            placeholder="Enter your email address"
          />
          <div class="form-error" v-if="emailError">
            {{ emailError }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            :class="{ 'is-error': passwordError }"
            id="password"
            v-model="password"
            required
            autocomplete="current-password"
            placeholder="Enter your password"
          />
          <div class="form-error" v-if="passwordError">
            {{ passwordError }}
          </div>
        </div>

        <button 
          type="submit" 
          class="login-button" 
          :disabled="isSubmitting || !isFormValid"
        >
          <span v-if="isSubmitting" class="button-spinner"></span>
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>

        <div class="register-link">
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
.login-wrapper {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-container {
  width: 100%;
  max-width: 480px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 40px;
}

.login-title {
  color: #333;
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 16px;
}

.form-group input {
  padding: 14px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a8eff;
  box-shadow: 0 0 0 3px rgba(74, 142, 255, 0.1);
}

.form-group input.is-error {
  border-color: #dc3545;
}

.form-error {
  color: #dc3545;
  font-size: 14px;
}

.alert {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.login-button {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  position: relative;
}

.login-button:hover:not(:disabled) {
  background-color: #0b5ed7;
}

.login-button:active:not(:disabled) {
  transform: translateY(1px);
}

.login-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.button-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.7s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-link {
  text-align: center;
  font-size: 15px;
}

.register-link a {
  color: #0d6efd;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .login-container {
    padding: 30px 20px;
  }
}
</style> 