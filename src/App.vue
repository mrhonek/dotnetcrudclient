<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { onMounted } from 'vue'

// Initialize bootstrap javascript components
onMounted(() => {
  import('bootstrap/dist/js/bootstrap.bundle.min.js')
})
</script>

<template>
  <header>
    <NavBar />
  </header>

  <main class="app-container">
    <RouterView />
  </main>
</template>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

main {
  min-height: calc(100vh - 56px);
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>
