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
      <div class="main-container">
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
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.main-container {
  width: 100%;
  max-width: 1140px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  main {
    padding: 10px 0;
  }
}
</style>
