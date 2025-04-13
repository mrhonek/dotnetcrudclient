<template>
  <div class="register-container">
    <div class="card">
      <div class="card-header text-center">
        <h3>Register</h3>
      </div>
      <div class="card-body">
        <div v-if="authStore.error" class="alert alert-danger">
          {{ authStore.error }}
        </div>
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="name" class="form-label">Full Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
            />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              required
              minlength="6"
            />
            <small class="text-muted">Password must be at least 6 characters</small>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
              required
            />
            <div v-if="passwordError" class="text-danger mt-1">
              {{ passwordError }}
            </div>
          </div>
          <div class="d-grid gap-2">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="authStore.loading || !!passwordError"
            >
              <span v-if="authStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Register
            </button>
          </div>
        </form>
        <div class="mt-3 text-center">
          <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const passwordError = computed(() => {
      if (confirmPassword.value && password.value !== confirmPassword.value) {
        return 'Passwords do not match';
      }
      return '';
    });

    const register = async () => {
      if (passwordError.value) {
        return;
      }
      
      if (await authStore.register(name.value, email.value, password.value)) {
        router.push('/dashboard');
      }
    };

    return {
      name,
      email,
      password,
      confirmPassword,
      passwordError,
      authStore,
      register,
    };
  },
});
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  padding: 20px;
}
</style> 