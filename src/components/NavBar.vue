<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="app-container d-flex justify-content-between w-100">
      <router-link class="navbar-brand" to="/">ASPNETCRUD</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link class="nav-link" to="/dashboard" active-class="active">Dashboard</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <template v-if="!authStore.isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link" to="/login" active-class="active">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register" active-class="active">Register</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span v-if="authStore.user">{{ authStore.user.name }}</span>
                <span v-else>Account</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <button class="dropdown-item" @click="logout">Logout</button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'NavBar',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.logout();
      router.push('/login');
    };

    return {
      authStore,
      logout,
    };
  },
});
</script> 