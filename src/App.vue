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
  <div class="app-wrapper">
    <header>
      <NavBar />
    </header>

    <main>
      <div class="app-container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
}

.app-container {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 30px;
  box-sizing: border-box;
}

/* Add responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .app-container {
    padding: 0 15px;
  }
}
</style>
