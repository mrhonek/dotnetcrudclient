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
      <div class="container">
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
}

/* Custom container that overrides Bootstrap */
.container {
  width: 920px !important;
  max-width: 920px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  box-sizing: border-box !important;
  position: relative !important;
  left: 12px !important; /* Shift container slightly to the right */
  /* outline: 1px solid red !important; /* Debugging outline - remove after fixing */
}

@media (max-width: 992px) {
  .container {
    width: 95% !important;
    left: 0 !important; /* No shift on smaller screens */
  }
}

@media (max-width: 768px) {
  main {
    padding: 10px 0;
  }
}
</style>
