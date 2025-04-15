<template>
  <div>
    <div class="jumbotron text-center my-4">
      <h1 class="display-4">Welcome to ASPNETCRUD</h1>
      <p class="lead">
        A clean architecture CRUD application built with ASP.NET Core and Vue.js
      </p>
      <hr class="my-4">
      <p>
        This demo showcases a RESTful API with JWT authentication, Entity Framework Core, and a modern Vue.js frontend.
      </p>
      <div class="d-flex justify-content-center gap-2 mt-4">
        <router-link to="/login" class="btn btn-primary btn-lg">Login</router-link>
        <router-link to="/register" class="btn btn-outline-primary btn-lg">Register</router-link>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Clean Architecture</h5>
            <p class="card-text">
              Built with a layered architecture separating concerns and making the codebase maintainable and testable.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">JWT Authentication</h5>
            <p class="card-text">
              Secure your API with JSON Web Tokens for stateless authentication and authorization.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Vue.js Frontend</h5>
            <p class="card-text">
              Modern, responsive UI built with Vue 3, Typescript, and Pinia for state management.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-lg-6 col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Features</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">User registration and authentication</li>
              <li class="list-group-item">Product management</li>
              <li class="list-group-item">Category management</li>
              <li class="list-group-item">Role-based authorization</li>
              <li class="list-group-item">RESTful API with proper error handling</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Technologies</h5>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">ASP.NET Core 9</li>
              <li class="list-group-item">Entity Framework Core with PostgreSQL</li>
              <li class="list-group-item">Vue.js 3 with Composition API</li>
              <li class="list-group-item">TypeScript</li>
              <li class="list-group-item">Pinia for State Management</li>
              <li class="list-group-item">Bootstrap 5 for UI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView'
});
</script>

<style scoped>
.jumbotron {
  padding: 3rem;
  margin-bottom: 2rem;
  background-color: #f8f9fa;
  border-radius: 0.3rem;
  text-align: center;
}

.card {
  transition: transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  height: 100%;
  margin-bottom: 20px;
}

.card-body {
  padding: 1.5rem;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-title {
  color: #007bff;
  font-weight: 600;
  margin-bottom: 1rem;
  white-space: nowrap;
}

.list-group-item {
  padding: 0.75rem 1.25rem;
}

@media (max-width: 768px) {
  .jumbotron {
    padding: 2rem 1rem;
  }
  
  .card-title {
    white-space: normal;
  }
}
</style> 