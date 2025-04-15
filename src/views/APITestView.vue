<template>
  <div class="api-test-container">
    <h2>API Connection Test</h2>
    
    <div class="card mb-4">
      <div class="card-header">Environment Variables</div>
      <div class="card-body">
        <p><strong>VITE_API_URL:</strong> {{ apiUrl }}</p>
        <p><strong>Is Debug Enabled:</strong> {{ isDebugEnabled }}</p>
      </div>
    </div>

    <div class="mb-4">
      <button class="btn btn-primary me-2" @click="testDirectFetch" :disabled="isTesting">
        Test Direct Fetch
      </button>
      <button class="btn btn-secondary me-2" @click="testAxiosRequest" :disabled="isTesting">
        Test Axios Request
      </button>
      <button class="btn btn-info" @click="clearResults">
        Clear Results
      </button>
    </div>

    <div v-if="isTesting" class="alert alert-info">
      Testing in progress...
    </div>

    <div v-if="results.length > 0" class="results">
      <h3>Test Results</h3>
      <div v-for="(result, index) in results" :key="index" 
        :class="['alert', result.success ? 'alert-success' : 'alert-danger']">
        <h4>{{ result.title }}</h4>
        <pre>{{ JSON.stringify(result.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiUrl = ref(import.meta.env.VITE_API_URL || 'Not set');
const isDebugEnabled = ref(import.meta.env.VITE_ENABLE_DEBUG === 'true');
const isTesting = ref(false);
const results = ref<Array<{title: string, success: boolean, data: any}>>([]);

onMounted(() => {
  console.log('Environment variables:');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('VITE_ENABLE_DEBUG:', import.meta.env.VITE_ENABLE_DEBUG);
});

async function testDirectFetch() {
  try {
    isTesting.value = true;
    results.value.unshift({
      title: 'Direct Fetch - Testing Connection',
      success: true,
      data: { message: 'Starting fetch test...' }
    });

    // Test the direct healthcheck endpoint first
    const healthUrl = 'https://dotnetcrud-production.up.railway.app/api/products';
    try {
      results.value.unshift({
        title: 'Fetch - Health Check',
        success: true,
        data: { message: `Sending GET request to ${healthUrl}` }
      });

      const healthResponse = await fetch(healthUrl);
      results.value.unshift({
        title: 'Fetch - Health Check Response',
        success: healthResponse.ok,
        data: {
          status: healthResponse.status,
          statusText: healthResponse.statusText,
          headers: Object.fromEntries([...healthResponse.headers.entries()]),
          body: await healthResponse.text()
        }
      });
    } catch (error: any) {
      results.value.unshift({
        title: 'Fetch - Health Check Failed',
        success: false,
        data: {
          message: error.message,
          stack: error.stack
        }
      });
    }

    // Now test the auth register endpoint
    const registerUrl = 'https://dotnetcrud-production.up.railway.app/api/Auth/register';
    const testData = {
      username: 'testuser' + Math.floor(Math.random() * 10000),
      email: `test${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User'
    };

    try {
      results.value.unshift({
        title: 'Fetch - Register Attempt',
        success: true,
        data: { 
          message: `Sending POST request to ${registerUrl}`,
          body: { ...testData, password: '[REDACTED]', confirmPassword: '[REDACTED]' }
        }
      });

      const registerResponse = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      let responseData;
      try {
        responseData = await registerResponse.json();
      } catch (e) {
        responseData = await registerResponse.text();
      }

      results.value.unshift({
        title: 'Fetch - Register Response',
        success: registerResponse.ok,
        data: {
          status: registerResponse.status,
          statusText: registerResponse.statusText,
          headers: Object.fromEntries([...registerResponse.headers.entries()]),
          body: responseData
        }
      });
    } catch (error: any) {
      results.value.unshift({
        title: 'Fetch - Register Failed',
        success: false,
        data: {
          message: error.message,
          stack: error.stack
        }
      });
    }
  } finally {
    isTesting.value = false;
  }
}

async function testAxiosRequest() {
  try {
    isTesting.value = true;
    results.value.unshift({
      title: 'Axios - Testing Connection',
      success: true,
      data: { 
        message: 'Starting axios test...',
        baseURL: axios.defaults.baseURL,
        apiUrl: apiUrl.value
      }
    });

    // Create a test axios instance with explicit baseURL
    const testAxios = axios.create({
      baseURL: 'https://dotnetcrud-production.up.railway.app',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Test health endpoint first
    try {
      results.value.unshift({
        title: 'Axios - Health Check',
        success: true,
        data: { message: 'Sending GET request to /api/products' }
      });

      const healthResponse = await testAxios.get('/api/products');
      results.value.unshift({
        title: 'Axios - Health Check Response',
        success: true,
        data: {
          status: healthResponse.status,
          statusText: healthResponse.statusText,
          headers: healthResponse.headers,
          data: healthResponse.data
        }
      });
    } catch (error: any) {
      results.value.unshift({
        title: 'Axios - Health Check Failed',
        success: false,
        data: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        }
      });
    }

    // Test register endpoint
    const testData = {
      username: 'testuser' + Math.floor(Math.random() * 10000),
      email: `test${Math.floor(Math.random() * 10000)}@example.com`,
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#',
      firstName: 'Test',
      lastName: 'User'
    };

    try {
      results.value.unshift({
        title: 'Axios - Register Attempt',
        success: true,
        data: { 
          message: 'Sending POST request to /api/Auth/register',
          url: testAxios.defaults.baseURL + '/api/Auth/register',
          body: { ...testData, password: '[REDACTED]', confirmPassword: '[REDACTED]' }
        }
      });

      const registerResponse = await testAxios.post('/api/Auth/register', testData);
      results.value.unshift({
        title: 'Axios - Register Response',
        success: true,
        data: {
          status: registerResponse.status,
          statusText: registerResponse.statusText,
          headers: registerResponse.headers,
          data: registerResponse.data
        }
      });
    } catch (error: any) {
      results.value.unshift({
        title: 'Axios - Register Failed',
        success: false,
        data: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        }
      });
    }
  } finally {
    isTesting.value = false;
  }
}

function clearResults() {
  results.value = [];
}
</script>

<style scoped>
.api-test-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.results {
  margin-top: 2rem;
}

pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.25rem;
  white-space: pre-wrap;
  word-break: break-word;
}
</style> 