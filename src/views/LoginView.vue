<template>
  <div class="login-container">
    <div class="card">
      <div class="card-header text-center">
        <h3>Login</h3>
      </div>
      <div class="card-body">
        <div v-if="authStore.error" class="alert alert-danger">
          {{ authStore.error }}
        </div>
        <form @submit.prevent="login">
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
            />
          </div>
          <div class="d-grid gap-2">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Login
            </button>
          </div>
        </form>
        <div class="mt-3 text-center">
          <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    const login = async () => {
      if (await authStore.login(email.value, password.value)) {
        router.push('/dashboard');
      }
    };

    return {
      email,
      password,
      authStore,
      login,
    };
  },
});
</script>

<style scoped>
.login-container {
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